import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sihImageUrl } from "@/lib/sih/image";
import { sihClient } from "@/lib/sih/client";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"];

// Admin dashboard data for the SIH money flow: supplier balance, order counts by
// status, the refund backlog (money owed to buyers) and the most recent orders.
export async function GET() {
  const user = await getSessionUser();
  if (!user || !ADMIN_ROLES.includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [grouped, refundPending, recent] = await Promise.all([
    prisma.sihOrder.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.sihOrder.findMany({
      where: { status: { in: ["refund_pending", "rolled_back"] } },
      orderBy: { updatedAt: "asc" },
      take: 100,
      select: {
        id: true,
        marketHashName: true,
        shownPrice: true,
        currency: true,
        status: true,
        sihError: true,
        user: { select: { email: true } },
        createdAt: true,
      },
    }),
    prisma.sihOrder.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        marketHashName: true,
        shownPrice: true,
        currency: true,
        status: true,
        user: { select: { email: true } },
        createdAt: true,
        item: { select: { imageHash: true } },
      },
    }),
  ]);

  const counts: Record<string, number> = {};
  for (const g of grouped) counts[g.status] = g._count._all;

  let balance: number | null = null;
  let balanceError: string | null = null;
  try {
    const project = await sihClient.getProject();
    balance = project.balance;
  } catch (err) {
    balanceError = err instanceof Error ? err.message : "balance unavailable";
  }

  return NextResponse.json({
    balance,
    balanceError,
    lowBalanceThreshold: env.SIH_LOW_BALANCE_THRESHOLD,
    counts,
    refundBacklog: refundPending.map((o) => ({
      id: o.id,
      marketHashName: o.marketHashName,
      price: Number(o.shownPrice),
      currency: o.currency,
      status: o.status,
      error: o.sihError,
      email: o.user?.email ?? null,
      createdAt: o.createdAt.toISOString(),
    })),
    recent: recent.map((o) => ({
      id: o.id,
      marketHashName: o.marketHashName,
      price: Number(o.shownPrice),
      currency: o.currency,
      status: o.status,
      email: o.user?.email ?? null,
      imageUrl: sihImageUrl(o.item?.imageHash),
      createdAt: o.createdAt.toISOString(),
    })),
  });
}
