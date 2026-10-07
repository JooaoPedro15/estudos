# P2 Scope — Teoria dos Grafos e Computabilidade (Prof. Silvio Jamil F. Guimarães)

**Prova 2 de 2026/2: quinta-feira, 22/10/2026** (cronograma oficial, p. 2).

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
