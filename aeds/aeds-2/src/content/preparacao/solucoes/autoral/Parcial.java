/** Seleção das expedições por inserção parcial estável. */
public class Parcial {
  static class Expedicao {
    int prioridade, codigo;
    Expedicao(int p, int c) { prioridade = p; codigo = c; }
  }
  /** Compara por prioridade decrescente e código crescente. */
  static boolean antes(Expedicao a, Expedicao b) {
    return a.prioridade > b.prioridade || (a.prioridade == b.prioridade && a.codigo < b.codigo);
  }
  /** Mantém ordenado apenas o prefixo escolhido: pior caso Θ(nk), memória Θ(1). */
  static void parcial(Expedicao[] array, int k) {
    for (int i = 1; i < array.length && k > 0; i++) {
      Expedicao tmp = array[i];
      int j = i - 1;
      if (j >= k) j = k - 1;
      if (i < k || antes(tmp, array[k - 1])) {
        if (i >= k) array[i] = array[k - 1];
        while (j >= 0 && antes(tmp, array[j])) {
          if (j + 1 < k) array[j + 1] = array[j];
          j--;
        }
        array[j + 1] = tmp;
      }
    }
  }
  /** Verifica prefixo contra ordenação completa independente e preservação dos registros. */
  public static void main(String[] args) {
    for (int n=0; n<=30; n++) for(int k=0;k<=n;k++) {
      Expedicao[] a=new Expedicao[n], b=new Expedicao[n];
      for(int i=0;i<n;i++) a[i]=b[i]=new Expedicao((i*17+n)%9, i);
      for(int i=0;i<n;i++) for(int j=i+1;j<n;j++) if(antes(b[j],b[i])) {
        Expedicao t=b[i]; b[i]=b[j]; b[j]=t;
      }
      parcial(a,k);
      for(int i=0;i<k;i++) if(a[i]!=b[i]) throw new AssertionError("prefixo");
      for(Expedicao e:b) { int qtd=0; for(Expedicao f:a) if(e==f) qtd++; if(qtd!=1) throw new AssertionError("perda"); }
    }
    Expedicao primeiro=new Expedicao(3,1), segundo=new Expedicao(3,1);
    Expedicao[] iguais={primeiro,segundo}; parcial(iguais,2);
    if(iguais[0]!=primeiro) throw new AssertionError("estabilidade");
    System.out.println("TODOS OK");
  }
}
