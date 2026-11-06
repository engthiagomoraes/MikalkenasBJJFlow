import React, { useEffect, useState } from 'react';
import { 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MessageSquare, 
  Printer, 
  Plus, 
  Search, 
  Filter, 
  Heart, 
  Users, 
  UserRound,
  Copy,
  Check,
  Building2,
  Share2,
  RefreshCw
} from 'lucide-react';
import { useBjj } from '../context/BjjContext';
import { PlanType, PaymentStatus, PaymentRecord } from '../types';

export const Financeiro: React.FC = () => {
  const {
    payments,
    students,
    instructors,
    markPaymentPaid,
    addPaymentRecord,
    refreshPaymentsFromSupabase,
    currentUser,
    academySettings,
    supabaseConfig
  } = useBjj();

  const isProfessor = currentUser.role === 'professor';
  const myInstructor = instructors.find(i => i.id === currentUser.professorId || i.nome.toLowerCase() === currentUser.nome.toLowerCase());
  const myStudents = students.filter(s => 
    s.professorId === currentUser.professorId || 
    s.professorId === myInstructor?.id || 
    (s.professorNome && s.professorNome.toLowerCase() === currentUser.nome.toLowerCase())
  );

  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterProfessor, setFilterProfessor] = useState<string>(isProfessor ? (myInstructor?.id || currentUser.professorId || 'all') : 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showPayModal, setShowPayModal] = useState<boolean>(false);
  const [selectedPaymentForReceipt, setSelectedPaymentForReceipt] = useState<PaymentRecord | null>(null);
  const [copiedPixId, setCopiedPixId] = useState<string | null>(null);
  const [supabasePayments, setSupabasePayments] = useState<PaymentRecord[]>([]);
  const [databaseLoading, setDatabaseLoading] = useState(false);
  const [databaseError, setDatabaseError] = useState<string | null>(null);

  // New payment form
  const [payStudentId, setPayStudentId] = useState<string>(isProfessor ? (myStudents[0]?.id || '') : (students[0]?.id || ''));
  const [payMesRef, setPayMesRef] = useState<string>('Outubro/2026');
  const [payValor, setPayValor] = useState<number>(180);
  const [payDataVenc, setPayDataVenc] = useState<string>('2026-10-10');

  useEffect(() => {
    if (!supabaseConfig.enabled) {
      setSupabasePayments([]);
      setDatabaseError(null);
      return;
    }

    let cancelled = false;
    setDatabaseLoading(true);
    setDatabaseError(null);
    refreshPaymentsFromSupabase()
      .then(records => {
        if (!cancelled) setSupabasePayments(records);
      })
      .catch(error => {
        if (!cancelled) setDatabaseError(error instanceof Error ? error.message : 'Falha ao carregar pagamentos do Supabase.');
      })
      .finally(() => {
        if (!cancelled) setDatabaseLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [supabaseConfig.enabled, supabaseConfig.url, supabaseConfig.anonKey]);

  const handleRefreshPayments = async () => {
    setDatabaseLoading(true);
    setDatabaseError(null);
    try {
      const records = await refreshPaymentsFromSupabase();
      setSupabasePayments(records);
    } catch (error) {
      setDatabaseError(error instanceof Error ? error.message : 'Falha ao carregar pagamentos do Supabase.');
    } finally {
      setDatabaseLoading(false);
    }
  };

  // Filtered payments list
  const financialPayments = supabasePayments.length > 0 ? supabasePayments : payments;
  const filteredPayments = financialPayments.filter(p => {
    // If logged in as professor, strictly only see own students' payments
    if (isProfessor) {
      const isMine = p.professorId === currentUser.professorId ||
                     p.professorId === myInstructor?.id ||
                     (p.professorNome && p.professorNome.toLowerCase() === currentUser.nome.toLowerCase());
      if (!isMine) return false;
    }

    const matchesPlan = filterPlan === 'all' || p.plano === filterPlan;
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchesProfessor = isProfessor ? true : (filterProfessor === 'all' || p.professorId === filterProfessor);
    const matchesSearch = p.studentNome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.professorNome && p.professorNome.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesPlan && matchesStatus && matchesProfessor && matchesSearch;
  });

  // Metrics calculations (based on active filter)
  const totalRecebido = filteredPayments
    .filter(p => p.status === 'em_dia')
    .reduce((acc, p) => acc + p.valor, 0);

  const totalPendente = filteredPayments
    .filter(p => p.status === 'pendente')
    .reduce((acc, p) => acc + p.valor, 0);

  const totalAtrasado = filteredPayments
    .filter(p => p.status === 'atrasado')
    .reduce((acc, p) => acc + p.valor, 0);

  const totalSubsidioSocial = filteredPayments.reduce((acc, p) => acc + (p.desconto || 0), 0);

  const handleCopyPix = (pix: string, id: string) => {
    navigator.clipboard.writeText(pix);
    setCopiedPixId(id);
    setTimeout(() => setCopiedPixId(null), 2500);
  };

  const handleOpenWhatsAppReminder = (payment: PaymentRecord) => {
    const student = students.find(s => s.id === payment.studentId);
    const phone = student?.telefone.replace(/\D/g, '') || '';
    const formattedVenc = new Date(payment.dataVencimento + 'T00:00:00').toLocaleDateString('pt-BR');
    const prof = instructors.find(i => i.id === payment.professorId) || instructors[0];
    const chavePix = payment.chavePixProfessor || prof?.chavePix || academySettings.chavePix || 'professormikalkenasbjj@gmail.com';
    const profNome = payment.professorNome || prof?.nome || academySettings.mestreResponsavel || 'Professor Responsável';
    
    const message = encodeURIComponent(
      `Olá ${payment.studentNome}! 🥋\n\n` +
      `Passando para lembrar sobre a sua mensalidade de Jiu-Jitsu da ${academySettings.nomeAcademia || 'Academia'}.\n` +
      `• Professor Responsável: ${profNome}\n` +
      `• Mês Referência: ${payment.mesReferencia}\n` +
      `• Vencimento: ${formattedVenc}\n` +
      `• Valor: R$ ${payment.valor.toFixed(2)}\n\n` +
      `🔑 Chave PIX do seu Professor (${profNome}):\n${chavePix}\n\n` +
      `Por favor, envie o comprovante diretamente para este número após o pagamento. Agradecemos por treinar conosco! Oss! 👊`
    );

    const url = `https://wa.me/55${phone}?text=${message}`;
    window.open(url, '_blank');
  };

  const handleCreateNewPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setDatabaseError(null);
    if (!supabaseConfig.enabled) {
      setDatabaseError('Ative e configure a integração Supabase em Configurações > Banco de Dados antes de lançar mensalidades.');
      return;
    }
    const st = students.find(s => s.id === payStudentId);
    if (!st) return;

    const prof = instructors.find(i => i.id === st.professorId) || instructors[0];

    try {
      await addPaymentRecord({
      studentId: st.id,
      studentNome: st.nome,
      plano: st.plano,
      mesReferencia: payMesRef,
      valor: payValor,
      valorOriginal: 180,
      desconto: Math.max(0, 180 - payValor),
      dataVencimento: payDataVenc,
      status: 'pendente',
      professorId: prof?.id,
      professorNome: prof?.nome,
      chavePixProfessor: prof?.chavePix
      });
      const records = await refreshPaymentsFromSupabase();
      setSupabasePayments(records);
      setShowPayModal(false);
    } catch (error) {
      setDatabaseError(error instanceof Error ? error.message : 'Não foi possível salvar a mensalidade.');
    }
  };

  const handleMarkPaymentPaid = async (paymentId: string) => {
    setDatabaseError(null);
    try {
      await markPaymentPaid(paymentId, 'PIX');
      const records = await refreshPaymentsFromSupabase();
      setSupabasePayments(records);
    } catch (error) {
      setDatabaseError(error instanceof Error ? error.message : 'Não foi possível atualizar o pagamento.');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
            <DollarSign className="w-4 h-4" />
            {isProfessor ? 'Área Docente • Mensalidades Vinculadas' : 'Gestão Financeira Descentralizada'}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isProfessor ? `Mensalidades dos Alunos • Prof. ${currentUser.nome}` : 'Controle de Pagamentos por Professor'}
          </h1>
          <p className="text-sm text-slate-500">
            {isProfessor 
              ? `Os seus ${myStudents.length} alunos pagam diretamente na sua chave PIX: ${myInstructor?.chavePix || 'Não cadastrada'}. Você tem acesso exclusivo a estes lançamentos.`
              : 'Cada aluno paga a mensalidade diretamente para o seu professor responsável (com chave PIX individual).'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {supabaseConfig.enabled && (
            <button
              type="button"
              onClick={handleRefreshPayments}
              disabled={databaseLoading}
              className="flex items-center gap-2 bg-theme-card hover:bg-theme-card-hover text-theme-main border border-theme text-xs font-semibold px-4 py-2.5 rounded-xl transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${databaseLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
          )}
          <button
            onClick={() => setShowPayModal(true)}
            disabled={!supabaseConfig.enabled}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Lançar Mensalidade
          </button>
        </div>
      </div>

      {!supabaseConfig.enabled || databaseLoading || databaseError ? (
        <div className={`p-4 rounded-2xl border text-sm ${databaseError ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' : 'bg-blue-500/10 border-blue-500/30 text-theme-main'}`}>
          {databaseLoading
            ? 'Carregando mensalidades registradas no Supabase...'
            : databaseError
              ? databaseError
              : 'O financeiro usa exclusivamente registros da tabela pagamentos no Supabase. Ative a integração em Configurações > Banco de Dados para consultar e lançar mensalidades.'}
        </div>
      ) : null}
      {/* Professor Revenue Breakdown Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <UserRound className="w-4 h-4 text-blue-600" />
            {isProfessor ? 'Sua Chave PIX e Repasse Direto' : 'Arrecadação Individual por Professor Responsável'}
          </h3>
          {!isProfessor && <span className="text-xs text-slate-400">Clique em um professor para filtrar</span>}
        </div>

        <div className={`grid grid-cols-1 ${isProfessor ? 'md:grid-cols-1 max-w-xl' : 'md:grid-cols-3'} gap-4`}>
          {(isProfessor ? (myInstructor ? [myInstructor] : instructors.slice(0, 1)) : instructors).map(prof => {
            const profStudents = students.filter(s => s.professorId === prof.id);
            const profPayments = financialPayments.filter(p => p.professorId === prof.id);
            const profRecebido = profPayments
              .filter(p => p.status === 'em_dia')
              .reduce((acc, p) => acc + p.valor, 0);
            const profPendente = profPayments
              .filter(p => p.status === 'pendente' || p.status === 'atrasado')
              .reduce((acc, p) => acc + p.valor, 0);
            const isSelected = filterProfessor === prof.id;

            return (
              <div 
                key={prof.id}
                onClick={() => !isProfessor && setFilterProfessor(isSelected ? 'all' : prof.id)}
                className={`bg-white rounded-2xl p-5 border transition-all shadow-xs ${
                  !isProfessor ? 'cursor-pointer' : ''
                } ${
                  isSelected 
                    ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md bg-blue-50/10' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm border-2 border-red-600">
                      {prof.nome.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{prof.nome}</h4>
                      <span className="text-xs text-slate-500">{profStudents.length} alunos sob sua tutela</span>
                    </div>
                  </div>
                  {isProfessor && (
                    <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                      Seu Perfil Ativo
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Recebido (Mês)</span>
                    <span className="text-base font-black text-emerald-600">
                      R$ {profRecebido.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Pendente/Atraso</span>
                    <span className="text-base font-black text-amber-600">
                      R$ {profPendente.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>

                {prof.chavePix && (
                  <div className="mt-3 p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200/80 flex items-center justify-between text-[11px]">
                    <div className="truncate mr-2">
                      <span className="text-emerald-800 block text-[9px] uppercase font-bold">Chave PIX para recebimento:</span>
                      <span className="font-mono font-bold text-slate-800 truncate">{prof.chavePix}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyPix(prof.chavePix || '', prof.id);
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg transition-colors shrink-0 flex items-center gap-1 font-bold text-[10px]"
                      title="Copiar Chave PIX"
                    >
                      {copiedPixId === prof.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" /> Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copiar PIX
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* KPI Cards for Financial Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Recebido */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Recebido</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-600">
              R$ {totalRecebido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-500 mt-1">Mensalidades quitadas no mês</p>
          </div>
        </div>

        {/* Pendente */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">A Vencer (Pendente)</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-amber-600">
              R$ {totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-500 mt-1">Previsão nos próximos dias</p>
          </div>
        </div>

        {/* Atrasado / Inadimplência */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Em Atraso</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-rose-600">
              R$ {totalAtrasado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-500 mt-1">Necessita envio de lembrete</p>
          </div>
        </div>

        {/* Impacto Social / Bolsas */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Subsídio Social</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-purple-700">
              R$ {totalSubsidioSocial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-500 mt-1">Investido em atletas e inclusão</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 flex-wrap">
          {/* Professor Filter */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 text-xs">
            <UserRound className="w-3.5 h-3.5 text-blue-600" />
            <select
              value={filterProfessor}
              onChange={(e) => setFilterProfessor(e.target.value)}
              className="bg-transparent font-semibold focus:outline-none"
            >
              <option value="all">Todos os Professores</option>
              {instructors.map(inst => (
                <option key={inst.id} value={inst.id}>
                  Prof. {inst.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Plan Filter */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="bg-transparent font-semibold focus:outline-none"
            >
              <option value="all">Todos os Planos</option>
              <option value="regular">Regulares</option>
              <option value="infantil">Infantil</option>
              <option value="bolsista">Bolsistas</option>
              <option value="projeto_social">Projeto Gratuito</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 text-xs">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent font-semibold focus:outline-none"
            >
              <option value="all">Todos os Status</option>
              <option value="em_dia">Em Dia (Pago)</option>
              <option value="pendente">Pendente</option>
              <option value="atrasado">Em Atraso</option>
              <option value="isento">Isento (Projeto Social)</option>
            </select>
          </div>

          {/* Search box */}
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Buscar aluno ou professor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Registros: <strong className="text-slate-900">{filteredPayments.length}</strong>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-100 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Aluno</th>
                <th className="p-4">Professor Responsável (Recebedor)</th>
                <th className="p-4">Categoria</th>
                <th className="p-4">Vencimento</th>
                <th className="p-4">Valor</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map(p => {
                const isPaid = p.status === 'em_dia';
                const isLate = p.status === 'atrasado';
                const isExempt = p.status === 'isento';
                const prof = instructors.find(i => i.id === p.professorId);
                const chavePix = p.chavePixProfessor || prof?.chavePix;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-slate-900 block text-sm">{p.studentNome}</span>
                      {p.metodo && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          Via {p.metodo} {p.dataPagamento && `em ${new Date(p.dataPagamento + 'T00:00:00').toLocaleDateString('pt-BR')}`}
                        </span>
                      )}
                    </td>

                    {/* Professor and PIX column */}
                    <td className="p-4">
                      <span className="font-bold text-slate-900 block text-xs">
                        {p.professorNome || prof?.nome || academySettings.mestreResponsavel || 'Professor Responsável'}
                      </span>
                      {chavePix && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">
                            {chavePix}
                          </span>
                          <button
                            onClick={() => handleCopyPix(chavePix, p.id)}
                            className="text-slate-400 hover:text-blue-600 p-0.5 rounded"
                            title="Copiar chave PIX do professor"
                          >
                            {copiedPixId === p.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                        p.plano === 'regular' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        p.plano === 'infantil' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                        p.plano === 'bolsista' ? 'bg-purple-50 text-purple-800 border border-purple-200' :
                        'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}>
                        {p.plano.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="p-4 font-mono text-slate-600">
                      {new Date(p.dataVencimento + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </td>

                    <td className="p-4 font-mono font-bold text-sm">
                      {isExempt ? (
                        <span className="text-emerald-700">Gratuito</span>
                      ) : (
                        <span className={isLate ? 'text-rose-600' : 'text-slate-900'}>
                          R$ {p.valor.toFixed(2)}
                        </span>
                      )}
                      {p.desconto > 0 && (
                        <span className="text-[10px] text-purple-600 block font-normal">
                          (Bolsa: -R$ {p.desconto})
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      {isPaid && (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Pago
                        </span>
                      )}
                      {isLate && (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-bold bg-rose-50 px-2.5 py-1 rounded-full text-xs">
                          <AlertCircle className="w-3.5 h-3.5" /> Vencido
                        </span>
                      )}
                      {p.status === 'pendente' && (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded-full text-xs">
                          <Clock className="w-3.5 h-3.5" /> A Vencer
                        </span>
                      )}
                      {isExempt && (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full text-xs">
                          <Heart className="w-3.5 h-3.5" /> Social
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!isPaid && !isExempt && (
                          <>
                            <button
                              onClick={() => handleMarkPaymentPaid(p.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-2.5 py-1.5 rounded-lg shadow-xs transition-colors flex items-center gap-1"
                              title="Dar baixa como pago via PIX ao professor"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Baixa
                            </button>

                            <button
                              onClick={() => handleOpenWhatsAppReminder(p)}
                              className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold px-2.5 py-1.5 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1"
                              title="Enviar cobrança via WhatsApp com chave PIX do professor"
                            >
                              <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => setSelectedPaymentForReceipt(p)}
                          className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
                          title="Emitir Recibo"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal New Payment */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Lançar Mensalidade</h3>
              <button onClick={() => setShowPayModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewPayment} className="space-y-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Aluno</label>
                <select
                  value={payStudentId}
                  onChange={(e) => {
                    setPayStudentId(e.target.value);
                    const s = students.find(st => st.id === e.target.value);
                    if (s) setPayValor(s.valorMensalidade);
                  }}
                  className="w-full border border-slate-300 rounded-lg p-2.5 font-semibold"
                >
                  {(isProfessor ? myStudents : students).map(s => (
                    <option key={s.id} value={s.id}>
                      {s.nome} (Prof. {s.professorNome || 'Carlos'}) - R$ {s.valorMensalidade}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mês de Referência</label>
                  <input
                    type="text"
                    value={payMesRef}
                    onChange={(e) => setPayMesRef(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                    placeholder="Ex: Novembro/2026"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Data Vencimento</label>
                  <input
                    type="date"
                    value={payDataVenc}
                    onChange={(e) => setPayDataVenc(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Valor Cobrado (R$)</label>
                <input
                  type="number"
                  value={payValor}
                  onChange={(e) => setPayValor(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Salvar Cobrança
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedPaymentForReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between no-print">
              <span className="font-bold text-xs uppercase tracking-wider">Recibo Oficial {academySettings.nomeAcademia || 'Mikalkenas Jiu Jitsu'}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> Imprimir
                </button>
                <button
                  onClick={() => setSelectedPaymentForReceipt(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-800">
              <div className="text-center pb-3 border-b border-slate-200">
                <h3 className="font-black text-base text-slate-900">{(academySettings.nomeAcademia || 'Mikalkenas Jiu Jitsu').toUpperCase()}</h3>
                <p className="text-[11px] text-slate-500">Comprovante de Pagamento de Mensalidade</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Praticante:</span>
                  <span className="font-bold text-slate-900">{selectedPaymentForReceipt.studentNome}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Professor Responsável:</span>
                  <span className="font-bold text-blue-700">{selectedPaymentForReceipt.professorNome || academySettings.mestreResponsavel || 'Mestre Responsável'}</span>
                </div>
                {selectedPaymentForReceipt.chavePixProfessor && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Chave PIX Destino:</span>
                    <span className="font-mono text-slate-800">{selectedPaymentForReceipt.chavePixProfessor}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Mês Referência:</span>
                  <span className="font-semibold text-slate-900">{selectedPaymentForReceipt.mesReferencia}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Categoria:</span>
                  <span className="font-semibold capitalize text-slate-900">
                    {selectedPaymentForReceipt.plano.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Vencimento:</span>
                  <span className="font-mono text-slate-900">
                    {new Date(selectedPaymentForReceipt.dataVencimento + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100 text-sm font-bold">
                  <span>Valor Pago:</span>
                  <span className="text-emerald-700 font-mono">
                    R$ {selectedPaymentForReceipt.valor.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-8 text-center text-[10px] text-slate-400 border-t border-slate-200">
                <div className="h-0.5 bg-slate-300 w-48 mx-auto mb-1"></div>
                <p className="font-semibold text-slate-600">
                  {selectedPaymentForReceipt.professorNome || academySettings.mestreResponsavel || 'Mestre Responsável'} • Mestre BJJ
                </p>
                <p>Obrigado por fortalecer nosso tatame. Oss!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
