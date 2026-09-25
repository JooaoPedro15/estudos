/**
 * "Drivers" dos exercicios do LeetCode e do Codewars: esses sites nao tem
 * main — o juiz chama o metodo do aluno direto. Aqui cada driver e uma
 * `public class Main` que le a entrada exatamente no formato mostrado no
 * site (ex.: `nums = [1,1,2]` ou as duas linhas de chamadas/argumentos dos
 * problemas de "Design"), chama a classe do aluno e imprime o retorno no
 * formato da saida do site.
 */

const LEITURA = `class Leitura {
  static List<String> linhas() throws IOException {
    BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
    List<String> resp = new ArrayList<String>();
    String linha = in.readLine();
    while (linha != null) {
      if (linha.trim().length() > 0) {
        resp.add(linha.trim());
      }
      linha = in.readLine();
    }
    return resp;
  }

  static String entrada() throws IOException {
    return String.join(" ", linhas());
  }

  /** Divide s pelo separador so no nivel de cima (fora de colchetes e de aspas). */
  static List<String> dividir(String s, char separador) {
    List<String> partes = new ArrayList<String>();
    int nivel = 0;
    boolean aspas = false;
    StringBuilder atual = new StringBuilder();
    for (int i = 0; i < s.length(); i++) {
      char c = s.charAt(i);
      if (c == '"') {
        aspas = !aspas;
      }
      if (!aspas && c == '[') {
        nivel++;
      }
      if (!aspas && c == ']') {
        nivel--;
      }
      if (!aspas && nivel == 0 && c == separador) {
        partes.add(atual.toString().trim());
        atual = new StringBuilder();
      } else {
        atual.append(c);
      }
    }
    if (atual.toString().trim().length() > 0) {
      partes.add(atual.toString().trim());
    }
    return partes;
  }

  static Map<String, String> parametros(String entrada) {
    Map<String, String> resp = new HashMap<String, String>();
    for (String parte : dividir(entrada, ',')) {
      int igual = parte.indexOf('=');
      resp.put(parte.substring(0, igual).trim(), parte.substring(igual + 1).trim());
    }
    return resp;
  }

  static String semColchetes(String s) {
    String t = s.trim();
    return t.substring(1, t.length() - 1).trim();
  }

  static int[] vetorInt(String s) {
    String dentro = semColchetes(s);
    if (dentro.length() == 0) {
      return new int[0];
    }
    String[] partes = dentro.split(",");
    int[] resp = new int[partes.length];
    for (int i = 0; i < partes.length; i++) {
      resp[i] = Integer.parseInt(partes[i].trim());
    }
    return resp;
  }

  static int[][] matrizInt(String s) {
    List<String> linhas = dividir(semColchetes(s), ',');
    int[][] resp = new int[linhas.size()][];
    for (int i = 0; i < resp.length; i++) {
      resp[i] = vetorInt(linhas.get(i));
    }
    return resp;
  }

  static String texto(String s) {
    String t = s.trim();
    return t.substring(1, t.length() - 1);
  }

  static String[] vetorTexto(String s) {
    List<String> partes = dividir(semColchetes(s), ',');
    String[] resp = new String[partes.size()];
    for (int i = 0; i < resp.length; i++) {
      resp[i] = texto(partes.get(i));
    }
    return resp;
  }

  static List<String> argumentos(String s) {
    return dividir(semColchetes(s), ',');
  }

  static String formatar(int[] v) {
    StringBuilder sb = new StringBuilder("[");
    for (int i = 0; i < v.length; i++) {
      if (i > 0) {
        sb.append(",");
      }
      sb.append(v[i]);
    }
    return sb.append("]").toString();
  }

  static String formatar(List<?> v) {
    StringBuilder sb = new StringBuilder("[");
    for (int i = 0; i < v.size(); i++) {
      if (i > 0) {
        sb.append(",");
      }
      Object x = v.get(i);
      sb.append(x instanceof String ? "\\"" + x + "\\"" : String.valueOf(x));
    }
    return sb.append("]").toString();
  }

  static String formatar(String[] v) {
    StringBuilder sb = new StringBuilder("[");
    for (int i = 0; i < v.length; i++) {
      if (i > 0) {
        sb.append(", ");
      }
      sb.append("\\"").append(v[i]).append("\\"");
    }
    return sb.append("]").toString();
  }
}`;

