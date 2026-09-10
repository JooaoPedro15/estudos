import type { GraphConcept } from './types';
import { AMBER, BLUE, GREEN, bipartiteSteps, constructionSteps, makeLessonGraph, traversalSteps } from './builders';

// Shared drawing makes the additional restrictions directly comparable.
const routeGraph = makeLessonGraph(['A', 'B', 'C', 'D', 'E'], [['A','B'], ['B','C'], ['C','D'], ['D','B'], ['B','E'], ['D','A']]);
const walk = traversalSteps(routeGraph, ['A','B','C','B','D']);
walk.at(-1)!.message += ' É um passeio, mas não uma trilha: B—C foi usada duas vezes.';
const trail = traversalSteps(routeGraph, ['A','B','C','D','B','E']);
trail.at(-1)!.message += ' É uma trilha: cada aresta foi usada uma vez. Não é caminho, pois B aparece duas vezes.';
const path = traversalSteps(routeGraph, ['A','B','C','D']);
path.at(-1)!.message += ' É um caminho: nenhum vértice se repete. Por isso também é trilha e passeio.';
const cycle = traversalSteps(routeGraph, ['A','B','C','D','A']);
cycle.forEach(step => { step.vertexNotes = { ...step.vertexNotes, A: 'início' }; });
cycle.at(-1)!.vertexNotes = { ...cycle.at(-1)!.vertexNotes, A: 'início = fim' };
cycle.at(-1)!.formula = 'A → B → C → D → A · Início = fim';
cycle.at(-1)!.message = 'Voltamos a A. Só o vértice inicial/final se repete; nenhuma aresta foi reutilizada. O ciclo permanece destacado.';

const tree = makeLessonGraph(['A','B','C','D','E'], [['A','B'],['B','C'],['B','D'],['D','E']]);
const connected = constructionSteps(tree).map((step,i) => ({ ...step,
  formula: i === 4 ? '|E| = n − 1 = 5 − 1 = 4' : `${5-i} componentes · ${i} de 4 arestas`,
  message: i === 4 ? 'Agora existe um caminho entre qualquer par de vértices. As quatro arestas formam uma árvore geradora: o mínimo para conectar cinco vértices.' : `${step.message} Ainda há ${5-i} componentes separados. Cada nova aresta une dois componentes.`,
}));

const bipartite = makeLessonGraph(['A','B','C','D','E'], [['A','B'],['A','C'],['B','D'],['C','D'],['D','E']]);
const conflict = makeLessonGraph(['A','B','C'], [['A','B'],['A','C'],['B','C']]);
const complete = makeLessonGraph(['A','B','C','D','E'], [['A','C'],['A','D'],['A','E'],['B','C'],['B','D'],['B','E']]);
complete.vertices = complete.vertices.map(v => ({ ...v, x: ['A','B'].includes(v.id) ? 160 : 400,
  y: ({ A: 95, B: 225, C: 65, D: 160, E: 255 } as Record<string, number>)[v.id] }));
const completeSteps = constructionSteps(complete).map((step, i) => ({ ...step,
  highlightEdgeIds: i === 6 ? complete.edges.map(edge => edge.id) : step.highlightEdgeIds,
  highlightVertexIds: i === 6 ? [] : step.highlightVertexIds,
  groups: [{ label: 'Grupo A · m = 2', vertexIds: ['A','B'], color: BLUE }, { label: 'Grupo B · n = 3', vertexIds: ['C','D','E'], color: GREEN }],
  vertexColorMap: { A: BLUE, B: BLUE, C: GREEN, D: GREEN, E: GREEN },
  formula: i === 6 ? 'K(2,3) · |E| = m × n = 2 × 3 = 6' : `K(2,3) em construção · ${i} de 2 × 3 = 6 arestas`,
  message: i === 6 ? 'Cada um dos 2 vértices do primeiro grupo está ligado aos 3 do segundo. Todas as 6 conexões entre grupos estão presentes; nenhuma está dentro de um grupo.' : `${step.message} Só ligamos vértices de grupos diferentes.`,
}));

