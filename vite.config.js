import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        programmes: resolve(__dirname, 'programmes.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
  },
});
