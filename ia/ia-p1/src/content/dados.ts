/**
 * Bases de dados copiadas do material (slides, prova de 2025, CSVs e
 * notebooks). Cada base diz de onde veio. As questoes numericas calculam o
 * gabarito em cima destas bases com as funcoes de `engine/calc.ts`.
 */

/** Prova 2025, Q12: 15 instancias. Colunas: Raciocinio_Logico, Horas_Estudo, Iniciativa_Projetos, Sucesso. */
export const BASE_SUCESSO_15: string[][] = [
  ['Alto', 'Muito', 'Sim', 'Bem sucedido'],
  ['Médio', 'Moderado', 'Não', 'Mal sucedido'],
  ['Alto', 'Moderado', 'Sim', 'Bem sucedido'],
  ['Baixo', 'Pouco', 'Não', 'Mal sucedido'],
  ['Médio', 'Muito', 'Sim', 'Bem sucedido'],
  ['Baixo', 'Pouco', 'Não', 'Mal sucedido'],
  ['Médio', 'Moderado', 'Não', 'Mal sucedido'],
  ['Alto', 'Muito', 'Sim', 'Bem sucedido'],
  ['Médio', 'Pouco', 'Não', 'Mal sucedido'],
  ['Alto', 'Moderado', 'Sim', 'Bem sucedido'],
  ['Médio', 'Moderado', 'Sim', 'Bem sucedido'],
  ['Baixo', 'Pouco', 'Não', 'Mal sucedido'],
  ['Alto', 'Muito', 'Sim', 'Bem sucedido'],
  ['Médio', 'Moderado', 'Não', 'Mal sucedido'],
  ['Alto', 'Muito', 'Sim', 'Bem sucedido'],
];

/** Prova 2025, Q13: a base da Q12 com mais 2 instancias (17). */
export const BASE_SUCESSO_17: string[][] = [
  ...BASE_SUCESSO_15,
  ['Médio', 'Muito', 'Não', 'Bem sucedido'],
  ['Alto', 'Moderado', 'Sim', 'Mal sucedido'],
];

export const ATRIBUTOS_SUCESSO = ['Raciocínio_Lógico', 'Horas_Estudo', 'Iniciativa_Projetos'];

/** Base "Vai esperar?" do restaurante (slides AD Parte 2, slide 5; notebook do restaurante). */
export const ATRIBUTOS_RESTAURANTE = ['Alternativo', 'Bar', 'Sex/Sab', 'Fome', 'Cliente', 'Preço', 'Chuva', 'Res', 'Tipo', 'Tempo'];
export const BASE_RESTAURANTE: string[][] = [
  ['Sim', 'Não', 'Não', 'Sim', 'Alguns', 'RRR', 'Não', 'Sim', 'Francês', '0-10', 'Sim'],
  ['Sim', 'Não', 'Não', 'Sim', 'Cheio', 'R', 'Não', 'Não', 'Tailandês', '30-60', 'Não'],
  ['Não', 'Sim', 'Não', 'Não', 'Alguns', 'R', 'Não', 'Não', 'Hamburger', '0-10', 'Sim'],
  ['Sim', 'Não', 'Sim', 'Sim', 'Cheio', 'R', 'Sim', 'Não', 'Tailandês', '10-30', 'Sim'],
  ['Sim', 'Não', 'Sim', 'Não', 'Cheio', 'RRR', 'Não', 'Sim', 'Francês', '>60', 'Não'],
  ['Não', 'Sim', 'Não', 'Sim', 'Alguns', 'RR', 'Sim', 'Sim', 'Italiano', '0-10', 'Sim'],
  ['Não', 'Sim', 'Não', 'Não', 'Nenhum', 'R', 'Sim', 'Não', 'Hamburger', '0-10', 'Não'],
  ['Não', 'Não', 'Não', 'Sim', 'Alguns', 'RR', 'Sim', 'Sim', 'Tailandês', '0-10', 'Sim'],
  ['Não', 'Sim', 'Sim', 'Não', 'Cheio', 'R', 'Sim', 'Não', 'Hamburger', '>60', 'Não'],
  ['Sim', 'Sim', 'Sim', 'Sim', 'Cheio', 'RRR', 'Não', 'Sim', 'Italiano', '10-30', 'Não'],
  ['Não', 'Não', 'Não', 'Não', 'Nenhum', 'R', 'Não', 'Não', 'Tailandês', '0-10', 'Não'],
  ['Sim', 'Sim', 'Sim', 'Sim', 'Cheio', 'R', 'Não', 'Não', 'Hamburger', '30-60', 'Sim'],
];

