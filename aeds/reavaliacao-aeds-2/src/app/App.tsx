import { useEffect, useMemo, useState } from 'react';
import {
  BookOpenCheck,
  Brain,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Code2,
  ListChecks,
  RotateCcw,
  Shapes,
  Shuffle,
  Target,
  Trophy,
  XCircle,
} from 'lucide-react';

import { codeDrillCatalog } from '../content/codeDrills';
import { domainCatalog } from '../content/domains';
import {
  getConceptualDrawingModuleTitle,
  getConceptualDrawingModules,
  getQuestionsForConceptualDrawingModule,
  type ConceptualDrawingModuleId,
  type ConceptualDrawingOption,
  type ConceptualDrawingQuestion,
  type ConceptualDrawingType,
} from '../content/lista2Questions';
import {
  getDrillsForModule,
  getModuleTitle,
  getPracticeModules,
  type PracticeModuleId,
} from '../content/practiceModules';
import { reavaliacaoBlueprint } from '../content/reavaliacaoBlueprint';
import { buildSimulado } from '../content/simuladoBuilder';
import {
  createEmptyNotebook,
  getPriorityErrors,
  recordReviewResult,
  recordStepAttempt,
  selectSimilarPractice,
} from '../engine/adaptiveReview';
import {
  answerCurrentPracticeStep,
  createPracticeSession,
  getCurrentPracticeDrill,
  getPracticeProgressLabel,
} from '../engine/codePractice';
import { answerCurrentStep, createExamSession, getCurrentStep } from '../engine/examSession';
import {
  advanceConceptualQuestion,
  answerCurrentConceptualQuestion,
  createConceptualPracticeSession,
  getConceptualProgressLabel,
  getCurrentConceptualQuestion,
  type ConceptualAttempt,
  type ConceptualPracticeSession,
} from '../engine/lista2Practice';
import { clearSavedGame, loadSavedGame, saveGame, type SavedGameState } from '../persistence/save';
import type {
  BlocksStep,
  ChallengeStep,
  CodeDrill,
  DomainId,
  ExamBlueprint,
  FixStep,
  QuestionFormat,
  SkillId,
  StepAnswer,
  StructureVisual,
} from '../types/content';
import type { StepAttempt } from '../types/progress';
import { StaticStructureCard, StructureVizCard } from '../viz/StructureViz';
import { ExploreScreen } from './ExploreScreen';

const formatLabels: Record<QuestionFormat, string> = {
  'summation-from-code': 'Somatorio por codigo',
  'structure-simulation': 'Simulacao de estrutura',
  'prove-or-refute': 'Provar ou refutar',
  'algorithm-adaptation': 'Adaptar algoritmo',
  'case-analysis': 'Melhor e pior caso',
  'composite-structure-method': 'Metodo em estrutura composta',
  'code-repetition': 'Repeticao de codigo',
  'code-modification': 'Modificacao de estrutura',
};

const skillLabels: Record<SkillId, string> = {
  recognize: 'Reconhecer',
  simulate: 'Simular',
  program: 'Programar',
  justify: 'Justificar',
};

type ActiveMode = 'exam' | 'practice' | 'conceptual' | 'drawing' | 'explore';

function createInitialGame(): SavedGameState {
  return {
    session: createExamSession(reavaliacaoBlueprint),
    blueprint: reavaliacaoBlueprint,
    notebook: createEmptyNotebook(),
    practiceSession: createPracticeSession(codeDrillCatalog, { mode: 'quick', targetCount: 2 }),
    conceptualSession: createConceptualPracticeSession(getQuestionsForConceptualDrawingModule('all', 'conceitual'), {
      mode: 'quick',
      targetCount: 2,
    }),
  };
}

/** A sessao salva so vale se todos os drills do deck ainda existem no filtro. */
function practiceSessionMatchesDrills(
  session: NonNullable<SavedGameState['practiceSession']>,
  drills: CodeDrill[],
): boolean {
  if (!session.drillOrder || session.drillOrder.length === 0) {
    return false;
  }
  const ids = new Set(drills.map((drill) => drill.id));
  return session.drillOrder.every((id) => ids.has(id));
}

function conceptualSessionMatchesQuestions(
  session: ConceptualPracticeSession,
  questions: ConceptualDrawingQuestion[],
): boolean {
  if (!session.questionOrder || session.questionOrder.length === 0) {
    return false;
  }
  const ids = new Set(questions.map((question) => question.id));
  return session.questionOrder.every((id) => ids.has(id));
}

function loadInitialState(): {
  game: SavedGameState;
  practiceModuleId: PracticeModuleId | null;
  conceptualModuleId: ConceptualDrawingModuleId | null;
  drawingModuleId: ConceptualDrawingModuleId | null;
} {
  const initialGame = createInitialGame();
  const savedGame = loadSavedGame();

  if (!savedGame) {
    return { game: initialGame, practiceModuleId: null, conceptualModuleId: null, drawingModuleId: null };
  }

  // Modulo salvo so continua valido se ainda existir no catalogo atual.
  const savedModuleId = savedGame.practiceModuleId ?? null;
  const moduleId =
    savedModuleId !== null && getPracticeModules().some((module) => module.id === savedModuleId)
      ? savedModuleId
      : null;

  const drills = getDrillsForModule(moduleId ?? 'all');
  const validPracticeSession =
    savedGame.practiceSession && practiceSessionMatchesDrills(savedGame.practiceSession, drills)
      ? savedGame.practiceSession
      : initialGame.practiceSession;
  const savedConceptualModuleId = savedGame.conceptualModuleId ?? null;
  const conceptualModuleId =
    savedConceptualModuleId !== null &&
    getConceptualDrawingModules('conceitual').some((module) => module.id === savedConceptualModuleId)
      ? savedConceptualModuleId
      : null;
  const savedDrawingModuleId = savedGame.drawingModuleId ?? null;
  const drawingModuleId =
    savedDrawingModuleId !== null &&
    getConceptualDrawingModules('desenho').some((module) => module.id === savedDrawingModuleId)
      ? savedDrawingModuleId
      : null;
  const conceptualQuestions = getQuestionsForConceptualDrawingModule(conceptualModuleId ?? 'all', 'conceitual');
  const validConceptualSession =
    savedGame.conceptualSession && conceptualSessionMatchesQuestions(savedGame.conceptualSession, conceptualQuestions)
      ? savedGame.conceptualSession
      : initialGame.conceptualSession;

  // O blueprint salvo so vale se a sessao ainda apontar para ele. Saves antigos
  // (sem blueprint) ou inconsistentes caem no simulado de referencia.
  const savedBlueprint = savedGame.blueprint;
  const blueprint =
    savedBlueprint && savedBlueprint.id === savedGame.session.blueprintId ? savedBlueprint : reavaliacaoBlueprint;
  const session =
    blueprint.id === savedGame.session.blueprintId ? savedGame.session : createExamSession(blueprint);

  return {
    game: {
      ...initialGame,
      ...savedGame,
      blueprint,
      session,
      practiceSession: validPracticeSession,
      conceptualSession: validConceptualSession,
    },
    practiceModuleId: moduleId,
    conceptualModuleId,
    drawingModuleId,
  };
}

