import _ from 'lodash';

const getKeys = (obj1, obj2) => {
  const keys = _.uniq([...Object.keys(obj1), ...Object.keys(obj2)]);
  return _.sortBy(keys);
};

const isObject = (obj) => (_.isObject(obj) && !Array.isArray(obj));

const creationTree = (file1, file2) => {
  const fileKeys = getKeys(file1, file2);

  const result = fileKeys.map((key) => {
    if (_.has(file1, key) && !_.has(file2, key)) {
      return { name: key, value: file1[key], status: 'removed' };
    }
    if (_.has(file1, key) && _.has(file2, key)) {
      if (isObject(file1[key]) && isObject(file2[key])) {
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
