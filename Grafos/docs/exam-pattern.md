# Auditoria — Prova 1 (P1) de Teoria dos Grafos e Computabilidade (TGC)

Fonte: `Materiais/Provas/Prova 1/` (16 arquivos: 8 PDFs oficiais/compilados + 8 jpegs).

## ATENÇÃO — duas fontes distintas, dois professores diferentes

Os arquivos cobrem **dois professores diferentes** da mesma disciplina (TGC, PUC Minas):

1. **Prof. Silvio Jamil F. Guimarães** — todos os arquivos `20XX-Y-exam.pdf`, `P1-TGC.pdf`, e o conteúdo compilado em `Provas 1 Grafos.pdf`. Formato consistente: cabeçalho institucional padrão, questões numeradas "QUESTÃO N (X%)", nota em % somando 100%, sem cronômetro/duração impressa na prova. **Esta é a fonte majoritária (8 provas) e a que deve orientar o formato do app**, pois é a mais numerosa e mais consistente.
2. **Prof. Zenilton Kleber Gonçalves do Patrocínio Júnior** — os 8 arquivos `.jpeg` (2 provas + 2 resoluções, cada uma em 2 partes/fotos). Formato diferente: "1ª AVALIAÇÃO - 20 pontos", questões numeradas "1)", "2)" (não "QUESTÃO"), problemas mais aplicados/narrativos (rodovias, food truck, serialização, detetive), pontuação em pontos (não %).

Se o app deve imitar apenas um formato, **recomendo seguir o Prof. Silvio Jamil**, dado o volume e a consistência. As provas do Prof. Zenilton são reportadas abaixo separadamente para referência, mas não devem ser misturadas ao padrão do app sem decisão explícita do usuário.

## Mapeamento de duplicatas / arquivos que correspondem entre si

- `2022-1-exam.pdf` = mesma prova reproduzida em `Provas 1 Grafos.pdf` (páginas 14–18, com resolução manuscrita de aluno anexada). **Duplicata.**
- `2022-2-exam.pdf` = mesma prova em `Provas 1 Grafos.pdf` (páginas 1–9, com resolução manuscrita). **Duplicata.**
- `2023-1-exam.pdf` = mesma prova em `Provas 1 Grafos.pdf` (páginas 9–13, com resolução manuscrita). **Duplicata.**
- `2023-2-exam.pdf` — não aparece duplicada em `Provas 1 Grafos.pdf`. Único.
- **2024/1 (Prova 1) do Prof. Silvio** — não existe como PDF solto na pasta; só aparece dentro de `Provas 1 Grafos.pdf` (páginas 19–23), prova de um aluno "Dalton de Oliveira Cardoso" (nota 50/100). Tratada abaixo como prova própria.
- `2024-2-exam.pdf`, `2025-1-exam.pdf`, `P1-TGC.pdf` (2026/1) — únicos, sem duplicata.
- `P1 - 1º 2024 - parte 1/2.jpeg` — prova do Prof. Zenilton (rodovias/AGM, caminhos mínimos, food truck, serialização). A resolução manuscrita correspondente está em **`Resolução 1 - P1 - 2º 2023 - parte 1/2.jpeg`** — ou seja, apesar do nome do arquivo dizer "2º 2023", o conteúdo da Resolução 1 resolve exatamente as questões de `P1 - 1º 2024`. **Os nomes dos arquivos de resolução estão trocados/inconsistentes com o rótulo de semestre; o pareamento correto é por conteúdo, não pelo nome do arquivo.**
- `P1 - 2º 2023 - parte 1/2.jpeg` — outra prova do Prof. Zenilton (vértices/componentes, matriz de incidência, fecho transitivo, base/antibase, DFS com classificação de arestas, Kosaraju, hamiltoniano, bipartido). A resolução correspondente é **`Resolução 2 - P1 - 2º 2023 - parte 1/2.jpeg`** (prova de aluna "Camila Hollerbach Pimenta Macedo", nota manuscrita não clara). Nota: os números do enunciado da prova impressa (13 vértices/6 componentes) não batem com os números usados na resolução da aluna (15 vértices/7 componentes) — provavelmente uma prova com variantes numéricas (versão A/B) ou uma reaplicação do mesmo template em outro semestre.

**Total de exames distintos analisados: 10** (8 do Prof. Silvio Jamil + 2 do Prof. Zenilton), cobrindo 8 semestres do Prof. Silvio (2022/1 até 2026/1) — amostra pequena mas razoavelmente completa para esse professor.

