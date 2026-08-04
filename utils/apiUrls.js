import {
  FINNHUB_BASE_URL,
  TDA_BASE_URL,
  TIINGO_API_KEY,
  TIINGO_BASE_URL,
  FINNHUB_API_KEY,
} from '~/utils/config';

export const FINNHUB_STOCK_PROFILE_API = FINNHUB_BASE_URL + `/stock/profile2?token=${FINNHUB_API_KEY}`;

export const FINNHUB_QUOTE_API = FINNHUB_BASE_URL + `/quote?token=${FINNHUB_API_KEY}`;

export const FINNHUB_COMPANY_NEWS_API = FINNHUB_BASE_URL + `/company-news?token=${FINNHUB_API_KEY}`;

export const TDA_QUOTES_API = TDA_BASE_URL + '/marketdata/quotes';

export const getLatestPrice = (symbol) => `${TIINGO_BASE_URL}/tiingo/daily/${symbol}/prices?token=${TIINGO_API_KEY}`;

export const getMetaInfo = (symbol) => `${TIINGO_BASE_URL}/tiingo/daily/${symbol}?token=${TIINGO_API_KEY}`;

export const getDailyPrices = (symbol, startDate) =>
  `${TIINGO_BASE_URL}/tiingo/daily/${symbol}/prices?startDate=${startDate}&token=${TIINGO_API_KEY}`;

export const getIntradayPrices = (symbol, startDate) =>
  `${TIINGO_BASE_URL}/iex/${symbol}/prices?startDate=${startDate}&resampleFreq=1min&columns=open,high,low,close,volume&token=${TIINGO_API_KEY}`;

export const TIINGO_SEARCH_API = `${TIINGO_BASE_URL}/tiingo/utilities/search?token=${TIINGO_API_KEY}`;
