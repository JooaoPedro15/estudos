# Concept Conflicts — Definições do professor vs. bibliografia

Comparação feita apenas para os tópicos confirmados em `docs/p1-scope.md` (IN_SCOPE_P1). Fontes: Cormen (*Algoritmos: Teoria e Prática*), Kleinberg & Tardos (*Algorithm Design*), Sedgewick (*Algorithms in C, Part 5*), West (*Introduction to Graph Theory*). Só entram aqui divergências REAIS — a maioria dos conceitos é padrão e equivalente entre autores.

---

### Definição de grafo, grau, sequência de graus, teorema do aperto de mãos

**Definição usada pelo professor** (fonte: `01-graphs-concepts.pdf`)
G=(V,E); grau d(v), grau de entrada d⁻(v)/saída d⁺(v); soma dos graus = 2|E|.

**Outros autores**
- Cormen: mesma definição (Apêndice B.4); lema do "cumprimento de mãos" como exercício.
- Kleinberg & Tardos: grau denotado `n_v` (não d(v)), mesma fórmula Σnᵥ=2m.
- Sedgewick: grau = arestas incidentes; não nomeia "teorema do aperto de mãos" explicitamente, mas usa a identidade.
- West: notação idêntica à do professor (d(v), Δ/δ), "Handshaking Lemma"/"First Theorem of Graph Theory", inclui sequência de graus e "graphic sequence" formalmente.

**Diferença real?** NÃO
Equivalentes para este contexto — apenas notação distinta (nᵥ vs d(v)).

---

### Matriz de adjacência, matriz de incidência, lista de adjacência

**Definição usada pelo professor** (fonte: `04-graphs-data-structures.pdf`)
Matriz de incidência com convenção +1 (origem) / −1 (destino) / 0; matriz de adjacência padrão; lista de sucessores/predecessores.

**Outros autores**
- Cormen: matriz de adjacência e lista de adjacência com tratamento completo; matriz de incidência aparece só como exercício (22.1-7), sem a convenção +1/−1 detalhada.
- Kleinberg & Tardos: matriz e lista de adjacência; matriz de incidência não encontrada.
- Sedgewick: matriz e lista de adjacência detalhadas; matriz de incidência não encontrada.
- West: matriz de adjacência padrão; matriz de incidência para digrafos com a **mesma convenção +1 (cauda)/−1 (cabeça)** usada pelo professor.

**Diferença real?** NÃO
A convenção do professor bate exatamente com West. Cormen/K&T/Sedgewick simplesmente dão menos ênfase à matriz de incidência — não há conflito, só diferença de cobertura.

---

### Isomorfismo de grafos

**Definição usada pelo professor** (fonte: `05-graphs-isomorphism-and-concepts.pdf`)
Bijeção entre vértices que preserva adjacência; condições necessárias (|V|, |E|, sequência de graus) mas não suficientes; "não há algoritmo eficiente conhecido" para o caso geral.

**Outros autores**
- Cormen: mesma definição (Apêndice B.4); sem algoritmo de teste (consistente com a observação do professor).
- Kleinberg & Tardos: não encontrado.
- Sedgewick: mesma definição; chama explicitamente de "problema computacional difícil" (V! rotulações possíveis).
- West: mesma definição, condições necessárias discutidas via exemplos.

**Diferença real?** NÃO
Todos equivalentes — inclusive na observação de dificuldade computacional.

---

### Complemento / grafo auto-complementar

**Definição usada pelo professor** (fonte: `05-...pdf`)
Ḡ (ou C(G)): mesmos vértices, arestas complementares. Auto-complementar: G≅Ḡ.

**Outros autores**
- Cormen: não encontrado.
- Kleinberg & Tardos: não encontrado.
- Sedgewick: define complemento (p.11), não nomeia "auto-complementar".
- West: define complemento (notação Ḡ, igual ao professor) e auto-complementar explicitamente (Def 1.1.32).

