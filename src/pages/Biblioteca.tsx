import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Tag, 
  CheckCircle2, 
  Flame, 
  Filter, 
  Award, 
  Video, 
  ChevronRight,
  ShieldCheck,
  Layers,
  Sparkles,
  Upload,
  Pencil
} from 'lucide-react';
import { useBjj } from '../context/BjjContext';
import { BeltBadge } from '../components/ui/BeltBadge';
import { BeltColor, Technique } from '../types';
import { BatchUploadModal } from '../components/import/BatchUploadModal';
import { EditTechniqueModal } from '../components/technique/EditTechniqueModal';
import { ViewToggle, ViewMode } from '../components/ui/ViewToggle';

export const Biblioteca: React.FC = () => {
  const { techniques, addTechnique } = useBjj();

  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedNivel, setSelectedNivel] = useState<string>('all');
  const [selectedTipo, setSelectedTipo] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [activeTechnique, setActiveTechnique] = useState<Technique | null>(null);
  const [editingTechnique, setEditingTechnique] = useState<Technique | null>(null);

  // New technique form
  const [newTitulo, setNewTitulo] = useState('');
  const [newCategoria, setNewCategoria] = useState<'Finalização' | 'Raspagem' | 'Passagem de Guarda' | 'Queda' | 'Guarda' | 'Defesa Pessoal' | 'Costas'>('Finalização');
  const [newNivel, setNewNivel] = useState<'Iniciante' | 'Intermediário' | 'Avançado'>('Iniciante');
  const [newFaixaMin, setNewFaixaMin] = useState<BeltColor>('branca');
  const [newTipo, setNewTipo] = useState<'Gi' | 'No-Gi' | 'Ambos'>('Ambos');
  const [newDescricao, setNewDescricao] = useState('');
  const [newPontosChave, setNewPontosChave] = useState('1. Dominar pegada\n2. Quebrar postura\n3. Ajustar alavanca');
  const [newTags, setNewTags] = useState('Fundamento, Guarda');

  const categories = ['all', 'Finalização', 'Raspagem', 'Passagem de Guarda', 'Queda', 'Guarda', 'Defesa Pessoal', 'Costas'];

  const filteredTechniques = techniques.filter(tec => {
    const matchesCat = selectedCategory === 'all' || tec.categoria === selectedCategory;
    const matchesNivel = selectedNivel === 'all' || tec.nivel === selectedNivel;
    const matchesTipo = selectedTipo === 'all' || tec.tipo === selectedTipo || tec.tipo === 'Ambos';
    const matchesSearch = 
      tec.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tec.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      tec.descricao.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesNivel && matchesTipo && matchesSearch;
  });

  const handleCreateTechnique = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitulo) return;

    addTechnique({
      titulo: newTitulo,
      categoria: newCategoria,
      nivel: newNivel,
      faixaMinima: newFaixaMin,
      tipo: newTipo,
      descricao: newDescricao,
      pontosChave: newPontosChave.split('\n').filter(Boolean),
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean)
    });

    setShowAddModal(false);
    setNewTitulo('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            Enciclopédia & Grade Técnica
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Biblioteca de Técnicas do Jiu-Jitsu
          </h1>
          <p className="text-sm text-slate-500">
            Catálogo curricular de posições, alavancas, raspagens, passagens e defesas para padronização do ensino.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <ViewToggle 
            mode={viewMode} 
            onChange={setViewMode} 
            cardsLabel="Visualização em Cards"
            tableLabel="Visualização em Tabela"
          />

          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            Upload Técnicas (CSV)
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Cadastrar Nova Posição
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar por nome, golpe ou tag (ex: armlock, berimbolo, toreando)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedNivel}
              onChange={(e) => setSelectedNivel(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl p-2.5 focus:outline-none"
            >
              <option value="all">Todos os Níveis</option>
              <option value="Iniciante">Iniciante</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Avançado">Avançado</option>
            </select>

            <select
              value={selectedTipo}
              onChange={(e) => setSelectedTipo(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl p-2.5 focus:outline-none"
            >
              <option value="all">Kimono & Sem Kimono</option>
              <option value="Gi">Apenas Gi (Com Pano)</option>
              <option value="No-Gi">No-Gi (Sem Kimono)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
                selectedCategory === cat 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'Todas as Categorias' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content: Cards or Table */}
      {filteredTechniques.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700 text-base">Nenhuma técnica encontrada</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Não encontramos posições com os filtros selecionados. Tente ajustar o nível, categoria ou termo de busca.
          </p>
        </div>
      ) : viewMode === 'cards' ? (
        /* Techniques Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTechniques.map(tech => (
            <div 
              key={tech.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group cursor-pointer"
              onClick={() => setActiveTechnique(tech)}
            >
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                    {tech.categoria}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {tech.tipo}
                    </span>
                    <BeltBadge faixa={tech.faixaMinima} graus={0} size="sm" showLabel={false} />
                  </div>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                  {tech.titulo}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {tech.descricao}
                </p>

                {/* Key points preview */}
                <div className="space-y-1 pt-1">
                  {tech.pontosChave.slice(0, 2).map((pt, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-500">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="truncate">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 flex-wrap">
                  {tech.tags.slice(0, 2).map((t, i) => (
                    <span key={i} className="text-[10px] text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTechnique(tech);
                    }}
                    className="px-2 py-1 text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors flex items-center gap-1"
                    title="Editar Técnica"
                  >
                    <Pencil className="w-3 h-3 text-amber-600" />
                    <span>Editar</span>
                  </button>

                  <span className="text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Ver detalhes →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Visualização em Lista / Tabela */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/90 text-slate-600 font-bold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Técnica / Posição</th>
                  <th className="p-4">Categoria</th>
                  <th className="p-4">Faixa Mínima</th>
                  <th className="p-4">Nível</th>
                  <th className="p-4">Tipo</th>
                  <th className="p-4">Tags</th>
                  <th className="p-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTechniques.map(tech => (
                  <tr 
                    key={tech.id} 
                    onClick={() => setActiveTechnique(tech)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                  >
                    <td className="p-4">
                      <div>
                        <span className="font-extrabold text-slate-900 block text-sm">{tech.titulo}</span>
                        <p className="text-[11px] text-slate-500 truncate max-w-[280px] mt-0.5">{tech.descricao}</p>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                        {tech.categoria}
                      </span>
                    </td>

                    <td className="p-4">
                      <BeltBadge faixa={tech.faixaMinima} graus={0} size="sm" />
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-slate-700">{tech.nivel}</span>
                    </td>

                    <td className="p-4">
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {tech.tipo}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1 flex-wrap max-w-[180px]">
                        {tech.tags.slice(0, 3).map((t, idx) => (
                          <span key={idx} className="text-[10px] text-slate-500 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingTechnique(tech);
                          }}
                          className="px-2 py-1 text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors flex items-center gap-1"
                          title="Editar Técnica"
                        >
                          <Pencil className="w-3 h-3 text-amber-600" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTechnique(tech);
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          Detalhes →
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Technique Detail Modal */}
      {activeTechnique && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-xl w-full shadow-2xl border border-slate-200 space-y-5 my-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md">
                  {activeTechnique.categoria}
                </span>
                <span className="text-xs font-semibold text-slate-500">Modalidade: {activeTechnique.tipo}</span>
              </div>
              <button 
                onClick={() => setActiveTechnique(null)} 
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-snug">
              {activeTechnique.titulo}
            </h2>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <span>Faixa Mínima Recomendada:</span>
                <BeltBadge faixa={activeTechnique.faixaMinima} graus={0} size="sm" />
              </div>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-bold text-slate-700">Nível: {activeTechnique.nivel}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
              <strong className="block text-slate-900 mb-1">Conceito & Mecânica da Alavanca:</strong>
              {activeTechnique.descricao}
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Pontos-Chave de Execução (Checklist Técnico):
              </h4>
              <div className="space-y-2 text-xs text-slate-700">
                {activeTechnique.pontosChave.map((ponto, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 bg-blue-50/40 rounded-lg border border-blue-100">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{ponto}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap pt-2">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              {activeTechnique.tags.map(t => (
                <span key={t} className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                  #{t}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  const t = activeTechnique;
                  setActiveTechnique(null);
                  setEditingTechnique(t);
                }}
                className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5 text-amber-600" />
                <span>Editar Dados da Posição</span>
              </button>

              <button
                onClick={() => setActiveTechnique(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
              >
                Fechar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Technique */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 text-xs my-8">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Cadastrar Nova Técnica</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTechnique} className="space-y-3.5">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nome da Posição</label>
                <input
                  type="text"
                  placeholder="Ex: Passagem Emborcada ou Chave de Braço Invertida"
                  value={newTitulo}
                  onChange={(e) => setNewTitulo(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 font-semibold text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Categoria</label>
                  <select
                    value={newCategoria}
                    onChange={(e) => setNewCategoria(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg p-2 font-medium"
                  >
                    <option value="Finalização">Finalização</option>
                    <option value="Raspagem">Raspagem</option>
                    <option value="Passagem de Guarda">Passagem de Guarda</option>
                    <option value="Guarda">Guarda</option>
                    <option value="Queda">Queda</option>
                    <option value="Defesa Pessoal">Defesa Pessoal</option>
                    <option value="Costas">Costas</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nível Técnico</label>
                  <select
                    value={newNivel}
                    onChange={(e) => setNewNivel(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg p-2 font-medium"
                  >
                    <option value="Iniciante">Iniciante</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Faixa Recomendada</label>
                  <select
                    value={newFaixaMin}
                    onChange={(e) => setNewFaixaMin(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg p-2 capitalize font-medium"
                  >
                    <option value="branca">Branca</option>
                    <option value="azul">Azul</option>
                    <option value="roxa">Roxa</option>
                    <option value="marrom">Marrom</option>
                    <option value="preta">Preta</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Traje / Modalidade</label>
                  <select
                    value={newTipo}
                    onChange={(e) => setNewTipo(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg p-2 font-medium"
                  >
                    <option value="Ambos">Ambos (Gi & No-Gi)</option>
                    <option value="Gi">Apenas com Kimono (Gi)</option>
                    <option value="No-Gi">Sem Kimono (No-Gi)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Descrição Conceitual</label>
                <textarea
                  rows={3}
                  placeholder="Explique como a posição funciona e quais alavancas são ativadas..."
                  value={newDescricao}
                  onChange={(e) => setNewDescricao(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Pontos-Chave (1 por linha)</label>
                <textarea
                  rows={3}
                  value={newPontosChave}
                  onChange={(e) => setNewPontosChave(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tags (separadas por vírgula)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Salvar Técnica
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Technique Modal */}
      <EditTechniqueModal
        technique={editingTechnique}
        isOpen={!!editingTechnique}
        onClose={() => setEditingTechnique(null)}
      />

      {/* Batch Upload Modal */}
      {showUploadModal && (
        <BatchUploadModal
          type="techniques"
          onClose={() => setShowUploadModal(false)}
        />
      )}
    </div>
  );
};
