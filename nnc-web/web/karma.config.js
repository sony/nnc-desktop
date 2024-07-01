/* Copyright 2024 Sony Group Corporation. */
/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// Karma configuration
var webpackConfig = require('./test.webpack.config.js');

module.exports = function(config) {
  config.set({
    // Paths
    basePath: '',
    files: [
      {pattern: './src/**/__tests__/*.ts', watch: false},
      './node_modules/phantomjs-polyfill-find-index/findIndex-polyfill.js',
      './node_modules/phantomjs-polyfill-find/find-polyfill.js',
      './node_modules/phantomjs-polyfill-includes/includes-polyfill.js',
      './node_modules/phantomjs-polyfill-object-assign/object-assign-polyfill.js',
      './src/__tests__/fill.js',
      '../editor/console/js/nnabla-corelib-defs.js',
    ],
    exclude: [
    ],

    // Module processing
    preprocessors: {
      './src/**/__tests__/*.ts': ['webpack', 'sourcemap'],
    },

    // Targets
    browsers: ['PhantomJS'],

    // Reporters
    reporters: ['coverage-istanbul'],
    logLevel: config.LOG_INFO,
    colors: true,

    // Test framework configuration
    frameworks: ['jasmine'],

    // Runner configuration
    port: 9876,
    autoWatch: true,
    singleRun: true,
    concurrency: Infinity,

    coverageIstanbulReporter: {
      reports: [ 'text-summary', 'html' ],
      fixWebpackSourcePaths: true
    },

    // Webpack config
    webpack: webpackConfig,
    webpackMiddleware: {
      // stats: 'none',
      stats: 'errors-only',
    },

    browserNoActivityTimeout: 100000
  });
};
