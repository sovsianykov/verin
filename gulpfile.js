const gulp = require('gulp'),
    sass = require('gulp-sass'),
    prefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    cssmin = require('gulp-minify-css'),
    terser = require('gulp-terser'),
    browserSync = require('browser-sync'),
    del = require('del');

let path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: {
        html: 'src/index.html',
        js: 'src/js/**/*.js',

        css: 'src/styles/style.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        css: 'src/styles/**/*.scss',
        img: 'assets/src/img/**/*.*',
        fonts: 'assets/srs/fonts/**/*.*'
    },
    clean: './build'
};

gulp.task('clean:build', async function () {
    del.sync(path.clean)
});

gulp.task('html:build', function () {
    return gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('img:build', function () {
    return gulp.src(path.src.img)
        .pipe(gulp.dest(path.build.img))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('fonts:build', function () {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

gulp.task('js:build', function () {
    return gulp.src(path.src.js)
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('css:build', function () {
    return gulp.src(path.src.css)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(prefixer({
            overrideBrowsersList: ['last 8 versions']
        }))
        // .pipe(cssmin())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.reload({ stream: true }))
});
gulp.task('webserver', function server() {
    browserSync({
        server: "./build/",
        port: 3000,
        notify: true
    });
});

gulp.task('build',
    gulp.series('clean:build',
        gulp.parallel(
            'html:build',
            'css:build',
            'js:build',
            'fonts:build',
            'img:build'
        )
    )
);

gulp.task('watch', function watch() {
    gulp.watch([path.watch.css], gulp.parallel('css:build'));
    gulp.watch([path.watch.html], gulp.parallel('html:build'));
    gulp.watch([path.watch.js], gulp.parallel('js:build'));
});

gulp.task('default', gulp.series('build', gulp.parallel('webserver', 'watch')));

