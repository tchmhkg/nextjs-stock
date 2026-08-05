import { z } from "zod";
import { screenerListSchema } from "@/lib/market/schemas";
import { DEFAULT_SCREENER_COUNT } from "@/lib/market/screener";
import { jsonOk, upstreamErrorResponse, zodErrorResponse } from "@/server/market/http";
import { getScreener } from "@/server/market/service";

const querySchema = z.object({
  list: screenerListSchema,
  count: z.coerce.number().int().min(1).max(25).default(DEFAULT_SCREENER_COUNT),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    list: searchParams.get("list"),
    count: searchParams.get("count") ?? undefined,
  });
  if (!parsed.success) {
    return zodErrorResponse(parsed.error);
  }

  try {
    const data = await getScreener(parsed.data.list, parsed.data.count);
    return jsonOk(data);
  } catch (err) {
    return upstreamErrorResponse(err);
  }
}
