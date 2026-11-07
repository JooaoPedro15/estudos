// Monta o site unico em `site/`: a pagina inicial (portal/) na raiz e cada
// modulo no seu caminho. Uso: `npm run build` na raiz do repositorio.
//
//   /              portal/
//   /arquitetura/  arquitetura-computadores/datapath-quest/ (HTML puro, so copia)
//   /grafos/       Grafos/        (vite build --base /grafos/)
//   /aeds/         aeds/aeds-2/   (vite build --base /aeds/)
//   /ia/           ia/ia-p1/      (ja usa base './', funciona em qualquer pasta)

import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const saida = path.join(raiz, 'site');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const modulosVite = [
  { pasta: 'Grafos', destino: 'grafos', base: '/grafos/' },
  { pasta: 'aeds/aeds-2', destino: 'aeds', base: '/aeds/' },
  { pasta: 'ia/ia-p1', destino: 'ia', base: null },
];

function rodar(args, cwd) {
  console.log(`\n> (${path.relative(raiz, cwd) || '.'}) npm ${args.join(' ')}`);
  execFileSync(npm, args, { cwd, stdio: 'inherit' });
}

rmSync(saida, { recursive: true, force: true });
mkdirSync(saida, { recursive: true });

cpSync(path.join(raiz, 'portal'), saida, { recursive: true });

const arquitetura = path.join(raiz, 'arquitetura-computadores/datapath-quest');
for (const item of ['index.html', 'design.css', 'content']) {
  cpSync(path.join(arquitetura, item), path.join(saida, 'arquitetura', item), { recursive: true });
}

for (const { pasta, destino, base } of modulosVite) {
  const dir = path.join(raiz, pasta);
  if (!existsSync(path.join(dir, 'node_modules'))) {
    rodar(['ci'], dir);
  }
  rodar(['run', 'build', ...(base ? ['--', '--base', base] : [])], dir);
  cpSync(path.join(dir, 'dist'), path.join(saida, destino), { recursive: true });
}

console.log(`\nSite montado em ${path.relative(raiz, saida)}/`);
