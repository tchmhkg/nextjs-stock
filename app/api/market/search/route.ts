import { searchQuerySchema } from "@/lib/market/schemas";
import { jsonOk, upstreamErrorResponse, zodErrorResponse } from "@/server/market/http";
import { searchSymbols } from "@/server/market/service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = searchQuerySchema.safeParse(searchParams.get("q"));
  if (!parsed.success) {
    return zodErrorResponse(parsed.error);
  }

  try {
    const data = await searchSymbols(parsed.data);
    return jsonOk(data);
  } catch (err) {
    return upstreamErrorResponse(err);
  }
}
