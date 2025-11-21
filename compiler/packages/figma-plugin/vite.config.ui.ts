import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import path from "path";

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  root: "./src",
  build: {
    target: "esnext",
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    outDir: "../dist",
    emptyOutDir: false, // code 빌드 결과물을 지우지 않도록 주의
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, "src/index.html"),
      },
      output: {
        entryFileNames: "ui.js", // 사실 singlefile이라 html 안에 들어감
      },
    },
  },
});
