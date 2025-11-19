import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/extension.ts"],
  format: ["cjs"],
  target: "node16",
  platform: "node",
  external: ["vscode"],
  noExternal: [
    "@uih-dsl/tokenizer",
    "@uih-dsl/parser",
    "@uih-dsl/ir",
    "@uih-dsl/codegen-react",
    "@uih-dsl/codegen-vue",
    "@uih-dsl/codegen-svelte",
  ],
  bundle: true,
  minify: false,
  sourcemap: true,
  clean: true,
  tsconfig: "./tsconfig.json",
});
