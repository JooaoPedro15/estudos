import { Calculator, ClipboardList, NotebookPen, Shuffle } from 'lucide-react';
import { useEffect, useState, type CSSProperties } from 'react';

import { link } from '../app/router';
import { DATA_PROVA, MODULOS, questoesDoModulo } from '../content';
import type { Modulo, ModuloId } from '../content/types';
import { corClasse, pureza } from '../components/SkTree';
import { ArteModulo } from '../components/ArteModulo';
import { CenaInicio } from '../components/CenaInicio';
import { diaLocal, dominio, type Dominio } from '../state/game';
import { useEstudo } from '../state/EstudoContext';

const PLANO: { dia: string; rotulo: string; modulos: ModuloId[]; extra?: string }[] = [
  { dia: '2026-10-01', rotulo: 'Quinta, 01/10', modulos: ['intro', 'preproc'] },
  { dia: '2026-10-02', rotulo: 'Sexta, 02/10', modulos: ['arvore'] },
  { dia: '2026-10-03', rotulo: 'Sábado, 03/10', modulos: ['ensemble', 'assoc'] },
  { dia: '2026-10-04', rotulo: 'Domingo, 04/10', modulos: ['bayes', 'codigos'], extra: 'Simulado 2025 e caderno de erros' },
  { dia: '2026-10-05', rotulo: 'Segunda, 05/10', modulos: [], extra: 'Prova. De manhã, só as pegadinhas de cada módulo.' },
];

const META_DOMINIO = 0.7;

function useAgora(intervalo = 1000): Date {
  const [agora, setAgora] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setAgora(new Date()), intervalo);
    return () => window.clearInterval(t);
  }, [intervalo]);
  return agora;
}

function Contagem({ agora }: { agora: Date }) {
  const ms = DATA_PROVA.getTime() - agora.getTime();
  if (diaLocal(agora) === diaLocal(DATA_PROVA)) return <p className="contagem">A prova é hoje.</p>;
  if (ms <= 0) return <p className="contagem">A prova de 05/10 já passou.</p>;
  const dias = Math.floor(ms / 86_400_000);
  const horas = Math.floor((ms % 86_400_000) / 3_600_000);
  const min = Math.floor((ms % 3_600_000) / 60_000);
  const seg = Math.floor((ms % 60_000) / 1000);
  const casa = (v: number, nome: string) => (
    <span className="contagem-casa">
      <span className="contagem-num">{String(v).padStart(2, '0')}</span>
      <span className="contagem-nome">{nome}</span>
    </span>
  );
  return (
    <p className="contagem" aria-label={`Faltam ${dias} dias, ${horas} horas e ${min} minutos para a prova`}>
      {casa(dias, dias === 1 ? 'dia' : 'dias')}
      {casa(horas, 'h')}
      {casa(min, 'min')}
      {casa(seg, 's')}
    </p>
  );
}

function estadoModulo(d: Dominio): string {
  if (d.feitas === 0) return 'não começado';
  return d.fracao >= META_DOMINIO ? 'em dia' : 'revisar';
}

/** Cartão no formato de um nó do plot_tree: a cor fica mais forte quanto mais acertos. */
function NoModulo({ m, d }: { m: Modulo; d: Dominio }) {
  const value = [d.erros, d.acertos];
  const { classe, alfa } = pureza(value);
  const estilo = { '--no-cor': corClasse(classe), '--no-alfa': d.tentativas ? alfa * 0.55 : 0 } as CSSProperties;
  return (
    <a href={link(`/modulo/${m.id}`)} className="no-home" style={estilo}>
      <ArteModulo id={m.id} />
      <span className="no-home-titulo">
        <span className="no-home-num">{String(m.ordem).padStart(2, '0')}</span>
        {m.curto}
      </span>
      <span className="no-home-linha">prioridade = {m.prioridade === 'media' ? 'média' : m.prioridade}</span>
      <span className="no-home-linha">acertadas = {d.acertadas} de {d.total}</span>
      <span className="no-home-linha">value = [{value.join(', ')}]</span>
      <span className="no-home-linha">class = {estadoModulo(d)}</span>
      <span className="barra" aria-hidden="true">
        <span className="barra-cheia" style={{ width: `${Math.round(d.fracao * 100)}%` }} />
      </span>
    </a>
  );
}

