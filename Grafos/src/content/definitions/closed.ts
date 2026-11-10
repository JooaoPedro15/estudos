import type { Option, Question } from '@/content/types';
import type { DefinitionQuestion } from './builder';
import { definitionQuestions } from './open';
import { topics } from '@/content/topics';

/**
 * Questões FECHADAS geradas a partir do banco de definições, para treinar
 * reconhecimento além da recordação livre. Uma por conceito, id estável
 * (o progresso é rastreado por id):
 *
 *   defmc-<x>  — "qual descrição corresponde a X?" (4 descrições, 1 correta)
 * A pergunta invertida (defwho) foi retirada: muitas definições literais
 * começam com o nome do conceito, entregando a resposta no enunciado.
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
      [{ id: 'correct', label: descriptionWithoutName(d) }, ...distractors.map((x, i) => ({ id: `d${i}`, label: descriptionWithoutName(x) }))],
      `${d.id}:mc`,
    );
    out.push({
      ...base,
      id: `defmc-${key}`,
      type: 'MULTIPLE_CHOICE',
      prompt: `Qual descrição corresponde a ${d.concept}?`,
      options: mcOptions,
      correctOptionId: 'correct',
      hints: [`A definição certa menciona: ${d.keyPoints[0]}.`, ...(d.keyPoints[1] ? [`E também: ${d.keyPoints[1]}.`] : [])],
      solution: `Definição do professor: ${d.solution} As outras alternativas descrevem ${distractors.map((x) => x.concept).join(', ')}.`,
    });
  }

  return out;
}

export const closedDefinitionQuestions: Question[] = generateClosedQuestions(definitionQuestions);

/** Esconde o nome do próprio conceito nas alternativas; a citação literal fica na correção. */
export function descriptionWithoutName(definition: DefinitionQuestion): string {
  const withoutHeading = definition.solution.replace(/^[^:]{1,70}:\s*/, '');
  const name = definition.concept.replace(/\s*\([^)]*\)/g, '').trim();
  if (!name) return withoutHeading;
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return withoutHeading.replace(new RegExp(escaped, 'gi'), 'esse conceito');
}

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
