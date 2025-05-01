#!/usr/bin/env node

import path from 'path';
import { fileURLToPath } from 'url';
import { run } from 'plop';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ PASA configPath como parte del segundo argumento (env)
run(undefined, {
    configPath: path.resolve(__dirname, '../plopfile.js'),
});