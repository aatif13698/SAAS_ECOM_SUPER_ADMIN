import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import replace from '@rollup/plugin-replace';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react({
      jsxImportSource: '@emotion/react', // Support MUI with Emotion
    }),
    replace({
      preventAssignment: true,
      values: {
        __DEV__: 'true',
        'process.env.NODE_ENV': '"development"',
      },
    }),
  ],
  server: {
    proxy: {
      '/customizations': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1600,
  },
});