import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  AlertCircle, 
  Loader2, 
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  Award,
  BookOpen
} from 'lucide-react';
import { useBjj } from '../context/BjjContext';
import { AuthUser, UserStatus } from '../types';

export const Aprovacoes: React.FC = () => {
  const { 
    currentUser, 
    pendingUsers, 
    loadPendingUsers, 
    approveUser, 
    rejectUser,
    supabaseConfig 
  } = useBjj();

  const [filterStatus, setFilterStatus] = useState<string>('pendente');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Security check: Only admins can view this screen
  if (currentUser.role !== 'admin') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4 border border-rose-500/40">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-theme-main mb-2">Acesso Restrito à Administração</h2>
        <p className="text-sm text-theme-muted max-w-md">
          Apenas usuários com perfil de administrador possuem autorização para revisar e aprovar cadastros pendentes no sistema.
        </p>
      </div>
    );
  }

  const fetchUsers = async (status?: string) => {
    setIsLoading(true);
    setFeedbackMessage(null);
    try {
      await loadPendingUsers(status || filterStatus);
    } catch (err: any) {
      setFeedbackMessage({
        type: 'error',
        text: `Falha ao carregar usuários: ${err?.message || 'Erro desconhecido'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(filterStatus);
  }, [filterStatus]);

  const handleApprove = async (user: AuthUser) => {
    setActionLoadingId(user.id);
    setFeedbackMessage(null);
    try {
      const res = await approveUser(user.id);
      if (res.success) {
        setFeedbackMessage({
          type: 'success',
          text: `Cadastro de "${user.nome}" aprovado com sucesso! O acesso ao sistema está liberado.`
        });
        await fetchUsers(filterStatus);
      } else {
        setFeedbackMessage({
          type: 'error',
          text: res.error || 'Erro ao aprovar cadastro no Supabase.'
        });
      }
    } catch (err: any) {
      setFeedbackMessage({
        type: 'error',
        text: `Erro ao aprovar: ${err?.message || 'Falha de comunicação com o Supabase'}`
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (user: AuthUser) => {
    if (!window.confirm(`Tem certeza que deseja reprovar o cadastro de "${user.nome}"? O login permanecerá bloqueado.`)) {
      return;
    }

    setActionLoadingId(user.id);
    setFeedbackMessage(null);
    try {
      const res = await rejectUser(user.id);
      if (res.success) {
        setFeedbackMessage({
          type: 'success',
          text: `Cadastro de "${user.nome}" foi reprovado.`
        });
        await fetchUsers(filterStatus);
      } else {
        setFeedbackMessage({
          type: 'error',
          text: res.error || 'Erro ao reprovar cadastro no Supabase.'
        });
      }
    } catch (err: any) {
      setFeedbackMessage({
        type: 'error',
        text: `Erro ao reprovar: ${err?.message || 'Falha de comunicação com o Supabase'}`
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredUsers = pendingUsers.filter(u => {
    const matchesSearch = 
      (u.nome && u.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.role && u.role.toLowerCase().includes(searchTerm.toLowerCase()));

    if (filterStatus === 'todos') return matchesSearch;
    return matchesSearch && (u.status === filterStatus || (!u.status && filterStatus === 'pendente'));
  });

  const countPending = pendingUsers.filter(u => u.status === 'pendente' || !u.status).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-theme-card border border-theme rounded-2xl p-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-500" />
            <h1 className="text-xl font-black text-theme-main">Aprovação de Cadastros</h1>
            {countPending > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500 text-slate-950">
                {countPending} pendente{countPending > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-xs text-theme-muted">
            Revise solicitações de novos professores e alunos registradas no Supabase. O login só é liberado após aprovação formal.
          </p>
        </div>

        <button
          onClick={() => fetchUsers(filterStatus)}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-theme-app border border-theme text-xs font-bold text-theme-main hover:bg-theme-card transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Atualizar Lista</span>
        </button>
      </div>

      {/* Supabase Notice if not configured */}
      {(!supabaseConfig.url || !supabaseConfig.anonKey) && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Supabase não configurado</p>
            <p className="text-amber-300/90">
              Para listar e gerenciar solicitações de cadastro, configure a URL e a chave pública do Supabase em <strong>Configurações &gt; Banco de Dados</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Feedback Banner */}
      {feedbackMessage && (
        <div className={`p-4 rounded-xl border text-xs flex items-center justify-between gap-3 ${
          feedbackMessage.type === 'success'
            ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
            : 'bg-rose-950/60 border-rose-800 text-rose-200'
        }`}>
          <div className="flex items-center gap-2">
            {feedbackMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span className="font-medium">{feedbackMessage.text}</span>
          </div>
          <button 
            onClick={() => setFeedbackMessage(null)}
            className="text-xs opacity-75 hover:opacity-100 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Controls: Tabs & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-theme-app border border-theme rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setFilterStatus('pendente')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterStatus === 'pendente'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-theme-muted hover:text-theme-main'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pendentes</span>
            {countPending > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                filterStatus === 'pendente' ? 'bg-slate-950 text-amber-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {countPending}
              </span>
            )}
          </button>

          <button
            onClick={() => setFilterStatus('aprovado')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterStatus === 'aprovado'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-theme-muted hover:text-theme-main'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Aprovados</span>
          </button>

          <button
            onClick={() => setFilterStatus('reprovado')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterStatus === 'reprovado'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-theme-muted hover:text-theme-main'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Reprovados</span>
          </button>

          <button
            onClick={() => setFilterStatus('todos')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterStatus === 'todos'
                ? 'bg-theme-card text-theme-main border border-theme shadow-sm'
                : 'text-theme-muted hover:text-theme-main'
            }`}
          >
            Todos
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome ou e-mail..."
            className="w-full bg-theme-app border border-theme rounded-xl px-3.5 py-2 pl-9 text-xs text-theme-main placeholder:text-theme-muted outline-none focus:border-amber-400"
          />
          <Search className="w-3.5 h-3.5 text-theme-muted absolute left-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Users List / Cards */}
      {isLoading ? (
        <div className="bg-theme-card border border-theme rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-xs text-theme-muted font-medium">Consultando registros na tabela usuarios...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-theme-card border border-theme rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-theme-app border border-theme text-theme-muted mx-auto flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-theme-muted" />
          </div>
          <h3 className="text-sm font-bold text-theme-main">Nenhum cadastro encontrado</h3>
          <p className="text-xs text-theme-muted max-w-sm mx-auto">
            Não há solicitações {filterStatus !== 'todos' ? `com status "${filterStatus}"` : ''} registradas no momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredUsers.map(user => {
            const isPending = user.status === 'pendente' || !user.status;
            const isApproved = user.status === 'aprovado' || user.status === 'ativo';
            const isRejected = user.status === 'reprovado';
            const isUserActing = actionLoadingId === user.id;

            return (
              <div
                key={user.id}
                className={`bg-theme-card border rounded-2xl p-5 space-y-4 transition-all shadow-sm ${
                  isPending 
                    ? 'border-amber-500/40 bg-gradient-to-br from-theme-card via-theme-card to-amber-500/5' 
                    : isApproved
                    ? 'border-emerald-500/30'
                    : 'border-rose-500/30 opacity-75'
                }`}
              >
                {/* Header of Card */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-theme-main">
                        {user.nome || 'Nome não informado'}
                      </span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        user.role === 'professor' 
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : user.role === 'admin'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {user.role === 'professor' ? 'Professor' : user.role === 'admin' ? 'Administrador' : 'Aluno'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-theme-muted">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span className="font-mono text-[11px]">{user.email}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1.5 shrink-0 ${
                    isPending
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : isApproved
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {isPending && <Clock className="w-3.5 h-3.5 animate-pulse" />}
                    {isApproved && <CheckCircle className="w-3.5 h-3.5" />}
                    {isRejected && <XCircle className="w-3.5 h-3.5" />}
                    <span>{isPending ? 'Pendente' : isApproved ? 'Aprovado' : 'Reprovado'}</span>
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-theme-app/60 p-3 rounded-xl border border-theme">
                  <div className="flex items-center gap-2 text-theme-muted">
                    <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Graduação:</span>
                    <strong className="text-theme-main capitalize">
                      {user.faixa || 'Branca'} ({user.graus || 0}º Grau)
                    </strong>
                  </div>

                  {user.telefone && (
                    <div className="flex items-center gap-2 text-theme-muted">
                      <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="font-mono text-theme-main">{user.telefone}</span>
                    </div>
                  )}

                  {user.createdAt && (
                    <div className="flex items-center gap-2 text-theme-muted col-span-2">
                      <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>Solicitado em: {new Date(user.createdAt).toLocaleString('pt-BR')}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-theme">
                  {isPending && (
                    <>
                      <button
                        onClick={() => handleReject(user)}
                        disabled={isUserActing}
                        className="px-3.5 py-2 rounded-xl border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isUserActing ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <UserX className="w-3.5 h-3.5" />
                        )}
                        <span>Reprovar</span>
                      </button>

                      <button
                        onClick={() => handleApprove(user)}
                        disabled={isUserActing}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
                      >
                        {isUserActing ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <UserCheck className="w-3.5 h-3.5" />
                        )}
                        <span>Aprovar Acesso</span>
                      </button>
                    </>
                  )}

                  {isRejected && (
                    <button
                      onClick={() => handleApprove(user)}
                      disabled={isUserActing}
                      className="px-3.5 py-2 rounded-xl border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isUserActing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserCheck className="w-3.5 h-3.5" />}
                      <span>Reverter para Aprovado</span>
                    </button>
                  )}

                  {isApproved && (
                    <button
                      onClick={() => handleReject(user)}
                      disabled={isUserActing}
                      className="px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-400/80 hover:bg-rose-500/10 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isUserActing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserX className="w-3.5 h-3.5" />}
                      <span>Suspender / Reprovar</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
