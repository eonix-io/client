module.exports = {
    'env': {
        'es6': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parserOptions': {
        'ecmaVersion': 2019,
        'parser': '@typescript-eslint/parser',
        'sourceType': 'module'
    },
    'plugins': [
        '@typescript-eslint'
    ],
    'rules': {

        '@typescript-eslint/no-explicit-any': [
            'off'
        ],

        '@typescript-eslint/no-inferrable-types': [
            'off'
        ],

        '@typescript-eslint/no-unused-vars': [
            'warn', { varsIgnorePattern: '^_', argsIgnorePattern: '^_', ignoreRestSiblings: true }
        ],

        'quotes': [
            'error',
            'single'
        ],

        '@typescript-eslint/no-non-null-assertion': [
            'off'
        ],

        'semi': [
            'error',
            'always'
        ]
    }
};