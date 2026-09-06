import { BookOpenCheck, ClipboardList, Shapes, Trophy } from 'lucide-react';

import { codeDrillCatalog } from '../content/codeDrills';
import { examCatalog } from '../content/examCatalog';
import { getConceptualDrawingModules, getQuestionsForConceptualDrawingModule } from '../content/lista2Questions';
import { structureCatalog } from '../viz/structureOps';
import type { ErrorRecord } from '../types/progress';
import { NotebookPanel } from './NotebookPanel';
import type { ActiveMode } from './appTypes';

type DashboardScreenProps = {
  score: number;
  maxScore: number;
  masteredCount: number;
  priorityErrors: ErrorRecord[];
  onSelectCategory: (mode: ActiveMode) => void;
  onPractice: (record: ErrorRecord) => void;
};

type CategoryCard = {
  mode: ActiveMode;
  color: string;
  title: string;
  description: string;
  meta: string;
  icon: React.ReactNode;
};

/**
 * Tela inicial: ponto de entrada unico do app. Nenhuma categoria abre
 * direto — tudo passa pelos 4 cards ou pelo caderno de erros aqui.
 */
export function DashboardScreen({
  masteredCount,
  maxScore,
  onPractice,
  onSelectCategory,
  priorityErrors,
  score,
}: DashboardScreenProps) {
  const conceitualCount = getQuestionsForConceptualDrawingModule('all', 'conceitual').length;
  const conceitualFiltros = getConceptualDrawingModules('conceitual').length;
  const desenhoCount = getQuestionsForConceptualDrawingModule('all', 'desenho').length;

  const cards: CategoryCard[] = [
    {
      mode: 'exam',
      color: 'var(--domain-ordenacao)',
      title: 'Provas',
      description: 'Prova 1, 2, 3 e Reavaliacao — treino por modulo ou simulado no formato real.',
      meta: `${examCatalog.length} provas · ${codeDrillCatalog.length} exercicios`,
      icon: <ClipboardList aria-hidden="true" size={19} />,
    },
    {
      mode: 'conceptual',
      color: 'var(--domain-avl)',
      title: 'Conceitual',
      description: 'Questoes de multipla escolha sobre teoria: provar, refutar, analisar caso.',
      meta: `${conceitualCount} questoes · ${conceitualFiltros} filtros`,
      icon: <BookOpenCheck aria-hidden="true" size={19} />,
    },
    {
      mode: 'drawing',
      color: 'var(--domain-doidona)',
      title: 'Desenho',
      description: 'Reconhecer a estrutura certa entre alternativas visuais animadas.',
      meta: `${desenhoCount} questoes · visual`,
      icon: <Shapes aria-hidden="true" size={19} />,
    },
    {
      mode: 'explore',
      color: 'var(--domain-trie)',
      title: 'Estruturas',
      description: 'Galeria livre: mexa em vetor, AVL, hash, TRIE e veja a animacao passo a passo.',
      meta: `${structureCatalog.length} estruturas`,
      icon: <Shapes aria-hidden="true" size={19} />,
    },
  ];

  const progressPercent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return (
    <div className="dashboard">
      <div className="dash-top">
        <div>
          <p className="app-kicker">AEDS II · PUC Minas</p>
          <h1>Sala de estudo</h1>
        </div>
        <div className="stat-strip">
          <div className="stat-tile">
            <strong>
              <Trophy aria-hidden="true" size={15} /> {score}/{maxScore}
            </strong>
            <span>pontos no simulado atual ({progressPercent}%)</span>
          </div>
          <div className="stat-tile is-success">
            <strong>{masteredCount}</strong>
            <span>dominios dominados</span>
          </div>
          <div className="stat-tile is-warning">
            <strong>{priorityErrors.length}</strong>
            <span>erros ativos</span>
          </div>
        </div>
      </div>

      <div className="cat-grid">
        {cards.map((card) => (
          <button
            aria-label={card.title}
            className="cat-card"
            key={card.mode}
            onClick={() => onSelectCategory(card.mode)}
            style={{ '--cat-color': card.color } as React.CSSProperties}
            type="button"
          >
            <span className="cat-icon">{card.icon}</span>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            <div className="cat-meta">
              <span>{card.meta}</span>
              <span className="go">entrar →</span>
            </div>
          </button>
        ))}
      </div>

      <NotebookPanel masteredCount={masteredCount} onPractice={onPractice} priorityErrors={priorityErrors} />
    </div>
  );
}
