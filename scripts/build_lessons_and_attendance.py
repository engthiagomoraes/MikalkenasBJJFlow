import csv
import json
from collections import defaultdict

# Load parsed students
with open('/tmp/parsed_students.json', 'r', encoding='utf-8') as f:
    students = json.load(f)
student_map = {s['id']: s for s in students}

# Load parsed techniques
with open('/tmp/parsed_techniques.json', 'r', encoding='utf-8') as f:
    techniques = json.load(f)
tech_map = {t['id']: t for t in techniques}

# Load technique_dates to know what was taught when
tech_dates = defaultdict(list)
with open('/tmp/technique_dates.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        tid = row['technique_id']
        dt = row['date_taught']
        if tid in tech_map:
            tech_dates[dt].append(tech_map[tid])

print(f"Dates with techniques taught: {len(tech_dates)}")

# 1. Lesson Plans from /tmp/aulas.csv
lesson_plans = []
with open('/tmp/aulas.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for idx, row in enumerate(reader):
        aid = row['id']
        dt = row['data']
        obs = row.get('observacoes', '').strip()
        status = row.get('status', 'Concluída')
        
        linked_techs = tech_dates.get(dt, [])
        tech_names = [t['titulo'] for t in linked_techs]
        
        tema = obs if obs else (', '.join(tech_names[:3]) if tech_names else f"Treino Técnico de Sábado ({dt})")
        
        lesson_plans.append({
            'id': aid,
            'data': dt,
            'semanaCiclo': (idx % 4) + 1,
            'temaPrincipal': tema,
            'observacoes': obs or 'informar',
            'tecnicas': tech_names if tech_names else ['Fundamentos de BJJ', 'Drills'],
            'concluida': status == 'Concluída',
            'professorId': 'inst-thiago',
            'professorNome': 'Thiago Lopes de Moraes Silva',
            'turmaId': 'turma-sabado',
            'turmaNome': 'Jiu-Jitsu de Sábado (Técnica & Rola)'
        })

print(f"Total lesson plans: {len(lesson_plans)}")
with open('/tmp/parsed_lesson_plans.json', 'w', encoding='utf-8') as f:
    json.dump(lesson_plans, f, ensure_ascii=False, indent=2)

# 2. Attendance Records
attendance_records = []
with open('/tmp/attendance.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        sid = row['student_id']
        st = student_map.get(sid)
        if not st:
            continue
            
        dt = row['data']
        pres = row.get('presente') == 'true'
        obs = row.get('observacao', '').strip() or 'informar'
        
        attendance_records.append({
            'id': row['id'],
            'studentId': sid,
            'studentNome': st['nome'],
            'studentFaixa': st['faixa'],
            'studentGraus': st['graus'],
            'turmaId': 'turma-sabado',
            'turmaTitulo': 'Jiu-Jitsu de Sábado (Técnica & Rola)',
            'data': dt,
            'horario': '11:00 - 12:30',
            'confirmadoPor': 'Thiago Lopes de Moraes Silva',
            'presente': pres,
            'observacao': obs
        })

print(f"Total attendance records: {len(attendance_records)}")
with open('/tmp/parsed_attendance.json', 'w', encoding='utf-8') as f:
    json.dump(attendance_records, f, ensure_ascii=False, indent=2)

# 3. Compute Learned Techniques per Student
student_learned_techs = defaultdict(list)
for att in attendance_records:
    if att['presente']:
        dt = att['data']
        techs_on_day = tech_dates.get(dt, [])
        for t in techs_on_day:
            student_learned_techs[att['studentId']].append({
                'id': f"lt-{att['id']}-{t['id']}",
                'techniqueId': t['id'],
                'titulo': t['titulo'],
                'categoria': t['categoria'],
                'dataAprendida': dt,
                'turmaNome': 'Jiu-Jitsu de Sábado',
                'professorNome': 'Thiago Lopes de Moraes Silva'
            })

for s in students:
    learned = student_learned_techs.get(s['id'], [])
    # Unique by techniqueId
    seen = set()
    uniq = []
    for l in learned:
        if l['techniqueId'] not in seen:
            seen.add(l['techniqueId'])
            uniq.append(l)
    s['tecnicasAprendidas'] = uniq

with open('/tmp/parsed_students.json', 'w', encoding='utf-8') as f:
    json.dump(students, f, ensure_ascii=False, indent=2)
print("Updated students with learned techniques")
