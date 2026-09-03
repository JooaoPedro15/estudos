import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Flame, TriangleAlert, Star, CheckCircle2, CircleHelp } from 'lucide-react';
import { getModule } from '@/content/modules';
import { getTopic } from '@/content/topics';
import { questionsForTopic } from '@/content/questions';
import { setLastPosition, recordAttempt } from '@/store/progress';
import { makeGraph } from '@/lib/graph';
import type { GraphData, Question } from '@/content/types';
import { GraphVisualizer } from '@/components/graph/GraphVisualizer';
import { RepresentationPanel } from '@/components/graph/RepresentationPanel';
import { IsomorphismVisualizer } from '@/components/graph/IsomorphismVisualizer';
import { ExerciseRenderer, type ExerciseResult } from '@/engine/ExerciseRenderer';
import { Badge, Button, Card, ExamLikelihoodBadge } from '@/components/ui';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

/** Grafo pequeno e representativo para a seção VISUALIZE — um por tópico, escolhido para ilustrar o conceito (não para ser exaustivo). */
function buildTopicGraph(topicId: string): GraphData {
  switch (topicId) {
    case 'definicao-terminologia':
      return makeGraph(false, ['a', 'b', 'c', 'd', 'e'], [['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'e'], ['e', 'a'], ['a', 'c']]);
    case 'passeios-caminhos-ciclos':
      return makeGraph(false, ['a', 'b', 'c', 'd', 'e'], [['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'e'], ['e', 'a']]);
    case 'aperto-de-maos-familias':
      return makeGraph(false, ['a', 'b', 'c', 'd'], [['a', 'b'], ['a', 'c'], ['a', 'd'], ['b', 'c'], ['b', 'd'], ['c', 'd']]);
    case 'complemento-subgrafo':
      return makeGraph(false, ['a', 'b', 'c', 'd', 'e'], [['a', 'b'], ['b', 'c'], ['c', 'd']]);
    case 'teoremas-contagem':
      return makeGraph(false, ['a', 'b', 'c', 'd', 'e'], [['a', 'b'], ['a', 'c'], ['b', 'c'], ['c', 'd'], ['d', 'e']]);
    case 'bfs':
      return makeGraph(false, ['a', 'b', 'c', 'd', 'e', 'f'], [['a', 'b'], ['a', 'c'], ['b', 'd'], ['c', 'd'], ['d', 'e'], ['e', 'f']]);
    case 'dfs-classificacao':
      return makeGraph(true, ['a', 'b', 'c', 'd', 'e'], [['a', 'b'], ['b', 'c'], ['c', 'a'], ['b', 'd'], ['d', 'e']]);
    case 'fecho-transitivo':
      return makeGraph(true, ['a', 'b', 'c', 'd', 'e'], [['a', 'b'], ['b', 'c'], ['c', 'd'], ['a', 'e']]);
    case 'base-antibase':
      return makeGraph(true, ['a', 'b', 'c', 'd', 'e'], [['a', 'c'], ['b', 'c'], ['c', 'd'], ['c', 'e']]);
    case 'deteccao-ciclo':
      return makeGraph(true, ['a', 'b', 'c', 'd'], [['a', 'b'], ['b', 'c'], ['c', 'a'], ['c', 'd']]);
    case 'excentricidade-raio-diametro':
      return makeGraph(false, ['a', 'b', 'c', 'd', 'e'], [['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'e']]);
    case 'scc-kosaraju':
      return makeGraph(true, ['a', 'b', 'c', 'd', 'e', 'f'], [['a', 'b'], ['b', 'c'], ['c', 'a'], ['c', 'd'], ['d', 'e'], ['e', 'f'], ['f', 'd']]);
    case 'euleriano':
      return makeGraph(false, ['a', 'b', 'c', 'd'], [['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'a'], ['a', 'c']]);
    case 'dijkstra':
      return makeGraph(
        false,
        ['a', 'b', 'c', 'd', 'e'],
        [
          ['a', 'b', 2],
          ['a', 'c', 5],
          ['b', 'c', 1],
          ['b', 'd', 4],
          ['c', 'd', 1],
          ['d', 'e', 3],
        ],
      );
    case 'topologica-maior-caminho':
      return makeGraph(true, ['a', 'b', 'c', 'd', 'e'], [['a', 'b'], ['a', 'c'], ['b', 'd'], ['c', 'd'], ['d', 'e']]);
    default:
      return makeGraph(false, ['a', 'b', 'c', 'd', 'e'], [['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'e'], ['e', 'a']]);
  }
}

/** Par de grafos pequenos e isomorfos entre si — usado só pelo tópico "isomorfismo" na seção VISUALIZE. */
function buildIsomorphismExample(): { graphA: GraphData; graphB: GraphData } {
  const graphA = makeGraph(false, ['a', 'b', 'c', 'd', 'e'], [['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'a'], ['e', 'a'], ['e', 'b']]);
  const graphB = makeGraph(false, ['w', 'x', 'y', 'z', 'v'], [['w', 'y'], ['y', 'x'], ['x', 'v'], ['v', 'w'], ['z', 'w'], ['z', 'y']]);
  return { graphA, graphB };
}

type SetOp = 'union' | 'intersection' | 'diffAB' | 'complement';
const SET_OPS: { id: SetOp; label: string }[] = [
  { id: 'union', label: 'A ∪ B' },
  { id: 'intersection', label: 'A ∩ B' },
  { id: 'diffAB', label: 'A \\ B' },
  { id: 'complement', label: '(A ∪ B)ᶜ' },
];

/** Diagrama de Venn interativo — clique numa operação para destacar a região correspondente. */
function VennExplorer() {
  const [op, setOp] = useState<SetOp>('union');
  const fill = (region: 'onlyA' | 'onlyB' | 'both' | 'outside') => {
    const active =
      (op === 'union' && region !== 'outside') ||
      (op === 'intersection' && region === 'both') ||
      (op === 'diffAB' && region === 'onlyA') ||
      (op === 'complement' && region === 'outside');
    return active ? 'var(--color-accent)' : 'var(--color-bg-elevated-2)';
  };
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        {SET_OPS.map((o) => (
          <button
            key={o.id}
            onClick={() => setOp(o.id)}
            className="mono rounded-full border px-3 py-1.5 text-xs font-medium transition"
            style={{
              borderColor: op === o.id ? 'var(--color-accent)' : 'var(--color-border)',
              background: op === o.id ? 'var(--color-accent-soft)' : 'var(--color-bg-elevated)',
              color: op === o.id ? 'var(--color-accent-strong)' : 'var(--color-text-secondary)',
            }}
          >
            {o.label}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 320 200" className="w-full max-w-sm">
        <rect x="4" y="4" width="312" height="192" rx="12" fill={fill('outside')} stroke="var(--color-border)" />
        <circle cx="130" cy="100" r="70" fill={fill('onlyA')} fillOpacity="0.9" stroke="var(--color-border-strong)" />
        <circle cx="190" cy="100" r="70" fill={fill('onlyB')} fillOpacity="0.9" stroke="var(--color-border-strong)" />
        <path
          d="M160,42 A70,70 0 0,1 160,158 A70,70 0 0,1 160,42 Z"
          fill={fill('both')}
          fillOpacity="0.95"
          stroke="var(--color-border-strong)"
        />
        <text x="95" y="55" fontSize="16" fontWeight={700} fill="var(--color-text-primary)">A</text>
        <text x="220" y="55" fontSize="16" fontWeight={700} fill="var(--color-text-primary)">B</text>
      </svg>
    </div>
  );
}

const CONNECTIVES = [
  { id: 'and', label: 'p ∧ q', fn: (p: boolean, q: boolean) => p && q },
  { id: 'or', label: 'p ∨ q', fn: (p: boolean, q: boolean) => p || q },
  { id: 'xor', label: 'p ⊕ q', fn: (p: boolean, q: boolean) => p !== q },
  { id: 'implies', label: 'p → q', fn: (p: boolean, q: boolean) => !p || q },
  { id: 'iff', label: 'p ↔ q', fn: (p: boolean, q: boolean) => p === q },
];
const BOOL_ROWS: [boolean, boolean][] = [
  [true, true],
  [true, false],
  [false, true],
  [false, false],
];

/** Tabela-verdade completa dos 5 conectivos, com a linha do (p,q) escolhido destacada. */
function TruthTableExplorer() {
  const [p, setP] = useState(true);
  const [q, setQ] = useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-4">
        <button
          onClick={() => setP((v) => !v)}
          className="mono rounded-lg border px-4 py-2 text-sm font-semibold transition"
          style={{ borderColor: 'var(--color-border-strong)', background: p ? 'var(--color-success-soft)' : 'var(--color-danger-soft)', color: p ? 'var(--color-success)' : 'var(--color-danger)' }}
        >
          p = {p ? 'V' : 'F'}
        </button>
        <button
          onClick={() => setQ((v) => !v)}
          className="mono rounded-lg border px-4 py-2 text-sm font-semibold transition"
          style={{ borderColor: 'var(--color-border-strong)', background: q ? 'var(--color-success-soft)' : 'var(--color-danger-soft)', color: q ? 'var(--color-success)' : 'var(--color-danger)' }}
        >
          q = {q ? 'V' : 'F'}
        </button>
      </div>
      <div className="overflow-auto">
        <table className="mono border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-[var(--color-border)] px-3 py-1.5 text-left text-[var(--color-text-tertiary)]">p</th>
              <th className="border-b border-[var(--color-border)] px-3 py-1.5 text-left text-[var(--color-text-tertiary)]">q</th>
              {CONNECTIVES.map((c) => (
                <th key={c.id} className="border-b border-[var(--color-border)] px-3 py-1.5 text-[var(--color-text-tertiary)]">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BOOL_ROWS.map(([rp, rq]) => {
              const isCurrent = rp === p && rq === q;
              return (
                <tr key={`${rp}-${rq}`} style={isCurrent ? { background: 'var(--color-accent-soft)' } : undefined}>
                  <td className="px-3 py-1.5 text-[var(--color-text-primary)]">{rp ? 'V' : 'F'}</td>
                  <td className="px-3 py-1.5 text-[var(--color-text-primary)]">{rq ? 'V' : 'F'}</td>
                  {CONNECTIVES.map((c) => (
                    <td key={c.id} className="px-3 py-1.5 text-center text-[var(--color-text-primary)]">
                      {c.fn(rp, rq) ? 'V' : 'F'}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Explorador de quantificadores: marque quais elementos do domínio satisfazem P(x) e veja ∀xP(x)/∃xP(x) mudarem ao vivo. */
function QuantifierExplorer() {
  const [satisfied, setSatisfied] = useState<Set<number>>(new Set([2, 4, 6, 8]));
  const domain = [1, 2, 3, 4, 5, 6, 7, 8];
  const toggle = (n: number) =>
    setSatisfied((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  const forAll = satisfied.size === domain.length;
  const exists = satisfied.size > 0;
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center text-xs text-[var(--color-text-tertiary)]">
        Domínio = {'{1..8}'}. Clique nos números para marcar quais satisfazem P(x) (ex.: "x é par").
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {domain.map((n) => {
          const on = satisfied.has(n);
          return (
            <button
              key={n}
              onClick={() => toggle(n)}
              className="mono flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition"
              style={{
                borderColor: on ? 'var(--color-accent)' : 'var(--color-border-strong)',
                background: on ? 'var(--color-accent-soft)' : 'var(--color-bg-elevated)',
                color: on ? 'var(--color-accent-strong)' : 'var(--color-text-tertiary)',
              }}
            >
              {n}
            </button>
          );
        })}
      </div>
      <div className="grid w-full max-w-sm grid-cols-2 gap-3">
        <div
          className="rounded-lg border px-3 py-2 text-center text-sm font-semibold"
          style={{ borderColor: forAll ? 'var(--color-success)' : 'var(--color-danger)', background: forAll ? 'var(--color-success-soft)' : 'var(--color-danger-soft)', color: forAll ? 'var(--color-success)' : 'var(--color-danger)' }}
        >
          ∀xP(x) = {forAll ? 'V' : 'F'}
        </div>
        <div
          className="rounded-lg border px-3 py-2 text-center text-sm font-semibold"
          style={{ borderColor: exists ? 'var(--color-success)' : 'var(--color-danger)', background: exists ? 'var(--color-success-soft)' : 'var(--color-danger-soft)', color: exists ? 'var(--color-success)' : 'var(--color-danger)' }}
        >
          ∃xP(x) = {exists ? 'V' : 'F'}
        </div>
      </div>
    </div>
  );
}

function VisualizeSection({ topicId }: { topicId: string }) {
  if (topicId === 'matriz-adjacencia' || topicId === 'matriz-incidencia' || topicId === 'lista-adjacencia') {
    const graph = buildTopicGraph(topicId);
    return <RepresentationPanel graph={graph} />;
  }
  if (topicId === 'isomorfismo') {
    const { graphA, graphB } = buildIsomorphismExample();
    return <IsomorphismVisualizer graphA={graphA} graphB={graphB} expectedIsomorphic />;
  }
  if (topicId === 'teoria-de-conjuntos') return <VennExplorer />;
  if (topicId === 'logica-proposicional') return <TruthTableExplorer />;
  if (topicId === 'logica-de-predicados') return <QuantifierExplorer />;
  const graph = buildTopicGraph(topicId);
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
      <GraphVisualizer graph={graph} interactive height={340} />
    </div>
  );
}

/** Mini-sessão sequencial de questões dentro da lição (TESTE-SE / QUESTÕES ESTILO PROVA). Cada instância mantém seu próprio progresso. */
function LessonQuizSection({ questions, topicId }: { questions: Question[]; topicId: string }) {
  const [index, setIndex] = useState(0);

  if (questions.length === 0) return null;

  const done = index >= questions.length;

  function handleComplete(question: Question, result: ExerciseResult) {
    recordAttempt({
      questionId: question.id,
      topic: topicId,
      correct: result.correct,
      hintsUsed: result.hintsUsed,
      timeMs: result.timeMs,
      timestamp: Date.now(),
    });
    setIndex((i) => i + 1);
  }

  if (done) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-[var(--color-success)]/40 bg-[var(--color-success-soft)] px-4 py-3 text-sm text-[var(--color-success)]">
        <CheckCircle2 size={16} className="shrink-0" />
        Concluído — {questions.length} questão{questions.length !== 1 ? 'ões' : ''} respondida{questions.length !== 1 ? 's' : ''}.
      </div>
    );
  }

  const question = questions[index];

  return (
    <div className="flex flex-col gap-4">
      <span className="mono text-xs text-[var(--color-text-tertiary)]">
        Questão {index + 1} de {questions.length}
      </span>
      <ExerciseRenderer key={question.id} question={question} onComplete={(r) => handleComplete(question, r)} />
    </div>
  );
}

/** Lição de um tópico — teoria, visualização interativa e prática. Rota: /modulos/:moduleId/:topicId */
export function ConceptLessonPage() {
  const { moduleId, topicId } = useParams<{ moduleId: string; topicId: string }>();
  const topic = topicId ? getTopic(topicId) : undefined;
  const module = moduleId ? getModule(moduleId) : undefined;

  useEffect(() => {
    if (moduleId && topicId) {
      setLastPosition(moduleId, topicId);
    }
  }, [moduleId, topicId]);

  if (!topic || !module) {
    return (
      <Card padding="lg" className="mx-auto max-w-lg text-center">
        <h1 className="mb-2 text-xl font-semibold text-[var(--color-text-primary)]">Tópico não encontrado</h1>
        <p className="mb-6 text-sm text-[var(--color-text-secondary)]">Esse tópico não existe ou o link está incorreto.</p>
        <Link to="/modulos">
          <Button variant="secondary">Ver todos os módulos</Button>
        </Link>
      </Card>
    );
  }

  const quickQuestions = questionsForTopic(topic.id).filter((q) => q.duration === 'quick').slice(0, 3);
  const examStyleQuestions = questionsForTopic(topic.id).filter((q) => q.duration !== 'quick');

  const showExamHotBadge = topic.examLikelihood === 'high' && Boolean(topic.examEvidence);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="mx-auto flex max-w-3xl flex-col gap-6">
      <motion.div variants={itemVariants} className="flex flex-col gap-2">
        <Link to={`/modulos/${module.id}`} className="inline-flex w-fit items-center gap-1 text-xs font-medium text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]">
          <ArrowLeft size={13} /> {module.title}
        </Link>
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">{topic.title}</h1>
          <ExamLikelihoodBadge level={topic.examLikelihood} />
          {showExamHotBadge && (
            <span
              title={topic.examEvidence}
              className="inline-flex cursor-help items-center gap-1 rounded-full border border-[var(--color-danger)]/45 bg-[var(--color-danger-soft)] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-danger)]"
            >
              <Flame size={12} /> Aparece bastante nas provas
            </span>
          )}
        </div>
      </motion.div>

      {topic.scopeNote && (
        <motion.div
          variants={itemVariants}
          className="flex items-start gap-2.5 rounded-xl border border-[var(--color-cyan)]/35 bg-[var(--color-cyan-soft)] px-4 py-3"
        >
          <CircleHelp size={16} className="mt-0.5 shrink-0 text-[var(--color-cyan)]" />
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-cyan)]">P1 ou P2? Fontes divergem</p>
            <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">{topic.scopeNote}</p>
          </div>
        </motion.div>
      )}

      <motion.section variants={itemVariants} aria-labelledby="lesson-know">
        <Card padding="lg" className="flex flex-col gap-3">
          <h2 id="lesson-know" className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
            O que você precisa saber para a P1
          </h2>
          <p className="text-base leading-relaxed text-[var(--color-text-primary)]">{topic.whatYouNeedToKnow}</p>
        </Card>
      </motion.section>

      <motion.section variants={itemVariants} aria-labelledby="lesson-visualize">
        <Card padding="lg" className="flex flex-col gap-4">
          <h2 id="lesson-visualize" className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
            Visualize
          </h2>
          <VisualizeSection topicId={topic.id} />
        </Card>
      </motion.section>

      <motion.section variants={itemVariants} aria-labelledby="lesson-understand">
        <Card padding="lg" className="flex flex-col gap-3">
          <h2 id="lesson-understand" className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
            Entenda
          </h2>
          <ol className="flex flex-col gap-3">
            {topic.understand.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="mono flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-xs font-semibold text-[var(--color-accent-strong)]">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{step}</p>
              </li>
            ))}
          </ol>
        </Card>
      </motion.section>

      {topic.commonPitfall && (
        <motion.section variants={itemVariants} aria-labelledby="lesson-pitfall">
          <Card padding="lg" className="flex flex-col gap-2 border-[var(--color-amber)]/40 bg-[var(--color-amber-soft)]">
            <h2 id="lesson-pitfall" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-amber)]">
              <TriangleAlert size={13} /> Atenção
            </h2>
            <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">{topic.commonPitfall}</p>
          </Card>
        </motion.section>
      )}

      {topic.conceptConflict && (
        <motion.section variants={itemVariants} aria-labelledby="lesson-authors">
          <Card padding="lg" className="flex flex-col gap-5">
            <h2 id="lesson-authors" className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
              Autores
            </h2>

            <div className="flex flex-col gap-1.5">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-accent-strong)]">
                <Star size={13} className="fill-current" /> Definição usada pelo professor
              </span>
              <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">{topic.conceptConflict.professorDefinition}</p>
            </div>

            {topic.conceptConflict.alternatives.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-semibold text-[var(--color-text-tertiary)]">Outros autores</span>
                <div className="flex flex-col gap-2.5">
                  {topic.conceptConflict.alternatives.map((alt, i) => (
                    <div key={i} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3.5 py-2.5">
                      <p className="mb-1 text-xs font-semibold text-[var(--color-text-secondary)]">{alt.author}</p>
                      <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">{alt.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {topic.conceptConflict.hasRealDifference && topic.conceptConflict.differenceExplanation && (
              <div className="flex flex-col gap-1.5 rounded-xl border border-[var(--color-danger)]/40 bg-[var(--color-danger-soft)] px-3.5 py-2.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-danger)]">Diferença importante</span>
                <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">{topic.conceptConflict.differenceExplanation}</p>
              </div>
            )}

            <div className="flex flex-col gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3.5 py-2.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Na P1</span>
              <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">{topic.conceptConflict.examGuidance}</p>
            </div>
          </Card>
        </motion.section>
      )}

      {quickQuestions.length > 0 && (
        <motion.section variants={itemVariants} aria-labelledby="lesson-quiz">
          <Card padding="lg" className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <h2 id="lesson-quiz" className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
                Teste-se
              </h2>
              <Badge tone="accent">rápido</Badge>
            </div>
            <LessonQuizSection questions={quickQuestions} topicId={topic.id} />
          </Card>
        </motion.section>
      )}

      {examStyleQuestions.length > 0 && (
        <motion.section variants={itemVariants} aria-labelledby="lesson-exam-style">
          <Card padding="lg" className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <h2 id="lesson-exam-style" className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
                Questões estilo prova
              </h2>
              <Badge tone="cyan">estilo P1</Badge>
            </div>
            <LessonQuizSection questions={examStyleQuestions} topicId={topic.id} />
          </Card>
        </motion.section>
      )}
    </motion.div>
  );
}
