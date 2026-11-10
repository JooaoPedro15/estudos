export type CheckKind = 'modelagem' | 'justificativa' | 'exemplo';

export interface CheckSpec {
  kind: CheckKind;
  stem: string;
  correct: string;
  wrong: [string, string, string];
  explanation: string;
}

const check = (kind: CheckKind, stem: string, correct: string, wrong: [string, string, string], explanation: string): CheckSpec =>
  ({ kind, stem, correct, wrong, explanation });

const criticalPath: CheckSpec[] = [
  check('modelagem', 'Como modelar disciplinas e pré-requisitos?',
    'Cada disciplina é um vértice; u → v significa que u é pré-requisito de v. O grafo deve ser acíclico.',
    ['Cada período é um vértice e cada disciplina é uma aresta.', 'u → v significa que u e v podem ser feitas em paralelo.', 'Use um grafo não direcionado, pois os pré-requisitos valem nos dois sentidos.'],
    'A direção registra qual atividade precisa terminar antes da outra.'),
  check('justificativa', 'Por que calcular os tempos na ordem topológica?',
    'Quando v é processado, todos os seus pré-requisitos já têm tempo definitivo; o maior tempo acumulado determina quando v pode terminar.',
    ['A ordem topológica visita sempre a atividade de menor duração.', 'Ela elimina a necessidade de considerar atividades feitas em paralelo.', 'Ela garante que cada atividade tenha exatamente um pré-requisito.'],
    'A recorrência usa valores dos predecessores, por isso eles precisam vir primeiro.'),
  check('exemplo', 'No exemplo A → C, B → D, B → E, C → F, D → F, D → G, E → G, com cada disciplina durando um período, qual é o mínimo?',
    '3 períodos: {A, B}, depois {C, D, E}, depois {F, G}.',
    ['2 períodos, porque A e B podem ser feitas em paralelo.', '4 períodos, porque há sete disciplinas.', '7 períodos, porque cada disciplina exige um período próprio.'],
    'As cadeias mais longas têm três disciplinas; as independentes ocorrem em paralelo.'),
];

const serialization: CheckSpec[] = [
  check('modelagem', 'Como representar objetos e referências entre eles?',
    'Cada objeto é um vértice; A → B significa que A referencia B.',
    ['Cada byte é um vértice; arestas representam o tamanho do buffer.', 'Cada referência é um vértice; objetos são arestas.', 'A → B significa que B foi serializado antes de A, sem representar referência.'],
    'A aresta registra a relação de referência indicada no enunciado.'),
  check('justificativa', 'Por que escrever em ordem decrescente do término da DFS?',
    'A termina depois dos objetos que referencia; escrever A primeiro nessa ordem o coloca antes de seus sucessores. Um ciclo impede essa ordem.',
    ['A ordem crescente coloca sempre o objeto antes dos referenciados.', 'A DFS dispensa detectar ciclos, pois toda referência tem ordem válida.', 'Ordenar por grau de saída basta mesmo quando há ciclos.'],
    'O término da DFS vem após explorar sucessores; a ordem invertida respeita as arestas de referência em um DAG.'),
  check('exemplo', 'Se A referencia B e C, e B referencia D, todos do mesmo tamanho, quantos objetos o buffer precisa comportar para serializar A e seus referenciados?',
    '4 objetos: A, B, C e D.',
    ['2 objetos: apenas A e B.', '3 objetos: A, B e C; referências indiretas não contam.', '5 objetos: cada aresta também ocupa o espaço de um objeto.'],
    'O fecho transitivo direto de A inclui os objetos alcançados direta ou indiretamente, além de A.'),
];

