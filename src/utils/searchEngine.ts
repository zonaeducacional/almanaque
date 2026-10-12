/**
 * Motor de busca global offline usando MiniSearch.
 * Indexa dias do almanaque, todas as seções, notas de margem, saberes e ideias.
 */

import MiniSearch from 'minisearch';
import { getTodosDiasAtivos, getPacotesInstalados } from './pacotesManager';
import manualDataRaw from '../data/manualSobrevivenciaData.json';
import maquinasDataRaw from '../data/conversandoMaquinasData.json';
import climaDataRaw from '../data/climaTerritorioData.json';
import atencaoDataRaw from '../data/atencaoCorpoData.json';
import direitosDataRaw from '../data/direitosCidadaniaData.json';
import oficinasDataRaw from '../data/oficinasData.json';

import { getAllMarginNotes } from './notesStorage';
import { getAllProblemas, getAllSaberes } from './colaborativoStorage';

export type GrupoBusca =
  | 'Dias do Almanaque'
  | 'Seções Temáticas'
  | 'Notas de Margem'
  | 'Banco de Saberes'
  | 'Laboratório de Ideias';

export interface SearchDoc {
  id: string;
  titulo: string;
  conteudo: string;
  categoria: string;
  tipoGrupo: GrupoBusca;
  linkTarget: {
    tab: 'hoje' | 'secoes' | 'margens';
    sectionId?: string;
    dayIndex?: number;
  };
}

export interface SearchResultItem {
  id: string;
  titulo: string;
  conteudoSnippet: string;
  categoria: string;
  tipoGrupo: GrupoBusca;
  linkTarget: SearchDoc['linkTarget'];
  score: number;
}

let miniSearchInstance: MiniSearch<SearchDoc> | null = null;

/**
 * Constrói os documentos estáticos do Almanaque e Seções
 */
