import React from 'react';
import { AlmanaqueDia } from '../types/almanaque';
import { CidadeConfig } from '../types/settings';
import { calculateMoonPhase, calculateSunTimes } from '../utils/astronomy';
import { MoonPhaseVisual } from './MoonPhaseVisual';

interface AstroHeaderProps {
  dia: AlmanaqueDia;
  cidadeConfig?: CidadeConfig;
}

export const AstroHeader: React.FC<AstroHeaderProps> = ({ dia, cidadeConfig }) => {
  // Converte a data do dia para objeto Date para cálculo astronômico
  const [year, month, day] = dia.dataIso.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day, 12, 0, 0);

  const moonInfo = calculateMoonPhase(dateObj);
  const sunInfo = calculateSunTimes(
    dateObj,
    cidadeConfig?.lat,
    cidadeConfig?.lon,
    cidadeConfig?.tzOffset
  );

  const nomeCidadeExibida = cidadeConfig
    ? `${cidadeConfig.nome}, ${cidadeConfig.estado}`
    : sunInfo.cidade;

  return (
    <header className="w-full bg-[#FFFFFF] dark:bg-[#18231A] border border-[#E5DECE] dark:border-[#2C3C2E] rounded-2xl p-5 sm:p-7 shadow-sm transition-colors">
      {/* Etiqueta superior com estação e contagem do ano */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-[#EFE9DC] dark:border-[#28382A] text-xs font-mono text-[#5A6E5C] dark:text-[#90A792]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#3D7048] dark:bg-[#68A774]" />
          <span>{dia.estacao}</span>
        </div>
        <div className="flex items-center gap-2 text-[#7A6C58] dark:text-[#A79883]">
          <span>Dia {dia.diaDoAno} de {dia.totalDiasAno}</span>
          <span>•</span>
          <span className="font-semibold text-[#2D5A27] dark:text-[#80B88A]">{nomeCidadeExibida}</span>
        </div>
      </div>

      {/* Data principal por extenso */}
      <div className="mb-6">
        <h1 className="font-serif text-2xl sm:text-4xl text-[#1E3022] dark:text-[#EAE5D9] font-semibold tracking-tight">
          {dia.dataExtenso}
        </h1>
        <p className="mt-1 text-sm text-[#6C7A68] dark:text-[#9AAEA9] font-sans">
          Observatório diário dos ciclos naturais e humanos
        </p>
      </div>

      {/* Painel astronômico: Sol e Lua emparelhados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {/* Bloco Solar */}
        <div className="bg-[#FAF7F0] dark:bg-[#1C281F] border border-[#EDE5D6] dark:border-[#2C3D2E] rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#FCECD7] dark:bg-[#382818] border border-[#EACCA6] dark:border-[#523B24] flex items-center justify-center shrink-0 text-[#B86824] dark:text-[#E09858]">
              {/* Vetor do Sol Solarpunk */}
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" fill="#FADCB8" />
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
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#915B27] dark:text-[#D19253] font-semibold block">
                Sol • {cidadeConfig ? cidadeConfig.nome : 'Salvador'}
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-sm font-semibold text-[#273228] dark:text-[#E8E2D5]" title="Nascer do Sol">
                  ☀️ {sunInfo.nascerDoSol}
                </span>
                <span className="text-xs text-[#828F7E] dark:text-[#8E9F8C]">até</span>
                <span className="text-sm font-semibold text-[#273228] dark:text-[#E8E2D5]" title="Pôr do Sol">
                  🌅 {sunInfo.porDoSol}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs font-mono font-medium text-[#2F6139] dark:text-[#88C493] bg-[#EAF2EB] dark:bg-[#1E3022] px-2.5 py-1 rounded-md block">
              {sunInfo.duracaoDia}
            </span>
            <span className="text-[10px] text-[#788876] dark:text-[#8A9B87] block mt-1">de luz diurna</span>
          </div>
        </div>

        {/* Bloco Lunar */}
        <div className="bg-[#FAF7F0] dark:bg-[#1C281F] border border-[#EDE5D6] dark:border-[#2C3D2E] rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="shrink-0">
              <MoonPhaseVisual info={moonInfo} className="w-11 h-11" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#4E6773] dark:text-[#87A8B7] font-semibold block">
                Fase Lunar (Sul)
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-sm font-semibold text-[#273228] dark:text-[#E8E2D5]">
                  {moonInfo.faseNome}
                </span>
                <span className="text-xs text-[#6F7F70] dark:text-[#8C9F8E]">
                  {moonInfo.iluminacaoPercent}%
                </span>
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs font-mono text-[#526354] dark:text-[#A1B8A4] block">
              {moonInfo.idadeDias} dias
            </span>
            <span className="text-[10px] text-[#788876] dark:text-[#8A9B87] block mt-0.5">
              idade do ciclo
            </span>
          </div>
        </div>
      </div>

      {/* Frase poética astronômica */}
      <div className="mt-3 text-xs text-[#738271] dark:text-[#8E9F8C] italic text-center sm:text-left flex items-center justify-center sm:justify-start gap-1.5">
        <span>✦</span>
        <span>{moonInfo.descricaoPoetica}</span>
      </div>
    </header>
  );
};

