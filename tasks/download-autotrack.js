'use strict';

// Copy autotrack GA library from bower_components
module.exports = function ($, gulp) { return function () {
  return gulp.src('./app/bower_components/autotrack/autotrack.js')
    .pipe(gulp.dest('app/scripts'))
    .pipe($.size({title: 'Copied autotrack.js file to app/scripts dir:'}));
};};
