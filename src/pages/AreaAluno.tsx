import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  Activity, 
  DollarSign, 
  Calendar, 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  Flame, 
  UserRound, 
  QrCode, 
  Copy, 
  Check, 
  Sparkles, 
  Trophy,
  Package,
  Plus,
  BookOpen,
  ShieldAlert,
  Target
} from 'lucide-react';
import { useBjj } from '../context/BjjContext';
import { BeltBadge } from '../components/ui/BeltBadge';
import { StudentPdfReportModal } from '../components/report/StudentPdfReportModal';
import { DevelopmentRadarChart } from '../components/charts/DevelopmentRadarChart';
import { EVALUATION_DIMENSIONS, StudentEvaluation } from '../types';
import { FileText } from 'lucide-react';

export const AreaAluno: React.FC = () => {
  const { 
    currentUser, 
    students, 
    payments, 
    attendance, 
    events, 
    purchases, 
    products,
    academySettings,
    toggleEnrollEvent,
    addPurchase,
    getStudentGraduationStatus,
    getStudentEvaluations
  } = useBjj();

  const [copiedPix, setCopiedPix] = useState(false);
  const [showStoreQuickModal, setShowStoreQuickModal] = useState(false);
  const [showPdfReport, setShowPdfReport] = useState(false);
  const [learnedCatFilter, setLearnedCatFilter] = useState('all');
  const [learnedSearch, setLearnedSearch] = useState('');
  const [selectedEvalIndex, setSelectedEvalIndex] = useState(0);

  // Verificação real de autenticação e autorização (sem fallback inseguro para students[0])
  const currentStudent = currentUser.studentId 
    ? students.find(s => s.id === currentUser.studentId)
    : (currentUser.role === 'aluno' ? students.find(s => s.email.toLowerCase() === currentUser.email.toLowerCase()) : null);

  // Se o usuário não possui vínculo com um aluno válido, exibe estado sem acesso autorizado
  if (!currentStudent) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200/90 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-2xs">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-3 py-1 rounded-full">
            Controle de Acesso
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Portal Exclusivo para Alunos Matriculados
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
            {currentUser.role === 'aluno'
              ? `O usuário ${currentUser.email} está registrado como aluno, mas ainda não possui um cadastro de atleta ativo vinculado ao dojo.`
              : `Você está autenticado como "${currentUser.nome}" (${currentUser.isMasterAdmin ? 'Mestre / Administrador Master' : currentUser.role === 'professor' ? 'Professor' : 'Gestor'}), sem matrícula de atleta vinculada.`}
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 max-w-md mx-auto text-left space-y-1.5">
          <p className="font-bold text-slate-800">Para acessar este portal:</p>
          <ul className="list-disc pl-4 space-y-1 text-slate-600">
            <li>Alunos devem ter a matrícula ativa criada em <strong>Cadastros</strong> ou <strong>Equipe</strong>.</li>
            <li>Professores e administradores gerenciam os atletas e suas avaliações pelo menu <strong>Equipe</strong>.</li>
          </ul>
        </div>

        <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
          {currentUser.role !== 'aluno' ? (
            <>
              <Link
                to="/equipe"
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                Acessar Quadro de Alunos (Equipe)
              </Link>
              <Link
                to="/"
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
              >
                Voltar ao Dashboard
              </Link>
            </>
          ) : (
            <p className="text-xs text-amber-600 font-semibold">
              Por favor, solicite ao professor ou administrador a liberação e vínculo da sua matrícula.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Avaliações de desenvolvimento históricas do aluno autenticado
  const myEvaluations = getStudentEvaluations(currentStudent.id);
  const activeEval = myEvaluations.length > 0 ? (myEvaluations[selectedEvalIndex] || myEvaluations[0]) : null;

  const learnedTechniques = currentStudent.tecnicasAprendidas || [];
  const filteredLearned = learnedTechniques.filter(t => {
    const matchesCat = learnedCatFilter === 'all' || t.categoria === learnedCatFilter;
    const matchesSearch = t.titulo.toLowerCase().includes(learnedSearch.toLowerCase()) ||
      (t.aulaTitulo && t.aulaTitulo.toLowerCase().includes(learnedSearch.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Scoped data for this athlete
  const myPayments = payments.filter(p => p.studentId === currentStudent.id);
  const currentMonthPayment = myPayments[0];
  const myAttendance = attendance.filter(a => a.studentId === currentStudent.id);
  const myPurchases = purchases.filter(p => p.studentId === currentStudent.id);

  const gradStatus = getStudentGraduationStatus(currentStudent);
  const progressPct = gradStatus.progressoAulasPct;

  const handleCopyPix = (pix: string) => {
    navigator.clipboard.writeText(pix);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  const handleBuyProduct = (prodId: string) => {
    addPurchase(prodId, currentStudent.id);
    setShowStoreQuickModal(false);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Banner / Student ID Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-black text-2xl flex items-center justify-center shadow-lg border-2 border-white/20 shrink-0">
              {currentStudent.nome.charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs uppercase font-bold tracking-widest text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded">
                  Portal do Praticante
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-300 font-mono">
                  Matrícula #{currentStudent.id.slice(-6)}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                {currentStudent.nome}
              </h1>

              <div className="flex items-center gap-3 pt-1 flex-wrap">
                <BeltBadge faixa={currentStudent.faixa} graus={currentStudent.graus} size="md" />
                <span className="text-xs text-slate-300">
                  Professor: <strong className="text-white">{currentStudent.professorNome || academySettings.mestreResponsavel || 'Mestre Responsável'}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Virtual ID Card / QR Code & PDF Report */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => setShowPdfReport(true)}
              className="bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold px-4 py-3 rounded-2xl flex items-center justify-center gap-2 text-xs transition-colors shadow-sm shrink-0"
            >
              <FileText className="w-4 h-4 text-blue-300" />
              <span>Ver Meu Relatório (PDF)</span>
            </button>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl flex items-center gap-3.5 text-xs shrink-0">
              <div className="w-12 h-12 bg-white p-1 rounded-xl flex items-center justify-center shadow-sm">
                <QrCode className="w-10 h-10 text-slate-900" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Carteirinha Digital</span>
                <span className="font-bold text-sm text-white block">Tatame Check-in</span>
                <span className="text-emerald-400 font-semibold font-mono text-[11px]">✓ Aluno Ativo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress towards Next Stripe / Promotion */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Evolução no Tatame & Norma IBJJF
              </h3>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                gradStatus.rule.categoria === 'infantil' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {gradStatus.rule.categoria === 'infantil' ? 'Infantil / Kids' : 'Adulto'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Meta da sua graduação: <strong>{gradStatus.proximaMetaDescricao}</strong> • {gradStatus.rule.tempoMinimoDescricao}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-600 block">
              {currentStudent.presencasNaFaixa} de {gradStatus.metaAulas} aulas requeridas
            </span>
            <span className="text-xs font-mono font-bold text-blue-600">{progressPct}% da carga horária</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${
                progressPct >= 100 
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400 animate-pulse' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Time in Belt & IBJJF Requirements Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-500 block">Tempo no Tatame nesta Faixa:</span>
                <span className="font-bold text-slate-900">
                  {gradStatus.mesesNaFaixa} meses registrados (Mínimo IBJJF: {gradStatus.tempoMinimoMesesIBJJF}m)
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-500 block">Regulamentação Oficial da Faixa:</span>
                <span className="font-bold text-slate-900">
                  {gradStatus.tempoMinimoCumprido ? '✓ Carência IBJJF Cumprida' : `Carência: faltam ${Math.max(0, gradStatus.tempoMinimoMesesIBJJF - gradStatus.mesesNaFaixa)} meses`}
                </span>
              </div>
            </div>
          </div>

          {progressPct >= 100 ? (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Parabéns! Você atingiu a carga horária de treinos requerida para {gradStatus.proximaMetaDescricao}!
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-right">
              Faltam apenas <strong>{gradStatus.aulasRestantes} aulas</strong> para completar sua meta de tatame!
            </p>
          )}
        </div>
      </div>

      {/* 2-Column Grid: Plan & Tuition Status + 6 Pillars Ratings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tuition & Plan Details Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  Plano & Status da Mensalidade
                </h3>
                <p className="text-xs text-slate-500">
                  Pagamento direto ao seu professor responsável
                </p>
              </div>

              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                currentStudent.plano === 'regular' ? 'bg-blue-50 text-blue-700' :
                currentStudent.plano === 'infantil' ? 'bg-amber-50 text-amber-800' :
                currentStudent.plano === 'bolsista' ? 'bg-purple-50 text-purple-800' :
                'bg-emerald-50 text-emerald-800'
              }`}>
                {currentStudent.plano.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Valor Mensal</span>
                <span className="text-xl font-black text-slate-900">
                  R$ {currentStudent.valorMensalidade.toFixed(2)}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Vencimento: Dia {currentStudent.diaVencimento}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Status Atual</span>
                <div className="mt-1">
                  {currentStudent.statusPagamento === 'em_dia' && (
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Em Dia
                    </span>
                  )}
                  {currentStudent.statusPagamento === 'pendente' && (
                    <span className="inline-flex items-center gap-1 font-bold text-amber-700 text-sm">
                      <Clock className="w-4 h-4 text-amber-600" /> Aberto
                    </span>
                  )}
                  {currentStudent.statusPagamento === 'atrasado' && (
                    <span className="inline-flex items-center gap-1 font-bold text-rose-700 text-sm">
                      <AlertCircle className="w-4 h-4 text-rose-600" /> Vencido
                    </span>
                  )}
                  {currentStudent.statusPagamento === 'isento' && (
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700 text-sm">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> Social (100% Isento)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* PIX Payment Box */}
            {currentStudent.plano !== 'projeto_social' && currentMonthPayment && (
              <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <UserRound className="w-3.5 h-3.5 text-emerald-700" />
                    Pagar Mensalidade via PIX ao Professor:
                  </span>
                  <span className="text-emerald-800 font-semibold">{currentMonthPayment.professorNome}</span>
                </div>

                <div className="flex items-center justify-between gap-2 bg-white p-2.5 rounded-xl border border-emerald-200 text-xs">
                  <span className="font-mono font-bold text-slate-800 truncate">
                    {currentMonthPayment.chavePixProfessor || academySettings.chavePix || 'professormikalkenasbjj@gmail.com'}
                  </span>
                  <button
                    onClick={() => handleCopyPix(currentMonthPayment.chavePixProfessor || academySettings.chavePix || 'professormikalkenasbjj@gmail.com')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 text-[11px] shrink-0"
                  >
                    {copiedPix ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copiar Chave
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Após a transferência, envie o comprovante para o WhatsApp do seu professor responsável.
                </p>
              </div>
            )}
          </div>

          <div className="text-xs text-slate-400 border-t border-slate-100 pt-3 flex justify-between">
            <span>Kimono: {currentStudent.tamanhoKimono}</span>
            <span>Peso: {currentStudent.pesoKg} kg</span>
          </div>
        </div>

        {/* 6 Dimensions of Performance Radar/Bar Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Meu Radar de Desempenho Técnico
              </h3>
              <p className="text-xs text-slate-500">
                {activeEval 
                  ? `Avaliação de ${new Date(activeEval.data + 'T12:00:00').toLocaleDateString('pt-BR')}${activeEval.avaliadorNome ? ` • Prof. ${activeEval.avaliadorNome}` : ''}`
                  : 'Diagnóstico dos 6 fundamentos pelo professor responsável'}
              </p>
            </div>

            {activeEval ? (
              <div className="text-right">
                <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                  Média: {((activeEval.scores.guarda + activeEval.scores.passagem + activeEval.scores.quedas + activeEval.scores.finalizacoes + activeEval.scores.defesa + activeEval.scores.disciplina) / 6).toFixed(1)} / 10
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Média aritmética simples
                </span>
              </div>
            ) : (
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                Sem avaliação formal
              </span>
            )}
          </div>

          {/* Histórico Seletor (quando houver mais de uma avaliação) */}
          {myEvaluations.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 font-bold shrink-0 text-[11px]">Histórico:</span>
              {myEvaluations.map((ev, idx) => (
                <button
                  key={ev.id}
                  onClick={() => setSelectedEvalIndex(idx)}
                  className={`px-2.5 py-1 rounded-lg font-mono font-bold text-[11px] transition-all shrink-0 ${
                    (selectedEvalIndex === idx || (!selectedEvalIndex && idx === 0))
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {new Date(ev.data + 'T12:00:00').toLocaleDateString('pt-BR')}
                </button>
              ))}
            </div>
          )}

          {/* CORPO DA AVALIAÇÃO OU ESTADO VAZIO */}
          {activeEval ? (
            <div className="space-y-4">
              {/* Gráfico Radar */}
              <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center">
                <DevelopmentRadarChart
                  primaryEvaluation={activeEval}
                  size={320}
                  showLegend={false}
                  compact={true}
                />
              </div>

              {/* Foco de Desenvolvimento (se houver) */}
              {activeEval.focoDesenvolvimento && (
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold text-[11px]">
                    <Target className="w-3.5 h-3.5 text-amber-600" />
                    <span>Foco de Treino Recomendado:</span>
                  </div>
                  <p className="text-amber-950 font-medium leading-relaxed">
                    {activeEval.focoDesenvolvimento}
                  </p>
                </div>
              )}

              {/* Observações do Professor (se houver) */}
              {activeEval.observacoes && (
                <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl text-xs space-y-1">
                  <span className="text-slate-500 font-bold text-[11px] block">
                    Observações do Professor:
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {activeEval.observacoes}
                  </p>
                </div>
              )}

              {/* Detalhamento das 6 Dimensões com Barras */}
              <div className="space-y-2.5 text-xs">
                {EVALUATION_DIMENSIONS.map(dim => {
                  const score = activeEval.scores[dim.key] ?? 0;
                  return (
                    <div key={`aluno-dim-${dim.key}`}>
                      <div className="flex justify-between font-semibold mb-1">
                        <span className="text-slate-700">{dim.label}</span>
                        <span className="font-bold font-mono text-blue-700">{score.toFixed(1)} / 10</span>
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

              {/* Aviso Pedagógico */}
              <p className="text-[11px] text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                ℹ️ <strong>Média Aritmética Simples:</strong> A nota geral ({((activeEval.scores.guarda + activeEval.scores.passagem + activeEval.scores.quedas + activeEval.scores.finalizacoes + activeEval.scores.defesa + activeEval.scores.disciplina) / 6).toFixed(1)}) apoia o direcionamento técnico do seu treino e não substitui os critérios regulamentares de carência e assiduidade para promoção por faixa.
              </p>
            </div>
          ) : (
            /* Estado Vazio quando não há avaliações históricas */
            <div className="text-center py-8 px-4 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Activity className="w-6 h-6" />
              </div>
              <div className="max-w-sm mx-auto space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">
                  Nenhuma avaliação técnica formal registrada
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Seu professor responsável lançará aqui os diagnósticos dos 6 fundamentos e o radar de habilidades conforme sua evolução nas aulas. Não atribuímos notas fictícias ou valor padrão inicial 5,0.
                </p>
              </div>

              {currentStudent.performance && (
                <div className="text-[11px] text-slate-400 bg-white p-2.5 rounded-xl border border-slate-200/60 max-w-sm mx-auto text-left">
                  <span className="font-bold text-slate-600 block mb-0.5">Notas do Cadastro (Legado sem data):</span>
                  <span>Guarda {currentStudent.performance.guarda} • Passagem {currentStudent.performance.passagem} • Quedas {currentStudent.performance.quedas} • Finalizações {currentStudent.performance.finalizacoes} • Defesa {currentStudent.performance.defesa} • Disciplina {currentStudent.performance.disciplina}</span>
                </div>
              )}
            </div>
          )}

          {/* Indicadores de Sparring e Rola Preservados de Student.performance */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Indicadores de Treino (Sparring)
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-50 p-2 rounded-lg">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Tempo Rola</span>
                <span className="font-bold text-slate-900">{currentStudent.performance?.tempoRolaMinutos || 0} min</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Finalizações</span>
                <span className="font-bold text-emerald-600">{currentStudent.performance?.finalizacoesAplicadas || 0}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Raspagens</span>
                <span className="font-bold text-blue-600">{currentStudent.performance?.raspagensFeitas || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learned Techniques History (Core Requirement) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h3 className="font-extrabold text-base text-slate-900">
                Meu Histórico de Técnicas Aprendidas
              </h3>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {learnedTechniques.length} posições aprendidas
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Técnicas ensinadas nos dias em que sua presença foi confirmada no tatame.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Buscar técnica aprendida..."
              value={learnedSearch}
              onChange={(e) => setLearnedSearch(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:ring-1 focus:ring-blue-500"
            />
            <select
              value={learnedCatFilter}
              onChange={(e) => setLearnedCatFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-semibold text-slate-700"
            >
              <option value="all">Todas as Categorias</option>
              <option value="Finalização">Finalizações</option>
              <option value="Raspagem">Raspagens</option>
              <option value="Passagem de Guarda">Passagens de Guarda</option>
              <option value="Queda">Quedas</option>
              <option value="Guarda">Guardas</option>
              <option value="Defesa Pessoal">Defesa Pessoal</option>
            </select>
          </div>
        </div>

        {filteredLearned.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredLearned.map(item => {
              const catColor = 
                item.categoria === 'Finalização' ? 'bg-red-50 text-red-700 border-red-200' :
                item.categoria === 'Raspagem' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                item.categoria === 'Passagem de Guarda' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                item.categoria === 'Queda' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                item.categoria === 'Defesa Pessoal' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                'bg-slate-100 text-slate-700 border-slate-200';

              return (
                <div key={item.id} className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-all bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${catColor}`}>
                      {item.categoria}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      📅 {new Date(item.dataAprendida + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                    {item.titulo}
                  </h4>

                  <div className="text-[11px] text-slate-600 space-y-0.5 pt-1 border-t border-slate-200/60">
                    {item.aulaTitulo && (
                      <p className="truncate">🥋 Aula: <strong>{item.aulaTitulo}</strong></p>
                    )}
                    {item.professorNome && (
                      <p className="text-slate-500">Prof.: <strong>{item.professorNome}</strong></p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Presença Marcada • Técnica Aprendida</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl space-y-2">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs">
              {learnedTechniques.length === 0 
                ? 'Nenhuma técnica registrada ainda. Conforme suas presenças forem marcadas nas aulas, as técnicas ensinadas aparecerão aqui automaticamente!'
                : 'Nenhuma técnica encontrada com os filtros selecionados.'}
            </p>
          </div>
        )}
      </div>

      {/* Events Panel for the Student */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Painel de Eventos, Campeonatos & Graduações
            </h3>
            <p className="text-xs text-slate-500">
              Eventos oficiais abertos para a sua inscrição
            </p>
          </div>

          <Link to="/eventos" className="text-xs font-bold text-blue-600 hover:underline">
            Ver Calendário Completo →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map(evt => {
            const isEnrolled = evt.participantesIds.includes(currentStudent.id);

            return (
              <div key={evt.id} className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all space-y-3 bg-slate-50/40">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    {evt.tipo}
                  </span>
                  <span className="text-xs font-bold font-mono text-slate-700">
                    {evt.taxaInscricao > 0 ? `R$ ${evt.taxaInscricao.toFixed(2)}` : 'Gratuito'}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900">{evt.titulo}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{evt.descricao}</p>
                </div>

                <div className="text-[11px] text-slate-600 space-y-0.5">
                  <p>📅 {new Date(evt.data + 'T00:00:00').toLocaleDateString('pt-BR')} • {evt.horario}</p>
                  <p className="truncate">📍 {evt.local}</p>
                </div>

                <button
                  onClick={() => toggleEnrollEvent(evt.id, currentStudent.id)}
                  className={`w-full text-xs font-bold py-2 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                    isEnrolled
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 hover:bg-blue-600 text-white'
                  }`}
                >
                  {isEnrolled ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Confirmado no Evento ✓
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" /> Inscrever-se Agora
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Student Purchases and Gear Store */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              Minhas Compras & Equipamentos do Tatame
            </h3>
            <p className="text-xs text-slate-500">
              Histórico de pedidos de kimono, faixas e vestuário
            </p>
          </div>

          <button
            onClick={() => setShowStoreQuickModal(true)}
            className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Fazer Pedido na Loja
          </button>
        </div>

        {myPurchases.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2">Nenhum pedido realizado ainda.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {myPurchases.map(pur => (
              <div key={pur.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{pur.produtoNome}</span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Data: {new Date(pur.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-slate-900 text-sm block">
                    R$ {pur.preco.toFixed(2)}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Entregue / Quitado
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Order Modal */}
      {showStoreQuickModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Comprar Produto da Academia</h3>
                <p className="text-slate-500">Equipamentos oficiais para o aluno {currentStudent.nome}</p>
              </div>
              <button onClick={() => setShowStoreQuickModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {products.map(prod => (
                <div key={prod.id} className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-slate-900 block">{prod.nome}</span>
                    <span className="text-[11px] text-slate-400">R$ {prod.preco.toFixed(2)} • Estoque: {prod.estoque} un</span>
                  </div>
                  <button
                    onClick={() => handleBuyProduct(prod.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                  >
                    Pedir
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowStoreQuickModal(false)}
              className="w-full py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Official PDF Report Modal for the Student */}
      {showPdfReport && (
        <StudentPdfReportModal
          student={currentStudent}
          onClose={() => setShowPdfReport(false)}
        />
      )}
    </div>
  );
};
