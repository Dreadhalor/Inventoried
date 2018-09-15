var path = require('path');
var fse = require('fs-extra');
var json = require('jsonfile');
var config = require('../config');
console.log(config);
var prodOverride = false;
var paths = {
    configName: 'config.json',
    configDestServer: '../dist',
    configDestClientDev: '../angular/src/assets',
    configDestClientProd: '../dist/client/assets'
};
var setupConfig = module.exports = function () {
    //let dev = !prodOverride && fse.existsSync(path.resolve(__dirname,paths.configDestClientDev))
    //console.log(`${path.resolve(__dirname,paths.configDestClientProd)}/${paths.configName}`);
    var p1 = fse.ensureDir(path.resolve(__dirname, paths.configDestServer))
        .then(function (success) { return json.writeFile(path.resolve(__dirname, paths.configDestServer) + "/" + paths.configName, config); });
    var p2 = fse.ensureDir(path.resolve(__dirname, paths.configDestClientProd))
        .then(function (success) { return json.writeFile(path.resolve(__dirname, paths.configDestClientProd) + "/" + paths.configName, config); });
    var promises = [p1, p2];
    /*let additional
    if (dev)
      promises.push(fse.ensureDirectory(path.resolve(__dirname,paths.configDestClientProd))
        .json.writeFile(`${path.resolve(__dirname,paths.configDestClientProd)}/${paths.configName}`, config),);*/
    return Promise.all([promises])
        .catch(function (exception) { return console.log('config files could not be created.'); });
};
//# sourceMappingURL=config-setup.js.map