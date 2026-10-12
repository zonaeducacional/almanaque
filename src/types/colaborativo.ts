/**
 * Tipos para as seções colaborativas locais:
 * "Banco de saberes" e "Laboratório de ideias"
 */

export type TipoSaber = 'ofício' | 'receita' | 'causo' | 'remédio de quintal';

export interface SaberItem {
  id: string;
  titulo: string;
  quemEnsinou: string;
  geracao: string; // Ex: "Avó/Avô", "Mãe/Pai", "Vizinha", "Mestre de ofício", "Ancestral"
  tipo: TipoSaber;
  texto: string;
  createdAt: number;
  updatedAt: number;
}

export type EstadoProblema = 'aberto' | 'em andamento' | 'resolvido';

export interface SolucaoIdeia {
  id: string;
  texto: string;
  sugeridoPor?: string;
  dataCriacao: number;
}

export interface ProblemaComunitario {
  id: string;
  titulo: string;
  descricao: string;
  quemEAfetado: string;
  estado: EstadoProblema;
  solucoes: SolucaoIdeia[];
  createdAt: number;
  updatedAt: number;
}
