"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, RefreshCw, Wallet } from "lucide-react";
import { formatPrice } from "@/lib/utils/format-price";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner/LoadingSpinner";
import { Chip } from "@/components/ui/Chip";
import { statusMeta } from "@/lib/sih/status-labels";

interface RefundItem {
  id: string;
  marketHashName: string;
  price: number;
  currency: string;
  status: string;
  error: string | null;
  email: string | null;
  createdAt: string;
}

interface RecentItem {
  id: string;
  marketHashName: string;
  price: number;
  currency: string;
  status: string;
  email: string | null;
  imageUrl: string | null;
  createdAt: string;
}

interface AdminSihData {
  balance: number | null;
  balanceError: string | null;
  lowBalanceThreshold: number;
  counts: Record<string, number>;
  refundBacklog: RefundItem[];
  recent: RecentItem[];
}

const STATUS_ORDER = [
  "awaiting_payment",
  "paid",
  "submitted",
  "processing",
  "sent",
  "finished",
  "failed",
  "refund_pending",
  "rolled_back",
  "refunded",
];

export default function AdminSihPage() {
  const [data, setData] = useState<AdminSihData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refunding, setRefunding] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/sih", { cache: "no-store" });
      if (!res.ok) {
        toast.error(res.status === 403 ? "Admin access required" : "Failed to load");
        setData(null);
        return;
      }
      setData(await res.json());
    } catch {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const run = async () => {
      await load();
    };
    run();
  }, [load]);

  const refresh = useCallback(async () => {
    setLoading(true);
    await load();
  }, [load]);

  const markRefunded = async (orderId: string) => {
    setRefunding(orderId);
    try {
      const res = await fetch("/api/admin/sih/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const body = await res.json();
      if (!res.ok) {
        toast.error(body.error || "Refund failed");
        return;
      }
      toast.success(body.changed ? "Marked as refunded" : "Already resolved");
      await load();
    } catch {
      toast.error("Refund failed");
    } finally {
      setRefunding(null);
    }
  };

  if (loading && !data) return <LoadingSpinner />;
  if (!data) return null;

  const lowBalance = data.balance != null && data.balance < data.lowBalanceThreshold;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[color:var(--color-text)]">SIH orders</h1>
        <button
          onClick={refresh}
          className="inline-flex items-center gap-2 rounded-md border border-[color:var(--color-line)] px-3 py-1.5 text-sm text-[color:var(--color-text)] hover:bg-[color:var(--color-bg-elevated)]"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Balance + status counts */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          className={`rounded-lg border p-4 ${
            lowBalance
              ? "border-[color:var(--color-danger,#dc2626)] bg-[color:var(--color-danger,#dc2626)]/5"
              : "border-[color:var(--color-line)] bg-[color:var(--color-bg-elevated)]"
          }`}
        >
          <div className="flex items-center gap-2 text-xs text-[color:var(--color-text-tertiary)]">
            <Wallet size={14} /> Supplier balance
          </div>
          <div className="mt-2 text-2xl font-bold text-[color:var(--color-text)]">
            {data.balance != null ? formatPrice(data.balance, "USD") : "—"}
          </div>
          {data.balanceError ? (
            <div className="mt-1 text-xs text-[color:var(--color-danger,#dc2626)]">
              {data.balanceError}
            </div>
          ) : lowBalance ? (
            <div className="mt-1 flex items-center gap-1 text-xs text-[color:var(--color-danger,#dc2626)]">
              <AlertTriangle size={12} /> Below {formatPrice(data.lowBalanceThreshold, "USD")}
            </div>
          ) : null}
        </div>

        <div className="rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-bg-elevated)] p-4 sm:col-span-2 lg:col-span-3">
          <div className="text-xs text-[color:var(--color-text-tertiary)]">Orders by status</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {STATUS_ORDER.filter((s) => data.counts[s]).map((s) => (
              <Chip key={s} size="sm" color={statusMeta(s).color}>
                {statusMeta(s).label}: {data.counts[s]}
              </Chip>
            ))}
            {STATUS_ORDER.every((s) => !data.counts[s]) ? (
              <span className="text-sm text-[color:var(--color-text-tertiary)]">No orders yet</span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Refund backlog */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-[color:var(--color-text)]">
          Refund backlog{" "}
          {data.refundBacklog.length > 0 ? (
            <span className="text-[color:var(--color-danger,#dc2626)]">
              ({data.refundBacklog.length})
            </span>
          ) : null}
        </h2>
        {data.refundBacklog.length === 0 ? (
          <p className="text-sm text-[color:var(--color-text-tertiary)]">
            Nothing to refund. Every buyer has their item or their money.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {data.refundBacklog.map((o) => (
              <div
                key={o.id}
                className="flex flex-col gap-2 rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-bg-elevated)] px-4 py-3 sm:flex-row sm:items-center sm:gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-[color:var(--color-text)]">
                    {o.marketHashName}
                  </div>
                  <div className="mt-0.5 text-xs text-[color:var(--color-text-tertiary)]">
                    {o.email ?? "unknown"} • {formatPrice(o.price, "USD")}
                    {o.error ? ` • ${o.error}` : ""}
                  </div>
                </div>
                <Chip size="sm" color={statusMeta(o.status).color}>
                  {statusMeta(o.status).label}
                </Chip>
                <button
                  onClick={() => markRefunded(o.id)}
                  disabled={refunding === o.id}
                  className="rounded-md bg-[color:var(--color-primary)] px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
                >
                  {refunding === o.id ? "Saving…" : "Mark refunded"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent orders */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-[color:var(--color-text)]">Recent orders</h2>
        <div className="overflow-hidden rounded-lg border border-[color:var(--color-line)]">
          <table className="w-full text-sm">
            <thead className="bg-[color:var(--color-bg-elevated)] text-left text-xs text-[color:var(--color-text-tertiary)]">
              <tr>
                <th className="px-4 py-2 font-medium">Item</th>
                <th className="px-4 py-2 font-medium">Buyer</th>
                <th className="px-4 py-2 font-medium">Price</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recent.map((o) => (
                <tr key={o.id} className="border-t border-[color:var(--color-line)]">
                  <td className="max-w-[260px] truncate px-4 py-2 text-[color:var(--color-text)]">
                    {o.marketHashName}
                  </td>
                  <td className="px-4 py-2 text-[color:var(--color-text-secondary)]">
                    {o.email ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-[color:var(--color-text)]">
                    {formatPrice(o.price, "USD")}
                  </td>
                  <td className="px-4 py-2">
                    <Chip size="sm" color={statusMeta(o.status).color}>
                      {statusMeta(o.status).label}
                    </Chip>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-xs text-[color:var(--color-text-tertiary)]">
                    {new Date(o.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
