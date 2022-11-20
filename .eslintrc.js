/**
 * {@link https://eslint.org/docs/user-guide Eslint User Guide}
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },

  env: {
    es2021: true,
    node: true,
  },

  ignorePatterns: ["/build", "/node_modules"],

  plugins: ["prettier", "@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],

  /**
   * https://eslint.org/docs/user-guide/configuring/rules#configuring-rules
   *
   * "off" or 0 - turn the rule off
   * "warn" or 1 - turn the rule on as a warning (doesn't affect exit code)
   * "error" or 2 - turn the rule on as an error (exit code is 1 when triggered)
   */
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": 1,
    "@typescript-eslint/no-empty-function": 1,
    "@typescript-eslint/no-empty-interface": 0,
    "@typescript-eslint/no-explicit-any": 1,
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/no-unused-vars": [1, { ignoreRestSiblings: true, argsIgnorePattern: "^_" }],
    "no-console": 0,
    "no-constant-condition": 1,
    "no-empty-function": 1,
    "no-unused-vars": 0,
    "prettier/prettier": [1, { endOfLine: "auto" }],
  },
};
