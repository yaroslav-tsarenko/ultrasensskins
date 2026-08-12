import "dotenv/config";
import { syncCatalog } from "@/lib/sih/sync";

async function main() {
  const res = await syncCatalog();
  console.log("[sih-sync-once] done:", res);
  process.exit(0);
}

main().catch((err) => {
  console.error("[sih-sync-once] failed:", err);
  process.exit(1);
});
