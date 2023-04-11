import stylish from './stylish.js';
import plain from './plain.js';

export default (innerTree, format) => {
  switch (format) {
    case 'stylish':
      return stylish(innerTree);
    case 'plain':
      return plain(innerTree);
    default:
      throw new Error(`Формат не поддерживается: ${format}`);
  }
};
