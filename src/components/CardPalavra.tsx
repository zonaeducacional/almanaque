import React from 'react';
import { PalavraOuProverbio } from '../types/almanaque';

interface CardPalavraProps {
  item: PalavraOuProverbio;
}

export const CardPalavra: React.FC<CardPalavraProps> = ({ item }) => {
  return (
    <article className="w-full bg-[#FFFFFF] border border-[#E2D9C8] rounded-2xl p-5 sm:p-7 shadow-sm relative overflow-hidden">
      {/* Faixa decorativa lateral em verde oliva terroso */}
      <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#5D7052]" />

      <div className="flex items-center justify-between gap-3 mb-3 pl-1">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-[#EFF4ED] text-[#425937] flex items-center justify-center font-bold text-xs">
            💬
          </span>
          <span className="text-xs uppercase tracking-wider font-mono font-semibold text-[#425937]">
            {item.tipo} do Dia
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#6A7B63] bg-[#EFF4ED] px-2 py-0.5 rounded">
          Linguagem Viva
        </span>
      </div>

      <div className="mt-2 pl-1">
        <div className="flex flex-wrap items-baseline gap-2 mb-1.5">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1C2619] tracking-tight">
            “{item.termo}”
          </h2>
        </div>

        <span className="inline-block text-xs font-mono text-[#65765E] bg-[#F3F7F2] border border-[#DEE7DD] px-2.5 py-0.5 rounded mb-3">
          {item.origem}
        </span>

        <p className="text-sm sm:text-base text-[#384635] leading-relaxed">
          <span className="font-semibold text-[#222E1F]">Significado: </span>
          {item.significado}
        </p>

        <div className="mt-3.5 bg-[#FAF7F0] border-l-2 border-[#5D7052] p-3 text-xs sm:text-sm text-[#4E5C4B] italic">
          {item.reflexao}
        </div>
      </div>
    </article>
  );
};
