import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Key, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle,
  CheckCircle2,
  Loader2,
  Database,
  UserPlus,
  ArrowLeft,
  Phone,
  User,
  Award,
  Calendar,
  CreditCard,
  FileText
} from 'lucide-react';
import { useBjj } from '../context/BjjContext';
import { MikalkenasLogo } from '../components/ui/MikalkenasLogo';
import { ThemeSelector } from '../components/ui/ThemeSelector';
import { BeltColor, UserRole, UserRegistrationData } from '../types';

export const Login: React.FC = () => {
  const { 
    loginWithEmailAndPassword, 
    registerUser, 
    requestPasswordReset,
    academySettings, 
    supabaseConfig, 
    authError 
  } = useBjj();

  // Mode: 'login' | 'register' | 'recovery'
  const [mode, setMode] = useState<'login' | 'register' | 'recovery'>('login');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Recovery form state
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoverySuccess, setRecoverySuccess] = useState<string | null>(null);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  // Registration form state
  const [regRole, setRegRole] = useState<'professor' | 'aluno'>('aluno');
  const [regNome, setRegNome] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regTelefone, setRegTelefone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regFaixa, setRegFaixa] = useState<BeltColor>('branca');
  const [regGraus, setRegGraus] = useState<number>(0);
  const [regDataNasc, setRegDataNasc] = useState('');
  const [regPlano, setRegPlano] = useState('regular');
  const [regTurmaPreferencia, setRegTurmaPreferencia] = useState('Geral / Mista');
  const [regRegistroCBJJ, setRegRegistroCBJJ] = useState('');
  const [regChavePix, setRegChavePix] = useState('');
  const [regBio, setRegBio] = useState('');
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccessMessage, setRegSuccessMessage] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Por favor, informe seu endereço de e-mail.');
      return;
    }

    if (!password) {
      setErrorMessage('Por favor, informe sua senha.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginWithEmailAndPassword(cleanEmail, password);
      if (!result.success) {
        setErrorMessage(result.message);
      }
    } catch {
      // Mensagem genérica segura sem expor credenciais
      setErrorMessage('E-mail ou senha inválidos.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Recovery Submit
  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError(null);
    setRecoverySuccess(null);

    const cleanEmail = recoveryEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setRecoveryError('Informe o seu endereço de e-mail cadastrado.');
      return;
    }

    setRecoveryLoading(true);
    try {
      const res = await requestPasswordReset(cleanEmail);
      if (res.success) {
        setRecoverySuccess(res.message);
      } else {
        setRecoveryError(res.message);
      }
    } catch {
      setRecoveryError('Não foi possível processar a recuperação de senha no momento. Tente novamente mais tarde.');
    } finally {
      setRecoveryLoading(false);
    }
  };

  // Handle Registration Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccessMessage(null);

    const cleanNome = regNome.trim();
    const cleanEmail = regEmail.trim().toLowerCase();

    if (!cleanNome || cleanNome.length < 3) {
      setRegError('Informe o seu nome completo (mínimo de 3 caracteres).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setRegError('Informe um endereço de e-mail válido.');
      return;
    }

    if (!regPassword || regPassword.length < 6) {
      setRegError('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('A senha e a confirmação de senha não coincidem.');
      return;
    }

    setIsRegistering(true);
    try {
      const regData: UserRegistrationData = {
        nome: cleanNome,
        email: cleanEmail,
        password: regPassword,
        role: regRole,
        telefone: regTelefone.trim() || undefined,
        faixa: regFaixa,
        graus: regGraus,
        dataNascimento: regRole === 'aluno' ? regDataNasc : undefined,
        plano: regRole === 'aluno' ? (regPlano as any) : undefined,
        turmaPreferencia: regRole === 'aluno' ? regTurmaPreferencia : undefined,
        registroCBJJ: regRole === 'professor' ? regRegistroCBJJ.trim() : undefined,
        chavePix: regRole === 'professor' ? regChavePix.trim() : undefined,
        bio: regRole === 'professor' ? regBio.trim() : undefined
      };

      const res = await registerUser(regData);
      if (res.success) {
        setRegSuccessMessage('Cadastro enviado! Aguarde a aprovação de um administrador.');
        // Limpar campos de senha
        setRegPassword('');
        setRegConfirmPassword('');
      } else {
        setRegError(res.message);
      }
    } catch (err: any) {
      setRegError(err?.message || 'Falha ao enviar cadastro. Tente novamente.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-theme-app text-theme-main flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden transition-colors duration-200">
      {/* Floating Theme Selector on Top Right */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeSelector variant="compact" />
      </div>

      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-lg relative z-10 space-y-6">
        
        {/* Top Header & Branding */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-theme-card border border-theme text-xs font-semibold text-theme-main shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Portal Oficial de Acesso • {academySettings.nomeAcademia || 'Mikalkenas Jiu Jitsu'}
          </div>

          <div className="flex flex-col items-center justify-center gap-3">
            <MikalkenasLogo size="xl" variant="metallic" showWordmark={true} showTagline={true} />
            <div className="space-y-0.5">
              <p className="text-[11px] text-amber-500 font-bold uppercase tracking-widest">
                DISCIPLINA • RESPEITO • EVOLUÇÃO
              </p>
              <p className="text-[11px] text-theme-muted font-medium">
                Gestão do Tatame • Mestre {academySettings.mestreResponsavel}
              </p>
            </div>
          </div>
        </div>

        {/* Auth / Register Box */}
        <div className="bg-theme-card backdrop-blur-xl border border-theme rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
          
          {/* MODE 1: LOGIN */}
          {mode === 'login' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-theme-main flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-500" />
                  Autenticação de Usuário
                </h2>
                <p className="text-xs text-theme-muted">
                  Digite seu e-mail e sua senha para acessar o sistema.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{errorMessage}</span>
                </div>
              )}

              {authError && !errorMessage && (
                <div className="p-3.5 rounded-xl bg-amber-950/50 border border-amber-800/70 text-amber-100 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{authError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} method="post" autoComplete="on" className="space-y-4">
                <div>
                  <label 
                    htmlFor="login-email" 
                    className="block text-xs font-semibold text-theme-muted mb-1.5"
                  >
                    E-mail
                  </label>
                  <div className="relative">
                    <input
                      id="login-email"
                      name="username"
                      type="email"
                      autoComplete="username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@exemplo.com"
                      className="w-full bg-theme-app border border-theme focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-theme-main rounded-xl px-3.5 py-3 pl-10 text-sm transition-all outline-none"
                      required
                      disabled={isLoading}
                    />
                    <Mail className="w-4 h-4 text-theme-muted absolute left-3.5 top-3.5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label 
                      htmlFor="login-password" 
                      className="block text-xs font-semibold text-theme-muted"
                    >
                      Senha
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('recovery');
                        setRecoveryEmail(email);
                        setRecoveryError(null);
                        setRecoverySuccess(null);
                        setErrorMessage(null);
                      }}
                      className="text-xs text-amber-500 hover:text-amber-400 font-semibold transition-colors cursor-pointer"
                    >
                      Esqueceu sua senha?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="login-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-theme-app border border-theme focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-theme-main rounded-xl px-3.5 py-3 pl-10 pr-10 text-sm transition-all outline-none"
                      required
                      disabled={isLoading}
                    />
                    <Key className="w-4 h-4 text-theme-muted absolute left-3.5 top-3.5 pointer-events-none" />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-theme-muted hover:text-theme-main transition-colors cursor-pointer"
                      aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-theme-accent hover:opacity-90 disabled:opacity-50 text-white font-black text-sm py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Validando Credenciais...</span>
                    </>
                  ) : (
                    <>
                      <span>Entrar no Sistema</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Master Admin Fast Login Pill */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('thiagomoraes.mail@gmail.com');
                    setPassword('Pindorama@2507');
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-[11px] text-zinc-300 font-semibold transition-all flex items-center justify-between gap-2"
                >
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
                    <span>Acesso Rápido Admin Master (Thiago)</span>
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">Preencher</span>
                </button>
              </div>

              {/* Action to switch to registration */}
              <div className="pt-4 border-t border-theme flex flex-col items-center gap-3 text-center">
                <p className="text-xs text-theme-muted">
                  Ainda não tem acesso à plataforma?
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage(null);
                    setRegSuccessMessage(null);
                    setRegError(null);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl border border-theme hover:bg-theme-app text-xs font-bold text-theme-main transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-amber-500" />
                  <span>Novo Cadastro • Solicitar Acesso</span>
                </button>
              </div>
            </div>
          )}

          {/* MODE 2: NOVO CADASTRO */}
          {mode === 'register' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-theme-main flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-amber-500" />
                    Solicitação de Novo Cadastro
                  </h2>
                  <p className="text-xs text-theme-muted">
                    Preencha os dados abaixo. Seu cadastro passará por aprovação de um administrador.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="p-2 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-app transition-colors cursor-pointer"
                  title="Voltar ao login"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>

              {regSuccessMessage ? (
                <div className="space-y-4 py-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-theme-main">Solicitação Enviada com Sucesso!</h3>
                    <p className="text-xs text-emerald-400 font-semibold leading-relaxed">
                      {regSuccessMessage}
                    </p>
                    <p className="text-[11px] text-theme-muted max-w-sm mx-auto pt-2">
                      Assim que o administrador aprovar o seu perfil, você poderá fazer o login utilizando seu e-mail e a senha cadastrada.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setRegSuccessMessage(null);
                    }}
                    className="w-full bg-theme-accent hover:opacity-90 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Voltar para a Tela de Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  {regError && (
                    <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-medium">{regError}</span>
                    </div>
                  )}

                  {/* Role Choice (Professor ou Aluno) */}
                  <div>
                    <label className="block text-xs font-semibold text-theme-muted mb-2">
                      Tipo de Usuário <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        regRole === 'aluno'
                          ? 'border-amber-500 bg-amber-500/10 text-theme-main font-bold'
                          : 'border-theme bg-theme-app/60 text-theme-muted hover:border-amber-500/40'
                      }`}>
                        <input
                          type="radio"
                          name="role"
                          value="aluno"
                          checked={regRole === 'aluno'}
                          onChange={() => setRegRole('aluno')}
                          className="text-amber-500 focus:ring-amber-500"
                        />
                        <span className="text-xs">🥋 Aluno</span>
                      </label>

                      <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        regRole === 'professor'
                          ? 'border-amber-500 bg-amber-500/10 text-theme-main font-bold'
                          : 'border-theme bg-theme-app/60 text-theme-muted hover:border-amber-500/40'
                      }`}>
                        <input
                          type="radio"
                          name="role"
                          value="professor"
                          checked={regRole === 'professor'}
                          onChange={() => setRegRole('professor')}
                          className="text-amber-500 focus:ring-amber-500"
                        />
                        <span className="text-xs">👨‍🏫 Professor</span>
                      </label>
                    </div>
                  </div>

                  {/* Common: Nome */}
                  <div>
                    <label className="block text-xs font-semibold text-theme-muted mb-1">
                      Nome Completo <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={regNome}
                        onChange={e => setRegNome(e.target.value)}
                        placeholder="Ex: Carlos Gracie Filho"
                        className="w-full bg-theme-app border border-theme focus:border-amber-400 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-theme-main outline-none"
                        required
                      />
                      <User className="w-4 h-4 text-theme-muted absolute left-3 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Common: Email */}
                  <div>
                    <label className="block text-xs font-semibold text-theme-muted mb-1">
                      E-mail (usuário de login) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={regEmail}
                        onChange={e => setRegEmail(e.target.value)}
                        placeholder="carlos@exemplo.com"
                        className="w-full bg-theme-app border border-theme focus:border-amber-400 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-theme-main outline-none"
                        required
                      />
                      <Mail className="w-4 h-4 text-theme-muted absolute left-3 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Common: Telefone / WhatsApp */}
                  <div>
                    <label className="block text-xs font-semibold text-theme-muted mb-1">
                      Telefone / WhatsApp
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={regTelefone}
                        onChange={e => setRegTelefone(e.target.value)}
                        placeholder="(11) 98765-4321"
                        className="w-full bg-theme-app border border-theme focus:border-amber-400 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-theme-main outline-none"
                      />
                      <Phone className="w-4 h-4 text-theme-muted absolute left-3 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Senha e Confirmação */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-theme-muted mb-1">
                        Senha <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          value={regPassword}
                          onChange={e => setRegPassword(e.target.value)}
                          placeholder="Mínimo 6 dígitos"
                          className="w-full bg-theme-app border border-theme focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-theme-main outline-none pr-8"
                          required
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-2.5 top-2.5 text-theme-muted hover:text-theme-main cursor-pointer"
                        >
                          {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-theme-muted mb-1">
                        Confirmar Senha <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regConfirmPassword}
                        onChange={e => setRegConfirmPassword(e.target.value)}
                        placeholder="Repita a senha"
                        className="w-full bg-theme-app border border-theme focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-theme-main outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Faixa e Graus */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-theme-muted mb-1">
                        Faixa Atual
                      </label>
                      <select
                        value={regFaixa}
                        onChange={e => setRegFaixa(e.target.value as BeltColor)}
                        className="w-full bg-theme-app border border-theme rounded-xl px-3 py-2 text-xs text-theme-main outline-none cursor-pointer"
                      >
                        <option value="branca">Branca</option>
                        <option value="cinza">Cinza (Infantil)</option>
                        <option value="amarela">Amarela (Infantil)</option>
                        <option value="laranja">Laranja (Infantil)</option>
                        <option value="verde">Verde (Infantil)</option>
                        <option value="azul">Azul</option>
                        <option value="roxa">Roxa</option>
                        <option value="marrom">Marrom</option>
                        <option value="preta">Preta</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-theme-muted mb-1">
                        Graus
                      </label>
                      <select
                        value={regGraus}
                        onChange={e => setRegGraus(Number(e.target.value))}
                        className="w-full bg-theme-app border border-theme rounded-xl px-3 py-2 text-xs text-theme-main outline-none cursor-pointer"
                      >
                        <option value={0}>0 Grau</option>
                        <option value={1}>1º Grau</option>
                        <option value={2}>2º Grau</option>
                        <option value={3}>3º Grau</option>
                        <option value={4}>4º Grau</option>
                      </select>
                    </div>
                  </div>

                  {/* Role Specific Fields: ALUNO */}
                  {regRole === 'aluno' && (
                    <div className="space-y-3 pt-2 border-t border-theme">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-theme-muted mb-1">
                            Data de Nascimento
                          </label>
                          <input
                            type="date"
                            value={regDataNasc}
                            onChange={e => setRegDataNasc(e.target.value)}
                            className="w-full bg-theme-app border border-theme rounded-xl px-3 py-2 text-xs text-theme-main outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-theme-muted mb-1">
                            Plano Desejado
                          </label>
                          <select
                            value={regPlano}
                            onChange={e => setRegPlano(e.target.value)}
                            className="w-full bg-theme-app border border-theme rounded-xl px-3 py-2 text-xs text-theme-main outline-none cursor-pointer"
                          >
                            <option value="Mensal">Mensal Regular</option>
                            <option value="Trimestral">Trimestral</option>
                            <option value="Semestral">Semestral</option>
                            <option value="Anual">Anual</option>
                            <option value="Infantil">Infantil Kids</option>
                            <option value="Bolsista">Bolsista Social</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-theme-muted mb-1">
                          Turma de Preferência
                        </label>
                        <input
                          type="text"
                          value={regTurmaPreferencia}
                          onChange={e => setRegTurmaPreferencia(e.target.value)}
                          placeholder="Ex: Noite (19:30) ou Manhã (07:00)"
                          className="w-full bg-theme-app border border-theme rounded-xl px-3 py-2 text-xs text-theme-main outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Role Specific Fields: PROFESSOR */}
                  {regRole === 'professor' && (
                    <div className="space-y-3 pt-2 border-t border-theme">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-theme-muted mb-1">
                            Registro CBJJ / IBJJF
                          </label>
                          <input
                            type="text"
                            value={regRegistroCBJJ}
                            onChange={e => setRegRegistroCBJJ(e.target.value)}
                            placeholder="Ex: CBJJ-89412"
                            className="w-full bg-theme-app border border-theme rounded-xl px-3 py-2 text-xs text-theme-main outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-theme-muted mb-1">
                            Chave PIX (para repasses)
                          </label>
                          <input
                            type="text"
                            value={regChavePix}
                            onChange={e => setRegChavePix(e.target.value)}
                            placeholder="CPF, e-mail ou celular"
                            className="w-full bg-theme-app border border-theme rounded-xl px-3 py-2 text-xs text-theme-main outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-theme-muted mb-1">
                          Especialidade / Mini Bio
                        </label>
                        <textarea
                          rows={2}
                          value={regBio}
                          onChange={e => setRegBio(e.target.value)}
                          placeholder="Ex: Especialista em Guarda De La Riva e raspagens modernas..."
                          className="w-full bg-theme-app border border-theme rounded-xl px-3 py-2 text-xs text-theme-main outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-4 disabled:opacity-50"
                  >
                    {isRegistering ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Enviando Cadastro para o Supabase...</span>
                      </>
                    ) : (
                      <>
                        <span>Enviar Solicitação de Cadastro</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-xs text-theme-muted hover:text-theme-main underline transition-colors cursor-pointer"
                    >
                      Já possui uma conta aprovada? Fazer login
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* MODE 3: RECUPERAÇÃO DE SENHA */}
          {mode === 'recovery' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-theme-main flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-500" />
                    Recuperação de Acesso
                  </h2>
                  <p className="text-xs text-theme-muted">
                    Informe seu e-mail para receber as instruções e orientações de redefinição de senha.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setRecoveryError(null);
                    setRecoverySuccess(null);
                  }}
                  className="p-2 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-app transition-colors cursor-pointer"
                  title="Voltar ao login"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>

              {recoveryError && (
                <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{recoveryError}</span>
                </div>
              )}

              {recoverySuccess ? (
                <div className="space-y-4 py-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-theme-main">Solicitação Enviada com Sucesso!</h3>
                    <p className="text-xs text-emerald-400 font-semibold leading-relaxed">
                      {recoverySuccess}
                    </p>
                    <p className="text-[11px] text-theme-muted max-w-sm mx-auto pt-2">
                      Caso não localize na sua caixa principal, verifique a pasta de spam ou consulte a administração da academia.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setRecoverySuccess(null);
                    }}
                    className="w-full bg-theme-accent hover:opacity-90 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar à Tela de Login</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRecoverySubmit} className="space-y-4">
                  <div>
                    <label 
                      htmlFor="recovery-email" 
                      className="block text-xs font-semibold text-theme-muted mb-1.5"
                    >
                      E-mail Cadastrado
                    </label>
                    <div className="relative">
                      <input
                        id="recovery-email"
                        type="email"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        placeholder="seu.email@exemplo.com"
                        className="w-full bg-theme-app border border-theme focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-theme-main rounded-xl px-3.5 py-3 pl-10 text-sm transition-all outline-none"
                        required
                        disabled={recoveryLoading}
                      />
                      <Mail className="w-4 h-4 text-theme-muted absolute left-3.5 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={recoveryLoading}
                    className="w-full bg-theme-accent hover:opacity-90 disabled:opacity-50 text-white font-black text-sm py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    {recoveryLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verificando e Enviando...</span>
                      </>
                    ) : (
                      <>
                        <span>Enviar Instruções de Recuperação</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setRecoveryError(null);
                        setRecoverySuccess(null);
                      }}
                      className="text-xs text-theme-muted hover:text-theme-main underline transition-colors cursor-pointer"
                    >
                      Lembrou sua senha? Voltar ao Login
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-theme-muted space-y-1">
          <p>© {new Date().getFullYear()} {academySettings.nomeAcademia || 'Mikalkenas Jiu Jitsu'} • Todos os direitos reservados</p>
          <p className="text-[11px] opacity-75">
            Regras de graduação e conformidade IBJJF / CBJJ.
          </p>
        </div>
      </div>
    </div>
  );
};
