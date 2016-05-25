var gulp        = require('gulp');
var bootlint    = require('gulp-bootlint');

// config
var config = require('../../../config.json');

// options
var options = require('../../options/html');


module.exports = function () {
  return gulp.src(config.html + '/**/*.html')
    .pipe(bootlint(options.bootlint))
};