function buildStaticDocs(): SearchDoc[] {
  const docs: SearchDoc[] = [];

  // 1. Dias do Almanaque (de todos os pacotes ativos instalados)
  const diasAtivos = getTodosDiasAtivos();
  diasAtivos.forEach((item, idx) => {
    const d = item.dia;
    // Leitura
    docs.push({
      id: `dia-leitura-${d.id}`,
      titulo: `${d.leituraDoDia.titulo} (${d.leituraDoDia.autor})`,
      conteudo: `${d.dataExtenso}. ${item.pacoteNome}. ${d.leituraDoDia.texto} ${d.leituraDoDia.notaEditorial || ''}`,
      categoria: 'Leitura do Dia',
      tipoGrupo: 'Dias do Almanaque',
      linkTarget: { tab: 'hoje', dayIndex: idx },
    });
    // Notícia positiva
    docs.push({
      id: `dia-progresso-${d.id}`,
      titulo: d.placarProgresso.titulo,
      conteudo: `${d.dataExtenso}. ${item.pacoteNome}. ${d.placarProgresso.descricao} ${d.placarProgresso.numeroDestaque}`,
      categoria: 'Placar de Progresso',
      tipoGrupo: 'Dias do Almanaque',
      linkTarget: { tab: 'hoje', dayIndex: idx },
    });
    // Efeméride da Ciência
    docs.push({
      id: `dia-ciencia-${d.id}`,
      titulo: `${d.hojeNaCiencia.titulo} (Ano ${d.hojeNaCiencia.ano})`,
      conteudo: `${d.hojeNaCiencia.descricao} ${d.hojeNaCiencia.relevancia}`,
      categoria: 'Hoje na Ciência',
      tipoGrupo: 'Dias do Almanaque',
      linkTarget: { tab: 'hoje', dayIndex: idx },
    });
    // Gesto do Dia
    docs.push({
      id: `dia-gesto-${d.id}`,
      titulo: d.gestoDoDia.titulo,
      conteudo: `${d.gestoDoDia.acao} ${d.gestoDoDia.proposito}`,
      categoria: 'Gesto do Dia',
      tipoGrupo: 'Dias do Almanaque',
      linkTarget: { tab: 'hoje', dayIndex: idx },
    });
    // Palavra ou Provérbio
    docs.push({
      id: `dia-palavra-${d.id}`,
      titulo: `“${d.palavraOuProverbio.termo}” (${d.palavraOuProverbio.origem})`,
      conteudo: `${d.palavraOuProverbio.significado} ${d.palavraOuProverbio.reflexao}`,
      categoria: 'Palavra ou Provérbio',
      tipoGrupo: 'Dias do Almanaque',
      linkTarget: { tab: 'hoje', dayIndex: idx },
    });
  });

  // 1b. Pacotes Editoriais
  try {
    const pacotes = getPacotesInstalados();
    pacotes.forEach((p) => {
      docs.push({
        id: `pacote-${p.id}`,
        titulo: `${p.nome} (${p.regiao})`,
        conteudo: `${p.descricao || ''} Autoria: ${p.autoria}. Versão: ${p.versao}. Rótulo IA: ${p.rotulo_ia || ''}`,
        categoria: 'Edições e Pacotes',
        tipoGrupo: 'Seções Temáticas',
        linkTarget: { tab: 'secoes' },
      });
    });
  } catch {}

  // 2. Manual de Sobrevivência Digital
  const manual = manualDataRaw as any;
  if (Array.isArray(manual.verbetes)) {
    manual.verbetes.forEach((v: any) => {
      docs.push({
        id: `manual-${v.id}`,
        titulo: v.titulo,
        conteudo: `${v.resumo} ${(v.comoReconhecer || []).join(' ')} ${(v.oQueFazer || []).join(' ')} ${v.dicaDeOuro || ''}`,
        categoria: 'Sobrevivência Digital',
        tipoGrupo: 'Seções Temáticas',
        linkTarget: { tab: 'secoes', sectionId: 'manual-digital' },
      });
    });
  }

  // 3. Conversando com Máquinas
  const maquinas = maquinasDataRaw as any;
  if (Array.isArray(maquinas.verbetes)) {
    maquinas.verbetes.forEach((v: any) => {
      docs.push({
        id: `maquinas-${v.id}`,
        titulo: v.titulo,
        conteudo: `${v.resumo} ${v.oProblema || ''} ${v.oQueEstaMelhorando || ''} ${(v.oQueFazer || []).join(' ')} ${v.gestoPratico?.acao || ''}`,
        categoria: 'Conversando com Máquinas',
        tipoGrupo: 'Seções Temáticas',
        linkTarget: { tab: 'secoes', sectionId: 'conversando-maquinas' },
      });
    });
  }

  // 4. Clima e Território
  const clima = climaDataRaw as any;
  if (Array.isArray(clima.regioes)) {
    clima.regioes.forEach((r: any) => {
      if (Array.isArray(r.estacoes)) {
        r.estacoes.forEach((e: any) => {
          docs.push({
            id: `clima-${r.id}-${e.estacaoId}`,
            titulo: `${e.tituloEstacao} (${r.nome})`,
            conteudo: `${e.oQueEsperar} ${(e.oQuePlantarOuCuidar || []).join(' ')} ${(e.comoEconomizarAgua || []).join(' ')} ${e.gestoPratico?.acao || ''}`,
            categoria: 'Clima e Território',
            tipoGrupo: 'Seções Temáticas',
            linkTarget: { tab: 'secoes', sectionId: 'clima-territorio' },
          });
        });
      }
    });
  }

  // 5. Atenção e Corpo
  const atencao = atencaoDataRaw as any;
  if (Array.isArray(atencao.pausasGuiadas)) {
    atencao.pausasGuiadas.forEach((p: any) => {
      docs.push({
        id: `atencao-${p.id}`,
        titulo: `${p.titulo} (${p.tipo})`,
        conteudo: `${p.descricao} ${(p.passos || []).join(' ')} ${p.sensacaoEsperada || ''}`,
        categoria: 'Atenção e Corpo',
        tipoGrupo: 'Seções Temáticas',
        linkTarget: { tab: 'secoes', sectionId: 'atencao-corpo' },
      });
    });
  }
  if (atencao.sabadoSemTela) {
    docs.push({
      id: 'atencao-sabado-sem-tela',
      titulo: atencao.sabadoSemTela.titulo,
      conteudo: `${atencao.sabadoSemTela.proposta} ${atencao.sabadoSemTela.semCulpa} ${(atencao.sabadoSemTela.ideiasParaOPrimeiroDia || []).join(' ')}`,
      categoria: 'Atenção e Corpo',
      tipoGrupo: 'Seções Temáticas',
      linkTarget: { tab: 'secoes', sectionId: 'atencao-corpo' },
    });
  }

  // 6. Direitos e Cidadania
  const direitos = direitosDataRaw as any;
  if (Array.isArray(direitos.verbetes)) {
    direitos.verbetes.forEach((v: any) => {
      docs.push({
        id: `direitos-${v.id}`,
        titulo: v.titulo,
        conteudo: `${v.categoria}: ${v.oQueE} ${v.comoFunciona} ${v.oQueFazer}`,
        categoria: 'Direitos e Cidadania',
        tipoGrupo: 'Seções Temáticas',
        linkTarget: { tab: 'secoes', sectionId: 'direitos-cidadania' },
      });
    });
  }
  if (Array.isArray(direitos.modelosDeTexto)) {
    direitos.modelosDeTexto.forEach((m: any) => {
      docs.push({
        id: `modelo-${m.id}`,
        titulo: m.titulo,
        conteudo: `${m.destinatario} ${m.texto}`,
        categoria: 'Modelo de Texto',
        tipoGrupo: 'Seções Temáticas',
        linkTarget: { tab: 'secoes', sectionId: 'direitos-cidadania' },
      });
    });
  }

  // 7. Oficinas
  const oficinas = oficinasDataRaw as any;
  if (Array.isArray(oficinas.projetos)) {
    oficinas.projetos.forEach((proj: any) => {
      docs.push({
        id: `oficinas-${proj.id}`,
        titulo: proj.titulo,
        conteudo: `${proj.descricao} Materiais: ${(proj.materiais || []).join(', ')}. Passos: ${(proj.passos || []).join(' ')} ${proj.dicaMestre || ''}`,
        categoria: 'Oficinas',
        tipoGrupo: 'Seções Temáticas',
        linkTarget: { tab: 'secoes', sectionId: 'oficinas' },
      });
    });
  }

  return docs;
}

