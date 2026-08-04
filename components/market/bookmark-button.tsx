"use client";

import { useTranslations } from "next-intl";
import { useWatchlist } from "@/hooks/use-watchlist";
import clsx from "clsx";

type Props = Readonly<{
  symbol: string;
}>;

export function BookmarkButton({ symbol }: Props) {
  const t = useTranslations("Market");
  const { has, toggle, ready } = useWatchlist();
  const active = has(symbol);

  return (
    <button
      type="button"
      disabled={!ready}
      onClick={() => toggle(symbol)}
      className={clsx(
        "inline-flex h-9 items-center rounded-md border px-3 text-sm transition-colors",
        active
          ? "border-accent bg-accent-soft text-accent"
          : "border-border bg-surface text-muted hover:text-foreground",
      )}
    >
      {active ? t("watchlistSaved") : t("watchlistSave")}
    </button>
  );
}
