"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, toggle, mounted } = useTheme();
  const t = useTranslations("Theme");

  if (!mounted) {
    return (
      <button
        type="button"
        className="h-9 w-9 shrink-0 rounded-md border border-border bg-surface"
        aria-hidden
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-foreground transition-colors hover:border-accent hover:text-accent"
      aria-label={t("toggle")}
      title={isDark ? t("light") : t("dark")}
    >
      <motion.span
        key={isDark ? "moon" : "sun"}
        initial={{ rotate: -40, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="font-mono text-sm"
      >
        {isDark ? "◐" : "☀"}
      </motion.span>
    </button>
  );
}
