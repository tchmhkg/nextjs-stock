"use client";

import useSWR from "swr";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { marketApi } from "@/lib/market/api";
import {
  changeTone,
  formatPercent,
  formatPrice,
} from "@/lib/market/format";
import { useWatchlist } from "@/hooks/use-watchlist";
import clsx from "clsx";

export function WatchlistPanel() {
  const t = useTranslations("Market");
  const { symbols, ready, remove } = useWatchlist();

  if (!ready) {
    return (
      <div className="h-32 animate-pulse rounded-md border border-border bg-surface" />
    );
  }

  if (symbols.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border px-4 py-8 text-center">
        <p className="text-sm text-muted">{t("watchlistEmpty")}</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border overflow-hidden rounded-md border border-border bg-surface">
      {symbols.map((symbol) => (
        <WatchlistRow
          key={symbol}
          symbol={symbol}
          onRemove={() => remove(symbol)}
          removeLabel={t("watchlistRemove")}
        />
      ))}
    </ul>
  );
}

function WatchlistRow({
  symbol,
  onRemove,
  removeLabel,
}: {
  symbol: string;
  onRemove: () => void;
  removeLabel: string;
}) {
  const { data } = useSWR(
    ["quote", symbol],
    () => marketApi.quote(symbol),
    { refreshInterval: 20_000, revalidateOnFocus: false },
  );

  const tone = changeTone(data?.regularMarketChange);

  return (
    <li className="flex items-center gap-3 px-3 py-3">
      <Link
        href={`/market/${encodeURIComponent(symbol)}`}
        className="min-w-0 flex-1"
      >
        <p className="font-mono text-sm font-semibold text-foreground">
          {symbol}
        </p>
        <p className="truncate text-xs text-muted">
          {data?.shortName || data?.longName || "…"}
        </p>
      </Link>
      <div className="text-right">
        <p className="font-mono text-sm font-semibold tabular-nums text-foreground">
          {formatPrice(data?.regularMarketPrice)}
        </p>
        <p className={clsx("font-mono text-xs tabular-nums", tone)}>
          {formatPercent(data?.regularMarketChangePercent)}
        </p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 rounded-md px-2 py-1 text-xs text-muted transition-colors hover:bg-accent-soft hover:text-foreground"
        aria-label={removeLabel}
      >
        ×
      </button>
    </li>
  );
}
