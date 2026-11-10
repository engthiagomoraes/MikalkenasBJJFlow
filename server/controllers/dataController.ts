import { Response } from 'express';
import { getBackendSupabaseClient } from '../services/supabaseBackend';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { audit, getClientIp } from '../services/security';

/**
 * Gateway de dados de negócio (instrucoes-seguranca-usuarios.md, seções 4 e 10).
 *
 * Substitui o acesso direto do navegador ao Supabase com a chave pública.
 * Toda leitura/escrita passa por aqui, com:
 * - lista branca de tabelas e colunas (esquema real em 10/11/2026);
 * - escopo por papel (admin / professor / aluno), sempre validado no servidor;
 * - service_role apenas no backend.
 *
 * A tabela public.usuarios NÃO é acessível por este gateway.
 */

type Role = 'admin' | 'professor' | 'aluno';
type Action = 'read' | 'write' | 'delete';

interface TableConfig {
  columns: string[];
  /** Flag de permissions (jsonb) que um admin precisa NÃO ter como false para escrever. */
  adminFlag?: string;
  /** Professores podem escrever? */
  professorWrite: 'none' | 'all' | 'own_student' | 'own_class' | 'own_student_or_class';
  /** Escopo de leitura por papel. */
  readScope: { professor: 'all' | 'own_students' | 'own_payments' | 'own_student_rows'; aluno: 'all' | 'self' | 'self_rows' | 'none' };
  hasUpdatedAt?: boolean;
  /** Colunas ocultadas para alunos. */
  hiddenForStudent?: string[];
}

const TABLES: Record<string, TableConfig> = {
  alunos: {
    columns: ['id', 'nome', 'email', 'telefone', 'avatar', 'data_nascimento', 'data_inicio', 'faixa', 'graus', 'data_ultima_graduacao',
      'presencas_na_faixa', 'presencas_meta_grau', 'total_presencas_historico', 'plano', 'valor_mensalidade', 'dia_vencimento',
      'status_pagamento', 'observacoes_medicas', 'tamanho_kimono', 'peso_kg', 'turma_preferida', 'performance', 'professor_id',
      'professor_nome', 'sistema_graduacao'],
    adminFlag: 'canManageStudents',
    professorWrite: 'own_student',
    readScope: { professor: 'own_students', aluno: 'self' },
    hasUpdatedAt: true
  },
  professores: {
    columns: ['id', 'nome', 'faixa', 'graus', 'email', 'telefone', 'foto', 'registro_cbjj', 'bio', 'turmas', 'chave_pix', 'banco', 'sistema_graduacao'],
    adminFlag: 'canManageUsers',
    professorWrite: 'none',
    readScope: { professor: 'all', aluno: 'all' },
    hiddenForStudent: ['email', 'telefone', 'banco', 'registro_cbjj']
  },
  turmas: {
    columns: ['id', 'titulo', 'dia_semana', 'horario', 'categoria', 'professor_id', 'professor_nome', 'sala'],
    adminFlag: 'canManageClasses',
    professorWrite: 'own_class',
    readScope: { professor: 'all', aluno: 'all' }
  },
  presencas: {
    columns: ['id', 'student_id', 'student_nome', 'student_faixa', 'student_graus', 'turma_id', 'turma_titulo', 'data', 'horario', 'confirmado_por'],
    adminFlag: 'canManageClasses',
    professorWrite: 'own_student_or_class',
    readScope: { professor: 'own_student_rows', aluno: 'self_rows' }
  },
  graduacoes: {
    columns: ['id', 'student_id', 'student_nome', 'faixa_anterior', 'graus_anteriores', 'nova_faixa', 'novos_graus', 'data',
      'professor_avaliador', 'total_aulas_atingidas', 'motivo_observacao', 'tipo_graduacao', 'sistema_utilizado'],
    adminFlag: 'canManageGraduations',
    professorWrite: 'own_student',
    readScope: { professor: 'own_student_rows', aluno: 'self_rows' }
  },
  pagamentos: {
    columns: ['id', 'student_id', 'student_nome', 'plano', 'mes_referencia', 'valor', 'valor_original', 'desconto', 'data_pagamento',
      'data_vencimento', 'status', 'metodo', 'comprovante', 'professor_id', 'professor_nome', 'chave_pix_professor'],
    adminFlag: 'canManageFinancial',
    professorWrite: 'none',
    readScope: { professor: 'own_payments', aluno: 'self_rows' }
  },
  planos_aula: {
    columns: ['id', 'data', 'semana_ciclo', 'tema_principal', 'turma', 'professor', 'aquecimento', 'tecnica_principal', 'technique_ids',
      'tecnicas_nomes', 'drill_repeticoes', 'treino_especifico_rola', 'observacoes', 'concluida'],
    adminFlag: 'canManageClasses',
    professorWrite: 'all',
    readScope: { professor: 'all', aluno: 'all' }
  },
  tecnicas: {
    columns: ['id', 'titulo', 'categoria', 'subcategoria', 'faixa_minima', 'nivel', 'tipo', 'descricao', 'pontos_chave', 'video_url', 'tags'],
    adminFlag: 'canManageTechniques',
    professorWrite: 'all',
    readScope: { professor: 'all', aluno: 'all' }
  },
  configuracoes_academia: {
    columns: ['id', 'nome_academia', 'mestre_responsavel', 'faixa_mestre', 'graus_mestre', 'registro_cbjj_mestre', 'unidade_principal',
      'telefone', 'email', 'chave_pix', 'banco', 'sistema_graduacao_padrao', 'aulas_por_grau', 'aulas_por_faixa_direta',
      'valor_padrao_regular', 'valor_padrao_infantil', 'valor_padrao_bolsista', 'regras_graduacao'],
    adminFlag: 'canManageSettings',
    professorWrite: 'none',
    readScope: { professor: 'all', aluno: 'all' },
    hasUpdatedAt: true
  },
  avaliacoes_desenvolvimento: {
    columns: ['id', 'student_id', 'data', 'avaliador_id', 'avaliador_nome', 'scores', 'observacoes', 'foco_desenvolvimento'],
    adminFlag: 'canManageGraduations',
    professorWrite: 'own_student',
    readScope: { professor: 'own_student_rows', aluno: 'self_rows' },
    hasUpdatedAt: true
  }
};

