/**
 * Tarde-dificil Q2 (= P2-B Q3): diagUnificada() concatena as listas da diagonal principal
 * numa lista DUPLA, sem as cabecas. Andar na diagonal = dir e depois inf.
 */
class Celula {
   int elemento; Celula prox;
   Celula(int x) { elemento = x; prox = null; }
}

class CelulaMatriz {
   CelulaMatriz esq, dir, inf, sup; Celula inicio, fim;     // inicio = cabeca da lista
   CelulaMatriz() { inicio = fim = new Celula(-1); }
}

class CelulaDupla {
   int elemento; CelulaDupla prox, ant;
   CelulaDupla(int x) { elemento = x; }
}

class Matriz {
   CelulaMatriz inicio; int linha, coluna;

   Matriz(int l) {                                             // apoio: malha quadrada l x l
      linha = coluna = l;
      CelulaMatriz acimaLinha = null;
      for (int i = 0; i < l; i++) {
         CelulaMatriz ant = null, primeiraLinha = null, acima = acimaLinha;
         for (int j = 0; j < l; j++) {
            CelulaMatriz c = new CelulaMatriz();
            if (ant != null) { ant.dir = c; c.esq = ant; }
            if (acima != null) { acima.inf = c; c.sup = acima; acima = acima.dir; }
            if (j == 0) primeiraLinha = c;
            ant = c;
         }
         if (i == 0) inicio = primeiraLinha;
         acimaLinha = primeiraLinha;
      }
   }
   void inserir(int i, int j, int x) {
      CelulaMatriz c = inicio;
      for (int a = 0; a < i; a++) c = c.inf;
      for (int b = 0; b < j; b++) c = c.dir;
      c.fim.prox = new Celula(x); c.fim = c.fim.prox;
   }

   // ===================== RESPOSTA DA QUESTAO =====================
   CelulaDupla diagUnificada() {
      CelulaDupla primeira = null, ultima = null;
      CelulaMatriz d = inicio;
      while (d != null) {
         for (Celula c = d.inicio.prox; c != null; c = c.prox) {   // pula a cabeca da lista
            CelulaDupla nova = new CelulaDupla(c.elemento);
            if (primeira == null) {
               primeira = nova;
            } else {
               ultima.prox = nova;
               nova.ant = ultima;
            }
            ultima = nova;
         }
         d = (d.dir == null) ? null : d.dir.inf;                    // proxima celula da diagonal
      }
      return primeira;
   }
   // Theta(l + d): l celulas da diagonal (cada uma com 2 passos) + d elementos copiados.
   // ================================================================
}

public class Q2_DiagUnificada {
   static int falhas = 0;
   static void checar(boolean ok, String desc) { System.out.println((ok ? "OK    " : "FALHA ") + desc); if (!ok) falhas++; }
   static String frente(CelulaDupla p) { String s = ""; for (; p != null; p = p.prox) s += p.elemento + " "; return s.trim(); }
   static String tras(CelulaDupla p) {
      if (p == null) return "";
      while (p.prox != null) p = p.prox;
      String s = ""; for (; p != null; p = p.ant) s += p.elemento + " "; return s.trim();
   }

   public static void main(String[] args) {
      Matriz m = new Matriz(3);
      checar(m.diagUnificada() == null, "diagonal toda vazia -> null");
      m.inserir(0, 0, 1); m.inserir(0, 0, 2); m.inserir(2, 2, 5); m.inserir(0, 1, 99); m.inserir(2, 0, 98);
      CelulaDupla r = m.diagUnificada();
      checar(frente(r).equals("1 2 5"), "concatena a00 (1 2), a11 (vazia), a22 (5); ignora fora da diagonal");
      checar(tras(r).equals("5 2 1") && r.ant == null, "ponteiros ant corretos (5 2 1) e primeira.ant == null");
      Matriz u = new Matriz(1); u.inserir(0, 0, 7);
      checar(frente(u.diagUnificada()).equals("7"), "matriz 1x1");
      System.out.println(falhas == 0 ? "TODOS OK" : falhas + " FALHA(S)");
   }
}
