# P2 Scope — Teoria dos Grafos e Computabilidade (Prof. Silvio Jamil F. Guimarães)

**Prova 2 de 2026/2: quarta-feira, 11/11/2026** (informada pelo aluno em 05/11; o cronograma previa 22/10, mas o professor atrasou).

## Revisão de 05/11/2026 (vale acima do resto deste arquivo)

- Dado até agora, segundo o aluno: até grafo de linha; ponderados, AGM, euleriano, hamiltoniano; provavelmente Dijkstra e Bellman-Ford. Floyd-Warshall não foi citado.
- **Cumulativa**: cai conteúdo da P1. Lógica e conjuntos não aparecem em nenhuma prova de P2.
- 9 provas de P2 do Prof. Silvio em `Materiais/Provas/Prova2`: 2021/2, 2024/1, 2024/2, 2025/1, `P2-TGC.pdf` (2026/1) e 4 sem data em `20xx-x-exam.pdf` (p. 1, 6, 7, 8). As provas do Prof. Zenilton são de outro professor e pesam pouco.
- Material de aluna, tratado como o jeito do professor a pedido do usuário: `Outros/Resumo Prova 2 Grafos.pdf`, `Outros/Aulão II De Grafos .pdf` e `Provas/Prova2/provas2_antigas_treino.pdf`. A lista de matéria do resumo inclui conectividade direcionada, Kosaraju, Dijkstra, Bellman-Ford, Min-Max e Max-Min, maior caminho, AGM, Johnson, caminho crítico e excentricidade; Floyd-Warshall está riscado.
- Provas transcritas em `src/content/questions/12-p2-provas-silvio.ts`. Respostas no registro do material; só os gabaritos de 2024/1 são oficiais.
- Erros do material não copiados: na resolução da prova da p. 7 de `20xx-x-exam.pdf`, Kruskal e Prim usam c–e = 2, mas a matriz dá 4 (AGM = 16). O texto digitado do resumo troca as frases de Min-Max e Max-Min; valem as anotações à mão e os pseudocódigos.
- Roteiro por dia em `src/content/p2Plan.ts`, exibido na página `/prova2` (Estudo P2).
- Gabarito de 2024/1 ("CORRIGIDO") a confirmar com o professor: Q3 item 3 e Q7 item 4.

## Hierarquia de fontes

1. Slides do professor (`Materiais/Slides/08` a `11`) — definem conteúdo e notação.
2. Cronograma 2026/2 — define o recorte da P2.
3. Provas antigas de P2 — padrão de cobrança (ver ressalva abaixo).
4. Livros da bibliografia — só complemento, sempre etiquetado no app.

## Aulas da P2 segundo o cronograma

```
16/09 qua — Indução
17/09 qui — Grafos hamiltonianos e eulerianos
21/09 seg — Corte / Caminhos mínimos
23/09 qua — Árvores / Árvores geradoras / AGM
24/09 qui — AGM: Prim / Kruskal
28/09 seg — AGM: Prim / Kruskal
30/09 qua — Caminhos mínimos: Dijkstra
01/10 qui — Caminhos mínimos: Dijkstra
05/10 seg — Caminhos mínimos: Dijkstra
07/10 qua — Caminhos mínimos: Bellman-Ford
08/10 qui — Caminhos mínimos: Bellman-Ford
15/10 qui — Caminhos mínimos: Floyd–Warshall
19/10 seg — Caminhos mínimos: Floyd–Warshall
21/10 qua — Aula de exercícios e revisão
22/10 qui — PROVA 2
```

Depois da P2 (fora do escopo): fluxo máximo, Ford-Fulkerson, Edmonds-Karp, Dinic,
ordenação topológica, emparelhamento, planaridade, coloração, conjuntos de vértices.

## Mapa aula → slides

