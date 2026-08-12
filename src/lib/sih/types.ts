import { z } from "zod";

// Zod schemas for api.sih.market responses. External API — kept permissive
// (.passthrough(), optional fields) so an extra/renamed field never crashes the
// money flow. We only hard-require the fields we actually depend on.

// Coerce numeric strings ("12.34") and numbers alike into a finite number.
const money = z.coerce.number().finite();

export const sihProjectSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  name: z.string().optional(),
  balance: money,
  webhook: z.string().nullish(),
});
export type SihProject = z.infer<typeof sihProjectSchema>;

// GET /project responds as { success, project: {...} }.
export const sihProjectEnvelopeSchema = z.object({
  success: z.boolean(),
  project: sihProjectSchema,
});

// One catalog entry (value in the /get-items map). Key = market_hash_name.
export const sihCatalogItemSchema = z
  .object({
    price: money,
    count: z.coerce.number().int().nonnegative().default(0),
    phase: z.string().nullish(),
    market: z.string().nullish(),
    sell: money.nullish(),
    steam: money.nullish(),
    image: z.string().nullish(),
    color: z.string().nullish(),
  })
  .passthrough();
export type SihCatalogItem = z.infer<typeof sihCatalogItemSchema>;

export const sihGetItemsSchema = z.object({
  success: z.boolean(),
  items: z.record(z.string(), sihCatalogItemSchema).default({}),
});
export type SihGetItems = z.infer<typeof sihGetItemsSchema>;

// GET /get-min-item responds like get-items: { success, items: { name: {price,count} } }.
export const sihMinItemSchema = z
  .object({
    success: z.boolean(),
    items: z.record(z.string(), sihCatalogItemSchema).default({}),
    error: z.string().nullish(),
  })
  .passthrough();

// Flattened result our checkout code consumes.
export interface SihMinItem {
  found: boolean;
  price: number | null;
  count: number;
}

// Nested objects on an order.
export const sihSenderSchema = z
  .object({
    offerId: z.union([z.string(), z.number()]).nullish(),
    timeout: z.union([z.string(), z.number()]).nullish(),
    nickname: z.string().nullish(),
    avatar: z.string().nullish(),
  })
  .passthrough();

export const sihProtectionSchema = z
  .object({
    status: z.string().nullish(),
    error: z.string().nullish(),
    rollbackAt: z.union([z.string(), z.number()]).nullish(),
    rollbackAmount: money.nullish(),
  })
  .passthrough();

// SIH order object. Statuses: created | processing | sent | finished | failed | penalized.
export const sihOrderObjectSchema = z
  .object({
    id: z.union([z.string(), z.number()]).nullish(),
    customId: z.union([z.string(), z.number()]).nullish(),
    status: z.string().nullish(),
    amount: money.nullish(),
    item: z.string().nullish(),
    balance: money.nullish(),
    error: z.string().nullish(),
    sender: sihSenderSchema.nullish(),
    protection: sihProtectionSchema.nullish(),
  })
  .passthrough();
export type SihOrderObject = z.infer<typeof sihOrderObjectSchema>;

// create-order 200 success.
export const sihCreateOrderOkSchema = z
  .object({
    success: z.literal(true),
    id: z.union([z.string(), z.number()]),
    balance: money.nullish(),
    order: sihOrderObjectSchema.nullish(),
  })
  .passthrough();

// Any create-order response (ok | error | 409-with-order).
export const sihCreateOrderResponseSchema = z
  .object({
    success: z.boolean(),
    id: z.union([z.string(), z.number()]).nullish(),
    balance: money.nullish(),
    error: z.string().nullish(),
    order: sihOrderObjectSchema.nullish(),
  })
  .passthrough();
export type SihCreateOrderResponse = z.infer<typeof sihCreateOrderResponseSchema>;

export const sihGetOrderSchema = z
  .object({
    success: z.boolean(),
    order: sihOrderObjectSchema.nullish(),
    error: z.string().nullish(),
  })
  .passthrough();

export const sihGetOrdersSchema = z
  .object({
    success: z.boolean(),
    orders: z.array(sihOrderObjectSchema).default([]),
    error: z.string().nullish(),
  })
  .passthrough();

export const sihWalletHistorySchema = z
  .object({
    success: z.boolean(),
    history: z.array(z.record(z.string(), z.unknown())).default([]),
    error: z.string().nullish(),
  })
  .passthrough();
export type SihWalletHistory = z.infer<typeof sihWalletHistorySchema>;

export interface SihCreateOrderInput {
  steamId: string;
  token: string;
  amount: number;
  item: string;
  customId: string;
  test?: boolean;
  appId?: number;
}
