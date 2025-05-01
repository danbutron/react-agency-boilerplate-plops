import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
import { quicktype, InputData, jsonInputForTargetLanguage } from 'quicktype-core';

// 🧪 Cargar el .env desde el proyecto
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

export default function (plop) {
    plop.setActionType('fetch-json', async (answers) => {
        const endpoint = answers.endpoint;

        // ✅ Usa STRAPI_API_URL desde el entorno
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

            const hookFile = `import { useQuery } from "@tanstack/react-query";
import { apiClient } from '@services/apiClient';

${types}

export interface ${pascalName}Response {
  data: ${tsType};
}

const fetch${pascalName} = async (): Promise<${tsType}> => {
  const response = await apiClient<${pascalName}Response>('${endpoint}');
  return response.data;
};

export const use${pascalName}Query = () => {
  return useQuery<${tsType}>({
    queryKey: ['${camelName}'],
    queryFn: fetch${pascalName},
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
`;

            fs.writeFileSync(hookPath, hookFile);
            console.log('✅ Hook with interfaces saved at:', hookPath);
        } catch (err) {
            console.error('❌ Failed to fetch or generate:', err.message);
        }

        return 'Done';
    });

    plop.setGenerator('save-json', {
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
            },
        ],
    });
}