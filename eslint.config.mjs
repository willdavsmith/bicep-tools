// @ts-check
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      '**/jest.config.js',
      '**/eslint.config.mjs',
      '**/webpack.config.js',
      '**/nexe.config.js',
      '**/dist/**',
      '**/bicep-types/**',
      '**/bin.js',
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  }
)
