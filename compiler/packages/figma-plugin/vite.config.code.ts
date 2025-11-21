import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  root: "./src",
  build: {
    target: "es2017",
    minify: false, // 디버깅을 위해
    outDir: "../dist",
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, "src/code.ts"),
      name: "code",
      fileName: () => "code.js",
      formats: ["es"],
    },
    rollupOptions: {
      output: {
        entryFileNames: "code.js",
      },
    },
  },
});
