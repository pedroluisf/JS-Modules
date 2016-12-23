var gulp = require("gulp"),
    $ = require("gulp-load-plugins")(),
    browserify = require("browserify"),
    babelify = require("babelify"),
    watchify = require("watchify"),
    source = require("vinyl-source-stream"),
    buffer = require("vinyl-buffer"),
    browserifyCss = require("browserify-css"),
    fse = require("fs-extra"),
    path = require("path"),
    _ = require("lodash");
    
gulp.task("dev:scripts", () => {
    return createBundler(true) // gets the configured bundler
        .bundle() // Returns a simple stream of text
        .pipe(source("bundle.js")) // converts that text stream into a vinyl stream (understood by gulp)
        .pipe(buffer()) // [Optional] Needed for instance to pass it to uglify.js (some plugins accept only buffer stream, others accept text streams)
        .pipe(gulp.dest("./public/build"));
});

gulp.task("prod:scripts", () => {
    return createBundler(false) // gets the configured bundler
        .bundle() // Returns a simple stream of text
        .pipe(source("bundle.js")) // converts that text stream into a vinyl stream (understood by gulp)
        .pipe(buffer()) // Needed to pass it to uglify.js
        .pipe($.uglify())
        .pipe(gulp.dest("./public/build"));
});

gulp.task("dev:styles", () => {
    return gulp
        .src("./src/styles/site.less")
        .pipe($.less())
        .pipe(gulp.dest("./public/styles"));
});

gulp.task("dev", gulp.parallel("dev:scripts", "dev:styles"));

gulp.task("dev:watch", gulp.series(
    "dev:styles", // changed from dev to dev:styles to avoid 2 builds (the normal dev and the watchify buildBundle()
    () => {
        // Styles are still managed via gulp-watch
        gulp.watch("./src/styles/**/*.less", gulp.series("dev:styles"));

        // javascript files are now managed via watchify
        const bundler = createBundler(true); // gets our configured bundler

        // Function that builds it (just like in dev)
        function buildBundle() {
            return bundler.bundle() // Returns a simple stream of text
                .pipe(source("bundle.js")) // converts that text stream into a vinyl stream (understood by gulp)
                .pipe(buffer()) // [Optional] Needed for instance to pass it to uglify.js (some plugins accept only buffer stream, others accept text streams)
                .pipe(gulp.dest("./public/build"));
        }

        const watcher = watchify(bundler); // tells watcher to use our bundler

        // Attach an update event to a new bundle build
        watcher.on("update", () => {
            console.log("building...");
            buildBundle()
        });

        // Attach the done build to an output callback
        watcher.on("time", (buildTimeInMs) => {
            console.log(`Build in ${buildTimeInMs} ms`);
        });

        buildBundle(); // needed because watchify only "watchs" after a build is run
    }
));

// This will bundle everything into a single file.
// We might want to create a differente build for the vendor files and another for the app
// In that case, we would replace the "noParse" config to the following configs:
// 1. "require" config without any application file (for the vendor bundler)
// 2. "exclude" config (for the application bundler)
function createBundler(isDebug) {
    const bundler = browserify("./src/scripts/application.js", {
        debug: isDebug, // debug = true generates sourcemaps
        cache: {}, // [Optional] considerably reduces the build process when watching
        noParse: ["lodash", "jquery", "jquery-ui"] // [Optional] used for performance and for files that have no requires. Normally bundles that are already compiled
    });

    // use babel to transform es2015 into a commonjs module language
    bundler.transform(babelify);

    // use browserify-css to 2work" all css relative resources
    bundler.transform(browserifyCss, {
        global: true, // because browserify does not run globally against node_modules (by default) and we need it because on jquery-ui
        rootDir: "public", // set our public folder as root, so all paths are relative to it
        processRelativeUrl: relativePath => {
            const rootDir = path.resolve(process.cwd(), "public"); // Set our public relative path to an absolute one
            const prefix = path.join("..", "node_modules"); // we use path.join to avoid errors on windows instead of using "..\node_modules"

            // Just look for files that reside on node_modules folder
            if (!_.startsWith(relativePath, prefix)) {
                return relativePath;
            }

            // Replace our "../node_modules" and append a "/vendor/" prefix
            const vendorUrl = "/vendor/" + relativePath.substring(prefix.length);

            const sourceFile = path.join(rootDir, relativePath);
            const destFile = path.join(rootDir, vendorUrl);

            console.log(`${sourceFile} -> ${destFile}`); // get feedback on the files being copied

            fse.copySync(sourceFile, destFile); // Perform the actual copy

            return vendorUrl; // return the newly transformed vendor URL
        }
    });

    return bundler;
}
