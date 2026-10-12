/**
 * Armazenamento local do Diário de Margem.
 * Usa IndexedDB como primário e localStorage como contingência automática.
 * 100% no aparelho, sem contas, sem telemetria.
 */

export interface MarginNote {
  id: string; // Ex: "note-2026-10-11"
  dateIso: string; // "YYYY-MM-DD"
  dayMonth: string; // "MM-DD"
  year: number; // 2026
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface PastYearMemory {
  yearsAgo: number;
  pastYear: number;
  note: MarginNote;
}

const DB_NAME = 'CyberAlmanaqueDB';
const DB_VERSION = 1;
const STORE_NAME = 'margens';
const LOCALSTORAGE_KEY = 'cyber_almanaque_margin_notes_v1';

// Notas de exemplo do ano anterior (para demonstrar a memória histórica logo no primeiro uso)
const SEED_NOTES: MarginNote[] = [
  {
    id: 'note-2025-10-11',
    dateIso: '2025-10-11',
    dayMonth: '10-11',
    year: 2025,
    content: 'A primavera amanheceu fresca. Plantei sementes de manjericão no vaso da janela e ouvi os primeiros sabiás na laranjeira da rua.',
    createdAt: new Date('2025-10-11T09:30:00').getTime(),
    updatedAt: new Date('2025-10-11T09:30:00').getTime(),
  },
  {
    id: 'note-2025-10-12',
    dateIso: '2025-10-12',
    dayMonth: '10-12',
    year: 2025,
    content: 'Caminhei sem relógio ao entardecer. O céu sobre a baía ficou entre o ocre e o violeta. Encontrei dona Irene regando as samambaias.',
    createdAt: new Date('2025-10-12T17:45:00').getTime(),
    updatedAt: new Date('2025-10-12T17:45:00').getTime(),
  },
  {
    id: 'note-2024-10-11',
    dateIso: '2024-10-11',
    dayMonth: '10-11',
    year: 2024,
    content: 'Choveu fininho o dia todo. Reli um poema de Drummond com um café quente na caneca de cerâmica.',
    createdAt: new Date('2024-10-11T14:15:00').getTime(),
    updatedAt: new Date('2024-10-11T14:15:00').getTime(),
  },
];

/**
 * Abre ou cria a conexão com o IndexedDB
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB indisponível'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('dateIso', 'dateIso', { unique: false });
        store.createIndex('dayMonth', 'dayMonth', { unique: false });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });

        // Semeia notas históricas de demonstração
        SEED_NOTES.forEach((note) => {
          store.add(note);
        });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Falha ao abrir IndexedDB'));
    };
  });
}

/**
 * Métodos de contingência via localStorage
 */
function getFromLocalStorage(): MarginNote[] {
  try {
    const raw = localStorage.getItem(LOCALSTORAGE_KEY);
    if (!raw) {
      // Inicializa com seed se vazio
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(SEED_NOTES));
      return [...SEED_NOTES];
    }
    return JSON.parse(raw) as MarginNote[];
  } catch (err) {
    console.warn('Erro ao ler localStorage:', err);
    return [];
  }
}

function saveToLocalStorage(notes: MarginNote[]): void {
  try {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(notes));
  } catch (err) {
    console.warn('Erro ao gravar no localStorage:', err);
  }
}

/**
 * Salva ou atualiza a nota de margem de um dia específico
 */
export async function saveMarginNote(dateIso: string, content: string): Promise<MarginNote> {
  const [yearStr, monthStr, dayStr] = dateIso.split('-');
  const year = parseInt(yearStr, 10);
  const dayMonth = `${monthStr}-${dayStr}`;
  const id = `note-${dateIso}`;
  const now = Date.now();

  const noteToSave: MarginNote = {
    id,
    dateIso,
    dayMonth,
    year,
    content: content.trim(),
    createdAt: now,
    updatedAt: now,
  };

  // Tenta IndexedDB
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      const getReq = store.get(id);
      getReq.onsuccess = () => {
        const existing = getReq.result as MarginNote | undefined;
        if (existing) {
          noteToSave.createdAt = existing.createdAt;
        }
        store.put(noteToSave);
      };

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });

    // Mantém backup espelhado no localStorage
    const localList = getFromLocalStorage().filter((n) => n.id !== id);
    if (noteToSave.content) {
      localList.push(noteToSave);
    }
    saveToLocalStorage(localList);

    return noteToSave;
  } catch (err) {
    console.warn('Usando contingência localStorage para salvar nota:', err);
    const localList = getFromLocalStorage().filter((n) => n.id !== id);
    if (noteToSave.content) {
      localList.push(noteToSave);
    }
    saveToLocalStorage(localList);
    return noteToSave;
  }
}

