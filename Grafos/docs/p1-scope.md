# P1 Scope — Teoria dos Grafos e Computabilidade (Prof. Silvio Jamil F. Guimarães)

**Revisão 3** — o usuário pediu explicitamente para NÃO deixar a Revisão 2 (só cronograma) substituir sozinha a evidência de provas antigas: ele não tem certeza se o cronograma será seguido à risca este semestre, e quer as duas fontes combinadas, não uma escolhida às cegas no lugar da outra. Mudança concreta: **euleriano, Dijkstra e ordenação topológica/maior caminho voltaram a aparecer no app** (a Revisão 2 os havia removido por estarem, no cronograma, depois da data da P1). Continuam visíveis, mas cada um agora tem um campo `scopeNote` explicando o conflito de fontes diretamente na lição (e um selo "P1 ou P2?" na lista de tópicos do módulo) — decisão de quanto priorizar cada um fica com o aluno, não escondida pelo app. Ver seção "Conflitos mantidos visíveis" abaixo.

**Revisão 2** (histórico, parcialmente revertida pela Revisão 3) — corrigida após o usuário fornecer o cronograma oficial 2026/2 (`Materiais/Cronograma/2026-2-schedule-tgc-cc-coreu-manha.pdf`). A Revisão 1 inferiu o escopo apenas a partir do padrão das provas antigas — na ausência de cronograma, essa era a melhor fonte disponível. Com o cronograma em mãos (prioridade 3, acima de provas antigas — prioridade 4, na hierarquia de fontes deste projeto), a fronteira P1/P2 mudava em pontos concretos — ver "O que mudou" abaixo. A parte da Revisão 2 sobre lógica/conjuntos ENTRAREM no escopo continua valendo (não há conflito de fontes ali — só ausência de amostra antiga, não contradição).

## Decisão de escopo (atualizada)

A **Prova 1 de 2026/2 é no dia 14/09/2026** (segunda-feira), conforme o cronograma. O conteúdo dado até a aula de revisão (10/09) é:

```
03/08 seg — Apresentação / Introdução / Conceitos fundamentais
05/08 qua — Conceitos fundamentais de grafos
06/08 qui — Estruturas de dados para representação
10/08 seg — Estruturas de dados para representação
12/08 qua — Isomorfismo / Subgrafo
13/08 qui — Busca em largura
17/08 seg — Caminho / Noções básicas de conectividade
19/08 qua — Caminho / Noções básicas de conectividade
20/08 qui — Busca em profundidade
24/08 seg — Busca em profundidade
26/08 qua — Conectividade e Separabilidade
27/08 qui — Conectividade e Separabilidade
31/08 seg — Introdução à Lógica
02/09 qua — Teoria de conjuntos
03/09 qui — Lógica proposicional
09/09 qua — Lógica de predicados
10/09 qui — Aula de exercícios e revisão
14/09 seg — PROVA 1
```

Logo após a revisão, sem nenhum outro conteúdo intercalado, entram temas que **NÃO fazem parte da P1** deste semestre: Grafos hamiltonianos e eulerianos (17/09), corte/caminhos mínimos (21/09), árvores/AGM (23/09 em diante), Dijkstra (30/09–05/10), Bellman-Ford, Floyd-Warshall, Prova 2 (22/10), fluxo máximo, e só em novembro — depois da Prova 2 — ordenação topológica e emparelhamento.

## O que mudou em relação à Revisão 1

A Revisão 1 (baseada só nas 8 provas antigas do professor) havia concluído que a P1 é "só grafos + algoritmos de busca", excluindo lógica/conjuntos e incluindo euleriano/Dijkstra/ordenação topológica (que apareciam em provas de semestres passados). O cronograma oficial deste semestre mostra uma reorganização didática:

| Tópico | Revisão 1 (por provas antigas) | Revisão 2 (por cronograma 2026/2) | Motivo da mudança |
|---|---|---|---|
| Lógica proposicional | OUT_OF_SCOPE (0/8 provas testaram) | **IN_SCOPE** | Dada em 03/09, imediatamente antes da revisão (10/09) e da prova (14/09) — sem nenhum outro assunto entre elas |
| Lógica de predicados | OUT_OF_SCOPE | **IN_SCOPE** | Dada em 09/09, um dia antes da revisão |
| Teoria de conjuntos | OUT_OF_SCOPE | **IN_SCOPE** | Dada em 02/09 |
| Caminho/circuito euleriano | IN_SCOPE (2/8 provas antigas) | **OUT_OF_SCOPE** | Cronograma põe "Grafos hamiltonianos e eulerianos" em 17/09 — 3 dias **depois** da prova |
| Dijkstra (menor caminho) | IN_SCOPE, prioridade média (0/8 provas, só material de apoio) | **OUT_OF_SCOPE** | Cronograma põe Dijkstra a partir de 30/09 — mais de 2 semanas depois da prova |
| Ordenação topológica / maior caminho DAG | IN_SCOPE (2/8 provas antigas) | **OUT_OF_SCOPE** | Cronograma põe em 09–12/11 — depois até da **Prova 2** (22/10) |

Isso não significa que as provas antigas "erraram" — significa que o professor reorganizou a ordem do conteúdo entre semestres (isso é comum: cursos ajustam o ritmo de um semestre para outro). Para efeitos de estudo, a fonte mais confiável de "o que VAI cair na P1 deste semestre" é o cronograma deste semestre, não o padrão de semestres com um ritmo diferente. Os tópicos removidos (euleriano, Dijkstra, ordenação topológica) permanecem implementados no motor de grafos (`src/lib/graph.ts`) e podem ser reincorporados facilmente quando fizerem sentido (P2, ou se surgir evidência de que caem mesmo na P1).

