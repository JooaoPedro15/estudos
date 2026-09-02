# P1 Scope Candidate — Teoria dos Grafos e Computabilidade

Lista candidata de tópicos presentes no material auditado, em ordem aproximada de apresentação (slides 00→07, depois material de apoio). **Este documento NÃO finaliza a fronteira P1/P2** — apenas cataloga o que está presente e onde. A fronteira definitiva deve cruzar esta lista com a análise paralela de provas antigas (ver `docs/exam-pattern-draft.md`, produzido por outro agente em paralelo).

## Bloco 1 — Fundamentos de grafos (fonte: 01-graphs-concepts.pdf)
- Motivação histórica (pontes de Königsberg, coloração de mapas, caminho mínimo)
- Definição formal G=(V,E), direcionado/não-direcionado
- Terminologia básica: laço, arestas paralelas, grafo simples, adjacência, grau/grau de entrada/grau de saída, sequência de graus, grafo regular, vértice isolado/pendente, grafo nulo, grafo valorado/rotulado
- Grafo completo Kn e fórmula de arestas
- Walk / Trail / Path / Cycle
- Grafo conexo; bipartido / bipartido completo Km,n
- Teorema do aperto de mãos
- Operações: união, soma, remoção de aresta/vértice, contração de aresta

## Bloco 2 — Estruturas de dados para grafos (fonte: 04-graphs-data-structures.pdf)
- Matriz de incidência (convenção +1/-1/0)
- Matriz de adjacência
- Lista de adjacência (sucessores/predecessores)

## Bloco 3 — Isomorfismo e conceitos adicionais (fonte: 05-graphs-isomorphism-and-concepts.pdf)
- Isomorfismo de grafos (condições necessárias, não suficientes)
- Grafo complementar
- Subgrafo / subgrafo induzido / subgrafos disjuntos
- Caminhos/circuitos, cadeias
- Teorema do número par de vértices de grau ímpar
- Teorema de máximo/mínimo de arestas por nº de componentes

## Bloco 4 — Fundamentos de matemática discreta (fonte: 03-graphs-set-theory.pdf)
Ligado à Parte 1 da ementa ("Lógica, relações de equivalência, funções e conjuntos"), não é conteúdo de grafos propriamente dito, mas é pré-requisito/base formal usado nas provas de grafos (contagem, funções).
- Teoria de conjuntos: definição, subconjuntos, conjunto das partes, Venn, operações, De Morgan
- Cardinalidade, produto cartesiano
- Funções: injetora/sobrejetora/bijetora, inversa, composição, floor/ceiling
- Sequências (aritmética/geométrica/recursiva), somatórios/produtórios

## Bloco 5 — Lógica proposicional (fonte: 06-graphs-propositional-logic.pdf)
Também ligado à Parte 1 da ementa.
- Proposições, conectivos, tabelas-verdade
- Recíproca/inversa/contrapositiva, precedência de operadores
- Tautologia/contradição/contingência
- Equivalências lógicas (De Morgan, distributividade, etc.)

## Bloco 6 — Lógica de predicados (fonte: 07-graphs-predicate-logic.pdf)
- Predicados, quantificadores ∀/∃
- Variáveis livres/ligadas, escopo
- Negação de quantificadores
- Tradução linguagem natural → lógica

> **FLAG (conforme solicitado)**: este é o slide mais recente (datado do dia da tarefa) e o mais extenso da sequência de lógica (39 slides) — tratamento completo, não introdução breve. Não há indicação textual explícita de que pertença à P2 em vez da P1; sua posição como último dos 8 decks e sua extensão sugerem duas hipóteses igualmente plausíveis: (a) é o fechamento natural do bloco de lógica que começa em 02/03/06 e portanto pertence à mesma prova que esses; (b) é conteúdo novo/mais avançado destinado à P2 justamente por ter sido adicionado por último e não aparecer em nenhum dos outros materiais de apoio (resumo de aluna, aulão de monitoria, fotos de quadro — nenhum desses menciona predicados ou quantificadores). **Esta ausência em todo o material de revisão/apoio é o dado mais forte contra a inclusão na P1** — merece checagem cruzada obrigatória com provas antigas antes de decidir.

## Bloco 7 — Algoritmos de busca e conectividade (fontes: Resumo Prova 1, Flash Cards/Aulão, fotos de quadro — SEM slide dedicado 00-07)
Confirmado por 3 fontes de apoio independentes como conteúdo efetivamente ensinado e cobrado. Ausência de slide formal não deve ser lida como "fora de escopo" — o oposto parece verdadeiro aqui.
- BFS (busca em largura) — pseudocódigo com fila
- DFS (busca em profundidade) — pseudocódigo com pilha/recursão
- Fecho transitivo direto e inverso (via grafo transposto)
- Excentricidade, raio, diâmetro, centro de um grafo
- Classificação de arestas em DFS: árvore, retorno, avanço, cruzamento
- Caminho/ciclo euleriano — condições (grafos pares / exatamente 2 vértices ímpares) e algoritmo
- Menor caminho (Dijkstra) — vetor de distância, fila de prioridade, relaxamento
- Base e anti-base de grafo dirigido (Γ⁺, |BASE|=1, cálculo via grau de entrada e contração de ciclos)
- Detecção de ciclo em grafo dirigido via DFS de 3 estados (0/1/2)
- SCC — algoritmo de Kosaraju (DFS + transposto + ordem de término)

## Observações gerais sobre o corpus

1. **Nenhum arquivo contém cronograma explícito de P1 vs P2.** A fronteira foi inferida por: (a) ordem/numeração dos slides 00-07, (b) o que aparece no "Resumo Prova 1" da aluna, (c) o que aparece no aulão de monitoria explicitamente intitulado "Primeira Prova", (d) o que aparece nas fotos de quadro de aula ao vivo (datadas de agosto/setembro 2026, presumivelmente próximas da data real da P1).
2. **Divergência notável**: os slides 00-07 cobrem fundamentos de grafos + toda a base de lógica/conjuntos, mas NÃO cobrem busca/algoritmos (Bloco 7). Os três materiais de apoio (resumo, aulão, quadro) cobrem fortemente o Bloco 7 mas nunca mencionam lógica de predicados (Bloco 6) nem, de fato, lógica proposicional ou teoria de conjuntos (Blocos 4-5). Isso sugere que a P1 pode ser primariamente "grafos + busca/algoritmos" (Blocos 1-3 + 7) com a lógica/conjuntos (Blocos 4-6) potencialmente destinada a outra prova — mas isso é uma inferência, não um fato confirmado pelos materiais, e **precisa ser cruzada com a análise de provas antigas** antes de qualquer corte final.
3. Este documento deve ser combinado com o output do agente paralelo que analisou provas antigas (arquivo `docs/exam-pattern-draft.md`, já presente no diretório `docs/`) para produzir a fronteira P1/P2 definitiva.
