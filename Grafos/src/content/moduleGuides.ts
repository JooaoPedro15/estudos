/** Porta de entrada em linguagem simples; os detalhes e a notação ficam nos tópicos. */
export const moduleGuides: Record<string, { idea: string; example: string; check: string }> = {
  fundamentos: {
    idea: 'Um grafo é um conjunto de coisas e das ligações entre elas. Primeiro aprenda a ler vértices, arestas e graus; depois compare os tipos de grafo.',
    example: 'Se A–B e B–C são as únicas ligações, B tem grau 2 e A e C têm grau 1.',
    check: 'Consigo distinguir vértice, aresta, grau, caminho e ciclo no mesmo desenho?',
  },
  representacoes: {
    idea: 'Matriz e lista são maneiras diferentes de guardar o mesmo grafo. A pergunta é sempre: quais vértices estão ligados e em que sentido?',
    example: 'Com A → B, a linha de A na matriz marca B; na lista de sucessores de A aparece B.',
    check: 'Consigo transformar um desenho em matriz e lista, e reconstruir o desenho a partir delas?',
  },
  'isomorfismo-propriedades': {
    idea: 'Dois grafos podem ter nomes e desenhos diferentes, mas as mesmas ligações. Compare a estrutura antes de tentar associar os vértices.',
    example: 'Um triângulo A–B–C–A continua sendo um triângulo se os vértices forem renomeados 1, 2 e 3.',
    check: 'Se graus e número de arestas coincidem, sei por que ainda preciso verificar as adjacências?',
  },
  'busca-alcancabilidade': {
    idea: 'BFS explora por distância; DFS segue um ramo até o fim. Essas buscas também revelam quem alcança quem, ciclos e componentes.',
    example: 'Em A → B → C, uma busca a partir de A chega a C; a partir de C não chega a A.',
    check: 'Consigo escolher BFS para distâncias e DFS para tempos, ciclos e alcançabilidade?',
  },
  'conectividade-caminhos': {
    idea: 'Conectividade pergunta se existe caminho. Distância pergunta quantas arestas tem o menor caminho. Em grafos dirigidos, a volta pode não existir.',
    example: 'Em A → B → C → A, os três vértices se alcançam nos dois sentidos e formam uma componente fortemente conexa.',
    check: 'Consigo calcular uma excentricidade por BFS e identificar uma componente por Kosaraju?',
  },
  'logica-conjuntos': {
    idea: 'Conjuntos organizam elementos; lógica organiza afirmações sobre esses elementos. Leia cada símbolo como uma frase antes de calcular.',
    example: '“Todo vértice tem vizinho” é diferente de “existe um vértice que tem vizinho”.',
    check: 'Consigo dizer em palavras o que ∀, ∃, ∩, ∪ e → afirmam?',
  },
  'p2-inducao': {
    idea: 'Indução prova uma regra para todos os tamanhos: confirme o primeiro caso e mostre que um caso leva ao seguinte.',
    example: 'Um caminho com 1 vértice tem 0 arestas. Ao acrescentar um vértice na ponta, acrescenta-se exatamente 1 aresta.',
    check: 'Minha prova tem base, hipótese e passo para um tamanho genérico?',
  },
  'p2-euler-hamilton': {
    idea: 'Euler quer usar cada aresta uma vez; Hamilton quer visitar cada vértice uma vez. No grafo de linha, cada aresta original vira um vértice.',
    example: 'Se duas ruas se encontram na mesma esquina, os vértices que representam essas ruas ficam ligados em L(G).',
    check: 'Sei o que pode repetir em Euler e em Hamilton, e quando Fleury deve evitar uma ponte?',
  },
  'p2-arvores-agm': {
    idea: 'Uma árvore liga todos os seus vértices sem ciclo. A AGM faz isso usando a menor soma de pesos possível.',
    example: 'Para ligar quatro cidades, uma árvore geradora usa 3 estradas. Prim e Kruskal escolhem quais 3 tornam o custo mínimo.',
    check: 'Consigo explicar por que Prim olha um corte e Kruskal rejeita arestas que fecham ciclo?',
  },
  'p2-caminhos-minimos': {
    idea: 'Menor caminho soma pesos; capacidade máxima olha a menor aresta de cada caminho. O tipo de peso e a pergunta determinam o algoritmo.',
    example: 'Entre caminhos com pesos 5+2 e 3+4, ambos custam 7; suas capacidades são 2 e 3, respectivamente.',
    check: 'Sei quando usar BFS, Dijkstra, Bellman-Ford ou Max-Min sem confundir soma com gargalo?',
  },
  'p2-conectividade': {
    idea: 'Num grafo com setas, conseguir ir não garante conseguir voltar. Os tipos fraco, semi-forte e forte exigem níveis diferentes de alcance.',
    example: 'Em A → B → C, ignorar as setas liga tudo, mas C não alcança A.',
    check: 'Para cada par de vértices, sei dizer se há caminho em nenhum, um ou nos dois sentidos?',
  },
};
