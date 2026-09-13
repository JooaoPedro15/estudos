/**
 * Pseudocódigo no estilo do quadro do professor: nome em MAIÚSCULO, `for u ∈ V`,
 * `if cond:`, atribuição com `=`, indentação por nível, sem chaves. Cada
 * bloco vai entre linhas ``` para o app renderizar em fonte mono. Usados nas
 * respostas-modelo (examAnswers.ts e 09-provas-reais.ts).
 */
export const PC = {
  VISIT: `\`\`\`
VISIT(G)
  for u ∈ V, visitado[u] = 0
  for u ∈ V
    if visitado[u] == 0: VISITAR_REC(G, u)

VISITAR_REC(G, v)
  visitado[v] = 1
  for u ∈ N(v)
    if visitado[u] == 1: HÁ CICLO          // aresta de retorno
    if visitado[u] == 0: VISITAR_REC(G, u)
  visitado[v] = 2
\`\`\``,

  VISIT_COM_PAI: `\`\`\`
VISIT(G)
  for u ∈ V, visitado[u] = 0, pai[u] = nulo
  for u ∈ V
    if visitado[u] == 0: VISITAR_REC(G, u)

VISITAR_REC(G, v)
  visitado[v] = 1
  for u ∈ N(v)
    if visitado[u] == 1: HÁ CICLO, fechado pela aresta (v, u)
    if visitado[u] == 0
      pai[u] = v
      VISITAR_REC(G, u)
  visitado[v] = 2

VERTICES_DO_CICLO(v, u)              // aresta de retorno (v, u)
  ciclo = [u]
  x = v
  while x ≠ u
    ciclo = [x] + ciclo
    x = pai[x]
  return ciclo                       // u → ... → pai[v] → v → u
\`\`\``,

  TRANSPOSTO: `\`\`\`
TRANSPOSTO(G)
  Eᵀ = ∅
  for (u, v) ∈ E, Eᵀ = Eᵀ ∪ {(v, u)}
  return (V, Eᵀ)
\`\`\``,

  KOSARAJU: `\`\`\`
KOSARAJU(G)
  VISIT(G) gravando o tempo de término fim[u] de cada vértice
  ordem = vértices em ordem decrescente de fim[u]
  Gᵀ = TRANSPOSTO(G)
  for u ∈ V, visitado[u] = 0
  for u ∈ ordem
    if visitado[u] == 0
      X = ∅
      VISITAR_REC(Gᵀ, u) acrescentando a X cada vértice visitado
      reporte X                      // um componente fortemente conexo
\`\`\``,

  BASE: `\`\`\`
BASE_SEM_CICLO(G)                    // grafo direcionado acíclico
  B = ∅
  for v ∈ V
    if d⁻(v) == 0: B = B ∪ {v}
  return B

BASE(G)                              // qualquer grafo direcionado
  C = KOSARAJU(G)                    // ciclos contraídos: cada X ∈ C é um hipervértice
  B = ∅
  for X ∈ C
    chega = falso
    for (u, w) ∈ E
      if w ∈ X e u ∉ X: chega = verdadeiro
    if chega == falso: B = B ∪ {um vértice qualquer de X}
  return B
\`\`\``,

  ANTIBASE: `\`\`\`
ANTIBASE(G)
  return BASE(TRANSPOSTO(G))
\`\`\``,

  /** Subrotinas que BASE chama — na prova, escrever junto: citar só o nome ("é só usar Kosaraju") o professor cobra detalhe. */
  get SUBROTINAS_BASE(): string {
    return `Subrotinas usadas por BASE (material do professor: busca em profundidade do quadro e Kosaraju do aulão):
${this.TRANSPOSTO}
${this.KOSARAJU}
${this.VISIT}`;
  },

  DISTANCIAS: `\`\`\`
DISTANCIAS(G, v)                     // busca em largura
  for u ∈ V, dist[u] = -1
  dist[v] = 0
  fila = {v}
  while fila ≠ ∅
    w = remove o início da fila
    for u ∈ N(w)
      if dist[u] == -1
        dist[u] = dist[w] + 1
        insere u no fim da fila
  return dist
\`\`\``,

  DIAMETRO: `\`\`\`
EXCENTRICIDADE(G, v)
  dist = DISTANCIAS(G, v)
  e = 0
  for u ∈ V
    if dist[u] == -1: return ∞        // G desconexo
    if dist[u] > e: e = dist[u]
  return e

DIAMETRO(G)
  diam = 0
  for v ∈ V
    e = EXCENTRICIDADE(G, v)
    if e > diam: diam = e
  return diam                        // raio: troque por "if e < raio"; centro: {v | e(v) == raio}
\`\`\``,

  EULER: `\`\`\`
CIRCUITO_EULERIANO(G)
  for v ∈ V
    if d(v) é ímpar: return "não existe"       // condição: todos os graus pares
  if G não é conexo: return "não existe"
  for a ∈ E, usada[a] = falso
  atual = um vértice qualquer de V
  circuito = [atual]
  while existe aresta a = (atual, w) com usada[a] == falso
    escolha a que NÃO desconecta as arestas ainda não usadas
      (só escolha uma que desconecta se for a única disponível)
    usada[a] = verdadeiro
    circuito = circuito + [w]
    atual = w
  return circuito
\`\`\``,

  ORDEM_TOPOLOGICA: `\`\`\`
ORDEM_TOPOLOGICA(G)                  // G direcionado sem ciclos
  for v ∈ V, ge[v] = d⁻(v)
  fila = {v ∈ V | ge[v] == 0}
  ordem = []
  while fila ≠ ∅
    v = remove da fila
    ordem = ordem + [v]
    for u ∈ N(v)
      ge[u] = ge[u] - 1
      if ge[u] == 0: insere u na fila
  return ordem                       // se sobrar vértice fora da ordem, há ciclo
\`\`\``,

  MAIOR_CAMINHO: `\`\`\`
MAIOR_CAMINHO(G)                     // nº de arestas do maior caminho
  ordem = ORDEM_TOPOLOGICA(G)
  for v ∈ V, dist[v] = 0
  for v ∈ ordem
    for u ∈ N(v)
      if dist[v] + 1 > dist[u]: dist[u] = dist[v] + 1
  maior = 0
  for v ∈ V
    if dist[v] > maior: maior = dist[v]
  return maior
\`\`\``,

  TEMPO_CASA: `\`\`\`
TEMPO_MINIMO(G)                      // cada tarefa = 1 semana
  ordem = ORDEM_TOPOLOGICA(G)
  for v ∈ V, t[v] = 1                // semana em que v termina, sem dependências
  for v ∈ ordem
    for u ∈ N(v)                     // u depende de v
      if t[v] + 1 > t[u]: t[u] = t[v] + 1
  semanas = 0
  for v ∈ V
    if t[v] > semanas: semanas = t[v]
  return semanas
\`\`\``,

  SERIALIZA: `\`\`\`
SERIALIZA(G)                         // aresta (A, B): A referencia B
  VISIT(G) gravando fim[u]; se encontrar estado 1: HÁ CICLO de referências
  ordem = vértices em ordem decrescente de fim[u]
  for v ∈ ordem, escreva v no arquivo   // cada v antes dos que ele referencia

TAMANHO_BUFFER(G, v)
  visitado = ∅
  VISITAR_REC(G, v) acrescentando a visitado cada vértice visitado
  return |visitado| × tamanho de um objeto   // fecho transitivo direto de v
\`\`\``,
};
