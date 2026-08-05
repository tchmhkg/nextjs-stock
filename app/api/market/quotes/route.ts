import { symbolsSchema } from "@/lib/market/schemas";
import { jsonOk, upstreamErrorResponse, zodErrorResponse } from "@/server/market/http";
import { getQuotes } from "@/server/market/service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = symbolsSchema.safeParse(searchParams.get("symbols"));
  if (!parsed.success) {
    return zodErrorResponse(parsed.error);
  }

  try {
    const data = await getQuotes(parsed.data);
    return jsonOk(data);
  } catch (err) {
    return upstreamErrorResponse(err);
  }
}
