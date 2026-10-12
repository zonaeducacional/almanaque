/**
 * Tipos para as Seções Temáticas e o Manual de Sobrevivência Digital
 */

export interface SecaoTematica {
  id: string;
  titulo: string;
  descricao: string;
  icone: string;
  disponivel: boolean;
  etiqueta?: string;
}

export interface VerbeteManual {
  id: string;
  titulo: string;
  icone: string;
  resumo: string;
  comoReconhecer: string[];
  oQueFazer: string[];
  dicaDeOuro: string;
  fonte: string; // Ex: "exemplo, verificar antes de publicar"
}

export interface TreinoMensagem {
  id: number;
  remetente: string;
  canal: 'WhatsApp' | 'SMS' | 'E-mail' | 'Ligação' | 'Rede Social';
  mensagem: string;
  tipoCorreto: 'golpe' | 'confiavel';
  motivo: string;
  sinaisDeAlerta: string[];
}

export interface ManualSobrevivenciaData {
  secoes: SecaoTematica[];
  verbetes: VerbeteManual[];
  treino: TreinoMensagem[];
}
