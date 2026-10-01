import { Calculator, ClipboardList, House, NotebookPen } from 'lucide-react';
import type { ReactNode } from 'react';

import { modulo } from '../content';
import type { ModuloId } from '../content/types';
import { Caderno } from '../screens/Caderno';
import { Ferramentas } from '../screens/Ferramentas';
import { Home } from '../screens/Home';
import { ModuloScreen } from '../screens/ModuloScreen';
import { Simulado } from '../screens/Simulado';
import { TreinoScreen } from '../screens/TreinoScreen';
import { EstudoProvider, useEstudo } from '../state/EstudoContext';
import { link, useRota } from './router';

const NAV = [
  { href: '/', rotulo: 'Início', Icone: House, ativo: (r: string[]) => r.length === 0 || r[0] === 'modulo' || r[0] === 'treino' },
  { href: '/ferramentas', rotulo: 'Ferramentas', Icone: Calculator, ativo: (r: string[]) => r[0] === 'ferramentas' },
  { href: '/simulado', rotulo: 'Simulado 2025', Icone: ClipboardList, ativo: (r: string[]) => r[0] === 'simulado' },
  { href: '/caderno', rotulo: 'Caderno de erros', Icone: NotebookPen, ativo: (r: string[]) => r[0] === 'caderno' },
];

function Marca() {
  return (
    <a href={link('/')} className="marca" aria-label="IA P1, início">
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
        <path d="M13 9 L6 18 M13 9 L20 18" className="marca-galho" />
        <rect x="8" y="2" width="10" height="8" rx="2" className="marca-raiz" />
        <rect x="1" y="17" width="10" height="7" rx="2" className="marca-nao" />
        <rect x="15" y="17" width="10" height="7" rx="2" className="marca-sim" />
      </svg>
      <span>
        IA <span className="marca-p1">P1</span>
      </span>
    </a>
  );
}

function Shell({ rota, children }: { rota: string[]; children: ReactNode }) {
  const { save } = useEstudo();
  const erros = Object.keys(save.caderno).length;
  return (
    <div className="app">
      <a href="#conteudo" className="pular">
        Pular para o conteúdo
      </a>
      <header className="topo">
        <div className="topo-dentro">
          <Marca />
          <nav aria-label="Navegação principal" className="nav-topo">
            {NAV.map(({ href, rotulo, Icone, ativo }) => (
              <a key={href} href={link(href)} className="nav-item" aria-current={ativo(rota) ? 'page' : undefined}>
                <Icone size={16} aria-hidden="true" />
                {rotulo}
                {href === '/caderno' && erros > 0 && <span className="contador">{erros}</span>}
              </a>
            ))}
          </nav>
        </div>
      </header>
      <main id="conteudo" className="conteudo" tabIndex={-1}>
        {children}
      </main>
      <nav aria-label="Navegação" className="nav-baixo">
        {NAV.map(({ href, rotulo, Icone, ativo }) => (
          <a key={href} href={link(href)} className="nav-baixo-item" aria-current={ativo(rota) ? 'page' : undefined}>
            <span className="nav-baixo-icone">
              <Icone size={20} aria-hidden="true" />
              {href === '/caderno' && erros > 0 && <span className="contador">{erros}</span>}
            </span>
            <span>{rotulo.replace(' 2025', '').replace(' de erros', '')}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}

function Rotas({ rota }: { rota: string[] }) {
  const [a, b, c] = rota;
  if (a === 'modulo' && b && modulo(b)) return <ModuloScreen key={b} id={b as ModuloId} aba={c} />;
  if (a === 'treino' && b) return <TreinoScreen key={rota.join('/')} alvo={b} inicio={c} />;
  if (a === 'ferramentas') return <Ferramentas aba={b} />;
  if (a === 'simulado') return <Simulado />;
  if (a === 'caderno') return <Caderno />;
  return <Home />;
}

export function App() {
  const rota = useRota();
  return (
    <EstudoProvider>
      <Shell rota={rota}>
        <Rotas rota={rota} />
      </Shell>
    </EstudoProvider>
  );
}
