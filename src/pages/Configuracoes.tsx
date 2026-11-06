import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Settings, 
  ShieldCheck, 
  DollarSign, 
  Award, 
  RefreshCw, 
  CheckCircle2, 
  Building2,
  Phone,
  Mail,
  UserCheck,
  Sparkles,
  MapPin,
  Check,
  Database,
  Palette,
  Eye,
  Sliders,
  Layers,
  MessageCircle,
  AtSign
} from 'lucide-react';
import { useBjj } from '../context/BjjContext';
import { BeltColor, GraduationSystemType, BeltGraduationRule } from '../types';
import { BeltBadge } from '../components/ui/BeltBadge';
import { DEFAULT_IBJJF_BELT_RULES } from '../data/mockData';
import { Clock, Calendar, Info } from 'lucide-react';
import { SupabaseConfigTab } from '../components/settings/SupabaseConfigTab';
import { ThemeSelector } from '../components/ui/ThemeSelector';
import { MikalkenasLogo } from '../components/ui/MikalkenasLogo';

type SettingsTab = 'geral' | 'tema' | 'supabase' | 'mensageria';

export const Configuracoes: React.FC = () => {
  const { academySettings, updateAcademySettings, resetDataToDefault, currentUser, supabaseConfig, theme } = useBjj();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeMainTab, setActiveMainTab] = useState<SettingsTab>(() => {
    const tab = searchParams.get('tab');
    if (tab === 'supabase') return 'supabase';
    if (tab === 'mensageria') return 'mensageria';
    if (tab === 'tema' || tab === 'theme') return 'tema';
    return 'geral';
  });

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'supabase' && activeMainTab !== 'supabase') {
      setActiveMainTab('supabase');
    } else if (tabParam === 'mensageria' && activeMainTab !== 'mensageria') {
      setActiveMainTab('mensageria');
    } else if ((tabParam === 'tema' || tabParam === 'theme') && activeMainTab !== 'tema') {
      setActiveMainTab('tema');
    }
  }, [searchParams]);

  const handleTabChange = (tab: SettingsTab) => {
    setActiveMainTab(tab);
    setSearchParams(tab === 'geral' ? {} : { tab });
  };

  const [nomeAcademia, setNomeAcademia] = useState(academySettings.nomeAcademia);
  const [mestreResponsavel, setMestreResponsavel] = useState(academySettings.mestreResponsavel);
  const [faixaMestre, setFaixaMestre] = useState<BeltColor>(academySettings.faixaMestre);
  const [grausMestre, setGrausMestre] = useState(academySettings.grausMestre);
  const [registroCBJJMestre, setRegistroCBJJMestre] = useState(academySettings.registroCBJJMestre);
  const [unidadePrincipal, setUnidadePrincipal] = useState(academySettings.unidadePrincipal);
  const [telefone, setTelefone] = useState(academySettings.telefone);
  const [email, setEmail] = useState(academySettings.email);
  const [chavePix, setChavePix] = useState(academySettings.chavePix);
  const [banco, setBanco] = useState(academySettings.banco);
  const [sistemaGraduacaoPadrao, setSistemaGraduacaoPadrao] = useState<GraduationSystemType>(academySettings.sistemaGraduacaoPadrao);
  const [aulasPorGrau, setAulasPorGrau] = useState(academySettings.aulasPorGrau);
  const [aulasPorFaixaDireta, setAulasPorFaixaDireta] = useState(academySettings.aulasPorFaixaDireta);
  const [valRegular, setValRegular] = useState(academySettings.valorPadraoRegular);
  const [valInfantil, setValInfantil] = useState(academySettings.valorPadraoInfantil);
  const [valBolsista, setValBolsista] = useState(academySettings.valorPadraoBolsista);
  const [regrasGraduacao, setRegrasGraduacao] = useState<Record<BeltColor, BeltGraduationRule>>(() => ({
    ...DEFAULT_IBJJF_BELT_RULES,
    ...(academySettings.regrasGraduacao || {})
  }));
  const [faixasTab, setFaixasTab] = useState<'todas' | 'adulto' | 'infantil'>('todas');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [whatsappApiUrl, setWhatsappApiUrl] = useState(academySettings.whatsappApiUrl || '');
  const [whatsappInstanceId, setWhatsappInstanceId] = useState(academySettings.whatsappInstanceId || '');
  const [whatsappPhoneNumber, setWhatsappPhoneNumber] = useState(academySettings.whatsappPhoneNumber || '');
  const [messagingEmail, setMessagingEmail] = useState(academySettings.messagingEmail || '');
  const [messagingSenderName, setMessagingSenderName] = useState(academySettings.messagingSenderName || academySettings.nomeAcademia);
  const [messagingSaved, setMessagingSaved] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [resetSuccessNotice, setResetSuccessNotice] = useState(false);

  // Sync state if settings update externally
  useEffect(() => {
    setNomeAcademia(academySettings.nomeAcademia);
    setMestreResponsavel(academySettings.mestreResponsavel);
    setFaixaMestre(academySettings.faixaMestre);
    setGrausMestre(academySettings.grausMestre);
    setRegistroCBJJMestre(academySettings.registroCBJJMestre);
    setUnidadePrincipal(academySettings.unidadePrincipal);
    setTelefone(academySettings.telefone);
    setEmail(academySettings.email);
    setChavePix(academySettings.chavePix);
    setBanco(academySettings.banco);
    setSistemaGraduacaoPadrao(academySettings.sistemaGraduacaoPadrao);
    setAulasPorGrau(academySettings.aulasPorGrau);
    setAulasPorFaixaDireta(academySettings.aulasPorFaixaDireta);
    setValRegular(academySettings.valorPadraoRegular);
    setValInfantil(academySettings.valorPadraoInfantil);
    setValBolsista(academySettings.valorPadraoBolsista);
    setRegrasGraduacao({
      ...DEFAULT_IBJJF_BELT_RULES,
      ...(academySettings.regrasGraduacao || {})
    });
    setWhatsappApiUrl(academySettings.whatsappApiUrl || '');
    setWhatsappInstanceId(academySettings.whatsappInstanceId || '');
    setWhatsappPhoneNumber(academySettings.whatsappPhoneNumber || '');
    setMessagingEmail(academySettings.messagingEmail || '');
    setMessagingSenderName(academySettings.messagingSenderName || academySettings.nomeAcademia);
  }, [academySettings]);

  const handleUpdateSingleBeltRule = (faixa: BeltColor, field: 'aulasPorGrau' | 'aulasPorFaixaDireta', val: number) => {
    setRegrasGraduacao(prev => {
      const current = prev[faixa] || DEFAULT_IBJJF_BELT_RULES[faixa];
      return {
        ...prev,
        [faixa]: {
          ...current,
          [field]: Math.max(1, val)
        }
      };
    });
  };

  const handleResetRulesToIBJJF = () => {
    setRegrasGraduacao({ ...DEFAULT_IBJJF_BELT_RULES });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAcademySettings({
      nomeAcademia,
      mestreResponsavel,
      faixaMestre,
      grausMestre: Number(grausMestre),
      registroCBJJMestre,
      unidadePrincipal,
      telefone,
      email,
      chavePix,
      banco,
      sistemaGraduacaoPadrao,
      aulasPorGrau: Number(aulasPorGrau),
      aulasPorFaixaDireta: Number(aulasPorFaixaDireta),
      valorPadraoRegular: Number(valRegular),
      valorPadraoInfantil: Number(valInfantil),
      valorPadraoBolsista: Number(valBolsista),
      regrasGraduacao
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4500);
  };

  const handleSaveMessaging = (e: React.FormEvent) => {
    e.preventDefault();
    updateAcademySettings({
      whatsappApiUrl: whatsappApiUrl.trim(),
      whatsappInstanceId: whatsappInstanceId.trim(),
      whatsappPhoneNumber: whatsappPhoneNumber.trim(),
      messagingEmail: messagingEmail.trim(),
      messagingSenderName: messagingSenderName.trim()
    });
    setMessagingSaved(true);
    setTimeout(() => setMessagingSaved(false), 4500);
  };

  const executeResetData = () => {
    resetDataToDefault();
    setShowResetConfirmModal(false);
    setResetSuccessNotice(true);
    setTimeout(() => setResetSuccessNotice(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
          <Settings className="w-4 h-4" />
          Parâmetros Globais da Academia
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Configurações da Academia & Mestre
        </h1>
        <p className="text-sm text-slate-500">
          Personalize o nome da academia, mestre responsável, sistema padrão de graduação (graus vs apenas faixas) e valores de cobrança. As alterações são salvas e aplicadas em todos os formulários e certificados do sistema.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Configurações salvas com sucesso! O nome da academia e os dados do mestre foram atualizados em todos os menus, cabeçalhos, formulários e certificados.</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-theme pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => handleTabChange('geral')}
          className={`flex items-center gap-2.5 px-4 py-2.5 font-bold text-xs rounded-xl transition-all shrink-0 ${
            activeMainTab === 'geral'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-theme-muted hover:text-theme-main hover:bg-white/5'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Geral & Mestre da Academia</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('tema')}
          className={`flex items-center gap-2.5 px-4 py-2.5 font-bold text-xs rounded-xl transition-all shrink-0 ${
            activeMainTab === 'tema'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-theme-muted hover:text-theme-main hover:bg-white/5'
          }`}
        >
          <Palette className="w-4 h-4 text-amber-400" />
          <span>Tema & Identidade Visual Mikalkenas</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
            3 Temas
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('mensageria')}
          className={`flex items-center gap-2.5 px-4 py-2.5 font-bold text-xs rounded-xl transition-all shrink-0 ${
            activeMainTab === 'mensageria'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-theme-muted hover:text-theme-main hover:bg-white/5'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>Mensageria</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('supabase')}
          className={`flex items-center gap-2.5 px-4 py-2.5 font-bold text-xs rounded-xl transition-all shrink-0 ${
            activeMainTab === 'supabase'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-theme-muted hover:text-theme-main hover:bg-white/5'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Banco de Dados Supabase</span>
          {supabaseConfig.lastConnected ? (
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              activeMainTab === 'supabase' ? 'bg-blue-800 text-white' : 'bg-emerald-100 text-emerald-800'
            }`}>
              Conectado
            </span>
          ) : (
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              activeMainTab === 'supabase' ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              Configurar
            </span>
          )}
        </button>
      </div>

      {activeMainTab === 'supabase' ? (
        <SupabaseConfigTab />
      ) : activeMainTab === 'mensageria' ? (
        <form onSubmit={handleSaveMessaging} className="space-y-6 animate-fade-in">
          {messagingSaved && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-900">
              Configurações de mensageria salvas.
            </div>
          )}
          <section className="rounded-2xl border border-theme bg-theme-card p-6 shadow-sm space-y-5">
            <div>
              <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-500">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </div>
              <h2 className="text-lg font-bold text-theme-main">Integração da API</h2>
              <p className="mt-1 text-xs text-theme-muted">
                Cadastre as informações de identificação do provedor para referência. Esta configuração não envia mensagens.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="block text-xs font-semibold text-theme-main md:col-span-2">
                URL do endpoint da API
                <input
                  type="url"
                  value={whatsappApiUrl}
                  onChange={event => setWhatsappApiUrl(event.target.value)}
                  placeholder="https://api.provedor.com/v1"
                  className="mt-1.5 w-full rounded-xl border border-theme bg-theme-app px-3 py-2.5 text-sm text-theme-main"
                />
              </label>
              <label className="block text-xs font-semibold text-theme-main">
                ID da instância ou do número
                <input
                  type="text"
                  value={whatsappInstanceId}
                  onChange={event => setWhatsappInstanceId(event.target.value)}
                  placeholder="Identificador fornecido pelo provedor"
                  className="mt-1.5 w-full rounded-xl border border-theme bg-theme-app px-3 py-2.5 text-sm text-theme-main"
                />
              </label>
              <label className="block text-xs font-semibold text-theme-main">
                WhatsApp da academia
                <input
                  type="tel"
                  value={whatsappPhoneNumber}
                  onChange={event => setWhatsappPhoneNumber(event.target.value)}
                  placeholder="+55 11 99999-9999"
                  className="mt-1.5 w-full rounded-xl border border-theme bg-theme-app px-3 py-2.5 text-sm text-theme-main"
                />
              </label>
            </div>
            <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-theme-main">
              Por segurança, não informe tokens ou chaves secretas aqui: as configurações do aplicativo são visíveis ao cliente. Para habilitar envio real, as credenciais deverão ficar em um backend seguro.
            </p>
          </section>

          <section className="rounded-2xl border border-theme bg-theme-card p-6 shadow-sm space-y-5">
            <div>
              <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-500">
                <AtSign className="h-4 w-4" />
                E-mail
              </div>
              <h2 className="text-lg font-bold text-theme-main">Remetente de mensageria</h2>
              <p className="mt-1 text-xs text-theme-muted">
                Defina o endereço e o nome que a academia pretende usar como remetente. O envio de e-mails ainda não está ativado.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="block text-xs font-semibold text-theme-main">
                E-mail de mensageria da academia
                <input
                  type="email"
                  value={messagingEmail}
                  onChange={event => setMessagingEmail(event.target.value)}
                  placeholder="mensagens@mikalkenasbjj.com.br"
                  className="mt-1.5 w-full rounded-xl border border-theme bg-theme-app px-3 py-2.5 text-sm text-theme-main"
                />
              </label>
              <label className="block text-xs font-semibold text-theme-main">
                Nome do remetente
                <input
                  type="text"
                  value={messagingSenderName}
                  onChange={event => setMessagingSenderName(event.target.value)}
                  placeholder={academySettings.nomeAcademia}
                  className="mt-1.5 w-full rounded-xl border border-theme bg-theme-app px-3 py-2.5 text-sm text-theme-main"
                />
              </label>
            </div>
          </section>

          <div className="flex justify-end border-t border-theme pt-4">
            <button type="submit" className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-blue-700">
              <Check className="h-4 w-4" />
              Salvar mensageria
            </button>
          </div>
        </form>
      ) : activeMainTab === 'tema' ? (
        <div className="space-y-8 animate-fade-in">
          {/* Brand Presentation Card */}
          <div className="bg-theme-card border border-theme rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <MikalkenasLogo size="lg" variant="metallic" showWordmark={true} showTagline={true} />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-theme-main border border-theme">
                  Oficial Mikalkenas — BJJ —
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-400/10 text-amber-400 border border-amber-400/30">
                  Campanha & Marketing 2026
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-theme grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-theme">
                <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">Pilares Fundamentais</span>
                <p className="font-semibold text-theme-main">Disciplina • Respeito • Evolução</p>
                <p className="text-[11px] text-theme-muted mt-0.5">Estampado nas rashguards e diplomas oficiais.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-theme">
                <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">Missão do Tatame</span>
                <p className="font-semibold text-theme-main">Mais que um esporte, um estilo de vida</p>
                <p className="text-[11px] text-theme-muted mt-0.5">Formação integral do praticante dentro e fora da academia.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-theme">
                <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">Símbolo Heráldico</span>
                <p className="font-semibold text-theme-main">Monograma Geométrico com Asas</p>
                <p className="text-[11px] text-theme-muted mt-0.5">Equilíbrio, precisão e elevação espiritual no Jiu-Jitsu.</p>
              </div>
            </div>
          </div>

          {/* Interactive 3-Theme Selector */}
          <div className="bg-theme-card border border-theme rounded-3xl p-6 md:p-8 shadow-md space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                <Palette className="w-4 h-4" />
                Selecione o Visual do Sistema
              </div>
              <h2 className="text-xl md:text-2xl font-black text-theme-main tracking-tight">
                3 Temas Alinhados ao Material de Marketing
              </h2>
              <p className="text-xs text-theme-muted mt-1">
                A paleta altera instantaneamente menus, cabeçalhos, cartões e botões, persistindo suas preferências localmente.
              </p>
            </div>

            <ThemeSelector variant="expanded" />
          </div>

          {/* Official Marketing Campaign Asset Gallery */}
          <div className="bg-theme-card border border-theme rounded-3xl p-6 md:p-8 shadow-md space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-lg font-bold text-theme-main flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-500" />
                  Material Oficial da Campanha Integrado
                </h3>
                <p className="text-xs text-theme-muted">
                  Peças de marketing fornecidas para a criação da identidade do aplicativo.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Ativos de Alta Fidelidade
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Asset 1: Kimonos */}
              <div className="rounded-2xl border border-theme overflow-hidden bg-black/20 flex flex-col group">
                <div className="relative aspect-4/3 overflow-hidden bg-black/40">
                  <img 
                    src="/assets/aistudio/Mikalkenas_Kimonos_3db0a11f.jpeg" 
                    alt="Kimonos Oficiais Mikalkenas Jiu Jitsu" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    Linha de Kimonos
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-theme-main">Kimonos Oficiais de Treino & Competição</h4>
                    <p className="text-[11px] text-theme-muted mt-1">
                      Modelos trançados nas 4 variações oficiais: Branco Tradicional, Preto Onyx, Cinza Titânio e Azul Marinho Profundo.
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-[10px] text-amber-400 font-semibold">
                    <Check className="w-3.5 h-3.5" /> Inspiração para os 3 temas
                  </div>
                </div>
              </div>

              {/* Asset 2: Rash Guards */}
              <div className="rounded-2xl border border-theme overflow-hidden bg-black/20 flex flex-col group">
                <div className="relative aspect-4/3 overflow-hidden bg-black/40">
                  <img 
                    src="/assets/aistudio/Mikalkenas_Rash_Guards_e30540cb.jpeg" 
                    alt="Rash Guards Mikalkenas Jiu Jitsu" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    Linha No-Gi
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-theme-main">Rash Guards Graduadas</h4>
                    <p className="text-[11px] text-theme-muted mt-1">
                      Edições especiais para cada faixa (Branca, Azul, Roxa, Marrom e Preta), carregando o lema "Disciplina • Respeito • Evolução".
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-[10px] text-amber-400 font-semibold">
                    <Check className="w-3.5 h-3.5" /> Padronização de cores IBJJF
                  </div>
                </div>
              </div>

              {/* Asset 3: Brand Identity Manual */}
              <div className="rounded-2xl border border-theme overflow-hidden bg-black/20 flex flex-col group">
                <div className="relative aspect-4/3 overflow-hidden bg-black/40">
                  <img 
                    src="/assets/aistudio/Mikalkenas_Logos_2664191d.jpeg" 
                    alt="Manual de Marca Mikalkenas Jiu Jitsu" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    Manual de Identidade
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-theme-main">Manual Oficial de Cores & Proporções</h4>
                    <p className="text-[11px] text-theme-muted mt-1">
                      Guia de vetorização do monograma alado, aplicação de gradientes metálicos em ouro e regras de contraste visual.
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-[10px] text-amber-400 font-semibold">
                    <Check className="w-3.5 h-3.5" /> Reproduzido em SVG nativo
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
        {/* Academy Profile & Master */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Identidade da Academia & Mestre Responsável
            </h3>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded-lg">
              Propagado no Sistema Todo
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Nome do Dojo / Academia *</label>
              <input
                type="text"
                required
                value={nomeAcademia}
                onChange={(e) => setNomeAcademia(e.target.value)}
                placeholder="Ex: Mikalkenas Jiu Jitsu, Gracie Barra, Alliance..."
                className="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">Exibido na barra lateral, certificados de graduação e relatórios PDF.</p>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Mestre / Responsável Técnico *</label>
              <input
                type="text"
                required
                value={mestreResponsavel}
                onChange={(e) => setMestreResponsavel(e.target.value)}
                placeholder="Ex: Mestre Edson Mikalkenas, Mestre Rickson..."
                className="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">Atualiza automaticamente os cadastros de professor, login de administrador e assinaturas.</p>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Faixa do Mestre</label>
              <select
                value={faixaMestre}
                onChange={(e) => setFaixaMestre(e.target.value as BeltColor)}
                className="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
              >
                <option value="preta">Faixa Preta</option>
                <option value="marrom">Faixa Marrom</option>
                <option value="roxa">Faixa Roxa</option>
                <option value="azul">Faixa Azul</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Graus do Mestre</label>
                <select
                  value={grausMestre}
                  onChange={(e) => setGrausMestre(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                >
                  <option value={0}>0 Graus</option>
                  <option value={1}>1º Grau</option>
                  <option value={2}>2º Grau</option>
                  <option value={3}>3º Grau</option>
                  <option value={4}>4º Grau</option>
                  <option value={5}>5º Grau</option>
                  <option value={6}>6º Grau</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Registro CBJJ / IBJJF</label>
                <input
                  type="text"
                  value={registroCBJJMestre}
                  onChange={(e) => setRegistroCBJJMestre(e.target.value)}
                  placeholder="Ex: CBJJ #48291"
                  className="w-full border border-slate-300 rounded-xl p-2.5 font-mono text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Unidade / Tatame Principal</label>
              <input
                type="text"
                value={unidadePrincipal}
                onChange={(e) => setUnidadePrincipal(e.target.value)}
                placeholder="Ex: Matriz - Tatame Central"
                className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Telefone / WhatsApp da Academia</label>
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

        {/* Graduation Methodology System */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Metodologia de Graduação Padrão
            </h3>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
              Regra Pedagógica
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <p className="text-slate-600">
              Escolha a filosofia de graduação padrão adotada pela sua escola. Professores individuais também podem escolher seu próprio método no cadastro.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                sistemaGraduacaoPadrao === 'graus_e_faixas' 
                  ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/10' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}>
                <input
                  type="radio"
                  name="sistemaGraduacao"
                  value="graus_e_faixas"
                  checked={sistemaGraduacaoPadrao === 'graus_e_faixas'}
                  onChange={() => setSistemaGraduacaoPadrao('graus_e_faixas')}
                  className="mt-1"
                />
                <div>
                  <span className="font-extrabold text-sm text-slate-900 block">
                    1. Sistema Tradicional (Graus + Faixas)
                  </span>
                  <span className="text-slate-500 text-xs block mt-1 leading-relaxed">
                    O praticante recebe até 4 graus na ponta preta da faixa antes de estar apto para prestar exame e trocar de faixa.
                  </span>
                  <span className="inline-block mt-2 font-mono text-[11px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                    Ex: Faixa Branca → 1º Grau → 2º Grau → 3º Grau → 4º Grau → Faixa Azul
                  </span>
                </div>
              </label>

              <label className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                sistemaGraduacaoPadrao === 'apenas_faixas' 
                  ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/10' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}>
                <input
                  type="radio"
                  name="sistemaGraduacao"
                  value="apenas_faixas"
                  checked={sistemaGraduacaoPadrao === 'apenas_faixas'}
                  onChange={() => setSistemaGraduacaoPadrao('apenas_faixas')}
                  className="mt-1"
                />
                <div>
                  <span className="font-extrabold text-sm text-slate-900 block">
                    2. Sistema Direto (Somente Troca de Faixas)
                  </span>
                  <span className="text-slate-500 text-xs block mt-1 leading-relaxed">
                    Sem graus intermediários. O tempo e a assiduidade acumulam diretamente para a troca de faixa (como na linhagem antiga ou escolas sem graus).
                  </span>
                  <span className="inline-block mt-2 font-mono text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                    Ex: Faixa Branca → Faixa Azul (Direto pelo tempo e evolução técnica)
                  </span>
                </div>
              </label>
            </div>

            {/* IBJJF Official Belt Rules Matrix */}
            <div className="pt-6 border-t border-slate-200/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    Carga Horária & Tempo Mínimo por Faixa (Regulamento IBJJF)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Defina individualmente a meta de aulas para cada faixa, sincronizada com o período de carência da IBJJF (incluindo todas as faixas infantis).
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={handleResetRulesToIBJJF}
                    className="text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 transition-colors flex items-center gap-1.5"
                    title="Restaurar valores de aulas e tempo mínimo oficiais da IBJJF"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Restaurar Padrão Oficial IBJJF
                  </button>
                </div>
              </div>

              {/* Belt Category Filter Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <button
                  type="button"
                  onClick={() => setFaixasTab('todas')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                    faixasTab === 'todas'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Todas as Faixas ({Object.keys(regrasGraduacao).length})
                </button>
                <button
                  type="button"
                  onClick={() => setFaixasTab('adulto')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                    faixasTab === 'adulto'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Faixas Adulto (Branca, Azul, Roxa, Marrom, Preta)
                </button>
                <button
                  type="button"
                  onClick={() => setFaixasTab('infantil')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                    faixasTab === 'infantil'
                      ? 'bg-amber-500 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Faixas Infantis / Kids (Cinza, Amarela, Laranja, Verde)
                </button>
              </div>

              {/* Belt Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(Object.entries(regrasGraduacao) as [BeltColor, BeltGraduationRule][])
                  .filter(([_, rule]) => faixasTab === 'todas' || rule.categoria === faixasTab)
                  .map(([faixaKey, rule]) => (
                    <div 
                      key={faixaKey}
                      className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/90 hover:border-slate-300 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <BeltBadge faixa={faixaKey} size="md" showLabel={false} />
                          <div>
                            <span className="font-extrabold text-sm text-slate-900 block leading-tight">
                              {rule.nome}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {rule.categoria === 'infantil' ? '👶 Sistema Infantil' : '🥋 Sistema Adulto'} • Idade Mínima: {rule.idadeMinima} anos
                            </span>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          rule.categoria === 'infantil' 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {rule.categoria}
                        </span>
                      </div>

                      {/* IBJJF Minimum Time Banner */}
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 flex items-center gap-2 text-xs">
                        <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                        <div className="min-w-0">
                          <span className="text-slate-500 text-[11px] block">Tempo Mínimo Obrigatório IBJJF:</span>
                          <span className="font-bold text-slate-900 text-xs truncate block">
                            {rule.tempoMinimoDescricao}
                          </span>
                        </div>
                      </div>

                      {/* Editable Class Count Inputs */}
                      <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3 rounded-xl border border-slate-200/80">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1 text-[11px]">
                            Aulas por Grau (em 4 graus)
                          </label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min={5}
                              max={200}
                              value={rule.aulasPorGrau}
                              onChange={(e) => handleUpdateSingleBeltRule(faixaKey, 'aulasPorGrau', Number(e.target.value))}
                              className="w-full border border-slate-300 rounded-lg p-2 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-[10px] text-slate-400 font-semibold">aulas</span>
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            Total: {rule.aulasPorGrau * 4} aulas
                          </span>
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1 text-[11px]">
                            Aulas para Troca Direta
                          </label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min={20}
                              max={600}
                              value={rule.aulasPorFaixaDireta}
                              onChange={(e) => handleUpdateSingleBeltRule(faixaKey, 'aulasPorFaixaDireta', Number(e.target.value))}
                              className="w-full border border-slate-300 rounded-lg p-2 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-[10px] text-slate-400 font-semibold">aulas</span>
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            Sem graus (direto)
                          </span>
                        </div>
                      </div>

                      {/* IBJJF Note */}
                      <p className="text-[10px] text-slate-400 italic leading-snug">
                        Norma IBJJF: {rule.observacaoIBJJF}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Financial & PIX */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            Dados Financeiros & Valores Padrão de Mensalidade
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Chave PIX da Academia (usada nas mensagens e cobranças gerais)
              </label>
              <input
                type="text"
                value={chavePix}
                onChange={(e) => setChavePix(e.target.value)}
                placeholder="Ex: professormikalkenasbjj@gmail.com ou CNPJ"
                className="w-full border border-slate-300 rounded-xl p-2.5 font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Banco / Detalhes de Depósito</label>
              <input
                type="text"
                value={banco}
                onChange={(e) => setBanco(e.target.value)}
                placeholder="Ex: Banco do Brasil (Ag: 1842-1 C/C: 49201-9)"
                className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Aluno Regular (R$)</label>
              <input
                type="number"
                value={valRegular}
                onChange={(e) => setValRegular(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-xl p-2.5 font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Turma Infantil (R$)</label>
              <input
                type="number"
                value={valInfantil}
                onChange={(e) => setValInfantil(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-xl p-2.5 font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Bolsista Atleta (R$)</label>
              <input
                type="number"
                value={valBolsista}
                onChange={(e) => setValBolsista(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-xl p-2.5 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setShowResetConfirmModal(true)}
            className="flex items-center gap-2 text-rose-600 hover:text-rose-700 text-xs font-bold px-3 py-2 rounded-xl transition-colors hover:bg-rose-50"
          >
            <RefreshCw className="w-4 h-4" />
            Restaurar Dados Padrão de Demonstração
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Salvar e Aplicar em Todo o Sistema
          </button>
        </div>
      </form>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-base text-slate-900">Restaurar Dados Originais?</h3>
              <p className="text-xs text-slate-500">
                Esta ação restaura os registros iniciais de demonstração (alunos, turmas, finanças e configurações). Quaisquer novos cadastros criados serão resetados.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={executeResetData}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Sim, Restaurar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Success Notice */}
      {resetSuccessNotice && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs font-bold flex items-center gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Dados de demonstração restaurados com sucesso para os valores padrão!</span>
        </div>
      )}
    </div>
  );
};
