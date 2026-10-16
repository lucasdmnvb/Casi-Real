import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    setupFiles: ['./tests/setup.ts'],
    environment: 'node'
  },
  resolve: {
    alias: {
      '@': path.resolve('./src'),
      'astro:content': path.resolve('./tests/mocks/astro-content.ts')
    }
  }
});
