/* ===========================================================================
   CONTEUDO — visuals.js
   Desenhos usados nos conteudos e no botao "Ver visualmente" das questoes.
   - mountScene: animacao do processador falando com a memoria
   - mountWidget: desenhos interativos (vetor, shift, CLA, Amdahl, CPI...)
   - visualForQuestion: escolhe o desenho de uma questao SEM revelar a resposta
   Nada aqui roda no carregamento: so define funcoes e dados.
   =========================================================================== */

/* ---- Cena: dentro do processador ---- */
const SCENE_WIRES = {
  pcToMem:  'M85 92 V50 H640 V92',
  memToCtl: 'M640 120 H570 V82 H300',
  ctlToReg: 'M235 104 V150',
  ctlToAlu: 'M300 94 H385 V168',
  regToAlu: 'M310 205 H350',
  aluToMem: 'M430 222 H505 V262 H640',
  memToReg: 'M640 298 H240 V286',
  aluToReg: 'M430 232 H470 V312 H240 V286',
  regToMem: 'M310 262 H335 V326 H640 V306',
  aluToPc:  'M390 276 V342 H85 V140'
};
const SCENES = {
  lw: {
    label:'lw $t0, 8($s1)', title:'Leitura da memória',
    regs:{'$s1':'0x1000','$t0':'—'}, cells:{'0x1000':'7','0x1004':'13','0x1008':'42','0x100C':'5'},
    steps:[
      {lit:['pc','minstr'],wire:'pcToMem',tok:'PC',cap:'O <b>PC</b> guarda onde está a próxima instrução. O processador manda esse endereço para a memória.'},
      {lit:['minstr','ctl'],wire:'memToCtl',tok:'lw',cap:'A instrução volta para dentro do processador e a <b>Unidade de Controle</b> descobre que é um <b>lw</b>.'},
      {lit:['ctl','regs'],wire:'ctlToReg',tok:'$s1',hi:['$s1'],cap:'O <b>banco de registradores</b> lê <b>$s1</b>, que tem o endereço-base: 0x1000.'},
      {lit:['ctl','alu'],wire:'ctlToAlu',tok:'8',cap:'O deslocamento <b>8</b> vem de dentro da própria instrução e vai para a <b>ULA</b>.'},
      {lit:['regs','alu'],wire:'regToAlu',tok:'0x1000',cap:'A <b>ULA</b> soma base + deslocamento: 0x1000 + 8 = <b>0x1008</b>. Ela calcula o endereço, não lê nada ainda.'},
      {lit:['alu','mdata'],wire:'aluToMem',tok:'0x1008',cell:'0x1008',cap:'Agora o endereço <b>sai do processador</b> pelo barramento, com <b>MemRead = 1</b>. A memória fica fora do processador.'},
      {lit:['mdata','regs'],wire:'memToReg',tok:'42',cell:'0x1008',set:{'$t0':'42'},hi:['$t0'],cap:'A memória devolve o valor <b>42</b>, que entra no processador e é gravado em <b>$t0</b> (RegWrite = 1). Pronto.'}
    ]
  },
  sw: {
    label:'sw $t0, 4($s1)', title:'Escrita na memória',
    regs:{'$s1':'0x1000','$t0':'99'}, cells:{'0x1000':'7','0x1004':'13','0x1008':'42','0x100C':'5'},
    steps:[
      {lit:['pc','minstr'],wire:'pcToMem',tok:'PC',cap:'Toda instrução começa igual: o <b>PC</b> pede a próxima instrução à memória.'},
      {lit:['minstr','ctl'],wire:'memToCtl',tok:'sw',cap:'O <b>Controle</b> reconhece um <b>sw</b>: vai escrever na memória e não em registrador.'},
      {lit:['ctl','regs'],wire:'ctlToReg',tok:'$s1',hi:['$s1','$t0'],cap:'O banco lê os <b>dois</b> registradores: <b>$s1</b> (a base) e <b>$t0</b> (o valor que será guardado).'},
      {lit:['regs','alu'],wire:'regToAlu',tok:'0x1000',cap:'A <b>ULA</b> calcula o endereço: 0x1000 + 4 = <b>0x1004</b>.'},
      {lit:['alu','mdata'],wire:'aluToMem',tok:'0x1004',cell:'0x1004',cap:'O endereço sai pelo barramento até a memória, agora com <b>MemWrite = 1</b>.'},
      {lit:['regs','mdata'],wire:'regToMem',tok:'99',cell:'0x1004',setCell:{'0x1004':'99'},cap:'O valor de <b>$t0</b> vai junto e fica gravado na memória. Nenhum registrador muda (RegWrite = 0).'}
    ]
  },
  add: {
    label:'add $t0, $s1, $s2', title:'Conta sem usar a memória de dados',
    regs:{'$s1':'30','$s2':'12','$t0':'—'}, cells:{'0x1000':'7','0x1004':'13','0x1008':'42','0x100C':'5'},
    steps:[
      {lit:['pc','minstr'],wire:'pcToMem',tok:'PC',cap:'O <b>PC</b> pede a instrução à memória.'},
      {lit:['minstr','ctl'],wire:'memToCtl',tok:'add',cap:'O <b>Controle</b> vê que é tipo-R: dois registradores entram e um recebe o resultado.'},
      {lit:['ctl','regs'],wire:'ctlToReg',tok:'$s1',hi:['$s1','$s2'],cap:'O banco lê <b>$s1 = 30</b> e <b>$s2 = 12</b>.'},
      {lit:['regs','alu'],wire:'regToAlu',tok:'30, 12',cap:'A <b>ULA</b> soma: 30 + 12 = <b>42</b>.'},
      {lit:['alu','regs'],wire:'aluToReg',tok:'42',set:{'$t0':'42'},hi:['$t0'],cap:'O resultado volta direto para <b>$t0</b>. Repare: nada saiu para a memória de dados.'}
    ]
  },
  beq: {
    label:'beq $s1, $s2, FIM', title:'Desvio: quem muda é o PC',
    regs:{'$s1':'8','$s2':'8'}, cells:{'0x1000':'7','0x1004':'13','0x1008':'42','0x100C':'5'},
    steps:[
      {lit:['pc','minstr'],wire:'pcToMem',tok:'PC',cap:'O <b>PC</b> pede a instrução à memória.'},
      {lit:['minstr','ctl'],wire:'memToCtl',tok:'beq',cap:'O <b>Controle</b> liga <b>Branch = 1</b> e manda a ULA subtrair.'},
      {lit:['ctl','regs'],wire:'ctlToReg',tok:'$s1',hi:['$s1','$s2'],cap:'O banco lê os dois registradores que serão comparados.'},
      {lit:['regs','alu'],wire:'regToAlu',tok:'8, 8',cap:'A <b>ULA</b> faz 8 − 8 = 0, e o sinal <b>Zero</b> liga: os valores são iguais.'},
      {lit:['alu','pc'],wire:'aluToPc',tok:'FIM',cap:'Como Zero = 1 e Branch = 1, o <b>PC</b> recebe o endereço de FIM. Nada foi escrito em registrador nem na memória.'}
    ]
  }
};

