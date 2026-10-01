import type { ReactNode } from 'react';

import type { DiagramaId } from '../content/types';
import { entropia, gini } from '../engine/calc';

/**
 * Diagramas em SVG, desenhados para caber em 360px de largura (celular) e
 * crescer até ~560px no desktop. Cores vem das classes .dg-* do CSS.
 */
function Svg({ altura, titulo, children }: { altura: number; titulo: string; children: ReactNode }) {
  return (
    <svg className="dg" viewBox={`0 0 360 ${altura}`} role="img" aria-label={titulo}>
      <title>{titulo}</title>
      <defs>
        <marker id="dg-seta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" className="dg-seta" />
        </marker>
      </defs>
      {children}
    </svg>
  );
}

function Caixa({ x, y, w, h, texto, classe = 'dg-caixa', sub }: { x: number; y: number; w: number; h: number; texto: string; classe?: string; sub?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} className={classe} />
      <text x={x + w / 2} y={sub ? y + h / 2 - 2 : y + h / 2 + 4} textAnchor="middle" className="dg-txt">
        {texto}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" className="dg-sub">
          {sub}
        </text>
      )}
    </g>
  );
}

const Seta = ({ x1, y1, x2, y2, tracejada }: { x1: number; y1: number; x2: number; y2: number; tracejada?: boolean }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} className={tracejada ? 'dg-linha dg-tracejada' : 'dg-linha'} markerEnd="url(#dg-seta)" />
);

function Kdd() {
  const etapas = [
    ['1', 'Entender o domínio e as metas do KDD'],
    ['2', 'Seleção e adição de dados'],
    ['3', 'Pré-processamento (limpeza)'],
    ['4', 'Transformação'],
    ['5 a 7', 'Mineração de dados (DM)'],
    ['8', 'Avaliação e interpretação'],
    ['9', 'Conhecimento descoberto'],
  ];
  return (
    <Svg altura={316} titulo="Processo de KDD em 9 etapas segundo Rokach">
      {etapas.map(([n, t], i) => {
        const y = 8 + i * 43;
        const x = 8 + i * 14;
        const dm = n === '5 a 7';
        return (
          <g key={n}>
            <rect x={x} y={y} width={258} height={32} rx={6} className={dm ? 'dg-caixa dg-sim' : 'dg-caixa'} />
            <text x={x + 12} y={y + 20} className="dg-num">
              {n}
            </text>
            <text x={x + 52} y={y + 20} className="dg-txt dg-esq">
              {t}
            </text>
            {i < etapas.length - 1 && <Seta x1={x + 130} y1={y + 32} x2={x + 144} y2={y + 43} />}
          </g>
        );
      })}
      <path d="M 346 300 C 356 200, 356 100, 300 24" className="dg-linha dg-tracejada" markerEnd="url(#dg-seta)" fill="none" />
      <text x={350} y={168} className="dg-sub" textAnchor="middle" transform="rotate(-90 350 168)">
        dá para voltar a etapas anteriores
      </text>
    </Svg>
  );
}

function IaAmDl() {
  const camadas = [
    { r: 0, nome: 'Inteligência Artificial', ano: 'anos 1950' },
    { r: 1, nome: 'Aprendizado de Máquina', ano: 'anos 1980' },
    { r: 2, nome: 'Redes Neurais', ano: '' },
    { r: 3, nome: 'Deep Learning', ano: 'anos 2010' },
  ];
  return (
    <Svg altura={220} titulo="IA contém aprendizado de máquina, que contém redes neurais, que contém deep learning">
      {camadas.map(({ r, nome, ano }) => {
        const x = 8 + r * 34;
        const y = 8 + r * 40;
        return (
          <g key={nome}>
            <rect x={x} y={y} width={344 - r * 68} height={204 - r * 48} rx={14} className={r === 3 ? 'dg-caixa dg-sim' : 'dg-caixa'} />
            <text x={x + 12} y={y + 22} className="dg-txt dg-esq dg-forte">
              {nome}
            </text>
            {ano && (
              <text x={x + 344 - r * 68 - 12} y={y + 22} className="dg-sub" textAnchor="end">
                {ano}
              </text>
            )}
          </g>
        );
      })}
    </Svg>
  );
}

