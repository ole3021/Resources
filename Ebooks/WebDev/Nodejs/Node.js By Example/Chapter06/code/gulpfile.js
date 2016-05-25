var path = require('path');
var gulp = require('gulp');
var less = require('gulp-less');
var rename = require("gulp-rename");
var minifyCSS = require('gulp-minify-css');
var browserify = require('gulp-browserify');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');

var onError = function (err) {
  gutil.beep();
  console.log(err);
};

gulp.task('css', function() {
  return gulp.src('./frontend/less/styles.less')
  .pipe(plumber({
    errorHandler: onError
  }))
  .pipe(less({
    paths: [ path.join(__dirname, 'frontend/less', 'includes') ]
  }))
  .pipe(gulp.dest('./static/css'))
  .pipe(minifyCSS({keepBreaks:true}))
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('./static/css'));
});

gulp.task('watchers', function() {
  gulp.watch('frontend/less/**/*.less', ['css']);
  gulp.watch('frontend/js/**/*.js', ['js']);
  gulp.watch('frontend/tpl/**/*.html', ['templates', 'js']);
});

var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');

gulp.task('js', function() {
  return gulp.src(['./frontend/js/app.js'])
  .pipe(plumber({
    errorHandler: onError
  }))
  .pipe(browserify())
  .pipe(gulp.dest('./static/js'))
  .pipe(uglify())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('./static/js'))
});

var Ractive = require('ractive');
var tap = require('gulp-tap');

gulp.task('templates', function() {
  return gulp.src('./frontend/tpl/**/*.html')
  .pipe(plumber({
    errorHandler: onError
  }))
  .pipe(tap(function(file, t) {
    var precompiled = Ractive.parse(file.contents.toString());
    precompiled = JSON.stringify(precompiled);
    file.contents = new Buffer('module.exports = ' + precompiled);
  }))
  .pipe(rename(function(path) {
    path.extname = '.js';
  }))
  .pipe(gulp.dest('./frontend/tpl'))
});

gulp.task('default', ['css', 'templates', 'js', 'watchers']);