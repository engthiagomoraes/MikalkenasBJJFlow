import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  Student, 
  Instructor, 
  ClassSchedule, 
  AttendanceRecord, 
  GraduationHistory, 
  PaymentRecord, 
  LessonPlan, 
  Technique, 
  AuthUser, 
  AcademySettings,
  SupabaseConfig, 
  SupabaseTableStatus,
  BeltColor,
  PlanType,
  PaymentStatus,
  GraduationSystemType,
  StudentEvaluation,
  UserRole,
  UserPermissions,
  UserRegistrationData,
  DEFAULT_MASTER_PERMISSIONS,
  DEFAULT_ADMIN_PERMISSIONS,
  DEFAULT_PROFESSOR_PERMISSIONS,
  DEFAULT_STUDENT_PERMISSIONS
} from '../types';

export const REQUIRED_SUPABASE_TABLES = [
  { name: 'alunos', label: 'Alunos & Matrículas', description: 'Dados cadastrais, faixas, graus e histórico de presenças' },
  { name: 'professores', label: 'Professores & Mestre', description: 'Corpo docente, registros CBJJ, bios e horários' },
  { name: 'turmas', label: 'Turmas & Horários', description: 'Grade horária semanal, tatames e categorias' },
  { name: 'presencas', label: 'Frequência & Presenças', description: 'Check-ins diários e registros de treinos' },
  { name: 'graduacoes', label: 'Histórico de Graduações', description: 'Trocas de faixa e promoções de graus com histórico' },
  { name: 'pagamentos', label: 'Financeiro & Mensalidades', description: 'Cobranças, pagamentos e métodos (PIX, Dinheiro, etc.)' },
  { name: 'planos_aula', label: 'Planejamento de Aulas', description: 'Planos pedagógicos, temas técnicos e blocos de treino' },
  { name: 'tecnicas', label: 'Biblioteca de Técnicas', description: 'Acervo de posições, quedas, raspagens e finalizações' },
  { name: 'usuarios', label: 'Usuários & Permissões', description: 'Contas de acesso, administrador master e privilégios' },
  { name: 'configuracoes_academia', label: 'Configurações da Academia', description: 'Regras da IBJJF, dados do dojo e parâmetros globais' },
  { name: 'avaliacoes_desenvolvimento', label: 'Avaliações de Desenvolvimento', description: 'Diagnósticos pedagógicos das 6 dimensões e histórico de evolução dos alunos' }
];

export const SUPABASE_SCHEMA_SQL = `-- ==============================================================================
-- SISTEMA MIKALKENAS JIU JITSU - SCRIPT DE CRIAÇÃO E MIGRAÇÃO DO BANCO DE DADOS SUPABASE
-- Execute este script no SQL Editor do seu projeto Supabase:
-- https://supabase.com/dashboard/project/_/sql/new
-- ==============================================================================

-- 1. EXTENSÕES ÚTEIS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELA DE ALUNOS
CREATE TABLE IF NOT EXISTS public.alunos (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    avatar TEXT,
    data_nascimento TEXT,
    data_inicio TEXT,
    faixa TEXT NOT NULL DEFAULT 'branca',
    graus INTEGER NOT NULL DEFAULT 0,
    data_ultima_graduacao TEXT,
    presencas_na_faixa INTEGER NOT NULL DEFAULT 0,
    presencas_meta_grau INTEGER NOT NULL DEFAULT 40,
    total_presencas_historico INTEGER NOT NULL DEFAULT 0,
    plano TEXT DEFAULT 'Mensal',
    valor_mensalidade NUMERIC DEFAULT 180.00,
    dia_vencimento INTEGER DEFAULT 10,
    status_pagamento TEXT DEFAULT 'em_dia',
    observacoes_medicas TEXT,
    tamanho_kimono TEXT DEFAULT 'A2',
    peso_kg NUMERIC DEFAULT 75,
    turma_preferida TEXT,
    performance JSONB DEFAULT '{}'::jsonb,
    professor_id TEXT,
    professor_nome TEXT,
    sistema_graduacao TEXT DEFAULT 'graus_e_faixas',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. TABELA DE PROFESSORES
CREATE TABLE IF NOT EXISTS public.professores (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    faixa TEXT NOT NULL,
    graus INTEGER NOT NULL DEFAULT 0,
    email TEXT,
    telefone TEXT,
    foto TEXT,
    registro_cbjj TEXT,
    bio TEXT,
    turmas JSONB DEFAULT '[]'::jsonb,
    chave_pix TEXT,
    banco TEXT,
    sistema_graduacao TEXT DEFAULT 'graus_e_faixas',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. TABELA DE TURMAS E HORÁRIOS
CREATE TABLE IF NOT EXISTS public.turmas (
    id TEXT PRIMARY KEY,
    titulo TEXT NOT NULL,
    dia_semana TEXT NOT NULL,
    horario TEXT NOT NULL,
    categoria TEXT,
    professor_id TEXT,
    professor_nome TEXT,
    sala TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. TABELA DE PRESENÇAS / FREQUÊNCIA
CREATE TABLE IF NOT EXISTS public.presencas (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    student_nome TEXT NOT NULL,
    student_faixa TEXT,
    student_graus INTEGER DEFAULT 0,
    turma_id TEXT NOT NULL,
    turma_titulo TEXT,
    data TEXT NOT NULL,
    horario TEXT,
    confirmado_por TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. TABELA DE HISTÓRICO DE GRADUAÇÕES
CREATE TABLE IF NOT EXISTS public.graduacoes (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    student_nome TEXT NOT NULL,
    faixa_anterior TEXT,
    graus_anteriores INTEGER DEFAULT 0,
    nova_faixa TEXT NOT NULL,
    novos_graus INTEGER NOT NULL DEFAULT 0,
    data TEXT NOT NULL,
    professor_avaliador TEXT,
    total_aulas_atingidas INTEGER DEFAULT 0,
    motivo_observacao TEXT,
    tipo_graduacao TEXT DEFAULT 'grau',
    sistema_utilizado TEXT DEFAULT 'graus_e_faixas',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. TABELA DE PAGAMENTOS / MENSALIDADES
CREATE TABLE IF NOT EXISTS public.pagamentos (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    student_nome TEXT NOT NULL,
    plano TEXT DEFAULT 'Mensal',
    mes_referencia TEXT,
    valor NUMERIC NOT NULL DEFAULT 0,
    valor_original NUMERIC DEFAULT 180,
    desconto NUMERIC DEFAULT 0,
    data_pagamento TEXT,
    data_vencimento TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente',
    metodo TEXT,
    comprovante TEXT,
    professor_id TEXT,
    professor_nome TEXT,
    chave_pix_professor TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. TABELA DE PLANOS DE AULA
CREATE TABLE IF NOT EXISTS public.planos_aula (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    semana_ciclo INTEGER DEFAULT 1,
    tema_principal TEXT,
    turma TEXT,
    professor TEXT,
    aquecimento TEXT,
    tecnica_principal TEXT,
    technique_ids JSONB DEFAULT '[]'::jsonb,
    tecnicas_nomes JSONB DEFAULT '[]'::jsonb,
    drill_repeticoes TEXT,
    treino_especifico_rola TEXT,
    observacoes TEXT,
    concluida BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. TABELA DE BIBLIOTECA DE TÉCNICAS
CREATE TABLE IF NOT EXISTS public.tecnicas (
    id TEXT PRIMARY KEY,
    titulo TEXT NOT NULL,
    categoria TEXT NOT NULL,
    subcategoria TEXT,
    faixa_minima TEXT NOT NULL DEFAULT 'branca',
    nivel TEXT NOT NULL DEFAULT 'Iniciante',
    tipo TEXT NOT NULL DEFAULT 'Gi',
    descricao TEXT,
    pontos_chave JSONB DEFAULT '[]'::jsonb,
    video_url TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. TABELA DE USUÁRIOS E CONTROLE DE ACESSO
CREATE TABLE IF NOT EXISTS public.usuarios (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'aluno',
    status TEXT NOT NULL DEFAULT 'pendente',
    telefone TEXT,
    faixa TEXT,
    graus INTEGER DEFAULT 0,
    is_master_admin BOOLEAN NOT NULL DEFAULT false,
    professor_id TEXT,
    student_id TEXT,
    permissions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Garantir que as colunas existam caso a tabela já tenha sido criada anteriormente
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pendente';
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS telefone TEXT;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'aluno';
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS is_master_admin BOOLEAN DEFAULT false;

-- 11. TABELA DE CONFIGURAÇÕES DA ACADEMIA
CREATE TABLE IF NOT EXISTS public.configuracoes_academia (
    id TEXT PRIMARY KEY DEFAULT 'settings_main',
    nome_academia TEXT NOT NULL DEFAULT 'Mikalkenas Jiu Jitsu',
    mestre_responsavel TEXT NOT NULL DEFAULT 'Thiago Lopes de Moraes Silva',
    faixa_mestre TEXT NOT NULL DEFAULT 'marrom',
    graus_mestre INTEGER NOT NULL DEFAULT 0,
    registro_cbjj_mestre TEXT DEFAULT 'CBJJ #48291',
    unidade_principal TEXT DEFAULT 'Matriz - Tatame Principal',
    telefone TEXT DEFAULT '(11) 98765-4321',
    email TEXT DEFAULT 'thiagomoraes.mail@gmail.com',
    chave_pix TEXT DEFAULT 'thiagomoraes.mail@gmail.com',
    banco TEXT DEFAULT 'Banco do Brasil',
    sistema_graduacao_padrao TEXT DEFAULT 'graus_e_faixas',
    aulas_por_grau INTEGER DEFAULT 40,
    aulas_por_faixa_direta INTEGER DEFAULT 160,
    valor_padrao_regular NUMERIC DEFAULT 180,
    valor_padrao_infantil NUMERIC DEFAULT 130,
    valor_padrao_bolsista NUMERIC DEFAULT 70,
    whatsapp_api_url TEXT,
    whatsapp_instance_id TEXT,
    whatsapp_phone_number TEXT,
    messaging_email TEXT,
    messaging_sender_name TEXT,
    regras_graduacao JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.configuracoes_academia
    ADD COLUMN IF NOT EXISTS whatsapp_api_url TEXT,
    ADD COLUMN IF NOT EXISTS whatsapp_instance_id TEXT,
    ADD COLUMN IF NOT EXISTS whatsapp_phone_number TEXT,
    ADD COLUMN IF NOT EXISTS messaging_email TEXT,
    ADD COLUMN IF NOT EXISTS messaging_sender_name TEXT;

-- 12. TABELA DE AVALIAÇÕES DE DESENVOLVIMENTO (HISTÓRICO PEDAGÓGICO)
CREATE TABLE IF NOT EXISTS public.avaliacoes_desenvolvimento (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES public.alunos(id) ON DELETE CASCADE,
    data TEXT NOT NULL,
    avaliador_id TEXT,
    avaliador_nome TEXT,
    scores JSONB NOT NULL DEFAULT '{}'::jsonb,
    observacoes TEXT,
    foco_desenvolvimento TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. ÍNDICES DE PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_alunos_faixa ON public.alunos(faixa);
CREATE INDEX IF NOT EXISTS idx_presencas_student ON public.presencas(student_id);
CREATE INDEX IF NOT EXISTS idx_presencas_data ON public.presencas(data);
CREATE INDEX IF NOT EXISTS idx_pagamentos_student ON public.pagamentos(student_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_status ON public.pagamentos(status);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON public.usuarios(email);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_student_id ON public.avaliacoes_desenvolvimento(student_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_data ON public.avaliacoes_desenvolvimento(data);

-- 14. POLÍTICAS DE PERMISSÃO E ROW LEVEL SECURITY (RLS)
-- Conceder permissões para a chave pública anon e para authenticated
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE 
  public.alunos, 
  public.professores, 
  public.turmas, 
  public.presencas,
  public.graduacoes, 
  public.pagamentos, 
  public.planos_aula, 
  public.tecnicas,
  public.usuarios, 
  public.configuracoes_academia, 
  public.avaliacoes_desenvolvimento 
TO anon, authenticated;

-- Habilitar RLS nas tabelas
ALTER TABLE public.alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.turmas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presencas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.graduacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planos_aula ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tecnicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracoes_academia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avaliacoes_desenvolvimento ENABLE ROW LEVEL SECURITY;

-- Limpar políticas antigas se existirem
DO $$
DECLARE policy_row RECORD;
BEGIN
  FOR policy_row IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('alunos', 'professores', 'turmas', 'presencas', 'graduacoes',
        'pagamentos', 'planos_aula', 'tecnicas', 'usuarios', 'configuracoes_academia',
        'avaliacoes_desenvolvimento')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', policy_row.policyname, policy_row.schemaname, policy_row.tablename);
  END LOOP;
END $$;

-- Políticas para acesso público/anon e autenticado (compatível com chave anon do app)
CREATE POLICY "anon_all_alunos" ON public.alunos FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_professores" ON public.professores FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_turmas" ON public.turmas FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_presencas" ON public.presencas FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_graduacoes" ON public.graduacoes FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_pagamentos" ON public.pagamentos FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_planos" ON public.planos_aula FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_tecnicas" ON public.tecnicas FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_config" ON public.configuracoes_academia FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_avaliacoes" ON public.avaliacoes_desenvolvimento FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Políticas da tabela usuarios:
-- 1. Permitir leitura para consulta de credenciais (email e password)
CREATE POLICY "usuarios_select_policy" ON public.usuarios FOR SELECT TO anon, authenticated USING (true);
-- 2. Permitir inserção para novos cadastros (solicitação pendente)
CREATE POLICY "usuarios_insert_policy" ON public.usuarios FOR INSERT TO anon, authenticated WITH CHECK (true);
-- 3. Permitir atualização para administradores aprovarem ou alterarem status
CREATE POLICY "usuarios_update_policy" ON public.usuarios FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
-- 4. Permitir exclusão se necessário
CREATE POLICY "usuarios_delete_policy" ON public.usuarios FOR DELETE TO anon, authenticated USING (true);

-- 15. FUNÇÃO E TRIGGER PARA GARANTIR VÍNCULO AUTOMÁTICO AO APROVAR USUÁRIO (IDEMPOTÊNCIA)
CREATE OR REPLACE FUNCTION public.fn_garantir_vinculo_usuario()
RETURNS TRIGGER AS $$
DECLARE
  v_prof_id TEXT;
  v_aluno_id TEXT;
BEGIN
  -- Dispara apenas quando o usuário é aprovado
  IF NEW.status = 'aprovado' AND (OLD.status IS NULL OR OLD.status != 'aprovado') THEN
    IF NEW.role = 'professor' THEN
      -- 1. Procura se já existe um professor com este ID ou e-mail
      SELECT id INTO v_prof_id FROM public.professores 
      WHERE (NEW.professor_id IS NOT NULL AND id = NEW.professor_id) 
         OR (email IS NOT NULL AND LOWER(email) = LOWER(NEW.email))
      LIMIT 1;

      -- 2. Se não existir, cria o cadastro correspondente em public.professores
      IF v_prof_id IS NULL THEN
        v_prof_id := COALESCE(NEW.professor_id, 'inst-' || extract(epoch from now())::bigint::text);
        INSERT INTO public.professores (id, nome, email, telefone, faixa, graus, sistema_graduacao)
        VALUES (v_prof_id, NEW.nome, NEW.email, NEW.telefone, COALESCE(NEW.faixa, 'preta'), COALESCE(NEW.graus, 0), 'graus_e_faixas')
        ON CONFLICT (id) DO NOTHING;
      END IF;

      NEW.professor_id := v_prof_id;

    ELSIF NEW.role = 'aluno' THEN
      -- 1. Procura se já existe um aluno com este ID ou e-mail
      SELECT id INTO v_aluno_id FROM public.alunos 
      WHERE (NEW.student_id IS NOT NULL AND id = NEW.student_id) 
         OR (email IS NOT NULL AND LOWER(email) = LOWER(NEW.email))
      LIMIT 1;

      -- 2. Se não existir, cria o cadastro correspondente em public.alunos
      IF v_aluno_id IS NULL THEN
        v_aluno_id := COALESCE(NEW.student_id, 'aluno-' || extract(epoch from now())::bigint::text);
        INSERT INTO public.alunos (id, nome, email, telefone, faixa, graus, data_inicio, plano, status_pagamento)
        VALUES (v_aluno_id, NEW.nome, NEW.email, NEW.telefone, COALESCE(NEW.faixa, 'branca'), COALESCE(NEW.graus, 0), to_char(now(), 'YYYY-MM-DD'), 'Mensal', 'em_dia')
        ON CONFLICT (id) DO NOTHING;
      END IF;

      NEW.student_id := v_aluno_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_garantir_vinculo_usuario ON public.usuarios;
CREATE TRIGGER trg_garantir_vinculo_usuario
BEFORE UPDATE ON public.usuarios
FOR EACH ROW
EXECUTE FUNCTION public.fn_garantir_vinculo_usuario();

-- 16. FUNÇÃO PROTEGIDA DE APROVAÇÃO (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.aprovar_usuario(p_user_id TEXT)
RETURNS jsonb AS $$
DECLARE
  v_user public.usuarios%ROWTYPE;
BEGIN
  UPDATE public.usuarios
  SET status = 'aprovado'
  WHERE id = p_user_id
  RETURNING * INTO v_user;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Usuário não encontrado');
  END IF;

  RETURN jsonb_build_object(
    'success', true, 
    'user_id', v_user.id, 
    'role', v_user.role, 
    'status', v_user.status,
    'professor_id', v_user.professor_id,
    'student_id', v_user.student_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==============================================================================
-- INSTRUÇÃO PARA CRIAR O PRIMEIRO ADMINISTRADOR DIRETAMENTE NO BANCO:
-- Como não há mais acesso master automático nem bypass de login, execute o SQL abaixo
-- no Supabase SQL Editor para criar o seu primeiro usuário administrador:
--
-- INSERT INTO public.usuarios (id, nome, email, password, role, status, is_master_admin)
-- VALUES (
--   'admin-inicial',
--   'Administrador Principal',
--   'admin@seu-dominio.com',
--   'SuaSenhaSegura@123',
--   'admin',
--   'aprovado',
--   true
-- )
-- ON CONFLICT (email) DO UPDATE 
-- SET password = EXCLUDED.password, status = 'aprovado', role = 'admin';
-- ==============================================================================
`;

