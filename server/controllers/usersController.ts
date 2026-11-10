import { Response } from 'express';
import { getBackendSupabaseClient } from '../services/supabaseBackend';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import {
  audit,
  generateTemporaryPassword,
  getClientIp,
  hashPassword,
  isUndefinedColumnError,
  markOptionalColumns,
  normalizePhone,
  sanitizeBelt,
  sanitizeDegrees,
  sanitizeShortText,
  validateName
} from '../services/security';

export const DEFAULT_ADMIN_PERMISSIONS = {
  canManageUsers: true,
  canManageStudents: true,
  canManageClasses: true,
  canManageFinancial: true,
  canManageGraduations: true,
  canManageSettings: true,
  canManageEvents: true,
  canManageTechniques: true,
  canManageProducts: true
};

export const DEFAULT_PROFESSOR_PERMISSIONS = {
  canManageUsers: false,
  canManageStudents: true,
  canManageClasses: true,
  canManageFinancial: false,
  canManageGraduations: true,
  canManageSettings: false,
  canManageEvents: true,
  canManageTechniques: true,
  canManageProducts: false
};

export const DEFAULT_STUDENT_PERMISSIONS = {
  canManageUsers: false,
  canManageStudents: false,
  canManageClasses: false,
  canManageFinancial: false,
  canManageGraduations: false,
  canManageSettings: false,
  canManageEvents: false,
  canManageTechniques: false,
  canManageProducts: false
};

export type UserRole = 'admin' | 'professor' | 'aluno';

export function defaultPermissions(role: UserRole) {
  switch (role) {
    case 'admin':
      return DEFAULT_ADMIN_PERMISSIONS;
    case 'professor':
      return DEFAULT_PROFESSOR_PERMISSIONS;
    default:
      return DEFAULT_STUDENT_PERMISSIONS;
  }
}

/**
 * Colunas existentes e seguras da tabela usuarios (esquema real, seção 1.4).
 * Sem updated_at (não existe), sem password.
 */
export const SAFE_USER_FIELDS =
  'id, nome, email, role, status, is_master_admin, professor_id, student_id, ' +
  'faixa, graus, telefone, permissions, created_at';

const LISTABLE_STATUSES = new Set(['pendente', 'ativo', 'aprovado', 'reprovado', 'inativo']);

function paramId(req: AuthenticatedRequest): string {
  const id = req.params.id;
  return typeof id === 'string' && id.length > 0 && id.length <= 100 ? id : '';
}

/** Mantém perfil_solicitado (dados do cadastro) ao redefinir permissões. */
function mergePermissions(role: UserRole, current: any) {
  const perfil = current && typeof current === 'object' ? current.perfil_solicitado : undefined;
  return perfil ? { ...defaultPermissions(role), perfil_solicitado: perfil } : { ...defaultPermissions(role) };
}

export class UsersController {
  /**
   * GET /users — lista com colunas explícitas e seguras (admin).
   */
  static async listUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const client = getBackendSupabaseClient();
      const status = typeof req.query.status === 'string' ? req.query.status : undefined;

      let query = client.from('usuarios').select(SAFE_USER_FIELDS).order('created_at', { ascending: false });

      if (status && status !== 'todos') {
        if (!LISTABLE_STATUSES.has(status)) {
          res.status(400).json({ success: false, error: 'Filtro de status inválido.' });
          return;
        }
        // 'aprovado' é legado: a aba "aprovados" mostra ativo + aprovado
        query = status === 'aprovado' || status === 'ativo'
          ? query.in('status', ['ativo', 'aprovado'])
          : query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) {
        console.error('[USERS LIST DB ERROR]', error.code);
        res.status(500).json({ success: false, error: 'Falha ao consultar usuários no banco de dados.' });
        return;
      }

      const safeUsers = (data || []).map((row: any) => ({
        ...row,
        telefone: row.telefone || '',
        permissions: row.permissions || defaultPermissions(row.role as UserRole)
      }));

