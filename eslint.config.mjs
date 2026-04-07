import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

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
  { files: [["**/*.js"], ["./functions/**"]], languageOptions: { sourceType: "commonjs" } },
]);