function sceneSVG(sc, st, regs, cells){
  const lit=k=>st.lit.includes(k)?' on':'';
  const regRows=Object.keys(regs).map((r,i)=>{
    const y=178+i*30;
    const hi=(st.hi||[]).includes(r)?' on':'';
    return `<g class="sc-reg${hi}"><rect x="178" y="${y}" width="114" height="25" rx="3"/><text class="sc-mono" x="186" y="${y+17}">${r}</text><text class="sc-mono sc-val" x="284" y="${y+17}" text-anchor="end">${regs[r]}</text></g>`;
  }).join('');
  const cellRows=Object.keys(cells).map((a,i)=>{
    const y=232+i*25;
    const hi=st.cell===a?' on':'';
    return `<g class="sc-cell${hi}"><rect x="640" y="${y}" width="150" height="22" rx="2"/><text class="sc-mono sc-dim" x="648" y="${y+15}">${a}</text><text class="sc-mono sc-val" x="782" y="${y+15}" text-anchor="end">${cells[a]}</text></g>`;
  }).join('');
  const wires=Object.keys(SCENE_WIRES).map(k=>`<path class="sc-wire${st.wire===k?' on':''}" d="${SCENE_WIRES[k]}"/>`).join('');
  return `<svg class="scene-svg" viewBox="0 0 820 372" role="img" aria-label="${sc.title}: processador à esquerda, memória à direita">
    <rect class="sc-chip" x="20" y="24" width="520" height="332" rx="10"/>
    <text class="sc-label" x="36" y="44">PROCESSADOR</text>
    <rect class="sc-ram" x="620" y="24" width="186" height="332" rx="10"/>
    <text class="sc-label" x="652" y="44">MEMÓRIA (RAM)</text>
    <text class="sc-tiny" x="580" y="18" text-anchor="middle">barramento</text>
    <line class="sc-bus" x1="540" y1="24" x2="540" y2="356"/><line class="sc-bus" x1="620" y1="24" x2="620" y2="356"/>
    ${wires}
    <g class="sc-box${lit('pc')}"><rect x="50" y="92" width="72" height="48" rx="4"/><text x="86" y="121" text-anchor="middle">PC</text></g>
    <g class="sc-box${lit('ctl')}"><rect x="170" y="60" width="130" height="44" rx="4"/><text x="235" y="87" text-anchor="middle">Controle</text></g>
    <g class="sc-box${lit('regs')}"><rect x="170" y="150" width="130" height="136" rx="4"/><text class="sc-small" x="235" y="168" text-anchor="middle">Registradores</text></g>
    ${regRows}
    <g class="sc-box${lit('alu')}"><polygon points="350,168 430,196 430,258 350,286 350,244 368,227 350,210"/><text x="400" y="232" text-anchor="middle">ULA</text></g>
    <g class="sc-box${lit('minstr')}"><rect x="640" y="72" width="150" height="72" rx="3"/><text class="sc-small" x="715" y="94" text-anchor="middle">Instruções</text><text class="sc-mono" x="715" y="122" text-anchor="middle">${sc.label.split(' ')[0]} …</text></g>
    <g class="sc-box${lit('mdata')}"><rect x="632" y="196" width="166" height="140" rx="3"/><text class="sc-small" x="715" y="218" text-anchor="middle">Dados</text></g>
    ${cellRows}
    <g class="sc-token" style="display:none"><rect rx="4" height="20"/><text class="sc-mono" text-anchor="middle" y="14"></text></g>
  </svg>`;
}

