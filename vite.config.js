import { readdirSync } from 'fs';
import { resolve } from 'path';
import { defineConfig } from 'vite';

function getBlogInputs() {
  const blogDir = resolve(__dirname, 'blog');
  const inputs = {
    blog: resolve(blogDir, 'index.html'),
  };

  try {
    for (const file of readdirSync(blogDir)) {
      if (file.endsWith('.html') && file !== 'index.html') {
        inputs[`blog-${file.replace('.html', '')}`] = resolve(blogDir, file);
      }
    }
  } catch {
    // blog/ may not exist before first generate run
  }

  return inputs;
}

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        whatWeDo: resolve(__dirname, 'what-we-do.html'),
        ...getBlogInputs(),
      },
    },
  },
});