export const DEFAULT_SUPABASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 'https://rryyqwoygfwutnbxjrta.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || 'sb_publishable_THjyHMmIulOzc9fRokYL4Q_uaS9zpG8';

export const DEFAULT_SUPABASE_CONFIG: SupabaseConfig = {
  url: DEFAULT_SUPABASE_URL,
  anonKey: DEFAULT_SUPABASE_ANON_KEY,
  enabled: true,
  autoSync: true,
  lastConnected: 'Conectado nativamente'
};

let cachedClient: SupabaseClient | null = null;
let cachedConfigKey = '';

export type SupabaseKeyType = 'anon' | 'service_role' | 'unknown' | 'empty';

export interface KeyAnalysis {
  type: SupabaseKeyType;
  isSecret: boolean;
  isAnon: boolean;
  message: string;
}

/**
 * Analisa a chave da API do Supabase para identificar se é uma chave anon (pública)
 * ou service_role (secreta). No navegador, o Supabase proíbe estritamente chaves secretas.
 */
export function analyzeSupabaseKey(key?: string): KeyAnalysis {
  if (!key || !key.trim()) {
    return {
      type: 'empty',
      isSecret: false,
      isAnon: false,
      message: 'Chave não informada'
    };
  }

  const clean = key.trim();

  // Chaves modernas do Supabase (2024+)
  if (clean.startsWith('sb_secret_')) {
    return {
      type: 'service_role',
      isSecret: true,
      isAnon: false,
      message: 'Chave Secreta detectada (sb_secret_). O Supabase proíbe o uso desta chave no navegador!'
    };
  }
  if (clean.startsWith('sb_publishable_')) {
    return {
      type: 'anon',
      isSecret: false,
      isAnon: true,
      message: 'Chave Pública Publishable válida para o navegador.'
    };
  }

  // Chaves em formato JWT (ey...)
  if (clean.startsWith('ey')) {
    try {
      const parts = clean.split('.');
      if (parts.length >= 2) {
        let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4 !== 0) {
          base64 += '=';
        }
        const jsonStr = atob(base64);
        const payload = JSON.parse(jsonStr);

        if (payload.role === 'service_role') {
          return {
            type: 'service_role',
            isSecret: true,
            isAnon: false,
            message: 'Chave Secreta detectada (service_role JWT). O Supabase proíbe o uso no navegador ("Forbidden use of secret API key in browser").'
          };
        }

        if (payload.role === 'anon') {
          return {
            type: 'anon',
            isSecret: false,
            isAnon: true,
            message: 'Chave Pública Anon (JWT) válida para o navegador.'
          };
        }
      }
    } catch {
      // Ignora erro de parsing
    }
  }

  return {
    type: 'unknown',
    isSecret: false,
    isAnon: false,
    message: 'Chave de API informada'
  };
}

export function isSecretApiKey(key?: string): boolean {
  return analyzeSupabaseKey(key).isSecret;
}

export function getSupabaseClient(config?: Partial<SupabaseConfig>): SupabaseClient | null {
  const cleanUrl = (config?.url || DEFAULT_SUPABASE_URL).trim().replace(/\/+$/, '');
  const keyToUse = (config?.anonKey || DEFAULT_SUPABASE_ANON_KEY).trim();

  if (!cleanUrl || !keyToUse) {
    return null;
  }

  if (isSecretApiKey(keyToUse)) {
    console.warn('Aviso: Chave secreta detectada no navegador. O Supabase bloqueia requisições com chave secreta por segurança.');
    return null;
  }

  const configKey = `${cleanUrl}_${keyToUse}`;

  if (cachedClient && cachedConfigKey === configKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(cleanUrl, keyToUse, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
    cachedConfigKey = configKey;
    return cachedClient;
  } catch (err) {
    console.error('Erro ao inicializar Supabase Client:', err);
    return null;
  }
}

export async function safeParseJsonResponse(response: Response): Promise<any> {
  try {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await response.json();
    }
  } catch {}
  return null;
}

async function loadUserProfile(_client: SupabaseClient, authUserId: string, authEmail?: string): Promise<AuthUser> {
  const token = localStorage.getItem('ternatio_bjj_auth_token') || localStorage.getItem('bjjflow_token');
  if (token) {
    try {
      const resp = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resp.ok) {
        const data = await safeParseJsonResponse(resp);
        if (data && data.success && data.user) {
          const isMaster = Boolean(data.user.is_master_admin || data.user.role === 'admin');
          return {
            id: data.user.id || authUserId,
            nome: data.user.nome || 'Usuário',
            email: data.user.email || authEmail || '',
            role: data.user.role as UserRole,
            isMasterAdmin: isMaster,
            professorId: data.user.professor_id || undefined,
            studentId: data.user.student_id || undefined,
            faixa: data.user.faixa || undefined,
            graus: data.user.graus || 0,
            status: data.user.status || 'ativo',
            permissions: data.user.permissions || undefined
          };
        }
      }
    } catch (err) {
      console.warn('Erro ao validar sessão via /api/auth/me:', err);
    }
  }

  throw new Error('Sessão expirada ou não autenticada no servidor.');
}

