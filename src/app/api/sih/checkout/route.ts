import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { createSihCheckout, CheckoutError } from "@/lib/sih/checkout";

export const runtime = "nodejs";

const bodySchema = z.object({
  marketHashName: z.string().min(1).max(256),
});

// Very small in-memory throttle: one checkout every few seconds per user, to
// stop double-clicks / rapid retries from spawning duplicate pending orders.
const RATE_MS = 4_000;
const lastAttempt = new Map<string, number>();

function baseUrlFrom(req: Request): string {
  const configured = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (configured) return configured.replace(/\/$/, "");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
  const proto = req.headers.get("x-forwarded-proto") || "http";
  return `${proto}://${host}`;
}

function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in to continue." }, { status: 401 });
  }

  const now = Date.now();
  const prev = lastAttempt.get(user.id) ?? 0;
  if (now - prev < RATE_MS) {
    return NextResponse.json(
      { error: "You're going too fast — please wait a moment and try again." },
      { status: 429 },
    );
  }
  lastAttempt.set(user.id, now);

  let marketHashName: string;
  try {
    const json = await req.json();
    ({ marketHashName } = bodySchema.parse(json));
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const result = await createSihCheckout({
      userId: user.id,
      marketHashName,
      ip: clientIp(req),
      baseUrl: baseUrlFrom(req),
    });
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    if (err instanceof CheckoutError) {
      const status =
        err.code === "unauthenticated" ? 401 :
        err.code === "no_steam" || err.code === "no_trade_url" ? 409 :
        err.code === "item_unavailable" || err.code === "price_unavailable" ? 409 :
        502;
      return NextResponse.json({ error: err.message, code: err.code }, { status });
    }
    console.error(`[sih-checkout] unexpected error: ${String(err)}`);
    return NextResponse.json({ error: "Checkout failed. Please try again." }, { status: 500 });
  }
}
