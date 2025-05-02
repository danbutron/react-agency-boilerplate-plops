

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
import { quicktype, InputData, jsonInputForTargetLanguage } from 'quicktype-core';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function generateTypes(name, json) {
  const jsonInput = jsonInputForTargetLanguage('ts');
  await jsonInput.addSource({ name, samples: [JSON.stringify(json)] });

  const inputData = new InputData();
  inputData.addInput(jsonInput);

  const result = await quicktype({
    inputData,
    lang: 'ts',
    rendererOptions: {
      'just-types': 'true',
    },
  });

  return result.lines.join('\n');
}

export default async function fetchJsonAction(answers, config, plop) {
  const endpoint = answers.endpoint;

  const baseURL = process.env.VITE_STRAPI_URL || '';
  const url = `${baseURL}/${endpoint}`;

  const fileName = endpoint.replaceAll('/', '-');
  const pascalName = plop.getHelper('pascalCase')(fileName);
  const camelName = plop.getHelper('camelCase')(fileName);

  const hooksFolder = path.resolve('src', 'hooks');
  const hookPath = path.resolve(hooksFolder, `use${pascalName}Query.ts`);

  try {
    console.log(`🌐 Fetching from: ${url}`);
    const res = await axios.get(url);
    const data = res.data;

    if (!fs.existsSync(hooksFolder)) fs.mkdirSync(hooksFolder, { recursive: true });

    const isArray = Array.isArray(data.data);
    const model = isArray ? data.data[0] : data.data;
    const types = await generateTypes(`${pascalName}Data`, model);
    const tsType = isArray ? `${pascalName}Data[]` : `${pascalName}Data`;

    const compiled = config.template({
      types,
      pascalName,
      camelName,
      endpoint,
      tsType
    });

    fs.writeFileSync(hookPath, compiled);
    console.log('✅ Hook with interfaces saved at:', hookPath);
  } catch (err) {
    console.error('❌ Failed to fetch or generate:', err.message);
  }

  return 'Done';
}