# Raw Material Notes — Teoria dos Grafos e Computabilidade (PUC Minas)

Fonte: Prof. Silvio Jamil F. Guimarães. Auditoria de todo material fornecido para escopo da P1. Um bloco por arquivo, em ordem de leitura/numeração.

---

## 00-graphs-general-information.pdf (13 slides)

Slide de apresentação da disciplina.

- Ementa dividida em duas partes:
  - **Computabilidade / Lógica computacional**: "Lógica, relações de equivalência, funções e conjuntos. Prova e demonstração de teoremas."
  - **Teoria dos Grafos**: "Estruturas de dados para grafos, caminhos, busca, árvores, conectividade, isomorfismo, planaridade, coloração, particionamento, modelagem de problemas e fluxo em redes."
- Avaliação: prova teórica de 2h; 3 provas (25 pts cada) ou 4 provas (20 pts cada) + trabalhos (25/20 pts).
- Contato: Silvio Guimarães, sjamil@pucminas.br, Sala 101/303 Prédio 20.
- **Nenhum cronograma/calendário explícito de P1 vs P2 está presente neste arquivo.** O escopo da P1 precisa ser inferido de outras fontes (ordem dos slides, resumo do aluno, provas antigas).

---

## 01-graphs-concepts.pdf (28 slides)

- **Motivação**: pontes de Königsberg (Euler, 1736), problema das 3 casas, coloração de mapas (mapa do Brasil), caminho mais curto.
- **Definição de grafo**: G = (V, E). Direcionado: E = {(u,v) | u,v ∈ V}. Não-direcionado: E = {{u,v} | u,v ∈ V}.
- **Terminologia**: laço (loop), arestas paralelas, grafo simples, vértices adjacentes, grau d(v)/grau de entrada d⁻(v)/grau de saída d⁺(v), sequência de graus, grafo regular, vértice isolado, vértice pendente, grafo nulo, grafo valorado/rotulado.
- Grafo completo Kn: fórmula de nº de arestas.
- **Walk / Trail / Path / Cycle** — definidos em inglês (mesmo em deck majoritariamente PT): passeio sem restrição de repetição, trilha (sem aresta repetida), caminho (sem vértice repetido), ciclo.
- Grafo conexo; grafo bipartido / bipartido completo Km,n.
- Teorema do aperto de mãos (handshake theorem): soma dos graus = 2|E|.
- Operações sobre grafos: união, soma, remoção de aresta/vértice, contração de aresta (G/e).

---

## 02-graphs-logic.pdf (20 slides)

Título: "Conceitos" — introdução à lógica, não é conteúdo de grafos.

- Matemática discreta vs contínua.
- Definição de Lógica; Aristóteles como "pai da lógica formal".
- Paradoxos clássicos: paradoxo do mentiroso, paradoxo do barbeiro.
- "O brinco da Princesa" — quebra-cabeça lógico estendido (citado do livro-texto de Mortari).
- Aplicações de lógica em Ciência da Computação.
- Tipos de verdade (legal, autoritária, científica, provável) e tipos de prova (filosófica, matemática).

---

## 03-graphs-set-theory.pdf (60 slides — maior arquivo do curso)

Título: "Teoria de Conjuntos e Funções". **Não é conteúdo de grafos** — matemática discreta pura, ligada à Parte 1 da ementa.

- Definição e notação de conjuntos, subconjuntos, conjunto das partes, diagramas de Venn.
- Operações e identidades de conjuntos, incluindo Leis de De Morgan.
- Cardinalidade, produto cartesiano.
- Funções: domínio/contradomínio/imagem; injetora/sobrejetora/bijetora; inversa; composição; funções piso/teto (floor/ceiling), com exemplo de prova.
- Sequências: aritméticas, geométricas, recursivas.
- Somatórios/produtórios (notação Σ/Π), variáveis livres e ligadas, substituição de variável.

---

## 04-graphs-data-structures.pdf (9 slides — arquivo curto)

