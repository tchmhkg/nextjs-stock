import { z } from "zod";

/** How much history to request (window size). */
export const CHART_LOOKBACK_IDS = [
  "1D",
  "5D",
  "1M",
  "3M",
  "1Y",
  "5Y",
] as const;

export type ChartLookbackId = (typeof CHART_LOOKBACK_IDS)[number];

/** Yahoo chart intervals we expose (no 3m — Yahoo does not offer it). */
export const CHART_INTERVAL_IDS = [
  "1m",
  "2m",
  "5m",
  "15m",
  "30m",
  "1h",
  "1d",
] as const;

export type ChartIntervalId = (typeof CHART_INTERVAL_IDS)[number];

export type ChartStyle = "area" | "candle";

export const LOOKBACK_DAYS: Record<ChartLookbackId, number> = {
  "1D": 1,
  "5D": 5,
  "1M": 30,
  "3M": 90,
  "1Y": 365,
  "5Y": 365 * 5,
};

/** Yahoo caps intraday history; keep requests inside these ceilings. */
export const INTERVAL_MAX_DAYS: Record<ChartIntervalId, number> = {
  "1m": 7,
  "2m": 60,
  "5m": 60,
  "15m": 60,
  "30m": 60,
  "1h": 60,
  "1d": 3650,
};

export const DEFAULT_LOOKBACK: ChartLookbackId = "1D";
export const DEFAULT_INTERVAL: ChartIntervalId = "1m";

export function lookbackDays(id: ChartLookbackId): number {
  return LOOKBACK_DAYS[id];
}

export function isIntradayInterval(interval: ChartIntervalId): boolean {
  return interval !== "1d";
}

export function preferredStyle(interval: ChartIntervalId): ChartStyle {
  return interval === "1m" ? "area" : "candle";
}

export function refreshMs(interval: ChartIntervalId): number {
  if (interval === "1m" || interval === "2m") return 30_000;
  if (interval === "5m" || interval === "15m" || interval === "30m") {
    return 60_000;
  }
  if (interval === "1h") return 120_000;
  return 300_000;
}

/** Intervals that can cover this lookback window. */
export function intervalsForLookback(
  lookback: ChartLookbackId,
): ChartIntervalId[] {
  const days = LOOKBACK_DAYS[lookback];
  return CHART_INTERVAL_IDS.filter((id) => INTERVAL_MAX_DAYS[id] >= days);
}

/** Clamp / pick a valid interval when lookback changes. */
export function coerceInterval(
  lookback: ChartLookbackId,
  interval: ChartIntervalId,
): ChartIntervalId {
  const allowed = intervalsForLookback(lookback);
  if (allowed.includes(interval)) return interval;
  return allowed[allowed.length - 1] ?? "1d";
}

export function effectiveLookbackDays(
  lookback: ChartLookbackId,
  interval: ChartIntervalId,
): number {
  return Math.min(LOOKBACK_DAYS[lookback], INTERVAL_MAX_DAYS[interval]);
}

/** Older-history page size (button load) — larger than the on-screen lookback. */
export function historyChunkDays(interval: ChartIntervalId): number {
  if (interval === "1d") return 365;
  return INTERVAL_MAX_DAYS[interval];
}

/**
 * Earliest unix second Yahoo will serve for this interval (from `now`).
 * Intraday caps are absolute from now — not any N-day window in the past.
 * 1h slack so a full INTERVAL_MAX_DAYS window does not trip Yahoo's edge.
 */
export function chartHistoryFloorSec(
  interval: ChartIntervalId,
  nowMs = Date.now(),
): number {
  const maxSec = INTERVAL_MAX_DAYS[interval] * 86_400;
  const slack = interval === "1d" ? 0 : 3_600;
  return Math.floor((nowMs - (maxSec - slack) * 1000) / 1000);
}

export const chartLookbackSchema = z.enum(CHART_LOOKBACK_IDS);
export const chartBarIntervalSchema = z.enum(CHART_INTERVAL_IDS);
