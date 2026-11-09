import type { Question } from '@/content/types';

const isOpen = (q: Question) => q.type === 'PROOF_OR_JUSTIFICATION' || q.type === 'SHORT_ANSWER' || q.type === 'NUMBER_INPUT';
const isClosed = (q: Question) => ['MULTIPLE_CHOICE', 'ORDERING', 'GRAPH_SELECT_VERTEX', 'GRAPH_SELECT_EDGE', 'DRAG_AND_DROP'].includes(q.type);

/** Mantém o enunciado e cria o formato complementar só para o Treino de prova. */
export function buildExamDrillVariants(bank: Question[]): Question[] {
  const originals = bank.filter((q) => q.examFamily && (isOpen(q) || isClosed(q)));
  return originals.flatMap((q) => [q, isOpen(q) ? asClosed(q, originals) : asOpen(q)]);
}

function writtenAnswer(q: Question): string {
  if (q.type === 'NUMBER_INPUT') return `${q.correctNumber}${q.unit ? ` ${q.unit}` : ''}. ${q.examAnswer ?? q.solution}`;
  if (q.type === 'SHORT_ANSWER') return q.examAnswer ?? q.solution ?? q.acceptedAnswers[0];
  return q.examAnswer ?? q.solution;
}

function asClosed(q: Question, originals: Question[]): Question {
  const answer = writtenAnswer(q);
  // Outras respostas reais do mesmo assunto funcionam como alternativas; não
  // inventamos resultados ou justificativas para a questão original.
  const candidates = originals
    .filter((other) => other.id !== q.id && isOpen(other))
    .sort((a, b) => Number(b.examFamily === q.examFamily) - Number(a.examFamily === q.examFamily)
      || Number(b.topic === q.topic) - Number(a.topic === q.topic)
      || Math.abs(writtenAnswer(a).length - answer.length) - Math.abs(writtenAnswer(b).length - answer.length));
  const wrong = [...new Set(candidates.map(writtenAnswer).filter((text) => text !== answer))].slice(0, 2);
  if (wrong.length < 2) throw new Error(`Faltam respostas alternativas para ${q.id}`);
  const options = [
    { id: 'correct', label: answer },
    ...wrong.map((label, i) => ({ id: `wrong-${i}`, label })),
  ];
  // Espalha a resposta correta sem depender de aleatoriedade na renderização.
  const position = [...q.id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % options.length;
  options.splice(position, 0, options.shift()!);
  return {
    ...q,
    id: `${q.id}--fechada`,
    examDrillOriginalId: q.id,
    type: 'MULTIPLE_CHOICE',
    prompt: `${q.prompt}\n\nQual resposta corresponde a esta questão?`,
    options,
    correctOptionId: 'correct',
    displayGraphs: q.type === 'PROOF_OR_JUSTIFICATION' && q.graph ? { a: q.graph } : q.displayGraphs,
    solution: answer,
    examAnswer: answer,
  };
}

function asOpen(q: Question): Question {
  let details = '';
  let answer = q.examAnswer ?? q.solution;
  let graph: Extract<Question, { type: 'PROOF_OR_JUSTIFICATION' }>['graph'];
  if (q.type === 'MULTIPLE_CHOICE') {
    details = `\n\nAlternativas:\n${q.options.map((option, i) => `${String.fromCharCode(65 + i)}) ${option.label}`).join('\n')}`;
    answer = `${q.options.find((option) => option.id === q.correctOptionId)?.label ?? ''}\n\n${answer}`;
  } else if (q.type === 'ORDERING') {
    details = `\n\nPassos para ordenar:\n${q.items.map((item) => `• ${item.label}`).join('\n')}`;
    answer = `${q.correctOrder.map((id, i) => `${i + 1}. ${q.items.find((item) => item.id === id)?.label ?? id}`).join('\n')}\n\n${answer}`;
  } else if (q.type === 'GRAPH_SELECT_VERTEX') {
    graph = q.graph;
    answer = `${q.correctVertexIds.map((id) => q.graph.vertices.find((v) => v.id === id)?.label ?? id).join(', ')}. ${answer}`;
  } else if (q.type === 'GRAPH_SELECT_EDGE') {
    graph = q.graph;
    answer = `${q.correctEdgeIds.map((id) => {
      const edge = q.graph.edges.find((e) => e.id === id);
      return edge ? `${edge.source}–${edge.target}` : id;
    }).join(', ')}. ${answer}`;
  } else if (q.type === 'DRAG_AND_DROP') {
    details = `\n\nItens: ${q.items.map((item) => item.label).join('; ')}.\nCategorias: ${q.buckets.map((bucket) => bucket.label).join('; ')}.`;
    answer = `${q.items.map((item) => `${item.label}: ${q.buckets.find((bucket) => bucket.id === q.correctMap[item.id])?.label ?? q.correctMap[item.id]}`).join('; ')}. ${answer}`;
  }
  return {
    ...q,
    id: `${q.id}--aberta`,
    examDrillOriginalId: q.id,
    type: 'PROOF_OR_JUSTIFICATION',
    prompt: `${q.prompt}${details}\n\nResponda por escrito e justifique.`,
    graph,
    rubric: ['Apresenta a resposta correta', 'Mostra o raciocínio ou a justificativa'],
    solution: answer,
    examAnswer: answer,
  };
}
