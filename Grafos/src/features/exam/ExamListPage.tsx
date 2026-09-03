import { Link } from 'react-router-dom';
import { exams } from '@/content/exams';
import { Button, Card } from '@/components/ui';

/** Lista os simulados completos disponíveis — cada um leva ao simulador em `/simulado/:examId`. */
export function ExamListPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">Simulados P1</h1>
        <p className="max-w-2xl text-[var(--color-text-secondary)]">
          Provas completas no estilo do Prof. Silvio Jamil — dissertativas, com peso somando 100%. As respostas só são reveladas depois da
          entrega, como numa prova real.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {exams.map((exam) => (
          <Card key={exam.id} padding="lg" className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">{exam.title}</h2>
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
              <Button fullWidth>Iniciar simulado</Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
