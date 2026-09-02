import type { Question } from '@/content/types';
import { validateIsomorphismMapping } from '@/lib/graph';

export interface ValidationResult {
  correct: boolean;
  message: string;
}

function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase();
}

function sameSet(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sa = new Set(a);
  return b.every((x) => sa.has(x));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateAnswer(q: Question, answer: any): ValidationResult {
  switch (q.type) {
    case 'MULTIPLE_CHOICE': {
      const correct = answer === q.correctOptionId;
      return { correct, message: correct ? 'Alternativa correta.' : 'Essa não é a alternativa correta — reveja a definição envolvida.' };
    }
    case 'TRUE_FALSE': {
      const correct = answer === q.correctValue;
      return { correct, message: correct ? 'Correto.' : `Incorreto — a afirmação é ${q.correctValue ? 'verdadeira' : 'falsa'}.` };
    }
    case 'SHORT_ANSWER': {
      const norm = normalize(String(answer ?? ''));
      const correct = q.acceptedAnswers.some((a) => normalize(a) === norm);
      return { correct, message: correct ? 'Correto.' : 'Resposta não confere com o esperado.' };
    }
    case 'NUMBER_INPUT': {
      const n = Number(answer);
      const tol = q.tolerance ?? 0;
      const correct = Number.isFinite(n) && Math.abs(n - q.correctNumber) <= tol;
      return { correct, message: correct ? 'Valor correto.' : `Valor incorreto — esperado ${q.correctNumber}${q.unit ? ` ${q.unit}` : ''}.` };
    }
    case 'GRAPH_SELECT_VERTEX': {
      const sel: string[] = answer ?? [];
      const correct = sameSet(sel, q.correctVertexIds);
      return { correct, message: correct ? 'Seleção correta de vértices.' : 'A seleção de vértices não está correta.' };
    }
    case 'GRAPH_SELECT_EDGE': {
      const sel: string[] = answer ?? [];
      const correct = sameSet(sel, q.correctEdgeIds);
      return { correct, message: correct ? 'Seleção correta de arestas.' : 'A seleção de arestas não está correta.' };
    }
    case 'MATRIX_FILL': {
      const given: Record<string, number> = answer ?? {};
      let allOk = true;
      const wrongCells: string[] = [];
      for (const r of q.rowIds) {
        for (const c of q.colIds) {
          const key = `${r}|${c}`;
          const expected = q.correctCells[key] ?? 0;
          const got = given[key] ?? 0;
          if (expected !== got) {
            allOk = false;
            wrongCells.push(key);
          }
        }
      }
      return { correct: allOk, message: allOk ? 'Matriz preenchida corretamente.' : `${wrongCells.length} célula(s) incorreta(s).` };
    }
    case 'ADJACENCY_LIST_FILL': {
      const given: Record<string, string[]> = answer ?? {};
      const keys = Object.keys(q.correctList);
      const correct = keys.every((k) => sameSet(given[k] ?? [], q.correctList[k]));
      return { correct, message: correct ? 'Lista de adjacência correta.' : 'Alguma lista de sucessores está incompleta ou incorreta.' };
    }
    case 'ISOMORPHISM_MAPPING': {
      const mapping: Record<string, string> = answer ?? {};
      const complete = q.graphA.vertices.every((v) => mapping[v.id]);
      if (!q.isIsomorphic) {
        return { correct: false, message: 'Estes grafos NÃO são isomorfos — não existe correspondência válida (essa questão pede para você demonstrar isso, não mapear).', };
      }
      if (!complete) return { correct: false, message: 'Mapeamento incompleto — associe todos os vértices.' };
      const { valid, brokenEdges } = validateIsomorphismMapping(q.graphA, q.graphB, mapping);
      return { correct: valid, message: valid ? 'Mapeamento preserva todas as adjacências — isomorfismo válido.' : `${brokenEdges.length} aresta(s) não são preservadas pelo mapeamento atual.` };
    }
    case 'ORDERING': {
      const order: string[] = answer ?? [];
      const correct = JSON.stringify(order) === JSON.stringify(q.correctOrder);
      return { correct, message: correct ? 'Ordem correta.' : 'A ordem não está correta.' };
    }
    case 'DRAG_AND_DROP': {
      const map: Record<string, string> = answer ?? {};
      const correct = q.items.every((it) => map[it.id] === q.correctMap[it.id]);
      return { correct, message: correct ? 'Todos os itens na categoria correta.' : 'Algum item está na categoria errada.' };
    }
    case 'PROOF_OR_JUSTIFICATION': {
      const checked: string[] = answer ?? [];
      const ratio = q.rubric.length ? checked.length / q.rubric.length : 0;
      const correct = ratio >= 0.7;
      return { correct, message: correct ? 'Sua autoavaliação cobre a maior parte dos pontos esperados.' : 'Compare com a solução — faltam pontos importantes na sua resposta.' };
    }
    default:
      return { correct: false, message: 'Tipo de questão não reconhecido.' };
  }
}
