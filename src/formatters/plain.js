import _ from 'lodash';

const getValueByItsType = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  } if (typeof value === 'string') {
    return `'${value}'`;
  }
  return value;
};

const getPlainDiff = (node) => {
  if (Array.isArray(node)) {
    const [before, after] = node;
    return `Property '${after.name}' was updated. From ${getValueByItsType(before.value)} to ${getValueByItsType(after.value)}`;
  }

  if (_.isObject(node.value) && node.status === 'added') {
    return `Property '${node.name}' was added with value: ${getValueByItsType(node.value)}`;
  }

  if (node.status === 'added') {
    return `Property '${node.name}' was added with value: ${getValueByItsType(node.value)}`;
  }
  if (node.status === 'unupdated') {
    return '';
  }
  return `Property '${node.name}' was removed`;
};

const plain = (tree) => {
  const cloneTree = _.cloneDeep(tree);

  const iter = (node) => {
    const result = node.map((unit) => {
      const { name } = unit;

      if (Object.keys(unit).includes('children')) {
        const { children } = unit;
        const nestedProperties = children.map((child) => {
          if (Array.isArray(child)) {
            child.map((grandson) => {
              // eslint-disable-next-line no-param-reassign
              grandson.name = `${name}.${grandson.name}`;
              return grandson;
            });
          }
          // eslint-disable-next-line no-param-reassign
          child.name = `${name}.${child.name}`;
          return child;
        });
        return iter(nestedProperties);
      }

      return getPlainDiff(unit);
    });

    return _.compact(result).join('\n');
  };

  return iter(cloneTree);
};

export default plain;
