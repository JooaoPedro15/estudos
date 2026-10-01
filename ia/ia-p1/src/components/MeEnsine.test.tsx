import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { questao } from '../content';
import { EstudoProvider, useEstudo } from '../state/EstudoContext';
import { saveVazio } from '../state/save';
import { QuestionCard } from './QuestionCard';

function Caderno() {
  const { save } = useEstudo();
  return <output data-testid="caderno">{Object.keys(save.caderno).join(',')}</output>;
}

function montar(id: string) {
  window.localStorage.clear();
  return render(
    <EstudoProvider inicial={saveVazio()}>
      <QuestionCard questao={questao(id)!} />
      <Caderno />
    </EstudoProvider>,
  );
}

describe('Me ensine', () => {
  it('abre a explicacao sem entregar a resposta e mostra as secoes para rever', async () => {
    const user = userEvent.setup();
    montar('arv-03');
    await user.click(screen.getByRole('button', { name: /me ensine/i }));
    expect(screen.getByText('O que esta questão cobra')).toBeInTheDocument();
    expect(screen.getByText('Como fazer')).toBeInTheDocument();
    expect(screen.getByText('Rever no resumo')).toBeInTheDocument();
    expect(screen.queryByText(/Resolução passo a passo/)).not.toBeInTheDocument();
    expect(screen.getByTestId('caderno')).toHaveTextContent('');
  });

  it('desistir mostra a resolucao e manda a questao para o caderno de erros', async () => {
    const user = userEvent.setup();
    montar('arv-03');
    await user.click(screen.getByRole('button', { name: /me ensine/i }));
    await user.click(screen.getByRole('button', { name: /desistir e ver a resolução/i }));
    expect(screen.getByText(/Resolução aberta/)).toBeInTheDocument();
    expect(screen.getByText('Resolução passo a passo')).toBeInTheDocument();
    expect(screen.getByTestId('caderno')).toHaveTextContent('arv-03');
    expect(screen.queryByRole('button', { name: /desistir/i })).not.toBeInTheDocument();
  });

  it('em questao fechada, desistir revela a letra certa', async () => {
    const user = userEvent.setup();
    montar('intro-01');
    await user.click(screen.getByRole('button', { name: /me ensine/i }));
    await user.click(screen.getByRole('button', { name: /desistir e ver a resolução/i }));
    expect(screen.getByText(/Resposta certa: B/)).toBeInTheDocument();
    expect(screen.getByTestId('caderno')).toHaveTextContent('intro-01');
  });
});
