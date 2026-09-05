/* ===========================================================================
   CONTEUDO — prova3.js
   Banco de questoes da Prova 3: caminho de dados/tempo, sequencia e
   paralelismo, SLT, sinais de controle, registradores de funcao, JAL/JR/
   pilha, loops/contagem dinamica, CPI medio (com tabela de programa) e
   questoes abertas. Carrega depois de content/factories.js.
   =========================================================================== */

const T_PROF={imem:12,control:2,regread:8,alu:14,dmem:12,memtoreg:2,adder:2,regwrite:8};
const T_FAST={imem:10,control:2,regread:6,alu:12,dmem:10,memtoreg:3,adder:2,regwrite:6};
const T_BRANCH={imem:12,control:2,regread:8,alu:14,dmem:12,memtoreg:0,adder:2,regwrite:8};

const DATAPATH_TIME_REVIEW = [
  reviewTime({id:'rev_p3_time_add',category:'datapath_tempo',subtopic:'ADD',errorType:'caminho de dados',quickRule:'ADD passa por busca, registradores, ULA, MUX MemToReg e escrita.'}, 'add', T_PROF, 'ADD usa Memória de Instruções → Banco de Registradores → ULA → MUX MemToReg → escrita no banco.'),
  reviewTime({id:'rev_p3_time_sub',category:'datapath_tempo',subtopic:'SUB',errorType:'caminho de dados',quickRule:'SUB tem o mesmo caminho de ADD no modelo simplificado.'}, 'sub', T_FAST, 'SUB lê dois registradores, subtrai na ULA e grava o resultado em rd.'),
  reviewTime({id:'rev_p3_time_slt',category:'datapath_tempo',subtopic:'SLT',errorType:'SLT',quickRule:'SLT compara na ULA e grava 0 ou 1, sem salto.'}, 'slt', T_PROF, 'SLT é tipo R: lê dois registradores, usa a ULA, passa pelo MUX MemToReg e escreve em rd.'),
  reviewTime({id:'rev_p3_time_addi',category:'datapath_tempo',subtopic:'ADDI',errorType:'caminho de dados',quickRule:'ADDI usa imediato estendido como segundo operando da ULA.'}, 'addi', T_FAST, 'ADDI busca a instrução, lê rs, estende o imediato, soma na ULA, passa pelo MUX e escreve em rt.'),
  reviewTime({id:'rev_p3_time_lw',category:'datapath_tempo',subtopic:'LW',errorType:'MUX MemToReg',quickRule:'No LW, Memória de Dados e MUX MemToReg são sequenciais.'}, 'lw', T_PROF, 'LW busca, lê base, soma endereço, lê Memória de Dados, atravessa o MUX MemToReg e escreve no registrador.'),
  reviewTime({id:'rev_p3_time_sw',category:'datapath_tempo',subtopic:'SW',errorType:'caminho de dados',quickRule:'SW acessa memória de dados, mas não escreve registrador.'}, 'sw', T_FAST, 'SW busca, lê base e dado, calcula endereço na ULA e escreve na Memória de Dados.'),
  reviewTime({id:'rev_p3_time_beq',category:'datapath_tempo',subtopic:'BEQ',errorType:'caminho de dados',quickRule:'BEQ usa a ULA para subtrair e decidir pelo Zero.'}, 'beq', T_BRANCH, 'BEQ busca, lê dois registradores e usa a ULA para comparar; o somador de desvio pode trabalhar em paralelo.'),
  reviewTime({id:'rev_p3_time_bne',category:'datapath_tempo',subtopic:'BNE',errorType:'caminho de dados',quickRule:'BNE tem caminho estrutural como BEQ; muda a condição do Zero.'}, 'bne', T_BRANCH, 'BNE compara registradores pela ULA; o desvio acontece quando Zero=0.'),
  reviewTime({id:'rev_p3_time_j',category:'datapath_tempo',subtopic:'J',errorType:'caminho de dados',quickRule:'J normalmente tem caminho menor porque não usa registradores, ULA nem memória de dados.'}, 'j', T_PROF, 'J precisa buscar a instrução e formar o próximo PC do salto; não passa pela ULA nem pelo banco de registradores.'),
  reviewMC({id:'rev_p3_time_path_lw_mux',category:'datapath_tempo',subtopic:'caminho LW',errorType:'MUX MemToReg',quickRule:'O sinal pode estar pronto antes, mas o dado ainda atravessa fisicamente o MUX.'},
    'No caminho do <b>lw</b>, qual trecho está em sequência no final da instrução?',
    ['Memória de Dados → MUX MemToReg → escrita no banco de registradores','Controle → Banco de Registradores, usando o maior atraso','Somador PC+4 → Memória de Dados, em paralelo','MUX RegDst → Memória de Instruções → PC'],
    0,
    'No <b>lw</b>, o dado sai da Memória de Dados, atravessa o MUX MemToReg e só então chega à escrita do banco de registradores. Por isso esses atrasos são somados.')
];