export async function loadAuthenticatedUserFromSupabase(client: SupabaseClient): Promise<AuthUser | null> {
  const token = localStorage.getItem('bjjflow_token');
  if (!token) return null;
  try {
    return await loadUserProfile(client, '', '');
  } catch {
    return null;
  }
}

export async function fetchPaymentsFromSupabase(config: SupabaseConfig): Promise<PaymentRecord[]> {
  const client = getSupabaseClient(config);
  if (!client) {
    throw new Error('Supabase indisponível. Verifique a URL e a chave pública (anon).');
  }

  const { data, error } = await client.from('pagamentos').select('*').order('data_vencimento', { ascending: false });
  if (error) {
    throw new Error(`Não foi possível carregar os pagamentos do Supabase: ${error.message}`);
  }

  return (data || []).map(row => ({
    id: row.id,
    studentId: row.student_id,
    studentNome: row.student_nome,
    plano: (row.plano as PlanType) || 'Mensal',
    mesReferencia: row.mes_referencia || '',
    valor: Number(row.valor ?? 0),
    valorOriginal: Number(row.valor_original ?? 180),
    desconto: Number(row.desconto ?? 0),
    dataVencimento: row.data_vencimento,
    dataPagamento: row.data_pagamento || undefined,
    status: (row.status as PaymentStatus) || 'pendente',
    metodo: row.metodo || undefined,
    comprovante: row.comprovante || undefined,
    professorId: row.professor_id || undefined,
    professorNome: row.professor_nome || undefined,
    chavePixProfessor: row.chave_pix_professor || undefined
  }));
}

export async function savePaymentToSupabase(config: SupabaseConfig, payment: PaymentRecord): Promise<void> {
  const client = getSupabaseClient(config);
  if (!client) {
    throw new Error('Supabase indisponível. Verifique a URL e a chave pública (anon).');
  }

  const { error } = await client.from('pagamentos').upsert({
    id: payment.id,
    student_id: payment.studentId,
    student_nome: payment.studentNome,
    plano: payment.plano,
    mes_referencia: payment.mesReferencia,
    valor: payment.valor,
    valor_original: payment.valorOriginal,
    desconto: payment.desconto,
    data_pagamento: payment.dataPagamento || null,
    data_vencimento: payment.dataVencimento,
    status: payment.status,
    metodo: payment.metodo || null,
    comprovante: payment.comprovante || null,
    professor_id: payment.professorId || null,
    professor_nome: payment.professorNome || null,
    chave_pix_professor: payment.chavePixProfessor || null
  }, { onConflict: 'id' });
  if (error) {
    throw new Error(`Não foi possível salvar o pagamento no Supabase: ${error.message}`);
  }
}

export function extractProjectRef(url: string): string {
  try {
    const clean = url.trim();
    const match = clean.match(/https?:\/\/([^.]+)\.supabase\.(?:co|in)/);
    return match ? match[1] : '';
  } catch {
    return '';
  }
}

export async function testSupabaseConnection(url: string, key: string): Promise<{ success: boolean; message: string; latencyMs?: number; keyAnalysis?: KeyAnalysis }> {
  const start = Date.now();
  const cleanUrl = url.trim().replace(/\/+$/, '');
  const cleanKey = key.trim();

  const keyAnalysis = analyzeSupabaseKey(cleanKey);
  if (keyAnalysis.isSecret) {
    return {
      success: false,
      message: '🚨 Você inseriu a Chave Secreta ("service_role"). O Supabase bloqueia o uso de chaves secretas no navegador por segurança ("Forbidden use of secret API key in browser"). Acesse Project Settings > API no Supabase e copie a Chave Pública ("anon / publishable").',
      keyAnalysis
    };
  }

  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    return { 
      success: false, 
      message: 'A URL do Supabase deve começar com https:// (ex: https://seu-projeto.supabase.co)',
      keyAnalysis
    };
  }

  if (cleanKey.length < 20) {
    return { 
      success: false, 
      message: 'Chave de API incompleta. Verifique a chave Anon pública no painel do Supabase.',
      keyAnalysis
    };
  }

  try {
    // Tenta primeiro o endpoint auth health que é rápido e não requer tabelas
    let resp: Response;
    try {
      resp = await fetch(`${cleanUrl}/auth/v1/health`, {
        method: 'GET',
        headers: { 'apikey': cleanKey }
      });
    } catch {
      // Fallback para rest root
      resp = await fetch(`${cleanUrl}/rest/v1/`, {
        method: 'GET',
        headers: {
          'apikey': cleanKey,
          'Authorization': `Bearer ${cleanKey}`
        }
      });
    }

    const latencyMs = Date.now() - start;

    if (resp.ok || resp.status === 200 || resp.status === 404) {
      return { 
        success: true, 
        message: `Conexão bem-sucedida com o Supabase! (Latência: ${latencyMs}ms)`, 
        latencyMs,
        keyAnalysis 
      };
    } else if (resp.status === 401) {
      return { 
        success: false, 
        message: 'Chave de autenticação rejeitada pelo Supabase (Erro 401). Verifique se copiou a chave Anon pública correta.', 
        latencyMs,
        keyAnalysis 
      };
    } else {
      return { 
        success: false, 
        message: `Supabase retornou status HTTP ${resp.status}: ${resp.statusText}`, 
        latencyMs,
        keyAnalysis 
      };
    }
  } catch (err: any) {
    return { 
      success: false, 
      message: `Não foi possível conectar: ${err.message || 'Verifique a URL e sua conexão com a internet.'}`,
      keyAnalysis 
    };
  }
}

export async function checkSupabaseTables(url: string, key: string): Promise<SupabaseTableStatus[]> {
  const cleanUrl = url.trim().replace(/\/+$/, '');
  const cleanKey = key.trim();

  const keyAnalysis = analyzeSupabaseKey(cleanKey);
  if (keyAnalysis.isSecret) {
    return REQUIRED_SUPABASE_TABLES.map(t => ({
      name: t.name,
      label: t.label,
      description: t.description,
      exists: false,
      count: 0,
      error: 'Chave Secreta detectada. O Supabase exige a Chave Pública (anon) no navegador.'
    }));
  }

  let client: SupabaseClient;
  try {
    client = createClient(cleanUrl, cleanKey, { auth: { persistSession: false } });
  } catch (err: any) {
    return REQUIRED_SUPABASE_TABLES.map(t => ({
      name: t.name,
      label: t.label,
      description: t.description,
      exists: false,
      count: 0,
      error: err.message
    }));
  }

  const results: SupabaseTableStatus[] = [];

  for (const table of REQUIRED_SUPABASE_TABLES) {
    try {
      const { count, error } = await client
        .from(table.name)
        .select('*', { count: 'exact', head: true });

      if (error) {
        const msg = error.message?.toLowerCase() || '';
        const doesNotExist = error.code === '42P01' || msg.includes('does not exist') || msg.includes('relation');
        results.push({
          name: table.name,
          label: table.label,
          description: table.description,
          exists: !doesNotExist && error.code !== 'PGRST205',
          count: 0,
          error: error.message
        });
      } else {
        results.push({
          name: table.name,
          label: table.label,
          description: table.description,
          exists: true,
          count: count ?? 0
        });
      }
    } catch (err: any) {
      results.push({
        name: table.name,
        label: table.label,
        description: table.description,
        exists: false,
        count: 0,
        error: err.message
      });
    }
  }

  return results;
}

