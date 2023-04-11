import _ from 'lodash';

const getKeys = (obj1, obj2) => {
  const keys = _.uniq([...Object.keys(obj1), ...Object.keys(obj2)]);
  return _.sortBy(keys);
};

const getInformationAboutDiff = (obj1, obj2, key) => {
  const name = key;

  if (obj1[key] !== obj2[key]) {
    return [
      { name, value: obj1[key], status: 'removed' },
      { name, value: obj2[key], status: 'added' },
    ];
  }

  return { name, value: obj1[key], status: 'unupdated' };
};

const isObject = (obj) => (_.isObject(obj) && !Array.isArray(obj));

const creationTree = (file1, file2) => {
  const fileKeys = getKeys(file1, file2);

  const result = fileKeys.map((key) => {
    const name = key;
    const valueFile1 = file1[key];
    const valueFile2 = file2[key];

    if (_.has(file1, key) && !_.has(file2, key)) {
      return { name, value: valueFile1, status: 'removed' };
    }
    if (_.has(file1, key) && _.has(file2, key)) {
      if (isObject(valueFile1) && isObject(valueFile2)) {
        const children = creationTree(valueFile1, valueFile2);
        return { name, children };
      }

      return getInformationAboutDiff(file1, file2, key);
    }
    return { name, value: valueFile2, status: 'added' };
  });

  return result;
};

export default creationTree;
