import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        whatWeDo: resolve(__dirname, 'what-we-do.html'),
        howWeDoIt: resolve(__dirname, 'how-we-do-it.html'),
        programs: resolve(__dirname, 'programs.html'),
        ourWork: resolve(__dirname, 'our-work.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
  },
});
