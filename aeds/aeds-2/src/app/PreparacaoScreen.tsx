import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Clock3, Compass, FileCode2, Target } from 'lucide-react';
import { getExam, type ExamId } from '../content/examCatalog';
import { assuntoQuestao, getQuestoesPreparacao, planos, praticaPreparacao, relatoP2, simuladosPreparacao, type Nivel, type QuestaoPreparacao, type Tema } from '../content/preparacao/catalogo';
import operacoesP2 from '../content/preparacao/operacoesP2.md?raw';
import { carregarPreparacao, preparacaoKey } from '../persistence/preparacao';
import { StudyText } from './StudyText';
import './preparacao.css';

const arquivos=import.meta.glob('../content/preparacao/solucoes/**/*.{java,c}',{query:'?raw',import:'default',eager:true}) as Record<string,string>;
const sourceText=(path:string)=>arquivos[`../content/preparacao/solucoes/${path}`];
const niveis:Record<Nivel,string>={facil:'Fácil',media:'Médio',dificil:'Difícil'};
type Tab='plano'|'treino'|'simulados'|'revisao'|'analise'|'pos';
const tabs:{id:Tab;label:string}[]=[{id:'plano',label:'Seu plano'},{id:'treino',label:'Treinar'},{id:'simulados',label:'Simulados'},{id:'revisao',label:'Revisão'},{id:'analise',label:'Evidências'},{id:'pos',label:'O que caiu'}];
function Files({paths}:{paths:string[]}) {
  return <>{paths.map(path=><details className="study-source" key={path}><summary><FileCode2 size={15} aria-hidden="true"/> Código testado · {path.split('/').pop()}</summary><pre><code>{sourceText(path)??'Arquivo indisponível.'}</code></pre></details>)}</>;
}
function codeBase(question:QuestaoPreparacao):string | null {
  if(question.base) return question.base;
  if(question.id.startsWith('pratica-')) return null;
  const topic=assuntoQuestao(question);
  if(question.sources.includes('autoral/Fundamentos.java')) {
    if(topic==='analise') return 'static long contar(int n) {\n  long resp = 0;\n  for (int i = 1; i <= n; i++)\n    for (int j = 0; j < i; j++) resp++;\n  return resp;\n}';
    if(topic==='fila') return 'class Fila {\n  int[] array; int primeiro, ultimo;\n  Fila(int capacidade) { array = new int[capacidade + 1]; }\n  // primeiro aponta para o primeiro elemento; ultimo para a próxima posição livre.\n  int desfazer() { /* implemente */ }\n  int[] inverso() { /* implemente */ }\n}';
    return 'class Ordenacao {\n  // Implemente inserção por paridade e valor, sem ordenação pronta.\n  static void ordenar(int[] array) { /* implemente */ }\n}';
  }
  if(question.sources.includes('autoral/Estruturas.java')) return topic==='trie' ? 'class Letra { Letra[] prox = new Letra[26]; boolean fimPalavra; }\nclass Estruturas {\n  Letra inicio = new Letra();\n  void inserir(String s) { /* já implementado */ }\n  int contarPrefixo(String s) { /* implemente */ }\n  Estruturas invertida() { /* implemente */ }\n}' : 'class No { int elemento, nivel; No esq, dir; }\nclass Estruturas {\n  No raiz;\n  int contarBalanceados() { /* implemente */ }\n  static int altura(No i) { /* implemente */ }\n  static No direita(No i) { /* implemente */ }\n}';
  if(question.sources.includes('autoral/Hibrida.java')) return 'class No { int elemento; No esq, dir; }\nclass Celula { int elemento; Celula prox; }\nclass Posicao { int elemento; boolean ocupado; No raiz; Celula primeiro; }\nclass Hibrida {\n  Posicao[] tabela; // cinco posições inicializadas; listas com cabeça\n  int hash(int x) { /* índice de 0 a 4, inclusive para negativos */ }\n  boolean pesquisar(int x) { /* implemente */ }\n}';
  return null;
}
function Question({question,draft,onDraft,result,onResult}:{question:QuestaoPreparacao;draft:string;onDraft:(v:string)=>void;result:string;onResult:(v:string)=>void}) {
  return <article className="study-question">
    <div className="study-question-head"><span className="app-kicker">Exercício autoral · {question.sources.some(p=>p.endsWith('.c'))?'Java / C conforme enunciado':'Java / análise'}</span></div>
    <h3>{question.title}</h3>
    <StudyText text={question.body}/>{codeBase(question)&&<><h4>Código-base</h4><pre><code>{codeBase(question)}</code></pre></>}
    <label className="study-draft-label" htmlFor={`draft-${question.id}`}>Sua tentativa <span>salva neste navegador</span></label>
    <textarea id={`draft-${question.id}`} value={draft} onChange={e=>onDraft(e.target.value)} placeholder="Escreva o método, desenhe o percurso em texto e justifique a complexidade…" spellCheck={false}/>
    <details className="study-answer"><summary>Mostrar / esconder gabarito</summary>
      <StudyText text={question.answer??'Separe a navegação de cada nível da estrutura. Confira o método correspondente no código testado abaixo, incluindo tratamento de vazio, pré-condições e casos de borda. Antes de considerar concluído, justifique a complexidade em função do número de nós, altura e tamanho das listas.'}/>
      <Files paths={question.sources}/>
      <div className="study-rubric"><strong>Confira sua solução</strong><span>□ respeita a assinatura e a estrutura</span><span>□ preserva referências e invariantes</span><span>□ trata vazio, único e ausente</span><span>□ justifica Θ no melhor e pior caso</span></div>
      <label className="study-result">Como foi a tentativa? <select value={result} onChange={e=>onResult(e.target.value)}><option value="">Ainda não revisei</option><option value="revisar">Preciso refazer</option><option value="dominei">Resolvi e justifiquei sem ajuda</option></select></label>
      <small>Autoavaliação. O rascunho desta área não é executado nem corrigido automaticamente.</small>
    </details>
  </article>;
}

