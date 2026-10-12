import React, { useState } from 'react';
import rawData from '../data/oficinasData.json';

interface ProjetoOficina {
  id: string;
  titulo: string;
  categoria: string;
  icone: string;
  descricao: string;
  tempoEstimado: string;
  dificuldade: string;
  materiais: string[];
  passos: string[];
  dicaMestre: string;
  fonte: string;
}

interface OficinasData {
  secaoInfo: {
    titulo: string;
    subtitulo: string;
    lema: string;
  };
  projetos: ProjetoOficina[];
}

const data = rawData as OficinasData;

interface OficinasViewProps {
  onBack: () => void;
}

export const OficinasView: React.FC<OficinasViewProps> = ({ onBack }) => {
  const [selectedProjetoId, setSelectedProjetoId] = useState<string>(data.projetos[0]?.id || '');

  const currentProjeto =
    data.projetos.find((p) => p.id === selectedProjetoId) || data.projetos[0];

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
          5 oficinas práticas
        </span>
      </div>

      {/* Título e Lema da Seção */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF3E8] border border-[#CCDDC6] text-[#2C6237] text-xs font-mono font-medium mb-2.5">
          <span>🛠️ Autonomia e Trabalho Manual</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E3022] tracking-tight">
          {data.secaoInfo.titulo}
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-[#61705D] font-sans leading-relaxed">
          {data.secaoInfo.subtitulo}
        </p>
        <div className="mt-3 p-3 bg-[#FCFAF5] border-l-2 border-[#5B8266] text-xs sm:text-sm text-[#3E4D3E] italic">
          “{data.secaoInfo.lema}”
        </div>
      </div>

      {/* Seletor Horizontal de Oficinas */}
      <div className="mb-6">
        <label className="text-xs font-mono uppercase tracking-wider text-[#6A7B68] font-semibold block mb-2">
          Escolha uma oficina para fazer em casa:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {data.projetos.map((proj) => {
            const isSelected = proj.id === selectedProjetoId;
            return (
              <button
                key={proj.id}
                onClick={() => setSelectedProjetoId(proj.id)}
                type="button"
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? 'bg-[#2E5E37] text-white border-[#2E5E37] shadow-sm font-semibold'
                    : 'bg-[#FFFFFF] hover:bg-[#F2ECE0] border-[#E2D8C6] text-[#364235]'
                }`}
              >
                <span className="text-xl sm:text-2xl">{proj.icone}</span>
                <span className="text-xs font-sans leading-tight line-clamp-1">
                  {proj.categoria}
                </span>
                <span
                  className={`text-[10px] font-mono ${
                    isSelected ? 'text-[#D7ECD9]' : 'text-[#7D8C7A]'
                  }`}
                >
                  {proj.tempoEstimado}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cartão Detalhado do Projeto Selecionado */}
      <article className="bg-[#FFFFFF] border border-[#E5DECD] rounded-2xl p-5 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-[#F0EAE0]">
          <div className="flex items-start gap-3">
            <span className="w-12 h-12 rounded-2xl bg-[#FAF4E8] text-[#8C6228] flex items-center justify-center font-bold text-2xl shrink-0">
              {currentProjeto.icone}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[#7D8B7A] uppercase tracking-wider font-semibold">
                  {currentProjeto.categoria} • Dificuldade: {currentProjeto.dificuldade}
                </span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#231D16] tracking-tight">
                {currentProjeto.titulo}
              </h2>
            </div>
          </div>

          <span className="text-xs font-mono font-medium text-[#2E5E37] bg-[#EAF5EC] px-3 py-1.5 rounded-lg shrink-0 self-start">
            ⏱ {currentProjeto.tempoEstimado}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#5B6857] leading-relaxed">
          {currentProjeto.descricao}
        </p>

        {/* Lista de Materiais Necessários */}
        <div className="bg-[#FCFAF5] border border-[#EDE2CD] rounded-xl p-4 sm:p-5">
          <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#8A5B22] flex items-center gap-1.5 mb-3">
            <span>📦</span> Materiais necessários
          </span>
          <ul className="space-y-1.5 text-xs sm:text-sm text-[#463829]">
            {currentProjeto.materiais.map((mat, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#B57C3B] font-bold">▫</span>
                <span className="leading-relaxed">{mat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Passo a Passo Ilustrado */}
        <div className="space-y-3">
          <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#2D6638] flex items-center gap-1.5">
            <span>🛠️</span> Como fazer passo a passo
          </span>

          <ol className="space-y-3">
            {currentProjeto.passos.map((passo, idx) => (
              <li
                key={idx}
                className="bg-[#FAF7F0] border border-[#EBE1CF] rounded-xl p-3.5 sm:p-4 flex items-start gap-3"
              >
                <span className="w-6 h-6 rounded-full bg-[#E5D7BF] text-[#4E3920] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm text-[#2E2519] leading-relaxed pt-0.5">
                  {passo}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Dica de Mestre */}
        <div className="bg-[#F2F8F3] border-l-3 border-[#2E5E37] p-4 rounded-r-xl text-xs sm:text-sm text-[#234228]">
          <strong className="text-[#1E3F22]">Dica do artífice: </strong>
          {currentProjeto.dicaMestre}
        </div>

        {/* Fonte com demarcação solicitada */}
        <div className="pt-2 text-[11px] text-[#7A8B78] flex items-center justify-between border-t border-[#F2ECE0]">
          <span className="italic">Fonte: {currentProjeto.fonte}</span>
          <span className="text-[10px] font-mono uppercase bg-[#F2ECE0] px-1.5 py-0.5 rounded text-[#6E7B6C]">
            Manual Prático
          </span>
        </div>
      </article>
    </div>
  );
};
