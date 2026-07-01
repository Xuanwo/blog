const js = require('@eslint/js')
const globals = require('globals')

module.exports = [
  {
    ignores: [
      '.astro/**',
      'dist/**',
      'node_modules/**',
      'scripts/**',
      'static/**',
      'assets/javascript/gitalk.min.js'
    ]
  },
  {
    files: [
      'assets/javascript/**/*.js',
      '*.config.js',
      '*.config.mjs'
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      semi: ['error', 'never'],
      quotes: ['error', 'single', { avoidEscape: true }],
      'comma-dangle': ['error', 'never'],
      'keyword-spacing': 'error',
      'object-curly-spacing': ['error', 'always'],
      'space-before-function-paren': ['error', 'always'],
      'space-infix-ops': 'error',
      'no-var': 'error',
      'prefer-const': 'error'
    }
  },
  {
    files: ['eslint.config.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: globals.node
    },
    rules: {
      ...js.configs.recommended.rules,
      semi: ['error', 'never'],
      quotes: ['error', 'single', { avoidEscape: true }],
      'comma-dangle': ['error', 'never'],
      'keyword-spacing': 'error',
      'object-curly-spacing': ['error', 'always'],
      'space-before-function-paren': ['error', 'always'],
      'space-infix-ops': 'error',
      'no-var': 'error',
      'prefer-const': 'error'
    }
  }
]
