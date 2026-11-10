import { Request, Response } from 'express';
import crypto from 'crypto';
import { getBackendSupabaseClient } from '../services/supabaseBackend';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { generateSessionToken } from '../services/session';
import {
  audit,
  blockedStatusMessage,
  consumeRateLimit,
  fetchUserBy,
  getClientIp,
  hashPassword,
  isStatusAllowed,
  isUndefinedColumnError,
  isUndefinedTableError,
  isValidEmail,
  markOptionalColumns,
  normalizeEmail,
  normalizePhone,
  resetRateLimit,
  sanitizeBelt,
  sanitizeDegrees,
  sanitizeShortText,
  sha256Hex,
  validateName,
  validatePasswordPolicy,
  verifyPassword
} from '../services/security';

// Reexportações para compatibilidade com imports existentes
export { getSessionSecret, generateSessionToken, verifySessionToken } from '../services/session';

const GENERIC_LOGIN_ERROR = 'E-mail ou senha inválidos.';
const NEUTRAL_REGISTER_ERROR =
  'Não foi possível concluir o cadastro. Se você já tem conta, use Entrar ou Recuperar senha.';
const NEUTRAL_RECOVERY_MESSAGE =
  'Se o e-mail estiver cadastrado, você receberá as instruções. Caso não receba em alguns minutos, procure a secretaria da academia.';

/** Campos devolvidos ao cliente após login / em /me (5.1, passo 7). Nunca inclui password. */
const PUBLIC_USER_COLUMNS =
  'id, nome, email, role, status, is_master_admin, professor_id, student_id, faixa, graus, telefone, permissions';

const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;

function toPublicUser(row: any, hasOptionalColumns: boolean) {
  return {
    id: row.id,
    nome: row.nome,
    email: row.email,
    role: row.role,
    status: row.status,
    is_master_admin: row.is_master_admin === true,
    professor_id: row.professor_id ?? null,
    student_id: row.student_id ?? null,
    faixa: row.faixa ?? null,
    graus: row.graus ?? 0,
    telefone: row.telefone ?? '',
    permissions: row.permissions ?? null,
    must_change_password: hasOptionalColumns ? row.must_change_password === true : false
  };
}

/** Envio de e-mail transacional via Resend (HTTP), se configurado. */
async function sendResetEmail(to: string, nome: string, link: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) return false;
  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        subject: 'Redefinição de senha',
        text:
          `Olá, ${nome}.\n\nRecebemos um pedido para redefinir sua senha. ` +
          `Use o link abaixo em até 30 minutos (uso único):\n\n${link}\n\n` +
          `Se você não fez este pedido, ignore este e-mail.`
      })
    });
    if (!resp.ok) console.error('[RECOVERY] Provedor de e-mail respondeu HTTP', resp.status);
    return resp.ok;
  } catch (err: any) {
    console.error('[RECOVERY] Falha ao enviar e-mail:', err?.message);
    return false;
  }
}