Nenhum arquivo foi ilegível; todos os PDFs e jpegs abriram corretamente.

---

## Provas do Prof. Silvio Jamil F. Guimarães (fonte principal)

### 2022/1 — 5 questões, 100%
1. **(10%)** Grafo não-dirigido simples, 10 vértices, 5 componentes. a) possível 4 arestas? b) soma de graus = 10? c) soma de graus > 100? — tipo: sim/não + justificativa, cálculo rápido. Fácil.
2. **(25%)** Grafo dado por matriz de adjacência 6×6 (A–F). a)(6%) fecho transitivo direto de A; b)(6%) fecho transitivo inverso de {B,F}; c)(13%) "como seria um algoritmo para identificar uma base em um grafo? Sua solução funciona para quais tipos de grafos?" — tipo: aplicação de matriz + projeto de algoritmo em prosa. Médio/difícil (a parte c pede desenho de algoritmo e análise de aplicabilidade).
3. **(30%)** "Transponha a definição de isomorfismo de grafos não-direcionados para grafos direcionados, discorrendo sobre todas as definições necessárias... Apresente um exemplo de dois grafos direcionados com mais de 5 vértices e 6 arestas. Justifique." — tipo: definição/prova + construção de exemplo + desenho de grafo. Difícil, maior peso da prova.
4. **(20%)** "Forneça um algoritmo (passo a passo) para calcular o diâmetro de um grafo não-direcionado. Apresente um exemplo que ilustre cada uma das etapas." — tipo: projeto de algoritmo + exemplo ilustrado. Médio/difícil.
5. **(20%)** Grafo dado por lista de adjacência de sucessores, 13 vértices (A–M). "Determine os componentes fortemente conexos do grafo G, justificando suas respostas." — tipo: aplicação de algoritmo (Kosaraju/DFS), exige desenho do grafo. Médio/difícil.

Duração/instruções: nenhuma nota especial impressa além do cabeçalho padrão.

### 2022/2 — 5 questões, 100%
1. **(10%)** 11 vértices, 6 componentes — a)(3%) 5 arestas possível? b)(3%) soma graus=12? c)(4%) soma graus>100? — mesma família da 2022/1-Q1.
2. **(30%)** Matriz de adjacência 6×6 (A–F). a)(4%) fecho transitivo direto A; b)(6%) fecho transitivo inverso {B,F}; c)(10%) algoritmo para identificar base; d)(10%) algoritmo para identificar anti-base. — combina a Q2 de 2022/1 com uma parte extra (anti-base).
3. **(20%)** Lista de sucessores, 13 vértices (A–M). a)(6%) ordem de visita em busca em profundidade a partir de A, prioridade alfabética; b)(14%) "o grafo é acíclico? Justifique mostrando um algoritmo para detectar ciclos." — tipo: simulação passo a passo de DFS + projeto de algoritmo.
4. **(20%)** Definição de complemento/auto-complementar. a)(6%) exemplo de grafo auto-complementar >3 vértices; b)(14%) prove que número de arestas de auto-complementar é divisível por 4. — prova formal.
5. **(20%)** a)(6%) mostre todos os subgrafos de um grafo completo de 3 vértices; b)(14%) quantos subgrafos existem em um grafo completo de n vértices? — enumeração + fórmula combinatória com prova.

### 2023/1 — 5 questões, 100%
1. **(20%)** G=(V,E), |V|=n, |E|=m. a)(4%) prove m≤n(n-1)/2; b)(4%) prove que se G é bipartido então m≤n²/4; c)(4%) G pode ser regular se n=15 e grau=3?; d)(4%) sequência de graus (1,1,3,3,3,3,5,6,8,9) pode representar um grafo?; e)(4%) grafo tripartido, maior número de arestas. — cinco sub-itens curtos, mistura prova formal com cálculo/justificativa.
2. **(20%)** 13 vértices, 6 componentes — mesma família de perguntas sim/não+justificativa (5 sub-itens). Nota impressa: **"respostas sem justificativas serão desconsideradas"** — instrução explícita.
3. **(20%)** Complemento/auto-complementar. a)(6%) dois exemplos auto-complementar >4 vértices; b)(14%) **prove que grafo auto-complementar tem 4k ou 4k+1 vértices, para k inteiro não negativo** — prova formal, alto peso.
4. **(15%)** a)(7%) matriz simétrica só 0/1, diagonal 0 — pode representar matriz de adjacência de grafo simples?; b)(8%) o que representa a soma das entradas de uma coluna da matriz de adjacência (grafo não-dirigido e dirigido)? — pergunta conceitual curta.
5. **(25%)** "Projete um algoritmo para encontrar o número de arestas entre v e todos os outros vértices do grafo G... Deixe claro todos os elementos e etapas de seu algoritmo." — projeto de algoritmo (BFS), maior peso.

