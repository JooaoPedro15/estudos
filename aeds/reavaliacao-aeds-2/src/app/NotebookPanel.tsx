import { BookOpenCheck, Brain, Target } from 'lucide-react';

import { getContentModule } from '../content/contentModules';
import {
  getErrorTypeLabel,
  getSubjectLabel,
  MASTERY_TARGET,
  selectSimilarPractice,
} from '../engine/adaptiveReview';
import type { ErrorRecord } from '../types/progress';

type NotebookPanelProps = {
  priorityErrors: ErrorRecord[];
  masteredCount: number;
  onPractice: (record: ErrorRecord) => void;
};

/** Caderno de erros: erros prioritarios com dominio e botao "Praticar". */
export function NotebookPanel({ priorityErrors, masteredCount, onPractice }: NotebookPanelProps) {
  return (
    <section className="review-panel" aria-labelledby="review-title">
      <div className="panel-title">
        <Brain aria-hidden="true" size={18} />
        <h2 id="review-title">Caderno de erros</h2>
      </div>

      {priorityErrors.length === 0 ? (
        <div className="empty-review">
          <BookOpenCheck aria-hidden="true" size={32} />
          <p>Nenhum erro critico agora.</p>
          {masteredCount > 0 && <p className="review-mastered">{masteredCount} conteudo(s) dominado(s).</p>}
        </div>
      ) : (
        <>
          <ol className="error-list">
            {priorityErrors.slice(0, 4).map((record) => (
              <NotebookItem key={record.id} onPractice={() => onPractice(record)} record={record} />
            ))}
          </ol>
          {masteredCount > 0 && <p className="review-mastered">{masteredCount} conteudo(s) dominado(s).</p>}
        </>
      )}
    </section>
  );
}

function NotebookItem({ record, onPractice }: { record: ErrorRecord; onPractice: () => void }) {
  const moduleInfo = getContentModule(record.moduleId);
  const mastery = record.masteryLevel ?? 0;
  // Dica: usa uma variacao de treino equivalente ou cai num texto do assunto.
  const hint = selectSimilarPractice(record)?.title ?? `Revise ${getSubjectLabel(record)} em ${moduleInfo.shortTitle}.`;

  return (
    <li className="error-item">
      <div className="error-head">
        <span className={`error-type-badge type-${record.type}`}>{getErrorTypeLabel(record.type)}</span>
        <strong>{moduleInfo.shortTitle}</strong>
        <span className="error-subject">{getSubjectLabel(record)}</span>
      </div>

      <div className="error-meta">
        <span>{record.attempts}x erros</span>
        <span>{record.correctCount ?? 0} acertos</span>
        <span>{formatRelativeTime(record.lastSeenAt)}</span>
      </div>

      <div
        className="mastery-track"
        aria-label={`Dominio ${mastery} de ${MASTERY_TARGET}`}
        title={`Dominio ${mastery}/${MASTERY_TARGET}`}
      >
        {Array.from({ length: MASTERY_TARGET }).map((_, index) => (
          <span className={`mastery-pip ${index < mastery ? 'is-filled' : ''}`} key={index} />
        ))}
      </div>

      <p className="error-hint">{hint}</p>

      <button className="primary-button compact" onClick={onPractice} type="button">
        <Target aria-hidden="true" size={16} />
        Praticar
      </button>
    </li>
  );
}

/** Tempo relativo curto e estavel (sem depender de libs). */
function formatRelativeTime(iso: string): string {
  const timestamp = new Date(iso).getTime();
  if (Number.isNaN(timestamp)) {
    return 'agora';
  }

  const diffMinutes = Math.floor((Date.now() - timestamp) / 60000);
  if (diffMinutes < 1) return 'agora';
  if (diffMinutes < 60) return `ha ${diffMinutes} min`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `ha ${diffHours} h`;

  const diffDays = Math.floor(diffHours / 24);
  return `ha ${diffDays} d`;
}
