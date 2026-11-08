import type { ReactNode } from 'react';

function inline(text: string):ReactNode[] {
  return text.split(/(\[[^\]]+\]\(https:\/\/[^)]+\)|\*\*[^*]+\*\*|`[^`]+`)/g).map((part,index)=>
    part.startsWith('[') && /^\[[^\]]+\]\(https:\/\/[^)]+\)$/.test(part) ? <a key={index} href={part.slice(part.indexOf('](')+2,-1)} target="_blank" rel="noreferrer">{part.slice(1,part.indexOf(']('))}</a> : part.startsWith('**') ? <strong key={index}>{part.slice(2,-2)}</strong> : part.startsWith('`') ? <code key={index}>{part.slice(1,-1)}</code> : part);
}
/** Renderiza texto didático sem interpretar HTML nem executar conteúdo dos exemplos. */
export function StudyText({text}:{text:string}) {
  return <div className="study-prose">{text.split(/(```[\s\S]*?```)/g).map((part,index)=>{
    if(part.startsWith('```')) return <pre key={index}><code>{part.replace(/^```[^\n]*\n/,'').replace(/```$/,'').trimEnd()}</code></pre>;
    return part.split(/\n\s*\n/).filter(Boolean).map((block,i)=>{
      if(block.trim().startsWith('|')) {
        const rows=block.trim().split('\n').filter(row=>!/^\|[\s:|\-]+\|$/.test(row));
        return <div className="study-table-wrap" key={`${index}-${i}`}><table><tbody>{rows.map((row,j)=><tr key={j}>{row.split('|').slice(1,-1).map((cell,k)=>j===0?<th scope="col" key={k}>{inline(cell)}</th>:<td key={k}>{inline(cell)}</td>)}</tr>)}</tbody></table></div>;
      }
      if(/^#{1,4} /.test(block)) return <h3 key={`${index}-${i}`}>{inline(block.replace(/^#{1,4} /,''))}</h3>;
      return <p key={`${index}-${i}`}>{inline(block)}</p>;
    });
  })}</div>;
}
