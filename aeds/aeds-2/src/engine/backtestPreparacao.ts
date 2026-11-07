/** Avalia somente temas explicitamente confirmados; relatos parciais ficam fora do denominador. */
export function avaliarPrevisao(itens:{chance:number|null;resultado:string|undefined}[]) {
  const confirmados=itens.filter(item=>item.chance!==null&&(item.resultado==='sim'||item.resultado==='nao'));
  const brier=confirmados.length?confirmados.reduce((s,item)=>s+((item.chance!/100)-(item.resultado==='sim'?1:0))**2,0)/confirmados.length:null;
  return {confirmados:confirmados.length,total:itens.length,brier};
}