function mountScene(el, key, opts){
  opts=opts||{};
  const sc=SCENES[key];
  let i=0, raf=0, timer=0, alive=true;
  el.innerHTML=`<div class="scene">
    <div class="scene-head"><span class="scene-instr mono">${sc.label}</span><span class="scene-count"></span></div>
    <div class="scene-stage"></div>
    <p class="scene-cap" aria-live="polite"></p>
    <div class="scene-ctl"${opts.loop?' hidden':''}>
      <button class="btn ghost small" data-a="prev" type="button">← Anterior</button>
      <button class="btn small" data-a="next" type="button">Próximo passo →</button>
    </div>
  </div>`;
  const stage=el.querySelector('.scene-stage'), cap=el.querySelector('.scene-cap'), count=el.querySelector('.scene-count');
  const stateAt=n=>{
    const regs=Object.assign({},sc.regs), cells=Object.assign({},sc.cells);
    for(let k=0;k<=n;k++){ Object.assign(regs,sc.steps[k].set||{}); Object.assign(cells,sc.steps[k].setCell||{}); }
    return {regs,cells};
  };
  function draw(){
    cancelAnimationFrame(raf);
    const st=sc.steps[i], s=stateAt(i);
    stage.innerHTML=sceneSVG(sc,st,s.regs,s.cells);
    cap.innerHTML=st.cap;
    count.textContent=`Passo ${i+1} de ${sc.steps.length}`;
    const prev=el.querySelector('[data-a=prev]'), next=el.querySelector('[data-a=next]');
    prev.disabled=i===0;
    next.textContent=i===sc.steps.length-1?'Ver de novo ↻':'Próximo passo →';
    const path=stage.querySelector('.sc-wire.on');
    const tok=stage.querySelector('.sc-token');
    if(!path||!tok||!path.getTotalLength) return;
    const label=tok.querySelector('text'), box=tok.querySelector('rect');
    label.textContent=st.tok;
    const w=Math.max(34,String(st.tok).length*8+14);
    box.setAttribute('width',w); box.setAttribute('x',-w/2); label.setAttribute('x',0);
    const len=path.getTotalLength();
    const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    const place=f=>{ const p=path.getPointAtLength(len*f); tok.setAttribute('transform',`translate(${p.x} ${p.y-10})`); };
    tok.style.display='';
    // No celular o desenho rola de lado: acompanha o lado onde a acao acontece.
    if(stage.scrollWidth>stage.clientWidth) stage.scrollLeft=(st.lit.includes('minstr')||st.lit.includes('mdata'))?stage.scrollWidth:0;
    if(reduce){ place(1); return; }
    const t0=performance.now();
    const dur=opts.loop?1100:950;
    const tick=t=>{
      if(!alive||!el.isConnected) return;
      const f=Math.min(1,(t-t0)/dur);
      place(f<.5?2*f*f:1-Math.pow(-2*f+2,2)/2);
      if(f<1) raf=requestAnimationFrame(tick);
    };
    raf=requestAnimationFrame(tick);
  }
  el.querySelector('[data-a=prev]').onclick=()=>{ if(i>0){ i--; draw(); } };
  el.querySelector('[data-a=next]').onclick=()=>{ i=(i+1)%sc.steps.length; draw(); };
  draw();
  if(opts.loop){
    timer=setInterval(()=>{
      if(!el.isConnected){ clearInterval(timer); alive=false; return; }
      if(document.hidden||!el.offsetParent) return;
      i=(i+1)%sc.steps.length; draw();
    },3400);
  }
  return ()=>{ alive=false; clearInterval(timer); cancelAnimationFrame(raf); };
}

/* ---- Desenhos interativos ---- */
const hexPad=(n,d)=>n.toString(16).toUpperCase().padStart(d,'0');
const numBR=(v,d)=>Number(v).toLocaleString('pt-BR',{maximumFractionDigits:d===undefined?2:d});

