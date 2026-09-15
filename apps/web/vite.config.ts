import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": new URL("./src", import.meta.url).pathname } },
  server: { proxy: { "/api": "http://localhost:3637" } },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/[\\/]node_modules[\\/](react|react-dom|react-router-dom|@tanstack[\\/]react-query)[\\/]/.test(id)) return "react";
          if (/[\\/]node_modules[\\/]@tanstack[\\/]react-table[\\/]/.test(id)) return "tables";
          if (/[\\/]node_modules[\\/]motion[\\/]/.test(id)) return "motion";
          if (/[\\/]node_modules[\\/]zod[\\/]/.test(id) || id.includes("packages/contracts")) return "validation";
        },
      },
    },
  },
  test: { environment: "jsdom", setupFiles: "./src/test-setup.ts" },
});
