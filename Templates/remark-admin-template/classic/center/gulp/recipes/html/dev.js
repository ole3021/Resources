var gulp        = require('gulp');
var hb          = require('gulp-hb');
var frontMatter = require('gulp-front-matter');
var plumber     = require('gulp-plumber');

// config
var config = require('../../../config.json');

// options
var options = require('../../options/html');

module.exports = function () {
  return gulp.src([config.templates.pages + '/**/*.html', config.templates.pages + '/**/*.tpl'])
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(hb(options.hb))
    .pipe(gulp.dest(config.html));
};
