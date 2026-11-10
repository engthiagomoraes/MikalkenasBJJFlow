-- ==============================================================================
-- MIGRAÇÃO 02 — FECHAR POLÍTICAS RLS ABERTAS (seção 10.3)
--
-- PRÉ-REQUISITOS (10.2):
--   [x] Backend usando SUPABASE_SERVICE_ROLE_KEY (configurado no .env do servidor).
--   [ ] Testar login, cadastro, listagem e presença após o deploy.
--
-- ATENÇÃO: o frontend ainda chama supabase.from(...) diretamente para professores,
-- alunos, turmas, presencas, pagamentos, graduacoes, planos_aula, tecnicas,
-- configuracoes_academia e avaliacoes_desenvolvimento (src/services/supabaseService.ts
-- e src/context/BjjContext.tsx). Em 10/11/2026 a chave pública JÁ estava sem
-- permissão (GRANT) em usuarios, professores, alunos e presencas, então essas
-- chamadas diretas já não funcionam hoje. Esta migração não piora esse quadro;
-- a correção definitiva é migrar essas chamadas para rotas do backend.
--
-- NUNCA desativar o RLS. Ele se corrige com políticas, não com "disable".
-- ==============================================================================

-- Diagnóstico antes (somente leitura)
select tablename, policyname, cmd, roles, qual, with_check
from pg_policies where schemaname = 'public' order by tablename;

begin;

drop policy if exists "Acesso Total Usuarios"    on public.usuarios;
drop policy if exists "Acesso Total Professores" on public.professores;
drop policy if exists "Acesso Total Alunos"      on public.alunos;
drop policy if exists "Acesso Total Presencas"   on public.presencas;

-- Políticas abertas criadas por scripts antigos do app (rls-policies.sql / script do AI Studio)
drop policy if exists "Permitir auto-cadastro pendente"    on public.usuarios;
drop policy if exists "Permitir leitura de usuários"       on public.usuarios;
drop policy if exists "Permitir atualização de usuários"   on public.usuarios;
drop policy if exists "usuarios_select_policy"             on public.usuarios;
drop policy if exists "usuarios_insert_policy"             on public.usuarios;
drop policy if exists "usuarios_update_policy"             on public.usuarios;
drop policy if exists "usuarios_delete_policy"             on public.usuarios;

-- Garantir RLS ativo (nunca desativar)
alter table public.usuarios    enable row level security;
alter table public.professores enable row level security;
alter table public.alunos      enable row level security;
alter table public.presencas   enable row level security;

commit;

-- Diagnóstico depois: não deve restar política com qual = true para anon/public em usuarios
select tablename, policyname, cmd, roles, qual, with_check
from pg_policies where schemaname = 'public' order by tablename;

-- Teste no terminal do Windows (esperado: lista vazia ou erro de permissão):
-- curl.exe "https://SEU-PROJETO.supabase.co/rest/v1/usuarios?select=id,email&limit=3" -H "apikey: SUA_CHAVE_PUBLICA"
