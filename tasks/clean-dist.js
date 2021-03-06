'use strict';

// Clean dist directory
module.exports = function (del) { return function (cb) {
  return del([
    'dist/bower_components/**/*',
    '!dist/bower_components/webcomponentsjs',
    '!dist/bower_components/webcomponents-platform',
    '!dist/bower_components/webcomponentsjs/webcomponents.js',
    '!dist/bower_components/webcomponentsjs/webcomponents-lite.js',
    '!dist/bower_components/webcomponents-platform/webcomponents-platform.js',
    '!dist/bower_components/fetch',
    '!dist/bower_components/fetch/fetch.js',
    '!dist/bower_components/platinum-sw',
    '!dist/bower_components/platinum-sw/service-worker.js',
    '!dist/bower_components/platinum-sw/bootstrap/**',
    '!dist/bower_components/promise-polyfill',
    '!dist/bower_components/promise-polyfill/Promise.js',
    '!dist/bower_components/promise-polyfill/Promise-Statics.js',
    '!dist/bower_components/sw-toolbox',
    '!dist/bower_components/sw-toolbox/companion.js',
    '!dist/bower_components/sw-toolbox/sw-toolbox.js',
    '!dist/bower_components/sw-toolbox/sw-toolbox.js',
    '!dist/bower_components/zxcvbn',
    '!dist/bower_components/zxcvbn/dist',
    '!dist/bower_components/zxcvbn/dist/zxcvbn.js',
    'dist/elements/*',
    '!dist/elements/*-bundle.{html,js}',
    'dist/scripts/app.js',
    'dist/scripts/routing.js',
    'dist/scripts/**/*.map',
    'dist/themes/*/*.{html,map}',
    'dist/themes/*/fonts/fonts.css'
  ], cb);
};};
