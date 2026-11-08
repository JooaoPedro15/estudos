/** TRIE com prefixos permitidos e PATRICIA por intervalos inclusivos. */
public class IndicesTexto {
  static class NoTrie {
    NoTrie[] prox=new NoTrie[26];
    boolean fimPalavra;
  }
  static class Celula {
    String palavra;
    Celula prox;
    Celula(String p) {
      palavra=p;
    }
  }
  static class Lista {
    Celula primeiro=new Celula(null), ultimo=primeiro;
    /** Acrescenta uma palavra à lista com cabeça. */
    void inserir(String s) {
      ultimo.prox=new Celula(s);
      ultimo=ultimo.prox;
    }
  }
  static class Trie {
    NoTrie raiz=new NoTrie();
    /** Insere palavras de a a z; repetidos não aumentam a quantidade. */
    void inserir(String s) {
      NoTrie i=raiz;
      for(int p=0; p<s.length(); p++) {
        int c=s.charAt(p)-'a';
        if(i.prox[c]==null)i.prox[c]=new NoTrie();
        i=i.prox[c];
      }
      i.fimPalavra=true;
    }
    /** Localiza um caminho, que pode não representar uma palavra completa. */
    NoTrie descer(String s) {
      NoTrie resp=raiz;
      for(int p=0; p<s.length()&&resp!=null; p++)resp=resp.prox[s.charAt(p)-'a'];
      return resp;
    }
    /** Exige marcador de fim, não apenas caminho existente. */
    boolean pesquisar(String s) {
      NoTrie i=descer(s);
      return i!=null&&i.fimPalavra;
    }
    /** Conta palavras e não nós ou folhas topológicas. */
    static int contar(NoTrie i) {
      int resp=0;
      if(i!=null) {
        if(i.fimPalavra)resp=1;
        for(int c=0; c<26; c++)resp+=contar(i.prox[c]);
      }
      return resp;
    }
    /** Remove somente o marcador; mantém os caminhos das outras palavras. */
    boolean removerLogico(String s) {
      NoTrie i=descer(s);
      boolean resp=i!=null&&i.fimPalavra;
      if(resp)i.fimPalavra=false;
      return resp;
    }
    /** Prefixo precisa conter ao menos uma palavra ativa, mesmo após remoções lógicas. */
    boolean existePrefixo(String s) {
      return contar(descer(s))>0;
    }
    /** Retorna as palavras do prefixo em ordem lexicográfica. */
    Lista listarPrefixo(String s) {
      Lista resp=new Lista();
      coletar(descer(s), s, resp);
      return resp;
    }
    /** Visita o marcador antes dos filhos e mantém a própria palavra-prefixo. */
    private void coletar(NoTrie i, String palavra, Lista resp) {
      if(i!=null) {
        if(i.fimPalavra)resp.inserir(palavra);
        for(int c=0; c<26; c++)if(i.prox[c]!=null)coletar(i.prox[c], palavra+(char)('a'+c), resp);
      }
    }
    /** Compara sufixo sem substring ou endsWith. */
    static boolean termina(String palavra, String sufixo) {
      boolean resp=palavra.length()>=sufixo.length();
      int inicio=palavra.length()-sufixo.length();
      for(int c=0; c<sufixo.length()&&resp; c++)resp=palavra.charAt(inicio+c)==sufixo.charAt(c);
      return resp;
    }
    /** Consulta prefixo e sufixo; percorre o resultado até encontrar um correspondente. */
    boolean prefixoSufixo(String prefixo, String sufixo) {
      Lista lista=listarPrefixo(prefixo);
      boolean resp=false;
      for(Celula i=lista.primeiro.prox; i!=null&&!resp; i=i.prox)resp=termina(i.palavra, sufixo);
      return resp;
    }
    /** Cria união independente, sem duplicar palavras. */
    Trie unir(Trie outra) {
      Trie resp=new Trie();
      copiar(raiz, "", resp);
      copiar(outra.raiz, "", resp);
      return resp;
    }
    /** Reconstrói palavras ativas na árvore de destino. */
    private void copiar(NoTrie i, String palavra, Trie destino) {
      if(i!=null) {
        if(i.fimPalavra)destino.inserir(palavra);
        for(int c=0; c<26; c++)if(i.prox[c]!=null)copiar(i.prox[c], palavra+(char)('a'+c), destino);
      }
    }
  }
  static class NoPatricia {
    int i, j, k;
    boolean folha;
    NoPatricia[] prox=new NoPatricia[26];
    NoPatricia(int a, int b, int c, boolean f) {
      i=a;
      j=b;
      k=c;
      folha=f;
    }
  }
  static class Patricia {
    String[] array;
    NoPatricia raiz=new NoPatricia(-1, -1, -1, false);
    Patricia(String[] a) {
      array=a;
    }
    /** Compara todos os caracteres do intervalo, e só aceita fim de palavra completo. */
    boolean pesquisar(String s) {
      return pesquisar(s, 0, raiz);
    }
    /** A raiz tem rótulo vazio; cada filho armazena array[i][j..k]. */
    private boolean pesquisar(String s, int p, NoPatricia no) {
      boolean resp=false;
      if(p==s.length())resp=no.folha;
      else {
        NoPatricia filho=no.prox[s.charAt(p)-'a'];
        if(filho!=null) {
          int c=filho.j;
          while(c<=filho.k&&p<s.length()&&array[filho.i].charAt(c)==s.charAt(p)) {
            c++;
            p++;
          }
          if(c>filho.k)resp=pesquisar(s, p, filho);
        }
      }
      return resp;
    }
    /** Conta ocorrências de uma letra em rótulos, sem construir strings intermediárias. */
    int contarLetra(char letra) {
      return contarLetra(raiz, letra);
    }
    /** A raiz vazia não acessa array[-1]. */
    private int contarLetra(NoPatricia no, char letra) {
      int resp=0;
      if(no!=raiz)for(int c=no.j; c<=no.k; c++)if(array[no.i].charAt(c)==letra)resp++;
      for(int c=0; c<26; c++)if(no.prox[c]!=null)resp+=contarLetra(no.prox[c], letra);
      return resp;
    }
    /** Verifica compressão de nós não terminais; não modifica a estrutura. */
    boolean compacta() {
      return compacta(raiz);
    }
    /** Um terminal pode ter um filho: ele pode ser prefixo de outra palavra. */
    private boolean compacta(NoPatricia no) {
      int filhos=0;
      boolean resp=true;
      for(int c=0; c<26; c++)if(no.prox[c]!=null) {
        filhos++;
        resp=resp&&compacta(no.prox[c]);
      }
      if(no!=raiz) {
        resp=resp&&no.j>=0&&no.k>=no.j&&no.i>=0&&no.i<array.length&&no.k<array[no.i].length();
        if(!no.folha&&filhos==1)resp=false;
      }
      return resp;
    }
  }
  /** Compara strings apenas com length e charAt, inclusive nos testes. */
  static boolean igual(String a, String b) {
    boolean resp=a.length()==b.length();
    for(int p=0; p<a.length()&&resp; p++)resp=a.charAt(p)==b.charAt(p);
    return resp;
  }
  /** Falha explicitamente em divergências. */
  static void exigir(boolean ok) {
    if(!ok)throw new AssertionError("texto");
  }
  /** Testa palavras-prefixo, remoção lógica, união e casamento de segmentos completos. */
  public static void main(String[] args) {
    Trie t=new Trie();
    exigir(!t.existePrefixo("a"));
    for(String s:new String[] {
      "ve", "vela", "vento", "sol", "vela"
    })t.inserir(s);
    exigir(t.pesquisar("ve")&&!t.pesquisar("ven")&&Trie.contar(t.raiz)==4);
    Lista l=t.listarPrefixo("ve");
    Celula c=l.primeiro.prox;
    for(String s:new String[] {
      "ve", "vela", "vento"
    }) {
      exigir(c!=null&&igual(c.palavra, s));
      c=c.prox;
    }
    exigir(c==null);
    exigir(t.prefixoSufixo("ve", "to")&&!t.prefixoSufixo("ve", "ar")&&t.prefixoSufixo("", "")&&!t.prefixoSufixo("x", ""));
    exigir(t.removerLogico("sol")&&!t.existePrefixo("so")&&!t.removerLogico("sol")&&t.pesquisar("vela"));
    Trie outra=new Trie();
    outra.inserir("vela");
    outra.inserir("lua");
    Trie uniao=t.unir(outra);
    exigir(Trie.contar(uniao.raiz)==4);
    uniao.removerLogico("vela");
    exigir(t.pesquisar("vela"));
    Patricia p=new Patricia(new String[] {
      "vela", "vento"
    });
    NoPatricia ve=new NoPatricia(0, 0, 1, false);
    p.raiz.prox['v'-'a']=ve;
    ve.prox['l'-'a']=new NoPatricia(0, 2, 3, true);
    ve.prox['n'-'a']=new NoPatricia(1, 2, 4, true);
    exigir(p.pesquisar("vela")&&p.pesquisar("vento")&&!p.pesquisar("ve")&&!p.pesquisar("vel")&&!p.pesquisar("velas")&&p.compacta()&&p.contarLetra('e')==1);
    ve.prox['n'-'a']=null;
    exigir(!p.compacta());
    ve.folha=true;
    exigir(p.compacta()&&p.pesquisar("ve"));
    System.out.println("TODOS OK");
  }
}
