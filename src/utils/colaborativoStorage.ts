/**
 * Armazenamento local das seções colaborativas:
 * "Banco de saberes" e "Laboratório de ideias".
 * Salvo no IndexedDB com contingência automática no localStorage.
 * 100% no aparelho, sem login e sem servidor.
 */

import { ProblemaComunitario, SaberItem, SolucaoIdeia } from '../types/colaborativo';

const DB_NAME = 'CyberAlmanaqueColabDB';
const DB_VERSION = 1;
const STORE_SABERES = 'saberes_populares';
const STORE_PROBLEMAS = 'laboratorio_problemas';

const LS_KEY_SABERES = 'cyber_almanaque_saberes_v1';
const LS_KEY_PROBLEMAS = 'cyber_almanaque_problemas_v1';

// Sementes iniciais para demonstrar o espírito da comunidade
const SEED_SABERES: SaberItem[] = [
  {
    id: 'saber-1',
    titulo: 'Chá de Guaco com Casca de Cebola para Tosse Seca',
    quemEnsinou: 'Dona Benvinda',
    geracao: 'Avó / Parteira do Recôncavo',
    tipo: 'remédio de quintal',
    texto: 'Ferva 4 folhas frescas de guaco lavadas junto com a casca limpa de meia cebola roxa e um pedaço pequeno de gengibre em duas xícaras de água por 5 minutos. Desligue o fogo, abafe por 10 minutos e adoce com uma colher de mel de abelha jataí morno. Tomar à noite antes de deitar.',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'saber-2',
    titulo: 'Bolo de Fubá Suado com Erva-doce na Folha de Bananeira',
    quemEnsinou: 'Tia Celina',
    geracao: 'Mãe e Cozinheira de Fogão à Lenha',
    tipo: 'receita',
    texto: 'Misture 2 copos de fubá mimoso, 1 copo de açúcar mascavo ou rapadura ralada, 1 colher de manteiga de garrafa e leite fresco até formar uma massa cremosa. Adicione uma colher de sementes de erva-doce tostadas na frigideira. Forre a forma com folhas de bananeira passadas rapidamente no fogo e asse lentamente.',
    createdAt: Date.now() - 86400000 * 12,
    updatedAt: Date.now() - 86400000 * 12,
  },
  {
    id: 'saber-3',
    titulo: 'Como Amolar Enxada e Foice em Pedra d\'Água',
    quemEnsinou: 'Seu Zé do Vale',
    geracao: 'Mestre Ferreiro e Roceiro',
    tipo: 'ofício',
    texto: 'Mantenha a pedra arenítica sempre molhada com água fresca (nunca amole no seco para não queimar o fio do aço). Deslize a lâmina em ângulo suave de 25 graus fazendo movimentos circulares e firmes de ponta a ponta. O segredo é manter a mesma pressão nos dois lados até a rebarba desaparecer.',
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 86400000 * 20,
  },
  {
    id: 'saber-4',
    titulo: 'O Causo do Vagalume e a Nascente que Não Seca',
    quemEnsinou: 'Mestre Silvério',
    geracao: 'Contador de Histórias da Chapada',
    tipo: 'causo',
    texto: 'Contavam os velhos que toda nascente tem uma mãe d\'água que mora nas raízes da gameleira. Se você derrubar a mata ao redor, os vagalumes fogem e a água vai embora para o fundo da terra de vergonha. Para a água voltar, o povoado precisa plantar sete mudas nativas e cantar no amanhecer.',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 30,
  },
];

const SEED_PROBLEMAS: ProblemaComunitario[] = [
  {
    id: 'prob-1',
    titulo: 'Descarte irregular de entulho na curva do córrego',
    descricao: 'Algumas pessoas e pequenas reformas estão jogando sacos de entulho e restos de telha na curva do córrego da rua de trás, bloqueando a vazão da água da chuva e criando mato alto.',
    quemEAfetado: 'Os moradores das quatro casas mais baixas que correm risco de alagamento quando chove forte.',
    estado: 'em andamento',
    solucoes: [
      {
        id: 'sol-1',
        texto: 'Mutirão comunitário no próximo sábado pela manhã para recolher os sacos e empilhar em local acessível à caçamba municipal.',
        sugeridoPor: 'Comissão de moradores',
        dataCriacao: Date.now() - 86400000 * 2,
      },
      {
        id: 'sol-2',
        texto: 'Plantio de mudas de girassol e crotálaria no terreno limpo com uma placa de madeira: "Cuidamos deste pedaço de terra juntos".',
        sugeridoPor: 'Dona Lúcia',
        dataCriacao: Date.now() - 86400000 * 1,
      },
    ],
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 1,
  },
  {
    id: 'prob-2',
    titulo: 'Falta de iluminação e sombra no ponto de ônibus da praça',
    descricao: 'As crianças e idosos que esperam a condução pela manhã ficam no sol escaldante, e à noite o ponto fica escuro porque o poste de luz foi quebrado.',
    quemEAfetado: 'Trabalhadores e estudantes que utilizam a linha 04 todos os dias.',
    estado: 'aberto',
    solucoes: [
      {
        id: 'sol-3',
        texto: 'Propor na associação de bairro a construção de uma pérgula simples de bambu com trepadeira maracujá para dar sombra natural.',
        sugeridoPor: 'Marcos carpinteiro',
        dataCriacao: Date.now() - 86400000 * 3,
      },
    ],
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now() - 86400000 * 3,
  },
];

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB não suportado'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_SABERES)) {
        const storeSaberes = db.createObjectStore(STORE_SABERES, { keyPath: 'id' });
        storeSaberes.createIndex('tipo', 'tipo', { unique: false });
        SEED_SABERES.forEach((s) => storeSaberes.add(s));
      }
      if (!db.objectStoreNames.contains(STORE_PROBLEMAS)) {
        const storeProblemas = db.createObjectStore(STORE_PROBLEMAS, { keyPath: 'id' });
        storeProblemas.createIndex('estado', 'estado', { unique: false });
        SEED_PROBLEMAS.forEach((p) => storeProblemas.add(p));
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Falha ao abrir IndexedDB'));
  });
}

