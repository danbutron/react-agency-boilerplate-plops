#!/usr/bin/env node

const path = require('path');
const { run } = require('plop');

const plopfilePath = path.resolve(__dirname, '../plopfile.js');

run(undefined, {
    configPath: plopfilePath,
});