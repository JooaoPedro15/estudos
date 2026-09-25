import type { ProblemSample } from '../types/content';

/**
 * Exemplos oficiais (entrada/saida) dos problemas do beecrowd usados na prova
 * pratica, extraidos automaticamente das paginas publicas do juiz
 * (resources.beecrowd.com/repository/UOJ_<id>.html) — mesmos caracteres,
 * mesmas linhas em branco, mesmos espacos de alinhamento. Nao editar a mao:
 * qualquer diferenca aqui vira "saida errada" no corretor.
 */
export const beecrowdSamples: Record<string, ProblemSample[]> = {
  // 1025 - Onde está o Mármore? (limite: 2s)
  "1025": [
    {
      input: "4 1\n2\n3\n5\n1\n5\n5 2\n1\n3\n3\n3\n1\n2\n3\n0 0",
      output: "CASE# 1:\n5 found at 4\nCASE# 2:\n2 not found\n3 found at 3",
    },
  ],
  // 1029 - Fibonacci, Quantas Chamadas? (limite: 1s)
  "1029": [
    {
      input: "2\n5\n4",
      output: "fib(5) = 14 calls = 5\nfib(4) = 8 calls = 3",
    },
  ],
  // 1030 - A Lenda de Flavious Josephus (limite: 1s)
  "1030": [
    {
      input: "3\n5 2\n6 3\n1234 233",
      output: "Case 1: 3\nCase 2: 1\nCase 3: 25",
    },
  ],
  // 1031 - Crise de Energia (limite: 1s)
  "1031": [
    {
      input: "17\n0",
      output: "7",
    },
  ],
  // 1062 - Trilhos (limite: 1s)
  "1062": [
    {
      input: "5\n5 4 3 2 1\n1 2 3 4 5\n5 4 1 2 3\n0\n6\n1 3 2 5 4 6\n0\n0",
      output: "Yes\nYes\nNo\n\nYes\n",
    },
  ],
  // 1063 - Trilhos Novamente... Traçando Movimentos (limite: 1s)
  "1063": [
    {
      input: "4\ne t d a\nd a t e\n5\no s t a p\np a t o s\n0",
      output: "IIIRIRRR\nIIIIIRRR Impossible",
    },
  ],
  // 1068 - Balanço de Parênteses I (limite: 1s)
  "1068": [
    {
      input: "a+(b*c)-2-a \n(a+b*(2-c)-2+a)*2 \n(a*b-(2+c) \n2*(3-a))  \n)3+b*(2-c)( ",
      output: "correct\ncorrect\nincorrect\nincorrect\nincorrect",
    },
  ],
  // 1069 - Diamantes e Areia (limite: 1s)
  "1069": [
    {
      input: "2\n<..><.<..>>\n<<<..<......<<<<....>",
      output: "3\n1",
    },
  ],
  // 1077 - Infixa para Posfixa (limite: 1s)
  "1077": [
    {
      input: "3\nA*2\n(A*2+c-d)/2\n(2*4/a^b)/(2*c)",
      output: "A2*\nA2*c+d-2/\n24*ab^/2c*/",
    },
  ],
  // 1088 - Bolhas e Baldes (limite: 3s)
  "1088": [
    {
      input: "5 1 5 3 4 2\n5 5 1 3 4 2\n5 1 2 3 4 5\n6 3 5 2 1 4 6\n5 5 4 3 2 1\n6 6 5 4 3 2 1\n0",
      output: "Marcelo\nCarlos\nCarlos\nCarlos\nCarlos\nMarcelo",
    },
  ],
  // 1110 - Jogando Cartas Fora (limite: 1s)
  "1110": [
    {
      input: "7\n19\n10\n6\n0",
      output: "Discarded cards: 1, 3, 5, 7, 4, 2\nRemaining card: 6\nDiscarded cards: 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 4, 8, 12, 16, 2, 10, 18, 14\nRemaining card: 6\nDiscarded cards: 1, 3, 5, 7, 9, 2, 6, 10, 8\nRemaining card: 4\nDiscarded cards: 1, 3, 5, 2, 6\nRemaining card: 4",
    },
  ],
  // 1162 - Organizador de Vagões (limite: 1s)
  "1162": [
    {
      input: "3\n3\n1 3 2\n4\n4 3 2 1\n2\n2 1",
      output: "Optimal train swapping takes 1 swaps.\nOptimal train swapping takes 6 swaps.\nOptimal train swapping takes 1 swaps.",
    },
  ],
  // 1171 - Frequência de Números (limite: 1s)
  "1171": [
    {
      input: "7\n8\n10\n8\n260\n4\n10\n10",
      output: "4 aparece 1 vez(es)\n8 aparece 2 vez(es)\n10 aparece 3 vez(es)\n260 aparece 1 vez(es)",
    },
  ],
  // 1180 - Menor e Posição (limite: 1s)
  "1180": [
    {
      input: "10\n1 2 3 4 -5 6 7 8 9 10",
      output: "Menor valor: -5\nPosicao: 4",
    },
  ],
  // 1242 - Ácido Ribonucleico Alienígena (limite: 1s)
  "1242": [
    {
      input: "SBC\nFCC\nSFBC\nSFBCFSCB\nCFCBSFFSBCCB",
      output: "1\n1\n0\n4\n5",
    },
  ],
  // 1251 - Diga-me a Frequência (limite: 1s)
  "1251": [
    {
      input: "AAABBC\n122333",
      output: "67 1\n66 2\n65 3\n\n49 1\n50 2\n51 3",
    },
  ],
  // 1252 - Sort! Sort!! e Sort!!! (limite: 2s)
  "1252": [
    {
      input: "15 3\n1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13\n14\n15\n3 3\n9\n12\n10\n0 0",
      output: "15 3\n15\n9\n3\n6\n12\n13\n7\n1\n4\n10\n11\n5\n2\n8\n14\n3 3\n9\n12\n10\n0 0",
    },
  ],
  // 1258 - Camisetas (limite: 1s)
  "1258": [
    {
      input: "9\nMaria Jose\nbranco P\nMangojata Mancuda\nvermelho P\nCezar Torres Mo\nbranco P\nBaka Lhau\nvermelho P\nJuJu Mentina\nbranco M\nAmaro Dinha\nvermelho P\nAdabi Finho\nbranco G\nSeverina Rigudinha\nbranco G\nCarlos Chade Losna\nvermelho P\n3\nMaria Joao\nbranco P\nMarcio Guess\nvermelho P\nMaria Jose\nbranco P\n0",
      output: "branco P Cezar Torres Mo\nbranco P Maria Jose\nbranco M JuJu Mentina\nbranco G Adabi Finho\nbranco G Severina Rigudinha\nvermelho P Amaro Dinha\nvermelho P Baka Lhau\nvermelho P Carlos Chade Losna\nvermelho P Mangojata Mancuda\n\nbranco P Maria Joao\nbranco P Maria Jose\nvermelho P Marcio Guess",
    },
  ],
  // 1259 - Pares e Ímpares (limite: 1s)
  "1259": [
    {
      input: "10\n4\n32\n34\n543\n3456\n654\n567\n87\n6789\n98",
      output: "4\n32\n34\n98\n654\n3456\n6789\n567\n543\n87",
    },
  ],
  // 1340 - Eu Posso Adivinhar a Estrutura de Dados! (limite: 2s)
  "1340": [
    {
      input: "6\n1 1\n1 2\n1 3\n2 1\n2 2\n2 3\n6\n1 1\n1 2\n1 3\n2 3\n2 2\n2 1\n2\n1 1\n2 2\n4\n1 2\n1 1\n2 1\n2 2\n7\n1 2\n1 5\n1 1\n1 3\n2 5\n1 4\n2 4",
      output: "queue\nnot sure\nimpossible\nstack\npriority queue",
    },
  ],
  // 1478 - Matriz Quadrada II (limite: 1s)
  "1478": [
    {
      input: "1\n2\n3\n4\n5\n0",
      output: "  1\n\n  1   2\n  2   1\n\n  1   2   3\n  2   1   2\n  3   2   1\n\n  1   2   3   4\n  2   1   2   3\n  3   2   1   2\n  4   3   2   1\n\n  1   2   3   4   5\n  2   1   2   3   4\n  3   2   1   2   3\n  4   3   2   1   2\n  5   4   3   2   1\n",
    },
  ],
  // 1523 - Estacionamento Linear (limite: 1s)
  "1523": [
    {
      input: "3 2\n1 10\n2 5\n6 9\n3 2\n1 10\n2 5\n6 12\n0 0",
      output: "Sim\nNao",
    },
  ],
  // 1548 - Fila do Recreio (limite: 1s)
  "1548": [
    {
      input: "3\n3\n100 80 90\n4\n100 120 30 50\n4\n100 90 30 25",
      output: "1\n0\n4",
    },
  ],
  // 1566 - Altura (limite: 4s)
  "1566": [
    {
      input: "6\n10\n65 31 37 37 72 76 61 35 57 37\n12\n45 186 185 55 51 51 22 78 64 26 49 21\n10\n20 93 203 67 64 225 112 81 58 180\n8\n169 189 220 228 68 32 214 180\n6\n133 55 67 166 112 41\n4\n39 38 120 55",
      output: "31 35 37 37 37 57 61 65 72 76\n21 22 26 45 49 51 51 55 64 78 185 186\n20 58 64 67 81 93 112 180 203 225\n32 68 169 180 189 214 220 228\n41 55 67 112 133 166\n38 39 55 120",
    },
  ],
  // 1609 - Contando Carneirinhos (limite: 1s)
  "1609": [
    {
      input: "3\n3\n1 2 3\n3\n1 2 1\n5\n100 1 1 0 0",
      output: "3\n2\n3",
    },
  ],
  // 1766 - O Elfo Das Trevas (limite: 2s)
  "1766": [
    {
      input: "1\n9 5\nRudolph 50 100 1.12\nDasher 10 121 1.98\nDancer 10 131 1.14\nPrancer 7 142 1.36\nVixen 50 110 1.42\nComet 50 121 1.21\nCupid 50 107 1.45\nDonner 30 106 1.23\nBlitzen 50 180 1.84",
      output: "CENARIO {1}\n1 - Rudolph\n2 - Cupid\n3 - Vixen\n4 - Comet\n5 - Blitzen",
    },
  ],
  // 2381 - Lista de Chamada (limite: 1s)
  "2381": [
    {
      input: "5 1\nmaria\njoao\ncarlos\nvanessa\njose",
      output: "carlos",
    },
    {
      input: "5 5\nmaria\njoao\ncarlos\nvanessa\njose",
      output: "vanessa",
    },
    {
      input: "5 3\nmaria\njoao\ncarlos\nvanessa\njose",
      output: "jose",
    },
  ],
  // 2448 - Carteiro (limite: 1s)
  "2448": [
    {
      input: "5 5\n1 5 10 20 40\n10 20 10 40 1",
      output: "10",
    },
    {
      input: "3 4\n50 80 100\n80 80 100 50",
      output: "4",
    },
  ],
  // 2929 - Menor da Pilha (limite: 1s)
  "2929": [
    {
      input: "11\nPUSH 5\nPUSH 7\nPUSH 3\nPUSH 8\nPUSH 10\nMIN\nPOP\nPOP\nMIN\nPOP\nMIN",
      output: "3\n3\n5",
    },
    {
      input: "9\nPUSH 100\nPUSH 50\nMIN\nPUSH 45\nMIN\nPOP\nMIN\nPOP\nMIN",
      output: "50\n45\n50\n100",
    },
  ],
  // 3160 - Amigos (limite: 1s)
  "3160": [
    {
      input: "Jones Pedro Carlos Lucas\nJuca Valdineia Jovander\nCarlos",
      output: "Jones Pedro Juca Valdineia Jovander Carlos Lucas",
    },
    {
      input: "Jones Pedro Carlos Lucas\nJuca Valdineia Jovander\nnao",
      output: "Jones Pedro Carlos Lucas Juca Valdineia Jovander",
    },
  ],
};

export function samplesDoBeecrowd(problemId: string): ProblemSample[] {
  const samples = beecrowdSamples[problemId];
  if (!samples) {
    throw new Error(`Sem exemplos oficiais cadastrados para o beecrowd ${problemId}`);
  }
  return samples;
}
