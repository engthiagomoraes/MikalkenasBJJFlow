import csv
import json
from collections import defaultdict

# 1. Read attendance
attendance_by_student = defaultdict(list)
all_attendance = []

with open('/tmp/attendance.csv', mode='r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        all_attendance.append(row)
        if row.get('presente') == 'true':
            attendance_by_student[row['student_id']].append(row)

print(f"Total attendance records: {len(all_attendance)}")
for st_id, atts in attendance_by_student.items():
    print(f"Student {st_id}: {len(atts)} presencas confirmadas")

# 2. Read students
students = []
belt_map = {
    'branca': 'branca',
    'cinza': 'cinza',
    'amarela': 'amarela',
    'laranja': 'laranja',
    'verde': 'verde',
    'azul': 'azul',
    'roxa': 'roxa',
    'marrom': 'marrom',
    'preta': 'preta'
}

with open('/tmp/students.csv', mode='r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        sid = row['id']
        nome = row['nome']
        faixa_raw = row.get('faixa', 'Branca').lower().strip()
        faixa = belt_map.get(faixa_raw, 'branca')
        
        email = row.get('email', '').strip()
        if not email:
            email = f"{nome.lower().replace(' ', '.')}@informar.com"
            
        telefone = row.get('telefone', '').strip() or 'informar'
        
        plano_raw = row.get('plano_contratado', '').lower().strip()
        if 'social' in plano_raw:
            plano = 'projeto_social'
            valor = 0.0
            status_pag = 'isento'
        elif 'bolsa' in plano_raw:
            plano = 'bolsista'
            desc = float(row.get('desconto_porcentagem') or 40)
            valor = round(180.0 * (1 - desc/100.0), 2)
            status_pag = 'em_dia' if row.get('ativo') == 'true' else 'pendente'
        else:
            plano = 'regular'
            valor = 180.0
            status_pag = 'em_dia' if row.get('ativo') == 'true' else 'pendente'

        presencas_count = len(attendance_by_student.get(sid, []))
        
        obs_list = []
        if row.get('nome_responsavel'):
            obs_list.append(f"Responsável: {row['nome_responsavel']}")
        if row.get('menor_de_16') == 'true':
            obs_list.append("Menor de 16 anos")
        obs = '; '.join(obs_list) or 'informar'

        data_inicio = row.get('data_inicio') or row.get('created_date', '')[:10] or '2025-10-25'
        data_nasc = row.get('data_aniversario') or 'informar'
        data_grad = row.get('data_ultima_graduacao') or data_inicio

        student_obj = {
            'id': sid,
            'nome': nome,
            'email': email,
            'telefone': telefone,
            'dataNascimento': data_nasc,
            'dataInicio': data_inicio,
            'faixa': faixa,
            'graus': 2 if faixa == 'roxa' else (1 if faixa in ['verde', 'azul', 'amarela'] else 0),
            'dataUltimaGraduacao': data_grad,
            'presencasNaFaixa': presencas_count,
            'presencasMetaGrau': 40,
            'totalPresencasHistorico': presencas_count,
            'plano': plano,
            'valorMensalidade': valor,
            'diaVencimento': 10,
            'statusPagamento': status_pag,
            'observacoesMedicas': obs,
            'tamanhoKimono': 'informar',
            'pesoKg': 75.0,
            'turmaPreferida': 'Jiu-Jitsu de Sábado (Técnica & Rola)',
            'professorId': 'inst-thiago',
            'professorNome': 'Thiago Lopes de Moraes Silva',
            'sistemaGraduacao': 'graus_e_faixas',
            'ativo': row.get('ativo') == 'true',
            'performance': {
                'guarda': 7.5,
                'passagem': 7.0,
                'quedas': 6.5,
                'finalizacoes': 7.0,
                'defesa': 7.5,
                'disciplina': 9.0,
                'tempoRolaMinutos': presencas_count * 25,
                'finalizacoesAplicadas': presencas_count * 2,
                'raspagensFeitas': presencas_count * 3
            }
        }
        students.append(student_obj)

print(f"Total students parsed: {len(students)}")

with open('/tmp/parsed_students.json', 'w', encoding='utf-8') as f:
    json.dump(students, f, ensure_ascii=False, indent=2)

# 3. Read techniques
techniques = []
with open('/tmp/techniques.csv', mode='r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        cat = row.get('category', 'Finalização').strip() or 'Finalização'
        valid_cats = ['Finalização', 'Raspagem', 'Passagem de Guarda', 'Queda', 'Guarda', 'Defesa Pessoal', 'Defesa', 'Costas', 'Drill']
        if cat == 'Defesa':
            cat = 'Defesa Pessoal'
            
        name = row['name'].strip()
        desc = row.get('description', '').strip() or 'informar'
        video = row.get('video_url', '').strip() or 'informar'
        
        # Determine belt
        faixa_minima = 'branca'
        if any(w in name.lower() for w in ['heel hook', 'slicer', 'berimbolo', 'estima']):
            faixa_minima = 'marrom'
        elif any(w in name.lower() for w in ['kneebar', 'toe hold', 'omoplata']):
            faixa_minima = 'azul'
            
        techniques.append({
            'id': row['id'],
            'titulo': name,
            'categoria': cat,
            'faixaMinima': faixa_minima,
            'nivel': 'Avançado' if faixa_minima == 'marrom' else ('Intermediário' if faixa_minima == 'azul' else 'Iniciante'),
            'tipo': 'No-Gi' if 'no gi' in name.lower() else ('Gi' if 'kimono' in name.lower() or 'lapela' in name.lower() else 'Ambos'),
            'descricao': desc,
            'pontosChave': [p.strip() for p in desc.split('.') if p.strip()] or ['informar'],
            'tags': [cat, 'Base44', 'Currículo'],
            'videoUrl': video
        })

print(f"Total techniques parsed: {len(techniques)}")

with open('/tmp/parsed_techniques.json', 'w', encoding='utf-8') as f:
    json.dump(techniques, f, ensure_ascii=False, indent=2)
