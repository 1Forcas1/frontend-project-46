import yaml from 'js-yaml';

const parsers = (file, extname) => {
  switch (extname) {
    case '.json':
      return JSON.parse(file);
    default:
      return yaml.load(file);
  }
};

export default parsers;
