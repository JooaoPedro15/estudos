#include <stdio.h>
#include <stdlib.h>
typedef struct { int prioridade, codigo; } Expedicao;
/** Ordena por prioridade decrescente e código crescente. */
int antes(Expedicao a, Expedicao b) {
  return a.prioridade > b.prioridade || (a.prioridade == b.prioridade && a.codigo < b.codigo);
}
/** Troca dois registros sem perder valores. */
void trocar(Expedicao *a, Expedicao *b) { Expedicao tmp=*a; *a=*b; *b=tmp; }
/** Particiona somente faixas que interceptam o prefixo desejado. */
void quick(Expedicao a[], int esq, int dir, int k) {
  if(esq < dir && esq < k) {
    int i=esq, j=dir; Expedicao pivo=a[(esq+dir)/2];
    while(i<=j) {
      while(antes(a[i],pivo)) i++;
      while(antes(pivo,a[j])) j--;
      if(i<=j) { trocar(&a[i],&a[j]); i++; j--; }
    }
    if(esq<j) quick(a,esq,j,k);
    if(i<dir && i<k) quick(a,i,dir,k);
  }
}
/** Testa k=0, k=n, empates e vetores vazios contra seleção completa. */
int main(void) {
  for(int n=0;n<40;n++) for(int k=0;k<=n;k++) {
    Expedicao a[40],b[40];
    for(int i=0;i<n;i++) a[i]=b[i]=(Expedicao){(i*7+n)%11,i};
    for(int i=0;i<n;i++) for(int j=i+1;j<n;j++) if(antes(b[j],b[i])) trocar(&b[i],&b[j]);
    quick(a,0,n-1,k);
    for(int i=0;i<k;i++) if(a[i].codigo!=b[i].codigo) return 1;
  }
  puts("TODOS OK"); return 0;
}
