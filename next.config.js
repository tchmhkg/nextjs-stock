const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})
const webpack = require('webpack');

module.exports = withPlugins(
    [
      [withBundleAnalyzer],
    ],
    {
        webpack: (config, options) => {
          // Fixes npm packages that depend on `fs` module
          config.node = {
            fs: 'empty',
          }
          config.module.rules.push({
            test: /\.mdx?$/,
            use: 'raw-loader',
          })
          /* config.module.rules.push({
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: '[name].[ext]',
                  // outputPath: 'src/fonts/',
                },
              },
            ],
          }) */
          config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),)
          return config
        },
        env: {
            NEWS_API_KEY: process.env.NEWS_API_KEY,
            FINNHUB_API_KEY: process.env.FINNHUB_API_KEY,
            IEX_API_KEY: process.env.IEX_API_KEY,
            IEX_SANDBOX_API_KEY: process.env.IEX_SANDBOX_API_KEY,
            TDA_CLIENT_ID: process.env.TDA_CLIENT_ID,
            TIINGO_API_KEY: process.env.TIINGO_API_KEY
        },
        images: {
          domains: ['static.finnhub.io'],
        },
    }
);
