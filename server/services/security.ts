import { Request } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Utilitários de segurança compartilhados pelo backend
 * (instrucoes-seguranca-usuarios.md — seções 3, 5, 7, 9 e 11).
 */

// ---------------------------------------------------------------------------
// Status de conta
// ---------------------------------------------------------------------------

/** Status que liberam acesso. 'aprovado' é legado e aceito até a padronização (8.4). */
export const ALLOWED_LOGIN_STATUSES = ['ativo', 'aprovado'] as const;
export const OFFICIAL_STATUSES = ['pendente', 'ativo', 'reprovado', 'inativo'] as const;

export function isStatusAllowed(status: unknown): boolean {
  return status === 'ativo' || status === 'aprovado';
}

/** Mensagem de bloqueio por status (5.1, passo 6). Só usar após a senha conferir. */
export function blockedStatusMessage(status: unknown): string {
  if (status === 'pendente') return 'Seu cadastro está aguardando aprovação.';
  if (status === 'reprovado') return 'Seu cadastro não foi aprovado. Procure a academia.';
  return 'Conta indisponível.';
}

// ---------------------------------------------------------------------------
// Normalização e validação de entrada
// ---------------------------------------------------------------------------

const EMAIL_REGEX = /^[^\s@<>()"',;:]+@[^\s@<>()"',;:]+\.[^\s@<>()"',;:]{2,}$/;
export const EMAIL_MAX_LENGTH = 254;

export function normalizeEmail(raw: unknown): string {
  return typeof raw === 'string' ? raw.trim().toLowerCase() : '';
}

export function isValidEmail(email: string): boolean {
  return email.length > 0 && email.length <= EMAIL_MAX_LENGTH && EMAIL_REGEX.test(email);
}

/** Nome: 3 a 120 caracteres, sem HTML/caracteres de controle. */
export function validateName(raw: unknown): { ok: true; value: string } | { ok: false; message: string } {
  const value = typeof raw === 'string' ? raw.trim().replace(/\s+/g, ' ') : '';
  if (value.length < 3 || value.length > 120) {
    return { ok: false, message: 'O nome deve ter entre 3 e 120 caracteres.' };
  }
  if (/[<>]/.test(value) || /[\u0000-\u001f\u007f]/.test(value)) {
    return { ok: false, message: 'O nome contém caracteres não permitidos.' };
  }
  return { ok: true, value };
}

/** Telefone BR: apenas dígitos, 10 ou 11 dígitos. Vazio é aceito (campo opcional). */
export function normalizePhone(raw: unknown): { ok: true; value: string | null } | { ok: false; message: string } {
  if (raw === undefined || raw === null || String(raw).trim() === '') return { ok: true, value: null };
  let digits = String(raw).replace(/\D/g, '');
  if (digits.length > 11 && digits.startsWith('55')) digits = digits.slice(2);
  if (digits.length < 10 || digits.length > 11) {
    return { ok: false, message: 'Telefone inválido. Informe DDD + número (10 ou 11 dígitos).' };
  }
  return { ok: true, value: digits };
}

/** Texto livre curto (dados de perfil solicitados), sem HTML. */
export function sanitizeShortText(raw: unknown, max = 500): string | null {
  if (raw === undefined || raw === null) return null;
  const value = String(raw).replace(/[<>]/g, '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim();
  return value ? value.slice(0, max) : null;
}

export function sanitizeBelt(raw: unknown, fallback: string): string {
  const value = typeof raw === 'string' ? raw.trim().toLowerCase() : '';
  return /^[a-z_-]{3,30}$/.test(value) ? value : fallback;
}

export function sanitizeDegrees(raw: unknown): number | null {
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 0 || n > 10) return null;
  return n;
}

// ---------------------------------------------------------------------------
// Política de senha (5.4)
// ---------------------------------------------------------------------------

export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 72; // limite do bcrypt
export const BCRYPT_COST = 12;

const OBVIOUS_PASSWORDS = new Set([
  '12345678', '123456789', '1234567890', '87654321', '11111111', '00000000',
  'password', 'password1', 'senha123', 'senha1234', 'qwerty123', 'abc12345',
  'admin123', 'admin1234', 'jiujitsu', 'jiujitsu1', 'bjj12345', 'mudar123'
]);