export async function exportAllToSupabase(
  client: SupabaseClient,
  data: {
    students: Student[];
    instructors: Instructor[];
    classes: ClassSchedule[];
    attendance: AttendanceRecord[];
    graduations: GraduationHistory[];
    payments: PaymentRecord[];
    lessonPlans: LessonPlan[];
    techniques: Technique[];
    allUsers: AuthUser[];
    academySettings: AcademySettings;
    evaluations?: StudentEvaluation[];
  }
): Promise<{ success: boolean; details: Record<string, number>; errors: string[] }> {
  const details: Record<string, number> = {};
  const errors: string[] = [];

  const formatErrorMsg = (prefix: string, err: any): string => {
    const msg = err?.message || String(err);
    if (msg.includes('Forbidden use of secret API key in browser')) {
      return `${prefix}: Chave secreta bloqueada no navegador. Utilize a chave pública (anon) nas configurações.`;
    }
    if (msg.includes('42P01') || msg.toLowerCase().includes('does not exist') || msg.includes('PGRST205')) {
      return `${prefix}: Tabela não existe no seu Supabase. Execute o Script SQL no SQL Editor do Supabase primeiro.`;
    }
    return `${prefix}: ${msg}`;
  };

  // 1. Alunos
  try {
    const formattedStudents = data.students.map(s => ({
      id: s.id,
      nome: s.nome,
      email: s.email,
      telefone: s.telefone,
      avatar: s.avatar || null,
      data_nascimento: s.dataNascimento,
      data_inicio: s.dataInicio,
      faixa: s.faixa,
      graus: s.graus,
      data_ultima_graduacao: s.dataUltimaGraduacao,
      presencas_na_faixa: s.presencasNaFaixa,
      presencas_meta_grau: s.presencasMetaGrau,
      total_presencas_historico: s.totalPresencasHistorico,
      plano: s.plano,
      valor_mensalidade: s.valorMensalidade,
      dia_vencimento: s.diaVencimento,
      status_pagamento: s.statusPagamento,
      observacoes_medicas: s.observacoesMedicas || null,
      tamanho_kimono: s.tamanhoKimono,
      peso_kg: s.pesoKg,
      turma_preferida: s.turmaPreferida,
      performance: s.performance || {},
      professor_id: s.professorId || null,
      professor_nome: s.professorNome || null,
      sistema_graduacao: s.sistemaGraduacao || 'graus_e_faixas'
    }));

    const { error } = await client.from('alunos').upsert(formattedStudents, { onConflict: 'id' });
    if (error) throw error;
    details['alunos'] = formattedStudents.length;
  } catch (err: any) {
    errors.push(`Alunos: ${err.message}`);
  }

  // 2. Professores
  try {
    const formattedInstructors = data.instructors.map(i => ({
      id: i.id,
      nome: i.nome,
      faixa: i.faixa,
      graus: i.graus,
      email: i.email,
      telefone: i.telefone,
      foto: i.foto || null,
      registro_cbjj: i.registroCBJJ || null,
      bio: i.bio || null,
      turmas: i.turmas || [],
      chave_pix: i.chavePix || null,
      banco: i.banco || null,
      sistema_graduacao: i.sistemaGraduacao || 'graus_e_faixas'
    }));

    const { error } = await client.from('professores').upsert(formattedInstructors, { onConflict: 'id' });
    if (error) throw error;
    details['professores'] = formattedInstructors.length;
  } catch (err: any) {
    errors.push(`Professores: ${err.message}`);
  }

  // 3. Turmas
  try {
    const formattedClasses = data.classes.map(c => ({
      id: c.id,
      titulo: c.titulo,
      dia_semana: c.diaSemana,
      horario: c.horario,
      categoria: c.categoria,
      professor_id: c.professorId,
      professor_nome: c.professorNome,
      sala: c.sala
    }));

    const { error } = await client.from('turmas').upsert(formattedClasses, { onConflict: 'id' });
    if (error) throw error;
    details['turmas'] = formattedClasses.length;
  } catch (err: any) {
    errors.push(`Turmas: ${err.message}`);
  }

  // 4. Presenças
  try {
    const formattedAttendance = data.attendance.map(a => ({
      id: a.id,
      student_id: a.studentId,
      student_nome: a.studentNome,
      student_faixa: a.studentFaixa,
      student_graus: a.studentGraus,
      turma_id: a.turmaId,
      turma_titulo: a.turmaTitulo,
      data: a.data,
      horario: a.horario,
      confirmado_por: a.confirmadoPor
    }));

    const { error } = await client.from('presencas').upsert(formattedAttendance, { onConflict: 'id' });
    if (error) throw error;
    details['presencas'] = formattedAttendance.length;
  } catch (err: any) {
    errors.push(`Presenças: ${err.message}`);
  }

  // 5. Graduações
  try {
    const formattedGraduations = data.graduations.map(g => ({
      id: g.id,
      student_id: g.studentId,
      student_nome: g.studentNome,
      faixa_anterior: g.faixaAnterior,
      graus_anteriores: g.grausAnteriores,
      nova_faixa: g.novaFaixa,
      novos_graus: g.novosGraus,
      data: g.data,
      professor_avaliador: g.professorAvaliador,
      total_aulas_atingidas: g.totalAulasAtingidas,
      motivo_observacao: g.motivoObservacao,
      tipo_graduacao: g.tipoGraduacao || 'grau',
      sistema_utilizado: g.sistemaUtilizado || 'graus_e_faixas'
    }));

    const { error } = await client.from('graduacoes').upsert(formattedGraduations, { onConflict: 'id' });
    if (error) throw error;
    details['graduacoes'] = formattedGraduations.length;
  } catch (err: any) {
    errors.push(`Graduações: ${err.message}`);
  }

  // 6. Pagamentos
  try {
    const formattedPayments = data.payments.map(p => ({
      id: p.id,
      student_id: p.studentId,
      student_nome: p.studentNome,
      plano: p.plano,
      mes_referencia: p.mesReferencia,
      valor: p.valor,
      valor_original: p.valorOriginal,
      desconto: p.desconto,
      data_pagamento: p.dataPagamento || null,
      data_vencimento: p.dataVencimento,
      status: p.status,
      metodo: p.metodo || null,
      comprovante: p.comprovante || null,
      professor_id: p.professorId || null,
      professor_nome: p.professorNome || null,
      chave_pix_professor: p.chavePixProfessor || null
    }));

    const { error } = await client.from('pagamentos').upsert(formattedPayments, { onConflict: 'id' });
    if (error) throw error;
    details['pagamentos'] = formattedPayments.length;
  } catch (err: any) {
    errors.push(`Pagamentos: ${err.message}`);
  }

  // 7. Planos de Aula
  try {
    const formattedPlans = data.lessonPlans.map(lp => ({
      id: lp.id,
      data: lp.data,
      semana_ciclo: lp.semanaCiclo,
      tema_principal: lp.temaPrincipal,
      turma: lp.turma,
      professor: lp.professor,
      aquecimento: lp.aquecimento,
      tecnica_principal: lp.tecnicaPrincipal,
      technique_ids: lp.techniqueIds || [],
      tecnicas_nomes: lp.tecnicasNomes || [],
      drill_repeticoes: lp.drillRepeticoes,
      treino_especifico_rola: lp.treinoEspecificoRola,
      observacoes: lp.observacoes,
      concluida: lp.concluida
    }));

    const { error } = await client.from('planos_aula').upsert(formattedPlans, { onConflict: 'id' });
    if (error) throw error;
    details['planos_aula'] = formattedPlans.length;
  } catch (err: any) {
    errors.push(`Planos de Aula: ${err.message}`);
  }

  // 8. Técnicas
  try {
    const formattedTechs = data.techniques.map(t => ({
      id: t.id,
      titulo: t.titulo,
      categoria: t.categoria,
      subcategoria: t.subcategoria || null,
      faixa_minima: t.faixaMinima,
      nivel: t.nivel,
      tipo: t.tipo,
      descricao: t.descricao,
      pontos_chave: t.pontosChave || [],
      video_url: t.videoUrl || null,
      tags: t.tags || []
    }));

    const { error } = await client.from('tecnicas').upsert(formattedTechs, { onConflict: 'id' });
    if (error) throw error;
    details['tecnicas'] = formattedTechs.length;
  } catch (err: any) {
    errors.push(`Técnicas: ${err.message}`);
  }

  // 9. Usuários
  // 9. Usuários (Desativada exportação direta pelo navegador para a tabela public.usuarios)
  // Contas e permissões são geridas exclusivamente por rotas de servidor protegidas (/api/users)
  details['usuarios'] = 0;

  // 10. Configurações da Academia
  try {
    const s = data.academySettings;
    const formattedSettings = {
      id: 'settings_main',
      nome_academia: s.nomeAcademia,
      mestre_responsavel: s.mestreResponsavel,
      faixa_mestre: s.faixaMestre,
      graus_mestre: s.grausMestre,
      registro_cbjj_mestre: s.registroCBJJMestre || null,
      unidade_principal: s.unidadePrincipal || null,
      telefone: s.telefone || null,
      email: s.email || null,
      chave_pix: s.chavePix || null,
      banco: s.banco || null,
      whatsapp_api_url: s.whatsappApiUrl || null,
      whatsapp_instance_id: s.whatsappInstanceId || null,
      whatsapp_phone_number: s.whatsappPhoneNumber || null,
      messaging_email: s.messagingEmail || null,
      messaging_sender_name: s.messagingSenderName || null,
      sistema_graduacao_padrao: s.sistemaGraduacaoPadrao || 'graus_e_faixas',
      aulas_por_grau: s.aulasPorGrau,
      aulas_por_faixa_direta: s.aulasPorFaixaDireta,
      valor_padrao_regular: s.valorPadraoRegular,
      valor_padrao_infantil: s.valorPadraoInfantil,
      valor_padrao_bolsista: s.valorPadraoBolsista,
      regras_graduacao: s.regrasGraduacao || {}
    };

    const { error } = await client.from('configuracoes_academia').upsert(formattedSettings, { onConflict: 'id' });
    if (error) throw error;
    details['configuracoes_academia'] = 1;
  } catch (err: any) {
    errors.push(`Configurações: ${err.message}`);
  }

  // 11. Avaliações de Desenvolvimento (Histórico Pedagógico)
  if (data.evaluations && data.evaluations.length > 0) {
    try {
      const formattedEvals = data.evaluations.map(ev => ({
        id: ev.id,
        student_id: ev.studentId,
        data: ev.data,
        avaliador_id: ev.avaliadorId || null,
        avaliador_nome: ev.avaliadorNome || null,
        scores: ev.scores || {},
        observacoes: ev.observacoes || null,
        foco_desenvolvimento: ev.focoDesenvolvimento || null,
        created_at: ev.createdAt,
        updated_at: ev.updatedAt
      }));

      const { error } = await client.from('avaliacoes_desenvolvimento').upsert(formattedEvals, { onConflict: 'id' });
      if (error) throw error;
      details['avaliacoes_desenvolvimento'] = formattedEvals.length;
    } catch (err: any) {
      errors.push(`Avaliações: ${err.message}`);
    }
  }

  return {
    success: errors.length === 0,
    details,
    errors
  };
}

