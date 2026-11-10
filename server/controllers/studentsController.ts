import { Response } from 'express';
import { getBackendSupabaseClient } from '../services/supabaseBackend';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class StudentsController {
  /**
   * Consulta alunos com escopo de permissão:
   * - Aluno: restrito estritamente ao seu próprio cadastro.
   * - Professor: visualiza alunos vinculados ao seu professor_id.
   * - Admin: visualiza todos os alunos da academia.
   */
  static async listStudents(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ success: false, error: 'Usuário não autenticado.' });
        return;
      }

      const client = getBackendSupabaseClient();
      let query = client
        .from('alunos')
        .select('*')
        .order('nome', { ascending: true });

      if (user.role === 'aluno') {
        if (!user.studentId) {
          res.json({ success: true, count: 0, students: [] });
          return;
        }
        query = query.eq('id', user.studentId);
      } else if (user.role === 'professor' && user.professorId) {
        query = query.eq('professor_id', user.professorId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('[STUDENTS LIST ERROR]', error);
        res.status(500).json({ success: false, error: 'Falha ao consultar alunos no banco.' });
        return;
      }

      const students = (data || []).map((r: any) => ({
        id: r.id,
        nome: r.nome,
        email: r.email || '',
        telefone: r.telefone || '',
        avatar: r.avatar,
        dataNascimento: r.data_nascimento || '',
        dataInicio: r.data_inicio || '',
        faixa: r.faixa || 'branca',
        graus: r.graus || 0,
        dataUltimaGraduacao: r.data_ultima_graduacao || '',
        presencasNaFaixa: r.presencas_na_faixa || 0,
        presencasMetaGrau: r.presencas_meta_grau || 40,
        totalPresencasHistorico: r.total_presencas_historico || 0,
        plano: r.plano || 'Mensal',
        valorMensalidade: Number(r.valor_mensalidade || 180),
        diaVencimento: Number(r.dia_vencimento || 10),
        statusPagamento: r.status_pagamento || 'em_dia',
        observacoesMedicas: r.observacoes_medicas,
        tamanhoKimono: r.tamanho_kimono || 'A2',
        pesoKg: Number(r.peso_kg || 75),
        turmaPreferida: r.turma_preferida || 'Geral',
        performance: r.performance || {},
        professorId: r.professor_id,
        professorNome: r.professor_nome,
        sistemaGraduacao: r.sistema_graduacao || 'graus_e_faixas'
      }));

      res.json({ success: true, count: students.length, students });
    } catch (err: any) {
      console.error('[STUDENTS ERROR]', err);
      res.status(500).json({ success: false, error: 'Erro interno ao consultar alunos.' });
    }
  }

  /**
   * Cadastra aluno (exige professor ou administrador).
   */
  static async createStudent(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const studentData = req.body;
      if (!studentData.nome) {
        res.status(400).json({ success: false, error: 'Nome do aluno é obrigatório.' });
        return;
      }

      const client = getBackendSupabaseClient();
      const newId = studentData.id || `aluno-${Date.now()}`;

      const row = {
        id: newId,
        nome: String(studentData.nome).trim(),
        email: studentData.email ? String(studentData.email).toLowerCase().trim() : null,
        telefone: studentData.telefone || null,
        avatar: studentData.avatar || null,
        data_nascimento: studentData.dataNascimento || null,
        data_inicio: studentData.dataInicio || new Date().toISOString().split('T')[0],
        faixa: studentData.faixa || 'branca',
        graus: Number(studentData.graus || 0),
        data_ultima_graduacao: studentData.dataUltimaGraduacao || null,
        presencas_na_faixa: Number(studentData.presencasNaFaixa || 0),
        presencas_meta_grau: Number(studentData.presencasMetaGrau || 40),
        total_presencas_historico: Number(studentData.totalPresencasHistorico || 0),
        plano: studentData.plano || 'Mensal',
        valor_mensalidade: Number(studentData.valorMensalidade || 180),
        dia_vencimento: Number(studentData.diaVencimento || 10),
        status_pagamento: studentData.statusPagamento || 'em_dia',
        observacoes_medicas: studentData.observacoesMedicas || null,
        tamanho_kimono: studentData.tamanhoKimono || 'A2',
        peso_kg: Number(studentData.pesoKg || 75),
        turma_preferida: studentData.turmaPreferida || 'Geral',
        performance: studentData.performance || {},
        professor_id: studentData.professorId || null,
        professor_nome: studentData.professorNome || null,
        sistema_graduacao: studentData.sistemaGraduacao || 'graus_e_faixas',
        created_at: new Date().toISOString()
      };

      const { data, error } = await client.from('alunos').insert([row]).select('*').single();
      if (error) {
        res.status(500).json({ success: false, error: `Erro ao cadastrar aluno: ${error.message}` });
        return;
      }

      res.status(201).json({ success: true, message: 'Aluno cadastrado com sucesso!', student: data });
    } catch (err: any) {
      console.error('[STUDENT CREATE ERROR]', err);
      res.status(500).json({ success: false, error: 'Erro interno ao criar aluno.' });
    }
  }

  /**
   * Atualiza aluno.
   */
  static async updateStudent(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const b = req.body;

      if (!id) {
        res.status(400).json({ success: false, error: 'ID do aluno obrigatório.' });
        return;
      }

      const client = getBackendSupabaseClient();
      const updateData: Record<string, any> = {};

      if (b.nome !== undefined) updateData.nome = String(b.nome).trim();
      if (b.email !== undefined) updateData.email = b.email ? String(b.email).toLowerCase().trim() : null;
      if (b.telefone !== undefined) updateData.telefone = b.telefone || null;
      if (b.avatar !== undefined) updateData.avatar = b.avatar || null;
      if (b.dataNascimento !== undefined) updateData.data_nascimento = b.dataNascimento;
      if (b.dataInicio !== undefined) updateData.data_inicio = b.dataInicio;
      if (b.faixa !== undefined) updateData.faixa = b.faixa;
      if (b.graus !== undefined) updateData.graus = Number(b.graus);
      if (b.dataUltimaGraduacao !== undefined) updateData.data_ultima_graduacao = b.dataUltimaGraduacao;
      if (b.presencasNaFaixa !== undefined) updateData.presencas_na_faixa = Number(b.presencasNaFaixa);
      if (b.presencasMetaGrau !== undefined) updateData.presencas_meta_grau = Number(b.presencasMetaGrau);
      if (b.totalPresencasHistorico !== undefined) updateData.total_presencas_historico = Number(b.totalPresencasHistorico);
      if (b.plano !== undefined) updateData.plano = b.plano;
      if (b.valorMensalidade !== undefined) updateData.valor_mensalidade = Number(b.valorMensalidade);
      if (b.diaVencimento !== undefined) updateData.dia_vencimento = Number(b.diaVencimento);
      if (b.statusPagamento !== undefined) updateData.status_pagamento = b.statusPagamento;
      if (b.observacoesMedicas !== undefined) updateData.observacoes_medicas = b.observacoesMedicas;
      if (b.tamanhoKimono !== undefined) updateData.tamanho_kimono = b.tamanhoKimono;
      if (b.pesoKg !== undefined) updateData.peso_kg = Number(b.pesoKg);
      if (b.turmaPreferida !== undefined) updateData.turma_preferida = b.turmaPreferida;
      if (b.performance !== undefined) updateData.performance = b.performance;
      if (b.professorId !== undefined) updateData.professor_id = b.professorId;
      if (b.professorNome !== undefined) updateData.professor_nome = b.professorNome;
      if (b.sistemaGraduacao !== undefined) updateData.sistema_graduacao = b.sistemaGraduacao;

      const { data, error } = await client.from('alunos').update(updateData).eq('id', id).select('*').single();
      if (error) {
        res.status(500).json({ success: false, error: `Erro ao atualizar aluno: ${error.message}` });
        return;
      }

      res.json({ success: true, message: 'Dados do aluno atualizados com sucesso.', student: data });
    } catch (err: any) {
      console.error('[STUDENT UPDATE ERROR]', err);
      res.status(500).json({ success: false, error: 'Erro interno ao atualizar aluno.' });
    }
  }

  /**
   * Exclui aluno (exige administrador).
   */
  static async deleteStudent(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const client = getBackendSupabaseClient();

      // Desvincula usuário
      await client.from('usuarios').update({ student_id: null }).eq('student_id', id);

      const { error } = await client.from('alunos').delete().eq('id', id);
      if (error) {
        res.status(500).json({ success: false, error: `Erro ao excluir aluno: ${error.message}` });
        return;
      }

      res.json({ success: true, message: 'Aluno excluído com sucesso.' });
    } catch (err: any) {
      console.error('[STUDENT DELETE ERROR]', err);
      res.status(500).json({ success: false, error: 'Erro interno ao excluir aluno.' });
    }
  }
}
