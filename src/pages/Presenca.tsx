import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ClipboardCheck, 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  Printer, 
  Users, 
  Filter,
  Flame,
  Award,
  BookOpen,
  Sparkles,
  UserRound,
  ChevronRight,
  Info
} from 'lucide-react';
import { useBjj } from '../context/BjjContext';
import { BeltBadge } from '../components/ui/BeltBadge';

export const Presenca: React.FC = () => {
  const { 
    students, 
    classes, 
    attendance, 
    lessonPlans,
    techniques,
    currentUser,
    checkInStudentToday, 
    removeAttendance, 
    addAttendance 
  } = useBjj();

  const isProfessor = currentUser.role === 'professor';
  const isAluno = currentUser.role === 'aluno';

  // Role scoping
  const scopedStudents = isProfessor
    ? students.filter(s => s.professorId === currentUser.professorId || (s.professorNome && s.professorNome.toLowerCase() === currentUser.nome.toLowerCase()))
    : students;

  const scopedClasses = isProfessor
    ? classes.filter(c => 
        c.professorId === currentUser.professorId || 
        (c.professorNome && c.professorNome.toLowerCase() === currentUser.nome.toLowerCase()) ||
        scopedStudents.some(s => s.turmaPreferida === c.titulo)
      )
    : classes;

  const scopedAttendance = isProfessor
    ? attendance.filter(a => 
        scopedStudents.some(s => s.id === a.studentId) || 
        (a.confirmadoPor && a.confirmadoPor.toLowerCase() === currentUser.nome.toLowerCase())
      )
    : isAluno
    ? attendance.filter(a => a.studentId === currentUser.studentId)
    : attendance;

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedTurma, setSelectedTurma] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showManualModal, setShowManualModal] = useState<boolean>(false);
  const [showQrSimulator, setShowQrSimulator] = useState<boolean>(false);
  const [lastCheckinFeedback, setLastCheckinFeedback] = useState<string | null>(null);

  // Manual modal state
  const [manualStudentId, setManualStudentId] = useState<string>(scopedStudents[0]?.id || students[0]?.id || '');
  const [manualTurmaId, setManualTurmaId] = useState<string>(scopedClasses[0]?.id || classes[0]?.id || '');
  const [manualTime, setManualTime] = useState<string>('19:30');

  // Filtered attendance for selected date
  const filteredAttendance = scopedAttendance.filter(item => {
    const matchesDate = item.data === selectedDate;
    const matchesTurma = selectedTurma === 'all' || item.turmaId === selectedTurma;
    const matchesSearch = item.studentNome.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDate && matchesTurma && matchesSearch;
  });

  // Find lesson plan for selected date (and turma)
  const currentLessonPlan = lessonPlans.find(lp => {
    const matchesDate = lp.data === selectedDate;
    if (!matchesDate) return false;
    if (selectedTurma === 'all') return true;
    const currentClass = classes.find(c => c.id === selectedTurma);
    return currentClass ? (
      lp.turma === currentClass.titulo ||
      (lp.turma && currentClass.titulo.toLowerCase().includes(lp.turma.toLowerCase())) ||
      (lp.turma && lp.turma.toLowerCase().includes(currentClass.titulo.toLowerCase())) ||
      lp.turmaId === currentClass.id
    ) : true;
  }) || lessonPlans.find(lp => lp.data === selectedDate);

  // Resolve techniques of this lesson plan
  const plannedTechniquesList: Array<{ id: string; titulo: string; categoria: string }> = [];
  if (currentLessonPlan) {
    if (currentLessonPlan.techniqueIds && currentLessonPlan.techniqueIds.length > 0) {
      currentLessonPlan.techniqueIds.forEach(id => {
        const t = techniques.find(tech => tech.id === id);
        if (t && !plannedTechniquesList.some(item => item.titulo.toLowerCase() === t.titulo.toLowerCase())) {
          plannedTechniquesList.push({ id: t.id, titulo: t.titulo, categoria: t.categoria });
        }
      });
    }
    if (currentLessonPlan.tecnicasNomes && currentLessonPlan.tecnicasNomes.length > 0) {
      currentLessonPlan.tecnicasNomes.forEach((name, idx) => {
        if (!plannedTechniquesList.some(item => item.titulo.toLowerCase() === name.toLowerCase())) {
          const t = techniques.find(tech => tech.titulo.toLowerCase() === name.toLowerCase());
          plannedTechniquesList.push({
            id: t?.id || `tech-plan-${idx}`,
            titulo: name,
            categoria: t?.categoria || 'Fundamento'
          });
        }
      });
    }
    if (plannedTechniquesList.length === 0 && currentLessonPlan.tecnicaPrincipal) {
      plannedTechniquesList.push({
        id: 'tech-main',
        titulo: currentLessonPlan.tecnicaPrincipal.split(':')[1]?.trim() || currentLessonPlan.tecnicaPrincipal,
        categoria: 'Posição do Dia'
      });
    }
  }

  const triggerFeedback = (studentName: string) => {
    const techName = plannedTechniquesList[0]?.titulo || currentLessonPlan?.temaPrincipal || 'Técnicas da aula';
    setLastCheckinFeedback(`Presença confirmada para ${studentName}! Técnica "${techName}" gravada no histórico de técnicas aprendidas.`);
    setTimeout(() => {
      setLastCheckinFeedback(null);
    }, 4500);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualStudentId || !manualTurmaId) return;
    const st = students.find(s => s.id === manualStudentId);
    addAttendance(manualStudentId, manualTurmaId, selectedDate, manualTime);
    if (st) triggerFeedback(st.nome);
    setShowManualModal(false);
  };

  const handleSimulateQr = (studentId: string) => {
    const defaultTurmaId = selectedTurma === 'all' ? (scopedClasses[0]?.id || classes[0]?.id) : selectedTurma;
    const st = students.find(s => s.id === studentId);
    checkInStudentToday(studentId, defaultTurmaId);
    if (st) triggerFeedback(st.nome);
    setShowQrSimulator(false);
  };

  const handleQuickCheckin = (studentId: string, turmaId: string, studentName: string) => {
    checkInStudentToday(studentId, turmaId);
    triggerFeedback(studentName);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Role Banner for Professor or Aluno */}
      {isProfessor && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              <UserRound className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-blue-950 block">
                Lista de Presença Vinculada • Prof. {currentUser.nome}
              </span>
              <span className="text-blue-700">
                Acesso restrito às suas turmas e aos seus {scopedStudents.length} alunos vinculados.
              </span>
            </div>
          </div>
          <span className="bg-blue-600 text-white font-bold px-2.5 py-1 rounded-lg text-[11px] shrink-0">
            Nível Professor
          </span>
        </div>
      )}

      {isAluno && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-emerald-950 block">
                Modo Aluno Ativo • {currentUser.nome}
              </span>
              <span className="text-emerald-700">
                Acompanhe seu histórico de presenças e técnicas aprendidas diretamente no seu portal.
              </span>
            </div>
          </div>
          <Link
            to="/area-aluno"
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs shrink-0 flex items-center gap-1"
          >
            Acessar Área do Aluno →
          </Link>
        </div>
      )}

      {/* Instant Feedback Toast */}
      {lastCheckinFeedback && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center gap-3 text-xs font-semibold animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          <span>{lastCheckinFeedback}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <ClipboardCheck className="w-4 h-4" />
            Controle Diário de Tatame & Histórico Técnico
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isProfessor ? `Lista de Presença • Prof. ${currentUser.nome}` : 'Presença & Frequência dos Alunos'}
          </h1>
          <p className="text-sm text-slate-500">
            Registro em tempo real de presença com sincronização automática das técnicas ensinadas no dia para o histórico de cada aluno.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {!isAluno && (
            <>
              <button
                onClick={() => setShowQrSimulator(true)}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
              >
                <QrCode className="w-4 h-4 text-emerald-400" />
                Totem / QR Code Check-in
              </button>

              <button
                onClick={() => setShowManualModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Lançar Presença Manual
              </button>
            </>
          )}

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold px-3 py-2.5 rounded-xl transition-colors no-print"
            title="Imprimir lista de presença"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pedagogical Callout / Techniques Planned for Selected Day */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-blue-950 text-white rounded-2xl p-5 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Técnicas Planejadas para esta Aula (Histórico do Aluno)
            </div>

            {currentLessonPlan ? (
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  {currentLessonPlan.temaPrincipal}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Aula programada por: <strong>{currentLessonPlan.professor}</strong> • Turma: <strong>{currentLessonPlan.turma}</strong>
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-sm font-bold text-slate-200">
                  Nenhum plano cadastrado especificamente para {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                </h3>
                <p className="text-xs text-slate-400">
                  Cadastre o plano de aula indicando as técnicas a serem ensinadas para que fiquem registradas no histórico do praticante.
                </p>
              </div>
            )}
          </div>

          {currentLessonPlan ? (
            <div className="flex items-center gap-2 flex-wrap md:justify-end">
              {plannedTechniquesList.map(t => (
                <span
                  key={t.id}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-xl backdrop-blur-xs flex items-center gap-1.5 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  {t.titulo}
                </span>
              ))}
              <Link
                to="/planejamento"
                className="text-xs text-blue-300 hover:text-white underline font-semibold ml-2"
              >
                Ver Plano Completo →
              </Link>
            </div>
          ) : (
            <Link
              to="/planejamento"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl shrink-0 transition-colors shadow-xs"
            >
              + Planejar Técnicas de Hoje
            </Link>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] text-blue-200">
          <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span>
            <strong>Regra Curricular Ativa:</strong> Todo aluno que tiver a presença confirmada nesta data terá as posições acima gravadas automaticamente como <strong>técnica aprendida</strong> em seu desenvolvimento individual.
          </span>
        </div>
      </div>

      {/* Filter and Date Bar */}
      <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 no-print">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Date Picker */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs font-semibold focus:outline-none"
            />
          </div>

          {/* Turma filter */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedTurma}
              onChange={(e) => setSelectedTurma(e.target.value)}
              className="bg-transparent text-xs font-semibold focus:outline-none"
            >
              <option value="all">Todas as Turmas do Dia</option>
              {scopedClasses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.titulo}
                </option>
              ))}
            </select>
          </div>

          {/* Search box */}
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Buscar aluno na lista..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-500 border-t md:border-t-0 pt-2 md:pt-0">
          <span>Total no dia:</span>
          <span className="font-extrabold text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
            {filteredAttendance.length} presentes
          </span>
        </div>
      </div>

      {/* Main Content: Fast Roster Check-in or Attendance list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Registered Attendances for the selected date */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 md:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Lista de Presenças Registradas ({filteredAttendance.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Data: {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>

              {isProfessor && (
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                  Prof. {currentUser.nome}
                </span>
              )}
            </div>

            {filteredAttendance.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <ClipboardCheck className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-700">Nenhuma presença nesta data</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {!isAluno 
                    ? 'Utilize o painel ao lado para registrar a chamada dos alunos presentes ou clique no botão "Totem / QR Code".'
                    : 'Nenhuma presença registrada para você nesta data selecionada.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredAttendance.map(item => {
                  const student = students.find(s => s.id === item.studentId);
                  const progressPct = student 
                    ? Math.min(100, Math.round((student.presencasNaFaixa / student.presencasMetaGrau) * 100))
                    : 50;

                  // Find techniques student learned on this date
                  const studentLearnedOnDate = student?.tecnicasAprendidas?.filter(t => t.dataAprendida === item.data) || [];

                  return (
                    <div 
                      key={item.id}
                      className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {item.studentNome.charAt(0)}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">{item.studentNome}</span>
                            <BeltBadge faixa={item.studentFaixa} graus={item.studentGraus} size="sm" />
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                            <span className="flex items-center gap-1 font-mono text-[11px]">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {item.horario}
                            </span>
                            <span>•</span>
                            <span className="truncate max-w-[200px]">{item.turmaTitulo}</span>
                          </div>

                          {/* Technique learned indicator badge */}
                          <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Técnica Aprendida Registrada
                            </span>
                            {studentLearnedOnDate.length > 0 && (
                              <span className="text-[10px] text-slate-600 font-semibold truncate max-w-[240px]">
                                ({studentLearnedOnDate.map(t => t.titulo).join(', ')})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 pl-12 sm:pl-0">
                        {/* Belt progress towards next degree */}
                        {student && (
                          <div className="text-right min-w-[120px]">
                            <div className="flex items-center justify-end gap-1 text-[11px] font-semibold text-slate-600">
                              <Award className="w-3 h-3 text-amber-500" />
                              <span>{student.presencasNaFaixa} / {student.presencasMetaGrau} aulas</span>
                            </div>
                            <div className="w-24 bg-slate-100 rounded-full h-1.5 ml-auto mt-1 overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${progressPct >= 100 ? 'bg-amber-500' : 'bg-blue-600'}`}
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {!isAluno && (
                          <button
                            onClick={() => removeAttendance(item.id)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Remover presença"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Instant Tatame Check-in Pad for students */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                Dar Presença Imediata
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">Hoje</span>
            </div>

            <p className="text-xs text-slate-500">
              {isProfessor 
                ? `Lançar presença para seus alunos vinculados (Prof. ${currentUser.nome}). As técnicas do dia serão registradas automaticamente.`
                : 'Clique em "+ Marcar" para adicionar o aluno instantaneamente à aula de hoje:'}
            </p>

            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {scopedStudents.map(student => {
                const targetTurma = selectedTurma === 'all' ? (scopedClasses[0]?.id || classes[0]?.id) : selectedTurma;
                const isCheckedToday = attendance.some(
                  a => a.studentId === student.id && a.data === selectedDate
                );

                return (
                  <div
                    key={student.id}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                      isCheckedToday
                        ? 'bg-emerald-50/50 border-emerald-200/80'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-xs text-slate-800 truncate">{student.nome}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <BeltBadge faixa={student.faixa} graus={student.graus} size="sm" showLabel={false} />
                        <span className="text-[10px] text-slate-500 font-mono">
                          {student.presencasNaFaixa} treinos
                        </span>
                      </div>
                    </div>

                    {!isAluno && (
                      <button
                        onClick={() => handleQuickCheckin(student.id, targetTurma, student.nome)}
                        disabled={isCheckedToday}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors shrink-0 ${
                          isCheckedToday
                            ? 'bg-emerald-600 text-white cursor-default'
                            : 'bg-slate-900 hover:bg-blue-600 text-white'
                        }`}
                      >
                        {isCheckedToday ? '✓ Presente' : '+ Marcar'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Manual Attendance Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Lançar Presença Manual</h3>
              <button onClick={() => setShowManualModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Selecionar Aluno</label>
                <select
                  value={manualStudentId}
                  onChange={(e) => setManualStudentId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800 font-medium"
                >
                  {scopedStudents.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.nome} ({s.faixa} {s.graus}º grau)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Turma / Horário</label>
                <select
                  value={manualTurmaId}
                  onChange={(e) => setManualTurmaId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800 font-medium"
                >
                  {scopedClasses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.titulo} ({c.horario})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Horário de Entrada</label>
                <input
                  type="time"
                  value={manualTime}
                  onChange={(e) => setManualTime(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800 font-medium"
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-blue-900 text-[11px]">
                💡 Ao salvar a presença, as técnicas associadas ao planejamento desta aula serão adicionadas automaticamente ao histórico do aluno.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                >
                  Salvar Presença & Sincronizar Técnicas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Simulator Modal */}
      {showQrSimulator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 text-center">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Simulador de Totem Tatame
              </span>
              <button onClick={() => setShowQrSimulator(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-slate-900 rounded-2xl text-white space-y-3">
              <div className="w-20 h-20 bg-white p-2 rounded-xl mx-auto shadow-md flex items-center justify-center">
                <QrCode className="w-16 h-16 text-slate-900" />
              </div>
              <h4 className="font-bold text-sm">Aproxime a Carteirinha ou Celular</h4>
              <p className="text-xs text-slate-400">
                Simule a leitura rápida do QR Code de um aluno para dar check-in instantâneo:
              </p>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto text-left">
              {scopedStudents.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleSimulateQr(s.id)}
                  className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 transition-colors flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-slate-800">{s.nome}</span>
                  <span className="text-emerald-700 font-bold">Bipar Aluno →</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
