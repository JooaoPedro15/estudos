import { Outlet, Link } from 'react-router-dom';
import clsx from 'clsx';
import type { ExamId } from '@/content/types';
import { setActiveExam, useActiveExam } from '@/store/activeExam';

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Estudo P2', href: '/prova2' },
  { label: 'Início', href: '/' },
  { label: 'Módulos', href: '/modulos' },
  { label: 'Laboratório', href: '/playground' },
  { label: 'Simulado', href: '/simulado' },
  { label: 'Progresso', href: '/progresso' },
  { label: 'Revisão Final', href: '/revisao-final' },
];

function GrafosGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M7.3 15.3 9.6 6.4M14.7 15.3 12.4 6.4M8 17H14" stroke="var(--color-border-strong)" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="5" cy="17" r="3" fill="var(--color-cyan)" />
      <circle cx="17" cy="17" r="3" fill="var(--color-accent)" />
      <circle cx="11" cy="4" r="3" fill="var(--color-amber)" />
    </svg>
  );
}

const EXAMS: ExamId[] = ['P1', 'P2'];

/** Troca a prova ativa: o app inteiro passa a mostrar só os módulos e simulados dela. */
function ExamSwitch() {
  const active = useActiveExam();
  return (
    <div role="group" aria-label="Prova" className="flex rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-0.5">
      {EXAMS.map((exam) => (
        <button
          key={exam}
          type="button"
          aria-pressed={active === exam}
          onClick={() => setActiveExam(exam)}
          className={clsx(
            'rounded-md px-2.5 py-1 text-xs font-semibold transition-colors',
            active === exam ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]',
          )}
        >
          {exam}
        </button>
      ))}
    </div>
  );
}

/** Layout raiz: topo fixo com wordmark + seletor de prova + navegação, área de conteúdo com largura máxima. */
export function AppShell() {
  return (
    <div className="min-h-full">
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-[var(--color-accent)] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Pular para o conteúdo
      </a>
      <header className="sticky top-0 z-40 border-b border-[var(--color-border-soft)] bg-[var(--color-bg-overlay)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:gap-x-6 sm:px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight text-[var(--color-text-primary)]">
              <GrafosGlyph />
              Grafos
            </Link>
            <ExamSwitch />
          </div>
          <nav aria-label="Navegação principal" className="-mx-1 flex w-full items-center gap-1 overflow-x-auto sm:mx-0 sm:w-auto">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="shrink-0 rounded-lg px-3 py-1.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main id="conteudo-principal" className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