### 2023/2 — 4 questões (única prova da amostra com só 4), 100%
1. **(20%)** G simples não-dirigido. i)(5%) maior/menor número de arestas possível (conjunto de arestas ainda não definido); ii)(5%) maior/menor número de componentes conexos possível; iii)(5%) três exemplos de grafos >4 vértices onde nº arestas de G = nº arestas do complemento; iv)(5%) para quais |V| é possível que G tenha o mesmo número de arestas do complemento? — quatro sub-perguntas curtas, conceituais/combinatórias.
2. **(30%)** Grafo dirigido — "projete uma solução para encontrar (i)(15%) uma base e (ii)(15%) uma anti-base... a cardinalidade de ambos os conjuntos deva ser a menor possível." — projeto de algoritmo, alto peso.
3. **(25%)** Grafo dado explicitamente por V={a,...,i}, E={...}. i)(10%) excentricidade de cada vértice; ii)(8%) raio e diâmetro; iii)(7%) defina o(s) centro(s). — aplicação direta sobre grafo pequeno dado.
4. **(25%)** Questão narrativa única: "detetive" investiga assassinato de bilionário numa mansão; planta baixa da casa vira grafo (cômodos = vértices, portas = arestas); pistas de governanta e piscineiro sobre entrar/sair; pede para descobrir quem mentiu com base em caminho euleriano (passar por todas as portas uma única vez). **Estilo aplicado/lúdico, único entre as provas do Silvio** — mostra que o professor ocasionalmente usa problema-história para embutir conceito de caminho/circuito euleriano.

Observação: só 4 questões nesta prova (as demais têm 5), e a Q4 é atipicamente narrativa/lúdica comparada ao resto do banco.

### 2024/1 (dentro de `Provas 1 Grafos.pdf`, pp. 19–23) — 4 questões, 100%
1. **(30%)** Grafo dirigido — "projete uma solução para encontrar (i)(15%) uma base e (ii)(15%) uma anti-base... cardinalidade menor possível." — idêntica à 2023/2-Q2.
2. **(20%)** Grafo não-dirigido completo com n vértices — determine o número de subgrafos de G, justifique. — variante da 2022/2-Q5b.
3. **(22%)** "G simples com pelo menos dois vértices. Prove que G conterá pelo menos dois vértices de mesmo grau." — prova por princípio da casa dos pombos; **reaparece quase idêntica em 2024/2-Q1 e em P1-TGC (2026/1)-Q1.1**.
4. **(28%)** Mesmo grafo V={a,...,i}, E={...} da 2023/2-Q3. i)(8%) excentricidade de cada vértice; ii)(5%) raio e diâmetro; iii)(5%) centro(s); iv)(10%) **projete um algoritmo para encontrar o diâmetro de um grafo simples não-direcionado.** — combina a pergunta de 2023/2-Q3 com o algoritmo extra da 2022/1-Q4.

### 2024/2 — 4 questões, 100%
1. **(20%)** G simples ≥2 vértices — prove que conterá pelo menos dois vértices de mesmo grau. — mesma prova de 2024/1-Q3.
2. **(20%)** Grafo não-dirigido completo com n vértices — determine número de subgrafos, justifique. — recorrente (mesma de 2024/1-Q2, 2022/2-Q5b).
3. **(30%)** Grafo simples dirigido — "projete, explicando todos os detalhes, (i) uma solução para determinar se o grafo possui algum ciclo; e (ii) caso haja algum ciclo, encontre os vértices que compõem este ciclo." — projeto de algoritmo (DFS com cores), alto peso.
4. **(30%)** Grafo acíclico dirigido — "projete uma solução, explicando todos os detalhes, como encontrar o número de arestas do maior caminho do grafo." — projeto de algoritmo (ordenação topológica / caminho mais longo em DAG), alto peso.

