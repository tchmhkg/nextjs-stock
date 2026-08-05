import { z } from "zod";
import { chartIntervalSchema } from "@/lib/market/schemas";

export const CHART_RANGE_IDS = ["1D", "5D", "1M", "3M", "1Y", "5Y"] as const;

export type ChartRangeId = (typeof CHART_RANGE_IDS)[number];

export type ChartInterval = z.infer<typeof chartIntervalSchema>;

export type ChartRangeConfig = Readonly<{
  interval: ChartInterval;
  lookbackDays: number;
  /** Area series for noisy 1m; candles otherwise. */
  style: "area" | "candle";
  /** Show clock on time axis. */
  intraday: boolean;
  refreshMs: number;
}>;

/** Single source of truth for UI toggles + Yahoo chart fetch. */
export const CHART_RANGES: Record<ChartRangeId, ChartRangeConfig> = {
  "1D": {
    interval: "1m",
    lookbackDays: 1,
    style: "area",
    intraday: true,
    refreshMs: 30_000,
  },
  "5D": {
    interval: "5m",
    lookbackDays: 5,
    style: "candle",
    intraday: true,
    refreshMs: 60_000,
  },
  "1M": {
    interval: "1h",
    lookbackDays: 30,
    style: "candle",
    intraday: false,
    refreshMs: 120_000,
  },
  "3M": {
    interval: "1d",
    lookbackDays: 90,
    style: "candle",
    intraday: false,
    refreshMs: 120_000,
  },
  "1Y": {
    interval: "1d",
    lookbackDays: 365,
    style: "candle",
    intraday: false,
    refreshMs: 300_000,
  },
  "5Y": {
    interval: "1d",
    lookbackDays: 365 * 5,
    style: "candle",
    intraday: false,
    refreshMs: 300_000,
  },
};

export const DEFAULT_CHART_RANGE: ChartRangeId = "1D";

export function isChartRangeId(value: string): value is ChartRangeId {
  return (CHART_RANGE_IDS as readonly string[]).includes(value);
}
