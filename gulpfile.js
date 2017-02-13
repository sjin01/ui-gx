var gulp = require('gulp'),
    gutil = require('gulp-util'),
    // compass = require('gulp-compass'),
    sass = require('gulp-sass');
    uglify = require('gulp-uglify'),
    jade = require('gulp-jade'),
    data = require('gulp-data'),
    concat = require('gulp-concat'),
    path = require('path'),
    fs = require('fs'),
    extend = require('extend'),
    amdOptimize = require("amd-optimize"),

    // 前两个都是压缩，任选其一；第三个是重命名
    minifyCss = require('gulp-minify-css'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),

    // 图片压缩
    imagemin = require('gulp-imagemin'),
//del = require('del');
    browserSync = require('browser-sync').create();

var sprity = require('sprity');
var gulpif = require('gulp-if');

var paths = {
   sass: ['src/scss/**/*.scss'],
   js: ['src/js/**/*.js'],
   view: ['src/views/**/*.jade'],
   json: ['src/views/**/*.json'],
   template: ['src/template/**/*.rac'],
   image: ['src/images/**/*.{jpg,jpeg,png,gif}'],
   font: ['src/fonts/**/*.{eot,svg,ttf,woff}']
};
// 开发时节约 时间成本   只监听需要的目录
// var paths = {
//     sass: ['src/scss/**/*.scss'],
//     js: ['src/js/**/*.js'],
//     view: ['src/views/欣港物流/**/*.jade', 'src/views/组件/**/*.jade', 'src/views/layouts/**/*.jade'],
//     json: ['src/views/**/*.json'],
//     template: ['src/template/**/*.rac'],
//     image: ['src/images/**/*.{jpg,jpeg,png,gif}'],
//     font: ['src/fonts/**/*.{otf, eot, svg, ttf, woff, woff2}']
// };

//var commonData = require('./src/base.json');
// --- Basic Tasks ---
gulp.task('sass', function () {
    return gulp.src(paths.sass)
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({extname: '.min.css'}))

        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream({
            once: true
        }));
});

gulp.task('js', function () {
    return gulp.src(paths.js)
        .pipe(gulp.dest('dist/js/'))
        .pipe(amdOptimize('base', {
            baseUrl: 'src/js',
            configFile: "src/js/base.js"
        }).on('error', function (e) {
            gutil.log(e);
            this.emit('end');
        }))
        .pipe(concat('base.js'))
        //.pipe( uglify() )
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest('dist/js/'))
        .pipe(browserSync.stream());
});

gulp.task('views', function () {
    return gulp.src(paths.view, {
            base: "src/views"
        })
        .pipe(data(function (file) {
            var relativePath = file.path.replace(path.resolve(file.base), '');
            var depth = (relativePath.match(new RegExp("\\" + path.sep, "g")) || []).length;
            var relativeRoot = new Array(depth).join('../');
            var dataPath = file.path.replace('.jade', ".json");
            var data = {};
            var isMemberCenter = relativePath.indexOf("memberCenter") == 0;
            var result = {
                relativeRoot: relativeRoot
            };
            if (fs.existsSync(dataPath)) {
                data = require(dataPath);
            }
            extend(result, data, {
                isMemberCenter: isMemberCenter
            });
            return result;
        }))
        .pipe(jade({
            pretty: '\t'
        }).on('error', function (e) {
            gutil.log(e);
            this.emit('end');
        }))
        .pipe(gulp.dest('dist/html/'))
        .pipe(browserSync.stream({
            once: true
        }));
});

gulp.task('fonts', function () {
    return gulp.src(paths.font)
        .pipe(gulp.dest('dist/fonts/'))
        .pipe(browserSync.stream());
});

gulp.task('images', function () {
    return gulp.src(paths.image)
        .pipe(gulp.dest('dist/images/'))
        .pipe(browserSync.stream());
});

gulp.task('templates', function () {
    return gulp.src(paths.template)
        .pipe(gulp.dest('dist/template/'))
        .pipe(browserSync.stream());
});

gulp.task('serve', ['js', 'sass', 'views', 'fonts', 'images', 'templates'], function () {
    browserSync.init({
        server: "./dist",
        directory: true
    });

    gulp.watch(paths.sass, ['sass']);

    gulp.watch(paths.js, ['js']);

    gulp.watch(paths.view, ['views']);

    gulp.watch(paths.image, ['images']);

    gulp.watch(paths.font, ['fonts']);

    gulp.watch(paths.template, ['templates']);

    gutil.log('Start up successful!');
});


// Default Task
gulp.task('default', ['serve']);

// test 压缩css
gulp.task('testCssMini', function () {
    return gulp.src('src/js/**/*.css')
        /*.pipe(
            compass({
                config_file: './config.rb',
                css: 'dist/css',
                sass: 'src/scss'
            }).on('error', function (e) {
                gutil.log(e);
                this.emit('end');
            }))*/
        //.pipe(concat('common-all.css'))
        .pipe(cssnano())
        .pipe(rename({extname: '.min.css'}))

        .pipe(gulp.dest('minified/css'))
        .pipe(browserSync.stream({
            once: true
        }));
});

// 压缩图片到本目录 ** 需要的时候手动跑，建议在 push 之前跑一把。
gulp.task('imageMin', function (){
    return gulp.src('dist/images/**/*.{jpg,jpeg,png,gif}')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images/'));
});

gulp.task('sprity', function () {
    return sprity.src({
        src: ['src/images/gx-icon/**/*.png'],
        cssPath: '../../images/',
        style: '_sprite.scss',
        name: 'sprite',
        prefix: 'gx-icon',
        processor: 'sass',
        template: 'sprity.hbs',
        dimension: [{
            ratio: 1, dpi: 72
        }, {
            ratio: 2, dpi: 192
        }]
    }).pipe(gulpif('*.png', gulp.dest('dist/images/'), gulp.dest('src/scss/common/')));
});