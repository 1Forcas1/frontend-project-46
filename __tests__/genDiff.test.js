import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { test, expect } from '@jest/globals';
import { readFileSync } from 'node:fs';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const readFile = (filename) => readFileSync(getFixturePath(filename), 'utf-8');

test('dif', () => {
  const file1 = getFixturePath('file1.json');
  const file2 = getFixturePath('file2.json');

  const dif = readFile('expected_file.txt');

  expect(genDiff(file1, file2)).toEqual(dif);
});
