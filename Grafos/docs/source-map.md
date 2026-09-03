# Source Map — Teoria dos Grafos e Computabilidade

Mapa de proveniência de todo material em `Materiais/`, com camada de prioridade (ver hierarquia de fontes no prompt do usuário) e status de escopo P1 (ver `docs/p1-scope.md`).

| Arquivo | Prioridade | Papel | Status P1 |
|---|---|---|---|
| `Cronograma/2026-2-schedule-tgc-cc-coreu-manha.pdf` | 3 | Cronograma oficial 2026/2 — data da P1 (14/09) e ordem exata do conteúdo | **Fonte decisiva do escopo** — ver `docs/p1-scope.md` Revisão 2 |
| `Slides/00-graphs-general-information.pdf` | 1 | Ementa, avaliação, contato | Contexto (não gera módulo) |
| `Slides/01-graphs-concepts.pdf` | 1 | Definições fundamentais de grafo | IN_SCOPE |
| `Slides/02-graphs-logic.pdf` | 1 | Introdução à lógica (aula de 31/08) | IN_SCOPE (Revisão 2) |
| `Slides/03-graphs-set-theory.pdf` | 1 | Conjuntos e funções (aula de 02/09) | IN_SCOPE (Revisão 2) |
| `Slides/04-graphs-data-structures.pdf` | 1 | Representações de grafo | IN_SCOPE |
| `Slides/05-graphs-isomorphism-and-concepts.pdf` | 1 | Isomorfismo, complemento, subgrafo | IN_SCOPE |
| `Slides/06-graphs-propositional-logic.pdf` | 1 | Lógica proposicional (aula de 03/09) | IN_SCOPE (Revisão 2) |
| `Slides/07-graphs-predicate-logic.pdf` | 1 | Lógica de predicados (aula de 09/09) | IN_SCOPE (Revisão 2) |
| `FotosDoQuadro/*.jpeg` (6 arquivos, incl. 4 do zip) | 2 | Resolução ao vivo: SCC, base/anti-base Γ⁺, detecção de ciclo DFS 3 estados, classificação de arestas | IN_SCOPE — fonte primária para pseudocódigo do professor |
| `Outros/Resumo Prova 1 Grafos.pdf` (aluna Sophia Carrazza) | 3 | Resumo de estudo rotulado "prova 1": BFS/DFS, fechos, excentricidade/raio/diâmetro/centro, Kosaraju, fórmulas de contagem | IN_SCOPE — sinal forte de escopo |
| `Outros/Lista-de-exercicios-1.pdf` | 3 | 20 exercícios oficiais PUC com resolução manuscrita | IN_SCOPE — fonte de variações/exercícios gerados |
| `Outros/Flash Cards Grafos-1.pdf` (na verdade "Aulão TGC: Primeira Prova", monitor Fernando Dal'Maria) | 3 | Revisão de monitoria: BFS/DFS/Euler/Dijkstra com pseudocódigo e fonte bibliográfica citada; base/anti-base atribuída a "Jamil, Silvio" | IN_SCOPE — sinal forte de escopo |
| `Provas/Prova 1/2022-1-exam.pdf` .. `P1-TGC.pdf` (8 provas, Prof. Silvio) | 4 | Formato/estilo/nível real de prova P1 | IN_SCOPE — molda `exam-pattern.md` |
| `Provas/Prova 1/Provas 1 Grafos.pdf` | 4 | Compilação com resoluções manuscritas de aluno (mostra profundidade de resposta esperada) | IN_SCOPE — usado para calibrar profundidade de feedback |
| `Provas/Prova 1/P1 - *.jpeg`, `Resolução * .jpeg` (Prof. Zenilton) | 4 | Provas de outro professor da mesma disciplina | Referência apenas — não usado para moldar o app |
| `Livros/Algoritmos - Teoria e Prática (Cormen)` | 5 | Comparação de definições | Ver `docs/concept-conflicts.md` |
| `Livros/Algorithm Design (Kleinberg & Tardos)` | 5 | Citado como fonte pelo monitor para BFS/DFS/Dijkstra | Ver `docs/concept-conflicts.md` |
| `Livros/Algorithms in C, Part 5 (Sedgewick)` | 5 | Citado como fonte pelo monitor/resumo para Kosaraju | Ver `docs/concept-conflicts.md` |
| `Livros/Introduction to Graph Theory (West-like)` | 5 | Citado como fonte pelo monitor para Euler | Ver `docs/concept-conflicts.md` |

## Notas

- **Atualização**: o cronograma oficial 2026/2 foi fornecido pelo usuário após a auditoria inicial. Como cronograma é prioridade 3 (acima de provas antigas, prioridade 4), ele decide a fronteira P1/P2 quando conflita com o padrão histórico — ver `docs/p1-scope.md` Revisão 2. Euleriano, Dijkstra e ordenação topológica apareciam em provas antigas mas o cronograma deste semestre os coloca depois da P1 (17/09 em diante) — tratados como OUT_OF_SCOPE nesta versão.
- Os livros da bibliografia (prioridade 5) nunca determinam sozinhos o escopo; usados apenas para comparar definições dos tópicos já confirmados como IN_SCOPE.
