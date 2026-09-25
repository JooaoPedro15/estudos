import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin, ViteDevServer } from 'vite';

import { corrigir } from './corrigir';
import type { DrillCorrigivel, ResultadoCorrecao } from './tipos';

/**
 * Plugin do Vite que pluga o corretor estilo Verde no servidor de
 * desenvolvimento: POST /api/verde/rodar { drillId, codigo }.
 *
 * O catalogo de exercicios e carregado com ssrLoadModule (o mesmo codigo
 * que o navegador usa, sem duplicar nada) a cada requisicao — editar um
 * exercicio vale na hora, sem reiniciar o servidor. So existe no
 * `npm run dev`: o build estatico nao tem backend, e a tela avisa isso.
 */

const CATALOGOS = ['/src/content/prova1PraticaDrills.ts', '/src/content/prova2PraticaDrills.ts', '/src/content/prova3PraticaDrills.ts'];

async function acharDrill(server: ViteDevServer, drillId: string): Promise<DrillCorrigivel | undefined> {
  for (const caminho of CATALOGOS) {
    const modulo = (await server.ssrLoadModule(caminho)) as Record<string, unknown>;
    for (const valor of Object.values(modulo)) {
      if (Array.isArray(valor)) {
        const drill = (valor as DrillCorrigivel[]).find((item) => item && item.id === drillId);
        if (drill) {
          return drill;
        }
      }
    }
  }
  return undefined;
}

function lerCorpo(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let corpo = '';
    req.setEncoding('utf8');
    req.on('data', (pedaco: string) => {
      corpo += pedaco;
      if (corpo.length > 1024 * 1024) {
        reject(new Error('Codigo grande demais.'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(corpo));
    req.on('error', reject);
  });
}

function responder(res: ServerResponse, status: number, corpo: ResultadoCorrecao) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(corpo));
}

export function corretorVerde(): Plugin {
  return {
    name: 'aeds2-corretor-verde',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/verde/rodar', (req, res) => {
        if (req.method !== 'POST') {
          responder(res, 405, { status: 'indisponivel', mensagem: 'Use POST.' });
          return;
        }
        (async () => {
          try {
            const { drillId, codigo } = JSON.parse(await lerCorpo(req)) as { drillId?: string; codigo?: string };
            const drill = drillId ? await acharDrill(server, drillId) : undefined;
            if (!drill) {
              responder(res, 404, { status: 'indisponivel', mensagem: `Exercicio desconhecido: ${drillId ?? '(sem id)'}` });
              return;
            }
            responder(res, 200, await corrigir(drill, codigo ?? ''));
          } catch (erro) {
            responder(res, 500, { status: 'indisponivel', mensagem: `Erro no corretor: ${String(erro)}` });
          }
        })();
      });
    },
  };
}
