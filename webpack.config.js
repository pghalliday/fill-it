const path = require('path');

module.exports = {
  entry: {
    background: './src/background/index.js',
    popup: './src/popup/index.js',
    options: './src/options/index.js',
    content: './src/content/index.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  }};
