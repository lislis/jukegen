var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'jukegen.js',
    library: 'jukeGen',
    libraryTarget: 'umd'
  },
  devServer: {
    contentBase: './dist'
  },
};
