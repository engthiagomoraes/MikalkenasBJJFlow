import 'dotenv/config';
import express from 'express';
import path from 'path';
import serverRouter from './index';
import { getSessionSecret } from './services/session';
import { assertBackendSupabaseConfig } from './services/supabaseBackend';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Validação de configuração na inicialização (5.2 e 10.2).
 * Em produção, o servidor NÃO inicia sem SESSION_SECRET e SUPABASE_SERVICE_ROLE_KEY.
 * Os valores nunca são impressos em log.
 */
function validateSecurityConfig(): void {
  const problems: string[] = [];
  try {
    getSessionSecret();
  } catch (e: any) {
    problems.push(e.message);
  }
  try {
    assertBackendSupabaseConfig();
  } catch (e: any) {
    problems.push(e.message);
  }
  for (const key of Object.keys(process.env)) {
    if (key.startsWith('VITE_') && /SERVICE|SECRET/i.test(key)) {
      problems.push(`Variável ${key} não pode existir: chaves secretas nunca usam o prefixo VITE_.`);
    }
  }

  if (problems.length === 0) return;
  if (isProduction) {
    problems.forEach(p => console.error('[FATAL CONFIG]', p));
    throw new Error('Configuração de segurança incompleta. O servidor não será iniciado.');
  }
  problems.forEach(p => console.warn('[CONFIG WARNING]', p));
}

export async function startServer() {
  validateSecurityConfig();

  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : (process.env.DEFAULT_APP_PORT ? parseInt(process.env.DEFAULT_APP_PORT, 10) : 3000);

  app.disable('x-powered-by');

  // IP real do cliente para rate limit. Configure TRUST_PROXY (ex.: "1") somente se houver proxy reverso confiável.
  const trustProxy = process.env.TRUST_PROXY;
  app.set('trust proxy', trustProxy ? (/^\d+$/.test(trustProxy) ? parseInt(trustProxy, 10) : trustProxy) : 'loopback');

  // Cabeçalhos de segurança básicos (equivalente mínimo ao helmet, sem quebrar o Vite em dev)
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    if (isProduction) {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    if (req.path.startsWith('/api/')) {
      res.setHeader('Cache-Control', 'no-store');
    }
    next();
  });

  // HTTPS obrigatório em produção (atrás de proxy que informa X-Forwarded-Proto)
  if (isProduction && process.env.FORCE_HTTPS === 'true') {
    app.use((req, res, next) => {
      if (req.secure) return next();
      res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
    });
  }

  // Limite de tamanho do corpo: 10kb para autenticação/usuários, 5mb para sincronização de dados, 1mb no restante
  app.use(['/api/auth', '/api/users'], express.json({ limit: '10kb' }));
  app.use('/api/data', express.json({ limit: '5mb' }));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // Sem CORS: a API só atende o próprio domínio do frontend (mesma origem).

  // Montagem das rotas de API do Backend em /api
  app.use('/api', serverRouter);

  // Tratamento 404 estrito para rotas /api e /api/* não mapeadas (garante JSON, nunca HTML)
  app.all(['/api', '/api/*'], (_req, res) => {
    res.status(404).json({ success: false, error: 'Endpoint da API não encontrado' });
  });

  // Erros da API: detalhes só no log, mensagem genérica ao cliente
  app.use('/api', (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = err.status || err.statusCode || 500;
    console.error('[API SERVER ERROR]', status, err?.type || err?.code || '', err?.message);
    res.status(status).json({
      success: false,
      message: status === 413 ? 'Requisição muito grande.' : status < 500 ? 'Requisição inválida.' : 'Erro interno no servidor.',
      error_code: status === 413 ? 'PAYLOAD_TOO_LARGE' : 'INTERNAL_SERVER_ERROR'
    });
  });

  // Integração com Frontend
  if (isProduction) {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa'
      });
      app.use(vite.middlewares);
    } catch {
      console.warn('[DEV] Vite middleware indisponível, servindo estáticos se existirem.');
      const distPath = path.resolve(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🥋 Ternatio BJJ Full-Stack Server rodando na porta ${PORT}`);
  });
}

// Se executado diretamente
startServer().catch((err) => {
  console.error('Falha ao inicializar servidor Ternatio BJJ:', err?.message || err);
  process.exit(1);
});
