var gulp       = require('gulp');
var plumber    = require('gulp-plumber');
var header     = require('gulp-header');
var uglify     = require('gulp-uglify');
var rename     = require("gulp-rename");
var concat     = require('gulp-concat');

// config
var config = require('../../../config.json');

// options
var options = require('../../options/scripts');

// components
var components = require('../../../components.json');
var componentsSrc = [];

for(var component in components) {
  if(components[component]){
    componentsSrc.push(config.source.js + '/components/' + component + '.js');
  }
}

module.exports = function () {
  return gulp.src(componentsSrc)
    .pipe(plumber())
    .pipe(concat('components.js'))
    .pipe(header(options.banner))
    .pipe(gulp.dest(config.destination.js))

    .pipe(uglify())
    .pipe(header(options.banner))
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest(config.destination.js));

};