export const walkConcepts: GraphConcept[] = [
  { id:'walk', title:'Passeio', technicalIndices:[0], intuitiveExplanation:'Imagine os vértices como lugares e as arestas como ruas de mão dupla. Passear é seguir ruas existentes. Você pode voltar ao mesmo lugar e até usar a mesma rua novamente: observe B e a rua B—C ficando marcados como repetidos.', examples:[{id:'walk',title:'Repetir é permitido',steps:walk}] },
  { id:'trail', title:'Trilha', technicalIndices:[0], intuitiveExplanation:'Agora imagine que cada rua só pode ser usada uma vez. Voltar a um lugar continua permitido, desde que você chegue por outra rua. Aqui voltamos a B por D—B: B se repete, mas nenhuma aresta se repete.', examples:[{id:'trail',title:'Repetir lugar, sem repetir rua',steps:trail}] },
  { id:'path', title:'Caminho', technicalIndices:[0], intuitiveExplanation:'A regra fica mais restrita: cada lugar só pode aparecer uma vez no trajeto. Sem repetir vértices, também não reutilizamos arestas. Todo caminho cabe nas regras de trilha e de passeio; observe que o contrário falha nos exemplos anteriores.', examples:[{id:'path',title:'Sem repetir vértices',steps:path}] },
  { id:'cycle', title:'Ciclo', technicalIndices:[1], intuitiveExplanation:'Faça uma volta que termine exatamente onde começou. Durante essa volta, os outros lugares aparecem uma única vez e nenhuma rua é reutilizada. A repetição permitida é a do ponto de partida na chegada: A aparece no início e no fim.', examples:[{id:'cycle',title:'Uma volta completa',steps:cycle}] },
  { id:'connected', title:'Conexo', technicalIndices:[2], intuitiveExplanation:'Pense em cinco ilhas: inicialmente ninguém consegue sair de sua ilha. Cada ponte que une dois grupos separados reduz o número de grupos em um. Com quatro pontes bem escolhidas, todos conseguem chegar a todos, mesmo passando por outras ilhas. Ter quatro arestas por si só não basta: elas precisam conectar todos os vértices.', examples:[{id:'tree',title:'Construir uma árvore geradora',steps:connected}, {id:'count-alone',title:'Só contar arestas não basta',steps:[
    {graph:makeLessonGraph(['A','B','C','D','E'], [['A','B'],['B','C'],['C','A'],['C','D']]),message:'Também há 4 arestas aqui. Mas elas se concentram em A, B, C e D; E está isolado.',highlightVertexIds:['E'],vertexColorMap:{E:AMBER},formula:'|E| = n − 1 = 4, mas o grafo não é conexo'},
    {graph:tree,message:'Redistribuindo uma aresta para alcançar E, os dois componentes se unem. Agora as 4 arestas formam uma árvore.',highlightEdgeIds:['e3'],formula:'Conexo + n − 1 arestas → árvore'},
  ]}] },
  { id:'bipartite', title:'Bipartido', technicalIndices:[3], intuitiveExplanation:'Tente dividir os vértices em duas equipes: vizinhos devem ficar em equipes opostas. A BFS organiza quem será examinado em uma fila. Cada vizinho novo recebe a cor oposta. Se uma aresta unir duas cores iguais, a divisão é impossível. Compare um caso que funciona com um triângulo, que obriga um conflito.', examples:[{id:'valid',title:'Duas cores funcionam',steps:bipartiteSteps(bipartite)},{id:'conflict',title:'Exemplo com conflito',steps:bipartiteSteps(conflict)}] },
  { id:'complete-bipartite', title:'K(m,n)', technicalIndices:[4], intuitiveExplanation:'Imagine duas equipes: cada pessoa da primeira conhece todas as pessoas da segunda, sem conexões dentro da própria equipe. Com 2 pessoas de um lado e 3 do outro, são 3 conexões para cada uma das 2 pessoas: 6 ao todo. Para maximizar as conexões com um total fixo, equilibre os tamanhos dos grupos. Se o total for ímpar, os tamanhos diferem por 1 e o máximo inteiro é ⌊n²/4⌋.', examples:[{id:'k23',title:'Todas as conexões entre os grupos',steps:completeSteps}] },
];
