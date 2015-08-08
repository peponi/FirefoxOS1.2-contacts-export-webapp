var gulp = require('gulp');
var server = require('gulp-server-livereload');
 
gulp.task('server', function() {
  gulp.src('app')
    .pipe(server({
      host: '192.168.0.4',
      port: '8000',
      livereload: true,
      directoryListing: false,
      open: false
    }));
});