const PARALLEL_REVIEW = [
  reviewMC({id:'rev_p3_parallel_lw_mux_13',category:'sequencia_paralelismo',subtopic:'LW MemToReg',errorType:'sequência e paralelismo',quickRule:'Saída de um bloco entra no próximo: some os atrasos.'},
    'No LW, Memória de Dados = 10 ns e MUX MemToReg = 3 ns. Quanto demora esse trecho?',
    ['13 ns, porque o dado sai da memória e depois atravessa o MUX','10 ns, porque usa o maior atraso','3 ns, porque o controle já escolheu o MUX','7 ns, porque os sinais se sobrepõem'],
    0,
    'Memória de Dados e MUX MemToReg são sequenciais nesse trecho: o dado lido precisa atravessar o MUX. Logo, <b>10 + 3 = 13 ns</b>.'),
  reviewTF({id:'rev_p3_parallel_signal_vs_mux',category:'sequencia_paralelismo',subtopic:'sinal vs MUX',errorType:'MUX MemToReg',quickRule:'Sinal de controle não elimina atraso físico do MUX.'},
    'Se o sinal MemToReg já foi gerado pela unidade de controle, o atraso físico do MUX MemToReg pode ser ignorado no LW.',
    false,
    'Falso. O sinal pode estar pronto em paralelo, mas o dado do LW ainda precisa atravessar fisicamente o MUX antes da escrita.'),
  reviewMC({id:'rev_p3_parallel_control_regread',category:'sequencia_paralelismo',subtopic:'controle em paralelo',errorType:'sequência e paralelismo',quickRule:'Caminhos independentes que se encontram: use o maior.'},
    'Depois da busca da instrução, Controle = 2 ns e leitura dos registradores = 8 ns começam juntos. Qual atraso entra no caminho?',
    ['8 ns','10 ns','6 ns','2 ns'],
    0,
    'Controle e leitura dos registradores podem começar após a instrução ser buscada. Como são caminhos paralelos que se encontram depois, usa-se <b>max(2, 8) = 8 ns</b>.'),
  reviewTF({id:'rev_p3_parallel_add_everything',category:'sequencia_paralelismo',subtopic:'erro comum',errorType:'sequência e paralelismo',quickRule:'Não some caminhos independentes só porque aparecem no desenho.'},
    'Todo bloco desenhado no datapath deve ter seu atraso somado ao tempo de qualquer instrução.',
    false,
    'Falso. Só entram blocos usados no caminho crítico daquela instrução. Caminhos independentes em paralelo são comparados pelo maior atraso.'),
  reviewMC({id:'rev_p3_parallel_pc4_branch',category:'sequencia_paralelismo',subtopic:'branch',errorType:'sequência e paralelismo',quickRule:'No branch, PC+4 e leitura/controle podem avançar em paralelo.'},
    'Em um branch, o somador PC+4 pode operar enquanto a instrução é decodificada. Como tratar esse atraso se os caminhos se encontram depois?',
    ['Calcular os caminhos e usar o maior no ponto de encontro','Sempre somar PC+4 com todos os blocos','Ignorar PC+4 em qualquer branch','Usar sempre o menor atraso'],
    0,
    'Se dois caminhos começam juntos e se encontram depois, o tempo até o encontro é o maior deles, não a soma.'),
  reviewAR({id:'rev_p3_parallel_output_input',category:'sequencia_paralelismo',subtopic:'regra geral',errorType:'sequência e paralelismo',quickRule:'Se a saída de A é entrada de B, A+B.'},
    '“Se a saída de um componente é necessária como entrada do próximo, os atrasos devem ser somados.”',
    true,
    'Verdadeiro. Essa é a regra de dependência sequencial: o segundo bloco só consegue produzir resultado depois que recebe a saída do primeiro.'),
  reviewMC({id:'rev_p3_parallel_control_ready',category:'sequencia_paralelismo',subtopic:'controle pronto',errorType:'MUX MemToReg',quickRule:'Controle pronto não significa dado pronto.'},
    'Qual frase diferencia melhor o sinal MemToReg do MUX físico MemToReg?',
    ['O sinal decide a entrada; o MUX é o componente por onde o dado ainda passa','O sinal e o MUX são o mesmo fio, sem atraso','O MUX gera o opcode; o sinal grava no PC','MemToReg só existe em branch'],
    0,
    'O sinal MemToReg é uma decisão de controle. O MUX MemToReg é o bloco físico que seleciona entre saída da ULA e dado da memória.'),
  reviewMC({id:'rev_p3_parallel_formula_choice',category:'sequencia_paralelismo',subtopic:'escolha da operação',errorType:'sequência e paralelismo',quickRule:'Dependência soma; independência usa máximo.'},
    'Qual regra rápida está correta?',
    ['Dependência direta: somar. Caminhos independentes simultâneos: usar o maior','Dependência direta: usar o maior. Caminhos independentes: somar tudo','Sempre somar todos os sinais de controle','Sempre ignorar MUXes'],
    0,
    'Essa é a distinção central: saída de um bloco entra no próximo → soma; caminhos independentes que acontecem juntos → calcula ambos e usa o maior.')
];

