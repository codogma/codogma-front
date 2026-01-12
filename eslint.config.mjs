import { defineConfig, globalIgnores } from 'eslint/config';

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

// Knip + eslint-plugin-import: resolver подключается строкой в settings,
// поэтому делаем явный side-effect import, чтобы Knip видел использование.
import 'eslint-import-resolver-typescript';

import prettierPlugin from 'eslint-plugin-prettier';
import tailwindPlugin from 'eslint-plugin-tailwindcss';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import tanstackQueryPlugin from '@tanstack/eslint-plugin-query';

export default defineConfig([
  ...nextVitals,
  ...nextTs,

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        React: 'readonly',
      },
    },

    plugins: {
      prettier: prettierPlugin,
      tailwindcss: tailwindPlugin,
      'unused-imports': unusedImportsPlugin,
      '@tanstack/query': tanstackQueryPlugin,
    },

    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },

    rules: {
      // Prettier
      'prettier/prettier': ['error', { endOfLine: 'auto' }],

      // Next.js
      '@next/next/no-html-link-for-pages': 'warn',

      // React
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
      'react/button-has-type': 'warn',
      'react/prefer-read-only-props': 'warn',
      'react/sort-prop-types': 'warn',
      'react/jsx-uses-react': 'off',

      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/set-state-in-effect': 'off',

      // TypeScript - Type checking
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-types': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',

      // Import
      'import/no-unresolved': 'error',
      'import/no-duplicates': 'error',
      'import/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'],
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          distinctGroup: true,
        },
      ],

      // Unused imports
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // Tailwind
      'tailwindcss/classnames-order': 'off',

      // A11y
      'jsx-a11y/anchor-is-valid': 'off',

      // Tanstack Query
      '@tanstack/query/exhaustive-deps': 'warn',

      // General
      'no-restricted-imports': 'error',
      'no-console': 'warn',
      'no-debugger': 'warn',
    },
  },

  // Игноры по примеру Next + твои
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',

    'node_modules/**',
    'dist/**',
  ]),
]);
