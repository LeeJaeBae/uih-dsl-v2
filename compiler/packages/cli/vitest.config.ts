import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  test: {
    environment: "node",
  },
  resolve: {
    alias: {
      "@uih-dsl/codegen-react": resolve(__dirname, "../codegen/react/src/index.ts"),
      "@uih-dsl/codegen-vue": resolve(__dirname, "../codegen/vue/src/index.ts"),
      "@uih-dsl/codegen-svelte": resolve(__dirname, "../codegen/svelte/src/index.ts"),
      "@uih-dsl/tokenizer": resolve(__dirname, "../tokenizer/src/index.ts"),
      "@uih-dsl/parser": resolve(__dirname, "../parser/src/index.ts"),
      "@uih-dsl/ir": resolve(__dirname, "../ir/src/index.ts"),
      "@uih-dsl/validator": resolve(__dirname, "../validator/src/index.ts"),
    },
  },
});
