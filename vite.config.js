// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  // other config settings...
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
