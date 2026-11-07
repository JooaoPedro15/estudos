import { describe,expect,test } from 'vitest';
import { planos,simuladosPreparacao,praticaPreparacao } from './catalogo';
const files=import.meta.glob('./solucoes/**/*.{java,c}',{query:'?raw',import:'default',eager:true}) as Record<string,string>;
describe('integridade dos planos de preparação',()=>{
  test('cada avaliação oferece seis combinações de turno e nível sem gabaritos ausentes',()=>{
    for(const exam of ['p1','p2','p3','reav'] as const) {
      const sims=simuladosPreparacao.filter(s=>s.exam===exam);
      expect(new Set(sims.map(s=>`${s.turn}-${s.level}`)).size).toBe(6);
      for(const sim of sims) {
        expect(sim.questions.length).toBe(exam==='reav'?6:3);
        for(const question of sim.questions) for(const path of question.sources) expect(files[`./solucoes/${path}`],path).toBeTruthy();
      }
      for(const topic of planos[exam].topics) for(const path of topic.sources) expect(files[`./solucoes/${path}`],path).toBeTruthy();
      for(const question of praticaPreparacao[exam]) for(const path of question.sources) expect(files[`./solucoes/${path}`],path).toBeTruthy();
    }
  });
  test('não apresenta percentuais novos para avaliações sem amostra suficiente',()=>{
    for(const exam of ['p1','p3','reav'] as const) expect(planos[exam].topics.every(t=>t.chance===null)).toBe(true);
    expect(planos.p2.topics[0].forms[0].chance?.[0]).toBe(40);
  });
});
