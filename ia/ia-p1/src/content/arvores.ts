import type { NoArvore } from './types';

const folha = (impureza: string, samples: number, value: number[], classe: string): NoArvore => ({ impureza, samples, value, classe });

/**
 * Arvore da prova de 2025 (Q8 a Q10): DecisionTreeClassifier na base de tenis,
 * LabelEncoder alfabetico. value = [no, yes].
 * outlook: overcast 0, rainy 1, sunny 2 | humidity: high 0, normal 1 | windy: False 0, True 1.
 */
export const ARVORE_PROVA_TENIS: NoArvore = {
  teste: 'outlook <= 0.5',
  impureza: 'entropy = 0.94',
  samples: 14,
  value: [5, 9],
  classe: 'yes',
  sim: folha('entropy = 0.0', 4, [0, 4], 'yes'),
  nao: {
    teste: 'humidity <= 0.5',
    impureza: 'entropy = 1.0',
    samples: 10,
    value: [5, 5],
    classe: 'no',
    sim: {
      teste: 'outlook <= 1.5',
      impureza: 'entropy = 0.722',
      samples: 5,
      value: [4, 1],
      classe: 'no',
      sim: folha('entropy = 1.0', 2, [1, 1], 'no'),
      nao: folha('entropy = 0.0', 3, [3, 0], 'no'),
    },
    nao: {
      teste: 'windy <= 0.5',
      impureza: 'entropy = 0.722',
      samples: 5,
      value: [1, 4],
      classe: 'yes',
      sim: folha('entropy = 0.0', 3, [0, 3], 'yes'),
      nao: folha('entropy = 1.0', 2, [1, 1], 'no'),
    },
  },
};

/**
 * Arvore gerada no AD_Restaurante_codifica_treina_e_avalia.ipynb (celula 21),
 * treinada com as 9 instancias de treino. value = [Nao, Sim].
 * Tempo: 0-10 → 0, 10-30 → 1, 30-60 → 2, >60 → 3 | Cliente: Nenhum 0, Alguns 1, Cheio 2.
 */
export const ARVORE_RESTAURANTE: NoArvore = {
  teste: 'Tempo <= 2.5',
  impureza: 'entropy = 0.991',
  samples: 9,
  value: [4, 5],
  classe: 'Sim',
  sim: {
    teste: 'Cliente <= 0.5',
    impureza: 'entropy = 0.863',
    samples: 7,
    value: [2, 5],
    classe: 'Sim',
    sim: folha('entropy = 0.0', 1, [1, 0], 'Nao'),
    nao: {
      teste: 'Tempo <= 1.5',
      impureza: 'entropy = 0.65',
      samples: 6,
      value: [1, 5],
      classe: 'Sim',
      sim: folha('entropy = 0.0', 4, [0, 4], 'Sim'),
      nao: {
        teste: 'Tipo_Tailandes <= 0.5',
        impureza: 'entropy = 1.0',
        samples: 2,
        value: [1, 1],
        classe: 'Nao',
        sim: folha('entropy = 0.0', 1, [0, 1], 'Sim'),
        nao: folha('entropy = 0.0', 1, [1, 0], 'Nao'),
      },
    },
  },
  nao: folha('entropy = 0.0', 2, [2, 0], 'Nao'),
};

/** Lista as folhas (regras) da esquerda para a direita, com o caminho de testes. */
export function folhas(no: NoArvore, caminho: string[] = []): { caminho: string[]; no: NoArvore }[] {
  if (!no.sim || !no.nao || !no.teste) return [{ caminho, no }];
  const negado = no.teste.replace('<=', '>');
  return [...folhas(no.sim, [...caminho, no.teste]), ...folhas(no.nao, [...caminho, negado])];
}

export function profundidade(no: NoArvore): number {
  if (!no.sim || !no.nao) return 0;
  return 1 + Math.max(profundidade(no.sim), profundidade(no.nao));
}
