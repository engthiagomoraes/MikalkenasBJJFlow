import React from 'react';
import { BarChart3, TrendingUp, Users, Calendar, Award, Printer, ShieldCheck } from 'lucide-react';
import { useBjj } from '../context/BjjContext';
import { BeltBadge } from '../components/ui/BeltBadge';

export const Relatorios: React.FC = () => {
  const { students, attendance, payments, graduations, currentUser } = useBjj();

  const isProfessor = currentUser.role === 'professor';

  // Scoped data
  const scopedStudents = isProfessor
    ? students.filter(s => s.professorId === currentUser.professorId || (s.professorNome && s.professorNome.toLowerCase() === currentUser.nome.toLowerCase()))
    : students;

  const scopedAttendance = isProfessor
    ? attendance.filter(a => scopedStudents.some(s => s.id === a.studentId))
    : attendance;

  const scopedGraduations = isProfessor
    ? graduations.filter(g => scopedStudents.some(s => s.id === g.studentId) || (g.professorAvaliador && g.professorAvaliador.toLowerCase() === currentUser.nome.toLowerCase()))
    : graduations;

  // Metrics
  const totalPresencas = scopedAttendance.length;
  const regularStudents = scopedStudents.filter(s => s.plano === 'regular').length;
  const kidsStudents = scopedStudents.filter(s => s.plano === 'infantil').length;
  const bolsistaStudents = scopedStudents.filter(s => s.plano === 'bolsista').length;
  const socialStudents = scopedStudents.filter(s => s.plano === 'projeto_social').length;

  // Most consistent students
  const topStudents = [...scopedStudents].sort((a, b) => b.totalPresencasHistorico - a.totalPresencasHistorico).slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            {isProfessor ? 'Área Docente • Auditoria de Alunos' : 'Estatísticas & Auditoria'}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isProfessor ? `Relatórios dos Alunos • Prof. ${currentUser.nome}` : 'Relatórios Gerais de Desempenho'}
          </h1>
          <p className="text-sm text-slate-500">
            {isProfessor 
              ? `Visão consolidada de assiduidade, retenção e graduações dos seus ${scopedStudents.length} alunos vinculados.`
              : 'Visão consolidada de assiduidade, retenção de praticantes e métricas de tatame.'}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm no-print"
        >
          <Printer className="w-4 h-4" />
          Imprimir Relatório
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {isProfessor ? 'Seus Alunos Vinculados' : 'Total de Alunos'}
          </span>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{scopedStudents.length}</div>
          <p className="text-xs text-slate-500 mt-1">100% ativos no tatame</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Presenças Lançadas</span>
          <div className="text-3xl font-extrabold text-blue-600 mt-2">{totalPresencas}</div>
          <p className="text-xs text-slate-500 mt-1">Treinos computados</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Graduações Registradas</span>
          <div className="text-3xl font-extrabold text-amber-600 mt-2">{scopedGraduations.length}</div>
          <p className="text-xs text-slate-500 mt-1">Diplomas e promoções</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Projeto Social & Bolsas</span>
          <div className="text-3xl font-extrabold text-emerald-600 mt-2">{socialStudents + bolsistaStudents}</div>
          <p className="text-xs text-slate-500 mt-1">Atletas apoiados</p>
        </div>
      </div>

      {/* Top 5 Most Consistent Students */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          Ranking de Assiduidade (Atletas Mais Constantes)
        </h3>

        <div className="divide-y divide-slate-100">
          {topStudents.map((st, i) => (
            <div key={st.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center ${
                  i === 0 ? 'bg-amber-400 text-amber-950' :
                  i === 1 ? 'bg-slate-300 text-slate-800' :
                  i === 2 ? 'bg-amber-700 text-white' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {i + 1}º
                </span>
                <div>
                  <span className="font-bold text-sm text-slate-900">{st.nome}</span>
                  <div className="mt-0.5">
                    <BeltBadge faixa={st.faixa} graus={st.graus} size="sm" />
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-mono font-extrabold text-slate-900 block">
                  {st.totalPresencasHistorico} treinos
                </span>
                <span className="text-xs text-slate-400">
                  {st.performance.tempoRolaMinutos} min de rola
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
