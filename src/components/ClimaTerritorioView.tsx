import React, { useState } from 'react';
import rawData from '../data/climaTerritorioData.json';
import { ClimaTerritorioData, EstacaoId, RegiaoId } from '../types/climaTerritorio';

const data = rawData as ClimaTerritorioData;

interface ClimaTerritorioViewProps {
  onBack: () => void;
}

export const ClimaTerritorioView: React.FC<ClimaTerritorioViewProps> = ({ onBack }) => {
  const [selectedRegiaoId, setSelectedRegiaoId] = useState<RegiaoId>('litoral');
  const [selectedEstacaoId, setSelectedEstacaoId] = useState<EstacaoId>('seca');

  const regiaoAtual = data.regioes.find((r) => r.id === selectedRegiaoId) || data.regioes[0];
  const estacaoAtual =
    regiaoAtual.estacoes.find((e) => e.estacaoId === selectedEstacaoId) || regiaoAtual.estacoes[0];

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
          3 biomas • 3 ciclos climáticos
        </span>
      </div>

      {/* Título e Lema da Seção */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF3E8] border border-[#CCDDC6] text-[#2C6237] text-xs font-mono font-medium mb-2.5">
          <span>🌦️ Sabedoria da Terra e das Águas</span>
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

      {/* 1. Seletor de Região / Território */}
      <div className="mb-6">
        <label className="text-xs font-mono uppercase tracking-wider text-[#6A7B68] font-semibold block mb-2">
          Escolha seu Território / Região:
        </label>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {data.regioes.map((regiao) => {
            const isSelected = regiao.id === selectedRegiaoId;
            return (
              <button
                key={regiao.id}
                onClick={() => setSelectedRegiaoId(regiao.id)}
                type="button"
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? 'bg-[#2E5E37] text-white border-[#2E5E37] shadow-sm font-semibold'
                    : 'bg-[#FFFFFF] hover:bg-[#F2ECE0] border-[#E2D8C6] text-[#364235]'
                }`}
              >
                <span className="text-xl sm:text-2xl">{regiao.icone}</span>
                <span className="text-xs font-sans leading-tight">
                  {regiao.nome.split(' ')[0]}
                </span>
                <span className={`text-[10px] font-mono opacity-80 hidden sm:block ${isSelected ? 'text-white' : 'text-[#7D8C7A]'}`}>
                  {regiao.bioma.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-[#7B8B79] italic text-center sm:text-left">
          {regiaoAtual.nome} • {regiaoAtual.bioma}: {regiaoAtual.descricaoCurta}
        </p>
      </div>

      {/* 2. Seletor de Ciclo / Estação Climática */}
      <div className="mb-6 p-1.5 bg-[#EFE9DC] rounded-xl flex items-center gap-1">
        <button
          onClick={() => setSelectedEstacaoId('seca')}
          type="button"
          className={`flex-1 py-2 px-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            selectedEstacaoId === 'seca'
              ? 'bg-[#FFFFFF] text-[#8C581E] shadow-sm font-bold'
              : 'text-[#6D7A69] hover:text-[#233224]'
          }`}
        >
          <span>🍂</span>
          <span>Estação Seca</span>
        </button>
        <button
          onClick={() => setSelectedEstacaoId('chuva')}
          type="button"
          className={`flex-1 py-2 px-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            selectedEstacaoId === 'chuva'
              ? 'bg-[#FFFFFF] text-[#2D5A6E] shadow-sm font-bold'
              : 'text-[#6D7A69] hover:text-[#233224]'
          }`}
        >
          <span>🌧️</span>
          <span>Tempo de Chuva</span>
        </button>
        <button
          onClick={() => setSelectedEstacaoId('calor_extremo')}
          type="button"
          className={`flex-1 py-2 px-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            selectedEstacaoId === 'calor_extremo'
              ? 'bg-[#FFFFFF] text-[#B83E1E] shadow-sm font-bold'
              : 'text-[#6D7A69] hover:text-[#233224]'
          }`}
        >
          <span>☀️</span>
          <span>Calor Extremo</span>
        </button>
      </div>

      {/* 3. Painel Detalhado da Estação Escolhida */}
      <article className="bg-[#FFFFFF] border border-[#E5DECD] rounded-2xl p-5 sm:p-7 shadow-sm space-y-5">
        {/* Cabeçalho da Estação */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#F0EAE0]">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-[#FAF4E8] text-[#8C6228] flex items-center justify-center font-bold text-2xl shrink-0">
              {estacaoAtual.icone}
            </span>
            <div>
              <span className="text-[11px] font-mono text-[#7D8B7A] uppercase tracking-wider font-semibold block">
                {regiaoAtual.nome}
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#231D16] tracking-tight">
                {estacaoAtual.tituloEstacao}
              </h2>
            </div>
          </div>
        </div>

        {/* O Que Esperar */}
        <div className="bg-[#FCFBF8] border border-[#EDE4D5] rounded-xl p-4">
          <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#735A3A] flex items-center gap-1.5 mb-1.5">
            <span>👁️</span> O que esperar deste período
          </span>
          <p className="text-xs sm:text-sm text-[#473B2C] leading-relaxed">
            {estacaoAtual.oQueEsperar}
          </p>
        </div>

        {/* O Que Plantar ou Cuidar */}
        <div className="bg-[#F2F7F2] border border-[#D5EAD7] rounded-xl p-4">
          <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#2D6638] flex items-center gap-1.5 mb-2">
            <span>🌱</span> O que plantar ou cuidar na terra
          </span>
          <ul className="space-y-2 text-xs sm:text-sm text-[#243F29]">
            {estacaoAtual.oQuePlantarOuCuidar.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#3A7E48] font-bold">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Como Economizar Água */}
        <div className="bg-[#F2F6F8] border border-[#D3E3EC] rounded-xl p-4">
          <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#2A5C74] flex items-center gap-1.5 mb-2">
            <span>💧</span> Como economizar e manejar a água
          </span>
          <ul className="space-y-2 text-xs sm:text-sm text-[#274453]">
            {estacaoAtual.comoEconomizarAgua.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#367999] font-bold">✓</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* O Que Fazer em Emergência (Enchente ou Seca Severa) */}
        <div className="bg-[#FAF3EB] border border-[#EBD6C1] rounded-xl p-4">
          <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#9E511D] flex items-center gap-1.5 mb-2">
            <span>⚠️</span> O que fazer em caso de enchente ou seca severa
          </span>
          <ul className="space-y-2 text-xs sm:text-sm text-[#4F3622]">
            {estacaoAtual.oQueFazerEmEmergencia.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#C26B33] font-bold">!</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* O Que Já Está Melhorando (Esperança e Ação Concreta) */}
        <div className="bg-[#F0F7F2] border border-[#CFE8D3] rounded-xl p-4">
          <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#2C6237] flex items-center gap-1.5 mb-1.5">
            <span>🌍</span> O que já está melhorando no território
          </span>
          <p className="text-xs sm:text-sm text-[#223E27] leading-relaxed">
            {estacaoAtual.oQueEstaMelhorando}
          </p>
        </div>

        {/* Gesto Prático da Estação */}
        <div className="bg-[#F8F3E9] border-l-3 border-[#3B7247] p-4 rounded-r-xl">
          <div className="flex items-center justify-between gap-2 mb-1.5 text-xs font-mono">
            <span className="uppercase font-bold text-[#2A5E35] flex items-center gap-1">
              <span>🤲</span> Gesto do Território
            </span>
            <span className="text-[#887865] bg-[#EFE6D5] px-2 py-0.5 rounded">
              {estacaoAtual.gestoPratico.tempo}
            </span>
          </div>
          <h4 className="font-semibold text-xs sm:text-sm text-[#261E14] mb-1">
            {estacaoAtual.gestoPratico.titulo}
          </h4>
          <p className="text-xs sm:text-sm text-[#46392B] leading-relaxed">
            {estacaoAtual.gestoPratico.acao}
          </p>
        </div>

        {/* Fonte com demarcação solicitada */}
        <div className="pt-2 text-[11px] text-[#7A8B78] flex items-center justify-between border-t border-[#F2ECE0]">
          <span className="italic">Fonte: {estacaoAtual.fonte}</span>
          <span className="text-[10px] font-mono uppercase bg-[#F2ECE0] px-1.5 py-0.5 rounded text-[#6E7B6C]">
            Agroecologia
          </span>
        </div>
      </article>
    </div>
  );
};
