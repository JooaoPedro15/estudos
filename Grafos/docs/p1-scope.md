# P1 Scope — Teoria dos Grafos e Computabilidade (Prof. Silvio Jamil F. Guimarães)

Documento final de escopo (Fase 1). Substitui `p1-scope-candidate.md` (mantido como rascunho histórico).

## Decisão de escopo

**A P1 deste professor cobre exclusivamente Teoria dos Grafos** (definições, representações, propriedades, isomorfismo, e algoritmos de busca/conectividade). **Não cobre lógica proposicional, lógica de predicados nem teoria de conjuntos**, apesar desses temas fazerem parte da ementa geral da disciplina ("Parte 1 — Computabilidade") e existirem slides dedicados a eles.

### Evidência decisiva

Analisamos **8 provas P1 reais do Prof. Silvio Jamil** (2022/1 a 2026/1, ver `docs/exam-pattern.md`). Nenhuma das ~37 sub-questões testa lógica proposicional, lógica de predicados, ou teoria de conjuntos como assunto autônomo. 100% das questões são sobre grafos: definições, propriedades, provas envolvendo contagem/grau, representações (matriz/lista), isomorfismo/complemento, e projeto de algoritmos de grafo (busca, fecho transitivo, base/anti-base, ciclos, SCC, Euler, caminho mínimo, diâmetro).

A ementa (`00-graphs-general-information.pdf`) lista duas partes: "Computabilidade" (lógica, conjuntos, funções, prova de teoremas) e "Teoria dos Grafos" (estruturas de dados, caminhos, busca, árvores, conectividade, isomorfismo, planaridade, coloração, particionamento, modelagem, fluxo em redes) — essas partes cobrem o semestre inteiro (P1+P2+trabalhos), não só a P1. A P1 amostrada testa apenas um subconjunto do bloco "Teoria dos Grafos".

## IN_SCOPE_P1

| Tópico | Fonte primária | Confirmado por provas |
|---|---|---|
| Definição de grafo, terminologia (grau, adjacência, laço, arestas paralelas, grafo simples/nulo/regular/valorado) | `01-graphs-concepts.pdf` | Sim (base de quase toda prova) |
| Walk/Trail/Path/Cycle, grafo conexo, bipartido/completo/roda | `01-graphs-concepts.pdf`, Resumo | Sim (2023/1, 2025/1) |
| Teorema do aperto de mãos, nº par de vértices de grau ímpar | `01-graphs-concepts.pdf`, `05-...pdf`, Lista Ex.1 | Sim (recorrente, quase toda prova) |
| Operações sobre grafos (união, soma, remoção, contração) | `01-graphs-concepts.pdf`, Lista Ex.6-7 | Indireto (não é questão isolada, mas base conceitual) |
| Matriz de incidência, matriz de adjacência, lista de adjacência | `04-graphs-data-structures.pdf` | Sim (2023/1-Q4, base de várias questões) |
| Isomorfismo (condições necessárias, não suficientes) | `05-graphs-isomorphism-and-concepts.pdf` | Sim (2022/1-Q3, forte peso) |
| Grafo complementar / auto-complementar | `05-...pdf` | Sim (2022/2, 2023/1, 2025/1) |
| Subgrafo / subgrafo induzido, nº de subgrafos de Kn | `05-...pdf` | Sim (2022/2, 2024/1, 2024/2, 2026/1 — um dos + recorrentes) |
| Teorema de mín/máx de arestas dado n vértices e k componentes | `05-...pdf`, Resumo | Sim (base da família "possibilidade de grafo", 4 de 8 provas) |
| Prova de dois vértices com mesmo grau (casa dos pombos) | Lista Ex.2, Resumo | Sim (2024/1, 2024/2, 2026/1) |
| BFS (busca em largura) | Resumo, Aulão | Sim (2023/1-Q5) |
| DFS (busca em profundidade) | Resumo, Aulão | Sim (2022/2-Q3) |
| Fecho transitivo direto/inverso (via grafo transposto) | Resumo | Sim (2022/1-Q2, 2022/2-Q2 — recorrente) |
| Base e anti-base de grafo dirigido (notação Γ⁺) | Aulão, Quadro | Sim (2022/1, 2022/2, 2023/2, 2024/1 — muito recorrente) |
| Detecção/classificação de ciclo em grafo dirigido (DFS 3 estados 0/1/2) | Quadro (fonte primária, ao vivo) | Sim (2024/2-Q3, 2026/1-Q4) |
| Classificação de arestas em DFS (árvore/retorno/avanço/cruzamento) | Resumo, Quadro | Indireto (não vista isolada nas 8 provas do Silvio, mas ensinada ao vivo — manter como sub-habilidade do bloco DFS) |
| Excentricidade, raio, diâmetro, centro | Resumo | Sim (2023/2-Q3, 2024/1-Q4) |
| Caminho/circuito euleriano (condições + algoritmo) | Aulão | Sim (2023/2-Q4 narrativa, 2026/1-Q2 direta) |
| Menor caminho / Dijkstra | Aulão, Lista Ex.8 | Indireto (não é questão isolada nas 8 provas amostradas, mas é pilar do curso e mencionado na Lista de Exercícios oficial — manter como tópico, com prioridade de exame "média") |
| SCC — algoritmo de Kosaraju | Resumo, Aulão, Quadro (foto viva) | Sim (2022/1-Q5, 2024/2 relacionado) |
| Ordenação topológica / maior caminho em DAG (agendamento) | Provas antigas apenas (2024/2-Q4, 2026/1-Q3) | Sim, mas SEM fonte de slide/resumo/aulão — incluído por evidência direta e repetida de prova real do mesmo professor |
| Grafos especiais: Nn, Cn, Kn, Km,n, Qn (hipercubo), Wn (roda), Kr,s,t (tripartido completo) | Lista Ex.11, `01-...pdf`, prova 2025/1-Q3 | Sim (2025/1-Q3) |
| Famílias de grafos-modelo (interseção de conjuntos, intervalos, grade, palavras, grafo de linha) | Lista Ex. 9,16-20 | Não testado diretamente nas 8 provas, mas é o estilo de "modelagem de problema como grafo" que a P1 cobra recorrentemente (2023/2-Q4, 2025/1-Q5, 2026/1-Q3) — manter como gerador de variações de questões aplicadas, não como tópico de teoria isolado |

