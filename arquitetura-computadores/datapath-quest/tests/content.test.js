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

assert(
  html.includes('function skipFreeQuestion'),
  'Expected a dedicated function for skipping questions in free mode.'
);

assert(
  html.includes('⏭ Pular'),
  'Expected the free-mode skip button to be labeled "⏭ Pular".'
);

assert(
  html.includes("['free','review','targeted','provaInfinita'].includes(G.mode)"),
  'Expected the skip button to be gated to non-level practice modes.'
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
    '\n;globalThis.__dq = { PROVA_FIXED_Q5, LEVELS, qProva, geraProvaFixaQ5, buildSimQueue, SIGNAL_NAMES, CONTROL, SIG_INFO, SIG_WHY, skipFreeQuestion: typeof skipFreeQuestion === "function" ? skipFreeQuestion : null, REVIEW_BANK: typeof REVIEW_BANK !== "undefined" ? REVIEW_BANK : null, REVIEW_TOPICS: typeof REVIEW_TOPICS !== "undefined" ? REVIEW_TOPICS : null, OPEN_QUESTIONS: typeof OPEN_QUESTIONS !== "undefined" ? OPEN_QUESTIONS : null, buildReviewQueue: typeof buildReviewQueue === "function" ? buildReviewQueue : null, buildTargetedPracticeQueue: typeof buildTargetedPracticeQueue === "function" ? buildTargetedPracticeQueue : null, recordConceptError: typeof recordConceptError === "function" ? recordConceptError : null, renderM5open: typeof renderM5open === "function" ? renderM5open : null, buildProva3SimQueue: typeof buildProva3SimQueue === "function" ? buildProva3SimQueue : null, nullSimQuestion: typeof nullSimQuestion === "function" ? nullSimQuestion : null };',
  sandbox,
  { filename: 'mips-datapath-quest.html' }
);

const { PROVA_FIXED_Q5, LEVELS, qProva, buildSimQueue, SIGNAL_NAMES, CONTROL, SIG_INFO, SIG_WHY, skipFreeQuestion, REVIEW_BANK, REVIEW_TOPICS, OPEN_QUESTIONS, buildReviewQueue, buildTargetedPracticeQueue, recordConceptError, renderM5open, buildProva3SimQueue, nullSimQuestion } = sandbox.__dq;
assert.strictEqual(typeof skipFreeQuestion, 'function', 'Expected skipFreeQuestion to be callable.');

assert(SIGNAL_NAMES.includes('ALUOp'), 'Expected ALUOp to be part of the control signals.');
assert.strictEqual(SIGNAL_NAMES.length, 8, 'Expected Modo 2 to teach 8 control signals.');

const aluOpIndex = SIGNAL_NAMES.indexOf('ALUOp');
for (const instr of ['slt', 'addi', 'bne']) {
  assert(CONTROL[instr], `Expected CONTROL to include ${instr}.`);
}
assert.strictEqual(CONTROL.R[aluOpIndex], '10', 'R-type ALUOp should be 10.');
assert.strictEqual(CONTROL.slt[aluOpIndex], '10', 'slt ALUOp should be 10.');
assert.strictEqual(CONTROL.addi[aluOpIndex], '00', 'addi ALUOp should be 00.');
assert.strictEqual(CONTROL.lw[aluOpIndex], '00', 'lw ALUOp should be 00.');
assert.strictEqual(CONTROL.sw[aluOpIndex], '00', 'sw ALUOp should be 00.');
assert.strictEqual(CONTROL.beq[aluOpIndex], '01', 'beq ALUOp should be 01.');
assert.strictEqual(CONTROL.bne[aluOpIndex], '01', 'bne ALUOp should be 01.');
assert(SIG_INFO.ALUOp.v00 && SIG_INFO.ALUOp.v01 && SIG_INFO.ALUOp.v10, 'Expected ALUOp explanations for 00, 01 and 10.');
assert(SIG_WHY.ALUOp['00'] && SIG_WHY.ALUOp['01'] && SIG_WHY.ALUOp['10'], 'Expected ALUOp feedback for 00, 01 and 10.');
assert(html.includes('8 sinais de controle'), 'Expected visible copy to mention 8 control signals.');
assert(html.includes('Revisão — Prova 3 e Reavaliação'), 'Expected the new review section to be visible.');
assert(html.includes('Simulado — Modelo da Prova 3'), 'Expected the Prova 3 simulation name to be visible.');
assert(html.includes('Caderno de erros'), 'Expected an error notebook entry point.');

