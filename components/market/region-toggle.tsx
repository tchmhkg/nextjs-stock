"use client";

import { useTranslations } from "next-intl";
import clsx from "clsx";
import type { MarketRegion } from "@/lib/market/types";

type Props = Readonly<{
  region: MarketRegion;
  onChange: (region: MarketRegion) => void;
}>;

export function RegionToggle({ region, onChange }: Props) {
  const t = useTranslations("Market");

  return (
    <div
      className="inline-flex h-9 items-stretch gap-0.5 rounded-md border border-border bg-surface p-0.5"
      role="group"
      aria-label={t("regionLabel")}
    >
      {(["US", "HK"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => onChange(code)}
          className={clsx(
            "min-w-12 rounded px-3 font-mono text-xs font-medium uppercase transition-colors",
            region === code
              ? "bg-accent text-white dark:text-foreground"
              : "text-muted hover:text-foreground",
          )}
        >
          {t(`region.${code}`)}
        </button>
      ))}
    </div>
  );
}