Duração/instruções: cabeçalho mostra "Total da Prova: 40/100%" preenchido a mão — evidência de correção real.

### 2025/1 — 5 questões, 100%
1. **(15%)** 13 vértices, 7 componentes — a)(4%) 6 arestas possível?; b)(5%) soma graus=12 possível grafo existir?; c)(6%) soma graus>100 possível? — família recorrente de perguntas de possibilidade/justificativa.
2. **(20%)** Complemento G, auto-complementar — "é correto afirmar que o número de arestas de um grafo auto-complementar é divisível por 4? Justifique sua resposta." — reformulação da prova de 2022/2-Q4b/2023/1-Q3b como pergunta verdadeiro/falso.
3. **(15%)** Grafo tripartido completo K(r,s,t). a)(7%) desenhe K(2,2,2) e K(2,3,3); b)(8%) quantos vértices e arestas K(r,s,t) possui (em função de r,s,t)? — desenho de grafo + fórmula geral.
4. **(15%)** G não-dirigido simples conexo — prove que há pelo menos dois vértices com mesmo grau. — mesma prova recorrente (casa dos pombos).
5. **(35%)** — **maior questão da prova.** Problema aplicado sobre serialização de estruturas de dados com referências entre si, pede para modelar com grafos: (i)(15%) método garantindo que cada estrutura seja serializada uma única vez e apareça antes das que ela referencia; (ii)(20%) caso o buffer seja extremamente limitado, identificar o tamanho mínimo de buffer necessário. "Todas as suas decisões/escolhas devem ser bem justificadas." — projeto de algoritmo sobre ordenação topológica, redigido como problema aplicado (raro nas provas do Silvio, mais parecido com o estilo do Prof. Zenilton — nota de possível banco de questões compartilhado entre os dois professores do departamento).

### 2026/1 (`P1-TGC.pdf`) — 4 questões, 100%
Instrução explícita no topo da Q1: **"Justifique todas as respostas. Simplesmente colocar fórmulas sem explicação ou usar teoremas sem explicações não serão considerados."** — a formulação mais explícita de exigência de justificativa em toda a amostra.

1. **(25%)** G simples não-dirigido ≥2 vértices. 1. prove que conterá pelo menos dois vértices de mesmo grau; 2. determine o número de subgrafos de G, caso G seja completo. — funde as duas perguntas recorrentes (pombos + subgrafos) em uma única questão de duas partes.
2. **(25%)** Define grafo euleriano/semi-euleriano (circuito euleriano / caminho euleriano). "Projete uma solução para encontrar um circuito euleriano em um Grafo Euleriano, caso exista. Todas as suas decisões/escolhas devem ser bem justificadas." — projeto de algoritmo sobre tópico não visto nas outras provas do Silvio da amostra (mas usado narrativamente na 2023/2-Q4).
3. **(25%)** Problema aplicado narrativo: construção de uma casa com tarefas interdependentes (fundação, paredes, telhado, trabalho interno, paisagismo); tarefas podem ser paralelas quando não há dependência; todas as tarefas levam uma semana. (i) crie um grafo representando o processo; (ii) projete uma solução baseada em grafos para encontrar o tempo mínimo, em semanas, que a casa ficará pronta. — problema de agendamento/caminho crítico (CPM/DAG), estilo aplicado como a 2023/2-Q4 e como as provas do Zenilton.
4. **(25%)** Grafo dirigido — "projete duas soluções distintas para definir se o grafo é acíclico ou se possui ciclos. Justifique todas as suas decisões, e explique suas soluções." — pede duas abordagens diferentes (exigência incomum: normalmente pede-se apenas uma solução).

---

## Provas do Prof. Zenilton Kleber Gonçalves do Patrocínio Júnior (referência, formato diferente)

### Prova A — "P1 - 1º 2024" (20 pontos)
1. Modelagem de rede de rodovias entre cidades como árvore geradora mínima (custo mínimo, sem interseção de rodovias, grafo conexo mas não completo); (a) descreva a modelagem e método; (b) aplique a 4 cidades com tabela de custos dada. (03+02 pts)
2. Matriz D de comprimentos de aresta direcionada (com valores **negativos**) 7×7 — determine os caminhos mínimos (tamanho e arestas) a partir do vértice 1 para todos os demais. (05 pts) — a resolução usa Bellman-Ford (não Dijkstra, por causa dos pesos negativos); comentário do corretor destaca isso.
3. Problema narrativo de "food truck" atribuindo pedidos de almoço a clientes minimizando vouchers de compensação — modelar como grafo bipartido e projetar algoritmo eficiente (fluxo máximo / matching). Pede descrição detalhada do algoritmo e **discussão de complexidade**.
4. Problema de serialização de estruturas/objetos com referências — modelar com grafos e descrever método que garanta serialização única e ordem correta (ordenação topológica). (05 pts)

