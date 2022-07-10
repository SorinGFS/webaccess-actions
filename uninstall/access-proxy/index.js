'use strict';
// https://stackoverflow.com/questions/11580961/sending-command-line-arguments-to-npm-script

const run = require('../../run');
const fs = require('webaccess-base/fs');
const { program } = require('commander');

program
    .description('WebAccess Plugin Uninstaller.')
    .requiredOption('-p, --provider-name <string>', 'provider-name arg as required in auth.provider.name')
    .parse(process.argv);

const options = program.opts();
const providerName = options.providerName;
const provider = `webaccess-${providerName}`;
const pathResolveArgs = ['server', 'proxy', providerName];

console.log(`Uninstalling WebAccess Plugin ${providerName.toUpperCase()}...`);

(async () => {
    await run(`npm uninstall ${provider}`);
    fs.removeDir(...pathResolveArgs);
})();
