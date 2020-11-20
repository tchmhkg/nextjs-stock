const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

module.exports = withPlugins(
    [
      [withBundleAnalyzer],
    ],
    {
        env: {
            NEWS_API_KEY: process.env.NEWS_API_KEY,
            FINNHUB_API_KEY: process.env.FINNHUB_API_KEY,
            IEX_API_KEY: process.env.IEX_API_KEY,
            IEX_SANDBOX_API_KEY: process.env.IEX_SANDBOX_API_KEY,
            TDA_CLIENT_ID: process.env.TDA_CLIENT_ID,
            TIINGO_API_KEY: process.env.TIINGO_API_KEY
        }
    }
);