function TiposAprendizado() {
  const tipos: [string, string][] = [
    ['Supervisionado', '(entrada, rótulo)'],
    ['Não supervisionado', 'só entradas; agrupa'],
    ['Semi-supervisionado', 'rotulados + não rotulados'],
    ['Por reforço', 'maximiza recompensas'],
    ['Deep learning', 'RN com muitas camadas'],
  ];
  return (
    <Svg altura={250} titulo="Tipos de aprendizagem">
      <Caixa x={110} y={6} w={140} h={30} texto="Tipos de aprendizagem" classe="dg-caixa dg-forte-borda" />
      {tipos.map(([t, s], i) => {
        const y = 50 + i * 40;
        return (
          <g key={t}>
            <path d={`M 180 36 L 180 ${y + 15} L 196 ${y + 15}`} className="dg-linha" fill="none" />
            <Caixa x={196} y={y} w={158} h={32} texto={t} sub={s} />
          </g>
        );
      })}
      <text x={8} y={70} className="dg-sub dg-esq">
        o indutor recebe...
      </text>
    </Svg>
  );
}

function HoldoutKfold() {
  const k = 5;
  return (
    <Svg altura={232} titulo="Holdout separa treino e teste; k-fold alterna a parte de validação">
      <text x={8} y={18} className="dg-txt dg-esq dg-forte">
        Holdout (test_size = 0.20)
      </text>
      <rect x={8} y={26} width={275} height={26} rx={4} className="dg-caixa dg-sim" />
      <text x={145} y={44} textAnchor="middle" className="dg-txt">
        treino 80%
      </text>
      <rect x={285} y={26} width={67} height={26} rx={4} className="dg-caixa dg-nao" />
      <text x={318} y={44} textAnchor="middle" className="dg-txt">
        teste
      </text>
      <text x={8} y={82} className="dg-txt dg-esq dg-forte">
        k-fold no treino (desenho com k = 5)
      </text>
      {Array.from({ length: k }, (_, linha) => (
        <g key={linha}>
          <text x={8} y={108 + linha * 26} className="dg-sub dg-esq">
            rodada {linha + 1}
          </text>
          {Array.from({ length: k }, (_, c) => (
            <rect key={c} x={70 + c * 57} y={94 + linha * 26} width={55} height={20} rx={3} className={c === linha ? 'dg-caixa dg-xp' : 'dg-caixa dg-sim-leve'} />
          ))}
        </g>
      ))}
      <text x={70} y={228} className="dg-sub dg-esq">
        amarelo = validação da rodada; o notebook usa k = 10
      </text>
    </Svg>
  );
}

function OverUnder() {
  const grupos: [string, number, number][] = [
    ['Treino original', 165, 63],
    ['TomekLinks (under)', 153, 63],
    ['SMOTE minority (over)', 165, 165],
  ];
  const escala = 0.62;
  return (
    <Svg altura={196} titulo="Contagem das classes antes e depois do balanceamento no notebook">
      {grupos.map(([nome, maj, min], i) => {
        const x = 14 + i * 116;
        const base = 156;
        return (
          <g key={nome}>
            <rect x={x} y={base - maj * escala} width={40} height={maj * escala} className="dg-barra-nao" rx={3} />
            <rect x={x + 46} y={base - min * escala} width={40} height={min * escala} className="dg-barra-sim" rx={3} />
            <text x={x + 20} y={base - maj * escala - 4} textAnchor="middle" className="dg-sub">
              {maj}
            </text>
            <text x={x + 66} y={base - min * escala - 4} textAnchor="middle" className="dg-sub">
              {min}
            </text>
            <text x={x + 43} y={174} textAnchor="middle" className="dg-sub">
              {nome}
            </text>
          </g>
        );
      })}
      <line x1={8} y1={156} x2={352} y2={156} className="dg-linha" />
      <rect x={8} y={184} width={10} height={10} className="dg-barra-nao" />
      <text x={22} y={193} className="dg-sub dg-esq">
        majoritária (no-recurrence)
      </text>
      <rect x={190} y={184} width={10} height={10} className="dg-barra-sim" />
      <text x={204} y={193} className="dg-sub dg-esq">
        minoritária (recurrence)
      </text>
    </Svg>
  );
}

