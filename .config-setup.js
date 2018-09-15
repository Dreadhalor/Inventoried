const gulp = require('gulp');
const rename = require('gulp-rename');
const fse = require('fs-extra');
const path = require('path');

const prodOverride = true;

var paths = {
  server: {
    configSrc: './config/server.js',
    configDest: './dist',
    configDestName: 'config.js',
    sqlTemplateSrc: './src/db/scripts/templates',
    sqlTemplateDest: './dist/db/scripts/templates'
  },
  client: {
    configSrc: './config/client.js',
    configDestDev: './angular/src/assets',
    configDestProd: './dist/client/assets',
    configDestName: 'config.js'
  }
};

gulp.task('default', () => {
  let templated = fse.existsSync(path.resolve(__dirname,paths.server.sqlTemplateDest))
  console.log(templated);
  if (!templated){
    fse.ensureDir(path.resolve(__dirname,paths.server.sqlTemplateDest))
    .then(success => {
      gulp.src([`${paths.server.sqlTemplateSrc}/**/*`])
        .pipe(gulp.dest(paths.server.sqlTemplateDest))
    })
    .catch(error => console.log('error!'));
  }
  gulp.src(paths.server.configSrc)
    .pipe(rename(paths.server.configDestName))
    .pipe(gulp.dest(paths.server.configDest));
  let clientPath = (!prodOverride && fse.existsSync(path.resolve(__dirname,paths.client.configDestDev))) ? paths.client.configDestDev : paths.client.configDestProd;
  gulp.src(paths.client.configSrc)
    .pipe(rename(paths.client.configDestName))
    .pipe(gulp.dest(clientPath));
});