const LIST_NODE = `class ListNode {
  int val;
  ListNode next;
  ListNode() {}
  ListNode(int val) { this.val = val; }
  ListNode(int val, ListNode next) { this.val = val; this.next = next; }

  static ListNode construir(int[] v) {
    ListNode cabeca = new ListNode();
    ListNode ultimo = cabeca;
    for (int i = 0; i < v.length; i++) {
      ultimo.next = new ListNode(v[i]);
      ultimo = ultimo.next;
    }
    return cabeca.next;
  }

  static String formatar(ListNode no) {
    StringBuilder sb = new StringBuilder("[");
    int passos = 0;
    for (ListNode i = no; i != null; i = i.next) {
      if (passos > 0) {
        sb.append(",");
      }
      sb.append(i.val);
      passos++;
      if (passos > 100000) {
        throw new RuntimeException("A lista devolvida tem um ciclo (ponteiro next apontando para tras).");
      }
    }
    return sb.append("]").toString();
  }
}`;

function driver(corpoDoMain: string, extra = ''): string {
  return `public class Main {
  public static void main(String[] args) throws Exception {
${corpoDoMain}
  }
}

${LEITURA}
${extra}`;
}

/** Driver generico dos problemas "Design" (duas linhas: chamadas e argumentos). */
function driverDesign(classe: string, casos: string): string {
  return driver(`    List<String> linhas = Leitura.linhas();
    String[] ops = Leitura.vetorTexto(linhas.get(0));
    List<String> argumentos = Leitura.argumentos(linhas.get(1));
    List<String> saida = new ArrayList<String>();
    ${classe} obj = null;
    for (int i = 0; i < ops.length; i++) {
      int[] a = Leitura.vetorInt(argumentos.get(i));
      String op = ops[i];
${casos}
    }
    System.out.println("[" + String.join(",", saida) + "]");`);
}

