const os = require('os');
const path = require('path');
console.log('Root Directory: ', __dirname);
console.log('\nCurrent Filename: ', __filename);
// os
console.log('\nOperating System: ', os.platform());
console.log('\nOperating System Version: ', os.version());
console.log('\nMachine: ', os.machine());
console.log('\nHostName: ', os.hostname());
console.log('\nTotal Memory: ', os.totalmem());
console.log('\nFree Memory: ', os.freemem());
// path
console.log('\nFilename Basename: ', path.basename(__filename));
console.log('\nFile Extention: ', path.extname(__filename));



