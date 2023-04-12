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

const obj = (node, depth) => {
  const currentIndent = getCurrentIndent(depth);

  const keysAndValues = Object.entries(node);
  return keysAndValues.map(([key, value]) => {
    if (_.isObject(value)) {
      return `${currentIndent}  ${key}: {\n${obj(value, depth + 1)}${currentIndent}  }\n`;
    }
    return `${currentIndent}  ${key}: ${value}\n`;
  }).join('');
};

const getDiffInStatus = (node, depth) => {
  const currentIndent = getCurrentIndent(depth);

  if (isObject(node.value)) {
    if (node.status === 'added') {
      return `${currentIndent}+ ${node.name}: {\n${obj(node.value, depth + 1)}${currentIndent}  }`;
    }
    return `${currentIndent}- ${node.name}: {\n${obj(node.value, depth + 1)}${currentIndent}  }`;
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

const arr = (node, depth) => {
  const currentIndent = getCurrentIndent(depth);

  const nearProperties = node.map((joint) => {
    if (_.isObject(joint.value) && joint.status === 'removed') {
      return `${currentIndent}- ${joint.name}: {\n${obj(joint.value, depth + 1)}${currentIndent}  }\n`;
    }
    if (_.isObject(joint.value) && joint.status === 'added') {
      return `${currentIndent}+ ${joint.name}: {\n${obj(joint.value, depth + 1)}${currentIndent}  }`;
    }
    if (joint.status === 'removed') {
      return `${currentIndent}- ${joint.name}: ${joint.value}\n`;
    }
    return `${currentIndent}+ ${joint.name}: ${joint.value}`;
  });

  return nearProperties.join('');
};

const stylish = (tree) => {
  const iter = (node, depth) => {
    const currentIndent = getCurrentIndent(depth);

    const result = node.map((unit) => {
      const { name } = unit;

      if (Object.keys(unit).includes('children')) {
        const { children } = unit;
        return `${currentIndent}  ${name}: {\n${iter(children, depth + 1)}\n${currentIndent}  }`;
      }
      if (Array.isArray(unit)) {
        return arr(unit, depth);
      }

      return getDiffInStatus(unit, depth);
    });

    return result.join('\n');
  };

  return `{\n${iter(tree, 1)}\n}`;
};

export default stylish;
