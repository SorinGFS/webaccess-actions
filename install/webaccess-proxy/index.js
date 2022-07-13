#!/usr/bin/env node
'use strict';
// https://stackoverflow.com/questions/11580961/sending-command-line-arguments-to-npm-script

// print process.argv
// process.argv.forEach((val, index, array) => {
//     console.log(index + ': ' + val);
// });
const appConfig = require('../../../../config/app');
const plugins = appConfig.plugins || [];
const run = require('../../run');
const fs = require('webaccess-base/fs');
const { program } = require('commander');

program
    .description('WebAccess Plugin Installer.')
    .requiredOption('-p, --provider-name <string>', 'provider name arg as required in auth.provider.name')
    .option('-v, --provider-version <semantic version string>', 'provider version arg as required in npm install package@version, if any')
    .parse(process.argv);

const options = program.opts();
const providerName = options.providerName;
const provider = options.providerVersion ? `webaccess-${providerName}@${options.providerVersion}` : `webaccess-${providerName}`;
const pluginFilePath = fs.pathResolve(process.env.INIT_CWD, 'server', 'proxy', providerName, 'index.js');
const appConfigPath = fs.pathResolve(process.env.INIT_CWD, 'config/app', 'index.json');
const content = "'use strict';\n" + 
                '// webaccess plugin\n' + 
                `module.exports = require('webaccess-${providerName}');\n`;

console.log(`Installing Plugin <webaccess-${providerName}>...`);
// check if plugin already installed
if (plugins.filter((item) => item.name === `webaccess-${providerName}`).length) {
    console.log(`ABORT: Plugin <webaccess-${providerName}> is already installed!`);
    process.exit();
}
plugins.push({ name: `webaccess-${providerName}`, type: 'webaccess-proxy' });
// perform the action
(async () => {
    await run(`npm install ${provider}`);
    fs.writeFile(pluginFilePath, content);
    fs.writeFile(appConfigPath, JSON.stringify(Object.assign({}, appConfig, { plugins }), null, 4));
    console.log(`Plugin <webaccess-${providerName}> successfully installed!`);
})();
