import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
    extensions: ['.js', '.jsx'],
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  },
});

