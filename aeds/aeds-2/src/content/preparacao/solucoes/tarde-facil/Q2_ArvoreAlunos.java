/**
 * Exercício Q2: ABP de alunos (chave = matricula): contar nos com dois filhos e mostrar em ordem.
 */
class Aluno {
   int matricula; String nome;
   Aluno(int m, String n) { matricula = m; nome = n; }
}

class No {
   Aluno aluno; No esq, dir;
   No(Aluno a) { aluno = a; }
}

class ArvoreAlunos {
   private No raiz;
   String saida = "";      // so para o teste conferir o que foi impresso

   public void inserir(Aluno a) { raiz = inserir(a, raiz); }
   private No inserir(Aluno a, No i) {
      if (i == null) i = new No(a);
      else if (a.matricula < i.aluno.matricula) i.esq = inserir(a, i.esq);
      else if (a.matricula > i.aluno.matricula) i.dir = inserir(a, i.dir);
      return i;
   }

   // ===================== RESPOSTA DA QUESTAO =====================
   public int contarNosComDoisFilhos() { return contarNosComDoisFilhos(raiz); }
   private int contarNosComDoisFilhos(No i) {
      int resp = 0;
      if (i != null) {
         if (i.esq != null && i.dir != null) {
            resp = 1;
         }
         resp += contarNosComDoisFilhos(i.esq) + contarNosComDoisFilhos(i.dir);
      }
      return resp;
   }

   public void mostrarCentral() { mostrarCentral(raiz); System.out.println(); }
   private void mostrarCentral(No i) {
      if (i != null) {
         mostrarCentral(i.esq);
         System.out.print(i.aluno.matricula + " ");
         saida += i.aluno.matricula + " ";
         mostrarCentral(i.dir);
      }
   }
   // Ambos Theta(n): visitam cada no uma vez.
   // ================================================================
}

public class Q2_ArvoreAlunos {
   static int falhas = 0;
   static void checar(boolean ok, String desc) { System.out.println((ok ? "OK    " : "FALHA ") + desc); if (!ok) falhas++; }

   public static void main(String[] args) {
      ArvoreAlunos vazia = new ArvoreAlunos();
      checar(vazia.contarNosComDoisFilhos() == 0, "arvore vazia -> 0");
      ArvoreAlunos a = new ArvoreAlunos();
      for (int m : new int[]{50, 30, 70, 20, 40, 60, 80}) a.inserir(new Aluno(m, "A" + m));
      checar(a.contarNosComDoisFilhos() == 3, "50 30 70 20 40 60 80 -> 3 nos com dois filhos (50, 30, 70)");
      a.mostrarCentral();
      checar(a.saida.trim().equals("20 30 40 50 60 70 80"), "central em ordem crescente");
      ArvoreAlunos cadeia = new ArvoreAlunos();
      for (int m : new int[]{1, 2, 3, 4}) cadeia.inserir(new Aluno(m, ""));
      checar(cadeia.contarNosComDoisFilhos() == 0, "arvore degenerada -> 0");
      System.out.println(falhas == 0 ? "TODOS OK" : falhas + " FALHA(S)");
   }
}
