/* ===========================================================================
   CONTEUDO — factories.js
   Funcoes-fabrica compartilhadas por Prova 1, Prova 2 e Prova 3, mais a
   metadata de topicos (REVIEW_TOPICS). Precisa carregar ANTES dos arquivos
   content/prova1.js, prova2.js, prova3.js (eles chamam essas funcoes no
   topo do arquivo, na hora de montar os bancos de questoes).
   =========================================================================== */

// Helpers numericos/de calculo usados por reviewTime e pela questao tipo "prog"
// (movidos para ca porque os bancos de questoes os chamam imediatamente ao
// montar cada array, antes do resto do motor do jogo ser carregado).
function roundN(n,d=2){ const p=Math.pow(10,d); return Math.round(n*p)/p; }
function cpiToTimeNs(cpi,freqMHz){ return roundN(cpi*1000/freqMHz,3); }
function critStr(instr,t){
  const reg=t.regread, wr=(t.regwrite!==undefined?t.regwrite:t.regread);
  const mtr=t.memtoreg||0;
  const mux=mtr?`+MUX MemToReg(${mtr})`:'';
  if(instr==='lw') return `Mem.Instr(${t.imem})+Reg(${reg})+ULA(${t.alu})+Mem.Dados(${t.dmem})${mux}+EscreveReg(${wr})`;
  if(instr==='sw') return `Mem.Instr(${t.imem})+Reg(${reg})+ULA(${t.alu})+Mem.Dados(${t.dmem})`;
  if(['R','add','sub','slt','addi'].includes(instr)) return `Mem.Instr(${t.imem})+Reg(${reg})+ULA(${t.alu})${mux}+EscreveReg(${wr})`;
  if(instr==='beq'||instr==='bne')return `Mem.Instr(${t.imem})+Reg(${reg})+ULA(${t.alu})`;
  if(instr==='j')  return `Mem.Instr(${t.imem})`;
}
function solveProgramCase(program){
  const rowCycles={}, rowCpi={}; let totalInstr=0, totalCycles=0;
  program.rows.forEach(row=>{
    const count=program.counts[row]||0;
    const timeNs=program.timeNs[row]||0;
    const cpi=roundN(timeNs*program.freqMHz/1000,2);
    const cycles=count*cpi;
    rowCpi[row]=cpi;
    rowCycles[row]=cycles;
    totalInstr+=count;
    totalCycles+=cycles;
  });
  const avgCpi=roundN(totalCycles/totalInstr,2);
  const timeUs=roundN(totalCycles/program.freqMHz,3); // MHz = ciclos por microssegundo
  const percent={};
  program.rows.forEach(row=>{ percent[row]=roundN((program.counts[row]||0)*100/totalInstr,1); });
  return {rowCpi,rowCycles,totalInstr,totalCycles,avgCpi,timeUs,percent,finalValue:program.finalValue};
}
function programExplain(q){
  const p=q.program, s=q.solution;
  const rows=p.rows.map(row=>`<tr><td>${row}</td><td>${p.counts[row]}</td><td>${s.percent[row]}%</td><td>${p.timeNs[row]} ns</td><td>${p.timeNs[row]}×${p.freqMHz}/1000=${s.rowCpi[row]}</td><td>${p.counts[row]}×${s.rowCpi[row]}=${s.rowCycles[row]}</td></tr>`).join('');
  return `<b>${p.title}</b><br><span class="muted">${p.setup}</span>
    <ul>${p.reasoning.map(x=>`<li>${x}</li>`).join('')}</ul>
    <table class="program-table"><tr><th>Tipo</th><th>Qtde</th><th>%</th><th>Tempo/instr.</th><th>Ciclos por instrução</th><th>Ciclos totais</th></tr>${rows}</table>
    <div class="callout">Ciclos por instrução = tempo(ns) × frequência(MHz) ÷ 1000. Total de instruções = <b>${s.totalInstr}</b> · Ciclos = <b>${s.totalCycles}</b> · CPI médio = <b>${s.avgCpi}</b> · Tempo = ciclos ÷ frequência = <b>${s.totalCycles} ÷ ${p.freqMHz} = ${s.timeUs} us</b> · ${p.finalLabel} = <b>${s.finalValue}</b></div>`;
}
function programQuestion(program){
  const solution=solveProgramCase(program);
  return q5('prog','hard',{topic:'QProg',program,solution,
    question:`Complete a tabela dinâmica do programa: <b>${program.title}</b>`,
    explain:programExplain({program,solution})});
}

