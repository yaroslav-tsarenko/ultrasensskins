// Single-locale (English) site — no i18n routing, no locale URL prefix.
// Re-exported here so existing `@/i18n/routing` imports keep working with
// standard Next.js navigation.
export { default as Link } from "next/link";
export { useRouter, usePathname, redirect } from "next/navigation";
