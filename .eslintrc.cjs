module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
    ],
    settings: {
        react: {
            version: "detect",
        },
    },
    overrides: [
        {
            env: {
                node: true,
            },
            files: [".eslintrc.{js,cjs}"],
            parserOptions: {
                sourceType: "script",
            },
        },
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    ignorePatterns: ["/dist/*"],
    plugins: ["@typescript-eslint", "react", "react-hooks"],
    rules: {
        "@typescript-eslint/no-unused-vars": ["warn", { "varsIgnorePattern": "_" }],
        "react/react-in-jsx-scope": 0,
        "react/prop-types": 0,
    },
};
