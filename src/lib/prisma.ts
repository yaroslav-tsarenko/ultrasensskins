import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// pg v9 / pg-connection-string v3 will change `sslmode=require|prefer|verify-ca`
// to mean full CA+hostname verification. Neon's pooler works with libpq
// semantics (encrypt, don't verify CA), which is what `require` has always meant
// here — so opt into libpq compatibility explicitly. This both silences the
// deprecation warning and prevents the future default flip from breaking the
// connection.
function withLibpqCompat(cs: string): string {
  if (!cs || !/[?&]sslmode=/.test(cs) || /[?&]uselibpqcompat=true/.test(cs)) return cs;
  return cs + (cs.includes("?") ? "&" : "?") + "uselibpqcompat=true";
}

const connectionString = withLibpqCompat(
  process.env.DIRECT_URL ||
    "postgres://postgres:postgres@localhost:51214/template1?sslmode=disable",
);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Neon auto-suspends idle compute; the first query after a suspend has to
    // wait for a cold start (a few seconds). pg's 0ms default connect timeout
    // surfaces that wake as "Can't reach database server", so give it room.
    adapter: new PrismaPg({ connectionString, connectionTimeoutMillis: 15000 }),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
