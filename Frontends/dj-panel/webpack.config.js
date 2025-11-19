/* eslint-disable no-undef */
// const HtmlWebPackPlugin = require('html-webpack-plugin'); // Temporarily disabled due to localStorage issue
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const webpack = require('webpack');
const path = require('path');
const Dotenv = require('dotenv');
const CopyWebpackPlugin = require('copy-webpack-plugin');
Dotenv.config();

const deps = require('./package.json').dependencies;

const printCompilationMessage = require('./compilation.config.js');

module.exports = (_env, argv = {}) => {
  const PORT = Number(argv.port) || 3000;

  return {
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      publicPath: '/',
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
      fallback: {
        buffer: require.resolve('buffer'),
      },
    },

    devServer: {
      port: PORT,
      host: '0.0.0.0',
      allowedHosts: 'all',
      historyApiFallback: true,
      watchFiles: [path.resolve(__dirname, 'src')],
      onListening: function (devServer) {
        const port = devServer.server.address().port;
        printCompilationMessage('compiling', port);

        devServer.compiler.hooks.done.tap('OutputMessagePlugin', (stats) => {
          setImmediate(() => {
            if (stats.hasErrors()) {
              printCompilationMessage('failure', port);
            } else {
              printCompilationMessage('success', port);
            }
          });
        });
      },
    },

    module: {
      rules: [
        {
          test: /\.m?js/,
          type: 'javascript/auto',
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.(css|s[ac]ss)$/i,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },

    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      new ModuleFederationPlugin({
        name: 'dj_panel',
        filename: 'remoteEntry.js',
        remotes: {},
        exposes: {},
        shared: {
          ...deps,
          react: {
            singleton: true,
            requiredVersion: deps.react,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: deps['react-dom'],
          },
        },
      }),
      // Temporarily disable HtmlWebPackPlugin to avoid localStorage issue
      // new HtmlWebPackPlugin({
      //   template: './src/index.html',
      //   inject: false,
      //   minify: false,
      // }),
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(process.env),
        'typeof window': JSON.stringify('object'),
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: path.resolve(__dirname, 'public'), to: 'public' },
          { from: path.resolve(__dirname, 'src/index.html'), to: 'index.html' },
        ],
      }),
    ],
  };
};
