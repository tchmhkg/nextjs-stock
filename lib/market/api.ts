import type {
  ChartDto,
  NewsItemDto,
  ProfileDto,
  QuoteDto,
  SymbolInsightsDto,
} from "@/lib/market/types";
import type { ScreenerListId } from "@/lib/market/screener";

type ApiOk<T> = { success: true; data: T };
type ApiErr = { success: false; error: string };

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const json = (await res.json()) as ApiOk<T> | ApiErr;
  if (!res.ok || !json.success) {
    throw new Error(!json.success ? json.error : `Request failed: ${res.status}`);
  }
  return json.data;
}

export const marketApi = {
  quote: (symbol: string) =>
    getJson<QuoteDto>(`/api/market/quote?symbol=${encodeURIComponent(symbol)}`),
  quotes: (symbols: string[]) =>
    getJson<QuoteDto[]>(
      `/api/market/quotes?symbols=${encodeURIComponent(symbols.join(","))}`,
    ),
  profile: (symbol: string) =>
    getJson<ProfileDto>(
      `/api/market/profile?symbol=${encodeURIComponent(symbol)}`,
    ),
  chart: (
    symbol: string,
    opts: Readonly<{
      lookback: string;
      interval: string;
      before?: number;
    }>,
  ) => {
    const params = new URLSearchParams({
      symbol,
      lookback: opts.lookback,
      interval: opts.interval,
    });
    if (opts.before != null) params.set("before", String(opts.before));
    return getJson<ChartDto>(`/api/market/chart?${params}`);
  },
  news: (symbol: string) =>
    getJson<NewsItemDto[]>(
      `/api/market/news?symbol=${encodeURIComponent(symbol)}`,
    ),
  indices: (region: "US" | "HK") =>
    getJson<QuoteDto[]>(
      `/api/market/indices?region=${encodeURIComponent(region)}`,
    ),
  screener: (list: ScreenerListId) =>
    getJson<QuoteDto[]>(
      `/api/market/screener?list=${encodeURIComponent(list)}`,
    ),
  insights: (symbol: string) =>
    getJson<SymbolInsightsDto>(
      `/api/market/insights?symbol=${encodeURIComponent(symbol)}`,
    ),
};
