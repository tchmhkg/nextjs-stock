"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SymbolSearch } from "@/components/symbol-search";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  const t = useTranslations("Nav");

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="shrink-0 font-semibold tracking-tight text-foreground"
        >
          nextjs-stock
        </Link>
        <Link
          href="/market"
          className="hidden text-sm text-muted transition-colors hover:text-accent sm:inline"
        >
          {t("market")}
        </Link>
        <div className="ml-auto flex flex-1 items-center justify-end gap-2 sm:max-w-md sm:flex-none">
          <SymbolSearch />
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}
