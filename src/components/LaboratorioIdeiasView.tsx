import React, { useState, useEffect, useRef } from 'react';
import { EstadoProblema, ProblemaComunitario } from '../types/colaborativo';
import {
  addSolucaoToProblema,
  deleteProblema,
  exportColaborativoAsJson,
  getAllProblemas,
  importColaborativoFromJson,
  saveProblema,
  updateProblema,
} from '../utils/colaborativoStorage';

interface LaboratorioIdeiasViewProps {
  onBack: () => void;
}

export const LaboratorioIdeiasView: React.FC<LaboratorioIdeiasViewProps> = ({ onBack }) => {
  const [problemas, setProblemas] = useState<ProblemaComunitario[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingProb, setEditingProb] = useState<ProblemaComunitario | null>(null);

  // Campos do formulário de problema
  const [formTitulo, setFormTitulo] = useState<string>('');
  const [formDescricao, setFormDescricao] = useState<string>('');
  const [formQuemEAfetado, setFormQuemEAfetado] = useState<string>('');
  const [formEstado, setFormEstado] = useState<EstadoProblema>('aberto');

  // Campo de adicionar solução a um problema específico
  const [activeProblemaId, setActiveProblemaId] = useState<string | null>(null);
  const [novaSolucaoTexto, setNovaSolucaoTexto] = useState<string>('');
  const [novaSolucaoAutor, setNovaSolucaoAutor] = useState<string>('');
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadData = async () => {
    const list = await getAllProblemas();
    setProblemas(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3500);
  };

  const handleOpenNewForm = () => {
    setEditingProb(null);
    setFormTitulo('');
    setFormDescricao('');
    setFormQuemEAfetado('');
    setFormEstado('aberto');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (prob: ProblemaComunitario) => {
    setEditingProb(prob);
    setFormTitulo(prob.titulo);
    setFormDescricao(prob.descricao);
    setFormQuemEAfetado(prob.quemEAfetado);
    setFormEstado(prob.estado);
    setIsFormOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitulo.trim() || !formDescricao.trim()) {
      showToast('Preencha o título e a descrição do problema.');
      return;
    }

    if (editingProb) {
      await updateProblema(editingProb.id, {
        titulo: formTitulo.trim(),
        descricao: formDescricao.trim(),
        quemEAfetado: formQuemEAfetado.trim() || 'Comunidade local',
        estado: formEstado,
      });
      showToast('Problema comunitário atualizado!');
    } else {
      await saveProblema({
        titulo: formTitulo.trim(),
        descricao: formDescricao.trim(),
        quemEAfetado: formQuemEAfetado.trim() || 'Comunidade local',
        estado: formEstado,
      });
      showToast('Problema registrado no Laboratório!');
    }

    setIsFormOpen(false);
    await loadData();
  };

  const handleAddSolucao = async (probId: string) => {
    if (!novaSolucaoTexto.trim()) return;
    await addSolucaoToProblema(probId, novaSolucaoTexto, novaSolucaoAutor);
    setNovaSolucaoTexto('');
    setNovaSolucaoAutor('');
    await loadData();
    showToast('Ideia de solução anexada ao problema!');
  };

  const handleToggleEstado = async (prob: ProblemaComunitario, novoEstado: EstadoProblema) => {
    await updateProblema(prob.id, { estado: novoEstado });
    await loadData();
    showToast(`Estado alterado para "${novoEstado}"`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Deseja apagar este registro do laboratório de ideias?')) {
      await deleteProblema(id);
      await loadData();
      showToast('Registro apagado.');
    }
  };

  const handleExport = async () => {
    const jsonStr = await exportColaborativoAsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyber-almanaque-ideias-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Arquivo JSON baixado para circular entre vizinhos.');
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const res = await importColaborativoFromJson(text);
      if (res.success) {
        await loadData();
        showToast(`${res.problemasCount} ideias e ${res.saberesCount} saberes importados!`);
      } else {
        showToast(res.error || 'Erro ao importar arquivo.');
      }
    } catch {
      showToast('Arquivo JSON inválido.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const filteredProblemas =
    filtroEstado === 'todos'
      ? problemas
      : problemas.filter((p) => p.estado === filtroEstado);

  const getEstadoBadge = (estado: EstadoProblema) => {
    switch (estado) {
      case 'aberto':
        return {
          label: 'Aberto',
          bg: 'bg-[#FCF2E9] text-[#A65B1C] border-[#F2D7BF]',
          ponto: 'bg-[#A65B1C]',
        };
      case 'em andamento':
        return {
          label: 'Em andamento',
          bg: 'bg-[#EFF5F8] text-[#2A5E78] border-[#D1E4ED]',
          ponto: 'bg-[#2A5E78]',
        };
      case 'resolvido':
        return {
          label: 'Resolvido',
          bg: 'bg-[#EDF6EF] text-[#226333] border-[#CCE7D2]',
          ponto: 'bg-[#226333]',
        };
    }
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
          {problemas.length} questões comunitárias
        </span>
      </div>

      {/* Título da Seção */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF3E8] border border-[#CCDDC6] text-[#2C6237] text-xs font-mono font-medium mb-2.5">
          <span>💡 Mobilização e Inteligência Coletiva</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E3022] tracking-tight">
          Laboratório de ideias
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-[#61705D] font-sans leading-relaxed">
          Mapeie desafios concretos da sua vizinhança ou território e cultive soluções práticas em rede. Sem depender de plataformas externas.
        </p>
      </div>

      {/* Toast Notice */}
      {toastNotice && (
        <div className="mb-5 p-3 rounded-xl border border-[#CDE5D2] bg-[#EBF5ED] text-[#20572C] text-xs font-mono flex items-center gap-2">
          <span>✓</span>
          <span>{toastNotice}</span>
        </div>
      )}

      {/* Formulário de Registro / Edição de Problema */}
      {isFormOpen ? (
        <form
          onSubmit={handleSubmitForm}
          className="bg-[#FFFFFF] border border-[#E5DECD] rounded-2xl p-5 sm:p-7 shadow-sm space-y-4 mb-6"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE0]">
            <h2 className="font-serif text-xl font-bold text-[#1E3022]">
              {editingProb ? 'Editar problema' : 'Registrar desafio comunitário'}
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
              Título do problema ou desafio:
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Falta de lixeira e acúmulo de entulho na curva da praça"
              value={formTitulo}
              onChange={(e) => setFormTitulo(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#E2D8C6] bg-[#FCFAF5] font-serif text-sm sm:text-base focus:outline-none focus:border-[#2E5E37]"
            />
          </div>

          <div>
            <label className="text-xs font-mono font-semibold uppercase text-[#6E7B6C] block mb-1">
              Descrição do que está acontecendo:
            </label>
            <textarea
              required
              rows={3}
              placeholder="Descreva a situação com clareza e respeito..."
              value={formDescricao}
              onChange={(e) => setFormDescricao(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#E2D8C6] bg-[#FCFAF5] font-sans text-xs sm:text-sm focus:outline-none focus:border-[#2E5E37]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono font-semibold uppercase text-[#6E7B6C] block mb-1">
                Quem é afetado:
              </label>
              <input
                type="text"
                placeholder="Ex: Crianças, pedestres, moradores do bloco 2"
                value={formQuemEAfetado}
                onChange={(e) => setFormQuemEAfetado(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E2D8C6] bg-[#FCFAF5] text-xs sm:text-sm font-sans focus:outline-none focus:border-[#2E5E37]"
              />
            </div>

            <div>
              <label className="text-xs font-mono font-semibold uppercase text-[#6E7B6C] block mb-1">
                Estado atual:
              </label>
              <select
                value={formEstado}
                onChange={(e) => setFormEstado(e.target.value as EstadoProblema)}
                className="w-full p-2.5 rounded-xl border border-[#E2D8C6] bg-[#FCFAF5] text-xs sm:text-sm font-sans focus:outline-none focus:border-[#2E5E37]"
              >
                <option value="aberto">Aberto (buscando soluções)</option>
                <option value="em andamento">Em andamento (mutirão ou ação iniciada)</option>
                <option value="resolvido">Resolvido (concluído)</option>
              </select>
            </div>
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
              {editingProb ? 'Salvar alterações' : 'Registrar desafio no laboratório'}
            </button>
          </div>
        </form>
      ) : null}

      {/* Barra de Ações: Novo + Exportar/Importar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FFFFFF] p-3.5 rounded-2xl border border-[#E5DECD] shadow-sm mb-6">
        <button
          onClick={handleOpenNewForm}
          type="button"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E5E37] hover:bg-[#254C2D] text-white text-xs font-mono font-bold shadow-sm transition-all cursor-pointer"
        >
          <span>+</span>
          <span>Registrar novo problema</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            type="button"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono bg-[#FAF6ED] hover:bg-[#F2EBDC] text-[#2C3E2D] border border-[#E2D9C8] transition-colors cursor-pointer"
            title="Exportar todas as ideias em arquivo JSON"
          >
            <span>💾</span>
            <span>Exportar JSON</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            type="button"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono bg-[#FAF6ED] hover:bg-[#F2EBDC] text-[#2C3E2D] border border-[#E2D9C8] transition-colors cursor-pointer"
            title="Importar ideias de outro aparelho"
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

      {/* Filtro por Estado */}
      <div className="flex flex-wrap items-center gap-1.5 mb-5">
        {(['todos', 'aberto', 'em andamento', 'resolvido'] as const).map((est) => (
          <button
            key={est}
            onClick={() => setFiltroEstado(est)}
            type="button"
            className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all cursor-pointer capitalize ${
              filtroEstado === est
                ? 'bg-[#2E5E37] text-white border-[#2E5E37] font-semibold'
                : 'bg-[#FAF6ED] text-[#4F5E4E] border-[#E2D8C6] hover:bg-[#F2ECE0]'
            }`}
          >
            {est === 'todos' ? 'Todos os estados' : est}
          </button>
        ))}
      </div>

      {/* Lista de Problemas e Soluções Anexadas */}
      <div className="space-y-5">
        {filteredProblemas.map((prob) => {
          const badge = getEstadoBadge(prob.estado);
          const isAddingSolucao = activeProblemaId === prob.id;

          return (
            <article
              key={prob.id}
              className="bg-[#FFFFFF] border border-[#E5DECD] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4"
            >
              {/* Cabeçalho do problema */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0EAE0]">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 font-semibold ${badge.bg}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${badge.ponto}`} />
                    {badge.label}
                  </span>
                  <span className="text-xs text-[#7A6B56] font-mono">
                    Afetados: {prob.quemEAfetado}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {/* Seletor rápido de estado */}
                  <select
                    value={prob.estado}
                    onChange={(e) =>
                      handleToggleEstado(prob, e.target.value as EstadoProblema)
                    }
                    className="text-[11px] font-mono p-1 rounded-lg border border-[#E2D9C8] bg-[#FAF6ED] cursor-pointer"
                  >
                    <option value="aberto">Mudar: Aberto</option>
                    <option value="em andamento">Mudar: Em andamento</option>
                    <option value="resolvido">Mudar: Resolvido</option>
                  </select>

                  <button
                    onClick={() => handleOpenEdit(prob)}
                    type="button"
                    className="text-xs font-mono text-[#526451] hover:text-[#1E3022] hover:bg-[#F4EFE3] px-2 py-1 rounded-lg border border-[#E5DECD] transition-colors cursor-pointer"
                    title="Editar dados do problema"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => handleDelete(prob.id)}
                    type="button"
                    className="text-xs font-mono text-[#A84B4B] hover:text-[#802222] hover:bg-[#FDF0F0] px-2 py-1 rounded-lg border border-[#EED0D0] transition-colors cursor-pointer"
                    title="Apagar problema"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#231D16] tracking-tight">
                {prob.titulo}
              </h2>

              <p className="text-xs sm:text-sm text-[#473B2C] leading-relaxed">
                {prob.descricao}
              </p>

              {/* Lista de Soluções Anexadas */}
              <div className="bg-[#FAF7F0] border border-[#EDE2CD] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#356B40] flex items-center gap-1.5">
                    <span>💡</span> Ideias de solução ({prob.solucoes.length})
                  </span>

                  {!isAddingSolucao && (
                    <button
                      onClick={() => setActiveProblemaId(prob.id)}
                      type="button"
                      className="text-xs font-mono text-[#2E5E37] hover:underline font-semibold cursor-pointer"
                    >
                      + Anexar ideia
                    </button>
                  )}
                </div>

                {prob.solucoes.length === 0 ? (
                  <p className="text-xs text-[#7A6B56] italic">
                    Nenhuma ideia de solução anexada ainda. Seja a primeira pessoa a propor uma saída!
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {prob.solucoes.map((sol) => (
                      <li
                        key={sol.id}
                        className="bg-[#FFFFFF] p-3 rounded-lg border border-[#E5DBC7] text-xs sm:text-sm text-[#2E2519]"
                      >
                        <p className="leading-relaxed">{sol.texto}</p>
                        {sol.sugeridoPor && (
                          <span className="block mt-1 text-[11px] font-mono text-[#8C7A65]">
                            Sugerido por: {sol.sugeridoPor}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Formulário para Anexar Solução */}
                {isAddingSolucao && (
                  <div className="mt-3 pt-3 border-t border-[#E8DEC8] space-y-2">
                    <textarea
                      rows={2}
                      placeholder="Descreva uma ideia ou passo prático para resolver ou amenizar o problema..."
                      value={novaSolucaoTexto}
                      onChange={(e) => setNovaSolucaoTexto(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#E2D8C6] bg-[#FFFFFF] text-xs sm:text-sm focus:outline-none focus:border-[#2E5E37]"
                    />
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                      <input
                        type="text"
                        placeholder="Seu nome ou grupo (opcional)"
                        value={novaSolucaoAutor}
                        onChange={(e) => setNovaSolucaoAutor(e.target.value)}
                        className="p-1.5 px-2.5 rounded-lg border border-[#E2D8C6] bg-[#FFFFFF] text-xs font-mono"
                      />
                      <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        <button
                          onClick={() => setActiveProblemaId(null)}
                          type="button"
                          className="px-2.5 py-1 text-xs font-mono text-[#7A6B56] hover:bg-[#EFE8D7] rounded cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleAddSolucao(prob.id)}
                          type="button"
                          className="px-3 py-1 bg-[#2E5E37] text-white text-xs font-mono font-bold rounded-lg hover:bg-[#254C2D] cursor-pointer"
                        >
                          Salvar ideia
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
