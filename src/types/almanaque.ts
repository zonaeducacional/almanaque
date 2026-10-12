/**
 * Tipos e interfaces do Cyber Almanaque
 */

export interface PlacarProgresso {
  titulo: string;
  numeroDestaque: string;
  descricao: string;
  fonte: string; // Ex: "exemplo, verificar antes de publicar"
}

export interface GestoDoDia {
  titulo: string;
  acao: string;
  tempoEstimado: string;
  proposito: string;
}

export interface HojeNaCiencia {
  ano: number;
  titulo: string;
  descricao: string;
  relevancia: string;
  fonte: string; // Ex: "exemplo, verificar antes de publicar"
}

export interface LeituraDoDia {
  titulo: string;
  autor: string;
  epocaOuLivro: string;
  genero: 'Poema' | 'Crônica' | 'Pensamento';
  texto: string;
  notaEditorial?: string;
}

export interface PalavraOuProverbio {
  tipo: 'Palavra' | 'Provérbio';
  termo: string;
  origem: string;
  significado: string;
  reflexao: string;
}

export interface AlmanaqueDia {
  id: string; // Ex: "2026-10-11"
  dataIso: string; // "2026-10-11"
  dataExtenso: string; // "Domingo, 11 de outubro de 2026"
  diaDoAno: number; // 284
  totalDiasAno: number; // 365
  estacao: string; // "Primavera (Hemisfério Sul)"
  placarProgresso: PlacarProgresso;
  gestoDoDia: GestoDoDia;
  hojeNaCiencia: HojeNaCiencia;
  leituraDoDia: LeituraDoDia;
  palavraOuProverbio: PalavraOuProverbio;
}

export interface MoonPhaseInfo {
  faseNome: string;
  iluminacaoPercent: number; // 0 to 100
  idadeDias: number; // 0 to 29.53
  iconeTipo: 'nova' | 'crescente' | 'quarto_crescente' | 'gibosa_crescente' | 'cheia' | 'gibosa_minguante' | 'quarto_minguante' | 'minguante';
  descricaoPoetica: string;
}

export interface SolarInfo {
  nascerDoSol: string; // "05:18"
  porDoSol: string; // "17:35"
  duracaoDia: string; // "12h 17min"
  cidade: string; // "Salvador, BA"
  lat: number;
  lon: number;
  meioDiaSolar: string;
}
