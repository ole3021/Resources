var gulp = require('gulp');
var browserify = require('gulp-browserify');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var wrap = require('gulp-wrap');
var handlebars = require('gulp-handlebars');

var onError = function (err) {
	gutil.beep();
	console.log(err);
};

gulp.task('js', function() {
	gulp.src('./frontend/js/main.js')
	.pipe(plumber({
		errorHandler: onError
	}))
	.pipe(browserify())
	.pipe(rename('scripts.js'))
	.pipe(gulp.dest('./frontend/build'))
	.pipe(uglify())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('./frontend/build'));
});

gulp.task('less', function() {
	gulp.src('./frontend/less/main.less')
	.pipe(less())
	.pipe(gulp.dest('./frontend/build'))
	.pipe(rename({suffix: '.min'}))
    .pipe(minifyCSS({keepBreaks:false}))
    .pipe(gulp.dest('./frontend/build'));
});

gulp.task('templates', function() {
    gulp.src('./frontend/templates/**/*.html')
    .pipe(handlebars())
    .pipe(wrap('this[\'<%= file.path.replace(\'.js\', \'\').replace(\'' + __dirname + '\', \'\') %>\'] = Handlebars.template(<%= contents %>)'))
    .pipe(concat('templates.js'))
    .pipe(wrap('var Handlebars = require(\'handlebars\');\nmodule.exports = function() { <%= contents %> }'))
    .pipe(gulp.dest('./frontend/build'));
});

gulp.task('watchers-js', function() {
	gulp.watch('./frontend/js/**/*.js', ['js']);
});

gulp.task('watchers-less', function() {
	gulp.watch('./frontend/less/**/*.less', ['less']);
});

gulp.task('watchers-templates', function() {
	gulp.watch('./frontend/templates/**/*.html', ['templates']);
});

gulp.task('default', ['templates', 'js', 'less', 'watchers-js', 'watchers-less', 'watchers-templates']);
