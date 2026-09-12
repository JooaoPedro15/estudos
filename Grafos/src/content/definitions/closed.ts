import type { Option, Question } from '@/content/types';
import type { DefinitionQuestion } from './builder';
import { definitionQuestions } from './open';
import { topics } from '@/content/topics';

/**
 * Questões FECHADAS geradas a partir do banco de definições, para treinar
 * reconhecimento além da recordação livre. Três por conceito, ids estáveis
 * (o progresso é rastreado por id):
 *
 *   defmc-<x>  — "qual é a definição de X?" (4 definições, 1 correta)
 *   defwho-<x> — "esta definição é de qual conceito?" (4 nomes)
 *   deftf-<x>  — verdadeiro/falso sobre a definição
 *
 * Distratores vêm de conceitos do MESMO tópico (vizinhos que confundem:
 * walk/trail/path, injetora/sobrejetora…), depois do mesmo módulo, depois de
 * qualquer lugar. A escolha é determinística (hash do id), então gerar de
 * novo dá sempre o mesmo resultado.
 */
export function generateClosedQuestions(defs: DefinitionQuestion[]): Question[] {
  const moduleOf = new Map(topics.map((t) => [t.id, t.moduleId]));
  const out: Question[] = [];

  for (const d of defs) {
    const key = d.id.slice('def-'.length);
    const others = defs.filter((x) => x.id !== d.id);
    const sameTopic = others.filter((x) => x.topic === d.topic);
    const sameModule = others.filter((x) => x.topic !== d.topic && moduleOf.get(x.topic) === moduleOf.get(d.topic));
    const rest = others.filter((x) => moduleOf.get(x.topic) !== moduleOf.get(d.topic));
    const distractors = pickStable([...rankBy(sameTopic, d.id), ...rankBy(sameModule, d.id), ...rankBy(rest, d.id)], 3, (x) => x.solution);

    const base = {
      topic: d.topic,
      difficulty: 'easy' as const,
      duration: 'quick' as const,
      examLikelihood: d.examLikelihood,
      sourceStyle: 'generated' as const,
      source: d.source,
      definitionId: d.id,
    };

    // 1) Reconhecer a definição entre quatro.
    const mcOptions = stableShuffle(
      [{ id: 'correct', label: d.solution }, ...distractors.map((x, i) => ({ id: `d${i}`, label: x.solution }))],
      `${d.id}:mc`,
    );
    out.push({
      ...base,
      id: `defmc-${key}`,
      type: 'MULTIPLE_CHOICE',
      prompt: `Qual das alternativas é a definição de ${d.concept}, conforme o professor?`,
      options: mcOptions,
      correctOptionId: 'correct',
      hints: [`A definição certa menciona: ${d.keyPoints[0]}.`, ...(d.keyPoints[1] ? [`E também: ${d.keyPoints[1]}.`] : [])],
      solution: `Definição do professor: ${d.solution} As outras alternativas definem ${distractors.map((x) => x.concept).join(', ')}.`,
    });

    // 2) Da definição para o nome do conceito.
    const whoOptions = stableShuffle(
      [{ id: 'correct', label: d.concept }, ...distractors.map((x, i) => ({ id: `d${i}`, label: x.concept }))],
      `${d.id}:who`,
    );
    out.push({
      ...base,
      id: `defwho-${key}`,
      type: 'MULTIPLE_CHOICE',
      prompt: `A definição "${d.solution}" — dada nos slides — corresponde a qual conceito?`,
      options: whoOptions,
      correctOptionId: 'correct',
      hints: [`Repare em: ${d.keyPoints[0]}.`],
      solution: `É a definição de ${d.concept}: ${d.solution}`,
    });

    // 3) Verdadeiro/falso — metade verdadeira, metade com a definição de um vizinho.
    const isTrue = hash(`${d.id}:tf`) % 2 === 0;
    const wrong = distractors[0];
    out.push({
      ...base,
      id: `deftf-${key}`,
      type: 'TRUE_FALSE',
      prompt: `Verdadeiro ou falso — a definição de ${d.concept}, conforme o professor, é: "${isTrue ? d.solution : wrong.solution}"`,
      correctValue: isTrue,
      hints: [`A definição de ${d.concept} precisa dizer: ${d.keyPoints[0]}.`],
      solution: isTrue
        ? `Verdadeiro — é exatamente a definição do professor para ${d.concept}.`
        : `Falso — essa é a definição de ${wrong.concept}. A de ${d.concept} é: ${d.solution}`,
    });
  }

  return out;
}

export const closedDefinitionQuestions: Question[] = generateClosedQuestions(definitionQuestions);

/** Questão da "família definição": a aberta (DEFINITION) ou uma fechada gerada dela. */
export function isDefinitionFamily(q: Question): boolean {
  return q.type === 'DEFINITION' || Boolean(q.definitionId);
}

// ---------------------------------------------------------------------------

/** Ordena um grupo de candidatos de forma estável mas diferente para cada definição. */
function rankBy<T extends { id: string }>(items: T[], seed: string): T[] {
  return [...items].sort((a, b) => hash(`${seed}|${a.id}`) - hash(`${seed}|${b.id}`));
}

/** Pega os `n` primeiros com rótulo distinto (evita duas alternativas iguais). */
function pickStable<T>(ranked: T[], n: number, labelOf: (x: T) => string): T[] {
  const seen = new Set<string>();
  const picked: T[] = [];
  for (const x of ranked) {
    const label = labelOf(x);
    if (seen.has(label)) continue;
    seen.add(label);
    picked.push(x);
    if (picked.length === n) break;
  }
  return picked;
}

function stableShuffle(options: Option[], seed: string): Option[] {
  return [...options].sort((a, b) => hash(`${seed}|${a.id}`) - hash(`${seed}|${b.id}`));
}

/** djb2 — só precisa ser determinístico e razoavelmente espalhado. */
function hash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h;
}
