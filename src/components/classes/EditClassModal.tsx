import React, { useState } from 'react';
import { 
  X, 
  Save, 
  Clock, 
  UserRound, 
  Calendar, 
  MapPin, 
  AlertCircle 
} from 'lucide-react';
import { ClassSchedule } from '../../types';
import { useBjj } from '../../context/BjjContext';

interface EditClassModalProps {
  classSchedule?: ClassSchedule | null;
  cls?: ClassSchedule | null;
  isOpen?: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EditClassModal: React.FC<EditClassModalProps> = (props) => {
  const target = props.classSchedule || props.cls;
  if (props.isOpen === false || !target) return null;
  return <EditClassModalContent {...props} classSchedule={target} />;
};

const EditClassModalContent: React.FC<EditClassModalProps & { classSchedule: ClassSchedule }> = ({
  classSchedule,
  onClose,
  onSuccess
}) => {
  const { updateClassSchedule, instructors } = useBjj();

  const [titulo, setTitulo] = useState(classSchedule.titulo || '');
  const [categoria, setCategoria] = useState<ClassSchedule['categoria']>(classSchedule.categoria || 'Iniciante');
  const [diaSemana, setDiaSemana] = useState(classSchedule.diaSemana || 'Segunda, Quarta e Sexta');
  
  // Parse existing horario (e.g. "19:30 - 21:00")
  const parts = (classSchedule.horario || '').split('-').map(s => s.trim());
  const [horarioInicio, setHorarioInicio] = useState(parts[0] || '19:30');
  const [horarioFim, setHorarioFim] = useState(parts[1] || '21:00');
  
  const [sala, setSala] = useState(classSchedule.sala || 'Tatame 1 (Principal)');
  const [professorId, setProfessorId] = useState(classSchedule.professorId || instructors[0]?.id || '');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) {
      setErrorMsg('O título da turma é obrigatório.');
      return;
    }

    const prof = instructors.find(i => i.id === professorId) || instructors[0];
    const horario = `${horarioInicio} - ${horarioFim}`;

    updateClassSchedule(classSchedule.id, {
      titulo: titulo.trim(),
      categoria,
      diaSemana: diaSemana.trim(),
      horario,
      sala: sala.trim(),
      professorId: prof ? prof.id : classSchedule.professorId,
      professorNome: prof ? prof.nome : classSchedule.professorNome
    });

    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                Editar Turma & Horário
              </h3>
              <p className="text-xs text-slate-400">
                Altere dias, horário, categoria e professor responsável
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="font-bold text-slate-700 block mb-1">Título da Turma / Aula *</label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Jiu-Jitsu Noturno (Todos os Níveis)"
              className="w-full border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Categoria Pedagógica</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as any)}
              className="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
            >
              <option value="Iniciante">Iniciante / Fundamentos</option>
              <option value="Intermediário/Avançado">Intermediário & Avançado</option>
              <option value="Infantil (Kids)">Infantil (Kids)</option>
              <option value="No-Gi (Sem Kimono)">No-Gi (Sem Kimono / Submission)</option>
              <option value="Competição">Treino de Competição</option>
              <option value="Open Mat">Open Mat (Tatame Aberto)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Dias da Semana *</label>
            <input
              type="text"
              required
              value={diaSemana}
              onChange={(e) => setDiaSemana(e.target.value)}
              placeholder="Ex: Segunda, Quarta e Sexta"
              className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Horário Início *</label>
              <input
                type="text"
                required
                value={horarioInicio}
                onChange={(e) => setHorarioInicio(e.target.value)}
                placeholder="19:30"
                className="w-full border border-slate-300 rounded-xl p-2.5 font-mono font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Horário Término *</label>
              <input
                type="text"
                required
                value={horarioFim}
                onChange={(e) => setHorarioFim(e.target.value)}
                placeholder="21:00"
                className="w-full border border-slate-300 rounded-xl p-2.5 font-mono font-bold text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Tatame / Sala / Unidade *</label>
            <input
              type="text"
              required
              value={sala}
              onChange={(e) => setSala(e.target.value)}
              placeholder="Ex: Tatame 1 (Principal)"
              className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Professor Responsável pelo Horário *</label>
            <select
              value={professorId}
              onChange={(e) => setProfessorId(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-2.5 font-bold text-blue-900 bg-blue-50/40"
            >
              {instructors.map(i => (
                <option key={i.id} value={i.id}>
                  {i.nome} (Faixa {i.faixa} {i.graus}º grau)
                </option>
              ))}
            </select>
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
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Turma</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
