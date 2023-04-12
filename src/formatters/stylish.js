import _ from 'lodash';
import { isObject } from '../creationTree.js';

const getCurrentIndent = (depth, replacer = ' ', spacesCount = 4) => {
  const shiftToLeft = 2;
  const indentSize = (spacesCount * depth) - shiftToLeft;
  const currentIndent = replacer.repeat(indentSize);

  return currentIndent;
};

const getDiffInStatus = (node, currentIndent) => {
  if (node.status === 'added') {
    return `${currentIndent}+ ${node.name}: ${node.value}`;
  }
  if (node.status === 'removed') {
    return `${currentIndent}- ${node.name}: ${node.value}`;
  }
  return `${currentIndent}  ${node.name}: ${node.value}`;
};

const stylish = (tree, replacer = ' ', spacesCount = 4) => {
  const iter = (node, depth) => {
    const currentIndent = getCurrentIndent(depth, replacer, spacesCount);

    if (isObject(node)) {
      const keysAndValues = Object.entries(node);
      return keysAndValues.map(([key, value]) => {
        if (_.isObject(value)) {
          return `${currentIndent}  ${key}: {\n${iter(value, depth + 1)}${currentIndent}  }\n`;
        }
        return `${currentIndent}  ${key}: ${value}\n`;
      }).join('');
    }

    const result = node.map((unit) => {
      const { name } = unit;

      if (Object.keys(unit).includes('children')) {
        const { children } = unit;
        return `${currentIndent}  ${name}: {\n${iter(children, depth + 1)}\n${currentIndent}  }`;
      }
      if (Array.isArray(unit)) {
        const nearProperties = unit.map((joint) => {
          if (_.isObject(joint.value) && joint.status === 'removed') {
            return `${currentIndent}- ${joint.name}: {\n${iter(joint.value, depth + 1)}${currentIndent}  }\n`;
          }
          if (_.isObject(joint.value) && joint.status === 'added') {
            return `${currentIndent}+ ${joint.name}: {\n${iter(joint.value, depth + 1)}${currentIndent}  }`;
          }
          if (joint.status === 'removed') {
            return `${currentIndent}- ${joint.name}: ${joint.value}\n`;
          }
          return `${currentIndent}+ ${joint.name}: ${joint.value}`;
        });

        return nearProperties.join('');
      }

      if (isObject(unit.value)) {
        if (unit.status === 'added') {
          return `${currentIndent}+ ${name}: {\n${iter(unit.value, depth + 1)}${currentIndent}  }`;
        }
        if (unit.status === 'removed') {
          return `${currentIndent}- ${name}: {\n${iter(unit.value, depth + 1)}${currentIndent}  }`;
        }
      }

      return getDiffInStatus(unit, currentIndent);
    });

    return result.join('\n');
  };

  return `{\n${iter(tree, 1)}\n}`;
};

export default stylish;
