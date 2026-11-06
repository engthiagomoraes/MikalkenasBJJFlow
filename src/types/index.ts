export type BeltColor = 
  | 'branca' 
  | 'cinza' 
  | 'amarela' 
  | 'laranja' 
  | 'verde' 
  | 'azul' 
  | 'roxa' 
  | 'marrom' 
  | 'preta';

export type PlanType = 'regular' | 'infantil' | 'bolsista' | 'projeto_social';

export type PaymentStatus = 'em_dia' | 'pendente' | 'atrasado' | 'isento';

export type UserRole = 'admin' | 'professor' | 'aluno';

export type GraduationSystemType = 'graus_e_faixas' | 'apenas_faixas';

export type AppTheme = 'dark' | 'light' | 'colorful' | 'padrao';

export interface UserPermissions {
  canManageUsers: boolean;       // Criar, editar privilégios e excluir usuários
  canManageStudents: boolean;    // Matricular e gerenciar alunos
  canManageClasses: boolean;     // Criar e editar turmas e horários
  canManageFinancial: boolean;   // Controlar mensalidades, PIX e fluxo de caixa
  canManageGraduations: boolean; // Graduar alunos e emitir certificados
  canManageSettings: boolean;    // Alterar dados da academia e regras IBJJF
  canManageEvents: boolean;      // Criar eventos e torneios
  canManageTechniques: boolean;  // Gerenciar currículo de técnicas
  canManageProducts: boolean;    // Controle de estoque e vendas
}

export const DEFAULT_MASTER_PERMISSIONS: UserPermissions = {
  canManageUsers: true,
  canManageStudents: true,
  canManageClasses: true,
  canManageFinancial: true,
  canManageGraduations: true,
  canManageSettings: true,
  canManageEvents: true,
  canManageTechniques: true,
  canManageProducts: true
};

export const DEFAULT_ADMIN_PERMISSIONS: UserPermissions = {
  canManageUsers: true,
  canManageStudents: true,
  canManageClasses: true,
  canManageFinancial: true,
  canManageGraduations: true,
  canManageSettings: true,
  canManageEvents: true,
  canManageTechniques: true,
  canManageProducts: true
};

export const DEFAULT_PROFESSOR_PERMISSIONS: UserPermissions = {
  canManageUsers: false,
  canManageStudents: true,
  canManageClasses: true,
  canManageFinancial: false,
  canManageGraduations: true,
  canManageSettings: false,
  canManageEvents: true,
  canManageTechniques: true,
  canManageProducts: false
};

export const DEFAULT_STUDENT_PERMISSIONS: UserPermissions = {
  canManageUsers: false,
  canManageStudents: false,
  canManageClasses: false,
  canManageFinancial: false,
  canManageGraduations: false,
  canManageSettings: false,
  canManageEvents: false,
  canManageTechniques: false,
  canManageProducts: false
};

export type UserStatus = 'pendente' | 'aprovado' | 'reprovado' | 'ativo' | 'inativo';

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  isMasterAdmin?: boolean;
  permissions?: UserPermissions;
  avatar?: string;
  professorId?: string;
  studentId?: string;
  faixa?: BeltColor;
  graus?: number;
  status?: UserStatus;
  telefone?: string;
  createdAt?: string;
  ultimoAcesso?: string;
}

export interface UserRegistrationData {
  role: 'aluno' | 'professor';
  nome: string;
  email: string;
  password: string;
  confirmPassword?: string;
  telefone?: string;
  faixa: BeltColor;
  graus: number;
  dataNascimento?: string;
  turmaPreferida?: string;
  turmaPreferencia?: string;
  plano?: PlanType;
  registroCBJJ?: string;
  chavePix?: string;
  bio?: string;
}

