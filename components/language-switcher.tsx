"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import clsx from "clsx";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Language");

  return (
    <div
      className="inline-flex h-9 shrink-0 items-stretch gap-0.5 rounded-md border border-border bg-surface p-0.5"
      role="group"
      aria-label={t("label")}
    >
      {routing.locales.map((code) => (
        <Link
          key={code}
          href={pathname}
          locale={code}
          className={clsx(
            "inline-flex min-w-9 items-center justify-center rounded px-2.5 font-mono text-xs font-medium uppercase transition-colors",
            locale === code
              ? "bg-accent text-white dark:text-foreground"
              : "text-muted hover:text-foreground",
          )}
        >
          {code}
        </Link>
      ))}
    </div>
  );
}
