-- ==============================================================================
-- TERNATIO BJJ - ESQUEMA DE BANCO DE DADOS (POSTGRESQL / SUPABASE)
-- Camada de Backend & Persistência Relacional
-- ==============================================================================

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABELA: USUARIOS (Autenticação, perfis e permissões)
CREATE TABLE IF NOT EXISTS usuarios (
  id text PRIMARY KEY,
  nome text NOT NULL,
  email text UNIQUE NOT NULL,
  password text,
  role text NOT NULL DEFAULT 'aluno' CHECK (role IN ('admin', 'professor', 'aluno')),
  status text NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'reprovado', 'inativo', 'ativo')),
  is_master_admin boolean DEFAULT false,
  professor_id text,
  student_id text,
  faixa text DEFAULT 'branca',
  graus integer DEFAULT 0,
  telefone text,
  permissions jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT clock_timestamp(),
  updated_at timestamptz DEFAULT clock_timestamp()
);

-- 3. TABELA: PROFESSORES
CREATE TABLE IF NOT EXISTS professores (
  id text PRIMARY KEY,
  nome text NOT NULL,
  faixa text NOT NULL DEFAULT 'preta',
  graus integer DEFAULT 1,
  email text,
  telefone text,
  foto text,
  registro_cbjj text,
  bio text,
  turmas text[] DEFAULT ARRAY[]::text[],
  chave_pix text,
  banco text,
  sistema_graduacao text DEFAULT 'graus_e_faixas',
  created_at timestamptz DEFAULT clock_timestamp()
);

-- 4. TABELA: ALUNOS
CREATE TABLE IF NOT EXISTS alunos (
  id text PRIMARY KEY,
  nome text NOT NULL,
  email text,
  telefone text,
  avatar text,
  data_nascimento text,
  data_inicio text,
  faixa text NOT NULL DEFAULT 'branca',
  graus integer DEFAULT 0,
  data_ultima_graduacao text,
  presencas_na_faixa integer DEFAULT 0,
  presencas_meta_grau integer DEFAULT 40,
  total_presencas_historico integer DEFAULT 0,
  plano text DEFAULT 'regular',
  valor_mensalidade numeric(10,2) DEFAULT 180,
  dia_vencimento integer DEFAULT 10,
  status_pagamento text DEFAULT 'em_dia',
  observacoes_medicas text,
  tamanho_kimono text DEFAULT 'A2',
  peso_kg numeric(5,2) DEFAULT 75,
  turma_preferida text,
  performance jsonb DEFAULT '{}'::jsonb,
  professor_id text,
  professor_nome text,
  sistema_graduacao text DEFAULT 'graus_e_faixas',
  created_at timestamptz DEFAULT clock_timestamp()
);

-- 5. TABELA: TURMAS / HORARIOS
CREATE TABLE IF NOT EXISTS turmas (
  id text PRIMARY KEY,
  titulo text NOT NULL,
  dia_semana text NOT NULL,
  horario text NOT NULL,
  categoria text NOT NULL,
  professor_id text,
  professor_nome text,
  sala text DEFAULT 'Tatame 1 (Principal)',
  created_at timestamptz DEFAULT clock_timestamp()
);

-- 6. TABELA: PRESENCAS
CREATE TABLE IF NOT EXISTS presencas (
  id text PRIMARY KEY,
  student_id text NOT NULL,
  student_nome text NOT NULL,
  class_id text,
  turma_titulo text,
  data text NOT NULL,
  horario text,
  professor_id text,
  professor_nome text,
  created_at timestamptz DEFAULT clock_timestamp()
);

-- 7. TABELA: PAGAMENTOS / MENSALIDADES
CREATE TABLE IF NOT EXISTS pagamentos (
  id text PRIMARY KEY,
  student_id text NOT NULL,
  student_nome text NOT NULL,
  mes_referencia text NOT NULL,
  valor numeric(10,2) NOT NULL,
  data_vencimento text NOT NULL,
  data_pagamento text,
  status text NOT NULL DEFAULT 'pendente',
  metodo_pagamento text,
  comprovante_url text,
  professor_id text,
  professor_nome text,
  chave_pix_professor text,
  plano_tipo text DEFAULT 'regular',
  created_at timestamptz DEFAULT clock_timestamp()
);

