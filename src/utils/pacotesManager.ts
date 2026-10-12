/**
 * Gerenciador do Sistema de Edições e Pacotes do Cyber Almanaque.
 * Permite múltiplos pacotes editoriais simultâneos, importação/exportação
 * e criação do Almanaque Comunitário a partir dos saberes e ideias locais.
 */

import diasDataRaw from '../data/almanaqueData.json';
import { AlmanaqueDia } from '../types/almanaque';
import { ItemPacote, PacoteAlmanaque } from '../types/pacotes';
import { getAllProblemas, getAllSaberes, saveProblema, saveSaber } from './colaborativoStorage';

const LS_PACOTES_KEY = 'cyber_almanaque_pacotes_instalados_v2';

// 1. Edição Padrão Embutida no Aplicativo
const diasIniciais = diasDataRaw as AlmanaqueDia[];

export const EDICAO_PADRAO_PACOTE: PacoteAlmanaque = {
  id: 'edicao-padrao-2026',
  nome: 'Cyber Almanaque • Edição Padrão',
  ano: 2026,
  regiao: 'Brasil / Salvador, BA',
  versao: '1.0',
  autoria: 'Redação Solarpunk e Memória Pública',
  rotulo_ia: 'Curadoria humana com apoio de IA',
  descricao: 'Edição inaugural com 7 dias de efemérides, poemas em domínio público e sabedoria cósmica.',
  ativo: true,
  embutido: true,
  itens: diasIniciais.map((dia) => ({
    id: `item-${dia.id}`,
    tipo: 'dia',
    titulo: `${dia.dataExtenso} • ${dia.leituraDoDia.titulo}`,
    autor: dia.leituraDoDia.autor || 'Redação Solarpunk',
    rotulo_ia: 'Domínio público e curadoria humana',
    pacoteId: 'edicao-padrao-2026',
    pacoteNome: 'Cyber Almanaque • Edição Padrão',
    dataIso: dia.dataIso,
    dados: dia,
  })),
};

/**
 * Valida o formato estrito de um pacote JSON
 */
export function validarPacoteJson(obj: any): { valido: boolean; erros: string[]; pacote?: PacoteAlmanaque } {
  const erros: string[] = [];

  if (!obj || typeof obj !== 'object') {
    return { valido: false, erros: ['O arquivo fornecido não é um objeto JSON válido.'] };
  }

  if (!obj.id || typeof obj.id !== 'string' || obj.id.trim() === '') {
    erros.push('Campo "id" é obrigatório e deve ser um texto identificador.');
  }

  if (!obj.nome || typeof obj.nome !== 'string' || obj.nome.trim() === '') {
    erros.push('Campo "nome" é obrigatório (ex: "Almanaque do Bairro").');
  }

  if (!obj.ano || isNaN(Number(obj.ano))) {
    erros.push('Campo "ano" é obrigatório e deve ser numérico (ex: 2026).');
  }

  if (!obj.regiao || typeof obj.regiao !== 'string') {
    erros.push('Campo "regiao" é obrigatório (ex: "Salvador, BA" ou "Vale do Paraíba").');
  }

  if (!obj.versao || typeof obj.versao !== 'string') {
    erros.push('Campo "versao" é obrigatório (ex: "1.0").');
  }

  if (!obj.autoria || typeof obj.autoria !== 'string') {
    erros.push('Campo "autoria" é obrigatório (ex: "Escola Comunitária das Águas").');
  }

  if (!Array.isArray(obj.itens)) {
    erros.push('Campo "itens" deve ser uma lista (array) contendo o conteúdo do pacote.');
  } else if (obj.itens.length === 0) {
    erros.push('O pacote não pode ser vazio; deve conter pelo menos um item em "itens".');
  } else {
    // Valida itens internos
    obj.itens.forEach((item: any, idx: number) => {
      if (!item.id || !item.titulo || !item.tipo) {
        erros.push(`Item ${idx + 1} em "itens" está incompleto (deve ter id, titulo e tipo).`);
      }
    });
  }

  if (erros.length > 0) {
    return { valido: false, erros };
  }

  const pacoteFormatado: PacoteAlmanaque = {
    id: String(obj.id).trim(),
    nome: String(obj.nome).trim(),
    ano: Number(obj.ano),
    regiao: String(obj.regiao).trim(),
    versao: String(obj.versao).trim(),
    autoria: String(obj.autoria).trim(),
    rotulo_ia: obj.rotulo_ia ? String(obj.rotulo_ia) : 'Autoria comunitária',
    descricao: obj.descricao ? String(obj.descricao) : undefined,
    ativo: obj.ativo !== undefined ? Boolean(obj.ativo) : true,
    embutido: false,
    itens: obj.itens.map((item: any) => ({
      ...item,
      pacoteId: String(obj.id).trim(),
      pacoteNome: String(obj.nome).trim(),
      rotulo_ia: item.rotulo_ia || obj.rotulo_ia || 'Autoria comunitária',
    })),
  };

  return { valido: true, erros: [], pacote: pacoteFormatado };
}

