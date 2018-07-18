var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

gulp.task("default", ["server"]);

gulp.task("server", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});

gulp.task("copy-html", function() {
    return gulp.src("src/web/*.html")
        .pipe(gulp.dest("dist/web"));
});

gulp.task("copy-css", function() {
    return gulp.src("src/web/styles/*.css")
        .pipe(gulp.dest("dist/web/styles"))
})

gulp.task("spa", ["copy-html", "copy-css"], function() {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/web/app.tsx'],
        cache:{},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('dist/web'))
});