import { Request, Response, NextFunction } from 'express';
import { getBackendSupabaseClient } from '../services/supabaseBackend';
import { verifySessionToken } from '../controllers/authController';
import { DEFAULT_ADMIN_PERMISSIONS, DEFAULT_PROFESSOR_PERMISSIONS, DEFAULT_STUDENT_PERMISSIONS } from '../controllers/usersController';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    isMasterAdmin: boolean;
    studentId?: string;
    professorId?: string;
    permissions?: any;
  };
}

/**
 * Middleware de autenticação estrita via Bearer Token.
 * NUNCA aceita cabeçalhos forjados como x-user-email ou dados enviados no corpo.
 * Sem sessão válida e assinada criptograficamente, retorna HTTP 401.
 */
export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Não autorizado. Cabeçalho de autorização Bearer ausente ou inválido.' });
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
      // Se a tabela usuarios não puder ser consultada ou o usuário não constar no registro autorizado,
      // nega o acesso de forma segura em vez de sintetizar privilégios por e-mail.
      res.status(401).json({ error: 'Sessão revogada ou perfil autorizado indisponível no banco de dados.' });
      return;
    }

    if (user.status !== 'aprovado' && user.status !== 'ativo') {
      res.status(403).json({ error: 'Acesso bloqueado. Conta do usuário não possui aprovação ativa.' });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      isMasterAdmin: Boolean(user.is_master_admin || user.role === 'admin'),
      studentId: user.student_id,
      professorId: user.professor_id,
      permissions: user.permissions
    };

    next();
  } catch (err: any) {
    res.status(500).json({ error: 'Erro interno ao validar autorização no servidor.', details: err?.message });
  }
}

/**
 * Middleware para exigir perfil Administrador no servidor
 */
export async function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  await authenticateToken(req, res, () => {
    if (!req.user || (req.user.role !== 'admin' && !req.user.isMasterAdmin)) {
      res.status(403).json({ error: 'Acesso negado. Esta operação exige privilégios de Administrador.' });
      return;
    }
    next();
  });
}

/**
 * Middleware para exigir perfil Professor ou Administrador
 */
export async function requireInstructorOrAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  await authenticateToken(req, res, () => {
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'professor' && !req.user.isMasterAdmin)) {
      res.status(403).json({ error: 'Acesso negado. Esta operação exige privilégios de Professor ou Administrador.' });
      return;
    }
    next();
  });
}


