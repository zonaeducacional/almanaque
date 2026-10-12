import React, { useState } from 'react';
import rawData from '../data/conversandoMaquinasData.json';
import { ConversandoMaquinasData } from '../types/conversandoMaquinas';

const data = rawData as ConversandoMaquinasData;

interface ConversandoMaquinasViewProps {
  onBack: () => void;
}

export const ConversandoMaquinasView: React.FC<ConversandoMaquinasViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'verbetes' | 'exercicio'>('verbetes');
  const [expandedId, setExpandedId] = useState<string | null>(data.verbetes[0]?.id || null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const { exercicio } = data;
  const chosenOption = exercicio.opcoesDeErro.find((op) => op.id === selectedOptionId);

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
          6 verbetes • 1 mini-exercício
        </span>
      </div>

      {/* Título e Lema da Seção */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF3E8] border border-[#CCDDC6] text-[#2C6237] text-xs font-mono font-medium mb-2.5">
          <span>🤖 Sabedoria Técnica Solarpunk</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E3022] tracking-tight">
          {data.secaoInfo.titulo}
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-[#61705D] font-sans leading-relaxed">
          {data.secaoInfo.subtitulo}
        </p>
        <div className="mt-3 p-3 bg-[#FCFAF5] border-l-2 border-[#D4A373] text-xs sm:text-sm text-[#4E4133] italic">
          “{data.secaoInfo.lema}”
        </div>
      </div>

      {/* Alternância de Abas: Verbetes vs Mini-exercício */}
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
          📖 Os 6 Verbetes de Critério
        </button>
        <button
          onClick={() => setActiveTab('exercicio')}
          type="button"
          className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
            activeTab === 'exercicio'
              ? 'bg-[#FFFFFF] text-[#1E3022] shadow-sm font-bold'
              : 'text-[#6D7A69] hover:text-[#233224]'
          }`}
        >
          🕵️ Mini-exercício: O Erro Oculto
        </button>
      </div>

      {/* Aba de Mini-exercício */}
      {activeTab === 'exercicio' ? (
        <div className="bg-[#FFFFFF] border border-[#E5DECD] rounded-2xl p-5 sm:p-7 shadow-sm">
          <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-[#F0EAE0]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B87D38]" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#735A3A]">
              Exercício Prático de Checagem
            </span>
          </div>

          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E3022] tracking-tight">
            {exercicio.titulo}
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-[#5B6857] leading-relaxed">
            {exercicio.contexto}
          </p>

          {/* Simulação de Pergunta e Resposta de IA */}
          <div className="my-5 space-y-3">
            {/* Pergunta do usuário */}
            <div className="bg-[#FAF6EE] border border-[#E8DEC8] rounded-xl p-3.5 text-xs sm:text-sm text-[#4E4133]">
              <span className="font-mono font-bold text-[#8C6228] block text-[11px] uppercase mb-1">
                Você perguntou à IA:
              </span>
              <p className="italic">“{exercicio.perguntaDoUsuario}”</p>
            </div>

            {/* Resposta gerada pela IA (com o erro oculto embutido) */}
            <div className="bg-[#FFFFFF] border border-[#D9CEBA] rounded-xl p-4 text-xs sm:text-sm text-[#261E16] leading-relaxed shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[#F2ECE0] text-[11px] font-mono text-[#788876]">
                <span>Resposta gerada pela máquina:</span>
                <span className="text-[#B87D38]">Tom persuasivo e formal</span>
              </div>
              <p>{exercicio.respostaDaIA}</p>
            </div>
          </div>

          {/* Pergunta interativa */}
          <div className="mt-6 pt-3 border-t border-[#F0EAE0]">
            <h3 className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-[#2E4F34] mb-3">
              Qual das informações abaixo é a invenção (alucinação) da máquina?
            </h3>

            <div className="flex flex-col gap-2.5">
              {exercicio.opcoesDeErro.map((opcao) => {
                const isSelected = selectedOptionId === opcao.id;
                return (
                  <button
                    key={opcao.id}
                    onClick={() => setSelectedOptionId(opcao.id)}
                    type="button"
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer ${
                      isSelected
                        ? opcao.ehOErroCorreto
                          ? 'bg-[#EBF5ED] border-[#2E6B39] text-[#1E4D27] font-semibold'
                          : 'bg-[#FCF4EE] border-[#C26B38] text-[#7A3616]'
                        : 'bg-[#FAF7F0] hover:bg-[#F2ECE0] border-[#E4DAC7] text-[#332A20]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>{opcao.trechoOuItem}</span>
                      {isSelected && (
                        <span>{opcao.ehOErroCorreto ? '✓ Acertou!' : '✕ Não é esse'}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explicação da Opção Selecionada */}
            {chosenOption && (
              <div
                className={`mt-4 p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                  chosenOption.ehOErroCorreto
                    ? 'bg-[#EAF5EC] border-[#BDE0C4] text-[#1F4F28]'
                    : 'bg-[#FCF4EE] border-[#F2D7C2] text-[#6E3516]'
                }`}
              >
                <div className="font-bold mb-1">
                  {chosenOption.ehOErroCorreto ? '🎯 Identificação certeira:' : '💡 Olhar atento:'}
                </div>
                <p>{chosenOption.explicacao}</p>
              </div>
            )}

            {/* Lição Final Pedagógica */}
            {chosenOption?.ehOErroCorreto && (
              <div className="mt-4 p-4 bg-[#FAF7F0] border border-[#E5DECD] rounded-xl text-xs sm:text-sm text-[#463B2F] leading-relaxed">
                <span className="font-mono font-bold text-[#8C6228] block mb-1">
                  ✦ Lição de discernimento:
                </span>
                <p>{exercicio.licaoFinal}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Lista dos 6 Verbetes */
        <div className="flex flex-col gap-4">
          {data.verbetes.map((verbete, index) => {
            const isExpanded = expandedId === verbete.id;

            return (
              <article
                key={verbete.id}
                className="bg-[#FFFFFF] border border-[#E5DECD] rounded-2xl p-5 sm:p-6 shadow-sm transition-all"
              >
                {/* Linha de cabeçalho do verbete */}
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

                {/* Conteúdo Expandido */}
                {isExpanded && (
                  <div className="mt-5 pt-4 border-t border-[#F0EAE0] space-y-4">
                    {/* O Problema */}
                    <div className="bg-[#FCF7F2] border border-[#EEDFCE] rounded-xl p-4">
                      <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#9E5320] flex items-center gap-1.5 mb-1.5">
                        <span>⚠️</span> O problema real
                      </span>
                      <p className="text-xs sm:text-sm text-[#4A3C2F] leading-relaxed">
                        {verbete.oProblema}
                      </p>
                    </div>

                    {/* O que está melhorando (Tom de esperança e evolução) */}
                    <div className="bg-[#F0F7F2] border border-[#CFE8D3] rounded-xl p-4">
                      <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#2D6638] flex items-center gap-1.5 mb-1.5">
                        <span>🌱</span> O que já está melhorando
                      </span>
                      <p className="text-xs sm:text-sm text-[#27402C] leading-relaxed">
                        {verbete.oQueEstaMelhorando}
                      </p>
                    </div>

                    {/* O que fazer */}
                    <div className="bg-[#FAF7F0] border border-[#E7DDCA] rounded-xl p-4">
                      <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#63513B] flex items-center gap-1.5 mb-2">
                        <span>🛡️</span> O que fazer na prática
                      </span>
                      <ul className="space-y-2 text-xs sm:text-sm text-[#3E3427]">
                        {verbete.oQueFazer.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-[#3E7D4C] font-bold">✓</span>
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Gesto Prático do Verbete */}
                    <div className="bg-[#F8F3E9] border-l-3 border-[#B57C3B] p-4 rounded-r-xl">
                      <div className="flex items-center justify-between gap-2 mb-1.5 text-xs font-mono">
                        <span className="uppercase font-bold text-[#8A5B22] flex items-center gap-1">
                          <span>🤲</span> Gesto do Verbete
                        </span>
                        <span className="text-[#887865] bg-[#EFE6D5] px-2 py-0.5 rounded">
                          {verbete.gestoPratico.tempo}
                        </span>
                      </div>
                      <h4 className="font-semibold text-xs sm:text-sm text-[#2C2318] mb-1">
                        {verbete.gestoPratico.titulo}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#4E4133] leading-relaxed">
                        {verbete.gestoPratico.acao}
                      </p>
                    </div>

                    {/* Fonte marcada */}
                    <div className="pt-2 text-[11px] text-[#7A8B78] flex items-center justify-between border-t border-[#F2ECE0]">
                      <span className="italic">Fonte: {verbete.fonte}</span>
                      <span className="text-[10px] font-mono uppercase bg-[#F2ECE0] px-1.5 py-0.5 rounded text-[#6E7B6C]">
                        Crítica Técnica
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
