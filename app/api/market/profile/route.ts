import { symbolSchema } from "@/lib/market/schemas";
import { jsonOk, upstreamErrorResponse, zodErrorResponse } from "@/server/market/http";
import { getProfile } from "@/server/market/service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = symbolSchema.safeParse(searchParams.get("symbol"));
  if (!parsed.success) {
    return zodErrorResponse(parsed.error);
  }

  try {
    const data = await getProfile(parsed.data);
    return jsonOk(data);
  } catch (err) {
    return upstreamErrorResponse(err);
  }
}
