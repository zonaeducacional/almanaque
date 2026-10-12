import React, { useState, useEffect, useRef } from 'react';
import { PacoteAlmanaque } from '../types/pacotes';
import {
  alternarAtivacaoPacote,
  exportarPacoteComunitario,
  getPacotesInstalados,
  importarPacote,
  removerPacote,
  validarPacoteJson,
} from '../utils/pacotesManager';

interface EdicoesViewProps {
  onBack: () => void;
  onPacotesChanged: () => void;
}

export const EdicoesView: React.FC<EdicoesViewProps> = ({ onBack, onPacotesChanged }) => {
  const [pacotes, setPacotes] = useState<PacoteAlmanaque[]>([]);
  const [toastNotice, setToastNotice] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Campos do formulário de exportação comunitária
  const [exportNome, setExportNome] = useState<string>('Almanaque Comunitário de Bairro');
  const [exportAno, setExportAno] = useState<number>(2026);
  const [exportRegiao, setExportRegiao] = useState<string>('Minha Cidade / Região');
  const [exportAutoria, setExportAutoria] = useState<string>('Coletivo de Moradores e Estudantes');
  const [exportRotuloIa, setExportRotuloIa] = useState<string>('100% autoria humana comunitária');
  const [exportDescricao, setExportDescricao] = useState<string>(
    'Saberes de ofício, receitas de família e soluções comunitárias reunidas por moradores.'
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadData = () => {
    const list = getPacotesInstalados();
    setPacotes(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastNotice({ text, type });
    setTimeout(() => setToastNotice(null), 4000);
  };

  // Importar arquivo JSON
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportErrors([]);
    try {
      const text = await file.text();
      let parsed: any;
      try {
        parsed = JSON.parse(text);
      } catch {
        setImportErrors(['O arquivo selecionado não contém um JSON válido (erro de sintaxe).']);
        return;
      }

      const validacao = validarPacoteJson(parsed);
      if (!validacao.valido || !validacao.pacote) {
        setImportErrors(validacao.erros);
        showToast('Pacote rejeitado: o arquivo não atende ao formato exigido.', 'error');
        return;
      }

      const res = importarPacote(validacao.pacote);
      if (res.success) {
        loadData();
        onPacotesChanged();
        showToast(`Pacote "${validacao.pacote.nome}" importado e ativado com sucesso!`);
      } else {
        showToast(res.error || 'Erro ao importar pacote.', 'error');
      }
    } catch (err: any) {
      setImportErrors([`Erro inesperado ao ler arquivo: ${err?.message || 'Falha de leitura'}`]);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleToggleAtivo = (id: string, currentAtivo?: boolean) => {
    const novoStatus = !(currentAtivo !== false);
    alternarAtivacaoPacote(id, novoStatus);
    loadData();
    onPacotesChanged();
    showToast(novoStatus ? 'Pacote ativado no almanaque.' : 'Pacote desativado temporariamente.');
  };

  // Carregar pacote-exemplo.json diretamente para testes rápidos
  const handleCarregarExemplo = async () => {
    try {
      const res = await fetch('/pacote-exemplo.json');
      if (!res.ok) throw new Error('Falha ao buscar /pacote-exemplo.json');
      const data = await res.json();
      const validacao = validarPacoteJson(data);
      if (!validacao.valido || !validacao.pacote) {
        setImportErrors(validacao.erros);
        showToast('Pacote de exemplo não passou na validação.', 'error');
        return;
      }
      const r = importarPacote(validacao.pacote);
      if (r.success) {
        loadData();
        onPacotesChanged();
        showToast(`Pacote de exemplo "${validacao.pacote.nome}" instalado e ativado!`);
      } else {
        showToast(r.error || 'Erro ao importar.', 'error');
      }
    } catch {
      showToast('Selecione o arquivo "pacote-exemplo.json" no botão "Importar pacote" acima.', 'error');
    }
  };

  const handleRemover = (id: string, nome: string) => {
    if (window.confirm(`Deseja remover o pacote "${nome}" deste aparelho?`)) {
      const res = removerPacote(id);
      if (res.success) {
        loadData();
        onPacotesChanged();
        showToast(`Pacote "${nome}" removido com sucesso.`);
      } else {
        showToast(res.error || 'Não foi possível remover.', 'error');
      }
    }
  };

  const handleExportarComunitario = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const jsonStr = await exportarPacoteComunitario({
        nome: exportNome,
        ano: exportAno,
        regiao: exportRegiao,
        autoria: exportAutoria,
        rotulo_ia: exportRotuloIa,
        descricao: exportDescricao,
      });

      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const slug = exportNome.toLowerCase().replace(/[^a-z0-9]/g, '-');
      a.href = url;
      a.download = `pacote-${slug}-${exportAno}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setIsExportModalOpen(false);
      showToast('Almanaque Comunitário gerado em arquivo JSON pronto para circular!');
    } catch {
      showToast('Erro ao exportar pacote comunitário.', 'error');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-4 pb-24">
      {/* Botão de retorno e cabeçalho */}
      <div className="mb-6 flex items-center justify-between gap-3 border-b border-[#E8DFD0] dark:border-[#2C3C2E] pb-4">
        <button
          onClick={onBack}
          type="button"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#2F6139] dark:text-[#83B98C] hover:text-[#1E3F20] bg-[#FAF6ED] dark:bg-[#1C281F] px-3.5 py-2 rounded-xl border border-[#E5DECD] dark:border-[#2E3F30] transition-all cursor-pointer touch-target focus-visible:ring-2 focus-visible:ring-[#2E5E37]"
          aria-label="Voltar para a tela anterior"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Voltar</span>
        </button>

        <span className="text-xs font-mono text-[#7D8B7A] dark:text-[#8A9B87] bg-[#F2ECE0] dark:bg-[#1E2B21] px-3 py-1 rounded-full">
          {pacotes.length} {pacotes.length === 1 ? 'pacote instalado' : 'pacotes instalados'}
        </span>
      </div>

      {/* Título e Propósito */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF3E8] dark:bg-[#1B2B1E] border border-[#CCDDC6] dark:border-[#2B3E2F] text-[#2C6237] dark:text-[#7EB588] text-xs font-mono font-medium mb-2.5">
          <span>📦 Arquitetura Editorial Modular</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E3022] dark:text-[#EAE5D9] tracking-tight">
          Edições e Pacotes
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-[#61705D] dark:text-[#9DAE9A] font-sans leading-relaxed">
          Instale novas edições locais, ative ou desative conteúdos e exporte seus saberes para criar o almanaque comunitário da sua escola, vila ou bairro.
        </p>
      </div>

      {/* Notificação Toast */}
      {toastNotice && (
        <div
          className={`mb-5 p-3.5 rounded-xl border text-xs sm:text-sm font-mono flex items-center gap-2 ${
            toastNotice.type === 'success'
              ? 'bg-[#EBF5ED] dark:bg-[#1B2E20] border-[#C3E4C9] text-[#255C32] dark:text-[#8FD19C]'
              : 'bg-[#FDF0F0] dark:bg-[#2E1818] border-[#F2C4C4] text-[#8F2323] dark:text-[#EAA0A0]'
          }`}
        >
          <span>{toastNotice.type === 'success' ? '✓' : '⚠️'}</span>
          <span>{toastNotice.text}</span>
        </div>
      )}

      {/* Quadro de Erros de Validação da Importação */}
      {importErrors.length > 0 && (
        <div className="mb-6 p-4 rounded-xl border border-[#F2C0C0] bg-[#FFF5F5] dark:bg-[#2B1717] text-xs sm:text-sm text-[#872020] dark:text-[#EAA0A0] space-y-2">
          <div className="font-bold font-mono flex items-center gap-1.5 text-[#A62424] dark:text-[#FFA3A3]">
            <span>✕</span> Erro de validação no arquivo JSON do pacote:
          </div>
          <ul className="list-disc list-inside space-y-1 font-mono text-xs">
            {importErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
          <p className="text-[11px] text-[#7A4040] dark:text-[#CCA0A0] pt-1 italic font-sans">
            Formato obrigatório: &#123; id, nome, ano, regiao, versao, autoria, rotulo_ia, itens[] &#125;. Você pode testar com o arquivo &quot;pacote-exemplo.json&quot; na raiz.
          </p>
        </div>
      )}

      {/* Barra de Ações: Importar Pacote + Exportar Comunitário */}
      <div className="mb-6 p-4 bg-[#FFFFFF] dark:bg-[#18231A] border border-[#E5DECD] dark:border-[#2C3C2E] rounded-2xl shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2D5A27] dark:text-[#7EB588] block">
            Circulação Local de Edições
          </span>
          <span className="text-xs text-[#7A8A78] dark:text-[#8E9F8C]">
            Troque pacotes por arquivo JSON sem internet
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Botão Importar */}
          <button
            onClick={() => fileInputRef.current?.click()}
            type="button"
            className="flex-1 sm:flex-initial touch-target inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-mono font-medium bg-[#2E5E37] text-white hover:bg-[#244C2C] shadow-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2E5E37]"
            title="Importar pacote JSON de arquivo"
          >
            <span>📥</span>
            <span>Importar pacote</span>
          </button>

          {/* Botão Testar com Exemplo */}
          <button
            onClick={handleCarregarExemplo}
            type="button"
            className="flex-1 sm:flex-initial touch-target inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-mono font-medium bg-[#FAF3E8] dark:bg-[#2A2318] text-[#8C5D26] dark:text-[#E2A662] border border-[#E8D4B4] dark:border-[#4B3722] hover:bg-[#F4E9D6] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#B57C3B]"
            title="Carregar pacote-exemplo.json (Almanaque do Vale do Ribeira)"
          >
            <span>🌾</span>
            <span>Testar exemplo</span>
          </button>

          {/* Botão Exportar Almanaque Comunitário */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            type="button"
            className="flex-1 sm:flex-initial touch-target inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-mono font-medium bg-[#FAF6ED] dark:bg-[#1E2B20] text-[#2C3E2D] dark:text-[#C5D5C3] border border-[#E2D9C8] dark:border-[#2B3B2D] hover:bg-[#F2EBDC] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2E5E37]"
            title="Exportar saberes e ideias locais como pacote comunitário"
          >
            <span>🌱</span>
            <span>Criar almanaque comunitário</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Lista de Pacotes Instalados */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#6A7866] dark:text-[#8E9F8C]">
          Pacotes editoriais instalados neste aparelho:
        </h2>

        {pacotes.map((pacote) => {
          const isAtivo = pacote.ativo !== false;

          return (
            <article
              key={pacote.id}
              className={`border rounded-2xl p-5 sm:p-6 transition-all ${
                isAtivo
                  ? 'bg-[#FFFFFF] dark:bg-[#18231A] border-[#E5DECD] dark:border-[#2C3C2E] shadow-sm'
                  : 'bg-[#F5F1E7]/70 dark:bg-[#141B15]/70 border-[#E8E0D2] dark:border-[#222E24] opacity-75'
              }`}
            >
              {/* Linha superior: Metadados do pacote */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0EAE0] dark:border-[#263528]">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold ${
                      pacote.embutido
                        ? 'bg-[#EBF3E8] dark:bg-[#1E3022] text-[#2C6237] dark:text-[#7EB588] border border-[#CDE5D2] dark:border-[#2C4832]'
                        : 'bg-[#FAF3E8] dark:bg-[#2B2319] text-[#8C5D26] dark:text-[#D19B5E] border border-[#EFE2CF] dark:border-[#423321]'
                    }`}
                  >
                    {pacote.embutido ? 'Edição Padrão Embutida' : 'Pacote Importado'}
                  </span>
                  <span className="text-xs font-mono text-[#7A6B56] dark:text-[#8E9F8C]">
                    Ano {pacote.ano} • v{pacote.versao}
                  </span>
                </div>

                {/* Controles: Ligar/Desligar e Apagar */}
                <div className="flex items-center gap-2.5 self-start sm:self-auto">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[#334232] dark:text-[#C5D5C3]">
                    <input
                      type="checkbox"
                      checked={isAtivo}
                      onChange={() => handleToggleAtivo(pacote.id, pacote.ativo)}
                      className="w-4 h-4 rounded text-[#2E5E37] accent-[#2E5E37] cursor-pointer"
                    />
                    <span>{isAtivo ? 'Ativo' : 'Inativo'}</span>
                  </label>

                  {!pacote.embutido && (
                    <button
                      onClick={() => handleRemover(pacote.id, pacote.nome)}
                      type="button"
                      className="text-xs font-mono text-[#A84B4B] hover:text-[#802222] hover:bg-[#FDF0F0] dark:hover:bg-[#2B1818] p-1 px-2 rounded-lg border border-[#EED0D0] dark:border-[#442222] transition-colors cursor-pointer"
                      title="Remover pacote deste aparelho"
                    >
                      Remover ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Título e Autoria */}
              <div className="my-3">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#231D16] dark:text-[#EAE5D9] tracking-tight">
                  {pacote.nome}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#6F604D] dark:text-[#9DAE9A]">
                  <span className="font-semibold text-[#3D3326] dark:text-[#C5D5C3]">
                    Autoria: {pacote.autoria}
                  </span>
                  <span>•</span>
                  <span>Região: {pacote.regiao}</span>
                </div>
              </div>

              {pacote.descricao && (
                <p className="text-xs sm:text-sm text-[#4E4133] dark:text-[#B2C2AF] leading-relaxed mb-3">
                  {pacote.descricao}
                </p>
              )}

              {/* Rodapé do cartão de pacote */}
              <div className="pt-2.5 border-t border-[#F2ECE0] dark:border-[#263528] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <span className="text-[#657662] dark:text-[#8E9F8C]">
                  {pacote.itens.length} {pacote.itens.length === 1 ? 'item editorial' : 'itens editoriais'}
                </span>

                <span className="text-[11px] bg-[#FAF5EB] dark:bg-[#1E2B20] text-[#7A674E] dark:text-[#B2C4AF] px-2 py-0.5 rounded border border-[#EAE1D2] dark:border-[#2C3B2E]">
                  Rótulo IA: {pacote.rotulo_ia || 'Não especificado'}
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {/* Modal para Criar/Exportar Almanaque Comunitário */}
      {isExportModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
        >
          <div className="w-full max-w-lg bg-[#FFFFFF] dark:bg-[#18231A] border border-[#E5DECD] dark:border-[#2C3C2E] rounded-2xl shadow-2xl p-5 sm:p-7 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE0] dark:border-[#28382A]">
              <h2 className="font-serif text-xl font-bold text-[#1E3022] dark:text-[#EAE5D9]">
                Criar Almanaque Comunitário
              </h2>
              <button
                onClick={() => setIsExportModalOpen(false)}
                type="button"
                className="text-xs font-mono text-[#7D8B7A] hover:text-[#2E3C2F] p-1 cursor-pointer"
              >
                ✕ Fechar
              </button>
            </div>

            <p className="mt-2 text-xs text-[#63725F] dark:text-[#9DAE9A] leading-relaxed">
              Exporta todos os saberes do seu <strong>Banco de Saberes</strong> e problemas do <strong>Laboratório de Ideias</strong> no formato padrão de pacote, para ser compartilhado com turmas escolares ou associações.
            </p>

            <form onSubmit={handleExportarComunitario} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-mono font-semibold uppercase text-[#6E7B6C] dark:text-[#90A792] block mb-1">
                  Nome do almanaque:
                </label>
                <input
                  type="text"
                  required
                  value={exportNome}
                  onChange={(e) => setExportNome(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E2D8C6] dark:border-[#2C3D2E] bg-[#FCFAF5] dark:bg-[#1A261D] text-xs sm:text-sm font-sans focus:outline-none focus:border-[#2E5E37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono font-semibold uppercase text-[#6E7B6C] dark:text-[#90A792] block mb-1">
                    Ano:
                  </label>
                  <input
                    type="number"
                    required
                    value={exportAno}
                    onChange={(e) => setExportAno(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#E2D8C6] dark:border-[#2C3D2E] bg-[#FCFAF5] dark:bg-[#1A261D] text-xs sm:text-sm font-mono focus:outline-none focus:border-[#2E5E37]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-semibold uppercase text-[#6E7B6C] dark:text-[#90A792] block mb-1">
                    Região / Território:
                  </label>
                  <input
                    type="text"
                    required
                    value={exportRegiao}
                    onChange={(e) => setExportRegiao(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E2D8C6] dark:border-[#2C3D2E] bg-[#FCFAF5] dark:bg-[#1A261D] text-xs sm:text-sm font-sans focus:outline-none focus:border-[#2E5E37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono font-semibold uppercase text-[#6E7B6C] dark:text-[#90A792] block mb-1">
                  Autoria coletiva:
                </label>
                <input
                  type="text"
                  required
                  value={exportAutoria}
                  onChange={(e) => setExportAutoria(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E2D8C6] dark:border-[#2C3D2E] bg-[#FCFAF5] dark:bg-[#1A261D] text-xs sm:text-sm font-sans focus:outline-none focus:border-[#2E5E37]"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-semibold uppercase text-[#6E7B6C] dark:text-[#90A792] block mb-1">
                  Rótulo de transparência IA:
                </label>
                <input
                  type="text"
                  required
                  value={exportRotuloIa}
                  onChange={(e) => setExportRotuloIa(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E2D8C6] dark:border-[#2C3D2E] bg-[#FCFAF5] dark:bg-[#1A261D] text-xs sm:text-sm font-mono focus:outline-none focus:border-[#2E5E37]"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-semibold uppercase text-[#6E7B6C] dark:text-[#90A792] block mb-1">
                  Descrição ou introdução breve:
                </label>
                <textarea
                  rows={2}
                  value={exportDescricao}
                  onChange={(e) => setExportDescricao(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E2D8C6] dark:border-[#2C3D2E] bg-[#FCFAF5] dark:bg-[#1A261D] text-xs sm:text-sm font-sans focus:outline-none focus:border-[#2E5E37]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  onClick={() => setIsExportModalOpen(false)}
                  type="button"
                  className="px-4 py-2 rounded-xl text-xs font-mono text-[#6A7866] hover:bg-[#F2ECE0] dark:hover:bg-[#202E22] border border-[#E5DECD] dark:border-[#2C3C2E] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold bg-[#2E5E37] text-white hover:bg-[#244C2C] shadow-sm cursor-pointer"
                >
                  Baixar Pacote JSON
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
