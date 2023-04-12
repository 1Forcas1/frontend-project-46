import _ from 'lodash';
import { isObject } from '../creationTree.js';

const getCurrentIndent = (depth) => {
  const shiftToLeft = 2;
  const replacer = ' ';
  const spacesCount = 4;

  const indentSize = (spacesCount * depth) - shiftToLeft;
  const currentIndent = replacer.repeat(indentSize);

  return currentIndent;
};

const parceObject = (node, depth) => {
  const currentIndent = getCurrentIndent(depth);

  const keysAndValues = Object.entries(node);
  return keysAndValues.map(([key, value]) => {
    if (_.isObject(value)) {
      return `${currentIndent}  ${key}: {\n${parceObject(value, depth + 1)}${currentIndent}  }\n`;
    }
    return `${currentIndent}  ${key}: ${value}\n`;
  }).join('');
};

const generationDiffByStatus = (node, depth) => {
  const currentIndent = getCurrentIndent(depth);

  if (isObject(node.value)) {
    if (node.status === 'added') {
      return `${currentIndent}+ ${node.name}: {\n${parceObject(node.value, depth + 1)}${currentIndent}  }`;
    }
    return `${currentIndent}- ${node.name}: {\n${parceObject(node.value, depth + 1)}${currentIndent}  }`;
  }

  switch (node.status) {
    case 'added':
      return `${currentIndent}+ ${node.name}: ${node.value}`;
    case 'removed':
      return `${currentIndent}- ${node.name}: ${node.value}`;
    default:
      return `${currentIndent}  ${node.name}: ${node.value}`;
  }
};

const generationUpdatedDiff = (node, depth) => {
  const currentIndent = getCurrentIndent(depth);

  if (isObject(node.oldValue) && !isObject(node.newValue)) {
    const oldValue = `${currentIndent}- ${node.name}: {\n${parceObject(node.oldValue, depth + 1)}${currentIndent}  }`;
    const newValue = `${currentIndent}+ ${node.name}: ${node.newValue}`;
    return `${oldValue}\n${newValue}`;
  }
  if (!isObject(node.oldValue) && isObject(node.newValue)) {
    const oldValue = `${currentIndent}- ${node.name}: ${node.oldValue}`;
    const newValue = `${currentIndent}+ ${node.name}: {\n${parceObject(node.newValue, depth + 1)}${currentIndent}  }`;
    return `${oldValue}\n${newValue}`;
  }

  return `${currentIndent}- ${node.name}: ${node.oldValue}\n${currentIndent}+ ${node.name}: ${node.newValue}`;
};

const stylish = (tree) => {
  const iter = (node, depth) => {
    const currentIndent = getCurrentIndent(depth);

    return node.map((unit) => {
      const { name } = unit;

      if (Object.keys(unit).includes('children')) {
        const { children } = unit;
        return `${currentIndent}  ${name}: {\n${iter(children, depth + 1)}\n${currentIndent}  }`;
      }

      if (unit.status === 'updated') {
        return generationUpdatedDiff(unit, depth);
      }

      return generationDiffByStatus(unit, depth);
    }).join('\n');
  };

  return `{\n${iter(tree, 1)}\n}`;
};

export default stylish;
