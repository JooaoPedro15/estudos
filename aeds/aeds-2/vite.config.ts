import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

import { corretorVerde } from './corretor/plugin';

export default defineConfig({
  plugins: [react(), corretorVerde()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    // A verificacao com Java (compila e roda as 44 solucoes modelo) e lenta:
    // roda so com `npm run verificar:pratica`.
    exclude: ['**/node_modules/**', '**/dist/**', 'corretor/**/*.java.test.ts'],
  },
});
