
"use strict"

const { src, dest } = require("gulp");
const gulp = require("gulp");

const autoprefixer = require("gulp-autoprefixer");
const cssbeautify = require("gulp-cssbeautify");
const removeComments = require("gulp-strip-css-comments");
const rename = require("gulp-rename");
const sass = require('gulp-sass')(require("sass"));
const cssnano = require("gulp-cssnano");
const uglify = require("gulp-uglify");
const plumber = require("gulp-plumber");
const panini = require("panini");
const rigger = require("gulp-rigger")
const imagemin = require("gulp-imagemin");
const del = require("del");
const sourcemaps = require('gulp-sourcemaps');
const notify = require("gulp-notify");
const browserSync = require('browser-sync').create();

const babel = require('gulp-babel');


//Paths

const srcPath = "src/";
const distPath = "dist/";


const path = {
    build: {
        html: distPath,
        css: distPath + "assets/css/",
        js: distPath + "assets/js/",
        images: distPath + "assets/images/",
        fonts: distPath + "assets/fonts/"
    },
    src: {
        html: srcPath + "*.html",
        css: srcPath + "assets/scss/*.scss",
        js: srcPath + "assets/js/*.js",
        images: srcPath + "assets/images/**/*.{jpeg,png,svg,ico,webp}",
        fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}"
    },
    watch: {
        html: srcPath + "**/*.html",
        css: srcPath + "assets/scss/**/*.scss",
        js: srcPath + "assets/js/**/*.js",
        images: srcPath + "assets/images/**/*.{jpeg,png,svg,ico,webp,jpg}",
        fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}"
    },
    clean: "./" + distPath
}

function localServer() {
    browserSync.init({
        server: {
            baseDir: "./" + distPath
        }
    })
}

function html() {
    panini.refresh()
    return src(path.src.html, { base: srcPath })
        .pipe(plumber())
        .pipe(panini({
            root: srcPath,
            layouts: srcPath + "templates/layouts",
            partials: srcPath + "templates/partials"
        }))
        .pipe(dest(path.build.html))
        .pipe(browserSync.reload({ stream: true }))
}

function css() {
    return src([path.src.css, '!src/assets/scss/**/_*.scss'], { base: srcPath + "assets/scss/" })
        .pipe(sourcemaps.init())
        .pipe(plumber({
            errorHandler: function (err) {
                notify.onError({
                    title: "SCSS ERROR",
                    message: "Error :<% error.message %>"
                })(err);
                this.emit('end');
            }
        }))
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cssbeautify())
        .pipe(dest(path.build.css))
        .pipe(cssnano({
            zindex: false,
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(removeComments())
        .pipe(rename({
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(dest(path.build.css))
        .pipe(browserSync.reload({ stream: true }));
}

function js() {
    return src(path.src.js, { base: srcPath + "assets/js/" })
        .pipe(plumber({
            errorHandler: function (err) {
                notify.onError({
                    title: "JS ERROR",
                    message: "Error :<% error.message %>"
                })(err);
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(rigger())
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min",
            extname: ".js"
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(path.build.js))
        .pipe(browserSync.reload({ stream: true }));
}

function images() {
    return src(path.src.images, { base: srcPath + "assets/images/" })
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.mozjpeg({ quality: 80, progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
                plugins: [
                    {
                        name: 'removeViewBox',
                        active: true
                    },
                    {
                        name: 'cleanupIDs',
                        active: false
                    }
                ]
            })
        ]))
        .pipe(dest(path.build.images))
        .pipe(browserSync.reload({ stream: true }))


}

function fonts() {
    return src(path.src.fonts, { base: srcPath + "assets/fonts/" })
        .pipe(browserSync.reload({ stream: true }))


}

function clean() {
    return del(path.clean)

}
function watchFiles() {
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)
    gulp.watch([path.watch.images], images)
    gulp.watch([path.watch.fonts], fonts)

}

const build = gulp.series(clean, gulp.parallel(html, css, js, images, fonts))
const watch = gulp.parallel(build, watchFiles, localServer)

// exports.html = html;
// exports.css = css;
// exports.js = js;
// exports.images = images;
// exports.fonts = fonts;
// exports.clean = clean;
exports.build = build;
exports.watch = watch;

exports.default = watch;