const WIDGETS = {
  // Vetor na memoria: indice vira deslocamento em bytes
  mem(el,p){
    p=Object.assign({index:3,size:4,base:'$s1',reg:'$t0',op:'lw',quiz:false},p);
    const draw=()=>{
      const idx=p.index, size=p.size;
      const start=p.quiz?0:Math.max(0,idx-3), end=start+6;
      const cell=(i,off)=>`<div class="mem-cell${i===idx?' on':''}"><span class="mem-off mono">${off}</span><span class="mem-name mono">${i===idx&&p.targetName?p.targetName:`vet[${i}]`}</span></div>`;
      let cells='';
      if(p.quiz){
        // Na questao mostra so o comeco do padrao: a conta do alvo fica para quem responde.
        for(let i=0;i<Math.min(2,idx);i++) cells+=cell(i,'+'+i*size);
        if(idx>2) cells+='<span class="mem-gap">…</span>';
        cells+=cell(idx,'?');
      } else {
        for(let i=start;i<end;i++) cells+=cell(i,'+'+i*size);
      }
      const res=p.quiz?'':`<div class="vis-eq mono">${idx} × ${size} = <b>${idx*size}</b> bytes → ${p.op} ${p.reg}, ${idx*size}(${p.base})</div>`;
      const ctl=p.quiz?'':`<label class="vis-range">Índice <input type="range" min="0" max="30" value="${idx}"><b class="mono">${idx}</b></label>
        <div class="vis-seg" role="group" aria-label="Tamanho do elemento"><button type="button" data-s="4" class="${size===4?'on':''}">int (4 bytes)</button><button type="button" data-s="1" class="${size===1?'on':''}">char (1 byte)</button></div>`;
      el.innerHTML=`<div class="vis-memwrap"><div class="mem-base mono">${p.base}<small>base</small></div><div class="mem-strip">${!p.quiz&&start>0?'<span class="mem-gap">…</span>':''}${cells}<span class="mem-gap">…</span></div></div>
        <p class="vis-note">A memória é endereçada em <b>bytes</b>. O elemento de ordem N (o "N-ésimo") tem índice N−1.</p>${res}${ctl}`;
      const r=el.querySelector('input[type=range]');
      if(r) r.oninput=()=>{ p.index=+r.value; draw(); el.querySelector('input[type=range]').focus(); };
      el.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{ p.size=+b.dataset.s; draw(); });
    };
    draw();
  },
  // Deslocamento: os bits andam e o que entra depende da instrucao
  shift(el,p){
    p=Object.assign({value:0b00110100,hint:null},p);
    let v=p.value&255, entered=-1, last='';
    const signed=x=>x>127?x-256:x;
    const draw=()=>{
      const bits=v.toString(2).padStart(8,'0').split('').map((b,i)=>`<span class="bit b${b}${i===entered?' new':''}">${b}</span>`).join('');
      el.innerHTML=`<div class="shift-row"><div class="bits">${bits}</div><div class="shift-val mono">= ${signed(v)}</div></div>
        <div class="vis-seg" role="group" aria-label="Instrução de deslocamento">
          <button type="button" data-o="sll">sll ← multiplica por 2</button>
          <button type="button" data-o="srl">srl → entra 0</button>
          <button type="button" data-o="sra">sra → copia o sinal</button>
          <button type="button" data-o="neg">trocar sinal</button>
        </div>
        <p class="vis-note">${last||'Registrador desenhado com 8 bits para caber na tela; no MIPS são 32. Toque nos botões para ver o que entra em cada lado.'}</p>`;
      el.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{
        const o=b.dataset.o, before=signed(v);
        if(o==='sll'){ v=(v<<1)&255; entered=7; last=`sll: tudo anda para a esquerda e entra <b>0</b> na direita. ${before} × 2 = ${signed(v)}.`; }
        if(o==='srl'){ v=v>>>1; entered=0; last=`srl: entra <b>0</b> na esquerda, mesmo se o número era negativo. ${before<0?`Por isso ${before} virou ${signed(v)}: o sinal se perdeu.`:`${before} ÷ 2 = ${signed(v)}.`}`; }
        if(o==='sra'){ const s=v&128; v=(v>>>1)|s; entered=0; last=`sra: o bit que entra é uma <b>cópia do sinal</b>. ${before} ÷ 2 = ${signed(v)}. É o certo para dividir número com sinal.`; }
        if(o==='neg'){ v=(-signed(v))&255; entered=-1; last=`Complemento de dois: agora o valor é ${signed(v)}.`; }
        draw();
      });
    };
    draw();
  },
  // CLA: G e P coluna por coluna
  cla(el,p){
    p=Object.assign({a:0x92B9,b:0x7B3B,quiz:false},p);
    const row=(name,val,cls)=>{
      const b=val.toString(2).padStart(16,'0').split('');
      return `<div class="cla-row ${cls||''}"><span class="cla-name mono">${name}</span>${b.map((x,i)=>`<span class="cla-bit b${x}${i%4===0&&i?' gap':''}">${x}</span>`).join('')}<span class="cla-hex mono">${hexPad(val,4)}</span></div>`;
    };
    const draw=()=>{
      const g=p.a&p.b, pr=p.a|p.b, sum=p.a+p.b, out=sum>0xFFFF;
      el.innerHTML=`<div class="cla-table">${row('A',p.a)}${row('B',p.b)}${p.quiz?'':row('G',g,'g')+row('P',pr,'p')}</div>
        <div class="vis-legend"><span><b>G</b> = A <b>e</b> B: os dois bits são 1, então <i>gera</i> vai-um sozinho.</span><span><b>P</b> = A <b>ou</b> B: se chegar um vai-um, ele <i>passa</i> adiante.</span></div>
        ${p.quiz?'':`<div class="vis-eq mono">${hexPad(p.a,4)} + ${hexPad(p.b,4)} = ${hexPad(sum,out?5:4)} → <b>${out?'há':'não há'} vai-um para fora</b></div>
        <button class="btn ghost small" type="button" data-r>Sortear outra soma</button>`}`;
      const r=el.querySelector('[data-r]');
      if(r) r.onclick=()=>{ p.a=Math.floor(Math.random()*65536); p.b=Math.floor(Math.random()*65536); draw(); };
    };
    draw();
  },
  // Amdahl: a barra de tempo encolhe so na parte melhorada
  amdahl(el,p){
    p=Object.assign({fm:40,sup:5,after:false,quiz:false},p);
    const draw=()=>{
      const f=p.fm/100;
      // "after": a porcentagem foi medida no tempo novo, com a melhoria ligada
      const oldF=p.after?(f*p.sup)/((1-f)+f*p.sup):f;
      const newT=(1-oldF)+oldF/p.sup;
      const s=1/newT;
      const bar=(lbl,fast,rest,fl,rl)=>`<div class="am-row"><span class="am-lbl">${lbl}</span><div class="am-track">
        <div class="am-seg fast" style="width:${fast*100}%">${fast>.12?fl:''}</div><div class="am-seg rest" style="width:${rest*100}%">${rest>.12?rl:''}</div></div></div>`;
      el.innerHTML=`${bar('Antes',oldF,1-oldF,'parte melhorável','resto')}
        ${bar('Depois',oldF/p.sup,1-oldF,'÷ '+numBR(p.sup),'resto (igual)')}
        <p class="vis-note">A barra inteira é o tempo total. Só o trecho colorido encolhe: é por isso que o resto limita o ganho.</p>
        ${p.quiz?'':`<div class="vis-eq mono">Speedup = 1 ÷ ${numBR(newT,3)} = <b>${numBR(s,2)} vezes</b></div>
        <label class="vis-range">Fração <input type="range" data-k="fm" min="0" max="100" step="5" value="${p.fm}"><b class="mono">${p.fm}%</b></label>
        <label class="vis-range">Melhoria <input type="range" data-k="sup" min="1" max="20" value="${p.sup}"><b class="mono">${p.sup}×</b></label>
        <label class="vis-check"><input type="checkbox" data-c${p.after?' checked':''}> A fração foi medida <b>depois</b> da melhoria (pegadinha de prova)</label>`}`;
      el.querySelectorAll('[data-k]').forEach(r=>r.oninput=()=>{ p[r.dataset.k]=+r.value; const k=r.dataset.k; draw(); el.querySelector(`[data-k=${k}]`).focus(); });
      const c=el.querySelector('[data-c]');
      if(c) c.onchange=()=>{ p.after=c.checked; draw(); };
    };
    draw();
  },
  // CPI: cada tipo pesa (quantidade x ciclos)
  cpi(el,p){
    p=Object.assign({rows:[{n:'ULA',pct:45,cpi:8},{n:'Desvios',pct:20,cpi:6},{n:'Memória',pct:30,cpi:10},{n:'Outras',pct:5,cpi:12}],freq:200,quiz:false,unit:'%'},p);
    const draw=()=>{
      const total=p.rows.reduce((a,r)=>a+r.pct,0);
      const cycles=p.rows.reduce((a,r)=>a+r.pct*r.cpi,0);
      const blocks=p.rows.map((r,i)=>{
        const w=cycles?r.pct*r.cpi/cycles*100:0;
        return `<div class="cpi-seg s${i%4}" style="width:${w}%" title="${r.n}"><span>${w>11?r.n:''}</span></div>`;
      }).join('');
      const rows=p.rows.map((r,i)=>`<div class="cpi-row"><span class="dot s${i%4}"></span><span class="cpi-n">${r.n}</span><span class="mono">${r.pct}${p.unit}</span><span class="cpi-x">×</span>
        ${p.quiz?`<span class="mono">${r.cpi} ciclos</span>`:`<span class="stepper"><button type="button" data-d="-1" data-i="${i}" aria-label="Menos ciclos em ${r.n}">−</button><b class="mono">${r.cpi}</b><button type="button" data-d="1" data-i="${i}" aria-label="Mais ciclos em ${r.n}">+</button></span>`}</div>`).join('');
      const avg=total?cycles/total:0;
      el.innerHTML=`<div class="cpi-bar" role="img" aria-label="Peso de cada tipo de instrução no total de ciclos">${blocks}</div>
        <p class="vis-note">O tamanho de cada pedaço é <b>quantidade × ciclos</b>. Um tipo pouco usado mas lento pode pesar muito.</p>
        <div class="cpi-rows">${rows}</div>
        ${p.quiz?'':`<div class="vis-eq mono">CPI médio = ${numBR(avg,2)} · MIPS = ${p.freq} ÷ ${numBR(avg,2)} = <b>${numBR(p.freq/avg,1)}</b></div>`}`;
      el.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{ const r=p.rows[+b.dataset.i]; r.cpi=Math.max(1,r.cpi+ +b.dataset.d); draw(); });
    };
    draw();
  },
  // Ponto flutuante: toque nos bits
  float(el,p){
    p=Object.assign({exp:5,mant:6,bits:'0100001000 00'.replace(/ /g,''),quiz:false},p);
    let bits=p.bits.padEnd(1+p.exp+p.mant,'0').split('').map(Number);
    const bias=Math.pow(2,p.exp-1)-1;
    const draw=()=>{
      const s=bits[0], e=parseInt(bits.slice(1,1+p.exp).join(''),2), m=parseInt(bits.slice(1+p.exp).join(''),2)/Math.pow(2,p.mant);
      const val=(s?-1:1)*(1+m)*Math.pow(2,e-bias);
      const btn=(b,i,c)=>`<button type="button" class="fbit ${c} b${b}" data-i="${i}" ${p.quiz?'disabled':''} aria-label="Bit ${i}">${b}</button>`;
      const group=(lbl,c,a,b)=>`<div class="fgroup"><div class="fbits">${bits.slice(a,b).map((x,i)=>btn(x,a+i,c)).join('')}</div><span class="flabel ${c}">${lbl}</span></div>`;
      el.innerHTML=`<div class="float-row">${group('sinal','fs',0,1)}${group(`expoente (bias ${bias})`,'fe',1,1+p.exp)}${group('mantissa','fm',1+p.exp,bits.length)}</div>
        <p class="vis-note">O <b>1,</b> antes da mantissa não é guardado (bit implícito). Valor = (±) 1,mantissa × 2<sup>expoente − bias</sup>.</p>
        ${p.quiz?'':`<div class="vis-eq mono">${s?'−':'+'} ${numBR(1+m,4)} × 2^(${e} − ${bias}) = <b>${numBR(val,4)}</b></div><p class="vis-note">Toque nos bits para mudar o número.</p>`}`;
      el.querySelectorAll('.fbit').forEach(b=>b.onclick=()=>{ const i=+b.dataset.i; bits[i]=bits[i]?0:1; draw(); });
    };
    draw();
  },
  // Chamadas de funcao: a pilha e o $ra a cada passo
  calls(el,p){
    p=Object.assign({chain:['main','A','B'],quiz:false},p);
    const chain=p.chain;
    const arrows=chain.map((c,i)=>`<span class="call-chip">${c}()</span>${i<chain.length-1?'<span class="call-arrow">chama →</span>':''}`).join('');
    if(p.quiz){
      el.innerHTML=`<div class="call-chain">${arrows}</div><p class="vis-note">Cada <b>jal</b> sobrescreve o <b>$ra</b>. Quem chama outra função depois de já ter sido chamada precisa guardar o próprio $ra antes; a última da fila só faz <b>jr $ra</b>.</p>`;
      return;
    }
    const steps=[{cap:`<b>${chain[0]}</b> está rodando. A pilha está vazia.`,ra:'—',stack:[],act:0}];
    let stack=[], ra='—';
    for(let i=1;i<chain.length;i++){
      ra=`volta p/ ${chain[i-1]}`;
      steps.push({cap:`<b>jal ${chain[i]}</b>: o $ra passa a guardar o endereço de volta para ${chain[i-1]}.`,ra,stack:stack.slice(),act:i});
      if(i<chain.length-1){
        stack=stack.concat([`$ra de ${chain[i]}: ${ra}`]);
        steps.push({cap:`${chain[i]} vai chamar outra função, então salva o $ra: <b>addi $sp,$sp,−4</b> e <b>sw $ra,0($sp)</b>. O $sp desce.`,ra,stack:stack.slice(),act:i});
      }
    }
    for(let i=chain.length-1;i>=1;i--){
      if(i<chain.length-1){
        const top=stack[stack.length-1];
        ra=top.split(': ')[1];
        stack=stack.slice(0,-1);
        steps.push({cap:`${chain[i]} recupera o $ra: <b>lw $ra,0($sp)</b> e <b>addi $sp,$sp,4</b>. O $sp sobe.`,ra,stack:stack.slice(),act:i});
      } else {
        steps.push({cap:`<b>${chain[i]}</b> não chama ninguém: não precisa mexer na pilha.`,ra,stack:stack.slice(),act:i});
      }
      steps.push({cap:`<b>jr $ra</b>: a execução volta para ${chain[i-1]}.`,ra,stack:stack.slice(),act:i-1});
    }
    let n=0;
    const draw=()=>{
      const s=steps[n];
      const chips=chain.map((c,i)=>`<span class="call-chip${i===s.act?' on':''}">${c}()</span>${i<chain.length-1?'<span class="call-arrow">→</span>':''}`).join('');
      const frames=s.stack.length?s.stack.slice().reverse().map((f,i)=>`<div class="frame${i===0?' top':''}">${i===0?'<small class="sp-mark mono">$sp →</small>':''}<span>${f}</span></div>`).join(''):'<div class="frame empty">pilha vazia</div>';
      el.innerHTML=`<div class="call-chain">${chips}</div>
        <div class="call-grid"><div><div class="vis-kicker">Registrador $ra</div><div class="ra-box mono">${s.ra}</div></div><div><div class="vis-kicker">Pilha (cresce para baixo)</div><div class="stack">${frames}</div></div></div>
        <p class="scene-cap">${s.cap}</p>
        <div class="scene-ctl"><button class="btn ghost small" type="button" data-p ${n===0?'disabled':''}>← Anterior</button><button class="btn small" type="button" data-n>${n===steps.length-1?'Ver de novo ↻':'Próximo passo →'}</button></div>`;
      el.querySelector('[data-p]').onclick=()=>{ if(n>0){ n--; draw(); } };
      el.querySelector('[data-n]').onclick=()=>{ n=(n+1)%steps.length; draw(); };
    };
    draw();
  },
  // Loop: linha escrita uma vez, executada varias
  loop(el,p){
    p=Object.assign({before:2,body:5,after:1,n:5,quiz:false},p);
    const draw=()=>{
      const sq=c=>`<i class="sq ${c}"></i>`;
      const laps=Math.min(p.n,12);
      const body=Array.from({length:laps},()=>`<span class="lap">${sq('b').repeat(p.body)}</span>`).join('');
      el.innerHTML=`<div class="loop-row"><div><div class="vis-kicker">Antes</div>${sq('a').repeat(p.before)}</div><div class="loop-body"><div class="vis-kicker">${p.hideVoltas?'Dentro do loop: quantas voltas?':`Dentro do loop, ${p.n} voltas`}</div><div class="laps">${body}${p.n>12?'<span class="mem-gap">…</span>':''}</div></div><div><div class="vis-kicker">Depois</div>${sq('c').repeat(p.after)}</div></div>
        <p class="vis-note">Cada quadradinho é uma instrução <b>executada</b>. A contagem dinâmica conta as execuções, não as linhas escritas.</p>
        ${p.quiz?'':`<div class="vis-eq mono">${p.before} + ${p.body} × ${p.n} + ${p.after} = <b>${p.before+p.body*p.n+p.after} instruções</b></div>
        <label class="vis-range">Voltas <input type="range" min="1" max="12" value="${p.n}"><b class="mono">${p.n}</b></label>`}`;
      const r=el.querySelector('input[type=range]');
      if(r) r.oninput=()=>{ p.n=+r.value; draw(); el.querySelector('input[type=range]').focus(); };
    };
    draw();
  },
  // As tres versoes do multiplicador, como na figura da prova (sem os tamanhos)
  mult(el){
    const V=[['Versão 1',['Multiplicando','Multiplicador','ULA','Produto']],['Versão 2',['Multiplicando','Multiplicador','ULA','Produto']],['Versão 3',['Multiplicando','ULA','Produto']]];
    el.innerHTML=`<div class="mult-grid">${V.map(v=>`<div class="mult-col"><div class="vis-kicker">${v[0]}</div>${v[1].map(b=>`<span class="mult-box${b==='ULA'?' alu':''}">${b}</span>`).join('')}</div>`).join('')}</div>
      <p class="vis-note">Na versão 1 o multiplicando anda para a esquerda. Nas versões 2 e 3 quem anda é o produto.</p>`;
  },
  // Registradores por funcao
  regs(el){
    const G=[['$a0–$a3','argumentos','entram na função'],['$v0–$v1','retorno','saem da função'],['$t0–$t9','temporários','a função pode estragar'],['$s0–$s7','salvos','a função precisa preservar'],['$ra','endereço de volta','o jal escreve aqui'],['$sp','topo da pilha','aponta para a pilha'],['HI / LO','mult e div','resultado de 64 bits']];
    el.innerHTML=`<div class="reg-grid">${G.map(g=>`<div class="reg-card"><b class="mono">${g[0]}</b><span>${g[1]}</span><small>${g[2]}</small></div>`).join('')}</div>`;
  },
  // Sequencia x paralelo
  paths(el){
    el.innerHTML=`<div class="path-grid">
      <div><div class="vis-kicker">Em sequência: soma</div><div class="path-line"><span>Mem. Dados</span><i>→</i><span>MUX</span></div><p class="vis-note">A saída de um é a entrada do outro.</p></div>
      <div><div class="vis-kicker">Em paralelo: usa o maior</div><div class="path-par"><span>Controle</span><span>Registradores</span></div><p class="vis-note">Começam juntos e se encontram depois.</p></div>
    </div>`;
  }
};
function mountWidget(name,el,params){ el.classList.add('vis-widget','vis-'+name); WIDGETS[name](el,params||{}); }

