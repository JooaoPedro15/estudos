/**
 * Manha-dificil Q3: toLista(raiz, proibidos) em Theta(n + m).
 * Estrategia: caminhamento CENTRAL (sai em ordem crescente) + um ponteiro que anda na lista
 * ordenada de proibidos, igual a intercalacao do Mergesort: o ponteiro nunca volta.
 */
class No {
   int elemento; No esq, dir;
   No(int x) { elemento = x; }
}

class Celula {
   int elemento; Celula prox;
   Celula(int x) { elemento = x; prox = null; }
}

class ToLista {
   // ===================== RESPOSTA DA QUESTAO =====================
   private Celula p;        // posicao atual na lista de proibidos
   private Celula ultimo;   // fim da lista resposta

   /** Retorna a CABECA de uma lista crescente com os elementos da arvore que nao estao em proibidos. */
   public Celula toLista(No raiz, Celula proibidos) {
      Celula cabeca = new Celula(-1);
      ultimo = cabeca;
      p = proibidos.prox;                       // pula a cabeca de proibidos
      central(raiz);
      return cabeca;
   }

   private void central(No i) {
      if (i != null) {
         central(i.esq);
         while (p != null && p.elemento < i.elemento) {   // avanca proibidos menores que o atual
            p = p.prox;
         }
         if (p == null || p.elemento != i.elemento) {     // nao e proibido: entra no fim
            ultimo.prox = new Celula(i.elemento);
            ultimo = ultimo.prox;
         }
         central(i.dir);
      }
   }
   // (i) central de ABP visita em ordem crescente e sempre inserimos no fim -> lista ordenada.
   // (ii) cada no da arvore e visitado 1 vez (n) e p so avanca (no maximo m passos no total) -> Theta(n + m).
   //      Pesquisar cada elemento na lista seria Theta(n * m).
   // ================================================================
}

public class Q3_ToLista {
   static int falhas = 0;
   static void checar(boolean ok, String desc) { System.out.println((ok ? "OK    " : "FALHA ") + desc); if (!ok) falhas++; }

   static No inserir(No i, int x) {
      if (i == null) i = new No(x);
      else if (x < i.elemento) i.esq = inserir(i.esq, x);
      else if (x > i.elemento) i.dir = inserir(i.dir, x);
      return i;
   }
   static Celula lista(int... v) {
      Celula cab = new Celula(-1), u = cab;
      for (int x : v) { u.prox = new Celula(x); u = u.prox; }
      return cab;
   }
   static String str(Celula cab) {
      String s = "";
      for (Celula i = cab.prox; i != null; i = i.prox) s += i.elemento + " ";
      return s.trim();
   }

   public static void main(String[] args) {
      No raiz = null;
      for (int x : new int[]{50, 30, 70, 20, 40, 60, 80}) raiz = inserir(raiz, x);
      ToLista t = new ToLista();
      checar(str(t.toLista(raiz, lista(20, 45, 60, 90))).equals("30 40 50 70 80"), "remove 20 e 60; ignora 45 e 90");
      checar(str(t.toLista(raiz, lista())).equals("20 30 40 50 60 70 80"), "sem proibidos -> todos em ordem");
      checar(str(t.toLista(raiz, lista(20, 30, 40, 50, 60, 70, 80))).isEmpty(), "todos proibidos -> lista vazia");
      checar(str(t.toLista(null, lista(1, 2))).isEmpty(), "arvore vazia -> lista vazia");
      checar(str(t.toLista(raiz, lista(10, 15, 80, 99))).equals("20 30 40 50 60 70"), "proibido no extremo (80)");
      System.out.println(falhas == 0 ? "TODOS OK" : falhas + " FALHA(S)");
   }
}