export function App() {
  const [initialState] = useState(loadInitialState);
  const [game, setGame] = useState<SavedGameState>(initialState.game);
  const [activeMode, setActiveMode] = useState<ActiveMode>('exam');
  const [practiceModuleId, setPracticeModuleId] = useState<PracticeModuleId | null>(initialState.practiceModuleId);
  const [conceptualModuleId, setConceptualModuleId] = useState<ConceptualDrawingModuleId | null>(
    initialState.conceptualModuleId,
  );
  const [drawingModuleId, setDrawingModuleId] = useState<ConceptualDrawingModuleId | null>(
    initialState.drawingModuleId,
  );
  const [selectedDomainId, setSelectedDomainId] = useState<DomainId>('somatorio');
  const [choiceAnswer, setChoiceAnswer] = useState('');
  const [conceptualChoiceAnswer, setConceptualChoiceAnswer] = useState('');
  const [textAnswer, setTextAnswer] = useState('');
  const [blockOrder, setBlockOrder] = useState<string[]>([]);
  const [fixLineIndex, setFixLineIndex] = useState<number | null>(null);
  const [fixId, setFixId] = useState('');
  const [lastAttempt, setLastAttempt] = useState<StepAttempt | null>(null);
  const [lastConceptualAttempt, setLastConceptualAttempt] = useState<ConceptualAttempt | null>(null);
  const [showTeaching, setShowTeaching] = useState(false);

  const currentQuestion = game.blueprint.questions[game.session.currentQuestionIndex];
  const currentStep = getCurrentStep(game.blueprint, game.session);
  const practiceDrills = getDrillsForModule(practiceModuleId ?? 'all');
  const practiceSession =
    game.practiceSession ?? createPracticeSession(practiceDrills, { mode: 'quick', targetCount: 2 });
  const currentPracticeDrill = getCurrentPracticeDrill(practiceDrills, practiceSession);
  const lista2QuestionType: ConceptualDrawingType = activeMode === 'drawing' ? 'desenho' : 'conceitual';
  const lista2ModuleId = activeMode === 'drawing' ? drawingModuleId : conceptualModuleId;
  const conceptualQuestions = getQuestionsForConceptualDrawingModule(lista2ModuleId ?? 'all', lista2QuestionType);
  const conceptualSession =
    game.conceptualSession ?? createConceptualPracticeSession(conceptualQuestions, { mode: 'quick', targetCount: 2 });
  const currentConceptualQuestion = getCurrentConceptualQuestion(conceptualQuestions, conceptualSession);
  const activeStep =
    activeMode === 'exam' ? currentStep : activeMode === 'practice' ? currentPracticeDrill?.step : undefined;
  const selectedDomain = domainCatalog.find((domain) => domain.id === selectedDomainId) ?? domainCatalog[0];
  const currentDomain =
    domainCatalog.find((domain) => domain.id === currentQuestion?.domainId) ?? selectedDomain;
  const priorityErrors = useMemo(() => getPriorityErrors(game.notebook), [game.notebook]);
  const topError = priorityErrors[0];
  const similarPractice = topError ? selectSimilarPractice(topError) : undefined;
  const progressPercent = Math.round((game.session.score / game.session.maxScore) * 100);
  const answer = activeStep ? buildAnswer(activeStep, choiceAnswer, textAnswer, blockOrder, fixLineIndex, fixId) : undefined;

  useEffect(() => {
    // Debounce: agrupa mudancas rapidas em uma unica serializacao.
    const timer = window.setTimeout(() => {
      saveGame({ ...game, practiceModuleId, conceptualModuleId, drawingModuleId });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [conceptualModuleId, drawingModuleId, game, practiceModuleId]);

  useEffect(() => {
    resetAnswerDrafts();
    setShowTeaching(false);
    setLastConceptualAttempt(null);
  }, [activeMode, currentConceptualQuestion?.id, currentPracticeDrill?.step.id, currentStep?.id]);

  useEffect(() => {
    if (activeMode !== 'conceptual' && activeMode !== 'drawing') {
      return;
    }

    if (lista2ModuleId === null || conceptualSessionMatchesQuestions(conceptualSession, conceptualQuestions)) {
      return;
    }

    clearConceptualVisualState();
    setGame((currentGame) => ({
      ...currentGame,
      conceptualSession: createConceptualPracticeSession(conceptualQuestions, { mode: 'quick', targetCount: 2 }),
    }));
  }, [activeMode, conceptualQuestions, conceptualSession, lista2ModuleId]);

  function resetAnswerDrafts() {
    setChoiceAnswer('');
    setConceptualChoiceAnswer('');
    setTextAnswer('');
    setBlockOrder([]);
    setFixLineIndex(null);
    setFixId('');
  }

  function clearConceptualVisualState() {
    setLastConceptualAttempt(null);
    setConceptualChoiceAnswer('');
    setShowTeaching(false);
  }

  function submitAnswer() {
    if (activeMode === 'practice') {
      submitPracticeAnswer();
      return;
    }

    if (activeMode === 'conceptual' || activeMode === 'drawing') {
      submitConceptualAnswer();
      return;
    }

    if (!answer || !currentStep) {
      return;
    }

    const nextSession = answerCurrentStep(game.blueprint, game.session, answer);
    const attempt = nextSession.attempts[nextSession.attempts.length - 1] ?? null;
    const nextNotebook = attempt ? recordStepAttempt(game.notebook, attempt) : game.notebook;

    setLastAttempt(attempt);
    setGame((currentGame) => ({ ...currentGame, session: nextSession, notebook: nextNotebook }));
  }

  function submitPracticeAnswer() {
    if (!answer || !currentPracticeDrill) {
      return;
    }

    const nextPracticeSession = answerCurrentPracticeStep(practiceDrills, practiceSession, answer);
    const attempt = nextPracticeSession.attempts[nextPracticeSession.attempts.length - 1] ?? null;
    const nextNotebook = attempt ? recordStepAttempt(game.notebook, attempt) : game.notebook;

    setLastAttempt(attempt);
    setGame((currentGame) => ({
      ...currentGame,
      notebook: nextNotebook,
      practiceSession: nextPracticeSession,
    }));
  }

  function submitConceptualAnswer() {
    if (!conceptualChoiceAnswer || !currentConceptualQuestion) {
      return;
    }

    const nextConceptualSession = answerCurrentConceptualQuestion(
      conceptualQuestions,
      conceptualSession,
      conceptualChoiceAnswer,
    );
    const attempt = nextConceptualSession.attempts[nextConceptualSession.attempts.length - 1] ?? null;

    setLastConceptualAttempt(attempt);
    setGame((currentGame) => ({
      ...currentGame,
      conceptualSession: nextConceptualSession,
    }));
  }

  function advanceConceptual() {
    clearConceptualVisualState();
    setGame((currentGame) => ({
      ...currentGame,
      conceptualSession: advanceConceptualQuestion(conceptualQuestions, conceptualSession),
    }));
  }

  function resetGame() {
    const nextGame = createInitialGame();
    clearSavedGame();
    setLastAttempt(null);
    clearConceptualVisualState();
    setSelectedDomainId('somatorio');
    setConceptualModuleId(null);
    setDrawingModuleId(null);
    setGame(nextGame);
  }

  /** Refazer: mesma combinacao de questoes, zera pontuacao e progresso. */
  function restartSimulado() {
    setLastAttempt(null);
    resetAnswerDrafts();
    setActiveMode('exam');
    setGame((currentGame) => ({
      ...currentGame,
      session: createExamSession(currentGame.blueprint),
    }));
  }

  /** Novo simulado: sorteia uma nova combinacao evitando repetir a anterior. */
  function newSimulado() {
    setLastAttempt(null);
    resetAnswerDrafts();
    setActiveMode('exam');
    setGame((currentGame) => {
      const blueprint = buildSimulado({ previous: currentGame.blueprint });
      return { ...currentGame, blueprint, session: createExamSession(blueprint) };
    });
  }

  function startQuickPractice() {
    setLastAttempt(null);
    setActiveMode('practice');
    setGame((currentGame) => ({
      ...currentGame,
      practiceSession: createPracticeSession(practiceDrills, { mode: 'quick', targetCount: 2 }),
    }));
  }

  function startQuickConceptual() {
    clearConceptualVisualState();
    setActiveMode(activeMode === 'drawing' ? 'drawing' : 'conceptual');
    setGame((currentGame) => ({
      ...currentGame,
      conceptualSession: createConceptualPracticeSession(conceptualQuestions, { mode: 'quick', targetCount: 2 }),
    }));
  }

  function startMarathonConceptual() {
    clearConceptualVisualState();
    setActiveMode(activeMode === 'drawing' ? 'drawing' : 'conceptual');
    setGame((currentGame) => ({
      ...currentGame,
      conceptualSession: createConceptualPracticeSession(conceptualQuestions, { mode: 'marathon' }),
    }));
  }

  function startMarathonPractice() {
    setLastAttempt(null);
    setActiveMode('practice');
    setGame((currentGame) => ({
      ...currentGame,
      practiceSession: createPracticeSession(practiceDrills, { mode: 'marathon' }),
    }));
  }

  function selectPracticeModule(moduleId: PracticeModuleId) {
    const moduleDrills = getDrillsForModule(moduleId);
    setLastAttempt(null);
    setPracticeModuleId(moduleId);

    if (moduleDrills.length === 0) {
      return;
    }

    setGame((currentGame) => ({
      ...currentGame,
      practiceSession: createPracticeSession(moduleDrills, { mode: 'quick', targetCount: 2 }),
    }));
  }

  function backToModuleSelection() {
    setLastAttempt(null);
    setPracticeModuleId(null);
  }

  function selectConceptualModule(moduleId: ConceptualDrawingModuleId) {
    const questions = getQuestionsForConceptualDrawingModule(moduleId, lista2QuestionType);
    clearConceptualVisualState();
    if (activeMode === 'drawing') {
      setDrawingModuleId(moduleId);
    } else {
      setConceptualModuleId(moduleId);
    }

    if (questions.length === 0) {
      return;
    }

    setGame((currentGame) => ({
      ...currentGame,
      conceptualSession: createConceptualPracticeSession(questions, { mode: 'quick', targetCount: 2 }),
    }));
  }

  function backToConceptualModuleSelection() {
    clearConceptualVisualState();
    if (activeMode === 'drawing') {
      setDrawingModuleId(null);
    } else {
      setConceptualModuleId(null);
    }
  }

  function restartConceptualModule() {
    clearConceptualVisualState();
    setGame((currentGame) => ({
      ...currentGame,
      conceptualSession: createConceptualPracticeSession(conceptualQuestions, {
        mode: conceptualSession.mode,
        targetCount: conceptualSession.targetCount,
      }),
    }));
  }

  function restartPracticeModule() {
    setLastAttempt(null);
    setGame((currentGame) => ({
      ...currentGame,
      practiceSession: createPracticeSession(practiceDrills, {
        mode: practiceSession.mode,
        targetCount: practiceSession.targetCount,
      }),
    }));
  }

  function markPractice(correct: boolean) {
    if (!topError) {
      return;
    }

    setGame((currentGame) => ({
      ...currentGame,
      notebook: recordReviewResult(currentGame.notebook, topError.id, correct),
    }));
  }

  return (
    <main className="app-shell">
      <header className="app-topbar">
        <div>
          <p className="app-kicker">AEDS II · PUC Minas</p>
          <h1>Reavaliacao AEDS II</h1>
        </div>
        <div className="score-board" aria-label="Pontuacao do simulado">
          <span className="score-board-icon">
            <Trophy aria-hidden="true" size={18} />
          </span>
          <div className="score-board-info">
            <strong>
              {game.session.score}/{game.session.maxScore} pts
            </strong>
            <span className="score-track" aria-hidden="true">
              <span className="score-track-fill" style={{ width: `${progressPercent}%` }} />
            </span>
          </div>
          <span className="score-percent">{progressPercent}%</span>
        </div>
      </header>

      <nav className="mode-tabs" aria-label="Modos de treino">
        <button
          className={activeMode === 'exam' ? 'is-active' : ''}
          onClick={() => setActiveMode('exam')}
          type="button"
        >
          <ClipboardList aria-hidden="true" size={16} />
          Simulado
        </button>
        <button
          className={activeMode === 'practice' ? 'is-active' : ''}
          onClick={() => setActiveMode('practice')}
          type="button"
        >
          <Code2 aria-hidden="true" size={16} />
          Treino de Codigo
        </button>
        <button
          className={activeMode === 'conceptual' ? 'is-active' : ''}
          onClick={() => setActiveMode('conceptual')}
          type="button"
        >
          <BookOpenCheck aria-hidden="true" size={16} />
          Conceitual
        </button>
        <button
          className={activeMode === 'drawing' ? 'is-active' : ''}
          onClick={() => setActiveMode('drawing')}
          type="button"
        >
          <Shapes aria-hidden="true" size={16} />
          Desenho
        </button>
        <button
          className={activeMode === 'explore' ? 'is-active' : ''}
          onClick={() => setActiveMode('explore')}
          type="button"
        >
          <Shapes aria-hidden="true" size={16} />
          Estruturas
        </button>
      </nav>

      {activeMode === 'explore' ? (
        <section className="exam-panel explore-panel" aria-labelledby="explore-title">
          <div className="panel-title">
            <Shapes aria-hidden="true" size={18} />
            <h2 id="explore-title">Estruturas de dados animadas</h2>
          </div>
          <ExploreScreen />
        </section>
      ) : (
      <div className="app-grid">
        <section className="domain-panel" aria-labelledby="domains-title">
          <div className="panel-title">
            <Target aria-hidden="true" size={18} />
            <h2 id="domains-title">Dominios</h2>
          </div>

          <div className="domain-list">
            {domainCatalog.map((domain) => (
              <button
                className={`domain-button ${domain.id === selectedDomainId ? 'is-active' : ''}`}
                key={domain.id}
                onClick={() => setSelectedDomainId(domain.id)}
                type="button"
              >
                <strong>{domain.title}</strong>
                <span>{domain.examRole}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="exam-panel" aria-labelledby="exam-title">
          <div className="panel-title">
            {activeMode === 'exam' ? (
              <ClipboardList aria-hidden="true" size={18} />
            ) : activeMode === 'conceptual' ? (
              <BookOpenCheck aria-hidden="true" size={18} />
            ) : activeMode === 'drawing' ? (
              <Shapes aria-hidden="true" size={18} />
            ) : (
              <Code2 aria-hidden="true" size={18} />
            )}
            <h2 id="exam-title">
              {activeMode === 'exam'
                ? 'Simulado de 6 questoes'
                : activeMode === 'conceptual'
                  ? 'Conceitual'
                  : activeMode === 'drawing'
                    ? 'Desenho'
                    : 'Treino de Codigo'}
            </h2>
          </div>

          {activeMode === 'practice' ? (
            practiceModuleId === null ? (
              <ModuleSelection onSelect={selectPracticeModule} />
            ) : practiceDrills.length === 0 ? (
              <div className="complete-state">
                <Code2 aria-hidden="true" size={42} />
                <h3>Modulo sem exercicios</h3>
                <p>Este modulo ainda nao tem exercicios cadastrados.</p>
                <button className="primary-button" onClick={backToModuleSelection} type="button">
                  <RotateCcw aria-hidden="true" size={18} />
                  Voltar aos modulos
                </button>
              </div>
            ) : (
              <PracticeExperience
                answer={answer}
                blockOrder={blockOrder}
                choiceAnswer={choiceAnswer}
                currentPracticeDrill={currentPracticeDrill}
                fixId={fixId}
                fixLineIndex={fixLineIndex}
                lastAttempt={lastAttempt}
                moduleTitle={getModuleTitle(practiceModuleId)}
                onAddBlock={(blockId) => setBlockOrder((order) => [...order, blockId])}
                onChangeModule={backToModuleSelection}
                onChoice={setChoiceAnswer}
                onFixId={setFixId}
                onFixLine={setFixLineIndex}
                onResetBlocks={() => setBlockOrder([])}
                onResetDrafts={resetAnswerDrafts}
                onRestartModule={restartPracticeModule}
                onStartMarathon={startMarathonPractice}
                onStartQuick={startQuickPractice}
                onSubmit={submitAnswer}
                onText={setTextAnswer}
                onToggleTeaching={() => setShowTeaching((value) => !value)}
                practiceSession={practiceSession}
                showTeaching={showTeaching}
                textAnswer={textAnswer}
              />
            )
          ) : activeMode === 'conceptual' || activeMode === 'drawing' ? (
            lista2ModuleId === null ? (
              <ConceptualModuleSelection questionType={lista2QuestionType} onSelect={selectConceptualModule} />
            ) : conceptualQuestions.length === 0 ? (
              <div className="complete-state">
                {activeMode === 'drawing' ? (
                  <Shapes aria-hidden="true" size={42} />
                ) : (
                  <BookOpenCheck aria-hidden="true" size={42} />
                )}
                <h3>Modulo sem questoes</h3>
                <p>Este filtro ainda nao tem questoes cadastradas.</p>
                <button className="primary-button" onClick={backToConceptualModuleSelection} type="button">
                  <RotateCcw aria-hidden="true" size={18} />
                  Voltar aos filtros
                </button>
              </div>
            ) : (
              <ConceptualPracticeExperience
                answeredOptionId={conceptualSession.answeredOptionId}
                choiceAnswer={conceptualChoiceAnswer}
                currentQuestion={currentConceptualQuestion}
                lastAttempt={lastConceptualAttempt}
                moduleTitle={getConceptualDrawingModuleTitle(lista2ModuleId)}
                onAdvance={advanceConceptual}
                onChangeModule={backToConceptualModuleSelection}
                onChoice={setConceptualChoiceAnswer}
                onResetDrafts={resetAnswerDrafts}
                onRestartModule={restartConceptualModule}
                onStartMarathon={startMarathonConceptual}
                onStartQuick={startQuickConceptual}
                onSubmit={submitAnswer}
                onToggleTeaching={() => setShowTeaching((value) => !value)}
                practiceSession={conceptualSession}
                showTeaching={showTeaching}
              />
            )
          ) : game.session.completed || !currentQuestion || !currentStep ? (
            <div className="complete-state">
              <CheckCircle2 aria-hidden="true" size={42} />
              <h3>Simulado concluido</h3>
              <p>
                Pontuacao final: {game.session.score} de {game.session.maxScore}.
              </p>
              <div className="action-row">
                <button className="primary-button" onClick={newSimulado} type="button">
                  <Shuffle aria-hidden="true" size={18} />
                  Novo simulado
                </button>
                <button className="ghost-button" onClick={restartSimulado} type="button">
                  <RotateCcw aria-hidden="true" size={18} />
                  Refazer
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="question-progress" aria-label={`Questao ${currentQuestion.number} de ${game.blueprint.questions.length}`}>
                <div className="question-progress-dots" aria-hidden="true">
                  {game.blueprint.questions.map((question, index) => (
                    <span
                      className={`question-dot ${
                        index < game.session.currentQuestionIndex
                          ? 'is-done'
                          : index === game.session.currentQuestionIndex
                            ? 'is-current'
                            : ''
                      }`}
                      key={question.id}
                    />
                  ))}
                </div>
                <span>
                  Questao {currentQuestion.number} de {game.blueprint.questions.length} · Etapa{' '}
                  {game.session.currentStepIndex + 1} de {currentQuestion.steps.length}
                </span>
                <button className="ghost-button compact" onClick={newSimulado} type="button">
                  <Shuffle aria-hidden="true" size={16} />
                  Novo simulado
                </button>
              </div>

              <div className="question-header">
                <span className="question-badge" data-domain={currentQuestion.domainId}>
                  Q{currentQuestion.number}
                </span>
                <div>
                  <h3>{currentQuestion.title}</h3>
                  <p>{formatLabels[currentQuestion.format]}</p>
                </div>
              </div>

              <p className="question-stem">{currentQuestion.stem}</p>
              {currentQuestion.scaffold && (
                <pre className="code-scaffold">
                  <code>{currentQuestion.scaffold}</code>
                </pre>
              )}
              {currentQuestion.visual && <StructureVizCard visual={currentQuestion.visual} />}

              <div className="step-panel">
                <div className="step-meta">
                  <span>{skillLabels[currentStep.skillId]}</span>
                  <span>{currentDomain.shortTitle}</span>
                </div>
                <h4>{currentStep.prompt}</h4>

                <AnswerControl
                  blockOrder={blockOrder}
                  choiceAnswer={choiceAnswer}
                  fixId={fixId}
                  fixLineIndex={fixLineIndex}
                  onAddBlock={(blockId) => setBlockOrder((order) => [...order, blockId])}
                  onChoice={setChoiceAnswer}
                  onFixId={setFixId}
                  onFixLine={setFixLineIndex}
                  onResetBlocks={() => setBlockOrder([])}
                  onText={setTextAnswer}
                  step={currentStep}
                  textAnswer={textAnswer}
                />
              </div>

              <div className="action-row">
                <button className="primary-button" disabled={!answer} onClick={submitAnswer} type="button">
                  <CheckCircle2 aria-hidden="true" size={18} />
                  Responder
                </button>
                <button className="ghost-button" onClick={resetAnswerDrafts} type="button">
                  <RotateCcw aria-hidden="true" size={18} />
                  Limpar
                </button>
                <button className="ghost-button" onClick={() => setShowTeaching((value) => !value)} type="button">
                  <BookOpenCheck aria-hidden="true" size={18} />
                  Me ensine
                </button>
              </div>

              {showTeaching && <TeachingBox step={currentStep} />}

              {lastAttempt && (
                <div className={`feedback ${lastAttempt.correct ? 'is-correct' : 'is-wrong'}`} role="status">
                  {lastAttempt.correct ? (
                    <CheckCircle2 aria-hidden="true" size={18} />
                  ) : (
                    <XCircle aria-hidden="true" size={18} />
                  )}
                  <span>{lastAttempt.feedback}</span>
                </div>
              )}
            </>
          )}
        </section>

        <section className="review-panel" aria-labelledby="review-title">
          <div className="panel-title">
            <Brain aria-hidden="true" size={18} />
            <h2 id="review-title">Caderno de erros</h2>
          </div>

          {priorityErrors.length === 0 ? (
            <div className="empty-review">
              <BookOpenCheck aria-hidden="true" size={32} />
              <p>Nenhum erro critico agora.</p>
            </div>
          ) : (
            <>
              <ol className="error-list">
                {priorityErrors.slice(0, 3).map((record) => (
                  <li key={record.id}>
                    <strong>{skillLabels[record.skillId]}</strong>
                    <span>
                      {record.domainId} · {record.mistakeTag} · {record.attempts}x
                    </span>
                  </li>
                ))}
              </ol>

              {similarPractice && (
                <div className="practice-box">
                  <div className="practice-heading">
                    <Code2 aria-hidden="true" size={18} />
                    <h3>{similarPractice.title}</h3>
                  </div>
                  <p>{similarPractice.prompt}</p>
                  <div className="practice-actions">
                    <button className="ghost-button" onClick={() => markPractice(false)} type="button">
                      <XCircle aria-hidden="true" size={18} />
                      Errei
                    </button>
                    <button className="primary-button" onClick={() => markPractice(true)} type="button">
                      <CheckCircle2 aria-hidden="true" size={18} />
                      Acertei
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
      )}
    </main>
  );
}

function ModuleSelection({ onSelect }: { onSelect: (moduleId: PracticeModuleId) => void }) {
  const modules = getPracticeModules();

  return (
    <div className="module-select">
      <p className="question-stem">
        Escolha um modulo para treinar. "Conteudo inteiro" mistura todos os conteudos em ordem aleatoria; os demais
        trazem so as questoes daquele assunto.
      </p>
      <div className="domain-list">
        {modules.map((module) => (
          <button
            className={`domain-button ${module.id === 'all' ? 'is-active' : ''}`}
            key={module.id}
            onClick={() => onSelect(module.id)}
            type="button"
          >
            <strong>{module.title}</strong>
            <span>{module.description}</span>
            <span>
              {module.count} {module.count === 1 ? 'exercicio' : 'exercicios'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ConceptualModuleSelection({
  onSelect,
  questionType,
}: {
  onSelect: (moduleId: ConceptualDrawingModuleId) => void;
  questionType: ConceptualDrawingType;
}) {
  const modules = getConceptualDrawingModules(questionType);

  return (
    <div className="module-select">
      <p className="question-stem">
        Escolha um filtro. "Conteudo inteiro" mistura todas as questoes deste modo; os demais isolam modulo real da
        Lista 2.
      </p>
      <div className="domain-list">
        {modules.map((module) => (
          <button
            className={`domain-button ${module.id === 'all' ? 'is-active' : ''}`}
            key={module.id}
            onClick={() => onSelect(module.id)}
            type="button"
          >
            <strong>{module.title}</strong>
            <span>{module.description}</span>
            <span>
              {module.count} {module.count === 1 ? 'questao' : 'questoes'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

type ConceptualPracticeExperienceProps = {
  currentQuestion: ConceptualDrawingQuestion | undefined;
  practiceSession: ConceptualPracticeSession;
  choiceAnswer: string;
  answeredOptionId: string | null;
  lastAttempt: ConceptualAttempt | null;
  moduleTitle: string;
  onChoice: (optionId: string) => void;
  onResetDrafts: () => void;
  onSubmit: () => void;
  onAdvance: () => void;
  onChangeModule: () => void;
  onRestartModule: () => void;
  onStartQuick: () => void;
  onStartMarathon: () => void;
  onToggleTeaching: () => void;
  showTeaching: boolean;
};

function ConceptualPracticeExperience({
  answeredOptionId,
  choiceAnswer,
  currentQuestion,
  lastAttempt,
  moduleTitle,
  onAdvance,
  onChangeModule,
  onChoice,
  onResetDrafts,
  onRestartModule,
  onStartMarathon,
  onStartQuick,
  onSubmit,
  onToggleTeaching,
  practiceSession,
  showTeaching,
}: ConceptualPracticeExperienceProps) {
  const answered = answeredOptionId !== null;
  if (practiceSession.completed || !currentQuestion) {
    return (
      <div className="complete-state">
        <CheckCircle2 aria-hidden="true" size={42} />
        <h3>Sessao rapida concluida</h3>
        <p>
          {practiceSession.completedCount} questoes feitas neste ciclo · {practiceSession.score} pts · Filtro:{' '}
          {moduleTitle}
        </p>
        {lastAttempt && (
          <div className={`feedback ${lastAttempt.correct ? 'is-correct' : 'is-wrong'}`} role="status">
            {lastAttempt.correct ? (
              <CheckCircle2 aria-hidden="true" size={18} />
            ) : (
              <XCircle aria-hidden="true" size={18} />
            )}
            <span>{lastAttempt.feedback}</span>
          </div>
        )}
        <div className="practice-actions">
          <button className="primary-button" onClick={onStartQuick} type="button">
            <BookOpenCheck aria-hidden="true" size={18} />
            Pegar 2 questoes
          </button>
          <button className="ghost-button" onClick={onStartMarathon} type="button">
            <RotateCcw aria-hidden="true" size={18} />
            Maratona
          </button>
          <button className="ghost-button" onClick={onChangeModule} type="button">
            <ListChecks aria-hidden="true" size={18} />
            Trocar filtro
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="practice-toolbar">
        <div>
          <strong>Modulo: {moduleTitle}</strong>
          <span>
            {practiceSession.mode === 'quick' ? 'Sessao rapida' : 'Maratona'} ·{' '}
            {getConceptualProgressLabel(practiceSession)} questoes · {practiceSession.score} pts · {currentQuestion.type}
          </span>
        </div>
        <div className="practice-actions">
          <button className="ghost-button compact" onClick={onChangeModule} type="button">
            <ListChecks aria-hidden="true" size={16} />
            Trocar filtro
          </button>
          <button className="ghost-button compact" onClick={onRestartModule} type="button">
            <RotateCcw aria-hidden="true" size={16} />
            Reiniciar
          </button>
          <button className="ghost-button compact" onClick={onStartQuick} type="button">
            Pegar 2 questoes
          </button>
          <button className="ghost-button compact" onClick={onStartMarathon} type="button">
            Maratona
          </button>
        </div>
      </div>

      <div className="question-header">
        <span className="question-badge" data-domain={currentQuestion.domainId}>
          {currentQuestion.type === 'desenho' ? 'D' : 'Q'}
        </span>
        <div>
          <h3>{currentQuestion.title}</h3>
          <p>{currentQuestion.type === 'desenho' ? 'Alternativas visuais' : 'Questao conceitual'}</p>
        </div>
      </div>

      <p className="question-stem">{currentQuestion.stem}</p>

      {currentQuestion.type === 'desenho' && <DrawingDemo question={currentQuestion} />}

      <div className="step-panel">
        <div className="step-meta">
          <span>{currentQuestion.type === 'desenho' ? 'Desenho' : 'Conceitual'}</span>
          <span>{currentQuestion.difficulty}</span>
        </div>
        <h4>Escolha a alternativa correta e confirme a resposta.</h4>
        {currentQuestion.type === 'desenho' ? (
          <VisualChoiceControl
            answeredOptionId={answeredOptionId}
            choiceAnswer={choiceAnswer}
            correctOptionId={currentQuestion.correctOptionId}
            onChoice={onChoice}
            options={currentQuestion.options}
          />
        ) : (
          <ConceptualChoiceControl
            answeredOptionId={answeredOptionId}
            choiceAnswer={choiceAnswer}
            correctOptionId={currentQuestion.correctOptionId}
            onChoice={onChoice}
            options={currentQuestion.options}
          />
        )}
      </div>

      <div className="action-row">
        {answered ? (
          <button className="primary-button" onClick={onAdvance} type="button">
            <ChevronRight aria-hidden="true" size={18} />
            Próxima
          </button>
        ) : (
          <button className="primary-button" disabled={!choiceAnswer} onClick={onSubmit} type="button">
            <CheckCircle2 aria-hidden="true" size={18} />
            Responder
          </button>
        )}
        <button className="ghost-button" disabled={answered} onClick={onResetDrafts} type="button">
          <RotateCcw aria-hidden="true" size={18} />
          Limpar
        </button>
        <button className="ghost-button" onClick={onToggleTeaching} type="button">
          <BookOpenCheck aria-hidden="true" size={18} />
          Me ensine
        </button>
      </div>

      {showTeaching && <ConceptualTeachingBox question={currentQuestion} />}

      {lastAttempt && (
        <div className={`feedback ${lastAttempt.correct ? 'is-correct' : 'is-wrong'}`} role="status">
          {lastAttempt.correct ? <CheckCircle2 aria-hidden="true" size={18} /> : <XCircle aria-hidden="true" size={18} />}
          <span>{lastAttempt.feedback}</span>
        </div>
      )}
    </>
  );
}

function ConceptualChoiceControl({
  answeredOptionId,
  choiceAnswer,
  correctOptionId,
  onChoice,
  options,
}: {
  answeredOptionId: string | null;
  choiceAnswer: string;
  correctOptionId: string;
  onChoice: (optionId: string) => void;
  options: ConceptualDrawingOption[];
}) {
  const answered = answeredOptionId !== null;

  return (
    <div className="option-grid">
      {options.map((option, index) => (
        <button
          className={optionClassName('option-button', option.id, choiceAnswer, answeredOptionId, correctOptionId)}
          disabled={answered}
          key={option.id}
          onClick={() => onChoice(option.id)}
          type="button"
        >
          {formatOptionLabel(option, index)}
        </button>
      ))}
    </div>
  );
}

function VisualChoiceControl({
  answeredOptionId,
  choiceAnswer,
  correctOptionId,
  onChoice,
  options,
}: {
  answeredOptionId: string | null;
  choiceAnswer: string;
  correctOptionId: string;
  onChoice: (optionId: string) => void;
  options: ConceptualDrawingOption[];
}) {
  const answered = answeredOptionId !== null;

  return (
    <div className="visual-option-grid">
      {options.map((option, index) => (
        <div
          className={optionClassName('visual-option', option.id, choiceAnswer, answeredOptionId, correctOptionId)}
          key={option.id}
        >
          {option.visual && <StaticStructureCard visual={option.visual} />}
          <button
            className={optionClassName('option-button', option.id, choiceAnswer, answeredOptionId, correctOptionId)}
            disabled={answered}
            onClick={() => onChoice(option.id)}
            type="button"
          >
            {formatOptionLabel(option, index)}
          </button>
        </div>
      ))}
    </div>
  );
}

function DrawingDemo({ question }: { question: ConceptualDrawingQuestion }) {
  const correctVisual = question.options.find((option) => option.id === question.correctOptionId)?.visual;
  const demoVisual = question.demoVisual ?? correctVisual;

  if (!demoVisual) {
    return null;
  }

  return <StructureVizCard key={question.id} compact={false} visual={demoVisual} />;
}

function optionClassName(
  baseClassName: string,
  optionId: string,
  choiceAnswer: string,
  answeredOptionId: string | null,
  correctOptionId: string,
): string {
  const classNames = [baseClassName];

  if (choiceAnswer === optionId || answeredOptionId === optionId) {
    classNames.push('is-selected');
  }

  if (answeredOptionId !== null && optionId === correctOptionId) {
    classNames.push('is-correct');
  }

  if (answeredOptionId === optionId && optionId !== correctOptionId) {
    classNames.push('is-wrong');
  }

  return classNames.join(' ');
}

function ConceptualTeachingBox({ question }: { question: ConceptualDrawingQuestion }) {
  const correctOption = question.options.find((option) => option.id === question.correctOptionId);

  return (
    <aside className="teaching-box" aria-label="Explicacao guiada">
      <div className="practice-heading">
        <BookOpenCheck aria-hidden="true" size={18} />
        <h3>Me ensine</h3>
      </div>
      <p>{question.explanation}</p>
      {correctOption && (
        <p>
          Alternativa correta: <strong>{correctOption.label}</strong>
        </p>
      )}
    </aside>
  );
}

function formatOptionLabel(option: ConceptualDrawingOption, index: number): string {
  if (/^[A-D]\./.test(option.label)) {
    return option.label;
  }

  return `${String.fromCharCode(65 + index)}. ${option.label}`;
}

type PracticeExperienceProps = {
  currentPracticeDrill: CodeDrill | undefined;
  practiceSession: NonNullable<SavedGameState['practiceSession']>;
  answer: StepAnswer | undefined;
  choiceAnswer: string;
  textAnswer: string;
  blockOrder: string[];
  fixLineIndex: number | null;
  fixId: string;
  lastAttempt: StepAttempt | null;
  moduleTitle: string;
  onChoice: (optionId: string) => void;
  onText: (text: string) => void;
  onAddBlock: (blockId: string) => void;
  onResetBlocks: () => void;
  onFixLine: (lineIndex: number) => void;
  onFixId: (fixId: string) => void;
  onResetDrafts: () => void;
  onSubmit: () => void;
  onChangeModule: () => void;
  onRestartModule: () => void;
  onStartQuick: () => void;
  onStartMarathon: () => void;
  onToggleTeaching: () => void;
  showTeaching: boolean;
};

function PracticeExperience({
  answer,
  blockOrder,
  choiceAnswer,
  currentPracticeDrill,
  fixId,
  fixLineIndex,
  lastAttempt,
  moduleTitle,
  onAddBlock,
  onChangeModule,
  onChoice,
  onFixId,
  onFixLine,
  onResetBlocks,
  onResetDrafts,
  onRestartModule,
  onStartMarathon,
  onStartQuick,
  onSubmit,
  onText,
  onToggleTeaching,
  practiceSession,
  showTeaching,
  textAnswer,
}: PracticeExperienceProps) {
  if (practiceSession.completed || !currentPracticeDrill) {
    return (
      <div className="complete-state">
        <CheckCircle2 aria-hidden="true" size={42} />
        <h3>Sessao rapida concluida</h3>
        <p>
          {practiceSession.completedCount} questoes feitas neste ciclo · Modulo: {moduleTitle}
        </p>
        <div className="practice-actions">
          <button className="primary-button" onClick={onStartQuick} type="button">
            <Code2 aria-hidden="true" size={18} />
            Pegar 2 questoes
          </button>
          <button className="ghost-button" onClick={onStartMarathon} type="button">
            <RotateCcw aria-hidden="true" size={18} />
            Maratona
          </button>
          <button className="ghost-button" onClick={onChangeModule} type="button">
            <ListChecks aria-hidden="true" size={18} />
            Trocar modulo
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="practice-toolbar">
        <div>
          <strong>Modulo: {moduleTitle}</strong>
          <span>
            {practiceSession.mode === 'quick' ? 'Sessao rapida' : 'Maratona'} ·{' '}
            {getPracticeProgressLabel(practiceSession)} questoes
          </span>
        </div>
        <div className="practice-actions">
          <button className="ghost-button compact" onClick={onChangeModule} type="button">
            <ListChecks aria-hidden="true" size={16} />
            Trocar modulo
          </button>
          <button className="ghost-button compact" onClick={onRestartModule} type="button">
            <RotateCcw aria-hidden="true" size={16} />
            Reiniciar
          </button>
          <button className="ghost-button compact" onClick={onStartQuick} type="button">
            Pegar 2 questoes
          </button>
          <button className="ghost-button compact" onClick={onStartMarathon} type="button">
            Maratona
          </button>
        </div>
      </div>

      <div className="question-header">
        <span className="question-badge">C</span>
        <div>
          <h3>{currentPracticeDrill.title}</h3>
          <p>{formatLabels[currentPracticeDrill.format]}</p>
        </div>
      </div>

      <p className="question-stem">{currentPracticeDrill.stem}</p>

      <div className="paper-layout">
        <pre className="code-scaffold">
          <code>{currentPracticeDrill.scaffold}</code>
        </pre>
        <StructureVizCard visual={currentPracticeDrill.visual} />
      </div>

      <div className="step-panel">
        <div className="step-meta">
          <span>{skillLabels[currentPracticeDrill.step.skillId]}</span>
          <span>{currentPracticeDrill.phase === 'repeat' ? 'Repeticao' : 'Modificacao'}</span>
        </div>
        <h4>{currentPracticeDrill.step.prompt}</h4>

        <AnswerControl
          blockOrder={blockOrder}
          choiceAnswer={choiceAnswer}
          fixId={fixId}
          fixLineIndex={fixLineIndex}
          onAddBlock={onAddBlock}
          onChoice={onChoice}
          onFixId={onFixId}
          onFixLine={onFixLine}
          onResetBlocks={onResetBlocks}
          onText={onText}
          step={currentPracticeDrill.step}
          textAnswer={textAnswer}
        />
      </div>

      <div className="action-row">
        <button className="primary-button" disabled={!answer} onClick={onSubmit} type="button">
          <CheckCircle2 aria-hidden="true" size={18} />
          Responder
        </button>
        <button className="ghost-button" onClick={onResetDrafts} type="button">
          <RotateCcw aria-hidden="true" size={18} />
          Limpar
        </button>
        <button className="ghost-button" onClick={onToggleTeaching} type="button">
          <BookOpenCheck aria-hidden="true" size={18} />
          Me ensine
        </button>
      </div>

      {showTeaching && <TeachingBox step={currentPracticeDrill.step} />}

      {lastAttempt && (
        <div className={`feedback ${lastAttempt.correct ? 'is-correct' : 'is-wrong'}`} role="status">
          {lastAttempt.correct ? <CheckCircle2 aria-hidden="true" size={18} /> : <XCircle aria-hidden="true" size={18} />}
          <span>{lastAttempt.feedback}</span>
        </div>
      )}
    </>
  );
}

function TeachingBox({ step }: { step: ChallengeStep }) {
  const teachingItems = getTeachingItems(step);
  const teachingVisual = getTeachingVisual(step);

  return (
    <aside className="teaching-box" aria-label="Explicacao guiada">
      <div className="practice-heading">
        <BookOpenCheck aria-hidden="true" size={18} />
        <h3>Me ensine</h3>
      </div>
      <ol>
        {teachingItems.map((item) => (
          <li key={item.code}>
            <code>{item.code}</code>
            <span>{item.note}</span>
          </li>
        ))}
      </ol>
      {step.kind === 'function' && (
        <pre className="code-scaffold">
          <code>{step.solution}</code>
        </pre>
      )}
      {teachingVisual && <StaticStructureCard visual={teachingVisual} />}
      {step.explanation && <p>{step.explanation}</p>}
    </aside>
  );
}

/** Desenho correto para questoes de escolha visual reaproveitadas no simulado. */
function getTeachingVisual(step: ChallengeStep): StructureVisual | undefined {
  if (step.kind === 'choice') {
    return step.options.find((option) => option.id === step.correctOptionId)?.visual;
  }

  if (step.kind === 'rubric') {
    const correctId = step.acceptableOptionIds[0];
    return step.options.find((option) => option.id === correctId)?.visual;
  }

  return undefined;
}

function getTeachingItems(step: ChallengeStep): Array<{ code: string; note: string }> {
  if (step.kind === 'choice') {
    const option = step.options.find((item) => item.id === step.correctOptionId);

    return [
      {
        code: option?.label ?? step.correctOptionId,
        note: 'Esta e a escolha correta para manter a logica da estrutura.',
      },
    ];
  }

  if (step.kind === 'rubric') {
    return step.acceptableOptionIds.map((optionId) => {
      const option = step.options.find((item) => item.id === optionId);

      return {
        code: option?.label ?? optionId,
        note: 'Esta justificativa cobre a propriedade essencial da questao.',
      };
    });
  }

  if (step.kind === 'gap') {
    return [
      {
        code: step.answers[0] ?? '',
        note: 'Essa lacuna completa a condicao ou expressao central do metodo.',
      },
    ];
  }

  if (step.kind === 'code') {
    return [
      {
        code: step.acceptedAnswers[0] ?? '',
        note: 'Essa linha e a resposta modelo; repare nos ponteiros, indices e chamadas usadas.',
      },
    ];
  }

  if (step.kind === 'function') {
    return step.lineExplanations;
  }

  if (step.kind === 'blocks') {
    return step.correctOrder.map((blockId, index) => {
      const block = step.blocks.find((item) => item.id === blockId);

      return {
        code: block?.label ?? blockId,
        note: `Passo ${index + 1} da logica correta.`,
      };
    });
  }

  const line = step.lines[step.correctLineIndex] ?? '';
  const fix = step.fixOptions.find((option) => option.id === step.correctFixId);

  return [
    {
      code: line,
      note: 'Esta e a linha que quebra a logica atual.',
    },
    {
      code: fix?.label ?? step.correctFixId,
      note: 'Esse conserto preserva a regra esperada pela estrutura.',
    },
  ];
}

type AnswerControlProps = {
  step: ChallengeStep;
  choiceAnswer: string;
  textAnswer: string;
  blockOrder: string[];
  fixLineIndex: number | null;
  fixId: string;
  onChoice: (optionId: string) => void;
  onText: (text: string) => void;
  onAddBlock: (blockId: string) => void;
  onResetBlocks: () => void;
  onFixLine: (lineIndex: number) => void;
  onFixId: (fixId: string) => void;
};

function AnswerControl({
  blockOrder,
  choiceAnswer,
  fixId,
  fixLineIndex,
  onAddBlock,
  onChoice,
  onFixId,
  onFixLine,
  onResetBlocks,
  onText,
  step,
  textAnswer,
}: AnswerControlProps) {
  if (step.kind === 'choice' || step.kind === 'rubric') {
    const hasVisuals = step.options.some((option) => option.visual);

    if (hasVisuals) {
      return (
        <div className="visual-option-grid">
          {step.options.map((option) => (
            <div className={`visual-option ${choiceAnswer === option.id ? 'is-selected' : ''}`} key={option.id}>
              {option.visual && <StaticStructureCard visual={option.visual} />}
              <button
                className={`option-button ${choiceAnswer === option.id ? 'is-selected' : ''}`}
                onClick={() => onChoice(option.id)}
                type="button"
              >
                {option.label}
              </button>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="option-grid">
        {step.options.map((option) => (
          <button
            className={`option-button ${choiceAnswer === option.id ? 'is-selected' : ''}`}
            key={option.id}
            onClick={() => onChoice(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    );
  }

  if (step.kind === 'gap' || step.kind === 'code' || step.kind === 'function') {
    return (
      <textarea
        aria-label="Resposta"
        className="text-answer"
        onChange={(event) => onText(event.target.value)}
        placeholder={step.kind === 'function' ? 'Escreva a funcao completa' : 'Digite a resposta'}
        rows={step.kind === 'function' ? 8 : 4}
        value={textAnswer}
      />
    );
  }

  if (step.kind === 'blocks') {
    return <BlocksAnswer blockOrder={blockOrder} onAddBlock={onAddBlock} onResetBlocks={onResetBlocks} step={step} />;
  }

  return (
    <FixAnswer
      fixId={fixId}
      fixLineIndex={fixLineIndex}
      onFixId={onFixId}
      onFixLine={onFixLine}
      step={step}
    />
  );
}

type BlocksAnswerProps = {
  step: BlocksStep;
  blockOrder: string[];
  onAddBlock: (blockId: string) => void;
  onResetBlocks: () => void;
};

function BlocksAnswer({ blockOrder, onAddBlock, onResetBlocks, step }: BlocksAnswerProps) {
  const selectedIds = new Set(blockOrder);
  const selectedBlocks = blockOrder
    .map((blockId) => step.blocks.find((block) => block.id === blockId))
    .filter((block): block is BlocksStep['blocks'][number] => Boolean(block));

  return (
    <div className="blocks-answer">
      <div className="block-bank">
        {step.blocks.map((block) => (
          <button
            disabled={selectedIds.has(block.id)}
            key={block.id}
            onClick={() => onAddBlock(block.id)}
            title="Adicionar bloco"
            type="button"
          >
            <ListChecks aria-hidden="true" size={16} />
            {block.label}
          </button>
        ))}
      </div>

      <ol className="ordered-blocks">
        {selectedBlocks.map((block) => (
          <li key={block.id}>{block.label}</li>
        ))}
      </ol>

      <button className="ghost-button compact" onClick={onResetBlocks} type="button">
        <RotateCcw aria-hidden="true" size={16} />
        Refazer ordem
      </button>
    </div>
  );
}

type FixAnswerProps = {
  step: FixStep;
  fixLineIndex: number | null;
  fixId: string;
  onFixLine: (lineIndex: number) => void;
  onFixId: (fixId: string) => void;
};

function FixAnswer({ fixId, fixLineIndex, onFixId, onFixLine, step }: FixAnswerProps) {
  return (
    <div className="fix-answer">
      <div className="code-lines">
        {step.lines.map((line, index) => (
          <button
            className={fixLineIndex === index ? 'is-selected' : ''}
            key={`${line}-${index}`}
            onClick={() => onFixLine(index)}
            type="button"
          >
            <span>{index + 1}</span>
            <code>{line}</code>
          </button>
        ))}
      </div>

      <div className="option-grid">
        {step.fixOptions.map((option) => (
          <button
            className={`option-button ${fixId === option.id ? 'is-selected' : ''}`}
            key={option.id}
            onClick={() => onFixId(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function buildAnswer(
  step: ChallengeStep,
  choiceAnswer: string,
  textAnswer: string,
  blockOrder: string[],
  fixLineIndex: number | null,
  fixId: string,
): StepAnswer | undefined {
  if (step.kind === 'choice' || step.kind === 'rubric') {
    return choiceAnswer ? { kind: 'choice', optionId: choiceAnswer } : undefined;
  }

  if (step.kind === 'gap' || step.kind === 'code' || step.kind === 'function') {
    return textAnswer.trim() ? { kind: 'text', text: textAnswer } : undefined;
  }

  if (step.kind === 'blocks') {
    return blockOrder.length === step.correctOrder.length ? { kind: 'blocks', order: blockOrder } : undefined;
  }

  if (fixLineIndex === null || !fixId) {
    return undefined;
  }

  return { kind: 'fix', lineIndex: fixLineIndex, fixId };
}
