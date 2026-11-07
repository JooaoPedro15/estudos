// Serve a pasta `site/` localmente do mesmo jeito que a hospedagem:
// arquivo existente e entregue; rota desconhecida dentro de /grafos/ cai no
// index.html do Grafos (BrowserRouter). Uso: `npm run preview` (porta 4173).

import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'site');
const porta = Number(process.env.PORT ?? 4173);
const tipos = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
};

function resolver(url) {
  const caminho = path.join(raiz, decodeURIComponent(url.split('?')[0]));
  if (!caminho.startsWith(raiz)) return null;
  if (existsSync(caminho) && statSync(caminho).isFile()) return caminho;
  const indice = path.join(caminho, 'index.html');
  if (existsSync(indice)) return indice;
  if (url.startsWith('/grafos/')) return path.join(raiz, 'grafos', 'index.html');
  return null;
}

createServer((req, res) => {
  const url = req.url ?? '/';
  const sem = url.split('?')[0];
  // /grafos -> /grafos/ (igual a hospedagem), senao os caminhos relativos quebram
  if (!path.extname(sem) && !sem.endsWith('/') && existsSync(path.join(raiz, sem, 'index.html'))) {
    res.writeHead(308, { Location: `${sem}/` });
    return res.end();
  }
  const arquivo = resolver(url);
  if (!arquivo) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('404');
  }
  res.writeHead(200, { 'Content-Type': tipos[path.extname(arquivo)] ?? 'application/octet-stream' });
  createReadStream(arquivo).pipe(res);
}).listen(porta, () => console.log(`site/ em http://localhost:${porta}`));
