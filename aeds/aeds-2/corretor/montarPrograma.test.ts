import { describe, expect, test } from 'vitest';

import { declaraClasse, metodosDeclarados, montarPrograma, stubsDoEsqueleto } from './montarPrograma';

const ESQUELETO = `import java.util.Scanner;

public class Principal {
  public static void main(String[] args) {
    Scanner in = new Scanner(System.in);
    System.out.println(dobro(in.nextInt()) + soma(1, 2));
  }

  static int dobro(int x) {
    // implementar
  }

  static int soma(int a, int b) {
    // implementar
  }
}`;

describe('montarPrograma', () => {
  test('acha os stubs (corpo so com comentario) e ignora o main', () => {
    expect(stubsDoEsqueleto(ESQUELETO).map((stub) => stub.nome)).toEqual(['dobro', 'soma']);
  });

  test('reconhece metodos declarados sem confundir com if/for/while', () => {
    const nomes = metodosDeclarados(`static int dobro(int x) {
  if (x > 0) {
    for (int i = 0; i < 1; i++) {
    }
  }
  return 2 * x;
}
public MinStack() {
}`);
    expect([...nomes].sort()).toEqual(['MinStack', 'dobro']);
  });

  test('metodo do aluno substitui o stub de mesmo nome; o outro stub fica', () => {
    const programa = montarPrograma(ESQUELETO, 'static int dobro(int x) {\n  return 2 * x;\n}');
    expect(programa.arquivo).toBe('Principal.java');
    expect(programa.classePrincipal).toBe('Principal');
    expect(programa.codigo).toContain('return 2 * x;');
    expect(programa.codigo.match(/static int dobro/g)).toHaveLength(1);
    expect(programa.codigo).toContain('static int soma(int a, int b)');
  });

  test('programa inteiro do aluno e usado no lugar do esqueleto, com o nome da classe publica', () => {
    const programa = montarPrograma(ESQUELETO, 'import java.io.*;\npublic class Main {\n  public static void main(String[] a) {}\n}');
    expect(declaraClasse('public class Main {')).toBe(true);
    expect(programa.arquivo).toBe('Main.java');
    expect(programa.codigo).not.toContain('dobro');
    expect(programa.codigo.startsWith('import java.io.*;')).toBe(true);
  });

  test('com driver (LeetCode), a classe do aluno perde o public e os imports sobem pro topo', () => {
    const esqueleto = 'import java.util.List;\n\npublic class Josephus {\n  public static int f(int x) {\n    // implementar\n  }\n}';
    const programa = montarPrograma(esqueleto, 'public static int f(int x) {\n  return x;\n}', 'public class Main {\n  public static void main(String[] a) {}\n}');
    expect(programa.arquivo).toBe('Main.java');
    expect(programa.classePrincipal).toBe('Main');
    expect(programa.codigo).toContain('\nclass Josephus {');
    expect(programa.codigo).not.toContain('public class Josephus');
    expect(programa.codigo.indexOf('import java.util.List;')).toBeLessThan(programa.codigo.indexOf('public class Main'));
  });
});