**Diferença real?** NÃO
West usa a mesma notação Ḡ do professor. Cormen/K&T simplesmente não cobrem o tópico.

---

### Subgrafo / subgrafo induzido

**Definição usada pelo professor** (fonte: `05-...pdf`)
Subgrafo: V'⊆V, E'⊆E. Subgrafo induzido: E' = todas as arestas de E entre vértices de V'.

**Outros autores**
- Cormen: definição idêntica (Apêndice B.4).
- Sedgewick: definição idêntica.
- West: definição idêntica e mais rigorosa (G[T] = G − T̄), com exemplo clássico distinguindo subgrafo de subgrafo induzido.

**Diferença real?** NÃO — conceito padrão, sem divergência.

---

### BFS (busca em largura)

**Definição usada pelo professor** (fonte: Resumo, Aulão — cita Kleinberg & Tardos p.79)
Fila; distância(v)=−1 inicial; distância(s)=0; para cada vizinho não visitado, enfileira e atualiza distância.

**Outros autores**
- Cormen: coloração branco/cinza/preto + fila, mesma ideia, com prova formal de camadas.
- Kleinberg & Tardos: variante por "camadas" L0,L1,... (mesma fonte citada pelo próprio material de apoio) — equivalente, só reorganiza a fila em níveis explícitos.
- Sedgewick: implementação atípica com **fila de arestas** (não de vértices) — mesmo resultado, bookkeeping diferente.
- West: BFS citado informalmente, sem pseudocódigo.

**Diferença real?** NÃO (algoritmo), mas vale nota de implementação
O resultado e a lógica são idênticos entre todas as fontes — só a estrutura de dados interna (fila de vértices vs. camadas vs. fila de arestas) muda. Para a prova, siga a versão do professor (fila de vértices, distância explícita).

---

### DFS (busca em profundidade) e classificação de arestas

**Definição usada pelo professor** (fonte: fotos de quadro — fonte primária)
Estados numéricos **0 (não começou) / 1 (começou, não terminou) / 2 (terminou)**, escritos explicitamente no quadro. Classificação de arestas: árvore, retorno, avanço, cruzamento.

**Outros autores**
- Cormen: coloração **branco/cinza/preto** + timestamps de descoberta/término; classificação de arestas idêntica (branco→árvore, cinza→retorno, preto→avanço ou cruzamento).
- Kleinberg & Tardos: versão simplificada, só marca "Explorado" (booleano) — **não distingue "em progresso" de "terminado"**, então não sustenta detecção de ciclo/classificação de arestas da mesma forma.
- Sedgewick: usa timestamps `pre`/`post` (sem cor nem estado discreto) — vértice "em progresso" = `pre` setado e `post` ainda não.
- West: DFS não tratado formalmente.

**Diferença real?** SIM (notação, não conceito)
O professor usa 3 estados numéricos (0/1/2) no lugar das 3 cores de Cormen (branco/cinza/preto) — mesma estrutura lógica, convenção de escrita diferente. Sedgewick chega ao mesmo resultado com números de tempo em vez de estados discretos. A versão de Kleinberg & Tardos citada no aulão para o algoritmo básico de busca **não é suficiente sozinha** para classificação de arestas/detecção de ciclo — o professor complementa com sua própria convenção de estados no quadro.

⭐ **PARA A PROVA, USE A NOTAÇÃO 0/1/2 DO PROFESSOR** — é a que aparece nas fotos de quadro (fonte primária) e é o que ele espera ver na resposta.

---

### Detecção de ciclo via DFS

**Definição usada pelo professor** (fonte: quadro)
Aresta para vértice em estado 1 (ainda em progresso) ⇒ HÁ CICLO ("MA_CICLO").

**Outros autores**
- Cormen: Lema 22.11 — grafo dirigido é acíclico ⟺ DFS não produz aresta de retorno (vizinho cinza). Mesmíssima lógica.
- Sedgewick: mesma lógica via `pre` setado / `post` não setado.
- Kleinberg & Tardos: argumento indireto (prova de ordenação topológica), não uma regra de "aresta de retorno" explícita.

