import { Routes, Route } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { HomePage } from '@/features/home/HomePage';

/** Stub explícito — o playground real é construído por outra pessoa em paralelo. */
function PlaygroundPlaceholder() {
  return <div className="text-[var(--color-text-secondary)]">Em construção</div>;
}

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/playground" element={<PlaygroundPlaceholder />} />
        <Route path="/_qa" element={<QaScratch />} />
      </Route>
    </Routes>
  );
}

export default App;
