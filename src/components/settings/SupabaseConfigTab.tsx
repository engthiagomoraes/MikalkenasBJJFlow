import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  AlertTriangle,
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  UploadCloud, 
  DownloadCloud, 
  Key, 
  Link as LinkIcon, 
  Eye, 
  EyeOff, 
  FileCode, 
  CheckCheck, 
  Layers, 
  Sparkles,
  Server,
  Terminal,
  ShieldCheck,
  TableProperties,
  FileSpreadsheet,
  Users,
  UserRound,
  Clock,
  BookOpen,
  CalendarCheck,
  CreditCard,
  Upload
} from 'lucide-react';
import { useBjj } from '../../context/BjjContext';
import { 
  REQUIRED_SUPABASE_TABLES, 
  SUPABASE_SCHEMA_SQL, 
  testSupabaseConnection, 
  checkSupabaseTables, 
  extractProjectRef,
  analyzeSupabaseKey,
  isSecretApiKey,
  generateDataMigrationSql
} from '../../services/supabaseService';
import { SupabaseTableStatus } from '../../types';
import { BatchUploadModal, ImportType } from '../import/BatchUploadModal';
import { BASE44_MIGRATION_SQL } from '../../data/base44Data';

export const SupabaseConfigTab: React.FC = () => {
  const { 
    supabaseConfig, 
    updateSupabaseConfig, 
    syncDataWithSupabase, 
    pullDataFromSupabaseContext,
    students,
    instructors,
    classes,
    attendance,
    graduations,
    payments,
    lessonPlans,
    techniques,
    allUsers,
    academySettings,
    evaluations
  } = useBjj();

  const [url, setUrl] = useState(supabaseConfig.url || '');
  const [anonKey, setAnonKey] = useState(supabaseConfig.anonKey || '');
  const [enabled, setEnabled] = useState(supabaseConfig.enabled || false);

  const [showAnonKey, setShowAnonKey] = useState(false);

  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latencyMs?: number } | null>(null);

  const [checkingTables, setCheckingTables] = useState(false);
  const [tableStatuses, setTableStatuses] = useState<SupabaseTableStatus[] | null>(null);

  const [migratingData, setMigratingData] = useState(false);
  const [migrationResult, setMigrationResult] = useState<{ success: boolean; details?: Record<string, number>; errors?: string[] } | null>(null);

  const [pullingData, setPullingData] = useState(false);
  const [pullResult, setPullResult] = useState<{ success: boolean; message: string } | null>(null);

  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlPreview, setShowSqlPreview] = useState(false);
  const [copiedDataSql, setCopiedDataSql] = useState(false);
  const [showDataSqlPreview, setShowDataSqlPreview] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [csvModalType, setCsvModalType] = useState<ImportType | null>(null);

  // Sync state if context updates
  useEffect(() => {
    setUrl(supabaseConfig.url || '');
    setAnonKey(supabaseConfig.anonKey || '');
    setEnabled(supabaseConfig.enabled || false);
  }, [supabaseConfig]);

  const projectRef = extractProjectRef(url);
  const keyAnalysis = analyzeSupabaseKey(anonKey);

  const handleSaveCredentials = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSupabaseConfig({
      url: url.trim(),
      anonKey: anonKey.trim(),
      enabled
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleTestConnection = async () => {
    if (!url.trim() || !anonKey.trim()) {
      setTestResult({
        success: false,
        message: 'Por favor, informe a URL do projeto e a chave Anon para realizar o teste de conexão.'
      });
      return;
    }

    if (keyAnalysis.isSecret) {
      setTestResult({
        success: false,
        message: '🚨 Você inseriu a Chave Secreta ("service_role"). O Supabase proíbe o uso de chaves secretas no navegador ("Forbidden use of secret API key in browser"). Acesse Project Settings > API no Supabase e copie a Chave Pública ("anon / publishable").'
      });
      return;
    }

    setTestingConnection(true);
    setTestResult(null);

    const res = await testSupabaseConnection(url.trim(), anonKey.trim());
    setTestingConnection(false);
    setTestResult(res);

    if (res.success) {
      updateSupabaseConfig({
        url: url.trim(),
        anonKey: anonKey.trim(),
        enabled: true,
        lastConnected: new Date().toLocaleString('pt-BR')
      });
    }
  };

  const handleCheckTables = async () => {
    const keyToUse = anonKey.trim();
    if (!url.trim() || !keyToUse) {
      setTestResult({
        success: false,
        message: 'Informe a URL e a Chave Pública (anon) antes de verificar as tabelas.'
      });
      return;
    }

    if (keyAnalysis.isSecret) {
      setTestResult({
        success: false,
        message: '🚨 A chave inserida é a chave secreta (service_role). O Supabase bloqueia requisições do navegador com chave secreta. Substitua pela chave pública (anon).'
      });
      return;
    }

    setCheckingTables(true);
    try {
      const results = await checkSupabaseTables(url.trim(), keyToUse);
      setTableStatuses(results);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Erro ao verificar tabelas: ${err.message}`
      });
    } finally {
      setCheckingTables(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3500);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([SUPABASE_SCHEMA_SQL], { type: 'text/sql' });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'bjj_flow_supabase_schema.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
  };

  const handleCopyDataSql = () => {
    const sql = generateDataMigrationSql({
      students,
      instructors,
      classes,
      attendance,
      graduations,
      payments,
      lessonPlans,
      techniques,
      allUsers,
      academySettings,
      evaluations
    });
    navigator.clipboard.writeText(sql);
    setCopiedDataSql(true);
    setTimeout(() => setCopiedDataSql(false), 3500);
  };

  const handleDownloadDataSql = () => {
    const sql = generateDataMigrationSql({
      students,
      instructors,
      classes,
      attendance,
      graduations,
      payments,
      lessonPlans,
      techniques,
      allUsers,
      academySettings,
      evaluations
    });
    const blob = new Blob([sql], { type: 'text/sql' });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'bjj_flow_dados_supabase.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
  };

  const handleMigrateData = async () => {
    if (!url.trim() || !anonKey.trim()) {
      setMigrationResult({
        success: false,
        errors: ['Configure e salve a URL e a Chave Pública (anon) do Supabase antes de migrar os dados.']
      });
      return;
    }

    if (keyAnalysis.isSecret) {
      setMigrationResult({
        success: false,
        errors: [
          '🚨 Chave Secreta ("service_role") detectada no campo Chave Pública!',
          'O Supabase bloqueia o uso de chaves secretas no navegador e gerou o erro "Forbidden use of secret API key in browser".',
          '👉 Como resolver: No seu Supabase Dashboard, acesse Project Settings > API > e copie a Chave com o rótulo "anon (public)" ou "publishable". Salve-a no campo Chave Pública (anon key) acima e tente novamente!'
        ]
      });
      return;
    }

    setMigratingData(true);
    setMigrationResult(null);
    try {
      const res = await syncDataWithSupabase();
      setMigrationResult(res);
      if (res.success) {
        // Re-check tables to show updated counts
        handleCheckTables();
      }
    } catch (err: any) {
      setMigrationResult({
        success: false,
        errors: [err.message || 'Erro durante a migração.']
      });
    } finally {
      setMigratingData(false);
    }
  };

  const handlePullData = async () => {
    setPullingData(true);
    setPullResult(null);
    try {
      const res = await pullDataFromSupabaseContext();
      if (res.success) {
        setPullResult({
          success: true,
          message: 'Dados importados do Supabase com sucesso para o aplicativo!'
        });
      } else {
        setPullResult({
          success: false,
          message: res.error || 'Erro ao importar dados do Supabase.'
        });
      }
    } catch (err: any) {
      setPullResult({
        success: false,
        message: err.message || 'Erro ao importar dados.'
      });
    } finally {
      setPullingData(false);
    }
  };

  const tablesCreatedCount = tableStatuses ? tableStatuses.filter(t => t.exists).length : 0;
  const isConnected = !!supabaseConfig.lastConnected && !!supabaseConfig.url;

  return (
    <div className="space-y-6">
      {/* Overview Status Banner */}
      <div className={`p-6 rounded-2xl border transition-all ${
        isConnected 
          ? 'bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-500/30' 
          : 'bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-transparent border-blue-500/30'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isConnected ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
            }`}>
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  Integração & Gerenciamento Supabase
                </h2>
                {isConnected ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Conectado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    Não Conectado
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Conecte sua conta do Supabase (PostgreSQL) para criar tabelas, gerenciar esquemas relacionais e persistir com segurança alunos, turmas, presenças e finanças.
              </p>
              {projectRef && (
                <div className="mt-2 flex items-center gap-2 text-xs font-mono text-slate-600 bg-white/70 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-slate-200/80 w-fit">
                  <Server className="w-3.5 h-3.5 text-blue-600" />
                  <span>Projeto ID: <strong className="text-slate-900">{projectRef}</strong></span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            {projectRef && (
              <a
                href={`https://supabase.com/dashboard/project/${projectRef}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-bold px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-2xs transition-all"
              >
                <ExternalLink className="w-4 h-4 text-emerald-600" />
                Painel do Supabase
              </a>
            )}
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testingConnection}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${testingConnection ? 'animate-spin' : ''}`} />
              {testingConnection ? 'Testando...' : 'Testar Conexão'}
            </button>
          </div>
        </div>

        {/* Test Result Message */}
        {testResult && (
          <div className={`mt-4 p-3.5 rounded-xl border text-xs font-medium flex items-center gap-3 animate-fade-in ${
            testResult.success 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {testResult.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <div className="flex-1">
              <span>{testResult.message}</span>
            </div>
          </div>
        )}

        {savedSuccess && (
          <div className="mt-4 p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Credenciais do Supabase salvas com sucesso no sistema!</span>
          </div>
        )}
      </div>

      {/* Form Credentials Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base text-slate-900">
              1. Credenciais de Conexão do seu Supabase
            </h3>
          </div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded-lg">
            Sua Conta Supabase
          </span>
        </div>

        <form onSubmit={handleSaveCredentials} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              URL do Projeto Supabase (Project URL) *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://exemplo-id.supabase.co"
                className="w-full border border-slate-300 rounded-xl p-2.5 pl-9 font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Encontrada no seu dashboard em: <em>Project Settings &gt; API &gt; Project URL</em>.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span>Chave Pública Anon (anon / public key) *</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Obrigatória para o Navegador
                  </span>
                </label>
                {keyAnalysis.type === 'anon' && (
                  <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Chave Pública válida
                  </span>
                )}
                {keyAnalysis.type === 'service_role' && (
                  <span className="text-[11px] text-rose-600 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Chave Secreta detectada!
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showAnonKey ? 'text' : 'password'}
                  required
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... ou sb_publishable_..."
                  className={`w-full border rounded-xl p-2.5 pr-9 font-mono text-slate-900 transition-all ${
                    keyAnalysis.type === 'service_role' 
                      ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-500 focus:border-rose-500' 
                      : keyAnalysis.type === 'anon'
                      ? 'border-emerald-400 bg-emerald-50/20 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                      : 'border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowAnonKey(!showAnonKey)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showAnonKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Dynamic feedback on anonKey */}
              {keyAnalysis.type === 'service_role' && (
                <div className="mt-2 p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-900 space-y-1 animate-fade-in">
                  <div className="font-bold flex items-center gap-1.5 text-rose-700">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>ATENÇÃO: Você colou a Chave Secreta (service_role)!</span>
                  </div>
                  <p className="text-[11px] text-rose-800 leading-relaxed">
                    O Supabase <strong>proíbe o uso de chaves secretas no navegador</strong> por motivos de segurança, gerando o erro <code className="bg-rose-100 font-mono px-1 py-0.5 rounded font-bold">"Forbidden use of secret API key in browser"</code>.
                  </p>
                  <p className="text-[11px] font-semibold text-rose-900 pt-0.5">
                    👉 <strong>Como resolver:</strong> No Supabase Dashboard, vá em <strong>Project Settings &gt; API</strong> e copie a chave identificada como <strong>anon (public)</strong> ou <strong>publishable</strong>. Cole-a neste campo e clique em Salvar Credenciais.
                  </p>
                </div>
              )}

              {keyAnalysis.type === 'anon' && (
                <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Chave Pública correta! Pode ser usada no navegador para carregar e salvar dados.
                </p>
              )}

              {keyAnalysis.type !== 'service_role' && keyAnalysis.type !== 'anon' && (
                <p className="text-[11px] text-slate-400 mt-1">
                  Encontrada no Supabase Dashboard em: <em>Project Settings &gt; API &gt; Project API keys &gt; anon / public</em>.
                </p>
              )}
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Arquitetura de Segurança & Chaves de API</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                O aplicativo utiliza exclusivamente a <strong>Chave Pública Anon (publishable)</strong> no cliente. Chaves de serviço (<code className="font-mono text-slate-700">service_role</code>) e credenciais de banco são estritamente proibidas no navegador para proteger os dados da academia contra exposição.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="font-bold text-slate-800 text-xs">
                  Ativar uso do Supabase como banco de dados principal
                </span>
              </label>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Salvar Credenciais
              </button>
            </div>
          </div>
        </form>

        {/* Quick Instructions Accordion / Help */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Como obter suas chaves em 1 minuto no Supabase:
          </div>
          <ol className="list-decimal list-inside text-slate-600 space-y-1 pl-1 text-[11px]">
            <li>Acesse seu painel no <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold underline">Supabase Dashboard</a> e abra seu projeto.</li>
            <li>No menu lateral esquerdo, clique no ícone de <strong>Engrenagem (Project Settings)</strong> e selecione <strong>API</strong>.</li>
            <li>Copie a <strong>Project URL</strong>, a chave <strong>anon / public</strong> e, se desejar, a <strong>service_role</strong>.</li>
          </ol>
        </div>
      </div>

      {/* Tables Management Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <TableProperties className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="font-bold text-base text-slate-900">
                2. Criação & Gerenciamento das Tabelas no Supabase
              </h3>
              <p className="text-xs text-slate-500">
                10 tabelas relacionais prontas para gerenciar todo o ecossistema da academia.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCheckTables}
              disabled={checkingTables || !url.trim()}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checkingTables ? 'animate-spin' : ''}`} />
              {checkingTables ? 'Verificando...' : 'Verificar Tabelas no Banco'}
            </button>
          </div>
        </div>

        {/* Tables Status Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">
              Estrutura de Tabelas Oficiais:
            </span>
            {tableStatuses && (
              <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                tablesCreatedCount === REQUIRED_SUPABASE_TABLES.length 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {tablesCreatedCount} de {REQUIRED_SUPABASE_TABLES.length} tabelas encontradas
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {REQUIRED_SUPABASE_TABLES.map((t) => {
              const status = tableStatuses?.find(s => s.name === t.name);
              const exists = status?.exists;

              return (
                <div 
                  key={t.name}
                  className={`p-3 rounded-xl border text-xs transition-all ${
                    status 
                      ? exists 
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' 
                        : 'bg-rose-50/60 border-rose-200 text-rose-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono font-bold">
                    <span className="text-[11px] truncate">{t.name}</span>
                    {status && (
                      exists ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      )
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5" title={t.label}>
                    {t.label}
                  </p>
                  {status && (
                    <div className="mt-1 text-[10px] font-semibold">
                      {exists ? (
                        <span className="text-emerald-700">{status.count} registros</span>
                      ) : (
                        <span className="text-rose-600">Não criada</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 1-Click SQL Script Generator & Runner */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
                <Terminal className="w-4 h-4" />
                Script SQL de Criação Instantânea
              </div>
              <h4 className="text-base font-extrabold text-white">
                Como Criar Todas as Tabelas no seu Supabase
              </h4>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                O script oficial cria as 10 tabelas, políticas de segurança Row Level Security (RLS), índices de velocidade e cadastra seu usuário como <strong>Administrador Master</strong> (Thiago Lopes de Moraes Silva).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopySql}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  copiedSql 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-white text-slate-900 hover:bg-slate-100 shadow-sm'
                }`}
              >
                {copiedSql ? (
                  <>
                    <CheckCheck className="w-4 h-4" />
                    Copiado com Sucesso!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-indigo-600" />
                    Copiar Script SQL (1 Clique)
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadSql}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
              >
                <FileCode className="w-4 h-4 text-indigo-300" />
                Baixar .sql
              </button>

              {projectRef && (
                <a
                  href={`https://supabase.com/dashboard/project/${projectRef}/sql/new`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  Abrir SQL Editor no Supabase
                </a>
              )}
            </div>
          </div>

          {/* 3 Step Guide */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <div className="font-extrabold text-indigo-300 mb-1 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[11px]">1</span>
                Copie o Script
              </div>
              <p className="text-[11px] text-slate-300">
                Clique no botão "Copiar Script SQL" acima para copiar o código DDL completo.
              </p>
            </div>

            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <div className="font-extrabold text-indigo-300 mb-1 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[11px]">2</span>
                Abra o SQL Editor
              </div>
              <p className="text-[11px] text-slate-300">
                {projectRef ? (
                  <span>Clique em "Abrir SQL Editor no Supabase" para ir direto para o seu projeto.</span>
                ) : (
                  <span>Acesse o SQL Editor no seu dashboard do Supabase (ícone <strong>SQL</strong> na barra lateral).</span>
                )}
              </p>
            </div>

            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <div className="font-extrabold text-emerald-300 mb-1 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[11px]">3</span>
                Cole e Clique em RUN
              </div>
              <p className="text-[11px] text-slate-300">
                Cole no editor e clique no botão verde <strong>RUN</strong>. Em 3 segundos todas as tabelas estarão prontas!
              </p>
            </div>
          </div>

          {/* Collapsible SQL Preview */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowSqlPreview(!showSqlPreview)}
              className="text-indigo-300 hover:text-indigo-200 text-xs font-bold flex items-center gap-1.5"
            >
              <FileCode className="w-3.5 h-3.5" />
              {showSqlPreview ? 'Ocultar pré-visualização do código SQL' : 'Visualizar código SQL completo aqui'}
            </button>

            {showSqlPreview && (
              <div className="mt-3 relative bg-slate-950 rounded-xl p-4 border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-72">
                <pre>{SUPABASE_SCHEMA_SQL}</pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Data Migration & Synchronization Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-base text-slate-900">
              3. Sincronização & Migração de Dados
            </h3>
          </div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded-lg">
            Migração Bidirecional
          </span>
        </div>

        <p className="text-xs text-slate-600">
          Você pode enviar todos os alunos, professores, turmas, presenças e finanças cadastrados na aplicação diretamente para as tabelas criadas no seu banco Supabase, ou carregar os dados existentes na nuvem.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Export / Push to Supabase */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
              <UploadCloud className="w-4 h-4 text-emerald-600" />
              Migrar Dados Locais &gt; Supabase
            </div>
            <p className="text-[11px] text-slate-500">
              Envia todos os alunos, treinos, presenças, planos de aula e técnicas atuais para as respectivas tabelas da sua conta Supabase.
            </p>
            <button
              type="button"
              onClick={handleMigrateData}
              disabled={migratingData || !url.trim()}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${migratingData ? 'animate-spin' : ''}`} />
              {migratingData ? 'Migrando registros...' : 'Migrar Todos os Dados para o Supabase'}
            </button>
          </div>

          {/* Import / Pull from Supabase */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
              <DownloadCloud className="w-4 h-4 text-blue-600" />
              Baixar do Supabase &gt; Aplicativo
            </div>
            <p className="text-[11px] text-slate-500">
              Carrega os dados existentes no seu banco Supabase e atualiza o estado local do aplicativo em tempo real.
            </p>
            <button
              type="button"
              onClick={handlePullData}
              disabled={pullingData || !url.trim()}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${pullingData ? 'animate-spin' : ''}`} />
              {pullingData ? 'Importando registros...' : 'Importar Dados do Supabase'}
            </button>
          </div>
        </div>

        {/* Alternative: Instant SQL Data Insertion Script */}
        <div className="mt-4 p-4 rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/60 via-purple-50/30 to-white space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Alternativa Rápida: Migrar via Script SQL no Supabase</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                100% Confiável
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyDataSql}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
              >
                {copiedDataSql ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedDataSql ? 'SQL dos Dados Copiado!' : 'Copiar SQL dos Dados (INSERTs)'}
              </button>
              <button
                type="button"
                onClick={handleDownloadDataSql}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg text-xs font-medium transition-all"
                title="Baixar arquivo .sql com todos os dados"
              >
                <DownloadCloud className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Baixar .sql</span>
              </button>
            </div>
          </div>
          <p className="text-[11px] text-slate-600">
            Gera comandos <code className="bg-white px-1 py-0.5 rounded font-mono text-indigo-700 font-bold">INSERT ... ON CONFLICT</code> com todos os alunos, professores, turmas, presenças, planos de aula e técnicas atuais. Você pode colar direto no <strong>SQL Editor</strong> do Supabase e executar com 1 clique, sem depender de políticas de chave no navegador.
          </p>

          <div>
            <button
              type="button"
              onClick={() => setShowDataSqlPreview(!showDataSqlPreview)}
              className="text-indigo-600 hover:text-indigo-700 text-[11px] font-bold flex items-center gap-1"
            >
              <FileCode className="w-3.5 h-3.5" />
              {showDataSqlPreview ? 'Ocultar pré-visualização do script SQL de dados' : 'Pré-visualizar código SQL dos dados'}
            </button>

            {showDataSqlPreview && (
              <div className="mt-2 relative bg-slate-950 rounded-xl p-3 border border-slate-800 text-[10px] font-mono text-emerald-400 overflow-x-auto max-h-56">
                <pre>{generateDataMigrationSql({
                  students,
                  instructors,
                  classes,
                  attendance,
                  graduations,
                  payments,
                  lessonPlans,
                  techniques,
                  allUsers,
                  academySettings
                })}</pre>
              </div>
            )}
          </div>
        </div>

        {/* Migration Result Report */}
        {migrationResult && (
          <div className={`p-4 rounded-xl border text-xs space-y-3 animate-fade-in ${
            migrationResult.success 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            <div className="flex items-center gap-2 font-bold">
              {migrationResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              )}
              <span>
                {migrationResult.success 
                  ? 'Migração para o Supabase concluída com êxito!' 
                  : 'Falha ou avisos durante a migração:'}
              </span>
            </div>

            {migrationResult.details && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
                {Object.entries(migrationResult.details).map(([t, count]) => (
                  <div key={t} className="bg-white/70 p-1.5 rounded border border-emerald-100 font-mono">
                    <strong>{t}:</strong> {count} registros
                  </div>
                ))}
              </div>
            )}

            {migrationResult.errors && migrationResult.errors.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="space-y-1 text-[11px] text-rose-700 font-mono bg-white/60 p-2.5 rounded-lg border border-rose-100">
                  {migrationResult.errors.map((e, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{e}</span>
                    </div>
                  ))}
                </div>

                {/* Friendly Troubleshooting Box */}
                <div className="p-3 bg-white rounded-lg border border-rose-200 text-xs text-slate-800 space-y-1.5">
                  <div className="font-bold text-rose-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-rose-600" />
                    Como resolver este problema em 2 passos rápidos:
                  </div>
                  <ol className="list-decimal list-inside text-[11px] text-slate-700 space-y-1 pl-1">
                    <li>
                      <strong>Se o erro for "Forbidden use of secret API key in browser":</strong> Vá no seu painel Supabase &gt; Project Settings &gt; API e copie a <strong>Chave Pública (anon / publishable)</strong>. Substitua no campo de Chave Pública acima e salve.
                    </li>
                    <li>
                      <strong>Se preferir não usar chave no navegador:</strong> Clique no botão roxo <strong>"Copiar SQL dos Dados (INSERTs)"</strong> acima, abra o SQL Editor do seu Supabase e clique em <strong>RUN</strong>. Todos os dados serão gravados imediatamente!
                    </li>
                  </ol>
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyDataSql}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <Copy className="w-3 h-3" />
                      {copiedDataSql ? 'SQL Copiado!' : 'Copiar SQL dos Dados Agora'}
                    </button>
                    {projectRef && (
                      <a
                        href={`https://supabase.com/dashboard/project/${projectRef}/sql/new`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Abrir SQL Editor no Supabase
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pull Result Report */}
        {pullResult && (
          <div className={`p-4 rounded-xl border text-xs flex items-center gap-2 animate-fade-in ${
            pullResult.success 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            {pullResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{pullResult.message}</span>
          </div>
        )}

        {supabaseConfig.lastSync && (
          <div className="text-[11px] text-slate-400 text-right">
            Última sincronização registrada: <strong>{supabaseConfig.lastSync}</strong>
          </div>
        )}
      </div>

      {/* 4. CSV Bulk Feeder Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                4. Alimentação em Lote via CSV (App & Supabase)
              </h3>
              <p className="text-xs text-slate-500">
                Alimente o banco com dados de planilhas CSV com preenchimento inteligente e marcação "informar" para campos faltantes.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/60 self-start sm:self-auto">
            Regra "Informar" Ativa
          </span>
        </div>

        {/* Rule explanation banner */}
        <div className="p-4 bg-gradient-to-r from-blue-50 via-indigo-50/50 to-slate-50 rounded-xl border border-blue-200 text-xs text-slate-700 space-y-1.5">
          <div className="font-bold text-blue-950 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Tratamento de Dados Faltantes Conforme Sua Solicitação:
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            • <strong>Preenchimento automático inteligente:</strong> Campos padrão de BJJ (como faixa inicial <span className="text-slate-900 font-semibold">"branca"</span>, 0 graus, plano regular R$ 180, professor vinculado) são calculados automaticamente quando não preenchidos.<br />
            • <strong>Campos sem valor:</strong> Dados como telefone, tamanho de kimono, observações ou chave PIX não informados no CSV são gravados com o texto <span className="font-mono font-bold text-amber-700 bg-amber-100 px-1 py-0.5 rounded">"informar"</span> para fácil identificação e atualização posterior.
          </p>
        </div>

        {/* Buttons for each entity */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
          <button
            type="button"
            onClick={() => setCsvModalType('students')}
            className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 text-center transition-all group flex flex-col items-center gap-2"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-800">Alunos</div>
            <span className="text-[10px] text-slate-500">Importar CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setCsvModalType('professors')}
            className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 text-center transition-all group flex flex-col items-center gap-2"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <UserRound className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-800">Professores</div>
            <span className="text-[10px] text-slate-500">Importar CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setCsvModalType('classes')}
            className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 text-center transition-all group flex flex-col items-center gap-2"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-800">Turmas</div>
            <span className="text-[10px] text-slate-500">Importar CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setCsvModalType('techniques')}
            className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 text-center transition-all group flex flex-col items-center gap-2"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-800">Técnicas</div>
            <span className="text-[10px] text-slate-500">Importar CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setCsvModalType('attendance')}
            className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 text-center transition-all group flex flex-col items-center gap-2"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-800">Presenças</div>
            <span className="text-[10px] text-slate-500">Importar CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setCsvModalType('payments')}
            className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 text-center transition-all group flex flex-col items-center gap-2"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-800">Pagamentos</div>
            <span className="text-[10px] text-slate-500">Importar CSV</span>
          </button>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Ao concluir a importação pelo modal, você pode clicar em <strong>"⚡ Sincronizar com Supabase Agora"</strong> para gravar tudo na nuvem instantaneamente!
            </span>
          </div>
          <button
            type="button"
            onClick={() => setCsvModalType('students')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs whitespace-nowrap transition-all shadow-xs"
          >
            Abrir Importador CSV
          </button>
        </div>
      </div>

      {/* Render Universal CSV Modal */}
      {csvModalType && (
        <BatchUploadModal
          type={csvModalType}
          onClose={() => {
            setCsvModalType(null);
            handleCheckTables();
          }}
          onSuccess={() => {
            handleCheckTables();
          }}
        />
      )}
    </div>
  );
};
