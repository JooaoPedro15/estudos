/** Exercícios de contagem, comparadores, busca e adaptação de ordenação. */
public class FundamentosMais {
  /** Conta a soma dos ímpares: 1+3+...+(2n-1)=n². */
  static long contarImpares(int n) {
    long resp=0;
    for(long i=1; i<=n; i++)for(long j=1; j<=2*i-1; j++)resp++;
    return resp;
  }
  /** Usa long no índice para evitar overflow antes da condição de parada. */
  static int contarDobros(int n) {
    int resp=0;
    for(long j=1; j<=n; j*=2)resp++;
    return resp;
  }
  /** Inicia o comparador recursivo de strings não nulas. */
  static int compararNome(String a, String b) {
    return compararNome(a, b, 0);
  }
  /** Compara caracteres e trata uma string que é prefixo da outra. */
  private static int compararNome(String a, String b, int p) {
    int resp=0;
    if(p==a.length()||p==b.length()) {
      if(a.length()<b.length())resp=-1;
      else if(a.length()>b.length())resp=1;
    }
    else if(a.charAt(p)<b.charAt(p))resp=-1;
    else if(a.charAt(p)>b.charAt(p))resp=1;
    else resp=compararNome(a, b, p+1);
    return resp;
  }
  /** Busca em vetor crescente; retorna índice ou -1. */
  static int binaria(int[] a, int x) {
    int esq=0, dir=a.length-1, resp=-1;
    while(esq<=dir&&resp<0) {
      int meio=esq+(dir-esq)/2;
      if(a[meio]==x)resp=meio;
      else if(x<a[meio])dir=meio-1;
      else esq=meio+1;
    }
    return resp;
  }
  /** Bolha com limite da última troca; devolve número de comparações de elementos. */
  static long bolha(int[] a) {
    int limite=a.length-1;
    long resp=0;
    while(limite>0) {
      int ultima=0;
      for(int j=0; j<limite; j++) {
        resp++;
        if(a[j]>a[j+1]) {
          int tmp=a[j];
          a[j]=a[j+1];
          a[j+1]=tmp;
          ultima=j;
        }
      }
      limite=ultima;
    }
    return resp;
  }
  /** Maior chave na subárvore esquerda de um heap máximo válido. */
  static int maiorEsquerdaHeap(int[] a) {
    if(a.length<2)throw new IllegalArgumentException("Sem subarvore esquerda");
    return a[1];
  }
  /** O mínimo de um heap máximo está entre as folhas, salvo o caso vazio. */
  static int menorHeap(int[] a) {
    if(a.length==0)throw new IllegalArgumentException("Vazio");
    int resp=a[a.length/2];
    for(int i=a.length/2+1; i<a.length; i++)if(a[i]<resp)resp=a[i];
    return resp;
  }
  /** Oráculo por inserção completa apenas para os testes. */
  static void referencia(int[] a) {
    for(int i=1; i<a.length; i++) {
      int tmp=a[i], j=i-1;
      while(j>=0&&a[j]>tmp) {
        a[j+1]=a[j];
        j--;
      }
      a[j+1]=tmp;
    }
  }
  /** Interrompe com erro explícito se um caso divergir. */
  static void exigir(boolean ok) {
    if(!ok)throw new AssertionError("fundamentos");
  }
  /** Testa fórmulas, limites logarítmicos, strings vazias, negativos e ordenação. */
  public static void main(String[] args) {
    for(int n=0; n<=70; n++)exigir(contarImpares(n)==(long)n*n);
    exigir(contarDobros(0)==0&&contarDobros(1)==1&&contarDobros(8)==4&&contarDobros(Integer.MAX_VALUE)==31);
    exigir(compararNome("", "")==0&&compararNome("a", "ab")<0&&compararNome("az", "ay")>0&&compararNome("vento", "vento")==0);
    exigir(binaria(new int[0], 4)==-1&&binaria(new int[] {
      -4, 0, 8
    }, 0)==1&&binaria(new int[] {
      2
    }, 5)==-1);
    int[] crescente= {
      1, 2, 3, 4
    };
    exigir(bolha(crescente)==3);
    int[] decrescente= {
      4, 3, 2, 1
    };
    exigir(bolha(decrescente)==6);
    for(int n=0; n<70; n++) {
      int[] a=new int[n], b=new int[n];
      for(int i=0; i<n; i++)a[i]=b[i]=(i*29+n)%17-8;
      bolha(a);
      referencia(b);
      for(int i=0; i<n; i++)exigir(a[i]==b[i]);
    }
    int[] heap= {
      51, 43, 37, 18, 29, 11, 7
    };
    exigir(maiorEsquerdaHeap(heap)==43&&menorHeap(heap)==7&&menorHeap(new int[] {
      8
    })==8);
    try {
      menorHeap(new int[0]);
      throw new AssertionError("vazio");
    }
    catch(IllegalArgumentException esperado) {
    }
    System.out.println("TODOS OK");
  }
}
