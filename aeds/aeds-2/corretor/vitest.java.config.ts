import { defineConfig } from 'vitest/config';

/**
 * Config da verificacao com Java (`npm run verificar:pratica`): compila e
 * executa todas as solucoes modelo da prova pratica no corretor. Fica fora
 * do `npm test` porque leva alguns minutos e precisa do JDK instalado.
 */
export default defineConfig({
  test: {
    include: ['corretor/**/*.java.test.ts'],
    environment: 'node',
    testTimeout: 10 * 60 * 1000,
    hookTimeout: 10 * 60 * 1000,
  },
});
