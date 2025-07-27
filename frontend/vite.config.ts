import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
    extensions: ['.ts', '.tsx'],
  },
  server: {
    port: 3001,
  },
  build: {
    outDir: 'dist',
  },
});