const SLT_REVIEW = [
  reviewMC({id:'rev_p3_slt_value_one',category:'slt',subtopic:'valor gravado',errorType:'SLT',quickRule:'SLT compara e grava 1 se rs < rt.'},
    '<span class="mono">$s0=7, $s1=10; slt $t0, $s0, $s1</span>. Qual valor vai para $t0?',
    ['1','0','7','10'],0,'Como 7 < 10, a ULA produz 1 e a instrução grava esse valor em $t0. Não há desvio.'),
  reviewMC({id:'rev_p3_slt_value_zero',category:'slt',subtopic:'valor gravado',errorType:'SLT',quickRule:'Se rs não é menor que rt, SLT grava 0.'},
    '<span class="mono">$s0=12, $s1=4; slt $t0, $s0, $s1</span>. Qual valor vai para $t0?',
    ['0','1','12','4'],0,'Como 12 não é menor que 4, SLT grava 0 no destino.'),
  reviewTF({id:'rev_p3_slt_not_branch',category:'slt',subtopic:'não é salto',errorType:'SLT',quickRule:'SLT não altera diretamente o PC.'},
    'SLT é uma instrução de salto porque testa “menor que”.',false,'Falso. SLT só grava 0 ou 1 em um registrador; quem pode alterar o PC é uma instrução de desvio/salto, como bne ou j.'),
  reviewMC({id:'rev_p3_slt_component',category:'slt',subtopic:'ULA',errorType:'SLT',quickRule:'A comparação do SLT acontece na ULA.'},
    'Qual componente executa a comparação do <span class="mono">slt</span>?',
    ['ULA','Memória de Dados','Somador PC+4','MUX RegDst'],0,'A ULA realiza a comparação “menor que” e produz 1 ou 0.'),
  reviewMC({id:'rev_p3_slt_bne_roles',category:'slt',subtopic:'SLT + BNE',errorType:'SLT',quickRule:'SLT compara; BNE decide desvio olhando o registrador.'},
    '<pre class="program-code">slt $t0, $s0, $s1\nbne $t0, $zero, MENOR</pre>Qual instrução realiza a comparação “menor que”?',
    ['slt','bne','MENOR','jr'],0,'A comparação menor que é feita pelo SLT. O BNE apenas verifica se $t0 é diferente de zero para alterar o PC.'),
  reviewMC({id:'rev_p3_slt_bne_pc',category:'slt',subtopic:'SLT + BNE',errorType:'SLT',quickRule:'BNE é quem pode alterar o PC nessa dupla.'},
    'Na dupla <span class="mono">slt</span> + <span class="mono">bne</span>, qual instrução pode alterar o PC?',
    ['bne','slt','ambas','nenhuma'],0,'O SLT só grava 0 ou 1. O BNE é a instrução de desvio condicional e pode alterar o PC.'),
  reviewTF({id:'rev_p3_slt_same_time_add',category:'slt',subtopic:'tempo',errorType:'SLT',quickRule:'SLT e ADD percorrem o mesmo caminho tipo R no modelo simplificado.'},
    'No datapath simplificado, T_SLT costuma ser igual a T_ADD quando os dois usam o mesmo caminho tipo R.',
    true,'Verdadeiro. ADD e SLT leem dois registradores, usam a ULA, passam pelo MUX MemToReg e escrevem no banco. O funct escolhe a operação final.'),
  reviewMC({id:'rev_p3_slt_aluop',category:'slt',subtopic:'ALUOp',errorType:'sinais de controle',quickRule:'Tipo R usa ALUOp=10 e o funct diferencia add/sub/slt.'},
    'Qual ALUOp normalmente aparece para SLT no modelo simplificado?',
    ['10','00','01','11'],0,'SLT é tipo R. ALUOp=10 manda o controle da ULA consultar o campo funct para saber que a operação é set on less than.'),
  reviewTF({id:'rev_p3_slt_not_mult',category:'slt',subtopic:'não é MULT',errorType:'multiplicação e divisão',quickRule:'SLT não usa HI/LO e não multiplica.'},
    'SLT pode ser tratado como MULT porque ambas usam a ULA.',
    false,'Falso. SLT compara e grava 0/1 em um registrador comum. MULT/DIV podem usar HI e LO e têm outro comportamento.'),
  reviewMC({id:'rev_p3_slt_instruction_count',category:'slt',subtopic:'duas instruções',errorType:'SLT',quickRule:'SLT + BNE são duas instruções com papéis diferentes.'},
    'No teste <span class="mono">slt $t0,$s0,$s1; bne $t0,$zero,MENOR</span>, quantas instruções existem?',
    ['2','1','3','0'],0,'São duas instruções: SLT calcula o booleano 0/1 e BNE usa esse valor para decidir o desvio.')
];

