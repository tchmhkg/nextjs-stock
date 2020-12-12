const withPWA = require('next-pwa');
const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})
// var DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
const path = require('path');
const webpack = require('webpack');

module.exports = withPlugins(
    [
      [withBundleAnalyzer],
      [withPWA, {
        pwa: {
          disable: process.env.NODE_ENV !== 'production',
          dest: 'public'
        }
      }],
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
          // config.plugins.push(new DuplicatePackageCheckerPlugin())
          config.resolve.alias['@babel/runtime'] = path.resolve(
            __dirname,
            'node_modules',
            '@babel/runtime',
          )
          config.resolve.alias['strip-ansi'] = path.resolve(
            __dirname,
            'node_modules',
            'strip-ansi',
          )
          return config
        },
        env: {
            FINNHUB_API_KEY: process.env.FINNHUB_API_KEY,
            TDA_CLIENT_ID: process.env.TDA_CLIENT_ID,
            TIINGO_API_KEY: process.env.TIINGO_API_KEY
        },
        images: {
          domains: ['static.finnhub.io'],
        },
    }
);
