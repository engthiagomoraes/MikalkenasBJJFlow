import React, { useState } from 'react';
import { 
  X, 
  Save, 
  Trophy, 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  AlertCircle 
} from 'lucide-react';
import { AcademyEvent } from '../../types';
import { useBjj } from '../../context/BjjContext';

interface EditEventModalProps {
  event: AcademyEvent | null;
  isOpen?: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EditEventModal: React.FC<EditEventModalProps> = (props) => {
  if (props.isOpen === false || !props.event) return null;
  return <EditEventModalContent {...props} event={props.event} />;
};

const EditEventModalContent: React.FC<EditEventModalProps & { event: AcademyEvent }> = ({
  event,
  onClose,
  onSuccess
}) => {
  const { updateEvent, instructors } = useBjj();

  const [titulo, setTitulo] = useState(event.titulo || '');
  const [tipo, setTipo] = useState<AcademyEvent['tipo']>(event.tipo || 'campeonato');
  const [data, setData] = useState(event.data || '');
  const [horario, setHorario] = useState(event.horario || '');
  const [local, setLocal] = useState(event.local || '');
  const [descricao, setDescricao] = useState(event.descricao || '');
  const [taxaInscricao, setTaxaInscricao] = useState<number>(event.taxaInscricao ?? 0);
  const [organizadorId, setOrganizadorId] = useState(event.organizadorId || instructors[0]?.id || '');
  const [status, setStatus] = useState<AcademyEvent['status']>(event.status || 'agendado');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) {
      setErrorMsg('O título do evento é obrigatório.');
      return;
    }

    const matchedProf = instructors.find(i => i.id === organizadorId);

    updateEvent(event.id, {
      titulo: titulo.trim(),
      tipo,
      data,
      horario: horario.trim(),
      local: local.trim(),
      descricao: descricao.trim(),
      taxaInscricao: Number(taxaInscricao),
      organizadorId,
      organizador: matchedProf ? matchedProf.nome : event.organizador,
      status
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
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                Editar Evento & Campeonato
              </h3>
              <p className="text-xs text-slate-400">
                Altere data, local, taxa de inscrição e detalhes da programação
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
            <label className="font-bold text-slate-700 block mb-1">Título do Evento *</label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Cerimônia de Graduação Semestral"
              className="w-full border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Tipo de Evento</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as any)}
                className="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
              >
                <option value="campeonato">🏆 Campeonato / Torneio</option>
                <option value="graduacao">🥋 Cerimônia de Graduação</option>
                <option value="seminario">✨ Seminário Técnico</option>
                <option value="open_mat">🔥 Open Mat Especial</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
              >
                <option value="agendado">Agendado</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluido">Concluído</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Data *</label>
              <input
                type="date"
                required
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-2.5 font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Horário *</label>
              <input
                type="text"
                required
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                placeholder="Ex: 09:00 - 13:00"
                className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Taxa de Inscrição (R$)</label>
              <input
                type="number"
                min={0}
                value={taxaInscricao}
                onChange={(e) => setTaxaInscricao(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-xl p-2.5 font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Organizador Responsável</label>
              <select
                value={organizadorId}
                onChange={(e) => setOrganizadorId(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
              >
                {instructors.map(i => (
                  <option key={i.id} value={i.id}>
                    {i.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Local / Tatame *</label>
            <input
              type="text"
              required
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              placeholder="Ex: Tatame Principal - Mikalkenas Jiu Jitsu"
              className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Descrição & Instruções</label>
            <textarea
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Regulamento, cronograma, pesagem ou orientações..."
              className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900"
            />
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
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-md shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Evento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
