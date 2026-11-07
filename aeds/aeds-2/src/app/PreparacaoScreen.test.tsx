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
  await user.click(screen.getByRole('button',{name:'Treinar',exact:true}));
  await user.type(screen.getByRole('textbox'),'minha tentativa');
  await user.click(screen.getByText('Mostrar / esconder gabarito'));
  await user.selectOptions(screen.getByLabelText('Como foi a tentativa?'),'revisar');
  await waitFor(()=>expect(JSON.parse(localStorage.getItem(preparacaoKey)!).drafts['p1-p1-soma']).toBe('minha tentativa'));
  view.unmount(); render(<PreparacaoScreen {...props}/>);
  expect(screen.getAllByRole('checkbox').some(check=>(check as HTMLInputElement).checked)).toBe(true);
  await user.click(screen.getByRole('button',{name:'Revisão',exact:true}));
  await user.click(screen.getAllByText('Laços em uma oficina')[0]);
  expect(screen.getByDisplayValue('minha tentativa')).toBeInTheDocument();
});
test('altera estimativas por turno e preserva o relato como parcial',async()=>{
  const user=userEvent.setup(); render(<PreparacaoScreen scope="p2" onBack={vi.fn()} onLegacy={vi.fn()}/>);
  expect(screen.getByText('~90% · alta')).toBeInTheDocument();
  await user.selectOptions(screen.getByLabelText('Turno'),'tarde');
  expect(screen.queryByText('~90% · alta')).not.toBeInTheDocument();
  expect(screen.getAllByText('~85% · alta').length).toBeGreaterThan(0);
  await user.click(screen.getByRole('button',{name:'O que caiu'}));
  expect(screen.getByText(/Lembrança do aluno.*nível de inserção/)).toBeInTheDocument();
  const label=screen.getByText('Completar o confronto · Tarde').closest('article')!;
  await user.selectOptions(within(label).getAllByRole('combobox')[0],'parcial');
  expect(within(label).getAllByRole('combobox')[0]).toHaveValue('parcial');
});
test('tema com poucos simulados sempre oferece oficina e a prática tem entrada e saída',async()=>{
  const user=userEvent.setup(); render(<PreparacaoScreen scope="p2" onBack={vi.fn()} onLegacy={vi.fn()}/>);
  const card=screen.getByRole('heading',{name:'TreeSort como variação'}).closest('article')!;
  await user.click(within(card).getByRole('button',{name:'Treinar este tema'}));
  expect(screen.getByRole('heading',{name:'Oficina: TreeSort como variação'})).toBeInTheDocument();
  await user.click(screen.getByRole('button',{name:'Prática',exact:true}));
  expect(screen.getByRole('heading',{name:'Sensores em uma ABP · C'})).toBeInTheDocument();
  expect(screen.getByText(/n=0 resulta em 0/)).toBeInTheDocument();
});
