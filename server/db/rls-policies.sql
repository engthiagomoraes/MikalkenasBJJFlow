-- ==============================================================================
-- TERNATIO BJJ - ROW LEVEL SECURITY (RLS)
--
-- Modelo de segurança (instrucoes-seguranca-usuarios.md, seção 10.1):
-- - O backend Express usa a service_role (ignora o RLS), guardada só no servidor.
-- - O RLS fica ATIVO e SEM políticas para anon/authenticated nas tabelas sensíveis.
-- - NUNCA criar políticas "USING (true)" para anon/public e NUNCA desativar o RLS.
--
-- Este arquivo substitui a versão anterior, que liberava leitura/escrita pública
-- em todas as tabelas (inclusive hashes de senha em usuarios).
-- ==============================================================================

-- 1. HABILITAR RLS NAS TABELAS
alter table public.usuarios                   enable row level security;
alter table public.professores                enable row level security;
alter table public.alunos                     enable row level security;
alter table public.turmas                     enable row level security;
alter table public.presencas                  enable row level security;
alter table public.pagamentos                 enable row level security;
alter table public.eventos                    enable row level security;
alter table public.tecnicas                   enable row level security;
alter table public.graduacoes                 enable row level security;
alter table public.planos_aula                enable row level security;
alter table public.configuracoes_academia     enable row level security;
alter table public.avaliacoes_desenvolvimento enable row level security;

-- 2. REMOVER POLÍTICAS ABERTAS CONHECIDAS
drop policy if exists "Acesso Total Usuarios"    on public.usuarios;
drop policy if exists "Acesso Total Professores" on public.professores;
drop policy if exists "Acesso Total Alunos"      on public.alunos;
drop policy if exists "Acesso Total Presencas"   on public.presencas;
drop policy if exists "Permitir auto-cadastro pendente"  on public.usuarios;
drop policy if exists "Permitir leitura de usuários"     on public.usuarios;
drop policy if exists "Permitir atualização de usuários" on public.usuarios;
drop policy if exists "usuarios_select_policy" on public.usuarios;
drop policy if exists "usuarios_insert_policy" on public.usuarios;
drop policy if exists "usuarios_update_policy" on public.usuarios;
drop policy if exists "usuarios_delete_policy" on public.usuarios;
drop policy if exists "Permitir leitura pública professores" on public.professores;
drop policy if exists "Permitir mutação professores"         on public.professores;
drop policy if exists "Permitir leitura pública alunos"      on public.alunos;
drop policy if exists "Permitir mutação alunos"              on public.alunos;
drop policy if exists "Permitir acesso turmas"     on public.turmas;
drop policy if exists "Permitir acesso presencas"  on public.presencas;
drop policy if exists "Permitir acesso pagamentos" on public.pagamentos;
drop policy if exists "Permitir acesso eventos"    on public.eventos;
drop policy if exists "Permitir acesso tecnicas"   on public.tecnicas;

-- 3. TABELAS DE CREDENCIAIS: sem nenhum privilégio para a chave pública
revoke all on table public.usuarios from anon, authenticated;

-- 4. Conferência: não deve haver política com qual = 'true' para anon/public
select tablename, policyname, cmd, roles, qual, with_check
from pg_policies where schemaname = 'public' order by tablename;
