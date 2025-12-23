import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import parser from '@typescript-eslint/parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
  recommendedConfig: {
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
  },
});

export default tseslint.config(
  {
    ignores: [
      'eslint.config.mjs',
      '**/eslint.config.mjs',
      'node_modules/**',
      'dist/**',
      '.nx/**',
      'mongodb_data',
      'logs',
      '**/*.js',
    ],
  },
  ...tseslint.configs.recommendedTypeChecked,
  eslint.configs.recommended,
  eslintPluginPrettierRecommended,

  ...compat.extends(
    'prettier',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ),

  ...compat.plugins(
    'immer',
    'import',
    'simple-import-sort',
    '@typescript-eslint',
  ),

  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      parser,
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.base.json',
        },
      },
    },
    rules: {
      'import/extensions': 0,
      '@typescript-eslint/no-unsafe-return': 0,
      '@typescript-eslint/no-unsafe-assignment': 0,
      '@typescript-eslint/no-unsafe-call': 0,
      'import/no-unresolved': 0,

      '@typescript-eslint/await-thenable': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'import/namespace': 'warn',
      'import/no-duplicates': 'warn',

      'prettier/prettier': 'warn',
      '@typescript-eslint/require-await': 'warn',
      '@typescript-eslint/unbound-method': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-empty-interface': 'warn',
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          fixStyle: 'inline-type-imports',
        },
      ],
      'no-param-reassign': [
        'error',
        {
          props: true,
          ignorePropertyModificationsForRegex: ['^draft', 'state'],
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: ['../**', './**'],
        },
      ],
      'no-console': 'warn',
      'immer/no-update-map': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      '@typescript-eslint/no-misused-promises': [
        2,
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],
    },
  },
);
