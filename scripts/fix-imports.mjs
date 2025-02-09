// scripts/add-js-extensions.js
import { readdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

async function addJsExtensions(directory) {
  const files = await readdir(directory, { recursive: true });
  
  for (const file of files) {
    if (!file.endsWith('.js')) continue;
    
    const filePath = path.join(directory, file);
    let content = await readFile(filePath, 'utf8');
    
    // Add .js only to relative imports (starting with ./ or ../)
    content = content.replace(
      /(from\s+['"])(\.\.?\/[^'"]+)(?!\.js['"])/g,
      '$1$2.js'
    );
    
    // Also handle relative imports in require() if you're using CommonJS
    content = content.replace(
      /(require\(['"])(\.\.?\/[^'"]+)(?!\.js['"])/g,
      '$1$2.js'
    );
    
    await writeFile(filePath, content);
  }
}

// Run the script
addJsExtensions('./build').catch(console.error);