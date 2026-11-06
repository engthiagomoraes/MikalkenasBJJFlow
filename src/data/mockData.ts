import { 
  Student, 
  Instructor, 
  ClassSchedule, 
  AttendanceRecord, 
  LessonPlan, 
  Technique, 
  GraduationHistory, 
  PaymentRecord, 
  NotificationItem, 
  AcademyProduct,
  AcademyEvent,
  StudentPurchase,
  LearnedTechnique,
  BeltColor,
  BeltGraduationRule,
} from '../types';
import { 
  BASE44_STUDENTS, 
  BASE44_TECHNIQUES, 
  BASE44_LESSON_PLANS, 
  BASE44_ATTENDANCE, 
  BASE44_PAYMENTS 
} from './base44Data';

export const INITIAL_INSTRUCTORS: Instructor[] = [
  {
    id: 'inst-thiago',
    nome: 'Thiago Lopes de Moraes Silva',
    faixa: 'marrom',
    graus: 2,
    email: 'thiagomoraes.mail@gmail.com',
    telefone: '(11) 99123-4567',
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    registroCBJJ: 'CBJJ #79432',
    bio: 'Administrador Master & Professor Faixa Marrom. Responsável pela gestão técnica e administrativa, com aulas aos sábados das 11h00 às 12h30 focadas em fundamentos avançados, lapela, passagens de pressão e sparring dinâmico.',
    turmas: ['Jiu-Jitsu de Sábado (Técnica & Rola)'],
    chavePix: 'thiagomoraes.mail@gmail.com',
    banco: 'Banco Inter / PIX',
    sistemaGraduacao: 'graus_e_faixas'
  },
  {
    id: 'inst-1',
    nome: 'Edson Mikalkenas',
    faixa: 'preta',
    graus: 3,
    email: 'professormikalkenasbjj@gmail.com',
    telefone: '(11) 98765-4321',
    foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
    registroCBJJ: 'CBJJ #48291',
    bio: 'Sensei e Faixa Preta 3º Grau formado sob a linhagem tradicional Carlson Gracie. Líder da Mikalkenas Jiu Jitsu dedicado ao ensino com rigor técnico, disciplina e formação de campeões no tatame e na vida.',
    turmas: ['Manhã Adulto', 'Noite Geral', 'Competição No-Gi'],
    chavePix: 'professormikalkenasbjj@gmail.com',
    banco: 'Banco do Brasil (Ag: 1842-1 C/C: 49201-9)',
    sistemaGraduacao: 'graus_e_faixas'
  },
  {
    id: 'inst-2',
    nome: 'Renata Albuquerque',
    faixa: 'preta',
    graus: 1,
    email: 'renata.bjj@gmail.com',
    telefone: '(11) 97654-3210',
    foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    registroCBJJ: 'CBJJ #62140',
    bio: 'Especialista em pedagogia infantil e jiu-jitsu feminino. Campeã Brasileira de Jiu-Jitsu e responsável pelo Projeto Social da academia.',
    turmas: ['Infantil (Kids)', 'Feminino & Iniciantes', 'Almoço Executivo'],
    chavePix: 'renata.bjj@gmail.com',
    banco: 'Nubank (Chave PIX E-mail)',
    sistemaGraduacao: 'apenas_faixas'
  },
  {
    id: 'inst-3',
    nome: 'Marcos "Guará" Silva',
    faixa: 'marrom',
    graus: 2,
    email: 'marcos.guara@gmail.com',
    telefone: '(11) 96543-2109',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    registroCBJJ: 'CBJJ #83109',
    bio: 'Instrutor auxiliar, competidor ativo peso leve e especialista em guarda aberta e finalizações dinâmicas.',
    turmas: ['Iniciantes Noite', 'Open Mat'],
    chavePix: 'marcos.guara@gmail.com',
    banco: 'Banco Inter (Chave PIX E-mail)',
    sistemaGraduacao: 'graus_e_faixas'
  }
];