- Matriz de incidência (A de dimensão n×m, convenção +1/-1/0 para grafos direcionados).
- Matriz de adjacência (A de dimensão n×n).
- Lista de adjacência — representação tipo array/CSR, com variantes de sucessores e predecessores.
- Exercício resolvido de reconstrução: matriz → grafo → matriz de incidência.

---

## 05-graphs-isomorphism-and-concepts.pdf (16 slides)

- Definição de isomorfismo; condições necessárias mas não suficientes; afirmação de que "não há algoritmo eficiente" (conhecido) para testar isomorfismo em geral.
- Múltiplos exemplos resolvidos de verificação de isomorfismo.
- Grafo complementar C(G) / Ḡ.
- Subgrafo / subgrafo induzido; propriedades de subgrafos; subgrafos aresta-disjuntos / vértice-disjuntos.
- Caminhos/circuitos: sequência de arestas, caminho aberto/fechado.
- Cadeias (chain) — caminho no grafo subjacente não-direcionado de um grafo direcionado.
- Teorema: todo grafo tem exatamente 0 ou um número par ≥2 de vértices de grau ímpar (na prática: nº de vértices de grau ímpar é sempre par).
- Teorema sobre número máximo/mínimo de arestas dado n vértices e k componentes.

---

## 06-graphs-propositional-logic.pdf (38 slides)

**Não é conteúdo de grafos** — lógica proposicional pura.

- Distinção entre proposições e sentenças/afirmações; variáveis proposicionais.
- Todos os conectivos lógicos (¬ ∧ ∨ ⊕ → ↔) com tabelas-verdade.
- Recíproca (converso), inversa, contrapositiva.
- Ordem de precedência dos operadores.
- Tautologia, contradição, contingência.
- Tabela de equivalências lógicas: idempotência, dupla negação, comutatividade, associatividade, distributividade, De Morgan.
- Aplicações e exemplos de tradução linguagem natural → lógica proposicional.

---

## 07-graphs-predicate-logic.pdf (39 slides — arquivo mais recente, datado 02/09)

**Não é conteúdo de grafos** — lógica de predicados. Tratamento completo e extenso (39 slides), não é apenas introdução.

- Predicados P(x), Q(x,y), R(x,y,z).
- Quantificador universal ∀x, com exemplos e contraexemplos.
- Quantificador existencial ∃x.
- Variáveis livres vs ligadas; escopo do quantificador.
- Negação de quantificadores (equivalências tipo De Morgan): ¬∀xP(x) ≡ ∃x¬P(x); ¬∃xP(x) ≡ ∀x¬P(x).
- Extensos exemplos de tradução linguagem natural → lógica, incluindo a distinção pedagógica importante entre usar ∧ vs → ao combinar predicados de restrição de domínio com quantificadores.

**Observação para escopo de P1**: este arquivo é o mais novo (data do próprio dia da tarefa) e é um tratamento substancial e completo, não um stub. Ver `p1-scope-candidate.md` para a discussão de inclusão/exclusão.

---

## Materiais/Outros/Resumo Prova 1 Grafos.pdf (6 páginas, autor: aluna Sophia Carrazza — "Resumo Grafos (prova 1)")

**Sinal direto mais forte de escopo de P1** — resumo de estudo feito por aluna, explicitamente rotulado "prova 1". Cobre, em formato compacto:

