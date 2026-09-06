import { BookOpenCheck, ClipboardList, Home, Shapes, Trophy, X } from 'lucide-react';

import type { ActiveMode } from './appTypes';

type CategoryBarProps = {
  activeMode: ActiveMode;
  score: number;
  maxScore: number;
  onHome: () => void;
  onSelectCategory: (mode: ActiveMode) => void;
  onExit: () => void;
};

const CATEGORIES: Array<{ mode: ActiveMode; label: string; icon: React.ReactNode }> = [
  { mode: 'exam', label: 'Provas', icon: <ClipboardList aria-hidden="true" size={15} /> },
  { mode: 'conceptual', label: 'Conceitual', icon: <BookOpenCheck aria-hidden="true" size={15} /> },
  { mode: 'drawing', label: 'Desenho', icon: <Shapes aria-hidden="true" size={15} /> },
  { mode: 'explore', label: 'Estruturas', icon: <Shapes aria-hidden="true" size={15} /> },
];

/**
 * Barra fina do modo foco: substitui o menu de abas + topo cheio de antes.
 * Início volta pra dashboard; os icones trocam de categoria sem sair do
 * foco; "Sair" fecha o passo atual (volta um nivel na cascata da categoria).
 */
export function CategoryBar({ activeMode, maxScore, onExit, onHome, onSelectCategory, score }: CategoryBarProps) {
  const normalizedMode = activeMode === 'practice' ? 'exam' : activeMode;

  return (
    <div className="focus-bar">
      <button aria-label="Voltar para a sala de estudo" className="icon-btn" onClick={onHome} type="button">
        <Home aria-hidden="true" size={17} />
      </button>

      <div className="foco-cats" role="tablist" aria-label="Trocar de categoria">
        {CATEGORIES.map((category) => (
          <button
            aria-label={category.label}
            aria-selected={category.mode === normalizedMode}
            className={category.mode === normalizedMode ? 'is-active' : ''}
            key={category.mode}
            onClick={() => onSelectCategory(category.mode)}
            role="tab"
            title={category.label}
            type="button"
          >
            {category.icon}
          </button>
        ))}
      </div>

      <span className="foco-score" aria-label="Pontuacao do simulado">
        <Trophy aria-hidden="true" size={14} />
        <strong>{score}</strong>/{maxScore} pts
      </span>

      <button className="btn-exit" onClick={onExit} type="button">
        <X aria-hidden="true" size={15} />
        Sair
      </button>
    </div>
  );
}