const MAX_ROWS_PER_REQUEST = 500;
const ID_REGEX = /^[A-Za-z0-9_.:@-]{1,120}$/;

function getConfig(req: AuthenticatedRequest, res: Response): [string, TableConfig] | null {
  const table = String(req.params.table || '');
  const cfg = Object.prototype.hasOwnProperty.call(TABLES, table) ? TABLES[table] : undefined;
  if (!cfg) {
    res.status(404).json({ success: false, error: 'Tabela não disponível.' });
    return null;
  }
  return [table, cfg];
}

/** Admin pode escrever, exceto se a flag correspondente estiver explicitamente false. Master pode tudo. */
function adminAllowed(req: AuthenticatedRequest, cfg: TableConfig): boolean {
  if (req.user?.role !== 'admin') return false;
  if (req.user.isMasterAdmin) return true;
  if (cfg.adminFlag && req.user.permissions && (req.user.permissions as any)[cfg.adminFlag] === false) return false;
  return true;
}

async function professorStudentIds(professorId: string | undefined): Promise<Set<string>> {
  if (!professorId) return new Set();
  const { data } = await getBackendSupabaseClient().from('alunos').select('id').eq('professor_id', professorId);
  return new Set((data || []).map((r: any) => r.id));
}

async function professorClassIds(professorId: string | undefined): Promise<Set<string>> {
  if (!professorId) return new Set();
  const { data } = await getBackendSupabaseClient().from('turmas').select('id').eq('professor_id', professorId);
  return new Set((data || []).map((r: any) => r.id));
}

/** Mantém apenas colunas permitidas; remove created_at/updated_at enviados pelo cliente. */
function sanitizeRow(cfg: TableConfig, raw: any): Record<string, unknown> | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const row: Record<string, unknown> = {};
  for (const col of cfg.columns) {
    if (Object.prototype.hasOwnProperty.call(raw, col)) row[col] = raw[col];
  }
  if (typeof row.id !== 'string' || !ID_REGEX.test(row.id)) return null;
  if (cfg.hasUpdatedAt) row.updated_at = new Date().toISOString();
  return row;
}

/**
 * Verifica se um professor pode escrever/excluir as linhas informadas.
 * Considera tanto o valor novo quanto o valor atualmente gravado (impede "sequestrar" linhas de outro professor).
 */
