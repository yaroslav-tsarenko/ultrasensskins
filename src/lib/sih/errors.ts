// Typed SIH errors + a raw-string → normalized-code mapper, plus user-facing
// (English) copy. SIH returns human strings in `error`; we normalize them into
// a stable code so callers can branch reliably, and so we never leak internals
// (or the API key) to the buyer.

export type SihErrorCode =
  | "invalid_tradelink"
  | "private_inventory"
  | "steam_guard_disabled"
  | "steam_guard_hold"
  | "steam_trade_ban"
  | "insufficient_balance"
  | "duplicate_custom_id"
  | "price_changed"
  | "item_unavailable"
  | "network"
  | "timeout"
  | "bad_response"
  | "unknown";

export class SihError extends Error {
  readonly code: SihErrorCode;
  readonly raw?: string;
  readonly httpStatus?: number;

  constructor(
    code: SihErrorCode,
    opts: { raw?: string; httpStatus?: number; message?: string } = {},
  ) {
    super(opts.message ?? opts.raw ?? code);
    this.name = "SihError";
    this.code = code;
    this.raw = opts.raw;
    this.httpStatus = opts.httpStatus;
  }
}

// Normalize a raw SIH error string into a stable code.
export function mapSihError(raw: string | null | undefined, httpStatus?: number): SihError {
  const text = (raw ?? "").toLowerCase().trim();

  const matches = (...needles: string[]) => needles.some((n) => text.includes(n));

  let code: SihErrorCode = "unknown";
  if (matches("custom id already exists")) code = "duplicate_custom_id";
  else if (matches("invalid tradelink", "invalid trade link", "tradelink")) code = "invalid_tradelink";
  else if (matches("private inventory")) code = "private_inventory";
  else if (matches("steam guard is not enabled", "guard is not enabled")) code = "steam_guard_disabled";
  else if (matches("steam guard is in hold", "guard is in hold", "in hold")) code = "steam_guard_hold";
  else if (matches("steam trade ban", "trade ban")) code = "steam_trade_ban";
  else if (matches("insufficient", "not enough balance", "low balance")) code = "insufficient_balance";
  else if (matches("price", "changed")) code = "price_changed";
  else if (matches("not found", "unavailable", "out of stock", "no items")) code = "item_unavailable";

  return new SihError(code, { raw: raw ?? undefined, httpStatus });
}

// English copy shown to the buyer. For internal/low-balance failures we return a
// neutral "temporarily unavailable" so we never expose supplier state; ops get a
// Telegram alert instead.
export function userMessageForSih(code: SihErrorCode): string {
  switch (code) {
    case "invalid_tradelink":
      return "Your Steam trade link looks invalid. Open your Steam inventory → Trade Offers → “Who can send me Trade Offers?” and copy a fresh trade URL.";
    case "private_inventory":
      return "Your Steam inventory is private. Set it to Public in your Steam privacy settings, then try again.";
    case "steam_guard_disabled":
      return "Steam Guard Mobile Authenticator isn’t enabled on your account. Enable it in the Steam mobile app and try again.";
    case "steam_guard_hold":
      return "Your account is in Steam Guard hold (trades are temporarily blocked). This clears automatically — please try again later.";
    case "steam_trade_ban":
      return "Your Steam account has a trade ban, so items can’t be delivered.";
    case "price_changed":
      return "The market price just changed. Please review the new price and confirm again.";
    case "insufficient_balance":
    case "item_unavailable":
    case "unknown":
    case "network":
    case "timeout":
    case "bad_response":
    case "duplicate_custom_id":
    default:
      return "This item is temporarily unavailable. If you were charged, you’ll be refunded automatically.";
  }
}
