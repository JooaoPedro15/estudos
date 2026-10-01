import { useEffect, useState } from 'react';

/**
 * Rotas por hash (#/modulo/arvore). Funciona abrindo o index.html direto do
 * arquivo, sem servidor.
 */
export function lerRota(): string[] {
  const hash = typeof window === 'undefined' ? '' : window.location.hash;
  return hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
}

export function useRota(): string[] {
  const [rota, setRota] = useState(lerRota);
  useEffect(() => {
    const aoMudar = () => {
      setRota(lerRota());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', aoMudar);
    return () => window.removeEventListener('hashchange', aoMudar);
  }, []);
  return rota;
}

export function ir(caminho: string): void {
  const alvo = caminho.startsWith('#') ? caminho : `#${caminho.startsWith('/') ? '' : '/'}${caminho}`;
  if (window.location.hash === alvo) {
    window.scrollTo({ top: 0 });
    return;
  }
  window.location.hash = alvo;
}

export const link = (caminho: string): string => `#${caminho.startsWith('/') ? caminho : `/${caminho}`}`;
