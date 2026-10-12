import React from 'react';
import { HojeNaCiencia } from '../types/almanaque';

interface CardCienciaProps {
  ciencia: HojeNaCiencia;
}

export const CardCiencia: React.FC<CardCienciaProps> = ({ ciencia }) => {
  return (
    <article className="w-full bg-[#FFFFFF] border border-[#E2D9C8] rounded-2xl p-5 sm:p-7 shadow-sm relative overflow-hidden">
      {/* Faixa decorativa lateral em azul-céu / rio */}
      <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#4E7C8F]" />

      <div className="flex items-center justify-between gap-3 mb-3 pl-1">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-[#EAF2F5] text-[#346274] flex items-center justify-center font-bold text-xs">
            ⚙️
          </span>
          <span className="text-xs uppercase tracking-wider font-mono font-semibold text-[#346274]">
            Hoje na Ciência e na Técnica
          </span>
        </div>
        <span className="text-xs font-mono font-bold text-[#346274] bg-[#EAF2F5] px-2.5 py-0.5 rounded-full border border-[#D1E2E8]">
          Ano {ciencia.ano}
        </span>
      </div>

      <div className="mt-2 pl-1">
        <h2 className="text-lg sm:text-xl font-bold text-[#1C292E] leading-snug">
          {ciencia.titulo}
        </h2>

        <p className="mt-2.5 text-sm sm:text-base text-[#414E53] leading-relaxed">
          {ciencia.descricao}
        </p>

        <div className="mt-3.5 bg-[#F4F8FA] border border-[#E1ECEF] rounded-xl p-3 text-xs sm:text-sm text-[#38535E] flex items-start gap-2">
          <span className="text-[#4E7C8F] font-bold">💡</span>
          <span className="italic">{ciencia.relevancia}</span>
        </div>

        <div className="mt-4 pt-3 border-t border-[#EEF2F3] flex items-center justify-between text-xs text-[#7A8A90]">
          <span className="italic">{ciencia.fonte}</span>
          <span className="text-[10px] font-mono uppercase bg-[#F4F8FA] px-1.5 py-0.5 rounded text-[#57727E]">
            Efeméride
          </span>
        </div>
      </div>
    </article>
  );
};
