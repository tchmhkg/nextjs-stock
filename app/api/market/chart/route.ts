import { z } from "zod";
import {
  chartBarIntervalSchema,
  chartLookbackSchema,
  symbolSchema,
} from "@/lib/market/schemas";
import {
  effectiveLookbackDays,
  historyChunkDays,
  type ChartLookbackId,
} from "@/lib/market/chart-ranges";
import { jsonOk, upstreamErrorResponse, zodErrorResponse } from "@/server/market/http";
import { getChart } from "@/server/market/service";

const querySchema = z.object({
  symbol: symbolSchema,
  lookback: chartLookbackSchema.default("1D"),
  interval: chartBarIntervalSchema.default("1m"),
  /** Unix seconds — fetch a page of history ending at this time. */
  before: z.coerce.number().int().positive().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    symbol: searchParams.get("symbol"),
    lookback: searchParams.get("lookback") ?? undefined,
    interval: searchParams.get("interval") ?? undefined,
    before: searchParams.get("before") ?? undefined,
  });
  if (!parsed.success) {
    return zodErrorResponse(parsed.error);
  }

  const { symbol, lookback, interval, before } = parsed.data;
  const days = before
    ? historyChunkDays(interval)
    : effectiveLookbackDays(lookback as ChartLookbackId, interval);

  try {
    const data = await getChart(symbol, {
      interval,
      lookbackDays: days,
      before,
    });
    return jsonOk(data);
  } catch (err) {
    return upstreamErrorResponse(err);
  }
}