const lineGraph: CheckSpec[] = [
  check('modelagem', 'No grafo de linha L(G), o que representa um vértice?',
    'Uma aresta de G; dois vértices de L(G) são adjacentes quando as arestas de G compartilham uma ponta.',
    ['Um vértice de G; a adjacência permanece igual.', 'Um caminho completo de G; a adjacência depende do comprimento.', 'Uma componente conexa de G; duas componentes são adjacentes se têm o mesmo tamanho.'],
    'Essa é a construção do grafo de linha.'),
  check('justificativa', 'Se G é euleriano, por que L(G) também é euleriano?',
    'Para cada aresta uv de G, seu vértice em L(G) tem grau d(u)+d(v)−2, que é par; L(G) também é conexo.',
    ['Porque L(G) sempre é completo.', 'Porque o número de vértices de G é par.', 'Porque um caminho euleriano nunca repete vértices.'],
    'Em G euleriano, d(u) e d(v) são pares; a fórmula preserva a paridade.'),
  check('exemplo', 'O fato de G ser semi-euleriano garante que L(G) seja semi-euleriano?',
    'Não. Em K4 sem uma aresta, G tem dois vértices ímpares, mas L(G) tem quatro.',
    ['Sim, porque todo grafo de linha é euleriano.', 'Sim, pois os dois vértices ímpares de G desaparecem em L(G).', 'Não, porque L(G) sempre é desconexo.'],
    'Quatro vértices de grau ímpar impedem um caminho euleriano em L(G).'),
];

const mstDistinct: CheckSpec[] = [
  check('justificativa', 'Por que a aresta de menor peso de um grafo conexo com pesos distintos está na AGM?',
    'Ela é a única aresta mais leve de um corte que separa uma de suas pontas; pela propriedade do corte, pertence à AGM.',
    ['Porque a AGM deve conter todas as arestas leves.', 'Porque toda aresta leve é uma ponte.', 'Porque Dijkstra escolhe essa aresta primeiro.'],
    'A propriedade do corte justifica especificamente essa escolha.'),
  check('exemplo', 'Pesos distintos garantem qual conclusão?',
    'A AGM é única, mas dois caminhos diferentes ainda podem ter a mesma soma de pesos.',
    ['A AGM e todos os menores caminhos são únicos.', 'A AGM pode ter vários resultados, mas Dijkstra sempre tem um único caminho.', 'O grafo não pode ter ciclos.'],
    'Pesos distintos tornam cada escolha de corte única; somas de caminhos podem empatar.'),
];

const primForced: CheckSpec[] = [
  check('modelagem', 'Como garantir uma aresta obrigatória e sem alterar o código de Prim?',
    'Dar à aresta obrigatória um peso menor que todos os demais apenas na entrada e executar Prim normalmente.',
    ['Remover a aresta obrigatória antes de executar Prim.', 'Rodar Dijkstra e adicionar a aresta ao caminho final.', 'Fazer Prim normalmente e inserir a aresta depois, mesmo que crie ciclo.'],
    'A modificação é nos pesos de entrada, preservando o algoritmo de Prim.'),
  check('justificativa', 'O que é minimizado depois que a aresta e é forçada?',
    'A soma das demais arestas entre as árvores geradoras que contêm e.',
    ['O menor caminho entre as pontas de e.', 'O número de vértices da árvore.', 'A soma das arestas de uma AGM irrestrita que pode excluir e.'],
    'Como e aparece em todas as soluções admissíveis, seu peso fixo não muda a comparação entre elas.'),
];

const primForcedSet: CheckSpec[] = [
  ...primForced,
  check('exemplo', 'O que ocorre se o conjunto E1 de arestas obrigatórias já contém um ciclo?',
    'É impossível construir uma árvore geradora que contenha todas as arestas de E1.',
    ['Prim remove automaticamente o ciclo e mantém todas as arestas obrigatórias.', 'Basta dar peso zero às arestas do ciclo para ele deixar de existir.', 'A solução vira uma AGM única, independentemente dos demais pesos.'],
    'Uma árvore, por definição, não contém ciclos.'),
];

const alternating: CheckSpec[] = [
  check('modelagem', 'Por que o estado do menor caminho alternado precisa guardar mais que o vértice atual?',
    'A continuação depende do peso da última aresta e de o próximo passo exigir subida ou descida.',
    ['Porque Dijkstra precisa guardar todos os caminhos completos.', 'Porque o custo é determinado apenas pelo grau do vértice.', 'Porque o grafo precisa ser convertido em não direcionado.'],
    'Duas chegadas ao mesmo vértice podem permitir próximas arestas diferentes.'),
  check('justificativa', 'Por que Dijkstra funciona no grafo de estados do caminho alternado?',
    'Cada transição representa uma continuação válida e soma peso positivo; Dijkstra minimiza a soma entre esses estados.',
    ['Porque alternância torna o grafo original acíclico.', 'Porque pesos positivos deixam todos os caminhos com a mesma soma.', 'Porque basta visitar cada vértice original uma única vez.'],
    'A restrição é incorporada nas transições e os custos continuam não negativos.'),
  check('exemplo', 'Qual sequência de pesos é alternada?',
    '[1, 3, 2], pois sobe e depois desce.',
    ['[1, 3, 5], pois sobe duas vezes.', '[2, 2, 3], pois permite empate.', '[5, 4, 3], pois desce duas vezes.'],
    'Pesos consecutivos precisam alternar entre aumento e diminuição.'),
];

