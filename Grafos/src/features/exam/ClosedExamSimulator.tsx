import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { buildClosedExamTasks, type ClosedExamTask, type ExamQuestionItem } from '@/content/closedExamTasks';
import { buildCloze, firstLetters, keyTerms, normalizeTerm } from '@/content/answerParts';
import { GraphVisualizer } from '@/components/graph/GraphVisualizer';
import { Badge, Button, Card } from '@/components/ui';
import { ExamAnswerPanel } from '@/engine/ExamAnswerPanel';
import { dueIds, loadMemory, recordAttempt, saveMemory, type AnswerMemory, type MemoryStage } from '@/store/answerMemory';

type CheckState = 'editing' | 'wrong' | 'correct' | 'revealed' | 'selfCheck';
const stageNames = ['Decorar aos poucos', 'Completar lacunas', 'Escrever de memória'] as const;
/** Depois de um erro a parte volta quase na hora; depois de um acerto que ainda precisa de confirmação, um pouco mais longe. */
const GAP_AFTER_ERROR = 2;
const GAP_AFTER_SUCCESS = 4;

function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  if (out.length > 1 && out.every((item, index) => item === items[index])) [out[0], out[1]] = [out[1], out[0]];
  return out;
}

const minStageOf = (task: ClosedExamTask): MemoryStage => task.kind === 'full' ? 2 : 0;
const stageOf = (task: ClosedExamTask, memory: AnswerMemory): MemoryStage => Math.max(minStageOf(task), memory[task.id]?.stage ?? 0) as MemoryStage;
/** Na primeira etapa a parte já abre na recitação cumulativa: duas linhas, esconde, repete, soma mais uma. */
const drillFor = (task: ClosedExamTask | undefined, stage: MemoryStage) => task?.kind === 'part' && stage === 0 ? { count: Math.min(2, task.part.units.length), hidden: false } : null;

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
    const due = new Set(dueIds(loadMemory()));
    return tasks.filter((task) => due.has(task.id));
  }, [items, onlyDue]);
  const [memory, setMemory] = useState(loadMemory);
  const [round, setRound] = useState(allTasks);
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState<MemoryStage>(() => allTasks[0] ? stageOf(allTasks[0], memory) : 0);
  const [fills, setFills] = useState<Record<number, number>>({});
  const [wrongBlanks, setWrongBlanks] = useState<number[]>([]);
  const [choice, setChoice] = useState<string | null>(null);
  const [freeText, setFreeText] = useState('');
  const [state, setState] = useState<CheckState>('editing');
  const [hadError, setHadError] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [hint, setHint] = useState('');
  /** Recitação cumulativa: decora as primeiras linhas, esconde, repete e soma uma linha por vez. */
  const [drill, setDrill] = useState(() => drillFor(allTasks[0], stage));
  /** Acertos limpos que cada parte ainda deve nesta sessão (errou = deve dois, espaçados). */
  const [owed, setOwed] = useState<Record<string, number>>({});
  const [stats, setStats] = useState({ clean: 0, total: 0 });

  const task = round[index];
  const part = task?.kind === 'part' ? task.part : undefined;

  const cloze = useMemo(() => part ? buildCloze(part, index + (memory[task.id]?.attempts ?? 0)) : { units: [], answers: [] },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- as lacunas ficam fixas enquanto a tarefa está na tela
    [task?.id, index]);
  const wordBank = useMemo(() => {
    if (task?.kind !== 'part') return [];
    return shuffle([...cloze.answers, ...shuffle(task.distractors).slice(0, Math.min(4, Math.max(2, Math.ceil(cloze.answers.length / 2))))]);
  }, [cloze, task]);

  function resetInputs(nextTask?: ClosedExamTask, nextStage: MemoryStage = 1) {
    setFills({}); setWrongBlanks([]); setChoice(null); setFreeText('');
    setState('editing'); setHadError(false); setFeedback(''); setHint(''); setDrill(drillFor(nextTask, nextStage));
  }

  function show(nextRound: ClosedExamTask[], nextIndex: number, currentMemory = memory) {
    setRound(nextRound);
    setIndex(nextIndex);
    const next = nextRound[nextIndex];
    if (next) setStage(stageOf(next, currentMemory));
    resetInputs(next, next ? stageOf(next, currentMemory) : 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function next() {
    if (!task) return;
    const clean = state === 'correct' && !hadError;
    setStats((before) => ({ clean: before.clean + (clean ? 1 : 0), total: before.total + 1 }));
    let currentMemory = memory;
    if (task.kind !== 'choice') {
      currentMemory = recordAttempt(memory, task.id, clean, stage, minStageOf(task));
      setMemory(currentMemory);
      saveMemory(currentMemory);
    }
    // A parte sobe as três etapas dentro da própria questão; quem errou deve dois acertos escrevendo de memória.
    const climbing = clean && task.kind === 'part' && stage < 2;
    const remaining = !clean ? 2 : climbing ? owed[task.id] ?? 1 : (owed[task.id] ?? 1) - 1;
    setOwed((before) => ({ ...before, [task.id]: remaining }));
    let nextRound = round;
    if (remaining > 0 && !(task.kind === 'choice' && clean)) {
      // A repetição fica dentro da mesma questão, antes da "resposta inteira".
      let limit = round.findIndex((item, position) => position > index && (item.question.id !== task.question.id || item.kind === 'full'));
      if (limit === -1) limit = round.length;
      const position = Math.max(index + 1, Math.min(index + 1 + (clean ? GAP_AFTER_SUCCESS : GAP_AFTER_ERROR), limit));
      nextRound = [...round.slice(0, position), task, ...round.slice(position)];
    }
    show(nextRound, index + 1, currentMemory);
  }

  function check() {
    if (!task) return;
    if (task.kind === 'choice') {
      if (!choice) { setFeedback('Escolha uma alternativa antes de conferir.'); return; }
      if (choice === task.correctId) { setState('correct'); setFeedback('Resposta correta.'); }
      else { setState('wrong'); setHadError(true); setFeedback('Resposta incorreta. Veja a alternativa correta e a explicação.'); }
      return;
    }
    if (task.kind === 'full' || stage === 2) {
      setState('selfCheck');
      setFeedback('Compare com o gabarito. Vale a ideia completa e os termos certos, não as palavras idênticas.');
      return;
    }
    if (cloze.answers.some((_, blank) => fills[blank] === undefined)) { setFeedback('Preencha todas as lacunas antes de conferir.'); return; }
    const wrong = cloze.answers.flatMap((answer, blank) => normalizeTerm(wordBank[fills[blank]]) === normalizeTerm(answer) ? [] : [blank]);
    setWrongBlanks(wrong);
    if (wrong.length) {
      setState('wrong'); setHadError(true);
      setFeedback(`${wrong.length} lacuna(s) errada(s), marcadas em laranja. Toque nelas para trocar.`);
    } else {
      setState('correct');
      setFeedback(hadError ? 'Agora está certo. Esta parte volta daqui a pouco para confirmar.' : 'Tudo certo de primeira! Ela volta daqui a pouco aberta, para você escrever de memória.');
    }
  }

  function showHint() {
    if (!task || task.kind === 'choice') return;
    setHadError(true);
    if (task.kind === 'full') { setHint('Siga o esqueleto acima: escreva uma parte de cada vez, na ordem.'); return; }
    if (stage === 2) { setHint(task.part.units.map(firstLetters).join('\n')); return; }
    const blank = cloze.answers.findIndex((answer, position) => fills[position] === undefined || normalizeTerm(wordBank[fills[position]]) !== normalizeTerm(answer));
    if (blank >= 0) setHint(`Lacuna ${blank + 1}: ${cloze.answers[blank]}`);
  }

  function reveal() {
    setState('revealed'); setHadError(true); setHint('');
    setFeedback('Leia com atenção e em voz alta. Esta parte volta daqui a pouco para você tentar sem olhar.');
  }

  if (!task) {
    if (round.length === 0) return <Card padding="lg" className="mx-auto max-w-2xl space-y-4">
      <Badge tone="success">Revisão em dia</Badge>
      <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">Nada para revisar agora</h1>
      <p className="text-sm text-[var(--color-text-secondary)]">As partes que você treinou voltam aqui quando o intervalo vencer. Enquanto isso, memorize outra prova.</p>
      <Link to="/simulado"><Button>Voltar às provas</Button></Link>
    </Card>;
    const pending = allTasks.filter((item) => item.kind !== 'choice' && stageOf(item, memory) < 2);
    return (
      <Card padding="lg" className="mx-auto max-w-2xl space-y-5">
        <Badge tone="success">Rodada concluída</Badge>
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">{examTitle} — memorização</h1>
        <p className="text-[var(--color-text-secondary)]">
          {stats.clean} de {stats.total} tentativas certas de primeira. {pending.length > 0 ? `${pending.length} parte(s) ainda não chegaram a "escrever de memória".` : 'Todas as partes já estão na etapa de escrever de memória.'}
        </p>
        <div className="flex flex-wrap gap-2">
          {pending.length > 0 && <Button onClick={() => { setOwed({}); setStats({ clean: 0, total: 0 }); show(pending, 0); }}>Subir a próxima etapa ({pending.length})</Button>}
          <Button variant="secondary" onClick={() => { setOwed({}); setStats({ clean: 0, total: 0 }); show(allTasks, 0); }}>Repetir tudo</Button>
          <Link to="/simulado/revisao"><Button variant="secondary">Revisão espaçada</Button></Link>
          <Link to="/simulado"><Button variant="ghost">Outras provas</Button></Link>
        </div>
      </Card>
    );
  }

  const locked = state === 'correct' || state === 'revealed' || state === 'selfCheck' || (task.kind === 'choice' && state === 'wrong');
  const edit = () => { if (state === 'wrong') setState('editing'); setFeedback(''); setHint(''); };
  const questionStarts = round.flatMap((item, position) => position === 0 || round[position - 1].question.id !== item.question.id ? [{ position, number: item.questionNumber }] : []);
  const remainingInQuestion = round.slice(index).findIndex((item) => item.question.id !== task.question.id);
  const leftHere = remainingInQuestion === -1 ? round.length - index : remainingInQuestion;
  const terms = task.kind === 'full' ? task.terms : part ? keyTerms(part) : [];
  const typed = normalizeTerm(freeText);
  const missing = typed ? terms.filter((term) => !typed.includes(normalizeTerm(term))) : [];
  const activeBlank = cloze.answers.findIndex((_, blank) => fills[blank] === undefined);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link to="/simulado" className="text-sm text-[var(--color-accent)] hover:underline">← Provas e simulados</Link>
          <h1 className="mt-2 text-xl font-semibold text-[var(--color-text-primary)]">{examTitle} · memorização</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">Uma questão por vez: faltam {leftHere} passo(s) nesta questão · {round.length - index} no total</p>
        </div>
        {timerEnabled && <span className="mono text-sm text-[var(--color-text-secondary)]">⏱ {Math.floor(elapsedSeconds / 60)}:{String(elapsedSeconds % 60).padStart(2, '0')}</span>}
      </header>

      {questionStarts.length > 1 && <nav aria-label="Questões" className="flex flex-wrap gap-2">
        {questionStarts.map(({ position, number }) => <button key={position} type="button" onClick={() => show(round, position)} className={clsx('rounded-full border px-3 py-1 text-xs font-semibold', number === task.questionNumber && round[position].question.id === task.question.id ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]' : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]')}>Questão {number}</button>)}
      </nav>}

      <Card padding="md" className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-tertiary)]">
          <span>Questão {task.questionNumber} · peso original {task.weightPercent}%</span>
          {(memory[task.id]?.lapses ?? 0) > 0 && <Badge tone="danger">{memory[task.id].lapses} erro(s)</Badge>}
        </div>
        <details open={task.kind !== 'part' || task.partNumber === 1}>
          <summary className="cursor-pointer text-xs font-semibold text-[var(--color-accent)]">Enunciado completo</summary>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-text-primary)]">{task.question.prompt}</p>
          {task.question.displayGraphs && <GraphVisualizer graph={task.question.displayGraphs.a} interactive={false} showWeights height={230} />}
        </details>
        {task.kind !== 'choice' && <div className="rounded-lg border border-[var(--color-border-soft)] bg-[var(--color-bg-elevated)] p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Esqueleto da resposta — decore também esta ordem</p>
          <ol className="flex flex-wrap gap-1.5">
            {task.outline.map((entry, position) => <li key={entry.id} className={clsx('rounded-md border px-2 py-1 text-xs', entry.id === task.id ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] font-semibold text-[var(--color-accent)]' : (memory[entry.id]?.stage ?? 0) === 2 ? 'border-[var(--color-success)]/40 text-[var(--color-success)]' : 'border-[var(--color-border)] text-[var(--color-text-secondary)]')}>
              {position + 1}. {entry.itemLabel ? `${entry.itemLabel} ` : ''}{entry.label}
            </li>)}
          </ol>
        </div>}
      </Card>

      {task.kind === 'part' && <Card padding="md" className="space-y-2 border-[var(--color-accent)]/50">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="amber">{part!.itemLabel ? `Item ${part!.itemLabel}` : 'Questão inteira'}</Badge>
          <strong className="text-sm text-[var(--color-text-primary)]">Parte {task.partNumber} de {task.outline.length}: {part!.label}</strong>
        </div>
        {part!.itemPrompt && <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]"><strong>O que este item pede:</strong> {part!.itemPrompt}</p>}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {stageNames.map((name, position) => <button key={name} type="button" disabled={locked} onClick={() => { setStage(position as MemoryStage); resetInputs(task, position as MemoryStage); }} className={clsx('rounded-full border px-2.5 py-1 text-xs', position === stage ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] font-semibold text-[var(--color-accent)]' : 'border-[var(--color-border)] text-[var(--color-text-tertiary)]', 'disabled:opacity-40')}>{position + 1}. {name}</button>)}
        </div>
        {part!.previousUnit && <p className="rounded-lg bg-[var(--color-bg-elevated)] p-2 text-xs text-[var(--color-text-secondary)]">Logo antes vem: <span className="whitespace-pre-wrap">{part!.previousUnit}</span></p>}
      </Card>}

      {task.kind === 'full' && <Card padding="md" className="space-y-2 border-[var(--color-accent)]/50">
        <Badge tone="amber">Resposta inteira</Badge>
        <p className="text-sm text-[var(--color-text-primary)]">Agora junte tudo: escreva (ou diga em voz alta) a resposta completa da questão {task.questionNumber}, parte por parte, seguindo o esqueleto. Depois compare com o gabarito.</p>
      </Card>}

      {drill && part ? <Card padding="md" className="space-y-4 border-[var(--color-accent)]/50">
        <div>
          <h2 className="font-semibold text-[var(--color-text-primary)]">Decorar aos poucos — {drill.count} de {part.units.length} {part.mode === 'code' ? 'linha(s)' : 'trecho(s)'}</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">{drill.hidden ? 'Repita tudo de cabeça, em voz alta, do começo até aqui. Só então confira.' : 'Leia em voz alta até conseguir repetir sem olhar. Depois esconda.'}</p>
        </div>
        <ol className="flex flex-col gap-2">
          {part.units.slice(0, drill.count).map((unit, position) => <li key={position} className={clsx('flex gap-2 rounded-lg border p-2.5', position === drill.count - 1 ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)]' : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)]')}>
            <span className="mono w-5 shrink-0 text-xs text-[var(--color-text-tertiary)]">{position + 1}</span>
            <span className={clsx('min-w-0 flex-1 whitespace-pre-wrap break-words', drill.hidden ? 'select-none text-[var(--color-text-tertiary)]' : 'text-[var(--color-text-primary)]', part.mode === 'code' ? 'mono text-xs leading-5' : 'text-sm leading-relaxed')}>{drill.hidden ? '• • •' : unit}</span>
          </li>)}
        </ol>
        <div className="flex flex-wrap gap-2">
          {drill.hidden ? <>
            <Button onClick={() => {
              if (drill.count < part.units.length) setDrill({ count: drill.count + 1, hidden: false });
              else if (stage === 0) { setDrill(null); setState('correct'); setFeedback('Parte inteira repetida de cabeça. Ela volta daqui a pouco fechada, para você completar as lacunas.'); }
              else { setDrill(null); setFeedback('Parte inteira repetida de cabeça. Agora faça o exercício sem olhar.'); }
            }}>{drill.count < part.units.length ? 'Lembrei tudo: somar a próxima' : stage === 0 ? 'Lembrei tudo: parte decorada' : 'Lembrei tudo: ir para o exercício'}</Button>
            <Button variant="secondary" onClick={() => setDrill({ ...drill, hidden: false })}>Travei: ver de novo</Button>
          </> : <Button onClick={() => setDrill({ ...drill, hidden: true })}>Esconder e repetir de cabeça</Button>}
          {stage !== 0 && <Button variant="ghost" onClick={() => setDrill(null)}>Sair</Button>}
        </div>
      </Card> : task.kind === 'choice' ? <Card padding="md" className="space-y-3">
        <div className="flex flex-col gap-2">
          {task.options.map((option) => <button key={option.id} type="button" disabled={locked} onClick={() => { setChoice(option.id); setFeedback(''); }} className={clsx('rounded-lg border p-3 text-left text-sm leading-relaxed transition-colors', choice === option.id ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)]' : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-strong)]', locked && 'opacity-70')}>{option.label}</button>)}
        </div>
      </Card> : task.kind === 'full' || stage === 2 ? <Card padding="md" className="space-y-3">
        <h2 className="font-semibold text-[var(--color-text-primary)]">{task.kind === 'full' ? 'Escreva a resposta inteira' : 'Escreva esta parte sem pistas'}</h2>
        <textarea aria-label="Sua resposta" spellCheck={false} disabled={locked} value={freeText} onChange={(event) => setFreeText(event.target.value)} rows={task.kind === 'full' ? 12 : Math.max(5, part!.units.length + 2)} className={clsx('w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 text-sm leading-relaxed text-[var(--color-text-primary)]', part?.mode === 'code' && 'mono text-xs')} placeholder="Escreva de memória. Sem tempo? Diga em voz alta e toque em comparar." />
      </Card> : stage === 1 ? <Card padding="md" className="space-y-4">
        <h2 className="font-semibold text-[var(--color-text-primary)]">Complete as lacunas</h2>
        <div className={clsx('flex flex-col gap-2 text-[var(--color-text-primary)]', part!.mode === 'code' ? 'mono text-xs leading-7' : 'text-sm leading-8')}>
          {cloze.units.map((tokens, unit) => <p key={unit} className="whitespace-pre-wrap">
            {tokens.map((token, position) => token.blank === undefined ? <span key={position}>{token.text}</span> : <button key={position} type="button" disabled={locked} aria-label={`Lacuna ${token.blank + 1}`} onClick={() => { const blank = token.blank!; setFills((before) => { const copy = { ...before }; delete copy[blank]; return copy; }); setWrongBlanks((before) => before.filter((item) => item !== blank)); edit(); }} className={clsx('mx-0.5 inline-block min-w-16 rounded-md border px-2 align-baseline font-semibold', fills[token.blank] === undefined ? (token.blank === activeBlank ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-transparent' : 'border-dashed border-[var(--color-border-strong)] text-transparent') : wrongBlanks.includes(token.blank) ? 'border-amber-500 bg-amber-500/15 text-amber-700' : 'border-[var(--color-accent)]/50 bg-[var(--color-accent-soft)] text-[var(--color-accent)]')}>{fills[token.blank] === undefined ? '____' : wordBank[fills[token.blank]]}</button>)}
          </p>)}
        </div>
        {!locked && <div className="flex flex-wrap gap-2 border-t border-[var(--color-border-soft)] pt-3">
          {wordBank.map((word, position) => <button key={position} type="button" disabled={Object.values(fills).includes(position) || activeBlank === -1} onClick={() => { setFills((before) => ({ ...before, [activeBlank]: position })); edit(); }} className={clsx('rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-2.5 py-1.5 hover:border-[var(--color-accent)] disabled:opacity-30', part!.mode === 'code' ? 'mono text-xs' : 'text-sm')}>{word}</button>)}
        </div>}
      </Card> : null}

      {!drill && <Card padding="md" className="space-y-3">
        {feedback && <p role="status" className={clsx('text-sm font-medium', state === 'correct' ? 'text-emerald-600' : 'text-[var(--color-text-primary)]')}>{feedback}</p>}
        {hint && <p className="mono whitespace-pre-wrap rounded-lg bg-[var(--color-bg-elevated)] p-2 text-xs text-[var(--color-text-secondary)]">{hint}</p>}
        {locked && part && stage !== 0 && <div className="rounded-lg border border-[var(--color-success)]/40 bg-[var(--color-success-soft)] p-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-success)]">Gabarito desta parte — {part.label}</p>
          <p className={clsx('whitespace-pre-wrap text-[var(--color-text-primary)]', part.mode === 'code' ? 'mono text-xs leading-5' : 'text-sm leading-relaxed')}>{part.units.join(part.mode === 'code' ? '\n' : ' ')}</p>
        </div>}
        {locked && typed && terms.length > 0 && <p className="text-sm text-[var(--color-text-secondary)]">
          Você usou {terms.length - missing.length} de {terms.length} termos-chave.{missing.length > 0 && <> Faltou: <strong className="text-[var(--color-text-primary)]">{missing.slice(0, 14).join(', ')}{missing.length > 14 ? '…' : ''}</strong></>}
        </p>}
        {locked && task.kind === 'choice' && <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]"><strong>Resposta:</strong> {task.options.find((option) => option.id === task.correctId)?.label}</p>}
        {locked && <ExamAnswerPanel key={`${task.id}:${index}`} question={task.question} defaultOpen={task.kind !== 'part'} />}
        <div className="flex flex-wrap gap-2">
          {state === 'selfCheck' ? <>
            <Button onClick={() => { setState('correct'); setFeedback('Marcado como certo. O intervalo até a próxima revisão aumenta.'); }}>Acertei sem consultar</Button>
            <Button variant="secondary" onClick={() => { setState('revealed'); setHadError(true); setFeedback('Marcado para repetir: volta daqui a pouco.'); }}>Ainda não</Button>
          </> : !locked ? <>
            <Button onClick={check}>{task.kind === 'full' || (task.kind === 'part' && stage === 2) ? 'Comparar com o gabarito' : 'Conferir'}</Button>
            {task.kind !== 'choice' && <Button variant="secondary" onClick={showHint}>Dica</Button>}
            {part && <Button variant="secondary" onClick={() => { setDrill({ count: Math.min(2, part.units.length), hidden: false }); setHadError(true); setFeedback(''); setHint(''); }}>Decorar aos poucos</Button>}
            <Button variant="ghost" onClick={reveal}>Ver a resposta</Button>
          </> : <Button onClick={next}>Próximo</Button>}
        </div>
      </Card>}
    </div>
  );
}
