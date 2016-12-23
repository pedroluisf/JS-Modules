# Javascript Modules - JSPM
In this project we will use JSPM to compile and bundle our modules.
Because JSPM will also manage all the transpiling for our application, we do not have a src/scripts and develop straight into the public/scripts

## Set Up application
Run the following commands
```
npm install
node_modules\.bin\jspm install
gulp dev:styles
```

It is already configured to run in dev mode, as all the files stay as they are on the public folder
 
To run in Prod mode, just execute the following command to bundle all the files together:
```
node_modules\.bin\jspm bundle-sfx scripts/application.js
```

Afterwards just uncomment the correct section on index.html

## Improvements

* Minify the bundled code
* Bundle vendor files separately