const sccCycle: CheckSpec[] = [
  check('modelagem', 'Como usar componentes fortemente conexos para decidir se um grafo dirigido tem ciclo?',
    'Rodar Kosaraju e procurar componente com mais de um vértice ou componente unitária com laço.',
    ['Contar as arestas: qualquer grafo com |E| ≥ |V| tem exatamente um ciclo.', 'Verificar apenas se o grafo subjacente é conexo.', 'Procurar uma componente com grau de entrada zero.'],
    'Componentes de tamanho maior que um contêm ida e volta; um laço é o caso unitário.'),
  check('exemplo', 'Se as componentes são {A, B, C} e {D}, com A → B → C → A, qual a conclusão?',
    'Há ciclo, pois a componente {A, B, C} contém mais de um vértice.',
    ['O grafo é acíclico porque há duas componentes.', 'Só haveria ciclo se D tivesse grau ímpar.', 'A segunda DFS precisa produzir uma única componente para existir ciclo.'],
    'A, B e C se alcançam mutuamente através do ciclo.'),
];

const graphDistances: CheckSpec[] = [
  check('justificativa', 'Por que repetir BFS de cada vértice calcula o diâmetro de um grafo sem pesos?',
    'Cada BFS dá distâncias mínimas da origem; a maior delas é sua excentricidade, e a maior excentricidade é o diâmetro.',
    ['Uma única BFS sempre encontra o diâmetro em qualquer grafo.', 'BFS soma os pesos das arestas e escolhe o menor custo.', 'O diâmetro é a menor excentricidade.'],
    'BFS percorre por níveis, portanto mede distância em número de arestas.'),
  check('exemplo', 'Numa estrela com centro c e três folhas, quais são o raio e o diâmetro?',
    'Raio 1 e diâmetro 2.',
    ['Raio 2 e diâmetro 1.', 'Raio 1 e diâmetro 1.', 'Raio 3 e diâmetro 3.'],
    'O centro está a uma aresta de todos; duas folhas estão a duas arestas entre si.'),
];

const matrixAlgorithms: CheckSpec[] = [
  check('modelagem', 'Qual algoritmo olha as arestas globalmente em ordem crescente e só aceita as que não formam ciclo?',
    'Kruskal.', ['Prim.', 'Dijkstra.', 'Kosaraju.'],
    'Kruskal ordena todas as arestas; Prim cresce a partir de um conjunto de vértices.'),
  check('justificativa', 'Qual é a diferença entre a saída da AGM e a de Dijkstra nessa questão?',
    'Prim/Kruskal minimizam o peso total para conectar todos; Dijkstra minimiza a distância de F a cada vértice.',
    ['Todos retornam os mesmos caminhos mínimos a partir de F.', 'Dijkstra minimiza o peso total da árvore geradora.', 'Kruskal mede distância em número de arestas, sem usar pesos.'],
    'São objetivos diferentes: custo total da rede versus caminho de uma origem.'),
];

