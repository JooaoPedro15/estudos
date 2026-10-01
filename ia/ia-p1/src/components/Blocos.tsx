import { Info, OctagonAlert, FileQuestionMark, Bookmark } from 'lucide-react';

import type { Bloco, Fonte } from '../content/types';
import { Diagrama } from './Diagrama';
import { Formula, RichText } from './RichText';
import { SkTree } from './SkTree';

const NOTAS = {
  info: { titulo: 'Nota', Icone: Info },
  alerta: { titulo: 'Atenção', Icone: OctagonAlert },
  fora: { titulo: 'Fora do material', Icone: FileQuestionMark },
  prova: { titulo: 'Na prova', Icone: Bookmark },
} as const;

export function BlocoView({ bloco }: { bloco: Bloco }) {
  switch (bloco.tipo) {
    case 'p':
      return (
        <p>
          <RichText texto={bloco.texto} />
        </p>
      );
    case 'lista': {
      const Tag = bloco.ordenada ? 'ol' : 'ul';
      return (
        <Tag className="lista">
          {bloco.itens.map((item, i) => (
            <li key={i}>
              <RichText texto={item} />
            </li>
          ))}
        </Tag>
      );
    }
    case 'formula':
      return (
        <div className="formula-caixa">
          {bloco.nome && <span className="formula-nome">{bloco.nome}</span>}
          <Formula tex={bloco.tex} />
        </div>
      );
    case 'tabela':
      return (
        <figure className="tabela-fig">
          <div className="tabela-rolagem" tabIndex={0}>
            <table>
              {bloco.cabecalho.some(Boolean) && (
                <thead>
                  <tr>
                    {bloco.cabecalho.map((c, i) => (
                      <th key={i} scope="col">
                        <RichText texto={c} />
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {bloco.linhas.map((linha, i) => (
                  <tr key={i}>
                    {linha.map((c, j) =>
                      j === 0 && !bloco.cabecalho.some(Boolean) ? (
                        <th key={j} scope="row">
                          <RichText texto={c} />
                        </th>
                      ) : (
                        <td key={j}>
                          <RichText texto={c} />
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {bloco.legenda && <figcaption>{bloco.legenda}</figcaption>}
        </figure>
      );
    case 'codigo':
      return (
        <figure className="codigo-fig">
          <pre className="codigo" tabIndex={0}>
            <code>{bloco.codigo}</code>
          </pre>
          {bloco.legenda && <figcaption>{bloco.legenda}</figcaption>}
        </figure>
      );
    case 'diagrama':
      return <Diagrama id={bloco.id} legenda={bloco.legenda} />;
    case 'arvore':
      return <SkTree arvore={bloco.arvore} legenda={bloco.legenda} nomesClasses={bloco.nomesClasses} />;
    case 'nota': {
      const { titulo, Icone } = NOTAS[bloco.variante];
      return (
        <aside className={`nota nota-${bloco.variante}`}>
          <Icone aria-hidden="true" size={16} />
          <div>
            <strong>{titulo}.</strong> <RichText texto={bloco.texto} />
          </div>
        </aside>
      );
    }
  }
}

export function Blocos({ blocos }: { blocos: Bloco[] }) {
  return (
    <div className="blocos">
      {blocos.map((b, i) => (
        <BlocoView key={i} bloco={b} />
      ))}
    </div>
  );
}

export function Fontes({ fontes }: { fontes: Fonte[] }) {
  if (fontes.length === 0) return null;
  return (
    <p className="fontes">
      <span>Fonte:</span>{' '}
      {fontes.map((fo, i) => (
        <span key={i}>
          {fo.arquivo} ({fo.onde}){i < fontes.length - 1 ? '; ' : '.'}
        </span>
      ))}
    </p>
  );
}
