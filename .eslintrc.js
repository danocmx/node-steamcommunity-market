module.exports = {
    "env": {
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "airbnb-base",
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "plugins": [
        "prettier"
    ],
    "rules": {
        "indent": ["error", "tab"],
        "no-tabs": "off",
        "func-names": "off",
        "space-before-function-paren": "off",
        "object-curly-newline": "off",
        "radix": "off",
        "no-plusplus": "off",
    }
};