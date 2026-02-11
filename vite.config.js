import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    wasm(),
  ],
  resolve: {
    alias: {
      synthesis: path.resolve(__dirname, 'web-assembly/pkg'),
    },
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.wasm'],
  },
  build: {
    target: 'esnext',
  },
  base: '/arithmusic/',
});
