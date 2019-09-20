module.exports = {
  'env': {
    'browser': true,
    'es6': true,
  },
  'extends': [
    'google',
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parser': 'babel-eslint',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
      'legacyDecorators': true,
    },
    'ecmaVersion': 2018,
    'sourceType': 'module',
  },
  'plugins': [
    'react',
  ],
  'rules': {
    'no-unused-vars': [2, {'args': 'after-used', 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_'}],
    'require-jsdoc': 0,
    'react/jsx-uses-react': 'error',   
    'react/jsx-uses-vars': 'error' 
  },
};
