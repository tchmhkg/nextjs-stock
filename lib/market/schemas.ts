import { z } from "zod";

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

export const chartIntervalSchema = z.enum(["1m", "5m", "15m", "1h", "1d"]);

export const searchQuerySchema = z.string().trim().min(1).max(64);