// Contingência localStorage para Saberes
function getSaberesLS(): SaberItem[] {
  try {
    const raw = localStorage.getItem(LS_KEY_SABERES);
    if (!raw) {
      localStorage.setItem(LS_KEY_SABERES, JSON.stringify(SEED_SABERES));
      return [...SEED_SABERES];
    }
    return JSON.parse(raw);
  } catch {
    return [...SEED_SABERES];
  }
}

function saveSaberesLS(list: SaberItem[]) {
  try {
    localStorage.setItem(LS_KEY_SABERES, JSON.stringify(list));
  } catch (err) {
    console.warn('Erro ao salvar no localStorage:', err);
  }
}

// Contingência localStorage para Problemas
function getProblemasLS(): ProblemaComunitario[] {
  try {
    const raw = localStorage.getItem(LS_KEY_PROBLEMAS);
    if (!raw) {
      localStorage.setItem(LS_KEY_PROBLEMAS, JSON.stringify(SEED_PROBLEMAS));
      return [...SEED_PROBLEMAS];
    }
    return JSON.parse(raw);
  } catch {
    return [...SEED_PROBLEMAS];
  }
}

function saveProblemasLS(list: ProblemaComunitario[]) {
  try {
    localStorage.setItem(LS_KEY_PROBLEMAS, JSON.stringify(list));
  } catch (err) {
    console.warn('Erro ao salvar no localStorage:', err);
  }
}

// ======================== SABERES CRUD ========================

