/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import rawData from './data/almanaqueData.json';
import { AlmanaqueDia } from './types/almanaque';
import { OpeningScreen } from './components/OpeningScreen';
import { AstroHeader } from './components/AstroHeader';
import { CardProgresso } from './components/CardProgresso';
import { CardGesto } from './components/CardGesto';
import { CardCiencia } from './components/CardCiencia';
import { CardLeitura } from './components/CardLeitura';
import { CardPalavra } from './components/CardPalavra';
import { CardNotaDeMargem } from './components/CardNotaDeMargem';
import { CardMemoriaAnterior } from './components/CardMemoriaAnterior';
import { MinhasMargensView } from './components/MinhasMargensView';
import { SecoesView } from './components/SecoesView';
import { AjustesView } from './components/AjustesView';
import { EdicoesView } from './components/EdicoesView';
import { ItemProvenanceBadge } from './components/ItemProvenanceBadge';
import { BuscaGlobalModal } from './components/BuscaGlobalModal';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { BottomNavBar, NavTab } from './components/BottomNavBar';
import { DayNavigation } from './components/DayNavigation';
import { FooterVaViver } from './components/FooterVaViver';
import { getAllMarginNotes } from './utils/notesStorage';
import {
  applySettingsToDOM,
  getCidadeConfig,
  loadSettings,
} from './utils/settingsStorage';
import { AppSettings } from './types/settings';
import { buildSearchIndex, SearchResultItem } from './utils/searchEngine';
import {
  DiaComMetadados,
  getPacotesInstalados,
  getTodosDiasAtivos,
} from './utils/pacotesManager';

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [hasEntered, setHasEntered] = useState<boolean>(() => {
    // Se a animação de dissolução estiver desativada nas configurações, pode entrar diretamente
    const loaded = loadSettings();
    return loaded.desativarDissolucao;
  });

  // Dias editoriais provenientes do sistema de pacotes (Edição padrão + importados)
  const [diasAtivos, setDiasAtivos] = useState<DiaComMetadados[]>(() => getTodosDiasAtivos());
  const [pacotesCount, setPacotesCount] = useState<number>(() => getPacotesInstalados().length);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<NavTab>('hoje');
  const [targetSectionId, setTargetSectionId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [notesCount, setNotesCount] = useState<number>(0);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Aplica tema, tamanho da fonte e modo de leitura no DOM
  useEffect(() => {
    applySettingsToDOM(settings);
  }, [settings]);

  const refreshNotesCount = useCallback(async () => {
    const all = await getAllMarginNotes();
    setNotesCount(all.length);
  }, []);

  useEffect(() => {
    refreshNotesCount();
  }, [refreshNotesCount, refreshKey]);

  // Recalcula dias e reindexa busca quando os pacotes mudam (importação, ativação, remoção)
  const handlePacotesChanged = useCallback(() => {
    const novosDias = getTodosDiasAtivos();
    setDiasAtivos(novosDias);
    setPacotesCount(getPacotesInstalados().length);
    setCurrentIndex((prev) => Math.min(prev, Math.max(0, novosDias.length - 1)));
    buildSearchIndex().catch(() => {});
  }, []);

  // Atalhos de teclado (Setas para navegar dias, barra "/" ou Ctrl+K para abrir busca)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignora se o usuário estiver digitando em um input ou textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if ((e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key === 'k')) && hasEntered) {
        e.preventDefault();
        setIsSearchOpen(true);
        return;
      }

      if (hasEntered && activeTab === 'hoje') {
        if (e.key === 'ArrowLeft') {
          setCurrentIndex((prev) => Math.max(0, prev - 1));
        } else if (e.key === 'ArrowRight') {
          setCurrentIndex((prev) => Math.min(diasAtivos.length - 1, prev + 1));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasEntered, activeTab, diasAtivos.length]);

  // Se ainda não entrou, mostra a tela de abertura com dissolução
  if (!hasEntered) {
    return (
      <OpeningScreen
        onEnter={() => setHasEntered(true)}
        desativarDissolucao={settings.desativarDissolucao}
      />
    );
  }

  const currentDiaMeta = diasAtivos[currentIndex] || diasAtivos[0];
  const currentDia = currentDiaMeta ? currentDiaMeta.dia : (rawData as AlmanaqueDia[])[0];
  const cidadeConfig = getCidadeConfig(settings.cidadeId);

  const handleTabChange = (newTab: NavTab) => {
    setActiveTab(newTab);
    if (newTab !== 'secoes') {
      setTargetSectionId(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchNavigate = (linkTarget: SearchResultItem['linkTarget']) => {
    if (linkTarget.tab === 'hoje') {
      if (typeof linkTarget.dayIndex === 'number') {
        setCurrentIndex(Math.min(linkTarget.dayIndex, Math.max(0, diasAtivos.length - 1)));
      }
      handleTabChange('hoje');
    } else if (linkTarget.tab === 'secoes') {
      setTargetSectionId(linkTarget.sectionId || null);
      handleTabChange('secoes');
    } else if (linkTarget.tab === 'margens') {
      handleTabChange('margens');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] dark:bg-[#121813] text-[#242A24] dark:text-[#EAE5D9] flex flex-col items-center selection:bg-[#E4D1B5] dark:selection:bg-[#5C4528] selection:text-[#1E3F20] dark:selection:text-[#F3EDE2] pb-24 transition-colors">
      {/* Barra de Topo do Almanaque */}
      <nav
        className="w-full bg-[#FFFFFF]/95 dark:bg-[#151F17]/95 backdrop-blur-md border-b border-[#E8DFD0] dark:border-[#2C3C2E] sticky top-0 z-30 transition-colors"
        aria-label="Barra superior do Cyber Almanaque"
      >
        <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          <button
            onClick={() => handleTabChange('hoje')}
            type="button"
            className="flex items-center gap-2.5 text-left cursor-pointer group touch-target focus-visible:ring-2 focus-visible:ring-[#2E5E37]"
            aria-label="Voltar para a página de Hoje"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#3B7247] dark:bg-[#68A774] group-hover:scale-125 transition-transform" />
            <div>
              <span className="font-serif font-bold text-base sm:text-lg text-[#1E3022] dark:text-[#EAE5D9] tracking-tight block leading-tight">
                Cyber Almanaque
              </span>
              <span className="text-[10px] font-mono text-[#768472] dark:text-[#8E9F8C] hidden sm:block">
                Tudo que é sólido desmancha no ar
              </span>
            </div>
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Botão de Busca Global */}
            <button
              onClick={() => setIsSearchOpen(true)}
              type="button"
              className="touch-target inline-flex items-center justify-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-xl border border-[#E5DECD] dark:border-[#2C3C2E] bg-[#FAF5EB] dark:bg-[#1C281F] text-[#3E523C] dark:text-[#C5D5C3] hover:text-[#1E3022] dark:hover:text-white transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2E5E37]"
              title="Buscar no almanaque (Atalho: / ou Ctrl+K)"
              aria-label="Abrir busca global"
            >
              <span>🔍</span>
              <span className="hidden sm:inline">Buscar</span>
            </button>

            {/* Atalho para Edições */}
            <button
              onClick={() => handleTabChange('edicoes')}
              type="button"
              className={`touch-target inline-flex items-center justify-center gap-1.5 text-xs font-mono px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2E5E37] ${
                activeTab === 'edicoes'
                  ? 'bg-[#2E5E37] text-white border-[#2E5E37]'
                  : 'text-[#3E523C] dark:text-[#C5D5C3] bg-[#FAF5EB] dark:bg-[#1C281F] border-[#E5DECD] dark:border-[#2C3C2E] hover:bg-[#F2ECE0]'
              }`}
              title="Gerenciar Edições e Pacotes"
              aria-label="Abrir Edições e Pacotes"
            >
              <span>📦</span>
              <span className="hidden sm:inline">Edições</span>
            </button>

            {/* Atalho para Ajustes */}
            <button
              onClick={() => handleTabChange('ajustes')}
              type="button"
              className={`touch-target inline-flex items-center justify-center gap-1 text-xs font-mono px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2E5E37] ${
                activeTab === 'ajustes'
                  ? 'bg-[#2E5E37] text-white border-[#2E5E37]'
                  : 'text-[#3E523C] dark:text-[#C5D5C3] bg-[#FAF5EB] dark:bg-[#1C281F] border-[#E5DECD] dark:border-[#2C3C2E] hover:bg-[#F2ECE0]'
              }`}
              title="Abrir Ajustes (Tema, fonte, cidade)"
              aria-label="Abrir Ajustes"
            >
              <span>⚙️</span>
              <span className="hidden sm:inline">Ajustes</span>
            </button>

            {/* Botão de retorno à tela de abertura */}
            <button
              onClick={() => {
                setHasEntered(false);
              }}
              type="button"
              className="touch-target text-xs font-mono text-[#6A7866] dark:text-[#8E9F8C] hover:text-[#1E3022] dark:hover:text-white hover:bg-[#F2ECE0] dark:hover:bg-[#202D22] px-2.5 py-1.5 rounded-xl border border-[#E5DECD] dark:border-[#2C3C2E] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2E5E37]"
              title="Voltar para a tela inicial"
              aria-label="Voltar para a tela inicial de dissolução"
            >
              ↺ Início
            </button>
          </div>
        </div>
      </nav>

      {/* Banner discreto de instalação PWA (quando suportado pelo navegador) */}
      <PwaInstallBanner />

      {/* Conteúdo Conforme a Aba Ativa */}
      {activeTab === 'edicoes' && (
        <EdicoesView
          onBack={() => handleTabChange('hoje')}
          onPacotesChanged={handlePacotesChanged}
        />
      )}

      {activeTab === 'ajustes' && (
        <AjustesView
          onBack={() => handleTabChange('hoje')}
          onSettingsUpdated={(newSettings) => setSettings(newSettings)}
          onNavigateToEdicoes={() => handleTabChange('edicoes')}
        />
      )}

      {activeTab === 'secoes' && (
        <SecoesView
          initialSectionId={targetSectionId}
          onNavigateToEdicoes={() => handleTabChange('edicoes')}
        />
      )}

      {activeTab === 'margens' && (
        <MinhasMargensView
          onClose={() => handleTabChange('hoje')}
          onNavigateToDate={(dateIso) => {
            const idx = diasAtivos.findIndex((d) => d.dia.dataIso === dateIso);
            if (idx !== -1) {
              setCurrentIndex(idx);
            }
            handleTabChange('hoje');
          }}
        />
      )}

      {activeTab === 'hoje' && (
        <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-5 flex flex-col gap-5 sm:gap-6">
          {/* Navegação entre dias */}
          <DayNavigation
            dias={diasAtivos.map((d) => d.dia)}
            currentIndex={currentIndex}
            onSelectIndex={(newIdx) => {
              setCurrentIndex(newIdx);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          {/* Cabeçalho Astronômico (Com cálculo para a cidade escolhida nos Ajustes) */}
          <AstroHeader dia={currentDia} cidadeConfig={cidadeConfig} />

          {/* Metadados de Procedência do Conteúdo: Pacote, Autor e Transparência IA */}
          {currentDiaMeta && (
            <ItemProvenanceBadge
              pacoteNome={currentDiaMeta.pacoteNome}
              autor={currentDiaMeta.meta.autor}
              rotuloIa={currentDiaMeta.meta.rotulo_ia}
            />
          )}

          {/* 1. Placar de Progresso */}
          <CardProgresso progresso={currentDia.placarProgresso} />

          {/* 2. Gesto do Dia */}
          <CardGesto gesto={currentDia.gestoDoDia} />

          {/* 3. Hoje na Ciência e na Técnica */}
          <CardCiencia ciencia={currentDia.hojeNaCiencia} />

          {/* 4. Leitura do Dia (com rótulo do pacote e IA) */}
          <CardLeitura
            leitura={currentDia.leituraDoDia}
            pacoteNome={currentDiaMeta?.pacoteNome}
            rotuloIa={currentDiaMeta?.meta.rotulo_ia}
          />

          {/* 5. Palavra ou Provérbio do Dia */}
          <CardPalavra item={currentDia.palavraOuProverbio} />

          {/* 6. Memória de Anos Anteriores (se houver nota na mesma data de anos passados) */}
          <CardMemoriaAnterior
            dateIso={currentDia.dataIso}
            refreshKey={refreshKey}
          />

          {/* 7. Campo 'Nota de Margem' (auto-salvo no aparelho com estética de margem de livro antigo) */}
          <CardNotaDeMargem
            dateIso={currentDia.dataIso}
            dataExtenso={currentDia.dataExtenso}
            onNoteSaved={() => {
              setRefreshKey((k) => k + 1);
            }}
          />

          {/* 8. Rodapé: Você leu tudo por hoje. Vá viver. */}
          <FooterVaViver onReplayIntro={() => setHasEntered(false)} />
        </main>
      )}

      {/* Menu de Navegação Inferior (Hoje, Seções, Margens, Edições, Ajustes) */}
      <BottomNavBar
        activeTab={activeTab}
        onChangeTab={handleTabChange}
        onOpenSearch={() => setIsSearchOpen(true)}
        notesCount={notesCount}
        pacotesCount={pacotesCount}
      />

      {/* Modal de Busca Global Offline */}
      <BuscaGlobalModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleSearchNavigate}
      />
    </div>
  );
}
