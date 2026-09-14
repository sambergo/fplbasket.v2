import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  server: { proxy: { "/api": "http://localhost:3637" } },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom", "@tanstack/react-query"],
          tables: ["@tanstack/react-table"],
          motion: ["motion"],
          validation: ["zod", "@fpl-basket/contracts"],
        },
      },
    },
  },
  test: { environment: "jsdom", setupFiles: "./src/test-setup.ts" },
});
