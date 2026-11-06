import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import serverRouter from './index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : (process.env.DEFAULT_APP_PORT ? parseInt(process.env.DEFAULT_APP_PORT, 10) : 3000);

  // Middlewares básicos para requisições JSON e URL encoded
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Montagem das rotas de API do Backend em /api
  app.use('/api', serverRouter);

  // Tratamento 404 estrito para rotas /api e /api/* não mapeadas (garante JSON, nunca HTML)
  app.all(['/api', '/api/*'], (_req, res) => {
    res.status(404).json({ success: false, error: 'Endpoint da API não encontrado' });
  });

  // Middleware de tratamento de erro para rotas /api (garante resposta JSON, nunca HTML)
  app.use('/api', (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('[API SERVER ERROR]', err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Erro interno no servidor.',
      error_code: err.code || 'INTERNAL_SERVER_ERROR'
    });
  });

  // Integração com Frontend
  if (process.env.NODE_ENV === 'production') {
    // Modo de Produção: Servir arquivos estáticos construídos (dist/)
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    // Modo de Desenvolvimento: Vite Middleware (HMR/compilação instantânea)
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa'
      });
      app.use(vite.middlewares);
    } catch (viteErr) {
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
  console.error('Falha ao inicializar servidor Ternatio BJJ:', err);
  process.exit(1);
});
