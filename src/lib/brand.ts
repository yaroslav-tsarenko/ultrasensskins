/**
 * Central brand identity for UltraSensSkin.
 * Import from here instead of hardcoding company details in components.
 *
 * Company / contact details are env-driven (NEXT_PUBLIC_* so they resolve in
 * both server and client components) with the registered ULTRASENS LT MB
 * particulars as fallbacks. Set the vars in `.env` to override per-deploy.
 */

const env = (key: string, fallback: string) =>
  (process.env[key] ?? "").trim() || fallback;

const company = {
  legalName: env("NEXT_PUBLIC_COMPANY_LEGAL_NAME", "ULTRASENS LT MB"),
  number: env("NEXT_PUBLIC_COMPANY_NUMBER", "308011165"),
  address: {
    line1: env("NEXT_PUBLIC_COMPANY_ADDRESS", "V. Nagevičiaus g. 3"),
    line2: env("NEXT_PUBLIC_COMPANY_ADDRESS_LINE2", ""),
    city: env("NEXT_PUBLIC_COMPANY_CITY", "Vilnius"),
    region: env("NEXT_PUBLIC_COMPANY_REGION", ""),
    postcode: env("NEXT_PUBLIC_COMPANY_POSTCODE", "LT-08237"),
    country: env("NEXT_PUBLIC_COMPANY_COUNTRY", "Lithuania"),
  },
} as const;

const contactEmail = env("NEXT_PUBLIC_CONTACT_EMAIL", "info@ultrasensskin.com");

export const brand = {
  name: "ultrasensskin",
  displayName: "UltraSensSkin",
  domain: "www.ultrasensskin.com",
  url: "https://www.ultrasensskin.com",
  tagline: "Own the rarest CS2 skins.",
  description:
    "UltraSensSkin — a premium marketplace for rare CS2 skins. Browse a curated showroom of knives, gloves and covert-grade finishes with verified float, pattern and price data, compare against Steam, track price history, and trade instantly and securely via your Steam account.",
  applicationName: "UltraSensSkin",

  company,

  contact: {
    email: contactEmail,
    emailB2B: contactEmail,
    phone: env("NEXT_PUBLIC_CONTACT_PHONE", ""),
    phoneHref: `tel:${env("NEXT_PUBLIC_CONTACT_PHONE", "").replace(/\s+/g, "")}`,
    contactPage: "/contact",
  },

  social: {
    linkedin: "https://www.linkedin.com/company/ultrasensskin/",
    instagram: "https://www.instagram.com/ultrasensskin/",
    twitter: "@ultrasensskin",
  },
} as const;

export const brandAddressLine = [
  brand.company.address.line1,
  brand.company.address.line2,
  brand.company.address.city,
  brand.company.address.region,
  brand.company.address.postcode,
  brand.company.address.country,
]
  .filter(Boolean)
  .join(", ");

export const brandLegalLine = [
  brand.company.legalName,
  `Company No. ${brand.company.number}`,
  brandAddressLine,
]
  .filter(Boolean)
  .join(" · ");
