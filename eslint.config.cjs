const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const jestPlugin = require('eslint-plugin-jest');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      jest: jestPlugin,
      prettier: prettierPlugin
    },
    rules: {
      'jest/expect-expect': 'error',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-shadow': ['error'],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', args: 'all' },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': ['error'],
      '@typescript-eslint/await-thenable': ['error'],
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
      globals: {
        process: true,
        __dirname: true,
        __filename: true,
        describe: true,
        expect: true,
        it: true,
        jest: true,
        beforeEach: true,
        afterEach: true
      }
    },
    ignores: ['dist/**', 'node_modules/**']
  }
];