export function validatePasswordPolicy(
  password: unknown,
  context: { email?: string; nome?: string } = {}
): { ok: true } | { ok: false; message: string } {
  if (typeof password !== 'string' || password.length < PASSWORD_MIN) {
    return { ok: false, message: `A senha deve ter no mínimo ${PASSWORD_MIN} caracteres.` };
  }
  if (Buffer.byteLength(password, 'utf8') > PASSWORD_MAX) {
    return { ok: false, message: `A senha deve ter no máximo ${PASSWORD_MAX} caracteres.` };
  }
  const lower = password.toLowerCase();
  if (OBVIOUS_PASSWORDS.has(lower) || /^(.)\1+$/.test(password) || (/^\d+$/.test(password) && isSequential(password))) {
    return { ok: false, message: 'Senha muito óbvia. Escolha uma senha mais forte.' };
  }
  const email = (context.email || '').toLowerCase();
  if (email && (lower === email || lower === email.split('@')[0])) {
    return { ok: false, message: 'A senha não pode ser igual ao e-mail.' };
  }
  const nomeParts = (context.nome || '').toLowerCase().trim().split(/\s+/).filter(Boolean);
  const compactLower = lower.replace(/\s+/g, '');
  if (nomeParts.length && (compactLower === nomeParts.join('') || nomeParts.some(p => p.length >= 4 && compactLower === p))) {
    return { ok: false, message: 'A senha não pode ser igual ao seu nome.' };
  }
  return { ok: true };
}

function isSequential(digits: string): boolean {
  let asc = true;
  let desc = true;
  for (let i = 1; i < digits.length; i++) {
    const d = digits.charCodeAt(i) - digits.charCodeAt(i - 1);
    if (d !== 1) asc = false;
    if (d !== -1) desc = false;
  }
  return asc || desc;
}

export function isBcryptHash(value: unknown): value is string {
  return typeof value === 'string' && /^\$2[aby]\$\d{2}\$/.test(value) && value.length === 60;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_COST);
}

/** Hash aleatório usado para igualar o tempo de resposta quando o usuário não existe (5.1, passo 4). */
const DUMMY_HASH = bcrypt.hashSync(crypto.randomBytes(24).toString('hex'), BCRYPT_COST);

/**
 * Compara senha com hash bcrypt. Se o hash não for bcrypt válido (ou não existir),
 * compara contra um hash falso e devolve false — nunca aceita senha em texto puro.
 */
export async function verifyPassword(password: unknown, storedHash: unknown): Promise<boolean> {
  const candidate = typeof password === 'string' ? password : '';
  if (!isBcryptHash(storedHash)) {
    await bcrypt.compare(candidate, DUMMY_HASH).catch(() => false);
    return false;
  }
  try {
    return await bcrypt.compare(candidate, storedHash);
  } catch {
    return false;
  }
}

/** Senha provisória aleatória (reset assistido — 9.5). Exibida uma única vez. */
export function generateTemporaryPassword(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#%*';
  const bytes = crypto.randomBytes(14);
  let out = '';
  for (let i = 0; i < bytes.length; i++) out += alphabet[bytes[i] % alphabet.length];
  return out;
}

