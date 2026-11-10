import { Request, Response, NextFunction } from 'express';
import { getBackendSupabaseClient } from '../services/supabaseBackend';
import { verifySessionToken } from '../services/session';
import { fetchUserBy, isStatusAllowed } from '../services/security';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    nome?: string;
    email: string;
    role: string;
    isMasterAdmin: boolean;
    studentId?: string;
    professorId?: string;
    permissions?: Record<string, boolean>;
    mustChangePassword?: boolean;
  };
}

/** Rotas acessíveis enquanto a conta exige troca obrigatória de senha. */
const MUST_CHANGE_PASSWORD_ALLOWLIST = new Set([
  '/api/auth/me',
  '/api/auth/change-password'
]);

/**
 * Valida o token e RECARREGA o perfil do banco a cada requisição (5.2).
 * - Reprovação/inativação vale na hora (status checado aqui).
 * - Tokens emitidos antes de password_changed_at são rejeitados.
 * - Permissões do token ou do cliente nunca são fonte de autorização.
 */
export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Não autorizado.' });
    return;
  }

  const tokenResult = verifySessionToken(authHeader.substring(7).trim());
  if (!tokenResult.valid) {
    res.status(401).json({ success: false, error: 'Sessão inválida ou expirada.' });
    return;
  }

  try {
    const client = getBackendSupabaseClient();
    const { data: user, error, hasOptionalColumns } = await fetchUserBy(
      client,
      'id',
      tokenResult.userId,
      'id, nome, email, role, is_master_admin, status, student_id, professor_id, permissions'
    );

    if (error) {
      console.error('[AUTH MIDDLEWARE] Falha ao consultar usuario:', error.code);
      res.status(503).json({ success: false, error: 'Serviço temporariamente indisponível.' });
      return;
    }

    if (!user) {
      res.status(401).json({ success: false, error: 'Sessão revogada.' });
      return;
    }

    if (!isStatusAllowed(user.status)) {
      res.status(403).json({ success: false, error: 'Conta indisponível.' });
      return;
    }

    if (hasOptionalColumns && user.password_changed_at) {
      const changedAt = Date.parse(user.password_changed_at);
      if (!Number.isNaN(changedAt) && tokenResult.issuedAt < changedAt) {
        res.status(401).json({ success: false, error: 'Sessão encerrada após troca de senha. Entre novamente.' });
        return;
      }
    }

    const mustChangePassword = hasOptionalColumns && user.must_change_password === true;
    if (mustChangePassword && !MUST_CHANGE_PASSWORD_ALLOWLIST.has(req.originalUrl.split('?')[0])) {
      res.status(403).json({
        success: false,
        error: 'É necessário trocar a senha provisória antes de continuar.',
        code: 'MUST_CHANGE_PASSWORD'
      });
      return;
    }

    req.user = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      isMasterAdmin: user.role === 'admin' && user.is_master_admin === true,
      studentId: user.student_id ?? undefined,
      professorId: user.professor_id ?? undefined,
      permissions: user.permissions ?? undefined,
      mustChangePassword
    };

    next();
  } catch (err: any) {
    console.error('[AUTH MIDDLEWARE] Erro interno:', err?.message);
    res.status(500).json({ success: false, error: 'Erro interno ao validar autorização.' });
  }
}

/** Exige um administrador autenticado, master ou não. */
export async function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  await authenticateToken(req, res, () => {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ success: false, error: 'Acesso negado. Esta operação exige privilégios de Administrador.' });
      return;
    }
    next();
  });
}

/** Exige o privilégio master — consultado no banco a cada requisição (via authenticateToken). */
export async function requireMasterAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  await authenticateToken(req, res, () => {
    if (req.user?.role !== 'admin' || req.user.isMasterAdmin !== true) {
      res.status(403).json({ success: false, error: 'Acesso negado. Esta operação exige privilégios de Administrador master.' });
      return;
    }
    next();
  });
}

/** Exige professor ou administrador autenticado. */
export async function requireInstructorOrAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  await authenticateToken(req, res, () => {
    if (req.user?.role !== 'admin' && req.user?.role !== 'professor') {
      res.status(403).json({ success: false, error: 'Acesso negado. Esta operação exige privilégios de Professor ou Administrador.' });
      return;
    }
    next();
  });
}