/* ---- Datapath com atrasos, para questoes de tempo ---- */
function addDelayBadges(root,times){
  const map={imem:times.imem,regs:times.regread,alu:times.alu,dmem:times.dmem,control:times.control,add4:times.adder,addbr:times.adder,muxMemReg:times.memtoreg};
  const NS='http://www.w3.org/2000/svg';
  Object.keys(map).forEach(k=>{
    if(!map[k]) return;
    const g=root.querySelector('#u-'+k); if(!g||!g.getBBox) return;
    const b=g.getBBox();
    const t=document.createElementNS(NS,'text');
    t.setAttribute('x',b.x+b.width/2); t.setAttribute('y',b.y-5);
    t.setAttribute('text-anchor','middle'); t.setAttribute('class','delay-badge');
    t.textContent=map[k]+' ns';
    g.appendChild(t);
  });
}

/* ---- Qual desenho combina com cada questao ---- */
function questionText(q){ return [q.question,q.statement].filter(Boolean).join(' ').replace(/<[^>]+>/g,' '); }

function parseCalls(t){
  const pairs=[...t.matchAll(/([\wÀ-ú]+)\(\)\s+chama\s+([\wÀ-ú]+)\(\)/g)];
  if(!pairs.length) return null;
  const chain=[pairs[0][1]];
  pairs.forEach(m=>{ if(!chain.includes(m[2])) chain.push(m[2]); });
  return chain;
}
function parseCounts(t){
  const m=[...t.matchAll(/(\d+)\s+([^(),]*?)\s*\(CPI\s*=\s*(\d+)\)/g)];
  if(m.length<2) return null;
  return m.map(x=>({n:x[2].replace(/^(instruções de|acessos à|de)\s*/i,'').trim()||'tipo',pct:+x[1],cpi:+x[3]}));
}
function parseAmdahl(t){
  const f=t.match(/Fm\s*=\s*(\d+(?:,\d+)?)/);
  const pct=t.match(/(\d+(?:,\d+)?)\s*%/);
  const sup=t.match(/SupFm\s*=\s*(\d+(?:,\d+)?)/)||t.match(/(\d+(?:,\d+)?)\s*vezes/);
  const fm=f?parseFloat(f[1].replace(',','.'))*100:pct?parseFloat(pct[1].replace(',','.')):null;
  const s=sup?parseFloat(sup[1].replace(',','.')):null;
  if(fm===null||!s||s<=1||fm>100) return null;
  return {fm,sup:s,after:/quando este|depois d|ap[oó]s o melh/i.test(t)};
}

