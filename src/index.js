import path from 'path';
import { readFileSync } from 'node:fs';
import makingDiff from './makingDiff.js';

const getFilePath = (filepath) => path.resolve(process.cwd(), filepath);

const readFile = (filepath) => readFileSync(filepath);

const genDiff = (file1, file2) => {
  const filePath1 = getFilePath(file1);
  const data1 = JSON.parse(readFile(filePath1));

  const filePath2 = getFilePath(file2);
  const data2 = JSON.parse(readFile(filePath2));

  return makingDiff(data1, data2);
};

export default genDiff;