const widest: CheckSpec[] = [
  check('modelagem', 'O que significa a capacidade de um caminho no problema Max-Min?',
    'O menor peso entre suas arestas; escolhe-se o caminho que maximiza esse valor.',
    ['A soma dos pesos; escolhe-se a menor soma.', 'O maior peso do caminho; escolhe-se o menor desses máximos.', 'O número de arestas; escolhe-se o menor número.'],
    'A menor aresta é o gargalo do caminho.'),
  check('justificativa', 'Qual atualização é usada ao estender um caminho de u para v?',
    'candidato = min(cap[u], peso(u,v)); atualizar cap[v] se candidato for maior.',
    ['candidato = cap[u] + peso(u,v); atualizar se for menor.', 'candidato = max(cap[u], peso(u,v)); atualizar se for menor.', 'candidato = peso(u,v), ignorando o percurso anterior.'],
    'A capacidade do caminho estendido é limitada pelo menor gargalo encontrado até agora.'),
  check('exemplo', 'Entre s–a–t com pesos 5 e 2 e s–b–t com pesos 3 e 4, qual caminho Max-Min vence?',
    's–b–t, com capacidade min(3,4)=3.',
    ['s–a–t, com capacidade 5+2=7.', 's–a–t, com capacidade min(5,2)=5.', 'Empate, pois ambos têm duas arestas.'],
    'Os gargalos são 2 e 3, respectivamente; escolhe-se o maior.'),
];

const euler: CheckSpec[] = [
  check('justificativa', 'Quando um grafo não direcionado conexo possui circuito euleriano?',
    'Quando todos os vértices de grau positivo têm grau par.',
    ['Quando exatamente dois vértices têm grau ímpar.', 'Quando todo vértice é visitado uma única vez.', 'Quando o grafo não tem nenhuma ponte inicialmente.'],
    'Ao entrar num vértice pelo circuito, é preciso sair por outra aresta.'),
  check('exemplo', 'Em Fleury, havendo várias arestas disponíveis, qual escolher?',
    'Uma aresta que não seja ponte no grafo restante; usar ponte só se for a única saída.',
    ['Sempre a ponte de menor peso.', 'Sempre a primeira aresta em ordem alfabética.', 'Qualquer aresta, mesmo que isole outras não usadas.'],
    'Cruzar uma ponte cedo pode deixar arestas não usadas inacessíveis.'),
];

const connectivity: CheckSpec[] = [
  check('modelagem', 'O que caracteriza conectividade forte em um grafo direcionado?',
    'Para qualquer par u,v, há caminho de u para v e de v para u.',
    ['Basta haver caminho em um dos dois sentidos.', 'Basta o grafo ficar conexo quando as setas são ignoradas.', 'Todos os vértices precisam ter grau de entrada zero.'],
    'Os dois sentidos são necessários para cada par.'),
  check('justificativa', 'Como Kosaraju identifica se o grafo inteiro é fortemente conexo?',
    'Ele encontra uma única componente fortemente conexa contendo todos os vértices.',
    ['Ele encontra |V| componentes unitárias.', 'Ele precisa encontrar pelo menos uma ponte.', 'Ele verifica se todos os graus são pares.'],
    'Uma única componente significa alcançabilidade mútua entre todos os vértices.'),
];

const countComponents: CheckSpec[] = [
  check('justificativa', 'Qual o mínimo de arestas para um grafo com n vértices e k componentes?',
    'n−k, somando nᵢ−1 arestas mínimas em cada componente.',
    ['n−1, independentemente do número de componentes.', 'n+k, para separar as componentes.', 'k−1, como numa árvore de componentes.'],
    'Cada componente conexa com nᵢ vértices precisa de ao menos nᵢ−1 arestas.'),
  check('exemplo', 'Com 14 vértices e 7 componentes, qual o máximo de arestas num grafo simples não direcionado?',
    '28: um componente completo com 8 vértices e seis isolados.',
    ['7: uma aresta por componente.', '21: um componente completo com 7 vértices.', '91: o grafo completo com 14 vértices, mantendo 7 componentes.'],
    'Para maximizar arestas, concentram-se os vértices possíveis numa única componente completa.'),
];

const subgraph: CheckSpec[] = [
  check('modelagem', 'O que distingue um subgrafo induzido por S de um subgrafo comum?',
    'O induzido contém todas as arestas de G cujas duas pontas estão em S.',
    ['O induzido pode escolher livremente algumas das arestas entre vértices de S.', 'O induzido sempre contém todos os vértices de G.', 'O induzido só pode existir quando G é completo.'],
    'Depois de escolher S, as arestas do subgrafo induzido ficam determinadas.'),
  check('exemplo', 'Se G tem arestas a–b, a–c, b–c e c–d, qual é o induzido por {a,b,c}?',
    'As três arestas a–b, a–c e b–c.',
    ['Apenas a–b.', 'As quatro arestas, incluindo c–d.', 'Nenhuma aresta, pois d ficou de fora.'],
    'Incluem-se exatamente as arestas de G com ambas as pontas no conjunto escolhido.'),
];

