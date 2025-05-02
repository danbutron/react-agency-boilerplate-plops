


import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatePath = path.resolve(__dirname, 'hook.hbs');

export default function (plop) {
  const templateContent = fs.readFileSync(templatePath, 'utf8');
  const template = Handlebars.compile(templateContent);

  return {
    description: 'Fetch from Strapi and generate a full hook (with types)',
    prompts: [
      {
        type: 'input',
        name: 'endpoint',
        message: 'Strapi endpoint (e.g. header-config):',
      },
    ],
    actions: [
      {
        type: 'fetch-json',
        template,
      },
    ],
  };
}