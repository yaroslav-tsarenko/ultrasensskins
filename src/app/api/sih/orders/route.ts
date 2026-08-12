import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sihImageUrl } from "@/lib/sih/image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The session user's own SIH purchases. Powers the My Purchases page, which polls
// this while an order is in flight. Returns only presentation-safe fields — never
// the trade token or internal cost/margin.
export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.sihOrder.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      marketHashName: true,
      shownPrice: true,
      currency: true,
      status: true,
      sihError: true,
      senderNickname: true,
      senderOfferId: true,
      senderTimeout: true,
      createdAt: true,
      paidAt: true,
      finishedAt: true,
      item: { select: { imageHash: true, exterior: true, rarityColor: true } },
    },
  });

  const data = orders.map((o) => ({
    id: o.id,
    marketHashName: o.marketHashName,
    price: Number(o.shownPrice),
    currency: o.currency,
    status: o.status,
    error: o.sihError,
    senderNickname: o.senderNickname,
    senderOfferId: o.senderOfferId,
    senderTimeout: o.senderTimeout ? o.senderTimeout.toISOString() : null,
    exterior: o.item?.exterior ?? null,
    rarityColor: o.item?.rarityColor ?? null,
    imageUrl: sihImageUrl(o.item?.imageHash),
    createdAt: o.createdAt.toISOString(),
    paidAt: o.paidAt ? o.paidAt.toISOString() : null,
    finishedAt: o.finishedAt ? o.finishedAt.toISOString() : null,
  }));

  return NextResponse.json({ data });
}