export class AuthController {
  /**
   * POST /auth/login — fluxo da seção 5.1.
   */
  static async login(req: Request, res: Response): Promise<void> {
    const ip = getClientIp(req);
    const cleanEmail = normalizeEmail(req.body?.email);
    const password = req.body?.password;
    const rlKey = `${ip}:${cleanEmail}`;

    if (!consumeRateLimit('login', rlKey, 5, 15 * 60 * 1000) || !consumeRateLimit('login-ip', ip, 30, 15 * 60 * 1000)) {
      res.status(429).json({ success: false, message: 'Muitas tentativas. Aguarde 15 minutos antes de tentar novamente.' });
      return;
    }

    if (!isValidEmail(cleanEmail) || typeof password !== 'string' || !password || password.length > 200) {
      await verifyPassword('x', null); // iguala tempo de resposta
      res.status(401).json({ success: false, message: GENERIC_LOGIN_ERROR });
      return;
    }

    let client;
    try {
      client = getBackendSupabaseClient();
    } catch (cfgErr: any) {
      console.error('[AUTH CONFIG ERROR]', cfgErr?.message);
      res.status(503).json({ success: false, message: 'Serviço de autenticação temporariamente indisponível.' });
      return;
    }

    try {
      const { data: user, error, hasOptionalColumns } = await fetchUserBy(
        client,
        'email',
        cleanEmail,
        `${PUBLIC_USER_COLUMNS}, password`
      );

      if (error) {
        console.error('[AUTH DB ERROR] Falha ao consultar usuarios:', error.code);
        res.status(503).json({ success: false, message: 'Serviço de autenticação temporariamente indisponível.' });
        return;
      }

      // Sempre executa bcrypt (hash falso se o usuário não existir) para igualar o tempo
      const passwordMatches = await verifyPassword(password, user?.password);

      if (!user || !passwordMatches) {
        await audit(client, { action: 'login_falha', email: cleanEmail, ip, targetId: user?.id ?? null });
        res.status(401).json({ success: false, message: GENERIC_LOGIN_ERROR });
        return;
      }

      // Só após a senha conferir, avalia o status
      if (!isStatusAllowed(user.status)) {
        await audit(client, { action: 'login_bloqueado_status', email: cleanEmail, ip, targetId: user.id, details: { status: user.status } });
        res.status(403).json({ success: false, message: blockedStatusMessage(user.status) });
        return;
      }

      resetRateLimit('login', rlKey);
      const token = generateSessionToken(user.id);
      await audit(client, { action: 'login_sucesso', email: cleanEmail, ip, actorId: user.id, targetId: user.id });

      const safeUser = toPublicUser(user, hasOptionalColumns);
      res.json({
        success: true,
        message: `Bem-vindo, ${safeUser.nome}!`,
        token,
        user: safeUser
      });
    } catch (err: any) {
      console.error('[AUTH LOGIN ERROR]', err?.message);
      res.status(500).json({ success: false, message: 'Erro ao autenticar no servidor.' });
    }
  }

