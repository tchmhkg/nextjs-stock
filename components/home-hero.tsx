"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";

export function HomeHero() {
  const t = useTranslations("Home");

  return (
    <section className="relative flex min-h-[calc(100vh-3.5rem)] flex-1 flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--accent-soft)_0%,_transparent_55%),linear-gradient(180deg,_var(--background)_0%,_var(--surface)_100%)]"
      />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-20">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-4 font-mono text-sm tracking-[0.2em] text-accent uppercase"
        >
          {t("eyebrow")}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="text-5xl font-semibold tracking-tight text-foreground sm:text-7xl"
        >
          {t("title")}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="mt-4 max-w-md text-lg text-muted"
        >
          {t("tagline")}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-10"
        >
          <Link
            href="/market"
            className="inline-flex items-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:text-foreground"
          >
            {t("cta")}
          </Link>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-16 font-mono text-xs text-muted"
        >
          {t("stack")}
        </motion.p>
      </div>
    </section>
  );
}
