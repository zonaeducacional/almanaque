import React, { useEffect, useState } from 'react';
import { getPastYearsMemories, PastYearMemory } from '../utils/notesStorage';

interface CardMemoriaAnteriorProps {
  dateIso: string;
  refreshKey?: number;
}

export const CardMemoriaAnterior: React.FC<CardMemoriaAnteriorProps> = ({
  dateIso,
  refreshKey = 0,
}) => {
  const [memories, setMemories] = useState<PastYearMemory[]>([]);

  useEffect(() => {
    let isMounted = true;
    getPastYearsMemories(dateIso).then((res) => {
      if (isMounted) {
        setMemories(res);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [dateIso, refreshKey]);

  if (memories.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-3">
      {memories.map((mem) => {
        const anosTexto = mem.yearsAgo === 1 ? 'Há 1 ano' : `Há ${mem.yearsAgo} anos`;

        return (
          <article
            key={mem.note.id}
            className="w-full bg-[#F5EFE1] border border-[#DECFBA] rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden"
          >
            {/* Faixa decorativa em ocre envelhecido / sépia */}
            <div className="absolute top-0 left-0 bottom-0 w-2 bg-[#9C6D34]" />

            <div className="pl-2 sm:pl-3">
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#EADCC6] text-[#7A4E1B] flex items-center justify-center font-bold text-xs">
                    ⏳
                  </span>
                  <span className="text-xs uppercase tracking-wider font-mono font-bold text-[#7A4E1B]">
                    {anosTexto} você anotou:
                  </span>
                </div>
                <span className="text-xs font-mono text-[#8C6D48] bg-[#EFE3CF] px-2 py-0.5 rounded border border-[#DFD1BD]">
                  Ano {mem.pastYear}
                </span>
              </div>

              {/* Conteúdo da anotação histórica */}
              <div className="mt-2 bg-[#FCF9F2] border border-[#E7D9C3] rounded-xl p-4 sm:p-5 relative">
                <span className="absolute top-2 left-2 text-2xl font-serif text-[#C5B398] select-none leading-none">
                  “
                </span>
                <p className="font-serif italic text-base sm:text-lg text-[#3A2E20] leading-relaxed pl-3 pr-2">
                  {mem.note.content}
                </p>
                <div className="mt-2 pt-2 border-t border-[#EFE5D3] flex items-center justify-between text-[11px] font-mono text-[#8F7C65]">
                  <span>Caderno de Margem de {mem.pastYear}</span>
                  <span>Memória recuperada</span>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};