// Devolve {mount(el), caption} ou null. Em modo quiz nunca mostra o resultado.
function visualForQuestion(q){
  if(q.mode===1||q.mode===4) return null; // ja sao desenho por natureza
  const w=(name,params,caption)=>({caption,mount:el=>mountWidget(name,el,Object.assign({quiz:true},params||{}))});
  // examImage: na prova esse tipo de questao vem com a figura do caminho de dados.
  const dp=(caption,after)=>({caption,examImage:true,mount:el=>{
    el.innerHTML=buildDatapathSVG();
    if(after) after(el);
  }});
  if(q.mode===2) return dp('Os blocos acendem conforme você liga os sinais.',el=>{ el.dataset.live='signals'; });
  if(q.mode===3) return dp('Tempo de cada bloco neste enunciado.',el=>{ if(q.times) addDelayBadges(el,q.times); });
  if(q.noVisual) return null;
  if(q.vis) return Object.assign(w(q.vis.name,q.vis.params,q.vis.caption),{examImage:!!q.vis.examImage});
  const t=questionText(q);
  const cat=q.category||'';
  if(q.sub==='prog'){
    const n=+((q.program&&q.program.title||'').match(/\d+/)||[5])[0];
    return w('loop',{n,before:3,body:5,after:1},'O corpo do loop se repete a cada volta.');
  }
  if(q.sub==='tbl') return dp('Pense em quais blocos esta instrução usa.');
  if(cat==='cla_somador'){
    const h=t.match(/\b([0-9A-F]{4})\s*\+\s*([0-9A-F]{4})\b/);
    return w('cla',h?{a:parseInt(h[1],16),b:parseInt(h[2],16)}:{a:0x92B9,b:0x7B3B},h?'Os dois números, bit a bit.':'Exemplo de soma, bit a bit.');
  }
  if(cat==='ieee754_custom'){
    const fmt=t.match(/(\d+)\s*(?:de\s*)?expoente\s*\+\s*(\d+)\s*(?:de\s*)?mantissa/i);
    const bits=t.match(/\b([01]) ([01]{3,}) ([01]{3,})\b/);
    const exp=bits?bits[2].length:fmt?+fmt[1]:5, mant=bits?bits[3].length:fmt?+fmt[2]:6;
    return w('float',{exp,mant,bits:bits?bits[1]+bits[2]+bits[3]:'0'.repeat(1+exp+mant)},'Onde cada bit mora no formato.');
  }
  if(cat==='amdahl_speedup'){
    const a=parseAmdahl(t);
    return w('amdahl',a||{},a?'A barra mostra a fração do enunciado.':'Exemplo: como a melhoria encolhe o tempo.');
  }
  if(/^cpi_|^loops_/.test(cat)||q.topic==='QProg'){
    const rows=parseCounts(t);
    if(rows) return w('cpi',{rows,unit:''},'Peso de cada tipo de instrução.');
    const m=t.match(/executa exatamente (\d+) vezes/);
    if(m||/loop|la[cç]o/i.test(t)) return w('loop',{n:m?+m[1]:5},'O corpo do loop se repete a cada volta.');
    return w('cpi',{},'Exemplo: peso de cada tipo de instrução.');
  }
  if(cat==='deslocamento_shift'||/\b(sll|sra|srl)\b/.test(t)) return {caption:'Experimente deslocar os bits.',mount:el=>mountWidget('shift',el)};
  if(cat==='enderecamento_vetor'||q.topic==='QISA'){
    const ix=t.match(/vet\[(\d+)\]/);
    const nth=t.match(/centésimo/i)?99:null;
    const last=t.match(/(\d+)\s+inteiros/);
    const index=ix?+ix[1]:nth!==null?nth:last?+last[1]-1:3;
    const targetName=ix?null:nth!==null?'centésimo':last?'último':null;
    const base=(t.match(/\$[st]\d/)||['$s1'])[0];
    return w('mem',{index,base,targetName},'O vetor na memória.');
  }
  if(cat==='pilha_funcoes_p2'||cat==='jal_jr_pilha'||q.topic==='QStack'){
    return w('calls',{chain:parseCalls(t)||['main','A','B']},'Quem chama quem.');
  }
  if(cat==='registradores_funcoes') return w('regs',{},'Para que serve cada grupo de registradores.');
  if(cat==='sequencia_paralelismo') return w('paths',{},'Quando somar e quando usar o maior.');
  if(q.times) return dp('Tempo de cada bloco neste enunciado.',el=>addDelayBadges(el,q.times));
  if(/^(datapath_tempo|slt|sinais_controle)$/.test(cat)||/^(Q2|Q3a|Q3b|QTimeExt|QDatapath|QSlt|QControlExt)$/.test(q.topic||'')) return dp('O caminho de dados completo.');
  return null;
}

