export type RegistroPreparacao = { checks:Record<string,boolean>; drafts:Record<string,string>; results:Record<string,string>; actual:Record<string,string>; notes:string };
export const preparacaoKey='aeds-preparacao-v1';
export function carregarPreparacao():RegistroPreparacao {
  const empty:RegistroPreparacao={checks:{},drafts:{},results:{},actual:{},notes:''};
  try {
    const v=JSON.parse(localStorage.getItem(preparacaoKey)??'null');
    if(!v || typeof v!=='object') return empty;
    for(const key of ['checks','drafts','results','actual'] as const) {
      if(v[key] && typeof v[key]==='object' && !Array.isArray(v[key])) {
        for(const [name,value] of Object.entries(v[key])) if(typeof value===(key==='checks'?'boolean':'string'))
          (empty[key] as Record<string,unknown>)[name]=value;
      }
    }
    for(const key of Object.keys(empty.actual)) {
      if(!/^(manha|tarde)-/.test(key)) continue;
      const topic=key.replace(/^(manha|tarde)-/,'');
      if(Object.prototype.hasOwnProperty.call(v.actual,topic)) continue;
      const values=[empty.actual[`manha-${topic}`],empty.actual[`tarde-${topic}`]].filter(Boolean);
      if(values.length) empty.actual[topic]=new Set(values).size>1?'parcial':values[0];
    }
    if(typeof v.notes==='string') empty.notes=v.notes;
  } catch { /* Progresso inválido ou armazenamento indisponível: iniciar uma sessão utilizável. */ }
  return empty;
}
