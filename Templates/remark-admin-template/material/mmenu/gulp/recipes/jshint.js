var gulp         = require('gulp');
var jshint       = require('gulp-jshint');

// config
var config = require('../../config.json');

// options
var options = require('../options/jshint');


module.exports = function () {
  return gulp.src([config.destination.js + '/**/*.js', '!' + config.destination.js + '/**/*.min.js'])
    .pipe(jshint(options))
    .pipe(jshint.reporter('default'))
};
