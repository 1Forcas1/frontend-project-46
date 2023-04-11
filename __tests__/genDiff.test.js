import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { test, expect } from '@jest/globals';
import { readFileSync } from 'node:fs';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const readFile = (filename) => readFileSync(getFixturePath(filename), 'utf-8');

test('dif json files', () => {
  const file1 = getFixturePath('file1.json');
  const file2 = getFixturePath('file2.json');

  const dif = readFile('expected_file.txt');

  expect(genDiff(file1, file2)).toEqual(dif);
});

test('dif json files2', () => {
  const file3 = getFixturePath('file3.json');
  const file4 = getFixturePath('file4.json');

  const dif2 = readFile('expected_file2.txt');

  expect(genDiff(file3, file4)).toEqual(dif2);
});

test('dif yml files', () => {
  const file1 = getFixturePath('file1.yml');
  const file2 = getFixturePath('file2.yaml');

  const dif = readFile('expected_file.txt');

  expect(genDiff(file1, file2)).toEqual(dif);
});

test('dif plain format json files', () => {
  const file1 = getFixturePath('file1.json');
  const file2 = getFixturePath('file2.json');

  const dif = readFile('expected_file_plain_format.txt');
  const formatName = 'plain';

  expect(genDiff(file1, file2, formatName)).toEqual(dif);
});

test('error', () => {
  const file1 = getFixturePath('file1.yml');
  const file2 = getFixturePath('file2.yaml');

  const formatName = 'null';

  const checkParse = () => genDiff(file1, file2, formatName);
  const error = new Error(`Формат не поддерживается: ${formatName}`);

  expect(checkParse).toThrow(error);
});
