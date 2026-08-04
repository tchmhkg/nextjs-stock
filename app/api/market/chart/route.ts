import { z } from "zod";
import { chartIntervalSchema, symbolSchema } from "@/lib/market/schemas";
import { jsonOk, upstreamErrorResponse, zodErrorResponse } from "@/server/market/http";
import { getChart } from "@/server/market/service";

const querySchema = z.object({
  symbol: symbolSchema,
  interval: chartIntervalSchema.default("1d"),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    symbol: searchParams.get("symbol"),
    interval: searchParams.get("interval") ?? undefined,
  });
  if (!parsed.success) {
    return zodErrorResponse(parsed.error);
  }

  try {
    const data = await getChart(parsed.data.symbol, parsed.data.interval);
    return jsonOk(data);
  } catch (err) {
    return upstreamErrorResponse(err);
  }
}
