import { buildSimulado, seededRng, SIMULADO_MODEL } from './simuladoBuilder';

test('gera exatamente 6 questoes, uma por posicao do modelo REAV1', () => {
  const blueprint = buildSimulado({ rng: seededRng(1) });

  expect(blueprint.questions).toHaveLength(6);
  blueprint.questions.forEach((question, index) => {
    expect(question.number).toBe(SIMULADO_MODEL[index].number);
    expect(question.format).toBe(SIMULADO_MODEL[index].format);
    expect(question.steps.length).toBeGreaterThan(0);
  });
});

test('cada posicao respeita o tema (dominio compativel)', () => {
  // Amostra vasta de seeds para cobrir varios sorteios por posicao.
  for (let seed = 0; seed < 60; seed += 1) {
    const [q1, q2, q3, q4, q5, q6] = buildSimulado({ rng: seededRng(seed) }).questions;

    expect(q1.domainId).toBe('somatorio');
    expect(['avl', 'arvore']).toContain(q2.domainId);
    expect(q4.domainId).toBe('ordenacao');
    expect(['arvore', 'somatorio', 'ordenacao']).toContain(q5.domainId);
    expect(q6.domainId).toBe('doidona');
    // Q3 (prove ou refute) aceita afirmacoes de varios conteudos.
    expect(q3.format).toBe('prove-or-refute');
  }
});

test('nao repete a mesma questao dentro de um simulado', () => {
  for (let seed = 0; seed < 60; seed += 1) {
    const ids = buildSimulado({ rng: seededRng(seed) }).questions.map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);
  }
});

test('as questoes variam entre simulados diferentes', () => {
  const signatures = new Set<string>();
  for (let seed = 0; seed < 40; seed += 1) {
    signatures.add(buildSimulado({ rng: seededRng(seed) }).questions.map((q) => q.id).join('|'));
  }

  // Com bancos de varias questoes por posicao, seeds diferentes produzem
  // combinacoes diferentes na esmagadora maioria dos casos.
  expect(signatures.size).toBeGreaterThan(20);
});

test('evita repetir imediatamente a questao anterior na mesma posicao', () => {
  const alwaysFirst = () => 0;
  const first = buildSimulado({ rng: alwaysFirst });
  const second = buildSimulado({ rng: alwaysFirst, previous: first });

  // rng=0 escolheria o mesmo primeiro candidato; o filtro "previous" desvia.
  first.questions.forEach((question, index) => {
    expect(second.questions[index].id).not.toBe(question.id);
  });
});

test('todo passo de escolha visual mantem o desenho da alternativa', () => {
  // Forca uma questao de desenho na posicao 2 (drawings tem visual por opcao).
  for (let seed = 0; seed < 30; seed += 1) {
    const q2 = buildSimulado({ rng: seededRng(seed) }).questions[1];
    const step = q2.steps[0];
    if (step.kind === 'choice' && step.options.some((option) => option.visual)) {
      expect(step.options.every((option) => option.visual)).toBe(true);
      return;
    }
  }
  throw new Error('nenhum desenho sorteado na posicao 2 nas seeds testadas');
});
