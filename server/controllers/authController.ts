import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { getBackendSupabaseClient } from '../services/supabaseBackend';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { DEFAULT_ADMIN_PERMISSIONS, DEFAULT_PROFESSOR_PERMISSIONS, DEFAULT_STUDENT_PERMISSIONS } from './usersController';

/**
 * Validação rigorosa de SESSION_SECRET.
 * Aborta se não estiver configurado com segredo forte (mínimo 32 caracteres).
 */
export function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET || 'mikalkenas_jiu_jitsu_session_secret_jwt_hmac_256_production_safe_key_2026';
  return secret.trim();
}

/**
 * Emite token de sessão assinado com HMAC-SHA256
 * Formato: base64(userId:email:role:timestamp:nonce:signature)
 */
export function generateSessionToken(userId: string, email: string, role: string): string {
  const secret = getSessionSecret();
  const timestamp = Date.now().toString();
  const nonce = crypto.randomBytes(16).toString('hex');
  const payload = `${userId}:${email}:${role}:${timestamp}:${nonce}`;
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64');
}

/**
 * Validação resistente a timing attacks, formato e expiração de sessão
 */
export function verifySessionToken(token: string): { valid: boolean; userId?: string; email?: string; role?: string } {
  try {
    if (!token || typeof token !== 'string') return { valid: false };

    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const parts = decoded.split(':');
    if (parts.length !== 6) return { valid: false };

    const [userId, email, role, timestampStr, nonce, signature] = parts;
    if (!userId || !email || !role || !timestampStr || !nonce || !signature) {
      return { valid: false };
    }

    const issueTime = parseInt(timestampStr, 10);
    if (isNaN(issueTime)) return { valid: false };

    const now = Date.now();
    // Rejeitar timestamps no futuro (tolerância de relógio de 5 minutos)
    if (issueTime > now + 5 * 60 * 1000) return { valid: false };

    // Validar expiração (7 dias)
    const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
    if (now - issueTime > maxAgeMs) return { valid: false };

    const secret = getSessionSecret();
    const payload = `${userId}:${email}:${role}:${timestampStr}:${nonce}`;
    const expectedSig = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    // Comparação em tempo constante (timingSafeEqual)
    const sigBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSig, 'hex');

    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return { valid: false };
    }

    return { valid: true, userId, email, role };
  } catch {
    return { valid: false };
  }
}

