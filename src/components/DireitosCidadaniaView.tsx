import React, { useState } from 'react';
import rawData from '../data/direitosCidadaniaData.json';

interface VerbeteDireito {
  id: string;
  categoria: string;
  titulo: string;
  icone: string;
  oQueE: string;
  comoFunciona: string;
  oQueFazer: string;
  fonte: string;
}

interface ModeloTexto {
  id: string;
  titulo: string;
  destinatario: string;
  texto: string;
}

interface DireitosCidadaniaData {
  secaoInfo: {
    titulo: string;
    subtitulo: string;
    lema: string;
  };
  verbetes: VerbeteDireito[];
  modelosDeTexto: ModeloTexto[];
}

const data = rawData as DireitosCidadaniaData;

interface DireitosCidadaniaViewProps {
  onBack: () => void;
}

export const DireitosCidadaniaView: React.FC<DireitosCidadaniaViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'verbetes' | 'modelos'>('verbetes');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('todos');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categorias = ['todos', 'Consumidor', 'Trabalho', 'Dados Pessoais (LGPD)'];

  const filteredVerbetes =
    selectedCategoria === 'todos'
      ? data.verbetes
      : data.verbetes.filter((v) => v.categoria.includes(selectedCategoria));

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
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
          6 direitos • 3 modelos prontos
        </span>
      </div>

      {/* Título e Lema da Seção */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF3E8] border border-[#CCDDC6] text-[#2C6237] text-xs font-mono font-medium mb-2.5">
          <span>⚖️ Cidadania e Autonomia Jurídica</span>
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

      {/* Alternância de Abas: Verbetes vs Modelos de Texto */}
      <div className="mb-6 p-1.5 bg-[#EFE9DC] rounded-xl flex items-center gap-1">
        <button
          onClick={() => setActiveTab('verbetes')}
          type="button"
          className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'verbetes'
              ? 'bg-[#FFFFFF] text-[#1E3022] shadow-sm font-bold'
              : 'text-[#6D7A69] hover:text-[#233224]'
          }`}
        >
          <span>📖</span>
          <span>6 Direitos Essenciais</span>
        </button>
        <button
          onClick={() => setActiveTab('modelos')}
          type="button"
          className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'modelos'
              ? 'bg-[#FFFFFF] text-[#1E3022] shadow-sm font-bold'
              : 'text-[#6D7A69] hover:text-[#233224]'
          }`}
        >
          <span>📋</span>
          <span>3 Modelos Prontos para Copiar</span>
        </button>
      </div>

      {/* 1. ABA DE VERBETES */}
      {activeTab === 'verbetes' && (
        <div className="space-y-4">
          {/* Filtro por categoria */}
          <div className="flex flex-wrap items-center gap-1.5 pb-2">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoria(cat)}
                type="button"
                className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  selectedCategoria === cat
                    ? 'bg-[#2E5E37] text-white border-[#2E5E37] font-semibold'
                    : 'bg-[#FAF6ED] text-[#4F5E4E] border-[#E2D8C6] hover:bg-[#F2ECE0]'
                }`}
              >
                {cat === 'todos' ? 'Todos os Direitos' : cat}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            {filteredVerbetes.map((verbete) => (
              <article
                key={verbete.id}
                className="bg-[#FFFFFF] border border-[#E5DECD] rounded-2xl p-5 sm:p-6 shadow-sm space-y-3.5"
              >
                <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-[#F0EAE0]">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-1.5 rounded-lg bg-[#FAF4E8]">
                      {verbete.icone}
                    </span>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A5F22] font-semibold block">
                        {verbete.categoria}
                      </span>
                      <h2 className="font-serif text-lg sm:text-xl font-bold text-[#231D16] tracking-tight">
                        {verbete.titulo}
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-[#3E3427] leading-relaxed">
                  <strong className="text-[#211A13]">O que diz a lei: </strong>
                  {verbete.oQueE}
                </div>

                <div className="bg-[#FAF7F0] border border-[#EDE2CD] rounded-xl p-3.5 text-xs sm:text-sm text-[#4E4133] leading-relaxed">
                  <strong className="text-[#2C2116]">Como funciona na prática: </strong>
                  {verbete.comoFunciona}
                </div>

                <div className="bg-[#F2F7F2] border border-[#D5EAD7] rounded-xl p-3.5 text-xs sm:text-sm text-[#25422A] leading-relaxed">
                  <strong className="text-[#1E3F24]">O que fazer se desrespeitarem: </strong>
                  {verbete.oQueFazer}
                </div>

                <div className="pt-2 text-[11px] text-[#7A8B78] flex items-center justify-between border-t border-[#F2ECE0]">
                  <span className="italic">Fonte: {verbete.fonte}</span>
                  <span className="text-[10px] font-mono uppercase bg-[#F2ECE0] px-1.5 py-0.5 rounded text-[#6E7B6C]">
                    Lei Brasileira
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* 2. ABA DE MODELOS PRONTOS DE TEXTO */}
      {activeTab === 'modelos' && (
        <div className="space-y-5">
          <p className="text-xs sm:text-sm text-[#5C6B59] leading-relaxed">
            Modelos formais e seguros prontos para usar. Basta preencher as partes entre colchetes [ ] com seus dados e enviar por e-mail ou protocolo.
          </p>

          {data.modelosDeTexto.map((modelo) => {
            const isCopied = copiedId === modelo.id;

            return (
              <article
                key={modelo.id}
                className="bg-[#FFFFFF] border border-[#E5DECD] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0EAE0]">
                  <div>
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-[#231D16] tracking-tight">
                      {modelo.titulo}
                    </h2>
                    <span className="text-xs text-[#7A6B56] italic">
                      {modelo.destinatario}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopyText(modelo.id, modelo.texto)}
                    type="button"
                    className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                      isCopied
                        ? 'bg-[#2E5E37] text-white shadow-sm'
                        : 'bg-[#FAF6ED] hover:bg-[#F2EBDC] text-[#2C3E2D] border border-[#E2D9C8]'
                    }`}
                  >
                    <span>{isCopied ? '✓' : '📄'}</span>
                    <span>{isCopied ? 'Texto copiado!' : 'Copiar texto'}</span>
                  </button>
                </div>

                {/* Caixa do texto pronto */}
                <div className="bg-[#FAF8F3] border border-[#E8DFC9] rounded-xl p-4 font-mono text-xs sm:text-sm text-[#2E2519] whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto select-all shadow-inner">
                  {modelo.texto}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
