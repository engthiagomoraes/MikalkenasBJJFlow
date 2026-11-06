import React, { useState } from 'react';
import { 
  X, 
  Award, 
  Activity, 
  Plus, 
  Calendar, 
  UserCheck, 
  Edit3, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Clock, 
  Target, 
  Info,
  Layers,
  User,
  Phone,
  Mail,
  Shield,
  Flame,
  ArrowRight
} from 'lucide-react';
import { useBjj } from '../../context/BjjContext';
import { 
  Student, 
  StudentEvaluation, 
  DevelopmentScores, 
  EVALUATION_DIMENSIONS,
  EvaluationDimension
} from '../../types';
import { BeltBadge } from '../ui/BeltBadge';
import { DevelopmentRadarChart } from '../charts/DevelopmentRadarChart';

interface StudentProfileModalProps {
  student: Student;
  onClose: () => void;
  onOpenPdfReport?: (student: Student) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  onClose,
  onOpenPdfReport
}) => {
  const { 
    currentUser, 
    instructors, 
    getStudentEvaluations, 
    addStudentEvaluation, 
    updateStudentEvaluation, 
    deleteStudentEvaluation,
    hasPermission 
  } = useBjj();

  // Permissões de edição e exclusão
  const canManage = currentUser.role !== 'aluno' && (
    currentUser.isMasterAdmin || 
    hasPermission('canManageStudents') ||
    student.professorId === currentUser.professorId ||
    (student.professorNome && student.professorNome.toLowerCase() === currentUser.nome.toLowerCase())
  );

  // Tabs da ficha
  const [activeTab, setActiveTab] = useState<'avaliacoes' | 'cadastrais' | 'tatame'>('avaliacoes');

  // Lista de avaliações do aluno ordenadas cronologicamente decrescente
  const studentEvaluations = getStudentEvaluations(student.id);

  // Avaliação selecionada para exibição
  const [selectedEvalId, setSelectedEvalId] = useState<string>(
    studentEvaluations.length > 0 ? studentEvaluations[0].id : ''
  );

  // Modo de comparação
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonEvalId, setComparisonEvalId] = useState<string>(
    studentEvaluations.length > 1 ? studentEvaluations[1].id : ''
  );

  // Formulário de Criação / Edição
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvalId, setEditingEvalId] = useState<string | null>(null);

  // Estado do formulário
  const todayStr = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState<{
    data: string;
    avaliadorId: string;
    avaliadorNome: string;
    scores: DevelopmentScores;
    observacoes: string;
    focoDesenvolvimento: string;
  }>({
    data: todayStr,
    avaliadorId: currentUser.professorId || instructors[0]?.id || '',
    avaliadorNome: currentUser.nome || instructors[0]?.nome || '',
    scores: {
      guarda: 7.0,
      passagem: 7.0,
      quedas: 6.0,
      finalizacoes: 6.5,
      defesa: 7.0,
      disciplina: 9.0
    },
    observacoes: '',
    focoDesenvolvimento: ''
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Confirmação de exclusão
  const [evalToDelete, setEvalToDelete] = useState<StudentEvaluation | null>(null);

  // Avaliação primária ativa
  const primaryEval = studentEvaluations.find(e => e.id === selectedEvalId) || studentEvaluations[0] || null;
  // Avaliação de comparação
  const comparisonEval = isComparing 
    ? (studentEvaluations.find(e => e.id === comparisonEvalId) || null) 
    : null;

  // Média aritmética
  const calculateAverage = (scores: DevelopmentScores) => {
    const total = EVALUATION_DIMENSIONS.reduce((sum, dim) => sum + (scores[dim.key] || 0), 0);
    return (total / 6).toFixed(1);
  };

  // Abrir modal de criação
  const handleOpenCreateForm = () => {
    setEditingEvalId(null);
    setFormData({
      data: todayStr,
      avaliadorId: currentUser.professorId || instructors[0]?.id || '',
      avaliadorNome: currentUser.nome || instructors[0]?.nome || '',
      scores: {
        guarda: 7.0,
        passagem: 7.0,
        quedas: 6.0,
        finalizacoes: 6.5,
        defesa: 7.0,
        disciplina: 9.0
      },
      observacoes: '',
      focoDesenvolvimento: ''
    });
    setFormError(null);
    setIsFormOpen(true);
  };

  // Abrir modal de edição
  const handleOpenEditForm = (evalObj: StudentEvaluation) => {
    setEditingEvalId(evalObj.id);
    setFormData({
      data: evalObj.data,
      avaliadorId: evalObj.avaliadorId || '',
      avaliadorNome: evalObj.avaliadorNome || '',
      scores: { ...evalObj.scores },
      observacoes: evalObj.observacoes || '',
      focoDesenvolvimento: evalObj.focoDesenvolvimento || ''
    });
    setFormError(null);
    setIsFormOpen(true);
  };

  // Salvar avaliação (Criar ou Editar)
  const handleSaveEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) {
      setFormError('Você não tem permissão para salvar avaliações.');
      return;
    }

    setIsSaving(true);
    setFormError(null);

    try {
      const prof = instructors.find(i => i.id === formData.avaliadorId);
      const avaliadorNome = prof ? prof.nome : formData.avaliadorNome || currentUser.nome;

      if (editingEvalId) {
        await updateStudentEvaluation(editingEvalId, {
          data: formData.data,
          avaliadorId: formData.avaliadorId,
          avaliadorNome,
          scores: formData.scores,
          observacoes: formData.observacoes,
          focoDesenvolvimento: formData.focoDesenvolvimento
        });
      } else {
        const created = await addStudentEvaluation({
          studentId: student.id,
          data: formData.data,
          avaliadorId: formData.avaliadorId,
          avaliadorNome,
          scores: formData.scores,
          observacoes: formData.observacoes,
          focoDesenvolvimento: formData.focoDesenvolvimento
        });
        setSelectedEvalId(created.id);
      }

      setIsFormOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Erro ao registrar avaliação.');
    } finally {
      setIsSaving(false);
    }
  };

  // Confirmar exclusão
  const handleConfirmDelete = async () => {
    if (!evalToDelete) return;
    try {
      await deleteStudentEvaluation(evalToDelete.id);
      setEvalToDelete(null);
      // Ajustar seleção se excluiu a ativa
      const remaining = studentEvaluations.filter(e => e.id !== evalToDelete.id);
      if (remaining.length > 0) {
        setSelectedEvalId(remaining[0].id);
      } else {
        setSelectedEvalId('');
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir avaliação.');
    }
  };

  // Alteração de nota com step 0.5
  const handleScoreChange = (key: keyof DevelopmentScores, delta: number) => {
    setFormData(prev => {
      const current = prev.scores[key] || 0;
      const next = Math.max(0, Math.min(10, Math.round((current + delta) * 2) / 2));
      return {
        ...prev,
        scores: {
          ...prev.scores,
          [key]: next
        }
      };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        
        {/* Header do Aluno */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white p-5 sm:p-6 shrink-0 relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {student.avatar ? (
                <img 
                  src={student.avatar} 
                  alt={student.nome} 
                  className="w-14 h-14 rounded-2xl object-cover shadow-md border-2 border-white/20 shrink-0" 
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-md border-2 border-white/20 shrink-0">
                  {student.nome.charAt(0)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {student.nome}
                  </h2>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    student.plano === 'regular' ? 'bg-blue-500/30 text-blue-200' :
                    student.plano === 'infantil' ? 'bg-amber-500/30 text-amber-200' :
                    student.plano === 'bolsista' ? 'bg-purple-500/30 text-purple-200' :
                    'bg-emerald-500/30 text-emerald-200'
                  }`}>
                    {student.plano.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-1.5 flex-wrap text-xs text-slate-300">
                  <BeltBadge faixa={student.faixa} graus={student.graus} size="sm" />
                  <span>•</span>
                  <span>Prof. Responsável: <strong className="text-white">{student.professorNome || 'Mestre Responsável'}</strong></span>
                  <span>•</span>
                  <span>Matrícula: <strong className="text-white font-mono">#{student.id.slice(-6)}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onOpenPdfReport && (
                <button
                  onClick={() => onOpenPdfReport(student)}
                  className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl transition-all border border-white/10"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-300" />
                  <span>Relatório PDF</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-lg font-bold"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Abas de Navegação da Ficha */}
          <div className="flex items-center gap-2 mt-5 border-t border-white/10 pt-3 text-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab('avaliacoes')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                activeTab === 'avaliacoes' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Avaliação de Desenvolvimento</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                {studentEvaluations.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('cadastrais')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                activeTab === 'cadastrais' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Dados Cadastrais & Contato</span>
            </button>

            <button
              onClick={() => setActiveTab('tatame')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                activeTab === 'tatame' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Frequência & Sparring</span>
            </button>
          </div>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* ABA 1: AVALIAÇÃO DE DESENVOLVIMENTO HISTÓRICA */}
          {activeTab === 'avaliacoes' && (
            <div className="space-y-6">
              
              {/* Barra de Ações do Histórico */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-600" />
                    Histórico de Diagnósticos Técnicos
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Avaliações dos 6 pilares de desenvolvimento com escala de 0 a 10 e passos de 0,5.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {studentEvaluations.length > 1 && (
                    <button
                      onClick={() => setIsComparing(!isComparing)}
                      className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition-all ${
                        isComparing 
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs' 
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>{isComparing ? 'Encerrar Comparação' : 'Comparar 2 Avaliações'}</span>
                    </button>
                  )}

                  {canManage && (
                    <button
                      onClick={handleOpenCreateForm}
                      className="flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-2 rounded-xl transition-all shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Nova Avaliação</span>
                    </button>
                  )}
                </div>
              </div>

              {/* ESTADO VAZIO: Aluno sem avaliações */}
              {studentEvaluations.length === 0 ? (
                <div className="text-center py-12 px-6 bg-slate-50/60 rounded-3xl border border-dashed border-slate-300 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-2xs">
                    <Activity className="w-8 h-8" />
                  </div>
                  <div className="max-w-md mx-auto space-y-1.5">
                    <h4 className="font-extrabold text-slate-900 text-base">
                      Nenhuma avaliação pedagógica registrada
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Este aluno ainda não possui diagnósticos históricos no banco de dados. 
                      Para cadastrar ou importar atletas, <strong>nenhuma nota é exigida previamente</strong>.
                    </p>
                  </div>

                  {canManage ? (
                    <button
                      onClick={handleOpenCreateForm}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Registrar Primeira Avaliação Técnica
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 block italic">
                      Apenas professores responsáveis podem lançar avaliações técnicas.
                    </span>
                  )}

                  {/* Informação sobre dados legados sem data, se existirem em student.performance */}
                  {student.performance && (
                    <div className="max-w-lg mx-auto mt-6 pt-4 border-t border-slate-200/60 text-left bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                      <div className="flex items-center gap-2 text-slate-700 font-bold mb-1">
                        <Info className="w-3.5 h-3.5 text-amber-500" />
                        <span>Notas do Cadastro (Legado sem data)</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        O cadastro prévio possui indicadores preliminares (Guarda: {student.performance.guarda}, Passagem: {student.performance.passagem}, Quedas: {student.performance.quedas}). 
                        Estas notas são categorizadas como <em>legado sem data</em> e não entram em comparações históricas até que uma avaliação formal com data comprovada seja registrada.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* EXIBIÇÃO DAS AVALIAÇÕES CADASTRADAS */
                <div className="space-y-6">
                  
                  {/* Seletor de Avaliações */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-500">Avaliação Ativa:</span>
                      <select
                        value={selectedEvalId}
                        onChange={(e) => setSelectedEvalId(e.target.value)}
                        className="text-xs font-bold bg-blue-50/70 border border-blue-200 text-blue-900 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-blue-500"
                      >
                        {studentEvaluations.map(ev => (
                          <option key={ev.id} value={ev.id}>
                            {new Date(ev.data + 'T12:00:00').toLocaleDateString('pt-BR')} • Média: {calculateAverage(ev.scores)} {ev.avaliadorNome ? `(${ev.avaliadorNome})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Seletor de Comparação (se ativo) */}
                    {isComparing && (
                      <div className="flex items-center gap-2 flex-wrap bg-emerald-50/60 border border-emerald-200 p-1.5 rounded-xl">
                        <span className="text-xs font-bold text-emerald-800">Comparar com:</span>
                        <select
                          value={comparisonEvalId}
                          onChange={(e) => setComparisonEvalId(e.target.value)}
                          className="text-xs font-bold bg-white border border-emerald-300 text-emerald-900 rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-emerald-500"
                        >
                          {studentEvaluations
                            .filter(ev => ev.id !== selectedEvalId)
                            .map(ev => (
                              <option key={ev.id} value={ev.id}>
                                {new Date(ev.data + 'T12:00:00').toLocaleDateString('pt-BR')} • Média: {calculateAverage(ev.scores)} {ev.avaliadorNome ? `(${ev.avaliadorNome})` : ''}
                              </option>
                            ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Visualização: Gráfico Radar + Detalhes das 6 Dimensões */}
                  {primaryEval && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      
                      {/* Coluna da Esquerda: Gráfico Radar com 6 Eixos e Escala 0-10 */}
                      <div className="lg:col-span-6 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col items-center">
                        <div className="w-full flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                            Radar de Desempenho (0 a 10)
                          </span>
                          <span className="text-xs font-extrabold font-mono text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                            Média Simples: {calculateAverage(primaryEval.scores)} / 10
                          </span>
                        </div>

                        <DevelopmentRadarChart
                          primaryEvaluation={primaryEval}
                          comparisonEvaluation={comparisonEval}
                          size={360}
                          showLegend={true}
                          showScoringGuide={true}
                        />
                      </div>

                      {/* Coluna da Direita: Notas por Dimensão, Foco e Ações */}
                      <div className="lg:col-span-6 space-y-4">
                        
                        {/* Ações da Avaliação Selecionada */}
                        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                          <div className="text-xs text-slate-600">
                            <span>Avaliação de <strong>{new Date(primaryEval.data + 'T12:00:00').toLocaleDateString('pt-BR')}</strong></span>
                            {primaryEval.avaliadorNome && (
                              <span className="block text-[11px] text-slate-400">
                                Avaliador: {primaryEval.avaliadorNome}
                              </span>
                            )}
                          </div>

                          {canManage && (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleOpenEditForm(primaryEval)}
                                className="flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Editar</span>
                              </button>

                              <button
                                onClick={() => setEvalToDelete(primaryEval)}
                                className="flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Excluir</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Comparação Detalhada por Dimensão (se comparando) */}
                        {isComparing && comparisonEval && (
                          <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-4 space-y-3">
                            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                              <h4 className="font-extrabold text-xs text-emerald-950 flex items-center gap-1.5">
                                <TrendingUp className="w-4 h-4 text-emerald-600" />
                                Comparação Entre Datas
                              </h4>
                              <span className="text-[11px] font-mono font-bold text-emerald-800">
                                {new Date(primaryEval.data + 'T12:00:00').toLocaleDateString('pt-BR')} vs {new Date(comparisonEval.data + 'T12:00:00').toLocaleDateString('pt-BR')}
                              </span>
                            </div>

                            <div className="space-y-2 text-xs">
                              {EVALUATION_DIMENSIONS.map(dim => {
                                const scoreA = primaryEval.scores[dim.key] ?? 0;
                                const scoreB = comparisonEval.scores[dim.key] ?? 0;
                                const delta = Number((scoreA - scoreB).toFixed(1));
                                return (
                                  <div key={`comp-diff-${dim.key}`} className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-emerald-100">
                                    <div>
                                      <span className="font-bold text-slate-800 block text-xs">{dim.label}</span>
                                      <span className="text-[10px] text-slate-400">
                                        Anterior: {scoreB.toFixed(1)} → Atual: {scoreA.toFixed(1)}
                                      </span>
                                    </div>
                                    <span className={`font-mono font-black text-xs px-2 py-0.5 rounded-lg flex items-center gap-1 ${
                                      delta > 0 ? 'bg-emerald-100 text-emerald-800' :
                                      delta < 0 ? 'bg-rose-100 text-rose-800' :
                                      'bg-slate-100 text-slate-600'
                                    }`}>
                                      {delta > 0 ? <TrendingUp className="w-3 h-3 text-emerald-600" /> :
                                       delta < 0 ? <TrendingDown className="w-3 h-3 text-rose-600" /> :
                                       <Minus className="w-3 h-3 text-slate-400" />}
                                      {delta > 0 ? `+${delta}` : delta}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Foco de Desenvolvimento (Próximos Passos) */}
                        {primaryEval.focoDesenvolvimento && (
                          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl space-y-1">
                            <span className="text-[10px] uppercase font-extrabold tracking-wider text-amber-800 flex items-center gap-1.5">
                              <Target className="w-3.5 h-3.5 text-amber-600" />
                              Foco Técnico de Desenvolvimento
                            </span>
                            <p className="text-xs text-amber-950 font-medium leading-relaxed">
                              {primaryEval.focoDesenvolvimento}
                            </p>
                          </div>
                        )}

                        {/* Observações Pedagógicas */}
                        {primaryEval.observacoes && (
                          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
                            <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-500 flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-slate-400" />
                              Observações do Mestre / Avaliador
                            </span>
                            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                              {primaryEval.observacoes}
                            </p>
                          </div>
                        )}

                        {/* Detalhamento das 6 Dimensões com Barras de Progresso */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                          <h4 className="font-extrabold text-xs text-slate-900 border-b border-slate-100 pb-2">
                            Detalhamento dos 6 Fundamentos
                          </h4>

                          <div className="space-y-2.5 text-xs">
                            {EVALUATION_DIMENSIONS.map(dim => {
                              const score = primaryEval.scores[dim.key] ?? 0;
                              return (
                                <div key={`dim-bar-${dim.key}`}>
                                  <div className="flex justify-between font-semibold mb-1">
                                    <span className="text-slate-700 text-[11px]">{dim.label}</span>
                                    <span className="font-black font-mono text-blue-700 text-xs">
                                      {score.toFixed(1)} <span className="text-slate-400 text-[10px]">/ 10</span>
                                    </span>
                                  </div>
                                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                    <div 
                                      className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                                      style={{ width: `${(score / 10) * 100}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Linha do Tempo / Tabela com Histórico Completo de Avaliações */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <span className="font-extrabold text-xs text-slate-800">
                        Histórico Cronológico Completo ({studentEvaluations.length} avaliações)
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100 text-xs">
                      {studentEvaluations.map(ev => {
                        const avg = calculateAverage(ev.scores);
                        const isSelected = ev.id === selectedEvalId;
                        return (
                          <div 
                            key={`hist-${ev.id}`}
                            className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                              isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-blue-600' : 'bg-slate-300'}`} />
                              <div>
                                <div className="flex items-center gap-2">
                                  <strong className="text-slate-900 font-mono">
                                    {new Date(ev.data + 'T12:00:00').toLocaleDateString('pt-BR')}
                                  </strong>
                                  <span className="font-extrabold text-blue-700 font-mono bg-blue-100/70 px-2 py-0.5 rounded text-[11px]">
                                    Média {avg}
                                  </span>
                                </div>
                                <span className="text-[11px] text-slate-500 block">
                                  {ev.avaliadorNome ? `Avaliador: Prof. ${ev.avaliadorNome}` : 'Avaliador não informado'}
                                  {ev.focoDesenvolvimento && ` • Foco: ${ev.focoDesenvolvimento.slice(0, 40)}...`}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedEvalId(ev.id)}
                                className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-all ${
                                  isSelected 
                                    ? 'bg-blue-600 text-white border-blue-600' 
                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                {isSelected ? 'Visualizando' : 'Visualizar'}
                              </button>

                              {canManage && (
                                <>
                                  <button
                                    onClick={() => handleOpenEditForm(ev)}
                                    className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                                    title="Editar"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setEvalToDelete(ev)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                                    title="Excluir"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* ABA 2: DADOS CADASTRAIS & GRADUAÇÃO */}
          {activeTab === 'cadastrais' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Contato & Informações</span>
                  <div className="space-y-1.5 text-slate-700">
                    <p><strong>E-mail:</strong> {student.email}</p>
                    <p><strong>Telefone:</strong> {student.telefone}</p>
                    <p><strong>Data de Nascimento:</strong> {student.dataNascimento}</p>
                    <p><strong>Início no Tatame:</strong> {new Date(student.dataInicio).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Ficha Técnica & Equipamento</span>
                  <div className="space-y-1.5 text-slate-700">
                    <p><strong>Tamanho do Kimono:</strong> {student.tamanhoKimono}</p>
                    <p><strong>Peso Corporal:</strong> {student.pesoKg} kg</p>
                    <p><strong>Turma Preferida:</strong> {student.turmaPreferida}</p>
                    <p><strong>Sistema de Graduação:</strong> {student.sistemaGraduacao === 'apenas_faixas' ? 'Apenas Faixas' : 'Graus & Faixas'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Observações Médicas / Restrições</span>
                <p className="text-slate-700">
                  {student.observacoesMedicas || 'Nenhuma restrição médica ou observação cadastrada.'}
                </p>
              </div>
            </div>
          )}

          {/* ABA 3: HISTÓRICO DE TATAME & SPARRING */}
          {activeTab === 'tatame' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Tempo de Rola</span>
                  <span className="text-lg font-black text-slate-900">{student.performance?.tempoRolaMinutos || 0} min</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Finalizações</span>
                  <span className="text-lg font-black text-emerald-600">{student.performance?.finalizacoesAplicadas || 0}</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Raspagens</span>
                  <span className="text-lg font-black text-blue-600">{student.performance?.raspagensFeitas || 0}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Presenças & Frequência</span>
                <p className="text-slate-700">
                  Total de presenças registradas no histórico: <strong>{student.totalPresencasHistorico} aulas</strong>
                </p>
                <p className="text-slate-700">
                  Presenças acumuladas na faixa atual: <strong>{student.presencasNaFaixa} de {student.presencasMetaGrau} aulas requeridas</strong>
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* MODAL FORMULÁRIO: NOVA / EDITAR AVALIAÇÃO */}
      {isFormOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl border border-slate-200 space-y-4 text-xs my-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  {editingEvalId ? 'Editar Avaliação de Desenvolvimento' : 'Nova Avaliação de Desenvolvimento'}
                </h3>
                <p className="text-xs text-slate-500">
                  Atleta: <strong>{student.nome}</strong> • Escala de 0 a 10 com passos de 0,5
                </p>
              </div>
              <button 
                onClick={() => setIsFormOpen(false)} 
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEvaluation} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Data da Avaliação *</label>
                  <input
                    type="date"
                    required
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Professor Avaliador *</label>
                  <select
                    value={formData.avaliadorId}
                    onChange={(e) => {
                      const selectedProf = instructors.find(i => i.id === e.target.value);
                      setFormData({ 
                        ...formData, 
                        avaliadorId: e.target.value,
                        avaliadorNome: selectedProf?.nome || formData.avaliadorNome
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500"
                  >
                    {instructors.map(i => (
                      <option key={i.id} value={i.id}>
                        Prof. {i.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 6 Dimensões de Avaliação com Passos de 0.5 */}
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <span className="font-extrabold text-slate-800 text-xs">
                    Notas dos 6 Fundamentos (0,0 a 10,0)
                  </span>
                  <span className="font-black font-mono text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded text-xs">
                    Média Simples: {calculateAverage(formData.scores)} / 10
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {EVALUATION_DIMENSIONS.map(dim => {
                    const currentScore = formData.scores[dim.key] ?? 0;
                    return (
                      <div key={`input-${dim.key}`} className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="font-bold text-slate-800 text-[11px] truncate" title={dim.label}>
                            {dim.label}
                          </label>
                          <span className="font-mono font-black text-sm text-blue-700">
                            {currentScore.toFixed(1)}
                          </span>
                        </div>

                        {/* Slider com step 0.5 */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleScoreChange(dim.key, -0.5)}
                            className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center shrink-0"
                          >
                            -
                          </button>
                          <input
                            type="range"
                            min="0"
                            max="10"
                            step="0.5"
                            value={currentScore}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              setFormData(prev => ({
                                ...prev,
                                scores: { ...prev.scores, [dim.key]: val }
                              }));
                            }}
                            className="flex-1 accent-blue-600 cursor-pointer"
                          />
                          <button
                            type="button"
                            onClick={() => handleScoreChange(dim.key, 0.5)}
                            className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center shrink-0"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Foco de Desenvolvimento */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Foco de Desenvolvimento (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Treinar retenção de guarda laço e defesa de estrangulamento das costas"
                  value={formData.focoDesenvolvimento}
                  onChange={(e) => setFormData({ ...formData, focoDesenvolvimento: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Observações Pedagógicas */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Observações Técnicas / Pedagógicas (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Feedback detalhado sobre a evolução do praticante..."
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-sm disabled:opacity-50"
                >
                  {isSaving ? 'Salvando...' : editingEvalId ? 'Atualizar Avaliação' : 'Registrar Avaliação'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DIÁLOGO DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {evalToDelete && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4 text-xs text-center my-auto">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-slate-900">
                Excluir Avaliação?
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Deseja realmente remover a avaliação de <strong>{new Date(evalToDelete.data + 'T12:00:00').toLocaleDateString('pt-BR')}</strong> (Média {calculateAverage(evalToDelete.scores)})? Esta ação não pode ser desfeita.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setEvalToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
