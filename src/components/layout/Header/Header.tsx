"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import NextLink from "next/link";
import Image from "next/image";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import {
  Search,
  Menu,
  X,
  ChevronDown,
  Wallet,
  LogOut,
  User as UserIcon,
  Repeat,
  Link2,
  BarChart3,
  Shield,
  ArrowRight,
  Loader2,
  Heart,
  Swords,
  Crosshair,
  Target,
  Zap,
  Bomb,
  Grab,
  Gem,
  Sparkles,
  TrendingUp,
  Scale,
  Layers,
  Clock,
  Compass,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useCurrency } from "@/providers/CurrencyProvider";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { AnimatePresence, motion } from "framer-motion";
import { UltraSensLogo } from "../DropskinLogo";
import { CurrencySwitcher } from "./CurrencySwitcher";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

interface SkinSuggestion {
  id: string;
  name: string;
  weapon: string;
  category: string;
  rarityColor: string;
  imageUrl: string | null;
  lowestPrice: number | null;
}

// Marketplace mega-menu — real category tokens the /api/skins `category` filter
// accepts (see CATEGORY_LABELS in lib/skins/shared).
const CATEGORIES: { token: string; label: string; blurb: string; Icon: React.ElementType }[] = [
  { token: "Knives", label: "Knives", blurb: "★ Karambits, Butterflies", Icon: Swords },
  { token: "Gloves", label: "Gloves", blurb: "Sport, Specialist, Hydra", Icon: Grab },
  { token: "Rifles", label: "Rifles", blurb: "AK-47, M4, AWP", Icon: Crosshair },
  { token: "Pistols", label: "Pistols", blurb: "Deagle, Glock, USP-S", Icon: Target },
  { token: "SMGs", label: "SMGs", blurb: "MP9, MAC-10, P90", Icon: Zap },
  { token: "Heavy", label: "Heavy", blurb: "Shotguns & MGs", Icon: Bomb },
];

// Rarity shortcuts surfaced in the "Rare items" menu.
const RARE_LINKS: { label: string; href: string; color: string }[] = [
  { label: "Covert", href: "/catalog?rarity=Covert", color: "#eb4b4b" },
  { label: "Classified", href: "/catalog?rarity=Classified", color: "#d32ce6" },
  { label: "Extraordinary", href: "/catalog?rarity=Extraordinary", color: "#ffd700" },
  { label: "Contraband", href: "/catalog?rarity=Contraband", color: "#e4ae39" },
];

const TOOLS: { label: string; href: string; Icon: React.ElementType; blurb: string }[] = [
  { label: "Compare skins", href: "/compare", Icon: Scale, blurb: "Weigh two items side by side" },
  { label: "Loadout creator", href: "/loadout", Icon: Layers, blurb: "Build a CT / T inventory" },
  { label: "Favorites", href: "/favorites", Icon: Heart, blurb: "Your saved collection" },
  { label: "Recently viewed", href: "/favorites?tab=recent", Icon: Clock, blurb: "Pick up where you left off" },
];

