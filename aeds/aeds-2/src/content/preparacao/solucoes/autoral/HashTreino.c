#include <stdio.h>
#include <stdlib.h>
typedef struct {
  int tabela[32];
  int m;
}
Hash;
/** Inicializa uma tabela para chaves não negativas; -1 é a posição vazia. */
void iniciar(Hash *h, int m) {
  h->m=m;
  for(int i=0; i<m; i++)h->tabela[i]=-1;
}
/** Índice primário para chave não negativa. */
int hash(int x, Hash *h) {
  return x%h->m;
}
/** Uma tentativa adicional, sem overflow em x+1. */
int rehash(int x, Hash *h) {
  return (x%h->m+1)%h->m;
}
/** Pesquisa ambas as posições permitidas pelo contrato. */
int pesquisar(int x, Hash *h) {
  int resp=0;
  if(x>=0)resp=h->tabela[hash(x, h)]==x||h->tabela[rehash(x, h)]==x;
  return resp;
}
/** Insere sem duplicar; não faz sondagem linear ilimitada. */
int inserir(int x, Hash *h) {
  int resp=0;
  if(x>=0) {
    if(pesquisar(x, h))resp=1;
    else {
      int p=hash(x, h);
      if(h->tabela[p]!=-1)p=rehash(x, h);
      if(h->tabela[p]==-1) {
        h->tabela[p]=x;
        resp=1;
      }
    }
  }
  return resp;
}
/** Exige o resultado esperado, sem depender de assert habilitado. */
void exigir(int ok) {
  if(!ok)exit(1);
}
/** Verifica rehash, colisão esgotada, zero, repetidos e m=1. */
int main(void) {
  Hash h;
  iniciar(&h, 5);
  exigir(inserir(2, &h)&&inserir(7, &h));
  exigir(!inserir(12, &h)&&!pesquisar(12, &h));
  exigir(pesquisar(7, &h)&&inserir(7, &h));
  exigir(inserir(0, &h)&&!inserir(-1, &h));
  iniciar(&h, 1);
  exigir(inserir(4, &h)&&!inserir(5, &h));
  puts("TODOS OK");
  return 0;
}
