import {
  API_BASE_URL,
  NEWS_API_KEY,
  FINNHUB_BASE_URL,
  IEX_BASE_URL,
  IEX_API_KEY,
  IEX_SANDBOX_BASE_URL,
  TDA_BASE_URL,
  TDA_CLIENT_ID,
} from '~/utils/config';

export const LOGIN_API = API_BASE_URL + '/login';

export const HK_NEWS_API = `${API_BASE_URL}/top-headlines?apiKey=${NEWS_API_KEY}`;

export const getNewsApiByCategory = (category, page) => {
  return `${API_BASE_URL}/top-headlines?country=hk&page=${page}&apiKey=${NEWS_API_KEY}`;
};

export const CANDLES_API = FINNHUB_BASE_URL + '/stock/candle';
export const QUOTE_API = FINNHUB_BASE_URL + '/quote';

export const getIntradayPriceApi = (symbol) =>
  IEX_BASE_URL + `/stock/${symbol}/intraday-prices`;
export const getYearPriceApi = (symbol) =>
  IEX_BASE_URL + `/stock/${symbol}/chart/1y`;
export const getAdvancedStatsApi = (symbol) =>
  IEX_SANDBOX_BASE_URL + `/stock/${symbol}/advanced-stats`;

export const TDA_REFRESH_TOKEN_API = TDA_BASE_URL + '/oauth2/token';

export const TDA_QUOTES_API = TDA_BASE_URL + '/marketdata/quotes';

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
