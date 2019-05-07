const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const configUtils = require('storytailor/out/configuration/configUtils');

const stsConfigPath = "stsconfig.json";
const stsConfig = configUtils.loadConfig(stsConfigPath);

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "out"),
    library: 'sts-webpack-loader',
    libraryTarget: "umd",
  },

  target: "web",
  mode: "development",
  // devtool: "inline-source-map",

  devServer: {
    hot: true,
    inline: true,
    port: 8080,
    open: true
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.sts$/,
        use: [
          {
            loader: path.resolve('./src/stsLoader.js'),
            options: {
              stsConfig: stsConfig
            }
          }
        ],
      },
    ],
  },

  resolve: {
    extensions: [ ".ts", ".js", "tsx", ".sts" ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./webpreview.html"
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
