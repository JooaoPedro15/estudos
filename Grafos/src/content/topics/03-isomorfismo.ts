import type { Topic } from '../types';

export const isomorfismoTopics: Topic[] = [
  {
    id: 'isomorfismo',
    moduleId: 'isomorfismo-propriedades',
    order: 1,
    slug: 'isomorfismo',
    title: 'Isomorfismo de grafos',
    examLikelihood: 'high',
    examEvidence: '2022/1-Q3 (30% da prova, maior peso) pede transposição da definição para grafos dirigidos + exemplo construído.',
    whatYouNeedToKnow:
      'G e H são isomorfos se existe bijeção f:V(G)→V(H) tal que {u,v}∈E(G) ⟺ {f(u),f(v)}∈E(H). |V(G)|=|V(H)|, |E(G)|=|E(H)| e mesma sequência de graus são condições NECESSÁRIAS, mas não SUFICIENTES — dois grafos podem ter tudo isso igual e ainda não serem isomorfos.',
    understand: [
      'Primeiro passo prático: compare |V|, |E| e a sequência de graus (ordenada). Se algum desses já difere, os grafos NÃO são isomorfos — fim da questão.',
      'Se as condições necessárias batem, tente construir a bijeção explicitamente (mapeie vértices de mesmo grau entre si) e verifique se TODA aresta é preservada.',
      'Para grafos dirigidos, a definição exige preservar a DIREÇÃO: (u,v)∈E(G) ⟺ (f(u),f(v))∈E(H) — não basta preservar adjacência sem direção.',
      'Não existe algoritmo eficiente conhecido para testar isomorfismo em geral (afirmação do próprio professor no slide) — por isso a prova sempre pede um caso concreto pequeno, não um algoritmo geral.',
    ],
    commonPitfall:
      'Concluir "são isomorfos" só porque |V|, |E| e graus batem — isso só descarta o caso "não isomorfo", nunca prova isomorfismo sozinho. É preciso exibir a bijeção e checar as arestas uma a uma (ou provar que nenhuma bijeção funciona, para concluir que não são isomorfos apesar das condições necessárias baterem).',
    sources: [{ type: 'professor_slide', file: '05-graphs-isomorphism-and-concepts.pdf' }, { type: 'old_exam', file: '2022-1-exam.pdf' }],
  },
  {
    id: 'complemento-subgrafo',
    moduleId: 'isomorfismo-propriedades',
    order: 2,
    slug: 'complemento-subgrafo',
    title: 'Grafo complementar, auto-complementar e subgrafos',
    examLikelihood: 'high',
    examEvidence: 'Complemento/auto-complementar em 3 de 8 provas (2022/2, 2023/1, 2025/1). Nº de subgrafos de Kn em 3 de 8 (2022/2, 2024/1, 2024/2).',
    whatYouNeedToKnow:
      'Complemento Ḡ: mesmos vértices, aresta {u,v}∈E(Ḡ) ⟺ {u,v}∉E(G). Auto-complementar: G≅Ḡ. Subgrafo: subconjunto de vértices e arestas de G. Subgrafo induzido por um subconjunto de vértices: todas as arestas de G entre esses vértices.',
    understand: [
      'Um grafo auto-complementar tem exatamente metade das arestas do completo: |E(G)| = n(n−1)/4 — logo n(n−1) deve ser divisível por 4, o que só ocorre quando n ≡ 0 ou 1 (mod 4).',
      'Prova clássica de que |E(G)| de um auto-complementar é divisível por 4: como |E(G)|=|E(Ḡ)| e |E(G)|+|E(Ḡ)|=n(n−1)/2, segue |E(G)| = n(n−1)/4; sendo n≡0 ou 1 (mod 4), o produto n(n−1) é sempre divisível por 4 antes de dividir por 4 de novo — desenvolva a conta completa, não só a fórmula final (o professor desconta nota de quem só escreve a fórmula sem deduzir).',
      'Número de subgrafos (não vazios) de Kn: Σ_{i=1}^{n} C(n,i)·2^(i(i−1)/2) — escolhe i vértices (C(n,i) formas) e, para cada escolha, decide incluir ou não cada uma das C(i,2) arestas possíveis entre eles (2^(i(i-1)/2) formas).',
      'Subgrafo induzido é determinado só pelo conjunto de vértices; subgrafo "qualquer" pode omitir arestas mesmo entre vértices presentes.',
    ],
    commonPitfall:
      'Nas provas de "prove que |E| é divisível por 4" ou "prove que n≡0 ou 1 mod 4", escrever só o resultado final sem a dedução algébrica perde pontos — visto explicitamente na correção de 2022/2-Q5b (aluno reescreveu com a soma completa dos C(m,i)·2^(...) para nota cheia).',
      conceptConflict: {
      topic: 'Auto-complementar',
      hasRealDifference: false,
      professorDefinition: 'G≅Ḡ; |E(G)|=n(n-1)/4, exige n≡0 ou 1 (mod 4).',
      professorSource: { type: 'professor_support_material', file: 'Lista-de-exercicios-1.pdf' },
      alternatives: [{ author: 'West', text: 'Define auto-complementar como G≅Ḡ (Def 1.1.32) — mesma definição.' }],
      examGuidance: 'Sem divergência — West confirma a mesma definição usada pelo professor.',
    },
    sources: [
      { type: 'professor_slide', file: '05-graphs-isomorphism-and-concepts.pdf' },
      { type: 'old_exam', file: '2023-1-exam.pdf' },
    ],
  },
  {
    id: 'teoremas-contagem',
    moduleId: 'isomorfismo-propriedades',
    order: 3,
    slug: 'teoremas-contagem',
    title: 'Teoremas de contagem: arestas por componentes, dois vértices de mesmo grau',
    examLikelihood: 'high',
    examEvidence: 'Família "possibilidade de grafo" (min/max arestas dado k componentes) em 4 de 8 provas. Prova de "dois vértices de mesmo grau" em 3 de 8 provas recentes (2024/1, 2024/2, 2026/1) — praticamente fixa.',
    whatYouNeedToKnow:
      'Com n vértices e k componentes conexos: mínimo de arestas = n−k (cada componente é uma árvore). Máximo de arestas = (n−k)(n−k+1)/2 (um componente concentra n−k+1 vértices como grafo completo, os outros k−1 componentes são vértices isolados).',
    understand: [
      'A prova de "todo grafo simples com n≥2 vértices tem 2 vértices de mesmo grau" usa o princípio da casa dos pombos: grau varia entre 0 e n−1 (n valores possíveis), mas grau 0 e grau n−1 não podem coexistir no mesmo grafo (se alguém tem grau n−1, está ligado a todos, logo ninguém tem grau 0) — sobram no máximo n−1 valores possíveis para n vértices, forçando repetição.',
      'Para "é possível grafo com X arestas e n vértices/k componentes?": calcule m_min=n−k e m_max=(n−k)(n−k+1)/2 e verifique se X está no intervalo.',
      'Essas provas exigem justificativa por escrito, não só a fórmula — o professor desconta nota de resposta sem dedução (ver `docs/exam-pattern.md`).',
    ],
    commonPitfall: 'Usar a fórmula de grafo REGULAR (n(n−1)/2 só quando aplicável a Kn) no lugar da fórmula de componentes — erro visto na correção real de 2022/2-Q1c.',
    sources: [{ type: 'professor_slide', file: '05-graphs-isomorphism-and-concepts.pdf' }, { type: 'professor_support_material', file: 'Lista-de-exercicios-1.pdf' }],
  },
];
