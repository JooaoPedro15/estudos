import { RepresentationPanel } from '@/components/graph/RepresentationPanel';
import { IsomorphismVisualizer } from '@/components/graph/IsomorphismVisualizer';
import type { GraphData } from '@/content/types';

const undirectedGraph: GraphData = {
  directed: false,
  vertices: [
    { id: 'A', label: 'A' },
    { id: 'B', label: 'B' },
    { id: 'C', label: 'C' },
    { id: 'D', label: 'D' },
  ],
  edges: [
    { id: 'e0', source: 'A', target: 'B' },
    { id: 'e1', source: 'B', target: 'C' },
    { id: 'e2', source: 'C', target: 'D' },
    { id: 'e3', source: 'D', target: 'A' },
    { id: 'e4', source: 'A', target: 'C' },
  ],
};

const directedGraph: GraphData = {
  directed: true,
  vertices: [
    { id: 'A', label: 'A' },
    { id: 'B', label: 'B' },
    { id: 'C', label: 'C' },
  ],
  edges: [
    { id: 'e0', source: 'A', target: 'B' },
    { id: 'e1', source: 'B', target: 'C' },
    { id: 'e2', source: 'C', target: 'A' },
  ],
};

const graphA: GraphData = {
  directed: false,
  vertices: [
    { id: 'a1', label: '1' },
    { id: 'a2', label: '2' },
    { id: 'a3', label: '3' },
    { id: 'a4', label: '4' },
  ],
  edges: [
    { id: 'e0', source: 'a1', target: 'a2' },
    { id: 'e1', source: 'a2', target: 'a3' },
    { id: 'e2', source: 'a3', target: 'a4' },
    { id: 'e3', source: 'a4', target: 'a1' },
  ],
};

const graphB: GraphData = {
  directed: false,
  vertices: [
    { id: 'b1', label: 'W' },
    { id: 'b2', label: 'X' },
    { id: 'b3', label: 'Y' },
    { id: 'b4', label: 'Z' },
  ],
  edges: [
    { id: 'f0', source: 'b1', target: 'b2' },
    { id: 'f1', source: 'b2', target: 'b3' },
    { id: 'f2', source: 'b3', target: 'b4' },
    { id: 'f3', source: 'b4', target: 'b1' },
  ],
};

export function QaScratch() {
  return (
    <div className="flex flex-col gap-16 p-8">
      <section>
        <h2 className="mb-4 text-xl font-semibold text-white">RepresentationPanel — não dirigido</h2>
        <RepresentationPanel graph={undirectedGraph} />
      </section>
      <section>
        <h2 className="mb-4 text-xl font-semibold text-white">RepresentationPanel — dirigido</h2>
        <RepresentationPanel graph={directedGraph} />
      </section>
      <section>
        <h2 className="mb-4 text-xl font-semibold text-white">IsomorphismVisualizer</h2>
        <IsomorphismVisualizer graphA={graphA} graphB={graphB} expectedIsomorphic={true} />
      </section>
    </div>
  );
}
