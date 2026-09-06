import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, vi } from 'vitest';

import { App } from './App';

beforeEach(() => {
  window.localStorage.clear();
  vi.spyOn(Math, 'random').mockReturnValue(0.999);
});

afterEach(() => {
  vi.restoreAllMocks();
});

/**
 * Painel dinamico de Provas (Simulado/Treino/pickers): o nome acessivel
 * muda a cada passo da cascata, entao escopamos pelo container estavel em
 * vez de tentar casar o nome toda hora.
 */
function examPanel(): HTMLElement {
  const panel = document.querySelector('.exam-panel');
  if (!panel) {
    throw new Error('exam-panel nao encontrado');
  }
  return panel as HTMLElement;
}

/** Abre a aba "Provas", escolhe uma prova e chega no simulado dela. */
async function openSimulado(user: ReturnType<typeof userEvent.setup>, examName: RegExp) {
  await user.click(screen.getByRole('button', { name: 'Provas' }));
  await user.click(within(examPanel()).getByRole('button', { name: examName }));
  if (examName.source !== /Reavaliacao/.source) {
    await user.click(within(examPanel()).getByRole('button', { name: /Prova teorica/ }));
  }
  await user.click(within(examPanel()).getByRole('button', { name: /Simulado/ }));
  return examPanel;
}

/** Abre a aba "Provas", escolhe uma prova e chega na selecao de modulos do treino. */
async function openTreinar(user: ReturnType<typeof userEvent.setup>, examName: RegExp) {
  await user.click(screen.getByRole('button', { name: 'Provas' }));
  await user.click(within(examPanel()).getByRole('button', { name: examName }));
  if (examName.source !== /Reavaliacao/.source) {
    await user.click(within(examPanel()).getByRole('button', { name: /Prova teorica/ }));
  }
  await user.click(within(examPanel()).getByRole('button', { name: /Treinar/ }));
  return examPanel;
}

