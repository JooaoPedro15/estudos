import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { HomePage } from '@/features/home/HomePage';
import { ModuleListPage } from '@/features/module/ModuleListPage';
import { ModulePage } from '@/features/module/ModulePage';
import { ConceptLessonPage } from '@/features/module/ConceptLessonPage';
import { QuickStudySession } from '@/features/study/QuickStudySession';
import { DeepStudySession } from '@/features/study/DeepStudySession';
import { WeakTopicsSession } from '@/features/study/WeakTopicsSession';
import { PracticeSession } from '@/features/study/PracticeSession';
import { ConceptDrillSession } from '@/features/study/ConceptDrillSession';
import { ExamDrillSession } from '@/features/study/ExamDrillSession';
import { QuestionPage } from '@/features/study/QuestionPage';
import { ExamListPage } from '@/features/exam/ExamListPage';
import { ExamSimulator } from '@/features/exam/ExamSimulator';
import { CodePuzzleSimulator } from '@/features/exam/CodePuzzleSimulator';
import { CodeMemoryReviewPage } from '@/features/exam/CodeMemoryReviewPage';
import { ProgressPage } from '@/features/progress/ProgressPage';
import { GraphPlayground } from '@/features/playground/GraphPlayground';
import { StudyPrioritiesPage } from '@/features/priorities/StudyPrioritiesPage';

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/prioridades" element={<StudyPrioritiesPage />} />
        <Route path="/prova2" element={<Navigate to="/prioridades" replace />} />
        <Route path="/modulos" element={<ModuleListPage />} />
        <Route path="/modulos/:moduleId" element={<ModulePage />} />
        <Route path="/modulos/:moduleId/:topicId" element={<ConceptLessonPage />} />
        <Route path="/estudar/rapido" element={<QuickStudySession />} />
        <Route path="/estudar/sessao" element={<DeepStudySession />} />
        <Route path="/estudar/pontos-fracos" element={<WeakTopicsSession />} />
        <Route path="/estudar/pratica-livre" element={<PracticeSession />} />
        <Route path="/estudar/conceitos" element={<ConceptDrillSession />} />
        <Route path="/estudar/prova" element={<ExamDrillSession />} />
        <Route path="/questao/:id" element={<QuestionPage />} />
        <Route path="/simulado" element={<ExamListPage />} />
        <Route path="/simulado/codigo" element={<CodePuzzleSimulator />} />
        <Route path="/simulado/revisao" element={<CodeMemoryReviewPage />} />
        <Route path="/simulado/:examId" element={<ExamSimulator />} />
        <Route path="/progresso" element={<ProgressPage />} />
        <Route path="/revisao-final" element={<Navigate to="/" replace />} />
        <Route path="/playground" element={<GraphPlayground />} />
      </Route>
    </Routes>
  );
}

export default App;