**Diferença real?** NÃO (mesmo raciocínio, ver nota de notação acima em DFS).

---

### Fecho transitivo direto/inverso (alcançabilidade Γ⁺)

**Definição usada pelo professor** (fonte: Resumo Prova 1)
Fecho transitivo direto de v = Γ⁺(v), vértices alcançáveis a partir de v (via DFS/BFS a partir de v). Fecho transitivo inverso = Γ⁺(v) no grafo transposto.

**Outros autores**
- Cormen: trata "fecho transitivo" como conceito único (não separa direto/inverso), com dois métodos O(n³) — Floyd-Warshall adaptado, ou `TRANSITIVE-CLOSURE` por multiplicação booleana — calculando o fecho **completo** (todos os pares), não por vértice único.
- Sedgewick: mesma ideia de Cormen, algoritmo de Warshall detalhado, O(V³), fecho completo.
- Kleinberg & Tardos: só alcançabilidade informal via BFS/DFS a partir de uma fonte, sem tratamento de "fecho transitivo" como estrutura própria.
- West: relação de conexão (equivalência) só para grafos não-dirigidos — não se aplica à distinção direto/inverso de digrafos.

**Diferença real?** SIM
O professor pede o fecho a partir de **um vértice específico** (O(V+E) via DFS/BFS, direto e inverso via transposição), enquanto Cormen/Sedgewick descrevem o fecho transitivo **completo** (todos os pares, O(V³), Warshall/Floyd-Warshall) — abordagens diferentes para problemas diferentes (consulta pontual vs. matriz completa).

⭐ **PARA A PROVA, USE O MÉTODO DO PROFESSOR** — DFS/BFS a partir do vértice pedido (direto) ou do transposto (inverso). Não é necessário (nem esperado) construir a matriz de Warshall inteira quando a questão pede o fecho de um vértice só.

---

### Base e anti-base de grafo dirigido

**Definição usada pelo professor** (fonte: Aulão — "Fonte: Jamil, Silvio")
Base B⊆V: não há caminho entre vértices de B, e todo vértice fora de B é alcançado a partir de algum vértice de B (Γ⁺(B)=V). Calculada via grau de entrada zero + contração de ciclos (SCCs).

**Outros autores**
- Cormen: não usa o termo "base"/"antibase", mas define o **grafo de componentes G^SCC** (condensação em DAG) — estruturalmente, a "base" do professor corresponde exatamente às SCCs-fonte (grau de entrada 0) dessa condensação, e a "anti-base" às SCCs-sumidouro.
- Sedgewick: mesma equivalência via "kernel DAG" (condensação), sem nomear fonte/sumidouro especialmente.
- Kleinberg & Tardos: não encontrado; só o fato de "todo DAG tem um nó sem arestas de entrada".
- West: define **kernel** (Def 1.4.15) — mas **cuidado**: kernel é um conceito DIFERENTE. Kernel exige que S seja um conjunto independente (sem arestas entre seus vértices) e que todo vértice fora de S tenha um sucessor DIRETO em S. A base do professor não exige independência nem adjacência direta — só alcançabilidade (Γ⁺). Não são a mesma coisa, apesar do nome parecido.

**Diferença real?** SIM
"Base"/"anti-base" é terminologia própria do professor, sem nome padronizado idêntico na bibliografia. A estrutura matemática mais próxima é a condensação em SCCs (Cormen/Sedgewick) — que é exatamente como este app calcula base/anti-base internamente. **Atenção especial**: o "kernel" de West NÃO é sinônimo de base — é um conceito diferente (independência + dominância direta), não use um pelo outro.

⭐ **PARA A PROVA, USE A NOTAÇÃO Γ⁺ E O MÉTODO DO PROFESSOR** (grau de entrada + contração de ciclo) — não há equivalente padronizado direto nos livros para citar como fonte alternativa.

---

### Componentes fortemente conexos — Algoritmo de Kosaraju

