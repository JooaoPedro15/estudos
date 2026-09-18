import { Fragment, type ReactNode } from 'react';
import katex from 'katex';

/**
 * Deixa notacao matematica informal (Theta(...), Somatorio_{a}^{b}, n^2) com
 * cara de matematica de verdade dentro de texto corrido (enunciado, prompt,
 * explicacao), SEM precisar reescrever o conteudo em LaTeX. Nao tenta
 * renderizar fracoes (arriscado em texto livre com varios termos) — so
 * simbolos gregos e sub/sobrescritos, que sao seguros em qualquer frase.
 */

type Segment = { key: string; kind: 'text'; value: string } | { key: string; kind: 'node'; value: ReactNode };

function splitBy(
  segments: Segment[],
  regex: RegExp,
  toNode: (match: RegExpExecArray, key: string) => ReactNode,
): Segment[] {
  const result: Segment[] = [];
  segments.forEach((segment, segIndex) => {
    if (segment.kind !== 'text') {
      result.push(segment);
      return;
    }
    const re = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : `${regex.flags}g`);
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let count = 0;
    // eslint-disable-next-line no-cond-assign
    while ((match = re.exec(segment.value)) !== null) {
      if (match.index > lastIndex) {
        result.push({ key: `${segment.key}-t${count}`, kind: 'text', value: segment.value.slice(lastIndex, match.index) });
      }
      result.push({ key: `${segment.key}-m${count}`, kind: 'node', value: toNode(match, `${segment.key}-m${count}`) });
      lastIndex = match.index + match[0].length;
      count += 1;
      if (match[0].length === 0) {
        re.lastIndex += 1;
      }
    }
    if (lastIndex < segment.value.length) {
      result.push({ key: `${segment.key}-tail`, kind: 'text', value: segment.value.slice(lastIndex) });
    }
  });
  return result;
}

export function MathText({ text }: { text: string }): ReactNode {
  let segments: Segment[] = [{ key: 's0', kind: 'text', value: text }];

  segments = splitBy(segments, /Somat[oó]rio_\{([^}]*)\}\^\{([^}]*)\}/g, (match, key) => (
    <span className="math-sum" key={key}>
      <span aria-hidden="true" className="math-sum-symbol">
        Σ
      </span>
      <span className="math-sum-limits">
        <span className="math-sum-top">{match[2]}</span>
        <span className="math-sum-bottom">{match[1]}</span>
      </span>
    </span>
  ));
  segments = splitBy(segments, /Somat[oó]rio\b/g, (_match, key) => <span key={key}>Σ</span>);
  segments = splitBy(segments, /\bTheta\b/g, (_match, key) => <span key={key}>Θ</span>);
  segments = splitBy(segments, /\bOmega\b/g, (_match, key) => <span key={key}>Ω</span>);
  segments = splitBy(
    segments,
    /([A-Za-z0-9)ΘΩ])\^(\([^()]*\)|[A-Za-z0-9]+)/g,
    (match, key) => {
      const expRaw = match[2];
      const exp = expRaw.startsWith('(') && expRaw.endsWith(')') ? expRaw.slice(1, -1) : expRaw;
      return (
        <Fragment key={key}>
          {match[1]}
          <sup>{exp}</sup>
        </Fragment>
      );
    },
  );

  return (
    <>
      {segments.map((segment) =>
        segment.kind === 'text' ? <Fragment key={segment.key}>{segment.value}</Fragment> : <Fragment key={segment.key}>{segment.value}</Fragment>,
      )}
    </>
  );
}

/** Scaneia da direita pra esquerda achando a ULTIMA divisao fora de parenteses. */
function splitTopLevelFraction(expr: string): [string, string] | null {
  let depth = 0;
  for (let i = expr.length - 1; i >= 0; i -= 1) {
    const char = expr[i];
    if (char === ')') {
      depth += 1;
    } else if (char === '(') {
      depth -= 1;
    } else if (char === '/' && depth === 0) {
      return [expr.slice(0, i).trim(), expr.slice(i + 1).trim()];
    }
  }
  return null;
}

function toLatex(raw: string): string {
  let value = raw.trim();
  value = value.replace(/\*/g, ' \\cdot ');
  value = value.replace(/Theta\(/g, '\\Theta(');
  value = value.replace(/Omega\(/g, '\\Omega(');
  value = value.replace(/\bO\(/g, '\\mathcal{O}(');
  value = value.replace(/Somat[oó]rio_\{([^}]*)\}\^\{([^}]*)\}/g, '\\sum_{$1}^{$2}');
  value = value.replace(/Somat[oó]rio\b/g, '\\sum');
  value = value.replace(/\^\(([^()]*)\)/g, '^{$1}');
  value = value.replace(/>=/g, '\\geq ').replace(/<=/g, '\\leq ').replace(/!=/g, '\\neq ');

  // So tenta virar fracao quando a expressao inteira (sem "=") e "algo / algo",
  // sem nada sobrando depois da divisao — evita agrupar errado em cadeias
  // com "+"/"-" depois da fracao (ex.: "(k+1)(k+4)/2 + (k+3)").
  if (!value.includes('=')) {
    const split = splitTopLevelFraction(value);
    if (split) {
      return `\\frac{${split[0]}}{${split[1]}}`;
    }
  }

  return value;
}

/**
 * Renderiza uma formula AUTOCONTIDA (resposta de gap/code, sem texto em
 * volta) com o KaTeX de verdade — fracao com barra, expoente, Sigma com
 * limites. Use so quando a string INTEIRA e a formula (nao para frases).
 */
export function Formula({ text }: { text: string }): ReactNode {
  const html = katex.renderToString(toLatex(text), { throwOnError: false, output: 'html' });
  // eslint-disable-next-line react/no-danger
  return <span className="math-formula" dangerouslySetInnerHTML={{ __html: html }} />;
}
