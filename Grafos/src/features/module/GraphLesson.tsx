import { useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw } from 'lucide-react';
import type { Topic } from '@/content/types';
import type { GraphAnimation, GraphConcept } from '@/content/lessons/types';
import { GraphVisualizer } from '@/components/graph/GraphVisualizer';
import { Button, Card } from '@/components/ui';
import { useLessonPlayback } from './lessonPlayback';
import './graphLesson.css';

function AnimationPlayer({ animation }: { animation: GraphAnimation }) {
  const playback = useLessonPlayback(animation.steps.length);
  const reducedMotion = useReducedMotion();
  const step = animation.steps[playback.index];
  const graphDescription = `${step.graph.directed ? 'Grafo dirigido' : 'Grafo não dirigido'}. Vértices: ${step.graph.vertices.map(v => v.label).join(', ')}. Arestas: ${step.graph.edges.map(e => `${e.source} ${step.graph.directed ? 'para' : 'com'} ${e.target}`).join('; ') || 'nenhuma'}. ${step.message}`;
  return (
    <div className="lesson-player">
      <div className="lesson-scene">
        {step.groups && <div className="lesson-groups">{step.groups.map(group => <div key={group.label} style={{ borderColor: group.color, color: group.color }}><strong>{group.label}</strong><span>{group.vertexIds.join(', ')}</span></div>)}</div>}
        <GraphVisualizer
          graph={step.graph} width={560} height={320} interactive={false} showWeights
          highlightVertexIds={[...step.highlightVertexIds ?? [], ...step.currentVertex ? [step.currentVertex] : []]}
          highlightEdgeIds={step.highlightEdgeIds} visitedVertexIds={step.visitedVertexIds}
          vertexColorMap={step.vertexColorMap} edgeColorMap={step.edgeColorMap}
          vertexLabels={step.vertexLabels} edgeLabels={step.edgeLabels} vertexNotes={step.vertexNotes}
          traversal={step.traversal ? { ...step.traversal, progress: reducedMotion ? 1 : playback.progress } : undefined}
          accessibleLabel={graphDescription} className="lesson-graph"
        />
        {step.vertexNotes && <dl className="lesson-mobile-notes">{Object.entries(step.vertexNotes).map(([id, note]) => <div key={id}><dt>{id}</dt><dd>{note}</dd></div>)}</dl>}
        <div className="lesson-legend" aria-label="Legenda">
          <span><i className="legend-current" />Atual / destaque</span>
          {Boolean(step.visitedVertexIds?.length) && !step.vertexColorMap && <span><i className="legend-visited" />Visitado</span>}
          {Boolean(step.highlightEdgeIds?.length) && !step.edgeColorMap && <span><i className="legend-visited" />Aresta em destaque</span>}
          {step.legend?.map(item => <span key={item.label}><i style={{ background: item.color }} />{item.label}</span>)}
          {step.edgeLabels && Object.values(step.edgeLabels).some(label => label.endsWith('×')) && <span>2× = aresta reutilizada</span>}
        </div>
      </div>
      {step.sequence && <div className="lesson-sequence" aria-label={step.sequenceLabel ?? 'Sequência desta etapa'}><span className="lesson-eyebrow">{step.sequenceLabel ?? 'Sequência desta etapa'}</span>{step.sequence.map((vertex, i) => <span key={i} className={i === step.sequence!.length - 1 ? 'is-current' : ''}>{i > 0 && <span aria-hidden="true"> → </span>}{vertex}</span>)}</div>}
      {step.queue && <div className="lesson-queue"><span>{step.queueLabel ?? 'Fila'} <small>({step.queueLabel === 'Fila de prioridade' ? 'menor → maior' : 'início → fim'})</small></span><strong className="mono">[{step.queue.join(', ')}]</strong></div>}
      {step.formula && <p className="lesson-formula mono">{step.formula}</p>}
      {step.table && <div className="lesson-table-wrap" tabIndex={0} role="region" aria-label="Dados desta etapa"><table className="lesson-table"><thead><tr>{step.table.headers.map((header, i) => <th key={i} scope="col">{header}</th>)}</tr></thead><tbody>{step.table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>}
      <div className="lesson-step-message" role="status" aria-live="polite" aria-atomic="true">
        <span className="lesson-eyebrow">Etapa {playback.index + 1} de {animation.steps.length}</span>
        <p>{step.message}</p>
      </div>
      <div className="lesson-controls" role="group" aria-label="Controles da demonstração">
        <Button variant="secondary" size="sm" onClick={() => playback.goTo(playback.index - 1)} disabled={playback.index === 0} icon={<ArrowLeft size={14} />}>Etapa anterior</Button>
        <Button size="sm" onClick={playback.toggle} icon={playback.playing ? <Pause size={14} /> : <Play size={14} />}>{playback.playing ? 'Pausar' : 'Reproduzir'}</Button>
        <Button variant="ghost" size="sm" onClick={() => playback.goTo(0)} icon={<RotateCcw size={14} />}>Reiniciar</Button>
        <Button variant="secondary" size="sm" onClick={() => playback.goTo(playback.index + 1)} disabled={playback.index === animation.steps.length - 1}>Próxima etapa <ArrowRight size={14} /></Button>
      </div>
    </div>
  );
}

function ConceptContent({ topic, concept }: { topic: Topic; concept: GraphConcept }) {
  const [exampleId, setExampleId] = useState(concept.examples[0].id);
  const example = concept.examples.find(item => item.id === exampleId)!;
  return (
    <div className="lesson-content">
      <div className="lesson-explanations">
        <div className="lesson-intuitive">
          <h3 className="lesson-eyebrow">Entenda primeiro</h3>
          <p>{concept.intuitiveExplanation}</p>
        </div>
        <div className="lesson-technical">
          <h3 className="lesson-eyebrow">Como o professor define / Para a prova</h3>
          {concept.technicalIndices.map(index => <p key={index}>{topic.understand[index]}</p>)}
        </div>
      </div>
      <section aria-label={`Visualize: ${concept.title}`} className="lesson-demonstration">
        <div className="lesson-demonstration-heading"><h3 className="lesson-eyebrow">Visualize</h3><span>{concept.title}</span></div>
        {concept.examples.length > 1 && <div className="lesson-example-options" role="group" aria-label="Exemplos">{concept.examples.map(item => <Button size="sm" variant={item.id === exampleId ? 'primary' : 'secondary'} aria-pressed={item.id === exampleId} key={item.id} onClick={() => setExampleId(item.id)}>{item.title}</Button>)}</div>}
        <AnimationPlayer key={example.id} animation={example} />
      </section>
    </div>
  );
}

export function GraphLesson({ topic, concepts }: { topic: Topic; concepts: GraphConcept[] }) {
  const [conceptId, setConceptId] = useState(concepts[0].id);
  const concept = concepts.find(item => item.id === conceptId)!;
  return (
    <Card padding="lg" className="graph-lesson">
      <div className="lesson-heading"><h2>Entenda e visualize</h2><span>Escolha um conceito e acompanhe cada etapa.</span></div>
      <nav className="lesson-concepts" aria-label="Conceitos da lição">{concepts.map(item => <button type="button" key={item.id} aria-pressed={item.id === conceptId} onClick={() => setConceptId(item.id)}>{item.title}</button>)}</nav>
      <ConceptContent key={concept.id} topic={topic} concept={concept} />
      <details className="lesson-original"><summary>Consultar toda a explicação técnica deste tópico</summary><ol>{topic.understand.map((text, i) => <li key={i}>{text}</li>)}</ol></details>
    </Card>
  );
}
