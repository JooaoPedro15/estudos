/**
 * Exercício Q2 (versao Java): espelhar a ABP, trocando esq e dir em todos os nos.
 * A versao em C (a versão em C foi trabalhada no aulão) esta em Q2_espelhar.c.
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

   String caminharCentral() { return caminharCentral(raiz).trim(); }
   private String caminharCentral(No i) {
      String resp = "";
      if (i != null) resp = caminharCentral(i.esq) + i.elemento + " " + caminharCentral(i.dir);
      return resp;
   }

   // ===================== RESPOSTA DA QUESTAO =====================
   /** Publico chama o privado recursivo passando a raiz (padrão do material oficial). */
   public void espelhar() { espelhar(raiz); }

   /** Troca os campos do proprio no: a referencia guardada no pai nao muda, entao nao precisa retornar No. */
   private void espelhar(No i) {
      if (i != null) {
         No tmp = i.esq;
         i.esq = i.dir;
         i.dir = tmp;
         espelhar(i.esq);
         espelhar(i.dir);
      }
   }
   // Theta(n): cada no e visitado uma vez.
   // ================================================================
}

public class Q2_EspelharJava {
   static int falhas = 0;
   static void checar(boolean ok, String desc) { System.out.println((ok ? "OK    " : "FALHA ") + desc); if (!ok) falhas++; }

   public static void main(String[] args) {
      ArvoreBinaria a = new ArvoreBinaria();
      a.espelhar();
      checar(a.raiz == null, "arvore vazia: espelhar nao quebra");
      int[] ins = {10, 5, 15, 2, 7, 20};
      for (int x : ins) a.inserir(x);
      checar(a.caminharCentral().equals("2 5 7 10 15 20"), "central antes: crescente");
      a.espelhar();
      checar(a.caminharCentral().equals("20 15 10 7 5 2"), "central depois: decrescente");
      checar(a.raiz.esq.elemento == 15 && a.raiz.esq.esq.elemento == 20 && a.raiz.esq.dir == null
             && a.raiz.dir.elemento == 5 && a.raiz.dir.esq.elemento == 7 && a.raiz.dir.dir.elemento == 2,
             "formato: 10(15(20,-), 5(7,2))");
      a.espelhar();
      checar(a.caminharCentral().equals("2 5 7 10 15 20"), "espelhar duas vezes devolve a original");
      ArvoreBinaria so = new ArvoreBinaria(); so.inserir(1); so.espelhar();
      checar(so.caminharCentral().equals("1"), "so a raiz");
      System.out.println(falhas == 0 ? "TODOS OK" : falhas + " FALHA(S)");
   }
}
