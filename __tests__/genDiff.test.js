import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { test, expect } from '@jest/globals';
import { readFileSync } from 'node:fs';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const readFile = (filename) => readFileSync(getFixturePath(filename), 'utf-8');

const extensions = ['yaml', 'json'];

const expectedFile = readFile('expected_file.txt');
const expectedFile2 = readFile('expected_file2.txt');
const expectedFileJsonFormat = readFile('expected_file_json_format.txt');
const expectedFilePlainFormat = readFile('expected_file_plain_format.txt');

test.each(extensions)('path formation', (ext) => {
  const fileBefore = getFixturePath(`file1.${ext}`);
  const fileAfter = getFixturePath(`file2.${ext}`);

  expect(genDiff(fileBefore, fileAfter, 'stylish')).toEqual(expectedFile);
  expect(genDiff(fileBefore, fileAfter, 'plain')).toEqual(expectedFilePlainFormat);
  expect(genDiff(fileBefore, fileAfter, 'json')).toEqual(expectedFileJsonFormat);
  expect(genDiff(fileBefore, fileAfter)).toEqual(expectedFile);
});

test('dif json files2', () => {
  const file1 = getFixturePath('file3.json');
  const file2 = getFixturePath('file4.json');

  expect(genDiff(file1, file2)).toEqual(expectedFile2);
});

test('parser yml', () => {
  const file1 = getFixturePath('file1.yaml');
  const file2 = getFixturePath('file3.yml');

  expect(genDiff(file1, file2)).toEqual(expectedFile);
});

test('parser error', () => {
  const file1 = getFixturePath('file4.json');
  const file2 = getFixturePath('file4.txt');

  const extnameFile2 = '.txt';

  const checkParse = () => genDiff(file1, file2);
  const error = new Error(`Incorrect extension - ${extnameFile2}`);

  expect(checkParse).toThrow(error);
});

test('format error', () => {
  const file1 = getFixturePath('file4.json');
  const file2 = getFixturePath('file2.yaml');

  const formatName = 'null';

  const checkParse = () => genDiff(file1, file2, formatName);
  const error = new Error(`Format not supported: ${formatName}`);

  expect(checkParse).toThrow(error);
});
