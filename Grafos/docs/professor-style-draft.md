# Professor Style Draft — Teoria dos Grafos e Computabilidade

Perfil de notação/estilo extraído de todos os materiais auditados (slides do prof. Silvio Jamil, resumo de aluna, aulão de monitoria, fotos de quadro).

## Idioma

- Slides: títulos de seção frequentemente em inglês ("Preliminary concepts", "Graph definition", "Terminology", "Isomorphism and some concepts", "Adjacency matrix"), corpo do texto majoritariamente em português. Algumas definições centrais (Walk/Trail/Path/Cycle) são dadas em inglês mesmo dentro de um deck em português.
- Material de apoio (resumo de aluna, monitoria, quadro): 100% português, incluindo nomes de variáveis de pseudocódigo (VISITADO, VISITAR_REC, "fila", "pilha").
- Preferir terminologia em português ao redigir o app de estudo (ex.: "grau de entrada"/"grau de saída" em vez de in-degree/out-degree), mas manter os termos em inglês Walk/Trail/Path/Cycle quando aparecerem literalmente nos slides, pois o professor os usa assim.

## Notação de conjuntos e grafo

- Grafo sempre denotado G = (V, E).
- Direcionado: E = {(u,v) | u,v ∈ V} (par ordenado, parênteses).
- Não-direcionado: E = {{u,v} | u,v ∈ V} (par não-ordenado, chaves).
- Vértices nomeados com letras minúsculas isoladas: a, b, c, d, e, f... (não v1, v2...) nos exemplos concretos; V e E maiúsculos para os conjuntos.
- Grau: d(v); grau de entrada d⁻(v); grau de saída d⁺(v).
- Grafo complementar: notação dupla observada — Ḡ (barra) e também "C(G)"/G' (linha) dependendo da fonte. Grafo transposto: sem símbolo fixo consistente, descrito por extenso como "grafo transposto" (mesmos vértices/arestas, sentido invertido).
- Alcançabilidade (visto apenas nas fotos de quadro/aula ao vivo, não nos slides 00-07): Γ⁺(v) para o conjunto de vértices alcançáveis a partir de v; Γ⁺(B) = ∪_{u∈B} Γ⁺(u) para conjuntos.
- Fórmulas de contagem sempre explicitadas: |V|, |E|, Kn → |E|=n(n−1)/2, grafo roda |V|=n+1 e |E|=2n, bipartido completo |E|_máx = n²/4, etc. — o professor cobra fórmulas fechadas, não só definições qualitativas.

## Como os grafos são desenhados/rotulados

- Vértices como círculos pequenos com letra/número dentro; arestas como linhas simples (setas para grafos direcionados).
- Em exercícios de matriz de adjacência, linhas/colunas rotuladas com as letras dos vértices na ordem alfabética (A,B,C,D,E) tanto na matriz quanto no desenho correspondente.
- Em problemas de busca (BFS/DFS), os vértices recebem dois números sobre/ao lado do círculo: no material de monitoria, formato "início/fim" tipo "8/13" (tempos de descoberta/término, estilo CLRS); nas fotos de quadro do professor, os mesmos números aparecem mas representando o **estado DFS de 3 valores (0/1/2)**, não tempos — atenção a essa diferença de convenção entre os dois materiais.
- Fila (BFS) desenhada como sequência horizontal de valores rotulada "fila:" com conteúdo tipo "0 4 2 3 5 6 7"; primeiro elemento à esquerda.
- Pilha (DFS) mencionada textualmente ("usa pilha") mas sem desenho explícito de pilha nos materiais lidos.

## Estilo de pseudocódigo

Visto nas fotos de quadro (fonte primária do próprio professor) e no resumo da aluna:

- Nomes de função e variável em português, MAIÚSCULO ou CamelCase-like: `VISIT(G)`, `VISITAR_REC(G, v)`, `VISITADO[v]`, `dfs(v, grafo, visitados)`, `fecho-transitivo(v, grafo)`.
- Indentação por nível lógico, sem chaves de bloco na maior parte dos pseudocódigos (estilo "pseudocódigo informal"), exceto no resumo da aluna que às vezes usa `{ }` explícitos.
- Loop `for u ∈ V` / `for u ∈ N(v)` — usa notação de conjunto matemática dentro do pseudocódigo, não sintaxe de linguagem real.
- Atribuição com `=` simples (não `:=`).
- Comentários/anotações de resultado escritas à parte, não como comentário de código formal (ex.: "MA_CICLO" anotado ao lado da condição que detecta ciclo).
- Estados de DFS explicitados numericamente com legenda textual: `0 - não começou`, `1 - começou mas não terminou`, `2 - terminou` (equivalente a branco/cinza/preto, mas o professor usa números 0/1/2, não cores — importante para manter consistência no app).
- Algoritmos sempre acompanhados de citação de fonte bibliográfica no material de monitoria (Kleinberg & Tardos, West, Sedgewick & Wayne) — o professor titular não cita fonte nas fotos de quadro (conteúdo próprio, "Fonte: Jamil, Silvio" nos slides de monitoria que reproduzem definições dele).

## Estrutura de explicação / justificativa

- Provas/justificativas seguem estilo direto, por contradição ou contagem, sem formalismo pesado de lógica simbólica (apesar do curso ter conteúdo de lógica formal separado).
- Padrão recorrente: enunciar afirmação → decompor em casos (par/ímpar, com/sem propriedade) → concluir por contagem ou pelo princípio da casa dos pombos.
- Exemplo típico (grau ímpar par): "a soma dos graus de um grafo é 2|E|, logo é par; a soma de graus pares é sempre par; logo a soma dos graus ímpares também deve ser par; isso só é possível se o número de vértices de grau ímpar for par."
- Provas de existência/não-existência de grafos com dada sequência de graus resolvidas numericamente: soma dos graus deve ser par e ≤ n(n−1) (máximo do grafo completo), com contas explícitas mostradas (ex.: "5·3=15, 15=2E, E=7,5 arestas → não é inteiro → impossível").

## Terminologia preferencial (PT vs EN) — tabela de referência

| Conceito | Termo usado pelo professor |
|---|---|
| grau de entrada/saída | d⁻(v) / d⁺(v) (não "in-degree"/"out-degree" no texto corrido) |
| passeio | Walk (slide em inglês) |
| trilha | Trail (slide em inglês) |
| caminho | Path (slide em inglês) / "caminho" no material de apoio |
| ciclo | Cycle (slide em inglês) / "ciclo" no material de apoio |
| busca em largura | "Busca em Largura" (BFS só como sigla ocasional) |
| busca em profundidade | "Busca em Profundidade" (DFS só como sigla ocasional) |
| componente fortemente conexo | "componente fortemente conexo (SCC)" — sigla em inglês mantida |
| grafo dirigido/direcionado | ambos os termos aparecem, "direcionado" mais comum |
| fecho transitivo | "fecho transitivo direto" / "fecho transitivo inverso" |

## Notas de estilo para o app de estudo

- Preservar a convenção de estado DFS 0/1/2 (não branco/cinza/preto) ao apresentar detecção de ciclo, para bater com o que o professor escreveu no quadro.
- Preservar notação Γ⁺(v) para alcançabilidade ao tratar de base/anti-base — é notação específica do professor, não universal.
- Manter fórmulas fechadas como resposta esperada nos exercícios de contagem (nº de arestas/vértices por família de grafo), não só definição textual.
