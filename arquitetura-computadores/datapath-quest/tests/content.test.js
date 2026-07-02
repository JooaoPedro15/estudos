const fs = require('fs');
const path = require('path');
const assert = require('assert');
const vm = require('vm');

const htmlPath = path.join(__dirname, '..', 'mips-datapath-quest.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>/)[1];

const expectedQuestionKeys = [
  'vet_trinta',
  'vet_ultimo',
  'const_0x10000000',
  'vet_centesimo',
  'div_signed_1024',
  'addi_path',
  'bne_branch',
  'slt_tipo_r',
  'jump_pc',
  'stack_minimo'
];

for (const key of expectedQuestionKeys) {
  assert(
    html.includes(`${key}:`),
    `Expected exam-derived question key "${key}" to be present.`
  );
}

for (const topic of ['QISA', 'QStack', 'QTimeExt']) {
  assert(
    html.includes(`${topic}:0`) || html.includes(`${topic}: 0`),
    `Expected provaMastery to track topic "${topic}".`
  );
  assert(
    html.includes(`${topic}:[0,0]`) || html.includes(`${topic}: [0,0]`),
    `Expected simulado topic summary to track "${topic}".`
  );
}

assert(
  html.includes('function qProva'),
  'Expected a factory for fixed exam-style questions.'
);

assert(
  html.includes('geraProvaFixaQ5'),
  'Expected Prova Infinita / Simulado to be able to draw fixed exam-style questions.'
);

const sandbox = {
  console,
  localStorage: {
    getItem() { return null; },
    setItem() {}
  },
  setTimeout() {},
  clearTimeout() {},
  setInterval() { return 1; },
  clearInterval() {}
};

vm.createContext(sandbox);
vm.runInContext(
  script.replace(/\nboot\(\);\s*$/, '') +
    '\n;globalThis.__dq = { PROVA_FIXED_Q5, LEVELS, qProva, geraProvaFixaQ5, buildSimQueue };',
  sandbox,
  { filename: 'mips-datapath-quest.html' }
);

const { PROVA_FIXED_Q5, LEVELS, qProva, buildSimQueue } = sandbox.__dq;
const levelExamKeys = LEVELS.flatMap(level => level.qs)
  .filter(question => question.examKey)
  .map(question => question.examKey);

assert.deepStrictEqual(
  [...new Set(levelExamKeys)].sort(),
  expectedQuestionKeys.slice().sort(),
  'Expected every fixed exam question to appear in the level progression.'
);

for (const [key, question] of Object.entries(PROVA_FIXED_Q5)) {
  assert(question.explain && question.explain.length > 40, `${key} needs a useful explanation.`);
  assert(question.hint && question.hint.length > 20, `${key} needs a useful hint.`);

  const built = qProva(key, 'med');
  assert.strictEqual(built.mode, 5, `${key} should render in Modo 5.`);
  assert.strictEqual(built.examKey, key, `${key} should preserve its exam key.`);

  if ((question.sub || 'mc') === 'mc') {
    assert(Array.isArray(question.options), `${key} should have options.`);
    assert(question.options.length >= 4, `${key} should have at least four alternatives.`);
    assert(question.correct >= 0 && question.correct < question.options.length, `${key} has invalid correct index.`);
    assert.strictEqual(
      new Set(question.options).size,
      question.options.length,
      `${key} has duplicate alternatives.`
    );
  } else {
    assert.strictEqual(typeof question.correct, 'boolean', `${key} should use boolean correctness.`);
    assert(question.statement, `${key} should have a true/false statement.`);
  }
}

const simQueue = buildSimQueue(() => 0.42);
assert.strictEqual(simQueue.length, 10, 'Expected the simulado to keep 10 questions.');
assert(
  simQueue.filter(question => question.examKey).length >= 2,
  'Expected the simulado to include fixed exam-style questions.'
);

console.log('Datapath Quest content checks passed.');
