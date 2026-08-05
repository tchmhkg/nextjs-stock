"use client";

import useSWR from "swr";
import { useTranslations } from "next-intl";
import { marketApi } from "@/lib/market/api";
import {
  SCREENER_LIST_IDS,
  type ScreenerListId,
} from "@/lib/market/screener";
import { QuoteLine } from "@/components/market/quote-line";

const REFRESH_MS = 60_000;

function MoversList({ list }: Readonly<{ list: ScreenerListId }>) {
  const t = useTranslations("Market");
  const { data, error, isLoading } = useSWR(
    ["screener", list],
    () => marketApi.screener(list),
    { refreshInterval: REFRESH_MS, revalidateOnFocus: false },
  );

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-medium tracking-wide text-muted uppercase">
        {t(`screener.${list}`)}
      </h3>
      {error ? (
        <p className="text-sm text-danger">{t("loadError")}</p>
      ) : isLoading && !data ? (
        <div className="h-48 animate-pulse rounded-md border border-border bg-surface" />
      ) : !data?.length ? (
        <p className="rounded-md border border-dashed border-border px-3 py-6 text-center text-sm text-muted">
          {t("screenerEmpty")}
        </p>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-md border border-border bg-surface">
          {data.map((quote) => (
            <QuoteLine
              key={quote.symbol}
              quote={quote}
              href={`/market/${encodeURIComponent(quote.symbol)}`}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

/** US day gainers / losers / most actives (Yahoo screener). */
export function MoversPanel() {
  const t = useTranslations("Market");

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-baseline gap-2">
        <h2 className="text-sm font-medium tracking-wide text-muted uppercase">
          {t("movers")}
        </h2>
        <span className="text-xs text-muted">{t("moversRegion")}</span>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {SCREENER_LIST_IDS.map((list) => (
          <MoversList key={list} list={list} />
        ))}
      </div>
    </section>
  );
}
