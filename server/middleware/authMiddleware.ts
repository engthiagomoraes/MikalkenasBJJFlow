import { Request, Response, NextFunction } from 'express';
import { getBackendSupabaseClient } from '../services/supabaseBackend';
import { verifySessionToken } from '../controllers/authController';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    isMasterAdmin: boolean;
    studentId?: string;
    professorId?: string;
    permissions?: Record<string, boolean>;
  };
}

/**
 * Valida o token e consulta o perfil atual no banco a cada requisição.
 * Permissões presentes no token ou enviadas pelo cliente não são usadas
 * como fonte de autorização.
 */
export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Não autorizado. Cabeçalho de autorização Bearer ausente ou inválido.'
    });
    return;
  }

  const token = authHeader.substring(7).trim();
  const tokenResult = verifySessionToken(token);

  if (!tokenResult.valid || !tokenResult.userId) {
    res.status(401).json({ error: 'Não autorizado. Sessão inválida ou expirada.' });
    return;
  }

  try {
    const client = getBackendSupabaseClient();
    const { data: user, error } = await client
      .from('usuarios')
      .select('id, email, role, is_master_admin, status, student_id, professor_id, permissions')
      .eq('id', tokenResult.userId)
      .maybeSingle();

    if (error || !user) {
      res.status(401).json({
        error: 'Sessão revogada ou perfil autorizado indisponível no banco de dados.'
      });
      return;
    }

    if (user.status !== 'aprovado' && user.status !== 'ativo') {
      res.status(403).json({
        error: 'Acesso bloqueado. Conta do usuário não possui aprovação ativa.'
      });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      isMasterAdmin: user.role === 'admin' && user.is_master_admin === true,
      studentId: user.student_id ?? undefined,
      professorId: user.professor_id ?? undefined,
      permissions: user.permissions ?? undefined
    };

    next();
  } catch {
    res.status(500).json({ error: 'Erro interno ao validar autorização no servidor.' });
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
      res.status(403).json({
        error: 'Acesso negado. Esta operação exige privilégios de Administrador.'
      });
      return;
    }

    next();
  });
}

/** Exige explicitamente o privilégio master registrado no banco. */
export async function requireMasterAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  await authenticateToken(req, res, () => {
    if (req.user?.role !== 'admin' || req.user.isMasterAdmin !== true) {
      res.status(403).json({
        error: 'Acesso negado. Esta operação exige privilégios de Administrador master.'
      });
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
      res.status(403).json({
        error: 'Acesso negado. Esta operação exige privilégios de Professor ou Administrador.'
      });
      return;
    }

    next();
  });
}
