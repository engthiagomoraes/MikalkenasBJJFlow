import React, { useState } from 'react';
import { 
  Activity, 
  TrendingUp, 
  Award, 
  Flame, 
  ShieldCheck, 
  Target, 
  Users, 
  Clock, 
  Search,
  CheckCircle,
  BarChart2,
  ChevronRight,
  Zap,
  Sliders
} from 'lucide-react';
import { useBjj } from '../context/BjjContext';
import { BeltBadge } from '../components/ui/BeltBadge';
import { Student } from '../types';

export const Metricas: React.FC = () => {
  const { students, attendance, updateStudent } = useBjj();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isEditingMetrics, setIsEditingMetrics] = useState<boolean>(false);

  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];

  // Editable scores state
  const [scores, setScores] = useState({
    guarda: selectedStudent?.performance.guarda || 8,
    passagem: selectedStudent?.performance.passagem || 8,
    quedas: selectedStudent?.performance.quedas || 7,
    finalizacoes: selectedStudent?.performance.finalizacoes || 7.5,
    defesa: selectedStudent?.performance.defesa || 8,
    disciplina: selectedStudent?.performance.disciplina || 9.5
  });

  // Keep scores in sync when selected student changes
  React.useEffect(() => {
    if (selectedStudent) {
      setScores({
        guarda: selectedStudent.performance.guarda,
        passagem: selectedStudent.performance.passagem,
        quedas: selectedStudent.performance.quedas,
        finalizacoes: selectedStudent.performance.finalizacoes,
        defesa: selectedStudent.performance.defesa,
        disciplina: selectedStudent.performance.disciplina
      });
      setIsEditingMetrics(false);
    }
  }, [selectedStudentId]);

  const handleSaveRatings = () => {
    if (!selectedStudent) return;
    updateStudent(selectedStudent.id, {
      performance: {
        ...selectedStudent.performance,
        guarda: Number(scores.guarda),
        passagem: Number(scores.passagem),
        quedas: Number(scores.quedas),
        finalizacoes: Number(scores.finalizacoes),
        defesa: Number(scores.defesa),
        disciplina: Number(scores.disciplina)
      }
    });
    setIsEditingMetrics(false);
  };

  // Academy aggregates
  const totalSparringMinutes = students.reduce((acc, s) => acc + s.performance.tempoRolaMinutos, 0);
  const totalSubmissions = students.reduce((acc, s) => acc + s.performance.finalizacoesAplicadas, 0);
  const totalSweeps = students.reduce((acc, s) => acc + s.performance.raspagensFeitas, 0);
  const averageAttendance = Math.round(
    students.reduce((acc, s) => acc + s.totalPresencasHistorico, 0) / (students.length || 1)
  );

  const filteredStudents = students.filter(s =>
    s.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.faixa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const studentAttendanceHistory = attendance.filter(a => a.studentId === selectedStudent?.id);

  // Overall score (average of the 6 attributes)
  const overallScore = selectedStudent 
    ? ((scores.guarda + scores.passagem + scores.quedas + scores.finalizacoes + scores.defesa + scores.disciplina) / 6).toFixed(1)
    : '0';

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            Analytics & Evolução Técnica
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Painel de Métricas e Desempenho
          </h1>
          <p className="text-sm text-slate-500">
            Acompanhe o desenvolvimento das 6 dimensões fundamentais do atleta, volume de rola e aproveitamento técnico.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs bg-slate-900 text-white font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            {totalSparringMinutes.toLocaleString('pt-BR')} min de Rola Coletivo
          </span>
        </div>
      </div>

      {/* Academy Global KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total de Sparring</span>
          <div className="text-2xl font-black text-slate-900 mt-1 flex items-baseline gap-1">
            {totalSparringMinutes} <span className="text-xs font-normal text-slate-500">min</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Tempo acumulado no tatame</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Finalizações no Rola</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {totalSubmissions}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Registros nos treinos</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Raspagens Aplicadas</span>
          <div className="text-2xl font-black text-blue-600 mt-1">
            {totalSweeps}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Inversões de guarda</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Média de Presenças</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {averageAttendance} <span className="text-xs font-normal text-slate-500">aulas</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Por atleta cadastrado</p>
        </div>
      </div>

      {/* Main Section: Athlete Selector + Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Student Roster Selector (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Selecionar Praticante</h3>
            <span className="text-xs text-slate-500 font-mono">{students.length} atletas</span>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nome ou faixa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
            {filteredStudents.map(student => {
              const isSelected = student.id === selectedStudent?.id;
              return (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudentId(student.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between gap-3 ${
                    isSelected 
                      ? 'bg-blue-50/80 border border-blue-200 shadow-xs' 
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="min-w-0">
                    <p className={`font-semibold text-xs truncate ${isSelected ? 'text-blue-900 font-bold' : 'text-slate-800'}`}>
                      {student.nome}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <BeltBadge faixa={student.faixa} graus={student.graus} size="sm" showLabel={false} />
                      <span className="text-[10px] text-slate-500 capitalize">{student.plano.replace('_', ' ')}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-mono font-bold text-slate-700 block">
                      {student.totalPresencasHistorico} treinos
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {student.performance.tempoRolaMinutos} min rola
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Performance Dossier (8 cols) */}
        {selectedStudent && (
          <div className="lg:col-span-8 space-y-6">
            {/* Athlete Header Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
                  {selectedStudent.nome.charAt(0)}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-black text-slate-900">{selectedStudent.nome}</h2>
                    <BeltBadge faixa={selectedStudent.faixa} graus={selectedStudent.graus} size="md" />
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                    <span>Peso: <strong>{selectedStudent.pesoKg} kg</strong></span>
                    <span>•</span>
                    <span>Kimono: <strong>{selectedStudent.tamanhoKimono}</strong></span>
                    <span>•</span>
                    <span>Plano: <strong className="capitalize">{selectedStudent.plano.replace('_', ' ')}</strong></span>
                  </div>
                </div>
              </div>

              {/* Overall technical rating score */}
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 p-3 rounded-2xl">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Índice Geral</span>
                  <span className="text-xs font-semibold text-slate-600">6 Dimensões BJJ</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                  {overallScore}
                </div>
              </div>
            </div>

            {/* 6 Fundamental Dimensions Evaluation */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-blue-600" />
                    Avaliação Técnica dos Fundamentos (Nota 0 a 10)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pontuações atribuídas pelo professor para orientar o plano de treino individual
                  </p>
                </div>

                {isEditingMetrics ? (
                  <button
                    onClick={handleSaveRatings}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
                  >
                    Salvar Notas
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingMetrics(true)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    Editar Notas
                  </button>
                )}
              </div>

              {/* 6 Attribute Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Guarda */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      Jogo de Guarda & Retenção
                    </span>
                    <span className="font-bold font-mono text-blue-700">{scores.guarda} / 10</span>
                  </div>
                  {isEditingMetrics ? (
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.5"
                      value={scores.guarda}
                      onChange={(e) => setScores({ ...scores, guarda: Number(e.target.value) })}
                      className="w-full accent-blue-600"
                    />
                  ) : (
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${scores.guarda * 10}%` }} />
                    </div>
                  )}
                </div>

                {/* Passagem */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-indigo-600" />
                      Passagem de Guarda & Pressão
                    </span>
                    <span className="font-bold font-mono text-indigo-700">{scores.passagem} / 10</span>
                  </div>
                  {isEditingMetrics ? (
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.5"
                      value={scores.passagem}
                      onChange={(e) => setScores({ ...scores, passagem: Number(e.target.value) })}
                      className="w-full accent-indigo-600"
                    />
                  ) : (
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${scores.passagem * 10}%` }} />
                    </div>
                  )}
                </div>

                {/* Quedas */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-600" />
                      Quedas & Luta em Pé (Judo/Wrestling)
                    </span>
                    <span className="font-bold font-mono text-amber-700">{scores.quedas} / 10</span>
                  </div>
                  {isEditingMetrics ? (
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.5"
                      value={scores.quedas}
                      onChange={(e) => setScores({ ...scores, quedas: Number(e.target.value) })}
                      className="w-full accent-amber-600"
                    />
                  ) : (
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-amber-600 h-full rounded-full" style={{ width: `${scores.quedas * 10}%` }} />
                    </div>
                  )}
                </div>

                {/* Finalizações */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-emerald-600" />
                      Precisão de Finalizações
                    </span>
                    <span className="font-bold font-mono text-emerald-700">{scores.finalizacoes} / 10</span>
                  </div>
                  {isEditingMetrics ? (
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.5"
                      value={scores.finalizacoes}
                      onChange={(e) => setScores({ ...scores, finalizacoes: Number(e.target.value) })}
                      className="w-full accent-emerald-600"
                    />
                  ) : (
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${scores.finalizacoes * 10}%` }} />
                    </div>
                  )}
                </div>

                {/* Defesa */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                      Defesas & Escapadas
                    </span>
                    <span className="font-bold font-mono text-rose-700">{scores.defesa} / 10</span>
                  </div>
                  {isEditingMetrics ? (
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.5"
                      value={scores.defesa}
                      onChange={(e) => setScores({ ...scores, defesa: Number(e.target.value) })}
                      className="w-full accent-rose-600"
                    />
                  ) : (
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-rose-600 h-full rounded-full" style={{ width: `${scores.defesa * 10}%` }} />
                    </div>
                  )}
                </div>

                {/* Disciplina */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-purple-600" />
                      Disciplina, Assiduidade & Respeito
                    </span>
                    <span className="font-bold font-mono text-purple-700">{scores.disciplina} / 10</span>
                  </div>
                  {isEditingMetrics ? (
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.5"
                      value={scores.disciplina}
                      onChange={(e) => setScores({ ...scores, disciplina: Number(e.target.value) })}
                      className="w-full accent-purple-600"
                    />
                  ) : (
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-purple-600 h-full rounded-full" style={{ width: `${scores.disciplina * 10}%` }} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sparring Stats and Mat Experience Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center">
                <span className="text-xs font-semibold text-slate-500">Tempo de Sparring (Rola)</span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {selectedStudent.performance.tempoRolaMinutos} min
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  ~{Math.round(selectedStudent.performance.tempoRolaMinutos / 5)} rounds de 5 minutos
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center">
                <span className="text-xs font-semibold text-slate-500">Finalizações Concluídas</span>
                <div className="text-2xl font-black text-emerald-600 mt-1">
                  {selectedStudent.performance.finalizacoesAplicadas}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Armlocks, triângulos e estrangulamentos</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center">
                <span className="text-xs font-semibold text-slate-500">Raspagens Efetivas</span>
                <div className="text-2xl font-black text-blue-600 mt-1">
                  {selectedStudent.performance.raspagensFeitas}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Inversões de guarda com controle</p>
              </div>
            </div>

            {/* Attendance Log for this athlete */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">
                Histórico Recente de Presenças de {selectedStudent.nome} ({studentAttendanceHistory.length} registros)
              </h3>

              {studentAttendanceHistory.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Nenhum check-in recente registrado no sistema.</p>
              ) : (
                <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
                  {studentAttendanceHistory.map(att => (
                    <div key={att.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span className="font-semibold text-slate-800">{att.turmaTitulo}</span>
                      </div>
                      <div className="text-slate-500 font-mono text-[11px]">
                        {new Date(att.data + 'T00:00:00').toLocaleDateString('pt-BR')} às {att.horario}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
