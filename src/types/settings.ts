/**
 * Configurações e tipos do usuário para o Cyber Almanaque
 */

export type ThemeMode = 'claro' | 'escuro' | 'sistema';
export type FontSizeLevel = 'normal' | 'confortavel' | 'grande';

export interface CidadeConfig {
  id: string;
  nome: string;
  estado: string;
  lat: number;
  lon: number;
  tzOffset: number;
  bioma: string;
}

export interface AppSettings {
  tema: ThemeMode;
  tamanhoFonte: FontSizeLevel;
  modoLeitura: boolean;
  cidadeId: string;
  desativarDissolucao: boolean;
}

export const CIDADES_BRASILEIRAS: CidadeConfig[] = [
  {
    id: 'salvador',
    nome: 'Salvador',
    estado: 'BA',
    lat: -12.9777,
    lon: -38.5016,
    tzOffset: -3,
    bioma: 'Litoral Atlântico',
  },
  {
    id: 'sao_paulo',
    nome: 'São Paulo',
    estado: 'SP',
    lat: -23.5505,
    lon: -46.6333,
    tzOffset: -3,
    bioma: 'Planalto Sudeste',
  },
  {
    id: 'rio_de_janeiro',
    nome: 'Rio de Janeiro',
    estado: 'RJ',
    lat: -22.9068,
    lon: -43.1729,
    tzOffset: -3,
    bioma: 'Costa Fluminense',
  },
  {
    id: 'brasilia',
    nome: 'Brasília',
    estado: 'DF',
    lat: -15.7975,
    lon: -47.8919,
    tzOffset: -3,
    bioma: 'Planalto Central (Cerrado)',
  },
  {
    id: 'fortaleza',
    nome: 'Fortaleza',
    estado: 'CE',
    lat: -3.7319,
    lon: -38.5267,
    tzOffset: -3,
    bioma: 'Litoral Equatorial',
  },
  {
    id: 'manaus',
    nome: 'Manaus',
    estado: 'AM',
    lat: -3.1190,
    lon: -60.0217,
    tzOffset: -4,
    bioma: 'Amazônia Central',
  },
  {
    id: 'belem',
    nome: 'Belém',
    estado: 'PA',
    lat: -1.4558,
    lon: -48.4902,
    tzOffset: -3,
    bioma: 'Estuário Amazônico',
  },
  {
    id: 'porto_alegre',
    nome: 'Porto Alegre',
    estado: 'RS',
    lat: -30.0346,
    lon: -51.2177,
    tzOffset: -3,
    bioma: 'Pampa e Lagoa',
  },
  {
    id: 'recife',
    nome: 'Recife',
    estado: 'PE',
    lat: -8.0476,
    lon: -34.8770,
    tzOffset: -3,
    bioma: 'Zona da Mata Costeira',
  },
  {
    id: 'cuiaba',
    nome: 'Cuiabá',
    estado: 'MT',
    lat: -15.6014,
    lon: -56.0979,
    tzOffset: -4,
    bioma: 'Pantanal e Cerrado',
  },
];
