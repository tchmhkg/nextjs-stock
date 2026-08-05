"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
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
import { BookmarkButton } from "@/components/market/bookmark-button";
import clsx from "clsx";
import { motion } from "motion/react";

type Props = Readonly<{
  symbol: string;
  /** Page sections below the quote — kept in the sticky containing block. */
  children?: ReactNode;
}>;

/** SiteHeader height (h-14) — sticky offset + IntersectionObserver rootMargin. */
const STICKY_TOP_PX = 56;

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

function StickyQuotePrice({
  quote,
  extLabel,
}: Readonly<{
  quote: QuoteDto;
  extLabel: string | null;
}>) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  const tone = changeTone(quote.regularMarketChange);
  const ext = extendedSession(quote);
  const extTone = changeTone(ext?.change);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { rootMargin: `-${STICKY_TOP_PX}px 0px 0px 0px`, threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const priceBlock = (
    <>
      <motion.p
        key={quote.regularMarketPrice ?? 0}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        className={clsx(
          "font-mono font-semibold tabular-nums text-foreground",
          stuck ? "text-2xl" : "text-3xl sm:text-4xl",
        )}
      >
        {formatPrice(quote.regularMarketPrice)}
        {quote.currency ? (
          <span
            className={clsx(
              "ml-1.5 font-normal text-muted",
              stuck ? "text-sm" : "ml-2 text-base",
            )}
          >
            {quote.currency}
          </span>
        ) : null}
      </motion.p>
      <p
        className={clsx(
          "font-mono tabular-nums",
          stuck ? "text-sm" : "pb-1 text-sm",
          tone,
        )}
      >
        {formatChange(quote.regularMarketChange)} (
        {formatPercent(quote.regularMarketChangePercent)})
      </p>
      {!stuck && ext && extLabel ? (
        <p
          className={clsx(
            "pb-1 font-mono text-xs tabular-nums sm:text-sm",
            extTone,
          )}
        >
          {extLabel} {formatPrice(ext.price)} ({formatChange(ext.change)}{" "}
          {formatPercent(ext.changePercent)})
        </p>
      ) : null}
    </>
  );

  return (
    <>
      <div ref={sentinelRef} className="h-0" aria-hidden />
      <div
        className={clsx(
          "sticky z-40 -mx-4 bg-background/90 px-4 backdrop-blur-md sm:-mx-6 sm:px-6",
          stuck ? "mt-1 border-y border-border/70 py-2" : "mt-1 py-0",
        )}
        style={{ top: STICKY_TOP_PX }}
      >
        {stuck ? (
          <div>
            <p className="font-mono text-xs text-muted">{quote.symbol}</p>
            <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              {priceBlock}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
            {priceBlock}
          </div>
        )}
      </div>
    </>
  );
}

export function QuoteHeader({ symbol, children }: Props) {
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
    return (
      <div>
        <p className="text-sm text-danger">{t("loadError")}</p>
        {children}
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div>
        <div className="space-y-2">
          <div className="h-8 w-40 animate-pulse rounded bg-surface" />
          <div className="h-10 w-56 animate-pulse rounded bg-surface" />
        </div>
        {children}
      </div>
    );
  }

  const ext = extendedSession(data);

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-mono text-sm text-muted">{data.symbol}</p>
            <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted">
              {t("delayedBadge")}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {data.longName || data.shortName || data.symbol}
          </h1>
        </div>
        <BookmarkButton symbol={symbol} />
      </div>

      {/*
        Sticky containing block is this outer <div>, which includes {children}
        (chart / profile / news). Otherwise sticky ends when the header section does.
      */}
      <StickyQuotePrice
        quote={data}
        extLabel={ext ? t(ext.labelKey) : null}
      />

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

      {children ? <div className="mt-10 space-y-10">{children}</div> : null}
    </div>
  );
}