function instructionLabel(q){
  return q && q.label ? q.label : INSTR[q.instr].label;
}
function q1(instr, diff, params){
  return Object.assign({mode:1, diff, instr}, params || {},
    {hint:(params&&params.hint) || `Pense no fluxo: PC → busca a instrução → lê registradores → ULA → (memória) → escreve. A ${INSTR[instr].name} percorre ${PATHS[instr].length} blocos.`});
}
// Factory Modo 2 (Engenheiro de Controle — sinais de controle)
function q2(instr, diff, params){
  return Object.assign({mode:2, diff, instr}, params || {},
    {hint:(params&&params.hint) || `Regra rápida: RegWrite=1 se grava registrador (tipo-R, addi, lw). ALUSrc=1 quando usa imediato (addi, lw, sw). MemRead/MemWrite só em lw/sw. Branch em beq/bne. ALUOp: 00=lw/sw/addi, 01=beq/bne, 10=tipo-R.`});
}
// Factory Modo 3 (Calculadora de Tempos)
//   t3type: 'single' (1 instr), 'period' (uniciclo), 'benchmark' (média + speedup)
function q3(t3type, params, diff){
  return Object.assign({mode:3, diff, t3type, times:DEFAULT_TIMES}, params || {},
    {hint: t3type==='benchmark'
      ? 'Uniciclo: todas as instruções usam o MAIOR tempo (lw=12 ns). Multiciclo ideal: cada instrução leva seu próprio tempo → média = Σ (fração × tempo). Speedup = uniciclo / multiciclo.'
      : t3type==='period'
      ? 'O período do uniciclo é determinado pela instrução mais lenta — a lw (4+1+2+4+1).'
      : `Some os blocos do caminho crítico. ${(params&&params.instr)||''}: Mem.Instr(4)+Reg(1)+ULA(2)${(params&&['lw','sw'].includes(params.instr))?'+Mem.Dados(4)':''}${(params&&['lw','R','add','sub','slt','addi'].includes(params.instr))?'+EscreveReg(1)':''}.`});
}
// Factory Modo 4 (Pipeline Master)
function q4(diff){
  return {mode:4, diff,
    hint:'IF=busca (PC, Mem.Instr) · ID=decodifica (Banco Reg., Controle) · EX=executa (ULA) · MEM=memória de dados · WB=escreve no registrador.'};
}
// Factory Modo 5 (Prova Fechada — subtipos: mc, tf, ar, tbl)
function q5(sub, diff, params){
  return Object.assign({mode:5, diff, sub}, params || {},
    {hint: params?.hint || 'Pense no conceito e nas regras da Lista 3.'});
}

