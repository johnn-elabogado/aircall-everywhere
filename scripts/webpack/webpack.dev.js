const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = () => {
  let _mode = null;
  let _output = null;

  const _entry = {
    demo: [path.join(__dirname, '../../demo/demo.js')]
  };

  const _devtool = 'source-map';

  const _target = 'web';

  const _context = __dirname;

  const _resolve = {
    modules: ['node_modules', path.resolve(__dirname, '../../src/javascripts')],
    extensions: ['.js']
  };

  const _plugins = [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: true,
      template: path.join(__dirname, '../../demo/index.html'),
      chunks: ['demo'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    })
  ];

  const _module = {
    rules: [
      {
        test: /\.jsx?$/,
        include: [path.resolve(__dirname, '../src')],
        enforce: 'pre',
        enforce: 'post',

        loader: 'babel-loader',

        options: {
          presets: ['env']
        }
      }
    ]
  };

  _output = {
    path: path.resolve(__dirname, '../../demo_dist'),
    filename: 'main.js'
  };

  _mode = 'development';

  return {
    entry: _entry,
    output: _output,
    module: _module,
    resolve: _resolve,
    devtool: _devtool,
    plugins: _plugins,
    mode: _mode,
    target: _target,
    context: _context
  };
};
