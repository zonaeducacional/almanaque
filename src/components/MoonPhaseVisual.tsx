import React from 'react';
import { MoonPhaseInfo } from '../types/almanaque';

interface MoonPhaseVisualProps {
  info: MoonPhaseInfo;
  className?: string;
}

/**
 * Renderizador vetorial da fase da lua.
 * No hemisfério sul (Salvador, BA), a lua crescente ilumina o lado esquerdo (formato 'C'),
 * e a minguante ilumina o lado direito (formato 'D').
 */
export const MoonPhaseVisual: React.FC<MoonPhaseVisualProps> = ({ info, className = 'w-10 h-10' }) => {
  const { iluminacaoPercent, iconeTipo } = info;

  // Renderização vetorial limpa e solarpunk
  return (
    <div className={`relative flex items-center justify-center ${className}`} title={`${info.faseNome} (${iluminacaoPercent}% iluminada)`}>
      <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-sm">
        {/* Disco base da lua (sombra/parte escura) */}
        <circle cx="20" cy="20" r="16" fill="#242E24" stroke="#445744" strokeWidth="1" />

        {/* Desenho da fase conforme a fração de iluminação */}
        {iconeTipo === 'nova' && (
          // Lua nova: anel sutil
          <circle cx="20" cy="20" r="15" fill="#1C251C" stroke="#374837" strokeWidth="1" strokeDasharray="3 3" />
        )}

        {iconeTipo === 'cheia' && (
          // Lua cheia: disco iluminado quente
          <circle cx="20" cy="20" r="15" fill="#F4E8C1" stroke="#D8C28A" strokeWidth="1" />
        )}

        {iconeTipo === 'quarto_crescente' && (
          // Hemisfério Sul: lado esquerdo iluminado
          <path d="M 20 5 A 15 15 0 0 0 20 35 Z" fill="#F4E8C1" />
        )}

        {iconeTipo === 'quarto_minguante' && (
          // Hemisfério Sul: lado direito iluminado
          <path d="M 20 5 A 15 15 0 0 1 20 35 Z" fill="#F4E8C1" />
        )}

        {iconeTipo === 'crescente' && (
          // Crescente tênue (formato C)
          <path d="M 20 5 A 15 15 0 0 0 20 35 A 9 15 0 0 1 20 5 Z" fill="#F4E8C1" />
        )}

        {iconeTipo === 'gibosa_crescente' && (
          // Quase cheia crescente
          <g>
            <circle cx="20" cy="20" r="15" fill="#F4E8C1" />
            <path d="M 20 5 A 15 15 0 0 1 20 35 A 8 15 0 0 1 20 5 Z" fill="#242E24" />
          </g>
        )}

        {iconeTipo === 'gibosa_minguante' && (
          // Quase cheia minguante
          <g>
            <circle cx="20" cy="20" r="15" fill="#F4E8C1" />
            <path d="M 20 5 A 15 15 0 0 0 20 35 A 8 15 0 0 0 20 5 Z" fill="#242E24" />
          </g>
        )}

        {iconeTipo === 'minguante' && (
          // Minguante tênue (lado direito)
          <path d="M 20 5 A 15 15 0 0 1 20 35 A 9 15 0 0 0 20 5 Z" fill="#F4E8C1" />
        )}

        {/* Detalhes de crateras e textura sutil */}
        <circle cx="16" cy="18" r="1.5" fill="#D3C088" opacity="0.3" />
        <circle cx="23" cy="24" r="2" fill="#D3C088" opacity="0.25" />
      </svg>
    </div>
  );
};
