/* ===========================================================================
   CONTEUDO — geradores.js
   Questoes da Prova 1 e da Prova 2 com valores sorteados: mesmo tema e mesma
   pegadinha da prova, numeros diferentes a cada rodada. As alternativas
   erradas vem dos erros de raciocinio comuns, nao de numeros aleatorios.
   Nada aqui roda no carregamento: so define funcoes.
   =========================================================================== */

/* ---- Contas (separadas para o teste conferir com o gabarito da prova) ---- */
const CONTA = {
  amdahl:(f,k)=>1/((1-f)+f/k),
  amdahlDepois:(f,k)=>(1-f)+f*k,            // fracao medida com a melhoria ligada
  fracaoParaTempo:(k,t)=>(1-t)/(1-1/k),     // que fracao melhorar para o tempo virar t
  trocaJusta:(k,f,p,c)=>CONTA.amdahl(f,k)/((1-1/c)+p/c),
  cpi:rows=>rows.reduce((a,x)=>a+x.pct*x.cpi,0)/rows.reduce((a,x)=>a+x.pct,0),
  // Compilador muda a QUANTIDADE de instrucoes: as porcentagens mudam junto.
  compilador(rows,corteUla,aumentoMem){
    const novas=rows.map((x,i)=>Object.assign({},x,{pct:x.pct*(i===0?1-corteUla:i===2?1+aumentoMem:1)}));
    const ciclos=l=>l.reduce((a,x)=>a+x.pct*x.cpi,0);
    return {cpi:CONTA.cpi(novas),speedup:ciclos(rows)/ciclos(novas),ciclosPor100:ciclos(novas)/100};
  },
  tempoUs:(n,cpi,mhz)=>n*cpi/mhz,
  mips:(mhz,cpi)=>mhz/cpi
};

/* ---- Ajudantes ---- */
const gNum=(v,d)=>Number(v).toFixed(d===undefined?2:d).replace('.',',');
const gHex=(n,d)=>n.toString(16).toUpperCase().padStart(d||4,'0');
// Sem arredondar: valor binario exato, para o enunciado nao mentir.
const gExato=v=>{ const t=String(v).replace('.',','); return t.includes(',')?t:t+',0'; };
const gMono=s=>`<span class="mono">${s}</span>`;

// Monta a questao de marcar. Como na prova, NDA fica por ultimo e as vezes e a certa.
function gMC(meta,cfg){
  const r=cfg.r||Math.random;
  const wrongs=[...new Set(cfg.wrongs.map(String))].filter(w=>w!==String(cfg.right));
  const usaNda=cfg.nda!==false;
  const picked=reviewShuffle(wrongs).slice(0,usaNda?4:3);
  let options, correct, explain=cfg.explain;
  if(usaNda && picked.length>=3 && r()<0.15){
    options=[...picked,'NDA'];
    correct=options.length-1;
    explain=`A conta dá <b>${cfg.right}</b>, que não está nas alternativas: marque NDA. ${cfg.explain}`;
  } else {
    options=reviewShuffle([String(cfg.right),...picked]);
    correct=options.indexOf(String(cfg.right));
    if(usaNda) options.push('NDA');
  }
  const q=reviewMC(Object.assign({errorType:meta.category,diff:'med'},meta),cfg.q,options,correct,explain);
  q.procedural=true;
  if(cfg.vis) q.vis=cfg.vis;
  if(cfg.noVisual) q.noVisual=true;
  return q;
}
const P1=(sub,rule,extra)=>Object.assign({id:'gen_p1_'+sub,subtopic:sub,quickRule:rule},extra);
const P2=(sub,rule,extra)=>Object.assign({id:'gen_p2_'+sub,subtopic:sub,quickRule:rule},extra);

/* ---- Maquina load-store sorteada, como a tabela da prova ---- */
function gMaquina(r){
  const ula=rngPick([30,35,40,45,50],r), des=rngPick([15,20,25],r), mem=rngPick([15,20,25,30],r);
  const rows=[
    {n:'ULA',pct:ula,cpi:rngInt(4,10,r)},
    {n:'Desvios',pct:des,cpi:rngInt(3,8,r)},
    {n:'Memória',pct:mem,cpi:rngInt(6,12,r)},
    {n:'Outras',pct:100-ula-des-mem,cpi:rngInt(6,14,r)}
  ];
  const freq=rngPick([100,200,250,400,500],r);
  const tabela=`<table class="program-table"><tr><th>Tipo da instrução</th><th>% inst.</th><th>CPI</th></tr>${rows.map(x=>`<tr><td>${x.n}</td><td>${x.pct}%</td><td>${x.cpi}</td></tr>`).join('')}</table>`;
  return {rows,freq,intro:`Máquina load-store a <b>${freq} MHz</b>:${tabela}`,
    vis:{name:'cpi',params:{rows:rows.map(x=>Object.assign({},x))},caption:'Peso de cada tipo de instrução nos ciclos.'}};
}
const metaCpiP1=(sub,rule)=>P1(sub,rule,{category:'cpi_desempenho_p1',errorType:'CPI médio',topic:'QCpiP1'});
const metaAmd=(sub,rule)=>P1(sub,rule,{category:'amdahl_speedup',errorType:'Amdahl',topic:'QAmdahl'});
const metaCla=(sub,rule)=>P1(sub,rule,{category:'cla_somador',errorType:'CLA',topic:'QCla'});
const metaFloat=(sub,rule)=>P1(sub,rule,{category:'ieee754_custom',errorType:'ponto flutuante',topic:'QFloat'});