/**
 * Retorna todos os pacotes instalados no navegador (incluindo o padrão)
 */
export function getPacotesInstalados(): PacoteAlmanaque[] {
  if (typeof window === 'undefined') return [EDICAO_PADRAO_PACOTE];

  try {
    const raw = localStorage.getItem(LS_PACOTES_KEY);
    if (!raw) {
      savePacotesList([EDICAO_PADRAO_PACOTE]);
      return [EDICAO_PADRAO_PACOTE];
    }
    const list: PacoteAlmanaque[] = JSON.parse(raw);

    // Garante que a edição padrão embutida esteja sempre presente
    const temPadrao = list.some((p) => p.id === EDICAO_PADRAO_PACOTE.id);
    if (!temPadrao) {
      list.unshift(EDICAO_PADRAO_PACOTE);
      savePacotesList(list);
    }

    return list;
  } catch {
    return [EDICAO_PADRAO_PACOTE];
  }
}

/**
 * Grava a lista completa de pacotes no localStorage
 */
function savePacotesList(list: PacoteAlmanaque[]) {
  try {
    localStorage.setItem(LS_PACOTES_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('Erro ao salvar lista de pacotes:', err);
  }
}

/**
 * Importa um novo pacote (adiciona ou atualiza se já existir)
 */
export function importarPacote(pacote: PacoteAlmanaque): { success: boolean; error?: string } {
  const list = getPacotesInstalados();
  const index = list.findIndex((p) => p.id === pacote.id);

  if (index !== -1) {
    // Se for o embutido, impede sobrescrever o ID protegido
    if (list[index].embutido) {
      return { success: false, error: 'Não é permitido sobrescrever a Edição Padrão do sistema.' };
    }
    list[index] = { ...pacote, ativo: true, embutido: false };
  } else {
    list.push({ ...pacote, ativo: true, embutido: false });
  }

  savePacotesList(list);

  // Sincroniza saberes e ideias com as coleções locais para circulação comunitária
  pacote.itens.forEach((item) => {
    if (item.tipo === 'saber' && item.dados) {
      saveSaber({
        titulo: item.titulo,
        quemEnsinou: item.autor || 'Tradição comunitária',
        geracao: item.dados.geracao || 'Comunitário',
        tipo: item.dados.tipo || 'receita',
        texto: item.dados.texto || '',
      }).catch(() => {});
    } else if (item.tipo === 'ideia' && item.dados) {
      saveProblema({
        titulo: item.titulo,
        descricao: item.dados.descricao || '',
        quemEAfetado: item.dados.quemEAfetado || 'Comunidade local',
        estado: item.dados.estado || 'aberto',
      }).catch(() => {});
    }
  });

  return { success: true };
}

/**
 * Alterna ativação (ligar / desligar) de um pacote
 */
export function alternarAtivacaoPacote(id: string, ativo: boolean): void {
  const list = getPacotesInstalados();
  const target = list.find((p) => p.id === id);
  if (target) {
    target.ativo = ativo;
    savePacotesList(list);
  }
}

/**
 * Remove um pacote do dispositivo (não permite remover a edição padrão embutida)
 */
export function removerPacote(id: string): { success: boolean; error?: string } {
  const list = getPacotesInstalados();
  const target = list.find((p) => p.id === id);

  if (!target) {
    return { success: false, error: 'Pacote não encontrado.' };
  }

  if (target.embutido) {
    return { success: false, error: 'A Edição Padrão embutida não pode ser removida (apenas desativada se desejar).' };
  }

  const novaLista = list.filter((p) => p.id !== id);
  savePacotesList(novaLista);
  return { success: true };
}

export interface DiaComMetadados {
  dia: AlmanaqueDia;
  meta: ItemPacote;
  pacoteNome: string;
  pacoteId: string;
}

/**
 * Compila e retorna todos os dias ativos de todos os pacotes atualmente ativados
 */
export function getTodosDiasAtivos(): DiaComMetadados[] {
  const pacotes = getPacotesInstalados().filter((p) => p.ativo !== false);
  const diasMap = new Map<string, DiaComMetadados>();

  pacotes.forEach((pacote) => {
    pacote.itens.forEach((item) => {
      if (item.tipo === 'dia' && item.dados && item.dados.id) {
        // Se a data já existir, o pacote importado pode complementar ou substituir
        diasMap.set(item.dados.id, {
          dia: item.dados as AlmanaqueDia,
          meta: item,
          pacoteNome: pacote.nome,
          pacoteId: pacote.id,
        });
      }
    });
  });

  const lista = Array.from(diasMap.values());
  // Ordena cronologicamente pela dataIso
  lista.sort((a, b) => a.dia.dataIso.localeCompare(b.dia.dataIso));

  // Fallback se todos os pacotes forem desativados
  if (lista.length === 0) {
    return EDICAO_PADRAO_PACOTE.itens.map((item) => ({
      dia: item.dados as AlmanaqueDia,
      meta: item,
      pacoteNome: EDICAO_PADRAO_PACOTE.nome,
      pacoteId: EDICAO_PADRAO_PACOTE.id,
    }));
  }

  return lista;
}

/**
 * Exporta os saberes e ideias do usuário como um pacote no formato padrão:
 * { id, nome, ano, regiao, versao, autoria, rotulo_ia, itens[] }
 */
export async function exportarPacoteComunitario(form: {
  nome: string;
  ano: number;
  regiao: string;
  autoria: string;
  rotulo_ia: string;
  descricao: string;
}): Promise<string> {
  const saberes = await getAllSaberes();
  const problemas = await getAllProblemas();

  const itensPacote: ItemPacote[] = [];

  // Converte saberes em itens de pacote
  saberes.forEach((s) => {
    itensPacote.push({
      id: `comunitario-saber-${s.id}`,
      tipo: 'saber',
      titulo: s.titulo,
      autor: s.quemEnsinou,
      rotulo_ia: form.rotulo_ia,
      dados: s,
    });
  });

  // Converte ideias/problemas em itens de pacote
  problemas.forEach((p) => {
    itensPacote.push({
      id: `comunitario-ideia-${p.id}`,
      tipo: 'ideia',
      titulo: p.titulo,
      autor: form.autoria,
      rotulo_ia: form.rotulo_ia,
      dados: p,
    });
  });

  // Se não houver itens ainda, adiciona uma semente/apresentação para o pacote ser válido
  if (itensPacote.length === 0) {
    itensPacote.push({
      id: `comunitario-intro-${Date.now()}`,
      tipo: 'saber',
      titulo: `Apresentação: ${form.nome.trim() || 'Almanaque Comunitário'}`,
      autor: form.autoria.trim() || 'Coletivo Comunitário',
      rotulo_ia: form.rotulo_ia.trim() || '100% autoria humana comunitária',
      dados: {
        id: `intro-${Date.now()}`,
        titulo: `Apresentação: ${form.nome.trim() || 'Almanaque Comunitário'}`,
        quemEnsinou: form.autoria.trim() || 'Coletivo Comunitário',
        geracao: form.regiao.trim() || 'Território Comunitário',
        tipo: 'causo',
        texto: form.descricao.trim() || 'Almanaque com saberes e soluções locais gerados pela nossa comunidade.',
      },
    });
  }

  const pacoteId = `pacote-comunitario-${Date.now()}`;

  const pacoteExportado: PacoteAlmanaque = {
    id: pacoteId,
    nome: form.nome.trim() || 'Almanaque Comunitário',
    ano: form.ano || new Date().getFullYear(),
    regiao: form.regiao.trim() || 'Comunidade Local',
    versao: '1.0',
    autoria: form.autoria.trim() || 'Coletivo Comunitário',
    rotulo_ia: form.rotulo_ia.trim() || '100% autoria humana comunitária',
    descricao: form.descricao.trim() || 'Compêndio de saberes ancestrais e ideias coletivas locais.',
    itens: itensPacote,
  };

  return JSON.stringify(pacoteExportado, null, 2);
}
