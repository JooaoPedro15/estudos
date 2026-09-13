/**
 * Respostas-modelo das questões abertas: o texto que se escreve na FOLHA DA
 * PROVA, no registro das resoluções corrigidas (definição citada → contas
 * linha a linha → conclusão explícita), usando só vocabulário do material do
 * professor. Aplicadas às questões por id em content/questions/index.ts.
 */
export const EXAM_ANSWERS: Record<string, string> = {
  'fund-fam-05': `Seja G = (V, E) um grafo simples com n = |V| ≥ 2 vértices.

1. Como G é simples (não possui laços nem arestas paralelas), cada vértice v é adjacente a no máximo os outros n − 1 vértices. Logo 0 ≤ d(v) ≤ n − 1 para todo v ∈ V.

2. Suponha que exista um vértice u com d(u) = n − 1. Então u é adjacente a todos os outros vértices; cada um deles tem pelo menos a aresta que o liga a u, isto é, d(v) ≥ 1 para todo v ≠ u. Portanto grau 0 e grau n − 1 não podem ocorrer ao mesmo tempo em G.

3. Assim, os graus dos n vértices estão em um conjunto com no máximo n − 1 valores: {0, 1, …, n − 2} ou {1, 2, …, n − 1}.

4. São n vértices para no máximo n − 1 valores de grau: não tem como todos terem graus diferentes. Logo pelo menos dois vértices de G possuem o mesmo grau. ∎`,

  'comp-03': `Não. Seja G auto-complementar com n vértices.

1. Como G ≅ Ḡ e grafos isomorfos têm o mesmo número de arestas, |E(G)| = |E(Ḡ)|.

2. Pela definição de complemento, todo par {u, v} de vértices distintos é aresta de G ou de Ḡ, nunca de ambos. Logo |E(G)| + |E(Ḡ)| = n(n − 1)/2, o número de arestas do grafo completo Kn.

3. Substituindo (1) em (2): 2|E(G)| = n(n − 1)/2 ⇒ |E(G)| = n(n − 1)/4.

4. Isso obriga n(n − 1) a ser divisível por 4 (para |E(G)| ser inteiro), mas não obriga |E(G)| a ser divisível por 4.

Contra-exemplo: o ciclo com 5 vértices C5 = a–b–c–d–e–a é auto-complementar — seu complemento tem as arestas ac, ad, bd, be, ce, que formam o ciclo a–c–e–b–d–a, isomorfo a C5. |E(C5)| = 5 = 5·4/4, e 5 não é divisível por 4. Logo a afirmação é falsa.`,

  'iso-04': `Definição (não-direcionado): G e H são isomorfos se existe uma correspondência um-para-um entre seus vértices e entre suas arestas que preserva as relações de incidência, isto é, uma bijeção f: V(G) → V(H) tal que {u, v} ∈ E(G) ⟺ {f(u), f(v)} ∈ E(H).

Transposição para grafos direcionados: em um grafo direcionado, E é uma relação binária em V, formada por pares ORDENADOS (u, v), em que (u, v) ≠ (v, u). A incidência a preservar inclui o sentido: G e H direcionados são isomorfos se existe uma bijeção f: V(G) → V(H) tal que (u, v) ∈ E(G) ⟺ (f(u), f(v)) ∈ E(H).

Diferenças necessárias: (i) f deve levar a origem de cada aresta na origem da aresta correspondente e o destino no destino; (ii) as condições necessárias passam a incluir, além de |V|, |E| e número de componentes, a mesma sequência de graus de ENTRADA d⁻ e de SAÍDA d⁺.

Exemplo (6 vértices, 6 arestas):
G: V = {a, b, c, d, e, f}, E = {(a,b), (b,c), (c,d), (d,e), (e,f), (f,a)}.
H: V = {1, 2, 3, 4, 5, 6}, E = {(1,3), (3,5), (5,2), (2,4), (4,6), (6,1)}.
Bijeção f: a→1, b→3, c→5, d→2, e→4, f→6.
Verificação: (a,b)→(1,3) ✓; (b,c)→(3,5) ✓; (c,d)→(5,2) ✓; (d,e)→(2,4) ✓; (e,f)→(4,6) ✓; (f,a)→(6,1) ✓. Cada aresta de G corresponde a exatamente uma aresta de H com o mesmo sentido, e vice-versa; ambos têm d⁻(v) = d⁺(v) = 1 em todo vértice. Logo G ≅ H.`,

  'base-03': `Definição: base de um grafo dirigido G = (V, E) é um subconjunto B ⊆ V tal que não há caminho entre vértices de B, e todo vértice não pertencente a B pode ser atingido por algum vértice de B.

Algoritmo:
1. Calcule o grau de entrada d⁻(v) de todos os vértices.
2. Todo vértice com d⁻(v) = 0 entra em B: ele não é alcançado por nenhum outro, logo só ele pode se representar.
3. Se G não possui ciclos: pare. Todo vértice com d⁻(v) > 0 é alcançado, direta ou indiretamente, a partir de algum vértice com d⁻ = 0; e nenhum vértice de B alcança outro (nenhum deles tem aresta chegando). Logo B é base, e é mínima porque nenhum de seus vértices pode ser retirado.
4. Se G possui ciclos: os vértices de um ciclo têm todos d⁻ ≥ 1 e podem não ser alcançados de fora do ciclo. Contraia cada ciclo (componente fortemente conexo) em um hipervértice; o grafo resultante não tem ciclos. Aplique os passos 1–3 a ele. Para cada hipervértice com d⁻ = 0, escolha um vértice qualquer do ciclo original para B — qualquer um alcança os demais do ciclo.

Para quais grafos funciona: apenas com os passos 1–3, somente para grafos direcionados sem ciclo; com o passo 4, para qualquer grafo direcionado. Anti-base: obtenha o grafo transposto de G e aplique o mesmo algoritmo.`,

  'ciclo-02': `Estratégia 1 — busca em profundidade com três estados (0 – não começou; 1 – começou mas não terminou; 2 – terminou).
VISIT(G): para u ∈ V, visitado[u] = 0; para u ∈ V, se visitado[u] == 0, VISITAR_REC(G, u).
VISITAR_REC(G, v): visitado[v] = 1; para cada u ∈ N(v): se visitado[u] == 1 → HÁ CICLO; se visitado[u] == 0 → VISITAR_REC(G, u); ao final, visitado[v] = 2.
Justificativa: um vizinho u com estado 1 começou e ainda não terminou, ou seja, está no caminho que a busca percorreu até v; a aresta v → u fecha esse caminho em um ciclo (aresta de retorno). Se a busca termina sem encontrar estado 1, toda aresta leva a um vértice novo (0) ou já terminado (2), e não existe ciclo.

Estratégia 2 — componentes fortemente conexos (algoritmo de Kosaraju).
(1) Busca em profundidade em G gravando os tempos de início e término; (2) busca em profundidade no grafo transposto, na ordem decrescente de tempo de término; (3) cada conjunto de vértices visitados em uma mesma chamada é um componente fortemente conexo.
Justificativa: se algum componente tem dois ou mais vértices, há caminho de ida e de volta entre eles, e ida + volta formam um ciclo. Se todos os componentes têm um único vértice (e não há laço), G é acíclico.

Estratégia 3 (alternativa) — remoção repetida: remova todo vértice com grau de entrada 0, junto com as arestas que saem dele; repita enquanto houver vértice com d⁻ = 0. Se todos os vértices forem removidos, G é acíclico; se sobrar algum, os que sobram têm todos d⁻ ≥ 1 entre si e contêm um ciclo.`,

  'exc-03': `Definições: a distância entre v e u é o menor número de arestas de um caminho de v a u; a excentricidade ε(v) é a maior das menores distâncias entre v e os demais vértices; o diâmetro é a maior das excentricidades do grafo.

Algoritmo — entrada: G = (V, E) não-direcionado.
1. diam ← 0.
2. Para cada vértice v ∈ V:
   2a. Busca em largura a partir de v: dist[u] ← −1 para todo u; dist[v] ← 0; fila ← {v}. Enquanto a fila não estiver vazia: remova w do início; para cada vizinho u de w com dist[u] = −1, faça dist[u] ← dist[w] + 1 e insira u no fim da fila.
   2b. Se algum dist[u] = −1, G é desconexo: pare (diâmetro não definido).
   2c. ε(v) ← maior valor em dist.
   2d. diam ← máx(diam, ε(v)).
3. Saída: diam.
Custo: |V| buscas em largura, cada uma O(|V| + |E|).

Exemplo: caminho a–b–c–d.
Busca de a: dist = (a 0, b 1, c 2, d 3) ⇒ ε(a) = 3.
Busca de b: dist = (a 1, b 0, c 1, d 2) ⇒ ε(b) = 2.
Busca de c: ε(c) = 2. Busca de d: ε(d) = 3.
Diâmetro = máx(3, 2, 2, 3) = 3. (Raio = 2; centro = {b, c}.)`,

  'tp-exc-algoritmo-diametro': `Definições: a distância entre v e u é o menor número de arestas de um caminho de v a u; a excentricidade ε(v) é a maior das menores distâncias entre v e os demais vértices; o diâmetro é a maior das excentricidades do grafo.

Algoritmo — entrada: G = (V, E) simples não-direcionado.
1. diam ← 0.
2. Para cada vértice v ∈ V:
   2a. Busca em largura a partir de v: dist[u] ← −1 para todo u; dist[v] ← 0; fila ← {v}. Enquanto a fila não estiver vazia: remova w do início; para cada vizinho u de w com dist[u] = −1, faça dist[u] ← dist[w] + 1 e insira u no fim da fila.
   2b. Se algum dist[u] = −1, G é desconexo: pare (diâmetro não definido).
   2c. ε(v) ← maior valor em dist.
   2d. diam ← máx(diam, ε(v)).
3. Saída: diam.
Custo: |V| buscas em largura, cada uma O(|V| + |E|).

Exemplo: caminho a–b–c–d. Busca de a: (0, 1, 2, 3) ⇒ ε(a) = 3; de b: (1, 0, 1, 2) ⇒ ε(b) = 2; de c: ε(c) = 2; de d: ε(d) = 3. Diâmetro = 3.`,

  'scc-01': `Grafo: A → B → C; D → E e E → D.

Passo 1 — busca em profundidade em G anotando tempo de início/término (ordem alfabética):
A (início 1) → B (início 2) → C (início 3, término 4); B (término 5); A (término 6). D (início 7) → E (início 8, término 9); D (término 10).
Ordem decrescente de término: D (10), E (9), A (6), B (5), C (4).

Passo 2 — grafo transposto Gᵀ (sentido das arestas invertido): B → A, C → B, E → D, D → E.

Passo 3 — busca em profundidade em Gᵀ seguindo a ordem do passo 1:
• de D: alcança E (E → D volta a D, já visitado) ⇒ conjunto {D, E};
• E: já visitado;
• de A: em Gᵀ nenhuma aresta sai de A ⇒ {A};
• de B: B → A, já visitado ⇒ {B};
• de C: C → B, já visitado ⇒ {C}.

Componentes fortemente conexos de G: {A}, {B}, {C}, {D, E}.
Justificativa: D e E se alcançam mutuamente (D → E e E → D). Entre A, B e C só há caminho em um sentido (A → B → C), então nenhum par deles é mutuamente alcançável e cada um forma um componente sozinho.`,

  'euler-03': `Condições (grafo não-direcionado e conexo): existe circuito euleriano (fechado, usando cada aresta exatamente uma vez) se, e somente se, todo vértice tem grau par; existe caminho euleriano (aberto) se, e somente se, exatamente dois vértices têm grau ímpar — o caminho começa em um deles e termina no outro.

No grafo: d(a) = 2, d(b) = 2, d(c) = 4, d(d) = 2, d(e) = 2. Todos os graus são pares e o grafo é conexo, logo existe circuito euleriano.

Solução:
1. Escolha o vértice inicial: se houver dois vértices de grau ímpar, comece por um deles; como todos são pares, qualquer vértice serve — comece por a.
2. Percorra o grafo por busca em profundidade usando cada aresta uma única vez; a cada passo, dê prioridade a uma aresta que NÃO desconecte a parte ainda não percorrida do grafo — só use uma aresta que desconecta quando não houver outra.
3. Pare ao voltar ao vértice inicial (circuito) ou quando não for mais possível avançar (caminho).

Execução: a –ab– b –bc– c. Em c, a aresta ca deixaria d e e sem como serem alcançados, então escolho cd: c –cd– d –de– e –ec– c –ca– a.
Circuito euleriano: a, b, c, d, e, c, a — as 6 arestas usadas uma única vez, voltando a a.`,

  'tp-subgrafos-formula': `Seja G = Kn o grafo completo com n vértices.

1. Um subgrafo de G é um grafo G1 = (V1, A1) com V1 ⊂ V e A1 ⊂ A. Como em Kn todas as arestas entre vértices existem, um subgrafo fica determinado por: um subconjunto não vazio de vértices e um subconjunto qualquer das arestas entre esses vértices.

2. Fixe o número i de vértices do subgrafo, 1 ≤ i ≤ n. Há C(n, i) maneiras de escolher esses i vértices.

3. Entre i vértices de Kn existem i(i − 1)/2 arestas. Cada uma pode ou não pertencer ao subgrafo: 2^(i(i−1)/2) escolhas.

4. Logo há C(n, i) · 2^(i(i−1)/2) subgrafos com exatamente i vértices.

5. Somando sobre todos os tamanhos: N(Kn) = Σ_{i=1}^{n} C(n, i) · 2^(i(i−1)/2).

Verificação com n = 3: C(3,1)·2⁰ + C(3,2)·2¹ + C(3,3)·2³ = 3 + 6 + 8 = 17 subgrafos.`,

  'tp-autocomp-4k': `Seja G auto-complementar com n vértices.

1. G ≅ Ḡ ⇒ |E(G)| = |E(Ḡ)| (grafos isomorfos têm o mesmo número de arestas).

2. Pela definição de complemento, toda aresta de Kn está em G ou em Ḡ, nunca em ambos: |E(G)| + |E(Ḡ)| = n(n − 1)/2.

3. De (1) e (2): 2|E(G)| = n(n − 1)/2 ⇒ |E(G)| = n(n − 1)/4.

4. Como |E(G)| é um número inteiro, 4 divide n(n − 1).

5. n e n − 1 são inteiros consecutivos: exatamente um deles é par e o outro é ímpar. O ímpar não contribui com fator 2, então o par tem que ser múltiplo de 4.

6. Se n é o múltiplo de 4, n = 4k. Se n − 1 é o múltiplo de 4, n = 4k + 1. Logo todo grafo auto-complementar tem 4k ou 4k + 1 vértices, k inteiro não negativo. ∎

(Exemplos: n = 4, o caminho 1–2–3–4 com 3 arestas; n = 5, o ciclo C5 com 5 arestas.)`,

  'tp-bipartido-n2-4': `Seja G = (V, E) bipartido, |V| = n, |E| = m.

1. Por definição, V pode ser particionado em V1 e V2 tais que toda aresta une um vértice de V1 a um de V2. Seja |V1| = a; então |V2| = n − a.

2. Como não há arestas paralelas, entre V1 e V2 existem no máximo a·(n − a) arestas (uma para cada par). Logo m ≤ a(n − a), com igualdade no bipartido completo Ka,n−a.

3. A função f(a) = a(n − a) = an − a² atinge seu valor máximo em a = n/2, onde f(n/2) = n²/4.

4. Portanto m ≤ a(n − a) ≤ n²/4. ∎

(Se n é ímpar, o máximo inteiro é ⌊n/2⌋·⌈n/2⌉, que é menor que n²/4.)`,

  'tp-m-max': `Seja G = (V, E) simples, |V| = n, |E| = m.

1. Como G é simples (sem laços e sem arestas paralelas), cada vértice v é adjacente a no máximo os outros n − 1 vértices: d(v) ≤ n − 1 para todo v ∈ V.

2. Pela propriedade de grau, Σ d(v) = 2m.

3. Somando a desigualdade do passo 1 sobre os n vértices: 2m = Σ d(v) ≤ n(n − 1).

4. Logo m ≤ n(n − 1)/2, com igualdade no grafo completo Kn. ∎`,

  'tp-bfs-distancias': `Distância em número de arestas é obtida por busca em largura, que explora todos os vértices de um mesmo nível de proximidade antes de passar ao próximo.

Elementos: vetor dist com uma posição por vértice; fila Q.

Algoritmo — entrada: G = (V, E) não-direcionado e v ∈ V.
1. Para todo u ∈ V: dist[u] ← −1. dist[v] ← 0. Q ← {v}.
2. Enquanto Q não estiver vazia:
   2a. w ← remove o vértice do início de Q.
   2b. Para cada vizinho u de w com dist[u] = −1: dist[u] ← dist[w] + 1; insira u no fim de Q.
3. Saída: dist[u] para todo u ∈ V (dist[u] = −1 significa que u não é alcançável a partir de v, isto é, está em outro componente).

Justificativa: a fila processa todos os vértices a distância d antes de qualquer vértice a distância d + 1; assim, quando u é descoberto pelo vizinho w, o caminho v … w u tem dist[w] + 1 arestas e é o mais curto possível.

Custo: cada vértice entra na fila uma vez e cada aresta é examinada uma vez (duas, no não-direcionado): O(|V| + |E|) com lista de adjacência.`,

  'fund-fam-03': `n = 11 vértices, k = 6 componentes conexos.

Cada componente conexo com nᵢ vértices precisa de pelo menos nᵢ − 1 arestas (com menos, ele se separa em dois). Somando sobre os 6 componentes: Σ(nᵢ − 1) = n − k = 11 − 6 = 5.

Logo o número mínimo de arestas é 5. Exemplo: cinco vértices isolados e um componente com os outros 6 vértices ligados em sequência (5 arestas).`,

  'fecho-01': `Fecho transitivo direto de a = conjunto dos vértices alcançáveis a partir de a. Calcula-se por busca em profundidade a partir de a.

Arestas: a → b, b → c, c → a, c → d, d → e.
Busca a partir de a: a → b → c; de c, a já foi visitado; c → d → e.
Fecho transitivo direto de a = {a, b, c, d, e}.`,

  'fecho-02': `Fecho transitivo inverso de a = conjunto dos vértices a partir dos quais a é alcançável. Calcula-se obtendo o grafo transposto e fazendo a busca em profundidade a partir de a nele.

Grafo transposto (sentidos invertidos): b → a, c → b, a → c, d → c, e → d.
Busca a partir de a no transposto: a → c → b (b → a: a já visitado).
Fecho transitivo inverso de a = {a, b, c}. Confirmando no grafo original: b → c → a e c → a; d e e não alcançam a.`,

  'base-01': `Grafo: A → B → C; D → E; E → D.

1. Graus de entrada: d⁻(A) = 0, d⁻(B) = 1, d⁻(C) = 1, d⁻(D) = 1, d⁻(E) = 1.
2. A tem d⁻ = 0 e não é alcançado por ninguém: A entra na base.
3. D e E formam um ciclo (D → E → D): todos com d⁻ ≥ 1, mas nenhum é alcançado de fora. Contraio o ciclo em um hipervértice {D, E}, que fica com grau de entrada 0 ⇒ escolho um vértice dele, D.
4. Base = {A, D} (ou, equivalentemente, {A, E}). Verificação: A alcança B e C; D alcança E; A e D não se alcançam. Cardinalidade mínima 2, pois A e o ciclo {D, E} não são alcançados por nenhum outro vértice.`,

  'conj-05': `Sejam f: A → B e g: B → C injetoras. Quero mostrar que g∘f: A → C é injetora, isto é, que (g∘f)(x₁) = (g∘f)(x₂) ⇒ x₁ = x₂.

1. Sejam x₁, x₂ ∈ A com (g∘f)(x₁) = (g∘f)(x₂). Pela definição de composição, g(f(x₁)) = g(f(x₂)).
2. Como g é injetora, elementos com a mesma imagem são iguais: f(x₁) = f(x₂).
3. Como f é injetora: x₁ = x₂.
4. Logo (g∘f)(x₁) = (g∘f)(x₂) ⇒ x₁ = x₂, que é a definição de g∘f ser injetora. ∎`,

  'prop-05': `Duas proposições são logicamente equivalentes quando têm o mesmo valor verdade em todas as linhas da tabela verdade (isto é, quando o bicondicional entre elas é uma tautologia).

p | q | p → q | ¬q | ¬p | ¬q → ¬p
V | V |   V   | F  | F  |    V
V | F |   F   | V  | F  |    F
F | V |   V   | F  | V  |    V
F | F |   V   | V  | V  |    V

As colunas de p → q e de ¬q → ¬p são idênticas (V, F, V, V). Logo p → q ⇔ ¬q → ¬p: uma implicação é logicamente equivalente à sua contrapositiva. ∎`,

  'pred-05': `Universo de discurso: todos os grafos. Predicados: S(G): "G é um grafo simples com pelo menos 2 vértices"; M(G): "G possui dois vértices de mesmo grau".

Tradução: ∀G (S(G) → M(G)).

Por que → e não ∧: a afirmação diz algo apenas sobre os grafos que satisfazem S — para cada grafo, SE ele é simples com ≥ 2 vértices, ENTÃO tem dois vértices de mesmo grau. Com ∧, ∀G (S(G) ∧ M(G)) afirmaria que TODO grafo é simples com pelo menos 2 vértices E possui dois vértices de mesmo grau, o que é falso (um grafo com 1 vértice já não satisfaz S). Com →, para um grafo que não satisfaz S a hipótese é falsa e a implicação é verdadeira, exatamente como deve ser: a afirmação não se compromete com esses grafos.`,
};
