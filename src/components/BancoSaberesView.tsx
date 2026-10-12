import React, { useState, useEffect, useRef } from 'react';
import { SaberItem, TipoSaber } from '../types/colaborativo';
import {
  deleteSaber,
  exportColaborativoAsJson,
  getAllSaberes,
  importColaborativoFromJson,
  saveSaber,
  updateSaber,
} from '../utils/colaborativoStorage';

interface BancoSaberesViewProps {
  onBack: () => void;
}

export const BancoSaberesView: React.FC<BancoSaberesViewProps> = ({ onBack }) => {
  const [saberes, setSaberes] = useState<SaberItem[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [detailItem, setDetailItem] = useState<SaberItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<SaberItem | null>(null);

  // Campos do formulário
  const [formTitulo, setFormTitulo] = useState<string>('');
  const [formQuemEnsinou, setFormQuemEnsinou] = useState<string>('');
  const [formGeracao, setFormGeracao] = useState<string>('');
  const [formTipo, setFormTipo] = useState<TipoSaber>('receita');
  const [formTexto, setFormTexto] = useState<string>('');
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadData = async () => {
    const list = await getAllSaberes();
    setSaberes(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3500);
  };

  const handleOpenNewForm = () => {
    setEditingItem(null);
    setFormTitulo('');
    setFormQuemEnsinou('');
    setFormGeracao('');
    setFormTipo('receita');
    setFormTexto('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: SaberItem) => {
    setEditingItem(item);
    setFormTitulo(item.titulo);
    setFormQuemEnsinou(item.quemEnsinou);
    setFormGeracao(item.geracao);
    setFormTipo(item.tipo);
    setFormTexto(item.texto);
    setIsFormOpen(true);
    setDetailItem(null);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitulo.trim() || !formTexto.trim()) {
      showToast('Por favor, preencha o título e o texto do saber.');
      return;
    }

    if (editingItem) {
      await updateSaber(editingItem.id, {
        titulo: formTitulo.trim(),
        quemEnsinou: formQuemEnsinou.trim() || 'Tradição comunitária',
        geracao: formGeracao.trim() || 'Ancestral',
        tipo: formTipo,
        texto: formTexto.trim(),
      });
      showToast('Saber atualizado com sucesso!');
    } else {
      await saveSaber({
        titulo: formTitulo.trim(),
        quemEnsinou: formQuemEnsinou.trim() || 'Tradição comunitária',
        geracao: formGeracao.trim() || 'Ancestral',
        tipo: formTipo,
        texto: formTexto.trim(),
      });
      showToast('Novo saber registrado no aparelho!');
    }

    setIsFormOpen(false);
    await loadData();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja apagar este saber da sua memória local?')) {
      await deleteSaber(id);
      if (detailItem?.id === id) {
        setDetailItem(null);
      }
      await loadData();
      showToast('Saber apagado do dispositivo.');
    }
  };

  const handleExport = async () => {
    const jsonStr = await exportColaborativoAsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyber-almanaque-saberes-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Arquivo JSON baixado para circular entre aparelhos.');
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const res = await importColaborativoFromJson(text);
      if (res.success) {
        await loadData();
        showToast(`${res.saberesCount} saberes e ${res.problemasCount} ideias importados!`);
      } else {
        showToast(res.error || 'Erro ao importar arquivo.');
      }
    } catch {
      showToast('Arquivo JSON inválido.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const tiposDisponiveis = ['todos', 'ofício', 'receita', 'causo', 'remédio de quintal'];

  const filteredSaberes =
    filtroTipo === 'todos'
      ? saberes
      : saberes.filter((s) => s.tipo === filtroTipo);

  const getTipoIcone = (tipo: TipoSaber) => {
    switch (tipo) {
      case 'receita':
        return '🍲';
      case 'ofício':
        return '🔨';
      case 'remédio de quintal':
        return '🌿';
      case 'causo':
        return '📜';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-4 pb-24">
      {/* Botão de retorno e cabeçalho */}
      <div className="mb-6 flex items-center justify-between gap-3 border-b border-[#E8DFD0] pb-4">
        <button
          onClick={detailItem ? () => setDetailItem(null) : onBack}
          type="button"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#2F6139] hover:text-[#1E3F20] bg-[#FAF6ED] hover:bg-[#F2EBDC] px-3.5 py-2 rounded-xl border border-[#E5DECD] transition-all cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>{detailItem ? 'Voltar à lista de saberes' : 'Voltar às Seções'}</span>
        </button>

        <span className="text-xs font-mono text-[#7D8B7A] bg-[#F2ECE0] px-3 py-1 rounded-full">
          {saberes.length} saberes no aparelho
        </span>
      </div>

      {/* Título da Seção */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF3E8] border border-[#CCDDC6] text-[#2C6237] text-xs font-mono font-medium mb-2.5">
          <span>🌾 Sabedoria Oral e Popular</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E3022] tracking-tight">
          Banco de saberes
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-[#61705D] font-sans leading-relaxed">
          Guarde e compartilhe o que os mais velhos, os vizinhos e os mestres de ofício ensinaram. Tudo fica salvo localmente no seu aparelho.
        </p>
      </div>

      {/* AVISO EXPLÍCITO SOBRE REMÉDIOS DE QUINTAL */}
      <div className="mb-6 p-4 rounded-xl border border-[#E8D4B4] bg-[#FCF8EE] text-xs sm:text-sm text-[#5B3E19] flex items-start gap-3">
        <span className="text-xl shrink-0 mt-0.5">⚠️</span>
        <div className="leading-relaxed">
          <strong className="block font-semibold text-[#442D11] mb-0.5">
            Aviso de cuidado e saúde comunitária:
          </strong>
          Remédios de quintal, garrafadas e chás caseiros são patrimônio vivo da cultura popular e do carinho das famílias. Eles <strong>não substituem diagnóstico médico, medicamentos prescritos nem atendimento em postos de saúde ou hospitais</strong>. Em caso de dores fortes, febres persistentes ou dúvidas, procure sempre um profissional de saúde.
        </div>
      </div>

      {/* Notificação Toast */}
      {toastNotice && (
        <div className="mb-5 p-3 rounded-xl border border-[#CDE5D2] bg-[#EBF5ED] text-[#20572C] text-xs font-mono flex items-center gap-2">
          <span>✓</span>
          <span>{toastNotice}</span>
        </div>
      )}

      {/* Detalhe de um Saber Selecionado */}
      {detailItem ? (
        <article className="bg-[#FFFFFF] border border-[#E5DECD] rounded-2xl p-5 sm:p-7 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#F0EAE0]">
            <span className="text-xs font-mono uppercase tracking-wider text-[#8A5F22] bg-[#FAF3E8] border border-[#EDE1CE] px-2.5 py-1 rounded-full flex items-center gap-1.5 font-bold">
              <span>{getTipoIcone(detailItem.tipo)}</span>
              <span>{detailItem.tipo}</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenEdit(detailItem)}
                type="button"
                className="text-xs font-mono text-[#526451] hover:text-[#1E3022] hover:bg-[#F4EFE3] px-2.5 py-1 rounded-lg border border-[#E5DECD] transition-colors cursor-pointer"
              >
                ✎ Editar
              </button>
              <button
                onClick={() => handleDelete(detailItem.id)}
                type="button"
                className="text-xs font-mono text-[#A84B4B] hover:text-[#802222] hover:bg-[#FDF0F0] px-2.5 py-1 rounded-lg border border-[#EED0D0] transition-colors cursor-pointer"
              >
                ✕ Apagar
              </button>
            </div>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#231D16] tracking-tight">
            {detailItem.titulo}
          </h2>

          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#705F4A] bg-[#FCFAF5] p-3 rounded-xl border border-[#EDE2CE]">
            <div>
              <span className="font-semibold text-[#3D3326]">Quem ensinou: </span>
              <span>{detailItem.quemEnsinou}</span>
            </div>
            <span>•</span>
            <div>
              <span className="font-semibold text-[#3D3326]">Geração: </span>
              <span className="italic">{detailItem.geracao}</span>
            </div>
          </div>

          {/* Texto do saber em tipografia serifada de leitura de livro */}
          <div className="bg-[#FAF7F0] border border-[#EDE4D5] rounded-xl p-5 sm:p-7 shadow-inner">
            <p className="font-serif text-base sm:text-lg text-[#2E251B] whitespace-pre-line leading-[1.85]">
              {detailItem.texto}
            </p>
          </div>
        </article>
      ) : isFormOpen ? (
        /* Formulário de Cadastro / Edição */
        <form
          onSubmit={handleSubmitForm}
          className="bg-[#FFFFFF] border border-[#E5DECD] rounded-2xl p-5 sm:p-7 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE0]">
            <h2 className="font-serif text-xl font-bold text-[#1E3022]">
              {editingItem ? 'Editar saber' : 'Cadastrar novo saber'}
            </h2>
            <button
              onClick={() => setIsFormOpen(false)}
              type="button"
              className="text-xs font-mono text-[#7D8B7A] hover:text-[#2E3C2F] cursor-pointer"
            >
              Cancelar ✕
            </button>
          </div>

          <div>
            <label className="text-xs font-mono font-semibold uppercase text-[#6E7B6C] block mb-1">
              Título do saber:
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Chá de casca de romã para garganta"
              value={formTitulo}
              onChange={(e) => setFormTitulo(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#E2D8C6] bg-[#FCFAF5] font-serif text-sm sm:text-base focus:outline-none focus:border-[#2E5E37]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-mono font-semibold uppercase text-[#6E7B6C] block mb-1">
                Tipo do saber:
              </label>
              <select
                value={formTipo}
                onChange={(e) => setFormTipo(e.target.value as TipoSaber)}
                className="w-full p-2.5 rounded-xl border border-[#E2D8C6] bg-[#FCFAF5] text-xs sm:text-sm font-sans focus:outline-none focus:border-[#2E5E37]"
              >
                <option value="receita">🍲 Receita tradicional</option>
                <option value="ofício">🔨 Ofício ou técnica</option>
                <option value="remédio de quintal">🌿 Remédio de quintal</option>
                <option value="causo">📜 Causo ou história</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono font-semibold uppercase text-[#6E7B6C] block mb-1">
                Quem ensinou:
              </label>
              <input
                type="text"
                placeholder="Ex: Vó Dita, Mestre Zé"
                value={formQuemEnsinou}
                onChange={(e) => setFormQuemEnsinou(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E2D8C6] bg-[#FCFAF5] text-xs sm:text-sm font-sans focus:outline-none focus:border-[#2E5E37]"
              />
            </div>

            <div>
              <label className="text-xs font-mono font-semibold uppercase text-[#6E7B6C] block mb-1">
                Geração / Origem:
              </label>
              <input
                type="text"
                placeholder="Ex: Avós, Sertão baiano"
                value={formGeracao}
                onChange={(e) => setFormGeracao(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E2D8C6] bg-[#FCFAF5] text-xs sm:text-sm font-sans focus:outline-none focus:border-[#2E5E37]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono font-semibold uppercase text-[#6E7B6C] block mb-1">
              O saber por extenso (ingredientes, modo de fazer, técnica ou narrativa):
            </label>
            <textarea
              required
              rows={5}
              placeholder="Descreva com calma os ingredientes, as medidas e o segredo que faz funcionar..."
              value={formTexto}
              onChange={(e) => setFormTexto(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-[#E2D8C6] bg-[#FCFAF5] font-serif text-sm sm:text-base leading-relaxed focus:outline-none focus:border-[#2E5E37]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setIsFormOpen(false)}
              type="button"
              className="px-4 py-2 rounded-xl text-xs font-mono text-[#6A7866] hover:bg-[#F2ECE0] border border-[#E5DECD] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold bg-[#2E5E37] text-white hover:bg-[#254C2D] cursor-pointer shadow-sm"
            >
              {editingItem ? 'Salvar alterações' : 'Guardar saber no aparelho'}
            </button>
          </div>
        </form>
      ) : (
        /* Lista de Saberes */
        <div className="space-y-5">
          {/* Barra de Ações: Cadastrar + Exportar/Importar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FFFFFF] p-3.5 rounded-2xl border border-[#E5DECD] shadow-sm">
            <button
              onClick={handleOpenNewForm}
              type="button"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E5E37] hover:bg-[#254C2D] text-white text-xs font-mono font-bold shadow-sm transition-all cursor-pointer"
            >
              <span>+</span>
              <span>Cadastrar um saber</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                type="button"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono bg-[#FAF6ED] hover:bg-[#F2EBDC] text-[#2C3E2D] border border-[#E2D9C8] transition-colors cursor-pointer"
                title="Exportar todos os saberes em arquivo JSON"
              >
                <span>💾</span>
                <span>Exportar JSON</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                type="button"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono bg-[#FAF6ED] hover:bg-[#F2EBDC] text-[#2C3E2D] border border-[#E2D9C8] transition-colors cursor-pointer"
                title="Importar saberes de outro aparelho"
              >
                <span>📥</span>
                <span>Importar JSON</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleImportFile}
                className="hidden"
              />
            </div>
          </div>

          {/* Filtro de Categorias */}
          <div className="flex flex-wrap items-center gap-1.5 pb-1">
            {tiposDisponiveis.map((tipo) => (
              <button
                key={tipo}
                onClick={() => setFiltroTipo(tipo)}
                type="button"
                className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all cursor-pointer capitalize ${
                  filtroTipo === tipo
                    ? 'bg-[#2E5E37] text-white border-[#2E5E37] font-semibold'
                    : 'bg-[#FAF6ED] text-[#4F5E4E] border-[#E2D8C6] hover:bg-[#F2ECE0]'
                }`}
              >
                {tipo === 'todos' ? 'Todos os saberes' : tipo}
              </button>
            ))}
          </div>

          {/* Grade de Saberes Cadastrados */}
          {filteredSaberes.length === 0 ? (
            <div className="p-8 text-center bg-[#FFFFFF] border border-[#E6DECF] rounded-2xl">
              <span className="text-3xl block mb-2">🌾</span>
              <p className="text-sm font-serif text-[#463D31]">
                Nenhum saber encontrado nesta categoria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredSaberes.map((saber) => (
                <article
                  key={saber.id}
                  onClick={() => setDetailItem(saber)}
                  className="bg-[#FFFFFF] border border-[#E4DAC7] hover:border-[#33683D] p-5 rounded-2xl shadow-sm transition-all cursor-pointer flex flex-col justify-between hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-xs font-mono text-[#8C6228] bg-[#FAF3E8] px-2.5 py-0.5 rounded-full border border-[#EFE2CF] capitalize font-medium">
                        {getTipoIcone(saber.tipo)} {saber.tipo}
                      </span>
                      <span className="text-[11px] font-mono text-[#8C7A65]">
                        {saber.geracao}
                      </span>
                    </div>

                    <h2 className="font-serif text-lg font-bold text-[#231D16] leading-snug line-clamp-2">
                      {saber.titulo}
                    </h2>

                    <p className="mt-2 text-xs sm:text-sm text-[#5C4F40] line-clamp-3 leading-relaxed">
                      {saber.texto}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F2ECE0] flex items-center justify-between text-xs font-mono text-[#7D8B7A]">
                    <span>Por: {saber.quemEnsinou}</span>
                    <span className="text-[#2F6139] font-bold">Ler saber →</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