export async function importAllFromSupabase(
  client: SupabaseClient
): Promise<{
  students?: Student[];
  instructors?: Instructor[];
  classes?: ClassSchedule[];
  attendance?: AttendanceRecord[];
  graduations?: GraduationHistory[];
  payments?: PaymentRecord[];
  lessonPlans?: LessonPlan[];
  techniques?: Technique[];
  allUsers?: AuthUser[];
  academySettings?: Partial<AcademySettings>;
  evaluations?: StudentEvaluation[];
  error?: string;
}> {
  try {
    // 1. Alunos
    const { data: rawStudents } = await client.from('alunos').select('*');
    const students: Student[] = (rawStudents || []).map(r => ({
      id: r.id,
      nome: r.nome,
      email: r.email || '',
      telefone: r.telefone || '',
      avatar: r.avatar,
      dataNascimento: r.data_nascimento || '',
      dataInicio: r.data_inicio || '',
      faixa: (r.faixa as BeltColor) || 'branca',
      graus: r.graus || 0,
      dataUltimaGraduacao: r.data_ultima_graduacao || '',
      presencasNaFaixa: r.presencas_na_faixa || 0,
      presencasMetaGrau: r.presencas_meta_grau || 40,
      totalPresencasHistorico: r.total_presencas_historico || 0,
      plano: (r.plano as PlanType) || 'Mensal',
      valorMensalidade: Number(r.valor_mensalidade || 180),
      diaVencimento: Number(r.dia_vencimento || 10),
      statusPagamento: (r.status_pagamento as PaymentStatus) || 'em_dia',
      observacoesMedicas: r.observacoes_medicas,
      tamanhoKimono: r.tamanho_kimono || 'A2',
      pesoKg: Number(r.peso_kg || 75),
      turmaPreferida: r.turma_preferida || 'Geral',
      performance: r.performance || {
        guarda: 7,
        passagem: 7,
        quedas: 6,
        finalizacoes: 7,
        defesa: 7,
        disciplina: 9,
        tempoRolaMinutos: 120,
        finalizacoesAplicadas: 5,
        raspagensFeitas: 8
      },
      professorId: r.professor_id,
      professorNome: r.professor_nome,
      sistemaGraduacao: (r.sistema_graduacao as GraduationSystemType) || 'graus_e_faixas'
    }));

    // 2. Professores
    const { data: rawInstructors } = await client.from('professores').select('*');
    const instructors: Instructor[] = (rawInstructors || []).map(r => ({
      id: r.id,
      nome: r.nome,
      faixa: (r.faixa as BeltColor) || 'preta',
      graus: r.graus || 0,
      email: r.email || '',
      telefone: r.telefone || '',
      foto: r.foto,
      registroCBJJ: r.registro_cbjj || '',
      bio: r.bio || '',
      turmas: Array.isArray(r.turmas) ? r.turmas : [],
      chavePix: r.chave_pix || '',
      banco: r.banco || '',
      sistemaGraduacao: (r.sistema_graduacao as GraduationSystemType) || 'graus_e_faixas'
    }));

    // 3. Turmas
    const { data: rawClasses } = await client.from('turmas').select('*');
    const classes: ClassSchedule[] = (rawClasses || []).map(r => ({
      id: r.id,
      titulo: r.titulo,
      diaSemana: r.dia_semana,
      horario: r.horario,
      categoria: r.categoria,
      professorId: r.professor_id,
      professorNome: r.professor_nome,
      sala: r.sala
    }));

    // 4. Presenças
    const { data: rawAttendance } = await client.from('presencas').select('*');
    const attendance: AttendanceRecord[] = (rawAttendance || []).map(r => ({
      id: r.id,
      studentId: r.student_id,
      studentNome: r.student_nome,
      studentFaixa: (r.student_faixa as BeltColor) || 'branca',
      studentGraus: r.student_graus || 0,
      turmaId: r.turma_id,
      turmaTitulo: r.turma_titulo || '',
      data: r.data,
      horario: r.horario || '',
      confirmadoPor: r.confirmado_por || 'Sistema'
    }));

    // 5. Graduações
    const { data: rawGraduations } = await client.from('graduacoes').select('*');
    const graduations: GraduationHistory[] = (rawGraduations || []).map(r => ({
      id: r.id,
      studentId: r.student_id,
      studentNome: r.student_nome,
      faixaAnterior: (r.faixa_anterior as BeltColor) || 'branca',
      grausAnteriores: r.graus_anteriores || 0,
      novaFaixa: (r.nova_faixa as BeltColor) || 'azul',
      novosGraus: r.novos_graus || 0,
      data: r.data,
      professorAvaliador: r.professor_avaliador || '',
      totalAulasAtingidas: r.total_aulas_atingidas || 0,
      motivoObservacao: r.motivo_observacao || '',
      tipoGraduacao: r.tipo_graduacao || 'grau',
      sistemaUtilizado: (r.sistema_utilizado as GraduationSystemType) || 'graus_e_faixas'
    }));

    // 6. Pagamentos
    const { data: rawPayments } = await client.from('pagamentos').select('*');
    const payments: PaymentRecord[] = (rawPayments || []).map(r => ({
      id: r.id,
      studentId: r.student_id,
      studentNome: r.student_nome,
      plano: (r.plano as PlanType) || 'Mensal',
      mesReferencia: r.mes_referencia || '',
      valor: Number(r.valor || 0),
      valorOriginal: Number(r.valor_original || 180),
      desconto: Number(r.desconto || 0),
      dataVencimento: r.data_vencimento,
      dataPagamento: r.data_pagamento,
      status: (r.status as PaymentStatus) || 'pendente',
      metodo: r.metodo,
      comprovante: r.comprovante,
      professorId: r.professor_id,
      professorNome: r.professor_nome,
      chavePixProfessor: r.chave_pix_professor
    }));

    // 7. Planos de Aula
    const { data: rawPlans } = await client.from('planos_aula').select('*');
    const lessonPlans: LessonPlan[] = (rawPlans || []).map(r => ({
      id: r.id,
      data: r.data,
      semanaCiclo: r.semana_ciclo || 1,
      temaPrincipal: r.tema_principal || '',
      turma: r.turma || '',
      professor: r.professor || '',
      aquecimento: r.aquecimento || '',
      tecnicaPrincipal: r.tecnica_principal || '',
      techniqueIds: Array.isArray(r.technique_ids) ? r.technique_ids : [],
      tecnicasNomes: Array.isArray(r.tecnicas_nomes) ? r.tecnicas_nomes : [],
      drillRepeticoes: r.drill_repeticoes || '',
      treinoEspecificoRola: r.treino_especifico_rola || '',
      observacoes: r.observacoes || '',
      concluida: r.concluida ?? false
    }));

    // 8. Técnicas
    const { data: rawTechs } = await client.from('tecnicas').select('*');
    const techniques: Technique[] = (rawTechs || []).map(r => ({
      id: r.id,
      titulo: r.titulo,
      categoria: r.categoria,
      subcategoria: r.subcategoria,
      faixaMinima: (r.faixa_minima as BeltColor) || 'branca',
      nivel: r.nivel || 'Iniciante',
      tipo: r.tipo || 'Gi',
      descricao: r.descricao || '',
      pontosChave: Array.isArray(r.pontos_chave) ? r.pontos_chave : [],
      videoUrl: r.video_url,
      tags: Array.isArray(r.tags) ? r.tags : []
    }));

    // 9. Usuários (Carregamento via backend /api/users exclusivamente se autenticado como administrador)
    let allUsers: AuthUser[] = [];
    const authToken = localStorage.getItem('ternatio_bjj_auth_token') || localStorage.getItem('bjjflow_token');
    if (authToken) {
      try {
        const usersResp = await fetch('/api/users', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        if (usersResp.ok) {
          const uJson = await safeParseJsonResponse(usersResp);
          if (uJson && uJson.success && Array.isArray(uJson.users)) {
            allUsers = uJson.users.map((r: any) => ({
              id: r.id,
              nome: r.nome,
              email: r.email,
              role: r.role,
              isMasterAdmin: Boolean(r.is_master_admin || r.role === 'admin'),
              professorId: r.professor_id,
              studentId: r.student_id,
              faixa: r.faixa,
              graus: r.graus || 0,
              status: r.status,
              permissions: r.permissions
            }));
          }
        }
      } catch {
        allUsers = [];
      }
    }

    // 10. Configurações
    const { data: rawSettings } = await client.from('configuracoes_academia').select('*').limit(1).maybeSingle();
    let academySettings: Partial<AcademySettings> | undefined = undefined;
    if (rawSettings) {
      academySettings = {
        nomeAcademia: rawSettings.nome_academia,
        mestreResponsavel: rawSettings.mestre_responsavel,
        faixaMestre: rawSettings.faixa_mestre,
        grausMestre: rawSettings.graus_mestre,
        registroCBJJMestre: rawSettings.registro_cbjj_mestre || '',
        unidadePrincipal: rawSettings.unidade_principal || '',
        telefone: rawSettings.telefone || '',
        email: rawSettings.email || '',
        chavePix: rawSettings.chave_pix || '',
        banco: rawSettings.banco || '',
        whatsappApiUrl: rawSettings.whatsapp_api_url || '',
        whatsappInstanceId: rawSettings.whatsapp_instance_id || '',
        whatsappPhoneNumber: rawSettings.whatsapp_phone_number || '',
        messagingEmail: rawSettings.messaging_email || '',
        messagingSenderName: rawSettings.messaging_sender_name || '',
        sistemaGraduacaoPadrao: rawSettings.sistema_graduacao_padrao || 'graus_e_faixas',
        aulasPorGrau: rawSettings.aulas_por_grau || 40,
        aulasPorFaixaDireta: rawSettings.aulas_por_faixa_direta || 160,
        valorPadraoRegular: Number(rawSettings.valor_padrao_regular || 180),
        valorPadraoInfantil: Number(rawSettings.valor_padrao_infantil || 130),
        valorPadraoBolsista: Number(rawSettings.valor_padrao_bolsista || 70),
        regrasGraduacao: rawSettings.regras_graduacao
      };
    }

    // 11. Avaliações de Desenvolvimento (Histórico Pedagógico)
    let evaluations: StudentEvaluation[] = [];
    try {
      const { data: rawEvals, error: evError } = await client
        .from('avaliacoes_desenvolvimento')
        .select('*')
        .order('data', { ascending: false });

      if (!evError && rawEvals) {
        evaluations = rawEvals.map(r => ({
          id: r.id,
          studentId: r.student_id,
          data: r.data,
          avaliadorId: r.avaliador_id || undefined,
          avaliadorNome: r.avaliador_nome || undefined,
          scores: r.scores || { guarda: 0, passagem: 0, quedas: 0, finalizacoes: 0, defesa: 0, disciplina: 0 },
          observacoes: r.observacoes || undefined,
          focoDesenvolvimento: r.foco_desenvolvimento || undefined,
          createdAt: r.created_at || new Date().toISOString(),
          updatedAt: r.updated_at || new Date().toISOString()
        }));
      }
    } catch (e) {
      console.warn('Tabela avaliacoes_desenvolvimento pode não existir ainda no Supabase:', e);
    }

    return {
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
    };
  } catch (err: any) {
    const msg = err.message || '';
    if (msg.includes('Forbidden use of secret API key in browser')) {
      return { error: 'Chave secreta bloqueada pelo Supabase no navegador. Use a chave pública (anon).' };
    }
    return { error: msg };
  }
}

/**
 * Gera um script SQL completo com todos os dados atuais prontos para INSERT no PostgreSQL do Supabase.
 * Pode ser executado diretamente no SQL Editor do Supabase sem restrições de chaves do navegador!
 */
export function generateDataMigrationSql(data: {
  students: Student[];
  instructors: Instructor[];
  classes: ClassSchedule[];
  attendance: AttendanceRecord[];
  graduations: GraduationHistory[];
  payments: PaymentRecord[];
  lessonPlans: LessonPlan[];
  techniques: Technique[];
  allUsers: AuthUser[];
  academySettings: AcademySettings;
  evaluations?: StudentEvaluation[];
}): string {
  const escapeSql = (str?: string | null): string => {
    if (str === null || str === undefined) return 'NULL';
    return `'${String(str).replace(/'/g, "''")}'`;
  };

  const escapeJson = (obj: any): string => {
    if (!obj) return "'{}'::jsonb";
    return `'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`;
  };

  const lines: string[] = [
    '-- ==============================================================================',
    '-- SCRIPT DE INSERÇÃO E MIGRAÇÃO DIRETA DE DADOS - MIKALKENAS JIU JITSU',
    '-- Execute este script no SQL Editor do Supabase para migrar os dados com 1 clique:',
    '-- https://supabase.com/dashboard/project/_/sql/new',
    '-- ==============================================================================',
    '',
    'BEGIN;',
    ''
  ];

  // 1. Alunos
  if (data.students && data.students.length > 0) {
    lines.push('-- 1. INSERIR ALUNOS');
    for (const s of data.students) {
      lines.push(`INSERT INTO public.alunos (id, nome, email, telefone, avatar, data_nascimento, data_inicio, faixa, graus, data_ultima_graduacao, presencas_na_faixa, presencas_meta_grau, total_presencas_historico, plano, valor_mensalidade, dia_vencimento, status_pagamento, observacoes_medicas, tamanho_kimono, peso_kg, turma_preferida, performance, professor_id, professor_nome, sistema_graduacao) VALUES (${escapeSql(s.id)}, ${escapeSql(s.nome)}, ${escapeSql(s.email)}, ${escapeSql(s.telefone)}, ${escapeSql(s.avatar)}, ${escapeSql(s.dataNascimento)}, ${escapeSql(s.dataInicio)}, ${escapeSql(s.faixa)}, ${s.graus}, ${escapeSql(s.dataUltimaGraduacao)}, ${s.presencasNaFaixa}, ${s.presencasMetaGrau}, ${s.totalPresencasHistorico}, ${escapeSql(s.plano)}, ${s.valorMensalidade}, ${s.diaVencimento}, ${escapeSql(s.statusPagamento)}, ${escapeSql(s.observacoesMedicas)}, ${escapeSql(s.tamanhoKimono)}, ${s.pesoKg}, ${escapeSql(s.turmaPreferida)}, ${escapeJson(s.performance)}, ${escapeSql(s.professorId)}, ${escapeSql(s.professorNome)}, ${escapeSql(s.sistemaGraduacao || 'graus_e_faixas')}) ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome, faixa = EXCLUDED.faixa, graus = EXCLUDED.graus, status_pagamento = EXCLUDED.status_pagamento;`);
    }
    lines.push('');
  }

  // 2. Professores
  if (data.instructors && data.instructors.length > 0) {
    lines.push('-- 2. INSERIR PROFESSORES');
    for (const i of data.instructors) {
      lines.push(`INSERT INTO public.professores (id, nome, faixa, graus, email, telefone, foto, registro_cbjj, bio, turmas, chave_pix, banco, sistema_graduacao) VALUES (${escapeSql(i.id)}, ${escapeSql(i.nome)}, ${escapeSql(i.faixa)}, ${i.graus}, ${escapeSql(i.email)}, ${escapeSql(i.telefone)}, ${escapeSql(i.foto)}, ${escapeSql(i.registroCBJJ)}, ${escapeSql(i.bio)}, ${escapeJson(i.turmas)}, ${escapeSql(i.chavePix)}, ${escapeSql(i.banco)}, ${escapeSql(i.sistemaGraduacao || 'graus_e_faixas')}) ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome, faixa = EXCLUDED.faixa, graus = EXCLUDED.graus, chave_pix = EXCLUDED.chave_pix;`);
    }
    lines.push('');
  }

  // 3. Turmas
  if (data.classes && data.classes.length > 0) {
    lines.push('-- 3. INSERIR TURMAS');
    for (const c of data.classes) {
      lines.push(`INSERT INTO public.turmas (id, titulo, dia_semana, horario, categoria, professor_id, professor_nome, sala) VALUES (${escapeSql(c.id)}, ${escapeSql(c.titulo)}, ${escapeSql(c.diaSemana)}, ${escapeSql(c.horario)}, ${escapeSql(c.categoria)}, ${escapeSql(c.professorId)}, ${escapeSql(c.professorNome)}, ${escapeSql(c.sala)}) ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo, horario = EXCLUDED.horario, professor_nome = EXCLUDED.professor_nome;`);
    }
    lines.push('');
  }

  // 4. Presenças
  if (data.attendance && data.attendance.length > 0) {
    lines.push('-- 4. INSERIR PRESENÇAS');
    for (const a of data.attendance) {
      lines.push(`INSERT INTO public.presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por) VALUES (${escapeSql(a.id)}, ${escapeSql(a.studentId)}, ${escapeSql(a.studentNome)}, ${escapeSql(a.studentFaixa)}, ${a.studentGraus}, ${escapeSql(a.turmaId)}, ${escapeSql(a.turmaTitulo)}, ${escapeSql(a.data)}, ${escapeSql(a.horario)}, ${escapeSql(a.confirmadoPor)}) ON CONFLICT (id) DO NOTHING;`);
    }
    lines.push('');
  }

  // 5. Graduações
  if (data.graduations && data.graduations.length > 0) {
    lines.push('-- 5. INSERIR GRADUAÇÕES');
    for (const g of data.graduations) {
      lines.push(`INSERT INTO public.graduacoes (id, student_id, student_nome, faixa_anterior, graus_anteriores, nova_faixa, novos_graus, data, professor_avaliador, total_aulas_atingidas, motivo_observacao, tipo_graduacao, sistema_utilizado) VALUES (${escapeSql(g.id)}, ${escapeSql(g.studentId)}, ${escapeSql(g.studentNome)}, ${escapeSql(g.faixaAnterior)}, ${g.grausAnteriores}, ${escapeSql(g.novaFaixa)}, ${g.novosGraus}, ${escapeSql(g.data)}, ${escapeSql(g.professorAvaliador)}, ${g.totalAulasAtingidas}, ${escapeSql(g.motivoObservacao)}, ${escapeSql(g.tipoGraduacao || 'grau')}, ${escapeSql(g.sistemaUtilizado || 'graus_e_faixas')}) ON CONFLICT (id) DO NOTHING;`);
    }
    lines.push('');
  }

  // 6. Pagamentos
  if (data.payments && data.payments.length > 0) {
    lines.push('-- 6. INSERIR PAGAMENTOS');
    for (const p of data.payments) {
      lines.push(`INSERT INTO public.pagamentos (id, student_id, student_nome, plano, mes_referencia, valor, valor_original, desconto, data_vencimento, data_pagamento, status, metodo, comprovante, professor_id, professor_nome, chave_pix_professor) VALUES (${escapeSql(p.id)}, ${escapeSql(p.studentId)}, ${escapeSql(p.studentNome)}, ${escapeSql(p.plano)}, ${escapeSql(p.mesReferencia)}, ${p.valor}, ${p.valorOriginal}, ${p.desconto}, ${escapeSql(p.dataVencimento)}, ${escapeSql(p.dataPagamento)}, ${escapeSql(p.status)}, ${escapeSql(p.metodo)}, ${escapeSql(p.comprovante)}, ${escapeSql(p.professorId)}, ${escapeSql(p.professorNome)}, ${escapeSql(p.chavePixProfessor)}) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, data_pagamento = EXCLUDED.data_pagamento, metodo = EXCLUDED.metodo;`);
    }
    lines.push('');
  }

  // 7. Planos de Aula
  if (data.lessonPlans && data.lessonPlans.length > 0) {
    lines.push('-- 7. INSERIR PLANOS DE AULA');
    for (const l of data.lessonPlans) {
      lines.push(`INSERT INTO public.planos_aula (id, data, semana_ciclo, tema_principal, turma, professor, aquecimento, tecnica_principal, technique_ids, tecnicas_nomes, drill_repeticoes, treino_especifico_rola, observacoes, concluida) VALUES (${escapeSql(l.id)}, ${escapeSql(l.data)}, ${l.semanaCiclo}, ${escapeSql(l.temaPrincipal)}, ${escapeSql(l.turma)}, ${escapeSql(l.professor)}, ${escapeSql(l.aquecimento)}, ${escapeSql(l.tecnicaPrincipal)}, ${escapeJson(l.techniqueIds)}, ${escapeJson(l.tecnicasNomes)}, ${escapeSql(l.drillRepeticoes)}, ${escapeSql(l.treinoEspecificoRola)}, ${escapeSql(l.observacoes)}, ${l.concluida ? 'true' : 'false'}) ON CONFLICT (id) DO NOTHING;`);
    }
    lines.push('');
  }

  // 8. Técnicas
  if (data.techniques && data.techniques.length > 0) {
    lines.push('-- 8. INSERIR BIBLIOTECA DE TÉCNICAS');
    for (const t of data.techniques) {
      lines.push(`INSERT INTO public.tecnicas (id, titulo, categoria, subcategoria, faixa_minima, nivel, tipo, descricao, pontos_chave, video_url, tags) VALUES (${escapeSql(t.id)}, ${escapeSql(t.titulo)}, ${escapeSql(t.categoria)}, ${escapeSql(t.subcategoria)}, ${escapeSql(t.faixaMinima)}, ${escapeSql(t.nivel)}, ${escapeSql(t.tipo)}, ${escapeSql(t.descricao)}, ${escapeJson(t.pontosChave)}, ${escapeSql(t.videoUrl)}, ${escapeJson(t.tags)}) ON CONFLICT (id) DO NOTHING;`);
    }
    lines.push('');
  }

  // 9. Usuários
  if (data.allUsers && data.allUsers.length > 0) {
    lines.push('-- 9. INSERIR USUÁRIOS E ADMINISTRADOR MASTER');
    for (const u of data.allUsers) {
      lines.push(`INSERT INTO public.usuarios (id, nome, email, role, is_master_admin, professor_id, student_id, faixa, graus, status, permissions) VALUES (${escapeSql(u.id)}, ${escapeSql(u.nome)}, ${escapeSql(u.email)}, ${escapeSql(u.role)}, ${u.isMasterAdmin ? 'true' : 'false'}, ${escapeSql(u.professorId)}, ${escapeSql(u.studentId)}, ${escapeSql(u.faixa)}, ${u.graus || 0}, ${escapeSql(u.status || 'ativo')}, ${escapeJson(u.permissions)}) ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome, email = EXCLUDED.email, role = EXCLUDED.role, is_master_admin = EXCLUDED.is_master_admin, professor_id = EXCLUDED.professor_id, student_id = EXCLUDED.student_id, permissions = EXCLUDED.permissions;`);
    }
    lines.push('');
  }

  // 10. Configurações da Academia
  const s = data.academySettings;
  lines.push('-- 10. INSERIR CONFIGURAÇÕES DA ACADEMIA');
  lines.push(`INSERT INTO public.configuracoes_academia (id, nome_academia, mestre_responsavel, faixa_mestre, graus_mestre, registro_cbjj_mestre, unidade_principal, telefone, email, chave_pix, banco, whatsapp_api_url, whatsapp_instance_id, whatsapp_phone_number, messaging_email, messaging_sender_name, sistema_graduacao_padrao, aulas_por_grau, aulas_por_faixa_direta, valor_padrao_regular, valor_padrao_infantil, valor_padrao_bolsista, regras_graduacao) VALUES ('settings_main', ${escapeSql(s.nomeAcademia)}, ${escapeSql(s.mestreResponsavel)}, ${escapeSql(s.faixaMestre)}, ${s.grausMestre}, ${escapeSql(s.registroCBJJMestre)}, ${escapeSql(s.unidadePrincipal)}, ${escapeSql(s.telefone)}, ${escapeSql(s.email)}, ${escapeSql(s.chavePix)}, ${escapeSql(s.banco)}, ${escapeSql(s.whatsappApiUrl)}, ${escapeSql(s.whatsappInstanceId)}, ${escapeSql(s.whatsappPhoneNumber)}, ${escapeSql(s.messagingEmail)}, ${escapeSql(s.messagingSenderName)}, ${escapeSql(s.sistemaGraduacaoPadrao || 'graus_e_faixas')}, ${s.aulasPorGrau}, ${s.aulasPorFaixaDireta}, ${s.valorPadraoRegular}, ${s.valorPadraoInfantil}, ${s.valorPadraoBolsista}, ${escapeJson(s.regrasGraduacao)}) ON CONFLICT (id) DO UPDATE SET nome_academia = EXCLUDED.nome_academia, mestre_responsavel = EXCLUDED.mestre_responsavel, chave_pix = EXCLUDED.chave_pix, whatsapp_api_url = EXCLUDED.whatsapp_api_url, whatsapp_instance_id = EXCLUDED.whatsapp_instance_id, whatsapp_phone_number = EXCLUDED.whatsapp_phone_number, messaging_email = EXCLUDED.messaging_email, messaging_sender_name = EXCLUDED.messaging_sender_name, regras_graduacao = EXCLUDED.regras_graduacao, updated_at = now();`);
  lines.push('');

  // 11. Avaliações de Desenvolvimento (Histórico Pedagógico)
  if (data.evaluations && data.evaluations.length > 0) {
    lines.push('-- 11. INSERIR AVALIAÇÕES DE DESENVOLVIMENTO (HISTÓRICO PEDAGÓGICO)');
    for (const ev of data.evaluations) {
      lines.push(`INSERT INTO public.avaliacoes_desenvolvimento (id, student_id, data, avaliador_id, avaliador_nome, scores, observacoes, foco_desenvolvimento, created_at, updated_at) VALUES (${escapeSql(ev.id)}, ${escapeSql(ev.studentId)}, ${escapeSql(ev.data)}, ${escapeSql(ev.avaliadorId)}, ${escapeSql(ev.avaliadorNome)}, ${escapeJson(ev.scores)}, ${escapeSql(ev.observacoes)}, ${escapeSql(ev.focoDesenvolvimento)}, ${escapeSql(ev.createdAt)}, ${escapeSql(ev.updatedAt)}) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, scores = EXCLUDED.scores, observacoes = EXCLUDED.observacoes, foco_desenvolvimento = EXCLUDED.foco_desenvolvimento, updated_at = EXCLUDED.updated_at;`);
    }
    lines.push('');
  }

  lines.push('COMMIT;');
  lines.push('');
  lines.push('-- Migração de dados concluída com sucesso!');

  return lines.join('\n');
}

export async function authenticateUserWithSupabase(
  client: SupabaseClient,
  email: string,
  password: string
): Promise<{ success: boolean; message: string; user?: AuthUser; token?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !password) {
    return { success: false, message: 'E-mail ou senha inválidos.' };
  }

  // A autenticação ocorre EXCLUSIVAMENTE pelo backend (/api/auth/login).
  // O cliente React NUNCA realiza SELECT de password ou password_hash.
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, password })
    });

    const resJson = await safeParseJsonResponse(response);

    if (resJson && response.ok && resJson.success && resJson.user) {
      if (resJson.token) {
        try {
          localStorage.setItem('ternatio_bjj_auth_token', resJson.token);
          localStorage.setItem('bjjflow_token', resJson.token);
        } catch {}
      }
      return {
        success: true,
        message: resJson.message || 'Login realizado com sucesso.',
        user: resJson.user,
        token: resJson.token
      };
    }

    if (resJson) {
      return {
        success: false,
        message: resJson.message || 'E-mail ou senha inválidos.'
      };
    }

    // Se o backend retornou conteúdo não-JSON (ex: página HTML de erro ou proxy)
    return {
      success: false,
      message: response.status === 503
        ? 'Serviço de autenticação temporariamente indisponível. Aguarde alguns instantes e tente novamente.'
        : `Erro de comunicação com o servidor de autenticação (HTTP ${response.status}). Verifique sua conexão.`
    };
  } catch (backendFetchErr: any) {
    console.warn('[AUTH WARNING] Falha de comunicação de rede com /api/auth/login:', backendFetchErr?.message);
    return {
      success: false,
      message: 'Não foi possível conectar ao servidor de autenticação. Verifique sua conexão e tente novamente.'
    };
  }
}

