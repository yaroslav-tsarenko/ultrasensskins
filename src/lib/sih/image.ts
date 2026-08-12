// SIH returns an opaque `image` hash; the full CDN URL is built as documented.
const CDN = "https://community.cloudflare.steamstatic.com/economy/image";

export function sihImageUrl(hash: string | null | undefined, size = "360fx360f"): string | null {
  if (!hash) return null;
  // Already a full URL? pass through.
  if (/^https?:\/\//i.test(hash)) return hash;
  return `${CDN}/${hash}/${size}`;
}
