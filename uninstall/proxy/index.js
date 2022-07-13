'use strict';
// https://stackoverflow.com/questions/11580961/sending-command-line-arguments-to-npm-script

const appConfig = require('../../../../config/app');
const plugins = appConfig.plugins || [];
const run = require('../../run');
const fs = require('webaccess-base/fs');
const { program } = require('commander');

program
    .description('WebAccess Plugin Uninstaller.')
    .requiredOption('-p, --package-name <string>', 'npm package name')
    .parse(process.argv);

const options = program.opts();
const packageName = options.packageName;
const pluginFilePath = fs.pathResolve(process.env.INIT_CWD, 'server', 'proxy', packageName, 'index.js');
const appConfigPath = fs.pathResolve(process.env.INIT_CWD, 'config/app', 'index.json');

console.log(`Uninstalling Plugin <${packageName}>...`);
// check if plugin is installed
if (plugins.filter((item) => item.name === packageName).length) {
    delete appConfig.plugins;
    const filtered = plugins.filter((item) => item.name !== packageName);
    const result = filtered.length ? Object.assign({}, appConfig, { filtered }) : appConfig;
    (async () => {
        await run(`npm uninstall ${packageName}`);
        fs.removeDir(fs.pathDirName(pluginFilePath));
        fs.writeFile(appConfigPath, JSON.stringify(result, null, 4));
        console.log(`Plugin <${packageName}> successfully uninstalled!`);
    })();
} else {
    console.log(`ABORT: Plugin <${packageName}> is already uninstalled!`);
    process.exit();
}
