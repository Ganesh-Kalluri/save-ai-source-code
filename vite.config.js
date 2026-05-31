import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src")
    }
  },
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "popup.html"),
        options: resolve(__dirname, "options.html"),
        preview: resolve(__dirname, "preview.html"),
        sidepanel: resolve(__dirname, "sidepanel.html"),
        background: resolve(__dirname, "src/background/index.js"),
        content: resolve(__dirname, "src/content-scripts/content.js"),
        start: resolve(__dirname, "src/content-scripts/start.js"),
        saveai: resolve(__dirname, "src/content-scripts/saveai.js"),
        math_patch: resolve(__dirname, "src/content-scripts/math_patch.js")
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (["background", "content", "start", "saveai", "math_patch"].includes(chunkInfo.name)) {
            return "[name].js";
          }
          return "assets/[name]-[hash].js";
        },
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]"
      }
    }
  }
});
