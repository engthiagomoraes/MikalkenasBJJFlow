-- ==============================================================================
-- MIGRAÇÃO 05 — COMPLETAR O FECHAMENTO DO BANCO
--
-- Diagnóstico de 10/11/2026 (após 01 e 02 aplicadas, 04 ainda não):
--   * a migração 03 padronizou os status, mas os CHECK de status/role não existiam;
--   * os default privileges do schema public ainda davam a anon/authenticated
--     acesso total a tabelas, sequences e funções criadas no futuro (a 04 só
--     cobria tabelas).
--
-- Rodar DEPOIS da 04. Idempotente. Não altera senhas, papéis nem vínculos.
-- NUNCA desativar o RLS.
-- ==============================================================================

begin;

-- 1. Restrições de status e papel (parte final da migração 03)
update public.usuarios set status = 'ativo' where status = 'aprovado';

alter table public.usuarios drop constraint if exists usuarios_status_check;
alter table public.usuarios drop constraint if exists usuarios_status_chk;
alter table public.usuarios
  add constraint usuarios_status_chk
  check (status in ('pendente', 'ativo', 'reprovado', 'inativo'));

alter table public.usuarios drop constraint if exists usuarios_role_chk;
alter table public.usuarios
  add constraint usuarios_role_chk
  check (role in ('admin', 'professor', 'aluno'));

alter table public.usuarios alter column status set default 'pendente';
alter table public.usuarios alter column status set not null;

-- Só um admin pode ser master
alter table public.usuarios drop constraint if exists usuarios_master_admin_chk;
alter table public.usuarios
  add constraint usuarios_master_admin_chk
  check (is_master_admin = false or role = 'admin');

-- 2. Objetos futuros não ganham acesso automático da chave pública
alter default privileges in schema public revoke all on tables    from anon, authenticated;
alter default privileges in schema public revoke all on sequences from anon, authenticated;
alter default privileges in schema public revoke all on functions from anon, authenticated, public;

-- 3. Objetos atuais: nenhuma sequence/função do public acessível pela chave pública
revoke all on all sequences in schema public from anon, authenticated;
revoke execute on all functions in schema public from anon, authenticated, public;

-- 4. Sempre deve existir pelo menos 1 master ativo
do $$
declare n int;
begin
  select count(*) into n from public.usuarios
  where is_master_admin = true and role = 'admin' and status = 'ativo';
  if n < 1 then
    raise exception 'Nenhum master ativo. Revertendo.';
  end if;
end $$;

commit;

-- Conferência: as três consultas devem voltar vazias
select tablename, policyname from pg_policies where schemaname = 'public';
select table_name, grantee, privilege_type from information_schema.role_table_grants
where table_schema = 'public' and grantee in ('anon', 'authenticated');
select a.grantee::regrole as grantee, d.defaclobjtype, a.privilege_type
from pg_default_acl d, lateral aclexplode(d.defaclacl) a
where d.defaclnamespace = 'public'::regnamespace
  and d.defaclrole = 'postgres'::regrole  -- supabase_admin é gerenciado pela plataforma e não cria tabelas do app
  and a.grantee::regrole::text in ('anon', 'authenticated');
