/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { FlatCompat } from '@eslint/eslintrc'
import path from 'path'
import { fileURLToPath } from 'url'
import eslintjs from '@eslint/js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
    baseDirectory: __dirname
})

export default [
    eslintjs.configs.recommended,
    ...compat.extends(
        'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
        // 'plugin:react/recommended', // throws error in ESLint, waiting for fix
        'plugin:react/jsx-runtime'
    ),
    ...compat.config({
        root: true,
        env: { browser: true, es2020: true },
        plugins: [
            'react-refresh',
            '@stylistic/js'
        ],
        ignorePatterns: [
            '/dist/',
            '/dist-electron/',
            '/release/'
        ],
        parser: '@typescript-eslint/parser',
        parserOptions: {
            project: './tsconfig.json',
            tsconfigRootDir: __dirname
        },
        rules: {
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true } ],
            '@stylistic/js/indent': ['warn', 4, { 'SwitchCase': 1 }],
            '@stylistic/js/quotes': ['warn', 'single'],
            '@stylistic/js/semi': ['warn', 'never'],
            'no-empty': ['warn'],
            '@typescript-eslint/no-empty-function': ['warn'],
            '@typescript-eslint/no-unused-vars': ['warn']
        },
        settings: {
            'react': {
                'version': 'detect'
            }
        }
    })
]