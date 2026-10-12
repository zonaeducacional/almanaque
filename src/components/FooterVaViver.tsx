import React from 'react';

interface FooterVaViverProps {
  onReplayIntro?: () => void;
}

export const FooterVaViver: React.FC<FooterVaViverProps> = ({ onReplayIntro }) => {
  return (
    <footer className="w-full mt-10 mb-8 pt-8 pb-12 border-t-2 border-dashed border-[#DDD5C3] text-center flex flex-col items-center">
      {/* Selo vetorial Solarpunk de finalização */}
      <div className="w-14 h-14 rounded-full bg-[#EBF3E8] border border-[#CCDDC6] flex items-center justify-center text-[#2F6139] mb-4 shadow-sm">
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Folha e relógio de sol entrelaçados */}
          <path d="M12 2a10 10 0 1 0 10 10" />
          <path d="M12 6v6l4 2" />
          <path d="M18 4a3 3 0 0 0-3 3c0 2 3 5 3 5s3-3 3-5a3 3 0 0 0-3-3z" fill="#4B8356" stroke="none" />
        </svg>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF3E8] border border-[#ECDDC6] text-[#A66C2C] text-xs font-mono font-medium mb-3">
        <span>● O princípio anti-feed</span>
      </div>

      {/* A frase central de encerramento */}
      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2E1F] tracking-tight max-w-md">
        Você leu tudo por hoje.
        <span className="block text-[#A35D22] mt-1">Vá viver.</span>
      </h3>

      <p className="mt-3 text-sm sm:text-base text-[#5E6D5B] max-w-md leading-relaxed px-4">
        Não há mais nada para puxar ou atualizar. Feche a aba, guarde o aparelho no bolso e sinta o ar do dia.
      </p>

      {/* Linha discreta de ações secundárias */}
      <div className="mt-8 pt-6 border-t border-[#EAE3D2] w-full max-w-sm flex items-center justify-center gap-4 text-xs font-mono text-[#7D8B7A]">
        {onReplayIntro && (
          <button
            onClick={onReplayIntro}
            type="button"
            className="inline-flex items-center gap-1.5 hover:text-[#1E2E1F] transition-colors py-1 px-2 rounded hover:bg-[#EFE9DC] cursor-pointer"
          >
            <span>↺ Rever tela inicial</span>
          </button>
        )}
        <span>•</span>
        <span>Cyber Almanaque</span>
      </div>
    </footer>
  );
};
