import {
  FINNHUB_BASE_URL,
  TDA_BASE_URL,
  TIINGO_API_KEY,
  TIINGO_BASE_URL,
  FINNHUB_API_KEY,
} from '~/utils/config';

export const FINNHUB_STOCK_PROFILE_API = FINNHUB_BASE_URL + `/stock/profile2?token=${FINNHUB_API_KEY}`;

export const TDA_QUOTES_API = TDA_BASE_URL + '/marketdata/quotes';

export const getLatestPrice = (symbol) => `${TIINGO_BASE_URL}/tiingo/daily/${symbol}/prices?token=${TIINGO_API_KEY}`;

export const getMetaInfo = (symbol) => `${TIINGO_BASE_URL}/tiingo/daily/${symbol}?token=${TIINGO_API_KEY}`;

export const TIINGO_SEARCH_API = `${TIINGO_BASE_URL}/tiingo/utilities/search?token=${TIINGO_API_KEY}`;
