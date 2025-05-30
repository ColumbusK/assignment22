import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // 必须要有，Vite 才会监听 0.0.0.0
    port: 5173,
  },
  preview: {
    host: true,
    port: 5173,
  },
  build: {
    minify: false,
    sourcemap: true,
  },
});