async function professorCanTouch(
  table: string,
  cfg: TableConfig,
  professorId: string | undefined,
  newRows: Array<Record<string, unknown>>,
  ids: string[]
): Promise<boolean> {
  if (cfg.professorWrite === 'none' || !professorId) return false;
  if (cfg.professorWrite === 'all') return true;

  const client = getBackendSupabaseClient();
  const { data: existing, error } = await client.from(table).select('*').in('id', ids);
  if (error) return false;
  const rowsToCheck = [...newRows, ...(existing || [])];

  if (cfg.professorWrite === 'own_class') {
    return rowsToCheck.every(r => r.professor_id === professorId);
  }
  if (table === 'alunos') {
    return rowsToCheck.every(r => r.professor_id === professorId);
  }

  const students = await professorStudentIds(professorId);
  const classes = cfg.professorWrite === 'own_student_or_class' ? await professorClassIds(professorId) : new Set<string>();
  return rowsToCheck.every(r =>
    (typeof r.student_id === 'string' && students.has(r.student_id)) ||
    (typeof r.turma_id === 'string' && classes.has(r.turma_id))
  );
}

export class DataController {
  /** GET /api/data/:table — leitura com escopo por papel. */
  static async list(req: AuthenticatedRequest, res: Response): Promise<void> {
    const resolved = getConfig(req, res);
    if (!resolved) return;
    const [table, cfg] = resolved;
    const user = req.user!;
    const role = user.role as Role;

    try {
      const client = getBackendSupabaseClient();
      let query = client.from(table).select('*');

      if (role === 'aluno') {
        const scope = cfg.readScope.aluno;
        if (scope === 'none') {
          res.json({ success: true, rows: [] });
          return;
        }
        if (scope === 'self' || scope === 'self_rows') {
          if (!user.studentId) {
            res.json({ success: true, rows: [] });
            return;
          }
          query = scope === 'self' ? query.eq('id', user.studentId) : query.eq('student_id', user.studentId);
        }
      } else if (role === 'professor') {
        const scope = cfg.readScope.professor;
        if (scope !== 'all' && !user.professorId) {
          res.json({ success: true, rows: [] });
          return;
        }
        if (scope === 'own_students') query = query.eq('professor_id', user.professorId!);
        if (scope === 'own_payments') query = query.eq('professor_id', user.professorId!);
        if (scope === 'own_student_rows') {
          const ids = [...(await professorStudentIds(user.professorId))];
          if (ids.length === 0) {
            res.json({ success: true, rows: [] });
            return;
          }
          query = query.in('student_id', ids);
        }
      } else if (role !== 'admin') {
        res.status(403).json({ success: false, error: 'Acesso negado.' });
        return;
      }

      const { data, error } = await query.limit(5000);
      if (error) {
        console.error('[DATA LIST]', table, error.code);
        res.status(500).json({ success: false, error: 'Falha ao consultar dados.' });
        return;
      }

      let rows = data || [];
      if (role === 'aluno' && cfg.hiddenForStudent) {
        rows = rows.map((r: any) => {
          const copy = { ...r };
          for (const col of cfg.hiddenForStudent!) delete copy[col];
          return copy;
        });
      }
      res.json({ success: true, rows });
    } catch {
      res.status(500).json({ success: false, error: 'Erro interno ao consultar dados.' });
    }
  }

  /** POST /api/data/:table/upsert — body { rows: [...] }. */
  static async upsert(req: AuthenticatedRequest, res: Response): Promise<void> {
    const resolved = getConfig(req, res);
    if (!resolved) return;
    const [table, cfg] = resolved;
    const user = req.user!;

    const input = Array.isArray(req.body?.rows) ? req.body.rows : null;
    if (!input || input.length === 0) {
      res.status(400).json({ success: false, error: 'Nenhum registro enviado.' });
      return;
    }
    if (input.length > MAX_ROWS_PER_REQUEST) {
      res.status(413).json({ success: false, error: `Máximo de ${MAX_ROWS_PER_REQUEST} registros por requisição.` });
      return;
    }

    const rows: Array<Record<string, unknown>> = [];
    for (const raw of input) {
      const row = sanitizeRow(cfg, raw);
      if (!row) {
        res.status(400).json({ success: false, error: 'Registro inválido (id ausente ou malformado).' });
        return;
      }
      rows.push(row);
    }
    const ids = rows.map(r => r.id as string);

    const allowed = user.role === 'admin'
      ? adminAllowed(req, cfg)
      : user.role === 'professor'
        ? await professorCanTouch(table, cfg, user.professorId, rows, ids)
        : false;

    if (!allowed) {
      res.status(403).json({ success: false, error: 'Você não tem permissão para alterar estes registros.' });
      return;
    }

    try {
      const { error } = await getBackendSupabaseClient().from(table).upsert(rows, { onConflict: 'id' });
      if (error) {
        console.error('[DATA UPSERT]', table, error.code, error.message);
        res.status(400).json({ success: false, error: 'Não foi possível gravar os dados. Verifique os campos enviados.' });
        return;
      }
      res.json({ success: true, count: rows.length });
    } catch {
      res.status(500).json({ success: false, error: 'Erro interno ao gravar dados.' });
    }
  }

