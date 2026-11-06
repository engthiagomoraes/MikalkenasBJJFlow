import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compiledServer = path.resolve(__dirname, 'dist', 'server.js');

// Em produção (após build com NODE_ENV=production), executa o bundle JavaScript de alta performance
if (process.env.NODE_ENV === 'production' && fs.existsSync(compiledServer)) {
  const { pathToFileURL } = await import('url');
  await import(pathToFileURL(compiledServer).href);
} else {
  // Em desenvolvimento (tsx server.ts) ou fallback
  await import('./server/app.ts');
}

