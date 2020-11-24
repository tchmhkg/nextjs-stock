import {
  API_BASE_URL,
  NEWS_API_KEY,
  FINNHUB_BASE_URL,
  IEX_BASE_URL,
  IEX_API_KEY,
  IEX_SANDBOX_BASE_URL,
  TDA_BASE_URL,
  TDA_CLIENT_ID,
  TIINGO_API_KEY,
  TIINGO_BASE_URL,
  FINNHUB_API_KEY,
} from '~/utils/config';

export const LOGIN_API = API_BASE_URL + '/login';

export const HK_NEWS_API = `${API_BASE_URL}/top-headlines?apiKey=${NEWS_API_KEY}`;

export const getNewsApiByCategory = (category, page) => {
  return `${API_BASE_URL}/top-headlines?country=hk&page=${page}&apiKey=${NEWS_API_KEY}`;
};

export const CANDLES_API = FINNHUB_BASE_URL + '/stock/candle';
export const FINNHUB_QUOTE_API = FINNHUB_BASE_URL + `/quote?token=${FINNHUB_API_KEY}`;
export const FINNHUB_STOCK_PROFILE_API = FINNHUB_BASE_URL + `/stock/profile2?token=${FINNHUB_API_KEY}`;

export const getIntradayPriceApi = (symbol) =>
  IEX_BASE_URL + `/stock/${symbol}/intraday-prices`;
export const getYearPriceApi = (symbol) =>
  IEX_BASE_URL + `/stock/${symbol}/chart/1y`;
export const getAdvancedStatsApi = (symbol) =>
  IEX_SANDBOX_BASE_URL + `/stock/${symbol}/advanced-stats`;

export const TDA_REFRESH_TOKEN_API = TDA_BASE_URL + '/oauth2/token';

export const TDA_QUOTES_API = TDA_BASE_URL + '/marketdata/quotes';

export const getHistPrices = (symbol) => `${TIINGO_BASE_URL}/${symbol}/prices?token=${TIINGO_API_KEY}`;

export const getLatestPrice = (symbol) => `${TIINGO_BASE_URL}/daily/${symbol}/prices?token=${TIINGO_API_KEY}`;

export const getMetaInfo = (symbol) => `${TIINGO_BASE_URL}/daily/${symbol}?token=${TIINGO_API_KEY}`;


// export const getTDARefreshTokenUrl = (token) => {
//   return (
//     TDA_BASE_URL +
//     `/oauth2/token?grant_type=refresh_token&refresh_token=${encodeURIComponent(
//       token,
//     )}&access_type=&code=&client_id=${encodeURIComponent(TDA_CLIENT_ID)}&redirect_uri=`
//   );
// };

// export const getTDARefreshTokenUrl = (token) => {
//   return (
//     TDA_BASE_URL +
//     `/oauth2/token?grant_type=refresh_token&refresh_token=${encodeURIComponent(
//       token,
//     )}&client_id=${encodeURIComponent(TDA_CLIENT_ID)}`
//   );
// };