export interface AcademyEvent {
  id: string;
  titulo: string;
  tipo: 'campeonato' | 'graduacao' | 'seminario' | 'open_mat';
  data: string; // YYYY-MM-DD
  horario: string;
  local: string;
  descricao: string;
  organizador: string;
  organizadorId: string;
  taxaInscricao: number;
  participantesIds: string[]; // IDs de alunos inscritos
  status: 'agendado' | 'em_andamento' | 'concluido';
}

export interface StudentPurchase {
  id: string;
  studentId: string;
  studentNome: string;
  produtoId: string;
  produtoNome: string;
  preco: number;
  data: string;
  status: 'pago' | 'pendente';
  professorId?: string;
}

export interface PerformanceStats {
  guarda: number; // 1-10
  passagem: number; // 1-10
  quedas: number; // 1-10
  finalizacoes: number; // 1-10
  defesa: number; // 1-10
  disciplina: number; // 1-10
  tempoRolaMinutos: number; // minutos totais de sparring
  finalizacoesAplicadas: number;
  raspagensFeitas: number;
}

export interface DevelopmentScores {
  guarda: number; // 0 a 10 em passos de 0.5 (Jogo de Guarda & Retenção)
  passagem: number; // 0 a 10 em passos de 0.5 (Passagem de Guarda & Pressão)
  quedas: number; // 0 a 10 em passos de 0.5 (Quedas & Luta em Pé)
  finalizacoes: number; // 0 a 10 em passos de 0.5 (Precisão de Finalizações)
  defesa: number; // 0 a 10 em passos de 0.5 (Defesas & Escapadas)
  disciplina: number; // 0 a 10 em passos de 0.5 (Disciplina, Assiduidade & Respeito)
}

export interface EvaluationDimension {
  key: keyof DevelopmentScores;
  label: string;
  shortLabel: string;
  description: string;
}

export const EVALUATION_DIMENSIONS: EvaluationDimension[] = [
  { 
    key: 'guarda', 
    label: 'Jogo de Guarda & Retenção', 
    shortLabel: 'Guarda & Retenção',
    description: 'Capacidade de repor guarda, manter ganchos, postura e transições ativas.'
  },
  { 
    key: 'passagem', 
    label: 'Passagem de Guarda & Pressão', 
    shortLabel: 'Passagem & Pressão',
    description: 'Velocidade de passagem, esgrima, controle de quadril e distribuição de peso superior.'
  },
  { 
    key: 'quedas', 
    label: 'Quedas & Luta em Pé', 
    shortLabel: 'Quedas & Em Pé',
    description: 'Postura em pé, pegadas de judô/wrestling, projeções e domínio de distância.'
  },
  { 
    key: 'finalizacoes', 
    label: 'Precisão de Finalizações', 
    shortLabel: 'Finalizações',
    description: 'Ajuste fino de estrangulamentos, alavancas e tempo de ataque sem afobação.'
  },
  { 
    key: 'defesa', 
    label: 'Defesas & Escapadas', 
    shortLabel: 'Defesas & Escapadas',
    description: 'Sobrevivência sob pressão, saída de montada, costas, 100kg e antecipação.'
  },
  { 
    key: 'disciplina', 
    label: 'Disciplina, Assiduidade & Respeito', 
    shortLabel: 'Disciplina & Respeito',
    description: 'Pontualidade, respeito aos companheiros e ao dojo, constância e conduta ética.'
  }
];

export interface StudentEvaluation {
  id: string; // identificador único
  studentId: string; // identificador do aluno
  data: string; // YYYY-MM-DD
  avaliadorId?: string; // identificador do avaliador quando disponível
  avaliadorNome?: string; // nome do avaliador identificado
  scores: DevelopmentScores; // seis notas de 0 a 10 em passos de 0.5
  observacoes?: string; // observações pedagógicas / técnicas opcionais
  focoDesenvolvimento?: string; // foco de desenvolvimento opcional
  createdAt: string; // data de criação ISO
  updatedAt: string; // data da última atualização ISO
}

