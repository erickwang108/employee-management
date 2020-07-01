/* eslint global-require: off, import/no-dynamic-require: off */

import webpack from 'webpack';
import path from 'path';
import merge from 'webpack-merge';
import baseConfig from './base';
import { dependencies } from '../../package.json';
import CheckNodeEnv from '../scripts/CheckNodeEnv';

CheckNodeEnv('development');

const dist = path.join(__dirname, '..', 'dll');

export default merge.smart(baseConfig, {
  context: path.join(__dirname, '..'),

  devtool: 'eval',

  externals: ['fsevents', 'crypto-browserify'],

  module: require('./dev.babel').default.module,

  entry: {
    renderer: Object.keys(dependencies || {}).filter((dependency) => dependency !== '@fortawesome/fontawesome-free'),
  },

  output: {
    library: 'renderer',
    path: dist,
    filename: '[name].dev.dll.js',
    libraryTarget: 'var',
  },

  plugins: [
    new webpack.DllPlugin({
      path: path.join(dist, '[name].json'),
      name: '[name]',
    }),

    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true,
      options: {
        context: path.join(__dirname, '..', 'app'),
        output: {
          path: path.join(__dirname, '..', 'dll'),
        },
      },
    }),
  ],
});
