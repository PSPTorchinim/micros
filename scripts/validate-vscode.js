#!/usr/bin/env node
/**
 * Validates .vscode/tasks.json and .vscode/launch.json as JSONC
 * (JSON with single-line and block comments).
 * Exits with code 1 if any file is invalid.
 */

import { readFileSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

function stripJsonComments(code) {
  let result = '';
  let i = 0;
  const n = code.length;
  while (i < n) {
    if (code[i] === '"') {
      result += code[i++];
      while (i < n) {
        if (code[i] === '\\') {
          result += code[i++];
          if (i < n) result += code[i++];
        } else if (code[i] === '"') {
          result += code[i++];
          break;
        } else {
          result += code[i++];
        }
      }
    } else if (code[i] === '/' && i + 1 < n && code[i + 1] === '/') {
      while (i < n && code[i] !== '\n') i++;
    } else if (code[i] === '/' && i + 1 < n && code[i + 1] === '*') {
      i += 2;
      while (i < n && !(code[i] === '*' && i + 1 < n && code[i + 1] === '/')) i++;
      i += 2;
    } else {
      result += code[i++];
    }
  }
  return result;
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const files = ['.vscode/tasks.json', '.vscode/launch.json'];

let allValid = true;
for (const file of files) {
  const fullPath = join(root, file);
  try {
    const raw = readFileSync(fullPath, 'utf8');
    JSON.parse(stripJsonComments(raw));
    console.log(`\u2713 ${file}`);
  } catch (err) {
    console.error(`\u2717 ${file}: ${err.message}`);
    allValid = false;
  }
}

if (!allValid) {
  process.exit(1);
}
console.log('All .vscode configs are valid.');