const REVIEW_TOPICS = [
  {id:'datapath_tempo', examId:'p3', topic:'QDatapath', label:'Caminho de dados e tempo', desc:'ADD, SUB, SLT, ADDI, LW, SW, BEQ, BNE e J com atrasos por enunciado.'},
  {id:'sequencia_paralelismo', examId:'p3', topic:'QParallel', label:'Sequência e paralelismo', desc:'Quando somar atrasos e quando usar o maior caminho.'},
  {id:'slt', examId:'p3', topic:'QSlt', label:'SLT', desc:'Set on Less Than, tipo R, ULA, sem alterar diretamente o PC.'},
  {id:'sinais_controle', examId:'p3', topic:'QControlExt', label:'Sinais de controle', desc:'RegDst, ALUSrc, MemToReg, RegWrite, memórias, Branch e ALUOp.'},
  {id:'registradores_funcoes', examId:'p3', topic:'QFunc', label:'Registradores de funções', desc:'Argumentos, retorno, $ra, $sp, temporários, salvos, HI e LO.'},
  {id:'jal_jr_pilha', examId:'p3', topic:'QCall', label:'JAL, JR e pilha', desc:'Chamada, retorno, função chamando função e salvamento de $ra.'},
  {id:'loops_dinamicos', examId:'p3', topic:'QLoops', label:'Loops e contagem dinâmica', desc:'Linhas do código versus instruções realmente executadas.'},
  {id:'cpi_medio', examId:'p3', topic:'QCpi', label:'CPI médio e tempo', desc:'Tabela dinâmica, ciclos totais, CPI médio e tempo de execução.'},
  {id:'questoes_abertas', examId:'p3', isOpen:true, topic:'QOpen', label:'Questões abertas', desc:'Autoavaliação guiada por critérios, sem correspondência textual exata.'},
  {id:'simulado_prova3', examId:'p3', topic:'QSim', label:'Simulado Modelo da Prova 3', desc:'Mistura variada com anulação, gabarito e treino dos erros.'},

  {id:'cla_somador', examId:'p1', topic:'QCla', label:'CLA e somador completo', desc:'Propagador e gerador de carry, somador completo, atraso por porta e frequência máxima.'},
  {id:'ieee754_custom', examId:'p1', topic:'QFloat', label:'Ponto flutuante (IEEE754)', desc:'Formatos sinal+expoente+mantissa sob medida, conversão hexadecimal ↔ decimal e armazenamento.'},
  {id:'amdahl_speedup', examId:'p1', topic:'QAmdahl', label:'Lei de Amdahl e speedup', desc:'Fração melhorada, speedup parcial e total, coprocessadores e mistura de instruções.'},
  {id:'cpi_desempenho_p1', examId:'p1', topic:'QCpiP1', label:'CPI médio e desempenho', desc:'Tabela instrução×CPI, tempo de execução, MIPS e comparação entre máquinas.'},
  {id:'p1_questoes_abertas', examId:'p1', isOpen:true, topic:'QOpenP1', label:'Questões abertas — Prova 1', desc:'Autoavaliação guiada por critérios sobre CLA, ponto flutuante e desempenho.'},

  {id:'enderecamento_vetor', examId:'p2', topic:'QAddr', label:'Endereçamento e vetores', desc:'lw/sw com offset, deslocamento em bytes por índice e acesso a elementos de vetores.'},
  {id:'deslocamento_shift', examId:'p2', topic:'QShift', label:'Deslocamento (sll/srl/sra)', desc:'Construir constantes e multiplicar/dividir por potências de 2 usando shift.'},
  {id:'cpi_desempenho_p2', examId:'p2', topic:'QCpiP2', label:'CPI médio e desempenho', desc:'Contagem de instruções executadas, CPI médio, tempo total e taxa MIPS a partir de um programa.'},
  {id:'pilha_funcoes_p2', examId:'p2', topic:'QStackP2', label:'Pilha em chamadas de função', desc:'Quando salvar $ra e uso mínimo da pilha em chamadas aninhadas.'},
  {id:'p2_questoes_abertas', examId:'p2', isOpen:true, topic:'QOpenP2', label:'Questões abertas — Prova 2', desc:'Autoavaliação guiada por critérios sobre endereçamento, shifts e pilha.'}
];
function topicForCategory(category){
  const t=REVIEW_TOPICS.find(x=>x.id===category);
  return t?t.topic:'QOpen';
}
function enrichReviewQuestion(q, meta){
  const topic=meta.topic || topicForCategory(meta.category);
  const quick=meta.quickRule || 'Explique o caminho antes de calcular.';
  if(q.explain && q.explain.length<55) q.explain += ` Regra rápida: ${quick}`;
  return Object.assign(q, {
    id:meta.id,
    topic,
    category:meta.category,
    subtopic:meta.subtopic || meta.category,
    errorType:meta.errorType || meta.category,
    quickRule:quick,
    hint:meta.hint || quick || q.hint
  });
}
function reviewMC(meta, question, options, correct, explain){
  return enrichReviewQuestion(q5('mc', meta.diff||'med', {question,options,correct,explain}), meta);
}
function reviewTF(meta, statement, correct, explain){
  return enrichReviewQuestion(q5('tf', meta.diff||'med', {statement,correct,explain}), meta);
}
function reviewAR(meta, statement, correct, explain){
  return enrichReviewQuestion(q5('ar', meta.diff||'med', {statement,correct,explain}), meta);
}
function reviewTbl(meta, instruction, blanks, explain){
  return enrichReviewQuestion(q5('tbl', meta.diff||'med', {instruction,blanks,explain}), meta);
}
function reviewOpen(meta, prompt, modelAnswer, requiredPoints, commonMistakes, shortExplain, fullExplain){
  return enrichReviewQuestion(q5('open', meta.diff||'hard', {
    question:prompt, modelAnswer, requiredPoints, commonMistakes, shortExplain, fullExplain,
    explain:shortExplain
  }), meta);
}
function reviewShuffle(arr){
  const a=arr.slice();
  for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}
function numericOptions(correct, wrongs){
  const vals=[correct].concat(wrongs).filter(v=>isFinite(v) && v>0);
  const uniq=[];
  vals.forEach(v=>{ const s=String(roundN(v,2)); if(!uniq.includes(s)) uniq.push(s); });
  while(uniq.length<4) uniq.push(String(roundN(correct+uniq.length+1,2)));
  return reviewShuffle(uniq.slice(0,5));
}
function reviewTime(meta, instr, times, pathText){
  const correct=instrTime(instr,times);
  const opts=numericOptions(correct, [
    correct-(times.memtoreg||0)||correct-1,
    instr==='lw'?correct-(times.memtoreg||0)-times.dmem:correct+times.dmem,
    correct+times.control,
    correct+times.adder
  ]);
  const explain=`${pathText} Conta completa: ${critStr(instr,times)} = <b>${correct} ns</b>. Componentes fora desse caminho não entram; sinais de controle podem ser gerados em paralelo, mas o dado precisa atravessar cada bloco sequencial usado.`;
  return enrichReviewQuestion(q5('mc', meta.diff||'med', {
    question:`Com os tempos do enunciado, qual é o tempo da instrução <b>${INSTR[instr].label}</b>?<br><span class="muted">${pathText}</span>`,
    options:opts.map(v=>`${v} ns`),
    correct:opts.indexOf(String(roundN(correct,2))),
    times,
    instr,
    explain
  }), meta);
}
function reviewCpiProgram(meta, program){
  const q=programQuestion(program);
  return enrichReviewQuestion(Object.assign(q, {topic:meta.topic||'QCpi'}), meta);
}