/**
 * Inicializa ou reconstrói o índice MiniSearch com conteúdo estático e dinâmico
 */
export async function buildSearchIndex(): Promise<MiniSearch<SearchDoc>> {
  const docs: SearchDoc[] = buildStaticDocs();

  // 8. Notas de Margem Dinâmicas do usuário
  try {
    const notas = await getAllMarginNotes();
    notas.forEach((n) => {
      docs.push({
        id: `nota-margem-${n.id}`,
        titulo: `Nota de Margem (${n.dateIso})`,
        conteudo: n.content,
        categoria: 'Diário Pessoal',
        tipoGrupo: 'Notas de Margem',
        linkTarget: { tab: 'margens' },
      });
    });
  } catch (err) {
    console.warn('Erro ao indexar notas de margem:', err);
  }

  // 9. Banco de Saberes Dinâmico
  try {
    const saberes = await getAllSaberes();
    saberes.forEach((s) => {
      docs.push({
        id: `saber-user-${s.id}`,
        titulo: `${s.titulo} (${s.tipo})`,
        conteudo: `Ensinado por ${s.quemEnsinou} (${s.geracao}): ${s.texto}`,
        categoria: 'Saberes Populares',
        tipoGrupo: 'Banco de Saberes',
        linkTarget: { tab: 'secoes', sectionId: 'banco-saberes' },
      });
    });
  } catch (err) {
    console.warn('Erro ao indexar saberes:', err);
  }

  // 10. Laboratório de Ideias Dinâmico
  try {
    const problemas = await getAllProblemas();
    problemas.forEach((p) => {
      const solucoesTexto = p.solucoes.map((sol) => sol.texto).join(' ');
      docs.push({
        id: `problema-user-${p.id}`,
        titulo: `${p.titulo} [${p.estado}]`,
        conteudo: `${p.descricao} Afetados: ${p.quemEAfetado}. Soluções: ${solucoesTexto}`,
        categoria: 'Mobilização Comunitária',
        tipoGrupo: 'Laboratório de Ideias',
        linkTarget: { tab: 'secoes', sectionId: 'laboratorio-ideias' },
      });
    });
  } catch (err) {
    console.warn('Erro ao indexar ideias:', err);
  }

  const miniSearch = new MiniSearch<SearchDoc>({
    fields: ['titulo', 'conteudo', 'categoria'],
    storeFields: ['id', 'titulo', 'conteudo', 'categoria', 'tipoGrupo', 'linkTarget'],
    searchOptions: {
      prefix: true,
      fuzzy: 0.2,
      boost: { titulo: 2 },
    },
  });

  miniSearch.addAll(docs);
  miniSearchInstance = miniSearch;
  return miniSearch;
}

/**
 * Realiza a busca e retorna os resultados agrupados
 */
export async function performGlobalSearch(
  query: string
): Promise<{ total: number; agrupados: Record<GrupoBusca, SearchResultItem[]> }> {
  const clean = query.trim();
  const emptyRes: Record<GrupoBusca, SearchResultItem[]> = {
    'Dias do Almanaque': [],
    'Seções Temáticas': [],
    'Notas de Margem': [],
    'Banco de Saberes': [],
    'Laboratório de Ideias': [],
  };

  if (!clean || clean.length < 2) {
    return { total: 0, agrupados: emptyRes };
  }

  if (!miniSearchInstance) {
    await buildSearchIndex();
  }

  const results = miniSearchInstance!.search(clean);

  const agrupados = { ...emptyRes };
  let total = 0;

  results.forEach((res) => {
    total++;
    const doc = res as unknown as SearchDoc & { score: number };
    const snippet = extractSnippet(doc.conteudo, clean);

    const item: SearchResultItem = {
      id: doc.id,
      titulo: doc.titulo,
      conteudoSnippet: snippet,
      categoria: doc.categoria,
      tipoGrupo: doc.tipoGrupo,
      linkTarget: doc.linkTarget,
      score: doc.score,
    };

    if (agrupados[doc.tipoGrupo]) {
      agrupados[doc.tipoGrupo].push(item);
    }
  });

  return { total, agrupados };
}

/**
 * Cria um trecho representativo em torno do termo pesquisado
 */
function extractSnippet(text: string, term: string, maxLength = 140): string {
  const lowerText = text.toLowerCase();
  const lowerTerm = term.toLowerCase();
  const idx = lowerText.indexOf(lowerTerm);

  if (idx === -1) {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  }

  const start = Math.max(0, idx - 40);
  const end = Math.min(text.length, idx + term.length + 80);
  const prefix = start > 0 ? '...' : '';
  const suffix = end < text.length ? '...' : '';

  return `${prefix}${text.substring(start, end).trim()}${suffix}`;
}
