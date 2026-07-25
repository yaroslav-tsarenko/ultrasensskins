/**
 * UltraSensSkin mark — a faceted hexagonal gem cut from titanium and platinum,
 * with an ice-blue spark at its heart. It reads as "rare cut stone" — the
 * showroom of the rarest CS2 skins — and stays legible at 16px. Original
 * artwork — no game assets.
 */

export function UltraSensMark({
  size = 28,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="us-metal" x1="5" y1="3" x2="27" y2="29" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#E6E9EF" />
          <stop offset="0.5" stopColor="var(--color-accent)" />
          <stop offset="1" stopColor="#8A909C" />
        </linearGradient>
        <linearGradient id="us-core" x1="10" y1="8" x2="22" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--color-primary)" />
          <stop offset="1" stopColor="#0FA6C8" />
        </linearGradient>
      </defs>
      {/* Outer faceted hexagon */}
      <path
        d="M16 2.6 27 9v14L16 29.4 5 23V9L16 2.6Z"
        fill="url(#us-metal)"
        opacity="0.18"
      />
      <path
        d="M16 2.6 27 9v14L16 29.4 5 23V9L16 2.6Z"
        stroke="url(#us-metal)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* Inner cut gem */}
      <path
        d="M16 8.4 22 12v8L16 23.6 10 20v-8L16 8.4Z"
        fill="url(#us-core)"
      />
      {/* Facet highlight */}
      <path
        d="M16 8.4 22 12 16 16 10 12 16 8.4Z"
        fill="#FFFFFF"
        opacity="0.22"
      />
      <path
        d="M16 16 22 12v8L16 23.6V16Z"
        fill="#05131A"
        opacity="0.18"
      />
    </svg>
  );
}

export function UltraSensLogo({
  size = 22,
  tone = "dark",
  showWordmark = true,
}: {
  size?: number;
  tone?: "dark" | "light";
  showWordmark?: boolean;
}) {
  const textColor = tone === "light" ? "#ECEEF2" : "var(--color-text)";
  const markSize = Math.max(22, Math.round(size * 1.4));
  return (
    <span className="inline-flex items-center gap-2 leading-none">
      <UltraSensMark size={markSize} />
      {showWordmark && (
        <span
          className="font-display font-bold tracking-tight"
          style={{ fontSize: size, letterSpacing: "-0.02em", color: textColor }}
        >
          UltraSens<span style={{ color: "var(--color-primary)" }}>Skin</span>
        </span>
      )}
    </span>
  );
}

// Back-compat aliases — existing imports keep working after the rebrand.
export const TradeLockLogo = UltraSensLogo;
export const TradeLockMark = UltraSensMark;
export const DropskinLogo = UltraSensLogo;
export const DropskinMark = UltraSensMark;
export const NivroLogo = UltraSensLogo;
export const NivroMark = UltraSensMark;
