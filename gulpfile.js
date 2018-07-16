var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var tsServiceProject = ts.createProject("tsconfig-service.json");

/* gulp.task("default", function() {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/server.ts'],
        cache:{},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('server.js'))
    .pipe(gulp.dest('dist/server'))
}); */
gulp.task("default", ["server"]);

gulp.task("server", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist/clientapp"));
});

gulp.task("service", function () {
    return tsServiceProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist/service"));
});

gulp.task("copy-html", function() {
    return gulp.src("src/clientapp/web/*.html")
        .pipe(gulp.dest("dist/clientapp/web"));
});

gulp.task("spa", ["copy-html"], function() {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/clientapp/web/app.tsx'],
        cache:{},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('dist/clientapp/web'))
});