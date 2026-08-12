import { env } from "@/lib/env";

// Vercel Cron calls our routes with `Authorization: Bearer <CRON_SECRET>`.
// We accept that, or an explicit `?secret=` fallback for manual/admin triggers.
export function isAuthorizedCron(req: Request): boolean {
  const secret = env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (auth && auth === `Bearer ${secret}`) return true;

  const url = new URL(req.url);
  if (url.searchParams.get("secret") === secret) return true;

  return false;
}
