import { describe, expect, it } from 'vitest';
import { topics } from '../topics';
import { lessons } from './index';
import { makeLessonGraph, traversalSteps, bipartiteSteps } from './builders';
import { walkConcepts } from './walks';

describe('lesson coverage and integrity', () => {
  for (const topic of topics) {
    it(`covers every original technical paragraph of ${topic.id}`, () => {
      const concepts = lessons[topic.id];
      expect(concepts?.length).toBeGreaterThan(0);
      expect(new Set(concepts.map(c => c.id)).size).toBe(concepts.length);
      const indices = new Set(concepts.flatMap(c => c.technicalIndices));
      expect([...indices].sort((a,b) => a-b)).toEqual(topic.understand.map((_,i) => i));
      for (const concept of concepts) {
        expect(concept.intuitiveExplanation.length).toBeGreaterThan(30);
        expect(concept.examples.length).toBeGreaterThan(0);
        for (const example of concept.examples) {
          expect(example.steps.length).toBeGreaterThan(1);
          for (const step of example.steps) {
            const vertices = new Set(step.graph.vertices.map(v => v.id));
            const edges = new Set(step.graph.edges.map(e => e.id));
            for (const e of step.graph.edges) {
              expect(vertices.has(e.source) && vertices.has(e.target)).toBe(true);
            }
            for (const v of [...step.highlightVertexIds ?? [], ...step.visitedVertexIds ?? [], ...step.queue ?? [], ...Object.keys(step.vertexNotes ?? {}), ...Object.keys(step.vertexColorMap ?? {}), ...Object.keys(step.vertexLabels ?? {}), ...step.groups?.flatMap(g => g.vertexIds) ?? [], ...step.currentVertex ? [step.currentVertex] : []]) expect(vertices.has(v), `${topic.id}/${concept.id}: ${v}`).toBe(true);
            for (const e of step.highlightEdgeIds ?? []) expect(edges.has(e)).toBe(true);
            for (const e of [...Object.keys(step.edgeColorMap ?? {}), ...Object.keys(step.edgeLabels ?? {})]) expect(edges.has(e)).toBe(true);
            if (step.traversal) {
              const { from, to } = step.traversal;
              expect(step.graph.edges.some(e => e.source === from && e.target === to || !step.graph.directed && e.source === to && e.target === from)).toBe(true);
            }
            if (step.table) for (const row of step.table.rows) expect(row.length).toBe(step.table.headers.length);
            expect(step.message.length).toBeGreaterThan(0);
          }
        }
      }
    });
  }
});

describe('didactic invariants', () => {
  const example = (id: string) => walkConcepts.find(c => c.id === id)!.examples[0].steps;
  it('demonstrates distinct restrictions for walk, trail and path', () => {
    const walk = example('walk').at(-1)!;
    const trail = example('trail').at(-1)!;
    const path = example('path').at(-1)!;
    expect(Object.values(walk.edgeLabels!)).toContain('2×');
    expect(Object.values(trail.edgeLabels!).every(count => count === '1×')).toBe(true);
    expect(new Set(trail.sequence).size).toBeLessThan(trail.sequence!.length);
    expect(new Set(path.sequence).size).toBe(path.sequence!.length);
  });
  it('closes the cycle without repeating any edge or intermediate vertex', () => {
    const final = example('cycle').at(-1)!;
    expect(final.sequence![0]).toBe(final.sequence!.at(-1));
    expect(new Set(final.sequence!.slice(0,-1)).size).toBe(final.sequence!.length - 1);
    expect(Object.values(final.edgeLabels!).every(count => count === '1×')).toBe(true);
  });
  it('constructs a spanning tree with n-1 edges, reducing components at each step', () => {
    const steps = example('connected');
    steps.forEach((step, index) => {
      expect(step.graph.edges.length).toBe(index);
      const components = step.graph.vertices.map(v => new Set([v.id]));
      for (const e of step.graph.edges) {
        const from = components.find(c => c.has(e.source))!;
        const to = components.find(c => c.has(e.target))!;
        expect(from).not.toBe(to);
        for (const v of to) from.add(v);
        components.splice(components.indexOf(to),1);
      }
      expect(components.length).toBe(5-index);
    });
  });
  it('builds exactly all six cross-part edges of K(2,3)', () => {
    const steps = example('complete-bipartite');
    expect(steps.map(s=>s.graph.edges.length)).toEqual([0,1,2,3,4,5,6]);
    const edges = steps.at(-1)!.graph.edges;
    expect(new Set(edges.map(e => `${e.source}-${e.target}`))).toEqual(new Set(['A-C','A-D','A-E','B-C','B-D','B-E']));
  });
  it('counts repeated undirected edges in both directions', () => {
    const graph = makeLessonGraph(['A','B','C'], [['A','B'],['B','C']]);
    const steps = traversalSteps(graph, ['A','B','C','B']);
    expect(steps.at(-1)?.edgeLabels?.e1).toBe('2×');
    expect(steps.at(-1)?.vertexNotes?.B).toBe('2 visitas');
    expect(steps[0].edgeLabels?.e1).toBeUndefined();
  });
  it('rejects traversal through a nonexistent edge', () => {
    const graph = makeLessonGraph(['A','B'], []);
    expect(() => traversalSteps(graph, ['A','B'])).toThrow();
  });
  it('uses BFS, with opposite colors and FIFO snapshots', () => {
    const graph = makeLessonGraph(['A','B','C'], [['A','B'],['A','C']]);
    const steps = bipartiteSteps(graph);
    expect(steps[0].vertexColorMap).toEqual({});
    expect(steps.some(s => s.queue?.join(',') === 'B,C')).toBe(true);
    const end = steps.at(-1)!;
    for (const e of graph.edges) expect(end.vertexColorMap?.[e.source]).not.toBe(end.vertexColorMap?.[e.target]);
  });
  it('finds conflicts even in a disconnected component', () => {
    const graph = makeLessonGraph(['A','B','C','D'], [['B','C'],['C','D'],['D','B']]);
    const end = bipartiteSteps(graph).at(-1)!;
    expect(end.message).toContain('não bipartido');
    expect(end.highlightEdgeIds).toHaveLength(1);
    const edge = graph.edges.find(e => e.id === end.highlightEdgeIds![0])!;
    expect(end.vertexColorMap?.[edge.source]).toBe(end.vertexColorMap?.[edge.target]);
  });
});
