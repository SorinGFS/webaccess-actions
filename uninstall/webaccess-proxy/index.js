'use strict';
// https://stackoverflow.com/questions/11580961/sending-command-line-arguments-to-npm-script

const appConfig = require('../../../../config/app');
const plugins = appConfig.plugins || [];
const run = require('../../run');
const fs = require('webaccess-base/fs');
const { program } = require('commander');

program
    .description('WebAccess Plugin Uninstaller.')
    .requiredOption('-p, --provider-name <string>', 'provider-name arg as required in auth.provider.name')
    .parse(process.argv);

const options = program.opts();
const providerName = options.providerName;
const pluginFilePath = fs.pathResolve(process.env.INIT_CWD, 'server', 'proxy', providerName, 'index.js');
const appConfigPath = fs.pathResolve(process.env.INIT_CWD, 'config/app', 'index.json');

console.log(`Uninstalling Plugin <webaccess-${providerName}>...`);
// check if plugin is installed
if (plugins.filter((item) => item.name === `webaccess-${providerName}`).length) {
    delete appConfig.plugins;
    const filtered = plugins.filter((item) => item.name !== `webaccess-${providerName}`);
    const result = filtered.length ? Object.assign({}, appConfig, { filtered }) : appConfig;
    (async () => {
        await run(`npm uninstall webaccess-${provider}`);
        fs.removeDir(fs.pathDirName(pluginFilePath));
        fs.writeFile(appConfigPath, JSON.stringify(result, null, 4));
        console.log(`Plugin <webaccess-${providerName}> successfully uninstalled!`);
    })();
} else {
    console.log(`ABORT: Plugin <webaccess-${providerName}> is already uninstalled!`);
    process.exit();
}
