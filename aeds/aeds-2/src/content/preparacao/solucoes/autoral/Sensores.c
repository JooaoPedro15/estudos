#include <stdio.h>
#include <stdlib.h>
typedef struct No { int elemento; struct No *esq,*dir; } No;
/** Insere sem repetidos alterando diretamente o ponteiro do pai. */
void inserir(int x,No **i) {
  if(*i==NULL) {
    *i=malloc(sizeof(No)); if(*i==NULL) exit(1);
    (*i)->elemento=x; (*i)->esq=(*i)->dir=NULL;
  } else if(x<(*i)->elemento) inserir(x,&(*i)->esq);
  else if(x>(*i)->elemento) inserir(x,&(*i)->dir);
}
/** Conta folhas em uma visita por nó. */
int folhas(No *i) {
  int resp=0;
  if(i!=NULL) {
    if(i->esq==NULL && i->dir==NULL) resp=1;
    else resp=folhas(i->esq)+folhas(i->dir);
  }
  return resp;
}
/** Libera filhos antes do pai. */
void liberar(No *i) { if(i!=NULL) { liberar(i->esq); liberar(i->dir); free(i); } }
/** Processa lotes independentes até EOF; n=0 é um caso válido. */
int main(void) {
  int n,x;
  while(scanf("%d",&n)==1) {
    No *raiz=NULL;
    for(int j=0;j<n;j++) { if(scanf("%d",&x)!=1) return 1; inserir(x,&raiz); }
    printf("%d\n",folhas(raiz)); liberar(raiz);
  }
  return 0;
}