function Vazamento() {
  return (
    <Svg altura={214} titulo="Ordem certa: dividir, depois ajustar só no treino">
      <text x={8} y={16} className="dg-txt dg-esq dg-forte dg-cor-sim">
        Certo
      </text>
      <Caixa x={8} y={24} w={62} h={30} texto="Base" />
      <Seta x1={70} y1={39} x2={90} y2={39} />
      <Caixa x={90} y={24} w={62} h={30} texto="split" />
      <Seta x1={152} y1={32} x2={176} y2={32} />
      <Caixa x={176} y={20} w={176} h={26} texto="treino: SMOTE / fit imputer" classe="dg-caixa dg-sim" />
      <Seta x1={152} y1={48} x2={176} y2={62} />
      <Caixa x={176} y={52} w={176} h={26} texto="teste: só transform / predict" classe="dg-caixa" />
      <text x={8} y={118} className="dg-txt dg-esq dg-forte dg-cor-nao">
        Errado (vazamento)
      </text>
      <Caixa x={8} y={126} w={62} h={30} texto="Base" />
      <Seta x1={70} y1={141} x2={90} y2={141} />
      <Caixa x={90} y={126} w={118} h={30} texto="SMOTE na base toda" classe="dg-caixa dg-nao" />
      <Seta x1={208} y1={141} x2={228} y2={141} />
      <Caixa x={228} y={126} w={124} h={30} texto="split" />
      <text x={8} y={180} className="dg-sub dg-esq">
        sintéticos feitos com vizinhos de todo lado caem no teste;
      </text>
      <text x={8} y={196} className="dg-sub dg-esq">
        o teste deixa de ser "nunca visto"
      </text>
    </Svg>
  );
}

function EntropiaGini() {
  const pontos = (fn: (p: number) => number) =>
    Array.from({ length: 51 }, (_, i) => {
      const p = i / 50;
      return `${40 + p * 300},${190 - fn(p) * 160}`;
    }).join(' ');
  return (
    <Svg altura={226} titulo="Entropia e Gini para duas classes em função da proporção p">
      <line x1={40} y1={190} x2={344} y2={190} className="dg-linha" />
      <line x1={40} y1={190} x2={40} y2={20} className="dg-linha" />
      {[0, 0.5, 1].map((v) => (
        <g key={v}>
          <text x={34} y={194 - v * 160} textAnchor="end" className="dg-sub">
            {String(v).replace('.', ',')}
          </text>
          <line x1={40} y1={190 - v * 160} x2={344} y2={190 - v * 160} className="dg-grade" />
        </g>
      ))}
      {[0, 0.5, 1].map((v) => (
        <text key={v} x={40 + v * 300} y={206} textAnchor="middle" className="dg-sub">
          {String(v).replace('.', ',')}
        </text>
      ))}
      <polyline points={pontos((p) => entropia([p, 1 - p]))} className="dg-curva-sim" fill="none" />
      <polyline points={pontos((p) => gini([p, 1 - p]))} className="dg-curva-nao" fill="none" />
      <text x={190} y={24} textAnchor="middle" className="dg-txt dg-cor-sim">
        entropia (máx. 1)
      </text>
      <text x={190} y={98} textAnchor="middle" className="dg-txt dg-cor-nao">
        Gini (máx. 0,5)
      </text>
      <text x={344} y={222} textAnchor="end" className="dg-sub">
        p = proporção de uma das classes
      </text>
    </Svg>
  );
}

