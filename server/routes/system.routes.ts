import { Router, Request, Response } from 'express';
import { checkDatabaseHealth, BACKEND_SUPABASE_URL, isServiceRoleConfigured, getBackendSupabaseClient } from '../services/supabaseBackend';
import { requireAdmin } from '../middleware/authMiddleware';

const router = Router();

// Endpoint de verificação de integridade (Health Check)
router.get('/health', async (_req: Request, res: Response) => {
  const dbHealth = await checkDatabaseHealth();
  res.json({
    status: dbHealth.ok ? 'healthy' : 'degraded',
    service: 'Mikalkenas Jiu Jitsu Backend API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: dbHealth
  });
});

// Endpoint de status das configurações (nunca expõe segredos ou chaves)
router.get('/config', (_req: Request, res: Response) => {
  res.json({
    supabaseConfigured: Boolean(BACKEND_SUPABASE_URL),
    supabaseUrl: BACKEND_SUPABASE_URL,
    serviceRoleConfigured: isServiceRoleConfigured(),
    apiVersion: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

/** Tabelas verificadas pelo diagnóstico de Configurações > Banco de Dados (lista fechada). */
const DIAGNOSTIC_TABLES = [
  'alunos', 'professores', 'turmas', 'presencas', 'graduacoes', 'pagamentos',
  'planos_aula', 'tecnicas', 'usuarios', 'configuracoes_academia', 'avaliacoes_desenvolvimento'
];

/**
 * Diagnóstico de tabelas feito pelo backend (service_role).
 * O navegador não consulta mais o Supabase com a chave pública: ela não tem
 * permissão em nenhuma tabela desde a migração 04. Só administradores.
 */
router.get('/tables', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const client = getBackendSupabaseClient();
    const tables = await Promise.all(DIAGNOSTIC_TABLES.map(async (name) => {
      const { count, error } = await client.from(name).select('id', { count: 'exact', head: true });
      if (error) {
        const missing = error.code === '42P01' || error.code === 'PGRST205';
        return { name, exists: !missing, count: 0, error: missing ? 'Tabela não encontrada.' : 'Falha ao consultar a tabela.' };
      }
      return { name, exists: true, count: count ?? 0 };
    }));
    res.json({ success: true, tables });
  } catch {
    res.status(503).json({ success: false, error: 'Backend sem configuração válida do Supabase.' });
  }
});

export default router;
