const gulp = require('gulp');
const rename = require('gulp-rename');
const fse = require('fs-extra');
const path = require('path');
const prodOverride = false;

let configName = 'config.json';
let paths = {
  server: {
    configSrc: './config/server.json',
    configDest: './dist'
  },
  client: {
    configSrc: './config/client.json',
    configDestDev: './angular/src/assets',
    configDestProd: './dist/client/assets'
  }
};

gulp.task('default', () => {
  gulp.src(paths.server.configSrc)
    .pipe(rename(configName))
    .pipe(gulp.dest(paths.server.configDest));
  gulp.src(paths.client.configSrc)
    .pipe(rename(configName))
    .pipe(gulp.dest(paths.client.configDestProd));
  if (!prodOverride && fse.existsSync(path.resolve(__dirname,paths.client.configDestDev)))
    gulp.src(paths.client.configSrc)
      .pipe(rename(configName))
      .pipe(gulp.dest(paths.client.configDestDev));
});