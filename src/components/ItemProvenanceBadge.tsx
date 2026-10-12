import React from 'react';

interface ItemProvenanceBadgeProps {
  pacoteNome: string;
  autor: string;
  rotuloIa: string;
  className?: string;
}

export const ItemProvenanceBadge: React.FC<ItemProvenanceBadgeProps> = ({
  pacoteNome,
  autor,
  rotuloIa,
  className = '',
}) => {
  const getRotuloIcone = (rotulo: string) => {
    const lower = rotulo.toLowerCase();
    if (lower.includes('ia') || lower.includes('inteligência artificial')) {
      return '✦';
    }
    if (lower.includes('humana') || lower.includes('comunitária')) {
      return '🌿';
    }
    if (lower.includes('domínio') || lower.includes('clássico')) {
      return '📖';
    }
    return '●';
  };

  return (
    <div
      className={`text-xs font-mono bg-[#FAF6EE] dark:bg-[#1A261D] border border-[#E9DFCE] dark:border-[#2C3E2F] rounded-xl p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-2 text-[#6D5D48] dark:text-[#9DAE9A] ${className}`}
      aria-label="Metadados de autoria e procedência do conteúdo"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-[#2D5A27] dark:text-[#80B88A] flex items-center gap-1">
          <span>📦</span>
          <span>{pacoteNome}</span>
        </span>
        <span>•</span>
        <span>Autor: <strong className="text-[#3E3427] dark:text-[#D5E2D2] font-semibold">{autor}</strong></span>
      </div>

      <span
        className="text-[11px] px-2 py-0.5 rounded-full bg-[#F0E8D8] dark:bg-[#253628] text-[#5A4A35] dark:text-[#B2C6B2] border border-[#E0D4C0] dark:border-[#354D39] flex items-center gap-1 font-medium"
        title="Rótulo de transparência de uso de Inteligência Artificial"
      >
        <span>{getRotuloIcone(rotuloIa)}</span>
        <span>{rotuloIa}</span>
      </span>
    </div>
  );
};
