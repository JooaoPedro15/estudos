/**
 * Exercício Q2 (versao Java): simetricas(a, b) e clonarEspelhado(i).
 * A versao em C (a versão em C foi trabalhada no aulão) esta em Q2_simetricas.c.
 */
class No {
   int elemento; No esq, dir;
   No(int elemento) { this.elemento = elemento; esq = dir = null; }
}

class ArvoreBinaria {
   No raiz;

   void inserir(int x) { raiz = inserir(x, raiz); }
   private No inserir(int x, No i) {
      if (i == null) i = new No(x);
      else if (x < i.elemento) i.esq = inserir(x, i.esq);
      else if (x > i.elemento) i.dir = inserir(x, i.dir);
      return i;
   }

   // ===================== RESPOSTA DA QUESTAO =====================
   /** true se b e a imagem espelhada de a: esquerda de um = direita do outro, mesmos elementos. */
   static boolean simetricas(No a, No b) {
      boolean resp;
      if (a == null && b == null) {
         resp = true;
      } else if (a == null || b == null) {
         resp = false;
      } else {
         resp = a.elemento == b.elemento && simetricas(a.esq, b.dir) && simetricas(a.dir, b.esq);
      }
      return resp;
   }

   /** Cria uma NOVA arvore espelhada; a original nao muda. */
   static No clonarEspelhado(No i) {
      No resp = null;
      if (i != null) {
         resp = new No(i.elemento);
         resp.esq = clonarEspelhado(i.dir);
         resp.dir = clonarEspelhado(i.esq);
      }
      return resp;
   }
   // Ambas Theta(n). simetricas(r, clonarEspelhado(r)) e sempre true: o clone e, por construcao, o espelho.
   // ================================================================
}

public class Q2_SimetricasJava {
   static int falhas = 0;
   static void checar(boolean ok, String desc) { System.out.println((ok ? "OK    " : "FALHA ") + desc); if (!ok) falhas++; }
   static String central(No i) { return i == null ? "" : (central(i.esq) + i.elemento + " " + central(i.dir)); }

   public static void main(String[] args) {
      checar(ArvoreBinaria.simetricas(null, null), "duas vazias sao simetricas");
      checar(ArvoreBinaria.clonarEspelhado(null) == null, "clonar vazia -> null");
      ArvoreBinaria a = new ArvoreBinaria();
      int[] ins = {10, 5, 15, 2, 7, 20};
      for (int x : ins) a.inserir(x);
      No c = ArvoreBinaria.clonarEspelhado(a.raiz);
      checar(central(c).trim().equals("20 15 10 7 5 2"), "clone espelhado: central decrescente");
      checar(central(a.raiz).trim().equals("2 5 7 10 15 20"), "original nao mudou");
      checar(c != a.raiz && c.esq != a.raiz.dir, "clone usa nos novos (nao compartilha)");
      checar(ArvoreBinaria.simetricas(a.raiz, c), "simetricas(r, clonarEspelhado(r)) == true");
      checar(!ArvoreBinaria.simetricas(a.raiz, a.raiz), "arvore assimetrica nao e simetrica a si mesma");
      c.esq.elemento = 99;
      checar(!ArvoreBinaria.simetricas(a.raiz, c), "mesmo formato, elemento diferente -> false");
      checar(!ArvoreBinaria.simetricas(a.raiz, null), "uma vazia e outra nao -> false");
      System.out.println(falhas == 0 ? "TODOS OK" : falhas + " FALHA(S)");
   }
}