- Definição de grafo; grafo regular (com regra: se o grafo tem componentes, a quantidade de vértices deve ser divisível pela quantidade de componentes).
- Grafo conexo — nº mínimo de arestas = n−1.
- Grafo completo: |V|=n, |E|=n(n−1)/2.
- Grafo ciclo: |E|=n (permite repetir vértices/arestas ao passear, mas ciclo em si não repete aresta).
- Grafo passeio (walk), grafo caminho (path — sem arco repetido, sem vértice/aresta repetida), grafo trail (nenhuma aresta repetida).
- Grafo roda: |V|=n+1, |E|=n+n (=2n).
- Grafo bipartido: quantidade de vértices dividida igualmente; fórmula de nº máximo de arestas = (n/2)·(n/2) = n²/4.
- Grafo complementar; grafo transposto (inverte sentido das arestas).
- **BFS (busca em largura)** — pseudocódigo em português: inicializa distâncias em −1, distância de v para si mesmo = 0, fila = {v}, laço "enquanto fila não vazia": remove início da fila, para cada vizinho não visitado adiciona ao fim da fila e atualiza distância.
- **DFS (busca em profundidade)** — usa pilha; pseudocódigo `dfs(v, grafo, visitados)`: adiciona v aos visitados, para cada vizinho não visitado chama `dfs` recursivamente; usado para achar o **fecho transitivo direto**: `fecho-transitivo(v, grafo) { visitado = nova lista; dfs(v, grafo, visitado); return visitado }`.
- Para achar o **fecho transitivo inverso**: obter o grafo transposto e fazer DFS nele.
- Excentricidade (maior das menores distâncias de v para os demais vértices); raio (menor excentricidade do grafo); diâmetro (maior excentricidade); centro (conjunto de vértices com menor excentricidade).
- Classificação de arestas em árvore de busca: árvore (vai para vértice ainda não visitado), retorno (aponta para ancestral), avanço (vai para descendente pulando níveis), cruzamento (aponta para descendente já visitado por outro ramo).
- Fórmula do número de subgrafos de um grafo completo: Σ (i=1 a n) 2^(i(i−1)/2) · C(n,i).
- Fórmulas: nº máximo de arestas de grafo regular = n(n−1)/2; nº máximo de arestas com k componentes = (n−k)(n−k−1)/2; nº mínimo de arestas com k componentes = n−k; soma dos graus = 2|E|.
- Prova (paráfrase): por que o número de vértices de grau ímpar deve ser par — decorre de 2|E| = Σd(v) ser par, logo a soma dos graus ímpares também deve ser par, o que só ocorre se a quantidade de vértices de grau ímpar for par.
- Prova (paráfrase): por que um grafo simples com n vértices deve ter pelo menos dois vértices de mesmo grau — grau varia de 0 a n−1, mas grau 0 e grau n−1 não podem coexistir no mesmo grafo; logo há mais vértices do que valores de grau possíveis, forçando repetição (princípio da casa dos pombos).
- **SCC — Algoritmo de Kosaraju** (com fonte citada: Sedgewick & Wayne, Algorithms ed.4, p.584): (1) DFS em G registrando tempos de início/fim; ao final os vértices ficam empilhados em ordem decrescente de tempo de término; (2) DFS no grafo transposto, desempilhando na ordem definida no passo 1; (3) cada conjunto de vértices visitados numa mesma chamada em T forma um componente fortemente conexo (SCC) de G. Exemplo passo-a-passo resolvido com grafo A→B→C, D↔E.

---

## Materiais/Outros/Lista-de-exercicios-1.pdf (12 páginas, 20 exercícios formais + resoluções manuscritas)

Documento oficial "Exercício 1" da PUC Minas (cabeçalho institucional), com resoluções anotadas à mão pelo aluno.

