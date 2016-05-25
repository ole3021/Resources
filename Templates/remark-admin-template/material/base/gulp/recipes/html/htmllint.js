var gulp        = require('gulp');
var htmllint    = require('gulp-html');

// config
var config = require('../../../config.json');

// options
var options = require('../../options/html');

module.exports = function () {
  return gulp.src(config.html + '/**/*.html')
    .pipe(htmllint(options.htmllint))
};
