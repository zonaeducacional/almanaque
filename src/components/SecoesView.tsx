import React, { useState } from 'react';
import manualDataRaw from '../data/manualSobrevivenciaData.json';
import { ManualSobrevivenciaData, SecaoTematica } from '../types/secoes';
import { ManualSobrevivenciaView } from './ManualSobrevivenciaView';
import { ConversandoMaquinasView } from './ConversandoMaquinasView';
import { ClimaTerritorioView } from './ClimaTerritorioView';
import { AtencaoCorpoView } from './AtencaoCorpoView';
import { DireitosCidadaniaView } from './DireitosCidadaniaView';
import { OficinasView } from './OficinasView';
import { BancoSaberesView } from './BancoSaberesView';
import { LaboratorioIdeiasView } from './LaboratorioIdeiasView';

const manualData = manualDataRaw as ManualSobrevivenciaData;

interface SecoesViewProps {
  initialSectionId?: string | null;
  onNavigateToEdicoes?: () => void;
}

export const SecoesView: React.FC<SecoesViewProps> = ({ initialSectionId, onNavigateToEdicoes }) => {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(initialSectionId || null);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialSectionId) {
      setActiveSectionId(initialSectionId);
    }
  }, [initialSectionId]);

  const handleSelectSection = (secao: SecaoTematica) => {
    if (secao.disponivel) {
      setActiveSectionId(secao.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setToastNotice(`A seção "${secao.titulo}" está sendo preparada para as próximas edições do Cyber Almanaque.`);
      setTimeout(() => setToastNotice(null), 3500);
    }
  };

  if (activeSectionId === 'manual-digital') {
    return <ManualSobrevivenciaView onBack={() => setActiveSectionId(null)} />;
  }

  if (activeSectionId === 'conversando-maquinas') {
    return <ConversandoMaquinasView onBack={() => setActiveSectionId(null)} />;
  }

  if (activeSectionId === 'clima-territorio') {
    return <ClimaTerritorioView onBack={() => setActiveSectionId(null)} />;
  }

  if (activeSectionId === 'atencao-corpo') {
    return <AtencaoCorpoView onBack={() => setActiveSectionId(null)} />;
  }

  if (activeSectionId === 'direitos-cidadania') {
    return <DireitosCidadaniaView onBack={() => setActiveSectionId(null)} />;
  }

  if (activeSectionId === 'oficinas') {
    return <OficinasView onBack={() => setActiveSectionId(null)} />;
  }

  if (activeSectionId === 'banco-saberes') {
    return <BancoSaberesView onBack={() => setActiveSectionId(null)} />;
  }

  if (activeSectionId === 'laboratorio-ideias') {
    return <LaboratorioIdeiasView onBack={() => setActiveSectionId(null)} />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-4 pb-24">
      {/* Título da Tela de Seções */}
      <div className="mb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-[#5A735E] font-semibold block mb-1">
          Compêndio Solarpunk
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E3022] tracking-tight">
          Seções Temáticas
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-[#61705D] font-sans leading-relaxed">
          Saberes perenes e manuais práticos para uma vida autônoma, consciente e em comunidade.
        </p>
      </div>

      {/* Aviso toast para seções em breve */}
      {toastNotice && (
        <div className="mb-5 p-3.5 rounded-xl border border-[#D5E5D8] bg-[#EBF6ED] text-[#245C31] text-xs sm:text-sm font-sans flex items-center gap-2">
          <span>🌱</span>
          <span>{toastNotice}</span>
        </div>
      )}

      {/* Card Destaque: Edições e Pacotes */}
      {onNavigateToEdicoes && (
        <div className="mb-6 p-4 sm:p-5 rounded-2xl border border-[#D5E5D8] dark:border-[#2C4832] bg-[#EBF5ED] dark:bg-[#1A2C1F] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2.5 rounded-xl bg-white dark:bg-[#152319] border border-[#CDE5D2] dark:border-[#28442E] inline-block shrink-0">
              📦
            </span>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-[#1E3E23] dark:text-[#E2EFE4]">
                Edições e Pacotes Editoriais
              </h2>
              <p className="text-xs text-[#526D57] dark:text-[#9FB7A3]">
                Instale novas edições locais, troque arquivos sem internet ou crie o almanaque comunitário da sua escola ou cidade.
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToEdicoes}
            type="button"
            className="touch-target px-4 py-2 rounded-xl text-xs font-mono font-bold bg-[#2E5E37] text-white hover:bg-[#234C2C] shadow-sm transition-all cursor-pointer shrink-0 self-end sm:self-center"
          >
            Gerenciar Edições →
          </button>
        </div>
      )}

      {/* Grade de Seções */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {manualData.secoes.map((secao) => {
          return (
            <article
              key={secao.id}
              onClick={() => handleSelectSection(secao)}
              className={`p-5 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                secao.disponivel
                  ? 'bg-[#FFFFFF] border-[#D6CBB8] hover:border-[#387245] shadow-sm hover:shadow-md cursor-pointer hover:-translate-y-0.5'
                  : 'bg-[#F4EFE6]/60 border-[#E8DFC8] opacity-75 cursor-pointer hover:bg-[#F4EFE6]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-2xl p-2 rounded-xl bg-[#FAF6EE] border border-[#EBE3D3] inline-block">
                    {secao.icone}
                  </span>
                  <span
                    className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full ${
                      secao.disponivel
                        ? 'bg-[#EBF5ED] text-[#286435] border border-[#CDE7D3]'
                        : 'bg-[#EDE7DA] text-[#8C7A65] border border-[#E0D7C5]'
                    }`}
                  >
                    {secao.etiqueta || (secao.disponivel ? 'Disponível' : 'Em breve')}
                  </span>
                </div>

                <h2 className="font-serif text-lg font-bold text-[#202921] leading-snug">
                  {secao.titulo}
                </h2>

                <p className="mt-2 text-xs sm:text-sm text-[#5B6958] leading-relaxed">
                  {secao.descricao}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F2ECE0] flex items-center justify-between text-xs font-mono">
                {secao.disponivel ? (
                  <span className="text-[#2F6139] font-bold flex items-center gap-1">
                    <span>Abrir manual</span>
                    <span>→</span>
                  </span>
                ) : (
                  <span className="text-[#968977] italic">
                    Em cultivo
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