Nota: exige explicitamente "descrição detalhada" e "discussão sobre a complexidade da abordagem" — grau de profundidade maior que o típico das provas do Silvio.

### Prova B — "P1 - 2º 2023" (20 pontos)
1. 13 (ou 15, conforme variante) vértices, N componentes — possibilidade de X arestas / soma de graus, com nota "respostas sem justificativas ou cujas justificativas não sejam adequadas serão desconsideradas". (04 pts)
2. Grafo dado por **matriz de incidência** 7×7 (a–g, valores -1/0/+1) — a) fecho transitivo direto e inverso de cada vértice; b) base e anti-base de G. (04 pts)
3. Dada tabela de atributos de uma busca em profundidade (tempo de descoberta, tempo de término, pai) — a) classifique cada aresta (árvore, retorno, avanço, cruzamento) usando a matriz de adjacência dada; b) determine se G é conexo/simplesmente/semifortemente/fortemente conexo, justificando; c) determine os componentes fortemente conexos usando **Kosaraju**, com nota "é obrigatório demonstrar o método passo a passo". (06 pts)
4. Dados os teoremas de Dirac, Ore e Bondy-Chvátal (enunciados na prova), forneça exemplos de grafos hamiltonianos que atendam a diferentes combinações desses teoremas (a–d). (02 pts)
5. "Forneça um algoritmo (passo a passo) para determinar se um grafo conexo é bipartido. Apresente um exemplo." (04 pts)

Padrão notável: as provas do Zenilton costumam **fornecer definições/teoremas dentro do enunciado** (ex: teoremas de Dirac/Ore/Bondy-Chvátal escritos na prova) antes de pedir aplicação — isso não ocorre nas provas do Silvio, que assumem que o aluno já sabe as definições.

---

## SÍNTESE

### Amostra
8 provas do Prof. Silvio Jamil F. Guimarães (2022/1, 2022/2, 2023/1, 2023/2, 2024/1, 2024/2, 2025/1, 2026/1) e 2 provas do Prof. Zenilton Kleber (referência, formato diferente). **Amostra pequena — generalizações abaixo qualificadas com "X de 8" quando aplicável.**

### Frequência de tópicos (só entre as 8 provas do Prof. Silvio)
- **Possibilidade/existência de grafo dado nº vértices e componentes** (soma de graus, nº mín/máx de arestas, regularidade) — aparece em **4 de 8** provas (2022/1, 2022/2, 2023/1, 2025/1), sempre como primeira questão, sempre valendo pouco (10–20%), sempre pedindo justificativa curta em cada sub-item.
- **Fecho transitivo direto/inverso + base/anti-base** (fechos, algoritmo de base/anti-base em grafo dirigido) — aparece em **4 de 8** (2022/1, 2022/2, 2023/2, 2024/1) — um dos tópicos mais recorrentes, quase sempre pedindo "como seria um algoritmo... funciona para quais tipos de grafo?".
- **Complemento de grafo / auto-complementar** (exemplo, prova de divisibilidade por 4, ou prova de 4k/4k+1 vértices) — aparece em **3 de 8** (2022/2, 2023/1, 2025/1).
- **Prova de que há dois vértices de mesmo grau** (pombos) — aparece em **3 de 8** (2024/1, 2024/2, 2026/1) — praticamente uma prova "clássica" fixa desse professor nos semestres mais recentes.
- **Número de subgrafos de um grafo completo** — aparece em **3 de 8** (2022/2, 2024/1, 2024/2) — fórmula/combinatória fixa.
- **Excentricidade / raio / diâmetro / centro** — aparece em **3 de 8** (2022/1 [algoritmo de diâmetro], 2023/2, 2024/1) — quase sempre sobre o mesmo grafo pequeno explícito V={a,...,i}.
- **Detecção/classificação de ciclos, DFS, componentes (fortemente) conexos** — aparece em **3 de 8** (2022/1, 2022/2, 2024/2).
- **Bipartição / grafos bipartidos e tripartidos (fórmulas de aresta máxima, K(r,s,t))** — aparece em **2 de 8** (2023/1, 2025/1).
- **Problema aplicado/narrativo único (detetive, serialização, agendamento de casa, euleriano)** — aparece em **3 de 8** (2023/2 detetive/euleriano, 2025/1 serialização, 2026/1 casa/CPM+euleriano) — parece ser uma tendência crescente nos semestres mais recentes (2023/2 em diante) de incluir ao menos uma questão aplicada/narrativa por prova, enquanto as provas de 2022 eram 100% abstratas/formais.