/* ---- Modulos novos da pagina Conteudo ---- */
const VISUAL_LESSONS = [
  {id:'dentro',exam:'p3',first:true,title:'Por dentro do processador',desc:'Assista a um lw ler a memória, passo a passo.',slides:[
    {t:'visual',scene:'lw',h:'Lendo a memória',p:'Quem manda é o <b>processador</b>, mas o dado mora <b>fora</b> dele, na memória. Dentro do processador ficam o PC, o Controle, os registradores e a ULA.'},
    {t:'visual',scene:'sw',h:'Escrevendo na memória',p:'O caminho de ida é o mesmo do lw. A diferença é que o dado vai para a memória em vez de voltar.'},
    {t:'visual',scene:'add',h:'Uma conta comum',p:'No tipo-R o trabalho inteiro acontece dentro do processador.'},
    {t:'visual',scene:'beq',h:'Um desvio',p:'O beq não escreve em lugar nenhum: ele só decide o próximo valor do PC.'}
  ]},
  {id:'v_cla',exam:'p1',title:'CLA: vai-um antecipado',desc:'Veja G e P coluna por coluna.',slides:[
    {t:'visual',widget:'cla',h:'Gera ou propaga?',p:'Em vez de esperar o vai-um andar bit a bit, o CLA olha cada coluna e descobre de antemão o que vai acontecer.'}
  ]},
  {id:'v_float',exam:'p1',title:'Ponto flutuante',desc:'Toque nos bits e veja o número mudar.',slides:[
    {t:'visual',widget:'float',h:'Sinal, expoente e mantissa',p:'Mais bits no expoente dão mais alcance. Mais bits na mantissa dão mais precisão.'}
  ]},
  {id:'v_amdahl',exam:'p1',title:'Lei de Amdahl',desc:'A parte que não melhora segura o ganho.',slides:[
    {t:'visual',widget:'amdahl',h:'Só uma parte fica mais rápida',p:'Mexa nos controles. Com fração de 50%, nem uma melhoria infinita passa de 2 vezes.'}
  ]},
  {id:'v_cpi',exam:'p1',title:'CPI médio',desc:'Quanto cada tipo de instrução pesa.',slides:[
    {t:'visual',widget:'cpi',h:'Média ponderada de ciclos',p:'Aumente e diminua os ciclos e veja a barra e o MIPS mudarem.'}
  ]},
  {id:'v_mem',exam:'p2',title:'Vetores na memória',desc:'Como o índice vira deslocamento.',slides:[
    {t:'visual',widget:'mem',h:'Índice × tamanho',p:'Arraste o índice. O número dentro do lw é a distância em bytes até a base.'}
  ]},
  {id:'v_shift',exam:'p2',title:'Deslocamento de bits',desc:'sll, srl e sra na prática.',slides:[
    {t:'visual',widget:'shift',h:'Os bits andam',p:'A diferença entre srl e sra só aparece em número negativo. Teste as duas com o sinal trocado.'}
  ]},
  {id:'v_calls',exam:'p2',title:'Pilha em chamadas',desc:'jal, $ra e $sp a cada passo.',slides:[
    {t:'visual',widget:'calls',params:{chain:['main','A','B','C']},h:'Por que salvar o $ra',p:'Cada jal apaga o $ra anterior. Acompanhe quem precisa guardar o valor na pilha.'}
  ]},
  {id:'v_loop',exam:'p2',title:'Contagem dinâmica',desc:'Linhas escritas e instruções executadas.',slides:[
    {t:'visual',widget:'loop',h:'O loop multiplica',p:'Essa contagem é o primeiro passo para achar o CPI médio de um programa.'}
  ]}
];

