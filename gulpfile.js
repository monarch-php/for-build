'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    fileinclude = require('gulp-file-include'),
    cssmin = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    importCss = require('gulp-import-css');

var path = {
    build: {
        footerHtml: 'src/templates/',
        html: 'build/',
        js: 'build/js/',
        sassToCss: 'src/style/css/',
        css: 'build/css/',
        img: 'build/images/',
        fontAwesome: 'build/fonts/',
        fonts: 'build/fonts/'
    },
    src: {
        footerHtml: 'src/templates/footer-files/footer.html',
        html: 'src/*.html',
        js: 'src/js/main.js',
        sassToCss: 'src/style/sass/app-total.scss',
        css: 'src/style/main.css',
        img: 'src/images/**/*.*',
        fontAwesome: 'bower_components/fontawesome/fonts/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        footerHtml: 'src/templates/footer-files/footer-parts/*.html',
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        sassToCss: 'src/style/sass/**/*.scss',
        css: 'src/style/css/*.css',
        img: 'src/images/**/*.*',
        fontAwesome: 'bower_components/fontawesome/fonts/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

gulp.task('footerHtml:build', function () {
    gulp.src(path.src.footerHtml) // Select files on the necessary path
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(path.build.footerHtml)); // Place the finished file in the builder
});

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(path.build.html));
});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js));
});

gulp.task('sassToCss:build', function () {
    gulp.src(path.src.sassToCss)
        .pipe(sass())
        .pipe(gulp.dest(path.build.sassToCss));
});

gulp.task('css:build', function () {
    gulp.src(path.src.css)
        .pipe(sourcemaps.init())
        .pipe(importCss())
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img));
});

gulp.task('fontAwesome:build', function () {
    gulp.src(path.src.fontAwesome)
        .pipe(gulp.dest(path.build.fontAwesome));
});

gulp.task('fonts:build', function () {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

gulp.task('build', [
    'footerHtml:build',
    'html:build',
    'js:build',
    'sassToCss:build',
    'css:build',
    'fontAwesome:build',
    'fonts:build',
    'image:build'
]);

gulp.task('watch', function () {
    watch([path.watch.footerHtml], function (event, cb) {
        gulp.start('footerHtml:build');
    });
    watch([path.watch.html], function (event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.sassToCss], function (event, cb) {
        gulp.start('sassToCss:build');
    });
    watch([path.watch.css], function (event, cb) {
        gulp.start('css:build');
    });
    watch([path.watch.js], function (event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function (event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fontAwesome], function (event, cb) {
        gulp.start('fontAwesome:build');
    });
    watch([path.watch.fonts], function (event, cb) {
        gulp.start('fonts:build');
    });
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'watch']);