export const driversPorDrill: Record<string, string> = {
  'code-prova1-pratica-lc-merge-sorted-array': driver(`    Map<String, String> p = Leitura.parametros(Leitura.entrada());
    int[] nums1 = Leitura.vetorInt(p.get("nums1"));
    int m = Integer.parseInt(p.get("m"));
    int[] nums2 = Leitura.vetorInt(p.get("nums2"));
    int n = Integer.parseInt(p.get("n"));
    new Solution().merge(nums1, m, nums2, n);
    System.out.println(Leitura.formatar(nums1));`),

  'code-prova1-pratica-lc-sort-colors': driver(`    Map<String, String> p = Leitura.parametros(Leitura.entrada());
    int[] nums = Leitura.vetorInt(p.get("nums"));
    new Solution().sortColors(nums);
    System.out.println(Leitura.formatar(nums));`),

  'code-prova1-pratica-lc-binary-search': driver(`    Map<String, String> p = Leitura.parametros(Leitura.entrada());
    int[] nums = Leitura.vetorInt(p.get("nums"));
    int target = Integer.parseInt(p.get("target"));
    System.out.println(new Solution().search(nums, target));`),

  'code-prova1-pratica-lista': driver(`    Map<String, String> p = Leitura.parametros(Leitura.entrada());
    int[] nums = Leitura.vetorInt(p.get("nums"));
    int k = new Solution().removeDuplicates(nums);
    StringBuilder sb = new StringBuilder();
    sb.append(k).append(", nums = [");
    for (int i = 0; i < nums.length; i++) {
      if (i > 0) {
        sb.append(",");
      }
      sb.append(i < k ? String.valueOf(nums[i]) : "_");
    }
    System.out.println(sb.append("]"));`),

  'code-prova1-pratica-lc-valid-parentheses': driver(`    Map<String, String> p = Leitura.parametros(Leitura.entrada());
    System.out.println(new Solution().isValid(Leitura.texto(p.get("s"))));`),

  'code-prova1-pratica-lc-min-stack': driverDesign(
    'MinStack',
    `      if (op.equals("MinStack")) {
        obj = new MinStack();
        saida.add("null");
      } else if (op.equals("push")) {
        obj.push(a[0]);
        saida.add("null");
      } else if (op.equals("pop")) {
        obj.pop();
        saida.add("null");
      } else if (op.equals("top")) {
        saida.add(String.valueOf(obj.top()));
      } else {
        saida.add(String.valueOf(obj.getMin()));
      }`,
  ),

  'code-prova1-pratica-lc-queue-using-stacks': driverDesign(
    'MyQueue',
    `      if (op.equals("MyQueue")) {
        obj = new MyQueue();
        saida.add("null");
      } else if (op.equals("push")) {
        obj.push(a[0]);
        saida.add("null");
      } else if (op.equals("pop")) {
        saida.add(String.valueOf(obj.pop()));
      } else if (op.equals("peek")) {
        saida.add(String.valueOf(obj.peek()));
      } else {
        saida.add(String.valueOf(obj.empty()));
      }`,
  ),

  'code-prova1-pratica-lc-circular-queue': driverDesign(
    'MyCircularQueue',
    `      if (op.equals("MyCircularQueue")) {
        obj = new MyCircularQueue(a[0]);
        saida.add("null");
      } else if (op.equals("enQueue")) {
        saida.add(String.valueOf(obj.enQueue(a[0])));
      } else if (op.equals("deQueue")) {
        saida.add(String.valueOf(obj.deQueue()));
      } else if (op.equals("Front")) {
        saida.add(String.valueOf(obj.Front()));
      } else if (op.equals("Rear")) {
        saida.add(String.valueOf(obj.Rear()));
      } else if (op.equals("isEmpty")) {
        saida.add(String.valueOf(obj.isEmpty()));
      } else {
        saida.add(String.valueOf(obj.isFull()));
      }`,
  ),

  'code-prova1-pratica-lc-reverse-list': driver(
    `    Map<String, String> p = Leitura.parametros(Leitura.entrada());
    ListNode head = ListNode.construir(Leitura.vetorInt(p.get("head")));
    System.out.println(ListNode.formatar(new Solution().reverseList(head)));`,
    LIST_NODE,
  ),

  'code-prova1-pratica-lc-merge-lists': driver(
    `    Map<String, String> p = Leitura.parametros(Leitura.entrada());
    ListNode list1 = ListNode.construir(Leitura.vetorInt(p.get("list1")));
    ListNode list2 = ListNode.construir(Leitura.vetorInt(p.get("list2")));
    System.out.println(ListNode.formatar(new Solution().mergeTwoLists(list1, list2)));`,
    LIST_NODE,
  ),

  'code-prova1-pratica-lc-spiral-matrix': driver(`    Map<String, String> p = Leitura.parametros(Leitura.entrada());
    int[][] matrix = Leitura.matrizInt(p.get("matrix"));
    System.out.println(Leitura.formatar(new Solution().spiralOrder(matrix)));`),

  'code-prova1-pratica-lc-pow': driver(`    Map<String, String> p = Leitura.parametros(Leitura.entrada());
    double x = Double.parseDouble(p.get("x"));
    int n = Integer.parseInt(p.get("n"));
    System.out.println(String.format(Locale.US, "%.5f", new Solution().myPow(x, n)));`),

  'code-prova1-pratica-cw-josephus-permutation': driver(`    Map<String, String> p = Leitura.parametros(Leitura.entrada());
    int[] v = Leitura.vetorInt(p.get("items"));
    List<Integer> items = new ArrayList<Integer>();
    for (int i = 0; i < v.length; i++) {
      items.add(v[i]);
    }
    int k = Integer.parseInt(p.get("k"));
    System.out.println(Leitura.formatar(Josephus.josephusPermutation(items, k)));`),

  'code-prova1-pratica-cw-dir-reduc': driver(`    Map<String, String> p = Leitura.parametros(Leitura.entrada());
    System.out.println(Leitura.formatar(DirReduction.dirReduc(Leitura.vetorTexto(p.get("arr")))));`),
};
