/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-prettier",
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  ignorePatterns: [
    "**/vendors/*.js",
    "*.cjs"
  ],
  globals: {
    Prism: "readonly",
    Highcharts: "readonly",
    SwaggerUIBundle: "readonly",
  },
};
