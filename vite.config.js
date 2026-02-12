import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    wasm(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      synthesis: path.resolve(__dirname, 'web-assembly/pkg'),
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.wasm'],
  },
  build: {
    target: 'esnext',
  },
  base: '/arithmusic/',
});
