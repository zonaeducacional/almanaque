import React from 'react';
import { GestoDoDia } from '../types/almanaque';

interface CardGestoProps {
  gesto: GestoDoDia;
}

export const CardGesto: React.FC<CardGestoProps> = ({ gesto }) => {
  return (
    <article className="w-full bg-[#FFFFFF] border border-[#E2D9C8] rounded-2xl p-5 sm:p-7 shadow-sm relative overflow-hidden">
      {/* Faixa decorativa lateral em ocre acolhedor */}
      <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#C07D38]" />

      <div className="flex items-center justify-between gap-3 mb-3 pl-1">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-[#FAF0E4] text-[#A65F20] flex items-center justify-center font-bold text-xs">
            🤲
          </span>
          <span className="text-xs uppercase tracking-wider font-mono font-semibold text-[#A65F20]">
            Gesto do Dia
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#8C6F4B] bg-[#F9F2E7] px-2 py-0.5 rounded flex items-center gap-1">
          <span>⏱</span>
          <span>{gesto.tempoEstimado}</span>
        </span>
      </div>

      <div className="mt-2 pl-1">
        <h2 className="text-lg sm:text-xl font-bold text-[#2A231C] leading-snug">
          {gesto.titulo}
        </h2>

        <p className="mt-2.5 text-sm sm:text-base text-[#4F463D] leading-relaxed">
          {gesto.acao}
        </p>

        <div className="mt-4 pt-3 border-t border-[#F2EAE0] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[#856F57]">
            <span className="font-medium">Propósito:</span>
            <span>{gesto.proposito}</span>
          </div>
          <span className="text-[11px] text-[#A47137] italic font-serif">
            microação
          </span>
        </div>
      </div>
    </article>
  );
};
