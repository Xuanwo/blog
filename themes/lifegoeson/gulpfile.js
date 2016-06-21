var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var cleancss = require('gulp-clean-css');
var browserSync = require('browser-sync');

gulp.task('copy-css', function () {
    gulp.src([
        'source/vendors/bootstrap/dist/css/bootstrap.min.css',
        'source/vendors/animate.css/animate.min.css',
        'source/css/style.css',
        'source/vendors/font-awesome/css/font-awesome.min.css'
    ])
        .pipe(cleancss())
        .pipe(gulp.dest('source/dist/css'));
});

gulp.task('copy-js', function () {
    gulp.src([
        'source/vendors/jquery/dist/jquery.min.js',
        'source/vendors/bootstrap/dist/js/bootstrap.min.js',
        'source/js/custom.js',
        'source/vendors/wow/dist/wow.min.js'
    ])
        .pipe(uglify())
        .pipe(gulp.dest('source/dist/js'));
});

gulp.task('copy-fonts', function () {
    gulp.src([
        'source/vendors/font-awesome/fonts/*'
    ])
        .pipe(gulp.dest('source/dist/fonts'));
});

gulp.task('default', function () {
    gulp.run('copy-css');
    gulp.run('copy-js');
    gulp.run('copy-fonts');
})