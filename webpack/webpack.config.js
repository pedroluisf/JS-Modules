var path = require("path"),
    webpack = require("webpack");

function config(){
    return {
        /*  devtools config would allow for source-maps. Should be set only on gulp file and only for development */
        //devtool: "source-map", // commented because is defined in gulp file
        entry: {
            application: "./src/scripts/application", // each entry here will be a different bundle (ie: so we can have different js files)
            vendor: ["jquery", "jquery-ui", "lodash"]
        },
        output: {
            path: path.join(__dirname, "public/assets"),
            filename: "[name].js", // name is a placeholder for the file to import or whatever name our bundle has (in our case will be application)
            publicPath: "/assets/"
        },
        module: {
            loaders: [
                // load all our .js files through babel, except the ones on node_modules
                { test: /\.js/, loader: "babel", exclude: /node_modules/ },
                // load all our less files through less, then css and then load them on page (via styles)
                { test: /\.less/, loader: "style!css!less" },
                // load all our css files through css and then load them on page (via styles)
                { test: /\.css/, loader: "style!css" },
                // load all images through url-loader and inline it as base64 all those smaller then 1024 Bytes, otherwise treat it as an external resource
                { test: /\.(png|jpg|jpeg|gif|woff|ttf|eot|svg)/, loader: "url-loader?limit=1024" }
            ]
        },
        plugins: [
            // be sure to match "vendor" to the bundle name on entry (vendor)
            new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.js")
        ]
    };
}

// Make it compatible with webpack command line by exporting out the config
module.exports = config();

// Provide a mechanism to allow to load the config on another file (gulp.js)
// by exposing a function that will instantiate a new instance of our config
// Important, because some of our gulp tasks will mutate the configuration when executing
module.exports.clone = config;