import { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { codePuzzles } from '@/content/codePuzzles';
import { Badge, Button, Card } from '@/components/ui';

type Result = 'editing' | 'wrong' | 'correct' | 'revealed';

function shuffle<T>(values: T[]): T[] {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  if (result.length > 1 && result.every((value, index) => value === values[index])) {
    [result[0], result[1]] = [result[1], result[0]];
  }
  return result;
}

/** Questões fechadas de ordenação de pseudocódigo com nova tentativa dos erros. */
export function CodePuzzleSimulator() {
  const [queue, setQueue] = useState(() => shuffle(codePuzzles.map((puzzle) => puzzle.id)));
  const [bank, setBank] = useState<number[]>(() => shuffle(codePuzzles.find((puzzle) => puzzle.id === queue[0])!.lines.map((_, i) => i)));
  const [selected, setSelected] = useState<number[]>([]);
  const [result, setResult] = useState<Result>('editing');
  const [hadError, setHadError] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [mastered, setMastered] = useState<string[]>([]);
  const [completed, setCompleted] = useState(0);

  const puzzle = codePuzzles.find((item) => item.id === queue[0]);

  function resetRound(nextId: string) {
    const next = codePuzzles.find((item) => item.id === nextId)!;
    setBank(shuffle(next.lines.map((_, i) => i)));
    setSelected([]);
    setResult('editing');
    setHadError(false);
    setHint(null);
    setFeedback('');
  }

  function restart() {
    const next = shuffle(codePuzzles.map((item) => item.id));
    setQueue(next);
    setMastered([]);
    setCompleted(0);
    resetRound(next[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function check() {
    if (!puzzle || selected.length !== puzzle.lines.length) {
      setFeedback('Coloque todas as linhas na resposta antes de conferir.');
      return;
    }
    const firstWrong = selected.findIndex((line, index) => line !== index);
    if (firstWrong === -1) {
      setResult('correct');
      setHint(null);
      setFeedback(hadError ? 'Correto! Este algoritmo volta mais tarde para uma tentativa sem ajuda.' : 'Correto de primeira!');
    } else {
      setHadError(true);
      setResult('wrong');
      const right = selected.filter((line, index) => line === index).length;
      setFeedback(`${right} de ${puzzle.lines.length} linhas na posição certa. Revise a linha ${firstWrong + 1} e tente novamente.`);
    }
  }

  function showHint() {
    if (!puzzle) return;
    const wrong = selected.findIndex((line, index) => line !== index);
    const index = wrong >= 0 ? wrong : selected.length;
    if (index >= puzzle.lines.length) {
      setFeedback('Todas as linhas foram colocadas. Use “Conferir ordem” para verificar.');
      return;
    }
    setHint(`Na posição ${index + 1}, procure: ${puzzle.lines[index]}`);
    setHadError(true);
  }

  function next() {
    if (!puzzle) return;
    const clean = result === 'correct' && !hadError;
    const rest = queue.slice(1);
    const nextQueue = clean ? rest : [...rest, puzzle.id];
    if (clean) setMastered((before) => [...before, puzzle.id]);
    setCompleted((before) => before + 1);
    setQueue(nextQueue);
    if (nextQueue[0]) resetRound(nextQueue[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (!puzzle) {
    return (
      <Card padding="lg" className="mx-auto max-w-2xl space-y-4 text-center">
        <Badge tone="success">Rodada concluída</Badge>
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">Você montou todos os códigos sem ajuda</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Agora tente escrever de memória os passos de cada algoritmo antes de olhar para as linhas.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button onClick={restart}>Nova rodada embaralhada</Button>
          <Link to="/simulado"><Button variant="secondary">Voltar aos simulados</Button></Link>
        </div>
      </Card>
    );
  }

  const available = bank.filter((line) => !selected.includes(line));
  const locked = result === 'correct' || result === 'revealed';

  function addLine(line: number) {
    if (locked) return;
    setSelected((before) => [...before, line]);
    setResult('editing');
    setFeedback('');
    setHint(null);
  }

  function moveLine(index: number, direction: -1 | 1) {
    const other = index + direction;
    if (locked || other < 0 || other >= selected.length) return;
    setSelected((before) => {
      const nextSelection = [...before];
      [nextSelection[index], nextSelection[other]] = [nextSelection[other], nextSelection[index]];
      return nextSelection;
    });
    setResult('editing');
    setFeedback('');
    setHint(null);
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link to="/simulado" className="text-sm text-[var(--color-accent)] hover:underline">← Simulados</Link>
          <h1 className="mt-2 text-2xl font-semibold text-[var(--color-text-primary)]">Quebra-código</h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Toque nas linhas para montar a resposta. Confira, corrija e repita mais tarde as que errou.
          </p>
        </div>
        <div className="text-right text-sm text-[var(--color-text-secondary)]">
          <div>{mastered.length}/{codePuzzles.length} dominados</div>
          <div>{completed} tentativas concluídas</div>
        </div>
      </header>

      <Card padding="md" className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="success">{puzzle.title}</Badge>
          <span className="text-xs text-[var(--color-text-tertiary)]">{puzzle.source}</span>
        </div>
        <p className="text-base font-medium leading-relaxed text-[var(--color-text-primary)]">{puzzle.prompt}</p>
        <p className="text-xs text-[var(--color-text-tertiary)]">Antes de selecionar, tente lembrar a sequência de passos sem olhar para as opções.</p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card padding="md" className="min-w-0">
          <h2 className="mb-3 font-semibold text-[var(--color-text-primary)]">Sua resposta ({selected.length}/{puzzle.lines.length})</h2>
          <ol className="flex flex-col gap-2">
            {selected.map((line, index) => (
              <li key={line} className={clsx('flex min-w-0 items-center gap-2 rounded-lg border p-2',
                result === 'wrong' && line !== index ? 'border-amber-500/70 bg-amber-500/10' : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)]')}>
                <span className="mono w-5 shrink-0 text-xs text-[var(--color-text-tertiary)]">{index + 1}</span>
                <code className="min-w-0 flex-1 whitespace-pre-wrap break-words text-xs leading-5 text-[var(--color-text-primary)]">{puzzle.lines[line]}</code>
                {!locked && <span className="flex shrink-0 gap-1">
                  <button type="button" onClick={() => moveLine(index, -1)} disabled={index === 0} aria-label={`Mover linha ${index + 1} para cima`} className="control-btn h-7 w-7 disabled:opacity-30">↑</button>
                  <button type="button" onClick={() => moveLine(index, 1)} disabled={index === selected.length - 1} aria-label={`Mover linha ${index + 1} para baixo`} className="control-btn h-7 w-7 disabled:opacity-30">↓</button>
                  <button type="button" onClick={() => { setSelected((before) => before.filter((_, i) => i !== index)); setResult('editing'); setFeedback(''); }} aria-label={`Remover linha ${index + 1}`} className="control-btn h-7 w-7">×</button>
                </span>}
              </li>
            ))}
            {!locked && selected.length < puzzle.lines.length &&
              <li className="rounded-lg border border-dashed border-[var(--color-border)] p-3 text-center text-xs text-[var(--color-text-tertiary)]">Escolha a próxima linha abaixo</li>}
          </ol>
        </Card>

        <Card padding="md" className="min-w-0">
          <h2 className="mb-3 font-semibold text-[var(--color-text-primary)]">Linhas disponíveis</h2>
          {available.length === 0 ?
            <p className="text-sm text-[var(--color-text-tertiary)]">Todas as linhas foram colocadas. Confira a ordem.</p> :
            <div className="flex flex-col gap-2">
              {available.map((line) => (
                <button key={line} type="button" onClick={() => addLine(line)} disabled={locked}
                  className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2.5 text-left transition-colors hover:border-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] disabled:opacity-50">
                  <code className="whitespace-pre-wrap break-words text-xs leading-5 text-[var(--color-text-primary)]">{puzzle.lines[line]}</code>
                </button>
              ))}
            </div>}
        </Card>
      </div>

      <Card padding="md" className="space-y-3">
        {feedback && <p role="status" className={clsx('text-sm font-medium', result === 'correct' ? 'text-emerald-500' : 'text-[var(--color-text-primary)]')}>{feedback}</p>}
        {hint && <p className="mono rounded-lg bg-[var(--color-bg-elevated)] p-2 text-xs text-[var(--color-text-secondary)]">{hint}</p>}
        {(result === 'correct' || result === 'revealed') && <p className="text-sm text-[var(--color-text-secondary)]"><strong>Por quê:</strong> {puzzle.why}</p>}
        {result === 'revealed' && <pre className="overflow-x-auto rounded-lg bg-[var(--color-bg-elevated)] p-3 text-xs leading-5 text-[var(--color-text-primary)]">{puzzle.lines.join('\n')}</pre>}
        <div className="flex flex-wrap gap-2">
          {!locked ? <>
            <Button onClick={check}>Conferir ordem</Button>
            <Button variant="secondary" onClick={showHint}>Dica da próxima linha</Button>
            <Button variant="ghost" onClick={() => { setResult('revealed'); setHadError(true); setFeedback('Veja a solução e tente de novo mais tarde.'); }}>Ver código correto</Button>
          </> : <Button onClick={next}>{result === 'correct' && !hadError ? 'Próximo algoritmo' : 'Continuar e revisar depois'}</Button>}
        </div>
      </Card>
    </div>
  );
}
