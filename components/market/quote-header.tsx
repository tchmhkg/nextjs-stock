"use client";

import useSWR from "swr";
import { useTranslations } from "next-intl";
import { marketApi } from "@/lib/market/api";
import {
  changeTone,
  formatChange,
  formatDividendYield,
  formatMarketCap,
  formatPercent,
  formatPrice,
  formatVolume,
} from "@/lib/market/format";
import { quoteRefreshMs } from "@/lib/market/session";
import type { QuoteDto } from "@/lib/market/types";
import clsx from "clsx";
import { motion } from "motion/react";

type Props = Readonly<{
  symbol: string;
}>;

function Stat({
  label,
  value,
}: Readonly<{ label: string; value: string }>) {
  return (
    <div>
      <dt className="text-muted">{label}</dt>
      <dd className="font-mono tabular-nums text-foreground">{value}</dd>
    </div>
  );
}

function extendedSession(quote: QuoteDto) {
  if (quote.marketState === "PRE" && quote.preMarketPrice != null) {
    return {
      labelKey: "preMarket" as const,
      price: quote.preMarketPrice,
      change: quote.preMarketChange,
      changePercent: quote.preMarketChangePercent,
    };
  }
  if (
    (quote.marketState === "POST" || quote.marketState === "POSTPOST") &&
    quote.postMarketPrice != null
  ) {
    return {
      labelKey: "postMarket" as const,
      price: quote.postMarketPrice,
      change: quote.postMarketChange,
      changePercent: quote.postMarketChangePercent,
    };
  }
  return null;
}

export function QuoteHeader({ symbol }: Props) {
  const t = useTranslations("Market");
  const { data, error, isLoading } = useSWR(
    ["quote", symbol],
    () => marketApi.quote(symbol),
    {
      refreshInterval: (latest) => quoteRefreshMs(latest?.marketState),
      revalidateOnFocus: false,
    },
  );

  if (error) {
    return <p className="text-sm text-danger">{t("loadError")}</p>;
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-2">
        <div className="h-8 w-40 animate-pulse rounded bg-surface" />
        <div className="h-10 w-56 animate-pulse rounded bg-surface" />
      </div>
    );
  }

  const tone = changeTone(data.regularMarketChange);
  const ext = extendedSession(data);
  const extTone = changeTone(ext?.change);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-mono text-sm text-muted">{data.symbol}</p>
        <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted">
          {t("delayedBadge")}
        </span>
      </div>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {data.longName || data.shortName || data.symbol}
      </h1>
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <motion.p
          key={data.regularMarketPrice ?? 0}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          className="font-mono text-4xl font-semibold tabular-nums text-foreground"
        >
          {formatPrice(data.regularMarketPrice)}
          {data.currency ? (
            <span className="ml-2 text-base font-normal text-muted">
              {data.currency}
            </span>
          ) : null}
        </motion.p>
        <p className={clsx("pb-1 font-mono text-sm tabular-nums", tone)}>
          {formatChange(data.regularMarketChange)} (
          {formatPercent(data.regularMarketChangePercent)})
        </p>
      </div>
      {ext ? (
        <p className={clsx("mt-1 font-mono text-sm tabular-nums", extTone)}>
          {t(ext.labelKey)} {formatPrice(ext.price)} ({formatChange(ext.change)}{" "}
          {formatPercent(ext.changePercent)})
        </p>
      ) : null}
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
        <Stat label={t("open")} value={formatPrice(data.regularMarketOpen)} />
        <Stat
          label={t("dayHigh")}
          value={formatPrice(data.regularMarketDayHigh)}
        />
        <Stat
          label={t("dayLow")}
          value={formatPrice(data.regularMarketDayLow)}
        />
        <Stat
          label={t("prevClose")}
          value={formatPrice(data.regularMarketPreviousClose)}
        />
        <Stat
          label={t("volume")}
          value={formatVolume(data.regularMarketVolume)}
        />
        <Stat
          label={t("avgVolume")}
          value={formatVolume(data.averageDailyVolume3Month)}
        />
        <Stat
          label={t("marketCap")}
          value={formatMarketCap(data.marketCap)}
        />
        <Stat
          label={t("trailingPE")}
          value={
            data.trailingPE != null ? data.trailingPE.toFixed(2) : "—"
          }
        />
        <Stat
          label={t("fiftyTwoWeekHigh")}
          value={formatPrice(data.fiftyTwoWeekHigh)}
        />
        <Stat
          label={t("fiftyTwoWeekLow")}
          value={formatPrice(data.fiftyTwoWeekLow)}
        />
        <Stat
          label={t("dividendYield")}
          value={formatDividendYield(data.dividendYield)}
        />
        <Stat label={t("marketState")} value={data.marketState || "—"} />
      </dl>
    </div>
  );
}
