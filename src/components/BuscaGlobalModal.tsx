import React, { useState, useEffect, useRef } from 'react';
import { GrupoBusca, performGlobalSearch, SearchResultItem } from '../utils/searchEngine';

interface BuscaGlobalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (linkTarget: SearchResultItem['linkTarget']) => void;
}

export const BuscaGlobalModal: React.FC<BuscaGlobalModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<{
    total: number;
    agrupados: Record<GrupoBusca, SearchResultItem[]>;
  }>({
    total: 0,
    agrupados: {
      'Dias do Almanaque': [],
      'Seções Temáticas': [],
      'Notas de Margem': [],
      'Banco de Saberes': [],
      'Laboratório de Ideias': [],
    },
  });
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults({
        total: 0,
        agrupados: {
          'Dias do Almanaque': [],
          'Seções Temáticas': [],
          'Notas de Margem': [],
          'Banco de Saberes': [],
          'Laboratório de Ideias': [],
        },
      });
    }
  }, [isOpen]);

  // Tecla ESC para fechar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Busca debounced
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsSearching(true);
        const res = await performGlobalSearch(query);
        setResults(res);
        setIsSearching(false);
      } else {
        setResults({
          total: 0,
          agrupados: {
            'Dias do Almanaque': [],
            'Seções Temáticas': [],
            'Notas de Margem': [],
            'Banco de Saberes': [],
            'Laboratório de Ideias': [],
          },
        });
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  // Realce do termo pesquisado
  const highlightTerm = (text: string, term: string) => {
    if (!term.trim()) return text;
    const parts = text.split(new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <mark
          key={i}
          className="bg-[#E4D1B5] dark:bg-[#785C35] text-[#222E1F] dark:text-[#F3EDE2] font-semibold rounded px-0.5"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const gruposOrder: GrupoBusca[] = [
    'Dias do Almanaque',
    'Seções Temáticas',
    'Banco de Saberes',
    'Laboratório de Ideias',
    'Notas de Margem',
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Busca global no Cyber Almanaque"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="w-full max-w-2xl bg-[#FFFFFF] dark:bg-[#18231A] border border-[#E5DECD] dark:border-[#2C3C2E] rounded-2xl shadow-2xl overflow-hidden mt-6 sm:mt-12 flex flex-col max-h-[85vh]">
        {/* Cabeçalho da busca com input */}
        <div className="p-4 sm:p-5 border-b border-[#EFE8D8] dark:border-[#2C3C2E] flex items-center gap-3">
          <span className="text-xl text-[#788876] dark:text-[#A0B09E]">🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar no almanaque, seções, notas, saberes e ideias..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-base sm:text-lg text-[#202921] dark:text-[#EAE5D9] placeholder-[#8C988A] dark:placeholder-[#6E7B6C] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              type="button"
              className="text-xs font-mono text-[#8C988A] hover:text-[#202921] dark:hover:text-white p-1 cursor-pointer"
            >
              Limpar ✕
            </button>
          )}
          <button
            onClick={onClose}
            type="button"
            className="text-xs font-mono bg-[#FAF6ED] dark:bg-[#202D22] text-[#4E5E4C] dark:text-[#C5D5C3] px-2.5 py-1.5 rounded-lg border border-[#E2D8C6] dark:border-[#334435] hover:bg-[#F2ECE0] cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Resultados da busca agrupados */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {query.trim().length < 2 ? (
            <div className="text-center py-10 text-xs sm:text-sm text-[#7D8C7A] dark:text-[#8F9F8D] font-mono">
              <span className="text-2xl block mb-2">⚡</span>
              Digite pelo menos 2 letras para pesquisar offline em todo o almanaque.
            </div>
          ) : results.total === 0 && !isSearching ? (
            <div className="text-center py-12 text-sm text-[#7D8C7A] dark:text-[#8F9F8D]">
              <span className="text-3xl block mb-2">🍃</span>
              Nenhum resultado encontrado para &ldquo;{query}&rdquo;.
            </div>
          ) : (
            gruposOrder.map((grupo) => {
              const itens = results.agrupados[grupo] || [];
              if (itens.length === 0) return null;

              return (
                <div key={grupo} className="space-y-2.5">
                  <div className="flex items-center justify-between pb-1 border-b border-[#F2ECE0] dark:border-[#28382A]">
                    <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#2E5E37] dark:text-[#85B88E]">
                      {grupo} ({itens.length})
                    </span>
                  </div>

                  <div className="space-y-2">
                    {itens.map((item) => (
                      <article
                        key={item.id}
                        onClick={() => {
                          onNavigate(item.linkTarget);
                          onClose();
                        }}
                        className="p-3.5 rounded-xl border border-[#EDE4D5] dark:border-[#2C3D2E] hover:border-[#2E5E37] dark:hover:border-[#52875C] bg-[#FCFAF5] dark:bg-[#1C281F] hover:bg-[#F7F2E6] dark:hover:bg-[#223326] transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="font-serif font-bold text-sm sm:text-base text-[#202921] dark:text-[#EAE5D9] group-hover:text-[#2E5E37] dark:group-hover:text-[#85B88E] transition-colors">
                            {highlightTerm(item.titulo, query)}
                          </h3>
                          <span className="text-[10px] font-mono text-[#7D8C7A] dark:text-[#8A9B87] shrink-0 bg-[#EFE8D8] dark:bg-[#27382B] px-2 py-0.5 rounded">
                            {item.categoria}
                          </span>
                        </div>
                        <p className="text-xs text-[#5C6B59] dark:text-[#A6B7A4] leading-relaxed line-clamp-2">
                          {highlightTerm(item.conteudoSnippet, query)}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Rodapé do Modal */}
        <div className="p-3 bg-[#FAF7F0] dark:bg-[#141E16] border-t border-[#EFE8D8] dark:border-[#2C3C2E] flex items-center justify-between text-[11px] font-mono text-[#7D8C7A] dark:text-[#8E9F8C] px-5">
          <span>{results.total} resultados encontrados</span>
          <span>Motor MiniSearch 100% Offline</span>
        </div>
      </div>
    </div>
  );
};
