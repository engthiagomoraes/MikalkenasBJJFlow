import json

with open('/tmp/parsed_students.json', 'r', encoding='utf-8') as f:
    students = json.load(f)

with open('/tmp/parsed_techniques.json', 'r', encoding='utf-8') as f:
    techniques = json.load(f)

with open('/tmp/parsed_lesson_plans.json', 'r', encoding='utf-8') as f:
    lesson_plans = json.load(f)

with open('/tmp/parsed_attendance.json', 'r', encoding='utf-8') as f:
    attendance = json.load(f)

with open('/tmp/base44_migration.sql', 'r', encoding='utf-8') as f:
    migration_sql = f.read()

# Payments
payments = []
for s in students:
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

ts_content = f"""// Dados importados e processados do Base44
import {{ Student, Technique, LessonPlan, AttendanceRecord, PaymentRecord }} from '../types';

export const BASE44_STUDENTS: Student[] = {json.dumps(students, ensure_ascii=False, indent=2)};

export const BASE44_TECHNIQUES: Technique[] = {json.dumps(techniques, ensure_ascii=False, indent=2)};

export const BASE44_LESSON_PLANS: LessonPlan[] = {json.dumps(lesson_plans, ensure_ascii=False, indent=2)};

export const BASE44_ATTENDANCE: AttendanceRecord[] = {json.dumps(attendance, ensure_ascii=False, indent=2)};

export const BASE44_PAYMENTS: PaymentRecord[] = {json.dumps(payments, ensure_ascii=False, indent=2)};

export const BASE44_MIGRATION_SQL: string = {json.dumps(migration_sql, ensure_ascii=False)};
"""

with open('/app/applet/src/data/base44Data.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print("Created /app/applet/src/data/base44Data.ts successfully!")
