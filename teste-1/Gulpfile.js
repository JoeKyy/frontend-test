var gulp        = require('gulp'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload,
    less = require('gulp-less'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    gutil = require('gulp-util'),
    beep = require('beepbeep'),
    spritesmith  = require('gulp.spritesmith'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    jpegtran = require('imagemin-jpegtran'),
    pngquant = require('imagemin-pngquant')
;

gulp.task('less', function () {
    return gulp.src('assets/less/style.less')
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('assets/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss())
        .pipe(gulp.dest('assets/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('sprite', function() {
    var spriteData =
        gulp.src('./assets/imgs/sprites/*.*')
            .pipe(spritesmith({
                imgOpts: {
                    // Format of the image (inferred from destImg' extension by default) (jpg, png)
                    format: 'png',
                    // Quality of image (gm only)
                    quality: 90
                },
                imgName: 'sprites.png',
                cssFormat: 'less',
                cssName: 'sprites.less',
                algorithm: 'binary-tree',
                cssTemplate: 'less.template.mustache',
                cssVarMap: function(sprite) {
                    sprite.name = sprite.name.replace(/\s/, '_');
                }
            }));

    spriteData.img.pipe(gulp.dest('./assets/imgs/'));
    spriteData.css.pipe(gulp.dest('./assets/less/'));
});

gulp.task('img-compress', () => {
    return gulp.src('assets/imgs/uncompress/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [
                pngquant({optimizationLevel: 3}),
                jpegtran({progressive: true})
            ]
        }))
        .pipe(gulp.dest('assets/imgs/'))
});

gulp.task('default', ['less',  'img-compress',  'browser-sync', 'sprite'], function () {
    gulp.watch("assets/less/**/*.less", ['less']);
    gulp.watch("assets/less/**/**/*.less", ['less']);
    gulp.watch("*.html", ['bs-reload']);
    gulp.watch("assets/js/*.js", ['bs-reload']);
    gulp.watch('./assets/imgs/sprite/*.*', ['sprite']);
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./"
        }
    });
});