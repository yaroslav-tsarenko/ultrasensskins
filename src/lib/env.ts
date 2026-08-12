import { z } from "zod";

// Centralized, validated server environment. Import `env` from here instead of
// reading process.env directly so that a misconfiguration fails loudly at the
// boundary rather than silently deep inside the money flow.
//
// This module is server-only. It must never be imported from a client
// component — it reads secrets (SIH_API_KEY, CRON_SECRET, …).

const bool = (def: boolean) =>
  z
    .string()
    .optional()
    .transform((v) => (v == null || v === "" ? def : v === "true" || v === "1"));

const num = (def: number) =>
  z
    .string()
    .optional()
    .transform((v) => (v == null || v === "" ? def : Number(v)))
    .pipe(z.number().finite());

const schema = z.object({
  // ── SIH ──────────────────────────────────────────
  SIH_API_KEY: z.string().min(1, "SIH_API_KEY is required"),
  SIH_API_BASE: z.string().url().default("https://api.sih.market/api/v1"),
  SIH_APP_ID: num(730),
  SIH_WEBHOOK_SECRET: z.string().min(1, "SIH_WEBHOOK_SECRET is required"),
  SIH_TEST_MODE: bool(false),
  SIH_PRICE_TOLERANCE: num(0.03),
  SIH_MARGIN: num(0.07),
  SIH_MIN_MARGIN_ABS: num(0.1),
  SIH_SYNC_INTERVAL_MIN: num(7),
  SIH_LOW_BALANCE_THRESHOLD: num(100),

  // ── Cron / app ───────────────────────────────────
  CRON_SECRET: z.string().min(1, "CRON_SECRET is required"),
  APP_URL: z.string().url(),

  // ── Telegram alerts (optional) ───────────────────
  ALERT_TELEGRAM_BOT_TOKEN: z.string().optional(),
  ALERT_TELEGRAM_CHAT_ID: z.string().optional(),
});

type Env = z.infer<typeof schema>;

let cached: Env | null = null;

// Lazily parse so that importing a module that transitively touches env does not
// crash unrelated build steps; the first real access validates.
export function getEnv(): Env {
  if (cached) return cached;
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid environment configuration:\n${issues}`);
  }
  cached = parsed.data;
  return cached;
}

// Convenience proxy so callers can write `env.SIH_API_KEY` while still
// validating on first access.
export const env: Env = new Proxy({} as Env, {
  get(_t, prop: string) {
    return getEnv()[prop as keyof Env];
  },
});
