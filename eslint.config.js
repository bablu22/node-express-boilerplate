import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    // Globally ignored files
    ignores: ['**/node_modules/', '**/dist/', '**/.git/', '**/.husky/'],
  },
  // Recommended base configs
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    files: ['**/*.ts'],
    rules: {
      // TypeScript-specific rules
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-console': 'off',

      // General rules
      'no-undef': 'error',
      'no-unused-expressions': 'error',
      'prefer-const': 'warn',
    },
    languageOptions: {
      globals: {
        browser: true,
        node: true,
        process: 'readonly', // Add process as a global
        console: 'readonly', // Add console as a global
        es2021: true,
        env: true,
      },
      ecmaVersion: 2021,
    },
  }
);