- **Exercício 1**: lema do aperto de mãos — provar que nº de vértices de grau ímpar é par; problema de apertos de mão (K10, fórmula C(n,2)); grafo com sequência de graus dada é conexo?; grupo de amigos como grafo regular.
- **Exercício 2**: listar todos os grafos com {a,b,c}; contar vértices/arestas de Nn, Cn, Kn, Km,n; provar que todo grafo simples com ≥2 vértices tem 2 vértices de mesmo grau; grafos de strings binárias (hipercubo, comprimento 3 e 4).
- **Exercício 3**: existência de grafos com sequência de graus dada; grafos regulares; desenhar todos os grafos não-rotulados simples com 4 vértices.
- **Exercício 4**: grafo G=(V,E) concreto — direcionado vs não-direcionado, arestas adjacentes/paralelas, vértices incidentes, vértice isolado, existência de ciclo.
- **Exercício 5**: máximo/mínimo de arestas e de componentes conexos sem conjunto de arestas definido; grafos com |E(G)|=|E(Ḡ)|; fórmula |E| = n(n−1)/4 para essa igualdade ser possível (exige n(n−1) divisível por 4).
- **Exercício 6**: união e soma de grafos; provar que união de grafos é associativa e comutativa.
- **Exercício 7**: remoção de aresta, remoção de vértice, contração de vértices (a e c contraídos), inserção de vértice.
- **Exercício 8** — modelagem de problemas em grafos: menor caminho entre prédios da PUC (Dijkstra/Bellman-Ford mencionados na resolução), menor nº de períodos para cursar disciplinas, agrupar alunos por inicial do nome (grafo/combinatória).
- **Exercício 9**: grafo de interseção de conjuntos (vértice por conjunto, aresta se interseção não-vazia) — dois exemplos numéricos resolvidos, com diagrama.
- **Exercício 10**: determinar se grafos dados são bipartidos (4 casos concretos com V e E explícitos).
- **Exercício 11**: grafos especiais — para quais n são regulares Kn, Cn, Qn (grafo cubo/hipercubo — definição formal dada), Wn (grafo roda); grafo complementar de Kn, Km,n, Cn, Qn; grafo tripartido completo Kr,s,t (definição, contagem de vértices/arestas, complemento).
- **Exercício 12**: problema narrativo de "detetive" — modelagem via caminho euleriano/existência de trilha que passa por toda porta uma única vez (referência externa: inf.ufsc.br/grafos/problemas/assassin.htm).
- **Exercício 13**: desenhar grafos a partir de matrizes de adjacência dadas (3 matrizes concretas, incluindo pesos/multiplicidade); matrizes de adjacência de Nn, Cn, Kn, Km,n.
- **Exercício 14**: propriedades da matriz de adjacência A de grafo simples — diagonal de A, de A², de A³; matriz simétrica 0/1 com diagonal zero representa grafo simples?; soma de coluna = grau (não-direcionado) vs grau de entrada (direcionado).
- **Exercício 15**: problema narrativo "Tertuliano/Josefina" — existência de caminho euleriano numa rede de estradas dada por matriz de adjacência 10×10 (referência externa: inf.ufsc.br/grafos/problemas/paviment.htm).
- **Exercício 16**: grafo em grade p-por-q (produto cartesiano de índices) — contagem de arestas, desenho da grade 3×4, matriz de adjacência.
- **Exercício 17**: grafo de palavras (vértices = palavras, aresta se diferem em uma posição) — desenho, matriz de adjacência.
- **Exercício 18**: grafo sobre P×P (pares de {a,b,c,d,e}), adjacência por interseção vazia — definição, figura, matrizes de adjacência/incidência, contagem.
- **Exercício 19**: grafo de intervalos (adjacência = sobreposição) — definição, figura com intervalos concretos, matrizes, contagem.
- **Exercício 20**: grafo de linha (line graph) de K4 — figura, matriz de adjacência, contagem de vértices/arestas do grafo de linha.

---

## Materiais/Outros/Flash Cards Grafos-1.pdf (9 slides) — na verdade é "Aulão TGC: Primeira Prova" (12/09/2024), por monitor Fernando C. S. Dal'Maria

**Apesar do nome do arquivo, este NÃO é um baralho de flashcards — é uma apresentação de revisão de monitoria explicitamente intitulada "Primeira Prova".** Forte sinal de escopo de P1. Traz pseudocódigo/algoritmos com fontes bibliográficas citadas (não vistos nos slides 00-07 lidos):

