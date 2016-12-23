"use strict"

var gulp = require("gulp"),
    $ = require("gulp-load-plugins")(),
    webpackConfig = require("./webpack.config.js"),
    webpack = require("webpack"),
    WebpackDevServer = require("webpack-dev-server"),
    ExtractTextPlugin = require("extract-text-webpack-plugin");

function createDevConfig() {
    const config = webpackConfig.clone();

    // put dev only stuff here

    // devtools allow for source-maps. Possible options would be:
    // "eval" (source-maps to after babel code transform)
    // "source-map" (source-maps to before babel). Best for production
    // "eval-source-map" (source-maps to before babel but slightly faster re-builds). Best for development and for small projects
    // "cheap-module-eval-source-map" (source-maps to before babel with the fastest re-builds but without columns and only rows)
    config.devtool = "cheap-module-eval-source-map";

    // The following plugin will allows us to define variable accessible in our javascript files / modules
    config.plugins.push(new webpack.DefinePlugin({
        env: '"dev"'
    }));

    return config;
}

function createProdConfig() {
    const config = webpackConfig.clone();

    // Minification happens with the following plugin
    config.plugins.push(new webpack.optimize.UglifyJsPlugin());

    // The following plugin will allows us to define variable accessible in our javascript files / modules
    config.plugins.push(new webpack.DefinePlugin({
        env: '"prod"'
    }));

    // The following plugin will extract all css out of the javascript files and sets it at the header so it gets loaded before javascript files
    config.plugins.push(new ExtractTextPlugin("[name].css"));
    // we also need to replace loaders. We might consider looking for them in a more robust way, instead of using hard coded index
    config.module.loaders[1].loader = ExtractTextPlugin.extract("css-loader!less-loader");
    config.module.loaders[2].loader = ExtractTextPlugin.extract("css-loader");

    return config;
}

function runWebpack(config, callback) {
    const compiler = webpack(config);
    compiler.run( (err, stats) => {
        // Log erros if they occurr
        if (err) {
            console.error(err);
        }
        // log feedback in the same way as if running via cli
        console.log(stats.toString({
            colors: true,
            exclude: ["node_modules", "bower_components", "jam", "components"]
        }));
        // invoke callback to signal gulp that task finish
        callback();
    });
}

gulp.task("dev", callback => runWebpack(createDevConfig(), callback));

gulp.task("prod", callback => runWebpack(createProdConfig(), callback));

// Going to use webpack development server due to performance and features like live-reload
// Because the dev server holds everything in memory, we need to reference it on our index.html scripts src
// and changes will only be visible on those assets.
// To make them permanent, we will need to run "gulp dev"
gulp.task("dev:watch", () => {
    const config = createDevConfig();

    // mutate config to point assets location to use dev server
    config.output.publicPath = "http://localhost:8081";

    const compiler = webpack(config);
    const devServer = new WebpackDevServer(compiler, {
        inline: true,
        stats: {
            colors: true,
            exclude: ["node_modules", "bower_components", "jam", "components"]
        }
    });

    devServer.listen(8081, "localhost", () => {
        console.log("Dev Server started");
    })
});
