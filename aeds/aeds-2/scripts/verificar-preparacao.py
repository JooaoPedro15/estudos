"""Compila e executa exemplos didáticos isoladamente, sem gravar builds no projeto."""
from pathlib import Path
import subprocess, tempfile, json, sys, os, shutil
raiz=Path(__file__).resolve().parents[1]
candidatos=[Path(os.environ.get('JAVA_HOME','/caminho-inexistente'))/'bin/javac',
 Path(shutil.which('javac') or '/caminho-inexistente'),
 Path('/opt/homebrew/opt/openjdk@21/bin/javac'),Path('/usr/local/opt/openjdk@21/bin/javac')]
javac=None
for candidato in candidatos:
 if candidato.is_file() and subprocess.run([str(candidato),'-version'],capture_output=True).returncode==0:
  javac=candidato; break
if javac is None: sys.exit('JDK ausente: configure JAVA_HOME ou adicione javac e java ao PATH.')
java=javac.parent/'java'
resultados=[]
casos={
 'Reservas.java': [('3\n51 2\n82 1\n63 2\n', '82 51 63\n'), ('0\n1\n19 -2\n','\n19\n'), ('','')],
 'Sensores.c': [('0\n1\n7\n5\n8 4 12 2 6\n','0\n1\n3\n'), ('4\n2 2 2 2\n','1\n'), ('','')],
 'Prefixos.java': [('4 3\nlu lua luz sol\nlu x sol\n','3\n0\n1\n'), ('0 1\na\n2 1\nsol sol\ns\n','0\n1\n'), ('','')],
}
with tempfile.TemporaryDirectory(prefix='aeds-validacao-') as temp:
 for index,p in enumerate(sorted((raiz/'src/content/preparacao/solucoes').rglob('*'))):
  if p.suffix not in ('.java','.c'): continue
  pasta=Path(temp)/str(index); pasta.mkdir()
  if p.suffix=='.java':
   comp=[str(javac),'-encoding','UTF-8','-d',str(pasta),str(p)]
   run=[str(java),'-cp',str(pasta),p.stem]
  else:
   comp=['cc','-std=c99','-Wall','-Wextra',str(p),'-lm','-o',str(pasta/'programa')]
   run=[str(pasta/'programa')]
  try:
   c=subprocess.run(comp,capture_output=True,text=True,timeout=60)
   if c.returncode: raise RuntimeError(c.stderr)
   for entrada,esperado in casos.get(p.name,[(None,None)]):
    r=subprocess.run(run,input=entrada,capture_output=True,text=True,timeout=60)
    ok=(r.stdout==esperado) if esperado is not None else r.stdout.strip().endswith('TODOS OK')
    if r.returncode or not ok: raise RuntimeError(repr(r.stdout)+r.stderr)
   resultados.append({'arquivo':str(p.relative_to(raiz)),'resultado':'aprovado'})
   print('OK',p.relative_to(raiz),flush=True)
  except Exception as erro:
   print('FALHA',p,erro,flush=True); sys.exit(1)
(raiz/'docs/validacao-preparacao.json').write_text(json.dumps(resultados,ensure_ascii=False,indent=2)+'\n')
print(f'{len(resultados)}/{len(resultados)} programas aprovados')
