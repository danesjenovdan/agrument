module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: ['airbnb', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 2022,
  },
  rules: {
    'react/prop-types': ['off'],
    'react/jsx-props-no-spreading': ['off'],
    'import/extensions': ['error', 'ignorePackages'],
    'import/prefer-default-export': ['off'],
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'import/no-extraneous-dependencies': [
      'error',
      {
        optionalDependencies: false,
        devDependencies: ['**/.eslintrc.js', '**/vite.config.js'],
      },
    ],
  },
};
