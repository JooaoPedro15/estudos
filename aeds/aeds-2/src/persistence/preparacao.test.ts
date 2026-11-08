import { expect,test,beforeEach } from 'vitest';
import { carregarPreparacao,preparacaoKey } from './preparacao';
beforeEach(()=>localStorage.clear());
test('unifica registros antigos sem perder rascunhos ou esconder divergências',()=>{
  localStorage.setItem(preparacaoKey,JSON.stringify({drafts:{'p2-manha-facil-2':'minha resposta'},actual:{'manha-arvore':'sim','tarde-arvore':'nao','tarde-lista':'parcial'},notes:'minha observação'}));
  const r=carregarPreparacao();
  expect(r.drafts['p2-manha-facil-2']).toBe('minha resposta');
  expect(r.notes).toBe('minha observação');
  expect(r.actual.arvore).toBe('parcial');
  expect(r.actual.lista).toBe('parcial');
  expect(r.actual['manha-arvore']).toBe('sim');
});
test('preserva uma decisão nova mesmo com registros antigos divergentes',()=>{
  localStorage.setItem(preparacaoKey,JSON.stringify({actual:{arvore:'sim','manha-arvore':'nao','tarde-arvore':'parcial'}}));
  expect(carregarPreparacao().actual.arvore).toBe('sim');
});