/* ---- Miniaturas dos cards de conteudo ---- */
const LESSON_THUMBS = {
  dentro:'<rect x="4" y="8" width="42" height="44" rx="3"/><rect x="11" y="16" width="14" height="10"/><rect x="11" y="33" width="28" height="11"/><path d="M46 30h14"/><rect x="60" y="8" width="16" height="44" rx="2"/><path d="M60 19h16M60 30h16M60 41h16"/>',
  unidades:'<rect x="6" y="20" width="14" height="20"/><rect x="28" y="12" width="20" height="36"/><path d="M20 30h8M48 30h8"/><path d="M56 16l18 8v12l-18 8v-10l5-4-5-4z"/>',
  sinais:'<path d="M8 16h34M8 30h34M8 44h34"/><circle cx="52" cy="16" r="5"/><circle cx="60" cy="30" r="5"/><circle cx="52" cy="44" r="5"/>',
  caminho:'<circle cx="10" cy="44" r="4"/><path d="M14 44h18V18h18v18h16"/><path d="M60 30l6 6-6 6"/>',
  tempos:'<circle cx="40" cy="30" r="22"/><path d="M40 16v14l10 6"/>',
  pipeline:'<rect x="4" y="22" width="13" height="16"/><rect x="19" y="22" width="13" height="16"/><rect x="34" y="22" width="13" height="16"/><rect x="49" y="22" width="13" height="16"/><rect x="64" y="22" width="12" height="16"/>',
  v_cla:'<path d="M8 14h64M8 26h64"/><path d="M16 36v14M30 36v14M44 36v14M58 36v14"/><path d="M58 50H16"/>',
  v_float:'<rect x="4" y="22" width="10" height="16"/><rect x="16" y="22" width="24" height="16"/><rect x="42" y="22" width="34" height="16"/>',
  v_amdahl:'<rect x="6" y="14" width="68" height="12"/><path d="M34 14v12"/><rect x="6" y="34" width="10" height="12"/><rect x="16" y="34" width="40" height="12"/>',
  v_cpi:'<rect x="6" y="22" width="24" height="16"/><rect x="30" y="22" width="12" height="16"/><rect x="42" y="22" width="26" height="16"/><rect x="68" y="22" width="6" height="16"/>',
  v_mem:'<rect x="6" y="20" width="14" height="20"/><rect x="20" y="20" width="14" height="20"/><rect x="34" y="20" width="14" height="20"/><rect x="48" y="20" width="14" height="20"/><path d="M41 52v-10M36 47l5-5 5 5"/>',
  v_shift:'<rect x="6" y="24" width="12" height="14"/><rect x="18" y="24" width="12" height="14"/><rect x="30" y="24" width="12" height="14"/><rect x="42" y="24" width="12" height="14"/><path d="M60 14H20M26 8l-6 6 6 6"/>',
  v_calls:'<rect x="22" y="10" width="36" height="11"/><rect x="22" y="24" width="36" height="11"/><rect x="22" y="38" width="36" height="11"/><path d="M8 44V16M3 21l5-5 5 5"/>',
  v_loop:'<path d="M18 18h40a12 12 0 0 1 0 24H18a12 12 0 0 1 0-24z"/><path d="M26 12l-8 6 8 6"/>'
};
function lessonThumb(id){ return `<svg class="thumb" viewBox="0 0 80 60" aria-hidden="true">${LESSON_THUMBS[id]||LESSON_THUMBS.unidades}</svg>`; }

/* ---- Quais blocos acendem com cada sinal (questao de controle) ---- */
const SIGNAL_UNITS = {RegDst:['muxRegDst'],ALUSrc:['muxAluSrc','signext'],MemToReg:['muxMemReg'],MemtoReg:['muxMemReg'],RegWrite:['regs'],MemRead:['dmem'],MemWrite:['dmem'],Branch:['muxPcSrc','addbr'],ALUOp:['alu']};