/** Base "Jogar tênis" (Introdução a AM, slide 3; Naive Bayes, slide 8). */
export const ATRIBUTOS_TENIS = ['Aparência', 'Temperatura', 'Umidade', 'Ventando'];
export const BASE_TENIS: string[][] = [
  ['Sol', 'Quente', 'Alta', 'Não', 'Não'],
  ['Sol', 'Quente', 'Alta', 'Sim', 'Não'],
  ['Nublado', 'Quente', 'Alta', 'Não', 'Sim'],
  ['Chuva', 'Agradável', 'Alta', 'Não', 'Sim'],
  ['Chuva', 'Fria', 'Normal', 'Não', 'Sim'],
  ['Chuva', 'Fria', 'Normal', 'Sim', 'Não'],
  ['Nublado', 'Fria', 'Normal', 'Sim', 'Sim'],
  ['Sol', 'Agradável', 'Alta', 'Não', 'Não'],
  ['Sol', 'Fria', 'Normal', 'Não', 'Sim'],
  ['Chuva', 'Agradável', 'Normal', 'Não', 'Sim'],
  ['Sol', 'Agradável', 'Normal', 'Sim', 'Sim'],
  ['Nublado', 'Agradável', 'Alta', 'Sim', 'Sim'],
  ['Nublado', 'Quente', 'Normal', 'Não', 'Sim'],
  ['Chuva', 'Agradável', 'Alta', 'Sim', 'Não'],
];

/** Base de risco de credito (Naive Bayes, slide 3). */
export const ATRIBUTOS_CREDITO = ['História do crédito', 'Dívida', 'Garantias', 'Renda anual'];
export const BASE_CREDITO: string[][] = [
  ['Ruim', 'Alta', 'Nenhuma', '<15000', 'Alto'],
  ['Desconhecida', 'Alta', 'Nenhuma', '>=15000 a <=35000', 'Alto'],
  ['Desconhecida', 'Baixa', 'Nenhuma', '>=15000 a <=35000', 'Moderado'],
  ['Desconhecida', 'Baixa', 'Nenhuma', '>35000', 'Alto'],
  ['Desconhecida', 'Baixa', 'Nenhuma', '>35000', 'Baixo'],
  ['Desconhecida', 'Baixa', 'Adequada', '>35000', 'Baixo'],
  ['Ruim', 'Baixa', 'Nenhuma', '<15000', 'Alto'],
  ['Ruim', 'Baixa', 'Adequada', '>35000', 'Moderado'],
  ['Boa', 'Baixa', 'Nenhuma', '>35000', 'Baixo'],
  ['Boa', 'Alta', 'Adequada', '>35000', 'Baixo'],
  ['Boa', 'Alta', 'Nenhuma', '<15000', 'Alto'],
  ['Boa', 'Alta', 'Nenhuma', '>=15000 a <=35000', 'Moderado'],
  ['Boa', 'Alta', 'Nenhuma', '>35000', 'Baixo'],
  ['Ruim', 'Alta', 'Nenhuma', '>=15000 a <=35000', 'Alto'],
];

/** "PãoeManteiga SimNao.csv" (= Apriori, slide 3): uma transacao por linha. */
export const ITENS_PAO_MANTEIGA = ['Leite', 'Café', 'Cerveja', 'Pão', 'Manteiga', 'Arroz', 'Feijão'];
export const TRANSACOES_PAO_MANTEIGA: string[][] = [
  ['Café', 'Pão', 'Manteiga'],
  ['Leite', 'Cerveja', 'Pão', 'Manteiga'],
  ['Café', 'Pão', 'Manteiga'],
  ['Leite', 'Café', 'Pão', 'Manteiga'],
  ['Cerveja'],
  ['Manteiga'],
  ['Pão'],
  ['Feijão'],
  ['Arroz', 'Feijão'],
  ['Arroz'],
];

/** Exemplo de suporte com itens a..e (Regras de associação, slide 8). */
export const TRANSACOES_AE: string[][] = [
  ['a', 'd', 'e'],
  ['b', 'c', 'd'],
  ['a', 'c', 'e'],
  ['a', 'c', 'd', 'e'],
  ['a', 'e'],
  ['a', 'c', 'd'],
  ['b', 'c'],
  ['a', 'c', 'd', 'e'],
  ['b', 'c', 'e'],
  ['a', 'd', 'e'],
];

/** Apriori.ipynb (sem os 'nan'): 7 transacoes. */
export const TRANSACOES_NOTEBOOK: string[][] = [
  ['Detergente', 'Limao', 'Feijão'],
  ['Alcool', 'Detergente', 'Limao'],
  ['Alcool', 'Detergente', 'arroz'],
  ['Limao'],
  ['Limao'],
  ['Alcool', 'Limao', 'arroz', 'Feijão'],
  ['Alcool', 'Detergente', 'Limao'],
];

export const conjuntos = (transacoes: string[][]): Set<string>[] => transacoes.map((t) => new Set(t));

/** Matriz do exemplo dos slides (Métricas de avaliação, slide 5). Linhas = real. */
export const MATRIZ_SLIDE: number[][] = [
  [11, 1, 3],
  [1, 4, 0],
  [2, 1, 6],
];

/** Prova 2025, Q7: classes A, B, C. Linhas = real. */
export const MATRIZ_PROVA_Q7: number[][] = [
  [40, 5, 15],
  [5, 50, 5],
  [2, 3, 60],
];

/** NaiveBayes.ipynb: confusion_matrix(y_teste, previsoes) na Iris. */
export const MATRIZ_NB_IRIS: number[][] = [
  [11, 0, 0],
  [0, 13, 0],
  [0, 1, 5],
];

/** Codifica imputa e balanceia.ipynb: RF sem balancear (no-recurrence, recurrence). */
export const MATRIZ_CANCER_RF: number[][] = [
  [33, 3],
  [14, 8],
];