  /** PATCH /api/data/:table/:id — body { values: {...} }. Atualiza exatamente 1 linha. */
  static async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    const resolved = getConfig(req, res);
    if (!resolved) return;
    const [table, cfg] = resolved;
    const user = req.user!;
    const id = String(req.params.id || '');

    if (!ID_REGEX.test(id)) {
      res.status(400).json({ success: false, error: 'ID inválido.' });
      return;
    }
    const values = sanitizeRow(cfg, { ...(req.body?.values || {}), id });
    if (!values) {
      res.status(400).json({ success: false, error: 'Dados inválidos.' });
      return;
    }
    delete values.id;

    const allowed = user.role === 'admin'
      ? adminAllowed(req, cfg)
      : user.role === 'professor'
        ? await professorCanTouch(table, cfg, user.professorId, [{ ...values, id }], [id])
        : false;
    if (!allowed) {
      res.status(403).json({ success: false, error: 'Você não tem permissão para alterar este registro.' });
      return;
    }

    try {
      const { data, error } = await getBackendSupabaseClient().from(table).update(values).eq('id', id).select('id');
      if (error) {
        res.status(400).json({ success: false, error: 'Não foi possível atualizar o registro.' });
        return;
      }
      if (!data || data.length !== 1) {
        res.status(404).json({ success: false, error: 'Registro não encontrado.' });
        return;
      }
      res.json({ success: true });
    } catch {
      res.status(500).json({ success: false, error: 'Erro interno ao atualizar.' });
    }
  }

  /** DELETE /api/data/:table/:id — exclusão de 1 linha, com checagem de referências em alunos/professores. */
  static async remove(req: AuthenticatedRequest, res: Response): Promise<void> {
    const resolved = getConfig(req, res);
    if (!resolved) return;
    const [table, cfg] = resolved;
    const user = req.user!;
    const id = String(req.params.id || '');

    if (!ID_REGEX.test(id)) {
      res.status(400).json({ success: false, error: 'ID inválido.' });
      return;
    }

    // Perfis vinculados a contas e dados financeiros/históricos: só admin, e nunca com referências (regra 7)
    const isProfileTable = table === 'alunos' || table === 'professores';
    let allowed: boolean;
    if (user.role === 'admin') {
      allowed = adminAllowed(req, cfg);
    } else if (user.role === 'professor' && !isProfileTable) {
      allowed = await professorCanTouch(table, cfg, user.professorId, [], [id]);
    } else {
      allowed = false;
    }
    if (!allowed) {
      res.status(403).json({ success: false, error: 'Você não tem permissão para excluir este registro.' });
      return;
    }

    try {
      const client = getBackendSupabaseClient();

      if (isProfileTable) {
        const refs: string[] = [];
        const check = async (t: string, col: string, label: string) => {
          const { count } = await client.from(t).select('id', { count: 'exact', head: true }).eq(col, id);
          if (count && count > 0) refs.push(`${label} (${count})`);
        };
        if (table === 'alunos') {
          await check('usuarios', 'student_id', 'conta de usuário');
          await check('pagamentos', 'student_id', 'pagamentos');
          await check('presencas', 'student_id', 'presenças');
          await check('graduacoes', 'student_id', 'graduações');
        } else {
          await check('usuarios', 'professor_id', 'conta de usuário');
          await check('turmas', 'professor_id', 'turmas');
          await check('alunos', 'professor_id', 'alunos');
        }
        if (refs.length > 0) {
          res.status(409).json({
            success: false,
            error: `Exclusão bloqueada: o registro possui vínculos (${refs.join(', ')}). Prefira inativar ou remova os vínculos antes.`
          });
          return;
        }
      }

      const { data, error } = await client.from(table).delete().eq('id', id).select('id');
      if (error) {
        res.status(400).json({ success: false, error: 'Não foi possível excluir o registro.' });
        return;
      }
      if (!data || data.length === 0) {
        res.status(404).json({ success: false, error: 'Registro não encontrado.' });
        return;
      }

      if (isProfileTable) {
        await audit(client, {
          action: 'mudanca_vinculo',
          actorId: user.id,
          targetId: id,
          ip: getClientIp(req),
          details: { exclusao: table }
        });
      }
      res.json({ success: true });
    } catch {
      res.status(500).json({ success: false, error: 'Erro interno ao excluir.' });
    }
  }
}
