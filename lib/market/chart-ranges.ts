import { z } from "zod";
import { chartIntervalSchema } from "@/lib/market/schemas";

/** Presets: short ones use minute/hour bars; long ones use daily. */
export const CHART_RANGE_IDS = [
  "1D",
  "5D",
  "15D",
  "1M",
  "3M",
  "1Y",
  "5Y",
] as const;

export type ChartRangeId = (typeof CHART_RANGE_IDS)[number];

export type ChartInterval = z.infer<typeof chartIntervalSchema>;

export type ChartStyle = "area" | "candle";

export type ChartRangeConfig = Readonly<{
  interval: ChartInterval;
  lookbackDays: number;
  /** Default series style when the range is selected (user can override). */
  preferredStyle: ChartStyle;
  /** Show clock on time axis. */
  intraday: boolean;
  refreshMs: number;
}>;

/** Single source of truth for UI toggles + Yahoo chart fetch. */
export const CHART_RANGES: Record<ChartRangeId, ChartRangeConfig> = {
  "1D": {
    interval: "1m",
    lookbackDays: 1,
    preferredStyle: "area",
    intraday: true,
    refreshMs: 30_000,
  },
  "5D": {
    interval: "5m",
    lookbackDays: 5,
    preferredStyle: "candle",
    intraday: true,
    refreshMs: 60_000,
  },
  "15D": {
    interval: "15m",
    lookbackDays: 15,
    preferredStyle: "candle",
    intraday: true,
    refreshMs: 60_000,
  },
  "1M": {
    interval: "1h",
    lookbackDays: 30,
    preferredStyle: "candle",
    intraday: false,
    refreshMs: 120_000,
  },
  "3M": {
    interval: "1d",
    lookbackDays: 90,
    preferredStyle: "candle",
    intraday: false,
    refreshMs: 120_000,
  },
  "1Y": {
    interval: "1d",
    lookbackDays: 365,
    preferredStyle: "candle",
    intraday: false,
    refreshMs: 300_000,
  },
  "5Y": {
    interval: "1d",
    lookbackDays: 365 * 5,
    preferredStyle: "candle",
    intraday: false,
    refreshMs: 300_000,
  },
};

export const DEFAULT_CHART_RANGE: ChartRangeId = "1D";

export function isChartRangeId(value: string): value is ChartRangeId {
  return (CHART_RANGE_IDS as readonly string[]).includes(value);
}
