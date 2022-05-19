const HtmlWebpackPlugin = require('html-webpack-plugin')
const { resolve } = require('path')
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const isDev = process.env.NODE_ENV !== 'production'

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: {
    main: [
      // 'webpack-plugin-serve/client',
      resolve(__dirname, './src/index.tsx'),
    ],
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'babel-loader',
        include: resolve(__dirname, 'src'),
      },
    ],
  },
  devServer: {
    client: { overlay: false },
    static: {
      directory: resolve(__dirname, './dist'),
    },
    hot: true,
    port: 3020,
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  plugins: [
    isDev && new ReactRefreshPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, './public/template.html'),
      filename: './index.html',
    }),
  ].filter(Boolean),
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'bundle.[name].js',
    publicPath: '/',
  },
}