export interface LearnedTechnique {
  id: string;
  techniqueId?: string;
  titulo: string;
  categoria: string;
  dataAprendida: string; // YYYY-MM-DD
  aulaTitulo?: string;
  turmaNome?: string;
  professorNome?: string;
}

export interface Student {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  avatar?: string;
  dataNascimento: string;
  dataInicio: string;
  faixa: BeltColor;
  graus: number; // 0 to 4
  dataUltimaGraduacao: string;
  presencasNaFaixa: number;
  presencasMetaGrau: number;
  totalPresencasHistorico: number;
  plano: PlanType;
  valorMensalidade: number; // R$
  diaVencimento: number; // dia do mês (ex: 5, 10, 15)
  statusPagamento: PaymentStatus;
  observacoesMedicas?: string;
  tamanhoKimono: string; // A1, A2, M2, etc.
  pesoKg: number;
  turmaPreferida: string;
  performance: PerformanceStats;
  professorId?: string;
  professorNome?: string;
  tecnicasAprendidas?: LearnedTechnique[];
  sistemaGraduacao?: GraduationSystemType; // 'graus_e_faixas' ou 'apenas_faixas'
  ativo?: boolean;
}

export interface Instructor {
  id: string;
  nome: string;
  faixa: BeltColor;
  graus: number;
  email: string;
  telefone: string;
  foto?: string;
  registroCBJJ: string;
  bio: string;
  turmas: string[];
  chavePix?: string;
  banco?: string;
  sistemaGraduacao?: GraduationSystemType; // 'graus_e_faixas' ou 'apenas_faixas'
  role?: UserRole;
  permissions?: UserPermissions;
}

export interface ClassSchedule {
  id: string;
  titulo: string;
  diaSemana: string;
  horario: string;
  categoria: 'Iniciante' | 'Intermediário/Avançado' | 'Infantil (Kids)' | 'No-Gi (Sem Kimono)' | 'Competição' | 'Open Mat';
  professorId: string;
  professorNome: string;
  sala: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentNome: string;
  studentFaixa: BeltColor;
  studentGraus: number;
  turmaId: string;
  turmaTitulo: string;
  data: string; // YYYY-MM-DD
  horario: string;
  confirmadoPor: string;
  presente?: boolean;
  observacao?: string;
}

export interface LessonPlan {
  id: string;
  data: string; // YYYY-MM-DD
  semanaCiclo: number; // 1 to 4
  temaPrincipal: string;
  turma?: string;
  turmaId?: string;
  turmaNome?: string;
  professor?: string;
  professorId?: string;
  professorNome?: string;
  aquecimento?: string;
  tecnicaPrincipal?: string;
  techniqueIds?: string[]; // IDs das técnicas da biblioteca
  tecnicasNomes?: string[]; // Lista de técnicas ensinadas na aula
  drillRepeticoes?: string;
  treinoEspecificoRola?: string;
  observacoes: string;
  concluida: boolean;
  tecnicas?: any;
}

export interface Technique {
  id: string;
  titulo: string;
  categoria: 'Queda' | 'Guarda' | 'Passagem de Guarda' | 'Raspagem' | 'Finalização' | 'Defesa Pessoal' | 'Costas' | 'Drill';
  subcategoria?: string;
  faixaMinima: BeltColor;
  nivel: 'Iniciante' | 'Intermediário' | 'Avançado';
  tipo: 'Gi' | 'No-Gi' | 'Ambos';
  descricao: string;
  pontosChave: string[];
  videoUrl?: string;
  tags: string[];
}

export interface GraduationHistory {
  id: string;
  studentId: string;
  studentNome: string;
  faixaAnterior: BeltColor;
  grausAnteriores: number;
  novaFaixa: BeltColor;
  novosGraus: number;
  data: string;
  professorAvaliador: string;
  totalAulasAtingidas: number;
  motivoObservacao: string;
  tipoGraduacao?: 'grau' | 'faixa';
  sistemaUtilizado?: GraduationSystemType;
}

