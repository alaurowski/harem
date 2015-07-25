var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    watch = require('gulp-watch'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename');

/* copy views */
gulp.task('copy-views', function () {
    gulp.src(['./application/**/*.html'])
        .pipe(gulp.dest('./public/views'))
});

/* create angular file */
gulp.task('app', function() {
    return gulp.src([
        './application/**/*.js'
    ])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('app.min.js'))
     //   .pipe(uglify())
        .pipe(gulp.dest('public/js'));
});

/* watch files */
gulp.task('watch', function () {
    gulp.watch('./application/**/*.html', ['copy-views']);
    gulp.watch('./application/**/*.js', ['app']);
});

/* build task */
gulp.task('build', ['copy-views', 'app', 'watch']);
