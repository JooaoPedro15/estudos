import type { Topic } from '../types';

// euleriano/dijkstra/topologica-maior-caminho: as provas antigas do
// professor testam esses temas, mas o cronograma oficial 2026/2 os coloca
// DEPOIS da Prova 1 (17/09 em diante — a P1 é 14/09). Sinais conflitantes —
// ver docs/p1-scope.md "Revisão 3". Por pedido do usuário, mantidos visíveis
// (não escondidos), com `scopeNote` explicando o conflito em cada um, para
// ele decidir quanto priorizar em vez do app decidir sozinho.

export const conectividadeTopics: Topic[] = [
  {
    id: 'excentricidade-raio-diametro',
    moduleId: 'conectividade-caminhos',
    order: 1,
    slug: 'excentricidade-raio-diametro',
    title: 'Excentricidade, raio, diâmetro e centro',
    examLikelihood: 'medium',
    examEvidence: '2023/2-Q3 e 2024/1-Q4 usam o mesmo grafo explícito V={a..i} para pedir excentricidade/raio/diâmetro/centro; 2022/1-Q4 pede o algoritmo do diâmetro. Cronograma 2026/2 também confirma isso antes da P1 ("Caminho / Noções básicas de conectividade", 17-19/08).',
    whatYouNeedToKnow:
      'Excentricidade ε(v) = maior distância (menor caminho) de v até qualquer outro vértice. Raio = menor excentricidade do grafo. Diâmetro = maior excentricidade do grafo. Centro = conjunto de vértices com excentricidade igual ao raio.',
    understand: [
      'Calcule via BFS a partir de CADA vértice: a maior distância obtida naquela BFS é a excentricidade daquele vértice.',
      'Raio ≤ Diâmetro ≤ 2·Raio (desigualdade útil para checar resultado).',
      'Algoritmo para o diâmetro: rode BFS a partir de todo vértice, tome a maior distância entre todas as BFS — O(V·(V+E)).',
      'Centro pode ter mais de um vértice — é o conjunto (não necessariamente único).',
    ],
    commonPitfall: 'Calcular a excentricidade olhando só os vizinhos diretos (confundir com grau) — excentricidade é sobre o grafo TODO, via caminho mínimo, não só adjacência direta.',
    sources: [{ type: 'professor_support_material', file: 'Resumo Prova 1 Grafos.pdf' }, { type: 'old_exam', file: '2023-2-exam.pdf' }],
  },
  {
    id: 'scc-kosaraju',
    moduleId: 'conectividade-caminhos',
    order: 2,
    slug: 'scc-kosaraju',
    title: 'Componentes fortemente conexos — Algoritmo de Kosaraju',
    examLikelihood: 'high',
    examEvidence: '2022/1-Q5 (20%) pede SCC diretamente sobre grafo de 13 vértices; tópico também na origem do conceito de base/anti-base. Cronograma 2026/2 confirma em "Conectividade e Separabilidade" (26-27/08), antes da P1.',
    whatYouNeedToKnow:
      'Um componente fortemente conexo (SCC) é um subconjunto maximal de vértices onde todo par é mutuamente alcançável. Algoritmo de Kosaraju: (1) DFS em G, registrando ordem decrescente de tempo de término; (2) transpõe G; (3) DFS no transposto, visitando vértices não visitados na ordem decrescente de término do passo 1 — cada árvore resultante é um SCC.',
    understand: [
      'A ordem de execução importa para bater com o professor: DFS em G PRIMEIRO (tempos de término), DEPOIS transpõe e faz DFS no transposto — essa é a ordem de Cormen, seguida pelo professor.',
      'Um grafo fortemente conexo tem exatamente 1 SCC (o grafo inteiro). Um DAG tem cada vértice como seu próprio SCC (nenhum ciclo).',
      'A condensação de um grafo (cada SCC virando um único vértice) é sempre um DAG — é a estrutura usada internamente para calcular base/anti-base.',
    ],
    commonPitfall: 'Fazer DFS no transposto na ordem "natural" dos vértices em vez da ordem decrescente de tempo de término calculada no passo 1 — sem essa ordem específica, o algoritmo não garante componentes corretos.',
    conceptConflict: {
      topic: 'Algoritmo de Kosaraju',
      hasRealDifference: true,
      professorDefinition: 'DFS em G (tempos de término) → transpõe → DFS no transposto na ordem decrescente de término.',
      professorSource: { type: 'professor_support_material', file: 'Resumo Prova 1 Grafos.pdf', note: 'Cita Sedgewick & Wayne, mas segue a ordem de Cormen' },
      alternatives: [
        { author: 'Cormen', text: 'Exatamente a mesma ordem: DFS em G primeiro, depois transposto.' },
        { author: 'Sedgewick', text: 'Ordem invertida: primeiro DFS no grafo REVERSO (pós-ordem), depois DFS no grafo ORIGINAL nessa ordem — mesmo resultado, passos trocados.' },
      ],
      differenceExplanation: 'Resultado final idêntico, mas a ordem dos passos (qual grafo recebe a primeira DFS) difere entre Cormen e Sedgewick — mesmo o aulão citando Sedgewick como fonte do nome do algoritmo, ele segue a ordem de Cormen na prática.',
      examGuidance: 'Siga a ordem do professor: DFS em G → transpõe → DFS no transposto, do maior para o menor tempo de término.',
    },
    sources: [{ type: 'professor_support_material', file: 'Resumo Prova 1 Grafos.pdf' }, { type: 'old_exam', file: '2022-1-exam.pdf' }],
  },
  {
    id: 'euleriano',
    moduleId: 'conectividade-caminhos',
    order: 3,
    slug: 'euleriano',
    title: 'Caminho e circuito euleriano',
    examLikelihood: 'medium',
    examEvidence: '2023/2-Q4 (problema narrativo do detetive) e 2026/1-Q2 (25%, pede solução direta) — apareceu em 2 das 8 provas antigas do professor.',
    scopeNote:
      'Conflito de fontes: as provas antigas testaram este tema, mas o cronograma oficial 2026/2 coloca "Grafos hamiltonianos e eulerianos" em 17/09 — 3 dias DEPOIS da Prova 1 (14/09). Ou o cronograma muda, ou este ano não cai na P1. Mantido no app por precaução — estude com prioridade menor que os tópicos sem esse conflito.',
    whatYouNeedToKnow:
      'Circuito euleriano (fechado, passa por toda aresta exatamente uma vez, volta ao início) existe ⟺ grafo conexo e TODOS os vértices têm grau par. Caminho euleriano (aberto) existe ⟺ grafo conexo e EXATAMENTE 2 vértices têm grau ímpar (o caminho começa em um e termina no outro).',
    understand: [
      'Método do professor (aulão): (1) DFS a partir de um vértice de grau ímpar, se existir; (2) priorizar arestas que NÃO desconectam o grafo (evitar pontes/arestas de corte a menos que seja a única opção); (3) parar ao voltar ao início ou não conseguir prosseguir — isso é essencialmente o Algoritmo de Fleury.',
      'Se todos os graus são pares mas algum vértice tem grau 0 (isolado) e o resto do grafo é conexo, ainda existe circuito euleriano no componente não-trivial — "conexo" aqui refere-se ao componente que contém arestas.',
      'Grafo com mais de 2 vértices de grau ímpar: NÃO tem caminho nem circuito euleriano.',
    ],
    commonPitfall: 'Confundir caminho euleriano (passa por toda ARESTA uma vez) com caminho hamiltoniano (passa por todo VÉRTICE uma vez) — são conceitos diferentes; a P1 do professor Silvio testa apenas euleriano.',
    conceptConflict: {
      topic: 'Construção do caminho/circuito euleriano',
      hasRealDifference: true,
      professorDefinition: 'DFS a partir de vértice de grau ímpar, priorizando arestas que não desconectam o grafo (evitar pontes).',
      professorSource: { type: 'professor_support_material', file: 'Flash Cards Grafos-1.pdf', note: 'Cita West p.26 para a condição de existência' },
      alternatives: [
        { author: 'West', text: 'Prova a condição de existência por indução (Teorema 1.2.26); cita "Tucker\'s Algorithm" só em exercício, sem detalhar.' },
        { author: 'Sedgewick', text: 'Mesma condição de existência, prova construtiva por indução, sem nomear um algoritmo específico.' },
      ],
      differenceExplanation: 'A condição de existência é unânime. O MÉTODO descrito pelo professor (evitar desconectar o grafo a cada passo) é o Algoritmo de Fleury — diferente do Algoritmo de Hierholzer (constrói via pilha/backtracking, sem testar pontes a cada passo), mais comum em implementações de referência e usado internamente neste app para a animação.',
      examGuidance: 'Na prova, descreva o raciocínio de Fleury (evitar desconectar o grafo, ou seja, evitar arestas de corte, a menos que não haja alternativa) — é o que o professor ensinou em aula.',
    },
    sources: [{ type: 'professor_support_material', file: 'Flash Cards Grafos-1.pdf' }, { type: 'old_exam', file: '2023-2-exam.pdf' }],
  },
  {
    id: 'dijkstra',
    moduleId: 'conectividade-caminhos',
    order: 4,
    slug: 'dijkstra',
    title: 'Menor caminho — Algoritmo de Dijkstra',
    examLikelihood: 'medium',
    examEvidence: 'Não aparece isolado nas 8 provas amostradas, mas está na lista de exercícios oficial e no aulão.',
    scopeNote:
      'Conflito de fontes: o cronograma oficial 2026/2 coloca "Caminhos mínimos: Método de Dijkstra" a partir de 30/09 — mais de 2 semanas depois da Prova 1 (14/09). Não há prova antiga que teste isso isoladamente. Mantido por precaução, mas é o tópico com sinal mais fraco de cair na P1 deste semestre — priorize outros primeiro.',
    whatYouNeedToKnow:
      'Para grafo ponderado com pesos não-negativos: vetor de distância D (0 para a origem, ∞ para os demais); fila de prioridade; a cada passo, remove o vértice de menor D ainda não processado e relaxa suas arestas de saída.',
    understand: [
      'Relaxamento da aresta (u,v) com peso w: se D[u] + w < D[v], atualiza D[v] = D[u] + w e o predecessor de v vira u.',
      'Falha com pesos NEGATIVOS — nesse caso seria necessário Bellman-Ford (fora do escopo confirmado da P1, mas mencionado como contraste).',
      'Complexidade: O(V²) com busca linear pelo mínimo, O((V+E)log V) com fila de prioridade (heap).',
      'Para reconstruir o caminho (não só a distância), é preciso guardar e seguir os predecessores a partir do vértice destino.',
    ],
    commonPitfall: 'Esquecer de reconstruir o CAMINHO (lista de vértices/arestas), entregando só a distância numérica quando a questão pede "o caminho".',
    sources: [{ type: 'professor_support_material', file: 'Flash Cards Grafos-1.pdf' }, { type: 'professor_support_material', file: 'Lista-de-exercicios-1.pdf' }],
  },
  {
    id: 'topologica-maior-caminho',
    moduleId: 'conectividade-caminhos',
    order: 5,
    slug: 'topologica-maior-caminho',
    title: 'Ordenação topológica e maior caminho em DAG',
    examLikelihood: 'medium',
    examEvidence: '2024/2-Q4 (30%) e 2026/1-Q3 (25%, problema de agendamento/caminho crítico) — confirmado por provas antigas recentes e recorrentes.',
    scopeNote:
      'Conflito de fontes: o cronograma oficial 2026/2 coloca "Ordenação topológica" em 09-12/11 — DEPOIS até da Prova 2 (22/10), muito depois da Prova 1 (14/09). É o tópico com maior conflito entre as duas fontes: caiu em 2 das últimas provas P1, mas o cronograma deste semestre o coloca perto do fim do curso. Mantido por precaução, mas com o sinal mais forte de "provavelmente não é P1 este ano".',
    whatYouNeedToKnow:
      'Ordenação topológica: sequência dos vértices de um DAG tal que toda aresta (u,v) tem u antes de v na sequência. Só existe se o grafo for acíclico. Maior caminho em DAG: usa a ordem topológica para calcular, em uma passada, a distância máxima até cada vértice.',
    understand: [
      'Método por remoção incremental (Kahn): repita — encontre um vértice com grau de entrada 0, remova-o (e suas arestas de saída) do grafo, anote-o na ordem. Se sobrar vértice sem conseguir grau de entrada 0, há ciclo (não existe ordenação).',
      'Método alternativo por DFS: a ordem topológica é a ordem DECRESCENTE de tempo de término de uma DFS completa no grafo.',
      'Maior caminho em DAG: percorra os vértices na ordem topológica, mantendo dist[v] = maior valor entre dist[u]+peso(u,v) para toda aresta que chega em v (peso 1 se não-ponderado). É o mesmo princípio do caminho mínimo em DAG, mas maximizando em vez de minimizar.',
      'Aplicação clássica (caiu em 2026/1-Q3): problemas de agendamento/dependência de tarefas — o "tempo mínimo para terminar tudo" é o maior caminho no DAG de dependências (caminho crítico).',
    ],
    commonPitfall: 'Tentar aplicar Dijkstra diretamente para o maior caminho — Dijkstra é para MENOR caminho com pesos não-negativos; maior caminho geral é NP-difícil, só é fácil (polinomial) porque o grafo é um DAG.',
    conceptConflict: {
      topic: 'Ordenação topológica',
      hasRealDifference: true,
      professorDefinition: 'Sem convenção documentada — o tópico só aparece em provas reais, sem slide/resumo/quadro específico.',
      professorSource: { type: 'old_exam', file: '2024-2-exam.pdf' },
      alternatives: [
        { author: 'Cormen / Sedgewick', text: 'Ordenação topológica via DFS (ordem decrescente de tempo de término).' },
        { author: 'Kleinberg & Tardos', text: 'Ordenação via remoção incremental de vértices de grau de entrada 0 (algoritmo de Kahn) — resultado igual, método diferente.' },
      ],
      differenceExplanation: 'Dois métodos padrão igualmente válidos, sem indicação documentada de preferência do professor.',
      examGuidance: 'Qualquer um dos dois métodos deve ser aceito na prova, desde que bem justificado — este app usa a versão por remoção incremental (Kahn) por ser mais fácil de visualizar passo a passo.',
    },
    sources: [{ type: 'old_exam', file: '2024-2-exam.pdf' }, { type: 'old_exam', file: 'P1-TGC.pdf' }],
  },
];