test('renderiza a dashboard inicial da AEDS II', () => {
  render(<App />);

  expect(screen.getByRole('main')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Sala de estudo' })).toBeInTheDocument();
  expect(screen.getByText('AEDS II · PUC Minas')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Provas' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Conceitual' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Desenho' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Estruturas' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Caderno de erros' })).toBeInTheDocument();
});

test('Provas abre com a escolha de prova (Prova 1/2/3/Reavaliacao)', async () => {
  const user = userEvent.setup();

  render(<App />);

  await user.click(screen.getByRole('button', { name: 'Provas' }));
  const provas = screen.getByRole('region', { name: 'Escolha o que estudar' });

  expect(within(provas).getByRole('button', { name: /Prova 1/ })).toBeInTheDocument();
  expect(within(provas).getByRole('button', { name: /Prova 2/ })).toBeInTheDocument();
  expect(within(provas).getByRole('button', { name: /Prova 3/ })).toBeInTheDocument();
  expect(within(provas).getByRole('button', { name: /Reavaliacao/ })).toBeInTheDocument();
});

test('Reavaliacao pula direto pra treinar/simulado (so tem prova teorica)', async () => {
  const user = userEvent.setup();

  render(<App />);

  await user.click(screen.getByRole('button', { name: 'Provas' }));
  const provas = screen.getByRole('region', { name: 'Escolha o que estudar' });
  await user.click(within(provas).getByRole('button', { name: /Reavaliacao/ }));

  const next = screen.getByRole('region', { name: /Reavaliacao/ });
  expect(within(next).getByRole('button', { name: /Treinar/ })).toBeInTheDocument();
  expect(within(next).getByRole('button', { name: /Simulado/ })).toBeInTheDocument();
  expect(within(next).queryByRole('button', { name: /Prova teorica/ })).not.toBeInTheDocument();
});

test('Prova 1 pede teorica ou pratica antes de treinar ou simular', async () => {
  const user = userEvent.setup();

  render(<App />);

  await user.click(screen.getByRole('button', { name: 'Provas' }));
  const provas = screen.getByRole('region', { name: 'Escolha o que estudar' });
  await user.click(within(provas).getByRole('button', { name: /Prova 1/ }));

  const section = screen.getByRole('region', { name: /Prova 1/ });
  expect(within(section).getByRole('button', { name: /Prova teorica/ })).toBeInTheDocument();
  expect(within(section).getByRole('button', { name: /Prova pratica/ })).toBeInTheDocument();

  await user.click(within(section).getByRole('button', { name: /Prova pratica/ }));

  expect(screen.getAllByText(/prova pratica/i).length).toBeGreaterThan(0);
});

test('envia erro do simulado para o caderno adaptativo', async () => {
  const user = userEvent.setup();

  render(<App />);
  await openSimulado(user, /Reavaliacao/);

  await user.click(screen.getByRole('button', { name: 'O(n)' }));
  await user.click(screen.getByRole('button', { name: /responder/i }));

  expect(await screen.findByText('Resposta incorreta.')).toBeInTheDocument();

  // Caderno de erros mora na dashboard, nao junto do exercicio.
  await user.click(screen.getByRole('button', { name: 'Voltar para a sala de estudo' }));
  expect(screen.getByText(/Limites de somatorio/)).toBeInTheDocument();
});

test('abre a selecao de modulos antes de comecar o treino', async () => {
  const user = userEvent.setup();

  render(<App />);
  const training = await openTreinar(user, /Reavaliacao/);

  expect(within(training()).getByRole('button', { name: /Conteudo inteiro/ })).toBeInTheDocument();
  expect(within(training()).getByRole('button', { name: /Arvore TRIE/ })).toBeInTheDocument();
  expect(within(training()).getByRole('button', { name: /Algoritmos de ordenacao/ })).toBeInTheDocument();
});

test('abre o modo Conceitual sem misturar questoes de desenho', async () => {
  const user = userEvent.setup();

  render(<App />);

  await user.click(screen.getByRole('button', { name: 'Conceitual' }));
  const conceptual = screen.getByRole('region', { name: 'Conceitual' });

  expect(within(conceptual).getByRole('button', { name: /Conteudo inteiro/ })).toBeInTheDocument();
  expect(within(conceptual).queryByRole('button', { name: /Questoes de desenho/ })).not.toBeInTheDocument();

  await user.click(within(conceptual).getByRole('button', { name: /Conteudo inteiro/ }));

  expect(screen.getByText('Modulo: Conteudo inteiro')).toBeInTheDocument();
  expect(screen.getByText('Questao conceitual')).toBeInTheDocument();
  expect(screen.queryByText('Alternativas visuais')).not.toBeInTheDocument();
  expect(within(conceptual).getByRole('button', { name: /Responder/ })).toBeDisabled();

  await user.click(within(conceptual).getAllByRole('button', { name: /^A\./ })[0]);
  await user.click(within(conceptual).getByRole('button', { name: /Responder/ }));

  expect(await screen.findByText(/Resposta correta|Resposta incorreta/)).toBeInTheDocument();
  expect(screen.getByText(/pts · conceitual/)).toBeInTheDocument();
  expect(await screen.findByText(/Lista 2/)).toBeInTheDocument();
});

test('questao conceitual mostra feedback antes de avancar e limpa ao ir para a proxima', async () => {
  const user = userEvent.setup();

  render(<App />);

  await user.click(screen.getByRole('button', { name: 'Conceitual' }));
  const conceptual = screen.getByRole('region', { name: 'Conceitual' });
  await user.click(within(conceptual).getByRole('button', { name: /Conteudo inteiro/ }));

  expect(screen.getByText('Q1 - Somatorio e formula fechada')).toBeInTheDocument();

  await user.click(within(conceptual).getAllByRole('button', { name: /^A\./ })[0]);
  await user.click(within(conceptual).getByRole('button', { name: /Responder/ }));

  expect(screen.getByText('Q1 - Somatorio e formula fechada')).toBeInTheDocument();
  expect(await screen.findByRole('status')).toHaveTextContent(/Resposta correta|Resposta incorreta/);
  expect(within(conceptual).queryByRole('button', { name: /Responder/ })).not.toBeInTheDocument();

  await user.click(within(conceptual).getByRole('button', { name: /Pr.xima/ }));

  expect(screen.getByText('Q2 - Funcao exata e ordem assintotica')).toBeInTheDocument();
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
  expect(within(conceptual).getByRole('button', { name: /Responder/ })).toBeDisabled();
});

test('abre o modo Desenho separado com alternativas visuais', async () => {
  const user = userEvent.setup();

  render(<App />);

  await user.click(screen.getByRole('button', { name: 'Desenho' }));
  const drawing = screen.getByRole('region', { name: 'Desenho' });

  expect(within(drawing).getByRole('button', { name: /Conteudo inteiro/ })).toBeInTheDocument();
  expect(within(drawing).queryByRole('button', { name: /Questoes conceituais/ })).not.toBeInTheDocument();

  await user.click(within(drawing).getByRole('button', { name: /Conteudo inteiro/ }));

  expect(screen.getByText('Modulo: Conteudo inteiro')).toBeInTheDocument();
  expect(screen.getByText('Alternativas visuais')).toBeInTheDocument();
  expect(screen.getAllByRole('img', { name: /Desenho:/i }).length).toBeGreaterThanOrEqual(4);
  expect(within(drawing).getByRole('button', { name: /Responder/ })).toBeDisabled();

  await user.click(within(drawing).getAllByRole('button', { name: /^A\./ })[0]);
  await user.click(within(drawing).getByRole('button', { name: /Responder/ }));

  expect(await screen.findByText(/Resposta correta|Resposta incorreta/)).toBeInTheDocument();
  expect(screen.getByText(/pts · desenho/)).toBeInTheDocument();
  expect(await screen.findByText(/Lista 2/)).toBeInTheDocument();
});

test('questao de desenho tem uma demonstracao interativa no topo e alternativas estaticas', async () => {
  const user = userEvent.setup();

  render(<App />);

  await user.click(screen.getByRole('button', { name: 'Desenho' }));
  const drawing = screen.getByRole('region', { name: 'Desenho' });
  await user.click(within(drawing).getByRole('button', { name: /Conteudo inteiro/ }));

  expect(within(drawing).getAllByRole('img', { name: /Visualiza/i })).toHaveLength(1);
  expect(within(drawing).getAllByRole('group', { name: /Controles da anima/i })).toHaveLength(1);
  expect(within(drawing).getAllByRole('img', { name: /Desenho:/i })).toHaveLength(4);
});

test('conteudo inteiro inicia o treino com uso rapido ou maratona', async () => {
  const user = userEvent.setup();

  render(<App />);
  const training = await openTreinar(user, /Reavaliacao/);
  await user.click(within(training()).getByRole('button', { name: /Conteudo inteiro/ }));

  expect(screen.getByText('Modulo: Conteudo inteiro')).toBeInTheDocument();
  expect(screen.getByText('Arvore: caso base para contar nos')).toBeInTheDocument();
  expect(screen.getByText(/class No/)).toBeInTheDocument();
  expect(screen.getByText('Arvore binaria')).toBeInTheDocument();
  expect(screen.getByLabelText('Resposta')).toHaveAttribute('placeholder', 'Escreva a funcao completa');
});

test('modulo especifico foca no conteudo e permite trocar', async () => {
  const user = userEvent.setup();

  render(<App />);
  const training = await openTreinar(user, /Reavaliacao/);
  await user.click(within(training()).getByRole('button', { name: /Somatorios/ }));

  expect(screen.getByText('Modulo: Somatorios')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Sair' }));

  expect(within(training()).getByRole('button', { name: /Conteudo inteiro/ })).toBeInTheDocument();
});

test('mostra explicacao linha a linha quando a pessoa pede ensino', async () => {
  const user = userEvent.setup();

  render(<App />);
  const training = await openTreinar(user, /Reavaliacao/);
  await user.click(within(training()).getByRole('button', { name: /Conteudo inteiro/ }));
  await user.click(screen.getByRole('button', { name: 'Me ensine' }));

  const teaching = screen.getByLabelText('Explicacao guiada');

  expect(within(teaching).getByText(/private int contar/)).toBeInTheDocument();
  expect(within(teaching).getByText(/Subarvore vazia/)).toBeInTheDocument();
});