/* ---- PROVA 1 ---- */
const GEN_P1 = [
  function claSoma(r){
    const a=rngInt(0x1000,0xFFFF,r), b=rngInt(0x1000,0xFFFF,r);
    const g=a&b, p=a|b, x=a^b, soma=a+b, sai=soma>0xFFFF;
    const op=(v,pp,gg)=>`${v?'Sim':'Não'} haverá vai-um para fora, propagador=${gHex(pp)} e gerador=${gHex(gg)}`;
    return gMC(metaCla('soma com CLA','G = A AND B, P = A OR B. Há vai-um para fora quando a soma passa de FFFF.'),{r,
      q:`Considere o CLA e a soma em hexadecimal <span class="mono">${gHex(a)} + ${gHex(b)}</span>. Haverá vai-um para fora? Quais os valores do propagador e do gerador?`,
      right:op(sai,p,g),
      wrongs:[op(!sai,p,g),op(sai,g,p),op(sai,x,g),op(!sai,x,g),op(sai,p,x)],
      explain:`G = A AND B = ${gHex(g)}. P = A OR B = ${gHex(p)}. A soma dá ${gHex(soma,sai?5:4)}, então ${sai?'sobra':'não sobra'} vai-um para fora dos 16 bits.`,
      vis:{name:'cla',params:{a,b},caption:'Os dois números, bit a bit.'}});
  },
  function overflowPorta(r){
    const n=rngPick([4,8,16,32],r);
    return gMC(metaCla('overflow','Overflow = XOR entre o vai-um que entra e o que sai do bit de sinal.'),{r,noVisual:true,
      q:`Para um somador de <b>${n} bits</b> em complemento de dois, o overflow pode ser identificado colocando qual porta lógica entre o vai-um que entra no bit de sinal e o que sai para fora do número?`,
      right:'xor',wrongs:['nand','nor','nxor','and','or','not'],
      explain:'Há overflow quando os dois vai-uns são diferentes, e é exatamente isso que o XOR detecta.'});
  },
  function overflowConta(r){
    const a=rngInt(-8,7,r), b=rngInt(-8,7,r), s=a+b;
    const ov=s<-8||s>7, st=((s+8)%16+16)%16-8;
    const bin=v=>((v+16)%16).toString(2).padStart(4,'0');
    const op=(v,o)=>`${v}, ${o?'com':'sem'} overflow`;
    return gMC(metaCla('overflow numérico','Só dá overflow somando dois números de mesmo sinal, quando o resultado troca de sinal.'),{r,nda:false,noVisual:true,
      q:`Em 4 bits com complemento de dois, some <span class="mono">${bin(a)}</span> (${a}) com <span class="mono">${bin(b)}</span> (${b}). Qual valor fica guardado no resultado?`,
      right:op(st,ov),wrongs:[op(st,!ov),op(s,!ov),op(st+1,ov),op(st-1,ov),op(-st,ov)].filter(w=>w!==op(st,ov)),
      explain:`A conta real dá ${s}. Em 4 bits cabem só valores de −8 a 7, então ${ov?`não cabe: fica ${bin(st)} = ${st}, com overflow`:`cabe, sem overflow`}.`});
  },
  function multiplicadorUla(r){
    const n=rngPick([8,16,32,64],r), v=rngInt(1,3,r), bits=v===1?2*n:n;
    return gMC(metaCla('multiplicador','Versão 1: ULA de 2N bits. Versões 2 e 3: ULA de N bits.'),{r,
      q:`Nos algoritmos de multiplicação vistos em sala, para operandos de <b>${n} bits</b>, qual o tamanho da ULA na <b>versão ${v}</b>?`,
      right:bits+' bits',wrongs:[n+' bits',2*n+' bits',4*n+' bits',n/2+' bits',(n+1)+' bits'],
      explain:`Na versão 1 o multiplicando anda para a esquerda, então a ULA precisa de ${2*n} bits. Nas versões 2 e 3 quem anda é o produto, e a ULA fica com ${n} bits.`,
      vis:{name:'mult',params:{},caption:'As três arquiteturas, como na figura da prova.',examImage:true}});
  },
  function multiplicadorRegs(r){
    const v=rngInt(1,3,r), q=v===3?2:3;
    return gMC(metaCla('multiplicador','A versão 3 guarda o multiplicador dentro do próprio registrador de produto.'),{r,
      q:`Quantos registradores principais a <b>versão ${v}</b> do multiplicador usa?`,
      right:String(q),wrongs:['1','2','3','4','5'],
      explain:'As versões 1 e 2 têm Multiplicando, Multiplicador e Produto. A versão 3 aproveita a metade do Produto para guardar o Multiplicador, então fica com dois.',
      vis:{name:'mult',params:{},caption:'As três arquiteturas, como na figura da prova.',examImage:true}});
  },
  function amdahlMetaTempo(r){
    const k=rngPick([2.5,3,4,5,8,10],r);
    const [t,txt]=rngPick([[.5,'a metade'],[.75,'três quartos'],[.8,'80%'],[.6,'60%']],r);
    const f=CONTA.fracaoParaTempo(k,t);
    const pct=v=>gNum(v*100,1)+'%';
    return gMC(metaAmd('fração para meta de tempo','Monte tempo novo = (1−f) + f/k e isole o f.'),{r,
      q:`Um novo processador é <b>${gNum(k,1)} vezes</b> mais rápido só nas operações aritméticas e lógicas. Qual deveria ser a porcentagem dessas operações para o tempo de execução cair para exatamente <b>${txt}</b> do original?`,
      right:pct(f),wrongs:[pct(1-t),pct(t),pct((1-t)*k/(k+1)),pct(Math.min(.99,f+.1)),pct(f-.05)],
      explain:`${gNum(t,2)} = (1−f) + f/${gNum(k,1)}. Isolando: f = ${gNum(1-t,2)} ÷ ${gNum(1-1/k,3)} = ${pct(f)}.`,
      vis:{name:'amdahl',params:{fm:Math.round(f*100),sup:k},caption:'A barra mostra o tempo antes e depois.'}});
  },
  function amdahlDepois(r){
    const k=rngPick([2,3,4,5,6,8,10],r), f=rngPick([.3,.4,.5,.6,.7,.75,.8],r);
    const res=CONTA.amdahlDepois(f,k);
    return gMC(metaAmd('fração medida depois','Se a fração foi medida COM a melhoria: speedup = (1−f) + f×k.'),{r,
      q:`Um processador B é <b>${k} vezes</b> mais rápido só em certas operações. Essas operações correspondem a <b>${Math.round(f*100)}%</b> do tempo total executado <b>quando este novo processador B está sendo utilizado</b>. Qual o speedup total?`,
      right:gNum(res),wrongs:[gNum(CONTA.amdahl(f,k)),gNum(k),gNum(f*k),gNum(res+.5),gNum(1/(1-f))],
      explain:`Pegadinha: o ${Math.round(f*100)}% é do tempo NOVO. Tempo antigo = (1−f) + f×k = ${gNum(1-f)} + ${gNum(f*k)} = ${gNum(res)}, sobre o tempo novo igual a 1. Usar a fórmula comum daria ${gNum(CONTA.amdahl(f,k))}.`,
      vis:{name:'amdahl',params:{fm:Math.round(f*100),sup:k,after:true},caption:'A fração aqui foi medida depois da melhoria.'}});
  },
  function amdahlComum(r){
    const k=rngPick([2,3,4,5,8,10,20],r), f=rngPick([.1,.2,.25,.4,.5,.6,.75,.9],r);
    const res=CONTA.amdahl(f,k);
    return gMC(metaAmd('speedup de Amdahl','Speedup = 1 ÷ ((1−f) + f/k).'),{r,
      q:`Uma melhoria deixa <b>${Math.round(f*100)}%</b> do tempo de execução original <b>${k} vezes</b> mais rápido. Qual o speedup total?`,
      right:gNum(res),wrongs:[gNum(CONTA.amdahlDepois(f,k)),gNum(k),gNum(f*k),gNum(1/(1-f)),gNum(res+.3)],
      explain:`Tempo novo = ${gNum(1-f)} + ${gNum(f)}/${k} = ${gNum(1/res,3)}. Speedup = 1 ÷ ${gNum(1/res,3)} = ${gNum(res)}.`,
      vis:{name:'amdahl',params:{fm:Math.round(f*100),sup:k},caption:'A fração do enunciado, antes e depois.'}});
  },
  function amdahlLimite(r){
    const f=rngPick([.2,.4,.5,.6,.75,.8,.9],r);
    return gMC(metaAmd('limite do speedup','Com melhoria infinita, o speedup máximo é 1 ÷ (1−f).'),{r,
      q:`Uma parte que ocupa <b>${Math.round(f*100)}%</b> do tempo será melhorada. Mesmo que essa parte fique <b>infinitamente</b> mais rápida, qual o maior speedup possível?`,
      right:gNum(1/(1-f)),wrongs:[gNum(1/f),'Infinito',gNum(1+f),gNum(f*10),gNum(1/(1-f)+1)],
      explain:`A parte que não melhora continua lá: sobra ${gNum(1-f)} do tempo. Speedup máximo = 1 ÷ ${gNum(1-f)} = ${gNum(1/(1-f))}.`,
      vis:{name:'amdahl',params:{fm:Math.round(f*100),sup:20},caption:'Repare no trecho que nunca encolhe.'}});
  },
  function trocaJusta(r){
    const k=rngPick([2,3,4,5,6],r), f=rngPick([.3,.5,.6,.8],r), p=rngPick([2,3,4,5],r), c=rngPick([2,3,4,5],r);
    const res=CONTA.trocaJusta(k,f,p,c), ganho=CONTA.amdahl(f,k), custo=(1-1/c)+p/c;
    return gMC(metaAmd('troca justa','Ganho = Amdahl. Custo = (1 − 1/c) + p/c. A troca é justa se ganho ÷ custo > 1.'),{r,
      q:`Um novo processador é <b>${k} vezes</b> mais rápido e será usado <b>${Math.round(f*100)}%</b> do tempo. O preço dele é <b>${p} vezes</b> o do anterior, e um processador corresponde a <b>1/${c}</b> do preço da máquina. Qual o resultado de (quanto ficou mais rápido) ÷ (quanto ficou mais caro)?`,
      right:gNum(res),wrongs:[gNum(k/p),gNum(ganho/p),gNum(ganho),gNum(custo/ganho),gNum(k/custo)],
      explain:`Ganho = ${gNum(ganho)}. Custo = ${gNum(1-1/c)} + ${p}/${c} = ${gNum(custo)}. Razão = ${gNum(res)}: a troca ${res>1?'é':'não é'} justa. O preço pesa só 1/${c} da máquina, não ela inteira.`,
      vis:{name:'amdahl',params:{fm:Math.round(f*100),sup:k},caption:'Primeiro calcule o ganho de velocidade.'}});
  },
  function duasPropostas(r){
    const f1=rngPick([.1,.2,.25],r), k1=rngPick([8,10,20],r), f2=rngPick([.4,.5,.6],r), k2=rngPick([2,3],r);
    const s1=CONTA.amdahl(f1,k1), s2=CONTA.amdahl(f2,k2);
    if(Math.abs(s1-s2)<.02) return GEN_P1[7](r);
    const op=(n,s)=>`Proposta ${n}, com speedup ${gNum(s)}`;
    return gMC(metaAmd('comparar propostas','Vale mais melhorar pouco o que acontece muito do que melhorar muito o que acontece pouco.'),{r,
      q:`<b>Proposta 1:</b> acelerar ${k1} vezes uma operação que ocupa ${Math.round(f1*100)}% do tempo. <b>Proposta 2:</b> acelerar ${k2} vezes operações que ocupam ${Math.round(f2*100)}% do tempo. Qual é melhor?`,
      right:s1>s2?op(1,s1):op(2,s2),wrongs:[s1>s2?op(2,s2):op(1,s1),s1>s2?op(2,s1):op(1,s2),op(1,k1),op(2,k2)],
      explain:`Proposta 1: ${gNum(s1)}. Proposta 2: ${gNum(s2)}. O tamanho da melhoria sozinho não decide.`});
  },
  function frequenciaB(r){
    const t=rngPick([5,10,20],r), fa=rngPick([200,400,500],r), s=rngPick([1.5,2,2.5],r), c=rngPick([1.2,1.5,2],r);
    const fb=fa*s*c;
    const mhz=v=>gNum(v,0)+' MHz';
    return gMC(metaCpiP1('frequência necessária','Tempo = ciclos ÷ frequência. Mais ciclos e menos tempo pedem mais frequência.'),{r,noVisual:true,
      q:`Um programa roda em ${t} s na máquina A (${fa} MHz). Queremos speedup de <b>${gNum(s,1)}</b> numa máquina B, que precisa de <b>${gNum(c,1)} vezes mais ciclos</b>. Qual a frequência de B?`,
      right:mhz(fb),wrongs:[mhz(fa*s),mhz(fa*s/c),mhz(fa*c),mhz(fa*c/s),mhz(fb*1.5)],
      explain:`B precisa fazer ${gNum(c,1)} vezes mais ciclos em ${gNum(1/s,3)} do tempo: ${fa} × ${gNum(s,1)} × ${gNum(c,1)} = ${mhz(fb)}.`});
  },
  function cpiMedio(r){
    const m=gMaquina(r), res=CONTA.cpi(m.rows);
    const media=m.rows.reduce((a,x)=>a+x.cpi,0)/m.rows.length;
    return gMC(metaCpiP1('CPI médio','CPI médio = soma de (fração × CPI) de cada tipo.'),{r,vis:m.vis,
      q:`${m.intro}Qual o CPI médio desta máquina?`,
      right:gNum(res),wrongs:[gNum(media),gNum(res+.5),gNum(res-.5),gNum(Math.max(...m.rows.map(x=>x.cpi))),gNum(res*2)],
      explain:`${m.rows.map(x=>`${gNum(x.pct/100)}×${x.cpi}`).join(' + ')} = ${gNum(res)}. A média simples dos CPIs daria ${gNum(media)}, mas ignora a frequência de cada tipo.`});
  },
  function hardwareSpeedup(r){
    const m=gMaquina(r), a=rngInt(1,3,r), b=rngInt(1,2,r), antigo=CONTA.cpi(m.rows);
    const novos=m.rows.map((x,i)=>Object.assign({},x,{cpi:x.cpi+(i===0?-a:i===2?b:0)})), novo=CONTA.cpi(novos);
    const soUla=CONTA.cpi(m.rows.map((x,i)=>Object.assign({},x,{cpi:x.cpi-(i===0?a:0)})));
    return gMC(metaCpiP1('speedup por hardware','Calcule o CPI novo e faça CPI antigo ÷ CPI novo.'),{r,vis:m.vis,
      q:`${m.intro}Uma melhoria reduz em <b>${a} ciclo(s)</b> as operações com a ULA, mas aumenta em <b>${b} ciclo(s)</b> as de memória. Qual o speedup sobre a máquina original?`,
      right:gNum(antigo/novo),wrongs:[gNum(novo/antigo),gNum(antigo/soUla),gNum(antigo-novo),gNum(antigo/novo+.2),gNum(m.rows[0].cpi/(m.rows[0].cpi-a))],
      explain:`CPI antigo = ${gNum(antigo)}. CPI novo = ${gNum(novo)}. Speedup = ${gNum(antigo)} ÷ ${gNum(novo)} = ${gNum(antigo/novo)}. O aumento na memória não pode ficar de fora.`});
  },
  function compiladorCpi(r){
    const m=gMaquina(r), corte=rngPick([.3,.5,.7],r), mais=rngPick([.1,.2,.3],r), c=CONTA.compilador(m.rows,corte,mais);
    return gMC(metaCpiP1('compilador muda o CPI','Se a quantidade de instruções muda, as porcentagens mudam: divida pelo novo total.'),{r,vis:m.vis,
      q:`${m.intro}Um novo compilador reduz a <b>quantidade</b> de operações com a ULA em ${Math.round(corte*100)}% e aumenta a de memória em ${Math.round(mais*100)}%. Qual o novo CPI médio?`,
      right:gNum(c.cpi),wrongs:[gNum(c.ciclosPor100),gNum(CONTA.cpi(m.rows)),gNum(c.cpi+.4),gNum(c.cpi-.4),gNum(CONTA.cpi(m.rows)*(1-corte))],
      explain:`Pegadinha: o total de instruções mudou. Ciclos a cada 100 instruções antigas = ${gNum(c.ciclosPor100*100,0)}, e sobram ${gNum(m.rows.reduce((a,x,i)=>a+x.pct*(i===0?1-corte:i===2?1+mais:1),0),1)} instruções. CPI = ${gNum(c.cpi)}. Sem dividir pelo novo total daria ${gNum(c.ciclosPor100)}.`});
  },
  function compiladorSpeedup(r){
    const m=gMaquina(r), corte=rngPick([.3,.5,.7],r), mais=rngPick([.1,.2,.3],r), c=CONTA.compilador(m.rows,corte,mais), antigo=CONTA.cpi(m.rows);
    return gMC(metaCpiP1('compilador e speedup','Compare os ciclos totais, não só os CPIs: a quantidade de instruções mudou.'),{r,vis:m.vis,
      q:`${m.intro}Um compilador reduz a quantidade de operações com a ULA em ${Math.round(corte*100)}% e aumenta a de memória em ${Math.round(mais*100)}%. Qual o speedup?`,
      right:gNum(c.speedup),wrongs:[gNum(antigo/c.cpi),gNum(1/c.speedup),gNum(c.speedup+.3),gNum(1+corte),'Não há speedup'],
      explain:`Ciclos a cada 100 instruções antigas: ${gNum(antigo*100,0)} antes e ${gNum(c.ciclosPor100*100,0)} depois. Speedup = ${gNum(c.speedup)}. Comparar só os CPIs daria ${gNum(antigo/c.cpi)}, o que está errado aqui.`});
  },
  function tempoBenchmark(r){
    const m=gMaquina(r), n=rngPick([1000,5000,10000,20000],r), cpi=CONTA.cpi(m.rows), t=CONTA.tempoUs(n,cpi,m.freq);
    const us=v=>gNum(v,1)+' µs';
    return gMC(metaCpiP1('tempo do benchmark','Tempo = instruções × CPI ÷ frequência. MHz é ciclo por µs.'),{r,vis:m.vis,
      q:`${m.intro}Um benchmark tem <b>${n.toLocaleString('pt-BR')} instruções</b>. Quanto tempo ele demora?`,
      right:us(t),wrongs:[us(n/m.freq),us(n*cpi/m.freq/10),us(t*2),us(n*m.freq/cpi/1000),us(t+100)],
      explain:`${n.toLocaleString('pt-BR')} × ${gNum(cpi)} ÷ ${m.freq} MHz = ${us(t)}.`});
  },
  function mipsMaquina(r){
    const m=gMaquina(r), cpi=CONTA.cpi(m.rows), res=CONTA.mips(m.freq,cpi);
    return gMC(metaCpiP1('velocidade em MIPS','MIPS = frequência em MHz ÷ CPI médio.'),{r,vis:m.vis,
      q:`${m.intro}Qual a velocidade em MIPS desta máquina?`,
      right:gNum(res,1),wrongs:[gNum(m.freq,1),gNum(cpi,1),gNum(m.freq*cpi,1),gNum(res*2,1),gNum(res/2,1)],
      explain:`MIPS = ${m.freq} ÷ ${gNum(cpi)} = ${gNum(res,1)}.`});
  },
  function floatCodifica(r){
    const eb=rngPick([4,5,6],r), mb=rngPick([4,5,6],r), bias=Math.pow(2,eb-1)-1;
    const sinal=rngInt(0,1,r), e=rngInt(0,3,r), mant=rngInt(0,Math.pow(2,mb)-1,r)&~1;
    const val=(sinal?-1:1)*(1+mant/Math.pow(2,mb))*Math.pow(2,e);
    const bin=(v,n)=>v.toString(2).padStart(n,'0');
    const fmt=(s,ex,m)=>`${s} ${bin(ex,eb)} ${bin(m,mb)}`;
    return gMC(metaFloat('codificar número','Normalize em 1,xxx × 2^e. Guarde e + bias, sem o 1 antes da vírgula.'),{r,
      q:`Qual a representação de <b>${gExato(val)}</b> no formato 1 sinal + ${eb} expoente + ${mb} mantissa (bias ${bias})?`,
      right:fmt(sinal,e+bias,mant),wrongs:[fmt(sinal?0:1,e+bias,mant),fmt(sinal,e,mant),fmt(sinal,e+bias+1,mant),fmt(sinal,bias,mant),fmt(sinal,e+bias,(mant>>1)|(1<<(mb-1)))],
      explain:`Sinal ${sinal}. ${gExato(Math.abs(val))} = ${gExato(1+mant/Math.pow(2,mb))} × 2^${e}. Expoente guardado = ${e} + ${bias} = ${e+bias}. A mantissa guarda só o que vem depois da vírgula.`,
      vis:{name:'float',params:{exp:eb,mant:mb,bits:'0'.repeat(1+eb+mb)},caption:'Onde cada campo fica no formato.'}});
  },
  function floatBias(r){
    const eb=rngPick([3,4,5,6,7,8,11],r), bias=Math.pow(2,eb-1)-1;
    return gMC(metaFloat('bias','Bias = 2^(bits do expoente − 1) − 1.'),{r,
      q:`Em um formato de ponto flutuante com <b>${eb} bits de expoente</b>, qual o valor do bias?`,
      right:String(bias),wrongs:[String(bias+1),String(2*bias+1),String(eb),String(bias-1),String(Math.pow(2,eb))],
      explain:`2^(${eb}−1) − 1 = ${bias}. O expoente guardado é o real somado a esse valor.`,noVisual:true});
  }
];

