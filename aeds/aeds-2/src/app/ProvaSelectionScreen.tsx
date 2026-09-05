import { examCatalog, type ExamId } from '../content/examCatalog';

export type ProvaSection = 'teorica' | 'pratica';
export type TeoricaMode = 'treinar' | 'simulado';

type ProvaSelectionScreenProps = {
  onSelect: (scope: ExamId) => void;
};

/**
 * Primeira tela do app: escolher qual prova estudar (Prova 1/2/3 ou
 * Reavaliacao). Essa escolha filtra tudo que vem depois (prova teorica,
 * prova pratica).
 */
export function ProvaSelectionScreen({ onSelect }: ProvaSelectionScreenProps) {
  return (
    <div className="module-select">
      <p className="question-stem">Escolha o que voce quer estudar.</p>
      <div className="domain-list">
        {examCatalog.map((exam) => (
          <button className="domain-button" key={exam.id} onClick={() => onSelect(exam.id)} type="button">
            <strong>{exam.title}</strong>
            <span>{exam.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

type SectionPickerProps = {
  examTitle: string;
  onBack: () => void;
  onSelect: (section: ProvaSection) => void;
};

/** Segunda tela: dentro da prova escolhida, teorica ou pratica. */
export function SectionPicker({ examTitle, onBack, onSelect }: SectionPickerProps) {
  return (
    <div className="module-select">
      <button className="ghost-button compact" onClick={onBack} type="button">
        Trocar prova
      </button>
      <p className="question-stem">{examTitle}: prova teorica ou prova pratica?</p>
      <div className="domain-list">
        <button className="domain-button" onClick={() => onSelect('teorica')} type="button">
          <strong>Prova teorica</strong>
          <span>Questoes de implementacao: "implemente o metodo tal", no papel/codigo, como a prova real cobra.</span>
        </button>
        <button className="domain-button" onClick={() => onSelect('pratica')} type="button">
          <strong>Prova pratica</strong>
          <span>Estilo BeeCrowd/Verde: programa completo, le entrada e imprime saida.</span>
        </button>
      </div>
    </div>
  );
}

type TeoricaModePickerProps = {
  examTitle: string;
  onBack: () => void;
  onSelect: (mode: TeoricaMode) => void;
};

/** Terceira tela (so na prova teorica): treinar exercicio por exercicio, ou simulado. */
export function TeoricaModePicker({ examTitle, onBack, onSelect }: TeoricaModePickerProps) {
  return (
    <div className="module-select">
      <button className="ghost-button compact" onClick={onBack} type="button">
        Voltar
      </button>
      <p className="question-stem">{examTitle} (teorica): treinar por modulo ou fazer o simulado?</p>
      <div className="domain-list">
        <button className="domain-button" onClick={() => onSelect('treinar')} type="button">
          <strong>Treinar</strong>
          <span>Escolhe um modulo e pratica exercicio por exercicio, no seu ritmo.</span>
        </button>
        <button className="domain-button" onClick={() => onSelect('simulado')} type="button">
          <strong>Simulado</strong>
          <span>Questoes em sequencia, no formato real da prova.</span>
        </button>
      </div>
    </div>
  );
}
