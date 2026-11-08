import { describe,expect,test } from 'vitest';
import { planos,simuladosPreparacao,praticaPreparacao,getQuestoesPreparacao } from './catalogo';
const files=import.meta.glob('./solucoes/**/*.{java,c}',{query:'?raw',import:'default',eager:true}) as Record<string,string>;
describe('integridade dos planos de preparação',()=>{
  test('cada avaliação reúne os três níveis com gabaritos disponíveis',()=>{
    for(const exam of ['p1','p2','p3','reav'] as const) {
      const sims=simuladosPreparacao.filter(s=>s.exam===exam);
      expect(new Set(sims.map(s=>s.level)).size).toBe(3);
      expect(sims.length).toBe(6);
      for(const sim of sims) {
        expect(sim.questions.length).toBe(exam==='reav'?6:3);
        for(const question of sim.questions) for(const path of question.sources) expect(files[`./solucoes/${path}`],path).toBeTruthy();
      }
      for(const question of getQuestoesPreparacao(exam)) for(const path of question.sources) expect(files[`./solucoes/${path}`],path).toBeTruthy();
      for(const topic of planos[exam].topics) for(const path of topic.sources) expect(files[`./solucoes/${path}`],path).toBeTruthy();
      for(const question of praticaPreparacao[exam]) for(const path of question.sources) expect(files[`./solucoes/${path}`],path).toBeTruthy();
    }
  });
  test('reúne os exercícios sem duplicar versões nem guardar atributos de previsão',()=>{
    for(const exam of ['p1','p2','p3','reav'] as const) {
      const questions=getQuestoesPreparacao(exam);
      expect(new Set(questions.map(q=>q.id)).size).toBe(questions.length);
      for(const question of getQuestoesPreparacao(exam)) for(const path of question.sources) expect(files[`./solucoes/${path}`],path).toBeTruthy();
      for(const topic of planos[exam].topics) expect(Object.keys(topic)).toEqual(['id','title','forms','evidence','operation','trap','sources']);
    }
    expect(getQuestoesPreparacao('p2')).toHaveLength(21);
    expect(getQuestoesPreparacao('p3')).toHaveLength(39);
    expect(getQuestoesPreparacao('p1')).toHaveLength(18);
    expect(getQuestoesPreparacao('reav')).toHaveLength(80);
  });
});

test('os simulados da P1 começam em análise e não recomendam heap',()=>{
  for(const sim of simuladosPreparacao.filter(s=>s.exam==='p1')) {
    expect(sim.questions[0].topic).toBe('analise');
    expect(sim.questions.some(q=>/heap/i.test(q.title))).toBe(false);
  }
});
