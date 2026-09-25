import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';

/**
 * Compila e executa Java usando o JDK instalado na maquina (javac/java no
 * PATH). Cada execucao recebe a entrada pelo stdin e tem limite de tempo,
 * igual a um juiz online.
 */

const LIMITE_SAIDA_BYTES = 32 * 1024 * 1024;

export type Execucao = {
  saida: string;
  erro: string;
  codigo: number | null;
  tempoMs: number;
  estourouTempo: boolean;
};

type Processo = { stdout: string; stderr: string; codigo: number | null; tempoMs: number; estourouTempo: boolean };

function rodar(comando: string, args: string[], cwd: string, entrada: string, limiteMs: number): Promise<Processo> {
  return new Promise((resolve) => {
    const inicio = Date.now();
    let stdout = '';
    let stderr = '';
    let bytes = 0;
    let estourouTempo = false;
    let terminou = false;
    let filho: ChildProcessWithoutNullStreams;
    try {
      filho = spawn(comando, args, { cwd, windowsHide: true });
    } catch (erro) {
      resolve({ stdout: '', stderr: String(erro), codigo: null, tempoMs: 0, estourouTempo: false });
      return;
    }
    const timer = setTimeout(() => {
      estourouTempo = true;
      filho.kill('SIGKILL');
    }, limiteMs);
    filho.stdout.setEncoding('utf8');
    filho.stderr.setEncoding('utf8');
    filho.stdout.on('data', (pedaco: string) => {
      bytes += pedaco.length;
      if (bytes > LIMITE_SAIDA_BYTES) {
        stderr += '\nSaida grande demais (mais de 32 MB): execucao interrompida.';
        filho.kill('SIGKILL');
        return;
      }
      stdout += pedaco;
    });
    filho.stderr.on('data', (pedaco: string) => {
      if (stderr.length < 64 * 1024) {
        stderr += pedaco;
      }
    });
    const fim = (codigo: number | null) => {
      if (terminou) {
        return;
      }
      terminou = true;
      clearTimeout(timer);
      resolve({ stdout, stderr, codigo, tempoMs: Date.now() - inicio, estourouTempo });
    };
    filho.on('error', (erro) => {
      stderr += String(erro);
      fim(null);
    });
    filho.on('close', (codigo) => fim(codigo));
    // O programa pode terminar sem ler toda a entrada (EPIPE): nao e erro do aluno.
    filho.stdin.on('error', () => undefined);
    filho.stdin.end(entrada);
  });
}

let javaOk: Promise<boolean> | null = null;

export function javaDisponivel(): Promise<boolean> {
  if (!javaOk) {
    javaOk = Promise.all([
      rodar('javac', ['-version'], process.cwd(), '', 15000),
      rodar('java', ['-version'], process.cwd(), '', 15000),
    ]).then(([javac, java]) => javac.codigo === 0 && java.codigo === 0);
  }
  return javaOk;
}

export async function compilar(dir: string, arquivo: string): Promise<{ ok: boolean; mensagem: string }> {
  const resultado = await rodar('javac', ['-encoding', 'UTF-8', '-nowarn', '-J-Duser.language=en', arquivo], dir, '', 60000);
  const mensagem = `${resultado.stdout}${resultado.stderr}`.trim();
  if (resultado.estourouTempo) {
    return { ok: false, mensagem: 'O javac demorou demais para compilar (mais de 60s).' };
  }
  return { ok: resultado.codigo === 0, mensagem };
}

export async function executar(dir: string, classe: string, entrada: string, limiteMs: number): Promise<Execucao> {
  const resultado = await rodar(
    'java',
    ['-Xss256m', '-Xmx1024m', '-Dfile.encoding=UTF-8', '-Dstdout.encoding=UTF-8', '-Duser.language=en', '-Duser.country=US', '-cp', '.', classe],
    dir,
    entrada,
    limiteMs,
  );
  return {
    saida: resultado.stdout,
    erro: resultado.stderr.trim(),
    codigo: resultado.codigo,
    tempoMs: resultado.tempoMs,
    estourouTempo: resultado.estourouTempo,
  };
}
