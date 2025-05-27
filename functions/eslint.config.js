const js = require("@eslint/js");
const typescript = require("@typescript-eslint/eslint-plugin");
const parser = require("@typescript-eslint/parser");

module.exports = [
  js.configs.recommended,
  {
    ignores: ["**/lib/**/*", "**/generated/**/*"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        require: "readonly",
        module: "writable",
        console: "readonly", // ✅ permite usar console
      },
    },
    rules: {
      quotes: ["error", "double"],
      indent: ["error", 2],
      "no-undef": "off", // ✅ opcional: desactiva no-undef
    },
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: parser,
      parserOptions: {
        project: ["./tsconfig.json", "./tsconfig.dev.json"],
        sourceType: "module",
      },
      globals: {
        console: "readonly", // ✅ también para TypeScript
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      quotes: ["error", "double"],
      indent: ["error", 2],
      "@typescript-eslint/no-unused-vars": "warn",
      "no-undef": "off", // ✅ opcional
    },
  },
];
