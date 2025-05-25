import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    exclude: ['ammojs-typed'],
  },
});
