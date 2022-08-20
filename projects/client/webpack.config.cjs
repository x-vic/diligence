const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { resolve } = require('path')
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const isDev = process.env.NODE_ENV !== 'production'

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: {
    main: [
      // 'webpack-plugin-serve/client',
      resolve(__dirname, './src/main.tsx'),
    ],
  },
  mode: 'development',
  devtool: isDev ? 'cheap-source-map' : 'hidden-source-map',
  cache: {
    type: 'filesystem',
    allowCollectingMemory: true,
  },
  stats: isDev ? 'summary' : { assets: true },
  // 监控包体积，过大报错
  // performance: {
  //   hints: 'error',
  // },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'babel-loader',
        include: resolve(__dirname, 'src'),
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ],
  },
  devServer: {
    // 支持 history 路由
    historyApiFallback: true,
    client: { overlay: { errors: true, warnings: false } },
    static: {
      directory: resolve(__dirname, './dist'),
    },
    hot: true,
    port: 3020,
  },
  resolve: {
    alias: {
      src: resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.ts', '.tsx'],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          name: 'chunk-vendors',
          test: /[/]node_modules[/]/,
          priority: 10,
          chunks: 'initial',
        },
        react: {
          name: 'chunk-react',
          priority: 20,
          test: /[/]node_modules[/]_?react(.*)/,
        },
        commons: {
          name: 'chunk-commons',
          minChunks: 2,
          priority: 5,
          chunks: 'initial',
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
    !isDev && new CleanWebpackPlugin(),
    isDev && new ReactRefreshPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, './public/template.html'),
      filename: './index.html',
    }),
    // new webpack.ProgressPlugin(console.info),
  ].filter(Boolean),
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:5].js',
    publicPath: '/',
  },
}
