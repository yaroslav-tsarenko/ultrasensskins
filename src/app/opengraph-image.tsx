import { ImageResponse } from "next/og";
import { brand } from "@/lib/brand";

export const alt = `${brand.displayName} — ${brand.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "linear-gradient(135deg, #0a0e14 0%, #121722 55%, #1a2130 100%)",
          color: "#f4f6fb",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 700,
            height: 700,
            background: "radial-gradient(circle at 100% 0%, rgba(255,138,0,0.28) 0%, transparent 60%)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#ff8a00",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 800,
              color: "#0a0e14",
            }}
          >
            U
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>
            {brand.displayName}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: -2,
              maxWidth: 940,
            }}
          >
            Own the rarest CS2 skins.
          </div>
          <div style={{ fontSize: 30, color: "#aab3c5", maxWidth: 900, lineHeight: 1.3 }}>
            Verified float, pattern &amp; price data. Compare against Steam, track
            history, trade instantly via your Steam account.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 26,
            color: "#ff8a00",
            fontWeight: 600,
          }}
        >
          {brand.domain}
        </div>
      </div>
    ),
    { ...size }
  );
}
