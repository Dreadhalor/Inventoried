const gulp = require('gulp');
const rename = require('gulp-rename');
const fse = require('fs-extra');
const path = require('path');

const prodOverride = true;

var paths = {
  server: {
    configSrc: './config/server.js',
    configDest: './dist',
    configDestName: 'config.js'
  },
  client: {
    configSrc: './config/client.js',
    configDestDev: './angular/src/assets',
    configDestProd: './dist/client/assets',
    configDestName: 'config.js'
  }
};

gulp.task('default', () => {
  gulp.src(paths.server.configSrc)
    .pipe(rename(paths.server.configDestName))
    .pipe(gulp.dest(paths.server.configDest));
  let clientPath = (!prodOverride && fse.existsSync(path.resolve(__dirname,paths.client.configDestDev))) ? paths.client.configDestDev : paths.client.configDestProd;
  gulp.src(paths.client.configSrc)
    .pipe(rename(paths.client.configDestName))
    .pipe(gulp.dest(clientPath));
});