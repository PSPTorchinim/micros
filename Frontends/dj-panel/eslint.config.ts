import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import react from 'eslint-plugin-react';

export default [
  js.configs.recommended,
  react.configs.recommended,
  reactHooks.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        JSX: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    env: {
      browser: true,
      es2021: true,
      jest: true,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // Add customized rules here as per your project's needs
    },
  },
];
