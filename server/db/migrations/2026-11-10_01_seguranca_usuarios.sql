-- ==============================================================================
-- MIGRAÇÃO 01 — SEGURANÇA DE USUÁRIOS (instrucoes-seguranca-usuarios.md)
-- Data: 10/11/2026
--
-- Rodar no Supabase > SQL Editor ANTES ou JUNTO do deploy do novo backend.
-- É idempotente (pode ser executada mais de uma vez).
-- NÃO altera senhas, faixas, graus nem vínculos de nenhum usuário.
-- ==============================================================================

begin;

-- 1. Colunas de controle de senha (seção 9.4)
alter table public.usuarios add column if not exists password_changed_at timestamptz;
alter table public.usuarios add column if not exists must_change_password boolean not null default false;

-- 2. Tokens de recuperação de senha: só o hash SHA-256, validade de 30 min, uso único (9.1)
create extension if not exists pgcrypto;

create table if not exists public.password_resets (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.usuarios(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists idx_password_resets_user on public.password_resets(user_id);
alter table public.password_resets enable row level security;
-- Sem políticas: só o backend (service_role) acessa.

-- 3. Auditoria de usuários (seção 11). Nunca guarda senha, hash ou token.
create table if not exists public.auditoria_usuarios (
  id bigint generated always as identity primary key,
  acao text not null,
  ator_id text,
  alvo_id text,
  email text,
  ip text,
  antes jsonb,
  depois jsonb,
  detalhes jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_auditoria_usuarios_alvo on public.auditoria_usuarios(alvo_id);
create index if not exists idx_auditoria_usuarios_created on public.auditoria_usuarios(created_at desc);
alter table public.auditoria_usuarios enable row level security;
-- Sem políticas: só o backend (service_role) acessa.

-- 4. Remover a aprovação/criação automática de perfis (8.2) — o backend não usa mais.
--    A RPC aprovar_usuario é SECURITY DEFINER e poderia ser chamada pela chave pública.
drop trigger if exists trg_garantir_vinculo_usuario on public.usuarios;
drop function if exists public.fn_garantir_vinculo_usuario();
drop function if exists public.aprovar_usuario(text);

-- 5. E-mail único (consulta de login usa eq no e-mail normalizado)
create unique index if not exists usuarios_email_lower_uniq on public.usuarios (lower(email));

-- 6. Nenhum acesso da chave pública às tabelas de credenciais
revoke all on table public.usuarios           from anon, authenticated;
revoke all on table public.password_resets    from anon, authenticated;
revoke all on table public.auditoria_usuarios from anon, authenticated;

commit;

-- Verificação (somente leitura)
select column_name, data_type
from information_schema.columns
where table_schema = 'public' and table_name = 'usuarios'
  and column_name in ('password_changed_at', 'must_change_password');

select tablename, rowsecurity
from pg_tables
where schemaname = 'public' and tablename in ('usuarios', 'password_resets', 'auditoria_usuarios');
