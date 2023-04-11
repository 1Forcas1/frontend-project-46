import _ from 'lodash';

const creationTree = (file1, file2) => {
  const fileKeys = _.uniq([...Object.keys(file1), ...Object.keys(file2)]);
  const sortedKeys = _.sortBy(fileKeys);

  const result = sortedKeys.map((key) => {
    if (_.has(file1, key) && !_.has(file2, key)) {
      return { name: key, value: file1[key], status: 'removed' };
    }
    if (_.has(file1, key) && _.has(file2, key)) {
      if (_.isObject(file1[key]) && _.isObject(file2[key])
      && !Array.isArray(file1[key]) && !Array.isArray(file2[key])) {
        const children = creationTree(file1[key], file2[key]);
        return { name: key, children };
      }
      if (file1[key] === file2[key]) {
        return { name: key, value: file1[key], status: 'updated' };
      }
      if (file1[key] !== file2[key]) {
        return [
          { name: key, value: file1[key], status: 'removed' },
          { name: key, value: file2[key], status: 'added' },
        ];
      }
    }
    return { name: key, value: file2[key], status: 'added' };
  });

  return result;
};

export default creationTree;