/**
 * Registra uma nova solicitação de cadastro via backend (/api/auth/register)
 * A senha é criptografada com bcrypt (12 rounds) no servidor antes da gravação no banco.
 */
export async function registerNewUserInSupabase(
  client: SupabaseClient,
  reg: UserRegistrationData
): Promise<{ success: boolean; message: string; userId?: string }> {
  const cleanEmail = reg.email.trim().toLowerCase();
  if (!cleanEmail) {
    return { success: false, message: 'Informe um endereço de e-mail válido.' };
  }
  if (!reg.password || reg.password.length < 8) {
    return { success: false, message: 'A senha deve conter no mínimo 8 caracteres.' };
  }

  try {
    const resp = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: reg.nome.trim(),
        email: cleanEmail,
        password: reg.password,
        role: reg.role,
        telefone: reg.telefone?.trim(),
        faixa: reg.faixa,
        graus: Number(reg.graus || 0)
      })
    });

    const resJson = await safeParseJsonResponse(resp);
    if (resJson && resp.ok && resJson.success) {
      return { success: true, message: resJson.message };
    }

    return {
      success: false,
      message: resJson?.message || 'Erro ao realizar cadastro.'
    };
  } catch (err: any) {
    console.error('Falha de conexão com /api/auth/register:', err?.message);
    return {
      success: false,
      message: 'Erro ao conectar ao servidor para efetuar o cadastro.'
    };
  }
}

