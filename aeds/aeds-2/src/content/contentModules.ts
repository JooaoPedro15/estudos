import { domainCatalog } from './domains';
import type { ContentModuleId } from '../types/content';

export type ContentModule = {
  id: ContentModuleId;
  title: string;
  shortTitle: string;
  description: string;
};

const extraModules: ContentModule[] = [
  {
    id: 'ordenacao-bolha',
    title: 'Ordenacao: bolha',
    shortTitle: 'Bolha',
    description: 'Bubble sort classico, contagem de trocas, otimizacao com flag e melhor/pior caso.',
  },
  {
    id: 'ordenacao-insercao',
    title: 'Ordenacao: insercao',
    shortTitle: 'Insercao',
    description: 'Insertion sort classico, comparadores adaptados e busca binaria da posicao.',
  },
  {
    id: 'ordenacao-selecao',
    title: 'Ordenacao: selecao',
    shortTitle: 'Selecao',
    description: 'Selection sort classico, contagem de trocas e variante bidirecional (min-max).',
  },
  {
    id: 'ordenacao-shell',
    title: 'Ordenacao: shellsort',
    shortTitle: 'Shellsort',
    description: 'Insertion sort com passo h decrescente (sequencia de Knuth), por "cores".',
  },
  {
    id: 'ordenacao-counting',
    title: 'Ordenacao: counting sort',
    shortTitle: 'Counting',
    description: 'Contagem, acumulacao e posicionamento direto, sem comparar elementos.',
  },
  {
    id: 'ordenacao-bucket',
    title: 'Ordenacao: bucket sort',
    shortTitle: 'Bucket',
    description: 'Distribui em baldes por faixa de valor, ordena cada balde e concatena.',
  },
  {
    id: 'ordenacao-radix',
    title: 'Ordenacao: radix sort',
    shortTitle: 'Radix',
    description: 'Counting sort repetido por digito, das unidades ate o digito mais significativo.',
  },
  {
    id: 'busca-sequencial',
    title: 'Busca sequencial',
    shortTitle: 'B. Sequencial',
    description: 'Percorre o vetor do inicio ao fim procurando o elemento, sem exigir ordenacao.',
  },
  {
    id: 'busca-binaria',
    title: 'Busca binaria',
    shortTitle: 'B. Binaria',
    description: 'Divide o vetor ordenado ao meio a cada passo, iterativa e recursiva.',
  },
  {
    id: 'complexidade',
    title: 'Complexidade',
    shortTitle: 'Complexidade',
    description: 'Analise de custo, melhor/pior caso, notacao assintotica e provas por inducao.',
  },
  {
    id: 'recursividade',
    title: 'Recursividade',
    shortTitle: 'Recursao',
    description: 'Metodos recursivos com caso base, chamada auxiliar e composicao do retorno.',
  },
  {
    id: 'lista',
    title: 'Listas',
    shortTitle: 'Lista',
    description: 'Listas sequenciais, simples e duplas, com deslocamentos e religacao de ponteiros.',
  },
  {
    id: 'fila',
    title: 'Filas',
    shortTitle: 'Fila',
    description: 'Fila comum e circular, indices primeiro/ultimo e retorno ao inicio do vetor.',
  },
  {
    id: 'pilha',
    title: 'Pilhas',
    shortTitle: 'Pilha',
    description: 'Operacoes LIFO, pilha flexivel e usos classicos como parenteses balanceados.',
  },
  {
    id: 'matriz',
    title: 'Matriz encadeada',
    shortTitle: 'Matriz',
    description: 'Celulas conectadas por sup, inf, esq e dir, com listas associadas.',
  },
  {
    id: 'arvore234',
    title: 'Arvore 2-3-4',
    shortTitle: '2-3-4',
    description: 'Nos com multiplas chaves, fragmentacao e equivalencia com alvinegra.',
  },
  {
    id: 'alvinegra',
    title: 'Arvore alvinegra',
    shortTitle: 'Alvinegra',
    description: 'Invariantes de cor, altura branca, recoloracao e rotacoes.',
  },
  {
    id: 'patricia',
    title: 'Arvore PATRICIA',
    shortTitle: 'PATRICIA',
    description: 'TRIE comprimida por segmentos, pesquisa e contagem em rotulos.',
  },
];

export const contentModuleCatalog: ContentModule[] = [
  ...domainCatalog.map((domain) => ({
    id: domain.id,
    title: domain.title,
    shortTitle: domain.shortTitle,
    description: domain.examRole,
  })),
  ...extraModules,
];

export function getContentModule(moduleId: ContentModuleId): ContentModule {
  return (
    contentModuleCatalog.find((module) => module.id === moduleId) ?? {
      id: moduleId,
      title: moduleId,
      shortTitle: moduleId,
      description: 'Conteudo da Lista 2.',
    }
  );
}
