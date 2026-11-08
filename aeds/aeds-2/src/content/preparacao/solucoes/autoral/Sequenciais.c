#include <stdio.h>
#include <stdlib.h>
typedef struct {
  int array[17];
  int primeiro, ultimo;
}
Fila;
/** Inicia fila com capacidade 16 e uma posição reservada. */
void iniciar(Fila *f) {
  f->primeiro=f->ultimo=0;
}
/** Insere no fim e informa se havia espaço. */
int inserirFim(Fila *f, int x) {
  int resp=0;
  int novo=(f->ultimo+1)%17;
  if(novo!=f->primeiro) {
    f->array[f->ultimo]=x;
    f->ultimo=novo;
    resp=1;
  }
  return resp;
}
/** Insere na frente sem deslocar o conteúdo. */
int inserirInicio(Fila *f, int x) {
  int resp=0;
  int novo=(f->primeiro+16)%17;
  if(novo!=f->ultimo) {
    f->primeiro=novo;
    f->array[novo]=x;
    resp=1;
  }
  return resp;
}
/** Remove da frente via parâmetro de saída. Vazio preserva o destino. */
int removerInicio(Fila *f, int *valor) {
  int resp=0;
  if(f->primeiro!=f->ultimo) {
    *valor=f->array[f->primeiro];
    f->primeiro=(f->primeiro+1)%17;
    resp=1;
  }
  return resp;
}
/** Retira o último elemento mantendo a posição livre. */
int removerFim(Fila *f, int *valor) {
  int resp=0;
  if(f->primeiro!=f->ultimo) {
    f->ultimo=(f->ultimo+16)%17;
    *valor=f->array[f->ultimo];
    resp=1;
  }
  return resp;
}
/** Verifica cheio/vazio, wrap-around e retorno dos extremos. */
int main(void) {
  Fila f;
  iniciar(&f);
  int x=99;
  if(removerFim(&f, &x)||x!=99)return 1;
  for(int i=0; i<16; i++)if(!inserirFim(&f, i))return 1;
  if(inserirInicio(&f, 80))return 1;
  for(int i=0; i<8; i++)if(!removerInicio(&f, &x)||x!=i)return 1;
  for(int i=16; i<24; i++)if(!inserirFim(&f, i))return 1;
  for(int i=23; i>=8; i--)if(!removerFim(&f, &x)||x!=i)return 1;
  if(!inserirInicio(&f, -3)||!removerInicio(&f, &x)||x!=-3)return 1;
  puts("TODOS OK");
  return 0;
}
