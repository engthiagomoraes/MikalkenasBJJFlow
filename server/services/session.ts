import crypto from 'crypto';

/**
 * Token de sessão assinado com HMAC-SHA256 (instrucoes-seguranca-usuarios.md, 5.2).
 *
 * Formato: base64url(JSON {sub, iat, exp, jti}) + "." + base64url(assinatura)
 * - Segredo apenas da variável de ambiente SESSION_SECRET (≥ 32 caracteres), sem valor padrão.
 * - Validade padrão de 8 horas.
 * - Assinatura comparada com crypto.timingSafeEqual.
 * - O middleware rejeita tokens emitidos antes de usuarios.password_changed_at.
 * - Trocar SESSION_SECRET invalida todas as sessões (ferramenta de emergência).
 */

export const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const CLOCK_SKEW_MS = 60 * 1000;

export function getSessionSecret(): string {
  const secret = (process.env.SESSION_SECRET || '').trim();
  if (secret.length < 32) {
    throw new Error('Configuração de segurança: SESSION_SECRET obrigatório no ambiente do servidor com no mínimo 32 caracteres.');
  }
  return secret;
}

function sign(payloadB64: string, secret: string): Buffer {
  return crypto.createHmac('sha256', secret).update(payloadB64).digest();
}

export interface SessionPayload {
  sub: string;
  iat: number;
  exp: number;
  jti: string;
}

export function generateSessionToken(userId: string): string {
  const secret = getSessionSecret();
  const now = Date.now();
  const payload: SessionPayload = {
    sub: userId,
    iat: now,
    exp: now + SESSION_TTL_MS,
    jti: crypto.randomBytes(12).toString('hex')
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const sigB64 = sign(payloadB64, secret).toString('base64url');
  return `${payloadB64}.${sigB64}`;
}

export function verifySessionToken(token: unknown): { valid: true; userId: string; issuedAt: number; expiresAt: number } | { valid: false } {
  try {
    if (typeof token !== 'string' || token.length > 2048) return { valid: false };
    const parts = token.split('.');
    if (parts.length !== 2 || !parts[0] || !parts[1]) return { valid: false };
    const [payloadB64, sigB64] = parts;

    const secret = getSessionSecret();
    const expected = sign(payloadB64, secret);
    const provided = Buffer.from(sigB64, 'base64url');
    if (provided.length !== expected.length || !crypto.timingSafeEqual(provided, expected)) {
      return { valid: false };
    }

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8')) as Partial<SessionPayload>;
    if (!payload || typeof payload.sub !== 'string' || !payload.sub) return { valid: false };
    if (typeof payload.iat !== 'number' || typeof payload.exp !== 'number') return { valid: false };

    const now = Date.now();
    if (payload.iat > now + CLOCK_SKEW_MS) return { valid: false };
    if (now >= payload.exp) return { valid: false };
    if (payload.exp - payload.iat > SESSION_TTL_MS + CLOCK_SKEW_MS) return { valid: false };

    return { valid: true, userId: payload.sub, issuedAt: payload.iat, expiresAt: payload.exp };
  } catch {
    return { valid: false };
  }
}