function useDismiss(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [onClose]);
  return ref;
}

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, role, signOut } = useAuth();
  const { symbol } = useCurrency();
  const { count: favCount } = useFavorites();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mega, setMega] = useState<null | "market" | "rare" | "tools">(null);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SkinSuggestion[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [highlight, setHighlight] = useState(-1);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled((prev) => (prev ? y > 2 : y > 8));
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Debounced skin-name autocomplete against the DB.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => {
      fetch(`/api/skins/suggest?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
        .then((r) => (r.ok ? r.json() : { suggestions: [] }))
        .then((data) => setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []))
        .catch(() => {})
        .finally(() => setSearchLoading(false));
    }, 180);
    return () => {
      ctrl.abort();
      window.clearTimeout(timer);
    };
  }, [query]);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setHighlight(-1);
  }, []);

  const searchRefDesktop = useDismiss(closeSearch);
  const searchRefMobile = useDismiss(closeSearch);
  const accountRef = useDismiss(() => setAccountOpen(false));
  const navRef = useDismiss(() => setMega(null));

  const submitSearch = (q: string) => {
    const term = q.trim();
    if (!term) return;
    closeSearch();
    setMobileOpen(false);
    router.push(`/catalog?q=${encodeURIComponent(term)}`);
  };

  const goToSkin = (id: string) => {
    closeSearch();
    setMobileOpen(false);
    setQuery("");
    router.push(`/skin/${id}`);
  };

  const onSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, -1));
    } else if (e.key === "Enter") {
      if (highlight >= 0 && suggestions[highlight]) {
        e.preventDefault();
        goToSkin(suggestions[highlight].id);
      }
    }
  };

  const currentPath = pathname || "/";
  const authHref = `/auth?next=${encodeURIComponent(currentPath)}`;
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";
  const displayName = user?.steam?.personaName || user?.name || user?.email || "Trader";
  const avatar = user?.steam?.avatarFull || user?.steam?.avatar || null;

  const navActive = (href: string) =>
    currentPath === href || currentPath.startsWith(`${href}/`);

  const searchDropdown = () =>
    searchOpen && query.trim().length >= 2 ? (
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        transition={{ duration: 0.15 }}
        className="glass-strong absolute inset-x-0 top-full z-40 mt-2 overflow-hidden rounded-2xl p-1.5 shadow-[var(--shadow-xl)]"
        role="listbox"
      >
        {searchLoading && suggestions.length === 0 ? (
          <div className="flex items-center justify-center gap-2 px-3 py-6 text-sm text-[color:var(--color-text-tertiary)]">
            <Loader2 size={15} className="animate-spin" /> Searching skins…
          </div>
        ) : suggestions.length === 0 ? (
          <div className="px-3 py-6 text-center text-sm text-[color:var(--color-text-tertiary)]">
            No skins match “{query.trim()}”.
          </div>
        ) : (
          <>
            {suggestions.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="option"
                aria-selected={i === highlight}
                onMouseEnter={() => setHighlight(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  goToSkin(s.id);
                }}
                className={[
                  "flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors",
                  i === highlight
                    ? "bg-[color:var(--color-primary-tint)]"
                    : "hover:bg-[color:var(--color-bg-secondary)]",
                ].join(" ")}
              >
                <span
                  className="relative flex h-10 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[color:var(--color-bg-secondary)]"
                  style={{ boxShadow: `inset 0 -2px 0 0 ${s.rarityColor}` }}
                >
                  {s.imageUrl && (
                    <Image src={s.imageUrl} alt="" fill sizes="56px" className="object-contain p-1" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold text-[color:var(--color-text)]">
                    {s.name}
                  </span>
                  <span className="block truncate font-mono text-[10.5px] uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">
                    {s.weapon}
                  </span>
                </span>
                {s.lowestPrice != null && (
                  <span className="shrink-0 font-mono text-[12px] font-bold tabular-nums text-[color:var(--color-primary)]">
                    {symbol}
                    {s.lowestPrice.toFixed(2)}
                  </span>
                )}
              </button>
            ))}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                submitSearch(query);
              }}
              className="mt-1 flex w-full items-center justify-between rounded-xl px-3 py-2 text-[12px] font-semibold text-[color:var(--color-primary)] transition-colors hover:bg-[color:var(--color-primary-tint)]"
            >
              <span className="inline-flex items-center gap-1.5">
                <Search size={13} /> See all results for “{query.trim()}”
              </span>
              <ArrowRight size={13} />
            </button>
          </>
        )}
      </motion.div>
    ) : null;

  const navTrigger = (key: "market" | "rare" | "tools", label: string, Icon: React.ElementType) => (
    <button
      type="button"
      onMouseEnter={() => setMega(key)}
      onClick={() => setMega((m) => (m === key ? null : key))}
      aria-expanded={mega === key}
      className={[
        "inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold tracking-tight transition-colors",
        mega === key
          ? "bg-[color:var(--color-primary-tint)] text-[color:var(--color-primary)]"
          : "text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text)]",
      ].join(" ")}
    >
      <Icon size={15} strokeWidth={2} />
      {label}
      <ChevronDown
        size={13}
        className={["transition-transform", mega === key ? "rotate-180" : ""].join(" ")}
      />
    </button>
  );

  const navLink = (href: string, label: string, Icon: React.ElementType) => (
    <Link
      href={href}
      onMouseEnter={() => setMega(null)}
      className={[
        "inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold tracking-tight transition-colors",
        navActive(href)
          ? "bg-[color:var(--color-primary-tint)] text-[color:var(--color-primary)]"
          : "text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text)]",
      ].join(" ")}
    >
      <Icon size={15} strokeWidth={2} />
      {label}
    </Link>
  );

  const primaryNav = (
    <nav className="flex items-center gap-0.5 py-1.5" aria-label="Primary">
      {navLink("/catalog", "Explore", Compass)}
      {navTrigger("market", "Marketplace", Sparkles)}
      {navLink("/catalog?sort=discount", "Collections", Gem)}
      {navTrigger("rare", "Rare items", Sparkles)}
      {navLink("/catalog?sort=newest", "Trending", TrendingUp)}
      {navLink("/analytics", "Analytics", BarChart3)}
      {navTrigger("tools", "Tools", Layers)}
    </nav>
  );

  const megaMenu = () => (
    <AnimatePresence>
      {mega && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          onMouseLeave={() => setMega(null)}
          className="glass-strong absolute left-0 top-full z-40 mt-1.5 w-[min(760px,calc(100vw-3rem))] overflow-hidden rounded-[var(--radius-2xl)] p-4 shadow-[var(--shadow-xl)]"
        >
          {mega === "market" && (
            <div>
              <div className="mb-3 flex items-center justify-between px-1">
                <span className="eyebrow">Shop by category</span>
                <Link
                  href="/catalog"
                  onClick={() => setMega(null)}
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-[color:var(--color-primary)]"
                >
                  All skins <ArrowRight size={12} />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.token}
                    href={`/catalog?category=${encodeURIComponent(c.token)}`}
                    onClick={() => setMega(null)}
                    className="metal-stroke group flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-[color:var(--color-primary-tint)]"
                  >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[color:var(--color-bg-secondary)] text-[color:var(--color-primary)] transition-colors group-hover:bg-[color:var(--color-primary)] group-hover:text-[color:var(--color-primary-fg)]">
                      <c.Icon size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13.5px] font-bold text-[color:var(--color-text)]">
                        {c.label}
                      </span>
                      <span className="block truncate text-[11.5px] text-[color:var(--color-text-tertiary)]">
                        {c.blurb}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {mega === "rare" && (
            <div>
              <div className="mb-3 px-1">
                <span className="eyebrow">Curated by rarity</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {RARE_LINKS.map((r) => (
                  <Link
                    key={r.label}
                    href={r.href}
                    onClick={() => setMega(null)}
                    className="group flex items-center gap-3 rounded-xl border border-[color:var(--color-border)] p-3 transition-colors hover:bg-[color:var(--color-bg-secondary)]"
                  >
                    <span
                      className="h-8 w-1.5 shrink-0 rounded-full"
                      style={{ background: r.color, boxShadow: `0 0 12px ${r.color}88` }}
                    />
                    <span className="min-w-0">
                      <span className="block text-[13.5px] font-bold text-[color:var(--color-text)]">
                        {r.label}
                      </span>
                      <span className="block text-[11.5px] text-[color:var(--color-text-tertiary)]">
                        Explore {r.label.toLowerCase()} grade
                      </span>
                    </span>
                    <ArrowRight
                      size={14}
                      className="ml-auto text-[color:var(--color-text-tertiary)] transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {mega === "tools" && (
            <div>
              <div className="mb-3 px-1">
                <span className="eyebrow">Collector tools</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {TOOLS.map((t) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    onClick={() => setMega(null)}
                    className="group flex items-center gap-3 rounded-xl border border-[color:var(--color-border)] p-3 transition-colors hover:bg-[color:var(--color-bg-secondary)]"
                  >
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[color:var(--color-primary-tint)] text-[color:var(--color-primary)]">
                      <t.Icon size={16} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13.5px] font-bold text-[color:var(--color-text)]">
                        {t.label}
                      </span>
                      <span className="block truncate text-[11.5px] text-[color:var(--color-text-tertiary)]">
                        {t.blurb}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <header
        className={[
          "sticky top-0 z-40 w-full transition-all duration-300",
          scrolled
            ? "glass border-b border-[color:var(--glass-border)] shadow-[0_10px_40px_-24px_rgba(0,0,0,0.8)]"
            : "border-b border-transparent bg-transparent",
        ].join(" ")}
        role="banner"
      >
        <div
          className={[
            "mx-auto flex max-w-[1360px] items-center gap-3 px-4 transition-[padding] duration-300 sm:px-6 lg:gap-4 lg:px-8",
            scrolled ? "py-2" : "py-3",
          ].join(" ")}
        >
          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[color:var(--color-text)] hover:bg-[color:var(--color-bg-secondary)] lg:hidden"
          >
            <Menu size={22} />
          </button>

          {/* Logo */}
          <Link href="/" aria-label="UltraSensSkin — home" className="shrink-0">
            <UltraSensLogo size={scrolled ? 18 : 20} />
          </Link>

          {/* Search — desktop */}
          <div ref={searchRefDesktop} className="relative hidden min-w-0 flex-1 lg:block">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitSearch(query);
              }}
              className={[
                "flex h-10 items-center overflow-hidden rounded-full border bg-[color:var(--color-bg-elevated)]/70 pl-4 pr-1.5 transition-all",
                searchOpen
                  ? "border-[color:var(--color-primary)] shadow-[0_0_0_4px_var(--color-primary-tint)]"
                  : "border-[color:var(--color-border)]",
              ].join(" ")}
            >
              <Search size={16} className="shrink-0 text-[color:var(--color-text-tertiary)]" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSearchOpen(true);
                  setHighlight(-1);
                }}
                onFocus={() => {
                  setSearchOpen(true);
                  setMega(null);
                }}
                onKeyDown={onSearchKeyDown}
                placeholder="Search — AWP Dragon Lore, ★ Karambit, AK-47 Redline…"
                aria-label="Search skins"
                className="min-w-0 flex-1 bg-transparent px-3 text-[13.5px] text-[color:var(--color-text)] placeholder:text-[color:var(--color-text-tertiary)] focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Search"
                className="inline-flex h-7 items-center gap-1.5 rounded-full bg-[color:var(--color-primary)] px-4 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--color-primary-fg)] transition hover:bg-[color:var(--color-primary-hover)]"
              >
                Search
              </button>
            </form>
            <AnimatePresence>{searchDropdown()}</AnimatePresence>
          </div>

          {/* Right cluster */}
          <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
            {/* Theme / currency / language */}
            <div className="hidden items-center gap-1 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)]/60 px-1.5 py-1 md:flex">
              <ThemeToggle />
              <span className="h-4 w-px bg-[color:var(--color-border)]" />
              <CurrencySwitcher />
              <span className="h-4 w-px bg-[color:var(--color-border)]" />
              <LanguageSwitcher />
            </div>

            {/* Favorites */}
            <Link
              href="/favorites"
              aria-label="Favorites"
              className="relative hidden h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)]/60 text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)] sm:inline-flex"
            >
              <Heart size={17} />
              {favCount > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[color:var(--color-primary)] px-1 font-mono text-[9.5px] font-bold text-[color:var(--color-primary-fg)]">
                  {favCount > 99 ? "99+" : favCount}
                </span>
              )}
            </Link>

            {/* Wallet balance */}
            {user && (
              <Link
                href="/account"
                className="hidden h-10 items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)]/60 px-3 text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-primary)] sm:inline-flex"
                aria-label="Wallet balance"
              >
                <Wallet size={16} className="text-[color:var(--color-primary)]" />
                <span className="font-mono text-[12.5px] font-bold tabular-nums">
                  {symbol}0.00
                </span>
              </Link>
            )}

            {/* Auth zone */}
            {!user ? (
              <Link
                href={authHref}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[color:var(--color-primary)] px-4 text-[13px] font-bold text-[color:var(--color-primary-fg)] shadow-[0_8px_24px_-8px_var(--color-primary-glow)] transition hover:bg-[color:var(--color-primary-hover)]"
              >
                <UserIcon size={15} />
                <span>Sign in</span>
              </Link>
            ) : (
              <div
                ref={accountRef}
                className="relative"
                onMouseEnter={() => setAccountOpen(true)}
                onMouseLeave={() => setAccountOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setAccountOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)]/60 py-1 pl-1 pr-2.5 transition-colors hover:border-[color:var(--color-primary)]"
                >
                  <span className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[color:var(--color-primary-tint)] text-[color:var(--color-primary)]">
                    {avatar ? (
                      <Image src={avatar} alt="" fill sizes="32px" className="object-cover" />
                    ) : (
                      <UserIcon size={16} />
                    )}
                  </span>
                  <span className="hidden max-w-[120px] truncate text-[13px] font-semibold text-[color:var(--color-text)] sm:inline">
                    {displayName}
                  </span>
                  <ChevronDown size={14} className="hidden text-[color:var(--color-text-tertiary)] sm:inline" />
                </button>
                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      role="menu"
                      className="glass-strong absolute right-0 top-full z-40 mt-1.5 w-64 overflow-hidden rounded-2xl p-2 shadow-[var(--shadow-xl)]"
                    >
                      <div className="mb-2 flex items-center gap-3 rounded-xl bg-[color:var(--color-bg-secondary)] p-3">
                        <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[color:var(--color-primary-tint)] text-[color:var(--color-primary)]">
                          {avatar ? (
                            <Image src={avatar} alt="" fill sizes="40px" className="object-cover" />
                          ) : (
                            <UserIcon size={18} />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-bold text-[color:var(--color-text)]">
                            {displayName}
                          </span>
                          <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--color-primary)]">
                            {user.steam?.tradeUrlVerified ? "Trade ready" : "Trade URL needed"}
                          </span>
                        </span>
                      </div>
                      {[
                        { href: "/account", icon: UserIcon, label: "Profile" },
                        { href: "/account/trades", icon: Repeat, label: "My Trades" },
                        { href: "/account/trade-url", icon: Link2, label: "Trade URL settings" },
                        { href: "/favorites", icon: Heart, label: "Favorites" },
                      ].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-primary-tint)] hover:text-[color:var(--color-primary)]"
                        >
                          <item.icon size={15} className="text-[color:var(--color-primary)]" />
                          {item.label}
                        </Link>
                      ))}
                      {isAdmin && (
                        <NextLink
                          href="/admin"
                          role="menuitem"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-primary-tint)] hover:text-[color:var(--color-primary)]"
                        >
                          <Shield size={15} className="text-[color:var(--color-primary)]" />
                          Admin panel
                        </NextLink>
                      )}
                      <div className="my-1.5 h-px bg-[color:var(--color-border)]" />
                      <button
                        type="button"
                        onClick={() => {
                          setAccountOpen(false);
                          signOut();
                        }}
                        role="menuitem"
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-danger)]/10 hover:text-[color:var(--color-danger)]"
                      >
                        <LogOut size={15} />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Row 2 — primary navigation (desktop only) */}
        <div className="hidden border-t border-[color:var(--glass-border)] lg:block">
          <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
            <div ref={navRef} className="relative">
              {primaryNav}
              {megaMenu()}
            </div>
          </div>
        </div>

        {/* Search — mobile row */}
        <div ref={searchRefMobile} className="relative border-t border-[color:var(--glass-border)] px-4 py-2 lg:hidden">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitSearch(query);
            }}
            className="flex h-10 items-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] pl-4 pr-1"
          >
            <Search size={15} className="shrink-0 text-[color:var(--color-text-tertiary)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearchOpen(true);
                setHighlight(-1);
              }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={onSearchKeyDown}
              placeholder="Search skins"
              aria-label="Search skins"
              className="min-w-0 flex-1 bg-transparent px-2 text-sm text-[color:var(--color-text)] placeholder:text-[color:var(--color-text-tertiary)] focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Search"
              className="inline-flex h-8 items-center rounded-full bg-[color:var(--color-primary)] px-4 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[color:var(--color-primary-fg)]"
            >
              Go
            </button>
          </form>
          <AnimatePresence>{searchDropdown()}</AnimatePresence>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-[#030407]/70 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-[88%] max-w-sm flex-col bg-[color:var(--color-bg)] shadow-xl lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between border-b border-[color:var(--color-border)] px-5 py-4">
                <UltraSensLogo size={18} />
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-bg-secondary)] hover:text-[color:var(--color-text)]"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-3 py-3" aria-label="Mobile">
                {[
                  { href: "/catalog", label: "Explore", Icon: Compass },
                  { href: "/catalog?sort=discount", label: "Collections", Icon: Gem },
                  { href: "/catalog?rarity=Covert", label: "Rare items", Icon: Sparkles },
                  { href: "/catalog?sort=newest", label: "Trending", Icon: TrendingUp },
                  { href: "/analytics", label: "Analytics", Icon: BarChart3 },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] font-semibold text-[color:var(--color-text)] hover:bg-[color:var(--color-bg-secondary)]"
                  >
                    <item.Icon size={18} className="text-[color:var(--color-primary)]" />
                    {item.label}
                  </Link>
                ))}

                <div className="my-2 h-px bg-[color:var(--color-border)]" />
                <span className="px-3 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">
                  Categories
                </span>
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.token}
                    href={`/catalog?category=${encodeURIComponent(c.token)}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium text-[color:var(--color-text)] hover:bg-[color:var(--color-bg-secondary)]"
                  >
                    <c.Icon size={17} className="text-[color:var(--color-text-secondary)]" />
                    {c.label}
                  </Link>
                ))}

                <div className="my-2 h-px bg-[color:var(--color-border)]" />
                {TOOLS.map((t) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium text-[color:var(--color-text)] hover:bg-[color:var(--color-bg-secondary)]"
                  >
                    <t.Icon size={17} className="text-[color:var(--color-primary)]" />
                    {t.label}
                  </Link>
                ))}

                {user && (
                  <>
                    <div className="my-2 h-px bg-[color:var(--color-border)]" />
                    {[
                      { href: "/account", icon: UserIcon, label: "Profile" },
                      { href: "/account/trades", icon: Repeat, label: "My Trades" },
                      { href: "/account/trade-url", icon: Link2, label: "Trade URL settings" },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] font-medium text-[color:var(--color-text)] hover:bg-[color:var(--color-bg-secondary)]"
                      >
                        <item.icon size={18} className="text-[color:var(--color-primary)]" />
                        {item.label}
                      </Link>
                    ))}
                    {isAdmin && (
                      <NextLink
                        href="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] font-medium text-[color:var(--color-text)] hover:bg-[color:var(--color-bg-secondary)]"
                      >
                        <Shield size={18} className="text-[color:var(--color-primary)]" />
                        Admin panel
                      </NextLink>
                    )}
                  </>
                )}
              </nav>

              <div className="border-t border-[color:var(--color-border)] px-4 py-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-1 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] px-1.5 py-1">
                    <ThemeToggle />
                    <span className="h-4 w-px bg-[color:var(--color-border)]" />
                    <CurrencySwitcher />
                    <span className="h-4 w-px bg-[color:var(--color-border)]" />
                    <LanguageSwitcher />
                  </div>
                </div>
                {user ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      signOut();
                    }}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[color:var(--color-border)] text-sm font-semibold text-[color:var(--color-text)]"
                  >
                    <LogOut size={16} /> Sign out
                  </button>
                ) : (
                  <Link
                    href={authHref}
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[color:var(--color-primary)] text-sm font-bold text-[color:var(--color-primary-fg)]"
                  >
                    <UserIcon size={16} /> Sign in
                  </Link>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
