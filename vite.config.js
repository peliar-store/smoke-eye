import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  base: "./",
  root: "src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        sticky: resolve(__dirname, "src/sticky.html"),
        capture: resolve(__dirname, "src/capture.html"),
      },
    },
  },
  server: { port: 5173, strictPort: true, host: "0.0.0.0" },
});
