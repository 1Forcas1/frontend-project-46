import _ from 'lodash';

const getKeys = (obj1, obj2) => {
  const keys = _.uniq([...Object.keys(obj1), ...Object.keys(obj2)]);
  return _.sortBy(keys);
};

const getInformationAboutDiff = (obj1, obj2, key) => {
  const name = key;
  const valueObj1 = obj1[key];
  const valueObj2 = obj2[key];

  if (_.has(obj1, key) && _.has(obj2, key)) {
    if (valueObj1 !== valueObj2) {
      return {
        name, oldValue: valueObj1, newValue: valueObj2, status: 'updated',
      };
    }
    return { name, value: valueObj1, status: 'unupdated' };
  }

  if (_.has(obj1, key) && !_.has(obj2, key)) {
    return { name, value: valueObj1, status: 'removed' };
  }

  return { name, value: valueObj2, status: 'added' };
};

const isObject = (obj) => (_.isObject(obj) && !Array.isArray(obj));

const creationTree = (file1, file2) => {
  const fileKeys = getKeys(file1, file2);

  const tree = fileKeys.map((key) => {
    const name = key;
    const valueFile1 = file1[key];
    const valueFile2 = file2[key];

    if (isObject(valueFile1) && isObject(valueFile2) && _.has(file1, key) && _.has(file2, key)) {
      const children = creationTree(valueFile1, valueFile2);
      return { name, children };
    }

    return getInformationAboutDiff(file1, file2, key);
  });

  return tree;
};

export { creationTree, isObject };
