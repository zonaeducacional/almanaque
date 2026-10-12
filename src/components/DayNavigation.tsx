import React from 'react';
import { AlmanaqueDia } from '../types/almanaque';

interface DayNavigationProps {
  dias: AlmanaqueDia[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
}

export const DayNavigation: React.FC<DayNavigationProps> = ({
  dias,
  currentIndex,
  onSelectIndex,
}) => {
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < dias.length - 1;

  const currentDia = dias[currentIndex];

  return (
    <nav className="w-full bg-[#FFFFFF] border border-[#E5DECE] rounded-2xl p-3 sm:p-4 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
      {/* Botão Anterior */}
      <button
        onClick={() => hasPrev && onSelectIndex(currentIndex - 1)}
        disabled={!hasPrev}
        type="button"
        className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
          hasPrev
            ? 'bg-[#FAF6ED] hover:bg-[#F2EBDC] text-[#2D3F2E] active:scale-95 cursor-pointer border border-[#E4DC CB]'
            : 'bg-[#F5F2EA] text-[#B0B8AE] cursor-not-allowed opacity-60 border border-transparent'
        }`}
        aria-label="Ir para o dia anterior"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span>Dia anterior</span>
      </button>

      {/* Indicador de Dias / Seletor */}
      <div className="flex flex-col items-center gap-1.5 py-1">
        <span className="text-xs font-mono text-[#6A7868] uppercase tracking-wider font-semibold">
          Dia {currentIndex + 1} de {dias.length}
        </span>
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Dias do Almanaque">
          {dias.map((d, idx) => {
            const isSelected = idx === currentIndex;
            const dayNum = d.dataIso.split('-')[2];
            return (
              <button
                key={d.id}
                onClick={() => onSelectIndex(idx)}
                type="button"
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-mono font-medium transition-all flex items-center justify-center cursor-pointer ${
                  isSelected
                    ? 'bg-[#2E5E37] text-[#FFFFFF] shadow-sm font-bold scale-105'
                    : 'bg-[#F2ECE0] text-[#556453] hover:bg-[#E7DDCB]'
                }`}
                title={`Ir para ${d.dataExtenso}`}
              >
                {dayNum}
              </button>
            );
          })}
        </div>
      </div>

      {/* Botão Seguinte */}
      <button
        onClick={() => hasNext && onSelectIndex(currentIndex + 1)}
        disabled={!hasNext}
        type="button"
        className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
          hasNext
            ? 'bg-[#FAF6ED] hover:bg-[#F2EBDC] text-[#2D3F2E] active:scale-95 cursor-pointer border border-[#E4DC CB]'
            : 'bg-[#F5F2EA] text-[#B0B8AE] cursor-not-allowed opacity-60 border border-transparent'
        }`}
        aria-label="Ir para o dia seguinte"
      >
        <span>Dia seguinte</span>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </nav>
  );
};
