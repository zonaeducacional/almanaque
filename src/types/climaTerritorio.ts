/**
 * Tipos para a seção "Clima e território"
 */

export type RegiaoId = 'litoral' | 'semiarido' | 'cerrado';
export type EstacaoId = 'seca' | 'chuva' | 'calor_extremo';

export interface EstacaoGuia {
  estacaoId: EstacaoId;
  tituloEstacao: string;
  icone: string;
  oQueEsperar: string;
  oQuePlantarOuCuidar: string[];
  comoEconomizarAgua: string[];
  oQueFazerEmEmergencia: string[]; // em enchente ou seca extrema
  oQueEstaMelhorando: string;
  fonte: string; // Ex: "exemplo, verificar antes de publicar"
  gestoPratico: {
    titulo: string;
    acao: string;
    tempo: string;
  };
}

export interface RegiaoInfo {
  id: RegiaoId;
  nome: string;
  bioma: string;
  icone: string;
  descricaoCurta: string;
  estacoes: EstacaoGuia[];
}

export interface ClimaTerritorioData {
  secaoInfo: {
    titulo: string;
    subtitulo: string;
    lema: string;
  };
  regioes: RegiaoInfo[];
}