Não claim "sempre aparece" para nenhum tópico — nenhum tópico único apareceu nas 8 provas.

### Distribuição de tipos de questão (estimativa qualitativa sobre as 8 provas do Silvio, ~37 sub-questões nomeadas)
- **Prova formal / "prove que..."** — cerca de 20–25% das questões (ex.: prova de m≤n(n-1)/2, prova de 4k/4k+1, prova de pombos, prova de m≤n²/4).
- **Projeto de algoritmo em prosa/pseudocódigo** ("projete uma solução...", "forneça um algoritmo passo a passo...") — a categoria **mais comum**, cerca de 30–35% das questões — sempre pede para "explicar todos os detalhes"/"deixar claro elementos e etapas", às vezes exige exemplo ilustrativo.
- **Sim/Não + justificativa curta** (possibilidade de grafo com certas propriedades) — cerca de 20% das questões, concentradas nas primeiras questões de cada prova.
- **Aplicação direta sobre grafo/matriz dado** (fecho transitivo, excentricidade, classificação de arestas, subgrafos de um K3) — cerca de 15–20%.
- **Desenho de grafo / exemplo construído pelo aluno** — nunca é a questão inteira, mas aparece como parte pedida em ~6 das 8 provas (ex.: "apresente um exemplo", "desenhe K(2,2,2)").
- **Problema aplicado/narrativo (word problem)** — 3 questões inteiras em 8 provas (~10% das questões, mas 100% de peso quando aparece, geralmente 25–35% da nota da prova).
- **Múltipla escolha pura** — **nunca aparece**. Todas as questões são discursivas/abertas.
- **Preencher matriz** — não é pedido como resposta (matrizes só aparecem como dado do enunciado, nunca como algo a preencher).

### Estrutura típica de prova (Prof. Silvio)
- 4 a 5 questões por prova (a maioria com 5; 2023/2, 2024/1 e 2024/2 têm 4).
- Nota sempre em % somando exatamente 100%, com sub-itens percentuais explícitos (ex. "a) (4%)").
- Padrão recorrente de abertura: primeira questão costuma ser leve (10–20%) sobre possibilidade/existência de grafo com propriedades dadas, respondida com "Sim/Não + justificativa".
- Questão(ões) de maior peso (25–35%) tendem a ser projeto de algoritmo ("projete uma solução...") ou prova formal de peso mais alto — normalmente a penúltima ou última questão.
- Não há alternativas/múltipla escolha, não há espaço de "cole aqui a resposta"; é prova dissertativa com espaço para desenvolver.
- Nenhuma prova menciona duração, uso de calculadora, ou consulta — os únicos textos de instrução observados são "respostas sem justificativas serão desconsideradas" (2023/1) e a versão mais forte "Simplesmente colocar fórmulas sem explicação ou usar teoremas sem explicações não serão considerados" (2026/1).

### Formato/profundidade esperada de resposta (com base nas resoluções manuscritas anexadas em `Provas 1 Grafos.pdf` e nos jpegs de resolução)
- Para questões "prove que...": o aluno com boa nota escreve a prova em texto corrido (não só fórmula), citando a definição usada (ex.: "soma de graus = 2·|E|"), fazendo a manipulação algébrica linha a linha, e concluindo explicitamente ("logo, X é divisível por Y"). Provas que só colocam a fórmula final sem explicação recebem nota reduzida — visível no exemplo da 2022/2-Q5b, onde o aluno escreveu a fórmula errada primeiro, foi corrigido pelo professor (risco vermelho "X"), e reescreveu com a dedução completa (soma de C(m,i)·2^(i(i-1)/2)) para obter nota cheia.
- Para "projete um algoritmo": a resposta esperada é uma descrição em prosa estruturada em passos numerados (não necessariamente pseudocódigo formal, embora pseudocódigo também apareça, ex. resolução do BFS na 2023/1-Q5), explicando o que cada passo faz e por quê. Respostas que só citam o nome do algoritmo ("é so usar Kosaraju") sem descrever os passos são marcadas para correção pelo professor (ver anotação "e as arestas?" na Resolução 1 do Zenilton, cobrando mais detalhe).
- Perguntas de "Sim/Não" exigem exemplo concreto ou contra-exemplo desenhado à mão (múltiplos grafos pequenos desenhados como prova, ex.: 2022/2-Q1a).
- O professor Silvio Jamil corrige atribuindo nota parcial por sub-item (visível nos números em vermelho ao lado de cada alínea), então cada sub-item de 3–14% é avaliado independentemente — sugerindo que o app deveria também decompor questões complexas em sub-itens com peso próprio.