**Definição usada pelo professor** (fonte: Resumo, Aulão, quadro — cita Sedgewick & Wayne p.584)
(1) DFS em G, registra tempos de término; (2) DFS no grafo transposto, na ordem decrescente de término do passo 1; (3) cada árvore da segunda DFS = um SCC.

**Outros autores**
- Cormen: **exatamente o mesmo algoritmo e ordem** (Seção 22.5) — DFS em G primeiro, depois transposto na ordem decrescente de término.
- Sedgewick: descreve a **ordem invertida**: primeiro DFS no grafo **reverso** (calculando pós-ordem), depois DFS no grafo **original**, visitando na ordem decrescente dessa pós-ordem. Matematicamente equivalente (mesmo resultado), mas ordem de execução trocada em relação ao professor.
- Kleinberg & Tardos: só um teste de conectividade forte de par único (BFS de s e no grafo revertido) — não apresenta o algoritmo completo de SCC.
- West: só definição, sem algoritmo.

**Diferença real?** SIM (ordem de execução, não o resultado)
O professor segue a convenção de Cormen (DFS em G → transpõe → DFS no transposto). Sedgewick faz o inverso (DFS no reverso primeiro). Resultado final idêntico, mas se o aluno consultar Sedgewick diretamente pode se confundir com a ordem dos passos.

⭐ **PARA A PROVA, SIGA A ORDEM DO PROFESSOR**: DFS em G (tempos de término) → transpõe → DFS no transposto, do maior para o menor tempo de término.

---

### Caminho / circuito euleriano

**Definição usada pelo professor** (fonte: Aulão — cita West p.26)
Circuito euleriano existe ⟺ todos os graus pares. Caminho euleriano existe ⟺ exatamente 2 vértices de grau ímpar. Algoritmo descrito: (1) DFS a partir de vértice de grau ímpar quando existir; (2) **priorizar arestas que não desconectam o grafo**; (3) parar ao voltar ao início ou não conseguir progredir.

**Outros autores**
- West: Teorema 1.2.26 — condição de existência idêntica à do professor; cita "Tucker's Algorithm" apenas em exercício, sem detalhar.
- Sedgewick: mesma condição de existência (Property 17.4), com prova construtiva por indução; não nomeia um algoritmo específico no texto revisado.
- Cormen: só como problema de fim de capítulo (22-3), sem algoritmo pronto.
- Kleinberg & Tardos: não encontrado.

**Diferença real?** SIM (mas é sobre QUAL algoritmo usar, não sobre a condição de existência)
A condição de existência (par ⇒ circuito; exatamente 2 ímpares ⇒ caminho) é unânime entre todas as fontes e o professor — sem divergência aí. Porém, o **método de construção** descrito pelo professor ("priorizar arestas que não desconectam o grafo") é o **Algoritmo de Fleury** (testa pontes/arestas de corte a cada passo) — um algoritmo diferente do Algoritmo de Hierholzer (constrói via pilha/backtracking, sem testar pontes), que é o mais comum em implementações de referência e é o que este app usa internamente na animação (produz o mesmo circuito/caminho válido, mas por um caminho de execução diferente).

⭐ **PARA A PROVA, DESCREVA O RACIOCÍNIO DE FLEURY** (evitar desconectar o grafo, i.e., evitar pontes, a menos que não haja alternativa) — é o que o professor descreveu em aula.

---

### Algoritmo de Dijkstra (menor caminho)

**Definição usada pelo professor** (fonte: Aulão — cita Kleinberg & Tardos p.137)
Vetor de distância D; fila de prioridade; enquanto S≠V, seleciona w∉S com menor D[w], relaxa arestas.

**Outros autores**
- Cormen: mesmo algoritmo (Seção 24.3), guloso, S cresce a cada iteração, RELAX idêntico.
- Kleinberg & Tardos: fonte citada pelo próprio material do professor — confere exatamente.
- West: mesmo algoritmo, com pseudocódigo estruturado (Algoritmo 2.3.5).

