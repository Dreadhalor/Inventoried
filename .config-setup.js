const gulp = require('gulp');
const rename = require('gulp-rename');
const fse = require('fs-extra');
const path = require('path');

const prodOverride = true;

let configName = 'config.js';
let paths = {
  server: {
    configSrc: './config/server.js',
    configDest: './dist'
  },
  client: {
    configSrc: './config/client.js',
    configDestDev: './angular/src/assets',
    configDestProd: './dist/client/assets'
  }
};

gulp.task('default', () => {
  gulp.src(paths.server.configSrc)
    .pipe(rename(configName))
    .pipe(gulp.dest(paths.server.configDest));
  let clientPath = (!prodOverride && fse.existsSync(path.resolve(__dirname,paths.client.configDestDev))) ? paths.client.configDestDev : paths.client.configDestProd;
  gulp.src(paths.client.configSrc)
    .pipe(rename(configName))
    .pipe(gulp.dest(clientPath));
});