/**
 * Cliente de dados que encaminha as operações para o backend (/api/data/:tabela).
 *
 * Implementa apenas o subconjunto da API do supabase-js usado pelo app:
 *   from(t).select('*' [, {count, head}]) [.order(col, {ascending})] [.eq(col, v)] [.limit(n)] [.maybeSingle()|.single()]
 *   from(t).upsert(row | rows [, opts])     from(t).insert(row | rows)
 *   from(t).update(values).eq('id', id)    from(t).delete().eq('id', id)
 *   auth.signOut()
 *
 * O navegador não acessa mais as tabelas com a chave pública: o backend valida
 * a sessão e aplica o escopo por papel (instrucoes-seguranca-usuarios.md, seção 10).
 */

type DataError = { message: string; code?: string; status?: number };
type DataResult<T = any> = { data: T | null; error: DataError | null; count?: number | null; status?: number };

const UPSERT_BATCH_SIZE = 200;

function authHeaders(json = false): Record<string, string> {
  const headers: Record<string, string> = {};
  if (json) headers['Content-Type'] = 'application/json';
  try {
    const token = localStorage.getItem('ternatio_bjj_auth_token') || localStorage.getItem('bjjflow_token');
    if (token) headers.Authorization = `Bearer ${token}`;
  } catch {}
  return headers;
}

async function request(method: string, url: string, body?: unknown): Promise<DataResult> {
  try {
    const resp = await fetch(url, {
      method,
      headers: authHeaders(body !== undefined),
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
    let json: any = null;
    try {
      json = await resp.json();
    } catch {}
    if (!resp.ok || !json?.success) {
      const message =
        json?.error || json?.message ||
        (resp.status === 401 ? 'Sessão expirada. Entre novamente.' : `Erro HTTP ${resp.status}`);
      return { data: null, error: { message, status: resp.status, code: json?.code }, status: resp.status };
    }
    return { data: json, error: null, status: resp.status };
  } catch (err: any) {
    return { data: null, error: { message: err?.message || 'Falha de comunicação com o servidor.' } };
  }
}

class SelectQuery implements PromiseLike<DataResult> {
  private orderBy: { col: string; ascending: boolean } | null = null;
  private filters: Array<[string, unknown]> = [];
  private max: number | null = null;
  private mode: 'many' | 'maybeSingle' | 'single' = 'many';

  constructor(private table: string, private opts?: { count?: string; head?: boolean }) {}

  order(col: string, options?: { ascending?: boolean }) {
    this.orderBy = { col, ascending: options?.ascending !== false };
    return this;
  }
  eq(col: string, value: unknown) {
    this.filters.push([col, value]);
    return this;
  }
  limit(n: number) {
    this.max = n;
    return this;
  }
  maybeSingle() {
    this.mode = 'maybeSingle';
    return this;
  }
  single() {
    this.mode = 'single';
    return this;
  }

  private async run(): Promise<DataResult> {
    const res = await request('GET', `/api/data/${encodeURIComponent(this.table)}`);
    if (res.error) return { data: null, error: res.error, count: null };

    let rows: any[] = Array.isArray(res.data?.rows) ? res.data.rows : [];
    for (const [col, value] of this.filters) rows = rows.filter(r => r?.[col] === value);
    if (this.orderBy) {
      const { col, ascending } = this.orderBy;
      rows = [...rows].sort((a, b) => {
        const av = a?.[col] ?? '';
        const bv = b?.[col] ?? '';
        const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv), 'pt-BR');
        return ascending ? cmp : -cmp;
      });
    }
    const count = rows.length;
    if (this.max !== null) rows = rows.slice(0, this.max);

    if (this.opts?.head) return { data: null, error: null, count };
    if (this.mode === 'maybeSingle') return { data: rows[0] ?? null, error: null, count };
    if (this.mode === 'single') {
      return rows.length === 1
        ? { data: rows[0], error: null, count }
        : { data: null, error: { message: 'Esperado exatamente 1 registro.' }, count };
    }
    return { data: rows, error: null, count };
  }

  then<TResult1 = DataResult, TResult2 = never>(
    onfulfilled?: ((value: DataResult) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): PromiseLike<TResult1 | TResult2> {
    return this.run().then(onfulfilled, onrejected);
  }
}

async function upsertRows(table: string, values: any): Promise<DataResult> {
  const rows = Array.isArray(values) ? values : [values];
  if (rows.length === 0) return { data: [], error: null };
  for (let i = 0; i < rows.length; i += UPSERT_BATCH_SIZE) {
    const res = await request('POST', `/api/data/${encodeURIComponent(table)}/upsert`, { rows: rows.slice(i, i + UPSERT_BATCH_SIZE) });
    if (res.error) return { data: null, error: res.error };
  }
  return { data: rows, error: null };
}

function idFilter(table: string, run: (id: string) => Promise<DataResult>) {
  return {
    eq(col: string, value: unknown): Promise<DataResult> {
      if (col !== 'id' || typeof value !== 'string') {
        return Promise.resolve({ data: null, error: { message: 'Operação suportada apenas por id.' } });
      }
      return run(value);
    }
  };
}

export function createBackendDataClient() {
  return {
    from(table: string) {
      return {
        select(_columns?: string, opts?: { count?: string; head?: boolean }) {
          return new SelectQuery(table, opts);
        },
        upsert(values: any, _opts?: unknown) {
          return upsertRows(table, values);
        },
        insert(values: any) {
          return upsertRows(table, values);
        },
        update(values: Record<string, unknown>) {
          return idFilter(table, id =>
            request('PATCH', `/api/data/${encodeURIComponent(table)}/${encodeURIComponent(id)}`, { values })
          );
        },
        delete() {
          return idFilter(table, id =>
            request('DELETE', `/api/data/${encodeURIComponent(table)}/${encodeURIComponent(id)}`)
          );
        }
      };
    },
    auth: {
      // A sessão é do backend (token Bearer); o logout local é feito pelo BjjContext.
      async signOut() {
        return { error: null };
      }
    }
  };
}

export type BackendDataClient = ReturnType<typeof createBackendDataClient>;
