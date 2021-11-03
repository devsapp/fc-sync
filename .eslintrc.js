module.exports = {
  extends: [
    'eslint-config-ali/typescript',
  ],
  root: true,
  rules: {
    'no-await-in-loop': 'off',
    'max-len': 'off',
  },
  env: {
    node: true,
    jest: true,
  },
};
