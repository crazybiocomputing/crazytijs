const webpack = require("webpack");
const path = require("path");


let config = {
  entry: "./t8/src/index.js",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "t8.js",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js']
  },
}

module.exports = config;


