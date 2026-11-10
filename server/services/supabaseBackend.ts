import 'dotenv/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase do backend Express.
 *
 * Regras (instrucoes-seguranca-usuarios.md, seções 3.4, 10.1 e 12):
 * - O backend usa EXCLUSIVAMENTE a chave de serviço (service_role / sb_secret_), que ignora o RLS.
 * - A chave fica só no ambiente do servidor; nunca com prefixo VITE_ e nunca no código.
 * - Sem fallback para a chave pública: com o RLS fechado ela retornaria vazio e o login
 *   falharia de forma silenciosa ("usuário não encontrado" para todos).
 */

export function getSupabaseUrl(): string | undefined {
  const url = (process.env.SUPABASE_URL || '').trim();
  return url || undefined;
}

export const BACKEND_SUPABASE_URL = getSupabaseUrl() || '';

export function getServiceRoleKey(): string | undefined {
  const key = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    ''
  ).trim();
  return key || undefined;
}

export function isServiceRoleConfigured(): boolean {
  const key = getServiceRoleKey();
  // Rejeita chaves públicas configuradas por engano no lugar da chave de serviço
  return Boolean(key && !key.startsWith('sb_publishable_'));
}

/** Lança erro descritivo se a configuração do backend estiver incompleta. */
export function assertBackendSupabaseConfig(): void {
  if (!getSupabaseUrl()) {
    throw new Error('Configuração: SUPABASE_URL ausente no ambiente do servidor.');
  }
  if (!isServiceRoleConfigured()) {
    throw new Error(
      'Configuração: SUPABASE_SERVICE_ROLE_KEY ausente ou inválida no ambiente do servidor. ' +
      'O backend não opera com a chave pública (anon/publishable).'
    );
  }
}

let backendClient: SupabaseClient | null = null;
let lastUsedKey: string | null = null;

export function getBackendSupabaseClient(): SupabaseClient {
  assertBackendSupabaseConfig();
  const url = getSupabaseUrl() as string;
  const key = getServiceRoleKey() as string;

  if (!backendClient || lastUsedKey !== key) {
    backendClient = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    });
    lastUsedKey = key;
    console.log('[BACKEND SUPABASE] Cliente inicializado com chave de serviço (somente servidor).');
  }
  return backendClient;
}

/**
 * Consulta de saúde do banco de dados no backend
 */
export async function checkDatabaseHealth(): Promise<{ ok: boolean; message: string; timestamp: string }> {
  try {
    const client = getBackendSupabaseClient();
    const { error } = await client.from('usuarios').select('id', { head: true, count: 'exact' }).limit(1);
    if (error) {
      return { ok: false, message: 'Falha ao consultar o banco de dados.', timestamp: new Date().toISOString() };
    }
    return { ok: true, message: 'Conexão com o Supabase ativa e respondendo.', timestamp: new Date().toISOString() };
  } catch {
    return { ok: false, message: 'Backend sem configuração válida do Supabase.', timestamp: new Date().toISOString() };
  }
}
