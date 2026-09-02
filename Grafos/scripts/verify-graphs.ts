import * as G from '../src/content/questions/graphs';
import * as lib from '../src/lib/graph';

function line(...args: unknown[]) {
  console.log(...args);
}

line('--- UG_SIX ---');
line('degree sequence', lib.degreeSequence(G.UG_SIX));
line('sum degrees', lib.sumOfDegrees(G.UG_SIX));
line('bipartite?', lib.isBipartite(G.UG_SIX));

line('--- Isomorphism pair A/B (4-cycles, should be isomorphic) ---');
line(lib.isomorphismNecessaryConditions(G.UG_SIX_ISO_A, G.UG_SIX_ISO_B));

line('--- NON_ISO_A / NON_ISO_B (should satisfy necessary but NOT be isomorphic) ---');
line('A degSeq', lib.degreeSequence(G.NON_ISO_A), 'B degSeq', lib.degreeSequence(G.NON_ISO_B));
line(lib.isomorphismNecessaryConditions(G.NON_ISO_A, G.NON_ISO_B));

line('--- PROFESSOR_SCC_EXAMPLE (A->B->C, D<->E) ---');
line(lib.stronglyConnectedComponents(G.PROFESSOR_SCC_EXAMPLE).components);
line(lib.baseAndAntiBase(G.PROFESSOR_SCC_EXAMPLE));

line('--- DG_CYCLE ---');
const dfsRes = lib.dfs(G.DG_CYCLE);
line('hasCycle', dfsRes.hasCycle, 'edgeClass', dfsRes.edgeClass);
line('base/antibase', lib.baseAndAntiBase(G.DG_CYCLE));

line('--- DAG_SEVEN ---');
line('topo', lib.topologicalSort(G.DAG_SEVEN));
line('longest path', lib.longestPathDAG(G.DAG_SEVEN));

line('--- EULER graphs ---');
line('circuit graph:', lib.eulerianClassification(G.EULER_CIRCUIT_GRAPH));
line('path graph:', lib.eulerianClassification(G.EULER_PATH_GRAPH));
line('none graph:', lib.eulerianClassification(G.EULER_NONE_GRAPH));
line('circuit trail:', lib.eulerianTrail(G.EULER_CIRCUIT_GRAPH)?.trail);
line('path trail:', lib.eulerianTrail(G.EULER_PATH_GRAPH)?.trail);

line('--- WEIGHTED_GRAPH Dijkstra from s ---');
line(lib.dijkstra(G.WEIGHTED_GRAPH, 's').distances);

line('--- UG_SIX radius/diameter/center ---');
line(lib.radiusDiameterCenter(G.UG_SIX));

line('--- Adjacency/Incidence matrices ---');
line(lib.adjacencyMatrix(G.UG_SIX));
line(lib.incidenceMatrix(G.DG_CYCLE));

line('--- numberOfSubgraphsOfCompleteGraph(4) ---', lib.numberOfSubgraphsOfCompleteGraph(4));
line('--- edgeBoundsForComponents(10,3) ---', lib.edgeBoundsForComponents(10, 3));

line('--- Erdos-Gallai check (2023/1-Q1d sequence) ---');
line(lib.isDegreeSequencePossible([1,1,3,3,3,3,5,6,8,9], 10));

import { makeGraph as mg2 } from '../src/lib/graph';
const P4check = mg2(false, ['1','2','3','4'], [['1','2'],['2','3'],['3','4']]);
line('--- P4 self-complementary? ---', lib.isSelfComplementary(P4check));
line('--- P4 complement edges ---', lib.complement(P4check).edges);

const isoA = mg2(false, ['1','2','3','4'], [['1','2'],['2','3'],['3','4'],['4','1']]);
const isoB = mg2(false, ['w','x','y','z'], [['w','x'],['x','y'],['y','z'],['z','w']]);
line('--- iso mapping check ---', lib.validateIsomorphismMapping(isoA, isoB, {'1':'w','2':'x','3':'y','4':'z'}));

line('--- BFS UG_SIX from a ---', lib.bfs(G.UG_SIX, 'a'));
line('--- DFS DG_CYCLE (order/discovery/finish) ---');
const d2 = lib.dfs(G.DG_CYCLE);
line('order', d2.order, 'discovery', d2.discovery, 'finish', d2.finish);
line('--- transitive closure DG_CYCLE from a (direct) ---', lib.transitiveClosureDirect(G.DG_CYCLE, 'a'));
line('--- transitive closure DG_CYCLE from a (inverse) ---', lib.transitiveClosureInverse(G.DG_CYCLE, 'a'));
line('--- transitive closure DAG_SEVEN from a (direct) ---', lib.transitiveClosureDirect(G.DAG_SEVEN, 'a'));
