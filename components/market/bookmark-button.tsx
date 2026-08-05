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
  const saveLabel = t("watchlistSave");
  const savedLabel = t("watchlistSaved");

  return (
    <button
      type="button"
      disabled={!ready}
      onClick={() => toggle(symbol)}
      className={clsx(
        "inline-grid h-9 shrink-0 place-items-center rounded-md border px-3 text-sm transition-colors",
        active
          ? "border-accent bg-accent-soft text-accent"
          : "border-border bg-surface text-muted hover:text-foreground",
      )}
    >
      {/* Reserve width for the longer label so toggle does not reflow. */}
      <span className="invisible col-start-1 row-start-1" aria-hidden>
        {savedLabel.length >= saveLabel.length ? savedLabel : saveLabel}
      </span>
      <span className="col-start-1 row-start-1">
        {active ? savedLabel : saveLabel}
      </span>
    </button>
  );
}
