/**
 * Manha-facil Q1: contarContatos(char letra) na Agenda (arvore de listas com celula cabeca).
 * Ideia: 1o nivel = pesquisa na ABP de letras; 2o nivel = percorrer a lista do no encontrado.
 */
class Contato {
   String nome, telefone; int cpf;
   Contato(String nome, int cpf) { this.nome = nome; this.cpf = cpf; }
}

class Celula {
   Contato contato; Celula prox;
   Celula(Contato c) { contato = c; prox = null; }
}

class No {
   char letra; No esq, dir; Celula primeiro, ultimo;
   No(char letra) { this.letra = letra; primeiro = ultimo = new Celula(null); }   // lista com cabeca
}

class Agenda {
   private No raiz;

   // ===================== RESPOSTA DA QUESTAO =====================
   /** Quantos contatos comecam com a letra (0 se a letra nao existir). */
   public int contarContatos(char letra) {
      No no = pesquisarArvore(letra, raiz);            // 1o nivel
      return (no == null) ? 0 : contarLista(no);       // 2o nivel
   }

   private No pesquisarArvore(char letra, No i) {
      No resp;
      if (i == null) {
         resp = null;
      } else if (letra == i.letra) {
         resp = i;
      } else if (letra < i.letra) {
         resp = pesquisarArvore(letra, i.esq);
      } else {
         resp = pesquisarArvore(letra, i.dir);
      }
      return resp;
   }

   private int contarLista(No no) {
      int resp = 0;
      for (Celula i = no.primeiro.prox; i != null; i = i.prox) {   // pula a cabeca
         resp++;
      }
      return resp;
   }
   // ================================================================

   // Apoio para os testes: cria o no da letra (se preciso) e insere no fim da lista.
   public void criarLetra(char letra) { raiz = inserirNo(letra, raiz); }
   private No inserirNo(char letra, No i) {
      if (i == null) { i = new No(letra); }
      else if (letra < i.letra) { i.esq = inserirNo(letra, i.esq); }
      else if (letra > i.letra) { i.dir = inserirNo(letra, i.dir); }
      return i;
   }
   public void inserir(Contato c) {
      criarLetra(c.nome.charAt(0));
      No no = pesquisarArvore(c.nome.charAt(0), raiz);
      no.ultimo.prox = new Celula(c);
      no.ultimo = no.ultimo.prox;
   }
}

public class Q1_Agenda {
   static int falhas = 0;
   static void checar(boolean ok, String desc) { System.out.println((ok ? "OK    " : "FALHA ") + desc); if (!ok) falhas++; }

   public static void main(String[] args) {
      Agenda vazia = new Agenda();
      checar(vazia.contarContatos('M') == 0, "agenda vazia -> 0");

      Agenda a = new Agenda();
      for (char c : new char[]{'M', 'F', 'T', 'C', 'I', 'P', 'W'}) a.criarLetra(c);   // arvore da figura
      String[] nomes = {"Maria", "Mario", "Tania", "Teo", "Tiago", "Wagner", "Caio", "Clara"};
      for (int i = 0; i < nomes.length; i++) a.inserir(new Contato(nomes[i], i));
      checar(a.contarContatos('T') == 3, "T -> 3 (Tania, Teo, Tiago)");
      checar(a.contarContatos('C') == 2, "C -> 2 (folha da arvore)");
      checar(a.contarContatos('M') == 2, "M -> 2 (raiz)");
      checar(a.contarContatos('F') == 0, "F existe mas lista vazia -> 0");
      checar(a.contarContatos('Z') == 0, "Z nao existe -> 0");
      System.out.println(falhas == 0 ? "TODOS OK" : falhas + " FALHA(S)");
   }
}
