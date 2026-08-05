"use client";

import useSWR from "swr";
import { useTranslations } from "next-intl";
import { marketApi } from "@/lib/market/api";
import { quotesRefreshMs } from "@/lib/market/session";
import { useWatchlist } from "@/hooks/use-watchlist";
import { QuoteLine } from "@/components/market/quote-line";

export function WatchlistPanel() {
  const t = useTranslations("Market");
  const { symbols, ready, remove } = useWatchlist();

  const { data, error } = useSWR(
    ready && symbols.length > 0 ? ["quotes", ...symbols] : null,
    () => marketApi.quotes(symbols),
    {
      refreshInterval: (latest) => quotesRefreshMs(latest),
      revalidateOnFocus: false,
    },
  );

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

  if (error) {
    return <p className="text-sm text-danger">{t("loadError")}</p>;
  }

  const bySymbol = new Map((data ?? []).map((q) => [q.symbol.toUpperCase(), q]));

  return (
    <ul className="divide-y divide-border overflow-hidden rounded-md border border-border bg-surface">
      {symbols.map((symbol) => {
        const quote = bySymbol.get(symbol.toUpperCase());
        if (!quote) {
          return (
            <li
              key={symbol}
              className="h-14 animate-pulse bg-surface/80 px-3"
            />
          );
        }

        return (
          <QuoteLine
            key={symbol}
            quote={quote}
            href={`/market/${encodeURIComponent(symbol)}`}
            trailing={
              <button
                type="button"
                onClick={() => remove(symbol)}
                className="shrink-0 rounded-md px-2 py-1 text-xs text-muted transition-colors hover:bg-accent-soft hover:text-foreground"
                aria-label={t("watchlistRemove")}
              >
                ×
              </button>
            }
          />
        );
      })}
    </ul>
  );
}
