"use client";

import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import {
  createChart,
  AreaSeries,
  CandlestickSeries,
  HistogramSeries,
  ColorType,
  type IChartApi,
  type ISeriesApi,
  type Time,
} from "lightweight-charts";
import { useTranslations } from "next-intl";
import { marketApi } from "@/lib/market/api";
import {
  CHART_RANGE_IDS,
  CHART_RANGES,
  DEFAULT_CHART_RANGE,
  type ChartRangeId,
  type ChartStyle,
} from "@/lib/market/chart-ranges";
import {
  dailyCrosshairLabel,
  formatChartDayTime,
  formatChartDay,
  intradayCrosshairLabel,
  intradayTickMark,
  asChartDate,
} from "@/lib/market/chart-time";
import { formatPrice, formatVolume } from "@/lib/market/format";
import type { ChartBarDto } from "@/lib/market/types";
import { useTheme } from "@/components/theme-provider";
import clsx from "clsx";

type Props = Readonly<{
  symbol: string;
}>;

type CandlePoint = {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
};

type AreaPoint = { time: Time; value: number };

type VolumePoint = { time: Time; value: number; color: string };

type AppliedMeta = {
  key: string;
  time: Time;
  len: number;
};

function themeColors(isDark: boolean) {
  return {
    text: isDark ? "#8b9aa5" : "#5b6b76",
    grid: isDark ? "#243039" : "#e8eef2",
  };
}

function timeEquals(a: Time, b: Time) {
  return a === b;
}

function timeNewer(a: Time, b: Time) {
  if (typeof a === "number" && typeof b === "number") return a > b;
  return false;
}

function syncSeries<T extends { time: Time }>(
  series: { setData: (data: T[]) => void; update: (bar: T) => void } | null,
  points: T[],
  key: string,
  applied: { current: AppliedMeta | null },
  onFullSet: () => void,
) {
  if (!series || points.length === 0) return;
  const last = points[points.length - 1];
  const prev = applied.current;
  const canUpdate =
    prev != null &&
    prev.key === key &&
    points.length >= prev.len - 1 &&
    points.length <= prev.len + 2 &&
    (timeEquals(last.time, prev.time) || timeNewer(last.time, prev.time));

  if (canUpdate) {
    series.update(last);
  } else {
    series.setData(points);
    onFullSet();
  }
  applied.current = { key, time: last.time, len: points.length };
}

function toCandles(bars: ChartBarDto[]): CandlePoint[] {
  return bars
    .filter(
      (b) =>
        b.open != null &&
        b.high != null &&
        b.low != null &&
        b.close != null &&
        Number.isFinite(b.time),
    )
    .map((b) => ({
      time: b.time as Time,
      open: b.open!,
      high: b.high!,
      low: b.low!,
      close: b.close!,
    }));
}

function toArea(bars: ChartBarDto[]): AreaPoint[] {
  return bars
    .filter((b) => b.close != null && Number.isFinite(b.time))
    .map((b) => ({ time: b.time as Time, value: b.close! }));
}

/** One volume point per price bar so the pane stays aligned (null vol → 0). */
function toVolume(bars: ChartBarDto[]): VolumePoint[] {
  const out: VolumePoint[] = [];
  let prevClose: number | null = null;
  for (const b of bars) {
    if (!Number.isFinite(b.time) || b.close == null) continue;
    const up = prevClose == null || b.close >= prevClose;
    out.push({
      time: b.time as Time,
      value: b.volume ?? 0,
      color: up ? "rgba(5, 150, 105, 0.5)" : "rgba(225, 29, 72, 0.5)",
    });
    prevClose = b.close;
  }
  return out;
}

function formatLegend(
  bar: ChartBarDto | undefined,
  intraday: boolean,
): string | null {
  if (!bar) return null;
  const date = asChartDate(bar.time as Time);
  const when = date
    ? intraday
      ? formatChartDayTime(date)
      : formatChartDay(date)
    : "";
  const parts = [
    when,
    bar.open != null ? `O ${formatPrice(bar.open)}` : null,
    bar.high != null ? `H ${formatPrice(bar.high)}` : null,
    bar.low != null ? `L ${formatPrice(bar.low)}` : null,
    bar.close != null ? `C ${formatPrice(bar.close)}` : null,
    bar.volume != null ? `V ${formatVolume(bar.volume)}` : null,
  ].filter(Boolean);
  return parts.join(" · ");
}

