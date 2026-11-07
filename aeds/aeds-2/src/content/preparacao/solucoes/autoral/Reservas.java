import java.util.Scanner;
/** Lê lotes até EOF e imprime os códigos em ordem de prioridade (menor primeiro). */
public class Reservas {
  /** Usa inserção estável; empate de prioridade preserva a ordem de chegada. */
  public static void main(String[] args) {
    Scanner entrada=new Scanner(System.in);
    while(entrada.hasNextInt()) {
      int n=entrada.nextInt(); int[] prioridade=new int[n],codigo=new int[n];
      for(int i=0;i<n;i++) { codigo[i]=entrada.nextInt(); prioridade[i]=entrada.nextInt(); }
      for(int i=1;i<n;i++) {
        int p=prioridade[i],c=codigo[i],j=i-1;
        while(j>=0 && prioridade[j]>p) { prioridade[j+1]=prioridade[j]; codigo[j+1]=codigo[j]; j--; }
        prioridade[j+1]=p; codigo[j+1]=c;
      }
      for(int i=0;i<n;i++) { if(i>0) System.out.print(" "); System.out.print(codigo[i]); }
      System.out.println();
    }
  }
}
