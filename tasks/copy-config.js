'use strict';

// Copy configuration
module.exports = function ($, config, gulp, site, environment) { return function () {
  gulp.src('./app/metadata/' + site + '/' + environment + '/config.js')
        .pipe(gulp.dest('./app/metadata/'));
};};