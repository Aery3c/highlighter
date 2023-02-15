module.exports = {
  plugins: [
    '@babel/plugin-transform-flow-strip-types',
    'babel-plugin-transform-flow-enums'
  ],
  env: {
    test: {
      presets: [['@babel/preset-env', {targets: {node: 'current'}}]],
      plugins: [
        '@babel/plugin-transform-modules-commonjs'
      ]
    }
  }
}