### Erros comuns / ênfase de correção visível nas fotos de resolução
- Confundir "número máximo de arestas para grafo regular" com "número máximo de arestas para grafo completo" (correção vermelha na 2022/2-Q1c, professor reescreve a fórmula certa n(n-1)/2 vs a errada usada pelo aluno).
- Esquecer de justificar por que uma solução "só funciona para grafos direcionados" (correção pede explicitamente esse tipo de qualificação metodológica, ex. Q2c/d de 2022/1 e 2022/2).
- Nas provas do Zenilton, o corretor cobra explicitamente complexidade assintótica ("Utilizando Ford Fulkerson, temos a complexidade de O(n²) ??" com interrogações vermelhas indicando que a complexidade dada estava errada ou não justificada) e cobra "e as arestas?" quando o aluno só lista distâncias sem reconstruir o caminho.
- Erro recorrente de esquecer casos-limite em perguntas de grau de sequência (ex.: 0 e n-1 não podem coexistir simultaneamente na mesma sequência de graus, ponto destacado na resolução de 2024/1-Q3).

### Padrões/"pegadinhas" recorrentes entre as provas
- Perguntas de possibilidade ("é possível que...?") quase sempre têm resposta que depende de calcular um valor extremo (mínimo ou máximo de arestas dado n vértices e k componentes: fórmulas `m_min = n - k` e `m_max = (n-k)(n-k+1)/2`) — é o "truque" estrutural mais repetido em toda a amostra do Silvio.
- A pergunta sobre "grafo auto-complementar" sempre cai em uma de duas variantes: (a) provar divisibilidade do número de arestas por 4, ou (b) provar que o número de vértices é 4k ou 4k+1 — nunca as duas juntas na mesma prova.
- O mesmo grafo pequeno explícito (V={a,b,c,d,e,f,g,h,i}, E dado) é reaproveitado entre 2023/2 e 2024/1 para perguntas de excentricidade/raio/diâmetro/centro — evidência de reaproveitamento de exemplos entre semestres.
- A prova de "dois vértices de mesmo grau" (pombos) e a fórmula de "número de subgrafos de grafo completo" formam um par que se repete quase verbatim de prova em prova (2022/2 → 2024/1 → 2024/2 → 2026/1), inclusive reaparecendo fundida em uma única questão de duas partes em 2026/1.

### Estilo de redação das questões (para imitar o "tom" do professor)
- Português formal, direto, sem rodeios; frases começam quase sempre com "Seja G = (V,E)...", "Considerando um grafo...", "Forneça um algoritmo...", "Projete uma solução...", "Prove que...", "Determine...".
- Uso consistente de negrito/itálico para destacar termos técnicos-chave (ex. *base*, *anti-base*, *auto-complementar*, **justifique**, **cardinalidade**).
- Muitas questões terminam com uma frase de exigência explícita de rigor: "Justifique.", "Deixe claro todos os elementos e etapas de seu algoritmo.", "Todas as suas decisões/escolhas devem ser bem justificadas.", "Explicando todos os detalhes."
- Uso de notação matemática formal padrão (G=(V,E), |V|=n, |E|=m, fórmulas em LaTeX-like) mesmo em questões que depois pedem resposta em prosa.
- Nas raras questões narrativas (2023/2-Q4, 2026/1-Q3), o tom muda para mais coloquial/lúdico ("O bilionário Count Mui Dinheiro acaba de ser assassinado...", "Caso você seja o engenheiro..."), mas a pergunta final sempre volta a ser formal-algorítmica.
