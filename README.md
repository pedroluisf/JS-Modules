# JS-Modules
Javascript Modules - A study on Javascript module definition. AMD, CommonJS, UMD and SystemJS bundled together using RequireJS, Browserify, Webpack and JSPM

The project consists of several mini-projects each with a different strategy for handling the Javascript modules.

The first project (blank) contains the source code. It shows a simple list of users and allows for adding and removing users. 
This project contains the full application, however, it will not run in the browser, because the browser does not know how to load or interpret javascript modules.

The version of javascript we use is ES6 or ES2015. It is used babel to transpile it into ES5.

The modules are defined in a multitude of ways, having some files using the CommonJS definition, some other using the ES6 module definition and some others using AMD.
The goal is to bundle the application together regardless of the module definition used and present a final solution that will run using the bundler of choice.

There are 4 different bundlers used: RequireJS, Browserify, Webpack and JSPM.
