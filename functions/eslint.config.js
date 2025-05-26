// eslint.config.js
const js = require("@eslint/js");
const typescript = require("@typescript-eslint/eslint-plugin");
const parser = require("@typescript-eslint/parser");

module.exports = [
  // Base configuration for all files
  js.configs.recommended,
  {
    ignores: [
      "**/lib/**/*",
      "**/generated/**/*",
    ]
  },
  // JavaScript files
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        require: "readonly",
        module: "writable"
      }
    },
    rules: {
      "quotes": ["error", "double"],
      "indent": ["error", 2]
    }
  },
  // TypeScript files
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: parser,
      parserOptions: {
        project: ["./tsconfig.json", "./tsconfig.dev.json"],
        sourceType: "module"
      }
    },
    plugins: {
      "@typescript-eslint": typescript
    },
    rules: {
      ...typescript.configs.recommended.rules,
      "quotes": ["error", "double"],
      "indent": ["error", 2],
      "@typescript-eslint/no-unused-vars": "warn"
    }
  }
];
