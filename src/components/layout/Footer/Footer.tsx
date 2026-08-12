"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { openCookieSettings } from "@/components/shared/CookieConsent/CookieConsent";
import { FaDiscord, FaXTwitter, FaInstagram } from "react-icons/fa6";
import {
  ArrowRight,
  Mail,
  ShieldCheck,
  Zap,
  Repeat,
  Globe,
  LayoutGrid,
  Tag,
  HelpCircle,
  MessageSquare,
  ChevronDown,
  Info,
  Route,
  Gem,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { UltraSensLogo } from "../DropskinLogo";
import { brand, brandAddressLine } from "@/lib/brand";
import { useCurrency } from "@/providers/CurrencyProvider";
import visaLogo from "@/assets/visa-logo.svg";
import mastercardLogo from "@/assets/mastercard-logo.svg";
import pciDssLogo from "@/assets/pci-dss-compliant-logo-vector.svg";

const paymentBadges = [
  { src: visaLogo, label: "Visa", pad: "px-3 py-2.5" },
  { src: mastercardLogo, label: "Mastercard", pad: "px-3 py-2.5" },
  { src: pciDssLogo, label: "PCI DSS Compliant", pad: "px-2 py-1.5" },
];

interface Group {
  key: string;
  title: string;
  items: Array<{ href: string; label: string; Icon?: React.ElementType }>;
}

const groups: Group[] = [
  {
    key: "store",
    title: "Store",
    items: [
      { href: "/store", label: "Browse skins", Icon: LayoutGrid },
      { href: "/store?sort=newest", label: "New arrivals", Icon: TrendingUp },
      { href: "/store?sort=price_asc", label: "Best value", Icon: Gem },
      { href: "/my-purchases", label: "My purchases", Icon: Tag },
    ],
  },
  {
    key: "collections",
    title: "By rarity",
    items: [
      { href: "/store?rarity=Covert", label: "Covert", Icon: Sparkles },
      { href: "/store?rarity=Classified", label: "Classified", Icon: Gem },
      { href: "/store?rarity=Extraordinary", label: "Extraordinary", Icon: Sparkles },
      { href: "/store?rarity=Contraband", label: "Contraband", Icon: Gem },
    ],
  },
  {
    key: "company",
    title: "Company",
    items: [
      { href: "/about", label: "About us", Icon: Info },
      { href: "/how-it-works", label: "How it works", Icon: Route },
      { href: "/faq", label: "FAQ", Icon: HelpCircle },
      { href: "/contact", label: "Contact us", Icon: MessageSquare },
    ],
  },
];

const trustBadges = [
  { icon: Zap, label: "Instant Steam delivery" },
  { icon: ShieldCheck, label: "Buyer protection" },
  { icon: Repeat, label: "Secure card checkout" },
];

const socialLinks = [
  { icon: FaDiscord, label: "Discord", href: "/coming-soon", external: false },
  { icon: FaXTwitter, label: "X (Twitter)", href: "/coming-soon", external: false },
  { icon: FaInstagram, label: "Instagram", href: brand.social.instagram, external: true },
];

function LinkGroup({ group }: { group: Group }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[color:var(--color-text)]/10 md:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left md:hidden"
      >
        <span className="font-display text-[15.5px] font-semibold tracking-tight text-[color:var(--color-text)]">
          {group.title}
        </span>
        <ChevronDown
          size={15}
          className={`text-[color:var(--color-accent)] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <h3 className="hidden pb-5 font-display text-[16px] font-semibold tracking-tight text-[color:var(--color-text)] md:block">
        <span className="relative inline-block after:absolute after:-bottom-2 after:left-0 after:h-px after:w-8 after:rounded-full after:bg-[color:var(--color-primary)]">
          {group.title}
        </span>
      </h3>
      <ul
        className={`grid grid-cols-1 gap-y-2.5 pb-4 md:gap-y-3 ${open ? "grid" : "hidden md:grid"}`}
        aria-hidden={!open}
      >
        {group.items.map((it) => (
          <li key={it.label}>
            <Link
              href={it.href}
              className="inline-flex items-center gap-2 text-[13.5px] text-[color:var(--color-text)]/70 transition-colors hover:text-[color:var(--color-primary)]"
            >
              {it.Icon && <it.Icon size={13} className="text-[color:var(--color-text-tertiary)]" />}
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LegalGroup() {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[color:var(--color-text)]/10 md:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left md:hidden"
      >
        <span className="font-display text-[15.5px] font-semibold tracking-tight text-[color:var(--color-text)]">
          Legal
        </span>
        <ChevronDown
          size={15}
          className={`text-[color:var(--color-accent)] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <h3 className="hidden pb-5 font-display text-[16px] font-semibold tracking-tight text-[color:var(--color-text)] md:block">
        <span className="relative inline-block after:absolute after:-bottom-2 after:left-0 after:h-px after:w-8 after:rounded-full after:bg-[color:var(--color-primary)]">
          Legal
        </span>
      </h3>
      <ul
        className={`grid grid-cols-1 gap-y-2.5 pb-4 md:gap-y-3 ${open ? "grid" : "hidden md:grid"}`}
        aria-hidden={!open}
      >
        <li>
          <Link href="/policies/terms" className="text-[13.5px] text-[color:var(--color-text)]/70 transition-colors hover:text-[color:var(--color-primary)]">
            Terms of service
          </Link>
        </li>
        <li>
          <Link href="/policies/privacy" className="text-[13.5px] text-[color:var(--color-text)]/70 transition-colors hover:text-[color:var(--color-primary)]">
            Privacy policy
          </Link>
        </li>
        <li>
          <button
            type="button"
            onClick={openCookieSettings}
            className="text-left text-[13.5px] text-[color:var(--color-text)]/70 transition-colors hover:text-[color:var(--color-primary)]"
          >
            Cookie preferences
          </button>
        </li>
      </ul>
    </div>
  );
}

function CommunityGroup() {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[color:var(--color-text)]/10 md:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left md:hidden"
      >
        <span className="font-display text-[15.5px] font-semibold tracking-tight text-[color:var(--color-text)]">
          Community
        </span>
        <ChevronDown
          size={15}
          className={`text-[color:var(--color-accent)] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <h3 className="hidden pb-5 font-display text-[16px] font-semibold tracking-tight text-[color:var(--color-text)] md:block">
        <span className="relative inline-block after:absolute after:-bottom-2 after:left-0 after:h-px after:w-8 after:rounded-full after:bg-[color:var(--color-primary)]">
          Community
        </span>
      </h3>
      <ul
        className={`grid grid-cols-1 gap-y-2.5 pb-4 md:gap-y-3 ${open ? "grid" : "hidden md:grid"}`}
        aria-hidden={!open}
      >
        {socialLinks.map(({ icon: Icon, label, href, external }) => {
          const cls =
            "inline-flex items-center gap-2 text-[13.5px] text-[color:var(--color-text)]/70 transition-colors hover:text-[color:var(--color-primary)]";
          return (
            <li key={label}>
              {external ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
                  <Icon size={14} className="text-[color:var(--color-text-tertiary)]" />
                  {label}
                </a>
              ) : (
                <Link href={href} className={cls}>
                  <Icon size={14} className="text-[color:var(--color-text-tertiary)]" />
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Footer() {
  const t = useTranslations("footer");
  const { currency, symbol } = useCurrency();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto" role="contentinfo">
      {/* ── Brand + navigation tier ─────────────────────────────── */}
      <div className="grain relative overflow-hidden border-t border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] text-[color:var(--color-text)]">
        {/* Metallic top hairline + ambient glow */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: "var(--stroke-metal)" }} />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[60%] -translate-x-1/2 rounded-full opacity-40 blur-3xl" style={{ background: "radial-gradient(circle, var(--color-primary-glow) 0%, transparent 70%)" }} />
        <div className="relative mx-auto grid max-w-[1360px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.15fr_2fr] lg:gap-14 lg:px-8">
          {/* Brand block */}
          <div className="flex flex-col gap-5">
            <Link href="/" aria-label={brand.displayName}>
              <UltraSensLogo size={26} />
            </Link>
            <p className="max-w-sm text-[14.5px] leading-relaxed text-[color:var(--color-text-secondary)]">
              {brand.displayName} — the future of CS2 collecting. A curated
              showroom of the rarest skins with verified float, pattern and
              cross-market price data, traded instantly and securely through
              your Steam account.
            </p>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {trustBadges.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="metal-stroke inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[12.5px] text-[color:var(--color-text)]/85"
                >
                  <Icon size={13} className="shrink-0 text-[color:var(--color-primary)]" />
                  <span className="line-clamp-1">{label}</span>
                </div>
              ))}
            </div>

            <a
              href={`mailto:${brand.contact.email}`}
              className="inline-flex w-fit items-center gap-2 text-[13.5px] text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-primary)]"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--color-bg-elevated)] text-[color:var(--color-primary)]">
                <Mail size={13} />
              </span>
              {brand.contact.email}
            </a>

            <Link
              href="/store"
              className="mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-[color:var(--color-primary)] px-4 py-2.5 text-[12.5px] font-bold text-[color:var(--color-primary-fg)] shadow-[0_8px_24px_-8px_var(--color-primary-glow)] transition-all hover:bg-[color:var(--color-primary-hover)]"
            >
              Browse the store <ArrowRight size={12} />
            </Link>
          </div>

          {/* Link groups */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-0 md:grid-cols-3 lg:grid-cols-3">
            {groups.map((g) => (
              <LinkGroup key={g.key} group={g} />
            ))}
            <LegalGroup />
            <CommunityGroup />
          </div>
        </div>
      </div>

      {/* ── Legal bar ───────────────────────────────────────────── */}
      <div className="relative bg-[color:var(--color-bg)] text-[color:var(--color-text)]/70">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-4 border-t border-[color:var(--color-border)] px-4 py-6 sm:px-6 md:flex-row md:items-start md:justify-between lg:px-8">
          <div className="flex flex-col gap-1.5 text-[12px]">
            <p>{t("copyright", { year: currentYear, storeName: brand.displayName })}</p>
            <p className="max-w-xl text-[11.5px] leading-relaxed text-[color:var(--color-text)]/55">
              Not affiliated with Valve Corporation. Counter-Strike is a trademark
              of Valve Corporation. All skin names and images are the property of
              their respective owners.
            </p>
            <p className="text-[11.5px] text-[color:var(--color-text)]/45">
              {brand.company.legalName} · Company No. {brand.company.number} · {brandAddressLine}
            </p>
          </div>

          <div className="flex flex-col gap-2 md:items-end">
            <div className="flex flex-wrap items-center gap-2.5">
              {paymentBadges.map(({ src, label, pad }) => (
                <span
                  key={label}
                  title={label}
                  className={`relative inline-flex h-8 w-14 items-center justify-center rounded-md border border-[color:var(--color-border)] bg-white ${pad}`}
                >
                  <Image src={src} alt={label} fill sizes="56px" className="object-contain" />
                </span>
              ))}
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-text)]/85">
              <Globe size={11} className="text-[color:var(--color-primary)]" />
              <span>{currency} {symbol}</span>
            </div>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, label, href, external }) => {
                const cls =
                  "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text)]/75 transition-all hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]";
                return external ? (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cls}
                  >
                    <Icon size={14} />
                  </a>
                ) : (
                  <Link key={label} href={href} aria-label={label} className={cls}>
                    <Icon size={14} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
