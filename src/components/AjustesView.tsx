import React, { useState, useEffect } from 'react';
import {
  AppSettings,
  CIDADES_BRASILEIRAS,
  FontSizeLevel,
  ThemeMode,
} from '../types/settings';
import { loadSettings, saveSettings } from '../utils/settingsStorage';

interface AjustesViewProps {
  onBack: () => void;
  onSettingsUpdated: (newSettings: AppSettings) => void;
  onNavigateToEdicoes?: () => void;
}

export const AjustesView: React.FC<AjustesViewProps> = ({
  onBack,
  onSettingsUpdated,
  onNavigateToEdicoes,
}) => {
  const [settings, setSettings] = useState<AppSettings>(loadSettings());

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const updateSetting = <K extends keyof AppSettings>(key: K, val: AppSettings[K]) => {
    const updated = { ...settings, [key]: val };
    setSettings(updated);
    saveSettings(updated);
    onSettingsUpdated(updated);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-4 pb-24">
      {/* Botão de retorno e cabeçalho */}
      <div className="mb-6 flex items-center justify-between gap-3 border-b border-[#E8DFD0] dark:border-[#2C3C2E] pb-4">
        <button
          onClick={onBack}
          type="button"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#2F6139] dark:text-[#83B98C] hover:text-[#1E3F20] bg-[#FAF6ED] dark:bg-[#1C281F] px-3.5 py-2 rounded-xl border border-[#E5DECD] dark:border-[#2E3F30] transition-all cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Voltar</span>
        </button>

        <span className="text-xs font-mono text-[#7D8B7A] dark:text-[#8A9B87] bg-[#F2ECE0] dark:bg-[#1E2B21] px-3 py-1 rounded-full">
          Preferências Locais
        </span>
      </div>

      {/* Título da Seção */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF3E8] dark:bg-[#1B2B1E] border border-[#CCDDC6] dark:border-[#2B3E2F] text-[#2C6237] dark:text-[#7EB588] text-xs font-mono font-medium mb-2.5">
          <span>⚙️ Conforto e Autonomia</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E3022] dark:text-[#EAE5D9] tracking-tight">
          Ajustes do Almanaque
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-[#61705D] dark:text-[#9DAE9A] font-sans leading-relaxed">
          Configure o tamanho do texto, a luminosidade, o cálculo do sol na sua terra e as animações. Todas as escolhas ficam gravadas no seu aparelho.
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. TEMA CLARO / ESCURO / AUTOMÁTICO */}
        <section className="bg-[#FFFFFF] dark:bg-[#18231A] border border-[#E5DECD] dark:border-[#2C3C2E] rounded-2xl p-5 sm:p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-lg text-[#202921] dark:text-[#EAE5D9]">
              Tema e Luminosidade
            </h2>
            <span className="text-xs font-mono text-[#7A8A78]">Sol e Sombra</span>
          </div>
          <p className="text-xs sm:text-sm text-[#5C6B59] dark:text-[#9DAE9A]">
            Escolha entre o pergaminho solarpunk quente, a noite escura da mata ou o ajuste automático do sistema.
          </p>

          <div className="grid grid-cols-3 gap-2 pt-1">
            {[
              { id: 'claro', label: 'Claro (Papel)', icone: '☀️' },
              { id: 'escuro', label: 'Escuro (Mata)', icone: '🌙' },
              { id: 'sistema', label: 'Automático', icone: '🌓' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => updateSetting('tema', t.id as ThemeMode)}
                type="button"
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  settings.tema === t.id
                    ? 'bg-[#2E5E37] text-white border-[#2E5E37] shadow-sm font-semibold'
                    : 'bg-[#FAF7F0] dark:bg-[#1E2A20] text-[#344033] dark:text-[#CCDCCE] border-[#E2D8C6] dark:border-[#2B3B2D] hover:bg-[#F2ECE0]'
                }`}
              >
                <span className="text-xl">{t.icone}</span>
                <span className="text-xs font-sans">{t.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 2. TAMANHO DA FONTE (3 NÍVEIS) */}
        <section className="bg-[#FFFFFF] dark:bg-[#18231A] border border-[#E5DECD] dark:border-[#2C3C2E] rounded-2xl p-5 sm:p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-lg text-[#202921] dark:text-[#EAE5D9]">
              Tamanho da Letra
            </h2>
            <span className="text-xs font-mono text-[#7A8A78]">Acessibilidade</span>
          </div>
          <p className="text-xs sm:text-sm text-[#5C6B59] dark:text-[#9DAE9A]">
            Ajuste para ler com conforto sem precisar forçar a visão.
          </p>

          <div className="grid grid-cols-3 gap-2 pt-1">
            {[
              { id: 'normal', label: 'Padrão', preview: 'Aa' },
              { id: 'confortavel', label: 'Confortável', preview: 'Aa+' },
              { id: 'grande', label: 'Grande', preview: 'Aa++' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => updateSetting('tamanhoFonte', f.id as FontSizeLevel)}
                type="button"
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  settings.tamanhoFonte === f.id
                    ? 'bg-[#2E5E37] text-white border-[#2E5E37] shadow-sm font-semibold'
                    : 'bg-[#FAF7F0] dark:bg-[#1E2A20] text-[#344033] dark:text-[#CCDCCE] border-[#E2D8C6] dark:border-[#2B3B2D] hover:bg-[#F2ECE0]'
                }`}
              >
                <span className="font-serif font-bold text-lg">{f.preview}</span>
                <span className="text-xs font-sans">{f.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 3. MODO LEITURA (SEM ANIMAÇÕES E MAIS ESPAÇAMENTO) */}
        <section className="bg-[#FFFFFF] dark:bg-[#18231A] border border-[#E5DECD] dark:border-[#2C3C2E] rounded-2xl p-5 sm:p-6 shadow-sm flex items-center justify-between gap-4">
          <div>
            <h2 className="font-serif font-bold text-lg text-[#202921] dark:text-[#EAE5D9]">
              Modo Leitura Serena
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#5C6B59] dark:text-[#9DAE9A] leading-relaxed">
              Desativa todas as animações e transições e amplia a entrelinha da prosa para máxima concentração e calma.
            </p>
          </div>

          <button
            onClick={() => updateSetting('modoLeitura', !settings.modoLeitura)}
            type="button"
            role="switch"
            aria-checked={settings.modoLeitura}
            className={`w-14 h-8 rounded-full transition-colors cursor-pointer relative shrink-0 p-1 ${
              settings.modoLeitura ? 'bg-[#2E5E37]' : 'bg-[#D6CDC0] dark:bg-[#344436]'
            }`}
          >
            <span
              className={`block w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                settings.modoLeitura ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </section>

        {/* 4. ESCOLHA DA CIDADE PARA SOL E LUA (10 CIDADES BRASILEIRAS) */}
        <section className="bg-[#FFFFFF] dark:bg-[#18231A] border border-[#E5DECD] dark:border-[#2C3C2E] rounded-2xl p-5 sm:p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-lg text-[#202921] dark:text-[#EAE5D9]">
              Cidade para Sol e Lua
            </h2>
            <span className="text-xs font-mono text-[#7A8A78]">Efêmerides</span>
          </div>
          <p className="text-xs sm:text-sm text-[#5C6B59] dark:text-[#9DAE9A]">
            Os horários de nascer e pôr do sol e a duração da luz diurna são recalculados com precisão matemática para a sua coordenada.
          </p>

          <div className="pt-1">
            <label className="text-xs font-mono uppercase text-[#738470] dark:text-[#9AAEA9] block mb-1.5">
              Selecione sua cidade ou capital de referência:
            </label>
            <select
              value={settings.cidadeId}
              onChange={(e) => updateSetting('cidadeId', e.target.value)}
              className="w-full p-3 rounded-xl border border-[#E2D8C6] dark:border-[#2C3D2E] bg-[#FCFAF5] dark:bg-[#1D2B20] text-sm text-[#202921] dark:text-[#EAE5D9] font-sans focus:outline-none focus:border-[#2E5E37] cursor-pointer"
            >
              {CIDADES_BRASILEIRAS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}, {c.estado} • {c.lat > 0 ? `${c.lat}°N` : `${Math.abs(c.lat)}°S`},{' '}
                  {Math.abs(c.lon)}°O • Fuso UTC{c.tzOffset} ({c.bioma})
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* 5. OPÇÃO DE DESLIGAR A ANIMAÇÃO DE DISSOLUÇÃO */}
        <section className="bg-[#FFFFFF] dark:bg-[#18231A] border border-[#E5DECD] dark:border-[#2C3C2E] rounded-2xl p-5 sm:p-6 shadow-sm flex items-center justify-between gap-4">
          <div>
            <h2 className="font-serif font-bold text-lg text-[#202921] dark:text-[#EAE5D9]">
              Desativar Tela de Dissolução
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#5C6B59] dark:text-[#9DAE9A] leading-relaxed">
              Ao abrir o Cyber Almanaque, entrar direto na página do dia sem a simulação de partículas de poeira da tela inicial.
            </p>
          </div>

          <button
            onClick={() =>
              updateSetting('desativarDissolucao', !settings.desativarDissolucao)
            }
            type="button"
            role="switch"
            aria-checked={settings.desativarDissolucao}
            className={`w-14 h-8 rounded-full transition-colors cursor-pointer relative shrink-0 p-1 ${
              settings.desativarDissolucao
                ? 'bg-[#2E5E37]'
                : 'bg-[#D6CDC0] dark:bg-[#344436]'
            }`}
          >
            <span
              className={`block w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                settings.desativarDissolucao ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </section>
        {/* 6. GERENCIAMENTO DE EDIÇÕES E PACOTES */}
        {onNavigateToEdicoes && (
          <section className="bg-[#FFFFFF] dark:bg-[#18231A] border border-[#E5DECD] dark:border-[#2C3C2E] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">📦</span>
                <h2 className="font-serif font-bold text-lg text-[#202921] dark:text-[#EAE5D9]">
                  Edições e Pacotes Editoriais
                </h2>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-[#5C6B59] dark:text-[#9DAE9A] leading-relaxed">
                Instale novas edições, ative/desative conteúdos e exporte seus saberes como o almanaque comunitário da sua terra.
              </p>
            </div>

            <button
              onClick={onNavigateToEdicoes}
              type="button"
              className="touch-target px-4 py-2.5 rounded-xl text-xs font-mono font-bold bg-[#2E5E37] text-white hover:bg-[#234C2C] shadow-sm transition-all cursor-pointer shrink-0 self-end sm:self-center"
            >
              Gerenciar Pacotes →
            </button>
          </section>
        )}

        {/* 7. APP PROGRESSIVO E SUPORTE OFFLINE */}
        <section className="bg-[#FFFFFF] dark:bg-[#18231A] border border-[#E5DECD] dark:border-[#2C3C2E] rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xl">📲</span>
            <h2 className="font-serif font-bold text-lg text-[#202921] dark:text-[#EAE5D9]">
              App Offline & Instalação (PWA)
            </h2>
          </div>
          <p className="mt-2 text-xs sm:text-sm text-[#5C6B59] dark:text-[#9DAE9A] leading-relaxed">
            O Cyber Almanaque foi construído para funcionar <strong className="text-[#202921] dark:text-[#EAE5D9]">100% offline</strong> após o primeiro carregamento, respeitando seus dados e sua paz de espírito.
          </p>

          <div className="mt-4 p-4 rounded-xl bg-[#F7F4EC] dark:bg-[#1F2B21] border border-[#E8DFCF] dark:border-[#2E4231] space-y-2 text-xs text-[#4A5747] dark:text-[#B1C3AF]">
            <div className="flex items-start gap-2">
              <span className="text-[#2E5E37] font-bold">✓</span>
              <span><strong>No Android/Chrome:</strong> Toque no menu (três pontos) e escolha <em>"Instalar aplicativo"</em> ou <em>"Adicionar à tela inicial"</em>.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#2E5E37] font-bold">✓</span>
              <span><strong>No iPhone/Safari:</strong> Toque no botão de compartilhamento (quadrado com seta para cima) e escolha <em>"Adicionar à Tela de Início"</em>.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#2E5E37] font-bold">✓</span>
              <span><strong>No computador:</strong> Clique no ícone de instalar na barra de endereços do navegador (Chrome/Edge/Brave).</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
