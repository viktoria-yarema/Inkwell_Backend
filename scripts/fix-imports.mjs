/* eslint-disable no-undef */
// scripts/add-js-extensions.js
import { readFile, readdir, writeFile } from 'fs/promises';
import path from 'path';

async function addJsExtensions(directory) {
  const files = await readdir(directory, { recursive: true });

  for (const file of files) {
    if (!file.endsWith('.js')) continue;

    const filePath = path.join(directory, file);
    let content = await readFile(filePath, 'utf8');

    content = content.replace(/(from\s+['"])(\.\.?\/[^'"]+)(?!\.js['"])/g, '$1$2.js');

    content = content.replace(/(require\(['"])(\.\.?\/[^'"]+)(?!\.js['"])/g, '$1$2.js');

    await writeFile(filePath, content);
  }
}

addJsExtensions('./build').catch(console.error);
