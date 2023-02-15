module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  root: true,
  parser: 'hermes-eslint',
  plugins: [
    'ft-flow'
  ],
  extends: [
    'eslint:recommended',
    'plugin:ft-flow/recommended',
  ],
  settings: {
    "ft-flow": {
      "onlyFilesWithFlowAnnotation": false
    }
  },
  rules: {
    "no-debugger": "off",
    "no-unused-vars": [1, { 'argsIgnorePattern': '_' }],
    "no-empty": "off"
  }
};