<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/815d15fa-21bc-4c54-b66e-859c58225c11

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Segurança — configuração obrigatória do servidor

O backend não inicia em produção sem estas variáveis (veja `.env.example`):

| Variável | Valor |
| --- | --- |
| `SUPABASE_URL` | URL do projeto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | chave `sb_secret_...` — só no servidor, nunca com prefixo `VITE_` |
| `SESSION_SECRET` | ≥ 32 caracteres aleatórios (`node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`) |

O navegador **não** acessa as tabelas do Supabase: todo dado passa pelo backend
(`/api/data/:tabela`, `/api/system/tables`), que valida a sessão e o papel do usuário.
A chave pública (`sb_publishable_...`) não tem permissão em nenhuma tabela.

### Migrações do banco (`server/db/migrations`)

Todas aplicadas em 10/11/2026: 01 (usuários/senha/auditoria), 02 (RLS de usuários),
03 (status), 04 (tabelas de negócio fechadas para a chave pública) e
05 (constraints de status/papel e default privileges). São idempotentes.
