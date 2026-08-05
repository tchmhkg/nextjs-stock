import { z } from "zod";
import { chartRangeSchema, symbolSchema } from "@/lib/market/schemas";
import { jsonOk, upstreamErrorResponse, zodErrorResponse } from "@/server/market/http";
import { getChart } from "@/server/market/service";

const querySchema = z.object({
  symbol: symbolSchema,
  range: chartRangeSchema.default("1D"),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    symbol: searchParams.get("symbol"),
    range: searchParams.get("range") ?? undefined,
  });
  if (!parsed.success) {
    return zodErrorResponse(parsed.error);
  }

  try {
    const data = await getChart(parsed.data.symbol, parsed.data.range);
    return jsonOk(data);
  } catch (err) {
    return upstreamErrorResponse(err);
  }
}
