import java.util.Scanner;
/** Consulta de prefixos para um catálogo de expedições. */
public class Prefixos {
  static class No { No[] prox=new No[26]; boolean fim; }
  /** Insere sem contar palavras repetidas mais de uma vez. */
  static void inserir(No raiz,String s) {
    No i=raiz;
    for(int p=0;p<s.length();p++) {
      int c=s.charAt(p)-'a'; if(i.prox[c]==null) i.prox[c]=new No(); i=i.prox[c];
    }
    i.fim=true;
  }
  /** Conta finais, inclusive quando há filhos. */
  static int contar(No i) {
    int resp=0;
    if(i!=null) { if(i.fim) resp=1; for(int c=0;c<26;c++) resp+=contar(i.prox[c]); }
    return resp;
  }
  /** Lê n palavras e q consultas por lote; termina apenas no EOF. */
  public static void main(String[] args) {
    Scanner entrada=new Scanner(System.in);
    while(entrada.hasNextInt()) {
      int n=entrada.nextInt(),q=entrada.nextInt(); No raiz=new No();
      for(int j=0;j<n;j++) inserir(raiz,entrada.next());
      for(int j=0;j<q;j++) {
        String s=entrada.next(); No i=raiz;
        for(int p=0;p<s.length() && i!=null;p++) i=i.prox[s.charAt(p)-'a'];
        System.out.println(contar(i));
      }
    }
  }
}
