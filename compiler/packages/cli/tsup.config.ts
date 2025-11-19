import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: false,
  clean: true,
  splitting: false,
  sourcemap: false,
  minify: false,
  shims: true,
  skipNodeModulesBundle: true,
});
