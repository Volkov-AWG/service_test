module.exports = {
  extends: 'airbnb-base',
  env: {
    mocha: true,
    es6: true
  },
  rules: {
    'no-console': 'off',
    'no-var': 'error',
    'no-unused-vars': 'error',
    'prefer-const': 'error',
    'no-await-in-loop': 'warn',
    'no-restricted-syntax': 'warn',
    'no-underscore-dangle': 'warn',
    'prefer-arrow-callback': 'error',
    'comma-dangle': ['error', 'never'],
    semi: ['error', 'always'],
    'import/no-unresolved': 'off',
    'no-plusplus': 'off',
    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 2 }],
    'func-names': ['error', 'always'],
    'func-style': ['error', 'expression', { allowArrowFunctions: true }],
    curly: ['error', 'all'],
    'no-use-before-define': ['error', { functions: true, classes: true }],
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
    'max-statements-per-line': ['error', { max: 1 }],
    'space-before-function-paren': ['error', { anonymous: 'always', named: 'never', asyncArrow: 'always' }],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: ['multiline-expression', 'block-like'], next: '*' },
      { blankLine: 'always', prev: '*', next: ['multiline-expression', 'block-like'] },
      { blankLine: 'always', prev: 'const', next: ['expression'] },
      { blankLine: 'always', prev: 'let', next: ['expression'] },
      { blankLine: 'always', prev: 'expression', next: ['const', 'let'] }
    ],
    'max-len': ['warn', { code: 200 }],
    camelcase: ['warn', { allow: ['business_id'] }],
    'no-empty': ['error', { allowEmptyCatch: true }],
    'linebreak-style': 'off',
    'function-paren-newline': ['error', 'multiline-arguments'],
    'consistent-return': 'warn'
  }
};
