var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    watch = require('gulp-watch'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    babel = require('gulp-babel');

gulp.task('build-server', function () {
    gulp.src(['./src/server/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        //.pipe(babel())
        .pipe(gulp.dest('./dist/server'))
});

gulp.task('watch', function () {
    gulp.watch('./src/server/**/*.js', ['build-server']);
});

gulp.task('build', ['build-server']);
