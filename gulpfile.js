
"use strict";

var _      = require('lodash'),
    gulp   = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

var js = [
    './node_modules/thinbus-srp/browser.js'
];

gulp.task('copy-min-js', function () {
    _.forEach(js, function (file, _) {
        gulp.src(file)
            .pipe(uglify())
            .pipe(rename({ extname: '.thinbus.js' }))
            .pipe(gulp.dest('.'))
    });
});

gulp.task('minify', ['copy-min-js']);