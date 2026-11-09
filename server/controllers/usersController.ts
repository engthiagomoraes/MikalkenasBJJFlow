import { Request, Response } from 'express';
import { getBackendSupabaseClient } from '../services/supabaseBackend';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

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

type UserRole = 'admin' | 'professor' | 'aluno';

function defaultPermissions(role: UserRole) {
  switch (role) {
    case 'admin':
      return DEFAULT_ADMIN_PERMISSIONS;
    case 'professor':
      return DEFAULT_PROFESSOR_PERMISSIONS;
    case 'aluno':
      return DEFAULT_STUDENT_PERMISSIONS;
  }
}

const SAFE_USER_FIELDS =
  'id, nome, email, role, status, is_master_admin, professor_id, student_id, ' +
  'faixa, graus, telefone, permissions, created_at, updated_at';

export class UsersController {
  /**
   * Lista usuários sem retornar senha ou hash.
   * Utiliza select('*') para tolerar esquemas com ou sem colunas opcionais (telefone, etc.)
   */
  static async listUsers(req: Request, res: Response): Promise<void> {
    try {
      const client = getBackendSupabaseClient();
      const status =
        typeof req.query.status === 'string' ? req.query.status : undefined;

      let query = client
        .from('usuarios')
        .select('*')
        .order('created_at', { ascending: false });

      if (status && status !== 'todos') {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) {
        console.error('[USERS LIST DB ERROR]', error);
        res.status(500).json({ success: false, error: error.message });
        return;
      }

      const safeUsers = (data || []).map((row: any) => {
        const { password: _, ...safe } = row;
        return {
          ...safe,
          telefone: safe.telefone || safe.permissions?.telefone || '',
          permissions: safe.permissions || defaultPermissions(safe.role as UserRole)
        };
      });

      res.json({ success: true, users: safeUsers });
    } catch {
      res.status(500).json({
        success: false,
        error: 'Erro ao listar usuários.'
      });
    }
  }

