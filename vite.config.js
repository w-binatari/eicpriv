import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        programmes: resolve(__dirname, 'programmes.html'),
        impact: resolve(__dirname, 'impact.html'),
        clarity4d: resolve(__dirname, 'clarity4d.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
  },
});
