import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import markdown from "@eslint/markdown";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      "js/no-exports": "off",
      "js/no-import": "off",
    },
    languageOptions: { globals: globals.browser },
  },
  {
    files: [["**/*.js"], ["./functions/**"]],
    languageOptions: { sourceType: "commonjs" },
  },
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/gfm",
    languageOptions: { frontmatter: "yaml" },
    rules: { 
      "markdown/fenced-code-language": "error",
      "markdown/heading-increment": "error", 
      "markdown/no-duplicate-headings": "error", 
      "markdown/no-invalid-label-refs": "error",
      "markdown/no-missing-label-refs": "error",
      "markdown/no-multiple-h1": "error",
      "markdown/no-reference-like-urls": "error",
      "markdown/no-reversed-media-syntax": "error",
      "markdown/no-space-in-emphasis": "error",
      "markdown/no-unused-definitions": "error",
      "markdown/require-alt-text": "error",
      "markdown/table-column-count": "error",
    
    },
  },
]);
