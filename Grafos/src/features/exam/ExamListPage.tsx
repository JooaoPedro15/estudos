import { useState } from 'react';
import { Link } from 'react-router-dom';
import { exams as allExams, realExams as allRealExams } from '@/content/exams';
import { useActiveExam } from '@/store/activeExam';
import type { ExamScope } from '@/content/types';
import type { Exam } from '@/content/types';
import { Badge, Button, Card } from '@/components/ui';
import { codePuzzles } from '@/content/codePuzzles';
import { dueIds, loadMemory, resetMemory } from '@/store/answerMemory';
import { createBackupText, restoreBackupText } from '@/store/backup';

function ExamCard({ exam }: { exam: Exam }) {
  return (
    <Card padding="lg" className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">{exam.title}</h2>
          {exam.kind === 'real' && <Badge tone="danger">literal</Badge>}
          {exam.randomized && <Badge tone="success">sorteado</Badge>}
        </div>
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{exam.basedOn}</p>
      </div>
      <dl className="mono flex flex-col gap-1.5 text-xs text-[var(--color-text-tertiary)]">
        <div className="flex justify-between border-b border-[var(--color-border-soft)] pb-1.5">
          <dt>Questões</dt>
          <dd className="text-[var(--color-text-secondary)]">{exam.randomized ? '3 a 5' : exam.questions.length}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Duração sugerida</dt>
          <dd className="text-[var(--color-text-secondary)]">{exam.suggestedDurationMinutes} min</dd>
        </div>
      </dl>
      <Link to={`/simulado/${exam.id}`} className="mt-auto">
        <Button fullWidth>{exam.kind === 'real' ? 'Fazer esta prova' : exam.randomized ? 'Sortear simulado' : 'Iniciar simulado'}</Button>
      </Link>
    </Card>
  );
}

const REAL_EXAMS_TEXT: Record<ExamScope, { title: string; description: string }> = {
  all: { title: 'Provas reais — P1 e P2', description: 'Todas as provas antigas disponíveis, com enunciados e respostas-modelo.' },
  P1: {
    title: 'Provas reais — 2022/1 a 2026/1',
    description: 'As 8 provas do Prof. Silvio Jamil, questão por questão, com o enunciado literal (matrizes, listas e grafos transcritos dos PDFs).',
  },
  P2: {
    title: 'Provas reais — 9 de P2 do Prof. Silvio',
    description:
      'Enunciados transcritos das fotos, da mais recente para a mais antiga, com respostas no jeito do resumo e das resoluções. Só os gabaritos da 2024/1 são oficiais. No fim, uma prova do Prof. Zenilton, de outro professor.',
  },
};

/** Leva o progresso para outro computador: copia um texto aqui e cola lá. */
function BackupCard() {
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  async function copy() {
    const backup = await createBackupText();
    try { await navigator.clipboard.writeText(backup); setMessage('Copiado. No outro computador, cole na caixa e toque em "Importar".'); }
    catch { setText(backup); setMessage('Não consegui copiar sozinho: selecione o texto da caixa, copie e cole no outro computador.'); }
  }
  async function restore() {
    if (!window.confirm('Substituir o progresso deste computador pelo do backup?')) return;
    try {
      const summary = await restoreBackupText(text);
      setMessage(`Importado: ${summary.parts} parte(s) da memorização e ${summary.attempts} tentativa(s). Recarregando…`);
      window.setTimeout(() => window.location.reload(), 800);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Não foi possível importar.'); }
  }
  return (
    <Card padding="lg" className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Levar progresso para outro computador</h2>
      <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">O progresso fica salvo neste navegador. Copie aqui, envie para você mesmo (WhatsApp, e-mail) e cole no outro computador, abrindo o mesmo site.</p>
      <textarea aria-label="Texto do backup" value={text} onChange={(event) => setText(event.target.value)} rows={3} spellCheck={false} placeholder="Cole aqui o backup vindo do outro computador" className="mono w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2 text-xs text-[var(--color-text-primary)]" />
      <div className="flex flex-wrap gap-2">
        <Button onClick={copy}>Copiar meu progresso</Button>
        <Button variant="secondary" onClick={restore} disabled={!text.trim()}>Importar o texto colado</Button>
      </div>
      {message && <p role="status" className="text-sm text-[var(--color-text-primary)]">{message}</p>}
    </Card>
  );
}

/** Mostra os simulados sorteados da P2 em destaque e as provas reais da seleção ativa. */
export function ExamListPage() {
  const active = useActiveExam();
  const [dueCount, setDueCount] = useState(() => dueIds(loadMemory()).length);
  const p2Exams = allExams.filter((e) => e.prova === 'P2');
  const p1Exams = allExams.filter((e) => e.prova !== 'P2');
  const realExams = allRealExams.filter((e) => active === 'all' || (e.prova ?? 'P1') === active);
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">Provas e simulados</h1>
        <p className="max-w-2xl text-[var(--color-text-secondary)]">
          Abra uma prova e escolha como responder: aberto, como no dia, ou no modo memorização, que faz você reconstruir a resposta-modelo inteira, uma questão por vez.
        </p>
      </header>

      <section className="flex flex-col gap-4" aria-labelledby="simulados">
        <div className="flex flex-col gap-1">
          <h2 id="simulados" className="text-lg font-semibold text-[var(--color-text-primary)]">
            Simulados da P2
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)]">Escolha um tipo, sorteie as questões e depois selecione o formato aberto ou de memorização. Os temas recorrentes aparecem junto com os demais.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {p2Exams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
          <Card padding="lg" className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Simulado P2 — quebra-código</h2>
                <Badge tone="success">montagem</Badge>
              </div>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                Monte os passos de Kosaraju, Prim, Kruskal, Dijkstra, BFS, Fleury e caminho crítico. Os erros voltam para uma nova tentativa.
              </p>
            </div>
            <p className="mono text-xs text-[var(--color-text-tertiary)]">{codePuzzles.length} desafios · correção imediata · sem cronômetro</p>
            <Link to="/simulado/codigo" className="mt-auto"><Button fullWidth>Montar os códigos</Button></Link>
          </Card>
          <Card padding="lg" className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Revisão espaçada</h2>
                <Badge tone="amber">{dueCount} para revisar</Badge>
              </div>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">As partes das respostas que você já treinou voltam aqui: as que você errou mais vêm primeiro, e cada acerto aumenta o intervalo até a próxima vez.</p>
            </div>
            <div className="mt-auto flex flex-col gap-2">
              <Link to="/simulado/revisao"><Button fullWidth>Revisar agora</Button></Link>
              <Button variant="ghost" fullWidth onClick={() => { if (window.confirm('Apagar todo o progresso da memorização? Todas as partes voltam para "Decorar aos poucos".')) { resetMemory(); setDueCount(0); } }}>Zerar progresso da memorização</Button>
            </div>
          </Card>
        </div>
      </section>

      <BackupCard />

      {active !== 'P2' && (
        <section className="flex flex-col gap-4" aria-labelledby="simulados-p1">
          <h2 id="simulados-p1" className="text-lg font-semibold text-[var(--color-text-primary)]">Simulados da P1</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {p1Exams.map((exam) => <ExamCard key={exam.id} exam={exam} />)}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-4" aria-labelledby="provas-reais">
        <div className="flex flex-col gap-1">
          <h2 id="provas-reais" className="text-lg font-semibold text-[var(--color-text-primary)]">
            {REAL_EXAMS_TEXT[active].title}
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)]">{REAL_EXAMS_TEXT[active].description}</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {realExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      </section>
    </div>
  );
}
