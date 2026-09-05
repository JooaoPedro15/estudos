import { examCatalog, type ExamId } from '../content/examCatalog';

/** Escopo de treino: uma prova especifica, ou 'all' (sem filtro, como era antes). */
export type PracticeScope = ExamId | 'all';

type ProvaSelectionScreenProps = {
  onSelect: (scope: PracticeScope) => void;
};

/**
 * Primeira tela do Treino de Codigo: escolher uma prova (o que restringe os
 * modulos oferecidos a seguir) ou pular o filtro e ver tudo, como no
 * comportamento anterior a este seletor.
 */
export function ProvaSelectionScreen({ onSelect }: ProvaSelectionScreenProps) {
  return (
    <div className="module-select">
      <p className="question-stem">
        Escolha uma prova para focar o treino nos modulos dela, ou veja o conteudo inteiro sem filtro.
      </p>
      <div className="domain-list">
        {examCatalog.map((exam) => (
          <button className="domain-button" key={exam.id} onClick={() => onSelect(exam.id)} type="button">
            <strong>{exam.title}</strong>
            <span>{exam.description}</span>
          </button>
        ))}
        <button className="domain-button" onClick={() => onSelect('all')} type="button">
          <strong>Ver todo o conteudo</strong>
          <span>Sem filtro de prova: todos os modulos da materia, do jeito que ja era antes.</span>
        </button>
      </div>
    </div>
  );
}
