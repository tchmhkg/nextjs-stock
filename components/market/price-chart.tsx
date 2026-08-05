"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import {
  createChart,
  AreaSeries,
  CandlestickSeries,
  HistogramSeries,
  ColorType,
  type IChartApi,
  type ISeriesApi,
  type LogicalRange,
  type Time,
} from "lightweight-charts";
import { useTranslations } from "next-intl";
import { marketApi } from "@/lib/market/api";
import {
  CHART_LOOKBACK_IDS,
  coerceInterval,
  DEFAULT_INTERVAL,
  DEFAULT_LOOKBACK,
  intervalsForLookback,
  isIntradayInterval,
  preferredStyle,
  refreshMs,
  type ChartIntervalId,
  type ChartLookbackId,
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

type AppliedMeta = { key: string; time: Time; len: number };

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
  return typeof a === "number" && typeof b === "number" && a > b;
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

function mergeBars(a: ChartBarDto[], b: ChartBarDto[]): ChartBarDto[] {
  const map = new Map<number, ChartBarDto>();
  for (const bar of [...a, ...b]) {
    if (Number.isFinite(bar.time)) map.set(bar.time, bar);
  }
  return [...map.values()].sort((x, y) => x.time - y.time);
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
  const [lookback, setLookback] = useState<ChartLookbackId>(DEFAULT_LOOKBACK);
  const [interval, setInterval] = useState<ChartIntervalId>(DEFAULT_INTERVAL);
  const [style, setStyle] = useState<ChartStyle>(preferredStyle(DEFAULT_INTERVAL));
  const [legend, setLegend] = useState<string | null>(null);
  const [bars, setBars] = useState<ChartBarDto[]>([]);
  const [historyExhausted, setHistoryExhausted] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const priceSeriesRef = useRef<
    ISeriesApi<"Area"> | ISeriesApi<"Candlestick"> | null
  >(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const priceStyleRef = useRef<ChartStyle | null>(null);
  const barsRef = useRef<ChartBarDto[]>([]);
  const barsByTimeRef = useRef<Map<number, ChartBarDto>>(new Map());
  const intradayRef = useRef(true);
  const priceAppliedRef = useRef<AppliedMeta | null>(null);
  const volumeAppliedRef = useRef<AppliedMeta | null>(null);
  const loadingHistoryRef = useRef(false);
  const historyExhaustedRef = useRef(false);
  const fitOnNextBarsRef = useRef(true);
  const pendingPreserveRef = useRef<LogicalRange | null>(null);
  const lookbackRef = useRef(lookback);
  const intervalRef = useRef(interval);
  const symbolRef = useRef(symbol);
  const styleRef = useRef(style);

  const allowedIntervals = useMemo(
    () => intervalsForLookback(lookback),
    [lookback],
  );
  const intraday = isIntradayInterval(interval);
  intradayRef.current = intraday;
  lookbackRef.current = lookback;
  intervalRef.current = interval;
  symbolRef.current = symbol;
  styleRef.current = style;

  const { data, error, isLoading } = useSWR(
    ["chart", symbol, lookback, interval],
    () => marketApi.chart(symbol, { lookback, interval }),
    {
      refreshInterval: refreshMs(interval),
      revalidateOnFocus: false,
    },
  );

  useEffect(() => {
    setHistoryExhausted(false);
    historyExhaustedRef.current = false;
    fitOnNextBarsRef.current = true;
    setBars([]);
    barsRef.current = [];
    priceAppliedRef.current = null;
    volumeAppliedRef.current = null;
  }, [symbol, lookback, interval]);

  // Merge live poll into any older pages already loaded (don't wipe history).
  useEffect(() => {
    if (!data) return;
    const incoming = data.bars.filter(
      (b) => b.close != null && Number.isFinite(b.time),
    );
    setBars((prev) => {
      if (!prev.length || fitOnNextBarsRef.current) {
        barsRef.current = incoming;
        return incoming;
      }
      const firstNew = incoming[0]?.time;
      if (firstNew == null) return prev;
      const older = prev.filter((b) => b.time < firstNew);
      const merged = mergeBars(older, incoming);
      barsRef.current = merged;
      return merged;
    });
  }, [data]);

  const applyBarsToChart = useCallback(
    (
      nextBars: ChartBarDto[],
      opts: { fit?: boolean; preserve?: LogicalRange | null },
    ) => {
      const chart = chartRef.current;
      if (!chart) return;

      const filtered = nextBars.filter(
        (b) => b.close != null && Number.isFinite(b.time),
      );
      barsByTimeRef.current = new Map(filtered.map((b) => [b.time, b]));

      const key = `${symbolRef.current}:${lookbackRef.current}:${intervalRef.current}:${styleRef.current}`;
      let didFull = false;
      const markFull = () => {
        didFull = true;
      };

      if (priceStyleRef.current !== styleRef.current || !priceSeriesRef.current) {
        if (priceSeriesRef.current) {
          chart.removeSeries(priceSeriesRef.current);
          priceSeriesRef.current = null;
        }
        priceAppliedRef.current = null;
        if (styleRef.current === "candle") {
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
        priceStyleRef.current = styleRef.current;
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

      if (styleRef.current === "candle") {
        syncSeries(
          priceSeriesRef.current as ISeriesApi<"Candlestick">,
          toCandles(filtered),
          key,
          priceAppliedRef,
          markFull,
        );
      } else {
        syncSeries(
          priceSeriesRef.current as ISeriesApi<"Area">,
          toArea(filtered),
          key,
          priceAppliedRef,
          markFull,
        );
      }
      syncSeries(
        volumeSeriesRef.current,
        toVolume(filtered),
        key,
        volumeAppliedRef,
        markFull,
      );

      if (opts.preserve) {
        chart.timeScale().setVisibleLogicalRange(opts.preserve);
      } else if (opts.fit || didFull) {
        chart.timeScale().fitContent();
      }
    },
    [],
  );

  const loadOlderHistory = useCallback(async () => {
    if (loadingHistoryRef.current || historyExhaustedRef.current) return;
    const oldest = barsRef.current[0];
    if (!oldest) return;

    const chart = chartRef.current;
    const logical = chart?.timeScale().getVisibleLogicalRange() ?? null;
    loadingHistoryRef.current = true;
    setLoadingOlder(true);
    try {
      // Exclusive end so Yahoo does not re-send the same first bar only.
      const page = await marketApi.chart(symbolRef.current, {
        lookback: lookbackRef.current,
        interval: intervalRef.current,
        before: oldest.time,
      });
      const olderOnly = page.bars.filter(
        (b) =>
          b.close != null &&
          Number.isFinite(b.time) &&
          b.time < oldest.time,
      );
      if (!olderOnly.length) {
        historyExhaustedRef.current = true;
        setHistoryExhausted(true);
        return;
      }
      const prevLen = barsRef.current.length;
      const merged = mergeBars(olderOnly, barsRef.current);
      const added = merged.length - prevLen;
      if (added <= 0) {
        historyExhaustedRef.current = true;
        setHistoryExhausted(true);
        return;
      }
      barsRef.current = merged;
      setBars(merged);
      priceAppliedRef.current = null;
      volumeAppliedRef.current = null;
      pendingPreserveRef.current = logical
        ? ({
            from: logical.from + added,
            to: logical.to + added,
          } as LogicalRange)
        : null;
    } catch {
      // leave chart as-is; user can scroll / tap again
    } finally {
      loadingHistoryRef.current = false;
      setLoadingOlder(false);
    }
  }, []);

  const loadOlderHistoryRef = useRef(loadOlderHistory);
  loadOlderHistoryRef.current = loadOlderHistory;

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
        fixLeftEdge: false,
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
      setLegend(
        formatLegend(barsByTimeRef.current.get(tKey), intradayRef.current),
      );
    });

    chart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
      // from < 0 ⇒ scrolled past the first bar into empty space (not initial fit).
      if (range && range.from < 0) {
        void loadOlderHistoryRef.current();
      }
    });

    return () => {
      chart.remove();
      chartRef.current = null;
      priceSeriesRef.current = null;
      volumeSeriesRef.current = null;
      priceStyleRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- create once
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
    if (!chart || !bars.length) return;

    chart.applyOptions({
      localization: {
        timeFormatter: intraday ? intradayCrosshairLabel : dailyCrosshairLabel,
      },
      timeScale: {
        borderVisible: false,
        timeVisible: intraday,
        secondsVisible: false,
        fixLeftEdge: false,
        fixRightEdge: true,
        tickMarkFormatter: intraday ? intradayTickMark : undefined,
      },
    });

    const preserve = pendingPreserveRef.current;
    pendingPreserveRef.current = null;
    const fit = !preserve && fitOnNextBarsRef.current;
    applyBarsToChart(bars, { fit, preserve });
    if (fit) fitOnNextBarsRef.current = false;
  }, [bars, style, intraday, applyBarsToChart]);

  function selectLookback(id: ChartLookbackId) {
    const nextInterval = coerceInterval(id, interval);
    setLookback(id);
    setInterval(nextInterval);
    setStyle(preferredStyle(nextInterval));
  }

  function selectInterval(id: ChartIntervalId) {
    setInterval(id);
    setStyle(preferredStyle(id));
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
            {allowedIntervals.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => selectInterval(id)}
                className={clsx(
                  "rounded px-2.5 font-mono text-xs uppercase transition-colors",
                  interval === id
                    ? "bg-accent text-white dark:text-foreground"
                    : "text-muted hover:text-foreground",
                )}
              >
                {t(`barInterval.${id}`)}
              </button>
            ))}
          </div>
          <div className="inline-flex h-9 flex-wrap items-stretch gap-0.5 rounded-md border border-border bg-surface p-0.5">
            {CHART_LOOKBACK_IDS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => selectLookback(id)}
                className={clsx(
                  "rounded px-2.5 font-mono text-xs uppercase transition-colors",
                  lookback === id
                    ? "bg-accent text-white dark:text-foreground"
                    : "text-muted hover:text-foreground",
                )}
              >
                {t(`lookback.${id}`)}
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="mb-2 text-xs text-muted">{t("chartHint")}</p>
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={loadingOlder || historyExhausted || !bars.length}
          onClick={() => void loadOlderHistoryRef.current()}
          className="rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-xs text-muted transition-colors hover:text-foreground disabled:opacity-40"
        >
          {t("chartLoadOlder")}
        </button>
        {loadingOlder ? (
          <span className="text-xs text-accent">{t("chartLoadingOlder")}</span>
        ) : null}
        {historyExhausted ? (
          <span className="text-xs text-muted">{t("chartHistoryEnd")}</span>
        ) : null}
      </div>

      {error && <p className="mb-2 text-sm text-danger">{t("loadError")}</p>}
      <div className="relative">
        {isLoading && !bars.length && (
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
