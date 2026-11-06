import React, { useState } from 'react';
import { ScrollText, Users, Clock, Calendar, CheckCircle2, Pencil } from 'lucide-react';
import { useBjj } from '../context/BjjContext';
import { ClassSchedule } from '../types';
import { EditClassModal } from '../components/classes/EditClassModal';

export const RelatorioAulas: React.FC = () => {
  const { classes, attendance, lessonPlans, currentUser } = useBjj();
  const [editingClass, setEditingClass] = useState<ClassSchedule | null>(null);

  const isProfessor = currentUser.role === 'professor';
  const displayedClasses = isProfessor
    ? classes.filter(c => c.professorId === currentUser.professorId || (c.professorNome && c.professorNome.toLowerCase() === currentUser.nome.toLowerCase()))
    : classes;

  const canEdit = currentUser.role === 'admin' || currentUser.isMasterAdmin || currentUser.role === 'professor';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <ScrollText className="w-4 h-4" />
            {isProfessor ? 'Área Docente • Suas Turmas' : 'Auditoria Pedagógica'}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isProfessor ? `Relatório de Aulas • Prof. ${currentUser.nome}` : 'Relatório de Aulas & Turmas'}
          </h1>
          <p className="text-sm text-slate-500">
            {isProfessor 
              ? `Frequência média e cumprimento pedagógico das suas turmas ministradas.`
              : 'Frequência média por horário, aderência às turmas, cumprimento da grade de treinos e edição de turmas.'}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-colors no-print"
        >
          Imprimir Relatório de Aulas
        </button>
      </div>

      {/* Classes Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedClasses.map(turma => {
          const turmaAttendance = attendance.filter(a => a.turmaId === turma.id);
          const turmaPlans = lessonPlans.filter(p => p.turma === turma.titulo);
          const completedPlans = turmaPlans.filter(p => p.concluida).length;

          return (
            <div key={turma.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                    {turma.categoria}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{turma.sala}</span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-slate-900">{turma.titulo}</h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{turma.horario}</span>
                    <span>•</span>
                    <span>{turma.diaSemana}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div className="bg-slate-50 p-3 rounded-xl text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Check-ins Totais</span>
                    <span className="text-xl font-black text-slate-900">{turmaAttendance.length}</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Planos Concluídos</span>
                    <span className="text-xl font-black text-emerald-600">
                      {completedPlans}/{turmaPlans.length || 1}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <div className="truncate max-w-[150px]">
                  <span>Professor: <strong>{turma.professorNome}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  {canEdit && (
                    <button
                      onClick={() => setEditingClass(turma)}
                      className="px-2.5 py-1 text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Pencil className="w-3 h-3 text-amber-600" />
                      <span>Editar</span>
                    </button>
                  )}
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ativa
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Class Modal */}
      <EditClassModal
        cls={editingClass}
        isOpen={!!editingClass}
        onClose={() => setEditingClass(null)}
      />
    </div>
  );
};
