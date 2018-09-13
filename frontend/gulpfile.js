'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function() {
  return gulp.src('./src/styles/index.scss')
    .pipe(sourcemaps.init())
    .pipe(sass.sync({
      outputStyle: 'compressed',
      includePaths: [
        './src/styles',
        './node_modules'
      ]
    }).on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./src/styles/css'))
});

gulp.task('sass:watch', function() {
  return gulp.watch('./src/styles/**/*.scss', ['sass']);
});

gulp.task('default', ['sass']);
