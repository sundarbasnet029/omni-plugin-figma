import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { viteSingleFile } from "vite-plugin-singlefile"

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  build: {
    rollupOptions: {
      input: {
        ui: resolve(__dirname, 'index.html'),
      },
    },
    outDir: 'dist',
    emptyOutDir: false, // Don't delete main.js from esbuild
  },
});
