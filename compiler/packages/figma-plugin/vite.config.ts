import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import path from "path";

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  root: "./src",
  build: {
    target: "esnext",
    assetsInlineLimit: 100000000, // 모든 자산을 인라인화
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        ui: path.resolve(__dirname, "src/index.html"),
        code: path.resolve(__dirname, "src/code.ts"),
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
});
