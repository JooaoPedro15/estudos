/** Heap parcial de expedições: O(n log(k+1) + k log(k+1)). */
public class Heap {
  static class Expedicao {
    int prioridade, codigo;
    Expedicao(int p,int c) { prioridade=p; codigo=c; }
  }
  /** Indica precedência no ranking final. */
  static boolean antes(Expedicao a,Expedicao b) {
    return a.prioridade>b.prioridade || (a.prioridade==b.prioridade && a.codigo<b.codigo);
  }
  /** Troca elementos do vetor. */
  static void trocar(Expedicao[] a,int i,int j) { Expedicao t=a[i]; a[i]=a[j]; a[j]=t; }
  /** Mantém na raiz o pior registro do conjunto selecionado. */
  static void descer(Expedicao[] a,int i,int n) {
    boolean fim=false;
    while(2*i+1<n && !fim) {
      int f=2*i+1;
      if(f+1<n && antes(a[f],a[f+1])) f++;
      if(antes(a[i],a[f])) { trocar(a,i,f); i=f; } else fim=true;
    }
  }
  /** Seleciona k registros e ordena apenas esse heap. */
  static void parcial(Expedicao[] a,int k) {
    if(k>0) {
      for(int i=k/2-1;i>=0;i--) descer(a,i,k);
      for(int i=k;i<a.length;i++) if(antes(a[i],a[0])) { trocar(a,0,i); descer(a,0,k); }
      for(int n=k-1;n>0;n--) { trocar(a,0,n); descer(a,0,n); }
    }
  }
  /** Confere todos os tamanhos de prefixo contra ordenação por seleção. */
  public static void main(String[] args) {
    for(int n=0;n<40;n++) for(int k=0;k<=n;k++) {
      Expedicao[] a=new Expedicao[n],b=new Expedicao[n];
      for(int i=0;i<n;i++) a[i]=b[i]=new Expedicao((i*13+n)%11,i);
      for(int i=0;i<n;i++) for(int j=i+1;j<n;j++) if(antes(b[j],b[i])) { Expedicao t=b[i]; b[i]=b[j]; b[j]=t; }
      parcial(a,k);
      for(int i=0;i<k;i++) if(a[i]!=b[i]) throw new AssertionError("prefixo");
    }
    System.out.println("TODOS OK");
  }
}
