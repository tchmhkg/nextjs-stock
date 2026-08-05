export type QuoteDto = {
  symbol: string;
  shortName: string | null;
  longName: string | null;
  currency: string | null;
  marketState: string | null;
  regularMarketPrice: number | null;
  regularMarketPreviousClose: number | null;
  regularMarketOpen: number | null;
  regularMarketChange: number | null;
  regularMarketChangePercent: number | null;
  regularMarketDayHigh: number | null;
  regularMarketDayLow: number | null;
  regularMarketVolume: number | null;
  averageDailyVolume3Month: number | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
  marketCap: number | null;
  trailingPE: number | null;
  dividendYield: number | null;
  bid: number | null;
  ask: number | null;
  preMarketPrice: number | null;
  preMarketChange: number | null;
  preMarketChangePercent: number | null;
  postMarketPrice: number | null;
  postMarketChange: number | null;
  postMarketChangePercent: number | null;
};

export type ProfileDto = {
  symbol: string;
  longName: string | null;
  sector: string | null;
  industry: string | null;
  website: string | null;
  summary: string | null;
  country: string | null;
};

export type ChartBarDto = {
  time: number; // unix seconds
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  volume: number | null;
};

export type ChartDto = {
  symbol: string;
  currency: string | null;
  bars: ChartBarDto[];
};

export type SearchResultDto = {
  symbol: string;
  shortName: string | null;
  longName: string | null;
  exchange: string | null;
  quoteType: string | null;
};

export type NewsItemDto = {
  id: string;
  title: string;
  publisher: string | null;
  link: string;
  publishedAt: string; // ISO
};

export type MarketRegion = "US" | "HK";

export const REGION_INDICES: Record<MarketRegion, string[]> = {
  US: ["^DJI", "^GSPC", "^IXIC"],
  HK: ["^HSI"],
};
