import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: 'src/renderer',
  plugins: [react()],
  base: './',
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      'face-api.js': '@vladmandic/face-api',
      components: path.resolve(__dirname, 'src/renderer/src/components'),
      pages: path.resolve(__dirname, 'src/renderer/src/pages'),
      store: path.resolve(__dirname, 'src/renderer/src/store'),
      routes: path.resolve(__dirname, 'src/renderer/src/routes'),
      config: path.resolve(__dirname, 'src/renderer/src/config'),
      hooks: path.resolve(__dirname, 'src/renderer/src/hooks'),
      utils: path.resolve(__dirname, 'src/renderer/src/utils'),
      services: path.resolve(__dirname, 'src/renderer/src/services'),
      models: path.resolve(__dirname, 'src/renderer/src/models'),
      locales: path.resolve(__dirname, 'src/renderer/src/locales'),
      assets: path.resolve(__dirname, 'src/renderer/src/assets'),
    },
  },
  server: {
    port: 5173,
  },
});
