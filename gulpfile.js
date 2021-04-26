const {src, dest, watch, parallel, series} = require('gulp');
    browserSync = require('browser-sync').create();
    scss = require('gulp-sass');
    jade = require('gulp-jade');
    concat = require('gulp-concat');
    uglify = require('gulp-uglify-es').default;
    autoprefixer = require('gulp-autoprefixer');
    imagemin = require('gulp-imagemin');
    del = require('del');

//    html PreProc
function jadeProc() {
    return src('app/templates/index.jade')
        .pipe(jade({pretty: true}))
        .pipe(dest('dist/'))
        .pipe(browserSync.stream())
}

//      CSS PreProc
function styles() {
    return src('app/scss/*.scss')
        .pipe(scss())
        // .pipe(concat({outputStyle: 'compressed'}))
        .pipe(autoprefixer({
            overrideBrowserlist: ['last 10 version'],
            grid: true
        }))
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream())
}

//      JS min
function scripts(){
    return src([
        'app/js/**/main.js'
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('dist/js'))
        .pipe(browserSync.stream())
}

//      images min

function images(){
    return src('app/img/*.*')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(dest('dist/img'))
        .pipe(browserSync.stream())
}

//      clean dist
function clean() {
    return del('dist')
}

//      watching
function watching() {
    watch(['app/templates/*.jade'], jadeProc);
    watch(['app/scss/*.scss'], styles)
    watch(['app/js/*.js', '!app/js/main.min.js'], scripts);

}

//      browser sync
function sync() {
    browserSync.init({
        server : {
            baseDir: 'dist/'
        }
    });

}


exports.jadeProc = jadeProc;
exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.sync = sync;
exports.clean = clean;
exports.images = images

exports.cleanSeries = series(clean,images)
exports.default = parallel(jadeProc, styles, scripts, watching, sync, images);