- **Busca em Profundidade (DFS)** — fonte: Kleinberg & Tardos, *Algorithm Design*, ed.1, p.83, 2006. G=(V,E) conexo; conjunto S iniciado com s; enquanto S≠V: segue para vizinho não visitado até esgotar, depois retrocede (backtracking) até último vértice com vizinhos não visitados.
- **Busca em Largura (BFS)** — fonte: Kleinberg & Tardos, p.79. Conjunto S e fila Q iniciados com s; enquanto S≠V: desenfileira v; para cada vizinho u não em S, adiciona a S e enfileira em Q.
- **Caminhamento Euleriano** — fonte: West, *Introduction to Graph Theory*, ed.2, p.26, 2001. G não-direcionado conexo; condição de ciclo euleriano = todos os graus pares; condição de caminho euleriano = exatamente 2 vértices de grau ímpar. Algoritmo: (1) DFS partindo de vértice de grau ímpar quando possível; (2) priorizar arestas que não desconectam o grafo; (3) parar ao voltar ao vértice inicial ou não conseguir progredir.
- **Menor Caminho** (Dijkstra, não nomeado explicitamente mas é o algoritmo) — fonte: Kleinberg & Tardos, p.137. G não-direcionado, conexo, ponderado; vetor de distância D (0 para s, ∞ para os demais); fila de prioridade Q; enquanto S≠V: seleciona w∈Q com menor D[w], remove de Q; para vizinhos u de w não em S, relaxa D[u] se D[u] > D[w] + peso({u,w}).
- **Conceitos sobre Base** (fonte: "Jamil, Silvio" — atribuído ao próprio professor titular): Base de grafo dirigido G=(V,E) = subconjunto B⊆V tal que não há caminho entre vértices de B, e todo vértice fora de B é atingível a partir de algum vértice de B. Anti-base = definição simétrica com caminhos revertidos (A é atingido, não atinge).
- **Identificação de Base** (fonte: "Jamil, Silvio"): calcular grau de entrada de todos os vértices; vértices com grau de entrada zero não são alcançados por ninguém e formam candidatos a base. Se o grafo é cíclico: contrair vértices do ciclo em um hipervértice; quando esse hipervértice tem grau de entrada zero, um vértice do ciclo original é selecionado para a base. Para anti-base: obter grafo transposto e aplicar o mesmo algoritmo.
- **SCC — Kosaraju** (fonte: Sedgewick & Wayne, *Algorithms*, ed.4, p.584, 2011) — mesmo algoritmo descrito no Resumo Prova 1: DFS com tempos de início/fim → DFS no transposto na ordem decrescente de término → cada conjunto de vértices visitados = 1 SCC. Mesmo exemplo A→B→C, D↔E resolvido passo a passo.

---

## Materiais/FotosDoQuadro/WhatsApp Image 2026-09-01 at 09.21.58.jpeg e 10.20.54.jpeg (2 fotos, mesma aula, momentos diferentes)

Fotos de quadro branco em sala de aula (mesmo enunciado, dois momentos de resolução progressiva). Exercício ao vivo com 3 partes:

- **(a)** "Encontre os componentes fortemente conexos" — grafo dirigido concreto desenhado (vértices a-h), resolvido com SCCs circulados.
- **(b)** "Seja G=(V,E) um grafo direcionado. Apresente pelo menos duas estratégias diferentes para determinar se G é cíclico." — resolvido no quadro com: (i) grafo desenhado com vértices numerados 0/1/2 nos vértices (estados de DFS: 0=não visitado; observado no rótulo escrito depois: "0-não começou, 1-começou mas não terminou, 2-terminou" — coloração branco/cinza/preto clássica de detecção de ciclo via DFS); (ii) conceito de **BASE**: fórmulas Γ⁺(B) = V e Γ⁺(B) = ∪_{u∈B} Γ⁺(u); condição "se |BASE|=1 então..." (raiz única); exemplo de grafo com laços múltiplos, indicando raiz/base do grafo.
- **(c)** "Seja G=(V,E) um grafo direcionado acíclico. Apresente pelo menos duas estratégias para encontrar o maior caminho de G." — apenas o enunciado é visto nas fotos, sem resolução capturada.

Na segunda foto (quadro mais completo), aparece explicitamente o pseudocódigo de detecção de ciclo por DFS com 3 estados:
```
VISIT(G)
  for u ∈ V, VISITADO[u] = 0
  for u ∈ V, VISITAR(G,u);

VISITAR_REC(G, v)
  VISITADO[v] = 1
  for u ∈ N(v)
    if VISITADO[u] == 1: // achou vértice "em progresso" -> HÁ CICLO
    if VISITADO[u] == 0: VISITAR_REC(G,u);
  VISITADO[v] = 2
```
(nomes de variáveis em português: VISITADO, VISITAR_REC, "MA_CICLO" = "má cíclico"/detectou ciclo). Também aparece notação de alcançabilidade: "u ∈ Γ⁺(v)" e "∃ caminho(u,v) ∩ |caminho(u,v)| ≥ 2" (relacionado à definição de base/ciclo).

