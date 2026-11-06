import React, { useState } from 'react';
import { 
  X, 
  Save, 
  UserRound, 
  ShieldCheck, 
  AlertCircle,
  Phone,
  Mail,
  Award,
  DollarSign
} from 'lucide-react';
import { 
  Instructor, 
  BeltColor, 
  GraduationSystemType, 
  UserRole, 
  UserPermissions,
  DEFAULT_ADMIN_PERMISSIONS,
  DEFAULT_PROFESSOR_PERMISSIONS
} from '../../types';
import { useBjj } from '../../context/BjjContext';
import { BeltBadge } from '../ui/BeltBadge';

interface EditInstructorModalProps {
  instructor: Instructor | null;
  isOpen?: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EditInstructorModal: React.FC<EditInstructorModalProps> = (props) => {
  if (props.isOpen === false || !props.instructor) return null;
  return <EditInstructorModalContent {...props} instructor={props.instructor} />;
};

const EditInstructorModalContent: React.FC<EditInstructorModalProps & { instructor: Instructor }> = ({
  instructor,
  onClose,
  onSuccess
}) => {
  const { updateInstructor, allUsers, academySettings } = useBjj();

  // Reuse access settings from an already provisioned account, when available.
  const linkedUser = allUsers.find(
    u => u.professorId === instructor.id || u.id === `user-${instructor.id}` || u.email.toLowerCase() === instructor.email.toLowerCase()
  );

  const [nome, setNome] = useState(instructor.nome || '');
  const [faixa, setFaixa] = useState<BeltColor>(instructor.faixa || 'preta');
  const [graus, setGraus] = useState<number>(instructor.graus ?? 1);
  const [email, setEmail] = useState(instructor.email || '');
  const [telefone, setTelefone] = useState(instructor.telefone || '');
  const [registroCBJJ, setRegistroCBJJ] = useState(instructor.registroCBJJ || '');
  const [chavePix, setChavePix] = useState(instructor.chavePix || '');
  const [banco, setBanco] = useState(instructor.banco || '');
  const [sistemaGraduacao, setSistemaGraduacao] = useState<GraduationSystemType>(
    instructor.sistemaGraduacao || academySettings.sistemaGraduacaoPadrao || 'graus_e_faixas'
  );
  const [bio, setBio] = useState(instructor.bio || '');
  const [foto, setFoto] = useState(instructor.foto || '');

  // Access Level & Credentials State
  const [role, setRole] = useState<UserRole>(linkedUser?.role || instructor.role || 'professor');
  const [permissions, setPermissions] = useState<UserPermissions>(() => {
    if (linkedUser?.permissions) return { ...linkedUser.permissions };
    if (instructor.permissions) return { ...instructor.permissions };
    return role === 'admin' ? { ...DEFAULT_ADMIN_PERMISSIONS } : { ...DEFAULT_PROFESSOR_PERMISSIONS };
  });

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
        setFoto(reader.result);
        setErrorMsg(null);
      } else {
        setErrorMsg('Não foi possível carregar a foto selecionada.');
      }
    };
    reader.onerror = () => setErrorMsg(reader.error?.message || 'Não foi possível ler a foto selecionada.');
    reader.readAsDataURL(file);
  };

  const handleApplyPreset = (preset: 'padrao' | 'coordenador' | 'admin') => {
    if (preset === 'padrao') {
      setRole('professor');
      setPermissions({ ...DEFAULT_PROFESSOR_PERMISSIONS });
    } else if (preset === 'coordenador') {
      setRole('professor');
      setPermissions({
        ...DEFAULT_PROFESSOR_PERMISSIONS,
        canManageFinancial: true,
        canManageEvents: true,
        canManageStudents: true
      });
    } else if (preset === 'admin') {
      setRole('admin');
      setPermissions({ ...DEFAULT_ADMIN_PERMISSIONS });
    }
  };

  const handleTogglePermission = (key: keyof UserPermissions) => {
    setPermissions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      setErrorMsg('O nome do professor é obrigatório.');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('O e-mail de login é obrigatório.');
      return;
    }

    updateInstructor(
      instructor.id,
      {
        nome: nome.trim(),
        faixa,
        graus: Number(graus),
        email: email.trim(),
        telefone: telefone.trim(),
        foto,
        registroCBJJ: registroCBJJ.trim(),
        bio: bio.trim(),
        chavePix: chavePix.trim(),
        banco: banco.trim(),
        sistemaGraduacao
      },
      {
        role,
        permissions
      }
    );

    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md">
              <UserRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                Editar Cadastro do Professor & Nível de Acesso
              </h3>
              <p className="text-xs text-slate-400">
                Altere dados cadastrais, graduação, chave PIX, privilégios e senha de acesso
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

          {/* Seção 1: Dados do Professor */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              1. Identificação do Docente
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Nome Completo do Professor *</label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Faixa</label>
                <select
                  value={faixa}
                  onChange={(e) => setFaixa(e.target.value as BeltColor)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900 capitalize"
                >
                  <option value="roxa">Roxa</option>
                  <option value="marrom">Marrom</option>
                  <option value="preta">Preta</option>
                  <option value="coral">Coral</option>
                  <option value="vermelha">Vermelha</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Graus</label>
                <select
                  value={graus}
                  onChange={(e) => setGraus(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7].map(g => (
                    <option key={g} value={g}>{g}º Grau</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Registro CBJJ / IBJJF</label>
                <input
                  type="text"
                  value={registroCBJJ}
                  onChange={(e) => setRegistroCBJJ(e.target.value)}
                  placeholder="Ex: CBJJ #48291"
                  className="w-full border border-slate-300 rounded-xl p-2.5 font-mono text-slate-900"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Sistema de Graduação</label>
                <select
                  value={sistemaGraduacao}
                  onChange={(e) => setSistemaGraduacao(e.target.value as GraduationSystemType)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                >
                  <option value="graus_e_faixas">Graus e Faixas (Padrão IBJJF)</option>
                  <option value="apenas_faixas">Apenas Faixas Diretas</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              {foto ? (
                <img src={foto} alt={`Foto de ${nome || 'professor'}`} className="h-16 w-16 rounded-xl object-cover" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-200 text-slate-500">
                  <UserRound className="h-7 w-7" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <label className="block font-bold text-slate-700 mb-1" htmlFor="instructor-photo">Foto do professor</label>
                <input
                  id="instructor-photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  className="block w-full text-xs text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-100 file:px-3 file:py-1.5 file:font-semibold file:text-blue-800"
                />
                <p className="mt-1 text-[11px] text-slate-500">JPG, PNG ou WebP; até 1 MB.</p>
              </div>
              {foto && (
                <button type="button" onClick={() => setFoto('')} className="rounded-lg px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50">
                  Remover
                </button>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-xs font-bold text-slate-700">Prévia da Faixa Docente:</span>
              <BeltBadge faixa={faixa} graus={graus} size="md" />
            </div>
          </div>

          {/* Seção 2: Nível de Acesso */}
          <div className="space-y-4 pt-2 border-t border-slate-100 bg-blue-50/50 p-4.5 rounded-2xl border border-blue-200/80">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-blue-950 text-xs uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                2. Nível de Acesso
              </h4>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                Controle de Acesso
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">E-mail cadastral *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900 bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-600">
              A conta e a senha precisam ser provisionadas no Supabase Auth. Para vincular o acesso, o perfil em usuarios deve usar o UUID da conta autenticada.
            </p>

            <div>
              <label className="font-bold text-slate-800 block mb-2">Função / Nível de Permissão:</label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-2.5 ${
                  role === 'professor' 
                    ? 'border-blue-600 bg-white ring-2 ring-blue-500/20 font-bold text-blue-950' 
                    : 'border-slate-200 bg-white/70 text-slate-700 hover:bg-white'
                }`}>
                  <input
                    type="radio"
                    name="editProfRole"
                    value="professor"
                    checked={role === 'professor'}
                    onChange={() => handleApplyPreset('padrao')}
                  />
                  <div>
                    <span className="block font-bold">Nível Professor</span>
                    <span className="text-[10px] text-slate-500 font-normal">Acesso às turmas, chamada, técnicas e graduação</span>
                  </div>
                </label>

                <label className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-2.5 ${
                  role === 'admin' 
                    ? 'border-red-600 bg-white ring-2 ring-red-500/20 font-bold text-red-950' 
                    : 'border-slate-200 bg-white/70 text-slate-700 hover:bg-white'
                }`}>
                  <input
                    type="radio"
                    name="editProfRole"
                    value="admin"
                    checked={role === 'admin'}
                    onChange={() => handleApplyPreset('admin')}
                  />
                  <div>
                    <span className="block font-bold">Nível Administrador</span>
                    <span className="text-[10px] text-slate-500 font-normal">Acesso total à academia, configurações e financeiro geral</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Presets Rápidos */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="text-[11px] font-bold text-slate-600">Modelos Rápidos:</span>
              <button
                type="button"
                onClick={() => handleApplyPreset('padrao')}
                className="px-2.5 py-1 bg-white hover:bg-blue-100 border border-slate-300 rounded-lg text-[11px] font-semibold text-slate-700"
              >
                Padrão Professor
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('coordenador')}
                className="px-2.5 py-1 bg-white hover:bg-blue-100 border border-slate-300 rounded-lg text-[11px] font-semibold text-blue-700"
              >
                Coordenador com Financeiro
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('admin')}
                className="px-2.5 py-1 bg-white hover:bg-red-100 border border-slate-300 rounded-lg text-[11px] font-semibold text-red-700"
              >
                Acesso Total Administrador
              </button>
            </div>

            {/* Checkboxes Granulares de Permissões */}
            <div className="pt-2">
              <span className="font-bold text-slate-700 block mb-2 text-[11px]">Permissões Individuais Detalhadas:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  { key: 'canManageStudents', label: 'Matricular e gerenciar alunos' },
                  { key: 'canManageClasses', label: 'Criar e editar turmas/horários' },
                  { key: 'canManageFinancial', label: 'Controlar mensalidades e fluxo' },
                  { key: 'canManageGraduations', label: 'Graduar alunos e emitir certificados' },
                  { key: 'canManageEvents', label: 'Criar e gerenciar eventos' },
                  { key: 'canManageTechniques', label: 'Gerenciar biblioteca de técnicas' },
                  { key: 'canManageProducts', label: 'Controle de estoque e loja' },
                  { key: 'canManageSettings', label: 'Configurações da academia' },
                  { key: 'canManageUsers', label: 'Gerenciar logins e usuários' },
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={!!permissions[item.key as keyof UserPermissions]}
                      onChange={() => handleTogglePermission(item.key as keyof UserPermissions)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                    <span className="text-[11px] text-slate-700 font-medium leading-tight">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Seção 3: Financeiro & PIX Individual */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              3. Dados Financeiros & PIX do Professor
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Chave PIX (Para Mensalidades dos Alunos)</label>
                <input
                  type="text"
                  value={chavePix}
                  onChange={(e) => setChavePix(e.target.value)}
                  placeholder="CPF, e-mail ou celular"
                  className="w-full border border-slate-300 rounded-xl p-2.5 font-mono text-emerald-900 bg-emerald-50/30"
                />
                <p className="text-[11px] text-slate-500 mt-1">Os alunos vinculados a este professor pagarão diretamente nesta chave.</p>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Banco / Detalhes de Conta</label>
                <input
                  type="text"
                  value={banco}
                  onChange={(e) => setBanco(e.target.value)}
                  placeholder="Ex: Banco Inter / Nubank"
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">WhatsApp / Telefone</label>
                <input
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(11) 98765-4321"
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Seção 4: Biografia */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="font-bold text-slate-700 block">Biografia, Títulos & Linhagem</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Histórico nas artes marciais, títulos conquistados e turmas que ministra..."
              className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900"
            />
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
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações do Professor</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
