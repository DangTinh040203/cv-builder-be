import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import parser from '@typescript-eslint/parser';
import boundaries from 'eslint-plugin-boundaries';

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
      'logs',
      '**/*.js',
    ],
  },
  ...tseslint.configs.recommendedTypeChecked,
  eslint.configs.recommended,
  eslintPluginPrettierRecommended,

  ...compat.extends(
    'prettier',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ),

  ...compat.plugins('immer', 'import', 'simple-import-sort'),

  // Boundaries plugin configuration
  {
    plugins: {
      boundaries,
    },
    settings: {
      'boundaries/elements': [
        // Define app services
        { type: 'api-gateway', pattern: 'apps/api-gateway/*' },
        { type: 'user-service', pattern: 'apps/user-service/*' },
        { type: 'resume-service', pattern: 'apps/resume-service/*' },
        { type: 'interview-service', pattern: 'apps/interview-service/*' },
        { type: 'ai-service', pattern: 'apps/ai-service/*' },
        { type: 'storage-service', pattern: 'apps/storage-service/*' },
        {
          type: 'notification-service',
          pattern: 'apps/notification-service/*',
        },
        // Define shared libs
        { type: 'shared', pattern: 'shared/*' },
      ],
      'boundaries/ignore': ['**/*.spec.ts', '**/*.test.ts'],
    },
    rules: {
      // Enforce architectural boundaries
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            // Services can import from shared
            { from: 'api-gateway', allow: ['shared'] },
            { from: 'user-service', allow: ['shared'] },
            { from: 'resume-service', allow: ['shared'] },
            { from: 'interview-service', allow: ['shared'] },
            { from: 'ai-service', allow: ['shared'] },
            { from: 'storage-service', allow: ['shared'] },
            { from: 'notification-service', allow: ['shared'] },
            // Shared can only import from other shared
            { from: 'shared', allow: ['shared'] },
          ],
        },
      ],
    },
  },

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
      'no-unused-vars': 'off',

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
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
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
          patterns: [
            {
              group: ['../**', './**'],
              message:
                'Relative imports are not allowed. Please use path aliases instead.',
            },
          ],
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
