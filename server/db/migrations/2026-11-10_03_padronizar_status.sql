-- ==============================================================================
-- MIGRAÇÃO 03 — PADRONIZAR STATUS (seção 8.4, passo 3)
--
-- Rodar SOMENTE depois de confirmar que o novo backend está no ar
-- (login aceita 'ativo' e 'aprovado'; approveUser grava 'ativo').
--
-- Antes de rodar: valide a conta de origem desconhecida (seção 10.4).
-- Se ela não for legítima, inative-a em vez de migrar:
--   update public.usuarios set status = 'inativo' where id = '<ID_DA_CONTA>';
-- ==============================================================================

-- Diagnóstico (somente leitura)
select status, count(*) from public.usuarios group by status order by status;

begin;

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

-- Sempre deve existir pelo menos 1 master ativo
do $$
declare n int;
begin
  select count(*) into n from public.usuarios
  where is_master_admin = true and role = 'admin' and status = 'ativo';
  if n < 1 then
    raise exception 'Nenhum master ativo após a migração. Revertendo.';
  end if;
end $$;

commit;

select status, count(*) from public.usuarios group by status order by status;
