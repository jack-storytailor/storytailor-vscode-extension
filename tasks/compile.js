let child_process = require('child_process');

// execute storytailor compile to storytailor-node, server and client
console.log('compile storysctipt local...', child_process.execSync(`npm run compile:storytailor`).toString());

console.log('compile storysctipt to server...', child_process.execSync(`npm run compile:storyscript.server`).toString());
console.log('compile storysctipt to client...', child_process.execSync(`npm run compile:storyscript.client`).toString());

// compile server
console.log(`compile server...`, child_process.execSync(`npm run compile:server`).toString());

// compile client
console.log(`compile client...`, child_process.execSync(`npm run compile:client`).toString());

// compile readme.md
console.log(`compile readme...`, child_process.execSync(`npm run compile:readme`).toString());
