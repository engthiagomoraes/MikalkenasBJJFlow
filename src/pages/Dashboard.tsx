import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { 
  Users, 
  ClipboardCheck, 
  Award, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  BookOpen,
  Send,
  Zap,
  UserCheck,
  UserRound,
  ShieldCheck
} from 'lucide-react';
import { useBjj } from '../context/BjjContext';
import { BeltBadge } from '../components/ui/BeltBadge';

export const Dashboard: React.FC = () => {
  const { 
    currentUser,
    students, 
    attendance, 
    classes, 
    lessonPlans, 
    payments, 
    graduations, 
    notifications,
    academySettings,
    checkInStudentToday 
  } = useBjj();

  // If current logged in user is a student, redirect directly to Area do Aluno
  if (currentUser.role === 'aluno') {
    return <Navigate to="/area-aluno" replace />;
  }

  const isProfessor = currentUser.role === 'professor';

  // Scoped data based on role
  const scopedStudents = isProfessor 
    ? students.filter(s => s.professorId === currentUser.professorId || s.professorNome === currentUser.nome)
    : students;

  const scopedPayments = isProfessor
    ? payments.filter(p => p.professorId === currentUser.professorId || p.professorNome === currentUser.nome)
    : payments;

  const scopedAttendance = isProfessor
    ? attendance.filter(a => scopedStudents.some(s => s.id === a.studentId))
    : attendance;

  const [selectedTurmaId, setSelectedTurmaId] = useState<string>(classes[0]?.id || '');
  const [quickSearch, setQuickSearch] = useState('');

  // Calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = scopedAttendance.filter(a => a.data === todayStr);
  const eligibleStudents = scopedStudents.filter(s => s.presencasNaFaixa >= s.presencasMetaGrau);
  const overduePayments = scopedPayments.filter(p => p.status === 'atrasado');
  
  // Total Revenue this month
  const totalRevenue = scopedPayments
    .filter(p => p.status === 'em_dia')
    .reduce((acc, curr) => acc + curr.valor, 0);
  const pendingRevenue = scopedPayments
    .filter(p => p.status === 'pendente' || p.status === 'atrasado')
    .reduce((acc, curr) => acc + curr.valor, 0);

  // Next planned lesson
  const currentLesson = lessonPlans.find(l => l.data === todayStr) || lessonPlans[0];

  // Distribution by plan
  const planCounts = {
    regular: scopedStudents.filter(s => s.plano === 'regular').length,
    infantil: scopedStudents.filter(s => s.plano === 'infantil').length,
    bolsista: scopedStudents.filter(s => s.plano === 'bolsista').length,
    projeto_social: scopedStudents.filter(s => s.plano === 'projeto_social').length,
  };

  // Distribution by belt
  const beltCounts: Record<string, number> = {};
  scopedStudents.forEach(s => {
    beltCounts[s.faixa] = (beltCounts[s.faixa] || 0) + 1;
  });

  const filteredStudentsForCheckIn = scopedStudents.filter(s => 
    s.nome.toLowerCase().includes(quickSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              {isProfessor ? `Painel do Professor • ${currentUser.nome}` : 'Painel do Mestre Administrador • Acesso Total'}
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              {isProfessor ? `Tatame de ${currentUser.nome}` : (academySettings.nomeAcademia || 'Mikalkenas Jiu Jitsu')}
            </h1>
            <p className="text-slate-300 text-sm max-w-xl">
              {isProfessor 
                ? `Visão consolidada dos seus ${scopedStudents.length} alunos vinculados, presenças hoje nas suas turmas, mensalidades e repasse via PIX.`
                : 'Acompanhamento integrado de presenças diárias, progressão de faixas e graus, planejamento pedagógico e controle financeiro de turmas regulares, infantis, atletas bolsistas e projeto social.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/presenca"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              <ClipboardCheck className="w-4 h-4" />
              Chamada do Dia ({todayAttendance.length})
            </Link>
            <Link
              to="/planejamento"
              className="bg-slate-700/80 hover:bg-slate-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl border border-slate-600 transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Plano de Aula
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Alunos Ativos</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900">{students.length}</div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-emerald-600 font-semibold font-mono">100%</span> no tatame este semestre
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Presença Hoje</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900">{todayAttendance.length}</div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-emerald-600 font-semibold">Check-ins</span> registrados hoje
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Aptos à Graduação</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900">{eligibleStudents.length}</div>
            <Link to="/graduacao" className="text-xs text-amber-600 font-semibold hover:underline mt-1 inline-flex items-center gap-1">
              Ver elegíveis para grau/faixa <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Mensalidades Recebidas</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900">
              R$ {totalRevenue.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-amber-600 font-semibold">R$ {pendingRevenue.toLocaleString('pt-BR')}</span> a receber
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Check-in & Today's Class Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Check-in Tatame Box */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                Chamada Rápida de Presença
              </h2>
              <p className="text-xs text-slate-500">Selecione a turma e marque a presença do praticante com 1 clique</p>
            </div>

            <div className="w-full sm:w-64">
              <select
                value={selectedTurmaId}
                onChange={(e) => setSelectedTurmaId(e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.titulo} ({c.horario})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Buscar aluno por nome para dar presença..."
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>

          {/* Student list for quick check-in */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
            {filteredStudentsForCheckIn.map(student => {
              const isCheckedIn = attendance.some(
                a => a.studentId === student.id && a.turmaId === selectedTurmaId && a.data === todayStr
              );

              return (
                <div 
                  key={student.id}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isCheckedIn 
                      ? 'bg-emerald-50/60 border-emerald-200' 
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-800 truncate">{student.nome}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <BeltBadge faixa={student.faixa} graus={student.graus} size="sm" />
                      <span className="text-[11px] text-slate-500 font-mono">
                        {student.presencasNaFaixa} aulas
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => checkInStudentToday(student.id, selectedTurmaId)}
                    disabled={isCheckedIn}
                    className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                      isCheckedIn 
                        ? 'bg-emerald-600 text-white cursor-default' 
                        : 'bg-slate-900 hover:bg-blue-600 text-white shadow-xs'
                    }`}
                  >
                    {isCheckedIn ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Presente
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 text-amber-400" /> Marcar
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Lesson Plan Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                Plano de Aula Hoje
              </span>
              <span className="text-xs text-slate-400 font-mono">Semana {currentLesson?.semanaCiclo}</span>
            </div>

            <h3 className="font-extrabold text-base text-slate-900 leading-snug">
              {currentLesson?.temaPrincipal}
            </h3>

            <div className="mt-4 space-y-3 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-900 block mb-0.5">🥋 Aquecimento & Mobilidade:</span>
                {currentLesson?.aquecimento}
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-slate-800">
                <span className="font-bold text-blue-900 block mb-0.5">🎯 Técnica Principal:</span>
                {currentLesson?.tecnicaPrincipal}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-900 block mb-0.5">⏱️ Sparring & Drills:</span>
                {currentLesson?.treinoEspecificoRola}
              </div>
            </div>
          </div>

          <Link
            to="/planejamento"
            className="w-full text-center text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 py-2.5 rounded-xl transition-colors block"
          >
            Ver todos os ciclos de aula →
          </Link>
        </div>
      </div>

      {/* Categories & Financial Distribution Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Category breakdown (Regular, Infantil, Bolsista, Social) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Categorias de Matrícula
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  REG
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-800">Alunos Regulares</p>
                  <p className="text-xs text-slate-500">R$ 180,00 / mês</p>
                </div>
              </div>
              <span className="text-base font-extrabold text-slate-900">{planCounts.regular}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 border border-amber-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                  KID
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-800">Turma Infantil (Kids)</p>
                  <p className="text-xs text-slate-500">R$ 130,00 / mês</p>
                </div>
              </div>
              <span className="text-base font-extrabold text-amber-900">{planCounts.infantil}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50/60 border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
                  BOL
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-800">Atletas Bolsistas</p>
                  <p className="text-xs text-slate-500">Bolsa Atleta (R$ 70)</p>
                </div>
              </div>
              <span className="text-base font-extrabold text-purple-900">{planCounts.bolsista}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  SOC
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-800">Projeto Social Gratuito</p>
                  <p className="text-xs text-emerald-700 font-medium">100% Isento • Inclusão</p>
                </div>
              </div>
              <span className="text-base font-extrabold text-emerald-900">{planCounts.projeto_social}</span>
            </div>
          </div>
        </div>

        {/* Belts Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Distribuição por Faixas
            </h3>
            <Link to="/graduacao" className="text-xs text-blue-600 font-semibold hover:underline">
              Graduar
            </Link>
          </div>

          <div className="space-y-2.5">
            {Object.entries(beltCounts).map(([belt, count]) => (
              <div key={belt} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BeltBadge faixa={belt as any} graus={0} size="sm" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-slate-800 h-full rounded-full" 
                      style={{ width: `${Math.min(100, (count / students.length) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700 w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & Next Steps */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Avisos & Alertas
          </h3>

          <div className="space-y-3 text-xs">
            {eligibleStudents.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5">
                <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-900">
                    {eligibleStudents.length} {eligibleStudents.length === 1 ? 'aluno atingiu' : 'alunos atingiram'} o tempo para graduação!
                  </p>
                  <p className="text-amber-800 mt-0.5">
                    {eligibleStudents.map(s => s.nome.split(' ')[0]).join(', ')} estão prontos para receber novo grau ou faixa.
                  </p>
                </div>
              </div>
            )}

            {overduePayments.length > 0 && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-rose-900">
                    {overduePayments.length} mensalidades em atraso
                  </p>
                  <p className="text-rose-800 mt-0.5">
                    Envie lembrete automático via WhatsApp com a chave PIX pelo menu Financeiro.
                  </p>
                </div>
              </div>
            )}

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-blue-900">Sábado: Open Mat & Rola Livre</p>
                <p className="text-blue-800 mt-0.5">
                  10:00 às 12:00 aberto a todos os alunos para treino de sparring e integração.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
