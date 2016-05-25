var gulp         = require('gulp');
var csslint      = require('gulp-csslint');

// config
var config = require('../../config.json');

// options
var options = require('../options/csslint');

module.exports = function () {
  return gulp.src([config.destination.css + '/**/*.css', '!' + config.destination.css + '/**/*.min.css'])
    .pipe(csslint(options.csslintrc))
    .pipe(csslint.reporter());
};