export function sha256Hex(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

// ---------------------------------------------------------------------------
// Rate limit em memória (5.3)
// ---------------------------------------------------------------------------

type Bucket = { count: number; resetTime: number };
const buckets = new Map<string, Bucket>();

/** Retorna true se a ação ainda é permitida; false se excedeu o limite. */
export function consumeRateLimit(scope: string, key: string, maxAttempts: number, windowMs: number): boolean {
  const now = Date.now();
  const id = `${scope}:${key}`;
  const entry = buckets.get(id);
  if (!entry || now > entry.resetTime) {
    buckets.set(id, { count: 1, resetTime: now + windowMs });
    return true;
  }
  if (entry.count >= maxAttempts) return false;
  entry.count++;
  return true;
}

export function resetRateLimit(scope: string, key: string): void {
  buckets.delete(`${scope}:${key}`);
}

// Limpeza periódica para não acumular memória
setInterval(() => {
  const now = Date.now();
  for (const [id, entry] of buckets) {
    if (now > entry.resetTime) buckets.delete(id);
  }
}, 10 * 60 * 1000).unref();

/** IP do cliente. Depende de app.set('trust proxy') configurado corretamente em app.ts. */
export function getClientIp(req: Request): string {
  return req.ip || req.socket.remoteAddress || 'ip-desconhecido';
}

// ---------------------------------------------------------------------------
// Colunas opcionais (criadas pela migração de segurança)
// ---------------------------------------------------------------------------

/**
 * password_changed_at e must_change_password só existem após a migração
 * server/db/migrations/2026-11-10_seguranca_usuarios.sql. Enquanto ela não for
 * aplicada, o backend continua funcionando sem esses recursos.
 */
let optionalColumnsState: { available: boolean; checkedAt: number } | null = null;
const OPTIONAL_RECHECK_MS = 5 * 60 * 1000;
export const OPTIONAL_USER_COLUMNS = 'password_changed_at, must_change_password';

export function isUndefinedColumnError(error: any): boolean {
  if (!error) return false;
  const msg = String(error.message || '');
  return error.code === '42703' || error.code === 'PGRST204' || /column .* does not exist/i.test(msg);
}

export function isUndefinedTableError(error: any): boolean {
  if (!error) return false;
  const msg = String(error.message || '');
  return error.code === '42P01' || error.code === 'PGRST205' || /relation .* does not exist|Could not find the table/i.test(msg);
}

export function optionalColumnsKnownMissing(): boolean {
  return Boolean(
    optionalColumnsState &&
    !optionalColumnsState.available &&
    Date.now() - optionalColumnsState.checkedAt < OPTIONAL_RECHECK_MS
  );
}

export function markOptionalColumns(available: boolean): void {
  optionalColumnsState = { available, checkedAt: Date.now() };
}

/**
 * Busca um único usuário por coluna exata, incluindo as colunas opcionais quando existirem.
 */
export async function fetchUserBy(
  client: SupabaseClient,
  column: 'id' | 'email',
  value: string,
  baseColumns: string
): Promise<{ data: any | null; error: any; hasOptionalColumns: boolean }> {
  if (!optionalColumnsKnownMissing()) {
    const res = await client
      .from('usuarios')
      .select(`${baseColumns}, ${OPTIONAL_USER_COLUMNS}`)
      .eq(column, value)
      .maybeSingle();
    if (!res.error) {
      markOptionalColumns(true);
      return { data: res.data, error: null, hasOptionalColumns: true };
    }
    if (!isUndefinedColumnError(res.error)) {
      return { data: null, error: res.error, hasOptionalColumns: false };
    }
    markOptionalColumns(false);
    console.warn('[SECURITY] Colunas password_changed_at/must_change_password ausentes. Aplique a migração de segurança.');
  }
  const res = await client.from('usuarios').select(baseColumns).eq(column, value).maybeSingle();
  return { data: res.data, error: res.error, hasOptionalColumns: false };
}

// ---------------------------------------------------------------------------
// Auditoria (seção 11)
// ---------------------------------------------------------------------------

export type AuditAction =
  | 'login_sucesso' | 'login_falha' | 'login_bloqueado_status'
  | 'cadastro' | 'aprovacao' | 'reprovacao' | 'inativacao'
  | 'mudanca_papel' | 'mudanca_perfil' | 'mudanca_vinculo'
  | 'reconciliacao'
  | 'recuperacao_solicitada' | 'recuperacao_concluida'
  | 'troca_senha' | 'senha_provisoria';

const SENSITIVE_KEYS = /pass|hash|token|secret|senha/i;

function stripSensitive(obj: Record<string, unknown> | null | undefined): Record<string, unknown> | null {
  if (!obj) return null;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (!SENSITIVE_KEYS.test(k)) out[k] = v;
  }
  return out;
}

let auditTableMissingWarned = false;

/**
 * Registra evento de auditoria em log estruturado e, se existir, na tabela auditoria_usuarios.
 * Nunca registra senha, hash, token ou segredo.
 */
export async function audit(
  client: SupabaseClient | null,
  entry: {
    action: AuditAction;
    actorId?: string | null;
    targetId?: string | null;
    email?: string | null;
    ip?: string | null;
    before?: Record<string, unknown> | null;
    after?: Record<string, unknown> | null;
    details?: Record<string, unknown> | null;
  }
): Promise<void> {
  const row = {
    acao: entry.action,
    ator_id: entry.actorId ?? null,
    alvo_id: entry.targetId ?? null,
    email: entry.email ?? null,
    ip: entry.ip ?? null,
    antes: stripSensitive(entry.before),
    depois: stripSensitive(entry.after),
    detalhes: stripSensitive(entry.details),
    created_at: new Date().toISOString()
  };

  console.log('[AUDIT]', JSON.stringify(row));

  if (!client) return;
  try {
    const { error } = await client.from('auditoria_usuarios').insert([row]);
    if (error && !auditTableMissingWarned) {
      auditTableMissingWarned = true;
      console.warn('[AUDIT] Não foi possível gravar em auditoria_usuarios (aplique a migração de segurança):', error.code);
    }
  } catch {
    // auditoria nunca deve derrubar a requisição
  }
}
