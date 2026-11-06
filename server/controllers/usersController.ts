import { Request, Response } from 'express';
import { getBackendSupabaseClient } from '../services/supabaseBackend';

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

export class UsersController {
  /**
   * Listar usuários com filtros de status (apenas campos seguros, NUNCA password ou hashes)
   */
  static async listUsers(req: Request, res: Response): Promise<void> {
    try {
      const client = getBackendSupabaseClient();
      const status = req.query.status as string;

      let query = client
        .from('usuarios')
        .select('id, nome, email, role, is_master_admin, status, professor_id, student_id, faixa, graus, permissions, telefone, created_at')
        .order('created_at', { ascending: false });

      if (status && status !== 'todos') {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) {
        res.status(500).json({ success: false, error: error.message });
        return;
      }

      res.json({ success: true, users: data || [] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Erro ao listar usuários.' });
    }
  }

  /**
   * Aprovar usuário e criar/vincular perfil de forma transacional e idempotente
   */
  static async approveUser(req: Request, res: Response): Promise<void> {
    const userId = req.params.id;

    if (!userId) {
      res.status(400).json({ success: false, error: 'ID do usuário obrigatório.' });
      return;
    }

    try {
      const client = getBackendSupabaseClient();

      // 1. Tentar RPC PostgreSQL 'aprovar_usuario' com privilégio SECURITY DEFINER
      const { data: rpcData, error: rpcErr } = await client.rpc('aprovar_usuario', { p_user_id: userId });

      if (!rpcErr) {
        res.json({ success: true, result: rpcData, message: 'Usuário aprovado via RPC com sucesso.' });
        return;
      }

      // Buscar usuário para fallback manual
      const { data: userRow, error: findErr } = await client
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (findErr || !userRow) {
        res.status(404).json({ success: false, error: findErr?.message || 'Usuário não encontrado.' });
        return;
      }

      // 2. Fallback idempotente se RPC não estiver instalada
      let assignedProfId = userRow.professor_id || null;
      let assignedStudentId = userRow.student_id || null;
      const cleanEmail = (userRow.email || '').toLowerCase().trim();

      if (userRow.role === 'professor') {
        if (!assignedProfId) {
          const { data: existingProf } = await client
            .from('professores')
            .select('id')
            .eq('email', cleanEmail)
            .maybeSingle();

          if (existingProf) {
            assignedProfId = existingProf.id;
          } else {
            const newProfId = `prof-${Date.now()}`;
            const { error: insProfErr } = await client.from('professores').insert([{
              id: newProfId,
              nome: userRow.nome,
              email: cleanEmail,
              telefone: userRow.telefone || '',
              faixa: userRow.faixa || 'preta',
              graus: Number(userRow.graus || 0),
              bio: '',
              registro_cbjj: '',
              chave_pix: '',
              banco: '',
              turmas: []
            }]);

            if (!insProfErr) {
              assignedProfId = newProfId;
            }
          }
        }
      } else if (userRow.role === 'aluno') {
        if (!assignedStudentId) {
          const { data: existingStudent } = await client
            .from('alunos')
            .select('id')
            .eq('email', cleanEmail)
            .maybeSingle();

          if (existingStudent) {
            assignedStudentId = existingStudent.id;
          } else {
            const newStudentId = `student-${Date.now()}`;
            const { error: insStudentErr } = await client.from('alunos').insert([{
              id: newStudentId,
              nome: userRow.nome,
              email: cleanEmail,
              telefone: userRow.telefone || '',
              faixa: userRow.faixa || 'branca',
              graus: Number(userRow.graus || 0),
              data_inicio: new Date().toISOString().split('T')[0],
              status_pagamento: 'em_dia',
              plano: 'Mensal',
              valor_mensalidade: 180,
              dia_vencimento: 10
            }]);

            if (!insStudentErr) {
              assignedStudentId = newStudentId;
            }
          }
        }
      }

      const updatePayload: Record<string, any> = { status: 'aprovado' };
      if (assignedProfId) updatePayload.professor_id = assignedProfId;
      if (assignedStudentId) updatePayload.student_id = assignedStudentId;

      const { error: updErr } = await client
        .from('usuarios')
        .update(updatePayload)
        .eq('id', userId);

      if (updErr) {
        res.status(500).json({ success: false, error: updErr.message });
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
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Falha ao aprovar usuário.' });
    }
  }

  /**
   * Reprovar usuário
   */
  static async rejectUser(req: Request, res: Response): Promise<void> {
    const userId = req.params.id;

    if (!userId) {
      res.status(400).json({ success: false, error: 'ID do usuário obrigatório.' });
      return;
    }

    try {
      const client = getBackendSupabaseClient();
      const { error } = await client
        .from('usuarios')
        .update({ status: 'reprovado' })
        .eq('id', userId);

      if (error) {
        res.status(500).json({ success: false, error: error.message });
        return;
      }

      res.json({ success: true, message: 'Usuário reprovado com sucesso.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Erro ao reprovar usuário.' });
    }
  }

  /**
   * Atualizar perfil e privilégios de um usuário (Ex: Professor -> Administrador)
   */
  static async updateRole(req: Request, res: Response): Promise<void> {
    const userId = req.params.id;
    const { role, permissions, professorId, studentId, nome, faixa, graus, telefone, email } = req.body;

    if (!role) {
      res.status(400).json({ success: false, error: 'Novo papel (role) é obrigatório.' });
      return;
    }

    try {
      const client = getBackendSupabaseClient();
      const isMaster = role === 'admin';
      const targetEmail = email ? email.toLowerCase().trim() : undefined;
      const finalPermissions = permissions || (
        role === 'admin' ? DEFAULT_ADMIN_PERMISSIONS :
        role === 'professor' ? DEFAULT_PROFESSOR_PERMISSIONS :
        DEFAULT_STUDENT_PERMISSIONS
      );

      // 1. Tentar atualizar por userId se for um UUID ou ID direto
      if (userId && !userId.startsWith('user-')) {
        const { error, data } = await client
          .from('usuarios')
          .update({
            role,
            is_master_admin: isMaster,
            permissions: finalPermissions,
            ...(professorId ? { professor_id: professorId } : {}),
            ...(studentId ? { student_id: studentId } : {}),
            ...(nome ? { nome } : {}),
            ...(faixa ? { faixa } : {}),
            ...(graus !== undefined ? { graus } : {}),
            ...(telefone ? { telefone } : {})
          })
          .eq('id', userId)
          .select('id, nome, email, role, is_master_admin, permissions, professor_id, student_id');

        if (!error && data && data.length > 0) {
          res.json({ success: true, message: `Perfil atualizado para ${role} com sucesso.`, user: data[0] });
          return;
        }
      }

      // 2. Tentar atualizar por professorId ou email
      if (professorId || targetEmail) {
        let query = client.from('usuarios').update({
          role,
          is_master_admin: isMaster,
          permissions: finalPermissions,
          ...(professorId ? { professor_id: professorId } : {}),
          ...(studentId ? { student_id: studentId } : {}),
          ...(nome ? { nome } : {}),
          ...(faixa ? { faixa } : {}),
          ...(graus !== undefined ? { graus } : {})
        });

        if (targetEmail && professorId) {
          query = query.or(`email.ilike.${targetEmail},professor_id.eq.${professorId}`);
        } else if (targetEmail) {
          query = query.ilike('email', targetEmail);
        } else if (professorId) {
          query = query.eq('professor_id', professorId);
        }

        const { error: updErr, data: updData } = await query.select('id, nome, email, role, is_master_admin, permissions, professor_id, student_id');
        if (!updErr && updData && updData.length > 0) {
          res.json({ success: true, message: `Perfil atualizado para ${role} com sucesso.`, user: updData[0] });
          return;
        }
      }

      // 3. Se usuário não existia em 'usuarios', cria o registro seguro
      if (targetEmail) {
        const newUserId = userId && !userId.startsWith('user-') ? userId : `user-${professorId || Date.now()}`;
        const { data: insData, error: insErr } = await client.from('usuarios').insert([{
          id: newUserId,
          nome: nome || targetEmail.split('@')[0],
          email: targetEmail,
          role,
          is_master_admin: isMaster,
          permissions: finalPermissions,
          professor_id: professorId || null,
          student_id: studentId || null,
          faixa: faixa || null,
          graus: graus || 0,
          status: 'aprovado',
          telefone: telefone || null
        }]).select('id, nome, email, role, is_master_admin, permissions, professor_id, student_id');

        if (insErr) {
          res.status(500).json({ success: false, error: insErr.message });
          return;
        }

        res.json({ success: true, message: `Perfil criado e atualizado para ${role} com sucesso.`, user: insData?.[0] });
        return;
      }

      res.status(404).json({ success: false, error: 'Usuário não localizado para atualização de perfil.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Erro ao atualizar perfil do usuário.' });
    }
  }

  /**
   * Reconciliação segura executada no servidor para usuários aprovados e vinculação de administradores
   */
  static async reconcileUsers(req: Request, res: Response): Promise<void> {
    try {
      const client = getBackendSupabaseClient();
      let reconciledCount = 0;
      const errors: string[] = [];

      const { data: approvedUsers, error } = await client
        .from('usuarios')
        .select('*')
        .in('status', ['aprovado', 'ativo']);

      if (error || !approvedUsers) {
        res.status(500).json({ success: false, error: error?.message || 'Falha ao buscar usuários para reconciliação.' });
        return;
      }

      for (const u of approvedUsers) {
        const cleanEmail = (u.email || '').toLowerCase().trim();

        if (u.role === 'professor' && !u.professor_id) {
          const { data: prof } = await client.from('professores').select('id').eq('email', cleanEmail).maybeSingle();
          if (prof) {
            await client.from('usuarios').update({ professor_id: prof.id }).eq('id', u.id);
            reconciledCount++;
          }
        } else if (u.role === 'aluno' && !u.student_id) {
          const { data: st } = await client.from('alunos').select('id').eq('email', cleanEmail).maybeSingle();
          if (st) {
            await client.from('usuarios').update({ student_id: st.id }).eq('id', u.id);
            reconciledCount++;
          }
        }
      }

      // Reconciliação específica de André Cuzati e professores promovidos a Administrador
      try {
        const { data: profs } = await client.from('professores').select('*');
        if (profs && profs.length > 0) {
          for (const prof of profs) {
            const profEmail = (prof.email || '').toLowerCase().trim();
            const isAndre = profEmail === 'acuzati@gmail.com';

            if (isAndre) {
              const { error: updErr } = await client.from('usuarios').update({
                role: 'admin',
                is_master_admin: true,
                permissions: DEFAULT_ADMIN_PERMISSIONS,
                professor_id: prof.id
              }).or(`email.ilike.${profEmail},professor_id.eq.${prof.id}`);

              if (!updErr) {
                reconciledCount++;
              }
            }
          }
        }
      } catch (profErr: any) {
        errors.push(`Professores reconciliation: ${profErr?.message}`);
      }

      res.json({ success: true, reconciledCount, errors });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Erro durante reconciliação.' });
    }
  }
}
