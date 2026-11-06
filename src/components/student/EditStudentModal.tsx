import React, { useState } from 'react';
import { 
  X, 
  Save, 
  UserRound, 
  Award, 
  DollarSign, 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  Activity, 
  ShieldAlert,
  AlertCircle
} from 'lucide-react';
import { Student, BeltColor, PlanType, PaymentStatus, GraduationSystemType } from '../../types';
import { useBjj } from '../../context/BjjContext';
import { BeltBadge } from '../ui/BeltBadge';

interface EditStudentModalProps {
  student: Student | null;
  isOpen?: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EditStudentModal: React.FC<EditStudentModalProps> = (props) => {
  if (props.isOpen === false || !props.student) return null;
  return <EditStudentModalContent {...props} student={props.student} />;
};

const EditStudentModalContent: React.FC<EditStudentModalProps & { student: Student }> = ({
  student,
  onClose,
  onSuccess
}) => {
  const { updateStudent, instructors, classes, academySettings, getBeltGraduationRule, currentUser } = useBjj();

  const isUnderTutela = currentUser.role === 'admin' || 
    (currentUser.professorId && student.professorId === currentUser.professorId) ||
    (student.professorNome && currentUser.nome && student.professorNome.toLowerCase() === currentUser.nome.toLowerCase());
  
  const isProfessor = currentUser.role === 'professor';

  const [nome, setNome] = useState(student.nome || '');
  const [avatar, setAvatar] = useState(student.avatar || '');
  const [email, setEmail] = useState(student.email || '');
  const [telefone, setTelefone] = useState(student.telefone || '');
  const [dataNascimento, setDataNascimento] = useState(student.dataNascimento || '');
  const [dataInicio, setDataInicio] = useState(student.dataInicio || '');
  const [faixa, setFaixa] = useState<BeltColor>(student.faixa || 'branca');
  const [graus, setGraus] = useState<number>(student.graus ?? 0);
  const [sistemaGraduacao, setSistemaGraduacao] = useState<GraduationSystemType>(
    student.sistemaGraduacao || academySettings.sistemaGraduacaoPadrao || 'graus_e_faixas'
  );
  const [professorId, setProfessorId] = useState(student.professorId || instructors[0]?.id || '');
  const [turmaPreferida, setTurmaPreferida] = useState(student.turmaPreferida || classes[0]?.titulo || '');
  const [plano, setPlano] = useState<PlanType>(student.plano || 'regular');
  const [valorMensalidade, setValorMensalidade] = useState<number>(student.valorMensalidade ?? 180);
  const [diaVencimento, setDiaVencimento] = useState<number>(student.diaVencimento ?? 10);
  const [statusPagamento, setStatusPagamento] = useState<PaymentStatus>(student.statusPagamento || 'em_dia');
  const [tamanhoKimono, setTamanhoKimono] = useState(student.tamanhoKimono || 'A2');
  const [pesoKg, setPesoKg] = useState<number>(student.pesoKg ?? 75);
  const [observacoesMedicas, setObservacoesMedicas] = useState(student.observacoesMedicas || '');
  const [presencasNaFaixa, setPresencasNaFaixa] = useState<number>(student.presencasNaFaixa ?? 0);
  const [totalPresencasHistorico, setTotalPresencasHistorico] = useState<number>(student.totalPresencasHistorico ?? 0);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrorMsg('Use uma imagem JPG, PNG ou WebP.');
      event.target.value = '';
      return;
    }
    if (file.size > 1024 * 1024) {
      setErrorMsg('A foto deve ter no máximo 1 MB.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
        setErrorMsg(null);
      } else {
        setErrorMsg('Não foi possível carregar a foto selecionada.');
      }
    };
    reader.onerror = () => setErrorMsg(reader.error?.message || 'Não foi possível ler a foto selecionada.');
    reader.readAsDataURL(file);
  };

  const handlePlanoChange = (newPlan: PlanType) => {
    setPlano(newPlan);
    if (newPlan === 'regular') setValorMensalidade(academySettings.valorPadraoRegular || 180);
    else if (newPlan === 'infantil') setValorMensalidade(academySettings.valorPadraoInfantil || 130);
    else if (newPlan === 'bolsista') setValorMensalidade(academySettings.valorPadraoBolsista || 70);
    else if (newPlan === 'projeto_social') {
      setValorMensalidade(0);
      setStatusPagamento('isento');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUnderTutela) {
      setErrorMsg('Acesso negado: Você só possui autorização para editar dados de alunos sob sua tutela.');
      return;
    }
    if (!nome.trim()) {
      setErrorMsg('O nome do aluno é obrigatório.');
      return;
    }

    const selectedProf = instructors.find(i => i.id === professorId) || instructors[0];
    const beltRule = getBeltGraduationRule(faixa);
    const calculatedMeta = sistemaGraduacao === 'apenas_faixas'
      ? beltRule.aulasPorFaixaDireta
      : ((graus < 4 ? graus + 1 : 4) * beltRule.aulasPorGrau);

    const payload: Partial<Student> = {
      nome: nome.trim(),
      avatar,
      email: email.trim(),
      telefone: telefone.trim(),
      dataNascimento,
      dataInicio,
      plano,
      valorMensalidade: Number(valorMensalidade),
      diaVencimento: Number(diaVencimento),
      statusPagamento,
      tamanhoKimono,
      pesoKg: Number(pesoKg),
      turmaPreferida,
      observacoesMedicas
    };

    // Apenas Administrador pode alterar graduação e tutela
    if (!isProfessor) {
      payload.faixa = faixa;
      payload.graus = sistemaGraduacao === 'apenas_faixas' ? 0 : Number(graus);
      payload.sistemaGraduacao = sistemaGraduacao;
      payload.presencasMetaGrau = calculatedMeta;
      payload.presencasNaFaixa = Number(presencasNaFaixa);
      payload.totalPresencasHistorico = Number(totalPresencasHistorico);
      payload.professorId = selectedProf?.id;
      payload.professorNome = selectedProf?.nome;
    }

    const res = await updateStudent(student.id, payload);
    if (!res.success) {
      setErrorMsg(res.error || 'Erro ao atualizar dados do aluno.');
      return;
    }

    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
              <UserRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                Editar Cadastro do Aluno
              </h3>
              <p className="text-xs text-slate-400">
                Atualize dados cadastrais, graduação, plano, professor e financeiro
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!isUnderTutela && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-xs">Aluno fora de sua tutela</p>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  Este praticante está vinculado a outro professor ({student.professorNome || 'outro docente'}). Conforme as regras de controle de acesso, professores só podem editar atletas sob sua tutela direta.
                </p>
              </div>
            </div>
          )}

          {/* Seção 1: Dados Pessoais & Contato */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              1. Identificação & Contato
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">E-mail (Login no Portal)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">WhatsApp / Telefone</label>
                <input
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Data de Nascimento</label>
                <input
                  type="date"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Data de Início no Dojo</label>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              {avatar ? (
                <img src={avatar} alt={`Foto de ${nome || 'aluno'}`} className="h-16 w-16 rounded-xl object-cover" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-200 text-slate-500">
                  <UserRound className="h-7 w-7" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <label className="block font-bold text-slate-700 mb-1" htmlFor="student-photo">Foto do aluno</label>
                <input
                  id="student-photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  className="block w-full text-xs text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-100 file:px-3 file:py-1.5 file:font-semibold file:text-blue-800"
                />
                <p className="mt-1 text-[11px] text-slate-500">JPG, PNG ou WebP; até 1 MB.</p>
              </div>
              {avatar && (
                <button type="button" onClick={() => setAvatar('')} className="rounded-lg px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50">
                  Remover
                </button>
              )}
            </div>
          </div>

          {/* Seção 2: Graduação & Metodologia */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              2. Graduação & Sistema de Faixas
              {isProfessor && (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full lowercase">
                  (exclusivo do administrador)
                </span>
              )}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Faixa Atual</label>
                <select
                  value={faixa}
                  disabled={isProfessor}
                  onChange={(e) => setFaixa(e.target.value as BeltColor)}
                  className={`w-full border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900 capitalize ${isProfessor ? 'bg-slate-100 cursor-not-allowed text-slate-500' : ''}`}
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
                  value={sistemaGraduacao}
                  disabled={isProfessor}
                  onChange={(e) => setSistemaGraduacao(e.target.value as GraduationSystemType)}
                  className={`w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900 ${isProfessor ? 'bg-slate-100 cursor-not-allowed text-slate-500' : ''}`}
                >
                  <option value="graus_e_faixas">Tradicional (Graus + Faixa)</option>
                  <option value="apenas_faixas">Direto (Somente Troca de Faixas)</option>
                </select>
              </div>
              {sistemaGraduacao === 'graus_e_faixas' ? (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Graus na Faixa</label>
                  <select
                    value={graus}
                    disabled={isProfessor}
                    onChange={(e) => setGraus(Number(e.target.value))}
                    className={`w-full border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900 ${isProfessor ? 'bg-slate-100 cursor-not-allowed text-slate-500' : ''}`}
                  >
                    {[0, 1, 2, 3, 4].map(g => (
                      <option key={g} value={g}>{g === 0 ? '0 Graus (Lisa)' : `${g}º Grau`}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status de Graus</label>
                  <div className="p-2.5 bg-slate-100 rounded-xl text-slate-500 font-semibold">
                    Sem graus (Troca direta de faixa)
                  </div>
                </div>
              )}
            </div>

            {/* Presenças & Histórico */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Presenças Acumuladas na Faixa</label>
                <input
                  type="number"
                  min={0}
                  value={presencasNaFaixa}
                  onChange={(e) => setPresencasNaFaixa(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-xl p-2 font-mono font-bold text-slate-900 bg-white"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Total de Presenças Histórico</label>
                <input
                  type="number"
                  min={0}
                  value={totalPresencasHistorico}
                  onChange={(e) => setTotalPresencasHistorico(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-xl p-2 font-mono font-bold text-slate-900 bg-white"
                />
              </div>
            </div>

            {/* Live Belt Badge Preview */}
            <div className="flex items-center justify-between p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl">
              <span className="text-xs font-bold text-amber-900">Prévia da Faixa Atualizada:</span>
              <BeltBadge faixa={faixa} graus={graus} sistemaGraduacao={sistemaGraduacao} size="md" />
            </div>
          </div>

          {/* Seção 3: Vínculo com Professor & Turma */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              3. Vínculo Pedagógico & Turma
              {isProfessor && (
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full lowercase">
                  (tutela exclusiva do administrador)
                </span>
              )}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Professor Responsável (Tutela / PIX)</label>
                <select
                  value={professorId}
                  disabled={isProfessor}
                  onChange={(e) => setProfessorId(e.target.value)}
                  className={`w-full border border-slate-300 rounded-xl p-2.5 font-bold text-blue-900 ${isProfessor ? 'bg-slate-100 cursor-not-allowed text-slate-500' : 'bg-blue-50/40'}`}
                >
                  {instructors.map(i => (
                    <option key={i.id} value={i.id}>
                      {i.nome} (Faixa {i.faixa} {i.graus}º grau)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Turma / Horário Preferido</label>
                <select
                  value={turmaPreferida}
                  onChange={(e) => setTurmaPreferida(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
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

          {/* Seção 4: Plano & Financeiro */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-600" />
              4. Plano & Mensalidade
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Categoria de Plano</label>
                <select
                  value={plano}
                  onChange={(e) => handlePlanoChange(e.target.value as PlanType)}
                  className="w-full border border-slate-300 rounded-xl p-2 font-semibold text-slate-900"
                >
                  <option value="regular">Regular Adulto</option>
                  <option value="infantil">Infantil (Kids)</option>
                  <option value="bolsista">Bolsista Competição</option>
                  <option value="projeto_social">Projeto Social (Isento)</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Valor Mensal (R$)</label>
                <input
                  type="number"
                  min={0}
                  value={valorMensalidade}
                  onChange={(e) => setValorMensalidade(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-xl p-2 font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Dia Vencimento</label>
                <input
                  type="number"
                  min={1}
                  max={31}
                  value={diaVencimento}
                  onChange={(e) => setDiaVencimento(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-xl p-2 font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Status de Pagamento</label>
                <select
                  value={statusPagamento}
                  onChange={(e) => setStatusPagamento(e.target.value as PaymentStatus)}
                  className="w-full border border-slate-300 rounded-xl p-2 font-semibold text-slate-900"
                >
                  <option value="em_dia">Em Dia (Pago)</option>
                  <option value="pendente">Pendente / Aberto</option>
                  <option value="atrasado">Em Atraso / Vencido</option>
                  <option value="isento">Isento (Projeto Social)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Seção 5: Equipamento & Saúde */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-600" />
              5. Equipamento & Observações
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tamanho Kimono</label>
                  <input
                    type="text"
                    value={tamanhoKimono}
                    onChange={(e) => setTamanhoKimono(e.target.value)}
                    placeholder="A1, A2, M2"
                    className="w-full border border-slate-300 rounded-xl p-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    value={pesoKg}
                    onChange={(e) => setPesoKg(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl p-2 text-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Observações Médicas / Restrições</label>
                <input
                  type="text"
                  value={observacoesMedicas}
                  onChange={(e) => setObservacoesMedicas(e.target.value)}
                  placeholder="Lesões, cirurgias ou cuidados especiais..."
                  className="w-full border border-slate-300 rounded-xl p-2 text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isUnderTutela}
              title={!isUnderTutela ? 'Você não tem permissão para salvar alterações neste aluno (fora de tutela)' : undefined}
              className={`px-6 py-2.5 rounded-xl font-bold shadow-md transition-all flex items-center gap-2 ${
                !isUnderTutela 
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 cursor-pointer'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
