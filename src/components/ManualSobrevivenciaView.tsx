import React, { useState } from 'react';
import manualDataRaw from '../data/manualSobrevivenciaData.json';
import { ManualSobrevivenciaData, VerbeteManual } from '../types/secoes';
import { TreinoSimulador } from './TreinoSimulador';

const manualData = manualDataRaw as ManualSobrevivenciaData;

interface ManualSobrevivenciaViewProps {
  onBack: () => void;
}

export const ManualSobrevivenciaView: React.FC<ManualSobrevivenciaViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'verbetes' | 'treino'>('verbetes');
  const [expandedId, setExpandedId] = useState<string | null>(manualData.verbetes[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-4 pb-24">
      {/* Botão de retorno e cabeçalho */}
      <div className="mb-6 flex items-center justify-between gap-3 border-b border-[#E8DFD0] pb-4">
        <button
          onClick={onBack}
          type="button"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#2F6139] hover:text-[#1E3F20] bg-[#FAF6ED] hover:bg-[#F2EBDC] px-3.5 py-2 rounded-xl border border-[#E5DECD] transition-all cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Voltar às Seções</span>
        </button>

        <span className="text-xs font-mono text-[#7D8B7A] bg-[#F2ECE0] px-3 py-1 rounded-full">
          6 verbetes • 1 treino
        </span>
      </div>

      {/* Título e Propósito */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF3E8] border border-[#CCDDC6] text-[#2C6237] text-xs font-mono font-medium mb-2.5">
          <span>🛡️ Seção Aberta</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E3022] tracking-tight">
          Manual de sobrevivência digital
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-[#61705D] font-sans leading-relaxed">
          Sem alarmismo, com calma e lucidez: orientações humanas para proteger a tranquilidade, o bolso e a atenção de quem você ama no ambiente digital.
        </p>
      </div>

      {/* Alternância de Abas: Verbetes vs Treino */}
      <div className="mb-6 p-1.5 bg-[#EFE9DC] rounded-xl flex items-center gap-1">
        <button
          onClick={() => setActiveTab('verbetes')}
          type="button"
          className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
            activeTab === 'verbetes'
              ? 'bg-[#FFFFFF] text-[#1E3022] shadow-sm font-bold'
              : 'text-[#6D7A69] hover:text-[#233224]'
          }`}
        >
          📖 Os 6 Verbetes Essenciais
        </button>
        <button
          onClick={() => setActiveTab('treino')}
          type="button"
          className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
            activeTab === 'treino'
              ? 'bg-[#FFFFFF] text-[#1E3022] shadow-sm font-bold'
              : 'text-[#6D7A69] hover:text-[#233224]'
          }`}
        >
          🎯 Treino de Percepção (5 Casos)
        </button>
      </div>

      {/* Conteúdo da Aba Ativa */}
      {activeTab === 'treino' ? (
        <TreinoSimulador questoes={manualData.treino} />
      ) : (
        <div className="flex flex-col gap-4">
          {manualData.verbetes.map((verbete, index) => {
            const isExpanded = expandedId === verbete.id;

            return (
              <article
                key={verbete.id}
                className="bg-[#FFFFFF] border border-[#E5DECD] rounded-2xl p-5 sm:p-6 shadow-sm transition-all"
              >
                {/* Linha de topo do verbete */}
                <div
                  onClick={() => toggleExpand(verbete.id)}
                  className="flex items-start justify-between gap-3 cursor-pointer select-none"
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-10 h-10 rounded-xl bg-[#FAF4E8] text-[#8C6228] flex items-center justify-center font-bold text-lg shrink-0">
                      {verbete.icone}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-[#7D8B7A] uppercase tracking-wider font-semibold">
                          Verbete {index + 1}
                        </span>
                      </div>
                      <h2 className="font-serif text-lg sm:text-xl font-bold text-[#231D16] tracking-tight leading-snug">
                        {verbete.titulo}
                      </h2>
                      <p className="mt-1 text-xs sm:text-sm text-[#5C6A58] line-clamp-2">
                        {verbete.resumo}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-8 h-8 rounded-full bg-[#F5EFE3] hover:bg-[#EBE2D3] text-[#5A6E59] flex items-center justify-center shrink-0 transition-transform"
                    aria-label={isExpanded ? 'Recolher detalhes' : 'Expandir detalhes'}
                  >
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </div>

                {/* Conteúdo expandido: Como Reconhecer e O que Fazer */}
                {isExpanded && (
                  <div className="mt-5 pt-4 border-t border-[#F0EAE0] space-y-4">
                    {/* Bloco: Como reconhecer */}
                    <div className="bg-[#FCF9F2] border border-[#EDE2CE] rounded-xl p-4">
                      <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#A25F22] flex items-center gap-1.5 mb-2">
                        <span>🔍</span> Como reconhecer
                      </span>
                      <ul className="space-y-2 text-xs sm:text-sm text-[#443729]">
                        {verbete.comoReconhecer.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-[#C07D38] font-bold">•</span>
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bloco: O que fazer */}
                    <div className="bg-[#F2F8F3] border border-[#D5EAD8] rounded-xl p-4">
                      <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#2A6538] flex items-center gap-1.5 mb-2">
                        <span>🛡️</span> O que fazer
                      </span>
                      <ul className="space-y-2 text-xs sm:text-sm text-[#273F2D]">
                        {verbete.oQueFazer.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-[#3E804D] font-bold">✓</span>
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Dica de ouro serena */}
                    <div className="bg-[#FAF7F0] border-l-3 border-[#8C6228] p-3 text-xs sm:text-sm text-[#4A3D2D] italic">
                      <strong className="not-italic text-[#2B231A]">Dica de ouro: </strong>
                      {verbete.dicaDeOuro}
                    </div>

                    {/* Fonte marcada */}
                    <div className="pt-2 text-[11px] text-[#7A8B78] flex items-center justify-between border-t border-[#F2ECE0]">
                      <span className="italic">Fonte: {verbete.fonte}</span>
                      <span className="text-[10px] font-mono uppercase bg-[#F2ECE0] px-1.5 py-0.5 rounded text-[#6E7B6C]">
                        Educativo
                      </span>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
