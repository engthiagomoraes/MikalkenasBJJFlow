import React, { useState } from 'react';
import { 
  X, 
  Save, 
  BookOpen, 
  Award, 
  Tag, 
  Video, 
  AlertCircle 
} from 'lucide-react';
import { Technique, BeltColor } from '../../types';
import { useBjj } from '../../context/BjjContext';
import { BeltBadge } from '../ui/BeltBadge';

interface EditTechniqueModalProps {
  technique: Technique | null;
  isOpen?: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EditTechniqueModal: React.FC<EditTechniqueModalProps> = (props) => {
  if (props.isOpen === false || !props.technique) return null;
  return <EditTechniqueModalContent {...props} technique={props.technique} />;
};

const EditTechniqueModalContent: React.FC<EditTechniqueModalProps & { technique: Technique }> = ({
  technique,
  onClose,
  onSuccess
}) => {
  const { updateTechnique } = useBjj();

  const [titulo, setTitulo] = useState(technique.titulo || '');
  const [categoria, setCategoria] = useState<Technique['categoria']>(technique.categoria || 'Finalização');
  const [subcategoria, setSubcategoria] = useState(technique.subcategoria || '');
  const [faixaMinima, setFaixaMinima] = useState<BeltColor>(technique.faixaMinima || 'branca');
  const [nivel, setNivel] = useState<Technique['nivel']>(technique.nivel || 'Iniciante');
  const [tipo, setTipo] = useState<Technique['tipo']>(technique.tipo || 'Ambos');
  const [descricao, setDescricao] = useState(technique.descricao || '');
  const [pontosChaveText, setPontosChaveText] = useState((technique.pontosChave || []).join('\n'));
  const [videoUrl, setVideoUrl] = useState(technique.videoUrl || '');
  const [tagsText, setTagsText] = useState((technique.tags || []).join(', '));

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) {
      setErrorMsg('O nome da técnica é obrigatório.');
      return;
    }

    const pontosChave = pontosChaveText
      .split('\n')
      .map(p => p.trim())
      .filter(Boolean);

    const tags = tagsText
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    updateTechnique(technique.id, {
      titulo: titulo.trim(),
      categoria,
      subcategoria: subcategoria.trim() || undefined,
      faixaMinima,
      nivel,
      tipo,
      descricao: descricao.trim(),
      pontosChave: pontosChave.length > 0 ? pontosChave : ['Executar com postura e base'],
      videoUrl: videoUrl.trim() || undefined,
      tags: tags.length > 0 ? tags : [categoria]
    });

    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                Editar Técnica Curricular
              </h3>
              <p className="text-xs text-slate-400">
                Altere alavanca, categoria, nível, pontos de execução e tags
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="font-bold text-slate-700 block mb-1">Nome da Posição / Técnica *</label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Armlock da Guarda Fechada"
              className="w-full border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Categoria Principal</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as any)}
                className="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
              >
                <option value="Finalização">Finalização</option>
                <option value="Raspagem">Raspagem</option>
                <option value="Passagem de Guarda">Passagem de Guarda</option>
                <option value="Guarda">Guarda</option>
                <option value="Queda">Queda</option>
                <option value="Defesa Pessoal">Defesa Pessoal</option>
                <option value="Costas">Costas / Pegada de Costas</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Subcategoria / Posição de Saída</label>
              <input
                type="text"
                value={subcategoria}
                onChange={(e) => setSubcategoria(e.target.value)}
                placeholder="Ex: Ataques de Guarda"
                className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Faixa Mínima</label>
              <select
                value={faixaMinima}
                onChange={(e) => setFaixaMinima(e.target.value as BeltColor)}
                className="w-full border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900 capitalize"
              >
                <option value="branca">Branca</option>
                <option value="azul">Azul</option>
                <option value="roxa">Roxa</option>
                <option value="marrom">Marrom</option>
                <option value="preta">Preta</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Nível Técnico</label>
              <select
                value={nivel}
                onChange={(e) => setNivel(e.target.value as any)}
                className="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
              >
                <option value="Iniciante">Iniciante</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Traje / Modalidade</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as any)}
                className="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
              >
                <option value="Ambos">Ambos (Gi & No-Gi)</option>
                <option value="Gi">Apenas com Kimono (Gi)</option>
                <option value="No-Gi">Sem Kimono (No-Gi)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Descrição Conceitual & Mecânica</label>
            <textarea
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Explique como a posição funciona e quais alavancas são ativadas..."
              className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Pontos-Chave de Execução (Checklist Técnico - 1 por linha)
            </label>
            <textarea
              rows={3}
              value={pontosChaveText}
              onChange={(e) => setPontosChaveText(e.target.value)}
              placeholder="1. Quebrar a postura&#10;2. Subir o quadril e isolar o braço&#10;3. Fechar os joelhos"
              className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono text-[11px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Link de Vídeo (YouTube / URL)</label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Tags (separadas por vírgula)</label>
              <input
                type="text"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                placeholder="Armlock, Guarda Fechada, Finalização"
                className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Técnica</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