**Diferença real?** NÃO — todas as fontes descrevem o mesmo algoritmo guloso clássico, todas notam que falha com pesos negativos.

---

### Excentricidade, raio, diâmetro, centro

**Definição usada pelo professor** (fonte: Resumo Prova 1)
Excentricidade = maior das menores distâncias de v aos demais; raio = menor excentricidade; diâmetro = maior excentricidade; centro = vértices de menor excentricidade.

**Outros autores**
- Cormen: não encontrado (só diâmetro de árvore, caso particular, em exercício).
- Kleinberg & Tardos: não encontrado.
- Sedgewick: não encontrado como conceito geral (só "diâmetro de rede" pontual).
- West: tratamento completo e rigoroso (Def 2.1.9/2.1.12) — notação ε(u) para excentricidade, rad(G), diam(G), centro como subgrafo induzido pelos vértices de excentricidade mínima.

**Diferença real?** NÃO
West é a fonte mais alinhada (e provavelmente a origem indireta deste conteúdo no curso) — mesma definição do professor, só com notação ε(u) formal em vez de "excentricidade" por extenso. Os demais livros simplesmente não cobrem o tópico.

---

### Ordenação topológica / maior caminho em DAG

**Definição usada pelo professor** (fonte: só provas antigas — 2024/2-Q4, 2026/1-Q3 — sem slide/resumo/quadro específico)

**Outros autores**
- Cormen: ordenação topológica via DFS (ordem decrescente de tempo de término); maior caminho via truque de negar pesos no algoritmo de caminho mínimo em DAG (Seção 24.2).
- Kleinberg & Tardos: ordenação topológica via remoção incremental de vértices de grau de entrada 0 (Kahn) — algoritmo diferente de Cormen, mesmo resultado.
- Sedgewick: mesma abordagem de Cormen (pós-ordem de DFS = ordem topológica reversa).
- West: não encontrado.

**Diferença real?** SIM, mas sem indicação de preferência do professor
Existem dois algoritmos padrão igualmente válidos — DFS com tempos de término (Cormen/Sedgewick) ou remoção incremental por grau de entrada/fila (Kleinberg & Tardos, também chamado algoritmo de Kahn). Como não há slide, resumo ou registro de quadro do professor sobre este tópico especificamente (só as provas mostram que ele cobra o resultado), **não há convenção clara documentada** — qualquer um dos dois métodos deve ser aceito, desde que bem justificado. Este app usa a versão de Kleinberg & Tardos/Kahn (remoção incremental) por ser mais simples de visualizar passo a passo.

---

## SÍNTESE

**Sem divergência relevante (equivalentes entre todos os autores):** definição de grafo/grau/aperto de mãos, matrizes/lista de adjacência, isomorfismo, complemento/auto-complementar, subgrafo/subgrafo induzido, BFS, detecção de ciclo (mesma lógica), Dijkstra, excentricidade/raio/diâmetro/centro.

**Divergências reais que importam para a prova:**
1. **DFS**: professor usa estados 0/1/2 (não branco/cinza/preto) — use essa notação.
2. **Fecho transitivo**: professor pede alcançabilidade a partir de 1 vértice (DFS/BFS + transposto), não a matriz de fecho completo (Warshall) dos livros.
3. **Base/anti-base**: terminologia própria do professor (Γ⁺), sem nome padronizado nos livros — não confundir com "kernel" de West, que é um conceito diferente.
4. **Kosaraju**: professor segue a ordem de Cormen (DFS em G → transposto), não a ordem invertida de Sedgewick (apesar do aulão citar Sedgewick como fonte do algoritmo).
5. **Euleriano**: professor descreve o raciocínio do Algoritmo de Fleury (evitar pontes), diferente do Algoritmo de Hierholzer mais comum em implementações de referência.
6. **Ordenação topológica**: sem preferência documentada do professor — ambos os métodos padrão (DFS ou remoção por grau de entrada) são aceitáveis.
