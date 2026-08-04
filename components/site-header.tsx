"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SymbolSearch } from "@/components/symbol-search";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  const t = useTranslations("Nav");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-md"
    >
      {/* Mobile search overlay row */}
      {mobileSearchOpen ? (
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center px-4 md:hidden">
          <SymbolSearch
            autoFocus
            onClose={() => setMobileSearchOpen(false)}
            className="w-full"
          />
        </div>
      ) : (
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-2 px-4 sm:gap-3 sm:px-6">
          <Link
            href="/"
            className="shrink-0 font-semibold tracking-tight text-foreground"
          >
            <span className="md:hidden">{t("logoShort")}</span>
            <span className="hidden md:inline">{t("logo")}</span>
          </Link>
          <Link
            href="/market"
            className="hidden shrink-0 text-sm text-muted transition-colors hover:text-accent sm:inline"
          >
            {t("market")}
          </Link>

          <div className="ml-auto flex items-center gap-2">
            {/* Desktop search */}
            <div className="hidden w-56 md:block lg:w-64">
              <SymbolSearch />
            </div>

            {/* Mobile search trigger */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-foreground transition-colors hover:border-accent hover:text-accent md:hidden"
              aria-label={t("searchOpen")}
            >
              <span className="font-mono text-sm" aria-hidden>
                ⌕
              </span>
            </button>

            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      )}
    </motion.header>
  );
}
