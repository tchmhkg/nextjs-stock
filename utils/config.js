export const API_BASE_URL = 'http://newsapi.org/v2';
export const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
export const IEX_BASE_URL = 'https://cloud.iexapis.com/v1';
export const IEX_SANDBOX_BASE_URL = 'https://sandbox.iexapis.com/stable';
export const TDA_BASE_URL = 'https://api.tdameritrade.com/v1';
export const TIINGO_BASE_URL = 'https://api.tiingo.com/iex';

export const NEWS_API_KEY = process.env.NEWS_API_KEY;
export const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
export const IEX_API_KEY = process.env.IEX_API_KEY;
export const IEX_SANDBOX_API_KEY = process.env.IEX_SANDBOX_API_KEY;
export const TDA_CLIENT_ID = process.env.TDA_CLIENT_ID;

export const TDA_LOGIN_URL =
  `https://auth.tdameritrade.com/auth?response_type=code&redirect_uri=https%3A%2F%2Fchmtdsapi.herokuapp.com%2Fauth&client_id=${TDA_CLIENT_ID}%40AMER.OAUTHAP`;

export const TIINGO_API_KEY = process.env.TIINGO_API_KEY;
