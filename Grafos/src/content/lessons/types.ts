import type { GraphData } from '../types';

/** Complete snapshots: stepping backwards never depends on replaying mutations. */
export interface AnimationStep {
  graph: GraphData;
  message: string;
  currentVertex?: string;
  visitedVertexIds?: string[];
  highlightVertexIds?: string[];
  highlightEdgeIds?: string[];
  vertexColorMap?: Record<string, string>;
  edgeColorMap?: Record<string, string>;
  vertexLabels?: Record<string, string>;
  edgeLabels?: Record<string, string>;
  vertexNotes?: Record<string, string>;
  formula?: string;
  legend?: { label: string; color: string }[];
  queue?: string[];
  queueLabel?: string;
  sequence?: string[];
  sequenceLabel?: string;
  groups?: { label: string; vertexIds: string[]; color: string }[];
  table?: { headers: string[]; rows: string[][] };
  /** Marker travels from previous vertex to current vertex, along one straight edge. */
  traversal?: { from: string; to: string };
}

export interface GraphAnimation {
  id: string;
  title: string;
  steps: AnimationStep[];
}

export interface GraphConcept {
  id: string;
  title: string;
  intuitiveExplanation: string;
  /** Index into the existing Topic.understand; never copy or rewrite it. */
  technicalIndices: number[];
  examples: GraphAnimation[];
}

export type LessonCatalog = Record<string, GraphConcept[]>;
