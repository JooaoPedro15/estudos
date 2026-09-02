import { Outlet } from 'react-router-dom';

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Início', href: '/' },
  { label: 'Módulos', href: '/#modulos' },
  { label: 'Playground', href: '/playground' },
  { label: 'Simulado', href: '/#simulado' },
  { label: 'Progresso', href: '/#progresso' },
];

function GraphLabGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M7.3 15.3 9.6 6.4M14.7 15.3 12.4 6.4M8 17H14" stroke="var(--color-border-strong)" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="5" cy="17" r="3" fill="var(--color-cyan)" />
      <circle cx="17" cy="17" r="3" fill="var(--color-accent)" />
      <circle cx="11" cy="4" r="3" fill="var(--color-amber)" />
    </svg>
  );
}

/** Layout raiz: topo fixo com wordmark + navegação, área de conteúdo com largura máxima. */
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
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3.5">
          <a href="/" className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight text-[var(--color-text-primary)]">
            <GraphLabGlyph />
            GraphLab <span className="font-normal text-[var(--color-text-tertiary)]">P1</span>
          </a>
          <nav aria-label="Navegação principal" className="hidden items-center gap-1 sm:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-lg px-3 py-1.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
              >
                {item.label}
              </a>
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
