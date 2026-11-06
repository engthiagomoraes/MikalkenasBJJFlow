import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileSpreadsheet, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Sparkles, 
  CloudUpload, 
  Database, 
  Copy, 
  Check, 
  Users, 
  UserRound, 
  Clock, 
  BookOpen, 
  CalendarCheck, 
  CreditCard,
  HelpCircle,
  RefreshCw,
  Info
} from 'lucide-react';
import { 
  BeltColor, 
  PlanType, 
  PaymentStatus,
  Student, 
  Technique, 
  Instructor, 
  ClassSchedule, 
  AttendanceRecord, 
  PaymentRecord 
} from '../../types';
import { useBjj } from '../../context/BjjContext';
import { generateDataMigrationSql } from '../../services/supabaseService';

export type ImportType = 'students' | 'professors' | 'classes' | 'techniques' | 'attendance' | 'payments';

interface BatchUploadModalProps {
  type?: ImportType;
  onClose: () => void;
  onSuccess?: (count: number) => void;
}

export const BatchUploadModal: React.FC<BatchUploadModalProps> = ({ 
  type: initialType = 'students', 
  onClose, 
  onSuccess 
}) => {
  const { 
    instructors, 
    classes,
    students,
    attendance,
    graduations,
    payments,
    lessonPlans,
    techniques,
    allUsers,
    academySettings,
    supabaseConfig,
    importStudents, 
    importInstructors,
    importClasses,
    importTechniques,
    importAttendance,
    importPayments,
    syncDataWithSupabase 
  } = useBjj();

  const [activeType, setActiveType] = useState<ImportType>(initialType);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [rawText, setRawText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [parseError, setParseError] = useState<string | null>(null);
  const [importedCount, setImportedCount] = useState<number | null>(null);
  const [informarCount, setInformarCount] = useState<number>(0);

  // Syncing to Supabase
  const [syncingToSupabase, setSyncingToSupabase] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // Parsed previews for each entity
  const [previewStudents, setPreviewStudents] = useState<Array<Omit<Student, 'id' | 'presencasNaFaixa' | 'totalPresencasHistorico' | 'performance'>>>([]);
  const [previewInstructors, setPreviewInstructors] = useState<Array<Omit<Instructor, 'id'>>>([]);
  const [previewClasses, setPreviewClasses] = useState<Array<Omit<ClassSchedule, 'id'>>>([]);
  const [previewTechniques, setPreviewTechniques] = useState<Array<Omit<Technique, 'id'>>>([]);
  const [previewAttendance, setPreviewAttendance] = useState<Array<Omit<AttendanceRecord, 'id'>>>([]);
  const [previewPayments, setPreviewPayments] = useState<Array<Omit<PaymentRecord, 'id'>>>([]);

  // Entity config & labels
  const entityMeta: Record<ImportType, { label: string; icon: React.ReactNode; filename: string }> = {
    students: { label: 'Alunos', icon: <Users className="w-4 h-4" />, filename: 'modelo_alunos_bjj.csv' },
    professors: { label: 'Professores', icon: <UserRound className="w-4 h-4" />, filename: 'modelo_professores_bjj.csv' },
    classes: { label: 'Turmas / Horários', icon: <Clock className="w-4 h-4" />, filename: 'modelo_turmas_bjj.csv' },
    techniques: { label: 'Técnicas', icon: <BookOpen className="w-4 h-4" />, filename: 'modelo_tecnicas_bjj.csv' },
    attendance: { label: 'Presenças', icon: <CalendarCheck className="w-4 h-4" />, filename: 'modelo_presencas_bjj.csv' },
    payments: { label: 'Pagamentos / PIX', icon: <CreditCard className="w-4 h-4" />, filename: 'modelo_pagamentos_bjj.csv' },
  };

  // Switch entity tab
  const handleSwitchType = (newType: ImportType) => {
    setActiveType(newType);
    setRawText('');
    setFileName('');
    setParseError(null);
    setImportedCount(null);
    setInformarCount(0);
    setSyncResult(null);
    setPreviewStudents([]);
    setPreviewInstructors([]);
    setPreviewClasses([]);
    setPreviewTechniques([]);
    setPreviewAttendance([]);
    setPreviewPayments([]);
  };

  // Normalize header strings
  const normalize = (str: string) => str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  // Parse CSV text according to active type
  const parseCsvData = (text: string, entityType: ImportType = activeType) => {
    try {
      setParseError(null);
      const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
      if (lines.length < 2) {
        setParseError('O CSV deve conter pelo menos uma linha de cabeçalho e uma linha de dados.');
        return;
      }

      // Detect delimiter
      const firstLine = lines[0];
      const delimiter = firstLine.includes(';') ? ';' : firstLine.includes('\t') ? '\t' : ',';
      const headers = firstLine.split(delimiter).map(h => normalize(h.replace(/['"]/g, '')));

      let missingFieldsDetected = 0;
      const todayStr = new Date().toISOString().split('T')[0];

      // Helper to find column value by potential header names
      const getVal = (row: string[], aliases: string[]): string => {
        for (let i = 0; i < headers.length; i++) {
          if (aliases.some(a => headers[i].includes(normalize(a)))) {
            return (row[i] || '').trim();
          }
        }
        return '';
      };

      if (entityType === 'students') {
        const parsed: Array<Omit<Student, 'id' | 'presencasNaFaixa' | 'totalPresencasHistorico' | 'performance'>> = [];
        const validBelts: BeltColor[] = ['branca', 'cinza', 'amarela', 'laranja', 'verde', 'azul', 'roxa', 'marrom', 'preta'];

        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(delimiter).map(c => c.trim().replace(/^['"]|['"]$/g, ''));
          if (row.length < 1 || !row.some(Boolean)) continue;

          // Nome
          const rawNome = getVal(row, ['nome', 'name', 'aluno']) || row[0];
          if (!rawNome) continue;

          // Email
          const rawEmail = getVal(row, ['email', 'e-mail', 'correio']);
          let email = rawEmail;
          if (!email) {
            email = `${rawNome.toLowerCase().replace(/[^a-z0-9]/g, '.')}@informar.com`;
            missingFieldsDetected++;
          }

          // Telefone
          const rawTel = getVal(row, ['telefone', 'fone', 'celular', 'whatsapp', 'tel']);
          const telefone = rawTel || 'informar';
          if (!rawTel) missingFieldsDetected++;

          // Faixa
          const rawFaixa = normalize(getVal(row, ['faixa', 'belt', 'graduacao']));
          const faixa: BeltColor = validBelts.includes(rawFaixa as BeltColor) ? (rawFaixa as BeltColor) : 'branca';
          if (!rawFaixa) missingFieldsDetected++;

          // Graus
          const rawGraus = getVal(row, ['grau', 'graus', 'stripes']);
          const graus = Math.min(4, Math.max(0, parseInt(rawGraus) || 0));

          // Plano
          const rawPlano = normalize(getVal(row, ['plano', 'plan', 'categoria']));
          let plano: PlanType = 'regular';
          if (rawPlano.includes('infantil') || rawPlano.includes('kid')) plano = 'infantil';
          else if (rawPlano.includes('bolsa') || rawPlano.includes('atleta')) plano = 'bolsista';
          else if (rawPlano.includes('social') || rawPlano.includes('gratuito')) plano = 'projeto_social';

          // Mensalidade
          const rawValor = getVal(row, ['mensalidade', 'valor', 'preco', 'preco_mensalidade']);
          const defaultVal = plano === 'regular' ? 180 : plano === 'infantil' ? 130 : plano === 'bolsista' ? 70 : 0;
          const valorMensalidade = rawValor ? parseFloat(rawValor.replace('R$', '').replace(',', '.')) || defaultVal : defaultVal;

          // Dia vencimento
          const rawVenc = getVal(row, ['vencimento', 'dia_vencimento', 'dia']);
          const diaVencimento = parseInt(rawVenc) || 10;

          // Tamanho Kimono
          const rawKimono = getVal(row, ['kimono', 'tamanho_kimono', 'tamanho']);
          const tamanhoKimono = rawKimono || 'informar';
          if (!rawKimono) missingFieldsDetected++;

          // Peso Kg
          const rawPeso = getVal(row, ['peso', 'peso_kg', 'kg']);
          const pesoKg = parseFloat(rawPeso) || 75;

          // Turma preferida
          const rawTurma = getVal(row, ['turma', 'turma_preferida', 'horario']);
          const turmaPreferida = rawTurma || 'informar';
          if (!rawTurma) missingFieldsDetected++;

          // Professor
          const rawProf = getVal(row, ['professor', 'mestre', 'instrutor', 'prof']);
          const matchedProf = instructors.find(inst => 
            (rawProf && inst.nome.toLowerCase().includes(rawProf.toLowerCase())) ||
            (rawProf && inst.id === rawProf)
          ) || instructors[0];

          parsed.push({
            nome: rawNome,
            email,
            telefone,
            dataNascimento: getVal(row, ['nascimento', 'data_nascimento']) || 'informar',
            dataInicio: getVal(row, ['inicio', 'data_inicio']) || todayStr,
            faixa,
            graus,
            dataUltimaGraduacao: todayStr,
            presencasMetaGrau: 40,
            plano,
            valorMensalidade,
            diaVencimento,
            statusPagamento: plano === 'projeto_social' ? 'isento' : 'pendente',
            tamanhoKimono,
            pesoKg,
            turmaPreferida,
            professorId: matchedProf?.id,
            professorNome: matchedProf?.nome || 'Thiago Lopes de Moraes Silva',
            observacoesMedicas: getVal(row, ['observacao', 'medica', 'obs']) || 'informar'
          });
        }

        if (parsed.length === 0) throw new Error('Nenhum aluno válido identificado no CSV.');
        setPreviewStudents(parsed);
        setInformarCount(missingFieldsDetected);

      } else if (entityType === 'professors') {
        const parsed: Array<Omit<Instructor, 'id'>> = [];
        const validBelts: BeltColor[] = ['marrom', 'preta', 'roxa', 'azul'];

        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(delimiter).map(c => c.trim().replace(/^['"]|['"]$/g, ''));
          if (row.length < 1 || !row.some(Boolean)) continue;

          const nome = getVal(row, ['nome', 'professor', 'mestre']) || row[0];
          if (!nome) continue;

          const rawEmail = getVal(row, ['email', 'e-mail']);
          const email = rawEmail || `${nome.toLowerCase().replace(/[^a-z0-9]/g, '.')}@informar.com`;
          if (!rawEmail) missingFieldsDetected++;

          const rawTel = getVal(row, ['telefone', 'fone', 'celular', 'whatsapp']);
          const telefone = rawTel || 'informar';
          if (!rawTel) missingFieldsDetected++;

          const rawFaixa = normalize(getVal(row, ['faixa', 'belt']));
          const faixa: BeltColor = validBelts.includes(rawFaixa as BeltColor) ? (rawFaixa as BeltColor) : 'preta';

          const graus = parseInt(getVal(row, ['graus', 'grau'])) || 1;
          const registroCBJJ = getVal(row, ['cbjj', 'registro', 'federacao']) || 'informar';
          const bio = getVal(row, ['bio', 'biografia', 'sobre']) || 'informar';
          const chavePix = getVal(row, ['pix', 'chave_pix']) || email || 'informar';
          const banco = getVal(row, ['banco', 'conta']) || 'informar';

          const rawTurmas = getVal(row, ['turmas', 'aulas']);
          const turmasList = rawTurmas ? rawTurmas.split(';').map(t => t.trim()) : ['informar'];

          parsed.push({
            nome,
            faixa,
            graus,
            email,
            telefone,
            registroCBJJ,
            bio,
            turmas: turmasList,
            chavePix,
            banco,
            sistemaGraduacao: 'graus_e_faixas'
          });
        }

        if (parsed.length === 0) throw new Error('Nenhum professor válido identificado no CSV.');
        setPreviewInstructors(parsed);
        setInformarCount(missingFieldsDetected);

      } else if (entityType === 'classes') {
        const parsed: Array<Omit<ClassSchedule, 'id'>> = [];

        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(delimiter).map(c => c.trim().replace(/^['"]|['"]$/g, ''));
          if (row.length < 1 || !row.some(Boolean)) continue;

          const titulo = getVal(row, ['titulo', 'turma', 'nome']) || row[0];
          if (!titulo) continue;

          const diaSemana = getVal(row, ['dia', 'dias', 'dia_semana']) || 'informar';
          if (diaSemana === 'informar') missingFieldsDetected++;

          const horario = getVal(row, ['horario', 'hora', 'tempo']) || 'informar';
          if (horario === 'informar') missingFieldsDetected++;

          const rawCat = getVal(row, ['categoria', 'nivel']);
          let categoria: ClassSchedule['categoria'] = 'Iniciante';
          if (rawCat.includes('Avan') || rawCat.includes('Inter')) categoria = 'Intermediário/Avançado';
          else if (rawCat.includes('Kid') || rawCat.includes('Infantil')) categoria = 'Infantil (Kids)';
          else if (rawCat.includes('No-Gi')) categoria = 'No-Gi (Sem Kimono)';
          else if (rawCat.includes('Compet')) categoria = 'Competição';
          else if (rawCat.includes('Open')) categoria = 'Open Mat';

          const profNomeOrId = getVal(row, ['professor', 'mestre', 'instrutor']);
          const matchedProf = instructors.find(inst => 
            inst.nome.toLowerCase().includes(profNomeOrId.toLowerCase()) || 
            inst.id === profNomeOrId
          ) || instructors[0];

          const sala = getVal(row, ['sala', 'tatame', 'espaco']) || 'Tatame 1 (Principal)';

          parsed.push({
            titulo,
            diaSemana,
            horario,
            categoria,
            professorId: matchedProf ? matchedProf.id : 'inst-thiago',
            professorNome: matchedProf ? matchedProf.nome : 'Thiago Lopes de Moraes Silva',
            sala
          });
        }

        if (parsed.length === 0) throw new Error('Nenhuma turma válida identificada no CSV.');
        setPreviewClasses(parsed);
        setInformarCount(missingFieldsDetected);

      } else if (entityType === 'techniques') {
        const parsed: Array<Omit<Technique, 'id'>> = [];

        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(delimiter).map(c => c.trim().replace(/^['"]|['"]$/g, ''));
          if (row.length < 1 || !row.some(Boolean)) continue;

          const titulo = getVal(row, ['titulo', 'nome', 'posicao']) || row[0];
          if (!titulo) continue;

          const rawCat = getVal(row, ['categoria', 'tipo_movimento']) || 'Finalização';
          const validCats = ['Finalização', 'Raspagem', 'Passagem de Guarda', 'Queda', 'Guarda', 'Defesa Pessoal', 'Costas'];
          const categoria = validCats.find(c => c.toLowerCase() === rawCat.toLowerCase()) || 'Finalização';

          const rawFaixa = normalize(getVal(row, ['faixa', 'faixa_minima']));
          const validBelts: BeltColor[] = ['branca', 'azul', 'roxa', 'marrom', 'preta'];
          const faixaMinima: BeltColor = validBelts.includes(rawFaixa as BeltColor) ? (rawFaixa as BeltColor) : 'branca';

          const rawNivel = getVal(row, ['nivel', 'experiencia']);
          const nivel = rawNivel.includes('Avan') ? 'Avançado' : rawNivel.includes('Inter') ? 'Intermediário' : 'Iniciante';

          const rawTipo = getVal(row, ['tipo', 'gi_nogi']);
          const tipo = rawTipo.includes('No-Gi') ? 'No-Gi' : rawTipo.includes('Gi') ? 'Gi' : 'Ambos';

          const rawDesc = getVal(row, ['descricao', 'explicacao']);
          const descricao = rawDesc || 'informar';
          if (!rawDesc) missingFieldsDetected++;

          const rawPontos = getVal(row, ['pontos_chave', 'detalhes', 'passos']);
          const pontosChave = rawPontos ? rawPontos.split(/;|\n/).map(p => p.trim()).filter(Boolean) : ['informar'];

          const rawTags = getVal(row, ['tags', 'marcadores']);
          const tags = rawTags ? rawTags.split(/;|,/).map(t => t.trim()).filter(Boolean) : ['BJJ', 'informar'];

          parsed.push({
            titulo,
            categoria: categoria as any,
            faixaMinima,
            nivel,
            tipo,
            descricao,
            pontosChave,
            tags
          });
        }

        if (parsed.length === 0) throw new Error('Nenhuma técnica válida identificada no CSV.');
        setPreviewTechniques(parsed);
        setInformarCount(missingFieldsDetected);

      } else if (entityType === 'attendance') {
        const parsed: Array<Omit<AttendanceRecord, 'id'>> = [];

        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(delimiter).map(c => c.trim().replace(/^['"]|['"]$/g, ''));
          if (row.length < 1 || !row.some(Boolean)) continue;

          const studentQuery = getVal(row, ['aluno', 'nome', 'student']) || row[0];
          if (!studentQuery) continue;

          const matchedStudent = students.find(s => 
            s.nome.toLowerCase().includes(studentQuery.toLowerCase()) || 
            s.id === studentQuery
          ) || students[0];

          const classQuery = getVal(row, ['turma', 'aula', 'class']);
          const matchedClass = classes.find(c => 
            c.titulo.toLowerCase().includes(classQuery.toLowerCase()) || 
            c.id === classQuery
          ) || classes[0];

          const data = getVal(row, ['data', 'date', 'dia']) || todayStr;
          const horario = getVal(row, ['horario', 'hora', 'time']) || '19:00';

          parsed.push({
            studentId: matchedStudent?.id || 'aluno-informar',
            studentNome: matchedStudent?.nome || studentQuery,
            studentFaixa: matchedStudent?.faixa || 'branca',
            studentGraus: matchedStudent?.graus || 0,
            turmaId: matchedClass?.id || 'turma-informar',
            turmaTitulo: matchedClass?.titulo || classQuery || 'Jiu-Jitsu Geral',
            data,
            horario,
            confirmadoPor: matchedClass?.professorNome || 'Thiago Lopes de Moraes Silva'
          });
        }

        if (parsed.length === 0) throw new Error('Nenhum registro de presença identificado no CSV.');
        setPreviewAttendance(parsed);
        setInformarCount(missingFieldsDetected);

      } else if (entityType === 'payments') {
        const parsed: Array<Omit<PaymentRecord, 'id'>> = [];

        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(delimiter).map(c => c.trim().replace(/^['"]|['"]$/g, ''));
          if (row.length < 1 || !row.some(Boolean)) continue;

          const studentQuery = getVal(row, ['aluno', 'nome']) || row[0];
          if (!studentQuery) continue;

          const matchedStudent = students.find(s => 
            s.nome.toLowerCase().includes(studentQuery.toLowerCase()) || 
            s.id === studentQuery
          );

          const mesReferencia = getVal(row, ['mes', 'mes_referencia', 'referencia']) || 'Outubro/2026';
          const rawValor = getVal(row, ['valor', 'mensalidade', 'preco']);
          const valor = parseFloat(rawValor.replace('R$', '').replace(',', '.')) || matchedStudent?.valorMensalidade || 180;
          const dataVencimento = getVal(row, ['vencimento', 'data_vencimento']) || `2026-10-10`;

          const rawStatus = normalize(getVal(row, ['status', 'situacao']));
          let status: PaymentStatus = 'pendente';
          if (rawStatus.includes('dia') || rawStatus.includes('pago')) status = 'em_dia';
          else if (rawStatus.includes('atras')) status = 'atrasado';
          else if (rawStatus.includes('isent')) status = 'isento';

          const prof = instructors.find(i => i.id === matchedStudent?.professorId) || instructors[0];

          parsed.push({
            studentId: matchedStudent?.id || 'aluno-informar',
            studentNome: matchedStudent?.nome || studentQuery,
            plano: matchedStudent?.plano || 'regular',
            mesReferencia,
            valor,
            valorOriginal: 180,
            desconto: Math.max(0, 180 - valor),
            dataVencimento,
            status,
            professorId: prof?.id,
            professorNome: prof?.nome,
            chavePixProfessor: prof?.chavePix
          });
        }

        if (parsed.length === 0) throw new Error('Nenhum pagamento válido identificado no CSV.');
        setPreviewPayments(parsed);
        setInformarCount(missingFieldsDetected);
      }
    } catch (err: any) {
      setParseError('Falha ao processar CSV: ' + (err?.message || 'Formato inválido.'));
    }
  };

  // Sample CSV generator for each entity
  const downloadSampleCsv = () => {
    let content = '';
    const defaultFilename = entityMeta[activeType].filename;

    if (activeType === 'students') {
      content = 'nome,email,telefone,faixa,graus,plano,mensalidade,dia_vencimento,tamanho_kimono,peso_kg,professor\n' +
        'Thiago Lopes de Moraes Silva,thiagomoraes.mail@gmail.com,(11) 99123-4567,marrom,2,regular,180,10,A3,84,Thiago Lopes de Moraes Silva\n' +
        'Marcos Vinicius,marcos.vini@gmail.com,(11) 98711-2233,azul,2,regular,180,10,A2,80,Edson Mikalkenas\n' +
        'Lucas Prado,informar,informar,branca,1,regular,180,10,informar,75,Thiago Lopes de Moraes Silva\n' +
        'Enzo Gabriel,pais.enzo@email.com,(11) 97722-3344,cinza,1,infantil,130,15,M2,32,Renata Albuquerque\n' +
        'Larissa Santos,informar,informar,branca,0,projeto_social,0,5,informar,58,Renata Albuquerque\n';
    } else if (activeType === 'professors') {
      content = 'nome,faixa,graus,email,telefone,registro_cbjj,bio,turmas,chave_pix,banco\n' +
        'Thiago Lopes de Moraes Silva,marrom,2,thiagomoraes.mail@gmail.com,(11) 99123-4567,CBJJ #79432,Professor e Administrador Master,Jiu-Jitsu de Sábado,thiagomoraes.mail@gmail.com,Banco Inter / PIX\n' +
        'Edson Mikalkenas,preta,3,carlos.bjj@gmail.com,(11) 98765-4321,CBJJ #48291,Linhagem Carlson Gracie,Manhã Adulto;Noite Geral,carlos.bjj@gmail.com,Banco do Brasil\n' +
        'Instrutor Convidado,roxa,1,informar,informar,informar,informar,informar,informar,informar\n';
    } else if (activeType === 'classes') {
      content = 'titulo,dia_semana,horario,categoria,professor,sala\n' +
        'Jiu-Jitsu de Sábado (Técnica & Rola),Sábado,11:00 - 12:30,Iniciante,Thiago Lopes de Moraes Silva,Tatame 1 (Principal)\n' +
        'Jiu-Jitsu Matinal (Geral),Segunda;Quarta;Sexta,07:00 - 08:15,Iniciante,Edson Mikalkenas,Tatame 1\n' +
        'Treino Infantil Kids,Terça;Quinta,17:30 - 18:30,Infantil (Kids),Renata Albuquerque,Tatame 2\n';
    } else if (activeType === 'techniques') {
      content = 'titulo,categoria,faixa_minima,nivel,tipo,descricao,pontos_chave,tags\n' +
        'Estrangulamento Ezequiel da Montada,Finalização,branca,Iniciante,Ambos,Finalização clássica utilizando as mangas ou punho.,Quatro dedos dentro da manga;Ajustar no pescoço;Tesoura de punho,Ezequiel;Montada\n' +
        'Raspagem de Gancho (Butterfly),Raspagem,branca,Iniciante,Ambos,Raspagem da guarda borboleta com esgrima.,Esgrima funda;Chutar o gancho;Acompanhar montando,Borboleta;Raspagem\n' +
        'Defesa Pessoal - Gravata Frontal,Defesa Pessoal,branca,Iniciante,Gi,informar,Base firme;Mão no queixo;Giro de quadril,Defesa Pessoal\n';
    } else if (activeType === 'attendance') {
      content = 'aluno,turma,data,horario\n' +
        'Marcos Vinicius,Jiu-Jitsu de Sábado (Técnica & Rola),2026-10-10,11:00\n' +
        'Enzo Gabriel,Treino Infantil Kids,2026-10-12,17:30\n';
    } else if (activeType === 'payments') {
      content = 'aluno,mes_referencia,valor,vencimento,status\n' +
        'Marcos Vinicius,Outubro/2026,180,2026-10-10,em_dia\n' +
        'Enzo Gabriel,Outubro/2026,130,2026-10-15,em_dia\n' +
        'Aluno Novo,Outubro/2026,180,2026-10-10,pendente\n';
    }

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', defaultFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setRawText(text);
      parseCsvData(text, activeType);
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    let count = 0;
    if (activeType === 'students') {
      count = importStudents(previewStudents);
    } else if (activeType === 'professors') {
      count = importInstructors(previewInstructors);
    } else if (activeType === 'classes') {
      count = importClasses(previewClasses);
    } else if (activeType === 'techniques') {
      count = importTechniques(previewTechniques);
    } else if (activeType === 'attendance') {
      count = importAttendance(previewAttendance);
    } else if (activeType === 'payments') {
      count = importPayments(previewPayments);
    }

    setImportedCount(count);
    if (onSuccess) onSuccess(count);
  };

  // Immediate sync to Supabase with browser-safe anon key
  const handleSyncToSupabaseNow = async () => {
    if (!supabaseConfig.url || !supabaseConfig.anonKey) {
      setSyncResult({
        success: false,
        message: 'Supabase ainda não configurado no app. Acesse Configurações > Banco de Dados & Supabase para salvar sua URL e Chave Pública (anon).'
      });
      return;
    }

    setSyncingToSupabase(true);
    setSyncResult(null);
    try {
      const res = await syncDataWithSupabase();
      if (res.success) {
        setSyncResult({
          success: true,
          message: 'Dados sincronizados com sucesso no Supabase! As tabelas agora refletem as novas informações.'
        });
      } else {
        setSyncResult({
          success: false,
          message: res.errors?.join('\n') || 'Erro durante a sincronização com o Supabase.'
        });
      }
    } catch (err: any) {
      setSyncResult({
        success: false,
        message: err.message || 'Erro ao sincronizar com Supabase.'
      });
    } finally {
      setSyncingToSupabase(false);
    }
  };

  // Copy SQL for Supabase SQL Editor
  const handleCopySqlMigration = () => {
    const sql = generateDataMigrationSql({
      students,
      instructors,
      classes,
      attendance,
      graduations,
      payments,
      lessonPlans,
      techniques,
      allUsers,
      academySettings
    });
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const currentPreviewLength = 
    activeType === 'students' ? previewStudents.length :
    activeType === 'professors' ? previewInstructors.length :
    activeType === 'classes' ? previewClasses.length :
    activeType === 'techniques' ? previewTechniques.length :
    activeType === 'attendance' ? previewAttendance.length :
    previewPayments.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white tracking-tight">
                  Alimentação em Lote via Planilhas CSV
                </h3>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 font-semibold px-2 py-0.5 rounded-full border border-blue-400/30">
                  App & Supabase
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Importe alunos, professores, turmas, presenças e técnicas com tratamento automático de campos faltantes ("informar").
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Entity Tabs Navigation */}
        {importedCount === null && (
          <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs">
            {(Object.keys(entityMeta) as ImportType[]).map((key) => {
              const meta = entityMeta[key];
              const isSelected = activeType === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSwitchType(key)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                    isSelected 
                      ? 'bg-white text-blue-700 shadow-xs border border-slate-200' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {meta.icon}
                  {meta.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 md:p-6 space-y-5 overflow-y-auto flex-1">
          {importedCount !== null ? (
            /* Post-import Success & Supabase Push */
            <div className="py-6 text-center space-y-6 max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle className="w-9 h-9" />
              </div>

              <div>
                <h4 className="text-2xl font-black text-slate-900">
                  {importedCount} {entityMeta[activeType].label} Importados com Sucesso!
                </h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Os dados foram inseridos no aplicativo {academySettings.nomeAcademia || 'Mikalkenas Jiu Jitsu'}. 
                  {informarCount > 0 && (
                    <span className="block mt-1 text-amber-700 font-semibold bg-amber-50 py-1 px-2.5 rounded-lg border border-amber-200 inline-block">
                      ⚠️ {informarCount} informações incompletas foram preenchidas como <span className="font-mono underline">"informar"</span> para revisão posterior.
                    </span>
                  )}
                </p>
              </div>

              {/* Supabase Sincronização Direta */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-3">
                <div className="flex items-start gap-2.5">
                  <Database className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">
                      Sincronização com o Banco de Dados Supabase
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Atualize as tabelas do Supabase com os dados recém-importados utilizando sua Chave Pública (anon).
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleSyncToSupabaseNow}
                    disabled={syncingToSupabase}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs"
                  >
                    {syncingToSupabase ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Sincronizando com Supabase...
                      </>
                    ) : (
                      <>
                        <CloudUpload className="w-3.5 h-3.5" />
                        ⚡ Sincronizar com Supabase Agora
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCopySqlMigration}
                    className="flex items-center gap-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold px-3 py-2.5 rounded-xl transition-all"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedSql ? 'SQL Copiado!' : 'Copiar SQL de Inserção'}
                  </button>
                </div>

                {syncResult && (
                  <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                    syncResult.success 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {syncResult.success ? (
                      <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                    )}
                    <div className="whitespace-pre-line text-[11px] leading-relaxed">
                      {syncResult.message}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-center gap-2">
                <button
                  onClick={() => {
                    setImportedCount(null);
                    setRawText('');
                    setFileName('');
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
                >
                  Importar Outra Planilha
                </button>
                <button
                  onClick={onClose}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all"
                >
                  Concluir & Fechar
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Rules and template box */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Rule badge */}
                <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-slate-700 space-y-1 md:col-span-2">
                  <div className="flex items-center gap-1.5 font-bold text-blue-950">
                    <Info className="w-4 h-4 text-blue-600 shrink-0" />
                    Regra para Informações Faltantes:
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    • Campos essenciais sem valor recebem sugestão inteligente (ex: faixa <span className="font-semibold text-slate-800">"branca"</span>, valor do plano regular <span className="font-semibold text-slate-800">R$ 180</span>).<br />
                    • Informações de contato ou detalhes ausentes são gravadas como <span className="font-bold text-amber-700 bg-amber-100 px-1 py-0.2 rounded font-mono">"informar"</span> para que você possa completar quando quiser!
                  </p>
                </div>

                {/* Template download */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between items-start gap-2">
                  <div>
                    <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                      Planilha de Exemplo
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Baixe o modelo com cabeçalho pronto para {entityMeta[activeType].label}.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={downloadSampleCsv}
                    className="w-full bg-white hover:bg-blue-50 border border-slate-300 text-blue-700 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3 h-3" />
                    Baixar Modelo CSV
                  </button>
                </div>
              </div>

              {/* Drag and Drop Box */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/70 hover:bg-blue-50/30 p-6 rounded-2xl text-center cursor-pointer transition-all space-y-2"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept=".csv,.txt" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
                <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 mx-auto flex items-center justify-center shadow-xs">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs md:text-sm text-slate-800">
                    {fileName ? fileName : `Clique para selecionar o arquivo CSV de ${entityMeta[activeType].label}`}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Aceita vírgula (,), ponto-e-vírgula (;) ou TAB. Arquivos .csv e .txt
                  </p>
                </div>
              </div>

              {/* Paste Text Direct Alternative */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    Ou cole o texto CSV diretamente aqui:
                  </label>
                  {rawText && (
                    <button 
                      type="button"
                      onClick={() => { 
                        setRawText(''); 
                        setPreviewStudents([]); 
                        setPreviewInstructors([]); 
                        setPreviewClasses([]); 
                        setPreviewTechniques([]); 
                        setPreviewAttendance([]); 
                        setPreviewPayments([]); 
                        setFileName(''); 
                        setParseError(null);
                      }}
                      className="text-[11px] text-rose-600 hover:underline font-semibold"
                    >
                      Limpar
                    </button>
                  )}
                </div>
                <textarea
                  rows={4}
                  value={rawText}
                  onChange={(e) => {
                    setRawText(e.target.value);
                    if (e.target.value.trim()) parseCsvData(e.target.value, activeType);
                  }}
                  placeholder={
                    activeType === 'students' 
                      ? "nome,email,telefone,faixa,graus,plano,mensalidade,dia_vencimento,tamanho_kimono,peso_kg,professor\nThiago Moraes,thiagomoraes.mail@gmail.com,(11) 99123-4567,marrom,2,regular,180,10,A3,84,Thiago Lopes de Moraes Silva\nCarlos Silva,informar,informar,branca,0,regular,180,10,informar,75,Thiago Lopes de Moraes Silva"
                      : activeType === 'professors'
                      ? "nome,faixa,graus,email,telefone,registro_cbjj,bio,turmas,chave_pix,banco\nThiago Lopes de Moraes Silva,marrom,2,thiagomoraes.mail@gmail.com,(11) 99123-4567,CBJJ #79432,Professor e Master,Sábado 11h,thiagomoraes.mail@gmail.com,Banco Inter"
                      : "titulo,dia_semana,horario,categoria,professor,sala\nJiu-Jitsu de Sábado,Sábado,11:00 - 12:30,Iniciante,Thiago Lopes de Moraes Silva,Tatame 1"
                  }
                  className="w-full text-[11px] font-mono border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                />
              </div>

              {parseError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{parseError}</span>
                </div>
              )}

              {/* Preview Table Section */}
              {currentPreviewLength > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 flex items-center gap-2">
                      Pré-visualização: {currentPreviewLength} {entityMeta[activeType].label} prontos para importação
                      {informarCount > 0 && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full border border-amber-200">
                          {informarCount} campos como "informar"
                        </span>
                      )}
                    </span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      ✓ Pronto
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-x-auto max-h-56 shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px] uppercase tracking-wider sticky top-0">
                        {activeType === 'students' && (
                          <tr>
                            <th className="p-2.5">Nome</th>
                            <th className="p-2.5">Email</th>
                            <th className="p-2.5">Telefone</th>
                            <th className="p-2.5">Faixa / Graus</th>
                            <th className="p-2.5">Plano / Valor</th>
                            <th className="p-2.5">Kimono</th>
                            <th className="p-2.5">Professor</th>
                          </tr>
                        )}
                        {activeType === 'professors' && (
                          <tr>
                            <th className="p-2.5">Nome</th>
                            <th className="p-2.5">Faixa / Graus</th>
                            <th className="p-2.5">Email</th>
                            <th className="p-2.5">Telefone</th>
                            <th className="p-2.5">CBJJ</th>
                            <th className="p-2.5">Chave PIX</th>
                          </tr>
                        )}
                        {activeType === 'classes' && (
                          <tr>
                            <th className="p-2.5">Título</th>
                            <th className="p-2.5">Dia da Semana</th>
                            <th className="p-2.5">Horário</th>
                            <th className="p-2.5">Categoria</th>
                            <th className="p-2.5">Professor</th>
                          </tr>
                        )}
                        {activeType === 'techniques' && (
                          <tr>
                            <th className="p-2.5">Título</th>
                            <th className="p-2.5">Categoria</th>
                            <th className="p-2.5">Faixa Mínima</th>
                            <th className="p-2.5">Tipo</th>
                            <th className="p-2.5">Descrição</th>
                          </tr>
                        )}
                        {activeType === 'attendance' && (
                          <tr>
                            <th className="p-2.5">Aluno</th>
                            <th className="p-2.5">Turma</th>
                            <th className="p-2.5">Data</th>
                            <th className="p-2.5">Horário</th>
                            <th className="p-2.5">Professor</th>
                          </tr>
                        )}
                        {activeType === 'payments' && (
                          <tr>
                            <th className="p-2.5">Aluno</th>
                            <th className="p-2.5">Mês Referência</th>
                            <th className="p-2.5">Valor (R$)</th>
                            <th className="p-2.5">Vencimento</th>
                            <th className="p-2.5">Status</th>
                          </tr>
                        )}
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeType === 'students' && previewStudents.map((st, i) => (
                          <tr key={i} className="hover:bg-slate-50 text-[11px]">
                            <td className="p-2.5 font-bold text-slate-900">{st.nome}</td>
                            <td className="p-2.5 font-mono text-slate-600">
                              {st.email.includes('informar') ? (
                                <span className="text-amber-700 bg-amber-50 px-1 py-0.5 rounded font-mono text-[10px]">
                                  {st.email}
                                </span>
                              ) : st.email}
                            </td>
                            <td className="p-2.5">
                              {st.telefone === 'informar' ? (
                                <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-mono text-[10px]">informar</span>
                              ) : st.telefone}
                            </td>
                            <td className="p-2.5 capitalize">{st.faixa} ({st.graus}º grau)</td>
                            <td className="p-2.5">
                              <span className="capitalize">{st.plano.replace('_', ' ')}</span> - <span className="font-mono font-semibold">R$ {st.valorMensalidade}</span>
                            </td>
                            <td className="p-2.5">
                              {st.tamanhoKimono === 'informar' ? (
                                <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-mono text-[10px]">informar</span>
                              ) : st.tamanhoKimono}
                            </td>
                            <td className="p-2.5 font-semibold text-blue-700">{st.professorNome}</td>
                          </tr>
                        ))}

                        {activeType === 'professors' && previewInstructors.map((inst, i) => (
                          <tr key={i} className="hover:bg-slate-50 text-[11px]">
                            <td className="p-2.5 font-bold text-slate-900">{inst.nome}</td>
                            <td className="p-2.5 capitalize">{inst.faixa} ({inst.graus}º grau)</td>
                            <td className="p-2.5 font-mono">{inst.email}</td>
                            <td className="p-2.5">{inst.telefone}</td>
                            <td className="p-2.5 font-mono">{inst.registroCBJJ}</td>
                            <td className="p-2.5 font-mono text-slate-700">{inst.chavePix}</td>
                          </tr>
                        ))}

                        {activeType === 'classes' && previewClasses.map((cls, i) => (
                          <tr key={i} className="hover:bg-slate-50 text-[11px]">
                            <td className="p-2.5 font-bold text-slate-900">{cls.titulo}</td>
                            <td className="p-2.5">{cls.diaSemana}</td>
                            <td className="p-2.5 font-mono">{cls.horario}</td>
                            <td className="p-2.5">{cls.categoria}</td>
                            <td className="p-2.5 font-semibold text-blue-700">{cls.professorNome}</td>
                          </tr>
                        ))}

                        {activeType === 'techniques' && previewTechniques.map((tech, i) => (
                          <tr key={i} className="hover:bg-slate-50 text-[11px]">
                            <td className="p-2.5 font-bold text-slate-900">{tech.titulo}</td>
                            <td className="p-2.5">{tech.categoria}</td>
                            <td className="p-2.5 capitalize">{tech.faixaMinima}</td>
                            <td className="p-2.5">{tech.tipo}</td>
                            <td className="p-2.5 max-w-xs truncate text-slate-600">{tech.descricao}</td>
                          </tr>
                        ))}

                        {activeType === 'attendance' && previewAttendance.map((att, i) => (
                          <tr key={i} className="hover:bg-slate-50 text-[11px]">
                            <td className="p-2.5 font-bold text-slate-900">{att.studentNome}</td>
                            <td className="p-2.5">{att.turmaTitulo}</td>
                            <td className="p-2.5 font-mono">{att.data}</td>
                            <td className="p-2.5 font-mono">{att.horario}</td>
                            <td className="p-2.5 text-blue-700">{att.confirmadoPor}</td>
                          </tr>
                        ))}

                        {activeType === 'payments' && previewPayments.map((pay, i) => (
                          <tr key={i} className="hover:bg-slate-50 text-[11px]">
                            <td className="p-2.5 font-bold text-slate-900">{pay.studentNome}</td>
                            <td className="p-2.5">{pay.mesReferencia}</td>
                            <td className="p-2.5 font-mono font-bold">R$ {pay.valor}</td>
                            <td className="p-2.5 font-mono">{pay.dataVencimento}</td>
                            <td className="p-2.5 capitalize">{pay.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Actions */}
        {importedCount === null && (
          <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleConfirmImport}
              disabled={currentPreviewLength === 0}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Confirmar Importação de {currentPreviewLength} {entityMeta[activeType].label}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
