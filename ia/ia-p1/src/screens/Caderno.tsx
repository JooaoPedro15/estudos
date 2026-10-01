import { NotebookPen, RotateCcw } from 'lucide-react';

import { link } from '../app/router';
import { MODULOS, questao as buscarQuestao } from '../content';
import { PROVA_2025 } from '../content/simulado2025';
import type { Questao } from '../content/types';
import { RichText } from '../components/RichText';
import { useEstudo } from '../state/EstudoContext';
import { resumoEnunciado } from './ModuloScreen';

const quando = (ms: number) => {
  const d = new Date(ms);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')} às ${String(d.getHours()).padStart(2, '0')}h${String(d.getMinutes()).padStart(2, '0')}`;
};

export function Caderno() {
  const { save } = useEstudo();
  const itens = Object.entries(save.caderno)
    .map(([id, item]) => ({ q: buscarQuestao(id), item }))
    .filter((x): x is { q: Questao; item: (typeof save.caderno)[string] } => Boolean(x.q));
  const total = itens.length;
  const daProva = new Set(PROVA_2025.map((q) => q.id));

  return (
    <div className="caderno">
      <header className="pagina-topo">
        <h1>
          <NotebookPen size={26} aria-hidden="true" /> Caderno de erros
        </h1>
        <p>
          Toda questão que você erra vem para cá, inclusive as do simulado. Ela sai quando você acerta de novo.
          {save.limpas > 0 && ` Você já tirou ${save.limpas} do caderno.`}
        </p>
        {total > 0 && (
          <a className="btn btn-primario" href={link('/treino/caderno')}>
            <RotateCcw size={16} aria-hidden="true" /> Refazer só as erradas ({total})
          </a>
        )}
      </header>

      {total === 0 ? (
        <div className="vazio">
          <p>Caderno vazio. Quando errar uma questão em qualquer módulo ou no simulado, ela aparece aqui.</p>
          <a className="btn" href={link('/')}>
            Ir para os módulos
          </a>
        </div>
      ) : (
        MODULOS.map((m) => {
          const doModulo = itens.filter(({ q }) => q.modulo === m.id).sort((a, b) => b.item.vezes - a.item.vezes);
          if (doModulo.length === 0) return null;
          return (
            <section key={m.id} className="caderno-grupo" aria-labelledby={`cad-${m.id}`}>
              <div className="lista-topo">
                <h2 id={`cad-${m.id}`}>
                  {m.curto} <span className="aba-n">{doModulo.length}</span>
                </h2>
                <a className="btn btn-pequeno" href={link(`/treino/caderno-${m.id}`)}>
                  Refazer estas
                </a>
              </div>
              <ul className="lista-questoes">
                {doModulo.map(({ q, item }) => (
                  <li key={q.id}>
                    <a href={link(`/treino/caderno/${q.id}`)} className="item-questao item-errada">
                      <span className="item-num">{item.vezes}x</span>
                      <span className="item-texto">
                        {daProva.has(q.id) && <span className="selo selo-prova">Prova 2025</span>}
                        <span>
                          <RichText texto={resumoEnunciado(q)} />
                        </span>
                        <span className="item-meta">
                          Errou {item.vezes === 1 ? 'uma vez' : `${item.vezes} vezes`}, a última em {quando(item.quando)}
                          {item.ultimaResposta ? `; última resposta: ${item.ultimaResposta}` : ''}
                        </span>
                      </span>
                      <span className="item-estado">
                        <RotateCcw size={16} aria-label="refazer" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          );
        })
      )}
    </div>
  );
}
