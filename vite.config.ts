import { defineConfig } from "vite";

export default defineConfig({
  optimizeDeps: {},
  server: {
    host: true, // equivalent to 0.0.0.0
    port: 5173,
  },
  esbuild: {
    jsxFactory: "MiniReact.createElement",
  },
});
