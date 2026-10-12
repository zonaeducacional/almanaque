import React from 'react';

export type NavTab = 'hoje' | 'secoes' | 'margens' | 'edicoes' | 'ajustes';

interface BottomNavBarProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  onOpenSearch?: () => void;
  notesCount?: number;
  pacotesCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onChangeTab,
  onOpenSearch,
  notesCount = 0,
  pacotesCount = 0,
}) => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF]/95 dark:bg-[#151F17]/95 backdrop-blur-md border-t border-[#E5DECD] dark:border-[#2C3C2E] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 transition-colors"
      aria-label="Navegação principal do Almanaque"
    >
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {/* Aba: Hoje */}
        <button
          onClick={() => onChangeTab('hoje')}
          type="button"
          className={`touch-target flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2E5E37] ${
            activeTab === 'hoje'
              ? 'text-[#24542E] dark:text-[#88C493] font-bold'
              : 'text-[#6D7A6B] dark:text-[#91A290] hover:text-[#2E3C2F] dark:hover:text-[#D1E0CE]'
          }`}
          aria-current={activeTab === 'hoje' ? 'page' : undefined}
          aria-label="Ir para a página de Hoje"
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              activeTab === 'hoje'
                ? 'bg-[#E7F3E9] dark:bg-[#203624] scale-105'
                : 'bg-transparent'
            }`}
          >
            <svg
              className="w-4.5 h-4.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={activeTab === 'hoje' ? '2.4' : '1.8'}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          </div>
          <span className="text-[11px] font-sans tracking-tight">Hoje</span>
        </button>

        {/* Aba: Seções */}
        <button
          onClick={() => onChangeTab('secoes')}
          type="button"
          className={`touch-target flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2E5E37] ${
            activeTab === 'secoes'
              ? 'text-[#24542E] dark:text-[#88C493] font-bold'
              : 'text-[#6D7A6B] dark:text-[#91A290] hover:text-[#2E3C2F] dark:hover:text-[#D1E0CE]'
          }`}
          aria-current={activeTab === 'secoes' ? 'page' : undefined}
          aria-label="Ir para Seções temáticas"
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              activeTab === 'secoes'
                ? 'bg-[#E7F3E9] dark:bg-[#203624] scale-105'
                : 'bg-transparent'
            }`}
          >
            <svg
              className="w-4.5 h-4.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={activeTab === 'secoes' ? '2.4' : '1.8'}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
          </div>
          <span className="text-[11px] font-sans tracking-tight">Seções</span>
        </button>

        {/* Aba: Margens */}
        <button
          onClick={() => onChangeTab('margens')}
          type="button"
          className={`touch-target flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer relative focus-visible:ring-2 focus-visible:ring-[#2E5E37] ${
            activeTab === 'margens'
              ? 'text-[#24542E] dark:text-[#88C493] font-bold'
              : 'text-[#6D7A6B] dark:text-[#91A290] hover:text-[#2E3C2F] dark:hover:text-[#D1E0CE]'
          }`}
          aria-current={activeTab === 'margens' ? 'page' : undefined}
          aria-label="Ir para Minhas margens"
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all relative ${
              activeTab === 'margens'
                ? 'bg-[#E7F3E9] dark:bg-[#203624] scale-105'
                : 'bg-transparent'
            }`}
          >
            <svg
              className="w-4.5 h-4.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={activeTab === 'margens' ? '2.4' : '1.8'}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            {notesCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-[#B57C3B] text-white text-[10px] font-mono font-bold rounded-full flex items-center justify-center">
                {notesCount > 9 ? '9+' : notesCount}
              </span>
            )}
          </div>
          <span className="text-[11px] font-sans tracking-tight">Margens</span>
        </button>

        {/* Aba: Edições */}
        <button
          onClick={() => onChangeTab('edicoes')}
          type="button"
          className={`touch-target flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer relative focus-visible:ring-2 focus-visible:ring-[#2E5E37] ${
            activeTab === 'edicoes'
              ? 'text-[#24542E] dark:text-[#88C493] font-bold'
              : 'text-[#6D7A6B] dark:text-[#91A290] hover:text-[#2E3C2F] dark:hover:text-[#D1E0CE]'
          }`}
          aria-current={activeTab === 'edicoes' ? 'page' : undefined}
          aria-label="Ir para Edições e Pacotes"
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all relative ${
              activeTab === 'edicoes'
                ? 'bg-[#E7F3E9] dark:bg-[#203624] scale-105'
                : 'bg-transparent'
            }`}
          >
            <svg
              className="w-4.5 h-4.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={activeTab === 'edicoes' ? '2.4' : '1.8'}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" />
              <path d="M12 22V12" />
            </svg>
            {pacotesCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-[#2E5E37] text-white text-[10px] font-mono font-bold rounded-full flex items-center justify-center">
                {pacotesCount}
              </span>
            )}
          </div>
          <span className="text-[11px] font-sans tracking-tight">Edições</span>
        </button>

        {/* Ação: Busca Global */}
        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            type="button"
            className="touch-target flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer text-[#6D7A6B] dark:text-[#91A290] hover:text-[#2E3C2F] dark:hover:text-[#D1E0CE] focus-visible:ring-2 focus-visible:ring-[#2E5E37]"
            aria-label="Abrir busca global"
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center">
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <span className="text-[11px] font-sans tracking-tight">Buscar</span>
          </button>
        )}

        {/* Aba: Ajustes */}
        <button
          onClick={() => onChangeTab('ajustes')}
          type="button"
          className={`touch-target flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2E5E37] ${
            activeTab === 'ajustes'
              ? 'text-[#24542E] dark:text-[#88C493] font-bold'
              : 'text-[#6D7A6B] dark:text-[#91A290] hover:text-[#2E3C2F] dark:hover:text-[#D1E0CE]'
          }`}
          aria-current={activeTab === 'ajustes' ? 'page' : undefined}
          aria-label="Abrir Ajustes do Almanaque"
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              activeTab === 'ajustes'
                ? 'bg-[#E7F3E9] dark:bg-[#203624] scale-105'
                : 'bg-transparent'
            }`}
          >
            <svg
              className="w-4.5 h-4.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={activeTab === 'ajustes' ? '2.4' : '1.8'}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>
          <span className="text-[11px] font-sans tracking-tight">Ajustes</span>
        </button>
      </div>
    </nav>
  );
};