/**
 * Busca usuários com status opcional (pendente, aprovado, reprovado)
 */
export async function fetchUsersFromSupabase(
  _client?: SupabaseClient,
  statusFilter?: string
): Promise<{ success: boolean; users?: AuthUser[]; error?: string }> {
  try {
    const token = localStorage.getItem('ternatio_bjj_auth_token') || localStorage.getItem('bjjflow_token');
    if (!token) {
      return { success: false, error: 'Sessão não autenticada para listar usuários.' };
    }

    const url = statusFilter && statusFilter !== 'todos'
      ? `/api/users?status=${encodeURIComponent(statusFilter)}`
      : '/api/users';

    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!resp.ok) {
      const errData = await resp.json().catch(() => ({}));
      return { success: false, error: errData.error || `Erro HTTP ${resp.status}` };
    }

    const data = await resp.json();
    return { success: true, users: data.users || [] };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Falha de comunicação com a API de usuários.' };
  }
}

/**
 * Aprova um usuário no Supabase e garante a vinculação e criação automática 
 * do cadastro correspondente em 'professores' ou 'alunos' com idempotência estrita.
 */
export async function approveUserInSupabase(
  _client?: SupabaseClient,
  userId?: string
): Promise<{ 
  success: boolean; 
  error?: string; 
  updatedUser?: AuthUser;
  instructor?: Instructor;
  student?: Student;
}> {
  if (!userId) {
    return { success: false, error: "ID do usuário obrigatório." };
  }

  try {
    const token = localStorage.getItem("ternatio_bjj_auth_token") || localStorage.getItem("bjjflow_token");
    if (!token) {
      return { success: false, error: "Sessão não autenticada para aprovação." };
    }

    const resp = await fetch(`/api/users/${encodeURIComponent(userId)}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || !data.success) {
      return { success: false, error: data.error || "Falha ao aprovar usuário no servidor." };
    }

    return {
      success: true,
      updatedUser: data.user
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Erro de comunicação ao aprovar usuário." };
  }
}

/**
 * Atualiza o status de aprovação de um usuário no Supabase via rotas autenticadas do backend
 */
export async function updateUserStatusInSupabase(
  client: SupabaseClient | undefined,
  userId: string,
  newStatus: 'aprovado' | 'reprovado'
): Promise<{ success: boolean; error?: string }> {
  if (newStatus === 'aprovado') {
    const res = await approveUserInSupabase(client, userId);
    return { success: res.success, error: res.error };
  }

  try {
    const token = localStorage.getItem('ternatio_bjj_auth_token') || localStorage.getItem('bjjflow_token');
    if (!token) {
      return { success: false, error: 'Sessão não autenticada.' };
    }

    const resp = await fetch(`/api/users/${encodeURIComponent(userId)}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || !data.success) {
      return { success: false, error: data.error || 'Falha ao reprovar usuário.' };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

/**
 * Reconcilia de forma idempotente todos os usuários que já constam como 'aprovado' via backend
 */
export async function reconcileAllApprovedUsers(
  _client?: SupabaseClient
): Promise<{ success: boolean; reconciledCount: number; errors: string[] }> {
  try {
    const token = localStorage.getItem('ternatio_bjj_auth_token') || localStorage.getItem('bjjflow_token');
    if (!token) {
      return { success: true, reconciledCount: 0, errors: [] };
    }

    const resp = await fetch('/api/users/reconcile', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!resp.ok) {
      return { success: false, reconciledCount: 0, errors: ['Operação restrita a administradores.'] };
    }

    const data = await safeParseJsonResponse(resp);
    return {
      success: Boolean(data?.success),
      reconciledCount: data?.reconciledCount || 0,
      errors: data?.errors || []
    };
  } catch (err: any) {
    return { success: false, reconciledCount: 0, errors: [err?.message || 'Erro de comunicação na reconciliação.'] };
  }
}

export async function fetchInstructorsFromSupabase(client: SupabaseClient): Promise<Instructor[]> {
  try {
    const profRes = await client.from('professores').select('*').order('nome');
    const data = profRes.data || [];

    return data.map(r => {
      const cleanEmail = (r.email || '').toLowerCase().trim();
      const isAndre = cleanEmail === 'acuzati@gmail.com';
      const defaultRole: UserRole = isAndre ? 'admin' : 'professor';
      const defaultPerms = isAndre ? DEFAULT_ADMIN_PERMISSIONS : DEFAULT_PROFESSOR_PERMISSIONS;

      return {
        id: r.id,
        nome: r.nome,
        faixa: (r.faixa as BeltColor) || 'preta',
        graus: Number(r.graus || 0),
        email: r.email || '',
        telefone: r.telefone || '',
        foto: r.foto || undefined,
        registroCBJJ: r.registro_cbjj || '',
        bio: r.bio || '',
        turmas: Array.isArray(r.turmas) ? r.turmas : [],
        chavePix: r.chave_pix || '',
        banco: r.banco || '',
        sistemaGraduacao: (r.sistema_graduacao as GraduationSystemType) || 'graus_e_faixas',
        role: defaultRole,
        permissions: defaultPerms
      };
    });
  } catch (err) {
    console.warn('Erro ao buscar professores no Supabase:', err);
    return [];
  }
}

export async function fetchStudentsFromSupabase(client: SupabaseClient): Promise<Student[]> {
  const { data, error } = await client.from('alunos').select('*').order('nome');
  if (error || !data) return [];
  return data.map(r => ({
    id: r.id,
    nome: r.nome,
    email: r.email || '',
    telefone: r.telefone || '',
    avatar: r.avatar || undefined,
    dataNascimento: r.data_nascimento || '',
    dataInicio: r.data_inicio || '',
    faixa: (r.faixa as BeltColor) || 'branca',
    graus: Number(r.graus || 0),
    dataUltimaGraduacao: r.data_ultima_graduacao || undefined,
    presencasNaFaixa: Number(r.presencas_na_faixa || 0),
    presencasMetaGrau: Number(r.presencas_meta_grau || 40),
    totalPresencasHistorico: Number(r.total_presencas_historico || 0),
    plano: (r.plano as PlanType) || 'Mensal',
    valorMensalidade: Number(r.valor_mensalidade || 180),
    diaVencimento: Number(r.dia_vencimento || 10),
    statusPagamento: (r.status_pagamento as PaymentStatus) || 'em_dia',
    observacoesMedicas: r.observacoes_medicas || undefined,
    tamanhoKimono: r.tamanho_kimono || 'A2',
    pesoKg: Number(r.peso_kg || 75),
    turmaPreferida: r.turma_preferida || '',
    performance: r.performance || {},
    professorId: r.professor_id || undefined,
    professorNome: r.professor_nome || undefined,
    sistemaGraduacao: (r.sistema_graduacao as GraduationSystemType) || 'graus_e_faixas'
  }));
}

export async function saveUserToSupabase(
  _client: SupabaseClient,
  _user: AuthUser
): Promise<{ success: boolean; error?: string }> {
  console.warn('saveUserToSupabase desativado por segurança. Utilize rotas autenticadas de API.');
  return { success: true };
}

/**
 * Atualiza o perfil e privilégios de acesso do usuário via backend protegido
 */
export async function updateUserRoleInSupabase(
  _client: SupabaseClient | undefined,
  params: {
    userId?: string;
    email?: string;
    professorId?: string;
    studentId?: string;
    role: UserRole;
    permissions?: UserPermissions;
    nome?: string;
    faixa?: string;
    graus?: number;
    telefone?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = localStorage.getItem('ternatio_bjj_auth_token') || localStorage.getItem('bjjflow_token');
    if (!token) {
      return { success: false, error: 'Sessão não autenticada para atualizar perfil.' };
    }

    const targetId = params.userId || params.professorId || 'user';
    const resp = await fetch(`/api/users/${encodeURIComponent(targetId)}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        role: params.role,
        permissions: params.permissions,
        professorId: params.professorId,
        studentId: params.studentId,
        email: params.email,
        nome: params.nome,
        faixa: params.faixa,
        graus: params.graus,
        telefone: params.telefone
      })
    });

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || !data.success) {
      return { success: false, error: data.error || 'Erro ao atualizar perfil no servidor.' };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Falha ao contatar servidor.' };
  }
}

/**
 * Permite que um usuário logado altere sua própria senha com criptografia bcrypt via servidor.
 */
export async function changeUserPasswordInSupabase(
  client: SupabaseClient,
  userId: string,
  userEmail: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  try {
    if (!newPassword || newPassword.length < 8) {
      return { success: false, message: 'A nova senha deve possuir no mínimo 8 caracteres.' };
    }
    if (!currentPassword) {
      return { success: false, message: 'A senha atual é obrigatória.' };
    }

    const token = localStorage.getItem('ternatio_bjj_auth_token') || localStorage.getItem('bjjflow_token');
    if (!token) {
      return { success: false, message: 'Sessão expirada. Faça login novamente antes de alterar a senha.' };
    }

    // A alteração ocorre EXCLUSIVAMENTE pelo backend com verificação Bearer
    // A conta é identificada pela sessão verificada no servidor, sem aceitar IDs arbitrários do cliente
    const resp = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });

    const data = await safeParseJsonResponse(resp);
    if (resp.ok && data?.success) {
      return { success: true, message: data.message || 'Senha alterada com sucesso!' };
    }

    return {
      success: false,
      message: data?.message || 'Erro ao alterar senha no servidor.'
    };
  } catch (backendErr: any) {
    console.warn('[AUTH WARNING] Falha ao comunicar com /api/auth/change-password:', backendErr?.message);
    return {
      success: false,
      message: 'Não foi possível conectar ao servidor para alterar a senha. Tente novamente em instantes.'
    };
  }
}

/**
 * Solicitação de recuperação de senha por e-mail com proteção anti-enumeração.
 */
export async function requestPasswordResetInSupabase(
  client: SupabaseClient,
  email: string
): Promise<{ success: boolean; message: string; userFound?: boolean; maskedEmail?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) {
    return { success: false, message: 'Informe um endereço de e-mail válido.' };
  }

  const [namePart, domainPart] = cleanEmail.split('@');
  const masked = (namePart.length > 2 ? namePart.slice(0, 2) + '***' : namePart + '***') + '@' + (domainPart || '');

  try {
    // Consulta via rota segura do backend
    const resp = await fetch('/api/auth/recover-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail })
    });

    const data = await safeParseJsonResponse(resp);
    if (resp.ok && data?.success) {
      return {
        success: true,
        userFound: true,
        maskedEmail: masked,
        message: data.message
      };
    }
  } catch (err) {
    // Falha silenciosa de transporte
  }

  return {
    success: true,
    maskedEmail: masked,
    message: `Se o e-mail ${cleanEmail} estiver cadastrado no sistema, a solicitação de redefinição foi registrada.`
  };
}

// ==============================================================================
// OPERAÇÕES DE ESCRITA INDIVIDUAIS (PERSISTÊNCIA DIRETA NO SUPABASE)
// ==============================================================================

export async function saveStudentToSupabase(
  client: SupabaseClient,
  student: Student
): Promise<{ success: boolean; error?: string }> {
  try {
    const row = {
      id: student.id,
      nome: student.nome,
      email: student.email || null,
      telefone: student.telefone || null,
      avatar: student.avatar || null,
      data_nascimento: student.dataNascimento || null,
      data_inicio: student.dataInicio || null,
      faixa: student.faixa,
      graus: Number(student.graus || 0),
      data_ultima_graduacao: student.dataUltimaGraduacao || null,
      presencas_na_faixa: Number(student.presencasNaFaixa || 0),
      presencas_meta_grau: Number(student.presencasMetaGrau || 40),
      total_presencas_historico: Number(student.totalPresencasHistorico || 0),
      plano: student.plano || 'regular',
      valor_mensalidade: Number(student.valorMensalidade || 180),
      dia_vencimento: Number(student.diaVencimento || 10),
      status_pagamento: student.statusPagamento || 'em_dia',
      observacoes_medicas: student.observacoesMedicas || null,
      tamanho_kimono: student.tamanhoKimono || 'A2',
      peso_kg: Number(student.pesoKg || 75),
      turma_preferida: student.turmaPreferida || null,
      performance: student.performance || {},
      professor_id: student.professorId || null,
      professor_nome: student.professorNome || null,
      sistema_graduacao: student.sistemaGraduacao || 'graus_e_faixas'
    };

    const { error } = await client.from('alunos').upsert([row], { onConflict: 'id' });
    if (error) {
      console.error('Erro ao salvar aluno no Supabase (alunos):', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Exceção ao salvar aluno no Supabase:', err);
    return { success: false, error: err?.message };
  }
}

export async function deleteStudentFromSupabase(
  client: SupabaseClient,
  studentId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await client.from('alunos').delete().eq('id', studentId);
    if (error) {
      console.error('Erro ao excluir aluno no Supabase:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function saveInstructorToSupabase(
  client: SupabaseClient,
  instructor: Instructor
): Promise<{ success: boolean; error?: string }> {
  try {
    const row = {
      id: instructor.id,
      nome: instructor.nome,
      faixa: instructor.faixa,
      graus: Number(instructor.graus || 0),
      email: instructor.email || null,
      telefone: instructor.telefone || null,
      foto: instructor.foto || null,
      registro_cbjj: instructor.registroCBJJ || null,
      bio: instructor.bio || null,
      turmas: instructor.turmas || [],
      chave_pix: instructor.chavePix || null,
      banco: instructor.banco || null,
      sistema_graduacao: instructor.sistemaGraduacao || 'graus_e_faixas'
    };

    const { error } = await client.from('professores').upsert([row], { onConflict: 'id' });
    if (error) {
      console.error('Erro ao salvar professor no Supabase (professores):', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Exceção ao salvar professor no Supabase:', err);
    return { success: false, error: err?.message };
  }
}

export async function deleteInstructorFromSupabase(
  client: SupabaseClient,
  instructorId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await client.from('professores').delete().eq('id', instructorId);
    if (error) {
      console.error('Erro ao excluir professor no Supabase:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function saveClassScheduleToSupabase(
  client: SupabaseClient,
  schedule: ClassSchedule
): Promise<{ success: boolean; error?: string }> {
  try {
    const row = {
      id: schedule.id,
      titulo: schedule.titulo,
      dia_semana: schedule.diaSemana,
      horario: schedule.horario,
      categoria: schedule.categoria || null,
      professor_id: schedule.professorId || null,
      professor_nome: schedule.professorNome || null,
      sala: schedule.sala || null
    };

    const { error } = await client.from('turmas').upsert([row], { onConflict: 'id' });
    if (error) {
      console.error('Erro ao salvar turma no Supabase (turmas):', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Exceção ao salvar turma no Supabase:', err);
    return { success: false, error: err?.message };
  }
}

export async function deleteClassScheduleFromSupabase(
  client: SupabaseClient,
  classId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await client.from('turmas').delete().eq('id', classId);
    if (error) {
      console.error('Erro ao excluir turma no Supabase:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function saveAttendanceToSupabase(
  client: SupabaseClient,
  record: AttendanceRecord
): Promise<{ success: boolean; error?: string }> {
  try {
    const row = {
      id: record.id,
      student_id: record.studentId,
      student_nome: record.studentNome,
      student_faixa: record.studentFaixa || null,
      student_graus: Number(record.studentGraus || 0),
      turma_id: record.turmaId,
      turma_titulo: record.turmaTitulo || null,
      data: record.data,
      horario: record.horario || null,
      confirmado_por: record.confirmadoPor || null
    };

    const { error } = await client.from('presencas').upsert([row], { onConflict: 'id' });
    if (error) {
      console.error('Erro ao salvar presença no Supabase (presencas):', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Exceção ao salvar presença no Supabase:', err);
    return { success: false, error: err?.message };
  }
}

export async function deleteAttendanceFromSupabase(
  client: SupabaseClient,
  attendanceId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await client.from('presencas').delete().eq('id', attendanceId);
    if (error) {
      console.error('Erro ao excluir presença no Supabase:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function saveGraduationToSupabase(
  client: SupabaseClient,
  grad: GraduationHistory
): Promise<{ success: boolean; error?: string }> {
  try {
    const row = {
      id: grad.id,
      student_id: grad.studentId,
      student_nome: grad.studentNome,
      faixa_anterior: grad.faixaAnterior,
      graus_anteriores: Number(grad.grausAnteriores || 0),
      nova_faixa: grad.novaFaixa,
      novos_graus: Number(grad.novosGraus || 0),
      data: grad.data,
      professor_avaliador: grad.professorAvaliador || null,
      total_aulas_atingidas: Number(grad.totalAulasAtingidas || 0),
      motivo_observacao: grad.motivoObservacao || null,
      tipo_graduacao: grad.tipoGraduacao || 'grau',
      sistema_utilizado: grad.sistemaUtilizado || 'graus_e_faixas'
    };

    const { error } = await client.from('graduacoes').upsert([row], { onConflict: 'id' });
    if (error) {
      console.error('Erro ao salvar graduação no Supabase (graduacoes):', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Exceção ao salvar graduação no Supabase:', err);
    return { success: false, error: err?.message };
  }
}

export async function saveTechniqueToSupabase(
  client: SupabaseClient,
  tech: Technique
): Promise<{ success: boolean; error?: string }> {
  try {
    const row = {
      id: tech.id,
      titulo: tech.titulo,
      categoria: tech.categoria,
      subcategoria: tech.subcategoria || null,
      faixa_minima: tech.faixaMinima,
      nivel: tech.nivel || 'Iniciante',
      tipo: tech.tipo || 'Gi',
      descricao: tech.descricao || null,
      pontos_chave: tech.pontosChave || [],
      video_url: tech.videoUrl || null,
      tags: tech.tags || []
    };

    const { error } = await client.from('tecnicas').upsert([row], { onConflict: 'id' });
    if (error) {
      console.error('Erro ao salvar técnica no Supabase (tecnicas):', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Exceção ao salvar técnica no Supabase:', err);
    return { success: false, error: err?.message };
  }
}

export async function deleteTechniqueFromSupabase(
  client: SupabaseClient,
  techId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await client.from('tecnicas').delete().eq('id', techId);
    if (error) {
      console.error('Erro ao excluir técnica no Supabase:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function saveLessonPlanToSupabase(
  client: SupabaseClient,
  plan: LessonPlan
): Promise<{ success: boolean; error?: string }> {
  try {
    const row = {
      id: plan.id,
      data: plan.data,
      semana_ciclo: Number(plan.semanaCiclo || 1),
      tema_principal: plan.temaPrincipal || null,
      turma: plan.turma || null,
      professor: plan.professor || null,
      aquecimento: plan.aquecimento || null,
      tecnica_principal: plan.tecnicaPrincipal || null,
      technique_ids: plan.techniqueIds || [],
      tecnicas_nomes: plan.tecnicasNomes || [],
      drill_repeticoes: plan.drillRepeticoes || null,
      treino_especifico_rola: plan.treinoEspecificoRola || null,
      observacoes: plan.observacoes || null,
      concluida: Boolean(plan.concluida)
    };

    const { error } = await client.from('planos_aula').upsert([row], { onConflict: 'id' });
    if (error) {
      console.error('Erro ao salvar plano de aula no Supabase (planos_aula):', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Exceção ao salvar plano de aula no Supabase:', err);
    return { success: false, error: err?.message };
  }
}

export async function saveSettingsToSupabase(
  client: SupabaseClient,
  settings: AcademySettings
): Promise<{ success: boolean; error?: string }> {
  try {
    const row = {
      id: 'settings_main',
      nome_academia: settings.nomeAcademia,
      mestre_responsavel: settings.mestreResponsavel,
      faixa_mestre: settings.faixaMestre,
      graus_mestre: Number(settings.grausMestre || 0),
      registro_cbjj_mestre: settings.registroCBJJMestre || null,
      unidade_principal: settings.unidadePrincipal || null,
      telefone: settings.telefone || null,
      email: settings.email || null,
      chave_pix: settings.chavePix || null,
      banco: settings.banco || null,
      whatsapp_api_url: settings.whatsappApiUrl || null,
      whatsapp_instance_id: settings.whatsappInstanceId || null,
      whatsapp_phone_number: settings.whatsappPhoneNumber || null,
      messaging_email: settings.messagingEmail || null,
      messaging_sender_name: settings.messagingSenderName || null,
      sistema_graduacao_padrao: settings.sistemaGraduacaoPadrao || 'graus_e_faixas',
      aulas_por_grau: Number(settings.aulasPorGrau || 40),
      aulas_por_faixa_direta: Number(settings.aulasPorFaixaDireta || 160),
      valor_padrao_regular: Number(settings.valorPadraoRegular || 180),
      valor_padrao_infantil: Number(settings.valorPadraoInfantil || 130),
      valor_padrao_bolsista: Number(settings.valorPadraoBolsista || 70),
      regras_graduacao: settings.regrasGraduacao || {}
    };

    const { error } = await client.from('configuracoes_academia').upsert([row], { onConflict: 'id' });
    if (error) {
      console.error('Erro ao salvar configurações no Supabase:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Exceção ao salvar configurações no Supabase:', err);
    return { success: false, error: err?.message };
  }
}

