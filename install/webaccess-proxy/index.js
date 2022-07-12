#!/usr/bin/env node
'use strict';
// https://stackoverflow.com/questions/11580961/sending-command-line-arguments-to-npm-script

// print process.argv
// process.argv.forEach((val, index, array) => {
//     console.log(index + ': ' + val);
// });

const run = require('../../run');
const fs = require('webaccess-base/fs');
const { program } = require('commander');

program
    .description('WebAccess Plugin Installer.')
    .requiredOption('-p, --provider-name <string>', 'provider name arg as required in auth.provider.name')
    .option('-v, --provider-version <semantic version string>', 'provider version arg as required in npm install webaccess-$providerName@providerVersion, if any')
    .parse(process.argv);

const options = program.opts();
const providerName = options.providerName;
const provider = options.providerVersion ? `webaccess-${providerName}@${options.providerVersion}` : `webaccess-${providerName}`;
const pathResolveArgs = ['server', 'proxy', providerName];
const content = "'use strict';\n" + 
                '// webaccess plugin\n' + 
                `module.exports = require('webaccess-${providerName}');\n`;

console.log(`Installing WebAccess Plugin ${providerName.toUpperCase()}...`);

(async () => {
    await run(`npm install ${provider}`);
    fs.mkdir(...pathResolveArgs);
    fs.writeFile('index.js', content, ...pathResolveArgs);
})();
