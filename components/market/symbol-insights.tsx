"use client";

import useSWR from "swr";
import { useTranslations } from "next-intl";
import { marketApi } from "@/lib/market/api";
import type { RecommendationPeriodDto } from "@/lib/market/types";
import clsx from "clsx";

type Props = Readonly<{
  symbol: string;
}>;

const REC_KEYS = [
  "strongBuy",
  "buy",
  "hold",
  "sell",
  "strongSell",
] as const;

const REC_COLORS: Record<(typeof REC_KEYS)[number], string> = {
  strongBuy: "bg-emerald-600",
  buy: "bg-teal-500",
  hold: "bg-slate-400",
  sell: "bg-rose-400",
  strongSell: "bg-rose-700",
};

function formatDay(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function currentRec(
  rows: RecommendationPeriodDto[],
): RecommendationPeriodDto | null {
  return rows.find((r) => r.period === "0m") ?? rows[0] ?? null;
}

function RecommendationBar({
  row,
}: Readonly<{ row: RecommendationPeriodDto }>) {
  const t = useTranslations("Market");
  const total = REC_KEYS.reduce((sum, key) => sum + row[key], 0);
  if (total <= 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex h-2.5 overflow-hidden rounded-sm bg-surface">
        {REC_KEYS.map((key) => {
          const n = row[key];
          if (n <= 0) return null;
          const label = t(`rec.${key}`);
          return (
            <div
              key={key}
              className={clsx(REC_COLORS[key])}
              style={{ width: `${(n / total) * 100}%` }}
              title={`${label}: ${n}`}
            />
          );
        })}
      </div>
      <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
        {REC_KEYS.map((key) => (
          <li key={key} className="inline-flex items-center gap-1.5">
            <span
              className={clsx("inline-block h-2 w-2 rounded-sm", REC_COLORS[key])}
            />
            {t(`rec.${key}`)}{" "}
            <span className="font-mono tabular-nums text-foreground">
              {row[key]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CalRow({
  label,
  value,
  hint,
}: Readonly<{ label: string; value: string | null; hint?: string }>) {
  if (!value) return null;
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <dt className="text-muted">{label}</dt>
      <dd className="font-mono tabular-nums text-foreground">
        {value}
        {hint ? (
          <span className="ml-1.5 text-xs font-sans text-muted">{hint}</span>
        ) : null}
      </dd>
    </div>
  );
}

export function SymbolInsights({ symbol }: Props) {
  const t = useTranslations("Market");
  const { data, error, isLoading } = useSWR(
    ["insights", symbol],
    () => marketApi.insights(symbol),
    { revalidateOnFocus: false },
  );

  const cal = data?.calendar;
  const rec = data ? currentRec(data.recommendations) : null;
  const hasCal =
    cal &&
    (cal.earningsDate ||
      cal.exDividendDate ||
      cal.dividendDate ||
      cal.earningsAverage != null);
  const hasRec = rec != null;

  if (error) {
    return (
      <section>
        <h2 className="text-lg font-semibold text-foreground">{t("insights")}</h2>
        <p className="mt-2 text-sm text-danger">{t("loadError")}</p>
      </section>
    );
  }

  if (isLoading && !data) {
    return (
      <section>
        <h2 className="text-lg font-semibold text-foreground">{t("insights")}</h2>
        <div className="mt-3 h-24 animate-pulse rounded-md bg-surface" />
      </section>
    );
  }

  if (!hasCal && !hasRec) return null;

  return (
    <section className="space-y-6">
      {hasCal ? (
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {t("calendar")}
          </h2>
          <dl className="mt-3 space-y-2">
            <CalRow
              label={t("earningsDate")}
              value={formatDay(cal.earningsDate)}
              hint={
                cal.earningsDateEstimate ? t("earningsEstimate") : undefined
              }
            />
            <CalRow
              label={t("epsEstimate")}
              value={
                cal.earningsAverage != null
                  ? cal.earningsAverage.toFixed(2)
                  : null
              }
            />
            <CalRow
              label={t("exDividendDate")}
              value={formatDay(cal.exDividendDate)}
            />
            <CalRow
              label={t("dividendDate")}
              value={formatDay(cal.dividendDate)}
            />
          </dl>
        </div>
      ) : null}

      {hasRec ? (
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {t("recommendations")}
          </h2>
          <p className="mt-1 text-xs text-muted">{t("recommendationsHint")}</p>
          <div className="mt-3">
            <RecommendationBar row={rec} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
