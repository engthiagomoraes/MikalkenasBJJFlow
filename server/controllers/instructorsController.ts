import { Response } from 'express';
import { getBackendSupabaseClient } from '../services/supabaseBackend';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class InstructorsController {
  /**
   * Lista professores com proteção de dados bancários (chave PIX, banco).
   * Alunos não têm acesso a dados financeiros do professor.
   */
  static async listInstructors(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user;
      const client = getBackendSupabaseClient();

      const { data, error } = await client
        .from('professores')
        .select('id, nome, faixa, graus, email, telefone, foto, registro_cbjj, bio, turmas, chave_pix, banco, sistema_graduacao, created_at')
        .order('nome', { ascending: true });

      if (error) {
        console.error('[INSTRUCTORS LIST ERROR]', error);
        res.status(500).json({ success: false, error: 'Falha ao consultar professores no banco.' });
        return;
      }

      const isPrivileged = user?.role === 'admin' || user?.role === 'professor';

      const sanitizedInstructors = (data || []).map((prof: any) => {
        let turmasList = [];
        if (Array.isArray(prof.turmas)) {
          turmasList = prof.turmas;
        } else if (typeof prof.turmas === 'string') {
          try {
            turmasList = JSON.parse(prof.turmas);
          } catch {
            turmasList = [];
          }
        }

        return {
          id: prof.id,
          nome: prof.nome,
          faixa: prof.faixa || 'preta',
          graus: prof.graus || 0,
          email: prof.email || '',
          telefone: prof.telefone || '',
          foto: prof.foto || null,
          registroCBJJ: prof.registro_cbjj || '',
          bio: prof.bio || '',
          turmas: turmasList,
          chavePix: isPrivileged ? prof.chave_pix || '' : '',
          banco: isPrivileged ? prof.banco || '' : '',
          sistemaGraduacao: prof.sistema_graduacao || 'graus_e_faixas'
        };
      });

      res.json({ success: true, count: sanitizedInstructors.length, instructors: sanitizedInstructors });
    } catch (err: any) {
      console.error('[INSTRUCTORS ERROR]', err);
      res.status(500).json({ success: false, error: 'Erro interno ao consultar professores.' });
    }
  }

  /**
   * Cadastra novo professor (exclusivo para Administradores).
   */
  static async createInstructor(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { nome, faixa, graus, email, telefone, foto, registroCBJJ, bio, turmas, chavePix, banco, sistemaGraduacao } = req.body;

      if (!nome) {
        res.status(400).json({ success: false, error: 'Nome do professor é obrigatório.' });
        return;
      }

      const client = getBackendSupabaseClient();
      const cleanEmail = email ? String(email).toLowerCase().trim() : null;

      if (cleanEmail) {
        const { data: existing } = await client
          .from('professores')
          .select('id')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (existing) {
          res.status(409).json({ success: false, error: 'Já existe um professor cadastrado com este e-mail.' });
          return;
        }
      }

      const newId = req.body.id || `inst-${Date.now()}`;
      const turmasJson = Array.isArray(turmas) ? turmas : [];

      const newProf = {
        id: newId,
        nome: String(nome).trim(),
        faixa: faixa || 'preta',
        graus: Number(graus || 0),
        email: cleanEmail,
        telefone: telefone || null,
        foto: foto || null,
        registro_cbjj: registroCBJJ || null,
        bio: bio || null,
        turmas: turmasJson,
        chave_pix: chavePix || null,
        banco: banco || null,
        sistema_graduacao: sistemaGraduacao || 'graus_e_faixas',
        created_at: new Date().toISOString()
      };

      const { data, error } = await client
        .from('professores')
        .insert([newProf])
        .select('*')
        .single();

      if (error) {
        console.error('[INSTRUCTOR INSERT ERROR]', error);
        res.status(500).json({ success: false, error: `Erro ao cadastrar professor: ${error.message}` });
        return;
      }

      res.status(201).json({
        success: true,
        message: 'Professor cadastrado com sucesso!',
        instructor: {
          id: data.id,
          nome: data.nome,
          faixa: data.faixa,
          graus: data.graus,
          email: data.email,
          telefone: data.telefone,
          foto: data.foto,
          registroCBJJ: data.registro_cbjj,
          bio: data.bio,
          turmas: data.turmas,
          chavePix: data.chave_pix,
          banco: data.banco,
          sistemaGraduacao: data.sistema_graduacao
        }
      });
    } catch (err: any) {
      console.error('[INSTRUCTOR CREATE ERROR]', err);
      res.status(500).json({ success: false, error: 'Erro interno ao criar professor.' });
    }
  }

  /**
   * Atualiza dados de um professor existente.
   */
  static async updateInstructor(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { nome, faixa, graus, email, telefone, foto, registroCBJJ, bio, turmas, chavePix, banco, sistemaGraduacao } = req.body;

      if (!id) {
        res.status(400).json({ success: false, error: 'ID do professor é obrigatório.' });
        return;
      }

      const client = getBackendSupabaseClient();
      const updateData: Record<string, any> = {};

      if (nome !== undefined) updateData.nome = String(nome).trim();
      if (faixa !== undefined) updateData.faixa = faixa;
      if (graus !== undefined) updateData.graus = Number(graus);
      if (email !== undefined) updateData.email = email ? String(email).toLowerCase().trim() : null;
      if (telefone !== undefined) updateData.telefone = telefone || null;
      if (foto !== undefined) updateData.foto = foto || null;
      if (registroCBJJ !== undefined) updateData.registro_cbjj = registroCBJJ || null;
      if (bio !== undefined) updateData.bio = bio || null;
      if (turmas !== undefined) updateData.turmas = Array.isArray(turmas) ? turmas : [];
      if (chavePix !== undefined) updateData.chave_pix = chavePix || null;
      if (banco !== undefined) updateData.banco = banco || null;
      if (sistemaGraduacao !== undefined) updateData.sistema_graduacao = sistemaGraduacao;

      const { data, error } = await client
        .from('professores')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        console.error('[INSTRUCTOR UPDATE ERROR]', error);
        res.status(500).json({ success: false, error: `Erro ao atualizar professor: ${error.message}` });
        return;
      }

      res.json({
        success: true,
        message: 'Dados do professor atualizados com sucesso.',
        instructor: data
      });
    } catch (err: any) {
      console.error('[INSTRUCTOR UPDATE ERROR]', err);
      res.status(500).json({ success: false, error: 'Erro interno ao atualizar professor.' });
    }
  }

  /**
   * Exclui professor com validação de preservação.
   * Não permite excluir o Sensei Edson Mikalkenas (professormikalkenasbjj@gmail.com).
   */
  static async deleteInstructor(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ success: false, error: 'ID do professor é obrigatório.' });
        return;
      }

      const client = getBackendSupabaseClient();

      // Busca professor
      const { data: targetProf, error: findErr } = await client
        .from('professores')
        .select('id, nome, email')
        .eq('id', id)
        .maybeSingle();

      if (findErr || !targetProf) {
        res.status(404).json({ success: false, error: 'Professor não encontrado no cadastro.' });
        return;
      }

      // Impede estritamente exclusão do Sensei Edson Mikalkenas
      const cleanEmail = String(targetProf.email || '').toLowerCase().trim();
      if (cleanEmail === 'professormikalkenasbjj@gmail.com' || targetProf.nome?.toLowerCase().includes('edson mikalkenas')) {
        res.status(403).json({
          success: false,
          error: 'Operação proibida: O cadastro do Sensei Edson Mikalkenas é o perfil mestre da academia e não pode ser excluído.'
        });
        return;
      }

      // Desvincula usuários associados
      await client
        .from('usuarios')
        .update({ professor_id: null })
        .eq('professor_id', id);

      // Desvincula turmas
      await client
        .from('turmas')
        .update({ professor_id: null, professor_nome: 'A definir' })
        .eq('professor_id', id);

      // Exclui professor
      const { error: delErr } = await client
        .from('professores')
        .delete()
        .eq('id', id);

      if (delErr) {
        console.error('[INSTRUCTOR DELETE ERROR]', delErr);
        res.status(500).json({ success: false, error: `Falha ao excluir professor: ${delErr.message}` });
        return;
      }

      res.json({
        success: true,
        message: `Professor ${targetProf.nome} excluído com sucesso.`
      });
    } catch (err: any) {
      console.error('[INSTRUCTOR DELETE ERROR]', err);
      res.status(500).json({ success: false, error: 'Erro interno ao excluir professor.' });
    }
  }
}
