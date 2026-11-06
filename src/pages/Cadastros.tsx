import React, { useState } from 'react';
import { 
  UserPlus, 
  Clock, 
  UserRound, 
  BookOpen, 
  Package, 
  Trophy, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  ShieldCheck, 
  DollarSign, 
  Award,
  ChevronRight,
  Plus,
  ArrowRight,
  FileSpreadsheet,
  Pencil,
  Shield,
  Search,
  AlertCircle
} from 'lucide-react';
import { useBjj } from '../context/BjjContext';
import { 
  BeltColor, 
  PlanType, 
  PaymentStatus, 
  GraduationSystemType,
  Student,
  Instructor,
  ClassSchedule,
  Technique,
  AcademyEvent
} from '../types';
import { BeltBadge } from '../components/ui/BeltBadge';
import { BatchUploadModal } from '../components/import/BatchUploadModal';
import { EditStudentModal } from '../components/student/EditStudentModal';
import { EditInstructorModal } from '../components/instructor/EditInstructorModal';
import { EditClassModal } from '../components/classes/EditClassModal';
import { EditTechniqueModal } from '../components/technique/EditTechniqueModal';
import { EditEventModal } from '../components/events/EditEventModal';

type CadastroType = 'aluno' | 'turma' | 'professor' | 'tecnica' | 'produto' | 'evento';

