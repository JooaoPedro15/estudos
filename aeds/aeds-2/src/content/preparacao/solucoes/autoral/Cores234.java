/** Validações de alvinegra e operações de nós 2-3-4; true representa vermelho. */
public class Cores234 {
  static class NoAN {int elemento;boolean cor;NoAN esq,dir;NoAN(int x,boolean c){elemento=x;cor=c;}}
  static class No234 {int qtdChaves;int[] chaves=new int[3];No234[] filhos=new No234[4];}
  /** Trata nulo como preto. */
  static boolean vermelho(NoAN i){return i!=null&&i.cor;}
  /** Conta nós da cor pedida em todos os ramos. */
  static int contarCor(NoAN i,boolean cor){int resp=0;if(i!=null)resp=(i.cor==cor?1:0)+contarCor(i.esq,cor)+contarCor(i.dir,cor);return resp;}
  /** Calcula altura negra até nulos, ou -1 para violação. */
  static int alturaNegra(NoAN i){
    int resp=1;
    if(i!=null){int e=alturaNegra(i.esq),d=alturaNegra(i.dir);if(e<0||d<0||e!=d||(i.cor&&(vermelho(i.esq)||vermelho(i.dir))))resp=-1;else resp=e+(i.cor?0:1);}
    return resp;
  }
  /** Verifica apenas invariantes de cor, não substitui validação de ABB. */
  static boolean coresValidas(NoAN raiz){return (raiz==null||!raiz.cor)&&alturaNegra(raiz)>=0;}
  /** Divide um 4-nó representado por pai preto e dois filhos vermelhos. */
  static void dividirCores(NoAN i){i.cor=true;i.esq.cor=false;i.dir.cor=false;}
  /** Decide qual dos até quatro intervalos contém x. */
  static boolean pesquisar(int x,No234 i){boolean resp=false;if(i!=null){int p=0;while(p<i.qtdChaves&&x>i.chaves[p])p++;if(p<i.qtdChaves&&x==i.chaves[p])resp=true;else resp=pesquisar(x,i.filhos[p]);}return resp;}
  /** Conta nós folha sob a precondição de estrutura 2-3-4 bem formada. */
  static int folhas(No234 i){int resp=0;if(i!=null){if(i.filhos[0]==null)resp=1;else for(int j=0;j<=i.qtdChaves;j++)resp+=folhas(i.filhos[j]);}return resp;}
  /** Conta nós com três chaves, sem confundir nós e elementos. */
  static int quatroNos(No234 i){int resp=0;if(i!=null){if(i.qtdChaves==3)resp=1;for(int j=0;j<=i.qtdChaves;j++)resp+=quatroNos(i.filhos[j]);}return resp;}
  /** Retorna nível comum das folhas ou -1 para divergência. */
  static int nivelFolhas(No234 i,int nivel){int resp=nivel;if(i!=null&&i.filhos[0]!=null){resp=nivelFolhas(i.filhos[0],nivel+1);for(int j=1;j<=i.qtdChaves&&resp>=0;j++)if(nivelFolhas(i.filhos[j],nivel+1)!=resp)resp=-1;}return resp;}
  /** Promove a chave central de uma raiz cheia, religando os quatro filhos. */
  static No234 dividirRaiz(No234 i){
    No234 resp=new No234(),e=new No234(),d=new No234();resp.qtdChaves=e.qtdChaves=d.qtdChaves=1;
    resp.chaves[0]=i.chaves[1];e.chaves[0]=i.chaves[0];d.chaves[0]=i.chaves[2];
    e.filhos[0]=i.filhos[0];e.filhos[1]=i.filhos[1];d.filhos[0]=i.filhos[2];d.filhos[1]=i.filhos[3];resp.filhos[0]=e;resp.filhos[1]=d;return resp;
  }
  /** Cria nó folha para os cenários de teste. */
  static No234 no(int a){No234 n=new No234();n.qtdChaves=1;n.chaves[0]=a;return n;}
  /** Exige o resultado para que a verificação não dependa de flags da JVM. */
  static void exigir(boolean ok){if(!ok)throw new AssertionError("cores/234");}
  /** Testa violações locais e globais, folhas desiguais e divisão de raiz. */
  public static void main(String[] args){
    exigir(coresValidas(null)&&folhas(null)==0&&!pesquisar(3,null));
    NoAN r=new NoAN(20,false);r.esq=new NoAN(10,true);r.dir=new NoAN(30,true);exigir(coresValidas(r)&&contarCor(r,true)==2);
    r.esq.esq=new NoAN(5,true);exigir(!coresValidas(r));r.esq.esq=null;r.dir.cor=false;exigir(!coresValidas(r));r.dir.cor=true;
    dividirCores(r);exigir(r.cor&&!r.esq.cor&&!r.dir.cor&&!coresValidas(r));r.cor=false;exigir(coresValidas(r));
    No234 cheio=no(8);cheio.qtdChaves=3;cheio.chaves[1]=19;cheio.chaves[2]=31;exigir(quatroNos(cheio)==1);
    No234 t=dividirRaiz(cheio);exigir(t.chaves[0]==19&&folhas(t)==2&&nivelFolhas(t,0)==1);
    for(int x:new int[]{8,19,31})exigir(pesquisar(x,t));exigir(!pesquisar(18,t)&&!pesquisar(40,t));
    t.filhos[0].filhos[0]=no(2);t.filhos[0].filhos[1]=no(12);exigir(nivelFolhas(t,0)==-1);
    System.out.println("TODOS OK");
  }
}