const CONTROL_REVIEW = [
  reviewTbl({id:'rev_p3_control_add',category:'sinais_controle',subtopic:'ADD',errorType:'sinais de controle',quickRule:'ADD é tipo R: RegDst=1, ALUSrc=0, RegWrite=1, ALUOp=10.'}, 'add', ['RegDst','ALUSrc','RegWrite','ALUOp'], 'ADD é tipo R: destino rd, operandos de registradores, resultado da ULA e ALUOp=10.'),
  reviewTbl({id:'rev_p3_control_sub',category:'sinais_controle',subtopic:'SUB',errorType:'sinais de controle',quickRule:'SUB também é tipo R; o funct diferencia da ADD.'}, 'sub', ['MemtoReg','RegWrite','MemRead','ALUOp'], 'SUB não usa memória de dados e grava resultado da ULA; ALUOp=10 porque o funct escolhe subtração.'),
  reviewTbl({id:'rev_p3_control_slt',category:'sinais_controle',subtopic:'SLT',errorType:'sinais de controle',quickRule:'SLT é tipo R e usa ALUOp=10.'}, 'slt', ['RegDst','ALUSrc','MemtoReg','ALUOp'], 'SLT lê dois registradores, compara na ULA e grava rd; por isso os sinais são de tipo R.'),
  reviewTbl({id:'rev_p3_control_addi',category:'sinais_controle',subtopic:'ADDI',errorType:'sinais de controle',quickRule:'ADDI usa imediato: ALUSrc=1 e RegDst=0.'}, 'addi', ['RegDst','ALUSrc','RegWrite','ALUOp'], 'ADDI grava em rt, usa imediato como segundo operando e soma fixa na ULA: ALUOp=00.'),
  reviewTbl({id:'rev_p3_control_lw',category:'sinais_controle',subtopic:'LW',errorType:'sinais de controle',quickRule:'LW lê memória e escreve registrador com MemToReg=1.'}, 'lw', ['ALUSrc','MemtoReg','RegWrite','MemRead'], 'LW calcula endereço com imediato, lê Memória de Dados e grava o dado no registrador.'),
  reviewTbl({id:'rev_p3_control_sw',category:'sinais_controle',subtopic:'SW',errorType:'sinais de controle',quickRule:'SW escreve memória e não escreve registrador.'}, 'sw', ['RegDst','MemtoReg','RegWrite','MemWrite'], 'SW usa imediato para endereço, escreve Memória de Dados e deixa RegWrite=0; RegDst/MemtoReg são indiferentes.'),
  reviewTbl({id:'rev_p3_control_beq',category:'sinais_controle',subtopic:'BEQ',errorType:'sinais de controle',quickRule:'BEQ usa ALUOp=01 e desvia quando Zero=1.'}, 'beq', ['ALUSrc','RegWrite','Branch','ALUOp'], 'BEQ compara registradores com subtração: ALUSrc=0, RegWrite=0, Branch=1, ALUOp=01.'),
  reviewTbl({id:'rev_p3_control_bne',category:'sinais_controle',subtopic:'BNE',errorType:'sinais de controle',quickRule:'BNE usa ALUOp=01; a lógica inverte a condição do Zero.'}, 'bne', ['ALUSrc','RegWrite','Branch','ALUOp'], 'BNE compara como BEQ, mas desvia quando Zero=0. O tratamento exato pode inverter o sinal Zero.'),
  reviewMC({id:'rev_p3_control_add_sub_same_aluop',category:'sinais_controle',subtopic:'ALUOp',errorType:'sinais de controle',quickRule:'ALUOp=10 indica tipo R; o funct diferencia.'},
    'Por que ADD e SUB podem ter o mesmo ALUOp=10?',
    ['Porque ALUOp=10 manda consultar o campo funct','Porque ADD e SUB fazem a mesma operação','Porque ambas acessam Memória de Dados','Porque ALUOp=10 significa branch'],0,'ALUOp=10 identifica instrução tipo R. O campo funct é que diferencia ADD, SUB e SLT no controle final da ULA.'),
  reviewMC({id:'rev_p3_control_lw_add_memtoreg',category:'sinais_controle',subtopic:'MemToReg',errorType:'sinais de controle',quickRule:'MemToReg escolhe a fonte escrita no registrador.'},
    'Por que LW tem MemToReg=1 e ADD tem MemToReg=0?',
    ['LW escreve dado vindo da memória; ADD escreve resultado da ULA','LW não escreve registrador; ADD escreve memória','ADD usa memória de dados; LW usa ULA apenas','MemToReg controla o PC'],0,'MemToReg seleciona o valor que volta ao banco de registradores: memória no LW, ULA no ADD.')
];

