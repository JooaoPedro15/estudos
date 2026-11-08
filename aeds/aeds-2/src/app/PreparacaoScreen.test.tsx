import { render,screen,waitFor,within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { PreparacaoScreen } from './PreparacaoScreen';
import { preparacaoKey } from '../persistence/preparacao';

beforeEach(()=>localStorage.clear());
test('prioriza pendências e restaura checklist, rascunho e autoavaliação',async()=>{
  const user=userEvent.setup();
  const props={scope:'p1' as const,onBack:vi.fn(),onLegacy:vi.fn()};
  const view=render(<PreparacaoScreen {...props}/>);
  await user.click(screen.getAllByRole('checkbox')[0]);
  await user.click(screen.getByRole('button',{name:'Treinar'}));
  await user.type(screen.getByRole('textbox'),'minha tentativa');
  await user.click(screen.getByText('Mostrar / esconder gabarito'));
  await user.selectOptions(screen.getByLabelText('Como foi a tentativa?'),'revisar');
  await waitFor(()=>expect(JSON.parse(localStorage.getItem(preparacaoKey)!).drafts['p1-p1-soma']).toBe('minha tentativa'));
  view.unmount(); render(<PreparacaoScreen {...props}/>);
  expect(screen.getAllByRole('checkbox').some(check=>(check as HTMLInputElement).checked)).toBe(true);
  await user.click(screen.getByRole('button',{name:'Revisão'}));
  await user.click(screen.getAllByText('Laços em uma oficina')[0]);
  expect(screen.getByDisplayValue('minha tentativa')).toBeInTheDocument();
});
test('reúne os conteúdos e mantém o registro da prova sem previsão ou filtros de turma',async()=>{
  const user=userEvent.setup(); render(<PreparacaoScreen scope="p2" onBack={vi.fn()} onLegacy={vi.fn()}/>);
  expect(screen.queryByLabelText('Turno')).not.toBeInTheDocument();
  expect(screen.queryByLabelText('Professor')).not.toBeInTheDocument();
  expect(document.body.textContent).not.toMatch(/~\d+%/);
  await user.click(screen.getByRole('button',{name:'Treinar'}));
  expect(screen.getByRole('status')).toHaveTextContent('21 exercícios');
  expect(screen.getByLabelText('Nível')).toHaveValue('todos');
  await user.click(screen.getByRole('button',{name:'O que caiu'}));
  expect(screen.getByText(/Lembrança do aluno.*nível de inserção/)).toBeInTheDocument();
  expect(screen.getByRole('heading',{name:'Espelhamento não foi cobrado'})).toBeInTheDocument();
  const label=screen.getByText('Completar registro').closest('article')!;
  await user.selectOptions(within(label).getAllByRole('combobox')[0],'parcial');
  expect(within(label).getAllByRole('combobox')[0]).toHaveValue('parcial');
});
test('tema com poucos simulados sempre oferece oficina e a prática tem entrada e saída',async()=>{
  const user=userEvent.setup(); render(<PreparacaoScreen scope="p2" onBack={vi.fn()} onLegacy={vi.fn()}/>);
  const card=screen.getByRole('heading',{name:'TreeSort como variação'}).closest('article')!;
  await user.click(within(card).getByRole('button',{name:'Treinar este tema'}));
  expect(screen.getByRole('heading',{name:/TreeSort \(Java\)/})).toBeInTheDocument();
  await user.click(screen.getByRole('button',{name:'Prática'}));
  expect(screen.getByRole('heading',{name:'Sensores em uma ABP · C'})).toBeInTheDocument();
  expect(screen.getByText(/n=0 resulta em 0/)).toBeInTheDocument();
});

test('P3 mostra todos os assuntos e filtra a matriz ampliada por tema e nível',async()=>{
  const user=userEvent.setup();render(<PreparacaoScreen scope="p3" onBack={vi.fn()} onLegacy={vi.fn()}/>);
  await user.click(screen.getByRole('button',{name:'Treinar'}));
  expect(screen.getByRole('status')).toHaveTextContent('39 exercícios');
  await user.selectOptions(screen.getByLabelText('Assunto'),'arvore234');
  expect(screen.getByRole('status')).toHaveTextContent('5 exercícios');
  await user.selectOptions(screen.getByLabelText('Nível'),'dificil');
  expect(screen.getByRole('status')).toHaveTextContent('1 exercício');
  expect(screen.getByRole('heading',{name:'Folhas em um único nível'})).toBeInTheDocument();
  await user.click(screen.getByRole('button',{name:'Evidências'}));
  await user.click(screen.getByText('Análise completa dos materiais e da cobrança'));
  expect(screen.getByRole('link',{name:'TRIE da USP'})).toHaveAttribute('href','https://www.ime.usp.br/~cris/mac0323/slides/aula18.pdf');
});

test('a matriz abre diretamente o exercício correspondente, inclusive fora do simulado',async()=>{
  const user=userEvent.setup();render(<PreparacaoScreen scope="p3" onBack={vi.fn()} onLegacy={vi.fn()}/>);
  await user.click(screen.getByRole('button',{name:'Evidências'}));
  await user.click(screen.getByText('Matriz de operações · 39 exercícios'));
  const row=screen.getByText('Conferir o segmento inteiro').closest('tr')!;
  await user.click(within(row).getByRole('button',{name:'Resolver exercício →'}));
  expect(screen.getByRole('heading',{name:'Conferir o segmento inteiro'})).toBeInTheDocument();
  expect(screen.getByLabelText('Nível')).toHaveValue('todos');
  expect(screen.getByLabelText('Assunto')).toHaveValue('patricia');
});