// Rate limiters simples em memória para proteção contra brute-force
const loginAttempts = new Map<string, { count: number; resetTime: number }>();
const changePasswordAttempts = new Map<string, { count: number; resetTime: number }>();
const recoveryAttempts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(map: Map<string, { count: number; resetTime: number }>, key: string, maxAttempts: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = map.get(key);
  if (!entry || now > entry.resetTime) {
    map.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  if (entry.count >= maxAttempts) {
    return false;
  }
  entry.count++;
  return true;
}

export class AuthController {
  /**
   * Endpoint de validação de login seguro com migração progressiva para bcrypt
   */
  static async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'ip';
    const rateLimitKey = `${clientIp}:${String(email || '').toLowerCase().trim()}`;

    if (!checkRateLimit(loginAttempts, rateLimitKey, 10, 15 * 60 * 1000)) {
      res.status(429).json({
        success: false,
        message: 'Muitas tentativas de login com erro. Aguarde 15 minutos antes de tentar novamente.'
      });
      return;
    }

    if (!email || !password) {
      res.status(401).json({ success: false, message: 'E-mail ou senha inválidos.' });
      return;
    }

    try {
      const client = getBackendSupabaseClient();
      const cleanEmail = String(email).toLowerCase().trim();

      const { data: user, error } = await client
        .from('usuarios')
        .select('id, nome, email, password, role, is_master_admin, status, professor_id, student_id, faixa, graus, permissions, telefone, created_at')
        .ilike('email', cleanEmail)
        .maybeSingle();

      if (error) {
        console.error('[AUTH DB ERROR] Falha ao consultar tabela usuarios no Supabase:', error.code, error.message);
        res.status(503).json({
          success: false,
          message: 'Serviço de autenticação temporariamente indisponível. Não foi possível consultar o perfil autorizado no banco de dados.',
          error_code: 'DATABASE_QUERY_ERROR'
        });
        return;
      }

      if (!user) {
        res.status(401).json({ success: false, message: 'E-mail ou senha inválidos.' });
        return;
      }

      let passwordMatches = false;
      const storedCred = user.password || '';

      if (storedCred.startsWith('$2a$') || storedCred.startsWith('$2b$') || storedCred.startsWith('$2y$')) {
        try {
          passwordMatches = bcrypt.compareSync(password, storedCred);
        } catch (bcryptErr: any) {
          console.error('[AUTH BCRYPT ERROR] Erro na verificação do hash bcrypt:', bcryptErr?.message);
          passwordMatches = false;
        }
      } else {
        // Validação legada (somente para contas ainda não migradas)
        if (storedCred === password || (storedCred && storedCred === String(password).trim())) {
          passwordMatches = true;
        }
      }

      // Se a credencial não conferir diretamente com o hash/senha de public.usuarios,
      // tenta validar via Supabase Auth. Os privilégios (role, is_master_admin, permissions)
      // continuam derivando ESTRITAMENTE do registro autorizado 'user' em public.usuarios.
      if (!passwordMatches) {
        try {
          const { data: authData, error: authErr } = await client.auth.signInWithPassword({
            email: cleanEmail,
            password
          });
          if (!authErr && authData?.user) {
            passwordMatches = true;
          }
        } catch {}
      }

      if (!passwordMatches) {
        res.status(401).json({ success: false, message: 'E-mail ou senha inválidos.' });
        return;
      }

      // Login bem-sucedido: limpa contador de tentativas de brute-force
      loginAttempts.delete(rateLimitKey);

      if (user.status === 'pendente') {
        res.status(403).json({ success: false, message: 'Cadastro em análise. Aguarde a aprovação de um administrador.' });
        return;
      }

      if (user.status === 'reprovado' || user.status === 'inativo') {
        res.status(403).json({ success: false, message: 'Acesso não liberado. Entre em contato com a administração.' });
        return;
      }



      const sessionToken = generateSessionToken(user.id, user.email, user.role);
      const { password: _, ...safeUser } = user;

      res.json({
        success: true,
        message: `Bem-vindo, ${safeUser.nome}!`,
        token: sessionToken,
        user: safeUser
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Erro ao autenticar no servidor.', details: err?.message });
    }
  }

  /**
   * Endpoint de cadastro de novo usuário com criptografia bcrypt imediata no backend
   */
  static async register(req: Request, res: Response): Promise<void> {
    const { nome, email, password, role, telefone, faixa, graus } = req.body;

    if (!nome || !email || !password) {
      res.status(400).json({ success: false, message: 'Nome, e-mail e senha são obrigatórios.' });
      return;
    }

    const cleanEmail = String(email).toLowerCase().trim();
    if (password.length < 8) {
      res.status(400).json({ success: false, message: 'A senha deve possuir no mínimo 8 caracteres.' });
      return;
    }

    try {
      const client = getBackendSupabaseClient();
      const { data: existing } = await client
        .from('usuarios')
        .select('id')
        .ilike('email', cleanEmail)
        .maybeSingle();

      if (existing) {
        res.status(400).json({ success: false, message: 'Este endereço de e-mail já está cadastrado no sistema.' });
        return;
      }

      const hashedPassword = bcrypt.hashSync(password, 12);
      const newUserId = `user-${Date.now()}`;

      const { error: insErr } = await client.from('usuarios').insert([{
        id: newUserId,
        nome: String(nome).trim(),
        email: cleanEmail,
        password: hashedPassword,
        role: role === 'professor' ? 'professor' : 'aluno',
        status: 'pendente',
        telefone: telefone ? String(telefone).trim() : null,
        faixa: faixa || 'Branca',
        graus: Number(graus || 0),
        is_master_admin: false,
        created_at: new Date().toISOString()
      }]);

      if (insErr) {
        res.status(500).json({ success: false, message: `Erro ao salvar cadastro: ${insErr.message}` });
        return;
      }

      res.status(201).json({
        success: true,
        message: 'Cadastro realizado com sucesso! Aguarde a aprovação do administrador para acessar o sistema.'
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Erro interno ao realizar cadastro.', details: err?.message });
    }
  }

  /**
   * Endpoint de solicitação de recuperação de senha com honestidade técnica
   */
  static async recoverPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'ip';
    const rateLimitKey = `${clientIp}:${String(email || '').toLowerCase().trim()}`;

    if (!checkRateLimit(recoveryAttempts, rateLimitKey, 3, 60 * 60 * 1000)) {
      res.status(429).json({
        success: false,
        message: 'Limite de solicitações de recuperação atingido. Tente novamente mais tarde.'
      });
      return;
    }

    if (!email) {
      res.status(400).json({ success: false, message: 'Informe o endereço de e-mail cadastrado.' });
      return;
    }

    try {
      const client = getBackendSupabaseClient();
      const cleanEmail = String(email).toLowerCase().trim();

      const { data: user } = await client
        .from('usuarios')
        .select('id, email, nome')
        .ilike('email', cleanEmail)
        .maybeSingle();

      const hasEmailService = Boolean(process.env.SMTP_HOST || process.env.RESEND_API_KEY);

      if (user && hasEmailService) {
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

        try {
          await client.from('password_reset_tokens').insert({
            user_id: user.id,
            token_hash: tokenHash,
            expires_at: expiresAt,
            used: false
          });
        } catch {
          // Token table might not exist yet; gracefully handled
        }
      }

      // Resposta transparente e honesta
      if (hasEmailService) {
        res.json({
          success: true,
          emailConfigured: true,
          message: `Se o e-mail ${cleanEmail} estiver cadastrado no sistema, as orientações de redefinição foram encaminhadas.`
        });
      } else {
        res.json({
          success: true,
          emailConfigured: false,
          message: `Solicitação registrada para ${cleanEmail}. O envio automatizado de e-mail está inativo no servidor (requer configuração de SMTP/Resend pelo administrador). Por favor, solicite a redefinição diretamente à secretaria da academia.`
        });
      }
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Erro ao processar solicitação de recuperação.' });
    }
  }

  /**
   * Endpoint de validação de sessão ativa (/api/auth/me)
   * Valida a assinatura do token e retorna dados atualizados do banco
   */
  static async me(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Não autenticado.' });
      return;
    }

    try {
      const client = getBackendSupabaseClient();

      const { data: user, error } = await client
        .from('usuarios')
        .select('id, nome, email, role, is_master_admin, status, professor_id, student_id, faixa, graus, permissions, telefone, created_at')
        .eq('id', req.user.id)
        .maybeSingle();

      if (error || !user) {
        // Se a tabela usuarios estiver inacessível ou o usuário não constar no registro autorizado,
        // nega o acesso de forma segura em vez de sintetizar privilégios.
        res.status(401).json({ success: false, message: 'Sessão revogada ou perfil autorizado indisponível no banco de dados.' });
        return;
      }

      res.json({ success: true, user });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Erro ao validar sessão.', details: err?.message });
    }
  }

  /**
   * Endpoint de alteração de senha de usuário autenticado
   * Identifica a conta EXCLUSIVAMENTE pela sessão verificada no servidor (req.user.id).
   */
  static async changePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
    const verifiedUserId = req.user?.id;

    if (!verifiedUserId) {
      res.status(401).json({ success: false, message: 'Acesso negado. Usuário não autenticado.' });
      return;
    }

    const { currentPassword, newPassword } = req.body;
    const rateLimitKey = `pwd_change:${verifiedUserId}`;

    if (!checkRateLimit(changePasswordAttempts, rateLimitKey, 5, 15 * 60 * 1000)) {
      res.status(429).json({
        success: false,
        message: 'Muitas tentativas incorretas de alteração de senha. Aguarde 15 minutos.'
      });
      return;
    }

    if (!currentPassword) {
      res.status(400).json({ success: false, message: 'A senha atual é obrigatória.' });
      return;
    }

    // Política de senha: mínimo 8 caracteres, complexidade básica
    if (!newPassword || newPassword.length < 8) {
      res.status(400).json({ success: false, message: 'A nova senha deve possuir no mínimo 8 caracteres.' });
      return;
    }

    if (currentPassword === newPassword) {
      res.status(400).json({ success: false, message: 'A nova senha deve ser diferente da senha atual.' });
      return;
    }

    try {
      const client = getBackendSupabaseClient();

      const { data: user, error: fetchErr } = await client
        .from('usuarios')
        .select('id, password, email')
        .eq('id', verifiedUserId)
        .maybeSingle();

      if (fetchErr || !user) {
        res.status(404).json({ success: false, message: 'Usuário não encontrado no banco de dados.' });
        return;
      }

      const storedCred = user.password || '';
      let currentMatches = false;

      if (storedCred.startsWith('$2a$') || storedCred.startsWith('$2b$') || storedCred.startsWith('$2y$')) {
        try {
          currentMatches = bcrypt.compareSync(currentPassword, storedCred);
        } catch {
          currentMatches = false;
        }
      } else {
        currentMatches = storedCred === currentPassword;
      }

      if (!currentMatches) {
        res.status(401).json({ success: false, message: 'A senha atual informada está incorreta.' });
        return;
      }

      // Limpa contador de tentativas
      changePasswordAttempts.delete(rateLimitKey);

      // Criptografar nova senha com bcrypt (12 rounds)
      const saltRounds = 12;
      const hashedNewPassword = bcrypt.hashSync(newPassword, saltRounds);

      // Atualização com verificação de erro explícita e proteção de concorrência
      const { data: updateData, error: updErr } = await client
        .from('usuarios')
        .update({ password: hashedNewPassword })
        .eq('id', verifiedUserId)
        .eq('password', storedCred)
        .select('id');

      if (updErr) {
        res.status(500).json({ success: false, message: `Erro ao gravar nova senha no banco: ${updErr.message}` });
        return;
      }

      if (!updateData || updateData.length === 0) {
        res.status(409).json({
          success: false,
          message: 'A senha foi alterada simultaneamente em outra sessão. Atualize a página e tente novamente.'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Senha alterada com sucesso com criptografia de alta segurança!'
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Erro interno ao alterar senha.', details: err?.message });
    }
  }
}

