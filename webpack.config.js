var path = require('path');

module.exports = {
  entry: './src/jukegen.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'jukegen.js',
    library: 'jukeGen',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  devServer: {
    contentBase: './dist'
  },
};