---

## Materiais/FotosDoQuadro/WhatsApp Unknown 2026-09-02 at 16.41.56.zip

**Extração bem-sucedida** (via `unzip`) — continha 4 imagens JPEG adicionais de quadro branco, datadas 19/08/2026 (aula anterior às fotos de 09/01 e 09/02):

- `WhatsApp Image 2026-08-19 at 12.01.27.jpeg`: três diagramas pequenos ilustrando classificação de arestas em DFS — "avanço" (a→b→c com aresta de avanço a→c), "retorno" (a→b→c com aresta de retorno c→a, rotulado "RETORNO"), "cruz" (rotulado "CRUZ" — aresta de cruzamento). Números 0/1/2 anotados nos vértices (mesma convenção de estado DFS branco/cinza/preto vista nas fotos anteriores).
- `WhatsApp Image 2026-08-19 at 12.01.28.jpeg`: quadro completo da aula — enunciado "Seja G=(V,E) um grafo direcionado. Projeto uma solução para dizer se há ciclo em G." com legenda de estados "0-não começou, 1-começou mas não terminou, 2-terminou"; grafo de exemplo a→b→c anotado com números de estado; pseudocódigo formal:
```
VISIT(G)
  for u∈V, visitado[u]=0
  for u∈V, VISITAR(G,u);
VISITAR_REC(G,v)
  visitado[v]=1
  for u ∈ N(v)
    if visitado[u]==1: MA_CICLO (detecta ciclo)
    if visitado[u]==0: VISITAR_REC(G,u);
  visitado[v]=2
```
  e, à direita, notação de alcançabilidade "u ∈ Γ⁺(v)" com diagrama de conjunto.
- `WhatsApp Image 2026-08-19 at 12.01.28 (1).jpeg`: zoom no mesmo enunciado com quadro mais legível (mesmo conteúdo do arquivo anterior, ângulo diferente).
- `WhatsApp Image 2026-08-19 at 12.01.28 (2).jpeg`: zoom no pseudocódigo VISIT/VISITAR_REC (mesmo conteúdo, mais legível/próximo).

Estas 4 fotos são material adicional da mesma sequência pedagógica das fotos de quadro já descritas acima (mesma aula ao vivo sobre ciclo/DFS/base, capturada em datas próximas). Não introduzem tópicos novos além dos já registrados, mas reforçam que **detecção de ciclo via DFS com 3 estados, classificação de arestas (árvore/retorno/avanço/cruzamento), e conceito de base/alcançabilidade Γ⁺** foram efetivamente ensinados ao vivo em sala, com pseudocódigo formal em português.

---

## Resumo de arquivos não-cobertos pelos slides 00-07

Os seguintes tópicos aparecem no Resumo Prova 1, no material de monitoria ("Flash Cards"), e nas fotos de quadro, mas **não têm slide dedicado entre os arquivos 00-07 auditados**:
- BFS / DFS (pseudocódigo formal)
- Fecho transitivo direto/inverso
- Excentricidade, raio, diâmetro, centro de um grafo
- Classificação de arestas em busca (árvore, retorno, avanço, cruzamento)
- Caminho/ciclo euleriano (condições e algoritmo)
- Menor caminho / Dijkstra
- Base e anti-base de grafo dirigido, com notação Γ⁺
- Detecção de ciclo em grafo dirigido via DFS de 3 estados
- SCC — algoritmo de Kosaraju

Isso sugere que esses tópicos foram ensinados em aula (quadro/monitoria) sem slide formal correspondente nos arquivos 00-07, mas são fortemente atestados como conteúdo de P1 pelas 3 fontes independentes (resumo de aluna, aulão de monitoria, fotos de quadro de aula ao vivo).