export const Cadastros: React.FC = () => {
  const { 
    currentUser,
    students,
    instructors, 
    classes, 
    techniques,
    events,
    academySettings,
    addStudent, 
    addClassSchedule, 
    addInstructor, 
    addTechnique, 
    addProduct, 
    addEvent,
    getBeltGraduationRule
  } = useBjj();

  const [activeTab, setActiveTab] = useState<CadastroType>('aluno');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Edit Modals state
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [editingClass, setEditingClass] = useState<ClassSchedule | null>(null);
  const [editingTechnique, setEditingTechnique] = useState<Technique | null>(null);
  const [editingEvent, setEditingEvent] = useState<AcademyEvent | null>(null);
  const [searchExisting, setSearchExisting] = useState('');

  // --- Form 1: Aluno ---
  const [alunoNome, setAlunoNome] = useState('');
  const [alunoEmail, setAlunoEmail] = useState('');
  const [alunoTelefone, setAlunoTelefone] = useState('');
  const [alunoNascimento, setAlunoNascimento] = useState('2000-01-01');
  const [alunoInicio, setAlunoInicio] = useState(new Date().toISOString().split('T')[0]);
  const [alunoFaixa, setAlunoFaixa] = useState<BeltColor>('branca');
  const [alunoGraus, setAlunoGraus] = useState<number>(0);
  const [alunoSistemaGraduacao, setAlunoSistemaGraduacao] = useState<GraduationSystemType>(academySettings.sistemaGraduacaoPadrao || 'graus_e_faixas');
  const [alunoProfId, setAlunoProfId] = useState(instructors[0]?.id || '');
  const [alunoTurma, setAlunoTurma] = useState(classes[0]?.titulo || 'Jiu-Jitsu Noturno (Todos os Níveis)');
  const [alunoPlano, setAlunoPlano] = useState<PlanType>('regular');
  const [alunoValor, setAlunoValor] = useState<number>(academySettings.valorPadraoRegular || 180);
  const [alunoVencimento, setAlunoVencimento] = useState<number>(10);
  const [alunoStatusPagamento, setAlunoStatusPagamento] = useState<PaymentStatus>('em_dia');
  const [alunoKimono, setAlunoKimono] = useState('A2');
  const [alunoPeso, setAlunoPeso] = useState(75);
  const [alunoObs, setAlunoObs] = useState('');

  // --- Form 2: Turma / Horário ---
  const [turmaTitulo, setTurmaTitulo] = useState('');
  const [turmaCategoria, setTurmaCategoria] = useState<'Iniciante' | 'Intermediário/Avançado' | 'Infantil (Kids)' | 'No-Gi (Sem Kimono)' | 'Competição' | 'Open Mat'>('Iniciante');
  const [turmaDias, setTurmaDias] = useState('Segunda, Quarta e Sexta');
  const [turmaHoraInicio, setTurmaHoraInicio] = useState('19:30');
  const [turmaHoraFim, setTurmaHoraFim] = useState('21:00');
  const [turmaUnidade, setTurmaUnidade] = useState(academySettings.unidadePrincipal || 'Tatame 1 (Principal)');
  const [turmaProfId, setTurmaProfId] = useState(instructors[0]?.id || '');

  // --- Form 3: Professor ---
  const [profNome, setProfNome] = useState('');
  const [profFaixa, setProfFaixa] = useState<BeltColor>('preta');
  const [profGraus, setProfGraus] = useState<number>(1);
  const [profEmail, setProfEmail] = useState('');
  const [profTelefone, setProfTelefone] = useState('');
  const [profRegistroCBJJ, setProfRegistroCBJJ] = useState('');
  const [profPix, setProfPix] = useState('');
  const [profBanco, setProfBanco] = useState('');
  const [profSistema, setProfSistema] = useState<GraduationSystemType>('graus_e_faixas');
  const [profBio, setProfBio] = useState('');
  const [profRole, setProfRole] = useState<'professor' | 'admin'>('professor');
  const [profCanStudents, setProfCanStudents] = useState(true);
  const [profCanGraduations, setProfCanGraduations] = useState(true);
  const [profCanFinance, setProfCanFinance] = useState(false);
  const [profCanClasses, setProfCanClasses] = useState(true);
  const [profCanEvents, setProfCanEvents] = useState(true);

  // --- Form 4: Técnica ---
  const [tecTitulo, setTecTitulo] = useState('');
  const [tecCategoria, setTecCategoria] = useState<'Queda' | 'Guarda' | 'Passagem de Guarda' | 'Raspagem' | 'Finalização' | 'Defesa Pessoal' | 'Costas'>('Finalização');
  const [tecFaixaMinima, setTecFaixaMinima] = useState<BeltColor>('branca');
  const [tecNivel, setTecNivel] = useState<'Iniciante' | 'Intermediário' | 'Avançado'>('Iniciante');
  const [tecTipo, setTecTipo] = useState<'Gi' | 'No-Gi' | 'Ambos'>('Ambos');
  const [tecDescricao, setTecDescricao] = useState('');
  const [tecPontosChave, setTecPontosChave] = useState('Controle de pegada firme; Postura estável; Aplicação contínua da alavanca');
  const [tecTags, setTecTags] = useState('finalizacao, armlock, guarda');

  // --- Form 5: Produto ---
  const [prodNome, setProdNome] = useState('');
  const [prodCategoria, setProdCategoria] = useState<'Kimono' | 'Faixa' | 'Rashguard' | 'Acessórios' | 'Bebidas/Nutrição'>('Kimono');
  const [prodPreco, setProdPreco] = useState(380);
  const [prodEstoque, setProdEstoque] = useState(10);
  const [prodTamanho, setProdTamanho] = useState('A2');

  // --- Form 6: Evento ---
  const [evtTitulo, setEvtTitulo] = useState('');
  const [evtTipo, setEvtTipo] = useState<'campeonato' | 'graduacao' | 'seminario' | 'open_mat'>('campeonato');
  const [evtData, setEvtData] = useState(new Date().toISOString().split('T')[0]);
  const [evtHorario, setEvtHorario] = useState('09:00 - 13:00');
  const [evtLocal, setEvtLocal] = useState(academySettings.unidadePrincipal || 'Tatame Principal da Academia');
  const [evtTaxa, setEvtTaxa] = useState(50);
  const [evtDescricao, setEvtDescricao] = useState('');
  const [evtOrganizadorId, setEvtOrganizadorId] = useState(instructors[0]?.id || '');

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4500);
  };

  // Submissions
  const handleSubmitAluno = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alunoNome.trim()) return;

    const prof = instructors.find(i => i.id === alunoProfId) || instructors[0];
    const beltRule = getBeltGraduationRule(alunoFaixa);
    const calculatedMeta = alunoSistemaGraduacao === 'apenas_faixas'
      ? beltRule.aulasPorFaixaDireta
      : ((Number(alunoGraus) < 4 ? Number(alunoGraus) + 1 : 4) * beltRule.aulasPorGrau);

    setIsSaving(true);
    setErrorMsg(null);
    try {
      const res = await addStudent({
        nome: alunoNome,
        email: alunoEmail || `${alunoNome.toLowerCase().replace(/\s+/g, '.')}@email.com`,
        telefone: alunoTelefone || '(11) 99999-0000',
        dataNascimento: alunoNascimento,
        dataInicio: alunoInicio,
        faixa: alunoFaixa,
        graus: alunoSistemaGraduacao === 'apenas_faixas' ? 0 : Number(alunoGraus),
        sistemaGraduacao: alunoSistemaGraduacao,
        dataUltimaGraduacao: alunoInicio,
        presencasMetaGrau: calculatedMeta,
        plano: alunoPlano,
        valorMensalidade: Number(alunoValor),
        diaVencimento: Number(alunoVencimento),
        statusPagamento: alunoStatusPagamento,
        tamanhoKimono: alunoKimono,
        pesoKg: Number(alunoPeso),
        turmaPreferida: alunoTurma,
        observacoesMedicas: alunoObs || 'Nenhuma restrição articular relatada',
        professorId: prof?.id,
        professorNome: prof?.nome
      });

      if (!res.success) {
        setErrorMsg(`Erro ao salvar no Supabase: ${res.error || 'Falha na gravação'}`);
        console.error('Erro ao salvar aluno no Supabase:', res.error);
        return;
      }

      triggerSuccess(`Aluno "${alunoNome}" matriculado com sucesso no sistema!`);
      setAlunoNome('');
      setAlunoEmail('');
      setAlunoTelefone('');
      setAlunoObs('');
    } catch (err: any) {
      setErrorMsg(`Falha inesperada ao salvar aluno: ${err?.message || 'Erro desconhecido'}`);
      console.error('Falha ao salvar aluno:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitTurma = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turmaTitulo.trim()) return;

    const prof = instructors.find(i => i.id === turmaProfId) || instructors[0];

    setIsSaving(true);
    setErrorMsg(null);
    try {
      const res = await addClassSchedule({
        titulo: turmaTitulo,
        categoria: turmaCategoria,
        diaSemana: turmaDias,
        horario: `${turmaHoraInicio} - ${turmaHoraFim}`,
        professorId: prof?.id,
        professorNome: prof?.nome,
        sala: turmaUnidade
      });

      if (!res.success) {
        setErrorMsg(`Erro ao salvar turma no Supabase: ${res.error || 'Falha na gravação'}`);
        console.error('Erro ao salvar turma no Supabase:', res.error);
        return;
      }

      triggerSuccess(`Turma / Horário "${turmaTitulo}" criado com sucesso!`);
      setTurmaTitulo('');
    } catch (err: any) {
      setErrorMsg(`Falha inesperada ao salvar turma: ${err?.message || 'Erro desconhecido'}`);
      console.error('Falha ao salvar turma:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitProfessor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profNome.trim()) return;

    const emailToUse = profEmail.trim() || `${profNome.toLowerCase().replace(/\s+/g, '.')}@mikalkenasbjj.com.br`;

    setIsSaving(true);
    setErrorMsg(null);
    try {
      const res = await addInstructor(
        {
          nome: profNome,
          faixa: profFaixa,
          graus: Number(profGraus),
          email: emailToUse,
          telefone: profTelefone || '(11) 98888-7777',
          registroCBJJ: profRegistroCBJJ || 'CBJJ #Pendente',
          bio: profBio || `Professor e instrutor de Jiu-Jitsu dedicado ao ensino da arte suave na ${academySettings.nomeAcademia}.`,
          turmas: ['Todas as turmas gerais'],
          chavePix: profPix || emailToUse,
          banco: profBanco || 'Banco Inter / PIX',
          sistemaGraduacao: 'graus_e_faixas'
        },
        {
          role: profRole,
          permissions: {
            canManageStudents: profCanStudents,
            canManageGraduations: profCanGraduations,
            canManageFinancial: profCanFinance,
            canManageClasses: profCanClasses,
            canManageEvents: profCanEvents
          }
        }
      );

      if (!res.success) {
        setErrorMsg(`Erro ao salvar professor no Supabase: ${res.error || 'Falha na gravação'}`);
        console.error('Erro ao salvar professor no Supabase:', res.error);
        return;
      }

      triggerSuccess(`Professor "${profNome}" cadastrado com sucesso!`);
      setProfNome('');
      setProfEmail('');
      setProfTelefone('');
      setProfRegistroCBJJ('');
      setProfPix('');
      setProfBio('');
      setProfRole('professor');
    } catch (err: any) {
      setErrorMsg(`Falha inesperada ao salvar professor: ${err?.message || 'Erro desconhecido'}`);
      console.error('Falha ao salvar professor:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitTecnica = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tecTitulo.trim()) return;

    setIsSaving(true);
    setErrorMsg(null);
    try {
      const res = await addTechnique({
        titulo: tecTitulo,
        categoria: tecCategoria,
        faixaMinima: tecFaixaMinima,
        nivel: tecNivel,
        tipo: tecTipo,
        descricao: tecDescricao || `Posição técnica de ${tecCategoria.toLowerCase()} focada em alavanca e equilíbrio.`,
        pontosChave: tecPontosChave.split(';').map(p => p.trim()).filter(Boolean),
        tags: tecTags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
      });

      if (!res.success) {
        setErrorMsg(`Erro ao salvar técnica no Supabase: ${res.error || 'Falha na gravação'}`);
        console.error('Erro ao salvar técnica no Supabase:', res.error);
        return;
      }

      triggerSuccess(`Técnica "${tecTitulo}" adicionada à biblioteca curricular!`);
      setTecTitulo('');
      setTecDescricao('');
    } catch (err: any) {
      setErrorMsg(`Falha inesperada ao salvar técnica: ${err?.message || 'Erro desconhecido'}`);
      console.error('Falha ao salvar técnica:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitProduto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodNome.trim()) return;

    addProduct({
      nome: prodNome,
      categoria: prodCategoria,
      preco: Number(prodPreco),
      estoque: Number(prodEstoque),
      tamanho: prodTamanho
    });

    triggerSuccess(`Produto "${prodNome}" cadastrado no estoque da academia!`);
    setProdNome('');
  };

  const handleSubmitEvento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evtTitulo.trim()) return;

    const prof = instructors.find(i => i.id === evtOrganizadorId) || instructors[0];

    addEvent({
      titulo: evtTitulo,
      tipo: evtTipo,
      data: evtData,
      horario: evtHorario,
      local: evtLocal,
      descricao: evtDescricao || `Evento oficial da ${academySettings.nomeAcademia} com certificado e premiação.`,
      organizador: prof?.nome,
      organizadorId: prof?.id,
      taxaInscricao: Number(evtTaxa),
      status: 'agendado'
    });

    triggerSuccess(`Evento "${evtTitulo}" agendado no calendário oficial!`);
    setEvtTitulo('');
    setEvtDescricao('');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            Hub Unificado de Administração
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Central de Cadastros
          </h1>
          <p className="text-sm text-slate-500">
            Cadastre novos alunos, horários de aulas/turmas, professores, técnicas curriculares, produtos ou eventos oficiais. Selecione a categoria abaixo para preencher o formulário específico.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm self-start sm:self-auto shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          Importar Planilhas (CSV)
        </button>
      </div>

      {/* Error Notification */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl text-rose-900 text-xs font-bold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg(null)}
            className="text-xs text-rose-700 hover:text-rose-900 px-2 py-0.5 rounded-lg border border-rose-200 cursor-pointer"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-bold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <span className="text-[11px] text-emerald-700 bg-white/70 px-2 py-0.5 rounded-lg border border-emerald-200">
            Salvo com sucesso
          </span>
        </div>
      )}

      {/* Selector Cards / Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { id: 'aluno', label: 'Aluno / Matrícula', icon: UserPlus, desc: 'Novo atleta' },
          { id: 'turma', label: 'Turma / Horário', icon: Clock, desc: 'Novo treino' },
          { id: 'professor', label: 'Professor / Mestre', icon: UserRound, desc: 'Novo instrutor' },
          { id: 'tecnica', label: 'Técnica / Posição', icon: BookOpen, desc: 'Biblioteca' },
          { id: 'produto', label: 'Produto / Estoque', icon: Package, desc: 'Kimonos & Loja' },
          { id: 'evento', label: 'Evento / Torneio', icon: Trophy, desc: 'Campeonato' },
        ].map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as CadastroType)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                isActive 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-blue-500/20' 
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200/80 shadow-xs'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                <Icon className="w-5 h-5" />
              </div>

              <div>
                <span className="font-extrabold text-xs block leading-tight">{item.label}</span>
                <span className={`text-[10px] block mt-0.5 ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                  {item.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* FORM 1: CADASTRO DE ALUNO */}
      {activeTab === 'aluno' && (
        <form onSubmit={handleSubmitAluno} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Novo Cadastro de Aluno</h2>
                <p className="text-xs text-slate-500">Preencha os dados de matrícula, graduação, plano e professor responsável.</p>
              </div>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Formulário de Aluno
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            {/* Dados Pessoais */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" /> 1. Dados Pessoais & Contato
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nome Completo do Aluno *</label>
                  <input
                    type="text"
                    required
                    value={alunoNome}
                    onChange={(e) => setAlunoNome(e.target.value)}
                    placeholder="Ex: Gabriel Pires Menezes"
                    className="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">E-mail para Login no Portal</label>
                  <input
                    type="email"
                    value={alunoEmail}
                    onChange={(e) => setAlunoEmail(e.target.value)}
                    placeholder="aluno@email.com"
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">WhatsApp / Telefone *</label>
                  <input
                    type="text"
                    value={alunoTelefone}
                    onChange={(e) => setAlunoTelefone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Data de Nascimento</label>
                  <input
                    type="date"
                    value={alunoNascimento}
                    onChange={(e) => setAlunoNascimento(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
              </div>

              {/* Graduação & Metodologia */}
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 pt-3">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> 2. Graduação & Metodologia
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Faixa Atual</label>
                  <select
                    value={alunoFaixa}
                    onChange={(e) => setAlunoFaixa(e.target.value as BeltColor)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900 capitalize"
                  >
                    <option value="branca">Branca</option>
                    <option value="cinza">Cinza (Kids)</option>
                    <option value="amarela">Amarela (Kids)</option>
                    <option value="laranja">Laranja (Kids)</option>
                    <option value="verde">Verde (Kids/Juv)</option>
                    <option value="azul">Azul</option>
                    <option value="roxa">Roxa</option>
                    <option value="marrom">Marrom</option>
                    <option value="preta">Preta</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sistema de Graduação</label>
                  <select
                    value={alunoSistemaGraduacao}
                    onChange={(e) => setAlunoSistemaGraduacao(e.target.value as GraduationSystemType)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                  >
                    <option value="graus_e_faixas">Tradicional (Graus + Faixa)</option>
                    <option value="apenas_faixas">Direto (Somente Troca de Faixa)</option>
                  </select>
                </div>

                {alunoSistemaGraduacao === 'graus_e_faixas' ? (
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Graus na Faixa</label>
                    <select
                      value={alunoGraus}
                      onChange={(e) => setAlunoGraus(Number(e.target.value))}
                      className="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                    >
                      <option value={0}>0 Graus (Lisa)</option>
                      <option value={1}>1º Grau</option>
                      <option value={2}>2º Grau</option>
                      <option value={3}>3º Grau</option>
                      <option value={4}>4º Grau</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Status de Graus</label>
                    <div className="p-2.5 bg-slate-100 rounded-xl text-slate-500 font-semibold text-[11px]">
                      Sem graus (Troca direta de faixa)
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic IBJJF Rule Information */}
              {(() => {
                const currentRule = getBeltGraduationRule(alunoFaixa);
                const isInfantil = currentRule.categoria === 'infantil';
                const metaCalc = alunoSistemaGraduacao === 'apenas_faixas' 
                  ? currentRule.aulasPorFaixaDireta 
                  : ((alunoGraus < 4 ? alunoGraus + 1 : 4) * currentRule.aulasPorGrau);

                return (
                  <div className="p-3 bg-blue-50/70 border border-blue-200/90 rounded-2xl text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-blue-900">
                      <span className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-blue-600" />
                        Regulamento IBJJF para {currentRule.nome}:
                      </span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        isInfantil ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {isInfantil ? 'Infantil / Kids (4 a 15 anos)' : 'Adulto (+16 anos)'}
                      </span>
                    </div>
                    <div className="text-slate-600 text-[11px] grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
                      <span>• Carência Mínima: <strong className="text-slate-800">{currentRule.tempoMinimoDescricao}</strong></span>
                      <span>• Carga de Aulas: <strong className="text-slate-800">{alunoSistemaGraduacao === 'apenas_faixas' ? `${currentRule.aulasPorFaixaDireta} aulas (direto)` : `${currentRule.aulasPorGrau} aulas/grau`}</strong></span>
                    </div>
                    <p className="text-[10px] text-slate-500 italic pt-0.5">
                      Meta inicial calculada para este atleta: <strong>{metaCalc} aulas presenciais</strong>.
                    </p>
                  </div>
                );
              })()}

              {/* Professor & Turma */}
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 pt-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> 3. Vinculação & Turma
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Professor Responsável *</label>
                  <select
                    value={alunoProfId}
                    onChange={(e) => setAlunoProfId(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
                  >
                    {instructors.map(i => (
                      <option key={i.id} value={i.id}>
                        {i.nome} (Faixa {i.faixa} {i.graus}ºG)
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">O aluno ficará vinculado a este professor para relatórios e PIX.</p>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Turma / Horário Preferido</label>
                  <select
                    value={alunoTurma}
                    onChange={(e) => setAlunoTurma(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.titulo}>
                        {c.titulo} ({c.horario})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Coluna 3: Plano, Mensalidade & Ficha */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" /> Plano & Mensalidade
              </h4>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Modalidade do Plano</label>
                <select
                  value={alunoPlano}
                  onChange={(e) => {
                    const pl = e.target.value as PlanType;
                    setAlunoPlano(pl);
                    if (pl === 'regular') setAlunoValor(academySettings.valorPadraoRegular || 180);
                    if (pl === 'infantil') setAlunoValor(academySettings.valorPadraoInfantil || 130);
                    if (pl === 'bolsista') setAlunoValor(academySettings.valorPadraoBolsista || 70);
                    if (pl === 'projeto_social') setAlunoValor(0);
                  }}
                  className="w-full border border-slate-300 rounded-xl p-2 font-semibold text-slate-900 bg-white"
                >
                  <option value="regular">Regular Adulto</option>
                  <option value="infantil">Infantil (Kids)</option>
                  <option value="bolsista">Bolsista Competição</option>
                  <option value="projeto_social">Projeto Social (Isento)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Valor Mensal (R$)</label>
                  <input
                    type="number"
                    value={alunoValor}
                    onChange={(e) => setAlunoValor(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl p-2 font-bold text-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dia Vencimento</label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={alunoVencimento}
                    onChange={(e) => setAlunoVencimento(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl p-2 font-bold text-slate-900 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kimono</label>
                  <input
                    type="text"
                    value={alunoKimono}
                    onChange={(e) => setAlunoKimono(e.target.value)}
                    placeholder="A2, F1, M3"
                    className="w-full border border-slate-300 rounded-xl p-2 text-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    value={alunoPeso}
                    onChange={(e) => setAlunoPeso(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl p-2 text-slate-900 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Observações Médicas</label>
                <textarea
                  rows={2}
                  value={alunoObs}
                  onChange={(e) => setAlunoObs(e.target.value)}
                  placeholder="Lesões, cirurgias ou restrições..."
                  className="w-full border border-slate-300 rounded-xl p-2 text-[11px] text-slate-900 bg-white"
                />
              </div>

              {/* Live Belt Preview */}
              <div className="pt-2 border-t border-slate-200 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Prévia da Faixa Cadastrada:</span>
                <BeltBadge 
                  faixa={alunoFaixa} 
                  graus={alunoGraus} 
                  sistemaGraduacao={alunoSistemaGraduacao}
                  size="md" 
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Salvar Matrícula do Aluno
            </button>
          </div>
        </form>
      )}

      {/* FORM 2: CADASTRO DE TURMA / NOVO HORÁRIO */}
      {activeTab === 'turma' && (
        <form onSubmit={handleSubmitTurma} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Novo Horário & Turma de Tatame</h2>
                <p className="text-xs text-slate-500">Defina o nome da turma, dias de treino, horários, tatame/unidade e professor responsável.</p>
              </div>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Formulário de Turma
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Título da Turma / Aula *</label>
              <input
                type="text"
                required
                value={turmaTitulo}
                onChange={(e) => setTurmaTitulo(e.target.value)}
                placeholder="Ex: Jiu-Jitsu Matinal 07:00, No-Gi Competição, Kids 6-10 anos..."
                className="w-full border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Categoria Pedagógica</label>
              <select
                value={turmaCategoria}
                onChange={(e) => setTurmaCategoria(e.target.value as any)}
                className="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
              >
                <option value="Iniciante">Iniciante / Fundamentos</option>
                <option value="Intermediário/Avançado">Intermediário & Avançado</option>
                <option value="Infantil (Kids)">Infantil (Kids)</option>
                <option value="No-Gi (Sem Kimono)">No-Gi (Sem Kimono / Submission)</option>
                <option value="Competição">Treino de Competição</option>
                <option value="Open Mat">Open Mat (Tatame Aberto)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Dias da Semana *</label>
              <input
                type="text"
                required
                value={turmaDias}
                onChange={(e) => setTurmaDias(e.target.value)}
                placeholder="Ex: Segunda, Quarta e Sexta ou Terça e Quinta"
                className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Horário Início *</label>
                <input
                  type="time"
                  required
                  value={turmaHoraInicio}
                  onChange={(e) => setTurmaHoraInicio(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Horário Término *</label>
                <input
                  type="time"
                  required
                  value={turmaHoraFim}
                  onChange={(e) => setTurmaHoraFim(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Unidade / Tatame / Sala *</label>
              <input
                type="text"
                required
                value={turmaUnidade}
                onChange={(e) => setTurmaUnidade(e.target.value)}
                placeholder="Ex: Tatame 1 (Principal), Filial Centro..."
                className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Professor Responsável pelo Horário *</label>
              <select
                value={turmaProfId}
                onChange={(e) => setTurmaProfId(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
              >
                {instructors.map(i => (
                  <option key={i.id} value={i.id}>
                    {i.nome} (Faixa {i.faixa})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Salvar Novo Horário & Turma
            </button>
          </div>
        </form>
      )}

      {/* FORM 3: CADASTRO DE PROFESSOR / INSTRUTOR */}
      {activeTab === 'professor' && (
        <form onSubmit={handleSubmitProfessor} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <UserRound className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Novo Cadastro de Professor / Instrutor</h2>
                <p className="text-xs text-slate-500">Cadastre o corpo docente com graduação, registro CBJJ, chave PIX e metodologia adotada.</p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              Formulário Docente
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Nome Completo do Professor *</label>
              <input
                type="text"
                required
                value={profNome}
                onChange={(e) => setProfNome(e.target.value)}
                placeholder="Ex: Professor André Galvão, Professora Bia Mesquita..."
                className="w-full border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Registro CBJJ / IBJJF</label>
              <input
                type="text"
                value={profRegistroCBJJ}
                onChange={(e) => setProfRegistroCBJJ(e.target.value)}
                placeholder="CBJJ #78901"
                className="w-full border border-slate-300 rounded-xl p-2.5 font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Faixa</label>
              <select
                value={profFaixa}
                onChange={(e) => setProfFaixa(e.target.value as BeltColor)}
                className="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900 capitalize"
              >
                <option value="preta">Preta</option>
                <option value="marrom">Marrom</option>
                <option value="roxa">Roxa</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Graus</label>
              <select
                value={profGraus}
                onChange={(e) => setProfGraus(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
              >
                <option value={0}>0 Graus</option>
                <option value={1}>1º Grau</option>
                <option value={2}>2º Grau</option>
                <option value={3}>3º Grau</option>
                <option value={4}>4º Grau</option>
                <option value={5}>5º Grau</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Sistema de Graduação Preferido</label>
              <select
                value={profSistema}
                onChange={(e) => setProfSistema(e.target.value as GraduationSystemType)}
                className="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
              >
                <option value="graus_e_faixas">Tradicional (Graus + Faixa)</option>
                <option value="apenas_faixas">Direto (Somente Troca de Faixas)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">E-mail para Login Docente *</label>
              <input
                type="email"
                required
                value={profEmail}
                onChange={(e) => setProfEmail(e.target.value)}
                placeholder="professor@mikalkenasbjj.com.br"
                className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">WhatsApp / Telefone *</label>
              <input
                type="text"
                value={profTelefone}
                onChange={(e) => setProfTelefone(e.target.value)}
                placeholder="(11) 98765-4321"
                className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Chave PIX do Professor *</label>
              <input
                type="text"
                value={profPix}
                onChange={(e) => setProfPix(e.target.value)}
                placeholder="pix@professor.com ou CPF"
                className="w-full border border-slate-300 rounded-xl p-2.5 font-mono text-slate-900"
              />
              <p className="text-[11px] text-slate-400 mt-1">Os alunos vinculados verão esta chave para pagamento da mensalidade.</p>
            </div>

            <div className="sm:col-span-3">
              <label className="font-bold text-slate-700 block mb-1">Mini Biografia & Linhagem</label>
              <textarea
                rows={2}
                value={profBio}
                onChange={(e) => setProfBio(e.target.value)}
                placeholder="Linhagem, títulos e tempo de experiência no Jiu-Jitsu..."
                className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900"
              />
            </div>

            {/* Access Level and Permissions in Supabase */}
            <div className="sm:col-span-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs">
                <Shield className="w-4 h-4 text-red-600" />
                <span>Nível de Acesso no Sistema (Supabase Auth)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Perfil / Cargo</label>
                  <select
                    value={profRole}
                    onChange={(e) => {
                      const r = e.target.value as 'professor' | 'admin';
                      setProfRole(r);
                      if (r === 'admin') {
                        setProfCanStudents(true);
                        setProfCanGraduations(true);
                        setProfCanFinance(true);
                        setProfCanClasses(true);
                        setProfCanEvents(true);
                      } else {
                        setProfCanStudents(true);
                        setProfCanGraduations(true);
                        setProfCanFinance(false);
                        setProfCanClasses(true);
                        setProfCanEvents(true);
                      }
                    }}
                    className="w-full border border-slate-300 rounded-xl p-2.5 bg-white font-bold text-xs"
                  >
                    <option value="professor">Professor (Docente de Suas Turmas)</option>
                    <option value="admin">Administrador (Mestre com Acesso Total)</option>
                  </select>
                </div>

              </div>
              <p className="text-[11px] text-slate-600">
                A conta de acesso deve ser criada no Supabase Auth. Depois, vincule o UUID da conta ao perfil de usuário na tabela usuarios.
              </p>

              <div className="space-y-1.5 pt-1">
                <label className="font-bold text-slate-600 block text-[11px]">
                  Permissões Granulares:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-700">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profCanStudents}
                      onChange={(e) => setProfCanStudents(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span>Gerenciar Alunos</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profCanGraduations}
                      onChange={(e) => setProfCanGraduations(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span>Avaliar & Graduar</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profCanClasses}
                      onChange={(e) => setProfCanClasses(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span>Turmas & Presenças</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profCanEvents}
                      onChange={(e) => setProfCanEvents(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span>Eventos & Campeonatos</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profCanFinance}
                      onChange={(e) => setProfCanFinance(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span>Financeiro Geral</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Cadastrar Professor & Habilitar Acesso
            </button>
          </div>
        </form>
      )}

      {/* FORM 4: CADASTRO DE TÉCNICA */}
      {activeTab === 'tecnica' && (
        <form onSubmit={handleSubmitTecnica} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Nova Técnica na Biblioteca</h2>
                <p className="text-xs text-slate-500">Cadastre posições para uso no planejamento de aulas e histórico automático dos alunos.</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Biblioteca Técnica
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Título da Técnica *</label>
              <input
                type="text"
                required
                value={tecTitulo}
                onChange={(e) => setTecTitulo(e.target.value)}
                placeholder="Ex: Armlock da Guarda Fechada, Raspagem Berimbolo, Passagem Toreando..."
                className="w-full border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Categoria Principal *</label>
              <select
                value={tecCategoria}
                onChange={(e) => setTecCategoria(e.target.value as any)}
                className="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
              >
                <option value="Finalização">Finalização</option>
                <option value="Raspagem">Raspagem</option>
                <option value="Passagem de Guarda">Passagem de Guarda</option>
                <option value="Guarda">Guarda</option>
                <option value="Queda">Queda</option>
                <option value="Defesa Pessoal">Defesa Pessoal</option>
                <option value="Costas">Costas / Pegada de Costas</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Faixa Mínima Recomendada</label>
              <select
                value={tecFaixaMinima}
                onChange={(e) => setTecFaixaMinima(e.target.value as BeltColor)}
                className="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900 capitalize"
              >
                <option value="branca">Faixa Branca (Iniciante)</option>
                <option value="azul">Faixa Azul</option>
                <option value="roxa">Faixa Roxa</option>
                <option value="marrom">Faixa Marrom</option>
                <option value="preta">Faixa Preta</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Nível de Complexidade</label>
              <select
                value={tecNivel}
                onChange={(e) => setTecNivel(e.target.value as any)}
                className="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
              >
                <option value="Iniciante">Iniciante</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Modalidade</label>
              <select
                value={tecTipo}
                onChange={(e) => setTecTipo(e.target.value as any)}
                className="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
              >
                <option value="Ambos">Ambos (Gi & No-Gi)</option>
                <option value="Gi">Somente Com Kimono (Gi)</option>
                <option value="No-Gi">Somente Sem Kimono (No-Gi)</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="font-bold text-slate-700 block mb-1">Descrição & Passo a Passo da Posição</label>
              <textarea
                rows={2}
                value={tecDescricao}
                onChange={(e) => setTecDescricao(e.target.value)}
                placeholder="Explique a mecânica, pegadas e transição da técnica..."
                className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="font-bold text-slate-700 block mb-1">Pontos-Chave (separados por ponto e vírgula ';')</label>
              <input
                type="text"
                value={tecPontosChave}
                onChange={(e) => setTecPontosChave(e.target.value)}
                placeholder="Ex: Quebrar a postura; Subir o quadril; Fechar os joelhos"
                className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar à Biblioteca de Técnicas
            </button>
          </div>
        </form>
      )}

      {/* FORM 5: CADASTRO DE PRODUTO */}
      {activeTab === 'produto' && (
        <form onSubmit={handleSubmitProduto} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Novo Produto / Item de Estoque</h2>
                <p className="text-xs text-slate-500">Cadastre kimonos, faixas, rashguards e equipamentos para venda na academia.</p>
              </div>
            </div>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              Loja & Estoque
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Nome do Produto *</label>
              <input
                type="text"
                required
                value={prodNome}
                onChange={(e) => setProdNome(e.target.value)}
                placeholder="Ex: Kimono BJJ Trançado Oficial, Rashguard No-Gi, Faixa Algodão..."
                className="w-full border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Categoria</label>
              <select
                value={prodCategoria}
                onChange={(e) => setProdCategoria(e.target.value as any)}
                className="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
              >
                <option value="Kimono">Kimono</option>
                <option value="Faixa">Faixa</option>
                <option value="Rashguard">Rashguard</option>
                <option value="Acessórios">Acessórios (Mochila, Esparadrapo, etc.)</option>
                <option value="Bebidas/Nutrição">Bebidas / Nutrição</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Preço de Venda (R$) *</label>
              <input
                type="number"
                required
                min={0}
                value={prodPreco}
                onChange={(e) => setProdPreco(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Quantidade em Estoque</label>
              <input
                type="number"
                required
                min={0}
                value={prodEstoque}
                onChange={(e) => setProdEstoque(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Tamanho / Variação</label>
              <input
                type="text"
                value={prodTamanho}
                onChange={(e) => setProdTamanho(e.target.value)}
                placeholder="A1, A2, M, G, Único"
                className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Cadastrar Produto no Estoque
            </button>
          </div>
        </form>
      )}

      {/* FORM 6: CADASTRO DE EVENTO */}
      {activeTab === 'evento' && (
        <form onSubmit={handleSubmitEvento} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Novo Evento / Campeonato / Graduação</h2>
                <p className="text-xs text-slate-500">Agende torneios internos, seminários técnicos e cerimônias oficiais no painel dos alunos.</p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              Calendário Oficial
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Título do Evento *</label>
              <input
                type="text"
                required
                value={evtTitulo}
                onChange={(e) => setEvtTitulo(e.target.value)}
                placeholder="Ex: Copa Interna de Jiu-Jitsu, Cerimônia de Graduação de Fim de Ano..."
                className="w-full border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Tipo de Evento</label>
              <select
                value={evtTipo}
                onChange={(e) => setEvtTipo(e.target.value as any)}
                className="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
              >
                <option value="campeonato">Campeonato / Torneio</option>
                <option value="graduacao">Cerimônia de Graduação</option>
                <option value="seminario">Seminário Técnico</option>
                <option value="open_mat">Open Mat Especial</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Data do Evento *</label>
              <input
                type="date"
                required
                value={evtData}
                onChange={(e) => setEvtData(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Horário *</label>
              <input
                type="text"
                required
                value={evtHorario}
                onChange={(e) => setEvtHorario(e.target.value)}
                placeholder="Ex: 09:00 - 13:00"
                className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Taxa de Inscrição (R$)</label>
              <input
                type="number"
                min={0}
                value={evtTaxa}
                onChange={(e) => setEvtTaxa(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Local / Tatame *</label>
              <input
                type="text"
                required
                value={evtLocal}
                onChange={(e) => setEvtLocal(e.target.value)}
                placeholder="Ex: Tatame Principal da Matriz ou Ginásio Poliesportivo"
                className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Organizador Responsável</label>
              <select
                value={evtOrganizadorId}
                onChange={(e) => setEvtOrganizadorId(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
              >
                {instructors.map(i => (
                  <option key={i.id} value={i.id}>
                    {i.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="font-bold text-slate-700 block mb-1">Descrição & Regras do Evento</label>
              <textarea
                rows={2}
                value={evtDescricao}
                onChange={(e) => setEvtDescricao(e.target.value)}
                placeholder="Instruções de pesagem, regulamento CBJJ e premiação..."
                className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Publicar Evento no Calendário
            </button>
          </div>
        </form>
      )}

      {/* SECTION: GERENCIAR & EDITAR CADASTROS EXISTENTES */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Pencil className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Cadastros Existentes • Edição Rápida</h2>
              <p className="text-xs text-slate-500">
                Selecione qualquer registro para editar todos os seus dados cadastrais, horários, permissões ou conteúdos.
              </p>
            </div>
          </div>

          <div className="relative min-w-[240px]">
            <input
              type="text"
              placeholder="Filtrar por nome, aula ou evento..."
              value={searchExisting}
              onChange={(e) => setSearchExisting(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Categories Grid for Quick Editing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
          {/* 1. Alunos Existentes */}
          <div className="border border-slate-200/80 rounded-2xl p-4 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-600" />
                Alunos ({students.length})
              </span>
              <span className="text-[11px] text-slate-400">Clique em Editar para alterar tudo</span>
            </div>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {students
                .filter(s => s.nome.toLowerCase().includes(searchExisting.toLowerCase()) || s.email.toLowerCase().includes(searchExisting.toLowerCase()))
                .map(st => (
                  <div key={st.id} className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-2 hover:border-blue-300 transition-colors">
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{st.nome}</p>
                      <p className="text-[10px] text-slate-500 truncate">{st.faixa} • {st.plano} • Prof. {st.professorNome || 'Geral'}</p>
                    </div>
                    {(() => {
                      const isUnderTutela = currentUser.role === 'admin' || 
                        (currentUser.professorId && st.professorId === currentUser.professorId) ||
                        (st.professorNome && currentUser.nome && st.professorNome.toLowerCase() === currentUser.nome.toLowerCase());

                      if (isUnderTutela) {
                        return (
                          <button
                            onClick={() => setEditingStudent(st)}
                            className="px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                          >
                            <Pencil className="w-3 h-3 text-blue-600" />
                            <span>Editar</span>
                          </button>
                        );
                      }

                      return (
                        <span 
                          className="px-2 py-0.5 text-[10px] font-semibold text-slate-500 bg-slate-100 rounded-md shrink-0"
                          title="Aluno sob tutela de outro professor"
                        >
                          Outro Docente
                        </span>
                      );
                    })()}
                  </div>
                ))}
            </div>
          </div>

          {/* 2. Professores Existentes */}
          <div className="border border-slate-200/80 rounded-2xl p-4 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 flex items-center gap-2">
                <UserRound className="w-4 h-4 text-amber-600" />
                Professores ({instructors.length})
              </span>
              <span className="text-[11px] text-slate-400">Edite dados, PIX e permissões</span>
            </div>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {instructors
                .filter(i => i.nome.toLowerCase().includes(searchExisting.toLowerCase()) || i.email.toLowerCase().includes(searchExisting.toLowerCase()))
                .map(prof => {
                  const canEditProf = currentUser.role === 'admin' || (currentUser.professorId && currentUser.professorId === prof.id);
                  return (
                    <div key={prof.id} className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-2 hover:border-amber-300 transition-colors">
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">{prof.nome}</p>
                        <p className="text-[10px] text-slate-500 truncate">Faixa {prof.faixa} • PIX: {prof.chavePix || 'Não informado'}</p>
                      </div>
                      {canEditProf ? (
                        <button
                          onClick={() => setEditingInstructor(prof)}
                          className="px-2.5 py-1 text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                          <Pencil className="w-3 h-3 text-amber-600" />
                          <span>Editar</span>
                        </button>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 rounded-md shrink-0">
                          Somente Leitura
                        </span>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* 3. Turmas / Horários Existentes */}
          <div className="border border-slate-200/80 rounded-2xl p-4 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                Aulas & Turmas ({classes.length})
              </span>
              <span className="text-[11px] text-slate-400">Altere dias, horas e professor</span>
            </div>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {classes
                .filter(c => c.titulo.toLowerCase().includes(searchExisting.toLowerCase()) || c.diaSemana.toLowerCase().includes(searchExisting.toLowerCase()))
                .map(cls => (
                  <div key={cls.id} className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-2 hover:border-indigo-300 transition-colors">
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{cls.titulo}</p>
                      <p className="text-[10px] text-slate-500 truncate">{cls.horario} • {cls.diaSemana} • Prof. {cls.professorNome}</p>
                    </div>
                    <button
                      onClick={() => setEditingClass(cls)}
                      className="px-2.5 py-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1 shrink-0"
                    >
                      <Pencil className="w-3 h-3 text-indigo-600" />
                      <span>Editar</span>
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* 4. Técnicas & Eventos Existentes */}
          <div className="border border-slate-200/80 rounded-2xl p-4 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                Técnicas ({techniques.length}) & Eventos ({events.length})
              </span>
              <span className="text-[11px] text-slate-400">Edite detalhes e parâmetros</span>
            </div>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {/* Eventos */}
              {events
                .filter(e => e.titulo.toLowerCase().includes(searchExisting.toLowerCase()))
                .map(evt => (
                  <div key={evt.id} className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-2 hover:border-amber-300 transition-colors">
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate flex items-center gap-1">
                        <Trophy className="w-3 h-3 text-amber-500 shrink-0" />
                        {evt.titulo}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">{evt.data} • {evt.local}</p>
                    </div>
                    <button
                      onClick={() => setEditingEvent(evt)}
                      className="px-2.5 py-1 text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors flex items-center gap-1 shrink-0"
                    >
                      <Pencil className="w-3 h-3 text-amber-600" />
                      <span>Editar</span>
                    </button>
                  </div>
                ))}

              {/* Técnicas */}
              {techniques
                .filter(t => t.titulo.toLowerCase().includes(searchExisting.toLowerCase()) || t.categoria.toLowerCase().includes(searchExisting.toLowerCase()))
                .slice(0, 15)
                .map(tec => (
                  <div key={tec.id} className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-2 hover:border-emerald-300 transition-colors">
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-emerald-600 shrink-0" />
                        {tec.titulo}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">{tec.categoria} • Faixa {tec.faixaMinima}</p>
                    </div>
                    <button
                      onClick={() => setEditingTechnique(tec)}
                      className="px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1 shrink-0"
                    >
                      <Pencil className="w-3 h-3 text-emerald-600" />
                      <span>Editar</span>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modals */}
      <EditStudentModal
        student={editingStudent}
        isOpen={!!editingStudent}
        onClose={() => setEditingStudent(null)}
      />

      <EditInstructorModal
        instructor={editingInstructor}
        isOpen={!!editingInstructor}
        onClose={() => setEditingInstructor(null)}
      />

      <EditClassModal
        cls={editingClass}
        isOpen={!!editingClass}
        onClose={() => setEditingClass(null)}
      />

      <EditTechniqueModal
        technique={editingTechnique}
        isOpen={!!editingTechnique}
        onClose={() => setEditingTechnique(null)}
      />

      <EditEventModal
        event={editingEvent}
        isOpen={!!editingEvent}
        onClose={() => setEditingEvent(null)}
      />

      {showUploadModal && (
        <BatchUploadModal
          type={
            activeTab === 'aluno' ? 'students' :
            activeTab === 'professor' ? 'professors' :
            activeTab === 'turma' ? 'classes' :
            activeTab === 'tecnica' ? 'techniques' :
            'students'
          }
          onClose={() => setShowUploadModal(false)}
        />
      )}
    </div>
  );
};
