/**
 * Tipos para o Sistema de Edições e Pacotes do Cyber Almanaque
 */

import { AlmanaqueDia } from './almanaque';

export type TipoItemPacote = 'dia' | 'verbete' | 'oficina' | 'saber' | 'ideia';

export interface ItemPacote {
  id: string;
  tipo: TipoItemPacote;
  titulo: string;
  autor: string;
  rotulo_ia: string; // Ex: "Gerado com apoio de IA", "Autoria humana comunitária", "Domínio público"
  pacoteId?: string;
  pacoteNome?: string;
  dataIso?: string; // Se for do tipo 'dia'
  dados: any; // Conteúdo estruturado (AlmanaqueDia ou dados da seção)
}

export interface PacoteAlmanaque {
  id: string;
  nome: string;
  ano: number;
  regiao: string;
  versao: string;
  autoria: string;
  rotulo_ia?: string;
  descricao?: string;
  itens: ItemPacote[];
  ativo?: boolean;
  embutido?: boolean; // Se é a edição padrão que veio instalada com o app
}