function BaggingRf() {
  const coluna = (x: number, titulo: string, rf: boolean) => (
    <g>
      <text x={x + 82} y={16} textAnchor="middle" className="dg-txt dg-forte">
        {titulo}
      </text>
      <Caixa x={x + 22} y={24} w={120} h={26} texto="treino" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Seta x1={x + 82} y1={50} x2={x + 22 + i * 60} y2={70} />
          <Caixa x={x + i * 58} y={70} w={50} h={26} texto={`boot ${i + 1}`} classe="dg-caixa dg-sim-leve" />
          <Seta x1={x + 25 + i * 58} y1={96} x2={x + 25 + i * 58} y2={114} />
          <Caixa x={x + i * 58} y={114} w={50} h={34} texto="árvore" sub={rf ? 'm por nó' : 'todos atr.'} classe={rf ? 'dg-caixa dg-sim' : 'dg-caixa'} />
          <Seta x1={x + 25 + i * 58} y1={148} x2={x + 82} y2={172} />
        </g>
      ))}
      <Caixa x={x + 22} y={172} w={120} h={28} texto="voto majoritário" classe="dg-caixa dg-xp" />
    </g>
  );
  return (
    <Svg altura={208} titulo="Bagging e Random Forest: o RF sorteia m atributos em cada nó">
      {coluna(4, 'Bagging', false)}
      {coluna(186, 'Random Forest', true)}
    </Svg>
  );
}

function Bootstrap() {
  const original = ['x1', 'x2', 'x3', 'x4', 'x5', 'x6'];
  const amostra = ['x1', 'x6', 'x3', 'x5', 'x3', 'x1'];
  const fora = original.filter((x) => !amostra.includes(x));
  return (
    <Svg altura={150} titulo="Amostra bootstrap com reposição e exemplos que ficam de fora">
      <text x={8} y={16} className="dg-sub dg-esq">
        base original
      </text>
      {original.map((x, i) => (
        <Caixa key={x} x={8 + i * 50} y={22} w={44} h={24} texto={x} />
      ))}
      <text x={8} y={70} className="dg-sub dg-esq">
        amostra 1 (com reposição, mesmo tamanho)
      </text>
      {amostra.map((x, i) => (
        <Caixa key={i} x={8 + i * 50} y={76} w={44} h={24} texto={x} classe={amostra.indexOf(x) !== i ? 'dg-caixa dg-xp' : 'dg-caixa dg-sim'} />
      ))}
      <text x={8} y={124} className="dg-sub dg-esq">
        repetidos em amarelo; ficaram de fora (viram teste):
      </text>
      {fora.map((x, i) => (
        <Caixa key={x} x={8 + i * 50} y={128} w={44} h={20} texto={x} classe="dg-caixa dg-nao" />
      ))}
    </Svg>
  );
}

