import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];

export default defineConfig({
  plugins: [react()],
  base: repositoryName ? `/${repositoryName}/` : '/',
  build: { target: 'es2022', sourcemap: true },
  worker: { format: 'es' },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
