const webpack = require('webpack')
const path = require('path');
const slsw = require('serverless-webpack');

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  plugins: [
    new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ }),
  ],
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  optimization: {
    minimize: false,
  },
  target: 'node',
  module: {
    rules: [
      // when webpack resolves our lib folder it does so after the symlink has been resolved, using the real directory
      // path. By excluding anything in node_modules it prevents us from compiling third party libs
      {
        test: (input => !input.includes('node_module') && /.+\.tsx?$/.test(input) === true),
        loader: 'ts-loader',
      },
    ],
  },
};