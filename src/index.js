import path from 'path';
import { readFileSync } from 'node:fs';
import { creationTree } from './creationTree.js';
import parsers from './parsers.js';
import format from './formatters/index.js';

const getFilePath = (filepath) => path.resolve(process.cwd(), filepath);

const getExtname = (filepath) => path.extname(filepath);

const readFile = (filepath) => readFileSync(filepath);

const genDiff = (file1, file2, formatName = 'stylish') => {
  const filePath1 = getFilePath(file1);
  const extnameFile1 = getExtname(filePath1);
  const data1 = parsers(readFile(filePath1), extnameFile1);

  const filePath2 = getFilePath(file2);
  const extnameFile2 = getExtname(filePath2);
  const data2 = parsers(readFile(filePath2), extnameFile2);

  const innerTree = creationTree(data1, data2);
  return format(innerTree, formatName);
};

export default genDiff;
