# Javascript Modules - Webpack
In this project we will use Webpack to compile and bundle our modules.
It is generally recommended to use npm instead of bower (although use of bower is also possible) to manage our resources when using Webpack.
This is because Webpack will bundle all our javascript files on the server before supplying them to the browser. 

## Set Up application
Run the following commands
```
npm install
```
for development run:
```
gulp dev
```
for production, uncomment the styles on index.html and run:
```
gulp prod
```
for watch, uncomment the correct lines in index.html and run:
```
gulp dev:watch
```
