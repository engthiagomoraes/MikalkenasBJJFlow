import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Printer, 
  ChevronRight, 
  FileText, 
  ShieldCheck, 
  AlertCircle,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { useBjj } from '../context/BjjContext';
import { BeltBadge, BELT_INFO } from '../components/ui/BeltBadge';
import { GraduationCertificate } from '../components/certificate/GraduationCertificate';
import { StudentPdfReportModal } from '../components/report/StudentPdfReportModal';
import { BeltColor, Student } from '../types';

export const Graduacao: React.FC = () => {
  const { 
    currentUser,
    students, 
    graduations, 
    instructors, 
    graduateStudent, 
    academySettings,
    getStudentGraduationStatus,
    getBeltGraduationRule 
  } = useBjj();

  // Category filter
  const [categoryFilter, setCategoryFilter] = useState<'todos' | 'adulto' | 'infantil' | 'aptos'>('todos');

  // Modal promotion state
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [promotionMode, setPromotionMode] = useState<'grau' | 'faixa_direta'>('grau');
  const [targetFaixa, setTargetFaixa] = useState<BeltColor>('azul');
  const [targetGraus, setTargetGraus] = useState<number>(0);
  const [evaluatorProfessor, setEvaluatorProfessor] = useState<string>(instructors[0]?.nome || '');
  const [promotionNotes, setPromotionNotes] = useState<string>('');

  // Report modal state
  const [reportStudent, setReportStudent] = useState<Student | null>(null);

  // Certificate modal state
  const [certificateData, setCertificateData] = useState<{
    studentNome: string;
    faixa: BeltColor;
    graus: number;
    data: string;
    professorNome: string;
  } | null>(null);

  // Status mapping
  const studentStatusMap = new Map(students.map(s => [s.id, getStudentGraduationStatus(s)]));

  // Eligible students (apto por carga de aulas)
  const eligibleStudents = students.filter(s => {
    const st = studentStatusMap.get(s.id);
    return st ? st.aptoPorAulas : s.presencasNaFaixa >= s.presencasMetaGrau;
  });

  const fullyEligibleIBJJF = students.filter(s => {
    const st = studentStatusMap.get(s.id);
    return st?.aptoTotalIBJJF;
  });

  const openPromotionModal = (student: Student) => {
    if (currentUser.role !== 'admin') {
      return;
    }
    setSelectedStudent(student);
    const status = getStudentGraduationStatus(student);
    const isApenasFaixas = student.sistemaGraduacao === 'apenas_faixas';

    if (isApenasFaixas || student.graus >= 4) {
      setPromotionMode('faixa_direta');
      setTargetFaixa(status.proximaFaixa);
      setTargetGraus(0);
    } else {
      setPromotionMode('grau');
      setTargetFaixa(student.faixa);
      setTargetGraus(student.graus + 1);
    }

    setPromotionNotes('Excelente assiduidade nos treinos, postura de respeito e evolução técnica comprovada em exame prático.');
  };

  const handleConfirmPromotion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    graduateStudent(
      selectedStudent.id,
      targetFaixa,
      targetGraus,
      evaluatorProfessor,
      promotionNotes
    );

    // Prompt certificate
    setCertificateData({
      studentNome: selectedStudent.nome,
      faixa: targetFaixa,
      graus: targetGraus,
      data: new Date().toISOString().split('T')[0],
      professorNome: evaluatorProfessor
    });

    setSelectedStudent(null);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            Sistema Oficial de Graduação (CBJJ / IBJJF)
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Gestão de Graus & Mudança de Faixas
          </h1>
          <p className="text-sm text-slate-500">
            Acompanhe o tempo de tatame, número de aulas concluídas e emita certificados oficiais de promoção.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
          <span>{eligibleStudents.length} {eligibleStudents.length === 1 ? 'atleta apto' : 'atletas aptos'} para grau ou nova faixa</span>
        </div>
      </div>

      {/* Eligible for promotion Alert / Spotlight section */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-extrabold text-base text-slate-900">
                Fila de Espera para Graduação (Metas de Aulas Cumpridas)
              </h2>
              <p className="text-xs text-slate-500">
                Alunos que atingiram a carga horária de tatame requerida para o próximo grau ou nova faixa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
              {eligibleStudents.length} Aptos por Aulas
            </span>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
              {fullyEligibleIBJJF.length} 100% IBJJF (Aulas + Carência)
            </span>
          </div>
        </div>

        {eligibleStudents.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-white/60 rounded-xl border border-dashed border-amber-200">
            Nenhum aluno atingiu a meta de presença no momento. Conforme os alunos comparecerem às aulas, eles aparecerão aqui automaticamente.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eligibleStudents.map(student => {
              const status = studentStatusMap.get(student.id) || getStudentGraduationStatus(student);
              const isInfantil = status.rule.categoria === 'infantil';

              return (
                <div 
                  key={student.id}
                  className="bg-white p-4 rounded-xl border border-amber-200/80 shadow-xs flex items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-900 truncate">{student.nome}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isInfantil ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {isInfantil ? 'Kids' : 'Adulto'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <BeltBadge faixa={student.faixa} graus={student.graus} size="sm" />
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {student.presencasNaFaixa} de {status.metaAulas} aulas ({status.progressoAulasPct}%)
                      </span>
                    </div>

                    {/* IBJJF Time compliance badge */}
                    <div className="flex items-center gap-2 flex-wrap pt-0.5">
                      <span className={`text-[11px] font-semibold flex items-center gap-1 ${
                        status.tempoMinimoCumprido ? 'text-emerald-700' : 'text-amber-700'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {status.tempoMinimoCumprido ? (
                          `✓ Tempo IBJJF Cumprido (${status.mesesNaFaixa} meses na faixa)`
                        ) : (
                          `Carência IBJJF: faltam ${status.tempoMinimoMesesIBJJF - status.mesesNaFaixa} meses (${status.mesesNaFaixa}/${status.tempoMinimoMesesIBJJF}m)`
                        )}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => openPromotionModal(student)}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md shadow-amber-500/20 shrink-0 flex items-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5" />
                    Graduar Agora
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Progress of All Students */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Progresso Geral de Todos os Praticantes
            </h3>
            <p className="text-xs text-slate-500">
              Cálculo individual conforme a meta de cada faixa e carência de tempo oficial da IBJJF
            </p>
          </div>

          {/* Category Tabs Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
            <button
              onClick={() => setCategoryFilter('todos')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                categoryFilter === 'todos' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({students.length})
            </button>
            <button
              onClick={() => setCategoryFilter('adulto')}
              className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                categoryFilter === 'adulto' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              Adulto
            </button>
            <button
              onClick={() => setCategoryFilter('infantil')}
              className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                categoryFilter === 'infantil' ? 'bg-white text-amber-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              Infantil (Kids)
            </button>
            <button
              onClick={() => setCategoryFilter('aptos')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                categoryFilter === 'aptos' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Aptos ({eligibleStudents.length})
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {students
            .filter(student => {
              const status = studentStatusMap.get(student.id) || getStudentGraduationStatus(student);
              if (categoryFilter === 'adulto') return status.rule.categoria === 'adulto';
              if (categoryFilter === 'infantil') return status.rule.categoria === 'infantil';
              if (categoryFilter === 'aptos') return status.aptoPorAulas;
              return true;
            })
            .map(student => {
              const status = studentStatusMap.get(student.id) || getStudentGraduationStatus(student);
              const pct = status.progressoAulasPct;
              const isReady = status.aptoPorAulas;
              const isInfantil = status.rule.categoria === 'infantil';

              return (
                <div 
                  key={student.id}
                  className="p-4 md:p-5 hover:bg-slate-50/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {student.nome.charAt(0)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900">{student.nome}</span>
                        <BeltBadge faixa={student.faixa} graus={student.graus} size="sm" />
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isInfantil ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {isInfantil ? 'Kids' : 'Adulto'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                        <span>Tempo na Faixa: <strong className="text-slate-700">{status.mesesNaFaixa} meses</strong></span>
                        <span>•</span>
                        <span className={`flex items-center gap-1 font-semibold ${
                          status.tempoMinimoCumprido ? 'text-emerald-700' : 'text-amber-700'
                        }`}>
                          <Clock className="w-3 h-3" />
                          {status.tempoMinimoCumprido ? 'Mín. IBJJF Cumprido' : `Mín. IBJJF: ${status.tempoMinimoMesesIBJJF}m (${status.tempoMinimoMesesIBJJF - status.mesesNaFaixa}m restantes)`}
                        </span>
                        <span>•</span>
                        <span>Próximo Passo: <strong className="text-slate-800">{status.proximaMetaDescricao}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 pl-13 md:pl-0">
                    <div className="min-w-[190px]">
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-600">Presença no Grau:</span>
                        <span className={`font-mono ${isReady ? 'text-amber-600 font-bold' : 'text-slate-700'}`}>
                          {student.presencasNaFaixa} / {status.metaAulas} aulas ({pct}%)
                        </span>
                      </div>

                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isReady ? 'bg-amber-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {currentUser.role === 'admin' ? (
                        <button
                          onClick={() => openPromotionModal(student)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                            isReady 
                              ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          <Award className="w-3.5 h-3.5" />
                          {isReady ? 'Graduar' : 'Avaliar'}
                        </button>
                      ) : (
                        <span 
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                            isReady 
                              ? 'bg-amber-50 border-amber-200 text-amber-800' 
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                          title="A outorga de graduação é de competência exclusiva do Administrador"
                        >
                          <Award className="w-3 h-3 text-amber-500" />
                          {isReady ? 'Apto (Admin)' : 'Em evolução'}
                        </span>
                      )}

                      <button
                        onClick={() => setReportStudent(student)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                        title="Gerar Relatório em PDF para o Aluno"
                      >
                        <FileText className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setCertificateData({
                          studentNome: student.nome,
                          faixa: student.faixa,
                          graus: student.graus,
                          data: student.dataUltimaGraduacao,
                          professorNome: student.professorNome || instructors[0]?.nome || academySettings.mestreResponsavel || 'Mestre Responsável'
                        })}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                        title="Ver / Imprimir Certificado de Graduação"
                      >
                        <Award className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Graduation Log History */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base">
            Histórico Oficial de Graduações & Exames de Faixa
          </h3>
          <p className="text-xs text-slate-500">
            Registro com data, mestre outorgante e parecer técnico
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {graduations.map(grad => (
            <div key={grad.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{grad.studentNome}</span>
                  <span className="text-xs text-slate-400">foi promovido:</span>
                  <BeltBadge faixa={grad.faixaAnterior} graus={grad.grausAnteriores} size="sm" />
                  <span className="text-xs text-slate-400">➔</span>
                  <BeltBadge faixa={grad.novaFaixa} graus={grad.novosGraus} size="sm" />
                </div>

                <p className="text-xs text-slate-600 italic">
                  "{grad.motivoObservacao}"
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-500 font-mono pt-1">
                  <span>Data: {new Date(grad.data + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                  <span>•</span>
                  <span>Avaliador: {grad.professorAvaliador}</span>
                </div>
              </div>

              <button
                onClick={() => setCertificateData({
                  studentNome: grad.studentNome,
                  faixa: grad.novaFaixa,
                  graus: grad.novosGraus,
                  data: grad.data,
                  professorNome: grad.professorAvaliador
                })}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg shrink-0"
              >
                <Printer className="w-3.5 h-3.5" />
                Imprimir Diploma
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Promotion Ceremony Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5 my-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Graduar Praticante</h3>
                  <p className="text-xs text-slate-500">Outorga de Novo Grau ou Nova Faixa</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedStudent(null)} 
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Student Current Info */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-slate-900">{selectedStudent.nome}</p>
                <p className="text-xs text-slate-500">
                  {selectedStudent.presencasNaFaixa} presenças • Sistema: {selectedStudent.sistemaGraduacao === 'apenas_faixas' ? 'Somente Faixa Direta' : 'Graus e Faixa'}
                </p>
              </div>
              <BeltBadge faixa={selectedStudent.faixa} graus={selectedStudent.graus} sistemaGraduacao={selectedStudent.sistemaGraduacao} size="sm" />
            </div>

            {/* Promotion Mode Selector */}
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setPromotionMode('grau');
                  if (selectedStudent) {
                    setTargetFaixa(selectedStudent.faixa);
                    setTargetGraus(Math.min(4, selectedStudent.graus + 1));
                  }
                }}
                className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs transition-all ${
                  promotionMode === 'grau' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. Promover Grau (+1 Grau)
              </button>
              <button
                type="button"
                onClick={() => {
                  setPromotionMode('faixa_direta');
                  setTargetGraus(0);
                  const beltProgression: Record<BeltColor, BeltColor> = {
                    branca: 'azul', cinza: 'amarela', amarela: 'laranja', laranja: 'verde', verde: 'azul', azul: 'roxa', roxa: 'marrom', marrom: 'preta', preta: 'preta'
                  };
                  if (selectedStudent) {
                    setTargetFaixa(beltProgression[selectedStudent.faixa] || 'azul');
                  }
                }}
                className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs transition-all ${
                  promotionMode === 'faixa_direta' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2. Troca Direta de Faixa
              </button>
            </div>

            <form onSubmit={handleConfirmPromotion} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nova Faixa</label>
                  <select
                    value={targetFaixa}
                    onChange={(e) => setTargetFaixa(e.target.value as BeltColor)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 capitalize font-semibold"
                  >
                    {Object.keys(BELT_INFO).map((b) => (
                      <option key={b} value={b} className="capitalize">
                        Faixa {b}
                      </option>
                    ))}
                  </select>
                </div>

                {promotionMode === 'grau' ? (
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Novos Graus (0 a 4)</label>
                    <select
                      value={targetGraus}
                      onChange={(e) => setTargetGraus(Number(e.target.value))}
                      className="w-full border border-slate-300 rounded-lg p-2.5 font-semibold"
                    >
                      <option value={0}>0 Grau (Faixa Lisa)</option>
                      <option value={1}>1º Grau</option>
                      <option value={2}>2º Grau</option>
                      <option value={3}>3º Grau</option>
                      <option value={4}>4º Grau</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Graus (Sistema Direto)</label>
                    <div className="p-2.5 bg-slate-100 rounded-lg font-semibold text-slate-500">
                      Sem graus (Troca direta de faixa)
                    </div>
                  </div>
                )}
              </div>

              {/* Preview of new belt badge & IBJJF Rule */}
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 text-center space-y-2">
                <span className="text-[11px] font-bold text-amber-900 block">
                  Visualização da Nova Graduação:
                </span>
                <div className="flex justify-center">
                  <BeltBadge faixa={targetFaixa} graus={promotionMode === 'faixa_direta' ? 0 : targetGraus} hideGraus={promotionMode === 'faixa_direta'} size="md" />
                </div>
              </div>

              {/* Destination Belt IBJJF Criteria Info */}
              {(() => {
                const targetRule = getBeltGraduationRule(targetFaixa);
                return (
                  <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-950 space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-blue-600" />
                        Critério Oficial IBJJF ({targetRule.nome}):
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        targetRule.categoria === 'infantil' ? 'bg-amber-100 text-amber-800' : 'bg-blue-200 text-blue-800'
                      }`}>
                        {targetRule.categoria} (a partir de {targetRule.idadeMinima} anos)
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      • Tempo Mínimo Regulamentar: <strong>{targetRule.tempoMinimoDescricao}</strong><br/>
                      • Carga de Tatame: <strong>{targetRule.aulasPorGrau} aulas por grau</strong> (ou <strong>{targetRule.aulasPorFaixaDireta} aulas</strong> no sistema direto sem graus).
                    </p>
                  </div>
                );
              })()}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mestre / Professor Avaliador</label>
                <select
                  value={evaluatorProfessor}
                  onChange={(e) => setEvaluatorProfessor(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 font-semibold"
                >
                  {instructors.map(i => (
                    <option key={i.id} value={i.nome}>{i.nome} ({i.registroCBJJ})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Parecer Técnico / Observações da Outorga</label>
                <textarea
                  rows={2}
                  value={promotionNotes}
                  onChange={(e) => setPromotionNotes(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5"
                  placeholder="Ex: Desempenho técnico impecável, espírito esportivo e pontualidade."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold shadow-md shadow-amber-500/20"
                >
                  🎉 Confirmar e Emitir Diploma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Diploma Certificate Modal */}
      {certificateData && (
        <GraduationCertificate
          studentNome={certificateData.studentNome}
          faixa={certificateData.faixa}
          graus={certificateData.graus}
          data={certificateData.data}
          professorNome={certificateData.professorNome}
          onClose={() => setCertificateData(null)}
        />
      )}

      {/* Student PDF Report Modal */}
      {reportStudent && (
        <StudentPdfReportModal
          student={reportStudent}
          onClose={() => setReportStudent(null)}
        />
      )}
    </div>
  );
};
