/* eslint-disable no-undef */
// scripts/add-js-extensions.js
import { readFile, readdir, stat, writeFile } from 'fs/promises';
import path from 'path';

async function addJsExtensions(directory) {
  const files = await readdir(directory, { recursive: true });

  for (const file of files) {
    if (!file.endsWith('.js')) continue;

    const filePath = path.join(directory, file);
    let content = await readFile(filePath, 'utf8');

    // Fix imports with better handling of directory imports
    content = await fixImports(content, filePath);

    await writeFile(filePath, content);
  }
}

async function fixImports(content, currentFilePath) {
  const importRegex = /(from\s+['"])(\.\.?\/[^'"]+)(?!\.js['"])/g;
  const requireRegex = /(require\(['"])(\.\.?\/[^'"]+)(?!\.js['"])/g;

  let result = content;

  // Handle ES6 imports
  result = await replaceAsync(result, importRegex, async (match, prefix, importPath) => {
    const resolvedPath = await resolveImportPath(importPath, currentFilePath);
    return prefix + resolvedPath;
  });

  // Handle CommonJS requires
  result = await replaceAsync(result, requireRegex, async (match, prefix, importPath) => {
    const resolvedPath = await resolveImportPath(importPath, currentFilePath);
    return prefix + resolvedPath;
  });

  return result;
}

async function resolveImportPath(importPath, currentFilePath) {
  const currentDir = path.dirname(currentFilePath);
  const absoluteImportPath = path.resolve(currentDir, importPath);

  try {
    // Check if it's a directory with index.js
    const stats = await stat(absoluteImportPath);
    if (stats.isDirectory()) {
      const indexPath = path.join(absoluteImportPath, 'index.js');
      try {
        await stat(indexPath);
        return importPath + '/index.js';
      } catch {
        // index.js doesn't exist, try adding .js to the directory name
        return importPath + '.js';
      }
    }
  } catch {
    // Path doesn't exist as directory, check if .js file exists
    try {
      await stat(absoluteImportPath + '.js');
      return importPath + '.js';
    } catch {
      // Neither directory nor .js file exists, default to adding .js
      return importPath + '.js';
    }
  }

  return importPath + '.js';
}

async function replaceAsync(str, regex, asyncFn) {
  const promises = [];
  str.replace(regex, (match, ...args) => {
    const promise = asyncFn(match, ...args);
    promises.push(promise);
    return match;
  });

  const data = await Promise.all(promises);
  return str.replace(regex, () => data.shift());
}

addJsExtensions('./build').catch(console.error);
