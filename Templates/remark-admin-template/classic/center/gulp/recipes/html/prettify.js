var gulp        = require('gulp');
var plumber     = require('gulp-plumber');
var prettify    = require('gulp-prettify');

// config
var config = require('../../../config.json');

// options
var options = require('../../options/html');

module.exports = function () {
  return gulp.src([config.html + '/**/*.html', config.html + '/**/*.tpl'])
    .pipe(plumber())
    .pipe(prettify(options.prettify))
    .pipe(gulp.dest(config.html));
};