/**
 * Obtém a nota de margem de uma data específica
 */
export async function getMarginNoteByDate(dateIso: string): Promise<MarginNote | null> {
  const id = `note-${dateIso}`;

  try {
    const db = await openDB();
    return await new Promise<MarginNote | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);

      req.onsuccess = () => {
        resolve((req.result as MarginNote) || null);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    const localList = getFromLocalStorage();
    const found = localList.find((n) => n.id === id);
    return found || null;
  }
}

/**
 * Busca notas da mesma data (dia e mês) em anos anteriores
 */
export async function getPastYearsMemories(dateIso: string): Promise<PastYearMemory[]> {
  const [yearStr, monthStr, dayStr] = dateIso.split('-');
  const currentYear = parseInt(yearStr, 10);
  const targetDayMonth = `${monthStr}-${dayStr}`;

  let allNotes: MarginNote[] = [];

  try {
    const db = await openDB();
    allNotes = await new Promise<MarginNote[]>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => resolve((req.result as MarginNote[]) || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    allNotes = getFromLocalStorage();
  }

  const memories: PastYearMemory[] = [];

  for (const n of allNotes) {
    if (n.dayMonth === targetDayMonth && n.year < currentYear && n.content.trim().length > 0) {
      const yearsAgo = currentYear - n.year;
      memories.push({
        yearsAgo,
        pastYear: n.year,
        note: n,
      });
    }
  }

  // Ordena do ano mais recente para o mais antigo (ex: há 1 ano primeiro)
  memories.sort((a, b) => a.yearsAgo - b.yearsAgo);
  return memories;
}

/**
 * Retorna todas as notas salvas, da mais recente para a mais antiga
 */
export async function getAllMarginNotes(): Promise<MarginNote[]> {
  try {
    const db = await openDB();
    const notes = await new Promise<MarginNote[]>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => resolve((req.result as MarginNote[]) || []);
      req.onerror = () => reject(req.error);
    });

    // Filtra notas não vazias e ordena por data decrescente
    return notes
      .filter((n) => n.content && n.content.trim().length > 0)
      .sort((a, b) => b.dateIso.localeCompare(a.dateIso));
  } catch (err) {
    return getFromLocalStorage()
      .filter((n) => n.content && n.content.trim().length > 0)
      .sort((a, b) => b.dateIso.localeCompare(a.dateIso));
  }
}

/**
 * Atualiza o conteúdo de uma nota existente
 */
export async function updateMarginNote(id: string, content: string): Promise<void> {
  const cleanContent = content.trim();

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      const getReq = store.get(id);
      getReq.onsuccess = () => {
        const item = getReq.result as MarginNote | undefined;
        if (item) {
          item.content = cleanContent;
          item.updatedAt = Date.now();
          store.put(item);
        }
      };

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Erro ao atualizar via IndexedDB:', err);
  }

  // Atualiza localStorage
  const list = getFromLocalStorage();
  const target = list.find((n) => n.id === id);
  if (target) {
    target.content = cleanContent;
    target.updatedAt = Date.now();
    saveToLocalStorage(list);
  }
}

/**
 * Apaga uma nota pelo ID
 */
export async function deleteMarginNote(id: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Erro ao apagar via IndexedDB:', err);
  }

  const list = getFromLocalStorage().filter((n) => n.id !== id);
  saveToLocalStorage(list);
}

/**
 * Exporta todas as notas como texto JSON pronto para download
 */
export async function exportNotesAsJson(): Promise<string> {
  const notes = await getAllMarginNotes();
  const exportPayload = {
    app: 'Cyber Almanaque',
    versao: '1.0',
    exportadoEm: new Date().toISOString(),
    totalNotas: notes.length,
    notas: notes,
  };
  return JSON.stringify(exportPayload, null, 2);
}

/**
 * Importa notas a partir de uma string JSON
 */
export async function importNotesFromJson(jsonString: string): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const parsed = JSON.parse(jsonString);
    const candidateNotes: MarginNote[] = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.notas)
      ? parsed.notas
      : null;

    if (!candidateNotes) {
      return { success: false, count: 0, error: 'Formato de arquivo JSON inválido ou sem lista de notas.' };
    }

    let importedCount = 0;
    for (const item of candidateNotes) {
      if (item && item.dateIso && typeof item.content === 'string') {
        await saveMarginNote(item.dateIso, item.content);
        importedCount++;
      }
    }

    return { success: true, count: importedCount };
  } catch (err: any) {
    return { success: false, count: 0, error: err?.message || 'Erro ao processar arquivo JSON.' };
  }
}