  /**
   * POST /auth/register — seção 7. O servidor decide papel, status e privilégios.
   */
  static async register(req: Request, res: Response): Promise<void> {
    const ip = getClientIp(req);
    if (!consumeRateLimit('register', ip, 5, 60 * 60 * 1000)) {
      res.status(429).json({ success: false, message: 'Muitas solicitações de cadastro. Tente novamente mais tarde.' });
      return;
    }

    const body = req.body || {};

    const nameCheck = validateName(body.nome);
    if (!nameCheck.ok) {
      res.status(400).json({ success: false, message: nameCheck.message });
      return;
    }

    const cleanEmail = normalizeEmail(body.email);
    if (!isValidEmail(cleanEmail)) {
      res.status(400).json({ success: false, message: 'Informe um endereço de e-mail válido.' });
      return;
    }

    const passCheck = validatePasswordPolicy(body.password, { email: cleanEmail, nome: nameCheck.value });
    if (!passCheck.ok) {
      res.status(400).json({ success: false, message: passCheck.message });
      return;
    }
    if (body.confirmPassword !== undefined && body.confirmPassword !== body.password) {
      res.status(400).json({ success: false, message: 'A senha e a confirmação não coincidem.' });
      return;
    }

    const phoneCheck = normalizePhone(body.telefone);
    if (!phoneCheck.ok) {
      res.status(400).json({ success: false, message: phoneCheck.message });
      return;
    }

    if (body.role !== undefined && body.role !== 'professor' && body.role !== 'aluno') {
      res.status(400).json({ success: false, message: 'Papel solicitado inválido. Use professor ou aluno.' });
      return;
    }
    // Nunca 'admin'; qualquer status/permissions/is_master_admin/vínculo do corpo é ignorado (mass assignment)
    const safeRole: 'aluno' | 'professor' = body.role === 'professor' ? 'professor' : 'aluno';

    // Opção B (7.4): dados de perfil solicitados ficam em permissions.perfil_solicitado até a aprovação
    const perfilSolicitado =
      safeRole === 'professor'
        ? {
            registroCBJJ: sanitizeShortText(body.registroCBJJ, 60),
            chavePix: sanitizeShortText(body.chavePix, 120),
            bio: sanitizeShortText(body.bio, 1000)
          }
        : {
            dataNascimento: sanitizeShortText(body.dataNascimento, 10),
            plano: sanitizeShortText(body.plano, 40),
            turmaPreferencia: sanitizeShortText(body.turmaPreferencia, 120)
          };

    try {
      const client = getBackendSupabaseClient();

      const { data: existing, error: existErr } = await client
        .from('usuarios')
        .select('id')
        .eq('email', cleanEmail)
        .limit(1);

      if (existErr) {
        console.error('[AUTH REGISTER] Falha ao verificar e-mail:', existErr.code);
        res.status(503).json({ success: false, message: 'Serviço temporariamente indisponível. Tente novamente.' });
        return;
      }

      if (existing && existing.length > 0) {
        res.status(409).json({ success: false, message: NEUTRAL_REGISTER_ERROR });
        return;
      }

      const newUserId = `user-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
      const row = {
        id: newUserId,
        nome: nameCheck.value,
        email: cleanEmail,
        password: await hashPassword(body.password),
        role: safeRole,
        status: 'pendente',
        telefone: phoneCheck.value,
        faixa: sanitizeBelt(body.faixa, safeRole === 'professor' ? 'preta' : 'branca'),
        graus: sanitizeDegrees(body.graus) ?? 0,
        is_master_admin: false,
        permissions: { perfil_solicitado: perfilSolicitado },
        professor_id: null,
        student_id: null,
        created_at: new Date().toISOString()
      };

      // Escrita única: sem registro parcial em caso de falha
      const { error: insErr } = await client.from('usuarios').insert([row]);

      if (insErr) {
        if (insErr.code === '23505') {
          res.status(409).json({ success: false, message: NEUTRAL_REGISTER_ERROR });
          return;
        }
        console.error('[AUTH REGISTER] Falha no insert:', insErr.code, insErr.message);
        res.status(500).json({ success: false, message: 'Não foi possível salvar o cadastro agora. Tente novamente mais tarde.' });
        return;
      }

      await audit(client, {
        action: 'cadastro',
        targetId: newUserId,
        email: cleanEmail,
        ip,
        after: { role: safeRole, status: 'pendente' }
      });

      res.status(201).json({
        success: true,
        message: 'Cadastro recebido. Aguarde a aprovação da academia.'
      });
    } catch (err: any) {
      console.error('[AUTH REGISTER ERROR]', err?.message);
      res.status(500).json({ success: false, message: 'Erro interno ao realizar cadastro.' });
    }
  }

  /**
   * POST /auth/forgot-password (alias /auth/recover-password) — seção 9.1.
   * Resposta sempre igual, exista a conta ou não.
   */
  static async recoverPassword(req: Request, res: Response): Promise<void> {
    const ip = getClientIp(req);
    const cleanEmail = normalizeEmail(req.body?.email);

    if (!consumeRateLimit('recovery-ip', ip, 10, 60 * 60 * 1000) || !consumeRateLimit('recovery-email', cleanEmail || ip, 3, 60 * 60 * 1000)) {
      res.status(429).json({ success: false, message: 'Limite de solicitações atingido. Tente novamente mais tarde.' });
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      res.status(400).json({ success: false, message: 'Informe um endereço de e-mail válido.' });
      return;
    }

    // Resposta enviada sempre com o mesmo conteúdo
    const respond = () => res.json({ success: true, message: NEUTRAL_RECOVERY_MESSAGE });

    try {
      const client = getBackendSupabaseClient();
      const { data: user } = await client
        .from('usuarios')
        .select('id, email, nome, status')
        .eq('email', cleanEmail)
        .maybeSingle();

      await audit(client, { action: 'recuperacao_solicitada', email: cleanEmail, ip, targetId: user?.id ?? null });

      // Só contas liberadas recebem link
      if (!user || !isStatusAllowed(user.status)) {
        respond();
        return;
      }

      const appUrl = (process.env.APP_URL || '').replace(/\/+$/, '');
      const emailConfigured = Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM && appUrl);
      if (!emailConfigured) {
        console.warn('[RECOVERY] Envio de e-mail não configurado (RESEND_API_KEY/EMAIL_FROM/APP_URL). Use o reset assistido pelo admin.');
        respond();
        return;
      }

      // Invalida pedidos anteriores do mesmo usuário
      const nowIso = new Date().toISOString();
      const invalidate = await client
        .from('password_resets')
        .update({ used_at: nowIso })
        .eq('user_id', user.id)
        .is('used_at', null);

      if (invalidate.error) {
        if (isUndefinedTableError(invalidate.error)) {
          console.warn('[RECOVERY] Tabela password_resets ausente. Aplique a migração de segurança.');
        } else {
          console.error('[RECOVERY] Falha ao invalidar tokens:', invalidate.error.code);
        }
        respond();
        return;
      }

      const rawToken = crypto.randomBytes(32).toString('hex');
      const { error: insErr } = await client.from('password_resets').insert([{
        user_id: user.id,
        token_hash: sha256Hex(rawToken),
        expires_at: new Date(Date.now() + RESET_TOKEN_TTL_MS).toISOString()
      }]);

      if (insErr) {
        console.error('[RECOVERY] Falha ao gravar token:', insErr.code);
        respond();
        return;
      }

      await sendResetEmail(user.email, user.nome, `${appUrl}/?reset_token=${rawToken}`);
      respond();
    } catch (err: any) {
      console.error('[RECOVERY ERROR]', err?.message);
      respond();
    }
  }

  /**
   * POST /auth/reset-password — seção 9.2. Sem login automático.
   */
  static async resetPassword(req: Request, res: Response): Promise<void> {
    const ip = getClientIp(req);
    if (!consumeRateLimit('reset', ip, 10, 15 * 60 * 1000)) {
      res.status(429).json({ success: false, message: 'Muitas tentativas. Aguarde alguns minutos.' });
      return;
    }

    const token = typeof req.body?.token === 'string' ? req.body.token.trim() : '';
    const newPassword = req.body?.newPassword;
    const invalidLink = () => res.status(400).json({ success: false, message: 'Link inválido ou expirado. Solicite uma nova recuperação.' });

    if (!/^[a-f0-9]{64}$/.test(token)) {
      invalidLink();
      return;
    }

    try {
      const client = getBackendSupabaseClient();
      const nowIso = new Date().toISOString();

      const { data: resetRow, error: findErr } = await client
        .from('password_resets')
        .select('id, user_id, expires_at, used_at')
        .eq('token_hash', sha256Hex(token))
        .is('used_at', null)
        .gt('expires_at', nowIso)
        .maybeSingle();

      if (findErr || !resetRow) {
        invalidLink();
        return;
      }

      const { data: user } = await client
        .from('usuarios')
        .select('id, nome, email, status')
        .eq('id', resetRow.user_id)
        .maybeSingle();

      if (!user || !isStatusAllowed(user.status)) {
        invalidLink();
        return;
      }

      const passCheck = validatePasswordPolicy(newPassword, { email: user.email, nome: user.nome });
      if (!passCheck.ok) {
        res.status(400).json({ success: false, message: passCheck.message });
        return;
      }

      // Consome o token (uso único) antes de gravar a senha
      const { data: claimed, error: claimErr } = await client
        .from('password_resets')
        .update({ used_at: nowIso })
        .eq('id', resetRow.id)
        .is('used_at', null)
        .select('id');

      if (claimErr || !claimed || claimed.length !== 1) {
        invalidLink();
        return;
      }

      const { data: updated, error: updErr } = await client
        .from('usuarios')
        .update({
          password: await hashPassword(newPassword),
          password_changed_at: new Date().toISOString(),
          must_change_password: false
        })
        .eq('id', user.id)
        .select('id');

      if (updErr || !updated || updated.length !== 1) {
        console.error('[RESET PASSWORD] Falha ao gravar senha:', updErr?.code);
        res.status(500).json({ success: false, message: 'Não foi possível redefinir a senha. Solicite um novo link.' });
        return;
      }

      await audit(client, { action: 'recuperacao_concluida', actorId: user.id, targetId: user.id, email: user.email, ip });
      res.json({ success: true, message: 'Senha redefinida com sucesso. Entre com a nova senha.' });
    } catch (err: any) {
      console.error('[RESET PASSWORD ERROR]', err?.message);
      res.status(500).json({ success: false, message: 'Erro interno ao redefinir senha.' });
    }
  }

  /**
   * GET /auth/me — sessão validada pelo middleware; dados recarregados do banco.
   */
  static async me(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Não autenticado.' });
      return;
    }

    try {
      const client = getBackendSupabaseClient();
      const { data: user, error, hasOptionalColumns } = await fetchUserBy(client, 'id', req.user.id, PUBLIC_USER_COLUMNS);

      if (error || !user) {
        res.status(401).json({ success: false, message: 'Sessão revogada.' });
        return;
      }

      res.json({ success: true, user: toPublicUser(user, hasOptionalColumns) });
    } catch (err: any) {
      console.error('[AUTH ME ERROR]', err?.message);
      res.status(500).json({ success: false, message: 'Erro ao validar sessão.' });
    }
  }

  /**
   * POST /auth/change-password — seção 9.3.
   * Conta identificada EXCLUSIVAMENTE pela sessão (req.user.id). Exige a senha atual.
   * Atualiza password_changed_at (invalida as outras sessões) e devolve um novo token.
   */
  static async changePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
    const verifiedUserId = req.user?.id;
    if (!verifiedUserId) {
      res.status(401).json({ success: false, message: 'Não autenticado.' });
      return;
    }

    if (!consumeRateLimit('pwd-change', verifiedUserId, 5, 15 * 60 * 1000)) {
      res.status(429).json({ success: false, message: 'Muitas tentativas. Aguarde 15 minutos.' });
      return;
    }

    const { currentPassword, newPassword } = req.body || {};

    if (typeof currentPassword !== 'string' || !currentPassword) {
      res.status(400).json({ success: false, message: 'A senha atual é obrigatória.' });
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
        .select('id, nome, email, password')
        .eq('id', verifiedUserId)
        .maybeSingle();

      if (fetchErr || !user) {
        res.status(401).json({ success: false, message: 'Sessão revogada.' });
        return;
      }

      const passCheck = validatePasswordPolicy(newPassword, { email: user.email, nome: user.nome });
      if (!passCheck.ok) {
        res.status(400).json({ success: false, message: passCheck.message });
        return;
      }

      if (!(await verifyPassword(currentPassword, user.password))) {
        res.status(401).json({ success: false, message: 'A senha atual informada está incorreta.' });
        return;
      }

      resetRateLimit('pwd-change', verifiedUserId);

      const basePayload: Record<string, unknown> = { password: await hashPassword(newPassword) };
      const fullPayload = { ...basePayload, password_changed_at: new Date().toISOString(), must_change_password: false };

      // Proteção de concorrência: só altera se o hash ainda for o mesmo lido acima
      let result = await client
        .from('usuarios')
        .update(fullPayload)
        .eq('id', verifiedUserId)
        .eq('password', user.password)
        .select('id');

      if (result.error && isUndefinedColumnError(result.error)) {
        markOptionalColumns(false);
        result = await client
          .from('usuarios')
          .update(basePayload)
          .eq('id', verifiedUserId)
          .eq('password', user.password)
          .select('id');
      }

      if (result.error) {
        console.error('[CHANGE PASSWORD] Falha ao gravar:', result.error.code);
        res.status(500).json({ success: false, message: 'Erro ao gravar a nova senha.' });
        return;
      }

      if (!result.data || result.data.length !== 1) {
        res.status(409).json({ success: false, message: 'A senha foi alterada em outra sessão. Entre novamente.' });
        return;
      }

      await audit(client, { action: 'troca_senha', actorId: verifiedUserId, targetId: verifiedUserId, email: user.email, ip: getClientIp(req) });

      // Novo token (emitido após password_changed_at) mantém esta sessão ativa
      res.json({
        success: true,
        message: 'Senha alterada com sucesso.',
        token: generateSessionToken(verifiedUserId)
      });
    } catch (err: any) {
      console.error('[CHANGE PASSWORD ERROR]', err?.message);
      res.status(500).json({ success: false, message: 'Erro interno ao alterar senha.' });
    }
  }
}
