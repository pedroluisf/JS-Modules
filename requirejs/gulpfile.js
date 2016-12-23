var gulp = require("gulp"),
    $ = require("gulp-load-plugins")();

var config = {
    scripts: {
        prod: {
            src: ["./public/scripts/*.js", "!./public/scripts/_vendor.js"],
            dest: "./public/bundle",
            mainConfigFile: "./public/config.js",
            vendor: ["jquery", "jquery-ui", "lodash"]
        }
    }
};

gulp.task("dev:scripts", () => {
    return gulp
        .src("./src/scripts/**/*.js")
        .pipe($.babel())
        .pipe(gulp.dest("./public/scripts"));
});

gulp.task("dev:styles", () => {
    return gulp
        .src("./src/styles/site.less")
        .pipe($.less())
        .pipe(gulp.dest("./public/styles"));
});

gulp.task("dev", gulp.parallel("dev:scripts", "dev:styles"));

gulp.task("dev:watch", gulp.series(
    "dev",
    () => {
        gulp.watch("./src/styles/**/*.less", gulp.series("dev:styles"));
        gulp.watch("./src/scripts/**/*.js", gulp.series("dev:scripts"));
    }
));

gulp.task("prod:scripts", gulp.series(
    "dev:scripts",
    // The following will create the bundles from the public folder. We would ideally create a temp build folder and only then bundle from there into public
    gulp.parallel(
        function vendorBundle() {
            return gulp
                .src("./src/scripts/_vendor.js")
                .pipe($.requirejsOptimize({
                    mainConfigFile: config.scripts.prod.mainConfigFile,
                    include: config.scripts.prod.vendor,
                    baseUrl: "./public/scripts"
                }))
                .pipe(gulp.dest(config.scripts.prod.dest));
        },
        function modulesBundle() {
            return gulp
                .src(config.scripts.prod.src)
                .pipe($.requirejsOptimize({
                    mainConfigFile: config.scripts.prod.mainConfigFile,
                    exclude: config.scripts.prod.vendor
                }))
                .pipe(gulp.dest(config.scripts.prod.dest));
        }
    )
));

gulp.task("prod", gulp.parallel("prod:scripts", "dev:styles"));
