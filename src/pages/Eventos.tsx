import React, { useState } from 'react';
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  Clock, 
  Plus, 
  Users, 
  Award, 
  Sparkles, 
  DollarSign, 
  CheckCircle2, 
  Filter,
  UserCheck,
  Pencil,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { useBjj } from '../context/BjjContext';
import { AcademyEvent } from '../types';
import { EditEventModal } from '../components/events/EditEventModal';

export const Eventos: React.FC = () => {
  const { 
    events, 
    students, 
    currentUser, 
    addEvent, 
    updateEvent, 
    deleteEvent, 
    toggleEnrollEvent, 
    academySettings 
  } = useBjj();

  const [filterType, setFilterType] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedEventForParticipants, setSelectedEventForParticipants] = useState<AcademyEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<AcademyEvent | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<AcademyEvent | null>(null);

  // New event form state
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState<'campeonato' | 'graduacao' | 'seminario' | 'open_mat'>('campeonato');
  const [data, setData] = useState('2026-11-20');
  const [horario, setHorario] = useState('09:00 - 17:00');
  const [local, setLocal] = useState(academySettings?.unidadePrincipal || `Tatame Principal - ${academySettings?.nomeAcademia || 'Academia'}`);
  const [descricao, setDescricao] = useState('');
  const [taxaInscricao, setTaxaInscricao] = useState<number>(0);

  const isStudent = currentUser.role === 'aluno';
  const canManageEvents = currentUser.role === 'admin' || currentUser.role === 'professor';

  const filteredEvents = events.filter(evt => {
    if (filterType === 'all') return true;
    return evt.tipo === filterType;
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo) return;

    addEvent({
      titulo,
      tipo,
      data,
      horario,
      local,
      descricao,
      organizador: currentUser.nome,
      organizadorId: currentUser.id,
      taxaInscricao: Number(taxaInscricao),
      status: 'agendado'
    });

    setShowAddModal(false);
    setTitulo('');
    setDescricao('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            Calendário de Competições & Celebrações
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Painel de Eventos do Tatame
          </h1>
          <p className="text-sm text-slate-500">
            Acompanhe e inscreva-se em campeonatos estaduais, cerimônias solenes de graduação e seminários técnicos.
          </p>
        </div>

        {canManageEvents && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Programar Novo Evento
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterType('all')}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors shrink-0 ${
              filterType === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Todos os Eventos ({events.length})
          </button>
          <button
            onClick={() => setFilterType('campeonato')}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors shrink-0 ${
              filterType === 'campeonato' ? 'bg-amber-500 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🏆 Campeonatos
          </button>
          <button
            onClick={() => setFilterType('graduacao')}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors shrink-0 ${
              filterType === 'graduacao' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🥋 Cerimônias de Graduação
          </button>
          <button
            onClick={() => setFilterType('seminario')}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors shrink-0 ${
              filterType === 'seminario' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            📚 Seminários
          </button>
          <button
            onClick={() => setFilterType('open_mat')}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors shrink-0 ${
              filterType === 'open_mat' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🤝 Open Mats
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map(evt => {
          const isEnrolled = currentUser.studentId && evt.participantesIds.includes(currentUser.studentId);
          const isCamp = evt.tipo === 'campeonato';
          const isGrad = evt.tipo === 'graduacao';
          const isSem = evt.tipo === 'seminario';

          return (
            <div 
              key={evt.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md ${
                    isCamp ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                    isGrad ? 'bg-blue-100 text-blue-900 border border-blue-200' :
                    isSem ? 'bg-purple-100 text-purple-900 border border-purple-200' :
                    'bg-emerald-100 text-emerald-900 border border-emerald-200'
                  }`}>
                    {isCamp ? '🏆 Campeonato Oficial' :
                     isGrad ? '🥋 Cerimônia de Graduação' :
                     isSem ? '📚 Seminário Técnico' : '🤝 Open Mat'}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {evt.taxaInscricao > 0 ? `Taxa: R$ ${evt.taxaInscricao.toFixed(2)}` : 'Inscrição Gratuita'}
                    </span>
                    {canManageEvents && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingEvent(evt)}
                          className="p-1 rounded text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          title="Editar Dados do Evento"
                        >
                          <Pencil className="w-3.5 h-3.5 text-amber-600" />
                        </button>
                        <button
                          onClick={() => setDeletingEvent(evt)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Excluir Evento"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 leading-snug">{evt.titulo}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{evt.descricao}</p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100 font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>{new Date(evt.data + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{evt.horario}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{evt.local}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-slate-400" />
                    <span>Organização: <strong>{evt.organizador}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action and Participants Footer */}
              <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedEventForParticipants(evt)}
                  className="text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{evt.participantesIds.length} Atletas Inscritos</span>
                </button>

                {isStudent && currentUser.studentId ? (
                  <button
                    onClick={() => toggleEnrollEvent(evt.id, currentUser.studentId!)}
                    className={`text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 ${
                      isEnrolled
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {isEnrolled ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Inscrito ✓
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Garantir Vaga / Inscrever
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedEventForParticipants(evt)}
                    className="text-xs font-semibold bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100"
                  >
                    Ver Lista de Inscritos →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Participants Modal */}
      {selectedEventForParticipants && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{selectedEventForParticipants.titulo}</h3>
                <p className="text-slate-500">
                  {selectedEventForParticipants.participantesIds.length} atletas confirmados
                </p>
              </div>
              <button 
                onClick={() => setSelectedEventForParticipants(null)} 
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selectedEventForParticipants.participantesIds.length === 0 ? (
                <p className="text-slate-400 italic text-center py-4">Nenhum aluno inscrito ainda.</p>
              ) : (
                selectedEventForParticipants.participantesIds.map(stId => {
                  const student = students.find(s => s.id === stId);
                  return (
                    <div key={stId} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <span className="font-bold text-slate-900">{student?.nome || 'Aluno Convidado'}</span>
                      <span className="text-[11px] capitalize text-slate-500">{student?.faixa} ({student?.graus}º grau)</span>
                    </div>
                  );
                })
              )}
            </div>

            <button
              onClick={() => setSelectedEventForParticipants(null)}
              className="w-full py-2 bg-slate-900 text-white font-semibold rounded-xl"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* New Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 text-xs my-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Programar Novo Evento</h3>
                <p className="text-slate-500">Divulgue campeonatos, cerimônias de graduação ou seminários</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3.5">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Título do Evento</label>
                <input
                  type="text"
                  placeholder="Ex: Cerimônia de Graduação Semestral 2026"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 font-semibold text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tipo de Evento</label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg p-2 font-medium"
                  >
                    <option value="campeonato">🏆 Campeonato</option>
                    <option value="graduacao">🥋 Cerimônia de Graduação</option>
                    <option value="seminario">📚 Seminário</option>
                    <option value="open_mat">🤝 Open Mat</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Taxa de Inscrição (R$)</label>
                  <input
                    type="number"
                    value={taxaInscricao}
                    onChange={(e) => setTaxaInscricao(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Data</label>
                  <input
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Horário</label>
                  <input
                    type="text"
                    placeholder="Ex: 09:00 - 14:00"
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Local / Tatame</label>
                <input
                  type="text"
                  placeholder={`Ex: Tatame 1 - ${academySettings.nomeAcademia || 'Minha Academia'}`}
                  value={local}
                  onChange={(e) => setLocal(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Descrição & Recomendações</label>
                <textarea
                  rows={3}
                  placeholder="Instruções para os participantes (vestimenta, pesagem, cronograma)..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 leading-relaxed"
                  required
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
                  Publicar Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      <EditEventModal
        event={editingEvent}
        isOpen={!!editingEvent}
        onClose={() => setEditingEvent(null)}
      />

      {/* Delete Event Confirmation Modal */}
      {deletingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 text-xs animate-scale-up">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-black text-slate-900 text-lg">Confirmar Cancelamento / Exclusão</h3>
              <p className="text-slate-500">
                Tem certeza que deseja remover o evento <strong>{deletingEvent.titulo}</strong> do calendário?
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingEvent(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteEvent(deletingEvent.id);
                  setDeletingEvent(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Sim, Excluir Evento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