**Limitação importante**: como o reordenamento é novo, não existe nenhuma prova antiga que teste lógica/conjuntos nesta posição do curso — não há amostra histórica para dizer "isso cai muito" com confiança estatística. Os tópicos de lógica/conjuntos são marcados com `examLikelihood: medium` e a evidência é "o cronograma oficial põe isso imediatamente antes da prova", não "caiu em X das Y provas".

## IN_SCOPE_P1 (atualizado)

### Grafos (confirmado por cronograma E por provas antigas — inalterado da Revisão 1)

| Tópico | Aula do cronograma |
|---|---|
| Definição de grafo, terminologia (grau, laço, arestas paralelas, simples/nulo/regular) | Conceitos fundamentais (03–05/08) |
| Walk/Trail/Path/Cycle, conexo, bipartido, famílias especiais, teorema do aperto de mãos | Conceitos fundamentais (03–05/08) |
| Matriz de incidência, matriz de adjacência, lista de adjacência | Estruturas de dados para representação (06,10/08) |
| Isomorfismo, complemento/subgrafo | Isomorfismo / Subgrafo (12/08) |
| Teoremas de contagem (min/max arestas por componentes, pombos, nº subgrafos Kn) | Isomorfismo / Subgrafo (12/08) |
| BFS | Busca em largura (13/08) |
| DFS, classificação de arestas | Busca em profundidade (20,24/08) |
| Fecho transitivo, base/anti-base (Γ⁺), detecção de ciclo, SCC/Kosaraju | Conectividade e Separabilidade (26,27/08) — também confirmado por 4+/8 provas antigas |
| Excentricidade, raio, diâmetro, centro | Caminho / Noções básicas de conectividade (17,19/08) — também confirmado por provas antigas |

### Lógica e Conjuntos (NOVO na Revisão 2 — confirmado só pelo cronograma, sem amostra de provas antigas)

| Tópico | Aula do cronograma | Fonte de conteúdo |
|---|---|---|
| Introdução à lógica (contexto, não muito testável isoladamente) | 31/08 | `02-graphs-logic.pdf` |
| Teoria de conjuntos e funções (operações, De Morgan, injetora/sobrejetora/bijetora) | 02/09 | `03-graphs-set-theory.pdf` |
| Lógica proposicional (conectivos, tabelas-verdade, equivalências) | 03/09 | `06-graphs-propositional-logic.pdf` |
| Lógica de predicados (quantificadores, negação, tradução) | 09/09 | `07-graphs-predicate-logic.pdf` |

## UNCERTAIN_P1 (Revisão 3 — mantidos visíveis, com `scopeNote` explicando o conflito)

Estes três tinham evidência de provas antigas (Revisão 1) mas o cronograma 2026/2 os coloca depois da P1 (Revisão 2). Por pedido do usuário, ficam visíveis no app — módulo "Conectividade e Caminhos Especiais" — em vez de escondidos, para ele decidir quanto estudar:

| Tópico | Evidência a favor (provas antigas) | Evidência contra (cronograma 2026/2) |
|---|---|---|
| Caminho/circuito euleriano | 2/8 provas (2023/2, 2026/1) | "Grafos hamiltonianos e eulerianos" em 17/09 — 3 dias depois da P1 (14/09) |
| Dijkstra | Não isolado em nenhuma prova; só lista de exercícios/aulão | A partir de 30/09 — mais de 2 semanas depois |
| Ordenação topológica / maior caminho DAG | 2/8 provas (2024/2, 2026/1) | 09–12/11 — depois até da Prova 2 (22/10) |

## OUT_OF_SCOPE_P1 (sem evidência de nenhuma fonte — nem provas antigas, nem cronograma antes da P1)

| Material | Motivo |
|---|---|
| Bellman-Ford, Floyd-Warshall | Cronograma: outubro, claramente P2/P3; nunca apareceu em prova antiga |
| Árvores, AGM (Prim/Kruskal) | Cronograma: a partir de 23/09; nunca apareceu em prova antiga |
| Fluxo máximo, emparelhamento, planaridade, coloração, conjuntos de vértices (independência/dominância/cobertura) | Cronograma: outubro–dezembro, P2/P3; nunca apareceu em prova antiga |
| Grafos hamiltonianos | Cronograma: 17/09; nunca apareceu em prova antiga do Prof. Silvio (só do Prof. Zenilton, fora de escopo) |
| Indução | Cronograma: 16/09, depois da P1; nunca apareceu em prova antiga |

Estes SIM ficam de fora do app — diferente da tabela UNCERTAIN acima, não há nenhum sinal de prova antiga puxando a favor deles.

Provas do Prof. Zenilton Kleber continuam fora de escopo (professor diferente do especificado pelo usuário).

## Materiais usados (atualizado)

Adiciona `Materiais/Cronograma/2026-2-schedule-tgc-cc-coreu-manha.pdf` (prioridade 3) à lista da Revisão 1. Reincorpora `Materiais/Slides/02-graphs-logic.pdf`, `03-graphs-set-theory.pdf`, `06-graphs-propositional-logic.pdf`, `07-graphs-predicate-logic.pdf` — antes listados como "ignorados", agora confirmados em escopo pelo cronograma.

## Materiais agora ignorados (atualizado)

Nenhum slide de grafos é ignorado. O conteúdo de algoritmos mais avançados (euleriano, Dijkstra, AGM, fluxo, planaridade, coloração) não tem slide dedicado no material fornecido — é ensinado só em aula, depois da P1 — e por isso não gera módulo nesta versão do app.
