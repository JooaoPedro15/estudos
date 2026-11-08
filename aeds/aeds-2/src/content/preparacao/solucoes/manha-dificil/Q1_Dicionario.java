/**
 * Exercício Q1: Dicionario em arvore de listas. inserir(palavra) SEM pre-condicao:
 * cria o no da letra se faltar (inserir/pesquisar juntos, como o inserir2 do aulao)
 * e insere a palavra ORDENADA na lista com cabeca do no, mantendo ultimo correto.
 */
class Celula {
   String palavra; Celula prox;
   Celula(String p) { palavra = p; prox = null; }
}

class No {
   char letra; No esq, dir; Celula primeiro, ultimo;
   No(char c) { letra = c; primeiro = ultimo = new Celula(null); }
}

class Dicionario {
   private No raiz;

   // ===================== RESPOSTA DA QUESTAO =====================
   public void inserir(String palavra) {
      raiz = inserir(palavra, raiz);
   }

   /** Desce na ABP de letras; cria o no se nao existir; ao achar o no, insere na lista. */
   private No inserir(String palavra, No i) {
      char letra = palavra.charAt(0);
      if (i == null) {
         i = new No(letra);                    // nao existia: cria o no
         inserirOrdenado(i, palavra);
      } else if (letra == i.letra) {
         inserirOrdenado(i, palavra);
      } else if (letra < i.letra) {
         i.esq = inserir(palavra, i.esq);
      } else {
         i.dir = inserir(palavra, i.dir);
      }
      return i;
   }

   /** Insercao ordenada na lista com cabeca: j para ANTES da posicao. */
   private void inserirOrdenado(No no, String palavra) {
      Celula j = no.primeiro;
      while (j.prox != null && j.prox.palavra.compareTo(palavra) < 0) {
         j = j.prox;
      }
      Celula nova = new Celula(palavra);
      nova.prox = j.prox;
      j.prox = nova;
      if (nova.prox == null) {
         no.ultimo = nova;                     // entrou no fim
      }
   }
   // Theta: letras <= 26 -> descer na arvore e Theta(1) (constante); lista: melhor Theta(1), pior Theta(m).
   // ================================================================

   // apoio para os testes
   String lista(char letra) {
      No i = raiz;
      while (i != null && i.letra != letra) i = (letra < i.letra) ? i.esq : i.dir;
      String s = "";
      if (i != null) for (Celula c = i.primeiro.prox; c != null; c = c.prox) s += c.palavra + " ";
      return s.trim();
   }
   String ultimo(char letra) {
      No i = raiz;
      while (i != null && i.letra != letra) i = (letra < i.letra) ? i.esq : i.dir;
      return (i == null || i.ultimo.palavra == null) ? null : i.ultimo.palavra;
   }
   char raizLetra() { return raiz.letra; }
}

public class Q1_Dicionario {
   static int falhas = 0;
   static void checar(boolean ok, String desc) { System.out.println((ok ? "OK    " : "FALHA ") + desc); if (!ok) falhas++; }

   public static void main(String[] args) {
      Dicionario d = new Dicionario();
      checar(d.lista('T').isEmpty(), "dicionario vazio: lista de T vazia");
      d.inserir("Tatu"); d.inserir("Mesa"); d.inserir("Terra"); d.inserir("Abacate"); d.inserir("Tamandua");
      checar(d.raizLetra() == 'T', "primeira palavra define a raiz (T)");
      checar(d.lista('T').equals("Tamandua Tatu Terra"), "T ordenada: Tamandua Tatu Terra (inseriu no inicio e no meio)");
      checar("Terra".equals(d.ultimo('T')), "ultimo de T = Terra");
      d.inserir("Tutu");
      checar(d.lista('T').equals("Tamandua Tatu Terra Tutu") && "Tutu".equals(d.ultimo('T')), "insercao no fim atualiza ultimo (Tutu)");
      d.inserir("Vacina"); d.inserir("Venal"); d.inserir("Vacuo");
      checar(d.lista('V').equals("Vacina Vacuo Venal"), "no V criado sem pre-condicao: Vacina Vacuo Venal");
      checar(d.lista('A').equals("Abacate") && d.lista('M').equals("Mesa"), "letras A e M com uma palavra");
      d.inserir("Tatu");
      checar(d.lista('T').equals("Tamandua Tatu Tatu Terra Tutu"), "repetida entra junto da igual");
      System.out.println(falhas == 0 ? "TODOS OK" : falhas + " FALHA(S)");
   }
}
