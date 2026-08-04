"use client";

import useSWR from "swr";
import { useTranslations } from "next-intl";
import { marketApi } from "@/lib/market/api";
import {
  changeTone,
  formatChange,
  formatPercent,
  formatPrice,
} from "@/lib/market/format";
import clsx from "clsx";
import { motion } from "motion/react";

type Props = Readonly<{
  symbol: string;
}>;

export function QuoteHeader({ symbol }: Props) {
  const t = useTranslations("Market");
  const { data, error, isLoading } = useSWR(
    ["quote", symbol],
    () => marketApi.quote(symbol),
    { refreshInterval: 15_000, revalidateOnFocus: false },
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

  return (
    <div>
      <p className="font-mono text-sm text-muted">{data.symbol}</p>
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
        </motion.p>
        <p className={clsx("pb-1 font-mono text-sm tabular-nums", tone)}>
          {formatChange(data.regularMarketChange)} (
          {formatPercent(data.regularMarketChangePercent)})
        </p>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-muted">{t("dayHigh")}</dt>
          <dd className="font-mono tabular-nums text-foreground">
            {formatPrice(data.regularMarketDayHigh)}
          </dd>
        </div>
        <div>
          <dt className="text-muted">{t("dayLow")}</dt>
          <dd className="font-mono tabular-nums text-foreground">
            {formatPrice(data.regularMarketDayLow)}
          </dd>
        </div>
        <div>
          <dt className="text-muted">{t("prevClose")}</dt>
          <dd className="font-mono tabular-nums text-foreground">
            {formatPrice(data.regularMarketPreviousClose)}
          </dd>
        </div>
        <div>
          <dt className="text-muted">{t("marketState")}</dt>
          <dd className="font-mono text-foreground">
            {data.marketState || "—"}
          </dd>
        </div>
      </dl>
    </div>
  );
}
