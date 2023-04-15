import yaml from 'js-yaml';

const parsers = (file, extname) => {
  switch (extname) {
    case '.json':
      return JSON.parse(file);
    case '.yaml':
      return yaml.load(file);
    case '.yml':
      return yaml.load(file);
    default:
      throw new Error(`Incorrect extension - ${extname}`);
  }
};

export default parsers;
