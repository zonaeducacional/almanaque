import React from 'react';
import { PlacarProgresso } from '../types/almanaque';

interface CardProgressoProps {
  progresso: PlacarProgresso;
}

export const CardProgresso: React.FC<CardProgressoProps> = ({ progresso }) => {
  return (
    <article className="w-full bg-[#FFFFFF] border border-[#E2D9C8] rounded-2xl p-5 sm:p-7 shadow-sm relative overflow-hidden">
      {/* Faixa decorativa lateral em verde vegetal */}
      <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#3B7247]" />

      <div className="flex items-center justify-between gap-3 mb-3 pl-1">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-[#EBF4EC] text-[#296336] flex items-center justify-center font-bold text-xs">
            🌱
          </span>
          <span className="text-xs uppercase tracking-wider font-mono font-semibold text-[#30683D]">
            Placar de Progresso
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#7D8C7A] bg-[#F4F1E9] px-2 py-0.5 rounded">
          Mundo Real
        </span>
      </div>

      <div className="mt-2 pl-1">
        {/* Número em destaque */}
        <div className="inline-block px-3 py-1 bg-[#EEF6F0] border border-[#D5E8D8] rounded-lg text-[#255E32] font-mono font-bold text-lg sm:text-xl tracking-tight mb-2.5">
          {progresso.numeroDestaque}
        </div>

        {/* Título da notícia positiva */}
        <h2 className="text-lg sm:text-xl font-bold text-[#1E2D20] leading-snug">
          {progresso.titulo}
        </h2>

        {/* Descrição contextual */}
        <p className="mt-2.5 text-sm sm:text-base text-[#475747] leading-relaxed">
          {progresso.descricao}
        </p>

        {/* Fonte com o aviso explícito solicitado */}
        <div className="mt-4 pt-3 border-t border-[#F0EAE0] flex items-center justify-between text-xs text-[#7F8F7E]">
          <span className="italic">{progresso.fonte}</span>
          <span className="text-[10px] font-mono uppercase bg-[#F8F5EE] border border-[#E3DC CE] px-1.5 py-0.5 rounded text-[#8A7965]">
            Verificável
          </span>
        </div>
      </div>
    </article>
  );
};
