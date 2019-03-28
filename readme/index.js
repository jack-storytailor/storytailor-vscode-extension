"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

let outputPath = process.argv.length > 2 ? process.argv[2] : undefined;
const fs = require('fs');
outputPath = outputPath || __dirname + '/index.txt';
let story = require('./out/index.sts');
let env = require('./out/environment');
let storyText = env.objectToString(story, '\n');
fs.writeFileSync(outputPath, storyText);