/* ---- PROVA 2 ---- */
const metaAddr=(sub,rule)=>P2(sub,rule,{category:'enderecamento_vetor',errorType:'endereçamento',topic:'QAddr'});
const metaShift=(sub,rule)=>P2(sub,rule,{category:'deslocamento_shift',errorType:'shift',topic:'QShift'});
const metaCpiP2=(sub,rule)=>P2(sub,rule,{category:'cpi_desempenho_p2',errorType:'CPI médio',topic:'QCpiP2'});
const metaStack=(sub,rule)=>P2(sub,rule,{category:'pilha_funcoes_p2',errorType:'pilha',topic:'QStackP2'});
const gMem=(index,base,targetName,caption)=>({name:'mem',params:{index,base,targetName},caption:caption||'O vetor na memória.'});
const ORDINAIS=[[10,'décimo'],[20,'vigésimo'],[30,'trigésimo'],[40,'quadragésimo'],[50,'quinquagésimo'],[60,'sexagésimo'],[80,'octogésimo'],[100,'centésimo']];

// Programa com loop sorteado. O numero de voltas nao e dado: sai do contador.
function gPrograma(r){
  const voltas=rngPick([3,4,5,6,8,10,12,15,20],r), passo=rngPick([1,1,2,4],r), inicio=voltas*passo;
  const extraUla=rngInt(0,1,r), extraMem=rngInt(0,1,r);
  const antes=[`ori  $s0, $zero, ${inicio}   ; ULA`,`addi $s1, $zero, 0    ; ULA`];
  const corpo=[`loop: lw $t0, 0($s2)   ; Memória`,`add  $s1, $s1, $t0    ; ULA`];
  if(extraUla) corpo.push(`sll  $t1, $t0, 1      ; ULA`);
  if(extraMem) corpo.push(`sw   $t1, 0($s2)      ; Memória`);
  corpo.push(`addi $s2, $s2, 4      ; ULA`,`addi $s0, $s0, -${passo}     ; ULA`,`bne  $s0, $zero, loop ; Desvio`);
  const depois=[`sw   $s1, 0($s3)      ; Memória`];
  const c={ULA:2+(3+extraUla)*voltas,Desvio:voltas,'Memória':1+(1+extraMem)*voltas};
  const total=c.ULA+c.Desvio+c['Memória'];
  const code=`<pre class="program-code">${[...antes,...corpo,...depois].map((l,i)=>`${i+1}  ${l}`).join('\n')}</pre>`;
  return {voltas,passo,inicio,total,c,code,nCorpo:corpo.length,nLinhas:antes.length+corpo.length+depois.length,
    // O numero de voltas e a pegadinha: o desenho mostra so uma volta, sem entregar a conta.
    vis:{name:'loop',params:{n:1,hideVoltas:true,before:2,body:corpo.length,after:1},caption:'O corpo do loop se repete a cada volta.'}};
}

