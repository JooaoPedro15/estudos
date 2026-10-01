import katex from 'katex';
import { Fragment, useMemo, type ReactNode } from 'react';

/** Virgula decimal dentro do TeX sem o espaco que o modo matematico coloca. */
const texBr = (tex: string) => tex.replace(/(\d),(\d)/g, '$1{,}$2');

function renderTex(tex: string, bloco: boolean): string {
  try {
    // MathML puro: o navegador desenha, sem precisar das fontes do KaTeX.
    return katex.renderToString(texBr(tex), { displayMode: bloco, output: 'mathml', throwOnError: false, strict: false });
  } catch {
    return tex;
  }
}

export function Formula({ tex, bloco = true }: { tex: string; bloco?: boolean }) {
  const html = useMemo(() => renderTex(tex, bloco), [tex, bloco]);
  const Tag = bloco ? 'div' : 'span';
  return <Tag className={bloco ? 'formula' : 'formula-inline'} dangerouslySetInnerHTML={{ __html: html }} />;
}

const PADRAO = /(\*\*[^*]+\*\*|`[^`]+`|\$[^$]+\$)/g;

/** Texto com **negrito**, `codigo` e $tex$. */
export function RichText({ texto }: { texto: string }): ReactNode {
  const partes = texto.split(PADRAO);
  return (
    <>
      {partes.map((parte, i) => {
        if (!parte) return null;
        if (parte.startsWith('**') && parte.endsWith('**')) return <strong key={i}>{parte.slice(2, -2)}</strong>;
        if (parte.startsWith('`') && parte.endsWith('`')) return <code key={i}>{parte.slice(1, -1)}</code>;
        if (parte.startsWith('$') && parte.endsWith('$') && parte.length > 2) return <Formula key={i} tex={parte.slice(1, -1)} bloco={false} />;
        return <Fragment key={i}>{parte}</Fragment>;
      })}
    </>
  );
}
