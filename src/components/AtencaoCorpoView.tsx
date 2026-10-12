import React, { useState } from 'react';
import rawData from '../data/atencaoCorpoData.json';

interface PausaGuiada {
  id: string;
  titulo: string;
  duracao: string;
  tipo: string;
  icone: string;
  descricao: string;
  passos: string[];
  sensacaoEsperada: string;
  fonte: string;
}

interface DicaSono {
  id: string;
  titulo: string;
  icone: string;
  pratica: string;
  beneficio: string;
}

interface SabadoSemTela {
  titulo: string;
  icone: string;
  proposta: string;
  semCulpa: string;
  ideiasParaOPrimeiroDia: string[];
  comoComecar: string;
  fonte: string;
}

interface AtencaoCorpoData {
  secaoInfo: {
    titulo: string;
    subtitulo: string;
    lema: string;
  };
  pausasGuiadas: PausaGuiada[];
  dicasDeSono: DicaSono[];
  sabadoSemTela: SabadoSemTela;
}

const data = rawData as AtencaoCorpoData;

interface AtencaoCorpoViewProps {
  onBack: () => void;
}

export const AtencaoCorpoView: React.FC<AtencaoCorpoViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'pausas' | 'sono' | 'sabado'>('pausas');
  const [selectedPausaId, setSelectedPausaId] = useState<string>(data.pausasGuiadas[0]?.id || '');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const currentPausa =
    data.pausasGuiadas.find((p) => p.id === selectedPausaId) || data.pausasGuiadas[0];

  const handleSelectPausa = (id: string) => {
    setSelectedPausaId(id);
    setActiveStepIndex(0);
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
          Ritmo livre • Sem cobrança
        </span>
      </div>

      {/* Título e Lema da Seção */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF3E8] border border-[#CCDDC6] text-[#2C6237] text-xs font-mono font-medium mb-2.5">
          <span>🧘 Presença e Cuidado Físico</span>
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

      {/* Alternância de Abas: Pausas vs Sono vs Sábado sem Tela */}
      <div className="mb-6 p-1.5 bg-[#EFE9DC] rounded-xl flex items-center gap-1">
        <button
          onClick={() => setActiveTab('pausas')}
          type="button"
          className={`flex-1 py-2 px-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'pausas'
              ? 'bg-[#FFFFFF] text-[#1E3022] shadow-sm font-bold'
              : 'text-[#6D7A69] hover:text-[#233224]'
          }`}
        >
          <span>🌬️</span>
          <span>Pausas Guiadas</span>
        </button>
        <button
          onClick={() => setActiveTab('sono')}
          type="button"
          className={`flex-1 py-2 px-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'sono'
              ? 'bg-[#FFFFFF] text-[#1E3022] shadow-sm font-bold'
              : 'text-[#6D7A69] hover:text-[#233224]'
          }`}
        >
          <span>🌙</span>
          <span>Dicas de Sono</span>
        </button>
        <button
          onClick={() => setActiveTab('sabado')}
          type="button"
          className={`flex-1 py-2 px-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'sabado'
              ? 'bg-[#FFFFFF] text-[#1E3022] shadow-sm font-bold'
              : 'text-[#6D7A69] hover:text-[#233224]'
          }`}
        >
          <span>🪁</span>
          <span>Sábado sem Tela</span>
        </button>
      </div>

      {/* 1. ABA DE PAUSAS GUIADAS (Sem temporizadores que cobrem o usuário) */}
      {activeTab === 'pausas' && (
        <div className="space-y-5">
          {/* Seletor das 3 pausas */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {data.pausasGuiadas.map((pausa) => {
              const isSelected = pausa.id === selectedPausaId;
              return (
                <button
                  key={pausa.id}
                  onClick={() => handleSelectPausa(pausa.id)}
                  type="button"
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-[#2E5E37] text-white border-[#2E5E37] shadow-sm font-semibold'
                      : 'bg-[#FFFFFF] hover:bg-[#F2ECE0] border-[#E2D8C6] text-[#364235]'
                  }`}
                >
                  <span className="text-xl sm:text-2xl">{pausa.icone}</span>
                  <span className="text-xs font-sans leading-tight line-clamp-1">
                    {pausa.tipo}
                  </span>
                  <span
                    className={`text-[10px] font-mono ${
                      isSelected ? 'text-[#D7ECD9]' : 'text-[#7D8C7A]'
                    }`}
                  >
                    {pausa.duracao}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Cartão de Experiência Orgânica da Pausa */}
          <article className="bg-[#FFFFFF] border border-[#E5DECD] rounded-2xl p-5 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#F0EAE0]">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-2xl bg-[#FAF4E8] text-[#8C6228] flex items-center justify-center font-bold text-2xl shrink-0">
                  {currentPausa.icone}
                </span>
                <div>
                  <span className="text-[11px] font-mono text-[#7D8B7A] uppercase tracking-wider font-semibold block">
                    Pausa Orgânica • {currentPausa.duracao}
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#231D16] tracking-tight">
                    {currentPausa.titulo}
                  </h2>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#5B6857] leading-relaxed">
              {currentPausa.descricao}
            </p>

            {/* Guia de Passos no Ritmo Próprio do Usuário */}
            <div className="bg-[#FAF7F0] border border-[#EDE4D5] rounded-xl p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2 mb-3 text-xs font-mono text-[#7D8B7A]">
                <span className="uppercase font-semibold text-[#8C5D26]">
                  Passo a passo no seu ritmo
                </span>
                <span>
                  Passo {activeStepIndex + 1} de {currentPausa.passos.length}
                </span>
              </div>

              {/* Texto do Passo em Destaque */}
              <div className="min-h-[70px] flex items-center">
                <p className="font-serif text-base sm:text-lg text-[#2A2219] leading-relaxed">
                  {currentPausa.passos[activeStepIndex]}
                </p>
              </div>

              {/* Navegação entre passos (Sem cronômetro regressivo ou apito) */}
              <div className="mt-4 pt-3 border-t border-[#EFE5D3] flex items-center justify-between gap-3">
                <button
                  onClick={() => setActiveStepIndex((idx) => Math.max(0, idx - 1))}
                  disabled={activeStepIndex === 0}
                  type="button"
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    activeStepIndex === 0
                      ? 'text-[#B0B8AE] opacity-50 cursor-not-allowed'
                      : 'text-[#485947] hover:bg-[#EFE8D7] cursor-pointer'
                  }`}
                >
                  ← Passo anterior
                </button>

                <div className="flex items-center gap-1.5">
                  {currentPausa.passos.map((_, i) => (
                    <span
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === activeStepIndex ? 'bg-[#2E5E37] w-4' : 'bg-[#DCD4C2]'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() =>
                    setActiveStepIndex((idx) =>
                      idx < currentPausa.passos.length - 1 ? idx + 1 : 0
                    )
                  }
                  type="button"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-[#2E5E37] text-white hover:bg-[#254C2D] cursor-pointer"
                >
                  {activeStepIndex < currentPausa.passos.length - 1
                    ? 'Próximo passo →'
                    : 'Recomeçar pausa ↺'}
                </button>
              </div>
            </div>

            {/* Sensação Esperada */}
            <div className="p-3.5 bg-[#F2F7F2] border border-[#D5EAD7] rounded-xl text-xs sm:text-sm text-[#244129] flex items-center gap-2">
              <span className="text-[#3A7E48] font-bold">🍃</span>
              <span>
                <strong>Sensação ao terminar: </strong>
                {currentPausa.sensacaoEsperada}
              </span>
            </div>

            {/* Fonte */}
            <div className="pt-2 text-[11px] text-[#7A8B78] flex items-center justify-between border-t border-[#F2ECE0]">
              <span className="italic">Fonte: {currentPausa.fonte}</span>
              <span className="text-[10px] font-mono uppercase bg-[#F2ECE0] px-1.5 py-0.5 rounded text-[#6E7B6C]">
                Fisiologia
              </span>
            </div>
          </article>
        </div>
      )}

      {/* 2. ABA DE DICAS DE SONO */}
      {activeTab === 'sono' && (
        <div className="space-y-4">
          <div className="bg-[#FFFFFF] border border-[#E5DECD] rounded-2xl p-5 sm:p-6 shadow-sm">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E3022] tracking-tight mb-2">
              A Arte de Desacelerar para a Noite
            </h2>
            <p className="text-xs sm:text-sm text-[#5C6B59] leading-relaxed mb-5">
              O sono restaurador não é um botão que se aperta na hora de deitar; é uma descida suave que se prepara ao longo do entardecer.
            </p>

            <div className="space-y-4">
              {data.dicasDeSono.map((dica) => (
                <div
                  key={dica.id}
                  className="bg-[#FCFAF5] border border-[#EDE2CE] rounded-xl p-4 sm:p-5"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-2xl">{dica.icone}</span>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-[#251D14]">
                      {dica.titulo}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#44382C] leading-relaxed mb-2.5">
                    {dica.pratica}
                  </p>
                  <div className="text-xs text-[#2D6638] font-mono flex items-center gap-1.5">
                    <span>✓</span>
                    <span>Benefício real: {dica.beneficio}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-3 text-[11px] text-[#7A8B78] border-t border-[#F2ECE0] flex items-center justify-between">
              <span className="italic">
                Fonte: Associação Brasileira do Sono (ABS) (exemplo, verificar antes de publicar)
              </span>
              <span className="text-[10px] font-mono uppercase bg-[#F2ECE0] px-1.5 py-0.5 rounded text-[#6E7B6C]">
                Descanso
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. ABA DE SÁBADO SEM TELA (DIA ANALÓGICO) */}
      {activeTab === 'sabado' && (
        <article className="bg-[#FFFFFF] border border-[#E5DECD] rounded-2xl p-5 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-[#F0EAE0]">
            <span className="w-12 h-12 rounded-2xl bg-[#FAF0E4] text-[#A66020] flex items-center justify-center font-bold text-2xl shrink-0">
              {data.sabadoSemTela.icone}
            </span>
            <div>
              <span className="text-[11px] font-mono text-[#8C6432] uppercase tracking-wider font-semibold block">
                Convite Livre
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#231D16] tracking-tight">
                {data.sabadoSemTela.titulo}
              </h2>
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#3E3529] leading-relaxed">
            {data.sabadoSemTela.proposta}
          </p>

          <div className="bg-[#FAF5EC] border-l-3 border-[#C07D38] p-4 text-xs sm:text-sm text-[#503E2C] italic">
            <strong>Sem culpa: </strong>
            {data.sabadoSemTela.semCulpa}
          </div>

          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#63513B] mb-3">
              Ideias para preencher o dia com presença:
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#3E3427]">
              {data.sabadoSemTela.ideiasParaOPrimeiroDia.map((ideia, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-[#FCFAF5] p-3 rounded-xl border border-[#EDE2CD]">
                  <span className="text-[#B57C3B] font-bold">•</span>
                  <span className="leading-relaxed">{ideia}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#F0F7F2] border border-[#CFE8D3] rounded-xl p-4">
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#2D6638] block mb-1">
              Como combinar com quem importa
            </span>
            <p className="text-xs sm:text-sm text-[#27402C] leading-relaxed">
              {data.sabadoSemTela.comoComecar}
            </p>
          </div>

          <div className="pt-2 text-[11px] text-[#7A8B78] flex items-center justify-between border-t border-[#F2ECE0]">
            <span className="italic">Fonte: {data.sabadoSemTela.fonte}</span>
            <span className="text-[10px] font-mono uppercase bg-[#F2ECE0] px-1.5 py-0.5 rounded text-[#6E7B6C]">
              Saúde Mental
            </span>
          </div>
        </article>
      )}
    </div>
  );
};
