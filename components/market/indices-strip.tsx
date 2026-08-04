"use client";

import useSWR from "swr";
import { Link } from "@/i18n/navigation";
import { marketApi } from "@/lib/market/api";
import {
  changeTone,
  formatChange,
  formatPercent,
  formatPrice,
} from "@/lib/market/format";
import type { MarketRegion, QuoteDto } from "@/lib/market/types";
import clsx from "clsx";

type Props = Readonly<{
  region: MarketRegion;
}>;

export function IndicesStrip({ region }: Props) {
  const { data, error, isLoading } = useSWR(
    ["indices", region],
    () => marketApi.indices(region),
    { refreshInterval: 30_000, revalidateOnFocus: false },
  );

  if (error) {
    return (
      <p className="text-sm text-danger">Failed to load indices.</p>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-1">
        {Array.from({ length: region === "US" ? 3 : 1 }).map((_, i) => (
          <div
            key={i}
            className="h-20 min-w-[8.5rem] animate-pulse rounded-md border border-border bg-surface"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      {data.map((quote) => (
        <IndexCard key={quote.symbol} quote={quote} />
      ))}
    </div>
  );
}

function IndexCard({ quote }: Readonly<{ quote: QuoteDto }>) {
  const tone = changeTone(quote.regularMarketChange);

  return (
    <Link
      href={`/market/${encodeURIComponent(quote.symbol)}`}
      className="min-w-[8.5rem] shrink-0 rounded-md border border-border bg-surface px-3 py-2.5 transition-colors hover:border-accent"
    >
      <p className="font-mono text-xs text-muted">{quote.symbol}</p>
      <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-foreground">
        {formatPrice(quote.regularMarketPrice)}
      </p>
      <p className={clsx("mt-0.5 font-mono text-xs tabular-nums", tone)}>
        {formatChange(quote.regularMarketChange)}{" "}
        ({formatPercent(quote.regularMarketChangePercent)})
      </p>
    </Link>
  );
}
