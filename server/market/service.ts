import "server-only";
import type {
  ChartDto,
  ChartBarDto,
  NewsItemDto,
  ProfileDto,
  QuoteDto,
  SearchResultDto,
  MarketRegion,
} from "@/lib/market/types";
import { REGION_INDICES } from "@/lib/market/types";
import { TTL, withCache } from "@/server/market/cache";
import yahooFinance from "@/server/market/client";

function mapQuote(raw: Record<string, unknown>): QuoteDto {
  const num = (key: string) => {
    const v = raw[key];
    return typeof v === "number" && Number.isFinite(v) ? v : null;
  };
  const str = (key: string) => {
    const v = raw[key];
    return typeof v === "string" ? v : null;
  };

  return {
    symbol: String(raw.symbol ?? ""),
    shortName: str("shortName"),
    longName: str("longName"),
    currency: str("currency"),
    marketState: str("marketState"),
    regularMarketPrice: num("regularMarketPrice"),
    regularMarketPreviousClose: num("regularMarketPreviousClose"),
    regularMarketOpen: num("regularMarketOpen"),
    regularMarketChange: num("regularMarketChange"),
    regularMarketChangePercent: num("regularMarketChangePercent"),
    regularMarketDayHigh: num("regularMarketDayHigh"),
    regularMarketDayLow: num("regularMarketDayLow"),
    regularMarketVolume: num("regularMarketVolume"),
    averageDailyVolume3Month: num("averageDailyVolume3Month"),
    fiftyTwoWeekHigh: num("fiftyTwoWeekHigh"),
    fiftyTwoWeekLow: num("fiftyTwoWeekLow"),
    marketCap: num("marketCap"),
    trailingPE: num("trailingPE"),
    dividendYield:
      num("trailingAnnualDividendYield") ?? num("dividendYield"),
    bid: num("bid"),
    ask: num("ask"),
    preMarketPrice: num("preMarketPrice"),
    preMarketChange: num("preMarketChange"),
    preMarketChangePercent: num("preMarketChangePercent"),
    postMarketPrice: num("postMarketPrice"),
    postMarketChange: num("postMarketChange"),
    postMarketChangePercent: num("postMarketChangePercent"),
  };
}

function daysAgoIso(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

function chartLookbackDays(interval: string): number {
  switch (interval) {
    case "1m":
      return 1; // one session window — multi-day 1m axes are unreadable
    case "5m":
      return 5;
    case "15m":
    case "1h":
      return 30;
    default:
      return 100;
  }
}

export async function getQuote(symbol: string): Promise<QuoteDto> {
  return withCache(`quote:${symbol.toUpperCase()}`, TTL.quote, async () => {
    const raw = await yahooFinance.quote(symbol);
    return mapQuote(raw as unknown as Record<string, unknown>);
  });
}

export async function getQuotes(symbols: string[]): Promise<QuoteDto[]> {
  const key = `quotes:${symbols.map((s) => s.toUpperCase()).sort().join(",")}`;
  return withCache(key, TTL.quote, async () => {
    const raw = await yahooFinance.quote(symbols);
    const list = Array.isArray(raw) ? raw : [raw];
    return list.map((item) => mapQuote(item as unknown as Record<string, unknown>));
  });
}

export async function getIndices(region: MarketRegion): Promise<QuoteDto[]> {
  const symbols = REGION_INDICES[region];
  return withCache(`indices:${region}`, TTL.indices, () => getQuotes(symbols));
}

export async function getProfile(symbol: string): Promise<ProfileDto> {
  return withCache(`profile:${symbol.toUpperCase()}`, TTL.profile, async () => {
    const summary = await yahooFinance.quoteSummary(symbol, {
      modules: ["assetProfile", "price"],
    });
    const profile = summary.assetProfile;
    const price = summary.price;

    return {
      symbol: symbol.toUpperCase(),
      longName: price?.longName ?? price?.shortName ?? null,
      sector: profile?.sector ?? null,
      industry: profile?.industry ?? null,
      website: profile?.website ?? null,
      summary: profile?.longBusinessSummary ?? null,
      country: profile?.country ?? null,
    };
  });
}

export async function getChart(
  symbol: string,
  interval: "1m" | "5m" | "15m" | "1h" | "1d",
): Promise<ChartDto> {
  const key = `chart:${symbol.toUpperCase()}:${interval}`;
  return withCache(key, TTL.chart, async () => {
    const result = await yahooFinance.chart(symbol, {
      period1: daysAgoIso(chartLookbackDays(interval)),
      interval,
    });

    const bars: ChartBarDto[] = (result.quotes ?? []).map((bar) => ({
      time: Math.floor(new Date(bar.date).getTime() / 1000),
      open: bar.open ?? null,
      high: bar.high ?? null,
      low: bar.low ?? null,
      close: bar.close ?? null,
      volume: bar.volume ?? null,
    }));

    return {
      symbol: symbol.toUpperCase(),
      currency: result.meta?.currency ?? null,
      bars,
    };
  });
}

export async function searchSymbols(query: string): Promise<SearchResultDto[]> {
  return withCache(`search:${query.toLowerCase()}`, TTL.search, async () => {
    const result = await yahooFinance.search(query, { newsCount: 0 });
    const asStr = (value: unknown): string | null =>
      typeof value === "string" ? value : null;

    return (result.quotes ?? [])
      .map((q) => ({
        symbol: asStr(q.symbol),
        shortName: asStr(q.shortname),
        longName: asStr(q.longname),
        exchange: asStr(q.exchDisp) ?? asStr(q.exchange),
        quoteType: asStr(q.quoteType),
      }))
      .filter((q): q is SearchResultDto => Boolean(q.symbol))
      .slice(0, 10);
  });
}

export async function getNews(symbol: string): Promise<NewsItemDto[]> {
  return withCache(`news:${symbol.toUpperCase()}`, TTL.news, async () => {
    const result = await yahooFinance.search(symbol, {
      quotesCount: 0,
      newsCount: 15,
    });

    return (result.news ?? []).map((item) => ({
      id: item.uuid,
      title: item.title,
      publisher: item.publisher ?? null,
      link: item.link,
      publishedAt:
        item.providerPublishTime instanceof Date
          ? item.providerPublishTime.toISOString()
          : new Date(item.providerPublishTime).toISOString(),
    }));
  });
}
