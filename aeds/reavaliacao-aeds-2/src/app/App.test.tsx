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

test('renderiza a experiencia principal da Reavaliacao AEDS II', () => {
  render(<App />);

  expect(screen.getByRole('main')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Reavaliacao AEDS II' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Conceitual' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Desenho' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Conceituais e Desenho' })).not.toBeInTheDocument();
  expect(screen.getByText('Lacos aninhados')).toBeInTheDocument();
  expect(screen.getByText('Estrutura Doidona')).toBeInTheDocument();
  expect(screen.getByText('Arvore TRIE')).toBeInTheDocument();
  expect(screen.getByText('Arvore AVL')).toBeInTheDocument();
  expect(screen.getByText('Somatorios')).toBeInTheDocument();
});

test('envia erro do simulado para o caderno adaptativo', async () => {
  const user = userEvent.setup();

  render(<App />);

  await user.click(screen.getByRole('button', { name: 'O(n)' }));
  await user.click(screen.getByRole('button', { name: /responder/i }));

  expect(await screen.findByText('Resposta incorreta.')).toBeInTheDocument();
  expect(screen.getByText('Limites de somatorio')).toBeInTheDocument();
});

test('abre a selecao de modulos antes de comecar o treino', async () => {
  const user = userEvent.setup();

  render(<App />);

  await user.click(screen.getByRole('button', { name: 'Treino de Codigo' }));
  const training = screen.getByRole('region', { name: 'Treino de Codigo' });

  expect(within(training).getByRole('button', { name: /Conteudo inteiro/ })).toBeInTheDocument();
  expect(within(training).getByRole('button', { name: /Arvore TRIE/ })).toBeInTheDocument();
  expect(within(training).getByRole('button', { name: /Algoritmos de ordenacao/ })).toBeInTheDocument();
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
  expect(screen.getAllByRole('img', { name: /Visualiza/i }).length).toBeGreaterThanOrEqual(4);
  expect(within(drawing).getByRole('button', { name: /Responder/ })).toBeDisabled();

  await user.click(within(drawing).getAllByRole('button', { name: /^A\./ })[0]);
  await user.click(within(drawing).getByRole('button', { name: /Responder/ }));

  expect(await screen.findByText(/Resposta correta|Resposta incorreta/)).toBeInTheDocument();
  expect(screen.getByText(/pts · desenho/)).toBeInTheDocument();
  expect(await screen.findByText(/Lista 2/)).toBeInTheDocument();
});

test('conteudo inteiro inicia o treino com uso rapido ou maratona', async () => {
  const user = userEvent.setup();

  render(<App />);
  const training = () => screen.getByRole('region', { name: 'Treino de Codigo' });

  await user.click(screen.getByRole('button', { name: 'Treino de Codigo' }));
  await user.click(within(training()).getByRole('button', { name: /Conteudo inteiro/ }));

  expect(screen.getByText('Modulo: Conteudo inteiro')).toBeInTheDocument();
  expect(screen.getByText('Arvore: caso base para contar nos')).toBeInTheDocument();
  expect(within(training()).getByRole('button', { name: 'Pegar 2 questoes' })).toBeInTheDocument();
  expect(within(training()).getByRole('button', { name: 'Maratona' })).toBeInTheDocument();
  expect(screen.getByText(/class No/)).toBeInTheDocument();
  expect(screen.getByText('Arvore binaria')).toBeInTheDocument();
  expect(screen.getByLabelText('Resposta')).toHaveAttribute('placeholder', 'Escreva a funcao completa');
});

test('modulo especifico foca no conteudo e permite trocar', async () => {
  const user = userEvent.setup();

  render(<App />);
  const training = () => screen.getByRole('region', { name: 'Treino de Codigo' });

  await user.click(screen.getByRole('button', { name: 'Treino de Codigo' }));
  await user.click(within(training()).getByRole('button', { name: /Somatorios/ }));

  expect(screen.getByText('Modulo: Somatorios')).toBeInTheDocument();

  await user.click(within(training()).getByRole('button', { name: /Trocar modulo/ }));

  expect(within(training()).getByRole('button', { name: /Conteudo inteiro/ })).toBeInTheDocument();
});

test('mostra explicacao linha a linha quando a pessoa pede ensino', async () => {
  const user = userEvent.setup();

  render(<App />);
  const training = () => screen.getByRole('region', { name: 'Treino de Codigo' });

  await user.click(screen.getByRole('button', { name: 'Treino de Codigo' }));
  await user.click(within(training()).getByRole('button', { name: /Conteudo inteiro/ }));
  await user.click(screen.getByRole('button', { name: 'Me ensine' }));

  const teaching = screen.getByLabelText('Explicacao guiada');

  expect(within(teaching).getByText(/private int contar/)).toBeInTheDocument();
  expect(within(teaching).getByText(/Subarvore vazia/)).toBeInTheDocument();
});
