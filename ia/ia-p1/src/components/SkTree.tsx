import { useMemo, useState } from 'react';

import type { NoArvore } from '../content/types';

const CORES = ['#e58139', '#399de5', '#8139e5', '#39e581'];

/** Intensidade da cor como no plot_tree: quanto mais puro o nó, mais forte. */
export function pureza(value: number[]): { classe: number; alfa: number } {
  const total = value.reduce((a, b) => a + b, 0);
  if (total === 0) return { classe: 0, alfa: 0 };
  const ordenado = [...value].sort((a, b) => b - a);
  const classe = value.indexOf(ordenado[0]);
  const alfa = (ordenado[0] - (ordenado[1] ?? 0)) / total;
  return { classe, alfa };
}

export const corClasse = (i: number) => CORES[i % CORES.length];

type Posicionado = { no: NoArvore; x: number; y: number; filhos: Posicionado[] };

const LARG = 168;
const ALT_NO = 92;
const PASSO_X = 182;
const PASSO_Y = 128;

function posicionar(no: NoArvore, profundidade: number, cursor: { x: number }): Posicionado {
  if (!no.sim || !no.nao) {
    const x = cursor.x;
    cursor.x += PASSO_X;
    return { no, x, y: profundidade * PASSO_Y, filhos: [] };
  }
  const a = posicionar(no.sim, profundidade + 1, cursor);
  const b = posicionar(no.nao, profundidade + 1, cursor);
  return { no, x: (a.x + b.x) / 2, y: profundidade * PASSO_Y, filhos: [a, b] };
}

function linhasDoNo(no: NoArvore): string[] {
  return [no.teste, no.impureza, `samples = ${no.samples}`, `value = [${no.value.join(', ')}]`, `class = ${no.classe}`].filter(Boolean) as string[];
}

function NoSvg({ p }: { p: Posicionado }) {
  const linhas = linhasDoNo(p.no);
  const { classe, alfa } = pureza(p.no.value);
  const h = linhas.length * 16 + 12;
  const x0 = p.x - LARG / 2;
  return (
    <g>
      <rect x={x0} y={p.y} width={LARG} height={h} rx={7} className="sk-no-fundo" />
      <rect x={x0} y={p.y} width={LARG} height={h} rx={7} fill={corClasse(classe)} fillOpacity={alfa * 0.78} />
      <rect x={x0} y={p.y} width={LARG} height={h} rx={7} className="sk-no-borda" />
      {linhas.map((t, i) => (
        <text key={i} x={p.x} y={p.y + 20 + i * 16} textAnchor="middle" className={i === 0 && p.no.teste ? 'sk-teste' : 'sk-linha'}>
          {t}
        </text>
      ))}
    </g>
  );
}

function Arestas({ p, raiz }: { p: Posicionado; raiz: boolean }) {
  const h = linhasDoNo(p.no).length * 16 + 12;
  return (
    <>
      {p.filhos.map((f, i) => {
        const x1 = p.x + (i === 0 ? -LARG / 4 : LARG / 4);
        const y1 = p.y + h;
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={f.x} y2={f.y} className="sk-aresta" markerEnd="url(#sk-seta)" />
            {raiz && (
              <text x={(x1 + f.x) / 2 + (i === 0 ? -18 : 18)} y={(y1 + f.y) / 2} textAnchor="middle" className="sk-rotulo">
                {i === 0 ? 'True' : 'False'}
              </text>
            )}
            <Arestas p={f} raiz={false} />
          </g>
        );
      })}
    </>
  );
}

function todos(p: Posicionado): Posicionado[] {
  return [p, ...p.filhos.flatMap(todos)];
}

/** Texto no estilo export_text do sklearn. */
export function exportText(no: NoArvore, nivel = 0): string[] {
  const pre = `${'|   '.repeat(nivel)}|--- `;
  if (!no.sim || !no.nao || !no.teste) {
    return [`${pre}class: ${no.classe}   (samples = ${no.samples}, value = [${no.value.join(', ')}])`];
  }
  const negado = no.teste.replace('<=', '> ');
  return [`${pre}${no.teste}`, ...exportText(no.sim, nivel + 1), `${pre}${negado}`, ...exportText(no.nao, nivel + 1)];
}

export function SkTree({ arvore, legenda, nomesClasses }: { arvore: NoArvore; legenda?: string; nomesClasses?: string[] }) {
  const [modo, setModo] = useState<'figura' | 'texto'>('figura');
  const layout = useMemo(() => {
    const raiz = posicionar(arvore, 0, { x: LARG / 2 + 8 });
    const nos = todos(raiz);
    const largura = Math.max(...nos.map((n) => n.x)) + LARG / 2 + 8;
    const altura = Math.max(...nos.map((n) => n.y)) + ALT_NO + 8;
    return { raiz, nos, largura, altura };
  }, [arvore]);

  return (
    <figure className="sk-arvore">
      <div className="sk-barra">
        {nomesClasses && (
          <span className="sk-legenda-classes">
            value = [
            {nomesClasses.map((c, i) => (
              <span key={c}>
                <span className="sk-ponto" style={{ background: corClasse(i) }} aria-hidden="true" />
                {c}
                {i < nomesClasses.length - 1 ? ', ' : ''}
              </span>
            ))}
            ]
          </span>
        )}
        <div className="seg" role="group" aria-label="Formato da árvore">
          <button type="button" aria-pressed={modo === 'figura'} onClick={() => setModo('figura')}>
            Figura
          </button>
          <button type="button" aria-pressed={modo === 'texto'} onClick={() => setModo('texto')}>
            Texto
          </button>
        </div>
      </div>
      {modo === 'figura' ? (
        <div className="sk-rolagem" tabIndex={0} aria-label="Árvore de decisão; role para os lados se precisar">
          <svg width={layout.largura} height={layout.altura} viewBox={`0 0 ${layout.largura} ${layout.altura}`} role="img" aria-label={exportText(arvore).join('\n')}>
            <defs>
              <marker id="sk-seta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 z" className="sk-seta" />
              </marker>
            </defs>
            <g transform="translate(0 4)">
              <Arestas p={layout.raiz} raiz />
              {layout.nos.map((p, i) => (
                <NoSvg key={i} p={p} />
              ))}
            </g>
          </svg>
        </div>
      ) : (
        <pre className="sk-texto">{exportText(arvore).join('\n')}</pre>
      )}
      {legenda && <figcaption>{legenda}</figcaption>}
    </figure>
  );
}