export function PriceChart({ symbol }: Props) {
  const t = useTranslations("Market");
  const { theme, mounted } = useTheme();
  const [range, setRange] = useState<ChartRangeId>(DEFAULT_CHART_RANGE);
  const [style, setStyle] = useState<ChartStyle>(
    CHART_RANGES[DEFAULT_CHART_RANGE].preferredStyle,
  );
  const [legend, setLegend] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const priceSeriesRef = useRef<
    ISeriesApi<"Area"> | ISeriesApi<"Candlestick"> | null
  >(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const priceStyleRef = useRef<ChartStyle | null>(null);
  const barsByTimeRef = useRef<Map<number, ChartBarDto>>(new Map());
  const rangeConfigRef = useRef(CHART_RANGES[range]);
  const priceAppliedRef = useRef<AppliedMeta | null>(null);
  const volumeAppliedRef = useRef<AppliedMeta | null>(null);

  const config = CHART_RANGES[range];
  rangeConfigRef.current = config;

  const { data, error, isLoading } = useSWR(
    ["chart", symbol, range],
    () => marketApi.chart(symbol, range),
    {
      refreshInterval: config.refreshMs,
      revalidateOnFocus: false,
    },
  );

  useEffect(() => {
    if (!containerRef.current || chartRef.current) return;

    const colors = themeColors(theme === "dark");
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
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
        lockVisibleTimeRangeOnResize: true,
      },
      crosshair: {
        vertLine: { labelVisible: true },
        horzLine: { labelVisible: true },
      },
    });

    chartRef.current = chart;

    chart.subscribeCrosshairMove((param) => {
      if (param.time === undefined) {
        setLegend(null);
        return;
      }
      const tKey =
        typeof param.time === "number"
          ? param.time
          : typeof param.time === "string"
            ? Date.parse(param.time) / 1000
            : Date.UTC(param.time.year, param.time.month - 1, param.time.day) /
              1000;
      const bar = barsByTimeRef.current.get(tKey);
      setLegend(formatLegend(bar, rangeConfigRef.current.intraday));
    });

    return () => {
      chart.remove();
      chartRef.current = null;
      priceSeriesRef.current = null;
      volumeSeriesRef.current = null;
      priceStyleRef.current = null;
      priceAppliedRef.current = null;
      volumeAppliedRef.current = null;
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

    const bars = data.bars.filter(
      (b) => b.close != null && Number.isFinite(b.time),
    );
    barsByTimeRef.current = new Map(bars.map((b) => [b.time, b]));

    chart.applyOptions({
      localization: {
        timeFormatter: config.intraday
          ? intradayCrosshairLabel
          : dailyCrosshairLabel,
      },
      timeScale: {
        borderVisible: false,
        timeVisible: config.intraday,
        secondsVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
        tickMarkFormatter: config.intraday ? intradayTickMark : undefined,
      },
    });

    const key = `${symbol}:${range}:${style}`;
    let fit = false;
    const markFit = () => {
      fit = true;
    };

    if (priceStyleRef.current !== style || !priceSeriesRef.current) {
      if (priceSeriesRef.current) {
        chart.removeSeries(priceSeriesRef.current);
        priceSeriesRef.current = null;
      }
      priceAppliedRef.current = null;
      if (style === "candle") {
        priceSeriesRef.current = chart.addSeries(CandlestickSeries, {
          upColor: "#059669",
          downColor: "#e11d48",
          borderUpColor: "#059669",
          borderDownColor: "#e11d48",
          wickUpColor: "#059669",
          wickDownColor: "#e11d48",
        });
      } else {
        priceSeriesRef.current = chart.addSeries(AreaSeries, {
          lineColor: "#0d9488",
          topColor: "rgba(13, 148, 136, 0.35)",
          bottomColor: "rgba(13, 148, 136, 0.02)",
          lineWidth: 2,
        });
      }
      priceStyleRef.current = style;
    }

    if (!volumeSeriesRef.current) {
      volumeSeriesRef.current = chart.addSeries(
        HistogramSeries,
        {
          priceFormat: { type: "volume" },
          priceScaleId: "volume",
          lastValueVisible: false,
          priceLineVisible: false,
        },
        1,
      );
      chart.priceScale("volume", 1).applyOptions({
        scaleMargins: { top: 0.1, bottom: 0 },
        borderVisible: false,
      });
      const panes = chart.panes();
      if (panes[1]) panes[1].setHeight(72);
    }

    if (style === "candle") {
      syncSeries(
        priceSeriesRef.current as ISeriesApi<"Candlestick">,
        toCandles(bars),
        key,
        priceAppliedRef,
        markFit,
      );
    } else {
      syncSeries(
        priceSeriesRef.current as ISeriesApi<"Area">,
        toArea(bars),
        key,
        priceAppliedRef,
        markFit,
      );
    }

    syncSeries(
      volumeSeriesRef.current,
      toVolume(bars),
      key,
      volumeAppliedRef,
      markFit,
    );

    if (fit) chart.timeScale().fitContent();
  }, [data, range, symbol, style, config]);

  function selectRange(id: ChartRangeId) {
    setRange(id);
    setStyle(CHART_RANGES[id].preferredStyle);
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-semibold text-foreground">{t("chart")}</h2>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div className="inline-flex h-9 items-stretch gap-0.5 rounded-md border border-border bg-surface p-0.5">
            {(["area", "candle"] as const).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setStyle(id)}
                className={clsx(
                  "rounded px-2.5 font-mono text-xs uppercase transition-colors",
                  style === id
                    ? "bg-accent text-white dark:text-foreground"
                    : "text-muted hover:text-foreground",
                )}
              >
                {t(`chartStyle.${id}`)}
              </button>
            ))}
          </div>
          <div className="inline-flex h-9 flex-wrap items-stretch gap-0.5 rounded-md border border-border bg-surface p-0.5">
            {CHART_RANGE_IDS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => selectRange(id)}
                title={t(`rangeHint.${id}`)}
                className={clsx(
                  "rounded px-2.5 font-mono text-xs uppercase transition-colors",
                  range === id
                    ? "bg-accent text-white dark:text-foreground"
                    : "text-muted hover:text-foreground",
                )}
              >
                {t(`range.${id}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && <p className="mb-2 text-sm text-danger">{t("loadError")}</p>}
      <div className="relative">
        {isLoading && !data && (
          <div className="absolute inset-0 z-10 animate-pulse rounded-md border border-border bg-surface" />
        )}
        {legend ? (
          <p className="pointer-events-none absolute top-2 left-2 z-10 max-w-[calc(100%-1rem)] truncate font-mono text-[11px] text-muted">
            {legend}
          </p>
        ) : null}
        <div
          ref={containerRef}
          className="h-96 w-full rounded-md border border-border bg-surface"
        />
      </div>
    </div>
  );
}
