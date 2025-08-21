const HtmlWebPackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const webpack = require('webpack');
const path = require('path');
const Dotenv = require('dotenv');
const CopyWebpackPlugin = require('copy-webpack-plugin');

Dotenv.config();

const deps = require('./package.json').dependencies;
const printCompilationMessage = require('./compilation.config.js');

// eslint-disable-next-line no-undef, no-unused-vars
module.exports = (_env, argv = {}) => {
  const isProd =
    argv.mode === 'production' || process.env.NODE_ENV === 'production';

  const PORT = Number(argv.port) || 3000;

  return {
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      // Use REACT_APP_PORT in production builds too
      publicPath: isProd ? `http://localhost:${PORT}/` : '/',
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
      fallback: {
        buffer: require.resolve('buffer'),
      },
    },

    devServer: {
      port: PORT,
      historyApiFallback: true,
      watchFiles: [path.resolve(__dirname, 'src')],
      onListening(devServer) {
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
          resolve: { fullySpecified: false },
        },
        {
          test: /\.(css|s[ac]ss)$/i,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          use: { loader: 'babel-loader' },
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
          react: { singleton: true, requiredVersion: deps.react },
          'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
        },
      }),
      new HtmlWebPackPlugin({
        template: './src/index.html',
      }),
      // Ensure envs are baked into the client bundle
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(process.env),
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'public'),
            to: path.resolve(__dirname, 'dist/public'),
          },
        ],
      }),
    ],
  };
};
