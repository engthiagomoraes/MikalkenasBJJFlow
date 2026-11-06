-- ==============================================================================
-- TERNATIO BJJ - POLÍTICAS DE ROW LEVEL SECURITY (RLS)
-- Camada de Segurança e Controle de Acesso no Banco de Dados
-- ==============================================================================

-- 1. HABILITAR RLS NAS TABELAS PRINCIPAIS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE professores ENABLE ROW LEVEL SECURITY;
ALTER TABLE alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE turmas ENABLE ROW LEVEL SECURITY;
ALTER TABLE presencas ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tecnicas ENABLE ROW LEVEL SECURITY;

-- 2. POLÍTICAS PARA A TABELA 'usuarios'
DROP POLICY IF EXISTS "Permitir auto-cadastro pendente" ON usuarios;
CREATE POLICY "Permitir auto-cadastro pendente" ON usuarios
FOR INSERT WITH CHECK (status = 'pendente');

DROP POLICY IF EXISTS "Permitir leitura de usuários" ON usuarios;
CREATE POLICY "Permitir leitura de usuários" ON usuarios
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir atualização de usuários" ON usuarios;
CREATE POLICY "Permitir atualização de usuários" ON usuarios
FOR UPDATE USING (true);

-- 3. POLÍTICAS PARA A TABELA 'professores'
DROP POLICY IF EXISTS "Permitir leitura pública professores" ON professores;
CREATE POLICY "Permitir leitura pública professores" ON professores 
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir mutação professores" ON professores;
CREATE POLICY "Permitir mutação professores" ON professores 
FOR ALL USING (true);

-- 4. POLÍTICAS PARA A TABELA 'alunos'
DROP POLICY IF EXISTS "Permitir leitura pública alunos" ON alunos;
CREATE POLICY "Permitir leitura pública alunos" ON alunos 
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir mutação alunos" ON alunos;
CREATE POLICY "Permitir mutação alunos" ON alunos 
FOR ALL USING (true);

-- 5. POLÍTICAS PARA TURMAS, PRESENÇAS, PAGAMENTOS E EVENTOS
DROP POLICY IF EXISTS "Permitir acesso turmas" ON turmas;
CREATE POLICY "Permitir acesso turmas" ON turmas FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir acesso presencas" ON presencas;
CREATE POLICY "Permitir acesso presencas" ON presencas FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir acesso pagamentos" ON pagamentos;
CREATE POLICY "Permitir acesso pagamentos" ON pagamentos FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir acesso eventos" ON eventos;
CREATE POLICY "Permitir acesso eventos" ON eventos FOR ALL USING (true);

DROP POLICY IF EXISTS "Permitir acesso tecnicas" ON tecnicas;
CREATE POLICY "Permitir acesso tecnicas" ON tecnicas FOR ALL USING (true);
