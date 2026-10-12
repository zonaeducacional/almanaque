/**
 * Gerenciamento e persistência das configurações locais do usuário
 */

import { AppSettings, CIDADES_BRASILEIRAS, CidadeConfig } from '../types/settings';

const SETTINGS_KEY = 'cyber_almanaque_ajustes_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  tema: 'claro',
  tamanhoFonte: 'normal',
  modoLeitura: false,
  cidadeId: 'salvador',
  desativarDissolucao: false,
};

export function loadSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    applySettingsToDOM(settings);
  } catch (err) {
    console.warn('Erro ao salvar configurações:', err);
  }
}

export function getCidadeConfig(cidadeId: string): CidadeConfig {
  return (
    CIDADES_BRASILEIRAS.find((c) => c.id === cidadeId) || CIDADES_BRASILEIRAS[0]
  );
}

/**
 * Aplica as classes e estilos globais no elemento <html> e <body>
 */
export function applySettingsToDOM(settings: AppSettings): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  // 1. Tema claro/escuro/sistema
  let isDark = false;
  if (settings.tema === 'escuro') {
    isDark = true;
  } else if (settings.tema === 'sistema') {
    isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // 2. Tamanho da fonte
  root.classList.remove('font-size-normal', 'font-size-confortavel', 'font-size-grande');
  root.classList.add(`font-size-${settings.tamanhoFonte}`);

  // 3. Modo leitura
  if (settings.modoLeitura) {
    root.classList.add('modo-leitura');
  } else {
    root.classList.remove('modo-leitura');
  }
}
