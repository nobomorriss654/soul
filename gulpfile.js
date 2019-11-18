
const gulp = require("gulp");
const connect = require('gulp-connect');
const del = require('del');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const cleanCss = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const cssver = require('gulp-make-css-url-version');
const revAppend = require('gulp-rev-append');
const minifyHTML = require('gulp-minify-html');
const babel = require('gulp-babel');
gulp.task('build:html', function () {
  return gulp.src('src/**/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(revAppend())
    .pipe(minifyHTML({ quotes: true }))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload())
});
gulp.task('build:js', function () {
  return gulp.src(['src/assets/js/**/*.js', '!src/assets/js/**/*.min.js'])
    .pipe(babel({
      presets: ['@babel/env', ['minify', {
        builtIns: false,
        evaluate: false,
        mangle: false,
      }]]
    }))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(connect.reload())
});
gulp.task('build:js-cp', function () {
  return gulp.src('src/assets/js/**/*.min.js')
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(connect.reload())
});
gulp.task('build:css', function () {
  return gulp.src(['src/assets/**/*.css', 'src/assets/**/*.scss', 'src/assets/**/*.sass'])
    .pipe(sass().on('error', sass.logError))
    .pipe(cssver())
    .pipe(cleanCss())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
    .pipe(gulp.dest('dist/assets'))
    .pipe(connect.reload())
});
gulp.task('build:img', function () {
  return gulp.src('src/assets/img/**')
    .pipe(gulp.dest('dist/assets/img'))
    .pipe(connect.reload())
});

gulp.task('dev-server', function () {
  gulp.watch(['src/**/*.html'], gulp.parallel('build:html'))
  gulp.watch(['src/assets/**/*.js'], gulp.parallel('build:js'))
  gulp.watch(['src/assets/img/**'], gulp.parallel('build:img'))
  gulp.watch(['src/assets/**/*.css', 'src/**/*.scss', 'src/**/*.sass'], gulp.parallel('build:css'))
  return connect.server({
    port: 3000,
    host: '0.0.0.0',
    root: 'dist',
    livereload: true
  });
});
gulp.task('clean', () => del('dist'))

gulp.task('build', gulp.series('clean', gulp.parallel('build:css', 'build:js', 'build:js-cp', 'build:img'), 'build:html'))

gulp.task('dev', gulp.series('build', 'dev-server'))
