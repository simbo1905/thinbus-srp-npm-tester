
"use strict";

var _      = require('lodash'),
    gulp   = require('gulp'),
    uglify = require('gulp-uglify'),
    //cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename');

var js = [
    './node_modules/thinbus-srp/browser.js'
];

var css = [
    './node_modules/bootstrap/dist/css/bootstrap.css'
];

var fonts = [
    './node_modules/bootstrap/dist/fonts/*.*'
];

gulp.task('copy-js', function () {
    _.forEach(js, function (file, _) {
        gulp.src(file)
            .pipe(gulp.dest('.'))
    });
});

gulp.task('copy-min-js', function () {
    _.forEach(js, function (file, _) {
        gulp.src(file)
            .pipe(uglify())
            .pipe(rename({ extname: '.thinbus.js' }))
            .pipe(gulp.dest('.'))
    });
});

gulp.task('copy-css', function () {
    _.forEach(css, function (file, _) {
        gulp.src(file)
            .pipe(gulp.dest('./wwwroot/css'))
    });
    _.forEach(fonts, function (file, _) {
        gulp.src(file)
            .pipe(gulp.dest('./wwwroot/fonts'))
    });
});

gulp.task('copy-min-css', function () {
    _.forEach(css, function (file, _) {
        gulp.src(file)
            .pipe(cssmin())
            .pipe(rename({ extname: '.min.css' }))
            .pipe(gulp.dest('./wwwroot/css'))
    });
    _.forEach(fonts, function (file, _) {
        gulp.src(file)
            .pipe(gulp.dest('./wwwroot/fonts'))
    });
});

//gulp.task('default', ['copy-js']);
gulp.task('minify', ['copy-min-js']);