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
import {
  chartHistoryFloorSec,
  type ChartIntervalId,
} from "@/lib/market/chart-ranges";
import {
  DEFAULT_SCREENER_COUNT,
  type ScreenerListId,
} from "@/lib/market/screener";
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

function daysAgoFrom(base: Date, days: number): Date {
  const d = new Date(base);
  d.setUTCDate(d.getUTCDate() - days);
  return d;
}

function mapChartBars(quotes: ReadonlyArray<Record<string, unknown>>): ChartBarDto[] {
  return quotes.map((bar) => ({
    time: Math.floor(new Date(bar.date as Date | string | number).getTime() / 1000),
    open: typeof bar.open === "number" ? bar.open : null,
    high: typeof bar.high === "number" ? bar.high : null,
    low: typeof bar.low === "number" ? bar.low : null,
    close: typeof bar.close === "number" ? bar.close : null,
    volume: typeof bar.volume === "number" ? bar.volume : null,
  }));
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

export async function getScreener(
  list: ScreenerListId,
  count = DEFAULT_SCREENER_COUNT,
): Promise<QuoteDto[]> {
  return withCache(`screener:${list}:${count}`, TTL.screener, async () => {
    const result = await yahooFinance.screener({ scrIds: list, count });
    return (result.quotes ?? []).map((item) =>
      mapQuote(item as unknown as Record<string, unknown>),
    );
  });
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

export type GetChartOpts = Readonly<{
  interval: ChartIntervalId;
  /** Window length in days (already clamped to interval max by caller). */
  lookbackDays: number;
  /**
   * When set, fetch a chunk ending at this unix second (load older history).
   * period2 = before, period1 = before - lookbackDays.
   */
  before?: number;
}>;

export async function getChart(
  symbol: string,
  opts: GetChartOpts,
): Promise<ChartDto> {
  const { interval, lookbackDays, before } = opts;
  const key = before
    ? `chart:${symbol.toUpperCase()}:${interval}:${lookbackDays}:before:${before}`
    : `chart:${symbol.toUpperCase()}:${interval}:${lookbackDays}`;

  return withCache(key, TTL.chart, async () => {
    const floorSec = chartHistoryFloorSec(interval);
    const period2 = before
      ? new Date(before * 1000 - 1000) // exclusive of the first on-screen bar
      : new Date();

    // Yahoo intraday is only the last N days from *now* — not any past window.
    if (Math.floor(period2.getTime() / 1000) <= floorSec) {
      return {
        symbol: symbol.toUpperCase(),
        currency: null,
        bars: [],
      };
    }

    let period1 = daysAgoFrom(period2, lookbackDays);
    const floorDate = new Date(floorSec * 1000);
    if (period1 < floorDate) period1 = floorDate;

    const result = await yahooFinance.chart(symbol, {
      period1,
      period2,
      interval,
    });

    return {
      symbol: symbol.toUpperCase(),
      currency: result.meta?.currency ?? null,
      bars: mapChartBars(
        (result.quotes ?? []) as unknown as ReadonlyArray<Record<string, unknown>>,
      ),
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
