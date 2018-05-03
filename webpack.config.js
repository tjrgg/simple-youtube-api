const path = require('path');
const defaults = require('lodash.defaultsdeep');

const base = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: 'SimpleYoutubeAPI',
    libraryTarget: 'umd',
  },
};

const prod = defaults({}, base, {
  output: {
    filename: 'sya.min.js',
  },
  mode: 'production',
});

const dev = defaults({}, base, {
  output: {
    filename: 'sya.js',
  },
  mode: 'development',
});

module.exports = [prod, dev];
