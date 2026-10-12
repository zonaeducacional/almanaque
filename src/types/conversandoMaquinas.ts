/**
 * Tipos para a seção "Conversando com máquinas"
 */

export interface VerbeteIA {
  id: string;
  titulo: string;
  icone: string;
  resumo: string;
  oProblema: string;
  oQueEstaMelhorando: string;
  oQueFazer: string[];
  fonte: string; // Ex: "exemplo, verificar antes de publicar"
  gestoPratico: {
    titulo: string;
    acao: string;
    tempo: string;
  };
}

export interface OpcaoErroIA {
  id: string;
  trechoOuItem: string;
  ehOErroCorreto: boolean;
  explicacao: string;
}

export interface ExercicioErroIA {
  id: string;
  titulo: string;
  contexto: string;
  perguntaDoUsuario: string;
  respostaDaIA: string;
  opcoesDeErro: OpcaoErroIA[];
  licaoFinal: string;
}

export interface ConversandoMaquinasData {
  secaoInfo: {
    titulo: string;
    subtitulo: string;
    lema: string;
  };
  verbetes: VerbeteIA[];
  exercicio: ExercicioErroIA;
}