function Boosting() {
  const rodadas = [
    { atual: [0.2, 0.2, 0.2, 0.2, 0.2], classif: 'CICCI', novo: [0.2, 0.4, 0.2, 0.2, 0.4] },
    { atual: [0.2, 0.4, 0.2, 0.2, 0.4], classif: 'CICIC', novo: [0.2, 0.6, 0.2, 0.4, 0.4] },
  ];
  return (
    <Svg altura={196} titulo="Boosting: exemplos classificados incorretamente ganham peso">
      {rodadas.map((r, k) => {
        const y0 = 6 + k * 96;
        return (
          <g key={k}>
            <text x={8} y={y0 + 14} className="dg-txt dg-esq dg-forte">
              Iteração {k + 1}
            </text>
            {r.atual.map((w, i) => {
              const x = 92 + i * 52;
              const errou = r.classif[i] === 'I';
              return (
                <g key={i}>
                  <text x={x + 22} y={y0 + 14} textAnchor="middle" className="dg-sub">
                    x{i + 1}
                  </text>
                  <rect x={x} y={y0 + 20} width={44} height={22} rx={4} className="dg-caixa" />
                  <text x={x + 22} y={y0 + 35} textAnchor="middle" className="dg-txt">
                    {String(w).replace('.', ',')}
                  </text>
                  <text x={x + 22} y={y0 + 56} textAnchor="middle" className={errou ? 'dg-txt dg-cor-nao' : 'dg-txt dg-cor-sim'}>
                    {errou ? 'I' : 'C'}
                  </text>
                  <rect x={x} y={y0 + 62} width={44} height={22} rx={4} className={errou ? 'dg-caixa dg-nao' : 'dg-caixa'} />
                  <text x={x + 22} y={y0 + 77} textAnchor="middle" className="dg-txt">
                    {String(r.novo[i]).replace('.', ',')}
                  </text>
                </g>
              );
            })}
            <text x={8} y={y0 + 35} className="dg-sub dg-esq">
              peso atual
            </text>
            <text x={8} y={y0 + 56} className="dg-sub dg-esq">
              resultado
            </text>
            <text x={8} y={y0 + 77} className="dg-sub dg-esq">
              novo peso
            </text>
          </g>
        );
      })}
    </Svg>
  );
}

function AprioriPoda() {
  const n1: [string, string, boolean][] = [
    ['Leite', '0,2', false],
    ['Café', '0,3', true],
    ['Cerveja', '0,2', false],
    ['Pão', '0,5', true],
    ['Manteiga', '0,5', true],
    ['Arroz', '0,2', false],
    ['Feijão', '0,2', false],
  ];
  const n2: [string, string][] = [
    ['Café + Pão', '0,3'],
    ['Café + Mant.', '0,3'],
    ['Pão + Mant.', '0,4'],
  ];
  return (
    <Svg altura={196} titulo="Apriori com suporte mínimo 0,3: itemsets de 1, 2 e 3 itens">
      <text x={8} y={14} className="dg-sub dg-esq">
        1 item (cortados: suporte menor que 0,3)
      </text>
      {n1.map(([nome, s, ok], i) => (
        <g key={nome}>
          <Caixa x={6 + i * 50} y={20} w={46} h={34} texto={nome.length > 6 ? `${nome.slice(0, 5)}.` : nome} sub={s} classe={ok ? 'dg-caixa dg-sim' : 'dg-caixa dg-apagado'} />
          {!ok && <line x1={8 + i * 50} y1={22} x2={50 + i * 50} y2={52} className="dg-corte" />}
        </g>
      ))}
      <text x={8} y={78} className="dg-sub dg-esq">
        2 itens (só combinações de frequentes)
      </text>
      {n2.map(([nome, s], i) => (
        <Caixa key={nome} x={20 + i * 112} y={84} w={100} h={34} texto={nome} sub={s} classe="dg-caixa dg-sim" />
      ))}
      <text x={8} y={142} className="dg-sub dg-esq">
        3 itens
      </text>
      <Caixa x={110} y={148} w={140} h={34} texto="Café + Pão + Mant." sub="0,3" classe="dg-caixa dg-sim" />
    </Svg>
  );
}

