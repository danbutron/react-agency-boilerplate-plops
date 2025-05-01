#!/usr/bin/env node

import path from 'path';
import { fileURLToPath } from 'url';
import { run } from 'plop';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const plopfilePath = path.resolve(__dirname, '../plopfile.js');

// ✅ PASA configPath como PRIMER argumento
run({
    configPath: plopfilePath,
    cwd: process.cwd()
});