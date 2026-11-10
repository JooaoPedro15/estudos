import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { buildClosedExamTasks, type ClosedExamTask, type ExamQuestionItem } from '@/content/closedExamTasks';
import { GraphVisualizer } from '@/components/graph/GraphVisualizer';
import { Badge, Button, Card } from '@/components/ui';
import { ExamAnswerPanel } from '@/engine/ExamAnswerPanel';
import { dueCodeIds, hiddenLineIndices, loadCodeMemory, normalizeCodeLine, recordCodeAttempt, saveCodeMemory, type MemoryStage } from '@/store/codeMemory';

type CheckState = 'editing' | 'wrong' | 'correct' | 'revealed' | 'selfCheck';
const stageNames = ['Ordenar linhas', 'Completar lacunas', 'Escrever sem pistas'] as const;

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
  return task?.kind === 'code' ? shuffle(task.lines.map((_, index) => index)) : [];
}

export function ClosedExamSimulator({ examTitle, items, elapsedSeconds, timerEnabled, onlyDue = false }: {
  examTitle: string;
  items: ExamQuestionItem[];
  elapsedSeconds: number;
  timerEnabled: boolean;
  onlyDue?: boolean;
}) {
  const allTasks = useMemo(() => {
    const tasks = buildClosedExamTasks(items);
    if (!onlyDue) return tasks;
    const due = new Set(dueCodeIds(loadCodeMemory()));
    return tasks.filter((task) => task.kind === 'code' && due.has(task.id));
  }, [items, onlyDue]);
  const [memory, setMemory] = useState(loadCodeMemory);
  const [round, setRound] = useState(allTasks);
  const [index, setIndex] = useState(0);
  const [bank, setBank] = useState(() => initialBank(allTasks[0]));
  const [selected, setSelected] = useState<number[]>([]);
  const [choice, setChoice] = useState<string | null>(null);
  const [stage, setStage] = useState<MemoryStage>(() => allTasks[0] ? memory[allTasks[0].id]?.stage ?? 0 : 0);
  const [typedLines, setTypedLines] = useState<Record<number, string>>({});
  const [freeCode, setFreeCode] = useState('');
  const [state, setState] = useState<CheckState>('editing');
  const [hadError, setHadError] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [hint, setHint] = useState('');
  const [firstTry, setFirstTry] = useState(0);
  const [review, setReview] = useState<string[]>([]);
  const [promoted, setPromoted] = useState<string[]>([]);

  const task = round[index];
  const codeCount = allTasks.filter((item) => item.kind === 'code').length;
  const choiceCount = allTasks.length - codeCount;

  function resetFor(next: ClosedExamTask, currentMemory = memory) {
    setBank(initialBank(next));
    setSelected([]);
    setChoice(null);
    setStage(currentMemory[next.id]?.stage ?? 0);
    setTypedLines({});
    setFreeCode('');
    setState('editing');
    setHadError(false);
    setFeedback('');
    setHint('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function next() {
    if (!task) return;
    const cleanSuccess = state === 'correct' && !hadError;
    if (cleanSuccess) setFirstTry((count) => count + 1);
    let currentMemory = memory;
    if (task.kind === 'code') {
      currentMemory = recordCodeAttempt(memory, task.id, cleanSuccess);
      setMemory(currentMemory);
      saveCodeMemory(currentMemory);
      if (cleanSuccess && currentMemory[task.id].stage > stage) {
        setPromoted((before) => before.includes(task.id) ? before : [...before, task.id]);
      }
    }
    if (!cleanSuccess) {
      setReview((before) => before.includes(task.id) ? before : [...before, task.id]);
    }
    const nextIndex = index + 1;
    setIndex(nextIndex);
    if (round[nextIndex]) resetFor(round[nextIndex], currentMemory);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function check() {
    if (!task) return;
    if (task.kind === 'choice') {
      if (!choice) { setFeedback('Escolha uma alternativa antes de conferir.'); return; }
      if (choice === task.correctId) {
        setState('correct');
        setFeedback('Resposta correta.');
      } else {
        setState('wrong');
        setHadError(true);
        setFeedback('Resposta incorreta. Veja a alternativa correta e a explicação.');
      }
      return;
    }
    if (stage === 1) {
      const missing = hiddenLineIndices(task.lines.length);
      if (missing.some((position) => !typedLines[position]?.trim())) {
        setFeedback('Preencha todas as linhas ocultas antes de conferir.');
        return;
      }
      const firstWrong = missing.find((position) => normalizeCodeLine(typedLines[position]) !== normalizeCodeLine(task.lines[position]));
      if (firstWrong !== undefined) {
        setState('wrong'); setHadError(true);
        setFeedback(`Confira a linha ${firstWrong + 1}. Você pode ajustar e tentar novamente.`);
        setHint(`No gabarito: ${task.lines[firstWrong]}`);
      } else {
        setState('correct'); setHint('');
        setFeedback(hadError ? 'Agora está certo. Este trecho ficará para revisão.' : 'Lacunas corretas de primeira! Na próxima vez, escreva sem pistas.');
      }
      return;
    }
    if (stage === 2) {
      if (!freeCode.trim()) { setFeedback('Escreva o trecho antes de conferir.'); return; }
      setState('selfCheck');
      setFeedback('Compare com a resposta-modelo. Considere a lógica, não apenas espaços ou nomes de variáveis.');
      return;
    }
    if (selected.length !== task.lines.length) {
      setFeedback('Coloque todas as linhas antes de conferir.');
      return;
    }
    const firstWrong = selected.findIndex((line, position) => line !== position);
    if (firstWrong === -1) {
      setState('correct');
      setHint('');
      setFeedback(hadError ? 'Agora está certo. Você poderá revisar esse trecho ao final.' : 'Código correto de primeira! Na próxima vez, complete lacunas.');
    } else {
      const right = selected.filter((line, position) => line === position).length;
      setState('wrong');
      setHadError(true);
      setFeedback(`${right} de ${task.lines.length} linhas na posição do gabarito. Revise a linha ${firstWrong + 1}.`);
    }
  }

  function showHint() {
    if (task?.kind !== 'code') return;
    if (stage === 2) {
      setHint(`Primeira linha: ${task.lines[0]}`);
      setHadError(true);
      return;
    }
    if (stage === 1) {
      const position = hiddenLineIndices(task.lines.length).find((index) => !typedLines[index]?.trim()) ?? hiddenLineIndices(task.lines.length)[0];
      setHint(`Linha ${position + 1}: ${task.lines[position]}`);
      setHadError(true);
      return;
    }
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
    setFeedback(task?.kind === 'code' ? 'Resposta exibida. Esse código entrará na revisão final.' : 'Resposta exibida. Confira a explicação abaixo.');
  }

  if (!task) {
    const reviewTasks = allTasks.filter((item) => review.includes(item.id));
    const promotedTasks = allTasks.filter((item) => promoted.includes(item.id) && !review.includes(item.id));
    if (onlyDue && round.length === 0) return <Card padding="lg" className="mx-auto max-w-2xl space-y-4">
      <Badge tone="success">Revisão em dia</Badge>
      <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">Nenhum código venceu hoje</h1>
      <p className="text-sm text-[var(--color-text-secondary)]">Faça um simulado P2 no modo de memorização para iniciar ou continue treinando questões novas.</p>
      <Link to="/simulado"><Button>Voltar aos simulados</Button></Link>
    </Card>;
    return (
      <Card padding="lg" className="mx-auto max-w-2xl space-y-5">
        <Badge tone="success">Rodada concluída</Badge>
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">{examTitle} — fechado</h1>
        <p className="text-[var(--color-text-secondary)]">
          {firstTry} de {round.length} desafios corretos de primeira. {reviewTasks.length} desafio(s) para revisar.
        </p>
        <div className="flex flex-wrap gap-2">
          {reviewTasks.length > 0 && <Button onClick={() => {
            setRound(reviewTasks);
            setIndex(0);
            setFirstTry(0);
            setReview([]);
            resetFor(reviewTasks[0]);
          }}>Repetir erros agora</Button>}
          {promotedTasks.length > 0 && <Button variant="secondary" onClick={() => {
            setRound(promotedTasks);
            setIndex(0);
            setFirstTry(0);
            setPromoted([]);
            resetFor(promotedTasks[0]);
          }}>Treinar próxima etapa ({promotedTasks.length})</Button>}
          <Link to="/simulado"><Button variant="secondary">Sortear outro simulado</Button></Link>
        </div>
      </Card>
    );
  }

  const locked = state === 'correct' || state === 'revealed' || state === 'selfCheck' || (task.kind === 'choice' && state === 'wrong');
  const available = task.kind === 'code' ? bank.filter((line) => !selected.includes(line)) : [];

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
          <p className="text-sm text-[var(--color-text-secondary)]">Desafio {index + 1} de {round.length} · {codeCount} código(s) e {choiceCount} alternativa(s) neste sorteio</p>
        </div>
        {timerEnabled && <span className="mono text-sm text-[var(--color-text-secondary)]">⏱ {Math.floor(elapsedSeconds / 60)}:{String(elapsedSeconds % 60).padStart(2, '0')}</span>}
      </header>

      <Card padding="md" className="space-y-3">
        <div className="flex flex-wrap gap-2 text-xs text-[var(--color-text-tertiary)]">
          <Badge tone={task.kind === 'code' ? 'success' : 'amber'}>{task.kind === 'code' ? 'Montar código' : task.dimension}</Badge>
          <span>Questão {task.questionNumber} · peso original {task.weightPercent}%</span>
          {task.kind === 'code' && <span>Código {task.blockNumber}{task.codeName ? ` · ${task.codeName}` : ''} · parte {task.partNumber}/{task.partCount}</span>}
          {task.kind === 'code' && <Badge tone="amber">Etapa {stage + 1}/3 · {stageNames[stage]}</Badge>}
        </div>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-text-primary)]">{task.question.prompt}</p>
        {task.question.displayGraphs && <GraphVisualizer graph={task.question.displayGraphs.a} interactive={false} showWeights height={230} />}
        {task.kind === 'code' && task.previousLine && <p className="rounded-lg bg-[var(--color-bg-elevated)] p-2 text-xs text-[var(--color-text-secondary)]">Linha anterior, já fixa: <code className="whitespace-pre-wrap">{task.previousLine}</code></p>}
        {task.kind === 'code' && <p className="text-xs text-[var(--color-text-tertiary)]">{stage === 0 ? 'Ordene as linhas. A ordem das inicializações independentes pode variar na prática; aqui conferimos uma ordem-modelo.' : stage === 1 ? 'Lembre as linhas ocultas antes de consultar a resposta.' : 'Escreva este trecho inteiro de memória; depois compare sua lógica com o gabarito.'}</p>}
      </Card>

      {task.kind === 'code' && stage === 0 ? <div className="grid gap-4 lg:grid-cols-2">
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
      </div> : task.kind === 'code' && stage === 1 ? <Card padding="md" className="space-y-3">
        <h2 className="font-semibold text-[var(--color-text-primary)]">Complete as linhas ocultas</h2>
        <ol className="space-y-2">
          {task.lines.map((line, position) => <li key={position} className="flex items-center gap-2">
            <span className="mono w-6 shrink-0 text-xs text-[var(--color-text-tertiary)]">{position + 1}</span>
            {hiddenLineIndices(task.lines.length).includes(position) ? <input aria-label={`Linha ${position + 1}`} type="text" spellCheck={false} disabled={locked} value={typedLines[position] ?? ''} onChange={(event) => { setTypedLines((before) => ({ ...before, [position]: event.target.value })); setState('editing'); setFeedback(''); setHint(''); }} className="mono min-w-0 flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2 text-xs text-[var(--color-text-primary)]" placeholder="Escreva esta linha" /> : <code className="whitespace-pre-wrap break-words text-xs text-[var(--color-text-primary)]">{line}</code>}
          </li>)}
        </ol>
      </Card> : task.kind === 'code' ? <Card padding="md" className="space-y-3">
        <h2 className="font-semibold text-[var(--color-text-primary)]">Escreva o pseudocódigo sem pistas</h2>
        <textarea aria-label="Seu pseudocódigo" spellCheck={false} disabled={locked} value={freeCode} onChange={(event) => setFreeCode(event.target.value)} rows={Math.max(6, task.lines.length + 1)} className="mono w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 text-xs leading-5 text-[var(--color-text-primary)]" placeholder="Escreva as linhas de memória..." />
      </Card> : <Card padding="md" className="space-y-3">
        <h2 className="font-semibold text-[var(--color-text-primary)]">{task.stem}</h2>
        <div className="flex flex-col gap-2">
          {task.options.map((option) => <button key={option.id} type="button" disabled={locked} onClick={() => { setChoice(option.id); setFeedback(''); }} className={clsx('rounded-lg border p-3 text-left text-sm leading-relaxed transition-colors', choice === option.id ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)]' : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-strong)]', locked && 'opacity-70')}>
            {option.label}
          </button>)}
        </div>
      </Card>}

      <Card padding="md" className="space-y-3">
        {feedback && <p role="status" className={clsx('text-sm font-medium', state === 'correct' ? 'text-emerald-500' : 'text-[var(--color-text-primary)]')}>{feedback}</p>}
        {hint && <p className="mono whitespace-pre-wrap rounded-lg bg-[var(--color-bg-elevated)] p-2 text-xs text-[var(--color-text-secondary)]">{hint}</p>}
        {(state === 'revealed' || state === 'selfCheck') && task.kind === 'code' && <pre className="overflow-x-auto rounded-lg bg-[var(--color-bg-elevated)] p-3 text-xs leading-5 text-[var(--color-text-primary)]">{task.lines.join('\n')}</pre>}
        {locked && task.kind === 'choice' && <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]"><strong>Resposta:</strong> {task.options.find((option) => option.id === task.correctId)?.label}<br /><strong>Por quê:</strong> {task.explanation}</p>}
        {locked && <ExamAnswerPanel key={task.id} question={task.question} defaultOpen={false} />}
        <div className="flex flex-wrap gap-2">
          {state === 'selfCheck' ? <>
            <Button onClick={() => { setState('correct'); setFeedback('Você indicou que acertou. O trecho será agendado para revisão.'); }}>Acertei a lógica sem consultar</Button>
            <Button variant="secondary" onClick={() => { setState('revealed'); setHadError(true); setFeedback('Trecho marcado para revisão.'); }}>Ainda não acertei</Button>
          </> : !locked ? <>
            <Button onClick={check}>Conferir</Button>
            {task.kind === 'code' && <Button variant="secondary" onClick={showHint}>Dica</Button>}
            <Button variant="ghost" onClick={reveal}>Mostrar resposta</Button>
          </> : <Button onClick={next}>Próximo desafio</Button>}
        </div>
      </Card>
    </div>
  );
}
