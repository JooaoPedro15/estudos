import { Link } from 'react-router-dom';
import { exams, realExams } from '@/content/exams';
import type { Exam } from '@/content/types';
import { Badge, Button, Card } from '@/components/ui';

function ExamCard({ exam }: { exam: Exam }) {
  return (
    <Card padding="lg" className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">{exam.title}</h2>
          {exam.kind === 'real' && <Badge tone="danger">literal</Badge>}
        </div>
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{exam.basedOn}</p>
      </div>
      <dl className="mono flex flex-col gap-1.5 text-xs text-[var(--color-text-tertiary)]">
        <div className="flex justify-between border-b border-[var(--color-border-soft)] pb-1.5">
          <dt>Questões</dt>
          <dd className="text-[var(--color-text-secondary)]">{exam.questions.length}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Duração sugerida</dt>
          <dd className="text-[var(--color-text-secondary)]">{exam.suggestedDurationMinutes} min</dd>
        </div>
      </dl>
      <Link to={`/simulado/${exam.id}`} className="mt-auto">
        <Button fullWidth>{exam.kind === 'real' ? 'Fazer esta prova' : 'Iniciar simulado'}</Button>
      </Link>
    </Card>
  );
}

/** Lista as provas reais (literais) e os simulados montados — cada um leva ao simulador em `/simulado/:examId`. */
export function ExamListPage() {
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">Provas e simulados</h1>
        <p className="max-w-2xl text-[var(--color-text-secondary)]">
          Todas as questões são abertas, como na prova. Cada uma tem o botão "Mostrar resposta" com a resposta-modelo — o texto a escrever na
          folha, no registro das resoluções corrigidas, usando só os conceitos do professor.
        </p>
      </header>

      <section className="flex flex-col gap-4" aria-labelledby="provas-reais">
        <div className="flex flex-col gap-1">
          <h2 id="provas-reais" className="text-lg font-semibold text-[var(--color-text-primary)]">
            Provas reais — 2022/1 a 2026/1
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            As 8 provas do Prof. Silvio Jamil, questão por questão, com o enunciado literal (matrizes, listas e grafos transcritos dos PDFs).
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {realExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="simulados">
        <div className="flex flex-col gap-1">
          <h2 id="simulados" className="text-lg font-semibold text-[var(--color-text-primary)]">
            Simulados montados
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)]">Provas compostas com questões do banco no estilo do professor, peso somando 100%.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {exams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      </section>
    </div>
  );
}