assert(Array.isArray(REVIEW_TOPICS) && REVIEW_TOPICS.length >= 10, 'Expected review topics to cover the full Prova 3 scope.');
assert(Array.isArray(REVIEW_BANK), 'Expected REVIEW_BANK to be an array.');
assert(Array.isArray(OPEN_QUESTIONS), 'Expected OPEN_QUESTIONS to be an array.');
assert.strictEqual(typeof buildReviewQueue, 'function', 'Expected buildReviewQueue to exist.');
assert.strictEqual(typeof buildTargetedPracticeQueue, 'function', 'Expected buildTargetedPracticeQueue to exist.');
assert.strictEqual(typeof recordConceptError, 'function', 'Expected recordConceptError to exist.');
assert.strictEqual(typeof renderM5open, 'function', 'Expected the short-discursive renderer to exist.');
assert.strictEqual(typeof buildProva3SimQueue, 'function', 'Expected a Prova 3 simulado queue builder.');
assert.strictEqual(typeof nullSimQuestion, 'function', 'Expected simulado nullification support.');

const reviewCounts = REVIEW_BANK.reduce((acc, question) => {
  acc[question.category] = (acc[question.category] || 0) + 1;
  return acc;
}, {});
const minimumReviewCoverage = {
  datapath_tempo: 10,
  sequencia_paralelismo: 8,
  slt: 10,
  sinais_controle: 10,
  registradores_funcoes: 10,
  jal_jr_pilha: 8,
  loops_dinamicos: 10,
  cpi_medio: 10
};
for (const [category, minimum] of Object.entries(minimumReviewCoverage)) {
  assert(
    reviewCounts[category] >= minimum,
    `Expected at least ${minimum} new review questions for ${category}.`
  );
}
assert(OPEN_QUESTIONS.length >= 12, 'Expected at least 12 open questions.');

for (const question of REVIEW_BANK) {
  assert(question.id && question.id.startsWith('rev_p3_'), `Review question needs a stable unique id: ${question.id}`);
  assert(question.topic && question.category && question.errorType, `${question.id} needs topic/category/errorType metadata.`);
  assert(question.explain && question.explain.length > 50, `${question.id} needs pedagogical feedback.`);
  assert(question.quickRule && question.quickRule.length > 10, `${question.id} needs a quick rule.`);
}
assert.strictEqual(new Set(REVIEW_BANK.map(q => q.id)).size, REVIEW_BANK.length, 'Review question IDs must be unique.');

for (const question of OPEN_QUESTIONS) {
  assert.strictEqual(question.sub, 'open', `${question.id} should use the open subtype.`);
  assert(Array.isArray(question.requiredPoints) && question.requiredPoints.length >= 2, `${question.id} needs self-check criteria.`);
  assert(question.modelAnswer && question.shortExplain && question.fullExplain && question.commonMistakes, `${question.id} needs model answer and feedback.`);
}

const targetedQueue = buildTargetedPracticeQueue(() => 0.42);
assert(targetedQueue.length > 0, 'Targeted practice should produce questions even without saved errors.');
assert(
  targetedQueue.some(question => question.sub === 'open') || targetedQueue.some(question => question.category),
  'Targeted practice should include conceptual review questions.'
);

const prova3Queue = buildProva3SimQueue(() => 0.42);
assert.strictEqual(prova3Queue.length, 10, 'Expected the Prova 3 simulado to keep 10 questions.');
assert(prova3Queue.some(question => question.sub === 'open'), 'Expected the simulado to include at least one open question.');
assert(prova3Queue.some(question => question.category === 'cpi_medio' || question.topic === 'QProg'), 'Expected the simulado to include CPI/program counting.');
assert(prova3Queue.some(question => question.category === 'slt'), 'Expected the simulado to include SLT.');

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
