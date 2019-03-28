let child_process = require('child_process');
let fsUtils = require('./fsUtils');
let path = require('path');

// execute storyscript compile to storyscript-node, server and client
console.log('compile storysctipt-ts-plugin local...', child_process.execSync(`tsc -p ./storyscript-ts-plugin/tsconfig.json`).toString());

// copy files from plugin to node_modules
let curDirName = path.dirname('.');
console.log(curDirName);
let sourceDirPath = path.resolve(curDirName, 'storyscript-ts-plugin');
let targetDirPath = path.resolve(curDirName, 'node_modules', 'storyscript-ts-plugin');
// copy directory
fsUtils.fsUtils.copyDirectory(sourceDirPath, targetDirPath);
