import { z } from "zod";
import {
  CHART_INTERVAL_IDS,
  CHART_LOOKBACK_IDS,
} from "@/lib/market/chart-ranges";

export const symbolSchema = z
  .string()
  .trim()
  .min(1)
  .max(24)
  .regex(/^[A-Za-z0-9.^=/_-]+$/, "Invalid symbol");

export const symbolsSchema = z
  .string()
  .trim()
  .min(1)
  .transform((value) =>
    value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  )
  .pipe(z.array(symbolSchema).min(1).max(20));

export const regionSchema = z.enum(["US", "HK"]);

/** @deprecated use chartBarIntervalSchema — kept for any leftover callers */
export const chartIntervalSchema = z.enum([
  "1m",
  "2m",
  "5m",
  "15m",
  "30m",
  "1h",
  "1d",
]);

export const chartLookbackSchema = z.enum(CHART_LOOKBACK_IDS);
export const chartBarIntervalSchema = z.enum(CHART_INTERVAL_IDS);

export { screenerListSchema } from "@/lib/market/screener";

export const searchQuerySchema = z.string().trim().min(1).max(64);
