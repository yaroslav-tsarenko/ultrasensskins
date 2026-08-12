import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logSihEvent } from "@/lib/sih/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"];

const bodySchema = z.object({ orderId: z.string().min(1) });

// Operator confirms a manual refund was issued (Transfermit has no refund API here).
// Moves refund_pending / rolled_back → refunded and records who did it. Idempotent:
// the atomic claim makes a double-click a no-op.
export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user || !ADMIN_ROLES.includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const claim = await prisma.sihOrder.updateMany({
    where: { id: parsed.data.orderId, status: { in: ["refund_pending", "rolled_back"] } },
    data: { status: "refunded" },
  });

  if (claim.count === 0) {
    const order = await prisma.sihOrder.findUnique({
      where: { id: parsed.data.orderId },
      select: { status: true },
    });
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    // Already refunded or not in a refundable state.
    return NextResponse.json({ ok: true, status: order.status, changed: false });
  }

  await logSihEvent({
    orderId: parsed.data.orderId,
    source: "system",
    toStatus: "refunded",
    payload: { reason: "manual_refund", by: user.email },
  });

  return NextResponse.json({ ok: true, status: "refunded", changed: true });
}
