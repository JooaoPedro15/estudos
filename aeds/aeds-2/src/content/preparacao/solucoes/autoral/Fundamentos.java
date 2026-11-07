/** Operações autorais para análise de laços, fila circular e ordenação. */
public class Fundamentos {
  int[] array; int primeiro, ultimo;
  Fundamentos(int capacidade) { array=new int[capacidade+1]; }
  /** Conta uma operação em cada passagem do laço interno: n(n+1)/2. */
  static long contar(int n) {
    long resp=0;
    for(int i=1;i<=n;i++) for(int j=0;j<i;j++) resp++;
    return resp;
  }
  /** Insere respeitando a posição reservada para distinguir cheia de vazia. */
  void inserir(int x) {
    if((ultimo+1)%array.length==primeiro) throw new IllegalStateException("Cheia");
    array[ultimo]=x; ultimo=(ultimo+1)%array.length;
  }
  /** Retira da frente para produzir uma configuração que cruza o final do vetor. */
  int remover() {
    if(primeiro==ultimo) throw new IllegalStateException("Vazia");
    int resp=array[primeiro]; primeiro=(primeiro+1)%array.length; return resp;
  }
  /** Desfaz a última inserção em Θ(1); requer fila não vazia. */
  int desfazer() {
    if(primeiro==ultimo) throw new IllegalStateException("Vazia");
    ultimo=(ultimo-1+array.length)%array.length;
    return array[ultimo];
  }
  /** Copia o conteúdo em ordem inversa sem modificar a fila, em Θ(n). */
  int[] inverso() {
    int[] resp=new int[(ultimo-primeiro+array.length)%array.length];
    inverso(primeiro,0,resp); return resp;
  }
  /** Lê na ida e posiciona no vetor durante a volta da recursão. */
  private void inverso(int pos,int indice,int[] resp) {
    if(pos!=ultimo) {
      inverso((pos+1)%array.length,indice+1,resp);
      resp[resp.length-1-indice]=array[pos];
    }
  }
  /** Ordena pares antes dos ímpares, cada grupo crescente, incluindo negativos. */
  static void ordenar(int[] a) {
    for(int i=1;i<a.length;i++) {
      int tmp=a[i],j=i-1;
      while(j>=0 && antes(tmp,a[j])) { a[j+1]=a[j]; j--; }
      a[j+1]=tmp;
    }
  }
  /** Compara paridade sem supor que o resto de um negativo é positivo. */
  static boolean antes(int a,int b) {
    boolean pa=a%2==0,pb=b%2==0;
    return (pa && !pb) || (pa==pb && a<b);
  }
  /** Verifica contagens, fila cheia/vazia/circular e inteiros negativos. */
  public static void main(String[] args) {
    for(int n=0;n<=100;n++) if(contar(n)!=(long)n*(n+1)/2) throw new AssertionError("soma");
    Fundamentos f=new Fundamentos(3);
    if(f.inverso().length!=0) throw new AssertionError("vazia");
    f.inserir(19); f.inserir(23); f.inserir(29);
    try { f.inserir(31); throw new AssertionError("cheia"); } catch(IllegalStateException esperado) { }
    if(f.remover()!=19) throw new AssertionError("frente"); f.inserir(31);
    int[] a=f.inverso(); if(a[0]!=31 || a[1]!=29 || a[2]!=23) throw new AssertionError("inverso");
    if(f.desfazer()!=31 || f.desfazer()!=29 || f.desfazer()!=23) throw new AssertionError("desfazer");
    try { f.desfazer(); throw new AssertionError("vazia"); } catch(IllegalStateException esperado) { }
    int[] dados={-3,8,0,-4,5,2,-1}; ordenar(dados);
    int[] esperado={-4,0,2,8,-3,-1,5};
    for(int i=0;i<dados.length;i++) if(dados[i]!=esperado[i]) throw new AssertionError("ordem");
    ordenar(new int[0]); ordenar(new int[]{7});
    System.out.println("TODOS OK");
  }
}
