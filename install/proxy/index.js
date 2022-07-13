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
    .requiredOption('-p, --package-name <string>', 'npm package name')
    .option('-v, --package-version <semantic version string>', 'npm package version')
    .parse(process.argv);

const options = program.opts();
const packageName = options.packageName;
const package = options.packageVersion ? `${packageName}@${options.packageVersion}` : `${packageName}`;
const pluginFilePath = fs.pathResolve(process.env.INIT_CWD, 'server', 'proxy', packageName, 'index.js');
const appConfigPath = fs.pathResolve(process.env.INIT_CWD, 'config/app', 'index.json');
const content = "'use strict';\n" + 
                '// webaccess plugin\n' + 
                `module.exports = require('${packageName}');\n`;

console.log(`Installing Plugin <${packageName}>...`);
// check if plugin already installed
if (plugins.filter((item) => item.name === packageName).length) {
    console.log(`ABORT: Plugin <${packageName}> is already installed!`);
    process.exit();
}
plugins.push({ name: packageName, type: 'proxy' });
// perform the action
(async () => {
    await run(`npm install ${package}`);
    fs.writeFile(pluginFilePath, content);
    fs.writeFile(appConfigPath, JSON.stringify(Object.assign({}, appConfig, { plugins }), null, 4));
    console.log(`Plugin <${packageName}> successfully installed!`);
})();
