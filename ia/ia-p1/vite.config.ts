import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

/**
 * Junta JS e CSS dentro do index.html no build. Assim `dist/index.html` abre
 * direto do arquivo (file://), inclusive no celular, sem servidor.
 */
const escaparRegex = (texto: string) => texto.replace(/[.*+?^$()|[\]\\{}]/g, '\\$&');

function arquivoUnico(): Plugin {
  return {
    name: 'ia-p1-arquivo-unico',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const html = Object.values(bundle).find((item) => item.type === 'asset' && item.fileName.endsWith('.html'));
      if (!html || html.type !== 'asset') return;
      let source = String(html.source);

      for (const [fileName, item] of Object.entries(bundle)) {
        if (item.type === 'chunk' && fileName.endsWith('.js')) {
          const tag = new RegExp('<script[^>]*src="[./]*' + escaparRegex(fileName) + '"[^>]*></script>');
          const code = item.code.replace(/<\/script/gi, '<\/script');
          source = source.replace(tag, () => `<script type="module">${code}</script>`);
          delete bundle[fileName];
        } else if (item.type === 'asset' && fileName.endsWith('.css')) {
          const tag = new RegExp('<link[^>]*href="[./]*' + escaparRegex(fileName) + '"[^>]*>');
          source = source.replace(tag, () => `<style>${String(item.source)}</style>`);
          delete bundle[fileName];
        }
      }
      html.source = source;
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), arquivoUnico()],
  build: {
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
    modulePreload: false,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});
