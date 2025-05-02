import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatePath = path.resolve(__dirname, 'component.hbs');

const template = Handlebars.compile(fs.readFileSync(templatePath, 'utf8'));

Handlebars.registerHelper('styleClass', function (name) {
  return new Handlebars.SafeString(`{styles.${name}}`);
});

export default function (plop) {
  return {
    description: 'Create an Atomic Design component (with .tsx and .scss)',
    prompts: [
      {
        type: 'list',
        name: 'type',
        message: 'Component type:',
        choices: ['atoms', 'molecules', 'organisms', 'templates'],
      },
      {
        type: 'input',
        name: 'name',
        message: 'Component name:',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/components/{{type}}/{{pascalCase name}}/{{pascalCase name}}.tsx',
        templateFile: templatePath,
      },
      {
        type: 'add',
        path: 'src/components/{{type}}/{{pascalCase name}}/{{pascalCase name}}.module.scss',
        templateFile: path.resolve(__dirname, 'style.hbs'),
      },
      {
        type: 'add',
        path: 'src/components/{{type}}/index.ts',
        template: '// EXPORTS\n',
        skipIfExists: true,
      },
      {
        type: 'append',
        path: 'src/components/{{type}}/index.ts',
        pattern: /(\/\/ EXPORTS)/,
        template: `export * from './{{pascalCase name}}/{{pascalCase name}}';`,
      },
    ],
  };
}
