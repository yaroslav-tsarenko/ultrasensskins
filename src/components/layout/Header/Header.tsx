"use client";

import { useState, useEffect } from "react";
import NextLink from "next/link";
import Image from "next/image";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import {
  Search,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Link2,
  Shield,
  Gem,
  Sparkles,
  TrendingUp,
  ShoppingBag,
  Package,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { AnimatePresence, motion } from "framer-motion";
import { UltraSensLogo } from "../DropskinLogo";
import { CurrencySwitcher } from "./CurrencySwitcher";
import { ThemeToggle } from "./ThemeToggle";

// Quick-filter shortcuts into the real SIH store (params match SihCatalogClient).
const RARE_LINKS: { label: string; href: string; color: string }[] = [
  { label: "Covert", href: "/store?rarity=Covert", color: "#eb4b4b" },
  { label: "Classified", href: "/store?rarity=Classified", color: "#d32ce6" },
  { label: "Extraordinary", href: "/store?rarity=Extraordinary", color: "#ffd700" },
  { label: "Contraband", href: "/store?rarity=Contraband", color: "#e4ae39" },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, role, signOut } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [query, setQuery] = useState("");

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

  const submitSearch = (q: string) => {
    const term = q.trim();
    setMobileOpen(false);
    router.push(term ? `/store?q=${encodeURIComponent(term)}` : "/store");
  };

  const currentPath = pathname || "/";
  const authHref = `/auth?next=${encodeURIComponent(currentPath)}`;
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";
  const displayName = user?.steam?.personaName || user?.name || user?.email || "Trader";
  const avatar = user?.steam?.avatarFull || user?.steam?.avatar || null;

  const navActive = (href: string) => currentPath === href || currentPath.startsWith(`${href}/`);

  const navLink = (href: string, label: string, Icon: React.ElementType) => (
    <Link
      href={href}
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

  const searchForm = (variant: "desktop" | "mobile") => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submitSearch(query);
      }}
      className={[
        "flex h-10 items-center overflow-hidden rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)]/70 pl-4",
        variant === "desktop" ? "pr-1.5" : "pr-1",
      ].join(" ")}
    >
      <Search size={16} className="shrink-0 text-[color:var(--color-text-tertiary)]" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={variant === "desktop" ? "Search — AWP Dragon Lore, ★ Karambit, AK-47 Redline…" : "Search skins"}
        aria-label="Search skins"
        className="min-w-0 flex-1 bg-transparent px-3 text-[13.5px] text-[color:var(--color-text)] placeholder:text-[color:var(--color-text-tertiary)] focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Search"
        className="inline-flex h-7 items-center rounded-full bg-[color:var(--color-primary)] px-4 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--color-primary-fg)] transition hover:bg-[color:var(--color-primary-hover)]"
      >
        Search
      </button>
    </form>
  );

  const accountLinks = [
    { href: "/account", icon: UserIcon, label: "Profile" },
    { href: "/my-purchases", icon: Package, label: "My Purchases" },
    { href: "/account/trade-url", icon: Link2, label: "Trade URL settings" },
  ];

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
          <Link href="/" aria-label={`${"UltraSensSkin"} — home`} className="shrink-0">
            <UltraSensLogo size={scrolled ? 18 : 20} />
          </Link>

          {/* Search — desktop */}
          <div className="relative hidden min-w-0 flex-1 lg:block">{searchForm("desktop")}</div>

          {/* Right cluster */}
          <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
            <div className="hidden items-center gap-1 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)]/60 px-1.5 py-1 md:flex">
              <ThemeToggle />
              <span className="h-4 w-px bg-[color:var(--color-border)]" />
              <CurrencySwitcher />
            </div>

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
                      {accountLinks.map((item) => (
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
            <nav className="flex items-center gap-0.5 py-1.5" aria-label="Primary">
              {navLink("/store", "Store", ShoppingBag)}
              {navLink("/store?sort=price_asc", "Best value", Gem)}
              {navLink("/store?rarity=Covert", "Rare items", Sparkles)}
              {navLink("/store?sort=newest", "New arrivals", TrendingUp)}
              {navLink("/my-purchases", "My purchases", Package)}
            </nav>
          </div>
        </div>

        {/* Search — mobile row */}
        <div className="relative border-t border-[color:var(--glass-border)] px-4 py-2 lg:hidden">
          {searchForm("mobile")}
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
                  { href: "/store", label: "Store", Icon: ShoppingBag },
                  { href: "/store?sort=price_asc", label: "Best value", Icon: Gem },
                  { href: "/store?sort=newest", label: "New arrivals", Icon: TrendingUp },
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
                  By rarity
                </span>
                {RARE_LINKS.map((r) => (
                  <Link
                    key={r.label}
                    href={r.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium text-[color:var(--color-text)] hover:bg-[color:var(--color-bg-secondary)]"
                  >
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.color }} />
                    {r.label}
                  </Link>
                ))}

                {user && (
                  <>
                    <div className="my-2 h-px bg-[color:var(--color-border)]" />
                    {accountLinks.map((item) => (
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