const FUNCTION_REG_REVIEW = [
  reviewMC({id:'rev_p3_func_v0_return',category:'registradores_funcoes',subtopic:'$v0',errorType:'$ra e $v0',quickRule:'$v0 normalmente guarda valor retornado.'}, 'Qual registrador normalmente guarda o valor retornado por uma função?', ['$v0','$ra','$a0','$sp'],0,'Pela convenção MIPS, $v0 (e às vezes $v1) guarda valores retornados.'),
  reviewMC({id:'rev_p3_func_ra_return_addr',category:'registradores_funcoes',subtopic:'$ra',errorType:'$ra e $v0',quickRule:'$ra guarda endereço de retorno, não valor retornado.'}, 'Qual registrador guarda o endereço para retornar depois de uma chamada?', ['$ra','$v0','$a1','$lo'],0,'JAL salva em $ra o endereço da próxima instrução, para JR $ra voltar depois.'),
  reviewMC({id:'rev_p3_func_a0_arg',category:'registradores_funcoes',subtopic:'$a0',errorType:'argumento e retorno',quickRule:'$a0 é o primeiro argumento.'}, 'Onde o primeiro argumento normalmente é enviado?', ['$a0','$v0','$ra','$hi'],0,'Os argumentos entram em $a0 até $a3; o primeiro usa $a0.'),
  reviewMC({id:'rev_p3_func_sp_stack',category:'registradores_funcoes',subtopic:'$sp',errorType:'pilha',quickRule:'$sp aponta para o topo da pilha.'}, 'Qual registrador aponta para o topo da pilha?', ['$sp','$ra','$s0','$lo'],0,'$sp é o stack pointer, usado para reservar/restaurar espaço na pilha.'),
  reviewMC({id:'rev_p3_func_ra_v0_diff',category:'registradores_funcoes',subtopic:'$ra vs $v0',errorType:'$ra e $v0',quickRule:'$ra é endereço; $v0 é valor.'}, 'Qual diferença está correta?', ['$ra guarda para onde voltar; $v0 guarda o resultado da função','$ra guarda o resultado; $v0 guarda o PC','$ra e $v0 são sempre iguais','$v0 aponta para a pilha'],0,'$ra é controle de fluxo. $v0 é dado produzido pela função.'),
  reviewMC({id:'rev_p3_func_a0_v0_diff',category:'registradores_funcoes',subtopic:'$a0 vs $v0',errorType:'argumento e retorno',quickRule:'$a0 entra na função; $v0 sai da função.'}, 'Qual diferença está correta?', ['$a0 envia argumento; $v0 recebe resultado','$a0 recebe retorno; $v0 guarda endereço','$a0 aponta pilha; $v0 aponta código','$a0 e $v0 são registradores HI/LO'],0,'$a0 normalmente leva o primeiro argumento para a função; $v0 devolve o resultado.'),
  reviewMC({id:'rev_p3_func_temp_saved',category:'registradores_funcoes',subtopic:'$t e $s',errorType:'registradores de função',quickRule:'$t são temporários; $s normalmente devem ser preservados.'}, 'Qual afirmação sobre $t e $s está correta?', ['$t são temporários; $s normalmente devem ser preservados','$t guardam retorno; $s guardam opcode','$s são argumentos; $t são HI/LO','$t sempre precisam ser salvos pela função chamada'],0,'A convenção diferencia temporários ($t) de salvos ($s).'),
  reviewMC({id:'rev_p3_func_hi_lo_mult',category:'registradores_funcoes',subtopic:'HI/LO',errorType:'HI e LO',quickRule:'MULT/DIV usam HI/LO; SLT não.'}, 'Em multiplicação/divisão MIPS, quais registradores podem receber resultados especiais?', ['$hi e $lo','$ra e $v0','$a0 e $a1','$sp e $fp'],0,'MULT/DIV podem usar HI/LO: LO guarda parte baixa ou quociente; HI guarda parte alta ou resto.'),
  reviewTF({id:'rev_p3_func_mflo',category:'registradores_funcoes',subtopic:'MFLO/MFHI',errorType:'HI e LO',quickRule:'MFLO/MFHI copiam de HI/LO para registradores comuns.'}, 'MFLO copia o conteúdo de LO para um registrador comum.', true, 'Verdadeiro. Após MULT/DIV, MFLO e MFHI movem valores especiais para registradores gerais.'),
  reviewTF({id:'rev_p3_func_slt_hi_lo',category:'registradores_funcoes',subtopic:'SLT vs HI/LO',errorType:'multiplicação e divisão',quickRule:'SLT grava em rd, não em HI/LO.'}, 'SLT usa HI e LO porque também compara dois números.', false, 'Falso. SLT usa a ULA e grava 0/1 no registrador destino; HI/LO são ligados a MULT/DIV.')
];

const CALL_STACK_REVIEW = [
  reviewMC({id:'rev_p3_call_jal_action',category:'jal_jr_pilha',subtopic:'JAL',errorType:'JAL e JR',quickRule:'JAL salva retorno em $ra e pula para a função.'}, 'O que <span class="mono">jal dobro</span> faz?', ['Salva o endereço de retorno em $ra e altera o PC para dobro','Grava o resultado da função em $ra','Retorna para main sem alterar PC','Copia $a0 para $v0'],0,'JAL chama a função: guarda o endereço da próxima instrução em $ra e coloca o PC no alvo.'),
  reviewMC({id:'rev_p3_call_jr_action',category:'jal_jr_pilha',subtopic:'JR',errorType:'JAL e JR',quickRule:'JR $ra volta para o endereço guardado em $ra.'}, 'O que <span class="mono">jr $ra</span> faz?', ['Altera o PC para o endereço armazenado em $ra','Copia $ra para $v0','Chama outra função salvando $ra','Empilha o valor retornado'],0,'JR usa o conteúdo de um registrador como próximo PC. Com $ra, retorna da função.'),
  reviewMC({id:'rev_p3_call_double_arg',category:'jal_jr_pilha',subtopic:'código dobro',errorType:'argumento e retorno',quickRule:'Argumento entra em $a0; retorno sai em $v0.'}, '<pre class="program-code">addi $a0,$zero,7\njal dobro\ndobro: add $v0,$a0,$a0</pre>Qual valor é enviado para a função?', ['7','14','0','endereço de retorno'],0,'A instrução addi coloca 7 em $a0 antes do jal. Esse é o argumento enviado.'),
  reviewMC({id:'rev_p3_call_double_return',category:'jal_jr_pilha',subtopic:'código dobro',errorType:'$ra e $v0',quickRule:'$v0 guarda o valor devolvido pela função.'}, 'Na função dobro com $a0=7 e <span class="mono">add $v0,$a0,$a0</span>, qual valor volta em $v0?', ['14','7','endereço de retorno','0'],0,'A função soma 7+7 e grava 14 em $v0. $ra não guarda esse valor.'),
  reviewMC({id:'rev_p3_call_nested_problem',category:'jal_jr_pilha',subtopic:'função chama função',errorType:'pilha',quickRule:'JAL interno sobrescreve $ra; salve antes se precisa voltar.'}, '<pre class="program-code">funcaoA:\n  jal funcaoB\n  jr $ra</pre>Qual é o problema?', ['jal funcaoB sobrescreve o $ra original de funcaoA','jr $ra multiplica o retorno','funcaoB não pode usar $v0','A pilha nunca pode ser usada'],0,'Quando funcaoA chama funcaoB, o novo jal coloca outro endereço em $ra. Sem salvar o original, funcaoA perde para onde deveria retornar.'),
  reviewMC({id:'rev_p3_call_save_where',category:'jal_jr_pilha',subtopic:'pilha',errorType:'pilha',quickRule:'Salve $ra na pilha antes do jal interno e restaure depois.'}, 'Onde $ra pode ser salvo quando uma função chama outra?', ['Na pilha usando $sp','No opcode','No campo funct','No sinal ALUOp'],0,'A pilha é o local padrão para preservar $ra enquanto outra chamada usa o registrador.'),
  reviewMC({id:'rev_p3_call_restore_order',category:'jal_jr_pilha',subtopic:'ordem',errorType:'pilha',quickRule:'Reserva, salva, chama, restaura, libera, retorna.'}, 'Qual ordem corrige uma função que chama outra?', ['addi $sp,-4; sw $ra,0($sp); jal; lw $ra,0($sp); addi $sp,4; jr $ra','jal; sw $ra; jr; lw $ra','jr $ra; jal; sw $v0','sw $v0; jal; jr $v0'],0,'A função reserva espaço, salva $ra, chama a outra, restaura $ra, libera a pilha e só então retorna.'),
  reviewTF({id:'rev_p3_call_ra_not_value',category:'jal_jr_pilha',subtopic:'$ra',errorType:'$ra e $v0',quickRule:'$ra não é retorno de valor.'}, '$ra guarda o valor retornado pela função.', false, 'Falso. $ra guarda endereço de retorno; $v0 normalmente guarda o valor retornado.')
];