export function PreparacaoScreen({scope,onBack,onLegacy}:{scope:ExamId;onBack:()=>void;onLegacy:(pratica:boolean)=>void}) {
  const [level,setLevel]=useState<Nivel | 'todos'>('todos');
  const [simuladoId,setSimuladoId]=useState('');
  const [tab,setTab]=useState<Tab>('plano');
  const [section,setSection]=useState<'teorica'|'pratica'>('teorica');
  const [selected,setSelected]=useState<string|null>(null);
  const [topic,setTopic]=useState<string|null>(null);
  const [record,setRecord]=useState(carregarPreparacao);
  const [saveError,setSaveError]=useState(false);
  const plan=planos[scope];
  useEffect(()=>{
    const timer=setTimeout(()=>{
      try { localStorage.setItem(preparacaoKey,JSON.stringify(record)); setSaveError(false); } catch { setSaveError(true); }
    },250);
    return ()=>{clearTimeout(timer);try { localStorage.setItem(preparacaoKey,JSON.stringify(record)); } catch { /* A sessão permanece utilizável sem persistência. */ }};
  },[record]);
  const sims=simuladosPreparacao.filter(s=>s.exam===scope&&s.level===(level==='todos'?'facil':level));
  const simulado=sims.find(s=>s.id===simuladoId)??sims[0];
  const questions=useMemo(()=>{
    const all=section==='pratica'?praticaPreparacao[scope]:getQuestoesPreparacao(scope);
    const levelIds=new Set(simuladosPreparacao.filter(s=>s.exam===scope&&(level==='todos'||s.level===level)).flatMap(s=>s.questions.map(q=>q.id)));
    const unique=[...new Map(all.map(q=>[q.id,q])).values()];
    const filtered=unique.filter(q=>(section==='pratica'||level==='todos'||levelIds.has(q.id))&&(!topic||assuntoQuestao(q)===topic));
    const selectedTopic=planos[scope].topics.find(t=>t.id===topic);
    if(!filtered.length && selectedTopic && section==='teorica') return [{
      id:`oficina-${topic}-${level}`,title:`Oficina: ${selectedTopic.title}`,topic:selectedTopic.id,
      body:selectedTopic.id==='treesort'?'Considere uma ABP de inteiros com No { int elemento; No esq, dir; }. Implemente public int[] sort(int[] array): insira os elementos em uma árvore inicialmente vazia e devolva um novo vetor em ordem crescente por caminhamento central. Repetidos devem ir para a direita. Para [14, 6, 14, 3], o resultado deve ser [3, 6, 14, 14]. Analise o pior caso de construção sem balanceamento.':selectedTopic.id==='lista'?'Considere Celula { int elemento; Celula prox; } e Lista { Celula primeiro, ultimo; }, com célula cabeça. Implemente void inverter() usando três referências, sem criar novas células. Preserve a cabeça e atualize ultimo. Para [9, 4, 2], o resultado deve ser [2, 4, 9]. Teste lista vazia e unitária e apresente Θ.':`Implemente e justifique a operação ${selectedTopic.operation} Considere os atributos indicados no enunciado do tema e verifique vazio, único e ausente.`,
      sources:selectedTopic.sources,answer:`Invariante a conferir: ${selectedTopic.trap} A referência testada abaixo contém os métodos e os casos de borda; selecione a operação correspondente.`,
    }];
    return filtered;
  },[scope,level,section,topic]);
  const question=questions.find(q=>q.id===selected)??questions[0];
  const done=plan.topics.filter(t=>record.checks[`${scope}-${t.id}`]).length;
  const ordered=[...plan.topics].sort((a,b)=>Number(Boolean(record.checks[`${scope}-${a.id}`]))-Number(Boolean(record.checks[`${scope}-${b.id}`])));
  function train(t:Tema) { setTopic(t.id); setSection('teorica'); setLevel('todos'); setSelected(null); setTab('treino'); }
  function renderQuestion(q:QuestaoPreparacao) {
    const key=`${scope}-${q.id}`;
    return <Question key={key} question={q} draft={record.drafts[key]??''} result={record.results[key]??''}
      onDraft={value=>setRecord(r=>({...r,drafts:{...r.drafts,[key]:value}}))}
      onResult={value=>setRecord(r=>({...r,results:{...r.results,[key]:value}}))}/>;
  }
  return <div className="preparacao">
    <button type="button" className="study-back" onClick={onBack}><ArrowLeft size={16}/> Voltar à sala de estudo</button>
    <header className="study-hero">
      <div><p className="app-kicker">AEDS II / preparação por avaliação</p><h1>{getExam(scope).title}<span>Treine com direção.</span></h1><p>Do histórico para o papel: entenda o que priorizar, tente resolver e revise o que ainda trava.</p><span className="study-status"><span/> {plan.status}</span></div>
      <div className="study-progress"><Target size={26} aria-hidden="true"/><strong>{done}<span> / {plan.topics.length}</span></strong><p>temas revisados por você</p><progress max={plan.topics.length} value={done}/><small>Seu avanço na revisão.</small></div>
    </header>
    <nav className="study-tabs" aria-label="Preparação da avaliação">{tabs.filter(t=>t.id!=='pos'||scope==='p2').map(t=><button type="button" key={t.id} aria-current={tab===t.id?'page':undefined} onClick={()=>setTab(t.id)}>{t.label}</button>)}</nav>
    {saveError&&<p role="status">Não foi possível salvar neste navegador. Mantenha a página aberta e copie suas tentativas.</p>}
    {(tab==='treino'||tab==='simulados')&&<div className="study-filters">
      <label>Nível<select value={tab==='simulados'&&level==='todos'?'facil':level} onChange={e=>{setLevel(e.target.value as Nivel|'todos');setSelected(null);}}>{tab==='treino'&&<option value="todos">Todos os níveis</option>}{Object.entries(niveis).map(([id,name])=><option key={id} value={id}>{name}</option>)}</select></label>
      {tab==='treino'&&section==='teorica'&&<label>Assunto<select value={topic??''} onChange={e=>{setTopic(e.target.value||null);setSelected(null);}}><option value="">Todos os assuntos</option>{plan.topics.map(t=><option key={t.id} value={t.id}>{t.title}</option>)}</select></label>}
      {tab==='simulados'&&sims.length>1&&<label>Versão do simulado<select value={simulado?.id??''} onChange={e=>setSimuladoId(e.target.value)}>{sims.map(sim=><option key={sim.id} value={sim.id}>{sim.title}</option>)}</select></label>}
    </div>}

    {tab==='plano'&&<>
      <div className="study-section-title"><div><p className="app-kicker">01 / Conteúdos para estudar</p><h2>Comece pelo que ainda falta.</h2></div><span><Clock3 size={15}/> Uma tentativa por vez</span></div>
      <p className="study-note">Estude o conjunto de conteúdos e pratique as diferentes operações. A ordem acompanha sua revisão: os temas ainda não marcados aparecem primeiro.</p>
      <div className="study-plan-grid"><div className="study-topics">{ordered.map((t,i)=><article className={`study-topic ${record.checks[`${scope}-${t.id}`]?'is-done':''}`} key={t.id}>
        <span className="study-index">{record.checks[`${scope}-${t.id}`]?<Check size={18}/>:String(i+1).padStart(2,'0')}</span><div><div className="study-topic-heading"><h3>{t.title}</h3><span className="study-topic-count">{getQuestoesPreparacao(scope).filter(q=>assuntoQuestao(q)===t.id).length} exercícios</span></div><p>{t.operation}</p><details><summary>Por que treinar isso?</summary><p>{t.evidence}</p><ul>{t.forms.map(f=><li key={f.title}>{f.title}</li>)}</ul><p><strong>Atenção:</strong> {t.trap}</p></details><div className="study-topic-actions"><button type="button" className="study-primary" onClick={()=>train(t)}>Treinar este tema <ArrowRight size={15}/></button><label><input type="checkbox" checked={Boolean(record.checks[`${scope}-${t.id}`])} onChange={e=>setRecord(r=>({...r,checks:{...r.checks,[`${scope}-${t.id}`]:e.target.checked}}))}/> Já revisei</label></div></div>
      </article>)}</div><aside className="study-route"><Compass size={24}/><h3>Seu ciclo de treino</h3><ol><li><strong>Tente sem ajuda.</strong><span>Escreva a estratégia e o método.</span></li><li><strong>Confira os invariantes.</strong><span>Vazio, cabeça, último e referências.</span></li><li><strong>Justifique o custo.</strong><span>Explique de onde vem cada termo.</span></li><li><strong>Refaça o que errou.</strong><span>Consulte suas tentativas na revisão.</span></li></ol><button type="button" className="study-secondary" onClick={()=>{setTopic(null);setTab('simulados');}}>Fazer um simulado</button></aside></div>
    </>}

    {tab==='treino'&&<>
      <div className="study-section-title"><div><p className="app-kicker">02 / Prática deliberada</p><h2>Uma questão. Uma tentativa sua.</h2></div><button type="button" className="study-secondary" onClick={()=>onLegacy(section==='pratica')}>Abrir treino guiado existente</button></div>
      <div className="study-switch" aria-label="Modalidade"><button type="button" aria-pressed={section==='teorica'} onClick={()=>{setSection('teorica');setTopic(null);setSelected(null);}}>Teórica</button><button type="button" aria-pressed={section==='pratica'} onClick={()=>{setSection('pratica');setTopic(null);setSelected(null);}}>Prática</button></div>
      {topic&&<button type="button" className="study-back" onClick={()=>setTopic(null)}>Limpar filtro de tema: {plan.topics.find(t=>t.id===topic)?.title}</button>}
      {section==='pratica'&&<div className="study-note"><strong>Treinos autorais de entrada e saída.</strong> O corretor local da área guiada compara saída e casos adicionais. A nota oficial, os limites e a inspeção do algoritmo dependem das regras da turma, ainda não confirmadas. No site estático, não há execução de Java/C. {scope==='reav'?'Não há confirmação de uma prática de reavaliação. Use as práticas das P1, P2 e P3 como revisão.':'Confira: EOF, múltiplos casos, espaços, empate e algoritmo exigido. Não imprima mensagens de depuração.'}</div>}
      {questions.length>0?<><p className="study-exercise-count" role="status">{questions.length} exercícios disponíveis neste filtro</p><div className="study-training-layout"><nav aria-label="Questões disponíveis" className="study-question-nav">{questions.map((q,i)=><button type="button" key={q.id} aria-current={question?.id===q.id?'true':undefined} onClick={()=>setSelected(q.id)}><span>{String(i+1).padStart(2,'0')}</span>{q.title}</button>)}</nav><div>{question&&renderQuestion(question)}</div></div></>:<p className="study-note">Não há questões para este conjunto de filtros. Experimente outro nível ou limpe o filtro do tema.</p>}
    </>}
    {tab==='simulados'&&<>
      <div className="study-section-title"><div><p className="app-kicker">03 / Ensaio de prova</p><h2>{getExam(scope).shortTitle} · {niveis[level==='todos'?'facil':level]}</h2></div><span>{scope==='reav'?'6 questões · 120 min sugeridos':'3 questões · 100 min sugeridos'}</span></div>
      <p className="study-note">Treino autoral com código-base, resolução e análise de complexidade. Resolva a sequência sem consultar o gabarito e depois revise os pontos que faltaram. As versões reúnem o conteúdo da avaliação para toda a turma.</p>
      {simulado?.questions.map(renderQuestion)}
    </>}
    {tab==='revisao'&&<>
      <div className="study-section-title"><div><p className="app-kicker">04 / Revisão rápida</p><h2>Saiba explicar sem consultar.</h2></div></div>
      {plan.topics.map(t=><article className="study-review-card" key={t.id}><label><input type="checkbox" checked={Boolean(record.checks[`${scope}-${t.id}`])} onChange={e=>setRecord(r=>({...r,checks:{...r.checks,[`${scope}-${t.id}`]:e.target.checked}}))}/><strong>{t.title}</strong></label><p>{t.operation}</p><p><strong>Erro a evitar:</strong> {t.trap}</p><Files paths={t.sources}/><button type="button" className="study-back" onClick={()=>train(t)}>Tentar de novo →</button></article>)}
      <h3>Tentativas para refazer</h3>{Object.entries(record.results).filter(([key,value])=>key.startsWith(scope+'-')&&value==='revisar').length===0?<p>Nenhuma tentativa marcada para refazer.</p>:Object.entries(record.results).filter(([key,value])=>key.startsWith(scope+'-')&&value==='revisar').map(([key])=>{
        const found=[...simuladosPreparacao.filter(s=>s.exam===scope).flatMap(s=>s.questions),...praticaPreparacao[scope]].find(q=>`${scope}-${q.id}`===key);
        if(!found) return null;
        return <details className="study-review-card" key={key}><summary>{found.title}</summary>{renderQuestion(found)}</details>;
      })}
    </>}
    {tab==='analise'&&<>
      <div className="study-section-title"><div><p className="app-kicker">05 / Evidências e limites</p><h2>O que sustenta este plano.</h2></div></div>
      <article className="study-review-card"><h3>Escopo</h3><p>{plan.scope}</p><h3>Histórico de cobrança</h3><ul>{plan.history.map(h=><li key={h}>{h}</li>)}</ul><h3>O que falta confirmar</h3><ul>{plan.missing.map(m=><li key={m}>{m}</li>)}</ul></article>
      <article className="study-review-card"><h3>Como os exercícios foram escolhidos</h3><p>O roteiro reúne operações das provas antigas, das listas e do código de referência. As questões combinam implementação, simulação e justificativa de complexidade. As orientações atuais ainda não disponíveis estão indicadas acima.</p></article>
      <h3>Matriz de operações</h3>{scope==='p2'?<StudyText text={operacoesP2}/>:<div className="study-table-wrap"><table><thead><tr><th>Tema</th><th>Operação</th><th>Fonte e limite</th></tr></thead><tbody>{plan.topics.map(t=><tr key={t.id}><td>{t.title}</td><td>{t.operation}</td><td>{t.evidence}</td></tr>)}</tbody></table></div>}
    </>}
    {tab==='pos'&&scope==='p2'&&<>
      <div className="study-section-title"><div><p className="app-kicker">06 / Registro da avaliação</p><h2>O que caiu em 04/11.</h2></div></div>
      <p className="study-note">Registro baseado nas lembranças do aluno em 07/11 e na atualização de 08/11/2026; uma descrição inclui relato de colegas. Use os campos abaixo para completar os detalhes do que foi cobrado.</p>
      {relatoP2.map(item=><article className="study-review-card" key={item.id}><h3>{item.title}</h3><p>{item.text}</p><strong>{item.result}</strong></article>)}
      <article className="study-review-card"><h3>Completar registro</h3><p>Marque “não caiu” apenas quando souber a prova inteira. Deixe como relato parcial quando não lembrar dos detalhes.</p>{plan.topics.map(t=><label className="study-actual" key={t.id}><span>{t.title} <span className="study-topic-count">{getQuestoesPreparacao(scope).filter(q=>assuntoQuestao(q)===t.id).length} exercícios</span></span><select value={record.actual[t.id]??''} onChange={e=>setRecord(r=>({...r,actual:{...r.actual,[t.id]:e.target.value}}))}><option value="">Ainda não confirmado</option><option value="sim">Caiu · confirmado por mim</option><option value="nao">Não caiu · conferi a prova</option><option value="parcial">Relato parcial</option></select></label>)}<label className="study-draft-label" htmlFor="actual-notes">Detalhes e origem da informação</label><textarea id="actual-notes" value={record.notes} onChange={e=>setRecord(r=>({...r,notes:e.target.value}))}/><p>Use este registro para revisar operações e esclarecer enunciados. Consultar um campo que não ordena uma árvore pode exigir caminhar pelos dois ramos.</p></article>
    </>}
  </div>;
}
