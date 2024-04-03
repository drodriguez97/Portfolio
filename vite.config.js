import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    // Other plugins
    compression({
      algorithm: 'brotliCompress',
      ext: '.br', // extension for the compressed files
    }),
  ],
});
