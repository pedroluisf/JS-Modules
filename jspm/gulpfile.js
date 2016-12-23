var gulp = require("gulp"),
    $ = require("gulp-load-plugins")();
    
gulp.task("dev:styles", () => {
    return gulp
        .src("./src/styles/site.less")
        .pipe($.less())
        .pipe(gulp.dest("./public/styles"));
});

gulp.task("dev:watch", gulp.series(
    "dev:styles",
    () => {
        gulp.watch("./src/styles/**/*.less", gulp.series("dev:styles"));
    }
));