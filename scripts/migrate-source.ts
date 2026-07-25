/**
 * Repeatable, idempotent migration of existing catalog + content from the
 * source website's database (SOURCE_DATABASE_URL) into the new TradeLock
 * Neon database (DATABASE_URL).
 *
 * The source and target share the same canonical Prisma schema, so every
 * record already conforms to the unified item schema — no per-item special
 * casing. Running this multiple times converges to the same state (each table
 * is cleared then repopulated from the source).
 *
 * Usage:
 *   npx tsx scripts/migrate-source.ts            # migrate everything
 *   npx tsx scripts/migrate-source.ts --dry-run  # read + validate only
 *   npx tsx scripts/migrate-source.ts --only Skin,SkinListing
 *
 * Auth/PII tables (User, Session, Order, Address, …) are intentionally NOT
 * migrated.
 */
import "dotenv/config";
import { Pool } from "pg";
import { prisma } from "@/lib/prisma";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const onlyIdx = args.indexOf("--only");
const only =
  onlyIdx >= 0 ? new Set(args[onlyIdx + 1]?.split(",").map((s) => s.trim())) : null;

const SOURCE_URL = process.env.SOURCE_DATABASE_URL;
if (!SOURCE_URL) {
  console.error("Missing SOURCE_DATABASE_URL in environment.");
  process.exit(1);
}

// Prisma delegate name for each table (model → delegate).
type TableSpec = {
  table: string; // quoted DB table name in source
  delegate: string; // prisma client delegate
  selfRefColumn?: string; // for topological insert (e.g. Category.parentId)
  transform?: (row: Record<string, unknown>) => Record<string, unknown>;
};

// Insert order = parents before children (FK-safe).
const TABLES: TableSpec[] = [
  {
    table: "StoreSettings",
    delegate: "storeSettings",
    transform: (r) => ({ ...r, name: "TradeLock" }),
  },
  { table: "Brand", delegate: "brand" },
  { table: "Banner", delegate: "banner" },
  { table: "Page", delegate: "page" },
  { table: "HomepageSection", delegate: "homepageSection" },
  { table: "HomepageTab", delegate: "homepageTab" },
  { table: "UtilityLink", delegate: "utilityLink" },
  { table: "PromoStripItem", delegate: "promoStripItem" },
  { table: "Category", delegate: "category", selfRefColumn: "parentId" },
  { table: "Skin", delegate: "skin" },
  { table: "SkinListing", delegate: "skinListing" },
  { table: "PriceHistory", delegate: "priceHistory" },
];

// Delete order = children before parents (reverse FK order).
const DELETE_ORDER = [
  "PriceHistory",
  "SkinListing",
  "Skin",
  "Category",
  "PromoStripItem",
  "UtilityLink",
  "HomepageTab",
  "HomepageSection",
  "Page",
  "Banner",
  "Brand",
  "StoreSettings",
];

const BATCH = 1000;

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function main() {
  const source = new Pool({ connectionString: SOURCE_URL });
  const report: Record<string, { read: number; inserted: number; failed: number }> = {};
  const errors: { table: string; error: string }[] = [];

  const selected = TABLES.filter((t) => !only || only.has(t.table));

  console.log(
    `\n=== TradeLock migration ${dryRun ? "(DRY RUN)" : ""} ===\n` +
      `source: ${SOURCE_URL!.replace(/:[^:@/]+@/, ":****@")}\n`,
  );

  // 1) Clear target tables (children → parents) so the run is idempotent.
  if (!dryRun) {
    const del = new Set(selected.map((t) => t.table));
    for (const table of DELETE_ORDER) {
      if (!del.has(table)) continue;
      const delegate = TABLES.find((t) => t.table === table)!.delegate;
      const res = await (prisma as any)[delegate].deleteMany({});
      console.log(`cleared ${table}: ${res.count} rows removed`);
    }
    console.log("");
  }

  // 2) Copy each table (parents → children).
  for (const spec of selected) {
    const { table, delegate, selfRefColumn, transform } = spec;
    report[table] = { read: 0, inserted: 0, failed: 0 };
    try {
      const { rows } = await source.query(`SELECT * FROM "${table}"`);
      report[table].read = rows.length;
      const data = rows.map((r) => (transform ? transform(r) : r));

      if (dryRun) {
        console.log(`${table}: read ${rows.length} (dry run, no write)`);
        continue;
      }

      // Topological insert for self-referencing tables (e.g. Category.parentId).
      let ordered = data;
      if (selfRefColumn) {
        ordered = [];
        const remaining = [...data];
        const inserted = new Set<string>();
        let guard = 0;
        while (remaining.length && guard++ < 50) {
          for (let i = remaining.length - 1; i >= 0; i--) {
            const row = remaining[i];
            const parent = row[selfRefColumn];
            if (parent == null || inserted.has(String(parent))) {
              ordered.push(row);
              inserted.add(String(row.id));
              remaining.splice(i, 1);
            }
          }
        }
        // Any cycle leftovers: append (FK may fail, reported per row).
        ordered.push(...remaining);
      }

      for (const batch of chunk(ordered, BATCH)) {
        try {
          const res = await (prisma as any)[delegate].createMany({
            data: batch,
            skipDuplicates: true,
          });
          report[table].inserted += res.count;
        } catch {
          // Fall back to per-row so one bad record doesn't drop the batch.
          for (const row of batch) {
            try {
              await (prisma as any)[delegate].create({ data: row });
              report[table].inserted++;
            } catch (e) {
              report[table].failed++;
              if (errors.length < 50)
                errors.push({
                  table,
                  error: e instanceof Error ? e.message : String(e),
                });
            }
          }
        }
      }
      console.log(
        `${table}: read ${report[table].read}, inserted ${report[table].inserted}, failed ${report[table].failed}`,
      );
    } catch (e) {
      errors.push({ table, error: e instanceof Error ? e.message : String(e) });
      console.error(`${table}: FAILED — ${e instanceof Error ? e.message : e}`);
    }
  }

  await source.end();
  await prisma.$disconnect();

  console.log("\n=== Summary ===");
  console.table(report);
  if (errors.length) {
    console.log(`\n${errors.length} error(s) (first 50):`);
    for (const e of errors) console.log(` - [${e.table}] ${e.error}`);
  }
  console.log("");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
