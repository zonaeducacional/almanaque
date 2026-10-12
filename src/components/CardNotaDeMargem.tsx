import React, { useEffect, useState, useRef } from 'react';
import { getMarginNoteByDate, saveMarginNote } from '../utils/notesStorage';

interface CardNotaDeMargemProps {
  dateIso: string;
  dataExtenso: string;
  onNoteSaved?: () => void;
}

export const CardNotaDeMargem: React.FC<CardNotaDeMargemProps> = ({
  dateIso,
  dataExtenso,
  onNoteSaved,
}) => {
  const [content, setContent] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const debounceTimer = useRef<number | null>(null);
  const initialLoadedRef = useRef<boolean>(false);

  // Carrega a nota da data atual ao montar ou mudar de dia
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    initialLoadedRef.current = false;

    getMarginNoteByDate(dateIso).then((note) => {
      if (isMounted) {
        setContent(note?.content || '');
        setIsLoading(false);
        initialLoadedRef.current = true;
        setSaveStatus(note?.content ? 'saved' : 'idle');
      }
    });

    return () => {
      isMounted = false;
      if (debounceTimer.current) {
        window.clearTimeout(debounceTimer.current);
      }
    };
  }, [dateIso]);

  // Função para salvar automaticamente com debounce
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setContent(newText);

    if (!initialLoadedRef.current) return;

    setSaveStatus('saving');

    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = window.setTimeout(async () => {
      await saveMarginNote(dateIso, newText);
      setSaveStatus('saved');
      if (onNoteSaved) onNoteSaved();
    }, 600);
  };

  // Salva imediatamente ao sair do campo (blur)
  const handleBlur = async () => {
    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current);
    }
    setSaveStatus('saving');
    await saveMarginNote(dateIso, content);
    setSaveStatus(content.trim() ? 'saved' : 'idle');
    if (onNoteSaved) onNoteSaved();
  };

  return (
    <article className="w-full bg-[#FAF7F0] border border-[#E5DECD] rounded-2xl p-5 sm:p-7 shadow-sm relative overflow-hidden transition-all">
      {/* Detalhe estético: Margem de livro antigo com linha guia vertical em ocre terroso */}
      <div className="absolute top-0 left-0 bottom-0 w-2.5 bg-[#C99A5E]" />

      <div className="pl-3 sm:pl-4">
        {/* Cabeçalho da Margem */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#F1E8D8] text-[#8C6228] flex items-center justify-center font-bold text-xs">
              ✏️
            </span>
            <span className="text-xs uppercase tracking-wider font-mono font-semibold text-[#8C6228]">
              Nota de Margem
            </span>
          </div>

          {/* Indicador de Salvamento Automático Local */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#6A7866]">
            {saveStatus === 'saving' && (
              <span className="inline-flex items-center gap-1 text-[#A66C2C] animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A66C2C]" />
                Gravando na margem...
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="inline-flex items-center gap-1 text-[#33683D]">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Salvo no aparelho
              </span>
            )}
            {saveStatus === 'idle' && (
              <span className="text-[#8D8272] text-[11px]">
                Espaço livre para anotação
              </span>
            )}
          </div>
        </div>

        {/* Descrição sutil da intenção da margem */}
        <p className="text-xs text-[#7B6E5C] font-sans mb-3">
          Como nos velhos alfarrábios: anote uma impressão passageira deste dia. Fica guardado apenas na memória deste dispositivo.
        </p>

        {/* Campo com textura e tipografia de anotação de margem de livro */}
        <div className="relative rounded-xl border border-[#E4DAC7] bg-[#FCFBF7] shadow-inner p-3 sm:p-4 focus-within:border-[#B5864C] focus-within:ring-1 focus-within:ring-[#B5864C]/30 transition-all">
          {/* Linha guia decorativa clássica de margem */}
          <div className="absolute top-3 left-3 bottom-3 w-0.5 border-r border-dashed border-[#E5DAC6] pointer-events-none" />

          <textarea
            value={content}
            onChange={handleTextChange}
            onBlur={handleBlur}
            disabled={isLoading}
            rows={3}
            placeholder="Escreva aqui sua nota de margem... O clima na janela, uma conversa ou o que você quer recordar deste dia."
            className="w-full pl-3.5 bg-transparent font-serif italic text-base sm:text-lg text-[#2E251B] placeholder-[#9E9180] leading-relaxed resize-y focus:outline-none min-h-[90px]"
            aria-label="Nota de margem para este dia"
          />

          <div className="mt-2 pt-2 border-t border-[#F2ECE0] flex items-center justify-between text-[11px] font-mono text-[#8C7D6B]">
            <span>{content.trim().length} caracteres</span>
            <span>Diário do leitor • Local & Privado</span>
          </div>
        </div>
      </div>
    </article>
  );
};
