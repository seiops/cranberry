'use strict';
// Fix paths for revision task
module.exports = function($, gulp, merge, order) {
  return function() {
    var baseBundle,
      baseBundleJs,
      indexElement,
      baseBundleElement,
      swToolboxSetup,
      appWebComponent;

    if (order === 'before') {
      baseBundle = gulp.src('dist/elements/base-bundle.js').pipe($.replace(
        '("bootstrap/',
        '("libercus/default/bower_components/platinum-sw/bootstrap/'
      )).pipe(gulp.dest('dist/elements'));

      swToolboxSetup = gulp.src('dist/bower_components/platinum-sw/bootstrap/sw-toolbox-setup.js').pipe($.replace(
        '"../sw-toolbox/sw-toolbox.js',
        '"../../sw-toolbox/sw-toolbox.js'
      )).pipe(gulp.dest('dist/bower_components/platinum-sw/bootstrap'));

      return merge(baseBundle, swToolboxSetup);
    } else if (order === 'after') {
      baseBundleJs = gulp.src('deploy/elements/base-bundle.*.js').pipe($.replace(
        '("../bower_components/platinum-sw/bootstrap/',
        '("bootstrap/'
      )).pipe(gulp.dest('deploy/elements'));

      indexElement = gulp.src('deploy/index.html').pipe($.replace(
        '"bower_components/',
        '"libercus/default/bower_components/'
      )).pipe($.replace('"elements/', '"libercus/default/elements/')).pipe($.replace(
        '"favicon',
        '"libercus/default/favicon'
      )).pipe($.replace('"images/', '"libercus/default/images/')).pipe($.replace(
        '"scripts/',
        '"libercus/default/scripts/'
      )).pipe($.replace('"themes/', '"libercus/default/themes/')).pipe(gulp.dest('deploy'));

      baseBundleElement = gulp.src('deploy/elements/base-bundle.*.html').pipe($.replace(
        '"bower_components/',
        '"libercus/default/bower_components/'
      )).pipe($.replace('"elements/', '"libercus/default/elements/')).pipe($.replace(
        '"images/',
        '"libercus/default/images/'
      )).pipe($.replace('"/images/', '"/libercus/default/images/')).pipe($.replace(
        '"../../images/',
        '"/libercus/default/images/'
      )).pipe($.replace('"scripts/', '"libercus/default/scripts/')).pipe($.replace(
        '"themes/',
        '"libercus/default/themes/'
      )).pipe(gulp.dest('deploy/elements'));

      swToolboxSetup = gulp.src('deploy/bower_components/platinum-sw/bootstrap/sw-toolbox-setup.*.js').pipe(
        $.replace('"../../sw-toolbox/sw-toolbox', '"../sw-toolbox/sw-toolbox')
      ).pipe(gulp.dest('deploy/bower_components/platinum-sw/bootstrap'));

      appWebComponent = gulp.src('deploy/scripts/app.min.*.js').pipe(
        $.replace('bower_components/',
          'libercus/default/bower_components/')
      ).pipe(gulp.dest('deploy/scripts'));

      return merge(baseBundleJs, baseBundleElement, swToolboxSetup, appWebComponent);
    }
  };
};
