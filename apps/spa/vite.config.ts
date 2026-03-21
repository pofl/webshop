import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  // resolve: {
  //   // Ensure only one copy of React is used across all packages in the monorepo
  //   dedupe: ["react", "react-dom", "react-router"],
  // },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
  publicDir: "../../public",
});
