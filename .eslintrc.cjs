module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'airbnb',
    'plugin:prettier/recommended',
    'plugin:react-hooks/recommended',
  ],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 2022,
  },
  rules: {
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        labelComponents: [],
        labelAttributes: [],
        controlComponents: [],
        assert: 'either',
        depth: 25,
      },
    ],
    'import/extensions': ['error', 'ignorePackages'],
    // 'react/prop-types': ['off'],
    // 'react/jsx-props-no-spreading': ['off'],
    // 'import/prefer-default-export': ['off'],
    // 'no-underscore-dangle': ['error', { allow: ['_id'] }],
    // 'import/no-extraneous-dependencies': [
    //   'error',
    //   {
    //     optionalDependencies: false,
    //     devDependencies: ['**/.eslintrc.js', '**/vite.config.js'],
    //   },
    // ],
  },
};
