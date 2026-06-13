import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react({
    include: "**/*.{jsx,js,tsx,ts}",
  })],
  root: ".",
  publicDir: "public",
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      input: resolve(__dirname, "public/index.html"),
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  test: {
    environment: "jsdom",
  },
});
