import json

with open('/tmp/parsed_students.json', 'r', encoding='utf-8') as f:
    students = json.load(f)

with open('/tmp/parsed_techniques.json', 'r', encoding='utf-8') as f:
    techniques = json.load(f)

with open('/tmp/parsed_lesson_plans.json', 'r', encoding='utf-8') as f:
    lesson_plans = json.load(f)

with open('/tmp/parsed_attendance.json', 'r', encoding='utf-8') as f:
    attendance = json.load(f)

# Payments
payments = []
for idx, s in enumerate(students):
    payments.append({
        'id': f"pay-base44-{s['id']}",
        'studentId': s['id'],
        'studentNome': s['nome'],
        'plano': s['plano'],
        'mesReferencia': 'Outubro/2026',
        'valor': s['valorMensalidade'],
        'valorOriginal': 180,
        'desconto': max(0, 180 - s['valorMensalidade']),
        'dataVencimento': '2026-10-10',
        'status': s['statusPagamento'],
        'professorId': 'inst-thiago',
        'professorNome': 'Thiago Lopes de Moraes Silva',
        'chavePixProfessor': 'thiagomoraes.mail@gmail.com'
    })

print(f"Generated {len(payments)} payments")

# Generate SQL
sql_lines = []
sql_lines.append("-- =============================================================")
sql_lines.append("-- MIGRAÇÃO OFICIAL BASE44 > SUPABASE - BJJ FLOW")
sql_lines.append("-- =============================================================\n")

# 1. Alunos
sql_lines.append("-- 1. ALUNOS (11 Alunos Reais do Base44)")
for s in students:
    esc_nome = s['nome'].replace("'", "''")
    esc_obs = s['observacoesMedicas'].replace("'", "''")
    sql_lines.append(
        f"INSERT INTO alunos (id, nome, email, telefone, data_nascimento, data_inicio, faixa, graus, "
        f"data_ultima_graduacao, presencas_na_faixa, presencas_meta_grau, total_presencas_historico, "
        f"plano, valor_mensalidade, dia_vencimento, status_pagamento, observacoes_medicas, tamanho_kimono, "
        f"peso_kg, turma_preferida, professor_id, professor_nome, sistema_graduacao, performance) "
        f"VALUES ('{s['id']}', '{esc_nome}', '{s['email']}', '{s['telefone']}', '{s['dataNascimento']}', "
        f"'{s['dataInicio']}', '{s['faixa']}', {s['graus']}, '{s['dataUltimaGraduacao']}', {s['presencasNaFaixa']}, "
        f"{s['presencasMetaGrau']}, {s['totalPresencasHistorico']}, '{s['plano']}', {s['valorMensalidade']}, "
        f"{s['diaVencimento']}, '{s['statusPagamento']}', '{esc_obs}', '{s['tamanhoKimono']}', {s['pesoKg']}, "
        f"'{s['turmaPreferida']}', '{s['professorId']}', '{s['professorNome']}', '{s['sistemaGraduacao']}', "
        f"'{json.dumps(s['performance'])}') "
        f"ON CONFLICT (id) DO UPDATE SET "
        f"nome = EXCLUDED.nome, email = EXCLUDED.email, telefone = EXCLUDED.telefone, "
        f"faixa = EXCLUDED.faixa, graus = EXCLUDED.graus, plano = EXCLUDED.plano, "
        f"valor_mensalidade = EXCLUDED.valor_mensalidade, status_pagamento = EXCLUDED.status_pagamento, "
        f"presencas_na_faixa = EXCLUDED.presencas_na_faixa, total_presencas_historico = EXCLUDED.total_presencas_historico, "
        f"observacoes_medicas = EXCLUDED.observacoes_medicas;"
    )

