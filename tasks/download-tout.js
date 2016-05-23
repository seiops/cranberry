'use strict';

// Download newest script analytics.js from Google, because link
// https://www.google-analytics.com/analytics.js has set only 2 hours cache
module.exports = function ($, gulp) { return function () {
  return $.download('http://platform.tout.com/sdk.js')
    .pipe(gulp.dest('app/scripts'))
    .pipe($.size({title: 'Copy downloaded sdk.js file to app/scripts dir:'}));
};};