export async function getAllSaberes(): Promise<SaberItem[]> {
  try {
    const db = await openDB();
    const list = await new Promise<SaberItem[]>((resolve, reject) => {
      const tx = db.transaction(STORE_SABERES, 'readonly');
      const store = tx.objectStore(STORE_SABERES);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
    return list.sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return getSaberesLS().sort((a, b) => b.createdAt - a.createdAt);
  }
}

export async function saveSaber(
  novo: Omit<SaberItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<SaberItem> {
  const now = Date.now();
  const item: SaberItem = {
    ...novo,
    id: `saber-${now}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_SABERES, 'readwrite');
      const store = tx.objectStore(STORE_SABERES);
      store.add(item);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('IndexedDB indisponível, usando contingência:', err);
  }

  const list = getSaberesLS();
  list.unshift(item);
  saveSaberesLS(list);

  return item;
}

export async function updateSaber(id: string, updates: Partial<SaberItem>): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_SABERES, 'readwrite');
      const store = tx.objectStore(STORE_SABERES);
      const getReq = store.get(id);
      getReq.onsuccess = () => {
        const existing = getReq.result as SaberItem | undefined;
        if (existing) {
          const updated = { ...existing, ...updates, updatedAt: Date.now() };
          store.put(updated);
        }
      };
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Erro ao atualizar saber no IndexedDB:', err);
  }

  const list = getSaberesLS();
  const idx = list.findIndex((s) => s.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates, updatedAt: Date.now() };
    saveSaberesLS(list);
  }
}

export async function deleteSaber(id: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_SABERES, 'readwrite');
      const store = tx.objectStore(STORE_SABERES);
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Erro ao apagar saber no IndexedDB:', err);
  }

  const list = getSaberesLS().filter((s) => s.id !== id);
  saveSaberesLS(list);
}

// ======================== PROBLEMAS COMUNITÁRIOS CRUD ========================

export async function getAllProblemas(): Promise<ProblemaComunitario[]> {
  try {
    const db = await openDB();
    const list = await new Promise<ProblemaComunitario[]>((resolve, reject) => {
      const tx = db.transaction(STORE_PROBLEMAS, 'readonly');
      const store = tx.objectStore(STORE_PROBLEMAS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
    return list.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return getProblemasLS().sort((a, b) => b.updatedAt - a.updatedAt);
  }
}

export async function saveProblema(
  novo: Omit<ProblemaComunitario, 'id' | 'createdAt' | 'updatedAt' | 'solucoes'>
): Promise<ProblemaComunitario> {
  const now = Date.now();
  const item: ProblemaComunitario = {
    ...novo,
    id: `prob-${now}-${Math.random().toString(36).substring(2, 7)}`,
    solucoes: [],
    createdAt: now,
    updatedAt: now,
  };

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_PROBLEMAS, 'readwrite');
      const store = tx.objectStore(STORE_PROBLEMAS);
      store.add(item);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('IndexedDB indisponível, usando contingência:', err);
  }

  const list = getProblemasLS();
  list.unshift(item);
  saveProblemasLS(list);

  return item;
}

export async function updateProblema(
  id: string,
  updates: Partial<ProblemaComunitario>
): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_PROBLEMAS, 'readwrite');
      const store = tx.objectStore(STORE_PROBLEMAS);
      const getReq = store.get(id);
      getReq.onsuccess = () => {
        const existing = getReq.result as ProblemaComunitario | undefined;
        if (existing) {
          const updated = { ...existing, ...updates, updatedAt: Date.now() };
          store.put(updated);
        }
      };
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Erro ao atualizar problema no IndexedDB:', err);
  }

  const list = getProblemasLS();
  const idx = list.findIndex((p) => p.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates, updatedAt: Date.now() };
    saveProblemasLS(list);
  }
}

export async function addSolucaoToProblema(
  problemaId: string,
  texto: string,
  sugeridoPor?: string
): Promise<void> {
  const novaSolucao: SolucaoIdeia = {
    id: `sol-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    texto: texto.trim(),
    sugeridoPor: sugeridoPor?.trim() || undefined,
    dataCriacao: Date.now(),
  };

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_PROBLEMAS, 'readwrite');
      const store = tx.objectStore(STORE_PROBLEMAS);
      const getReq = store.get(problemaId);
      getReq.onsuccess = () => {
        const existing = getReq.result as ProblemaComunitario | undefined;
        if (existing) {
          existing.solucoes.push(novaSolucao);
          existing.updatedAt = Date.now();
          store.put(existing);
        }
      };
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Erro ao anexar solução via IndexedDB:', err);
  }

  const list = getProblemasLS();
  const target = list.find((p) => p.id === problemaId);
  if (target) {
    target.solucoes.push(novaSolucao);
    target.updatedAt = Date.now();
    saveProblemasLS(list);
  }
}

export async function deleteProblema(id: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_PROBLEMAS, 'readwrite');
      const store = tx.objectStore(STORE_PROBLEMAS);
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Erro ao apagar problema no IndexedDB:', err);
  }

  const list = getProblemasLS().filter((p) => p.id !== id);
  saveProblemasLS(list);
}

// ======================== EXPORTAÇÃO E IMPORTAÇÃO COMPARTILHADA ========================

export async function exportColaborativoAsJson(): Promise<string> {
  const saberes = await getAllSaberes();
  const problemas = await getAllProblemas();

  const payload = {
    app: 'Cyber Almanaque',
    tipo: 'saberes_e_ideias_comunitarias',
    exportadoEm: new Date().toISOString(),
    totalSaberes: saberes.length,
    totalProblemas: problemas.length,
    saberes,
    problemas,
  };

  return JSON.stringify(payload, null, 2);
}

export async function importColaborativoFromJson(
  jsonString: string
): Promise<{ success: boolean; saberesCount: number; problemasCount: number; error?: string }> {
  try {
    const parsed = JSON.parse(jsonString);

    let saberesNovos: SaberItem[] = [];
    let problemasNovos: ProblemaComunitario[] = [];

    if (Array.isArray(parsed.saberes)) {
      saberesNovos = parsed.saberes;
    }
    if (Array.isArray(parsed.problemas)) {
      problemasNovos = parsed.problemas;
    }

    let sCount = 0;
    for (const s of saberesNovos) {
      if (s.titulo && s.texto && s.tipo) {
        await saveSaber({
          titulo: s.titulo,
          quemEnsinou: s.quemEnsinou || 'Tradição comunitária',
          geracao: s.geracao || 'Comunidade',
          tipo: s.tipo,
          texto: s.texto,
        });
        sCount++;
      }
    }

    let pCount = 0;
    for (const p of problemasNovos) {
      if (p.titulo && p.descricao) {
        const saved = await saveProblema({
          titulo: p.titulo,
          descricao: p.descricao,
          quemEAfetado: p.quemEAfetado || 'Vizinhança',
          estado: p.estado || 'aberto',
        });
        if (Array.isArray(p.solucoes)) {
          for (const sol of p.solucoes) {
            if (sol.texto) {
              await addSolucaoToProblema(saved.id, sol.texto, sol.sugeridoPor);
            }
          }
        }
        pCount++;
      }
    }

    return {
      success: true,
      saberesCount: sCount,
      problemasCount: pCount,
    };
  } catch (err: any) {
    return {
      success: false,
      saberesCount: 0,
      problemasCount: 0,
      error: err?.message || 'Arquivo JSON inválido.',
    };
  }
}