export const INITIAL_CLASSES: ClassSchedule[] = [
  {
    id: 'turma-1',
    titulo: 'Jiu-Jitsu Matinal (Geral)',
    diaSemana: 'Segunda, Quarta e Sexta',
    horario: '07:00 - 08:15',
    categoria: 'Iniciante',
    professorId: 'inst-1',
    professorNome: 'Edson Mikalkenas',
    sala: 'Tatame 1 (Principal)'
  },
  {
    id: 'turma-2',
    titulo: 'Almoço Técnico & Drills',
    diaSemana: 'Terça e Quinta',
    horario: '12:15 - 13:30',
    categoria: 'Intermediário/Avançado',
    professorId: 'inst-2',
    professorNome: 'Renata Albuquerque',
    sala: 'Tatame 1 (Principal)'
  },
  {
    id: 'turma-3',
    titulo: 'Jiu-Jitsu Infantil (Kids 6-12 anos)',
    diaSemana: 'Segunda, Quarta e Sexta',
    horario: '17:00 - 18:00',
    categoria: 'Infantil (Kids)',
    professorId: 'inst-2',
    professorNome: 'Renata Albuquerque',
    sala: 'Tatame 2 (Infantil)'
  },
  {
    id: 'turma-4',
    titulo: 'Jiu-Jitsu Noturno (Todos os Níveis)',
    diaSemana: 'Segunda a Sexta',
    horario: '19:30 - 21:00',
    categoria: 'Iniciante',
    professorId: 'inst-1',
    professorNome: 'Edson Mikalkenas',
    sala: 'Tatame 1 (Principal)'
  },
  {
    id: 'turma-5',
    titulo: 'Submission & No-Gi Avançado',
    diaSemana: 'Terça e Quinta',
    horario: '21:00 - 22:15',
    categoria: 'No-Gi (Sem Kimono)',
    professorId: 'inst-1',
    professorNome: 'Edson Mikalkenas',
    sala: 'Tatame 1 (Principal)'
  },
  {
    id: 'turma-6',
    titulo: 'Open Mat & Rola Livre de Sábado',
    diaSemana: 'Sábado',
    horario: '10:00 - 12:00',
    categoria: 'Open Mat',
    professorId: 'inst-3',
    professorNome: 'Marcos "Guará"',
    sala: 'Tatame 1 + Tatame 2'
  },
  {
    id: 'turma-sabado-thiago',
    titulo: 'Jiu-Jitsu de Sábado (Técnica & Rola)',
    diaSemana: 'Sábado',
    horario: '11:00 - 12:30',
    categoria: 'Intermediário/Avançado',
    professorId: 'inst-thiago',
    professorNome: 'Thiago Lopes de Moraes Silva',
    sala: 'Tatame 1 (Principal)'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  ...BASE44_STUDENTS,
  {
    id: 'aluno-1',
    nome: 'Gabriel Pires Menezes',
    email: 'gabriel.pires@gmail.com',
    telefone: '(11) 98111-2233',
    dataNascimento: '1996-04-12',
    dataInicio: '2023-01-10',
    faixa: 'azul',
    graus: 3,
    dataUltimaGraduacao: '2025-06-15',
    presencasNaFaixa: 142,
    presencasMetaGrau: 150,
    totalPresencasHistorico: 232,
    plano: 'regular',
    valorMensalidade: 180,
    diaVencimento: 10,
    statusPagamento: 'em_dia',
    tamanhoKimono: 'A2',
    pesoKg: 78,
    turmaPreferida: 'Jiu-Jitsu Noturno (Todos os Níveis)',
    observacoesMedicas: 'Nenhuma restrição articular',
    professorId: 'inst-1',
    professorNome: 'Edson Mikalkenas',
    performance: {
      guarda: 8.5,
      passagem: 8.0,
      quedas: 6.5,
      finalizacoes: 7.8,
      defesa: 8.2,
      disciplina: 9.5,
      tempoRolaMinutos: 940,
      finalizacoesAplicadas: 48,
      raspagensFeitas: 64
    },
    tecnicasAprendidas: [
      {
        id: 'lrn-1',
        techniqueId: 'tec-1',
        titulo: 'Armlock da Guarda Fechada',
        categoria: 'Finalização',
        dataAprendida: '2026-10-05',
        aulaTitulo: 'Fundamentos da Guarda Fechada',
        turmaNome: 'Jiu-Jitsu Noturno (Todos os Níveis)',
        professorNome: 'Edson Mikalkenas'
      },
      {
        id: 'lrn-2',
        techniqueId: 'tec-4',
        titulo: 'Estrangulamento Triângulo (Sankaku-Jime)',
        categoria: 'Finalização',
        dataAprendida: '2026-10-05',
        aulaTitulo: 'Fundamentos da Guarda Fechada',
        turmaNome: 'Jiu-Jitsu Noturno (Todos os Níveis)',
        professorNome: 'Edson Mikalkenas'
      },
      {
        id: 'lrn-3',
        techniqueId: 'tec-2',
        titulo: 'Raspagem Tesourinha com Puxada de Manga',
        categoria: 'Raspagem',
        dataAprendida: '2026-09-28',
        aulaTitulo: 'Raspagens Básicas da Guarda',
        turmaNome: 'Jiu-Jitsu Noturno (Todos os Níveis)',
        professorNome: 'Edson Mikalkenas'
      },
      {
        id: 'lrn-4',
        techniqueId: 'tec-3',
        titulo: 'Passagem Toreando (Toreando Pass)',
        categoria: 'Passagem de Guarda',
        dataAprendida: '2026-09-21',
        aulaTitulo: 'Velocidade e Passagem Aberta',
        turmaNome: 'Jiu-Jitsu Noturno (Todos os Níveis)',
        professorNome: 'Edson Mikalkenas'
      }
    ]
  },
  {
    id: 'aluno-2',
    nome: 'Lucas "Pitbull" Furtado',
    email: 'lucas.atleta@gmail.com',
    telefone: '(11) 98222-3344',
    dataNascimento: '2001-08-20',
    dataInicio: '2022-03-01',
    faixa: 'roxa',
    graus: 2,
    dataUltimaGraduacao: '2025-04-10',
    presencasNaFaixa: 188,
    presencasMetaGrau: 190,
    totalPresencasHistorico: 420,
    plano: 'bolsista',
    valorMensalidade: 70, // Bolsa Atleta de Competição
    diaVencimento: 5,
    statusPagamento: 'em_dia',
    tamanhoKimono: 'A1',
    pesoKg: 69,
    turmaPreferida: 'Submission & No-Gi Avançado',
    observacoesMedicas: 'Recuperado de leve estiramento no joelho esquerdo',
    professorId: 'inst-1',
    professorNome: 'Edson Mikalkenas',
    performance: {
      guarda: 9.2,
      passagem: 9.0,
      quedas: 8.5,
      finalizacoes: 9.4,
      defesa: 8.8,
      disciplina: 9.8,
      tempoRolaMinutos: 1820,
      finalizacoesAplicadas: 112,
      raspagensFeitas: 89
    }
  },
  {
    id: 'aluno-3',
    nome: 'Arthur Medeiros (Tutu)',
    email: 'pais.arthur@email.com',
    telefone: '(11) 98333-4455',
    dataNascimento: '2016-11-04',
    dataInicio: '2024-02-15',
    faixa: 'amarela',
    graus: 2,
    dataUltimaGraduacao: '2025-08-20',
    presencasNaFaixa: 58,
    presencasMetaGrau: 60,
    totalPresencasHistorico: 110,
    plano: 'infantil',
    valorMensalidade: 130,
    diaVencimento: 15,
    statusPagamento: 'pendente',
    tamanhoKimono: 'M3',
    pesoKg: 34,
    turmaPreferida: 'Jiu-Jitsu Infantil (Kids 6-12 anos)',
    observacoesMedicas: 'Uso de bombinha preventiva para asma quando necessário',
    professorId: 'inst-2',
    professorNome: 'Renata Albuquerque',
    performance: {
      guarda: 7.0,
      passagem: 7.5,
      quedas: 7.2,
      finalizacoes: 6.8,
      defesa: 7.0,
      disciplina: 9.0,
      tempoRolaMinutos: 320,
      finalizacoesAplicadas: 24,
      raspagensFeitas: 32
    }
  },
  {
    id: 'aluno-4',
    nome: 'Kauã dos Santos Silva',
    email: 'kaua.social@bjjcomunidade.org',
    telefone: '(11) 98444-5566',
    dataNascimento: '2008-05-18',
    dataInicio: '2023-08-10',
    faixa: 'verde',
    graus: 3,
    dataUltimaGraduacao: '2025-09-02',
    presencasNaFaixa: 86,
    presencasMetaGrau: 80, // Apto para grau!
    totalPresencasHistorico: 245,
    plano: 'projeto_social',
    valorMensalidade: 0, // Isenção total - Projeto Social
    diaVencimento: 1,
    statusPagamento: 'isento',
    tamanhoKimono: 'A1',
    pesoKg: 62,
    turmaPreferida: 'Jiu-Jitsu Noturno (Todos os Níveis)',
    observacoesMedicas: 'Nenhuma',
    professorId: 'inst-2',
    professorNome: 'Renata Albuquerque',
    performance: {
      guarda: 8.8,
      passagem: 8.4,
      quedas: 8.0,
      finalizacoes: 8.2,
      defesa: 8.0,
      disciplina: 10.0,
      tempoRolaMinutos: 780,
      finalizacoesAplicadas: 54,
      raspagensFeitas: 49
    }
  },
  {
    id: 'aluno-5',
    nome: 'Mariana Duarte Costa',
    email: 'mari.duarte@empresa.com.br',
    telefone: '(11) 98555-6677',
    dataNascimento: '1992-09-14',
    dataInicio: '2024-05-10',
    faixa: 'branca',
    graus: 4,
    dataUltimaGraduacao: '2025-07-28',
    presencasNaFaixa: 78,
    presencasMetaGrau: 70, // Pronta para o Exame de Faixa Azul!
    totalPresencasHistorico: 78,
    plano: 'regular',
    valorMensalidade: 180,
    diaVencimento: 5,
    statusPagamento: 'atrasado',
    tamanhoKimono: 'F2',
    pesoKg: 58,
    turmaPreferida: 'Jiu-Jitsu Matinal (Geral)',
    observacoesMedicas: 'Cirurgia no ombro direito em 2021 (100% liberada pelo ortopedista)',
    professorId: 'inst-1',
    professorNome: 'Edson Mikalkenas',
    performance: {
      guarda: 7.9,
      passagem: 7.6,
      quedas: 6.8,
      finalizacoes: 7.4,
      defesa: 8.4,
      disciplina: 9.7,
      tempoRolaMinutos: 410,
      finalizacoesAplicadas: 31,
      raspagensFeitas: 42
    }
  },
  {
    id: 'aluno-6',
    nome: 'Rodrigo "Tanque" Barreto',
    email: 'rodrigo.barreto@gmail.com',
    telefone: '(11) 98666-7788',
    dataNascimento: '1987-03-30',
    dataInicio: '2019-10-15',
    faixa: 'marrom',
    graus: 1,
    dataUltimaGraduacao: '2024-12-10',
    presencasNaFaixa: 120,
    presencasMetaGrau: 140,
    totalPresencasHistorico: 680,
    plano: 'regular',
    valorMensalidade: 180,
    diaVencimento: 10,
    statusPagamento: 'em_dia',
    tamanhoKimono: 'A4',
    pesoKg: 102,
    turmaPreferida: 'Jiu-Jitsu Noturno (Todos os Níveis)',
    observacoesMedicas: 'Nenhuma',
    professorId: 'inst-1',
    professorNome: 'Edson Mikalkenas',
    performance: {
      guarda: 8.0,
      passagem: 9.6,
      quedas: 9.0,
      finalizacoes: 9.2,
      defesa: 8.9,
      disciplina: 9.2,
      tempoRolaMinutos: 1460,
      finalizacoesAplicadas: 98,
      raspagensFeitas: 41
    }
  },
  {
    id: 'aluno-7',
    nome: 'Beatriz Vasconcelos',
    email: 'bia.vasconcelos@gmail.com',
    telefone: '(11) 98777-8899',
    dataNascimento: '2017-02-10',
    dataInicio: '2024-08-01',
    faixa: 'cinza',
    graus: 1,
    dataUltimaGraduacao: '2025-05-12',
    presencasNaFaixa: 28,
    presencasMetaGrau: 30,
    totalPresencasHistorico: 48,
    plano: 'infantil',
    valorMensalidade: 130,
    diaVencimento: 10,
    statusPagamento: 'em_dia',
    tamanhoKimono: 'M2',
    pesoKg: 29,
    turmaPreferida: 'Jiu-Jitsu Infantil (Kids 6-12 anos)',
    observacoesMedicas: 'Nenhuma',
    professorId: 'inst-2',
    professorNome: 'Renata Albuquerque',
    performance: {
      guarda: 6.8,
      passagem: 6.9,
      quedas: 7.0,
      finalizacoes: 6.2,
      defesa: 7.2,
      disciplina: 9.8,
      tempoRolaMinutos: 160,
      finalizacoesAplicadas: 14,
      raspagensFeitas: 18
    }
  },
  {
    id: 'aluno-8',
    nome: 'Thiago Oliveira',
    email: 'thiago.social@projeto.org',
    telefone: '(11) 98888-9900',
    dataNascimento: '2007-09-12',
    dataInicio: '2024-01-15',
    faixa: 'branca',
    graus: 3,
    dataUltimaGraduacao: '2025-08-10',
    presencasNaFaixa: 62,
    presencasMetaGrau: 65,
    totalPresencasHistorico: 62,
    plano: 'projeto_social',
    valorMensalidade: 0,
    diaVencimento: 1,
    statusPagamento: 'isento',
    tamanhoKimono: 'A2',
    pesoKg: 70,
    turmaPreferida: 'Jiu-Jitsu Noturno (Todos os Níveis)',
    observacoesMedicas: 'Nenhuma',
    professorId: 'inst-3',
    professorNome: 'Marcos "Guará" Silva',
    performance: {
      guarda: 7.5,
      passagem: 7.8,
      quedas: 8.2,
      finalizacoes: 7.0,
      defesa: 7.4,
      disciplina: 9.9,
      tempoRolaMinutos: 390,
      finalizacoesAplicadas: 22,
      raspagensFeitas: 34
    }
  }
];

export const INITIAL_TECHNIQUES: Technique[] = [
  ...BASE44_TECHNIQUES,
  {
    id: 'tec-1',
    titulo: 'Armlock da Guarda Fechada',
    categoria: 'Finalização',
    subcategoria: 'Ataques da Guarda',
    faixaMinima: 'branca',
    nivel: 'Iniciante',
    tipo: 'Ambos',
    descricao: 'Ataque clássico de hiperestensão de cotovelo partindo da guarda fechada através do controle cruzado do braço e subida do quadril.',
    pontosChave: [
      'Quebre a postura do adversário puxando com as pernas',
      'Controle o tríceps cruzado e domine o punho ou manga oposta',
      'Pé no quadril do mesmo lado para criar ângulo de 90 graus',
      'Passe a perna por cima da cabeça pressionando para baixo com os calcanhares',
      'Mantenha os joelhos colados e eleve o quadril suavemente'
    ],
    tags: ['Armlock', 'Guarda Fechada', 'Finalização Básica', 'Fundamento']
  },
  {
    id: 'tec-2',
    titulo: 'Raspagem Tesourinha com Puxada de Manga',
    categoria: 'Raspagem',
    subcategoria: 'Raspagens Básicas',
    faixaMinima: 'branca',
    nivel: 'Iniciante',
    tipo: 'Gi',
    descricao: 'Raspagem de corte horizontal aproveitando a base comprometida do oponente ao quebrar a postura na gola cruzada.',
    pontosChave: [
      'Pegada profunda na gola cruzada e pegada justa na manga',
      'Fuga de quadril para colocar a canela diagonalmente no peito',
      'Perna inferior deitada no tatame cortando atrás do joelho',
      'Puxe a manga para bloquear a base e projete o adversário montando'
    ],
    tags: ['Raspagem', 'Guarda Fechada', 'Tesourinha', 'Fundamento']
  },
  {
    id: 'tec-3',
    titulo: 'Passagem Toreando (Toreando Pass)',
    categoria: 'Passagem de Guarda',
    subcategoria: 'Passagem em Pé',
    faixaMinima: 'branca',
    nivel: 'Iniciante',
    tipo: 'Ambos',
    descricao: 'Passagem de guarda aberta de velocidade e mobilidade, empurrando os joelhos do adversário e girando para a imobilização lateral.',
    pontosChave: [
      'Pegadas nas calças na altura dos joelhos (ou controle dos calcanhares no No-Gi)',
      'Empurre os joelhos contra o peito para neutralizar a mobilidade',
      'Dê um passo lateral enquanto empurra as pernas para o lado oposto',
      'Conecte o peito no peito ou joelho na barriga imediatamente'
    ],
    tags: ['Passagem', 'Toreando', 'Velocidade', 'Guarda Aberta']
  },
  {
    id: 'tec-4',
    titulo: 'Estrangulamento Triângulo (Sankaku-Jime)',
    categoria: 'Finalização',
    subcategoria: 'Ataques de Guarda',
    faixaMinima: 'branca',
    nivel: 'Iniciante',
    tipo: 'Ambos',
    descricao: 'Fechamento da artéria carótida utilizando uma perna e o próprio ombro do oponente, um dos pilares do Jiu-Jitsu.',
    pontosChave: [
      'Controle "um braço dentro, um braço fora"',
      'Dispare o quadril alto prendendo o pescoço e ombro',
      'Cruze o braço adversário pela linha média do seu corpo',
      'Ajuste a canela no pescoço segurando a própria canela com a mão',
      'Encaixe o joelho por cima do tornozelo, puxe a nuca e aperte os adutores'
    ],
    tags: ['Triângulo', 'Finalização', 'Guarda Fechada', 'Essencial']
  },
  {
    id: 'tec-5',
    titulo: 'Mata-Leão das Costas (Rear Naked Choke)',
    categoria: 'Finalização',
    subcategoria: 'Domínio das Costas',
    faixaMinima: 'branca',
    nivel: 'Iniciante',
    tipo: 'Ambos',
    descricao: 'A finalização mais dominante das artes marciais, aplicada após a conquista dos ganchos e cinto de segurança.',
    pontosChave: [
      'Mantenha o peito colado nas costas e o queixo protegido',
      'Braço de estrangulamento profundo com o cotovelo alinhado ao queixo',
      'Mão pega no próprio bíceps oposto',
      'Mão de apoio escorrega atrás da cabeça sem ser laçada',
      'Espalhe o adversário e expire fechando os ombros'
    ],
    tags: ['Mata-Leão', 'Costas', 'Sem Pano', 'Com Pano']
  },
  {
    id: 'tec-6',
    titulo: 'Raspagem Berimbolo para Pegada de Costas',
    categoria: 'Raspagem',
    subcategoria: 'Guarda Moderna',
    faixaMinima: 'azul',
    nivel: 'Avançado',
    tipo: 'Gi',
    descricao: 'Inversão corporal com giro invertido partindo da Guarda De La Riva com controle de faixa e calça até a conquista das costas.',
    pontosChave: [
      'Gancho De La Riva firme e mão controlando a calça ou calcanhar',
      'Mão oposta segura a faixa ou borda da calça atrás',
      'Desequilibre o adversário sentado no tatame',
      'Inverta o corpo rolando sobre o ombro externo',
      'Troque os ganchos na linha da cintura subindo para o cinto de segurança'
    ],
    tags: ['Berimbolo', 'De La Riva', 'Costas', 'Modern BJJ']
  },
  {
    id: 'tec-7',
    titulo: 'Kimura da Meia Guarda',
    categoria: 'Finalização',
    subcategoria: 'Meia Guarda',
    faixaMinima: 'branca',
    nivel: 'Intermediário',
    tipo: 'Ambos',
    descricao: 'Chave de ombro de quatro dedos aplicada da meia guarda ofensiva ou defensiva.',
    pontosChave: [
      'Suba no cotovelo quebrando a esgrima adversária',
      'Enlace o braço do oponente pegando no seu próprio punho (figura 4)',
      'Caia de costas criando ângulo lateral',
      'Mantenha o braço a 90 graus e projete a mão em direção à nuca do oponente'
    ],
    tags: ['Kimura', 'Ombro', 'Meia Guarda', 'Alavanca']
  },
  {
    id: 'tec-8',
    titulo: 'Defesa Pessoal: Saída de Gravata em Pé',
    categoria: 'Defesa Pessoal',
    subcategoria: 'Fundamentos Gracie',
    faixaMinima: 'branca',
    nivel: 'Iniciante',
    tipo: 'Ambos',
    descricao: 'Defesa clássica de agarre no pescoço em pé com gancho na perna e projeção defensiva.',
    pontosChave: [
      'Gire o queixo para respirar e colar a mão no braço agressor',
      'Dê um passo atrás da base do adversário',
      'Coloque a mão na cintura e passe a perna em gancho por trás do joelho',
      'Sente no tatame levando o agressor e monte imediatamente'
    ],
    tags: ['Defesa Pessoal', 'Gracie', 'Iniciante', 'Anti-Bullying']
  }
];

export const INITIAL_LESSON_PLANS: LessonPlan[] = [
  ...BASE44_LESSON_PLANS,
  {
    id: 'aula-1',
    data: '2026-10-05',
    semanaCiclo: 1,
    temaPrincipal: 'Fundamentos da Guarda Fechada: Quebra de Postura & Ataques Conectados',
    turma: 'Jiu-Jitsu Noturno (Todos os Níveis)',
    professor: 'Edson Mikalkenas',
    aquecimento: '15 min: Fuga de quadril lateral, rolamento frontal/dorsal, entrada de triângulo no ar e flexões de punho fechado.',
    tecnicaPrincipal: '25 min: Armlock da guarda fechada com transição rápida para Triângulo quando o adversário defende recolhendo o braço.',
    techniqueIds: ['tec-1', 'tec-4'],
    tecnicasNomes: ['Armlock da Guarda Fechada', 'Estrangulamento Triângulo (Sankaku-Jime)'],
    drillRepeticoes: '15 min: 20 repetições de cada lado de armlock e triângulo cronometrados com resistência de 30%.',
    treinoEspecificoRola: '25 min: Sparring específico saindo da guarda fechada (Passador tem 2 min para passar; Guardeiro para raspar ou finalizar). 5 rounds de 5 min.',
    observacoes: 'Atenção especial aos alunos faixa branca na pressão correta dos calcanhares para baixo no armlock.',
    concluida: false
  },
  {
    id: 'aula-2',
    data: '2026-10-06',
    semanaCiclo: 1,
    temaPrincipal: 'Jiu-Jitsu Infantil: Jogos Lúdicos, Base e Defesa do Urso',
    turma: 'Jiu-Jitsu Infantil (Kids 6-12 anos)',
    professor: 'Renata Albuquerque',
    aquecimento: '15 min: Jogo da tartaruga e do crocodilo, postura de samurai e corrida com obstáculo de almofadas.',
    tecnicaPrincipal: '20 min: Defesa pessoal contra agarre pela frente (abraço de urso) com base baixa e quebra de pegada.',
    techniqueIds: ['tec-8'],
    tecnicasNomes: ['Defesa Pessoal Contra Gravata / Agarre Frontal'],
    drillRepeticoes: '15 min: Duplas praticando a base com empurrão suave sem perder o equilíbrio.',
    treinoEspecificoRola: '15 min: Desafio "Rei do Tatame" (quem conseguir a montada primeiro pontua).',
    observacoes: 'Incentivar o respeito às regras e espírito esportivo do Arthur e da Beatriz.',
    concluida: false
  },
  {
    id: 'aula-3',
    data: '2026-10-04',
    semanaCiclo: 4,
    temaPrincipal: 'Passagens de Guarda em Pé vs Guarda Aranha e De La Riva',
    turma: 'Almoço Técnico & Drills',
    professor: 'Renata Albuquerque',
    aquecimento: '10 min: Mobilidade articular de tornozelos e quadris + sprawl e entrada de quedas.',
    tecnicaPrincipal: '30 min: Passagem Toreando quebrando pegada na manga com rotação de pulso e domínio de gola.',
    techniqueIds: ['tec-3'],
    tecnicasNomes: ['Passagem Toreando (Toreando Pass)'],
    drillRepeticoes: '15 min: Drill de troca de lado no Toreando com tempo de 30 segundos alternando.',
    treinoEspecificoRola: '20 min: Rola livre de 6 minutos com troca de parceiros.',
    observacoes: 'Excelente rendimento dos atletas competidores.',
    concluida: true
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  ...BASE44_ATTENDANCE,
  {
    id: 'att-1',
    studentId: 'aluno-1',
    studentNome: 'Gabriel Pires Menezes',
    studentFaixa: 'azul',
    studentGraus: 3,
    turmaId: 'turma-4',
    turmaTitulo: 'Jiu-Jitsu Noturno (Todos os Níveis)',
    data: '2026-10-05',
    horario: '19:35',
    confirmadoPor: 'Edson Mikalkenas'
  },
  {
    id: 'att-2',
    studentId: 'aluno-4',
    studentNome: 'Kauã dos Santos Silva',
    studentFaixa: 'verde',
    studentGraus: 3,
    turmaId: 'turma-4',
    turmaTitulo: 'Jiu-Jitsu Noturno (Todos os Níveis)',
    data: '2026-10-05',
    horario: '19:30',
    confirmadoPor: 'Edson Mikalkenas'
  },
  {
    id: 'att-3',
    studentId: 'aluno-6',
    studentNome: 'Rodrigo "Tanque" Barreto',
    studentFaixa: 'marrom',
    studentGraus: 1,
    turmaId: 'turma-4',
    turmaTitulo: 'Jiu-Jitsu Noturno (Todos os Níveis)',
    data: '2026-10-05',
    horario: '19:40',
    confirmadoPor: 'Edson Mikalkenas'
  },
  {
    id: 'att-4',
    studentId: 'aluno-5',
    studentNome: 'Mariana Duarte Costa',
    studentFaixa: 'branca',
    studentGraus: 4,
    turmaId: 'turma-1',
    turmaTitulo: 'Jiu-Jitsu Matinal (Geral)',
    data: '2026-10-05',
    horario: '07:02',
    confirmadoPor: 'Edson Mikalkenas'
  }
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  ...BASE44_PAYMENTS,
  {
    id: 'pay-1',
    studentId: 'aluno-1',
    studentNome: 'Gabriel Pires Menezes',
    plano: 'regular',
    mesReferencia: 'Outubro/2026',
    valor: 180,
    valorOriginal: 180,
    desconto: 0,
    dataVencimento: '2026-10-10',
    dataPagamento: '2026-10-02',
    status: 'em_dia',
    metodo: 'PIX',
    professorId: 'inst-1',
    professorNome: 'Edson Mikalkenas',
    chavePixProfessor: 'professormikalkenasbjj@gmail.com'
  },
  {
    id: 'pay-2',
    studentId: 'aluno-2',
    studentNome: 'Lucas "Pitbull" Furtado',
    plano: 'bolsista',
    mesReferencia: 'Outubro/2026',
    valor: 70,
    valorOriginal: 180,
    desconto: 110, // Bolsa Atleta 60%
    dataVencimento: '2026-10-05',
    dataPagamento: '2026-10-04',
    status: 'em_dia',
    metodo: 'PIX',
    professorId: 'inst-1',
    professorNome: 'Edson Mikalkenas',
    chavePixProfessor: 'professormikalkenasbjj@gmail.com'
  },
  {
    id: 'pay-3',
    studentId: 'aluno-3',
    studentNome: 'Arthur Medeiros (Tutu)',
    plano: 'infantil',
    mesReferencia: 'Outubro/2026',
    valor: 130,
    valorOriginal: 130,
    desconto: 0,
    dataVencimento: '2026-10-15',
    status: 'pendente',
    professorId: 'inst-2',
    professorNome: 'Renata Albuquerque',
    chavePixProfessor: 'renata.bjj@gmail.com'
  },
  {
    id: 'pay-4',
    studentId: 'aluno-4',
    studentNome: 'Kauã dos Santos Silva',
    plano: 'projeto_social',
    mesReferencia: 'Outubro/2026',
    valor: 0,
    valorOriginal: 180,
    desconto: 180, // 100% Gratuito - Projeto Social
    dataVencimento: '2026-10-01',
    dataPagamento: '2026-10-01',
    status: 'isento',
    metodo: 'Isento Social',
    professorId: 'inst-2',
    professorNome: 'Renata Albuquerque',
    chavePixProfessor: 'renata.bjj@gmail.com'
  },
  {
    id: 'pay-5',
    studentId: 'aluno-5',
    studentNome: 'Mariana Duarte Costa',
    plano: 'regular',
    mesReferencia: 'Outubro/2026',
    valor: 180,
    valorOriginal: 180,
    desconto: 0,
    dataVencimento: '2026-10-05',
    status: 'atrasado',
    professorId: 'inst-1',
    professorNome: 'Edson Mikalkenas',
    chavePixProfessor: 'professormikalkenasbjj@gmail.com'
  },
  {
    id: 'pay-6',
    studentId: 'aluno-6',
    studentNome: 'Rodrigo "Tanque" Barreto',
    plano: 'regular',
    mesReferencia: 'Outubro/2026',
    valor: 180,
    valorOriginal: 180,
    desconto: 0,
    dataVencimento: '2026-10-10',
    dataPagamento: '2026-10-03',
    status: 'em_dia',
    metodo: 'Cartão de Crédito',
    professorId: 'inst-1',
    professorNome: 'Edson Mikalkenas',
    chavePixProfessor: 'professormikalkenasbjj@gmail.com'
  },
  {
    id: 'pay-7',
    studentId: 'aluno-7',
    studentNome: 'Beatriz Vasconcelos',
    plano: 'infantil',
    mesReferencia: 'Outubro/2026',
    valor: 130,
    valorOriginal: 130,
    desconto: 0,
    dataVencimento: '2026-10-10',
    dataPagamento: '2026-10-05',
    status: 'em_dia',
    metodo: 'PIX',
    professorId: 'inst-2',
    professorNome: 'Renata Albuquerque',
    chavePixProfessor: 'renata.bjj@gmail.com'
  },
  {
    id: 'pay-8',
    studentId: 'aluno-8',
    studentNome: 'Thiago Oliveira',
    plano: 'projeto_social',
    mesReferencia: 'Outubro/2026',
    valor: 0,
    valorOriginal: 180,
    desconto: 180,
    dataVencimento: '2026-10-01',
    dataPagamento: '2026-10-01',
    status: 'isento',
    metodo: 'Isento Social',
    professorId: 'inst-3',
    professorNome: 'Marcos "Guará" Silva',
    chavePixProfessor: 'marcos.guara@gmail.com'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    tipo: 'treino',
    titulo: 'Lembrete: Treino No-Gi Especial Hoje',
    mensagem: 'Fala galera! Hoje teremos treino específico de finalizações de perna e wrestling no No-Gi às 21:00. Não se esqueçam da rashguard e bermuda sem zíper!',
    destinatario: 'Turma No-Gi & Competição',
    dataHora: '2026-10-05 14:00',
    statusEnvio: 'enviado',
    canal: 'whatsapp'
  },
  {
    id: 'notif-2',
    tipo: 'vencimento',
    titulo: 'Aviso de Vencimento de Mensalidade',
    mensagem: 'Olá Mariana Duarte! Lembramos que sua mensalidade de Jiu-Jitsu venceu em 05/10/2026 (R$ 180,00). Chave PIX da academia: professormikalkenasbjj@gmail.com. Caso já tenha efetuado, desconsidere.',
    destinatario: 'Mariana Duarte Costa',
    telefoneDestinatario: '(11) 98555-6677',
    dataHora: '2026-10-05 09:30',
    statusEnvio: 'enviado',
    canal: 'whatsapp'
  },
  {
    id: 'notif-3',
    tipo: 'graduacao',
    titulo: 'Apto para Graduação: Mariana Duarte',
    mensagem: 'A aluna Mariana Duarte completou 78 aulas na Faixa Branca 4º Grau e está apta para a cerimônia de graduação à Faixa Azul.',
    destinatario: 'Professores da Academia',
    dataHora: '2026-10-04 18:00',
    statusEnvio: 'enviado',
    canal: 'app'
  },
  {
    id: 'notif-4',
    tipo: 'vencimento',
    titulo: 'Lembrete Preventivo de Mensalidade',
    mensagem: 'Olá Arthur Medeiros! Lembramos que a mensalidade do Arthur vencerá no próximo dia 15/10/2026 (R$ 130,00). Obrigado pela confiança no aprendizado do seu pequeno!',
    destinatario: 'Arthur Medeiros (Tutu)',
    telefoneDestinatario: '(11) 98333-4455',
    dataHora: '2026-10-05 10:00',
    statusEnvio: 'agendado',
    canal: 'whatsapp'
  }
];

export const INITIAL_GRADUATIONS: GraduationHistory[] = [
  {
    id: 'grad-1',
    studentId: 'aluno-1',
    studentNome: 'Gabriel Pires Menezes',
    faixaAnterior: 'azul',
    grausAnteriores: 2,
    novaFaixa: 'azul',
    novosGraus: 3,
    data: '2025-06-15',
    professorAvaliador: 'Edson Mikalkenas',
    totalAulasAtingidas: 120,
    motivoObservacao: 'Demonstrou grande domínio técnico de raspagens e assiduidade exemplar nos treinos noturnos.'
  },
  {
    id: 'grad-2',
    studentId: 'aluno-2',
    studentNome: 'Lucas "Pitbull" Furtado',
    faixaAnterior: 'roxa',
    grausAnteriores: 1,
    novaFaixa: 'roxa',
    novosGraus: 2,
    data: '2025-04-10',
    professorAvaliador: 'Edson Mikalkenas',
    totalAulasAtingidas: 160,
    motivoObservacao: 'Medalha de ouro no Campeonato Paulista e excelente postura como monitor dos treinos infantis.'
  }
];

export const INITIAL_PRODUCTS: AcademyProduct[] = [
  {
    id: 'prod-1',
    nome: 'Kimono Oficial Mikalkenas Jiu Jitsu Trançado Pesado (450g) - 4 Cores',
    categoria: 'Kimono',
    preco: 420.0,
    estoque: 18,
    tamanho: 'A0, A1, A2, A3, A4',
    imagem: '/assets/aistudio/Mikalkenas_Kimonos_3db0a11f.jpeg'
  },
  {
    id: 'prod-2',
    nome: 'Rashguard Compressão Oficial Mikalkenas Jiu Jitsu Dry-Fit (Por Faixa)',
    categoria: 'Rashguard',
    preco: 140.0,
    estoque: 26,
    tamanho: 'P, M, G, GG',
    imagem: '/assets/aistudio/Mikalkenas_Rash_Guards_e30540cb.jpeg'
  },
  {
    id: 'prod-3',
    nome: 'Faixa Premium Algodão Bordada com Ponta Preta & Ponteira',
    categoria: 'Faixa',
    preco: 85.0,
    estoque: 25,
    tamanho: 'A1 ao A4',
    imagem: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'prod-4',
    nome: 'Mochila Tatame Duffle Bag Impermeável Mikalkenas Jiu Jitsu',
    categoria: 'Acessórios',
    preco: 190.0,
    estoque: 12,
    tamanho: 'Único 45L',
    imagem: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'prod-5',
    nome: 'Água de Coco Natural 500ml Gelada',
    categoria: 'Bebidas/Nutrição',
    preco: 8.0,
    estoque: 42
  }
];

export const INITIAL_EVENTS: AcademyEvent[] = [
  {
    id: 'evt-1',
    titulo: 'Campeonato Paulista de Jiu-Jitsu FPJJ',
    tipo: 'campeonato',
    data: '2026-10-24',
    horario: '08:30 - 18:00',
    local: 'Ginásio do Ibirapuera, São Paulo - SP',
    descricao: 'Competição oficial estadual com disputas Gi e No-Gi da categoria Pré-Mirim ao Master. Pontuação válida para o ranking paulista.',
    organizador: 'Edson Mikalkenas',
    organizadorId: 'inst-1',
    taxaInscricao: 95.0,
    participantesIds: ['aluno-2', 'aluno-1', 'aluno-6'],
    status: 'agendado'
  },
  {
    id: 'evt-2',
    titulo: 'Cerimônia Semestral de Graduação e Entrega de Faixas',
    tipo: 'graduacao',
    data: '2026-11-14',
    horario: '10:00 - 13:00',
    local: 'Tatame Central - Mikalkenas Jiu Jitsu',
    descricao: 'Grande festa e cerimônia solene com exame prático, entrega de graus e faixas outorgadas pelos mestres. Aberto a amigos e familiares.',
    organizador: 'Edson Mikalkenas & Renata Albuquerque',
    organizadorId: 'inst-1',
    taxaInscricao: 0,
    participantesIds: ['aluno-5', 'aluno-4', 'aluno-3', 'aluno-1'],
    status: 'agendado'
  },
  {
    id: 'evt-3',
    titulo: 'Seminário Especial: Passagem de Guarda de Lapela & Pressão',
    tipo: 'seminario',
    data: '2026-10-31',
    horario: '14:30 - 17:30',
    local: 'Tatame 1 - Mikalkenas Jiu Jitsu',
    descricao: '3 horas de imersão técnica sobre conexões de lapela, bloqueio de quadril e transições para a montada com Mestre Faixa Preta 5º Grau convidado.',
    organizador: 'Renata Albuquerque',
    organizadorId: 'inst-2',
    taxaInscricao: 80.0,
    participantesIds: ['aluno-1', 'aluno-2', 'aluno-5'],
    status: 'agendado'
  },
  {
    id: 'evt-4',
    titulo: 'Super Open Mat Beneficente • Arrecadação de Kimonos',
    tipo: 'open_mat',
    data: '2026-10-17',
    horario: '10:00 - 12:30',
    local: 'Tatame 1 + Tatame 2 Integrados',
    descricao: 'Treino livre de sparring entre academias parceiras. Entrada: doação de 1kg de alimento ou 1 peça de kimono para o Projeto Social.',
    organizador: 'Renata Albuquerque',
    organizadorId: 'inst-2',
    taxaInscricao: 0,
    participantesIds: ['aluno-1', 'aluno-2', 'aluno-4', 'aluno-6', 'aluno-8'],
    status: 'agendado'
  }
];

export const INITIAL_PURCHASES: StudentPurchase[] = [
  {
    id: 'pur-1',
    studentId: 'aluno-1',
    studentNome: 'Gabriel Pires Menezes',
    produtoId: 'prod-1',
    produtoNome: 'Kimono Oficial Mikalkenas Jiu Jitsu Trançado Pesado (450g) - A2',
    preco: 420.0,
    data: '2026-09-15',
    status: 'pago',
    professorId: 'inst-1'
  },
  {
    id: 'pur-2',
    studentId: 'aluno-1',
    studentNome: 'Gabriel Pires Menezes',
    produtoId: 'prod-3',
    produtoNome: 'Rashguard Compressão Oficial Mikalkenas Jiu Jitsu Dry-Fit - M',
    preco: 140.0,
    data: '2026-10-01',
    status: 'pago',
    professorId: 'inst-1'
  },
  {
    id: 'pur-3',
    studentId: 'aluno-2',
    studentNome: 'Lucas "Pitbull" Furtado',
    produtoId: 'prod-3',
    produtoNome: 'Rashguard Compressão Oficial Mikalkenas Jiu Jitsu Dry-Fit - P',
    preco: 140.0,
    data: '2026-09-28',
    status: 'pago',
    professorId: 'inst-1'
  },
  {
    id: 'pur-4',
    studentId: 'aluno-5',
    studentNome: 'Mariana Duarte Costa',
    produtoId: 'prod-2',
    produtoNome: 'Faixa Premium Algodão Bordada com Ponta Preta - F2',
    preco: 85.0,
    data: '2026-10-02',
    status: 'pago',
    professorId: 'inst-1'
  },
  {
    id: 'pur-5',
    studentId: 'aluno-3',
    studentNome: 'Arthur Medeiros (Tutu)',
    produtoId: 'prod-1',
    produtoNome: 'Kimono Infantil Reforçado - M3',
    preco: 220.0,
    data: '2026-10-03',
    status: 'pago',
    professorId: 'inst-2'
  }
];

export const DEFAULT_IBJJF_BELT_RULES: Record<BeltColor, BeltGraduationRule> = {
  // --- FAIXAS ADULTAS (A partir de 16 anos) ---
  branca: {
    faixa: 'branca',
    nome: 'Faixa Branca (Iniciante)',
    categoria: 'adulto',
    idadeMinima: 16,
    tempoMinimoMesesIBJJF: 12,
    tempoMinimoDescricao: '1 ano sugerido (sem carência mínima estrita na IBJJF)',
    aulasPorGrau: 35, // 4 graus x 35 = 140 aulas
    aulasPorFaixaDireta: 140,
    observacaoIBJJF: 'A IBJJF não exige carência mínima legal na branca, mas a média pedagógica é de 1 ano para assimilar postura, guarda e saídas básicas.'
  },
  azul: {
    faixa: 'azul',
    nome: 'Faixa Azul',
    categoria: 'adulto',
    idadeMinima: 16,
    tempoMinimoMesesIBJJF: 24, // 2 anos obrigatórios IBJJF
    tempoMinimoDescricao: '2 anos (24 meses) obrigatórios pela regra IBJJF',
    aulasPorGrau: 60, // 4 graus x 60 = 240 aulas (~120 aulas/ano)
    aulasPorFaixaDireta: 240,
    observacaoIBJJF: 'A IBJJF determina permanência mínima obrigatória de 2 (dois) anos na faixa azul antes da graduação para a faixa roxa.'
  },
  roxa: {
    faixa: 'roxa',
    nome: 'Faixa Roxa',
    categoria: 'adulto',
    idadeMinima: 17,
    tempoMinimoMesesIBJJF: 18, // 1 ano e meio (18 meses) obrigatórios IBJJF
    tempoMinimoDescricao: '1 ano e meio (18 meses) obrigatórios pela regra IBJJF',
    aulasPorGrau: 45, // 4 graus x 45 = 180 aulas
    aulasPorFaixaDireta: 180,
    observacaoIBJJF: 'A IBJJF determina permanência mínima obrigatória de 1 ano e 6 meses (18 meses) na faixa roxa antes da graduação para a faixa marrom.'
  },
  marrom: {
    faixa: 'marrom',
    nome: 'Faixa Marrom',
    categoria: 'adulto',
    idadeMinima: 18,
    tempoMinimoMesesIBJJF: 12, // 1 ano obrigatório IBJJF
    tempoMinimoDescricao: '1 ano (12 meses) obrigatório pela regra IBJJF',
    aulasPorGrau: 35, // 4 graus x 35 = 140 aulas
    aulasPorFaixaDireta: 140,
    observacaoIBJJF: 'A IBJJF determina permanência mínima obrigatória de 1 (um) ano na faixa marrom antes da graduação para a faixa preta.'
  },
  preta: {
    faixa: 'preta',
    nome: 'Faixa Preta',
    categoria: 'adulto',
    idadeMinima: 19,
    tempoMinimoMesesIBJJF: 36, // 3 anos por grau (1º, 2º e 3º)
    tempoMinimoDescricao: '3 anos (36 meses) por grau conforme CBJJ/IBJJF',
    aulasPorGrau: 75,
    aulasPorFaixaDireta: 300,
    observacaoIBJJF: 'Pela regra da IBJJF/CBJJ, o praticante deve permanecer no mínimo 3 anos como faixa preta lisa antes do 1º grau, e mais 3 anos para cada grau subsequente até o 3º.'
  },

  // --- FAIXAS INFANTIS (4 a 15 anos) ---
  cinza: {
    faixa: 'cinza',
    nome: 'Faixa Cinza (Kids)',
    categoria: 'infantil',
    idadeMinima: 4,
    tempoMinimoMesesIBJJF: 12, // 1 ano IBJJF
    tempoMinimoDescricao: '1 ano (12 meses) no sistema de faixas infantis IBJJF',
    aulasPorGrau: 20, // 4 graus x 20 = 80 aulas (2x por semana infantil)
    aulasPorFaixaDireta: 80,
    observacaoIBJJF: 'Destinada a crianças de 4 a 15 anos. A IBJJF prevê transições (cinza/branca, cinza e cinza/preta) com carência mínima anual.'
  },
  amarela: {
    faixa: 'amarela',
    nome: 'Faixa Amarela (Kids)',
    categoria: 'infantil',
    idadeMinima: 7,
    tempoMinimoMesesIBJJF: 12, // 1 ano IBJJF
    tempoMinimoDescricao: '1 ano (12 meses) no sistema de faixas infantis IBJJF',
    aulasPorGrau: 20, // 4 graus x 20 = 80 aulas
    aulasPorFaixaDireta: 80,
    observacaoIBJJF: 'Destinada a crianças de 7 a 15 anos. Permanência mínima de 1 ano antes da promoção para a faixa laranja.'
  },
  laranja: {
    faixa: 'laranja',
    nome: 'Faixa Laranja (Kids / Juvenil)',
    categoria: 'infantil',
    idadeMinima: 10,
    tempoMinimoMesesIBJJF: 12, // 1 ano IBJJF
    tempoMinimoDescricao: '1 ano (12 meses) no sistema de faixas infantis IBJJF',
    aulasPorGrau: 22, // 4 graus x 22 = ~90 aulas
    aulasPorFaixaDireta: 90,
    observacaoIBJJF: 'Destinada a jovens de 10 a 15 anos. Permanência mínima de 1 ano antes da promoção para a faixa verde.'
  },
  verde: {
    faixa: 'verde',
    nome: 'Faixa Verde (Juvenil)',
    categoria: 'infantil',
    idadeMinima: 13,
    tempoMinimoMesesIBJJF: 12, // 1 ano IBJJF
    tempoMinimoDescricao: '1 ano (12 meses) antes da transição para Faixa Azul aos 16 anos',
    aulasPorGrau: 25, // 4 graus x 25 = 100 aulas
    aulasPorFaixaDireta: 100,
    observacaoIBJJF: 'Última faixa do sistema infantil (13 a 15 anos). Aos 16 anos completos, o atleta graduado faixa verde pode ser promovido diretamente à faixa azul.'
  }
};

export const DEFAULT_ACADEMY_SETTINGS = {
  nomeAcademia: 'Mikalkenas Jiu Jitsu',
  mestreResponsavel: 'Edson Mikalkenas',
  faixaMestre: 'preta' as const,
  grausMestre: 3,
  registroCBJJMestre: 'CBJJ #48291',
  unidadePrincipal: 'Matriz - Tatame Principal',
  telefone: '(11) 98765-4321',
  email: 'professormikalkenasbjj@gmail.com',
  chavePix: 'professormikalkenasbjj@gmail.com',
  banco: 'Banco do Brasil (Ag: 1842-1 C/C: 49201-9)',
  sistemaGraduacaoPadrao: 'graus_e_faixas' as const,
  aulasPorGrau: 40,
  aulasPorFaixaDireta: 160,
  valorPadraoRegular: 180,
  valorPadraoInfantil: 130,
  valorPadraoBolsista: 70,
  whatsappApiUrl: '',
  whatsappInstanceId: '',
  whatsappPhoneNumber: '',
  messagingEmail: '',
  messagingSenderName: 'Mikalkenas Jiu Jitsu',
  regrasGraduacao: DEFAULT_IBJJF_BELT_RULES,
  supabaseConfig: {
    url: 'https://rryyqwoygfwutnbxjrta.supabase.co',
    anonKey: 'sb_publishable_THjyHMmIulOzc9fRokYL4Q_uaS9zpG8',
    serviceRoleKey: '',
    enabled: true,
    autoSync: true
  }
};