| Aula | Arquivo | Páginas (PDF) |
|---|---|---|
| Eulerianos e hamiltonianos | `08-graphs-traversing.pdf` | 98–155 (Königsberg, Eulerian graph, Eulerian/Hamiltonian tour, Light Switches, DNA Reconstruction, Finding Eulerian tours, Bridges, Fleury) |
| Corte | `09-graphs-connectivity.pdf` | 72–92 (Graph Cuts, Connectivity and separability, robustez/vulnerabilidade) |
| Corte (propriedade do corte na AGM) | `11-graphs-trees-spanning-trees.pdf` | 53–74 (Graph Cuts, Cut Property) |
| Árvores / árvores geradoras | `11-graphs-trees-spanning-trees.pdf` | 3–36 (Trees, Spanning trees, Spanning forest) |
| AGM: Prim / Kruskal | `11-graphs-trees-spanning-trees.pdf` | 38–84 (MST, guloso, exemplos de Prim e Kruskal, otimalidade, Cycle Property, Reverse-Delete) |
| Caminhos mínimos (intro) | `10-graphs-shortest-path.pdf` | 3–20 |
| Caminho mínimo sem peso (BFS) | `08-graphs-traversing.pdf` | 75–96 (Algoritmo menor caminho, Distances) |
| Dijkstra | `10-graphs-shortest-path.pdf` | 21–56, 68–71 (invariante, exemplo, prova de correção, implementações) |
| Bellman-Ford | `10-graphs-shortest-path.pdf` | 57–67 (Single Source Shortest Path, Bellman-Ford) |
| Exemplo final | `10-graphs-shortest-path.pdf` | 72 |
| Steiner Tree | `11-graphs-trees-spanning-trees.pdf` | 85–91 (aparece no slide, não no cronograma) |

## Lacunas de material

- **Floyd–Warshall**: nenhum slide fornecido menciona o algoritmo. Sem fonte de Nível 1.
- **Indução**: não há slide dedicado; o termo só aparece dentro de demonstrações.

## Provas antigas de P2

- `Provas/Prova2/P2 - 1º 2024 - parte 1.jpeg` e `parte 2.jpeg` — **2024/1, Prof. Zenilton
  Kleber G. do Patrocínio Júnior** (outro professor, prova de 20 pontos). Questões:
  1. Modelagem + AGM (rodovias entre 4 cidades, matriz de custos)
  2. Caminhos mínimos a partir do vértice 1, matriz com pesos negativos (Bellman-Ford)
  3. Modelagem de atribuição (emparelhamento/fluxo) — fora da P2 de 2026/2
  4. Fluxo máximo e corte mínimo com limites inferior/superior — fora da P2 de 2026/2
  5. Ordenação topológica por Kahn — fora da P2 de 2026/2

  Útil para formato de cobrança (modelagem + execução passo a passo), não para escopo.

## Lista `Outros/2026-2-exercicio-1.pdf`

Exercícios 1–11 cobrem conteúdo da P1 (aperto de mãos, famílias de grafos, complemento,
bipartição, operações). Só o **Exercício 12** (assassinato com portas: passar por todas as
portas uma única vez) é de grafo euleriano — conteúdo da P2.

## Decisões (07/10/2026)

- **Floyd–Warshall e Indução**: sem slide; o usuário escolheu usar o livro (Cormen) com
  etiqueta. Todo trecho de livro diz "Cormen, seção X" no app. Se aparecer slide ou foto
  do quadro dessas aulas, ele passa a valer acima do livro (inclusive a notação).
- **Nulidade (slide 11, p. 35)**: o slide imprime `μ = e − n − k`, mas o grafo do mesmo
  slide (n = 8, e = 9, k = 1, 2 cordas) só fecha com `μ = e − n + k`. O app mostra os dois
  como conflito (`conceptConflict` do tópico `arvore-geradora`) e recomenda confirmar com o
  professor.
- **DNA Reconstruction (slide 08, quadros 29–30)**: as páginas da modelagem estão em branco
  no PDF (resolvido em aula). O app dá só o enunciado; não inventa a modelagem.
- **Euleriano e Dijkstra** saíram do módulo da P1 e foram para a P2, onde agora têm slide.
  A família de treino "euleriano" (2 provas antigas do Silvio) passou para a P2.
- **Ordenação topológica** continua no módulo da P1 com `scopeNote`: pelo cronograma é P3.

## No app

Seletor P1/P2 no topo (padrão P2). Módulos da P2:

| Módulo | Tópicos |
|---|---|
| `p2-inducao` | inducao |
| `p2-euler-hamilton` | euleriano, hamiltoniano |
| `p2-arvores-agm` | arvores, arvore-geradora, cortes, agm-prim-kruskal, steiner |
| `p2-caminhos-minimos` | caminho-minimo-conceitos, dijkstra, bellman-ford, floyd-warshall |

Motor (`src/lib/graph.ts`): `prim`, `kruskal`, `bellmanFord` (tabela `d[i, v]` do slide),
`floydWarshall` (matrizes `D(k)`), `fleury`, `bridges`, `cutSet`, `rankAndNullity`.
Grafos dos slides em `src/content/questions/graphs-p2.ts`. Questões em
`src/content/questions/10-p2.ts` (inclui a P2 2024/1 transcrita, Q1 e Q2), definições em
`src/content/definitions/p2.ts`, simulados `simulado-p2-a` e `simulado-p2-b` em
`src/content/exams.ts`.
