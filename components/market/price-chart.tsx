"use client";

import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import {
  createChart,
  AreaSeries,
  CandlestickSeries,
  ColorType,
  type IChartApi,
  type ISeriesApi,
  type Time,
} from "lightweight-charts";
import { useTranslations } from "next-intl";
import { marketApi } from "@/lib/market/api";
import { useTheme } from "@/components/theme-provider";
import clsx from "clsx";

type Interval = "1m" | "1d";

type Props = {
  symbol: string;
};

function themeColors(isDark: boolean) {
  return {
    text: isDark ? "#8b9aa5" : "#5b6b76",
    grid: isDark ? "#243039" : "#e8eef2",
  };
}

export function PriceChart({ symbol }: Props) {
  const t = useTranslations("Market");
  const { theme, mounted } = useTheme();
  const [interval, setInterval] = useState<Interval>("1d");
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | ISeriesApi<"Candlestick"> | null>(
    null,
  );

  const { data, error, isLoading } = useSWR(
    ["chart", symbol, interval],
    () => marketApi.chart(symbol, interval),
    {
      refreshInterval: interval === "1m" ? 60_000 : 120_000,
      revalidateOnFocus: false,
    },
  );

  // Create chart once; update colors on theme change (don't recreate — that blanks series).
  useEffect(() => {
    if (!containerRef.current || chartRef.current) return;

    const isDark = theme === "dark";
    const colors = themeColors(isDark);
    const chart = createChart(containerRef.current, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: colors.text,
      },
      grid: {
        vertLines: { color: colors.grid },
        horzLines: { color: colors.grid },
      },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false },
    });

    chartRef.current = chart;

    return () => {
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- create once on mount
  }, []);

  useEffect(() => {
    if (!mounted || !chartRef.current) return;
    const colors = themeColors(theme === "dark");
    chartRef.current.applyOptions({
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: colors.text,
      },
      grid: {
        vertLines: { color: colors.grid },
        horzLines: { color: colors.grid },
      },
    });
  }, [theme, mounted]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || !data) return;

    if (seriesRef.current) {
      chart.removeSeries(seriesRef.current);
      seriesRef.current = null;
    }

    const bars = data.bars.filter(
      (b) => b.close != null && Number.isFinite(b.time),
    );

    if (interval === "1d") {
      const series = chart.addSeries(CandlestickSeries, {
        upColor: "#059669",
        downColor: "#e11d48",
        borderUpColor: "#059669",
        borderDownColor: "#e11d48",
        wickUpColor: "#059669",
        wickDownColor: "#e11d48",
      });
      series.setData(
        bars
          .filter((b) => b.open != null && b.high != null && b.low != null)
          .map((b) => ({
            time: b.time as Time,
            open: b.open!,
            high: b.high!,
            low: b.low!,
            close: b.close!,
          })),
      );
      seriesRef.current = series;
    } else {
      const series = chart.addSeries(AreaSeries, {
        lineColor: "#0d9488",
        topColor: "rgba(13, 148, 136, 0.35)",
        bottomColor: "rgba(13, 148, 136, 0.02)",
        lineWidth: 2,
      });
      series.setData(
        bars.map((b) => ({
          time: b.time as Time,
          value: b.close!,
        })),
      );
      seriesRef.current = series;
    }

    chart.timeScale().fitContent();
  }, [data, interval]);

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-lg font-semibold text-foreground">{t("chart")}</h2>
        <div className="ml-auto inline-flex h-9 items-stretch gap-0.5 rounded-md border border-border bg-surface p-0.5">
          {(["1m", "1d"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setInterval(value)}
              className={clsx(
                "rounded px-3 font-mono text-xs uppercase transition-colors",
                interval === value
                  ? "bg-accent text-white dark:text-foreground"
                  : "text-muted hover:text-foreground",
              )}
            >
              {t(`interval.${value}`)}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="mb-2 text-sm text-danger">{t("loadError")}</p>}
      <div className="relative">
        {isLoading && !data && (
          <div className="absolute inset-0 z-10 animate-pulse rounded-md border border-border bg-surface" />
        )}
        <div
          ref={containerRef}
          className="h-72 w-full rounded-md border border-border bg-surface"
        />
      </div>
    </div>
  );
}
