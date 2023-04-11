import yaml from 'js-yaml';

const parsers = (file, extname) => {
  let parce;
  if (extname === '.json') {
    parce = JSON.parse;
  } else if (extname === '.yml' || extname === '.yaml') {
    parce = yaml.load;
  }

  return parce(file);
};

export default parsers;
