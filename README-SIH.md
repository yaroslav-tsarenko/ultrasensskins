# SIH Skin Provider integration

Buy real CS2 skins with real money and deliver them to the buyer's Steam
inventory via [api.sih.market](https://api.sih.market). This document is the
operator's reference: the money flow, the failure/refund handling, the cron
backstops, and how to wire the webhook.

> **Money flow rule:** we NEVER create an order at SIH before payment is
> confirmed. Payment → `paid` → single-flight submit to SIH. Anything else is a
> bug.

---

## 1. Environment

All SIH config is validated in `src/lib/env.ts` (fails loudly on boot).

| Var | Required | Default | Meaning |
| --- | --- | --- | --- |
| `SIH_API_KEY` | ✅ | — | `apikey` header for every SIH call. Never logged. |
| `SIH_API_BASE` | | `https://api.sih.market/api/v1` | API base URL. |
| `SIH_APP_ID` | | `730` | Steam app id (730 = CS2). |
| `SIH_WEBHOOK_SECRET` | ✅ | — | Shared secret embedded in the webhook URL. |
| `SIH_TEST_MODE` | | `false` | Sends `test: true` to create-order (no real spend). |
| `SIH_PRICE_TOLERANCE` | | `0.03` | Re-confirm price if live cost grew > this fraction. |
| `SIH_MARGIN` | | `0.07` | Storefront margin over cost. |
| `SIH_MIN_MARGIN_ABS` | | `0.1` | Absolute floor margin (USD). |
| `SIH_SYNC_INTERVAL_MIN` | | `7` | Catalog sync cadence (matches `vercel.json`). |
| `SIH_LOW_BALANCE_THRESHOLD` | | `100` | Alert when supplier balance falls below this. |
| `CRON_SECRET` | ✅ | — | Bearer token / `?secret=` for cron + webhook auth. |
| `APP_URL` | ✅ | — | Absolute app URL; used to build webhook/return URLs. |
| `ALERT_TELEGRAM_BOT_TOKEN` | | — | Optional. Telegram alerts (else logs to console). |
| `ALERT_TELEGRAM_CHAT_ID` | | — | Optional. Telegram chat for alerts. |

Payment (Transfermit) credentials live under their own keys (`TRANSFERMIT_*`).

---

## 2. The money flow

```
buyer clicks Buy
  → POST /api/sih/checkout                     (src/lib/sih/checkout.ts)
      • validate Steam trade-url + token
      • re-confirm live price via /get-min-item (re-price if grown > tolerance)
      • create SihOrder  → status: awaiting_payment
      • create Transfermit payment
      • return paymentUrl
  → buyer pays
  → POST /api/webhooks/sih-payment             (Transfermit → us)
      • COMPLETED: claim awaiting_payment → paid  (atomic updateMany)
      • then submitOrderToSih(orderId)
          – single-flight claim paid → submitted
          – POST /create-order to SIH (customId = our order id)
          – on SIH error → refund_pending + critical alert
  → SIH delivers
  → POST /api/webhooks/sih?secret=…            (SIH → us)
      • re-fetch authoritative state, applySihOrderObject + finalizeSihOrder
  → status converges: finished (delivered) | failed | rolled_back
```

Key guarantees:

- **Never charge below margin** — price re-confirmed at checkout; `computeSellPrice`
  rounds up (`src/lib/sih/pricing.ts`).
- **Single-flight submit** — `paid → submitted` is an atomic `updateMany` claim, so
  duplicate webhooks never double-submit to SIH.
- **Idempotent** — a duplicate `create-order` (409 "custom id already exists") adopts
  the existing SIH order instead of erroring (`src/lib/sih/client.ts`).
- **Authoritative reads** — the SIH webhook body is never trusted; we re-fetch the
  order from SIH before applying it.

---

## 3. Failure & refund handling

Transfermit's client here has no refund API, so refunds are **operator-driven**.

| Situation | Resulting status | Action |
| --- | --- | --- |
| SIH delivery fails after payment | `refund_pending` | Manual refund, then mark refunded in admin. |
| Protection rollback after delivery | `rolled_back` | Buyer lost the item → refund, then mark refunded. |
| Payment declined/cancelled | `failed` | Nothing owed (buyer never paid). |

`src/lib/sih/finalize.ts` parks failed/rolled-back orders and fires a **critical**
alert. Operators clear the backlog from **/admin/sih** ("Mark refunded"), which
moves `refund_pending`/`rolled_back` → `refunded` and records who did it in the
audit trail (`sih_order_events`).

---

## 4. Cron backstops (`vercel.json`)

| Path | Schedule | Purpose |
| --- | --- | --- |
| `/api/cron/sih-sync` | `*/7 * * * *` | Refresh catalog + prices. |
| `/api/cron/sih-poll` | `* * * * *` | Reconcile in-flight orders; resubmit stuck `paid` orders. |
| `/api/cron/sih-monitor` | `0 * * * *` | Supplier balance + stuck-order alerts. |
| `/api/cron/sih-reconcile` | `0 3 * * *` | Daily deep re-check of recent orders + wallet audit. |

The poll is the safety net for missed webhooks: even with the webhook down, orders
still converge to their true state within a minute. All cron routes require
`Authorization: Bearer $CRON_SECRET` (or `?secret=$CRON_SECRET` for manual runs).

---

## 5. Webhook setup

Register the SIH order-status webhook (URL embeds the secret so our handler can
authorize inbound pings):

```bash
npm run sih:webhook            # set to $APP_URL/api/webhooks/sih?secret=…
npm run sih:webhook -- <url>   # set an explicit URL
npm run sih:webhook -- clear   # remove it
```

The printed URL can also be pasted into the SIH admin panel. The Transfermit
payment webhook (`/api/webhooks/sih-payment`) is configured per-payment at
checkout time — no manual step.

---

## 6. Pages

- **/store** — the SIH catalog (live stock, USD prices).
- **/store/[name]** — item detail + Buy.
- **/my-purchases** — buyer's orders; polls while in flight, links the Steam trade
  offer when `sent`, explains refunds on failure.
- **/admin/sih** — operator dashboard: supplier balance, status counts, refund
  backlog with one-click "Mark refunded", recent orders.

---

## 7. Scripts

```bash
npm run sih:sync       # one-off catalog sync
npm run sih:smoke      # read-only live API check (auth + items + price); no spend
npm run sih:webhook    # register/clear the SIH webhook
npm test               # unit tests (trade-url parser, pricing, status map, 409 handling)
```

`npm run sih:smoke` is the fastest way to confirm credentials and connectivity
after a config change — it never creates an order.