      res.json({ success: true, users: safeUsers });
    } catch {
      res.status(500).json({ success: false, error: 'Erro interno ao listar usuários.' });
    }
  }

  /**
   * POST /users/:id/approve — fluxo da seção 8.2.
   * Sem criação automática de perfis; vínculo inequívoco por e-mail exato; grava status 'ativo'.
   */
  static async approveUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = paramId(req);
    if (!userId) {
      res.status(400).json({ success: false, error: 'ID do usuário obrigatório.' });
      return;
    }

    if (req.user?.id === userId) {
      res.status(403).json({ success: false, error: 'Não é permitido aprovar a sua própria conta.' });
      return;
    }

    try {
      const client = getBackendSupabaseClient();

      const { data: userRow, error: findErr } = await client
        .from('usuarios')
        .select('id, nome, email, role, status, is_master_admin, professor_id, student_id, permissions')
        .eq('id', userId)
        .maybeSingle();

      if (findErr) {
        res.status(500).json({ success: false, error: 'Falha ao consultar dados do usuário para aprovação.' });
        return;
      }
      if (!userRow) {
        res.status(404).json({ success: false, error: 'Usuário não encontrado.' });
        return;
      }
      if (userRow.status !== 'pendente') {
        res.status(409).json({ success: false, error: 'Apenas cadastros pendentes podem ser aprovados.' });
        return;
      }
      if (userRow.is_master_admin === true || (userRow.role === 'admin' && !req.user?.isMasterAdmin)) {
        res.status(403).json({ success: false, error: 'Somente o administrador master pode aprovar contas de administrador.' });
        return;
      }

      const cleanEmail = String(userRow.email || '').trim().toLowerCase();
      let assignedProfId: string | null = null;
      let assignedStudentId: string | null = null;

      const resolveLink = async (
        table: 'professores' | 'alunos',
        linkColumn: 'professor_id' | 'student_id',
        existingId: string | null,
        label: string
      ): Promise<string | null | false> => {
        let targetId: string;
        if (existingId) {
          const { data: rec, error } = await client.from(table).select('id').eq('id', existingId).maybeSingle();
          if (error) {
            res.status(500).json({ success: false, error: `Falha ao consultar cadastro de ${label}.` });
            return false;
          }
          if (!rec) {
            res.status(409).json({ success: false, error: `O vínculo informado (${existingId}) não existe na tabela de ${label}s.` });
            return false;
          }
          targetId = rec.id;
        } else {
          const { data: matches, error } = await client.from(table).select('id').eq('email', cleanEmail);
          if (error) {
            res.status(500).json({ success: false, error: `Falha ao consultar cadastro de ${label}.` });
            return false;
          }
          if (!matches || matches.length === 0) {
            res.status(409).json({
              success: false,
              error: `Não existe cadastro de ${label} com o e-mail "${cleanEmail}". Crie o cadastro antes de aprovar a conta de acesso.`
            });
            return false;
          }
          if (matches.length > 1) {
            res.status(409).json({
              success: false,
              error: `Há mais de um cadastro de ${label} com o e-mail "${cleanEmail}". Resolva a duplicidade antes de aprovar.`
            });
            return false;
          }
          targetId = matches[0].id;
        }

        const { data: inUse, error: inUseErr } = await client
          .from('usuarios')
          .select('id')
          .eq(linkColumn, targetId)
          .neq('id', userId)
          .limit(1);
        if (inUseErr) {
          res.status(500).json({ success: false, error: 'Falha ao verificar vínculos existentes.' });
          return false;
        }
        if (inUse && inUse.length > 0) {
          res.status(409).json({ success: false, error: `O cadastro de ${label} ${targetId} já está vinculado a outra conta de usuário.` });
          return false;
        }
        return targetId;
      };

      if (userRow.role === 'professor') {
        const r = await resolveLink('professores', 'professor_id', userRow.professor_id || null, 'professor');
        if (r === false) return;
        assignedProfId = r;
      } else if (userRow.role === 'aluno') {
        const r = await resolveLink('alunos', 'student_id', userRow.student_id || null, 'aluno');
        if (r === false) return;
        assignedStudentId = r;
      }

      const updatePayload: Record<string, unknown> = {
        status: 'ativo',
        permissions: mergePermissions(userRow.role as UserRole, userRow.permissions)
      };
      if (assignedProfId) updatePayload.professor_id = assignedProfId;
      if (assignedStudentId) updatePayload.student_id = assignedStudentId;

      // Proteção de concorrência: altera apenas se ainda estiver pendente; no máximo 1 linha
      const { data: updated, error: updErr } = await client
        .from('usuarios')
        .update(updatePayload)
        .eq('id', userId)
        .eq('status', 'pendente')
        .select('id, nome, email, role, status, professor_id, student_id');

      if (updErr) {
        res.status(500).json({ success: false, error: 'Falha ao gravar aprovação no banco de dados.' });
        return;
      }
      if (!updated || updated.length !== 1) {
        res.status(409).json({ success: false, error: 'A conta já foi processada por outro administrador ou não está mais pendente.' });
        return;
      }

      await audit(client, {
        action: 'aprovacao',
        actorId: req.user?.id,
        targetId: userId,
        email: cleanEmail,
        ip: getClientIp(req),
        before: { status: userRow.status, professor_id: userRow.professor_id, student_id: userRow.student_id },
        after: { status: 'ativo', professor_id: assignedProfId, student_id: assignedStudentId }
      });

      res.json({
        success: true,
        message: 'Usuário aprovado com sucesso.',
        user: {
          id: updated[0].id,
          nome: updated[0].nome,
          email: cleanEmail,
          role: updated[0].role,
          status: 'ativo',
          professorId: assignedProfId,
          studentId: assignedStudentId
        }
      });
    } catch {
      res.status(500).json({ success: false, error: 'Erro interno ao processar aprovação.' });
    }
  }

  /**
   * POST /users/:id/reject — bloqueia contra si mesmo, master e (para admin comum) outros admins.
   */
  static async rejectUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = paramId(req);
    if (!userId) {
      res.status(400).json({ success: false, error: 'ID do usuário obrigatório.' });
      return;
    }
    if (req.user?.id === userId) {
      res.status(403).json({ success: false, error: 'Não é permitido reprovar a sua própria conta.' });
      return;
    }

    try {
      const client = getBackendSupabaseClient();
      const { data: target, error: checkErr } = await client
        .from('usuarios')
        .select('id, email, role, status, is_master_admin')
        .eq('id', userId)
        .maybeSingle();

      if (checkErr) {
        res.status(500).json({ success: false, error: 'Falha ao verificar dados do usuário.' });
        return;
      }
      if (!target) {
        res.status(404).json({ success: false, error: 'Usuário não encontrado.' });
        return;
      }
      if (target.is_master_admin === true) {
        res.status(403).json({ success: false, error: 'Não é permitido reprovar o administrador master.' });
        return;
      }
      if (target.role === 'admin' && !req.user?.isMasterAdmin) {
        res.status(403).json({ success: false, error: 'Somente o administrador master pode reprovar um administrador.' });
        return;
      }

      const { data, error } = await client
        .from('usuarios')
        .update({ status: 'reprovado' })
        .eq('id', userId)
        .eq('is_master_admin', false)
        .select('id');

      if (error) {
        res.status(500).json({ success: false, error: 'Erro ao reprovar usuário no banco de dados.' });
        return;
      }
      if (!data || data.length !== 1) {
        res.status(409).json({ success: false, error: 'Usuário não encontrado ou já alterado.' });
        return;
      }

      await audit(client, {
        action: 'reprovacao',
        actorId: req.user?.id,
        targetId: userId,
        email: target.email,
        ip: getClientIp(req),
        before: { status: target.status },
        after: { status: 'reprovado' }
      });

      res.json({ success: true, message: 'Usuário reprovado com sucesso.' });
    } catch {
      res.status(500).json({ success: false, error: 'Erro interno ao reprovar usuário.' });
    }
  }

  /**
   * PATCH /users/:id/role — exige master (seção 6.3).
   * Nunca concede is_master_admin; bloqueia o próprio papel e o papel de um master.
   * Ignora quaisquer outros campos enviados no corpo.
   */
  static async updateRole(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = paramId(req);
    const role = req.body?.role;

    if (!userId) {
      res.status(400).json({ success: false, error: 'ID do usuário obrigatório.' });
      return;
    }
    if (role !== 'admin' && role !== 'professor' && role !== 'aluno') {
      res.status(400).json({ success: false, error: 'Papel inválido. Use admin, professor ou aluno.' });
      return;
    }
    if (!req.user?.isMasterAdmin) {
      res.status(403).json({ success: false, error: 'A operação exige Administrador master.' });
      return;
    }
    if (req.user.id === userId) {
      res.status(403).json({ success: false, error: 'Não é permitido alterar o papel da sua própria conta.' });
      return;
    }

    try {
      const client = getBackendSupabaseClient();
      const { data: current, error: findErr } = await client
        .from('usuarios')
        .select('id, email, role, is_master_admin, permissions')
        .eq('id', userId)
        .maybeSingle();

      if (findErr) {
        res.status(500).json({ success: false, error: 'Falha ao consultar o usuário.' });
        return;
      }
      if (!current) {
        res.status(404).json({ success: false, error: 'Usuário não encontrado.' });
        return;
      }
      if (current.is_master_admin === true) {
        res.status(403).json({ success: false, error: 'Não é permitido alterar o papel do administrador master.' });
        return;
      }

      const { data, error } = await client
        .from('usuarios')
        .update({
          role,
          is_master_admin: false,
          permissions: mergePermissions(role as UserRole, current.permissions)
        })
        .eq('id', userId)
        .eq('is_master_admin', false)
        .select('id, nome, email, role, is_master_admin, permissions, professor_id, student_id');

      if (error) {
        res.status(500).json({ success: false, error: 'Falha ao atualizar o papel do usuário.' });
        return;
      }
      if (!data || data.length !== 1) {
        res.status(409).json({ success: false, error: 'O perfil mudou durante a operação. Atualize a página e tente novamente.' });
        return;
      }

      await audit(client, {
        action: 'mudanca_papel',
        actorId: req.user.id,
        targetId: userId,
        email: current.email,
        ip: getClientIp(req),
        before: { role: current.role },
        after: { role }
      });

      res.json({ success: true, message: `Perfil atualizado para ${role} com sucesso.`, user: data[0] });
    } catch {
      res.status(500).json({ success: false, error: 'Erro interno ao atualizar o perfil do usuário.' });
    }
  }

  /**
   * PATCH /users/me — dados próprios (seção 6.1). Lista branca: nome, telefone.
   */
  static async updateMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Não autenticado.' });
      return;
    }

    const body = req.body || {};
    const payload: Record<string, unknown> = {};

    if (body.nome !== undefined) {
      const check = validateName(body.nome);
      if (!check.ok) {
        res.status(400).json({ success: false, error: check.message });
        return;
      }
      payload.nome = check.value;
    }
    if (body.telefone !== undefined) {
      const check = normalizePhone(body.telefone);
      if (!check.ok) {
        res.status(400).json({ success: false, error: check.message });
        return;
      }
      payload.telefone = check.value;
    }

    if (Object.keys(payload).length === 0) {
      res.status(400).json({ success: false, error: 'Nenhum campo permitido para atualização (nome, telefone).' });
      return;
    }

    try {
      const client = getBackendSupabaseClient();
      const { data: before } = await client.from('usuarios').select('nome, telefone').eq('id', userId).maybeSingle();
      const { data, error } = await client
        .from('usuarios')
        .update(payload)
        .eq('id', userId)
        .select('id, nome, telefone');

      if (error || !data || data.length !== 1) {
        res.status(500).json({ success: false, error: 'Não foi possível atualizar seus dados.' });
        return;
      }

      await audit(client, { action: 'mudanca_perfil', actorId: userId, targetId: userId, ip: getClientIp(req), before, after: payload });
      res.json({ success: true, user: data[0] });
    } catch {
      res.status(500).json({ success: false, error: 'Erro interno ao atualizar dados.' });
    }
  }

  /**
   * PATCH /users/:id — atualização por admin (seção 6.2).
   * Campos: nome, telefone, faixa, graus. Nunca em master; admin-alvo só por master.
   * faixa/graus exigem confirmGraduationChange === true. E-mail não é alterado por esta rota.
   */
  static async adminUpdateUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = paramId(req);
    if (!userId) {
      res.status(400).json({ success: false, error: 'ID do usuário obrigatório.' });
      return;
    }

    const body = req.body || {};
    if (body.email !== undefined) {
      res.status(400).json({ success: false, error: 'A alteração de e-mail exige fluxo próprio de verificação e não é feita por esta rota.' });
      return;
    }

    const payload: Record<string, unknown> = {};
    if (body.nome !== undefined) {
      const check = validateName(body.nome);
      if (!check.ok) {
        res.status(400).json({ success: false, error: check.message });
        return;
      }
      payload.nome = check.value;
    }
    if (body.telefone !== undefined) {
      const check = normalizePhone(body.telefone);
      if (!check.ok) {
        res.status(400).json({ success: false, error: check.message });
        return;
      }
      payload.telefone = check.value;
    }
    const touchesGraduation = body.faixa !== undefined || body.graus !== undefined;
    if (touchesGraduation) {
      if (body.confirmGraduationChange !== true) {
        res.status(400).json({ success: false, error: 'Alterações de faixa/graus exigem confirmação explícita (confirmGraduationChange).' });
        return;
      }
      if (body.faixa !== undefined) payload.faixa = sanitizeBelt(body.faixa, '');
      if (body.graus !== undefined) {
        const g = sanitizeDegrees(body.graus);
        if (g === null) {
          res.status(400).json({ success: false, error: 'Graus inválidos (0 a 10).' });
          return;
        }
        payload.graus = g;
      }
      if (payload.faixa === '') {
        res.status(400).json({ success: false, error: 'Faixa inválida.' });
        return;
      }
    }

    if (Object.keys(payload).length === 0) {
      res.status(400).json({ success: false, error: 'Nenhum campo permitido para atualização (nome, telefone, faixa, graus).' });
      return;
    }

    try {
      const client = getBackendSupabaseClient();
      const { data: target, error: findErr } = await client
        .from('usuarios')
        .select('id, email, role, is_master_admin, nome, telefone, faixa, graus')
        .eq('id', userId)
        .maybeSingle();

      if (findErr) {
        res.status(500).json({ success: false, error: 'Falha ao consultar o usuário.' });
        return;
      }
      if (!target) {
        res.status(404).json({ success: false, error: 'Usuário não encontrado.' });
        return;
      }
      if (target.is_master_admin === true) {
        res.status(403).json({ success: false, error: 'Os dados do administrador master não podem ser alterados por esta rota.' });
        return;
      }
      if (target.role === 'admin' && !req.user?.isMasterAdmin) {
        res.status(403).json({ success: false, error: 'Somente o administrador master pode alterar dados de outro administrador.' });
        return;
      }

      const { data, error } = await client
        .from('usuarios')
        .update(payload)
        .eq('id', userId)
        .eq('is_master_admin', false)
        .select('id, nome, telefone, faixa, graus');

      if (error || !data || data.length !== 1) {
        res.status(500).json({ success: false, error: 'Não foi possível atualizar o usuário.' });
        return;
      }

      await audit(client, {
        action: 'mudanca_perfil',
        actorId: req.user?.id,
        targetId: userId,
        email: target.email,
        ip: getClientIp(req),
        before: { nome: target.nome, telefone: target.telefone, faixa: target.faixa, graus: target.graus },
        after: payload
      });

      res.json({ success: true, user: data[0] });
    } catch {
      res.status(500).json({ success: false, error: 'Erro interno ao atualizar o usuário.' });
    }
  }

  /**
   * POST /users/:id/reset-password — reset assistido (seção 9.5).
   * Gera senha provisória exibida UMA vez, com must_change_password = true.
   * Master só por master; admin-alvo só por master; nunca a própria conta.
   */
  static async adminResetPassword(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = paramId(req);
    const motivo = sanitizeShortText(req.body?.motivo, 300);

    if (!userId) {
      res.status(400).json({ success: false, error: 'ID do usuário obrigatório.' });
      return;
    }
    if (!motivo || motivo.length < 5) {
      res.status(400).json({ success: false, error: 'Informe o motivo da redefinição (mínimo 5 caracteres).' });
      return;
    }
    if (req.user?.id === userId) {
      res.status(403).json({ success: false, error: 'Para a sua própria conta, use "Alterar senha".' });
      return;
    }

    try {
      const client = getBackendSupabaseClient();
      const { data: target, error: findErr } = await client
        .from('usuarios')
        .select('id, email, role, status, is_master_admin')
        .eq('id', userId)
        .maybeSingle();

      if (findErr) {
        res.status(500).json({ success: false, error: 'Falha ao consultar o usuário.' });
        return;
      }
      if (!target) {
        res.status(404).json({ success: false, error: 'Usuário não encontrado.' });
        return;
      }
      if ((target.is_master_admin === true || target.role === 'admin') && !req.user?.isMasterAdmin) {
        res.status(403).json({ success: false, error: 'Somente o administrador master pode redefinir a senha de um administrador.' });
        return;
      }
      if (target.is_master_admin === true) {
        res.status(403).json({ success: false, error: 'A senha do administrador master só pode ser trocada pelo próprio master.' });
        return;
      }

      const temporaryPassword = generateTemporaryPassword();
      const { data, error } = await client
        .from('usuarios')
        .update({
          password: await hashPassword(temporaryPassword),
          must_change_password: true,
          password_changed_at: new Date().toISOString()
        })
        .eq('id', userId)
        .eq('is_master_admin', false)
        .select('id');

      if (error) {
        if (isUndefinedColumnError(error)) {
          markOptionalColumns(false);
          res.status(503).json({
            success: false,
            error: 'Recurso indisponível: aplique a migração de segurança (colunas must_change_password/password_changed_at).'
          });
          return;
        }
        res.status(500).json({ success: false, error: 'Não foi possível redefinir a senha.' });
        return;
      }
      if (!data || data.length !== 1) {
        res.status(409).json({ success: false, error: 'Usuário não encontrado ou alterado durante a operação.' });
        return;
      }

      await audit(client, {
        action: 'senha_provisoria',
        actorId: req.user?.id,
        targetId: userId,
        email: target.email,
        ip: getClientIp(req),
        details: { motivo }
      });

      res.set('Cache-Control', 'no-store');
      res.json({
        success: true,
        message: 'Senha provisória gerada. Ela é exibida apenas agora; entregue por canal seguro. A troca será exigida no primeiro acesso.',
        temporaryPassword
      });
    } catch {
      res.status(500).json({ success: false, error: 'Erro interno ao redefinir senha.' });
    }
  }

  /**
   * POST /users/reconcile — exige master (seção 6.6).
   * dryRun por padrão (só relatório). Aplicar exige { apply: true, confirm: "APLICAR" }.
   * Não promove/rebaixa e não cria perfis.
   */
  static async reconcileUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user?.isMasterAdmin) {
      res.status(403).json({ success: false, error: 'A operação exige Administrador master.' });
      return;
    }

    const apply = req.body?.apply === true && req.body?.confirm === 'APLICAR';

    try {
      const client = getBackendSupabaseClient();
      const errors: string[] = [];
      const planned: Array<{ userId: string; column: 'professor_id' | 'student_id'; value: string }> = [];
      let reconciledCount = 0;

      const { data: activeUsers, error } = await client
        .from('usuarios')
        .select('id, email, role, professor_id, student_id')
        .in('status', ['ativo', 'aprovado']);

      if (error || !activeUsers) {
        res.status(500).json({ success: false, error: 'Falha ao buscar usuários para reconciliação.' });
        return;
      }

      for (const user of activeUsers) {
        const cleanEmail = String(user.email || '').trim().toLowerCase();
        if (!cleanEmail) continue;

        let table: 'professores' | 'alunos' | null = null;
        let column: 'professor_id' | 'student_id' | null = null;
        if (user.role === 'professor' && !user.professor_id) {
          table = 'professores';
          column = 'professor_id';
        } else if (user.role === 'aluno' && !user.student_id) {
          table = 'alunos';
          column = 'student_id';
        }
        if (!table || !column) continue;

        const { data: matches, error: mErr } = await client.from(table).select('id').eq('email', cleanEmail);
        if (mErr || !matches || matches.length !== 1) {
          errors.push(`Vínculo não resolvido (${matches?.length ?? 0} correspondências): ${user.id}`);
          continue;
        }

        const { data: inUse } = await client.from('usuarios').select('id').eq(column, matches[0].id).neq('id', user.id).limit(1);
        if (inUse && inUse.length > 0) {
          errors.push(`Perfil ${matches[0].id} já vinculado a outro usuário.`);
          continue;
        }

        planned.push({ userId: user.id, column, value: matches[0].id });

        if (apply) {
          const { data: updated, error: updErr } = await client
            .from('usuarios')
            .update({ [column]: matches[0].id })
            .eq('id', user.id)
            .is(column, null)
            .select('id');
          if (updErr) {
            errors.push(`Falha ao vincular: ${user.id}`);
          } else if (updated && updated.length === 1) {
            reconciledCount++;
          }
        }
      }

      if (apply) {
        await audit(client, {
          action: 'reconciliacao',
          actorId: req.user.id,
          ip: getClientIp(req),
          details: { aplicados: reconciledCount, planejados: planned.length, erros: errors.length }
        });
      }

      res.json({
        success: errors.length === 0,
        dryRun: !apply,
        planned,
        reconciledCount,
        errors
      });
    } catch {
      res.status(500).json({ success: false, error: 'Erro durante a reconciliação.' });
    }
  }
}