const complement: CheckSpec[] = [
  check('justificativa', 'Quantas arestas tem o grafo completo Kₙ?',
    'n(n−1)/2, pois cada par distinto forma uma aresta.',
    ['n(n−1), contando cada par duas vezes.', 'n−1, como qualquer árvore.', '2n, porque cada vértice tem duas pontas.'],
    'Há uma aresta para cada par não ordenado de vértices distintos.'),
  check('exemplo', 'Qual é o complemento de Kₙ?',
    'O grafo nulo nos mesmos n vértices, com zero arestas.',
    ['O próprio Kₙ.', 'Uma árvore com n−1 arestas.', 'Um ciclo com n arestas.'],
    'O complemento contém exatamente as arestas que faltam no grafo original.'),
];

const lambdaGrowth: CheckSpec[] = [
  check('modelagem', 'Qual informação extra o estado deve guardar no caminho de λ-crescimento?',
    'A última aresta usada, pois a próxima depende do seu peso.',
    ['Apenas o vértice atual, independentemente da última aresta.', 'O grau total de todos os vértices visitados.', 'O número de componentes fortemente conexas.'],
    'Duas chegadas ao mesmo vértice com últimos pesos distintos têm continuações possíveis diferentes.'),
  check('justificativa', 'Pela correção manuscrita e pelos exemplos, qual condição deve valer para pesos consecutivos e, f?',
    'w(e) < w(f) < λ·w(e).',
    ['w(f) ≤ w(e).', 'w(f) > λ·w(e).', 'w(e) = w(f).'],
    'O próximo peso cresce, mas fica abaixo de λ vezes o anterior.'),
  check('exemplo', 'Com λ=2, qual sequência respeita a condição do enunciado?',
    '[2,3,5].',
    ['[2,3,7].', '[2,2,3].', '[5,3,2].'],
    '2<3<4 e 3<5<6; já 7 não é menor que 6.'),
];

const diameterDefinitions: CheckSpec[] = [
  ...graphDistances,
  check('exemplo', 'Em K₆, quanto valem raio e diâmetro?',
    'Ambos valem 1.', ['Raio 1 e diâmetro 5.', 'Ambos valem 0.', 'Raio 5 e diâmetro 1.'],
    'Cada vértice é adjacente a todos os outros.'),
];

/** Itens fechados curtos e específicos, sem usar respostas longas de outras questões como distratores. */
export function checksForQuestion(id: string): CheckSpec[] {
  if (['ps-2024-2-q2', 'ps-20xx8-q4'].includes(id)) return serialization;
  if (id === 'ps-20xx6-q3') return criticalPath;
  if (id === 'ps-2026-1-q1') return lineGraph;
  if (id === 'ps-2026-1-q2') return mstDistinct;
  if (id === 'ps-2026-1-q3') return primForcedSet;
  if (id === 'ps-2025-1-q2') return alternating;
  if (['ps-2025-1-q3', 'ps-2024-2-q4'].includes(id)) return sccCycle;
  if (id === 'ps-2025-1-q4') return primForced;
  if (id === 'ps-2025-1-q1') return diameterDefinitions;
  if (['ps-2024-2-q1', 'ps-20xx1-q3'].includes(id)) return graphDistances;
  if (id === 'ps-2024-2-q3') return primForced;
  if (['ps-2021-2-q3', 'ps-20xx7-q2'].includes(id)) return matrixAlgorithms;
  if (['ps-20xx6-q4', 'ps-20xx7-q4'].includes(id)) return widest;
  if (id === 'ps-20xx8-q2') return lambdaGrowth;
  if (id === 'ps-20xx8-q3') return euler;
  if (['ps-2021-2-q2', 'ps-20xx6-q1', 'ps-20xx7-q1'].includes(id)) return connectivity;
  if (id === 'ps-2021-2-q4' || id === 'ps-20xx6-q2') return subgraph;
  if (id === 'ps-2021-2-q1') return complement;
  if (['ps-20xx1-q1', 'ps-20xx8-q1'].includes(id)) return countComponents;
  return [];
}
