import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserRound, 
  Award, 
  Phone, 
  Mail, 
  Plus, 
  ShieldCheck, 
  Calendar,
  BookOpen,
  DollarSign,
  Users,
  Copy,
  Check,
  ArrowRight,
  FileSpreadsheet,
  Trash2,
  AlertTriangle,
  Search
} from 'lucide-react';
import { useBjj } from '../context/BjjContext';
import { BeltBadge } from '../components/ui/BeltBadge';
import { BeltColor, Instructor, GraduationSystemType, UserPermissions } from '../types';
import { BatchUploadModal } from '../components/import/BatchUploadModal';
import { EditInstructorModal } from '../components/instructor/EditInstructorModal';
import { ViewToggle, ViewMode } from '../components/ui/ViewToggle';
import { Pencil, Shield } from 'lucide-react';

export const Professores: React.FC = () => {
  const { 
    instructors, 
    students, 
    payments, 
    deleteInstructor, 
    addInstructor, 
    currentUser, 
    academySettings 
  } = useBjj();

  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [copiedPixId, setCopiedPixId] = useState<string | null>(null);
  const [deletingInstructor, setDeletingInstructor] = useState<Instructor | null>(null);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'warning' } | null>(null);

  // New professor form state
  const [nome, setNome] = useState('');
  const [faixa, setFaixa] = useState<BeltColor>('preta');
  const [graus, setGraus] = useState<number>(1);
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [registroCBJJ, setRegistroCBJJ] = useState('');
  const [chavePix, setChavePix] = useState('');
  const [banco, setBanco] = useState('Banco Inter / PIX');
  const [sistemaGraduacao, setSistemaGraduacao] = useState<GraduationSystemType>('graus_e_faixas');
  const [bio, setBio] = useState('');

  // Access Level state for professor registration
  const [accessRole, setAccessRole] = useState<'professor' | 'admin'>('professor');
  const [canManageStudents, setCanManageStudents] = useState(true);
  const [canManageGraduations, setCanManageGraduations] = useState(true);
  const [canManageFinance, setCanManageFinance] = useState(false);
  const [canManageClasses, setCanManageClasses] = useState(true);
  const [canManageEvents, setCanManageEvents] = useState(true);

  const canManageProfessors = currentUser.role === 'admin' || currentUser.isMasterAdmin || currentUser.role === 'professor';

  const triggerToast = (text: string, type: 'success' | 'warning' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 4500);
  };

  const handleCopyPix = (pix: string, id: string) => {
    navigator.clipboard.writeText(pix);
    setCopiedPixId(id);
    setTimeout(() => setCopiedPixId(null), 2500);
  };

  const handleCreateProfessor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    const chosenEmail = email.trim() || `${nome.toLowerCase().replace(/\s+/g, '.')}@mikalkenasbjj.com.br`;

    addInstructor(
      {
        nome,
        faixa,
        graus: Number(graus),
        email: chosenEmail,
        telefone: telefone || '(11) 98888-7777',
        registroCBJJ: registroCBJJ || 'CBJJ #Pendente',
        bio: bio || `Professor e instrutor de Jiu-Jitsu dedicado ao ensino na ${academySettings.nomeAcademia}.`,
        turmas: ['Todas as turmas gerais'],
        chavePix: chavePix || chosenEmail,
        banco: banco || 'Banco Inter / PIX',
        sistemaGraduacao
      },
      {
        role: accessRole,
        permissions: {
          canManageStudents,
          canManageGraduations,
          canManageFinancial: canManageFinance,
          canManageClasses,
          canManageEvents
        }
      }
    );

    setShowAddModal(false);
    triggerToast(`Professor "${nome}" cadastrado. Provisione a conta no Supabase Auth e vincule seu UUID ao perfil para liberar o acesso.`);
    setNome('');
    setEmail('');
    setTelefone('');
    setRegistroCBJJ('');
    setChavePix('');
    setBio('');
    setAccessRole('professor');
  };

  const handleConfirmDelete = () => {
    if (!deletingInstructor) return;
    const profName = deletingInstructor.nome;

    if (deletingInstructor.id === 'inst-thiago' || (instructors.length === 1 && deletingInstructor.id === instructors[0].id)) {
      triggerToast('O Mestre Responsável principal não pode ser excluído diretamente enquanto for o único mestre ativo.', 'warning');
      setDeletingInstructor(null);
      return;
    }

    deleteInstructor(deletingInstructor.id);
    triggerToast(`Professor "${profName}" excluído com sucesso do corpo docente.`);
    setDeletingInstructor(null);
  };

  const filteredInstructors = instructors.filter(prof => {
    const q = search.toLowerCase();
    return (
      prof.nome.toLowerCase().includes(q) ||
      prof.email.toLowerCase().includes(q) ||
      (prof.registroCBJJ && prof.registroCBJJ.toLowerCase().includes(q)) ||
      (prof.telefone && prof.telefone.includes(q))
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className={`p-4 rounded-2xl flex items-center justify-between text-xs font-bold shadow-md animate-fade-in ${
          toastMsg.type === 'warning'
            ? 'bg-amber-50 text-amber-900 border border-amber-200'
            : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
        }`}>
          <div className="flex items-center gap-2">
            {toastMsg.type === 'warning' ? (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            ) : (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>{toastMsg.text}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-slate-400 hover:text-slate-600 ml-4 font-bold text-sm">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <UserRound className="w-4 h-4" />
            Corpo Docente & Gestão de Tatame
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Professores, Mestres & Alunos Vinculados
          </h1>
          <p className="text-sm text-slate-500">
            Acompanhe os alunos sob tutela de cada professor e o repasse direto das mensalidades via PIX.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <ViewToggle 
            mode={viewMode} 
            onChange={setViewMode} 
            cardsLabel="Visualização em Cards"
            tableLabel="Visualização em Tabela"
          />

          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-all border border-slate-200"
          >
            <FileSpreadsheet className="w-4 h-4 text-purple-600" />
            Importar CSV
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Novo Professor
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[220px]">
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou registro CBJJ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="text-xs text-slate-500">
          Total listado: <strong className="text-slate-900">{filteredInstructors.length} professores</strong>
        </div>
      </div>

      {/* Content: Cards or Table */}
      {filteredInstructors.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500 space-y-3">
          <UserRound className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700 text-base">Nenhum professor encontrado</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Não há professores cadastrados correspondentes à sua busca. Cadastre um novo ou importe via planilha.
          </p>
        </div>
      ) : viewMode === 'cards' ? (
        /* Visualização Atual: Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstructors.map(prof => {
            const profStudents = students.filter(s => s.professorId === prof.id);
            const profPayments = payments.filter(p => p.professorId === prof.id);
            const totalArrecadado = profPayments
              .filter(p => p.status === 'em_dia')
              .reduce((acc, p) => acc + p.valor, 0);
            const totalPendente = profPayments
              .filter(p => p.status === 'pendente' || p.status === 'atrasado')
              .reduce((acc, p) => acc + p.valor, 0);

            return (
              <div 
                key={prof.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border-2 border-red-600 shrink-0 flex items-center justify-center font-bold text-white shadow-md">
                        {prof.foto ? (
                          <img src={prof.foto} alt={prof.nome} className="w-full h-full object-cover" />
                        ) : (
                          prof.nome.charAt(0)
                        )}
                      </div>

                      <div>
                        <h3 className="font-extrabold text-base text-slate-900 leading-snug">{prof.nome}</h3>
                        <div className="mt-1">
                          <BeltBadge faixa={prof.faixa} graus={prof.graus} size="sm" />
                        </div>
                        <span className="text-[11px] text-blue-600 font-mono font-semibold block mt-1">
                          {prof.registroCBJJ}
                        </span>
                      </div>
                    </div>

                    {/* Botões de Ação do Professor */}
                    {canManageProfessors && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingInstructor(prof)}
                          className="text-slate-400 hover:text-amber-600 p-1.5 rounded-lg transition-colors hover:bg-amber-50"
                          title={`Editar dados e permissões de ${prof.nome}`}
                        >
                          <Pencil className="w-4 h-4 text-amber-600" />
                        </button>
                        <button
                          onClick={() => setDeletingInstructor(prof)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors hover:bg-rose-50"
                          title={`Excluir professor ${prof.nome}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* PIX Key Box */}
                  {prof.chavePix && (
                    <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/70 space-y-1">
                      <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block">
                        Chave PIX para Mensalidades dos Alunos:
                      </span>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-950 truncate">
                          {prof.chavePix}
                        </span>
                        <button
                          onClick={() => handleCopyPix(prof.chavePix || '', prof.id)}
                          className="bg-white hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-1 rounded border border-emerald-300 flex items-center gap-1 transition-colors shrink-0"
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
                      {prof.banco && (
                        <span className="text-[10px] text-slate-500 block">{prof.banco}</span>
                      )}
                    </div>
                  )}

                  {/* Financial Summary */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Mensalidades Recebidas</span>
                      <span className="text-base font-black text-emerald-600">
                        R$ {totalArrecadado.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">A Receber</span>
                      <span className="text-base font-black text-amber-600">
                        R$ {totalPendente.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  {/* Linked Students List */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-blue-600" />
                        Alunos Vinculados ({profStudents.length}):
                      </span>
                      <Link to="/equipe" className="text-blue-600 hover:underline text-[11px]">
                        Ver todos
                      </Link>
                    </div>

                    {profStudents.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic">Nenhum aluno vinculado no momento.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                        {profStudents.map(st => (
                          <span 
                            key={st.id}
                            className="text-[11px] bg-slate-100 text-slate-800 px-2 py-1 rounded-md font-medium flex items-center gap-1"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                            {st.nome.split(' ')[0]} ({st.faixa})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {prof.bio && (
                    <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                      {prof.bio}
                    </p>
                  )}

                  <div className="space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{prof.telefone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{prof.email}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Habilitado para Graduar
                  </span>
                  <div className="flex items-center gap-2">
                    {canManageProfessors && (
                      <button
                        onClick={() => setEditingInstructor(prof)}
                        className="text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 text-[11px] transition-colors"
                      >
                        <Pencil className="w-3 h-3 text-amber-600" /> Editar
                      </button>
                    )}
                    <Link
                      to="/financeiro"
                      className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 text-[11px]"
                    >
                      Financeiro →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Visualização em Lista / Tabela */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/90 text-slate-600 font-bold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Professor</th>
                  <th className="p-4">Graduação & Registro</th>
                  <th className="p-4">Contato</th>
                  <th className="p-4">Chave PIX</th>
                  <th className="p-4 text-center">Alunos</th>
                  <th className="p-4">Arrecadação (Mês)</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInstructors.map(prof => {
                  const profStudents = students.filter(s => s.professorId === prof.id);
                  const profPayments = payments.filter(p => p.professorId === prof.id);
                  const totalArrecadado = profPayments
                    .filter(p => p.status === 'em_dia')
                    .reduce((acc, p) => acc + p.valor, 0);
                  const totalPendente = profPayments
                    .filter(p => p.status === 'pendente' || p.status === 'atrasado')
                    .reduce((acc, p) => acc + p.valor, 0);

                  return (
                    <tr key={prof.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-900 border-2 border-red-600 shrink-0 flex items-center justify-center font-bold text-white shadow-xs text-xs">
                            {prof.foto ? (
                              <img src={prof.foto} alt={prof.nome} className="w-full h-full object-cover" />
                            ) : (
                              prof.nome.charAt(0)
                            )}
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-900 block text-sm">{prof.nome}</span>
                            <span className="text-[10px] text-slate-400">Sistema: {prof.sistemaGraduacao === 'apenas_faixas' ? 'Faixas Diretas' : 'Graus e Faixas'}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="space-y-1">
                          <BeltBadge faixa={prof.faixa} graus={prof.graus} size="sm" />
                          <span className="text-[11px] font-mono text-blue-600 block">{prof.registroCBJJ}</span>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="space-y-0.5 text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span className="truncate max-w-[170px]">{prof.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{prof.telefone}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        {prof.chavePix ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs text-emerald-900 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 truncate max-w-[160px]">
                              {prof.chavePix}
                            </span>
                            <button
                              onClick={() => handleCopyPix(prof.chavePix || '', prof.id)}
                              className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-emerald-700"
                              title="Copiar PIX"
                            >
                              {copiedPixId === prof.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Não informada</span>
                        )}
                      </td>

                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-bold">
                          <Users className="w-3 h-3" />
                          {profStudents.length}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="space-y-0.5">
                          <span className="font-black text-emerald-600 block text-xs">
                            R$ {totalArrecadado.toLocaleString('pt-BR')} (Recebido)
                          </span>
                          {totalPendente > 0 && (
                            <span className="text-[10px] text-amber-600 font-semibold block">
                              R$ {totalPendente.toLocaleString('pt-BR')} (Pendente)
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {canManageProfessors && (
                            <button
                              onClick={() => setEditingInstructor(prof)}
                              className="px-2 py-1 text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors flex items-center gap-1 border border-amber-200"
                              title={`Editar ${prof.nome}`}
                            >
                              <Pencil className="w-3.5 h-3.5 text-amber-600" />
                              <span className="text-[11px] font-bold">Editar</span>
                            </button>
                          )}
                          <Link
                            to="/financeiro"
                            className="px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            Financeiro
                          </Link>
                          {canManageProfessors && (
                            <button
                              onClick={() => setDeletingInstructor(prof)}
                              className="px-2 py-1 text-rose-600 hover:text-rose-700 bg-rose-50/70 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1 border border-rose-200"
                              title={`Excluir professor ${prof.nome}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="text-[11px] font-bold">Excluir</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal to Delete Instructor */}
      {deletingInstructor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 text-xs animate-scale-up">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-black text-slate-900 text-lg">Confirmar Exclusão do Professor</h3>
              <p className="text-slate-500">
                Tem certeza que deseja remover <strong>{deletingInstructor.nome}</strong> da equipe docente?
              </p>
            </div>

            {students.filter(s => s.professorId === deletingInstructor.id).length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] leading-relaxed">
                <strong>Atenção:</strong> Existem {students.filter(s => s.professorId === deletingInstructor.id).length} aluno(s) vinculados a este professor. Seus vínculos serão redirecionados ao <strong>{academySettings.mestreResponsavel || 'Mestre Responsável'}</strong>.
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingInstructor(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Sim, Excluir Professor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Instructor */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl border border-slate-200 space-y-4 text-xs my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-lg">Cadastrar Novo Professor</h3>
                <p className="text-slate-500 text-[11px]">Habilite novos instrutores para turmas, graduações e recebimento PIX</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProfessor} className="space-y-3.5">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Carlos Eduardo de Oliveira"
                  className="w-full border border-slate-300 rounded-xl p-2 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Faixa</label>
                  <select
                    value={faixa}
                    onChange={(e) => setFaixa(e.target.value as BeltColor)}
                    className="w-full border border-slate-300 rounded-xl p-2 font-semibold capitalize bg-white"
                  >
                    <option value="roxa">Roxa</option>
                    <option value="marrom">Marrom</option>
                    <option value="preta">Preta</option>
                    <option value="coral">Coral</option>
                    <option value="vermelha">Vermelha</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Graus</label>
                  <select
                    value={graus}
                    onChange={(e) => setGraus(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl p-2 font-semibold bg-white"
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7].map(g => (
                      <option key={g} value={g}>{g}º Grau</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="professor@mikalkenasbjj.com.br"
                    className="w-full border border-slate-300 rounded-xl p-2"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">WhatsApp / Telefone</label>
                  <input
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(11) 98888-7777"
                    className="w-full border border-slate-300 rounded-xl p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Registro CBJJ / IBJJF</label>
                  <input
                    type="text"
                    value={registroCBJJ}
                    onChange={(e) => setRegistroCBJJ(e.target.value)}
                    placeholder="Ex: CBJJ #92140"
                    className="w-full border border-slate-300 rounded-xl p-2 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Sistema de Graduação</label>
                  <select
                    value={sistemaGraduacao}
                    onChange={(e) => setSistemaGraduacao(e.target.value as GraduationSystemType)}
                    className="w-full border border-slate-300 rounded-xl p-2 bg-white font-semibold"
                  >
                    <option value="graus_e_faixas">Graus e Faixas (Padrão IBJJF)</option>
                    <option value="apenas_faixas">Apenas Faixas Diretas</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Chave PIX (Para Mensalidades)</label>
                  <input
                    type="text"
                    value={chavePix}
                    onChange={(e) => setChavePix(e.target.value)}
                    placeholder="CPF, e-mail ou celular"
                    className="w-full border border-slate-300 rounded-xl p-2 font-mono text-emerald-900 bg-emerald-50/40"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Banco / Detalhes</label>
                  <input
                    type="text"
                    value={banco}
                    onChange={(e) => setBanco(e.target.value)}
                    placeholder="Ex: Nubank / Banco Inter"
                    className="w-full border border-slate-300 rounded-xl p-2"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Biografia & Especialidades</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Histórico no jiu-jitsu, títulos e turmas que ministra..."
                  rows={2}
                  className="w-full border border-slate-300 rounded-xl p-2 text-xs"
                />
              </div>

              {/* Nível de Acesso e Permissões do Usuário */}
              <div className="pt-3 border-t border-slate-200/80 space-y-3 bg-slate-50 p-3.5 rounded-2xl border">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs">
                  <Shield className="w-4 h-4 text-red-600" />
                  <span>Nível de Acesso no Sistema (Supabase Auth)</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Perfil de Acesso</label>
                    <select
                      value={accessRole}
                      onChange={(e) => {
                        const r = e.target.value as 'professor' | 'admin';
                        setAccessRole(r);
                        if (r === 'admin') {
                          setCanManageStudents(true);
                          setCanManageGraduations(true);
                          setCanManageFinance(true);
                          setCanManageClasses(true);
                          setCanManageEvents(true);
                        } else {
                          setCanManageStudents(true);
                          setCanManageGraduations(true);
                          setCanManageFinance(false);
                          setCanManageClasses(true);
                          setCanManageEvents(true);
                        }
                      }}
                      className="w-full border border-slate-300 rounded-xl p-2 bg-white font-bold text-xs"
                    >
                      <option value="professor">Professor (Docente / Suas Turmas)</option>
                      <option value="admin">Administrador (Acesso Total)</option>
                    </select>
                  </div>

                </div>
                <p className="text-[11px] text-slate-600">
                  Provisione a conta no Supabase Auth e vincule o UUID ao perfil em usuarios. Senhas não são armazenadas pelo aplicativo.
                </p>

                <div className="space-y-1.5 pt-1">
                  <label className="font-semibold text-slate-600 block text-[11px]">
                    Permissões Específicas do Usuário:
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={canManageStudents}
                        onChange={(e) => setCanManageStudents(e.target.checked)}
                        className="rounded text-red-600 focus:ring-red-500"
                      />
                      <span>Gerenciar Alunos</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={canManageGraduations}
                        onChange={(e) => setCanManageGraduations(e.target.checked)}
                        className="rounded text-red-600 focus:ring-red-500"
                      />
                      <span>Avaliar & Graduar</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={canManageClasses}
                        onChange={(e) => setCanManageClasses(e.target.checked)}
                        className="rounded text-red-600 focus:ring-red-500"
                      />
                      <span>Turmas & Presenças</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={canManageEvents}
                        onChange={(e) => setCanManageEvents(e.target.checked)}
                        className="rounded text-red-600 focus:ring-red-500"
                      />
                      <span>Eventos & Campeonatos</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer col-span-2">
                      <input
                        type="checkbox"
                        checked={canManageFinance}
                        onChange={(e) => setCanManageFinance(e.target.checked)}
                        className="rounded text-red-600 focus:ring-red-500"
                      />
                      <span>Financeiro Geral da Academia</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Salvar Professor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Instructor Modal */}
      <EditInstructorModal
        instructor={editingInstructor}
        isOpen={!!editingInstructor}
        onClose={() => setEditingInstructor(null)}
      />

      {showUploadModal && (
        <BatchUploadModal
          type="professors"
          onClose={() => setShowUploadModal(false)}
        />
      )}
    </div>
  );
};