export function Home() {
  const { save } = useEstudo();
  const agora = useAgora();
  const hoje = diaLocal(agora);
  const doms = Object.fromEntries(MODULOS.map((m) => [m.id, dominio(save, questoesDoModulo(m.id))])) as Record<ModuloId, Dominio>;
  const total = Object.values(doms).reduce(
    (acc, d) => ({ erros: acc.erros + d.erros, acertos: acc.acertos + d.acertos, acertadas: acc.acertadas + d.acertadas, questoes: acc.questoes + d.total }),
    { erros: 0, acertos: 0, acertadas: 0, questoes: 0 },
  );
  const erros = Object.keys(save.caderno).length;
  const planoHoje = PLANO.find((p) => p.dia === hoje);
  const proximo =
    (planoHoje?.modulos ?? []).map((id) => MODULOS.find((m) => m.id === id)!).find((m) => doms[m.id].fracao < META_DOMINIO) ??
    MODULOS.find((m) => m.prioridade !== 'baixa' && doms[m.id].fracao < META_DOMINIO);

  return (
    <div className="home">
      <section className="hero-novo" aria-labelledby="titulo-home">
        <div>
          <p className="olho">Inteligência Artificial · P1 · Profa. Cristiane Neri Nobre</p>
          <h1 id="titulo-home">
            Veja a árvore <span className="sim">decidir</span>. Depois, <span className="nao">acerte a prova</span>.
          </h1>
          <p className="hero-sub">Mexa nos atributos do aluno e acompanhe o caminho até a folha. Resumos, exemplos resolvidos e {total.questoes} questões corrigidas na hora.</p>
          <div className="hero-numeros">
            <span className="hero-numero">
              <strong>{total.acertadas}<small style={{ fontSize: '0.9rem', color: 'var(--ink-3)' }}>/{total.questoes}</small></strong>
              <span>questões acertadas</span>
            </span>
            <span className="hero-numero">
              <strong>{erros}</strong>
              <span>no caderno de erros</span>
            </span>
          </div>
          <div className="hero-acoes">
            {proximo ? (
              <a className="btn btn-primario" href={link(`/modulo/${proximo.id}`)}>
                Continuar: {proximo.curto}
              </a>
            ) : (
              <a className="btn btn-primario" href={link('/treino/misto')}>
                Treino misto
              </a>
            )}
            <a className="btn" href={link('/simulado')}>
              Simulado 2025
            </a>
          </div>
          <div className="contagem-pequena">
            <Contagem agora={agora} />
          </div>
        </div>
        <CenaInicio />
      </section>

      <section aria-labelledby="titulo-plano" className="secao-home">
        <h2 id="titulo-plano">Plano até a prova</h2>
        <ol className="plano">
          {PLANO.map((p) => {
            const feito = p.modulos.length > 0 && p.modulos.every((id) => doms[id].fracao >= META_DOMINIO);
            const passado = p.dia < hoje;
            return (
              <li key={p.dia} className={`plano-dia ${p.dia === hoje ? 'plano-hoje' : ''} ${feito ? 'plano-feito' : ''} ${passado && !feito ? 'plano-atrasado' : ''}`}>
                <span className="plano-data">
                  {p.rotulo}
                  {p.dia === hoje && <span className="plano-tag">hoje</span>}
                </span>
                <span className="plano-itens">
                  {p.modulos.map((id) => {
                    const m = MODULOS.find((x) => x.id === id)!;
                    return (
                      <a key={id} href={link(`/modulo/${id}`)}>
                        {m.curto} ({Math.round(doms[id].fracao * 100)}%)
                      </a>
                    );
                  })}
                  {p.extra && <span className="plano-extra">{p.extra}</span>}
                </span>
              </li>
            );
          })}
        </ol>
        <p className="nota-leve">Um módulo conta como em dia quando você acertou pelo menos 70% das questões dele.</p>
      </section>

      <section aria-labelledby="titulo-modulos" className="secao-home">
        <h2 id="titulo-modulos">Módulos</h2>
        <p className="nota-leve">
          Cada módulo aparece como um nó do <code>plot_tree</code>: <code>value = [erros, acertos]</code> das suas respostas. Mais azul, mais acertos.
        </p>
        <div className="arvore-home">
          {MODULOS.map((m) => (
            <NoModulo key={m.id} m={m} d={doms[m.id]} />
          ))}
        </div>
        <p className="nota-leve">Redes neurais, SVM e k-means não estão no aviso da prova: aparecem só como fichas de prioridade baixa em Códigos Python.</p>
      </section>

      <section aria-labelledby="titulo-atalhos" className="secao-home">
        <h2 id="titulo-atalhos">Praticar</h2>
        <div className="atalhos">
          <a href={link('/treino/misto')} className="atalho">
            <Shuffle size={20} aria-hidden="true" />
            <span>
              <strong>Treino misto</strong>
              <span>10 questões sorteadas de todos os módulos.</span>
            </span>
          </a>
          <a href={link('/simulado')} className="atalho">
            <ClipboardList size={20} aria-hidden="true" />
            <span>
              <strong>Simulado da prova de 2025</strong>
              <span>As 13 questões, com cronômetro e correção.</span>
            </span>
          </a>
          <a href={link('/caderno')} className="atalho">
            <NotebookPen size={20} aria-hidden="true" />
            <span>
              <strong>Caderno de erros</strong>
              <span>{erros > 0 ? `${erros} para refazer.` : 'Vazio por enquanto.'}</span>
            </span>
          </a>
          <a href={link('/ferramentas')} className="atalho">
            <Calculator size={20} aria-hidden="true" />
            <span>
              <strong>Ferramentas</strong>
              <span>Entropia e ganho, matriz de confusão, associação, Naive Bayes.</span>
            </span>
          </a>
        </div>
      </section>
    </div>
  );
}
