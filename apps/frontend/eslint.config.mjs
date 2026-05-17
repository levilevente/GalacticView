// eslint.config.mjs
import { defineConfig, globalIgnores } from 'eslint/config';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tsParser from '@typescript-eslint/parser';
import tseslint from 'typescript-eslint';

export default defineConfig([
    globalIgnores(['dist', 'node_modules', 'public']),
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: ['./tsconfig.app.json', './tsconfig.node.json'],
                tsconfigRootDir: new URL('.', import.meta.url).pathname,
                ecmaVersion: 2022,
                sourceType: 'module',
                ecmaFeatures: { jsx: true },
            },
        },
        // define plugins here so they are available to rules below
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooks,
            'simple-import-sort': simpleImportSort,
        },
        // use recommended configs
        extends: [
            tseslint.configs.recommendedTypeChecked,
            tseslint.configs.stylisticTypeChecked,
            reactPlugin.configs.flat.recommended, // this is the new Flat Config way for React
            jsxA11y.flatConfigs.recommended,
        ],
        settings: {
            react: {
                version: 'detect', // automatically detect React version
            },
        },
        rules: {
            // --- 1. React Best Practices ---

            // enforce Rules of Hooks
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',

            'react/jsx-no-leaked-render': ['error', { validStrategies: ['ternary'] }],

            'react/jsx-boolean-value': ['error', 'never'],
            'react/self-closing-comp': ['error', { component: true, html: true }],
            'react/jsx-fragments': ['error', 'syntax'],
            'react/react-in-jsx-scope': 'off', // not needed in React 17+

            // --- 2. TypeScript Best Practices ---
            '@typescript-eslint/consistent-type-imports': [
                'warn',
                { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
            ],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-floating-promises': 'error',

            // --- 3. Code Cleanliness ---
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            eqeqeq: ['error', 'always'],
            semi: ['error', 'always'],
            'eol-last': 'off',
        },
    },
]);
