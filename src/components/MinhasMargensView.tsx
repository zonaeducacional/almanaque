import React, { useEffect, useState, useRef } from 'react';
import {
  deleteMarginNote,
  exportNotesAsJson,
  getAllMarginNotes,
  importNotesFromJson,
  MarginNote,
  updateMarginNote,
} from '../utils/notesStorage';

interface MinhasMargensViewProps {
  onClose: () => void;
  onNavigateToDate?: (dateIso: string) => void;
}

export const MinhasMargensView: React.FC<MinhasMargensViewProps> = ({
  onClose,
  onNavigateToDate,
}) => {
  const [notes, setNotes] = useState<MarginNote[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadNotes = async () => {
    const list = await getAllMarginNotes();
    setNotes(list);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleStartEdit = (note: MarginNote) => {
    setEditingId(note.id);
    setEditText(note.content);
    setConfirmDeleteId(null);
  };

  const handleSaveEdit = async (id: string) => {
    await updateMarginNote(id, editText);
    setEditingId(null);
    setEditText('');
    await loadNotes();
    showToast('Nota atualizada com sucesso.', 'success');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleDelete = async (id: string) => {
    await deleteMarginNote(id);
    setConfirmDeleteId(null);
    await loadNotes();
    showToast('Nota apagada da memória local.', 'success');
  };

  const showToast = (text: string, type: 'success' | 'error') => {
    setStatusMessage({ text, type });
    setTimeout(() => {
      setStatusMessage(null);
    }, 3500);
  };

  // Exportar notas para JSON
  const handleExport = async () => {
    try {
      const jsonStr = await exportNotesAsJson();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `cyber-almanaque-margens-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Arquivo JSON gerado e baixado.', 'success');
    } catch (err: any) {
      showToast('Erro ao exportar notas.', 'error');
    }
  };

  // Importar notas de arquivo JSON
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const res = await importNotesFromJson(text);
      if (res.success) {
        await loadNotes();
        showToast(`${res.count} notas importadas com sucesso!`, 'success');
      } else {
        showToast(res.error || 'Falha ao importar JSON.', 'error');
      }
    } catch (err: any) {
      showToast('Arquivo inválido ou corrompido.', 'error');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Formata data ISO para texto legível em português
  const formatDateTitle = (dateIso: string) => {
    const [year, month, day] = dateIso.split('-').map(Number);
    const date = new Date(year, month - 1, day, 12, 0, 0);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-4 pb-14">
      {/* Botão de retorno e cabeçalho da tela */}
      <div className="mb-6 flex items-center justify-between gap-3 border-b border-[#E8DFD0] pb-4">
        <button
          onClick={onClose}
          type="button"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#2F6139] hover:text-[#1E3F20] bg-[#FAF6ED] hover:bg-[#F2EBDC] px-3.5 py-2 rounded-xl border border-[#E5DECD] transition-all cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Voltar ao Almanaque</span>
        </button>

        <span className="text-xs font-mono text-[#7D8B7A] bg-[#F2ECE0] px-3 py-1 rounded-full">
          {notes.length} {notes.length === 1 ? 'nota salva' : 'notas salvas'}
        </span>
      </div>

      {/* Título e Propósito */}
      <div className="mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E3022] tracking-tight">
          Minhas Margens
        </h1>
        <p className="mt-1 text-sm text-[#667562] font-sans leading-relaxed">
          O conjunto de todas as suas reflexões breves escritas nas bordas do almanaque. Tudo fica gravado exclusivamente no navegador deste aparelho.
        </p>
      </div>

      {/* Mensagem Toast */}
      {statusMessage && (
        <div
          className={`mb-5 p-3.5 rounded-xl border text-sm font-mono flex items-center gap-2 transition-all ${
            statusMessage.type === 'success'
              ? 'bg-[#EBF5ED] border-[#C3E4C9] text-[#255C32]'
              : 'bg-[#FBEBEB] border-[#F2C3C3] text-[#932A2A]'
          }`}
        >
          <span>{statusMessage.type === 'success' ? '✓' : '⚠'}</span>
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Barra de Ações: Exportar e Importar JSON */}
      <div className="mb-6 p-4 bg-[#FFFFFF] border border-[#E4DC CB] rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono text-[#6A7866]">
          <span className="w-2 h-2 rounded-full bg-[#3B7247]" />
          <span>Backup Local & Portabilidade</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Botão Exportar */}
          <button
            onClick={handleExport}
            type="button"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-medium bg-[#FAF6ED] hover:bg-[#F2EBDC] text-[#2C3E2D] border border-[#E2D9C8] transition-colors cursor-pointer"
            title="Baixar todas as notas em formato JSON"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Exportar (JSON)</span>
          </button>

          {/* Botão Importar */}
          <button
            onClick={() => fileInputRef.current?.click()}
            type="button"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-medium bg-[#FAF6ED] hover:bg-[#F2EBDC] text-[#2C3E2D] border border-[#E2D9C8] transition-colors cursor-pointer"
            title="Importar notas a partir de arquivo JSON"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span>Importar (JSON)</span>
          </button>

          {/* Input de arquivo invisível */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Lista de notas: da mais recente para a mais antiga */}
      {notes.length === 0 ? (
        <div className="p-8 sm:p-12 text-center bg-[#FFFFFF] border border-[#E6DECF] rounded-2xl shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#FAF4E8] text-[#9E6D34] mx-auto flex items-center justify-center text-xl mb-3">
            📖
          </div>
          <h3 className="font-serif text-lg font-semibold text-[#253227]">
            Nenhuma margem anotada ainda
          </h3>
          <p className="mt-1.5 text-sm text-[#738271] max-w-sm mx-auto">
            Navegue pelos dias do Cyber Almanaque e use o campo "Nota de margem" para deixar sua primeira marca.
          </p>
          <button
            onClick={onClose}
            type="button"
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-[#D4A373] text-[#141C15] font-semibold text-sm rounded-xl hover:bg-[#E0B589] cursor-pointer"
          >
            Ir para a leitura de hoje
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {notes.map((note) => {
            const isEditing = editingId === note.id;
            const isConfirmingDelete = confirmDeleteId === note.id;

            return (
              <article
                key={note.id}
                className="bg-[#FFFFFF] border border-[#E4DAC7] rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden transition-all"
              >
                {/* Linha guia de margem vertical */}
                <div className="absolute top-0 left-0 bottom-0 w-2 bg-[#C99A5E]" />

                <div className="pl-2 sm:pl-3">
                  {/* Cabeçalho da nota */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-[#F2ECE0]">
                    <div>
                      <span className="font-serif font-bold text-base text-[#1E2E20] block">
                        {formatDateTitle(note.dateIso)}
                      </span>
                      <span className="text-[11px] font-mono text-[#828F7F]">
                        {note.dateIso}
                      </span>
                    </div>

                    {/* Botões de Ação */}
                    {!isEditing && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStartEdit(note)}
                          type="button"
                          className="inline-flex items-center gap-1 text-xs font-mono text-[#526451] hover:text-[#1E3022] hover:bg-[#F4EFE3] px-2.5 py-1 rounded-lg border border-[#E5DECD] transition-colors cursor-pointer"
                          title="Editar nota"
                        >
                          ✎ Editar
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(note.id)}
                          type="button"
                          className="inline-flex items-center gap-1 text-xs font-mono text-[#A84B4B] hover:text-[#802222] hover:bg-[#FDF0F0] px-2.5 py-1 rounded-lg border border-[#EED0D0] transition-colors cursor-pointer"
                          title="Apagar nota"
                        >
                          ✕ Apagar
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Confirmação de exclusão */}
                  {isConfirmingDelete && (
                    <div className="mb-3 p-3 bg-[#FDF2F2] border border-[#F3CDCD] rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#8A2424]">
                      <span>Tem certeza que deseja apagar esta nota?</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDelete(note.id)}
                          type="button"
                          className="bg-[#A84B4B] text-white px-2.5 py-1 rounded font-medium hover:bg-[#8F3535] cursor-pointer"
                        >
                          Sim, apagar
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          type="button"
                          className="bg-[#EFE8E8] text-[#553333] px-2.5 py-1 rounded hover:bg-[#E3D8D8] cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Visualização ou Edição */}
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="relative rounded-xl border border-[#B5864C] bg-[#FCFBF7] p-3 sm:p-4">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={3}
                          className="w-full bg-transparent font-serif italic text-base sm:text-lg text-[#2E251B] leading-relaxed resize-y focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={handleCancelEdit}
                          type="button"
                          className="px-3.5 py-1.5 rounded-lg text-xs font-mono text-[#6A7866] hover:bg-[#F2ECE0] border border-[#E5DECD] cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleSaveEdit(note.id)}
                          type="button"
                          className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#2E5E37] text-white hover:bg-[#254C2D] cursor-pointer"
                        >
                          Salvar alterações
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#FAF7F0] border border-[#EFE7D8] rounded-xl p-4 sm:p-5">
                      <p className="font-serif italic text-base sm:text-lg text-[#2E251B] leading-relaxed whitespace-pre-line">
                        “{note.content}”
                      </p>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
