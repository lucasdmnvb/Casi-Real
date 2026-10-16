import { defineConfig } from 'astro/config';
import path from 'node:path';

export default defineConfig({
  site: process.env.SITE_URL || 'https://example.invalid',
  trailingSlash: 'always',
  markdown: {},
  vite: {
    resolve: {
      alias: {
        '@': path.resolve('./src')
      }
    }
  }
});
