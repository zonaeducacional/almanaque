import React from 'react';
import { LeituraDoDia } from '../types/almanaque';

interface CardLeituraProps {
  leitura: LeituraDoDia;
  pacoteNome?: string;
  rotuloIa?: string;
}

export const CardLeitura: React.FC<CardLeituraProps> = ({ leitura, pacoteNome, rotuloIa }) => {
  return (
    <article className="w-full bg-[#FFFFFF] border border-[#E2D9C8] rounded-2xl p-5 sm:p-8 shadow-sm relative overflow-hidden">
      {/* Faixa decorativa lateral em ocre dourado */}
      <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#B88746]" />

      <div className="flex items-center justify-between gap-3 mb-4 pl-1">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-[#FAF4E8] text-[#8C6228] flex items-center justify-center font-bold text-xs">
            📖
          </span>
          <span className="text-xs uppercase tracking-wider font-mono font-semibold text-[#8C6228]">
            Leitura do Dia • {leitura.genero}
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#8C7558] bg-[#F7F2E7] px-2 py-0.5 rounded">
          Domínio Público
        </span>
      </div>

      <div className="pl-1">
        <header className="mb-5 pb-3 border-b border-[#F0E8D9]">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#231D16] tracking-tight">
            {leitura.titulo}
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#705F4A] font-sans">
            <span className="font-semibold text-[#3D3326]">{leitura.autor}</span>
            <span>•</span>
            <span className="italic">{leitura.epocaOuLivro}</span>
          </div>
        </header>

        {/* Texto do poema/crônica com tipografia serifada generosa */}
        <div className="bg-[#FAF7F0] border border-[#EFE7D8] rounded-xl p-5 sm:p-7 my-3">
          <blockquote className="font-serif text-base sm:text-lg text-[#2D261F] whitespace-pre-line leading-[1.85] tracking-normal font-normal">
            {leitura.texto}
          </blockquote>
        </div>

        {leitura.notaEditorial && (
          <div className="mt-4 pt-2 text-xs text-[#7C6E5C] font-sans flex items-start gap-2">
            <span className="text-[#B88746] font-bold">✎</span>
            <p className="italic">{leitura.notaEditorial}</p>
          </div>
        )}

        {(pacoteNome || rotuloIa) && (
          <div className="mt-4 pt-3 border-t border-[#F0E8D9] dark:border-[#2C3E2F] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#7C6E5C] dark:text-[#9DAE9A]">
            {pacoteNome && (
              <span className="flex items-center gap-1">
                <span>📦</span>
                <span>{pacoteNome}</span>
              </span>
            )}
            {rotuloIa && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#FAF6EE] dark:bg-[#1E2B20] border border-[#E8DFD0] dark:border-[#2C3E2F] text-[#5A4A35] dark:text-[#B2C6B2]">
                {rotuloIa}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
};
