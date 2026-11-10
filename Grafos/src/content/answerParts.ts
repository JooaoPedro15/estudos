import type { Question } from './types';

/**
 * Quebra a resposta-modelo de uma questão em partes memorizáveis, na ordem em
 * que são escritas na prova: primeiro o item 1/a/(i), depois o seguinte. Cada
 * parte é um pedaço com sentido próprio (definição, pseudocódigo,
 * justificativa, exemplo) e a soma das partes é a resposta inteira.
 */
export interface AnswerPart {
  mode: 'prose' | 'code';
  /** Item do enunciado a que a parte responde ("a)", "(i)", "1."); null = vale para a questão toda. */
  itemLabel: string | null;
  itemPrompt: string | null;
  label: string;
  /** Frases (prosa) ou linhas (código), na ordem do gabarito. */
  units: string[];
  previousUnit?: string;
}

interface PromptItem { key: string; label: string; text: string }

const LINE_MARKER = /^\s*(\(?([a-h]|\d{1,2}|i{1,3}|iv|v)[.)]|Item\s+(\w+)[:.]?)\s+(.*)$/i;
const STRONG_LABEL = /^(Justificativa|Exemplo|Contra-exemplo|Modelagem|Defini|Passo a passo|Verificação|Funciona|Instância|Execução|Observação|Ressalva|Conclusão|Floresta|Propriedade)/i;
const LABEL = /^([A-ZÀ-Ú][^:.\n]{2,45}):\s+\S/;
const ABBREVIATION = /(?:^|[\s(])(?:ex|p|cf|etc|obs|vs|n|i\.e|e\.g)\.$/i;
const MAX_UNITS = 6;

const keyOf = (match: RegExpMatchArray): string => (match[2] ?? match[3]).toLowerCase();

export function promptItems(prompt: string): PromptItem[] {
  const items: PromptItem[] = [];
  for (const line of prompt.split('\n')) {
    const match = line.match(LINE_MARKER);
    if (match && !items.some((item) => item.key === keyOf(match))) {
      items.push({ key: keyOf(match), label: match[1].trim(), text: match[4].trim() });
    }
  }
  if (items.length >= 2) return items;
  // Itens no meio do texto: "Descreva (i) – 15% – como ...; e (ii) – 20% – caso ..."
  const inline = [...prompt.matchAll(/\((i{1,3}|iv|v)\)/g)];
  if (inline.length < 2) return [];
  return inline.map((match, index) => ({
    key: match[1],
    label: match[0],
    text: prompt.slice(match.index + match[0].length, inline[index + 1]?.index ?? prompt.length).replace(/[;,]?\s*e\s*$/, '').trim(),
  }));
}

export function splitSentences(text: string): string[] {
  const out: string[] = [];
  // Frases; as muito longas também quebram em "; " para caberem na memória de trabalho.
  const pieces = text.trim().split(/(?<=[.!?])\s+(?=[A-ZÀ-Ú•(“"])/).flatMap((sentence) => sentence.length > 170 ? sentence.split(/(?<=;)\s+/) : [sentence]);
  for (const piece of pieces) {
    const previous = out[out.length - 1];
    if (previous && (ABBREVIATION.test(previous) || piece.length < 30 || previous.length < 30)) out[out.length - 1] = `${previous} ${piece}`;
    else out.push(piece);
  }
  return out.filter((unit) => unit.trim().length > 0);
}

/** Divide em pedaços de tamanho parecido, sem deixar um resto de uma linha só. */
function balanced<T>(items: T[], max: number): T[][] {
  const count = Math.ceil(items.length / max);
  const size = Math.ceil(items.length / count);
  return Array.from({ length: count }, (_, index) => items.slice(index * size, (index + 1) * size));
}

function codeParts(lines: string[], item: PromptItem | null): AnswerPart[] {
  const functions: string[][] = [];
  let current: string[] = [];
  for (const line of lines) {
    if (line.trim()) current.push(line.trimEnd());
    else if (current.length) { functions.push(current); current = []; }
  }
  if (current.length) functions.push(current);
  return functions.flatMap((fn) => {
    const name = fn[0].trim().match(/^([A-Za-zÀ-ÿ_][\wÀ-ÿ]*)\s*\(/)?.[1];
    const chunks = balanced(fn, 8);
    return chunks.map((units, index): AnswerPart => ({
      mode: 'code', itemLabel: item?.label ?? null, itemPrompt: item?.text ?? null,
      label: `Pseudocódigo${name ? ` ${name}` : ''}${chunks.length > 1 ? ` (${index + 1}/${chunks.length})` : ''}`,
      units,
      previousUnit: index > 0 ? chunks[index - 1][chunks[index - 1].length - 1] : undefined,
    }));
  });
}

function proseParts(lines: string[], item: PromptItem | null): AnswerPart[] {
  const groups: { label: string; units: string[] }[] = [];
  for (const line of lines) {
    const label = line.match(LABEL)?.[1];
    const current = groups[groups.length - 1];
    const startsNew = !current || (label && (STRONG_LABEL.test(label) || current.units.length >= 3));
    if (startsNew) groups.push({ label: label ?? `${line.split(/\s+/).slice(0, 5).join(' ').replace(/[.,;:]$/, '')}…`, units: splitSentences(line) });
    else current.units.push(...splitSentences(line));
  }
  return groups.flatMap((group) => {
    const chunks = balanced(group.units, MAX_UNITS);
    return chunks.map((units, index): AnswerPart => ({
      mode: 'prose', itemLabel: item?.label ?? null, itemPrompt: item?.text ?? null,
      label: chunks.length > 1 ? `${group.label} (${index + 1}/${chunks.length})` : group.label,
      units,
      previousUnit: index > 0 ? chunks[index - 1][chunks[index - 1].length - 1] : undefined,
    }));
  });
}

export function answerParts(question: Question): AnswerPart[] {
  const answer = question.examAnswer ?? question.solution ?? '';
  const items = promptItems(question.prompt);
  const parts: AnswerPart[] = [];
  let itemIndex = -1;
  let prose: string[] = [];
  let code: string[] | null = null;
  const item = () => (itemIndex >= 0 ? items[itemIndex] : null);
  const flush = () => { if (prose.length) parts.push(...proseParts(prose, item())); prose = []; };

  for (const raw of answer.split('\n')) {
    if (raw.trimStart().startsWith('```')) {
      if (code) { parts.push(...codeParts(code, item())); code = null; }
      else { flush(); code = []; }
      continue;
    }
    if (code) { code.push(raw); continue; }
    let line = raw.trim();
    if (!line) continue;
    const marker = line.match(LINE_MARKER);
    if (marker) {
      // Só vale como item se o enunciado tem esse item e ele vem depois do atual
      // (passos numerados dentro de uma resposta não trocam de item).
      const index = items.findIndex((candidate) => candidate.key === keyOf(marker));
      if (index > itemIndex) { flush(); itemIndex = index; line = marker[4].trim(); }
    }
    if (line) prose.push(line);
  }
  if (code) parts.push(...codeParts(code, item()));
  flush();
  return parts;
}

// ---------------------------------------------------------------------------
// Lacunas e termos-chave
// ---------------------------------------------------------------------------

export interface ClozeToken { text: string; blank?: number; answer?: string }

const STOPWORDS = new Set(['sobre', 'entre', 'então', 'quando', 'todos', 'todas', 'porque', 'também', 'qualquer', 'outro', 'outra', 'outros', 'outras', 'sendo', 'desse', 'dessa', 'deste', 'desta', 'apenas', 'ainda', 'assim', 'depois', 'antes', 'mesmo', 'mesma', 'mesmos', 'algum', 'alguma', 'esses', 'essas', 'estes', 'estas', 'aquele', 'aquela', 'seria', 'serem', 'estão', 'foram', 'possui', 'nesse', 'nessa', 'neste', 'nesta', 'pelos', 'pelas', 'cujas', 'cujos', 'which']);

function hash(text: string): number {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) >>> 0;
  return h;
}

function core(token: string, mode: AnswerPart['mode']): { lead: string; word: string; trail: string } | null {
  if (mode === 'prose') {
    const match = token.match(/^([("“'‘]*)([A-Za-zÀ-ÿ]{5,})([.,;:!?)"”'’]*)$/);
    return match && !STOPWORDS.has(match[2].toLowerCase()) ? { lead: match[1], word: match[2], trail: match[3] } : null;
  }
  const match = token.match(/^([([{]*)(.*?[A-Za-zÀ-ÿ].*?)([,;:)\]}]*)$/);
  return match && match[2].length >= 3 ? { lead: match[1], word: match[2], trail: match[3] } : null;
}

/** Palavras que carregam o conteúdo da parte (para o banco de lacunas e a conferência do texto livre). */
export function keyTerms(part: AnswerPart): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const unit of part.units) for (const token of unit.trim().split(/\s+/)) {
    const found = core(token, part.mode);
    if (found && !seen.has(found.word.toLowerCase())) { seen.add(found.word.toLowerCase()); out.push(found.word); }
  }
  return out;
}

/**
 * Esconde cerca de um terço dos termos. `round` muda quais somem, então cada
 * repetição cobra palavras diferentes até a parte inteira ter sido lembrada.
 */
export function buildCloze(part: AnswerPart, round: number): { units: ClozeToken[][]; answers: string[] } {
  const tokenized = part.units.map((unit) => unit.split(/(\s+)/));
  const candidates: { unit: number; token: number; rank: number }[] = [];
  tokenized.forEach((tokens, unit) => tokens.forEach((token, index) => {
    if (core(token, part.mode)) candidates.push({ unit, token: index, rank: hash(`${round}|${unit}|${index}|${token}`) });
  }));
  if (candidates.length === 0) {
    tokenized.forEach((tokens, unit) => tokens.forEach((token, index) => {
      if (token.trim().length >= 1) candidates.push({ unit, token: index, rank: hash(`${round}|${unit}|${index}|${token}`) });
    }));
  }
  const amount = Math.min(candidates.length, Math.max(2, Math.min(8, Math.round(candidates.length / 3))), Math.max(1, candidates.length - 1));
  const chosen = new Set([...candidates].sort((a, b) => a.rank - b.rank).slice(0, amount).map((c) => `${c.unit}:${c.token}`));
  const answers: string[] = [];
  const units = tokenized.map((tokens, unit) => tokens.flatMap((token, index): ClozeToken[] => {
    if (!chosen.has(`${unit}:${index}`)) return [{ text: token }];
    const found = core(token, part.mode) ?? { lead: '', word: token, trail: '' };
    answers.push(found.word);
    return [...(found.lead ? [{ text: found.lead }] : []), { text: found.word, blank: answers.length - 1, answer: found.word }, ...(found.trail ? [{ text: found.trail }] : [])];
  }));
  return { units, answers };
}

export const normalizeTerm = (text: string): string => text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '');

/** Primeira letra de cada palavra: a pista mais fraca antes de ver a resposta. */
export function firstLetters(unit: string): string {
  return unit.replace(/[A-Za-zÀ-ÿ]{2,}/g, (word) => `${word[0]}${'·'.repeat(Math.min(word.length - 1, 3))}`);
}