  /**
   * Aprova o usuário. Mantém a RPC existente, se instalada; caso contrário,
   * executa a vinculação manual sem conceder privilégios master.
   */
  static async approveUser(req: Request, res: Response): Promise<void> {
    const userId = req.params.id;

    if (!userId) {
      res.status(400).json({
        success: false,
        error: 'ID do usuário obrigatório.'
      });
      return;
    }

    try {
      const client = getBackendSupabaseClient();

      const { data: rpcData, error: rpcErr } = await client.rpc(
        'aprovar_usuario',
        { p_user_id: userId }
      );

      if (!rpcErr) {
        res.json({
          success: true,
          result: rpcData,
          message: 'Usuário aprovado via RPC com sucesso.'
        });
        return;
      }

      // Somente a ausência da RPC permite o fallback. Outro erro deve ser
      // investigado, não ocultado por uma segunda implementação.
      if (rpcErr.code !== '42883' && rpcErr.code !== 'PGRST202') {
        res.status(500).json({
          success: false,
          error: 'Falha na função de aprovação do banco de dados.'
        });
        return;
      }

      const { data: userRow, error: findErr } = await client
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (findErr) {
        res.status(500).json({
          success: false,
          error: 'Falha ao consultar o usuário.'
        });
        return;
      }

      if (!userRow) {
        res.status(404).json({
          success: false,
          error: 'Usuário não encontrado.'
        });
        return;
      }

      let assignedProfId: string | null = userRow.professor_id || null;
      let assignedStudentId: string | null = userRow.student_id || null;
      const cleanEmail = String(userRow.email || '').toLowerCase().trim();
      const userPhone = userRow.telefone || userRow.permissions?.telefone || '';

      if (userRow.role === 'professor' && !assignedProfId) {
        const { data: existingProf, error: profErr } = await client
          .from('professores')
          .select('id')
          .ilike('email', cleanEmail)
          .limit(2);

        if (profErr) {
          res.status(500).json({
            success: false,
            error: 'Falha ao procurar o cadastro do professor.'
          });
          return;
        }

        if ((existingProf || []).length > 1) {
          res.status(409).json({
            success: false,
            error: 'Há mais de um professor com este e-mail. Resolva a duplicidade antes da aprovação.'
          });
          return;
        }

        if (existingProf?.length === 1) {
          assignedProfId = existingProf[0].id;
        } else {
          const newProfId = `prof-${Date.now()}`;
          const { error: insProfErr } = await client
            .from('professores')
            .insert([{
              id: newProfId,
              nome: userRow.nome,
              email: cleanEmail,
              telefone: userPhone,
              faixa: userRow.faixa || 'preta',
              graus: Number(userRow.graus || 0),
              bio: userRow.permissions?.bio || '',
              registro_cbjj: userRow.permissions?.registroCBJJ || '',
              chave_pix: userRow.permissions?.chavePix || '',
              banco: '',
              turmas: []
            }]);

          if (insProfErr) {
            console.error('[APPROVE PROF INSERT ERROR]', insProfErr);
            res.status(500).json({
              success: false,
              error: 'Falha ao criar o perfil de professor: ' + insProfErr.message
            });
            return;
          }

          assignedProfId = newProfId;
        }
      } else if (userRow.role === 'aluno' && !assignedStudentId) {
        const { data: existingStudents, error: studentErr } = await client
          .from('alunos')
          .select('id')
          .ilike('email', cleanEmail)
          .limit(2);

        if (studentErr) {
          res.status(500).json({
            success: false,
            error: 'Falha ao procurar o cadastro do aluno.'
          });
          return;
        }

        if ((existingStudents || []).length > 1) {
          res.status(409).json({
            success: false,
            error: 'Há mais de um aluno com este e-mail. Resolva a duplicidade antes da aprovação.'
          });
          return;
        }

        if (existingStudents?.length === 1) {
          assignedStudentId = existingStudents[0].id;
        } else {
          const newStudentId = `student-${Date.now()}`;
          const { error: insStudentErr } = await client
            .from('alunos')
            .insert([{
              id: newStudentId,
              nome: userRow.nome,
              email: cleanEmail,
              telefone: userPhone,
              faixa: userRow.faixa || 'branca',
              graus: Number(userRow.graus || 0),
              data_inicio: new Date().toISOString().split('T')[0],
              data_nascimento: userRow.permissions?.dataNascimento || null,
              turma_preferida: userRow.permissions?.turmaPreferencia || null,
              status_pagamento: 'em_dia',
              plano: userRow.permissions?.plano || 'Mensal',
              valor_mensalidade: 180,
              dia_vencimento: 10
            }]);

          if (insStudentErr) {
            console.error('[APPROVE STUDENT INSERT ERROR]', insStudentErr);
            res.status(500).json({
              success: false,
              error: 'Falha ao criar o perfil de aluno: ' + insStudentErr.message
            });
            return;
          }

          assignedStudentId = newStudentId;
        }
      }

      const updatePayload: Record<string, unknown> = {
        status: 'aprovado'
      };

      if (assignedProfId) updatePayload.professor_id = assignedProfId;
      if (assignedStudentId) updatePayload.student_id = assignedStudentId;

      const { data: updated, error: updErr } = await client
        .from('usuarios')
        .update(updatePayload)
        .eq('id', userId)
        .select('id')
        .maybeSingle();

      if (updErr || !updated) {
        res.status(500).json({
          success: false,
          error: 'Falha ao concluir a aprovação do usuário.'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Usuário aprovado com sucesso.',
        user: {
          id: userRow.id,
          nome: userRow.nome,
          email: cleanEmail,
          role: userRow.role,
          status: 'aprovado',
          professorId: assignedProfId,
          studentId: assignedStudentId
        }
      });
    } catch {
      res.status(500).json({
        success: false,
        error: 'Falha ao aprovar usuário.'
      });
    }
  }

  static async rejectUser(req: Request, res: Response): Promise<void> {
    const userId = req.params.id;

    if (!userId) {
      res.status(400).json({
        success: false,
        error: 'ID do usuário obrigatório.'
      });
      return;
    }

    try {
      const client = getBackendSupabaseClient();
      const { data, error } = await client
        .from('usuarios')
        .update({ status: 'reprovado' })
        .eq('id', userId)
        .select('id')
        .maybeSingle();

      if (error) {
        res.status(500).json({
          success: false,
          error: 'Erro ao reprovar usuário.'
        });
        return;
      }

      if (!data) {
        res.status(404).json({
          success: false,
          error: 'Usuário não encontrado.'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Usuário reprovado com sucesso.'
      });
    } catch {
      res.status(500).json({
        success: false,
        error: 'Erro ao reprovar usuário.'
      });
    }
  }

  /**
   * Altera o papel de um usuário existente. Somente a rota protegida por
   * requireMasterAdmin pode chamar este método.
   *
   * Esta operação NÃO concede status master. Uma eventual transferência
   * desse privilégio exige um processo separado e auditado.
   */
  static async updateRole(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    const userId = req.params.id;
    const { role } = req.body || {};

    if (!userId) {
      res.status(400).json({
        success: false,
        error: 'ID do usuário obrigatório.'
      });
      return;
    }

    if (role !== 'admin' && role !== 'professor' && role !== 'aluno') {
      res.status(400).json({
        success: false,
        error: 'Papel inválido. Use admin, professor ou aluno.'
      });
      return;
    }

    if (!req.user?.isMasterAdmin) {
      res.status(403).json({
        success: false,
        error: 'A operação exige Administrador master.'
      });
      return;
    }

    try {
      const client = getBackendSupabaseClient();
      const { data: current, error: findErr } = await client
        .from('usuarios')
        .select('id, role, is_master_admin')
        .eq('id', userId)
        .maybeSingle();

      if (findErr) {
        res.status(500).json({
          success: false,
          error: 'Falha ao consultar o usuário.'
        });
        return;
      }

      if (!current) {
        res.status(404).json({
          success: false,
          error: 'Usuário não encontrado. Cadastre-o pelo fluxo de autenticação antes de alterar o papel.'
        });
        return;
      }

      if (current.is_master_admin === true && role !== 'admin') {
        res.status(409).json({
          success: false,
          error: 'Não é permitido remover o papel admin de um usuário master por esta rota.'
        });
        return;
      }

      const { data, error } = await client
        .from('usuarios')
        .update({
          role,
          permissions: defaultPermissions(role as UserRole)
          // is_master_admin permanece inalterado.
        })
        .eq('id', userId)
        .eq('role', current.role)
        .eq('is_master_admin', current.is_master_admin === true)
        .select(
          'id, nome, email, role, is_master_admin, permissions, ' +
          'professor_id, student_id'
        )
        .maybeSingle();

      if (error) {
        res.status(500).json({
          success: false,
          error: 'Falha ao atualizar o papel do usuário.'
        });
        return;
      }

      if (!data) {
        res.status(409).json({
          success: false,
          error: 'O perfil mudou durante a operação. Atualize a página e tente novamente.'
        });
        return;
      }

      res.json({
        success: true,
        message: `Perfil atualizado para ${role} com sucesso.`,
        user: data
      });
    } catch {
      res.status(500).json({
        success: false,
        error: 'Erro ao atualizar o perfil do usuário.'
      });
    }
  }

  /**
   * Vincula usuários aprovados a perfis já existentes por e-mail.
   * Não promove ninguém a admin nem concede status master.
   */
  static async reconcileUsers(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    if (!req.user?.isMasterAdmin) {
      res.status(403).json({
        success: false,
        error: 'A operação exige Administrador master.'
      });
      return;
    }

    try {
      const client = getBackendSupabaseClient();
      let reconciledCount = 0;
      const errors: string[] = [];

      const { data: approvedUsers, error } = await client
        .from('usuarios')
        .select('id, email, role, professor_id, student_id')
        .in('status', ['aprovado', 'ativo']);

      if (error || !approvedUsers) {
        res.status(500).json({
          success: false,
          error: 'Falha ao buscar usuários para reconciliação.'
        });
        return;
      }

      for (const user of approvedUsers) {
        const cleanEmail = String(user.email || '').toLowerCase().trim();
        if (!cleanEmail) continue;

        if (user.role === 'professor' && !user.professor_id) {
          const { data: profs, error: profErr } = await client
            .from('professores')
            .select('id')
            .ilike('email', cleanEmail)
            .limit(2);

          if (profErr || (profs || []).length !== 1) {
            errors.push(`Vínculo de professor não resolvido: ${user.id}`);
            continue;
          }

          const { data: updated, error: updErr } = await client
            .from('usuarios')
            .update({ professor_id: profs![0].id })
            .eq('id', user.id)
            .is('professor_id', null)
            .select('id');

          if (updErr) {
            errors.push(`Falha ao vincular professor: ${user.id}`);
          } else {
            reconciledCount += updated?.length || 0;
          }
        } else if (user.role === 'aluno' && !user.student_id) {
          const { data: students, error: studentErr } = await client
            .from('alunos')
            .select('id')
            .ilike('email', cleanEmail)
            .limit(2);

          if (studentErr || (students || []).length !== 1) {
            errors.push(`Vínculo de aluno não resolvido: ${user.id}`);
            continue;
          }

          const { data: updated, error: updErr } = await client
            .from('usuarios')
            .update({ student_id: students![0].id })
            .eq('id', user.id)
            .is('student_id', null)
            .select('id');

          if (updErr) {
            errors.push(`Falha ao vincular aluno: ${user.id}`);
          } else {
            reconciledCount += updated?.length || 0;
          }
        }
      }

      res.json({
        success: errors.length === 0,
        reconciledCount,
        errors
      });
    } catch {
      res.status(500).json({
        success: false,
        error: 'Erro durante a reconciliação.'
      });
    }
  }
}