const GEN_P2 = [
  function vetIndice(r){
    const [d,b]=distinctRegs(r,['s','s']), i=rngInt(2,60,r);
    return gMC(metaAddr('índice em bytes','Deslocamento = índice × 4.'),{r,vis:gMem(i,b),
      q:`O endereço-base do vetor <b>vet</b> está em <b>${b}</b>, e cada inteiro ocupa 4 bytes. Qual instrução carrega <b>vet[${i}]</b> em <b>${d}</b>?`,
      right:`lw ${d}, ${i*4}(${b})`,wrongs:[`lw ${d}, ${i}(${b})`,`lw ${d}, ${(i-1)*4}(${b})`,`lw ${b}, ${i*4}(${d})`,`sw ${d}, ${i*4}(${b})`,`lw ${d}, ${(i+1)*4}(${b})`],
      explain:`vet[${i}] está a ${i} × 4 = ${i*4} bytes da base.`});
  },
  function vetGravar(r){
    const [d,b]=distinctRegs(r,['t','s']), i=rngInt(2,60,r);
    return gMC(metaAddr('gravar no vetor','Gravar usa sw. No sw, o registrador da esquerda é o valor, e o de dentro do parêntese é a base.'),{r,vis:gMem(i,b),
      q:`O registrador <b>${d}</b> guarda um valor que deve ir para <b>vet[${i}]</b>. A base está em <b>${b}</b>. Qual instrução faz isso?`,
      right:`sw ${d}, ${i*4}(${b})`,wrongs:[`lw ${d}, ${i*4}(${b})`,`sw ${b}, ${i*4}(${d})`,`sw ${d}, ${i}(${b})`,`sw ${d}, ${(i+1)*4}(${b})`],
      explain:`Gravar é sw, e o deslocamento é ${i} × 4 = ${i*4}.`});
  },
  function vetUltimo(r){
    const [d,b]=distinctRegs(r,['s','s']), n=rngInt(4,80,r);
    return gMC(metaAddr('último elemento','Com N elementos, o último tem índice N−1.'),{r,vis:gMem(n-1,b,'último'),
      q:`O registrador <b>${b}</b> contém o endereço inicial de <b>${n} inteiros</b> consecutivos. Qual instrução carrega o <b>último</b> em <b>${d}</b>?`,
      right:`lw ${d}, ${(n-1)*4}(${b})`,wrongs:[`lw ${d}, ${n*4}(${b})`,`lw ${d}, ${n-1}(${b})`,`lw ${b}, ${(n-1)*4}(${d})`,`addi ${d}, ${b}, ${(n-1)*4}`],
      explain:`A contagem começa em zero, então o último é o índice ${n-1}: ${n-1} × 4 = ${(n-1)*4}.`});
  },
  function vetOrdinal(r){
    const [d,b]=distinctRegs(r,['s','s']), [n,nome]=rngPick(ORDINAIS,r);
    return gMC(metaAddr('N-ésimo elemento',"O N-ésimo elemento tem índice N−1."),{r,vis:gMem(n-1,b,nome),
      q:`O registrador <b>${b}</b> contém a base de um vetor de inteiros. Qual instrução carrega em <b>${d}</b> o <b>${nome} elemento</b>?`,
      right:`lw ${d}, ${(n-1)*4}(${b})`,wrongs:[`lw ${d}, ${n*4}(${b})`,`lw ${d}, ${n}(${b})`,`lw ${d}, ${n-1}(${b})`,`lw ${b}, ${(n-1)*4}(${d})`],
      explain:`O ${nome} elemento é vet[${n-1}], porque o primeiro é vet[0]. Deslocamento = ${n-1} × 4 = ${(n-1)*4}.`});
  },
  function vetChar(r){
    const [d,b]=distinctRegs(r,['t','s']), i=rngInt(3,90,r);
    return gMC(metaAddr('vetor de bytes','Em vetor de char, cada elemento tem 1 byte: o deslocamento é o próprio índice.'),{r,
      vis:{name:'mem',params:{index:i,base:b,size:1},caption:'Aqui cada posição tem só 1 byte.'},
      q:`Um vetor de <b>char</b> (1 byte cada) tem a base em <b>${b}</b>. A quantos bytes da base está o elemento de índice <b>${i}</b>?`,
      right:`${i} bytes`,wrongs:[`${i*4} bytes`,`${i+1} bytes`,`${(i+1)*4} bytes`,`${i*2} bytes`],
      explain:`Cada char ocupa 1 byte: ${i} × 1 = ${i}. Multiplicar por 4 só vale para inteiros.`});
  },
  function vetIndiceRegistrador(r){
    const [ind,tmp,base,dest]=distinctRegs(r,['t','t','s','t']);
    return gMC(metaAddr('índice em registrador','Índice em registrador: sll por 2, soma com a base e lw com deslocamento 0.'),{r,
      vis:gMem(3,base),
      q:`O índice está em <b>${ind}</b> e a base do vetor de inteiros em <b>${base}</b>. Qual sequência carrega o elemento em <b>${dest}</b>?`,
      right:`sll ${tmp}, ${ind}, 2<br>add ${tmp}, ${tmp}, ${base}<br>lw ${dest}, 0(${tmp})`,
      wrongs:[`add ${tmp}, ${ind}, ${base}<br>lw ${dest}, 0(${tmp})`,`sll ${tmp}, ${ind}, 4<br>add ${tmp}, ${tmp}, ${base}<br>lw ${dest}, 0(${tmp})`,`lw ${dest}, ${ind}(${base})`,`sll ${tmp}, ${ind}, 2<br>lw ${dest}, 0(${tmp})`],
      explain:'O deslocamento do lw é constante, então não aceita registrador. É preciso multiplicar o índice por 4 (sll por 2), somar a base e só então ler.'});
  },
  function vetIndiceReverso(r){
    const [p,b]=distinctRegs(r,['t','s']), i=rngInt(2,60,r), dif=i*4;
    return gMC(metaAddr('índice a partir do endereço','Índice = diferença de endereços ÷ 4.'),{r,vis:{name:'mem',params:{index:i,base:b,targetName:'?'},caption:'Quantas posições cabem nessa distância?'},
      q:`A base de um vetor de inteiros está em <b>${b}</b>. Um ponteiro em <b>${p}</b> aponta para um elemento, e ${p} − ${b} = <b>${dif}</b>. Qual o índice desse elemento?`,
      right:String(i),wrongs:[String(dif),String(i+1),String(i-1),String(dif*4)],
      explain:`${dif} bytes ÷ 4 bytes por inteiro = ${i}.`});
  },
  function shiftConstante(r){
    const k=rngInt(0,3,r), n=rngInt(k+4,31,r), [d,s]=distinctRegs(r,['s','s']);
    const hex='0x'+(Math.pow(2,n)).toString(16).toUpperCase().padStart(8,'0');
    return gMC(metaShift('montar constante','Conte quantas casas faltam: expoente do alvo menos expoente do valor atual.'),{r,
      q:`O registrador <b>${s}</b> vale <b>${Math.pow(2,k)}</b>. Qual instrução coloca <b>${hex}</b> em <b>${d}</b>?`,
      right:`sll ${d}, ${s}, ${n-k}`,wrongs:[`sll ${d}, ${s}, ${n}`,`sll ${d}, ${s}, ${n-k+1}`,`sll ${d}, ${s}, ${Math.max(1,n-k-1)}`,`srl ${d}, ${s}, ${n-k}`],
      explain:`${hex} = 2^${n} e ${s} já vale 2^${k}. Faltam ${n} − ${k} = ${n-k} deslocamentos.`});
  },
  function shiftMultiplica(r){
    const n=rngInt(1,12,r), f=Math.pow(2,n), [d,s]=distinctRegs(r,['t','t']);
    return gMC(metaShift('multiplicar','Multiplicar por 2^n: sll por n.'),{r,
      q:`Qual instrução multiplica <b>${s}</b> por <b>${f}</b> e guarda em <b>${d}</b>?`,
      right:`sll ${d}, ${s}, ${n}`,wrongs:[`sll ${d}, ${s}, ${f}`,`srl ${d}, ${s}, ${n}`,`sra ${d}, ${s}, ${n}`,`sll ${d}, ${s}, ${n+1}`],
      explain:`${f} = 2^${n}, então são ${n} casas para a esquerda. O campo da instrução guarda o expoente, não o ${f}.`});
  },
  function shiftDivide(r){
    const n=rngInt(1,12,r), f=Math.pow(2,n), [d,s]=distinctRegs(r,['s','s']);
    return gMC(metaShift('dividir com sinal','Número com sinal usa sra, que copia o bit de sinal.'),{r,
      q:`Como dividir um número <b>com sinal</b> em <b>${s}</b> por <b>${f}</b> e guardar em <b>${d}</b>?`,
      right:`sra ${d}, ${s}, ${n}`,wrongs:[`srl ${d}, ${s}, ${n}`,`sra ${d}, ${s}, ${f}`,`sll ${d}, ${s}, ${n}`,`sra ${d}, ${s}, ${n-1||2}`],
      explain:`${f} = 2^${n}. O srl colocaria zero na esquerda e estragaria um número negativo; o certo é sra.`});
  },
  function shiftValor(r){
    const n=rngInt(1,4,r), m=rngInt(1,20,r), v=-m*Math.pow(2,n), [d,s]=distinctRegs(r,['s','s']);
    return gMC(metaShift('resultado do sra','sra por n divide por 2^n e mantém o sinal.'),{r,
      q:`<b>${s}</b> contém <b>${v}</b>. Qual o resultado de ${gMono(`sra ${d}, ${s}, ${n}`)}?`,
      right:String(-m),wrongs:[String(m),String(v*Math.pow(2,n)),String(v/2),String(-m+1)],
      explain:`Dividir por 2^${n} = ${Math.pow(2,n)}: ${v} ÷ ${Math.pow(2,n)} = ${-m}. O sinal é preservado.`});
  },
  function shiftEsquerdaValor(r){
    const n=rngInt(1,6,r), v=rngInt(1,30,r), [d,s]=distinctRegs(r,['t','s']);
    return gMC(metaShift('resultado do sll','sll por n multiplica por 2^n.'),{r,
      q:`<b>${s}</b> contém <b>${v}</b>. Qual o valor de <b>${d}</b> depois de ${gMono(`sll ${d}, ${s}, ${n}`)}?`,
      right:String(v*Math.pow(2,n)),wrongs:[String(v*n),String(v+n),String(Math.floor(v/Math.pow(2,n))),String(v*Math.pow(2,n+1))],
      explain:`${v} × 2^${n} = ${v*Math.pow(2,n)}.`});
  },
  function shiftMais1(r){
    const n=rngInt(2,10,r), f=Math.pow(2,n)+1, [x,y]=distinctRegs(r,['s','s']), t=randomReg(r,'t');
    return gMC(metaShift('multiplicar sem mult','Quebre em potência de 2: x×(2^n+1) = (x deslocado n casas) + x.'),{r,
      q:`Sem usar mult, qual sequência faz <b>${y} = ${x} × ${f}</b>?`,
      right:`sll ${t}, ${x}, ${n}<br>add ${y}, ${t}, ${x}`,
      wrongs:[`sll ${y}, ${x}, ${f}`,`sll ${t}, ${x}, ${n+1}<br>add ${y}, ${t}, ${x}`,`sll ${y}, ${x}, ${n}`,`sll ${t}, ${x}, ${n}<br>sub ${y}, ${t}, ${x}`],
      explain:`${f} = 2^${n} + 1. Deslocar ${n} casas dá x × ${f-1}, e somando x de novo chega em x × ${f}.`});
  },
  function programaVoltas(r){
    const p=gPrograma(r);
    return gMC(metaCpiP2('voltas do loop','Voltas = valor inicial ÷ passo do contador.'),{r,vis:Object.assign({},p.vis,{caption:'O corpo do loop. Quantas vezes ele roda?'}),
      q:`Considere o programa:${p.code}Quantas vezes o corpo do loop é executado?`,
      right:String(p.voltas),wrongs:[String(p.inicio+1),String(p.nCorpo),String(p.voltas+1),String(p.voltas-1),String(p.inicio*2)],
      explain:`O contador começa em ${p.inicio} e anda de ${p.passo} em ${p.passo} até 0: ${p.inicio} ÷ ${p.passo} = ${p.voltas} voltas.`});
  },
  function programaTotal(r){
    const p=gPrograma(r), semFora=p.nCorpo*p.voltas;
    return gMC(metaCpiP2('contagem dinâmica','Instruções fora do loop + instruções do loop × voltas.'),{r,vis:p.vis,
      q:`Considere o programa:${p.code}Quantas instruções são executadas no total?`,
      right:String(p.total),wrongs:[String(p.nLinhas),String(semFora),String(p.nCorpo*p.inicio+3),String(p.total+p.nCorpo),String(p.total-1)],
      explain:`Fora do loop são 3 instruções. Dentro são ${p.nCorpo} × ${p.voltas} = ${semFora}. Total = ${p.total}.`});
  },
  function programaPorTipo(r){
    const p=gPrograma(r), tipo=rngPick(['ULA','Memória','Desvio'],r), v=p.c[tipo];
    return gMC(metaCpiP2('contagem por tipo','Classifique cada linha e multiplique as de dentro do loop pelas voltas.'),{r,vis:p.vis,
      q:`Considere o programa:${p.code}Quantas instruções do tipo <b>${tipo}</b> são executadas?`,
      right:String(v),wrongs:[String(v+p.voltas),String(v+1),String(Math.max(1,v-1)),String(p.total),String(v+2)],
      explain:`Executadas: ULA = ${p.c.ULA}, Memória = ${p.c['Memória']}, Desvio = ${p.c.Desvio}. O total é ${p.total}.`});
  },
  function programaCpi(r){
    const p=gPrograma(r), cu=rngInt(3,6,r), cd=rngInt(2,5,r), cm=rngInt(5,9,r);
    const ciclos=p.c.ULA*cu+p.c.Desvio*cd+p.c['Memória']*cm, cpi=ciclos/p.total;
    return gMC(metaCpiP2('CPI do programa','CPI médio = ciclos totais ÷ instruções executadas.'),{r,vis:p.vis,
      q:`Considere o programa, com CPI de ULA = ${cu}, Desvio = ${cd} e Memória = ${cm}:${p.code}Qual o CPI médio?`,
      right:gNum(cpi),wrongs:[gNum((cu+cd+cm)/3),gNum(cpi+.4),gNum(cpi-.3),gNum(ciclos/p.nLinhas),gNum(ciclos/(p.nCorpo*p.voltas))],
      explain:`Ciclos = ${p.c.ULA}×${cu} + ${p.c.Desvio}×${cd} + ${p.c['Memória']}×${cm} = ${ciclos}. Instruções = ${p.total}. CPI = ${gNum(cpi)}.`});
  },
  function cpiPorContagem(r){
    const u=rngInt(10,40,r), d=rngInt(3,12,r), m=rngInt(5,20,r), cu=rngInt(3,6,r), cd=rngInt(2,5,r), cm=rngInt(5,9,r);
    const ciclos=u*cu+d*cd+m*cm, t=u+d+m, cpi=ciclos/t;
    return gMC(metaCpiP2('CPI médio','CPI médio = ciclos totais ÷ instruções totais.'),{r,
      vis:{name:'cpi',params:{rows:[{n:'ULA',pct:u,cpi:cu},{n:'Desvios',pct:d,cpi:cd},{n:'Memória',pct:m,cpi:cm}],unit:''},caption:'Peso de cada tipo de instrução.'},
      q:`Um programa executa ${u} instruções de ULA (CPI=${cu}), ${d} desvios (CPI=${cd}) e ${m} acessos à memória (CPI=${cm}). Qual o CPI médio?`,
      right:gNum(cpi),wrongs:[gNum((cu+cd+cm)/3),gNum(ciclos/100),gNum(cpi+.5),gNum(cpi-.5)],
      explain:`Ciclos = ${ciclos}. Instruções = ${t}. CPI = ${ciclos} ÷ ${t} = ${gNum(cpi)}.`});
  },
  function tempoPorCiclos(r){
    const c=rngInt(50,900,r), f=rngPick([100,125,200,250,500],r), ns=1000/f;
    return gMC(metaCpiP2('tempo total','Tempo total = ciclos × tempo de um ciclo. Período em ns = 1000 ÷ MHz.'),{r,noVisual:true,
      q:`Uma máquina de <b>${f} MHz</b> executa um programa que gasta <b>${c} ciclos</b>. Qual o tempo total?`,
      right:gNum(c*ns,0)+' ns',wrongs:[gNum(c,0)+' ns',gNum(c*f,0)+' ns',gNum(c*ns+ns,0)+' ns',gNum(c*ns/2,0)+' ns'],
      explain:`Um ciclo dura 1000 ÷ ${f} = ${gNum(ns,0)} ns. Total = ${c} × ${gNum(ns,0)} = ${gNum(c*ns,0)} ns.`});
  },
  function mipsPrograma(r){
    const f=rngPick([100,200,250,400,500],r), cpi=rngInt(25,70,r)/10, res=f/cpi;
    return gMC(metaCpiP2('taxa MIPS','MIPS = frequência em MHz ÷ CPI médio.'),{r,noVisual:true,
      q:`Qual a taxa de MIPS de uma máquina de <b>${f} MHz</b> com CPI médio de <b>${gNum(cpi,1)}</b>?`,
      right:gNum(res,1),wrongs:[gNum(f,1),gNum(cpi,1),gNum(f*cpi,1),gNum(res*2,1)],
      explain:`${f} ÷ ${gNum(cpi,1)} = ${gNum(res,1)}.`});
  },
  function pilhaCadeia(r){
    const nomes=rngPick([['A','B','C','D','E'],['f','g','h','k','m'],['soma','dobro','triplo','raiz','media']],r);
    const n=rngInt(2,5,r), cadeia=nomes.slice(0,n), todas=['main',...cadeia];
    const txt=todas.slice(0,-1).map((x,i)=>`${x}() chama ${todas[i+1]}()`).join('; ');
    return gMC(metaStack('uso mínimo da pilha','Só salva $ra quem foi chamada e também chama outra. A última da fila não salva.'),{r,
      vis:{name:'calls',params:{chain:todas},caption:'Quem chama quem.'},
      q:`${txt}; ${cadeia[n-1]}() não chama ninguém. Com uso mínimo da pilha, quantas vezes o $ra precisa ser salvo?`,
      right:String(n-1),wrongs:[String(n),String(n+1),'0',String(Math.max(1,n-2))],
      explain:`${n-1>0?cadeia.slice(0,-1).join(', '):'Nenhuma'} ${n-1===1?'chama':'chamam'} outra função depois de ter sido chamada${n-1===1?'':'s'}. ${cadeia[n-1]} é a última e não executa jal.`});
  },
  function pilhaSequencial(r){
    const [f,g,h]=rngPick([['f1','f2','f3'],['A','B','C'],['calc','soma','sub']],r);
    const k=rngInt(2,4,r);
    return gMC(metaStack('chamadas em sequência','Chamadas em sequência, sem aninhar, reaproveitam um único salvamento.'),{r,
      vis:{name:'calls',params:{chain:['main',f,g]},caption:'Quem chama quem.'},
      q:`main() chama ${f}(). ${f}() chama ${g}() <b>${k} vezes em sequência</b>, sem aninhar, e ${g}() não chama ninguém. Com uso mínimo da pilha, quantas vezes o $ra precisa ser salvo?`,
      right:'1',wrongs:[String(k),String(k+1),'0',String(k+2)],
      explain:`${f} salva o próprio $ra uma vez antes da primeira chamada e recupera só no fim. Ele continua guardado durante as ${k} chamadas.`});
  },
  function pilhaEspaco(r){
    const k=rngInt(1,6,r), b=k*4;
    return gMC(metaStack('reservar espaço','Pilha cresce para baixo: reservar é subtrair de $sp, 4 bytes por registrador.'),{r,noVisual:true,
      q:`Uma função precisa salvar <b>${k} registrador(es)</b> na pilha. Qual instrução reserva o espaço?`,
      right:`addi $sp, $sp, -${b}`,wrongs:[`addi $sp, $sp, ${b}`,`addi $sp, $sp, -${k}`,`addi $sp, $sp, ${k}`,`sw $sp, -${b}($sp)`],
      explain:`${k} × 4 = ${b} bytes. A pilha cresce para endereços menores, então o valor é negativo.`});
  },
  function pilhaEndereco(r){
    const k=rngInt(1,5,r), sp=rngPick([0x7FFFEFFC,0x7FFFF000,0x7FFFEF00],r), novo=sp-k*4;
    const h=v=>'0x'+gHex(v,8);
    return gMC(metaStack('valor do $sp','Cada palavra salva desce o $sp em 4.'),{r,noVisual:true,
      q:`O <b>$sp</b> vale <span class="mono">${h(sp)}</span>. Depois de reservar espaço para <b>${k} palavra(s)</b>, qual o novo valor?`,
      right:h(novo),wrongs:[h(sp+k*4),h(sp-k),h(sp+k),h(sp-k*8)],
      explain:`${k} × 4 = ${k*4} bytes para baixo: ${h(sp)} − ${k*4} = ${h(novo)}. A conta é em hexadecimal.`});
  },
  function pilhaOrdem(r){
    const reg=rngPick(['$ra','$s0','$s1','$s2'],r), salvar=r()<.5;
    const right=salvar?`addi $sp, $sp, -4<br>sw ${reg}, 0($sp)`:`lw ${reg}, 0($sp)<br>addi $sp, $sp, 4`;
    const wrongs=salvar?[`sw ${reg}, 0($sp)<br>addi $sp, $sp, -4`,`addi $sp, $sp, 4<br>sw ${reg}, 0($sp)`,`lw ${reg}, 0($sp)<br>addi $sp, $sp, -4`]
      :[`addi $sp, $sp, 4<br>lw ${reg}, 0($sp)`,`sw ${reg}, 0($sp)<br>addi $sp, $sp, 4`,`addi $sp, $sp, -4<br>lw ${reg}, 0($sp)`];
    return gMC(metaStack(salvar?'ordem ao salvar':'ordem ao restaurar','Salvar: reserva e grava. Restaurar: lê e libera.'),{r,nda:false,noVisual:true,
      q:`Qual sequência ${salvar?'salva':'restaura'} corretamente o ${gMono(reg)} ${salvar?'na':'da'} pilha?`,
      right,wrongs,
      explain:salvar?'Primeiro abre o espaço diminuindo $sp, depois grava.':'Primeiro lê enquanto $sp ainda aponta para o valor, depois libera o espaço.'});
  }
];

// Rodada de questoes sorteadas, sem repetir enunciado dentro da mesma rodada.
function genRound(gens,alvo,r){
  r=r||Math.random;
  const vistos=new Set(), out=[];
  const porGerador=Math.ceil(alvo/gens.length);
  gens.forEach(g=>{
    let ok=0, tentativas=0;
    while(ok<porGerador && tentativas++<porGerador*4){
      const q=g(r), chave=q.question||q.statement;
      if(vistos.has(chave)) continue;
      vistos.add(chave); out.push(q); ok++;
    }
  });
  return out;
}
