import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react({
    include: "**/*.{jsx,js,tsx,ts}",
  })],
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
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
