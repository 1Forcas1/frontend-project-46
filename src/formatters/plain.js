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
  if (_.isObject(node.value) && node.status === 'added') {
    return `Property '${node.name}' was added with value: ${getValueByItsType(node.value)}`;
  }

  switch (node.status) {
    case 'added':
      return `Property '${node.name}' was added with value: ${getValueByItsType(node.value)}`;
    case 'updated':
      return `Property '${node.name}' was updated. From ${getValueByItsType(node.oldValue)} to ${getValueByItsType(node.newValue)}`;
    case 'unupdated':
      return '';
    default:
      return `Property '${node.name}' was removed`;
  }
};

const plain = (tree) => {
  const cloneTree = _.cloneDeep(tree);

  const iter = (node) => {
    const valuesPlainDiff = node.map((unit) => {
      const { name } = unit;

      if (Object.keys(unit).includes('children')) {
        const { children } = unit;
        const nestedProperties = children.map((child) => {
          const newName = `${name}.${child.name}`;
          const newChild = { ...child, name: newName };
          return newChild;
        });
        return iter(nestedProperties);
      }

      return getPlainDiff(unit);
    });

    const result = _.compact(valuesPlainDiff).join('\n');
    return result;
  };

  return iter(cloneTree);
};

export default plain;