const LOOP_REVIEW = [
  reviewMC({id:'rev_p3_loop_bne_body_count',category:'loops_dinamicos',subtopic:'BNE no final',errorType:'contagem dinâmica',quickRule:'BNE no final executa N vezes.'}, 'No padrão <span class="mono">corpo; addi contador; bne contador,limite,LOOP</span> com N=6, quantas vezes o BNE executa?', ['6','5','7','1'],0,'O BNE fica no fim do corpo e é executado em todas as 6 passagens, inclusive na última, quando falha.'),
  reviewMC({id:'rev_p3_loop_beq_j_jump_count',category:'loops_dinamicos',subtopic:'BEQ seguido de J',errorType:'contagem dinâmica',quickRule:'No BEQ seguido de J, o J costuma executar N-1 vezes.'}, 'No padrão corpo + BEQ para FIM + J LOOP com N=5, quantas vezes o J executa?', ['4','5','6','1'],0,'Na última repetição, o BEQ desvia para FIM e pula o J. Portanto J = N - 1 = 4.'),
  reviewMC({id:'rev_p3_loop_test_before_beq',category:'loops_dinamicos',subtopic:'teste antes',errorType:'contagem dinâmica',quickRule:'Teste antes do corpo: BEQ pode executar N+1 vezes.'}, 'No padrão TESTE: beq contador,limite,FIM; corpo; addi; j TESTE com N=4, quantas vezes o BEQ executa?', ['5','4','3','1'],0,'O BEQ testa antes de cada uma das 4 execuções e testa uma vez a mais para sair. Total: N+1 = 5.'),
  reviewMC({id:'rev_p3_loop_lines_vs_dynamic',category:'loops_dinamicos',subtopic:'conceito',errorType:'contagem dinâmica',quickRule:'Quantidade de linhas não é quantidade dinâmica.'}, 'O que significa quantidade dinâmica de instruções?', ['Número de instruções realmente executadas durante a execução','Número de linhas escritas no arquivo','Número de tipos diferentes de instrução','Quantidade de registradores usados'],0,'Loops, desvios e chamadas fazem a mesma linha executar várias vezes ou não executar.'),
  reviewMC({id:'rev_p3_loop_example_lw',category:'loops_dinamicos',subtopic:'exemplo prova',errorType:'contagem dinâmica',quickRule:'Linhas antes do BEQ executam N vezes.'}, 'No exemplo com N=8, a linha <span class="mono">lw $s1,0($s0)</span> aparece antes do BEQ de saída. Quantos LW executam?', ['8','7','9','1'],0,'Se o loop começa 8 vezes e o LW está antes do teste de saída daquele padrão, ele executa em todas as 8 passagens.'),
  reviewMC({id:'rev_p3_loop_example_sw',category:'loops_dinamicos',subtopic:'exemplo prova',errorType:'contagem dinâmica',quickRule:'Instruções depois do BEQ podem não executar na última repetição.'}, 'No padrão BEQ seguido de J com N=8, se o <span class="mono">sw</span> está depois do BEQ, quantas vezes ele executa?', ['7','8','9','0'],0,'Na última repetição, o BEQ desvia para FIM antes de chegar ao SW. Logo SW = N-1 = 7.'),
  reviewMC({id:'rev_p3_loop_formula',category:'loops_dinamicos',subtopic:'fórmula',errorType:'contagem dinâmica',quickRule:'Total = A×N + B×(N-1) + C quando há trecho pulado na última.'}, 'Na fórmula Total = A×N + B×(N-1) + C, o que representa B?', ['Instruções que não executam na última repetição','Instruções fora do loop','Número de registradores','CPI médio'],0,'B agrupa as instruções executadas em todas menos na última passagem, como o J após um BEQ de saída.'),
  reviewMC({id:'rev_p3_loop_jal_inside',category:'loops_dinamicos',subtopic:'função no loop',errorType:'contagem dinâmica',quickRule:'Chamada dentro do loop conta JAL e também o corpo da função.'}, 'Se um <span class="mono">jal soma</span> está dentro de um loop que roda 3 vezes, quantos JAL executam?', ['3','1','4','0'],0,'A chamada está dentro do corpo, então executa uma vez por iteração: 3 vezes. Também seria preciso contar as instruções dentro da função.'),
  reviewMC({id:'rev_p3_loop_slt_condition',category:'loops_dinamicos',subtopic:'SLT em condição',errorType:'SLT'}, 'Em um loop que usa <span class="mono">slt $t0,$s0,$s1</span> antes de <span class="mono">bne</span>, o que o SLT faz?', ['Produz 0/1 para o BNE testar','Salta diretamente para o fim','Divide $s0 por $s1','Salva $ra'],0,'SLT monta um valor booleano no registrador. O BNE usa esse valor para decidir o desvio.'),
  reviewMC({id:'rev_p3_loop_after_loop',category:'loops_dinamicos',subtopic:'fora do loop',errorType:'contagem dinâmica',quickRule:'Instruções depois do rótulo FIM contam uma vez se o programa chega lá.'}, 'Uma instrução <span class="mono">sub</span> logo após o rótulo FIM, fora do loop, normalmente executa quantas vezes?', ['1','N','N-1','0 sempre'],0,'Depois que o loop termina, o fluxo chega ao FIM e executa essa instrução uma vez, salvo outro desvio que a pule.')
];

