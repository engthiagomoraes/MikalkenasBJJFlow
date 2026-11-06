import 'dotenv/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// URL e chave do projeto Mikalkenas Jiu Jitsu para o backend Express
export const BACKEND_SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://rryyqwoygfwutnbxjrta.supabase.co';

/**
 * A chave de serviço administrativa (SUPABASE_SERVICE_ROLE_KEY) é exclusiva do servidor backend.
 * NUNCA deve possuir o prefixo VITE_, impedindo estritamente que seja empacotada no bundle do cliente.
 */
export function getServiceRoleKey(): string | undefined {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SERVICE_ROLE_KEY
  );
}

export function isServiceRoleConfigured(): boolean {
  return Boolean(getServiceRoleKey());
}

export const BACKEND_SUPABASE_KEY =
  getServiceRoleKey() ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_THjyHMmIulOzc9fRokYL4Q_uaS9zpG8';

let backendClient: SupabaseClient | null = null;
let lastUsedKey: string | null = null;

export function getBackendSupabaseClient(): SupabaseClient {
  const currentUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://rryyqwoygfwutnbxjrta.supabase.co';
  const serviceKey = getServiceRoleKey();
  const currentKey =
    serviceKey ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    'sb_publishable_THjyHMmIulOzc9fRokYL4Q_uaS9zpG8';

  const isServiceRole = Boolean(serviceKey);

  if (!backendClient || lastUsedKey !== currentKey) {
    if (!isServiceRole) {
      console.warn('[BACKEND SUPABASE] Variável SUPABASE_SERVICE_ROLE_KEY não configurada. Backend operando com chave pública anon e autenticação resiliente.');
    } else {
      console.log('[BACKEND SUPABASE] Inicializado com chave privilegiada de serviço (bypass RLS ativo).');
    }
    backendClient = createClient(currentUrl, currentKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    lastUsedKey = currentKey;
  }
  return backendClient;
}

/**
 * Consulta de saúde do banco de dados no backend
 */
export async function checkDatabaseHealth(): Promise<{ ok: boolean; message: string; timestamp: string }> {
  try {
    const client = getBackendSupabaseClient();
    // Verifica conectividade com uma tabela de acesso universal da academia
    const { error } = await client.from('configuracoes_academia').select('id').limit(1);
    if (error) {
      // Fallback para tabela de professores se configuracoes_academia falhar
      const { error: profErr } = await client.from('professores').select('id').limit(1);
      if (profErr) {
        return { ok: false, message: error.message || profErr.message, timestamp: new Date().toISOString() };
      }
    }
    return { ok: true, message: 'Conexão com o Supabase ativa e respondendo.', timestamp: new Date().toISOString() };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Erro inesperado ao consultar Supabase.', timestamp: new Date().toISOString() };
  }
}