# 2. Técnicas
sql_lines.append("\n-- 2. TÉCNICAS (72 Técnicas Catalogadas)")
for t in techniques:
    esc_title = t['titulo'].replace("'", "''")
    esc_desc = t['descricao'].replace("'", "''")
    pontos_json = json.dumps(t['pontosChave'], ensure_ascii=False).replace("'", "''")
    tags_json = json.dumps(t['tags'], ensure_ascii=False).replace("'", "''")
    sql_lines.append(
        f"INSERT INTO tecnicas (id, titulo, categoria, faixa_minima, nivel, tipo, descricao, pontos_chave, tags) "
        f"VALUES ('{t['id']}', '{esc_title}', '{t['categoria']}', '{t['faixaMinima']}', '{t['nivel']}', '{t['tipo']}', "
        f"'{esc_desc}', '{pontos_json}', '{tags_json}') "
        f"ON CONFLICT (id) DO UPDATE SET "
        f"titulo = EXCLUDED.titulo, categoria = EXCLUDED.categoria, faixa_minima = EXCLUDED.faixa_minima, "
        f"nivel = EXCLUDED.nivel, tipo = EXCLUDED.tipo, descricao = EXCLUDED.descricao;"
    )

# 3. Planos de Aula
sql_lines.append("\n-- 3. PLANOS DE AULA (21 Aulas Concluídas)")
for lp in lesson_plans:
    esc_tema = lp['temaPrincipal'].replace("'", "''")
    esc_obs = lp['observacoes'].replace("'", "''")
    techs_json = json.dumps(lp['tecnicas'], ensure_ascii=False).replace("'", "''")
    sql_lines.append(
        f"INSERT INTO planos_aula (id, data, semana_ciclo, tema_principal, observacoes, tecnicas, concluida, "
        f"professor_id, professor_nome, turma_id, turma_nome) "
        f"VALUES ('{lp['id']}', '{lp['data']}', {lp['semanaCiclo']}, '{esc_tema}', '{esc_obs}', '{techs_json}', "
        f"{str(lp['concluida']).lower()}, '{lp['professorId']}', '{lp['professorNome']}', '{lp['turmaId']}', '{lp['turmaNome']}') "
        f"ON CONFLICT (id) DO UPDATE SET "
        f"tema_principal = EXCLUDED.tema_principal, observacoes = EXCLUDED.observacoes, concluida = EXCLUDED.concluida;"
    )

# 4. Presenças
sql_lines.append("\n-- 4. PRESENÇAS (101 Registros de Chamada)")
for att in attendance:
    esc_nome = att['studentNome'].replace("'", "''")
    esc_obs = att['observacao'].replace("'", "''")
    sql_lines.append(
        f"INSERT INTO presencas (id, student_id, student_nome, student_faixa, student_graus, turma_id, "
        f"turma_titulo, data, horario, confirmado_por) "
        f"VALUES ('{att['id']}', '{att['studentId']}', '{esc_nome}', '{att['studentFaixa']}', {att['studentGraus']}, "
        f"'{att['turmaId']}', '{att['turmaTitulo']}', '{att['data']}', '{att['horario']}', '{att['confirmadoPor']}') "
        f"ON CONFLICT (id) DO NOTHING;"
    )

# 5. Pagamentos
sql_lines.append("\n-- 5. PAGAMENTOS (Mensalidades dos Atletas)")
for p in payments:
    esc_nome = p['studentNome'].replace("'", "''")
    sql_lines.append(
        f"INSERT INTO pagamentos (id, student_id, student_nome, plano, mes_referencia, valor, valor_original, "
        f"desconto, data_vencimento, status, professor_id, professor_nome, chave_pix_professor) "
        f"VALUES ('{p['id']}', '{p['studentId']}', '{esc_nome}', '{p['plano']}', '{p['mesReferencia']}', "
        f"{p['valor']}, {p['valorOriginal']}, {p['desconto']}, '{p['dataVencimento']}', '{p['status']}', "
        f"'{p['professorId']}', '{p['professorNome']}', '{p['chavePixProfessor']}') "
        f"ON CONFLICT (id) DO UPDATE SET "
        f"status = EXCLUDED.status, valor = EXCLUDED.valor;"
    )

with open('/tmp/base44_migration.sql', 'w', encoding='utf-8') as f:
    f.write('\n'.join(sql_lines))

print(f"Generated SQL with {len(sql_lines)} lines")