function cpiTimes(freqMHz, cpi){
  const out={}; Object.keys(cpi).forEach(k=>{ out[k]=cpiToTimeNs(cpi[k],freqMHz); }); return out;
}
function makeCpiProgram(title, freqMHz, rows, counts, cpi, setup, reasoning, code, finalLabel, finalValue){
  return {title,family:'review-cpi',rows,counts,timeNs:cpiTimes(freqMHz,cpi),freqMHz,setup,reasoning,code,finalLabel,finalValue};
}
const CPI_REVIEW = [
  reviewCpiProgram({id:'rev_p3_cpi_easy_bne',category:'cpi_medio',subtopic:'fácil',errorType:'CPI médio',quickRule:'Conte quantas vezes cada instrução executa antes de calcular CPI.'}, makeCpiProgram('Loop BNE simples (5 voltas)', 500, ['lw','add','addi','bne'], {lw:5,add:5,addi:5,bne:5}, {lw:5,add:3,addi:3,bne:2}, 'O corpo executa 5 vezes e o BNE fica no final.', ['Cada linha do corpo executa 5 vezes.','Ciclos totais = quantidade × CPI.','CPI médio = ciclos totais ÷ instruções executadas.'], ['loop: lw $t0,0($s0)','add $s1,$s1,$t0','addi $s0,$s0,4','bne $s0,$s2,loop'], 'Soma final', 0)),
  reviewCpiProgram({id:'rev_p3_cpi_easy_beq_j',category:'cpi_medio',subtopic:'fácil',errorType:'CPI médio',quickRule:'No BEQ seguido de J, conte J como N-1.'}, makeCpiProgram('BEQ seguido de J (4 voltas)', 250, ['lw','add','beq','j','sub'], {lw:4,add:4,beq:4,j:3,sub:1}, {lw:6,add:4,beq:3,j:2,sub:4}, 'O J não executa na última volta; SUB está fora do loop.', ['LW/ADD/BEQ executam 4 vezes.','J executa 3 vezes.','SUB final executa 1 vez.'], ['loop: lw $s1,0($s0)','add $s2,$s1,$s3','beq $t0,$t1,fim','j loop','fim: sub $s4,$s5,$s6'], 'Valor final simbólico', 1)),
  reviewCpiProgram({id:'rev_p3_cpi_easy_test_before',category:'cpi_medio',subtopic:'fácil',errorType:'CPI médio'}, makeCpiProgram('Teste antes do corpo (3 voltas)', 1000, ['beq','lw','addi','j'], {beq:4,lw:3,addi:3,j:3}, {beq:2,lw:5,addi:3,j:2}, 'BEQ testa 3 entradas e mais uma saída.', ['BEQ=N+1=4.','Corpo, ADDI e J executam N=3.'], ['teste: beq $t0,$t1,fim','lw $s0,0($s1)','addi $t0,$t0,1','j teste'], 'Iterações', 3)),
  reviewCpiProgram({id:'rev_p3_cpi_mid_jal_once',category:'cpi_medio',subtopic:'intermediário',errorType:'JAL e JR'}, makeCpiProgram('Função chamada uma vez', 500, ['addi','jal','add','jr'], {addi:1,jal:1,add:2,jr:1}, {addi:3,jal:4,add:3,jr:4}, 'main prepara argumento, chama dobro e copia retorno.', ['Conte JAL e JR separadamente.','A instrução add dentro da função também executa.','O add após o retorno executa uma vez.'], ['addi $a0,$zero,7','jal dobro','add $s0,$v0,$zero','dobro: add $v0,$a0,$a0','jr $ra'], 'Valor final em $s0', 14)),
  reviewCpiProgram({id:'rev_p3_cpi_mid_slt_loop',category:'cpi_medio',subtopic:'intermediário',errorType:'SLT'}, makeCpiProgram('Loop com SLT e BNE (6 voltas)', 250, ['slt','bne','add','addi','j'], {slt:7,bne:7,add:6,addi:6,j:6}, {slt:3,bne:2,add:3,addi:3,j:2}, 'Teste antes usa SLT+BNE; o teste ocorre uma vez a mais.', ['SLT e BNE executam N+1=7.','Corpo, ADDI e J executam N=6.'], ['teste: slt $t0,$s0,$s1','bne $t0,$zero,corpo','j fim','corpo: add $s2,$s2,$s3','addi $s0,$s0,1','j teste'], 'Iterações', 6)),
  reviewCpiProgram({id:'rev_p3_cpi_mid_skip_last',category:'cpi_medio',subtopic:'intermediário',errorType:'contagem dinâmica'}, makeCpiProgram('Instruções puladas na última', 500, ['lw','addi','beq','sw','j'], {lw:5,addi:5,beq:5,sw:4,j:4}, {lw:5,addi:3,beq:2,sw:5,j:2}, 'BEQ de saída fica antes de SW e J.', ['LW/ADDI/BEQ executam N=5.','SW e J executam N-1=4.'], ['loop: lw $s1,0($s0)','addi $t0,$t0,1','beq $t0,$t1,fim','sw $s1,4($s0)','j loop'], 'Stores executados', 4)),
  reviewCpiProgram({id:'rev_p3_cpi_mid_function_in_loop',category:'cpi_medio',subtopic:'intermediário',errorType:'JAL e JR'}, makeCpiProgram('Função dentro do loop (3 voltas)', 250, ['lw','jal','jr','add','addi','bne'], {lw:3,jal:3,jr:3,add:6,addi:3,bne:3}, {lw:6,jal:4,jr:4,add:3,addi:3,bne:2}, 'Cada volta chama função; a função tem add e jr.', ['JAL executa 3 vezes.','JR também executa 3 vezes.','Há um add no loop e um add na função por volta.'], ['loop: lw $a0,0($s0)','jal dobro','add $s1,$s1,$v0','addi $t0,$t0,1','bne $t0,$t1,loop','dobro: add $v0,$a0,$a0','jr $ra'], 'Chamadas', 3)),
  reviewCpiProgram({id:'rev_p3_cpi_hard_nested_call',category:'cpi_medio',subtopic:'difícil',errorType:'pilha'}, makeCpiProgram('Função chama função', 500, ['addi','sw','lw','jal','jr','add'], {addi:3,sw:1,lw:1,jal:2,jr:2,add:1}, {addi:3,sw:5,lw:5,jal:4,jr:4,add:3}, 'funcaoA salva $ra, chama funcaoB, restaura e retorna.', ['Dois JAL: main→A e A→B.','Dois JR: B→A e A→main.','SW/LW preservam $ra uma vez.'], ['jal funcaoA','funcaoA: addi $sp,$sp,-4','sw $ra,0($sp)','jal funcaoB','lw $ra,0($sp)','addi $sp,$sp,4','jr $ra','funcaoB: add $v0,$a0,$a1','jr $ra'], 'Retornos', 2)),
  reviewCpiProgram({id:'rev_p3_cpi_hard_last_only',category:'cpi_medio',subtopic:'difícil',errorType:'contagem dinâmica'}, makeCpiProgram('Última repetição diferente', 1000, ['lw','slt','beq','add','sw','j','sub'], {lw:4,slt:4,beq:4,add:3,sw:1,j:3,sub:1}, {lw:5,slt:3,beq:2,add:3,sw:6,j:2,sub:3}, 'SW executa somente ao sair; ADD/J não executam na última.', ['LW/SLT/BEQ=N=4.','ADD/J=N-1=3.','SW e SUB finais executam 1 vez.'], ['loop: lw $t0,0($s0)','slt $t1,$t0,$s1','beq $t1,$zero,fim','add $s2,$s2,$t0','j loop','fim: sw $s2,0($s3)','sub $s4,$s4,$s5'], 'Stores finais', 1)),
  reviewCpiProgram({id:'rev_p3_cpi_hard_full_table',category:'cpi_medio',subtopic:'difícil',errorType:'CPI médio'}, makeCpiProgram('Tabela completa com loop e função', 250, ['lw','sw','add','addi','slt','bne','jal','jr'], {lw:8,sw:1,add:12,addi:8,slt:9,bne:9,jal:4,jr:4}, {lw:6,sw:6,add:3,addi:3,slt:3,bne:2,jal:4,jr:4}, 'Loop de 8 voltas chama função em metade das voltas; teste SLT ocorre uma vez a mais.', ['Conte tabela por tipo antes de somar ciclos.','JAL e JR contam separadamente.','CPI médio usa ciclos totais ÷ total de instruções.'], ['teste: slt $t0,$s0,$s1','bne $t0,$zero,corpo','j fim','corpo: lw $a0,0($s2)','jal ajusta','add $s3,$s3,$v0','addi $s0,$s0,1','j teste','ajusta: add $v0,$a0,$a1','jr $ra','fim: sw $s3,0($s4)'], 'Chamadas executadas', 4))
];

// Questoes abertas removidas: a Prova 3 real e 100% de multipla escolha,
// entao o banco de pratica nao inclui formato aberto.
const P3_OPEN_QUESTIONS = [];
