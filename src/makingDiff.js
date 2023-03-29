import _ from 'lodash';

const makingDiff = (file1, file2) => {
  const fileKeys = [...Object.keys(file1), ...Object.keys(file2)];

  const dif = _.uniq(fileKeys.map((key) => {
    if (_.has(file1, key) && _.has(file2, key)) {
      if (file1[key] === file2[key]) {
        return `  ${key}: ${file1[key]}`;
      }
      return `- ${key}: ${file1[key]}\n  + ${key}: ${file2[key]}`;
    }
    if (_.has(file1, key) && !_.has(file2, key)) {
      return `- ${key}: ${file1[key]}`;
    }
    return `+ ${key}: ${file2[key]}`;
  }));

  const sortDiff = _.sortBy(dif, (symbol) => symbol[2]);

  const result = sortDiff.reduce((acc, dist) => {
    const newAcc = `${acc}\n  ${dist}`;
    return newAcc;
  }, '{');

  return `${result}\n}`;
};

export default makingDiff;
