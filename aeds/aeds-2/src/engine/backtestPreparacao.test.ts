import { expect,test } from 'vitest';
import { avaliarPrevisao } from './backtestPreparacao';
test('exclui relatos parciais e dados ausentes sem tratá-los como erros',()=>{
  expect(avaliarPrevisao([{chance:90,resultado:'parcial'},{chance:75,resultado:undefined}])).toEqual({confirmados:0,total:2,brier:null});
});
test('calcula erro quadrático apenas sobre temas confirmados',()=>{
  const r=avaliarPrevisao([{chance:90,resultado:'sim'},{chance:60,resultado:'nao'},{chance:null,resultado:'sim'}]);
  expect(r.confirmados).toBe(2);expect(r.brier).toBeCloseTo((.01+.36)/2);
});
