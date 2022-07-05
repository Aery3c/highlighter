module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true,
  },
  "parser": "@typescript-eslint/parser",
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "no-debugger": "off",
    "no-unused-vars": [1, { 'argsIgnorePattern': '_' }],
    "no-empty": "off"
  }
}