export interface PaymentRecord {
  id: string;
  studentId: string;
  studentNome: string;
  plano: PlanType;
  mesReferencia: string; // Ex: 'Outubro/2026'
  valor: number;
  valorOriginal: number;
  desconto: number;
  dataPagamento?: string;
  dataVencimento: string;
  status: PaymentStatus;
  metodo?: 'PIX' | 'Dinheiro' | 'Cartão de Crédito' | 'Boleto' | 'Isento Social';
  comprovante?: string;
  professorId?: string;
  professorNome?: string;
  chavePixProfessor?: string;
}

export interface NotificationItem {
  id: string;
  tipo: 'treino' | 'vencimento' | 'graduacao' | 'geral';
  titulo: string;
  mensagem: string;
  destinatario: string; // 'Todos', turma ou nome de aluno
  telefoneDestinatario?: string;
  dataHora: string;
  statusEnvio: 'enviado' | 'agendado' | 'pendente';
  canal: 'whatsapp' | 'email' | 'app';
}

export interface AcademyProduct {
  id: string;
  nome: string;
  categoria: 'Kimono' | 'Faixa' | 'Rashguard' | 'Acessórios' | 'Bebidas/Nutrição';
  preco: number;
  estoque: number;
  tamanho?: string;
  imagem?: string;
}

export interface BeltGraduationRule {
  faixa: BeltColor;
  nome: string;
  categoria: 'infantil' | 'adulto';
  idadeMinima: number; // Anos (ex: 4, 7, 10, 13, 16, 17, 18, 19)
  tempoMinimoMesesIBJJF: number; // Tempo mínimo de permanência estipulado pela IBJJF em meses
  tempoMinimoDescricao: string; // Ex: "2 anos (24 meses)", "1 ano (12 meses)", etc.
  aulasPorGrau: number; // Meta de presenças por grau (sistema de 4 graus)
  aulasPorFaixaDireta: number; // Meta total de presenças para exame / troca direta de faixa
  observacaoIBJJF: string; // Detalhe da norma oficial da IBJJF
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
  enabled: boolean;
  autoSync?: boolean;
  lastConnected?: string;
  lastSync?: string;
}

export interface SupabaseTableStatus {
  name: string;
  label: string;
  description: string;
  exists: boolean;
  count: number;
  error?: string;
}

export interface AcademySettings {
  nomeAcademia: string;
  mestreResponsavel: string;
  faixaMestre: BeltColor;
  grausMestre: number;
  registroCBJJMestre: string;
  unidadePrincipal: string;
  telefone: string;
  email: string;
  chavePix: string;
  banco: string;
  sistemaGraduacaoPadrao: GraduationSystemType; // 'graus_e_faixas' ou 'apenas_faixas'
  aulasPorGrau: number;
  aulasPorFaixaDireta: number;
  valorPadraoRegular: number;
  valorPadraoInfantil: number;
  valorPadraoBolsista: number;
  regrasGraduacao?: Record<BeltColor, BeltGraduationRule>;
  supabaseConfig?: SupabaseConfig;
  whatsappApiUrl?: string;
  whatsappInstanceId?: string;
  whatsappPhoneNumber?: string;
  messagingEmail?: string;
  messagingSenderName?: string;
}

export interface StudentGraduationStatus {
  rule: BeltGraduationRule;
  metaAulas: number;
  aulasRestantes: number;
  progressoAulasPct: number;
  mesesNaFaixa: number;
  tempoMinimoMesesIBJJF: number;
  tempoMinimoCumprido: boolean;
  aptoPorAulas: boolean;
  aptoTotalIBJJF: boolean; // Cumpriu tanto as presenças quanto o tempo de permanência da IBJJF
  proximaFaixa: BeltColor;
  proximaAcao: 'grau' | 'faixa';
  proximaMetaDescricao: string;
}
