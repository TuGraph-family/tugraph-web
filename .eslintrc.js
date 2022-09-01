module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: ['plugin:vue/essential', '@vue/prettier', '@vue/typescript', 'plugin:prettier/recommended'],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'off' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'off' : 'off',
        'prettier/prettier': [
            'error',
            {
                useTabs: false,
                tabWidth: 4,
                semi: false,
                singleQuote: true,
                trailingComma: 'none',
                bracketSpacing: true,
                jsxBracketSameLine: true,
                arrowParens: 'always',
                printWidth: 200
            }
        ]
    },
    parserOptions: {
        parser: '@typescript-eslint/parser'
    }
}
