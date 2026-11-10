import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { buildClosedExamTasks, type ClosedExamTask, type ExamQuestionItem } from '@/content/closedExamTasks';
import { GraphVisualizer } from '@/components/graph/GraphVisualizer';
import { Badge, Button, Card } from '@/components/ui';
import { ExamAnswerPanel } from '@/engine/ExamAnswerPanel';

type CheckState = 'editing' | 'wrong' | 'correct' | 'revealed';

function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  if (out.length > 1 && out.every((item, index) => item === items[index])) {
    [out[0], out[1]] = [out[1], out[0]];
  }
  return out;
}

function initialBank(task: ClosedExamTask | undefined): number[] {
  return task ? shuffle(task.lines.map((_, index) => index)) : [];
}

export function ClosedExamSimulator({ examTitle, items, elapsedSeconds, timerEnabled }: {
  examTitle: string;
  items: ExamQuestionItem[];
  elapsedSeconds: number;
  timerEnabled: boolean;
}) {
  const allTasks = useMemo(() => buildClosedExamTasks(items), [items]);
  const [round, setRound] = useState(allTasks);
  const [index, setIndex] = useState(0);
  const [bank, setBank] = useState(() => initialBank(allTasks[0]));
  const [selected, setSelected] = useState<number[]>([]);
  const [state, setState] = useState<CheckState>('editing');
  const [hadError, setHadError] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [hint, setHint] = useState('');
  const [firstTry, setFirstTry] = useState(0);
  const [review, setReview] = useState<string[]>([]);

  const task = round[index];
  const codeCount = allTasks.length;

  function resetFor(next: ClosedExamTask) {
    setBank(initialBank(next));
    setSelected([]);
    setState('editing');
    setHadError(false);
    setFeedback('');
    setHint('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function next() {
    if (!task) return;
    if (state === 'correct' && !hadError) setFirstTry((count) => count + 1);
    if (hadError || state === 'revealed') {
      setReview((before) => before.includes(task.id) ? before : [...before, task.id]);
    }
    const nextIndex = index + 1;
    setIndex(nextIndex);
    if (round[nextIndex]) resetFor(round[nextIndex]);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function check() {
    if (!task) return;
    if (selected.length !== task.lines.length) {
      setFeedback('Coloque todas as linhas antes de conferir.');
      return;
    }
    const firstWrong = selected.findIndex((line, position) => line !== position);
    if (firstWrong === -1) {
      setState('correct');
      setHint('');
      setFeedback(hadError ? 'Agora está certo. Você poderá revisar esse trecho ao final.' : 'Código correto de primeira!');
    } else {
      const right = selected.filter((line, position) => line === position).length;
      setState('wrong');
      setHadError(true);
      setFeedback(`${right} de ${task.lines.length} linhas na posição do gabarito. Revise a linha ${firstWrong + 1}.`);
    }
  }

  function showHint() {
    if (!task) return;
    const wrong = selected.findIndex((line, position) => line !== position);
    const position = wrong >= 0 ? wrong : selected.length;
    if (position >= task.lines.length) {
      setFeedback('Todas as linhas foram colocadas. Confira a ordem.');
      return;
    }
    setHint(`A linha ${position + 1} é: ${task.lines[position]}`);
    setHadError(true);
  }

  function reveal() {
    setState('revealed');
    setHadError(true);
    setHint('');
    setFeedback('Resposta exibida. Esse código entrará na revisão final.');
  }

  if (!task) {
    const reviewTasks = allTasks.filter((item) => review.includes(item.id));
    return (
      <Card padding="lg" className="mx-auto max-w-2xl space-y-5">
        <Badge tone="success">Rodada concluída</Badge>
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">{examTitle} — fechado</h1>
        <p className="text-[var(--color-text-secondary)]">
          {firstTry} de {round.length} desafios corretos de primeira. {reviewTasks.length} trecho(s) de código para revisar.
        </p>
        <div className="flex flex-wrap gap-2">
          {reviewTasks.length > 0 && <Button onClick={() => {
            setRound(reviewTasks);
            setIndex(0);
            setFirstTry(0);
            setReview([]);
            resetFor(reviewTasks[0]);
          }}>Repetir códigos errados</Button>}
          <Link to="/simulado"><Button variant="secondary">Sortear outro simulado</Button></Link>
        </div>
      </Card>
    );
  }

  const locked = state === 'correct' || state === 'revealed';
  const available = bank.filter((line) => !selected.includes(line));

  function addLine(line: number) {
    if (locked) return;
    setSelected((before) => [...before, line]);
    setState('editing');
    setFeedback('');
    setHint('');
  }

  function moveLine(position: number, direction: -1 | 1) {
    if (locked || position + direction < 0 || position + direction >= selected.length) return;
    setSelected((before) => {
      const nextSelection = [...before];
      [nextSelection[position], nextSelection[position + direction]] = [nextSelection[position + direction], nextSelection[position]];
      return nextSelection;
    });
    setState('editing');
    setFeedback('');
    setHint('');
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link to="/simulado" className="text-sm text-[var(--color-accent)] hover:underline">← Simulados</Link>
          <h1 className="mt-2 text-xl font-semibold text-[var(--color-text-primary)]">{examTitle} · quebra-código</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">Desafio {index + 1} de {round.length} · {codeCount} trecho(s) de código neste sorteio</p>
        </div>
        {timerEnabled && <span className="mono text-sm text-[var(--color-text-secondary)]">⏱ {Math.floor(elapsedSeconds / 60)}:{String(elapsedSeconds % 60).padStart(2, '0')}</span>}
      </header>

      <Card padding="md" className="space-y-3">
        <div className="flex flex-wrap gap-2 text-xs text-[var(--color-text-tertiary)]">
          <Badge tone="success">Montar código</Badge>
          <span>Questão {task.questionNumber} · peso original {task.weightPercent}%</span>
          <span>Código {task.blockNumber} · parte {task.partNumber}/{task.partCount}</span>
        </div>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-text-primary)]">{task.question.prompt}</p>
        {task.question.displayGraphs && <GraphVisualizer graph={task.question.displayGraphs.a} interactive={false} showWeights height={230} />}
        {task.previousLine && <p className="rounded-lg bg-[var(--color-bg-elevated)] p-2 text-xs text-[var(--color-text-secondary)]">Linha anterior, já fixa: <code className="whitespace-pre-wrap">{task.previousLine}</code></p>}
        <p className="text-xs text-[var(--color-text-tertiary)]">Monte o pseudocódigo correspondente à resposta-modelo. A ordem das inicializações independentes pode variar na prática; aqui conferimos uma ordem-modelo.</p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
          <Card padding="md" className="min-w-0">
            <h2 className="mb-3 font-semibold text-[var(--color-text-primary)]">Sua montagem ({selected.length}/{task.lines.length})</h2>
            <ol className="flex flex-col gap-2">
              {selected.map((line, position) => <li key={line} className={clsx('flex min-w-0 items-center gap-2 rounded-lg border p-2', state === 'wrong' && line !== position ? 'border-amber-500/70 bg-amber-500/10' : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)]')}>
                <span className="mono w-5 shrink-0 text-xs text-[var(--color-text-tertiary)]">{position + 1}</span>
                <code className="min-w-0 flex-1 whitespace-pre-wrap break-words text-xs leading-5 text-[var(--color-text-primary)]">{task.lines[line]}</code>
                {!locked && <span className="flex shrink-0 gap-1">
                  <button type="button" onClick={() => moveLine(position, -1)} disabled={position === 0} aria-label={`Mover linha ${position + 1} para cima`} className="control-btn h-8 w-8 disabled:opacity-30">↑</button>
                  <button type="button" onClick={() => moveLine(position, 1)} disabled={position === selected.length - 1} aria-label={`Mover linha ${position + 1} para baixo`} className="control-btn h-8 w-8 disabled:opacity-30">↓</button>
                  <button type="button" onClick={() => { setSelected((before) => before.filter((_, i) => i !== position)); setState('editing'); setFeedback(''); }} aria-label={`Remover linha ${position + 1}`} className="control-btn h-8 w-8">×</button>
                </span>}
              </li>)}
              {!locked && selected.length < task.lines.length && <li className="rounded-lg border border-dashed border-[var(--color-border)] p-3 text-center text-xs text-[var(--color-text-tertiary)]">Escolha a próxima linha</li>}
            </ol>
          </Card>
          <Card padding="md" className="min-w-0">
            <h2 className="mb-3 font-semibold text-[var(--color-text-primary)]">Linhas embaralhadas</h2>
            <div className="flex flex-col gap-2">
              {available.map((line) => <button key={line} type="button" disabled={locked} onClick={() => addLine(line)} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2.5 text-left hover:border-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] disabled:opacity-50">
                <code className="whitespace-pre-wrap break-words text-xs leading-5 text-[var(--color-text-primary)]">{task.lines[line]}</code>
              </button>)}
            </div>
          </Card>
      </div>

      <Card padding="md" className="space-y-3">
        {feedback && <p role="status" className={clsx('text-sm font-medium', state === 'correct' ? 'text-emerald-500' : 'text-[var(--color-text-primary)]')}>{feedback}</p>}
        {hint && <p className="mono whitespace-pre-wrap rounded-lg bg-[var(--color-bg-elevated)] p-2 text-xs text-[var(--color-text-secondary)]">{hint}</p>}
        {state === 'revealed' && <pre className="overflow-x-auto rounded-lg bg-[var(--color-bg-elevated)] p-3 text-xs leading-5 text-[var(--color-text-primary)]">{task.lines.join('\n')}</pre>}
        {locked && <ExamAnswerPanel key={task.id} question={task.question} defaultOpen={false} />}
        <div className="flex flex-wrap gap-2">
          {!locked ? <>
            <Button onClick={check}>Conferir</Button>
            <Button variant="secondary" onClick={showHint}>Dica</Button>
            <Button variant="ghost" onClick={reveal}>Mostrar resposta</Button>
          </> : <Button onClick={next}>Próximo desafio</Button>}
        </div>
      </Card>
    </div>
  );
}
