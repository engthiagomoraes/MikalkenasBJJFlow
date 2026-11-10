-- ==============================================================================
-- MIGRAÇÃO 04 — FECHAR AS TABELAS DE NEGÓCIO PARA A CHAVE PÚBLICA
--
-- Diagnóstico de 10/11/2026: turmas, pagamentos, graduacoes, planos_aula, tecnicas e
-- configuracoes_academia tinham política "Acesso Total" (USING true, roles {public})
-- e GRANT completo (inclusive DELETE/TRUNCATE) para anon e authenticated.
--
-- PRÉ-REQUISITO: o frontend novo (src/services/backendDataClient.ts) no ar.
-- A partir dele, o navegador acessa esses dados só pelo backend (/api/data/:tabela).
-- Se rodar antes, o app antigo deixa de sincronizar essas tabelas.
--
-- NUNCA desativar o RLS.
-- ==============================================================================

begin;

drop policy if exists "Acesso Total Configuracoes" on public.configuracoes_academia;
drop policy if exists "Acesso Total Graduacoes"    on public.graduacoes;
drop policy if exists "Acesso Total Pagamentos"    on public.pagamentos;
drop policy if exists "Acesso Total PlanosAula"    on public.planos_aula;
drop policy if exists "Acesso Total Tecnicas"      on public.tecnicas;
drop policy if exists "Acesso Total Turmas"        on public.turmas;

revoke all on table
  public.alunos, public.professores, public.turmas, public.presencas,
  public.graduacoes, public.pagamentos, public.planos_aula, public.tecnicas,
  public.configuracoes_academia, public.avaliacoes_desenvolvimento, public.eventos
from anon, authenticated;

alter table public.alunos                     enable row level security;
alter table public.professores                enable row level security;
alter table public.turmas                     enable row level security;
alter table public.presencas                  enable row level security;
alter table public.graduacoes                 enable row level security;
alter table public.pagamentos                 enable row level security;
alter table public.planos_aula                enable row level security;
alter table public.tecnicas                   enable row level security;
alter table public.configuracoes_academia     enable row level security;
alter table public.avaliacoes_desenvolvimento enable row level security;
alter table public.eventos                    enable row level security;

-- Novas tabelas criadas no futuro não ganham acesso automático da chave pública
alter default privileges in schema public revoke all on tables from anon, authenticated;

commit;

-- Conferência: deve voltar vazio
select tablename, policyname from pg_policies where schemaname = 'public';
select table_name, grantee, privilege_type from information_schema.role_table_grants
where table_schema = 'public' and grantee in ('anon', 'authenticated');
