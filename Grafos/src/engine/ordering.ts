import type { Question } from '@/content/types';

/**
 * Ordem inicial de uma questão ORDERING: embaralhada de forma estável (hash
 * do id da questão) e garantidamente diferente do gabarito — senão bastaria
 * clicar em "Verificar" sem pensar.
 */
export function scrambledOrder(q: Extract<Question, { type: 'ORDERING' }>): string[] {
  const hash = (str: string) => {
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
    return h;
  };
  // Fisher–Yates com gerador determinístico (mulberry32) semeado pelo id; troca a semente até sair do gabarito.
  const ids = q.items.map((i) => i.id);
  for (let seed = hash(q.id); ; seed++) {
    let t = seed;
    const rand = () => {
      t += 0x6d2b79f5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
    const order = [...ids];
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    if (order.length < 2 || order.join() !== q.correctOrder.join()) return order;
  }
}