-- 8. TABELA: EVENTOS
CREATE TABLE IF NOT EXISTS eventos (
  id text PRIMARY KEY,
  titulo text NOT NULL,
  tipo text NOT NULL,
  data text NOT NULL,
  horario text NOT NULL,
  local text NOT NULL,
  descricao text,
  organizador text,
  organizador_id text,
  taxa_inscricao numeric(10,2) DEFAULT 0,
  participantes_ids text[] DEFAULT ARRAY[]::text[],
  status text DEFAULT 'agendado',
  created_at timestamptz DEFAULT clock_timestamp()
);

-- 9. TABELA: TECNICAS
CREATE TABLE IF NOT EXISTS tecnicas (
  id text PRIMARY KEY,
  titulo text NOT NULL,
  categoria text NOT NULL,
  faixa_minima text DEFAULT 'branca',
  descricao text,
  video_url text,
  tags text[] DEFAULT ARRAY[]::text[],
  nivel text DEFAULT 'Iniciante',
  tipo text DEFAULT 'Ambos',
  created_at timestamptz DEFAULT clock_timestamp()
);

-- 10. FUNÇÃO RPC: APROVAR USUARIO COM CRIACAO AUTOMATICA
CREATE OR REPLACE FUNCTION aprovar_usuario(p_user_id text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_usuario record;
  v_prof_id text;
  v_aluno_id text;
BEGIN
  SELECT * INTO v_usuario FROM usuarios WHERE id = p_user_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'message', 'Usuário não encontrado');
  END IF;

  IF v_usuario.role = 'professor' THEN
    SELECT id INTO v_prof_id FROM professores 
    WHERE id = v_usuario.professor_id OR lower(email) = lower(v_usuario.email)
    LIMIT 1;

    IF v_prof_id IS NULL THEN
      v_prof_id := 'inst-' || substr(md5(random()::text || clock_timestamp()::text), 1, 10);
      INSERT INTO professores (id, nome, email, telefone, faixa, graus, bio, turmas)
      VALUES (
        v_prof_id,
        v_usuario.nome,
        v_usuario.email,
        COALESCE(v_usuario.telefone, ''),
        COALESCE(v_usuario.faixa, 'preta'),
        COALESCE(v_usuario.graus, 1),
        'Professor aprovado pela administração da Ternatio BJJ.',
        ARRAY['Jiu-Jitsu Geral']
      );
    END IF;

    UPDATE usuarios 
    SET status = 'aprovado', professor_id = v_prof_id
    WHERE id = p_user_id;

    RETURN jsonb_build_object('success', true, 'role', 'professor', 'professor_id', v_prof_id);

  ELSIF v_usuario.role = 'aluno' THEN
    SELECT id INTO v_aluno_id FROM alunos 
    WHERE id = v_usuario.student_id OR lower(email) = lower(v_usuario.email)
    LIMIT 1;

    IF v_aluno_id IS NULL THEN
      v_aluno_id := 'aluno-' || substr(md5(random()::text || clock_timestamp()::text), 1, 10);
      INSERT INTO alunos (id, nome, email, telefone, faixa, graus, plano, status_pagamento, data_inicio)
      VALUES (
        v_aluno_id,
        v_usuario.nome,
        v_usuario.email,
        COALESCE(v_usuario.telefone, ''),
        COALESCE(v_usuario.faixa, 'branca'),
        COALESCE(v_usuario.graus, 0),
        'regular',
        'em_dia',
        CURRENT_DATE::text
      );
    END IF;

    UPDATE usuarios 
    SET status = 'aprovado', student_id = v_aluno_id
    WHERE id = p_user_id;

    RETURN jsonb_build_object('success', true, 'role', 'aluno', 'student_id', v_aluno_id);
  ELSE
    UPDATE usuarios SET status = 'aprovado' WHERE id = p_user_id;
    RETURN jsonb_build_object('success', true, 'role', v_usuario.role);
  END IF;
END;
$$;