function MatrizLeitura() {
  const m = [
    [11, 1, 3],
    [1, 4, 0],
    [2, 1, 6],
  ];
  const x0 = 120;
  const y0 = 46;
  const c = 50;
  return (
    <Svg altura={240} titulo="Leitura da matriz de confusão para a classe 1">
      <text x={x0 + 75} y={16} textAnchor="middle" className="dg-sub">
        classe predita
      </text>
      {[1, 2, 3].map((k, i) => (
        <text key={k} x={x0 + i * c + c / 2} y={38} textAnchor="middle" className="dg-txt">
          {k}
        </text>
      ))}
      <text x={x0 - 40} y={y0 + 80} textAnchor="middle" className="dg-sub" transform={`rotate(-90 ${x0 - 40} ${y0 + 80})`}>
        classe verdadeira
      </text>
      {m.map((linha, i) => (
        <g key={i}>
          <text x={x0 - 14} y={y0 + i * c + c / 2 + 5} textAnchor="middle" className="dg-txt">
            {i + 1}
          </text>
          {linha.map((v, j) => {
            const diag = i === j;
            const linha1 = i === 0;
            const coluna1 = j === 0 && i !== 0;
            const classe = diag && i === 0 ? 'dg-caixa dg-sim' : linha1 ? 'dg-caixa dg-nao' : coluna1 ? 'dg-caixa dg-xp' : 'dg-caixa';
            return (
              <g key={j}>
                <rect x={x0 + j * c} y={y0 + i * c} width={c - 4} height={c - 4} rx={5} className={classe} />
                <text x={x0 + j * c + (c - 4) / 2} y={y0 + i * c + c / 2 + 3} textAnchor="middle" className="dg-txt dg-forte">
                  {v}
                </text>
              </g>
            );
          })}
        </g>
      ))}
      <text x={8} y={214} className="dg-sub dg-esq">
        azul = VP (11); laranja = FN da classe 1 na linha (1 + 3 → TFN 4/15)
      </text>
      <text x={8} y={232} className="dg-sub dg-esq">
        amarelo = FP na coluna (1 + 2 → TFP 3/14, 14 = total das classes 2 e 3)
      </text>
    </Svg>
  );
}

function Codificacoes() {
  const linhas: [string, string, string][] = [
    ['Gênero: M / F', 'binário', '0 / 1'],
    ['Cor: Azul, Amarelo, Verde', '1-de-c', '100, 010, 001'],
    ['Nível: 1º, 2º, 3º, 4º', 'inteiro', '0, 1, 2, 3'],
    ['Nível: 1º, 2º, 3º, 4º', 'código cinza', '000, 001, 011, 010'],
    ['Nível: 1º, 2º, 3º, 4º', 'termômetro', '00000, 00001, 00011, 00111'],
  ];
  return (
    <Svg altura={214} titulo="Exemplos de conversão simbólico-numérica">
      {linhas.map(([orig, tipo, cod], i) => {
        const y = 6 + i * 42;
        const ord = i >= 2;
        return (
          <g key={i}>
            <text x={8} y={y + 14} className="dg-sub dg-esq">
              {orig}
            </text>
            <rect x={8} y={y + 18} width={92} height={20} rx={4} className={ord ? 'dg-caixa dg-xp' : i === 1 ? 'dg-caixa dg-sim' : 'dg-caixa'} />
            <text x={54} y={y + 32} textAnchor="middle" className="dg-txt">
              {tipo}
            </text>
            <Seta x1={102} y1={y + 28} x2={118} y2={y + 28} />
            <text x={122} y={y + 32} className="dg-mono dg-esq">
              {cod}
            </text>
          </g>
        );
      })}
    </Svg>
  );
}

const MAPA: Record<DiagramaId, () => ReactNode> = {
  kdd: Kdd,
  'ia-am-dl': IaAmDl,
  'tipos-aprendizado': TiposAprendizado,
  'holdout-kfold': HoldoutKfold,
  'over-under': OverUnder,
  vazamento: Vazamento,
  'entropia-gini': EntropiaGini,
  'bagging-rf': BaggingRf,
  bootstrap: Bootstrap,
  boosting: Boosting,
  'apriori-poda': AprioriPoda,
  'matriz-leitura': MatrizLeitura,
  codificacoes: Codificacoes,
};

export function Diagrama({ id, legenda }: { id: DiagramaId; legenda?: string }) {
  const Comp = MAPA[id];
  return (
    <figure className="diagrama">
      <Comp />
      {legenda && <figcaption>{legenda}</figcaption>}
    </figure>
  );
}