## OUT_OF_SCOPE_P1 (não gerar módulos visíveis)

| Material | Motivo |
|---|---|
| `02-graphs-logic.pdf` (lógica geral/paradoxos) | Zero ocorrência nas 8 provas P1; pertence à Parte 1 "Computabilidade" da ementa, provavelmente avaliada em outro momento do curso |
| `03-graphs-set-theory.pdf` (conjuntos e funções) | Idem — zero ocorrência nas provas |
| `06-graphs-propositional-logic.pdf` | Idem |
| `07-graphs-predicate-logic.pdf` (slide mais novo/extenso) | Idem — apesar de ser o material mais recente e completo, nenhuma das 8 provas P1 (nem o resumo, nem o aulão) menciona predicados/quantificadores. Guardado para possível P2/outra avaliação. |
| Planaridade, coloração, particionamento, fluxo em redes, árvores (menção na ementa geral) | Não aparecem em nenhum slide lido nem em nenhuma das 8 provas — conteúdo de curso completo (provavelmente P2), não de P1 |
| Provas do Prof. Zenilton Kleber (matching bipartido/fluxo máximo, teoremas de Dirac/Ore/Bondy-Chvátal para hamiltonicidade, Bellman-Ford com pesos negativos) | Professor diferente do especificado pelo usuário ("passar na P1 do professor Silvio") — mantido só como referência em `docs/exam-pattern.md`, não usado para moldar o formato/conteúdo do app |

## UNCERTAIN (registrado, não vira módulo isolado por ora)

- **Dijkstra/menor caminho ponderado**: mencionado no aulão e na lista de exercícios oficial, mas não aparece como questão isolada nas 8 provas amostradas (amostra pequena — pode ter caído em semestre não capturado). Mantido como tópico de prioridade "média" dentro do bloco de algoritmos de busca, não como card de destaque "aparece muito".
- **Classificação de arestas DFS (árvore/retorno/avanço/cruzamento)**: ensinada ao vivo (quadro) mas não vista como questão isolada nas provas amostradas — tratada como sub-habilidade dentro do módulo DFS, não módulo próprio.

## Materiais usados

`Materiais/Slides/00,01,04,05-*.pdf`, `Materiais/Outros/Resumo Prova 1 Grafos.pdf`, `Materiais/Outros/Lista-de-exercicios-1.pdf`, `Materiais/Outros/Flash Cards Grafos-1.pdf` (na verdade aulão de monitoria), `Materiais/FotosDoQuadro/*` (6 fotos, incl. zip), `Materiais/Provas/Prova 1/*` (8 provas do Prof. Silvio).

## Materiais ignorados (para este escopo)

`Materiais/Slides/02,03,06,07-*.pdf` (ver OUT_OF_SCOPE acima). Continuam armazenados em `Materiais/` para uso futuro (ex.: se o usuário quiser expandir o app para P2 ou para computabilidade).

## Materiais incertos / tratados com ressalva

Provas do Prof. Zenilton Kleber (`Materiais/Provas/Prova 1/*.jpeg`) — mesma disciplina, professor diferente. Mantidas como referência de comparação em `docs/exam-pattern.md`, não usadas para gerar conteúdo do app salvo indicação futura do usuário.
