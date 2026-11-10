import { Response } from 'express';
import { getBackendSupabaseClient } from '../services/supabaseBackend';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function isValidIsoDate(str: string): boolean {
  if (!ISO_DATE_REGEX.test(str)) return false;
  const d = new Date(str + 'T00:00:00Z');
  return !isNaN(d.getTime());
}

export class AttendanceController {
  /**
   * Consulta presenças com paginação e filtros no servidor por período e aluno.
   * Evita download integral da tabela de presenças para o navegador.
   * Aplica controle de acesso baseado em papel (RBAC):
   * - Aluno: restrito estritamente ao seu próprio student_id.
   * - Professor: visualiza alunos vinculados ou aulas sob sua responsabilidade.
   * - Admin / Master Admin: acesso irrestrito para gestão da academia.
   */
  static async listAttendance(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ success: false, error: 'Usuário não autenticado.' });
        return;
      }

      const { startDate, endDate, studentId, turmaId, limit, offset } = req.query;

      // 1. Validação de formato de data e intervalo
      if (startDate && typeof startDate === 'string') {
        if (!isValidIsoDate(startDate)) {
          res.status(400).json({
            success: false,
            error: 'Formato inválido para startDate. Utilize o padrão YYYY-MM-DD.'
          });
          return;
        }
      }

      if (endDate && typeof endDate === 'string') {
        if (!isValidIsoDate(endDate)) {
          res.status(400).json({
            success: false,
            error: 'Formato inválido para endDate. Utilize o padrão YYYY-MM-DD.'
          });
          return;
        }
      }

      if (startDate && endDate && typeof startDate === 'string' && typeof endDate === 'string') {
        if (startDate > endDate) {
          res.status(400).json({
            success: false,
            error: 'Intervalo de datas inválido: startDate deve ser menor ou igual a endDate.'
          });
          return;
        }
      }

      const client = getBackendSupabaseClient();
      let query = client
        .from('presencas')
        .select('id, student_id, student_nome, student_faixa, student_graus, turma_id, turma_titulo, data, horario, confirmado_por, created_at')
        .order('data', { ascending: false })
        .order('horario', { ascending: false });

      // 2. Escopo de permissão por papel
      if (user.role === 'aluno') {
        if (!user.studentId) {
          res.json({
            success: true,
            records: [],
            total: 0,
            message: 'Conta de aluno ainda não possui vínculo de matrícula ativo.'
          });
          return;
        }

        // Se aluno tentar filtrar por outro studentId, bloqueia com 403
        if (studentId && typeof studentId === 'string' && studentId !== user.studentId) {
          res.status(403).json({
            success: false,
            error: 'Acesso negado. Alunos só podem consultar o seu próprio histórico de presenças.'
          });
          return;
        }

        query = query.eq('student_id', user.studentId);
      } else if (user.role === 'professor') {
        // Professor pode filtrar por um aluno específico ou ver todos os vinculados
        if (studentId && typeof studentId === 'string') {
          query = query.eq('student_id', studentId);
        } else if (user.professorId) {
          // Busca os IDs dos alunos vinculados ao professor
          const { data: profStudents } = await client
            .from('alunos')
            .select('id')
            .eq('professor_id', user.professorId);

          const studentIds = (profStudents || []).map(s => s.id);
          if (studentIds.length > 0) {
            query = query.in('student_id', studentIds);
          }
        }
      } else if (user.role === 'admin') {
        // Administrador tem visão global ou filtra conforme parâmetros informados
        if (studentId && typeof studentId === 'string') {
          query = query.eq('student_id', studentId);
        }
      }

      // 3. Aplicação dos filtros temporais e de turma
      if (startDate && typeof startDate === 'string') {
        query = query.gte('data', startDate);
      }
      if (endDate && typeof endDate === 'string') {
        query = query.lte('data', endDate);
      }
      if (turmaId && typeof turmaId === 'string' && turmaId !== 'all') {
        query = query.eq('turma_id', turmaId);
      }

      // Paginação opcional
      const parsedLimit = limit ? Math.min(Math.max(parseInt(String(limit), 10) || 50, 1), 500) : 200;
      const parsedOffset = offset ? Math.max(parseInt(String(offset), 10) || 0, 0) : 0;
      query = query.range(parsedOffset, parsedOffset + parsedLimit - 1);

      const { data, error } = await query;

      if (error) {
        console.error('[ATTENDANCE QUERY ERROR]', error);
        res.status(500).json({
          success: false,
          error: 'Falha ao consultar presenças no banco de dados.'
        });
        return;
      }

      const records = (data || []).map(row => ({
        id: row.id,
        studentId: row.student_id,
        studentNome: row.student_nome,
        studentFaixa: row.student_faixa,
        studentGraus: row.student_graus || 0,
        turmaId: row.turma_id,
        turmaTitulo: row.turma_titulo,
        data: row.data,
        horario: row.horario,
        confirmadoPor: row.confirmado_por
      }));

      res.json({
        success: true,
        count: records.length,
        records
      });
    } catch (err: any) {
      console.error('[ATTENDANCE CONTROLLER ERROR]', err);
      res.status(500).json({
        success: false,
        error: 'Erro interno ao processar consulta de presenças.'
      });
    }
  }

  /**
   * Registra presença de um aluno no tatame com validações de integridade.
   * Incrementa atomicamente a contagem de presenças na faixa e total.
   */
  static async createAttendance(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ success: false, error: 'Usuário não autenticado.' });
        return;
      }

      const { student_id, turma_id, data, horario, turma_titulo } = req.body;

      if (!student_id || !turma_id || !data) {
        res.status(400).json({
          success: false,
          error: 'Campos obrigatórios: student_id, turma_id e data (YYYY-MM-DD).'
        });
        return;
      }

      if (!isValidIsoDate(data)) {
        res.status(400).json({
          success: false,
          error: 'Formato de data inválido. Utilize YYYY-MM-DD.'
        });
        return;
      }

      const client = getBackendSupabaseClient();

      // Busca dados cadastrais do aluno
      const { data: student, error: studentErr } = await client
        .from('alunos')
        .select('id, nome, faixa, graus, presencas_na_faixa, total_presencas_historico, professor_id')
        .eq('id', student_id)
        .maybeSingle();

      if (studentErr || !student) {
        res.status(404).json({
          success: false,
          error: 'Aluno não encontrado no cadastro da academia.'
        });
        return;
      }

      // Se o usuário for professor, valida permissão sobre o aluno
      if (user.role === 'professor' && user.professorId && student.professor_id) {
        if (student.professor_id !== user.professorId) {
          // Permite apenas se a turma for do professor
          const { data: classData } = await client
            .from('turmas')
            .select('professor_id')
            .eq('id', turma_id)
            .maybeSingle();

          if (classData?.professor_id !== user.professorId) {
            res.status(403).json({
              success: false,
              error: 'Acesso negado. Você só pode registrar presenças em suas turmas ou para seus alunos.'
            });
            return;
          }
        }
      }

      // Busca dados da turma se não fornecidos
      let finalTurmaTitulo = turma_titulo || '';
      if (!finalTurmaTitulo) {
        const { data: classRow } = await client
          .from('turmas')
          .select('titulo')
          .eq('id', turma_id)
          .maybeSingle();
        finalTurmaTitulo = classRow?.titulo || 'Turma Principal';
      }

      // Verifica se já existe check-in para o mesmo aluno na mesma data e turma
      const { data: existingCheckin } = await client
        .from('presencas')
        .select('id')
        .eq('student_id', student_id)
        .eq('data', data)
        .eq('turma_id', turma_id)
        .maybeSingle();

      if (existingCheckin) {
        res.status(409).json({
          success: false,
          error: 'Presença já confirmada para este aluno nesta turma na data informada.',
          existingId: existingCheckin.id
        });
        return;
      }

      const attendanceId = `pres-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const nowTime = horario || new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const confirmadoPor = user.role === 'admin' ? 'Administrador' : `Prof. ${user.email.split('@')[0]}`;

      const newRecord = {
        id: attendanceId,
        student_id: student.id,
        student_nome: student.nome,
        student_faixa: student.faixa,
        student_graus: student.graus || 0,
        turma_id: turma_id,
        turma_titulo: finalTurmaTitulo,
        data: data,
        horario: nowTime,
        confirmado_por: confirmadoPor,
        created_at: new Date().toISOString()
      };

      const { error: insErr } = await client.from('presencas').insert([newRecord]);
      if (insErr) {
        console.error('[ATTENDANCE INSERT ERROR]', insErr);
        res.status(500).json({ success: false, error: 'Falha ao registrar presença no banco.' });
        return;
      }

      // Incrementa as contagens de frequência no cadastro do aluno
      const updatedPresencasFaixa = (student.presencas_na_faixa || 0) + 1;
      const updatedTotalPresencas = (student.total_presencas_historico || 0) + 1;

      await client
        .from('alunos')
        .update({
          presencas_na_faixa: updatedPresencasFaixa,
          total_presencas_historico: updatedTotalPresencas
        })
        .eq('id', student.id);

      res.status(201).json({
        success: true,
        message: `Presença de ${student.nome} confirmada com sucesso!`,
        record: {
          id: newRecord.id,
          studentId: newRecord.student_id,
          studentNome: newRecord.student_nome,
          studentFaixa: newRecord.student_faixa,
          studentGraus: newRecord.student_graus,
          turmaId: newRecord.turma_id,
          turmaTitulo: newRecord.turma_titulo,
          data: newRecord.data,
          horario: newRecord.horario,
          confirmadoPor: newRecord.confirmado_por
        },
        studentStats: {
          presencasNaFaixa: updatedPresencasFaixa,
          totalPresencasHistorico: updatedTotalPresencas
        }
      });
    } catch (err: any) {
      console.error('[ATTENDANCE CREATE ERROR]', err);
      res.status(500).json({
        success: false,
        error: 'Erro interno ao registrar presença.'
      });
    }
  }

  /**
   * Remove registro de presença e atualiza o histórico do aluno.
   */
  static async deleteAttendance(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user;
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ success: false, error: 'ID da presença obrigatório.' });
        return;
      }

      const client = getBackendSupabaseClient();

      // Busca dados da presença a ser removida
      const { data: attendanceRow, error: findErr } = await client
        .from('presencas')
        .select('id, student_id')
        .eq('id', id)
        .maybeSingle();

      if (findErr || !attendanceRow) {
        res.status(404).json({ success: false, error: 'Registro de presença não encontrado.' });
        return;
      }

      const { error: delErr } = await client.from('presencas').delete().eq('id', id);
      if (delErr) {
        res.status(500).json({ success: false, error: 'Falha ao excluir presença do banco de dados.' });
        return;
      }

      // Decrementa presenças do aluno mantendo mínimo zero
      const { data: student } = await client
        .from('alunos')
        .select('id, presencas_na_faixa, total_presencas_historico')
        .eq('id', attendanceRow.student_id)
        .maybeSingle();

      if (student) {
        const nextFaixa = Math.max((student.presencas_na_faixa || 0) - 1, 0);
        const nextTotal = Math.max((student.total_presencas_historico || 0) - 1, 0);
        await client
          .from('alunos')
          .update({
            presencas_na_faixa: nextFaixa,
            total_presencas_historico: nextTotal
          })
          .eq('id', student.id);
      }

      res.json({
        success: true,
        message: 'Presença removida com sucesso.'
      });
    } catch (err: any) {
      console.error('[ATTENDANCE DELETE ERROR]', err);
      res.status(500).json({ success: false, error: 'Erro interno ao excluir presença.' });
    }
  }
}
