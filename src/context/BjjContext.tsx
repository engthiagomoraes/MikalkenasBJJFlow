import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
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
  BeltColor,
  PaymentStatus,
  AuthUser,
  AcademyEvent,
  StudentPurchase,
  UserRole,
  LearnedTechnique,
  AcademySettings,
  GraduationSystemType,
  BeltGraduationRule,
  StudentGraduationStatus,
  UserPermissions,
  AppTheme,
  DEFAULT_MASTER_PERMISSIONS,
  DEFAULT_ADMIN_PERMISSIONS,
  DEFAULT_PROFESSOR_PERMISSIONS,
  DEFAULT_STUDENT_PERMISSIONS,
  SupabaseConfig,
  StudentEvaluation,
  DevelopmentScores,
  UserRegistrationData
} from '../types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_INSTRUCTORS, 
  INITIAL_CLASSES, 
  INITIAL_ATTENDANCE, 
  INITIAL_LESSON_PLANS, 
  INITIAL_TECHNIQUES, 
  INITIAL_GRADUATIONS, 
  INITIAL_PAYMENTS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_PRODUCTS,
  INITIAL_EVENTS,
  INITIAL_PURCHASES,
  DEFAULT_ACADEMY_SETTINGS,
  DEFAULT_IBJJF_BELT_RULES
} from '../data/mockData';
import { 
  exportAllToSupabase, 
  importAllFromSupabase, 
  isSecretApiKey, 
  getSupabaseClient, 
  authenticateUserWithSupabase, 
  registerNewUserInSupabase,
  fetchUsersFromSupabase,
  updateUserStatusInSupabase,
  safeParseJsonResponse,
  approveUserInSupabase,
  reconcileAllApprovedUsers,
  fetchInstructorsFromSupabase,
  fetchStudentsFromSupabase,
  saveUserToSupabase,
  updateUserRoleInSupabase,
  changeUserPasswordInSupabase,
  requestPasswordResetInSupabase,
  fetchPaymentsFromSupabase, 
  savePaymentToSupabase,
  saveStudentToSupabase,
  deleteStudentFromSupabase,
  saveInstructorToSupabase,
  deleteInstructorFromSupabase,
  saveClassScheduleToSupabase,
  deleteClassScheduleFromSupabase,
  saveAttendanceToSupabase,
  deleteAttendanceFromSupabase,
  saveGraduationToSupabase,
  saveTechniqueToSupabase,
  deleteTechniqueFromSupabase,
  saveLessonPlanToSupabase,
  saveSettingsToSupabase,
  DEFAULT_SUPABASE_CONFIG,
  DEFAULT_SUPABASE_URL,
  DEFAULT_SUPABASE_ANON_KEY,
  mapServerUserToAuthUser
} from '../services/supabaseService';

interface BjjContextType {
  currentUser: AuthUser;
  isAuthenticated: boolean;
  authError: string | null;
  allUsers: AuthUser[];
  pendingUsers: AuthUser[];
  loadPendingUsers: (statusFilter?: string) => Promise<AuthUser[]>;
  approveUser: (userId: string) => Promise<{ success: boolean; error?: string }>;
  rejectUser: (userId: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (regData: UserRegistrationData) => Promise<{ success: boolean; message: string; userId?: string }>;
  loginWithEmailAndPassword: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: AuthUser }>;
  changeCurrentUserPassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string; userFound?: boolean }>;
  updateUser: (userId: string, partialUser: Partial<AuthUser>) => void;
  updateUserPermissions: (userId: string, permissions: Partial<UserPermissions>) => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  addUser: (userData: Omit<AuthUser, 'id'>) => AuthUser;
  deleteUser: (userId: string) => boolean;
  hasPermission: (permission: keyof UserPermissions) => boolean;
  logout: () => Promise<void>;

  academySettings: AcademySettings;
  updateAcademySettings: (settings: Partial<AcademySettings>) => void;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  supabaseConfig: SupabaseConfig;
  updateSupabaseConfig: (config: Partial<SupabaseConfig>) => void;
  syncDataWithSupabase: () => Promise<{ success: boolean; details?: Record<string, number>; errors?: string[] }>;
  pullDataFromSupabaseContext: () => Promise<{ success: boolean; error?: string }>;
  getBeltGraduationRule: (faixa: BeltColor) => BeltGraduationRule;
  updateBeltGraduationRule: (faixa: BeltColor, ruleUpdate: Partial<BeltGraduationRule>) => void;
  resetBeltGraduationRulesToIBJJF: () => void;
  getStudentGraduationStatus: (student: Student) => StudentGraduationStatus;

  students: Student[];
  instructors: Instructor[];
  classes: ClassSchedule[];
  attendance: AttendanceRecord[];
  lessonPlans: LessonPlan[];
  techniques: Technique[];
  graduations: GraduationHistory[];
  payments: PaymentRecord[];
  notifications: NotificationItem[];
  products: AcademyProduct[];
  events: AcademyEvent[];
  purchases: StudentPurchase[];
  evaluations: StudentEvaluation[];
  
  // Actions
  addAttendance: (studentId: string, classId: string, date?: string, time?: string) => Promise<{ success: boolean; error?: string }>;
  removeAttendance: (attendanceId: string) => Promise<{ success: boolean; error?: string }>;
  checkInStudentToday: (studentId: string, turmaId: string) => Promise<{ success: boolean; error?: string }>;
  
  addStudent: (student: Omit<Student, 'id' | 'presencasNaFaixa' | 'totalPresencasHistorico' | 'performance'>) => Promise<{ success: boolean; error?: string; student?: Student }>;
  importStudents: (studentsList: Omit<Student, 'id' | 'presencasNaFaixa' | 'totalPresencasHistorico' | 'performance'>[]) => number;
  updateStudent: (id: string, updated: Partial<Student>) => Promise<{ success: boolean; error?: string }>;
  deleteStudent: (id: string) => Promise<{ success: boolean; error?: string }>;
  updateStudentGraduationSystem: (studentId: string, system: GraduationSystemType) => void;

  addClassSchedule: (classSchedule: Omit<ClassSchedule, 'id'>) => Promise<{ success: boolean; error?: string }>;
  updateClassSchedule: (id: string, updated: Partial<ClassSchedule>) => Promise<{ success: boolean; error?: string }>;
  importClasses: (classesList: Omit<ClassSchedule, 'id'>[]) => number;
  deleteClassSchedule: (id: string) => Promise<{ success: boolean; error?: string }>;

  addInstructor: (instructor: Omit<Instructor, 'id'>, accessConfig?: { role?: UserRole; permissions?: Partial<UserPermissions> }) => Promise<{ success: boolean; error?: string }>;
  importInstructors: (instructorsList: Omit<Instructor, 'id'>[]) => number;
  updateInstructor: (id: string, updated: Partial<Instructor>, accessConfig?: { role?: UserRole; permissions?: Partial<UserPermissions> }) => Promise<{ success: boolean; error?: string }>;
  deleteInstructor: (id: string) => Promise<{ success: boolean; error?: string }>;
  updateInstructorGraduationSystem: (instructorId: string, system: GraduationSystemType) => void;
  
  importAttendance: (records: Omit<AttendanceRecord, 'id'>[]) => number;
  importPayments: (paymentsList: Omit<PaymentRecord, 'id'>[]) => number;
  
  graduateStudent: (
    studentId: string, 
    novaFaixa: BeltColor, 
    novosGraus: number, 
    professorAvaliador: string, 
    observacao: string
  ) => Promise<{ success: boolean; error?: string }>;
  
  addLessonPlan: (plan: Omit<LessonPlan, 'id'>) => Promise<{ success: boolean; error?: string }>;
  updateLessonPlan: (id: string, plan: Partial<LessonPlan>) => Promise<{ success: boolean; error?: string }>;
  toggleLessonPlanDone: (id: string) => void;
  
  addTechnique: (technique: Omit<Technique, 'id'>) => Promise<{ success: boolean; error?: string }>;
  importTechniques: (techniquesList: Omit<Technique, 'id'>[]) => number;
  updateTechnique: (id: string, technique: Partial<Technique>) => Promise<{ success: boolean; error?: string }>;
  deleteTechnique: (id: string) => Promise<{ success: boolean; error?: string }>;
  
  addLearnedTechnique: (studentId: string, technique: Omit<LearnedTechnique, 'id'>) => void;
  removeLearnedTechnique: (studentId: string, learnedTechniqueId: string) => void;
  
  markPaymentPaid: (paymentId: string, metodo?: 'PIX' | 'Dinheiro' | 'Cartão de Crédito' | 'Boleto' | 'Isento Social') => Promise<void>;
  addPaymentRecord: (payment: Omit<PaymentRecord, 'id'>) => Promise<void>;
  refreshPaymentsFromSupabase: () => Promise<PaymentRecord[]>;
  
  sendNotification: (item: Omit<NotificationItem, 'id' | 'dataHora' | 'statusEnvio'>) => void;
  resendNotification: (id: string) => void;
  
  addProduct: (product: Omit<AcademyProduct, 'id'>) => void;
  updateProduct: (id: string, updated: Partial<AcademyProduct>) => void;
  deleteProduct: (id: string) => void;
  updateProductStock: (id: string, delta: number) => void;

  addEvent: (event: Omit<AcademyEvent, 'id' | 'participantesIds'>) => void;
  updateEvent: (id: string, updated: Partial<AcademyEvent>) => void;
  deleteEvent: (id: string) => void;
  toggleEnrollEvent: (eventId: string, studentId: string) => void;
  addPurchase: (produtoId: string, studentId: string) => void;
  
  // Avaliação de Desenvolvimento Histórica
  addStudentEvaluation: (evalData: Omit<StudentEvaluation, 'id' | 'createdAt' | 'updatedAt'>) => Promise<StudentEvaluation>;
  updateStudentEvaluation: (id: string, evalData: Partial<Omit<StudentEvaluation, 'id' | 'studentId' | 'createdAt'>>) => Promise<void>;
  deleteStudentEvaluation: (id: string) => Promise<void>;
  getStudentEvaluations: (studentId: string) => StudentEvaluation[];

  resetDataToDefault: () => void;
}

const BjjContext = createContext<BjjContextType | undefined>(undefined);

const STORAGE_PREFIX = 'ternatio_bjj_';
const EMPTY_AUTH_USER: AuthUser = { id: '', nome: '', email: '', role: 'aluno' };

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error loading ${key} from storage:`, e);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

export const BjjProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<AuthUser[]>(() => {
    const saved = loadFromStorage<AuthUser | null>('auth_user', null);
    if (saved && saved.email && (saved.status === 'aprovado' || saved.status === 'ativo')) return [saved];
    return [];
  });
  const [currentUser, setCurrentUser] = useState<AuthUser>(() => {
    const saved = loadFromStorage<AuthUser | null>('auth_user', null);
    if (saved && saved.email && (saved.status === 'aprovado' || saved.status === 'ativo')) return saved;
    return EMPTY_AUTH_USER;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = loadFromStorage<AuthUser | null>('auth_user', null);
    return Boolean(saved && saved.email && (saved.status === 'aprovado' || saved.status === 'ativo'));
  });
  const [authError, setAuthError] = useState<string | null>(null);
  const [pendingUsers, setPendingUsers] = useState<AuthUser[]>([]);

  const [theme, setThemeState] = useState<AppTheme>(() => {
    try {
      const stored = localStorage.getItem('ternatio_bjj_theme');
      if (stored === 'dark' || stored === 'light' || stored === 'colorful' || stored === 'padrao') {
        return stored as AppTheme;
      }
    } catch {}
    return 'dark';
  });

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('ternatio_bjj_theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    } catch {}
  };

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
    } catch {}
  }, [theme]);

  const [students, setStudents] = useState<Student[]>(() => loadFromStorage('students', INITIAL_STUDENTS));
  const [instructors, setInstructors] = useState<Instructor[]>(() => {
    const loaded = loadFromStorage<Instructor[]>('instructors', INITIAL_INSTRUCTORS);
    const thiagoInst = INITIAL_INSTRUCTORS[0];
    if (!loaded.some(i => i.id === 'inst-thiago' || i.email === 'thiagomoraes.mail@gmail.com')) {
      return [thiagoInst, ...loaded];
    }
    return loaded;
  });

  const [classes, setClasses] = useState<ClassSchedule[]>(() => {
    const loaded = loadFromStorage<ClassSchedule[]>('classes', INITIAL_CLASSES);
    const thiagoClass = INITIAL_CLASSES.find(c => c.id === 'turma-sabado-thiago');
    if (thiagoClass && !loaded.some(c => c.id === 'turma-sabado-thiago')) {
      return [...loaded, thiagoClass];
    }
    return loaded;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => loadFromStorage('attendance', INITIAL_ATTENDANCE));
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>(() => loadFromStorage('lessonPlans', INITIAL_LESSON_PLANS));
  const [techniques, setTechniques] = useState<Technique[]>(() => loadFromStorage('techniques', INITIAL_TECHNIQUES));
  const [graduations, setGraduations] = useState<GraduationHistory[]>(() => loadFromStorage('graduations', INITIAL_GRADUATIONS));
  const [payments, setPayments] = useState<PaymentRecord[]>(() => loadFromStorage('payments', INITIAL_PAYMENTS));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadFromStorage('notifications', INITIAL_NOTIFICATIONS));
  const [products, setProducts] = useState<AcademyProduct[]>(() => loadFromStorage('products', INITIAL_PRODUCTS));
  const [events, setEvents] = useState<AcademyEvent[]>(() => loadFromStorage('events', INITIAL_EVENTS));
  const [purchases, setPurchases] = useState<StudentPurchase[]>(() => loadFromStorage('purchases', INITIAL_PURCHASES));
  const [evaluations, setEvaluations] = useState<StudentEvaluation[]>(() => loadFromStorage<StudentEvaluation[]>('evaluations', []));
  const [academySettings, setAcademySettings] = useState<AcademySettings>(() => {
    const loaded = loadFromStorage('academySettings', DEFAULT_ACADEMY_SETTINGS);
    const effectiveNome = (!loaded?.nomeAcademia || loaded.nomeAcademia === 'BJJ Flow Academy' || loaded.nomeAcademia === 'BJJ Flow') 
      ? 'Mikalkenas Jiu Jitsu' 
      : loaded.nomeAcademia;
    return {
      ...DEFAULT_ACADEMY_SETTINGS,
      ...loaded,
      nomeAcademia: effectiveNome,
      email: (!loaded?.email || loaded.email === 'contato@bjjflow.com.br') ? 'professormikalkenasbjj@gmail.com' : loaded.email,
      chavePix: (!loaded?.chavePix || loaded.chavePix === 'pix@bjjflow.com.br') ? 'professormikalkenasbjj@gmail.com' : loaded.chavePix,
      regrasGraduacao: {
        ...DEFAULT_IBJJF_BELT_RULES,
        ...(loaded?.regrasGraduacao || {})
      },
      supabaseConfig: loaded?.supabaseConfig || DEFAULT_ACADEMY_SETTINGS.supabaseConfig
    };
  });

  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(() => {
    const loaded = loadFromStorage<AcademySettings>('academySettings', DEFAULT_ACADEMY_SETTINGS);
    const cfg = loaded?.supabaseConfig;
    if (cfg && cfg.url && cfg.anonKey) {
      return {
        ...DEFAULT_SUPABASE_CONFIG,
        ...cfg,
        enabled: true
      };
    }
    return DEFAULT_SUPABASE_CONFIG;
  });

  useEffect(() => {
    const savedUser = loadFromStorage<AuthUser | null>('auth_user', null);
    if (savedUser && savedUser.email && (savedUser.status === 'aprovado' || savedUser.status === 'ativo')) {
      setCurrentUser(savedUser);
      setAllUsers(prev => prev.some(u => u.email.toLowerCase() === savedUser.email.toLowerCase()) ? prev : [savedUser, ...prev]);
      setIsAuthenticated(true);
    } else {
      setCurrentUser(EMPTY_AUTH_USER);
      setIsAuthenticated(false);
    }
    setAuthError(null);

    const token = localStorage.getItem('ternatio_bjj_auth_token') || localStorage.getItem('bjjflow_token');
    if (!token) {
      setCurrentUser(EMPTY_AUTH_USER);
      setIsAuthenticated(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const resp = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (cancelled) return;

        if (!resp.ok) {
          // Sessão inválida, expirada ou revogada no servidor
          console.warn('[AUTH] Sessão rejeitada pelo servidor. Limpando credenciais locais.');
          setCurrentUser(EMPTY_AUTH_USER);
          setIsAuthenticated(false);
          try {
            localStorage.removeItem(STORAGE_PREFIX + 'auth_user');
            localStorage.removeItem('ternatio_bjj_auth_token');
            localStorage.removeItem('bjjflow_token');
          } catch {}
          return;
        }

        const data = await safeParseJsonResponse(resp);
        if (data && data.success && data.user) {
          const verifiedUser: AuthUser = mapServerUserToAuthUser(data.user);
          setCurrentUser(verifiedUser);
          setIsAuthenticated(true);
          saveToStorage('auth_user', verifiedUser);
        }
      } catch (err: any) {
        if (!cancelled) console.warn('[AUTH] Erro ao validar sessão via /api/auth/me:', err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [supabaseConfig.enabled, supabaseConfig.url, supabaseConfig.anonKey]);

  // Auto-sync remote instructors, students, all users and reconcile approved users
  useEffect(() => {
    if (!supabaseConfig.url || !supabaseConfig.anonKey) return;
    const client = getSupabaseClient(supabaseConfig);
    if (!client) return;

    let cancelled = false;
    (async () => {
      try {
        const [remoteInsts, remoteStudents, remoteUsersRes] = await Promise.all([
          fetchInstructorsFromSupabase(client),
          fetchStudentsFromSupabase(client),
          fetchUsersFromSupabase(client)
        ]);

        if (cancelled) return;

        if (remoteInsts && remoteInsts.length > 0) {
          setInstructors(prev => {
            const merged = [...prev];
            remoteInsts.forEach(ri => {
              const idx = merged.findIndex(i => i.id === ri.id || (i.email && ri.email && i.email.toLowerCase() === ri.email.toLowerCase()));
              if (idx >= 0) {
                merged[idx] = { ...merged[idx], ...ri };
              } else {
                merged.push(ri);
              }
            });
            return merged;
          });
        }

        if (remoteStudents && remoteStudents.length > 0) {
          setStudents(prev => {
            const merged = [...prev];
            remoteStudents.forEach(rs => {
              const idx = merged.findIndex(s => s.id === rs.id || (s.email && rs.email && s.email.toLowerCase() === rs.email.toLowerCase()));
              if (idx >= 0) {
                merged[idx] = { ...merged[idx], ...rs };
              } else {
                merged.push(rs);
              }
            });
            return merged;
          });
        }

        if (remoteUsersRes && remoteUsersRes.success && remoteUsersRes.users && remoteUsersRes.users.length > 0) {
          setAllUsers(remoteUsersRes.users);
        }

        // Se usuário logado for administrador, executa reconciliação idempotente via backend
        const token = localStorage.getItem('ternatio_bjj_auth_token') || localStorage.getItem('bjjflow_token');
        const savedAuth = loadFromStorage<AuthUser | null>('auth_user', null);
        if (token && savedAuth && savedAuth.role === 'admin') {
          await reconcileAllApprovedUsers(client);
        }
      } catch (err) {
        console.warn('Erro ao carregar dados remotos do Supabase na inicialização:', err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [supabaseConfig.url, supabaseConfig.anonKey]);


  const updateSupabaseConfig = (partial: Partial<SupabaseConfig>) => {
    setSupabaseConfig(prev => {
      const next = { ...prev, ...partial };
      setAcademySettings(curr => ({
        ...curr,
        supabaseConfig: next
      }));
      return next;
    });
  };

  const syncDataWithSupabase = async () => {
    if (!supabaseConfig.url || !supabaseConfig.anonKey) {
      return { 
        success: false, 
        errors: ['Credenciais do Supabase não configuradas no sistema. Acesse Configurações > Banco de Dados.'] 
      };
    }

    const key = supabaseConfig.anonKey.trim();

    // Proteção contra bloqueio do navegador pelo Supabase
    if (isSecretApiKey(key)) {
      return {
        success: false,
        errors: [
          'A chave configurada é uma Chave Secreta ("service_role").',
          'O Supabase bloqueia o uso de chaves secretas no navegador ("Forbidden use of secret API key in browser").',
          'Solução: No painel do Supabase, vá em Project Settings > API e copie a Chave Pública ("anon / publishable"). Salve-a no campo Chave Pública (anon key).'
        ]
      };
    }

    if (!isAuthenticated) {
      return { success: false, errors: ['Entre com uma conta autenticada antes de sincronizar os dados.'] };
    }
    const client = getSupabaseClient(supabaseConfig);
    if (!client) {
      return { success: false, errors: ['Não foi possível inicializar a conexão autenticada com o Supabase.'] };
    }

    const res = await exportAllToSupabase(client, {
      students,
      instructors,
      classes,
      attendance,
      graduations,
      payments,
      lessonPlans,
      techniques,
      allUsers,
      academySettings,
      evaluations
    });

    if (res.success) {
      const nowStr = new Date().toLocaleString('pt-BR');
      updateSupabaseConfig({
        lastSync: nowStr,
        lastConnected: nowStr
      });
    }
    return res;
  };

  const pullDataFromSupabaseContext = async () => {
    if (!supabaseConfig.url || !supabaseConfig.anonKey) {
      return { success: false, error: 'Credenciais do Supabase não configuradas no sistema.' };
    }

    const key = supabaseConfig.anonKey.trim();
    if (isSecretApiKey(key)) {
      return { 
        success: false, 
        error: 'Chave secreta detectada. O Supabase exige a chave pública (anon) no navegador.' 
      };
    }

    if (!isAuthenticated) {
      return { success: false, error: 'Entre com uma conta autenticada antes de importar os dados.' };
    }
    const client = getSupabaseClient(supabaseConfig);
    if (!client) {
      return { success: false, error: 'Não foi possível inicializar a conexão autenticada com o Supabase.' };
    }
    const res = await importAllFromSupabase(client);
    if (res.error) {
      return { success: false, error: res.error };
    }

    if (res.students && res.students.length > 0) setStudents(res.students);
    if (res.instructors && res.instructors.length > 0) setInstructors(res.instructors);
    if (res.classes && res.classes.length > 0) setClasses(res.classes);
    if (res.attendance && res.attendance.length > 0) setAttendance(res.attendance);
    if (res.graduations && res.graduations.length > 0) setGraduations(res.graduations);
    if (res.payments && res.payments.length > 0) setPayments(res.payments);
    if (res.lessonPlans && res.lessonPlans.length > 0) setLessonPlans(res.lessonPlans);
    if (res.techniques && res.techniques.length > 0) setTechniques(res.techniques);
    if (res.allUsers && res.allUsers.length > 0) setAllUsers(res.allUsers);
    if (res.evaluations && res.evaluations.length > 0) setEvaluations(res.evaluations);
    if (res.academySettings) {
      setAcademySettings(prev => ({
        ...prev,
        ...res.academySettings
      }));
    }

    const nowStr = new Date().toLocaleString('pt-BR');
    updateSupabaseConfig({
      lastSync: nowStr,
      lastConnected: nowStr
    });

    return { success: true };
  };

  // Sync to localStorage
  useEffect(() => saveToStorage('students', students), [students]);
  useEffect(() => saveToStorage('instructors', instructors), [instructors]);
  useEffect(() => saveToStorage('classes', classes), [classes]);
  useEffect(() => saveToStorage('attendance', attendance), [attendance]);
  useEffect(() => saveToStorage('lessonPlans', lessonPlans), [lessonPlans]);
  useEffect(() => saveToStorage('techniques', techniques), [techniques]);
  useEffect(() => saveToStorage('graduations', graduations), [graduations]);
  useEffect(() => saveToStorage('payments', payments), [payments]);
  useEffect(() => saveToStorage('notifications', notifications), [notifications]);
  useEffect(() => saveToStorage('products', products), [products]);
  useEffect(() => saveToStorage('events', events), [events]);
  useEffect(() => saveToStorage('purchases', purchases), [purchases]);
  useEffect(() => saveToStorage('evaluations', evaluations), [evaluations]);
  useEffect(() => saveToStorage('academySettings', academySettings), [academySettings]);

  const loginWithEmailAndPassword = async (email: string, password: string): Promise<{ success: boolean; message: string; user?: AuthUser }> => {
    const cleanEmail = email.trim().toLowerCase();
    setAuthError(null);

    if (!supabaseConfig.url || !supabaseConfig.anonKey) {
      return { success: false, message: 'Configure a URL e a chave pública (anon) do Supabase antes de fazer login.' };
    }

    const client = getSupabaseClient(supabaseConfig);
    if (!client) {
      return { success: false, message: 'Não foi possível inicializar o cliente Supabase. Verifique a configuração.' };
    }

    const result = await authenticateUserWithSupabase(client, cleanEmail, password);
    if (!result.success || !result.user) {
      return { success: false, message: result.message };
    }

    if (result.token) {
      try {
        localStorage.setItem('ternatio_bjj_auth_token', result.token);
      } catch {}
    }

    setAllUsers([result.user]);
    setCurrentUser(result.user);
    setIsAuthenticated(true);
    saveToStorage('auth_user', result.user);
    return result;
  };

  const loadPendingUsers = async (statusFilter?: string): Promise<AuthUser[]> => {
    if (!supabaseConfig.url || !supabaseConfig.anonKey) return [];
    const client = getSupabaseClient(supabaseConfig);
    if (!client) return [];

    const res = await fetchUsersFromSupabase(client, statusFilter);
    if (res.success && res.users) {
      setPendingUsers(res.users);
      return res.users;
    }
    return [];
  };

  const approveUser = async (userId: string): Promise<{ success: boolean; error?: string }> => {
    if (!supabaseConfig.url || !supabaseConfig.anonKey) {
      return { success: false, error: 'Supabase não configurado.' };
    }
    const client = getSupabaseClient(supabaseConfig);
    if (!client) {
      return { success: false, error: 'Falha ao inicializar Supabase.' };
    }

    const res = await approveUserInSupabase(client, userId);
    if (!res.success) {
      return { success: false, error: res.error || 'Erro ao aprovar cadastro.' };
    }

    if (res.instructor) {
      const inst = res.instructor;
      setInstructors(prev => {
        const idx = prev.findIndex(i => i.id === inst.id || (i.email && inst.email && i.email.toLowerCase() === inst.email.toLowerCase()));
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], ...inst };
          return updated;
        }
        return [inst, ...prev];
      });
    }

    if (res.student) {
      const st = res.student;
      setStudents(prev => {
        const idx = prev.findIndex(s => s.id === st.id || (s.email && st.email && s.email.toLowerCase() === st.email.toLowerCase()));
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], ...st };
          return updated;
        }
        return [st, ...prev];
      });
    }

    setPendingUsers(prev => prev.map(u => u.id === userId ? { 
      ...u, 
      status: 'aprovado', 
      professorId: res.updatedUser?.professorId || u.professorId, 
      studentId: res.updatedUser?.studentId || u.studentId 
    } : u));
    
    if (res.updatedUser) {
      const upd = res.updatedUser;
      setAllUsers(prev => {
        const exists = prev.some(u => u.id === upd.id);
        return exists ? prev.map(u => u.id === upd.id ? { ...u, ...upd } : u) : [upd, ...prev];
      });
    }

    return { success: true };
  };

  const rejectUser = async (userId: string): Promise<{ success: boolean; error?: string }> => {
    if (!supabaseConfig.url || !supabaseConfig.anonKey) {
      return { success: false, error: 'Supabase não configurado.' };
    }
    const client = getSupabaseClient(supabaseConfig);
    if (!client) {
      return { success: false, error: 'Falha ao inicializar Supabase.' };
    }

    const res = await updateUserStatusInSupabase(client, userId, 'reprovado');
    if (!res.success) {
      return res;
    }

    setPendingUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'reprovado' } : u));
    return { success: true };
  };

  const registerUser = async (regData: UserRegistrationData): Promise<{ success: boolean; message: string; userId?: string }> => {
    if (!supabaseConfig.url || !supabaseConfig.anonKey) {
      return { success: false, message: 'Supabase não configurado. Salve as credenciais do Supabase primeiro.' };
    }
    const client = getSupabaseClient(supabaseConfig);
    if (!client) {
      return { success: false, message: 'Falha ao inicializar cliente Supabase.' };
    }

    return registerNewUserInSupabase(client, regData);
  };

  const updateUser = (userId: string, partialUser: Partial<AuthUser>) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = { ...u, ...partialUser };
        if (currentUser.id === userId) {
          setCurrentUser(updated);
        }
        return updated;
      }
      return u;
    }));
  };

  const updateUserPermissions = (userId: string, permissions: Partial<UserPermissions>) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const base = u.permissions || (
          u.isMasterAdmin ? DEFAULT_MASTER_PERMISSIONS :
          u.role === 'admin' ? DEFAULT_ADMIN_PERMISSIONS :
          u.role === 'professor' ? DEFAULT_PROFESSOR_PERMISSIONS :
          DEFAULT_STUDENT_PERMISSIONS
        );
        const updatedPerms: UserPermissions = {
          ...base,
          ...permissions
        };
        const updated = { ...u, permissions: updatedPerms };
        if (currentUser.id === userId) {
          setCurrentUser(updated);
        }
        return updated;
      }
      return u;
    }));
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    let defaultPerms = DEFAULT_STUDENT_PERMISSIONS;
    if (newRole === 'admin') defaultPerms = DEFAULT_ADMIN_PERMISSIONS;
    if (newRole === 'professor') defaultPerms = DEFAULT_PROFESSOR_PERMISSIONS;

    setAllUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = {
          ...u,
          role: newRole,
          isMasterAdmin: false, // a API nunca concede master; só por SQL manual
          permissions: { ...defaultPerms, ...(u.permissions || {}) }
        };
        if (currentUser.id === userId) {
          setCurrentUser(updated);
          saveToStorage('auth_user', updated);
        }
        return updated;
      }
      return u;
    }));

    if (supabaseConfig.url && supabaseConfig.anonKey) {
      const client = getSupabaseClient(supabaseConfig);
      if (client) {
        await updateUserRoleInSupabase(client, {
          userId,
          role: newRole,
          permissions: defaultPerms
        });
      }
    }
  };

  const changeCurrentUserPassword = async (
    currentPassword: string, 
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!currentUser.email) {
      return { success: false, message: 'Nenhum usuário conectado.' };
    }
    if (!supabaseConfig.url || !supabaseConfig.anonKey) {
      return { success: false, message: 'Supabase não configurado.' };
    }
    const client = getSupabaseClient(supabaseConfig);
    if (!client) {
      return { success: false, message: 'Falha ao inicializar Supabase.' };
    }

    const result = await changeUserPasswordInSupabase(
      client,
      currentUser.id,
      currentUser.email,
      currentPassword,
      newPassword
    );
    if (result.success && currentUser.mustChangePassword) {
      const cleared: AuthUser = { ...currentUser, mustChangePassword: false };
      setCurrentUser(cleared);
      saveToStorage('auth_user', cleared);
    }
    return result;
  };

  const requestPasswordReset = async (
    email: string
  ): Promise<{ success: boolean; message: string; userFound?: boolean }> => {
    if (!supabaseConfig.url || !supabaseConfig.anonKey) {
      return { success: false, message: 'Supabase não configurado.' };
    }
    const client = getSupabaseClient(supabaseConfig);
    if (!client) {
      return { success: false, message: 'Falha ao inicializar Supabase.' };
    }

    return requestPasswordResetInSupabase(client, email);
  };

  const addUser = (userData: Omit<AuthUser, 'id'>): AuthUser => {
    const newId = 'user-' + Date.now();
    let defaultPerms = DEFAULT_STUDENT_PERMISSIONS;
    if (userData.role === 'admin') defaultPerms = DEFAULT_ADMIN_PERMISSIONS;
    if (userData.role === 'professor') defaultPerms = DEFAULT_PROFESSOR_PERMISSIONS;

    const newUser: AuthUser = {
      ...userData,
      id: newId,
      permissions: userData.permissions || defaultPerms,
      status: userData.status || 'ativo'
    };

    setAllUsers(prev => [newUser, ...prev]);
    return newUser;
  };

  const deleteUser = (userId: string): boolean => {
    const target = allUsers.find(u => u.id === userId);
    if (target?.isMasterAdmin && currentUser.id !== userId) {
      return false; // Protected
    }
    setAllUsers(prev => prev.filter(u => u.id !== userId));
    return true;
  };

  const hasPermission = (permission: keyof UserPermissions): boolean => {
    if (currentUser.role === 'admin' && currentUser.isMasterAdmin) return true;
    if (currentUser.permissions && currentUser.permissions[permission] !== undefined) {
      return !!currentUser.permissions[permission];
    }
    if (currentUser.role === 'admin') return true;
    return false;
  };

  const logout = async (): Promise<void> => {
    try {
      localStorage.removeItem(STORAGE_PREFIX + 'auth_user');
      localStorage.removeItem('ternatio_bjj_auth_token');
    } catch {}
    setIsAuthenticated(false);
    setAllUsers([]);
    setCurrentUser(EMPTY_AUTH_USER);

    const client = getSupabaseClient(supabaseConfig);
    if (client) {
      try {
        await client.auth.signOut();
      } catch (err) {
        console.warn('Erro ao deslogar do Supabase:', err);
      }
    }
  };

  // Event actions
  const addEvent = (eventData: Omit<AcademyEvent, 'id' | 'participantesIds'>) => {
    const newEvt: AcademyEvent = {
      ...eventData,
      id: 'evt-' + Date.now(),
      participantesIds: []
    };
    setEvents(prev => [newEvt, ...prev]);
  };

  const updateEvent = (id: string, updated: Partial<AcademyEvent>) => {
    setEvents(prev => prev.map(evt => evt.id === id ? { ...evt, ...updated } : evt));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(evt => evt.id !== id));
  };

  const toggleEnrollEvent = (eventId: string, studentId: string) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        const isEnrolled = evt.participantesIds.includes(studentId);
        return {
          ...evt,
          participantesIds: isEnrolled 
            ? evt.participantesIds.filter(id => id !== studentId)
            : [...evt.participantesIds, studentId]
        };
      }
      return evt;
    }));
  };

  // Purchase actions
  const addPurchase = (produtoId: string, studentId: string) => {
    const prod = products.find(p => p.id === produtoId);
    const st = students.find(s => s.id === studentId);
    if (!prod || !st) return;

    const newPur: StudentPurchase = {
      id: 'pur-' + Date.now(),
      studentId: st.id,
      studentNome: st.nome,
      produtoId: prod.id,
      produtoNome: prod.nome,
      preco: prod.preco,
      data: new Date().toISOString().split('T')[0],
      status: 'pago',
      professorId: st.professorId
    };
    setPurchases(prev => [newPur, ...prev]);
    updateProductStock(prod.id, -1);
  };

  // Helper to extract taught techniques from a lesson plan
  const extractTechniquesFromPlan = (plan: LessonPlan, allTechniques: Technique[]): Array<{ techniqueId?: string; titulo: string; categoria: string }> => {
    const result: Array<{ techniqueId?: string; titulo: string; categoria: string }> = [];
    const addedTitles = new Set<string>();

    if (plan.techniqueIds && plan.techniqueIds.length > 0) {
      plan.techniqueIds.forEach(id => {
        const tech = allTechniques.find(t => t.id === id);
        if (tech && !addedTitles.has(tech.titulo.toLowerCase())) {
          addedTitles.add(tech.titulo.toLowerCase());
          result.push({
            techniqueId: tech.id,
            titulo: tech.titulo,
            categoria: tech.categoria
          });
        }
      });
    }

    if (plan.tecnicasNomes && plan.tecnicasNomes.length > 0) {
      plan.tecnicasNomes.forEach(nome => {
        if (!addedTitles.has(nome.toLowerCase())) {
          addedTitles.add(nome.toLowerCase());
          const tech = allTechniques.find(t => t.titulo.toLowerCase() === nome.toLowerCase());
          result.push({
            techniqueId: tech?.id,
            titulo: nome,
            categoria: tech?.categoria || 'Fundamento'
          });
        }
      });
    }

    if (result.length === 0 && plan.tecnicaPrincipal) {
      const tecPrinc = plan.tecnicaPrincipal;
      allTechniques.forEach(tech => {
        if (
          (tecPrinc.toLowerCase().includes(tech.titulo.toLowerCase()) ||
           plan.temaPrincipal.toLowerCase().includes(tech.titulo.toLowerCase())) &&
          !addedTitles.has(tech.titulo.toLowerCase())
        ) {
          addedTitles.add(tech.titulo.toLowerCase());
          result.push({
            techniqueId: tech.id,
            titulo: tech.titulo,
            categoria: tech.categoria
          });
        }
      });

      if (result.length === 0 && tecPrinc.trim()) {
        const cleanTitle = tecPrinc.split(':')[1]?.trim() || tecPrinc.split('.')[0]?.trim() || tecPrinc;
        result.push({
          titulo: cleanTitle.slice(0, 50),
          categoria: 'Posição do Dia'
        });
      }
    }

    return result;
  };

  // Helper to record learned techniques onto student when present in a class
  const recordLearnedTechniquesForStudent = (
    stId: string,
    turmaObj: ClassSchedule,
    dateStr: string
  ) => {
    const plan = lessonPlans.find(lp => 
      lp.data === dateStr && (
        lp.turma === turmaObj.titulo || 
        (lp.turma && turmaObj.titulo.toLowerCase().includes(lp.turma.toLowerCase())) || 
        (lp.turma && lp.turma.toLowerCase().includes(turmaObj.titulo.toLowerCase())) ||
        lp.turmaId === turmaObj.id
      )
    ) || lessonPlans.find(lp => lp.data === dateStr);

    if (!plan) return;

    const techsTaught = extractTechniquesFromPlan(plan, techniques);
    if (techsTaught.length === 0) return;

    setStudents(prevStudents => prevStudents.map(s => {
      if (s.id !== stId) return s;

      const existingLearned = s.tecnicasAprendidas || [];
      const newItems: LearnedTechnique[] = [];

      techsTaught.forEach(t => {
        const alreadyHas = existingLearned.some(el => 
          (el.techniqueId && el.techniqueId === t.techniqueId) ||
          (el.titulo.toLowerCase() === t.titulo.toLowerCase() && el.dataAprendida === dateStr)
        );

        if (!alreadyHas) {
          newItems.push({
            id: 'lrn-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
            techniqueId: t.techniqueId,
            titulo: t.titulo,
            categoria: t.categoria,
            dataAprendida: dateStr,
            aulaTitulo: plan.temaPrincipal || turmaObj.titulo,
            turmaNome: turmaObj.titulo,
            professorNome: plan.professor || turmaObj.professorNome
          });
        }
      });

      if (newItems.length === 0) return s;
      return {
        ...s,
        tecnicasAprendidas: [...newItems, ...existingLearned]
      };
    }));
  };

  // Attendance logic
  const checkInStudentToday = async (studentId: string, turmaId: string): Promise<{ success: boolean; error?: string }> => {
    const todayStr = new Date().toISOString().split('T')[0];
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    return addAttendance(studentId, turmaId, todayStr, timeStr);
  };

  const addAttendance = async (studentId: string, classId: string, date?: string, time?: string): Promise<{ success: boolean; error?: string }> => {
    const student = students.find(s => s.id === studentId);
    const turma = classes.find(c => c.id === classId) || {
      id: classId || 'turma-geral',
      titulo: 'Turma Geral',
      professorNome: academySettings.mestreResponsavel || 'Mestre Responsável'
    };
    if (!student) return { success: false, error: 'Aluno não encontrado.' };

    const dateStr = date || new Date().toISOString().split('T')[0];
    const timeStr = time || '19:30';

    const newRecord: AttendanceRecord = {
      id: 'att-' + Date.now(),
      studentId: student.id,
      studentNome: student.nome,
      studentFaixa: student.faixa,
      studentGraus: student.graus,
      turmaId: turma.id,
      turmaTitulo: turma.titulo,
      data: dateStr,
      horario: timeStr,
      confirmadoPor: turma.professorNome
    };

    const authToken = localStorage.getItem('ternatio_bjj_auth_token') || localStorage.getItem('bjjflow_token');
    if (authToken) {
      try {
        const resp = await fetch('/api/attendance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
          },
          body: JSON.stringify({
            student_id: student.id,
            turma_id: turma.id,
            turma_titulo: turma.titulo,
            data: dateStr,
            horario: timeStr
          })
        });

        if (!resp.ok) {
          const errData = await resp.json().catch(() => ({}));
          return { success: false, error: errData.error || 'Erro ao registrar presença no servidor.' };
        }

        const dataRes = await resp.json().catch(() => ({}));
        if (dataRes?.record?.id) {
          newRecord.id = dataRes.record.id;
        }
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    } else if (supabaseConfig.url && supabaseConfig.anonKey) {
      const client = getSupabaseClient(supabaseConfig);
      if (client) {
        const res = await saveAttendanceToSupabase(client, newRecord);
        if (!res.success) {
          console.error('Erro ao salvar presença no Supabase:', res.error);
          return { success: false, error: res.error };
        }
      }
    }

    setAttendance(prev => [newRecord, ...prev]);
    setStudents(prev => prev.map(s => s.id === studentId ? {
      ...s,
      presencasNaFaixa: s.presencasNaFaixa + 1,
      totalPresencasHistorico: s.totalPresencasHistorico + 1
    } : s));

    // Automatically record techniques taught in that day's class plan
    if ('diaSemana' in turma) {
      recordLearnedTechniquesForStudent(student.id, turma as ClassSchedule, dateStr);
    }
    return { success: true };
  };

  const removeAttendance = async (attendanceId: string): Promise<{ success: boolean; error?: string }> => {
    const rec = attendance.find(a => a.id === attendanceId);
    if (!rec) return { success: false, error: 'Presença não encontrada.' };

    const authToken = localStorage.getItem('ternatio_bjj_auth_token') || localStorage.getItem('bjjflow_token');
    if (authToken) {
      try {
        const resp = await fetch(`/api/attendance/${attendanceId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${authToken}` }
        });
        if (!resp.ok) {
          const errData = await resp.json().catch(() => ({}));
          return { success: false, error: errData.error || 'Erro ao excluir presença no servidor.' };
        }
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    } else if (supabaseConfig.url && supabaseConfig.anonKey) {
      const client = getSupabaseClient(supabaseConfig);
      if (client) {
        const res = await deleteAttendanceFromSupabase(client, attendanceId);
        if (!res.success) {
          console.error('Erro ao excluir presença no Supabase:', res.error);
          return { success: false, error: res.error };
        }
      }
    }

    setAttendance(prev => prev.filter(a => a.id !== attendanceId));
    setStudents(prev => prev.map(s => {
      if (s.id === rec.studentId) {
        return {
          ...s,
          presencasNaFaixa: Math.max(0, s.presencasNaFaixa - 1),
          totalPresencasHistorico: Math.max(0, s.totalPresencasHistorico - 1)
        };
      }
      return s;
    }));
    return { success: true };
  };

  // Student management
  const addStudent = async (studentData: Omit<Student, 'id' | 'presencasNaFaixa' | 'totalPresencasHistorico' | 'performance'>): Promise<{ success: boolean; error?: string; student?: Student }> => {
    const prof = instructors.find(i => i.id === studentData.professorId || i.nome === studentData.professorNome) || instructors[0];
    const newId = 'aluno-' + Date.now();
    const system = studentData.sistemaGraduacao || prof?.sistemaGraduacao || academySettings.sistemaGraduacaoPadrao || 'graus_e_faixas';
    
    const beltRule = getBeltGraduationRule(studentData.faixa);
    const calculatedMeta = system === 'apenas_faixas' 
      ? beltRule.aulasPorFaixaDireta 
      : ((studentData.graus || 0) < 4 ? ((studentData.graus || 0) + 1) * beltRule.aulasPorGrau : 4 * beltRule.aulasPorGrau);

    const newStudent: Student = {
      ...studentData,
      id: newId,
      professorId: prof?.id,
      professorNome: prof?.nome,
      sistemaGraduacao: system,
      presencasNaFaixa: 0,
      presencasMetaGrau: calculatedMeta,
      totalPresencasHistorico: 0,
      performance: {
        guarda: 6.0,
        passagem: 6.0,
        quedas: 5.5,
        finalizacoes: 5.5,
        defesa: 6.0,
        disciplina: 8.5,
        tempoRolaMinutos: 0,
        finalizacoesAplicadas: 0,
        raspagensFeitas: 0
      }
    };

    // Gravação direta no Supabase com await e tratamento de erro
    if (supabaseConfig.url && supabaseConfig.anonKey) {
      const client = getSupabaseClient(supabaseConfig);
      if (client) {
        const res = await saveStudentToSupabase(client, newStudent);
        if (!res.success) {
          console.error('Erro ao persistir novo aluno no Supabase:', res.error);
          return { success: false, error: res.error };
        }
      }
    }

    setStudents(prev => [newStudent, ...prev]);

    // Also register Auth user so student can login
    const newAuth: AuthUser = {
      id: 'user-' + newId,
      nome: newStudent.nome,
      email: newStudent.email,
      role: 'aluno',
      studentId: newId,
      professorId: prof?.id,
      faixa: newStudent.faixa,
      graus: newStudent.graus,
      status: 'ativo'
    };
    setAllUsers(prev => [...prev, newAuth]);

    // Also create initial payment record linked to the student's responsible instructor
    const newPayment: PaymentRecord = {
      id: 'pay-' + Date.now(),
      studentId: newStudent.id,
      studentNome: newStudent.nome,
      plano: newStudent.plano,
      mesReferencia: 'Outubro/2026',
      valor: newStudent.valorMensalidade,
      valorOriginal: 180,
      desconto: Math.max(0, 180 - newStudent.valorMensalidade),
      dataVencimento: `2026-10-${String(newStudent.diaVencimento || 10).padStart(2, '0')}`,
      status: newStudent.statusPagamento,
      professorId: prof?.id,
      professorNome: prof?.nome,
      chavePixProfessor: prof?.chavePix
    };
    setPayments(prev => [newPayment, ...prev]);

    return { success: true, student: newStudent };
  };

  const importStudents = (studentsList: Omit<Student, 'id' | 'presencasNaFaixa' | 'totalPresencasHistorico' | 'performance'>[]): number => {
    if (!studentsList.length) return 0;
    const now = Date.now();
    const newCreatedStudents: Student[] = [];
    const newCreatedPayments: PaymentRecord[] = [];

    studentsList.forEach((sData, index) => {
      const prof = instructors.find(i => 
        (sData.professorId && i.id === sData.professorId) || 
        (sData.professorNome && i.nome.toLowerCase() === sData.professorNome.toLowerCase())
      ) || instructors[0];

      const stId = `aluno-${now}-${index}`;
      const newStudent: Student = {
        ...sData,
        id: stId,
        professorId: prof?.id,
        professorNome: prof?.nome,
        presencasNaFaixa: 0,
        totalPresencasHistorico: 0,
        performance: {
          guarda: 6.0,
          passagem: 6.0,
          quedas: 5.5,
          finalizacoes: 5.5,
          defesa: 6.0,
          disciplina: 8.5,
          tempoRolaMinutos: 0,
          finalizacoesAplicadas: 0,
          raspagensFeitas: 0
        }
      };

      const newPay: PaymentRecord = {
        id: `pay-${now}-${index}`,
        studentId: stId,
        studentNome: newStudent.nome,
        plano: newStudent.plano,
        mesReferencia: 'Outubro/2026',
        valor: newStudent.valorMensalidade,
        valorOriginal: 180,
        desconto: Math.max(0, 180 - newStudent.valorMensalidade),
        dataVencimento: `2026-10-${String(newStudent.diaVencimento || 10).padStart(2, '0')}`,
        status: newStudent.statusPagamento,
        professorId: prof?.id,
        professorNome: prof?.nome,
        chavePixProfessor: prof?.chavePix
      };

      newCreatedStudents.push(newStudent);
      newCreatedPayments.push(newPay);
    });

    const newAuthUsers: AuthUser[] = newCreatedStudents.map(st => ({
      id: 'user-' + st.id,
      nome: st.nome,
      email: st.email,
      role: 'aluno',
      studentId: st.id,
      professorId: st.professorId,
      faixa: st.faixa,
      graus: st.graus
    }));

    setStudents(prev => [...newCreatedStudents, ...prev]);
    setPayments(prev => [...newCreatedPayments, ...prev]);
    setAllUsers(prev => [...prev, ...newAuthUsers]);
    return newCreatedStudents.length;
  };

  const updateStudent = async (id: string, updated: Partial<Student>): Promise<{ success: boolean; error?: string }> => {
    const existing = students.find(s => s.id === id);
    if (!existing) return { success: false, error: 'Aluno não encontrado.' };

    // Regra de perfil: PROFESSOR só pode editar alunos sob sua tutela explícita
    if (currentUser.role === 'professor') {
      const isUnderTutela = (currentUser.professorId && existing.professorId === currentUser.professorId) ||
        (existing.professorNome && currentUser.nome && existing.professorNome.toLowerCase() === currentUser.nome.toLowerCase());
      
      if (!isUnderTutela) {
        return { success: false, error: 'Acesso negado: você só possui autorização para editar dados de alunos sob sua tutela direta.' };
      }

      // Professor não pode alterar faixa ou graus (graduação é exclusiva de administradores)
      if ((updated.faixa && updated.faixa !== existing.faixa) || (updated.graus !== undefined && updated.graus !== existing.graus)) {
        return { success: false, error: 'Apenas administradores podem alterar a faixa ou graus de alunos.' };
      }

      // Professor não pode alterar a tutela (vínculo de professor)
      if ((updated.professorId && updated.professorId !== existing.professorId) || 
          (updated.professorNome && updated.professorNome !== existing.professorNome)) {
        return { success: false, error: 'Apenas administradores podem reatribuir a tutela (professor responsável) de alunos.' };
      }
    } else if (currentUser.role === 'aluno') {
      return { success: false, error: 'Alunos não possuem autorização para editar o cadastro geral de alunos.' };
    }

    const merged = { ...existing, ...updated };

    if (supabaseConfig.url && supabaseConfig.anonKey) {
      const client = getSupabaseClient(supabaseConfig);
      if (client) {
        const res = await saveStudentToSupabase(client, merged);
        if (!res.success) {
          console.error('Erro ao salvar atualização do aluno no Supabase:', res.error);
          return { success: false, error: res.error };
        }
      }
    }

    // If professor changes, update pending payments
    if (updated.professorId || updated.professorNome) {
      const prof = instructors.find(i => i.id === updated.professorId || i.nome === updated.professorNome);
      if (prof) {
        setPayments(prev => prev.map(p => {
          if (p.studentId === id && (p.status === 'pendente' || p.status === 'atrasado')) {
            return {
              ...p,
              professorId: prof.id,
              professorNome: prof.nome,
              chavePixProfessor: prof.chavePix
            };
          }
          return p;
        }));
      }
    }

    setStudents(prev => prev.map(s => s.id === id ? merged : s));
    return { success: true };
  };

  const deleteStudent = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (currentUser.role !== 'admin') {
      return { success: false, error: 'Apenas administradores possuem autorização para excluir registros de alunos.' };
    }

    if (supabaseConfig.url && supabaseConfig.anonKey) {
      const client = getSupabaseClient(supabaseConfig);
      if (client) {
        const res = await deleteStudentFromSupabase(client, id);
        if (!res.success) {
          console.error('Erro ao excluir aluno no Supabase:', res.error);
          return { success: false, error: res.error };
        }
      }
    }

    setStudents(prev => prev.filter(s => s.id !== id));
    return { success: true };
  };

  const updateStudentGraduationSystem = (studentId: string, system: GraduationSystemType) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          sistemaGraduacao: system,
          presencasMetaGrau: system === 'apenas_faixas' ? (academySettings.aulasPorFaixaDireta || 160) : 40
        };
      }
      return s;
    }));
  };

  // Class Schedules (Turmas & Horários)
  const addClassSchedule = async (classData: Omit<ClassSchedule, 'id'>): Promise<{ success: boolean; error?: string }> => {
    const newClass: ClassSchedule = {
      ...classData,
      id: 'turma-' + Date.now()
    };

    if (supabaseConfig.url && supabaseConfig.anonKey) {
      const client = getSupabaseClient(supabaseConfig);
      if (client) {
        const res = await saveClassScheduleToSupabase(client, newClass);
        if (!res.success) {
          console.error('Erro ao persistir nova turma no Supabase:', res.error);
          return { success: false, error: res.error };
        }
      }
    }

    setClasses(prev => [...prev, newClass]);
    return { success: true };
  };

  const updateClassSchedule = async (id: string, updated: Partial<ClassSchedule>): Promise<{ success: boolean; error?: string }> => {
    const existing = classes.find(c => c.id === id);
    if (!existing) return { success: false, error: 'Turma não encontrada.' };
    const merged = { ...existing, ...updated };

    if (supabaseConfig.url && supabaseConfig.anonKey) {
      const client = getSupabaseClient(supabaseConfig);
      if (client) {
        const res = await saveClassScheduleToSupabase(client, merged);
        if (!res.success) {
          console.error('Erro ao atualizar turma no Supabase:', res.error);
          return { success: false, error: res.error };
        }
      }
    }

    setClasses(prev => prev.map(c => c.id === id ? merged : c));
    return { success: true };
  };

  const deleteClassSchedule = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (supabaseConfig.url && supabaseConfig.anonKey) {
      const client = getSupabaseClient(supabaseConfig);
      if (client) {
        const res = await deleteClassScheduleFromSupabase(client, id);
        if (!res.success) {
          console.error('Erro ao excluir turma no Supabase:', res.error);
          return { success: false, error: res.error };
        }
      }
    }

    setClasses(prev => prev.filter(c => c.id !== id));
    return { success: true };
  };

  const importClasses = (classesList: Omit<ClassSchedule, 'id'>[]): number => {
    if (!classesList.length) return 0;
    const now = Date.now();
    const newClasses: ClassSchedule[] = classesList.map((c, idx) => {
      const matchedProf = instructors.find(i => 
        (c.professorId && i.id === c.professorId) || 
        (c.professorNome && i.nome.toLowerCase().includes(c.professorNome.toLowerCase()))
      ) || instructors[0];

      return {
        ...c,
        id: `turma-${now}-${idx}`,
        professorId: matchedProf ? matchedProf.id : (c.professorId || 'inst-thiago'),
        professorNome: matchedProf ? matchedProf.nome : (c.professorNome || 'Thiago Lopes de Moraes Silva')
      };
    });
    setClasses(prev => [...prev, ...newClasses]);
    return newClasses.length;
  };

  // Instructors
  const addInstructor = async (
    instData: Omit<Instructor, 'id'>,
    accessConfig?: { role?: UserRole; permissions?: Partial<UserPermissions> }
  ): Promise<{ success: boolean; error?: string }> => {
    const newId = 'inst-' + Date.now();
    const targetRole = accessConfig?.role || instData.role || 'professor';
    const basePerms = targetRole === 'admin' ? DEFAULT_ADMIN_PERMISSIONS : DEFAULT_PROFESSOR_PERMISSIONS;
    const targetPerms: UserPermissions = {
      ...basePerms,
      ...(instData.permissions || {}),
      ...(accessConfig?.permissions || {})
    };

    const newInst: Instructor = {
      ...instData,
      id: newId,
      sistemaGraduacao: instData.sistemaGraduacao || academySettings.sistemaGraduacaoPadrao || 'graus_e_faixas',
      role: targetRole,
      permissions: targetPerms
    };

    if (supabaseConfig.url && supabaseConfig.anonKey) {
      const client = getSupabaseClient(supabaseConfig);
      if (client) {
        const res = await saveInstructorToSupabase(client, newInst);
        if (!res.success) {
          console.error('Erro ao salvar professor no Supabase:', res.error);
          return { success: false, error: res.error };
        }
      }
    }

    setInstructors(prev => [...prev, newInst]);
    return { success: true };
  };

  const importInstructors = (instructorsList: Omit<Instructor, 'id'>[]): number => {
    if (!instructorsList.length) return 0;
    const now = Date.now();
    const newInsts: Instructor[] = [];

    instructorsList.forEach((inst, idx) => {
      const id = `inst-${now}-${idx}`;
      const newInst: Instructor = {
        ...inst,
        id,
        sistemaGraduacao: inst.sistemaGraduacao || academySettings.sistemaGraduacaoPadrao || 'graus_e_faixas'
      };
      newInsts.push(newInst);
    });

    setInstructors(prev => [...prev, ...newInsts]);
    return newInsts.length;
  };

  const importAttendance = (records: Omit<AttendanceRecord, 'id'>[]): number => {
    if (!records.length) return 0;
    const now = Date.now();
    const newRecords: AttendanceRecord[] = records.map((r, idx) => ({
      ...r,
      id: `pres-${now}-${idx}`
    }));

    setAttendance(prev => [...newRecords, ...prev]);

    // Update students attendance counters
    const studentCounts: Record<string, number> = {};
    newRecords.forEach(r => {
      if (r.studentId) {
        studentCounts[r.studentId] = (studentCounts[r.studentId] || 0) + 1;
      }
    });

    setStudents(prev => prev.map(s => {
      const added = studentCounts[s.id] || 0;
      if (!added) return s;
      return {
        ...s,
        presencasNaFaixa: s.presencasNaFaixa + added,
        totalPresencasHistorico: s.totalPresencasHistorico + added
      };
    }));

    return newRecords.length;
  };

  const importPayments = (paymentsList: Omit<PaymentRecord, 'id'>[]): number => {
    if (!paymentsList.length) return 0;
    const now = Date.now();
    const newPayments: PaymentRecord[] = paymentsList.map((p, idx) => ({
      ...p,
      id: `pay-${now}-${idx}`
    }));
    setPayments(prev => [...newPayments, ...prev]);
    return newPayments.length;
  };

  const updateInstructor = async (
    id: string, 
    updated: Partial<Instructor>,
    accessConfig?: { role?: UserRole; permissions?: Partial<UserPermissions> }
  ): Promise<{ success: boolean; error?: string }> => {
    const existing = instructors.find(i => i.id === id);
    if (!existing) return { success: false, error: 'Professor não encontrado.' };

    const nextRole: UserRole = accessConfig?.role || updated.role || existing.role || 'professor';
    const basePerms = existing.permissions || (nextRole === 'admin' ? DEFAULT_ADMIN_PERMISSIONS : DEFAULT_PROFESSOR_PERMISSIONS);
    const nextPerms: UserPermissions | undefined = accessConfig?.permissions 
      ? { ...basePerms, ...accessConfig.permissions } 
      : (updated.permissions || existing.permissions);

    const mergedInst: Instructor = {
      ...existing,
      ...updated,
      role: nextRole,
      permissions: nextPerms
    };

    if (supabaseConfig.url && supabaseConfig.anonKey) {
      const client = getSupabaseClient(supabaseConfig);
      if (client) {
        const res = await saveInstructorToSupabase(client, mergedInst);
        if (!res.success) {
          console.error('Erro ao atualizar professor no Supabase:', res.error);
          return { success: false, error: res.error };
        }
      }
    }

    setInstructors(prev => prev.map(i => i.id === id ? mergedInst : i));

    const profEmail = (updated.email || existing.email).toLowerCase().trim();

    // 1. Persistir alteração de perfil e privilégios na tabela 'usuarios' do Supabase
    if (supabaseConfig.url && supabaseConfig.anonKey) {
      const client = getSupabaseClient(supabaseConfig);
      if (client) {
        await updateUserRoleInSupabase(client, {
          email: profEmail,
          professorId: id,
          role: nextRole,
          permissions: nextPerms,
          nome: updated.nome || existing.nome,
          faixa: updated.faixa || existing.faixa,
          graus: updated.graus !== undefined ? Number(updated.graus) : Number(existing.graus || 0),
          telefone: updated.telefone || existing.telefone
        });
      }
    }

    // 2. Atualizar currentUser se o usuário conectado for este professor
    const isCurrentLoggedIn = 
      (currentUser.professorId && currentUser.professorId === id) ||
      (currentUser.email && currentUser.email.toLowerCase().trim() === profEmail);

    if (isCurrentLoggedIn) {
      const updatedCurrent: AuthUser = {
        ...currentUser,
        role: nextRole,
        isMasterAdmin: currentUser.isMasterAdmin === true,
        permissions: nextPerms || (nextRole === 'admin' ? DEFAULT_ADMIN_PERMISSIONS : DEFAULT_PROFESSOR_PERMISSIONS),
        nome: updated.nome || currentUser.nome,
        email: profEmail,
        faixa: updated.faixa || currentUser.faixa,
        graus: updated.graus !== undefined ? Number(updated.graus) : currentUser.graus,
        professorId: id
      };
      setCurrentUser(updatedCurrent);
      saveToStorage('auth_user', updatedCurrent);
    }

    // 3. Atualizar lista allUsers
    setAllUsers(prev => {
      const exists = prev.some(u => 
        (u.professorId && u.professorId === id) || 
        (u.email && u.email.toLowerCase().trim() === profEmail)
      );

      if (exists) {
        return prev.map(u => {
          if ((u.professorId && u.professorId === id) || (u.email && u.email.toLowerCase().trim() === profEmail)) {
            return {
              ...u,
              nome: updated.nome || u.nome,
              email: profEmail,
              faixa: updated.faixa || u.faixa,
              graus: updated.graus !== undefined ? Number(updated.graus) : u.graus,
              role: nextRole,
              isMasterAdmin: u.isMasterAdmin === true,
              permissions: nextPerms || (nextRole === 'admin' ? DEFAULT_ADMIN_PERMISSIONS : DEFAULT_PROFESSOR_PERMISSIONS),
              professorId: id
            };
          }
          return u;
        });
      } else {
        const newUser: AuthUser = {
          id: `user-${id}`,
          nome: updated.nome || existing.nome,
          email: profEmail,
          role: nextRole,
          isMasterAdmin: false,
          permissions: nextPerms || (nextRole === 'admin' ? DEFAULT_ADMIN_PERMISSIONS : DEFAULT_PROFESSOR_PERMISSIONS),
          status: 'ativo',
          professorId: id
        };
        return [newUser, ...prev];
      }
    });

    // Cascade name changes
    if (updated.nome) {
      setStudents(prev => prev.map(s => s.professorId === id ? { ...s, professorNome: updated.nome } : s));
      setClasses(prev => prev.map(c => c.professorId === id ? { ...c, professorNome: updated.nome! } : c));
      setPayments(prev => prev.map(p => p.professorId === id ? { ...p, professorNome: updated.nome, chavePixProfessor: updated.chavePix || p.chavePixProfessor } : p));
    }

    return { success: true };
  };

  const deleteInstructor = async (id: string): Promise<{ success: boolean; error?: string }> => {
    const target = instructors.find(i => i.id === id);
    if (target) {
      const email = (target.email || '').toLowerCase().trim();
      if (email === 'professormikalkenasbjj@gmail.com' || target.nome?.toLowerCase().includes('edson mikalkenas')) {
        return { success: false, error: 'O cadastro do Sensei Edson Mikalkenas é o perfil mestre da academia e não pode ser excluído.' };
      }
    }

    const authToken = localStorage.getItem('ternatio_bjj_auth_token') || localStorage.getItem('bjjflow_token');
    if (authToken) {
      try {
        const resp = await fetch(`/api/instructors/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${authToken}` }
        });
        if (!resp.ok) {
          const errData = await resp.json().catch(() => ({}));
          return { success: false, error: errData.error || 'Erro ao excluir professor no servidor.' };
        }
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    } else if (supabaseConfig.url && supabaseConfig.anonKey) {
      const client = getSupabaseClient(supabaseConfig);
      if (client) {
        const res = await deleteInstructorFromSupabase(client, id);
        if (!res.success) {
          console.error('Erro ao excluir professor no Supabase:', res.error);
          return { success: false, error: res.error };
        }
      }
    }

    setInstructors(prev => prev.filter(i => i.id !== id));
    setAllUsers(prev => prev.filter(u => u.professorId !== id && u.id !== `user-${id}`));

    setStudents(prev => prev.map(s => {
      if (s.professorId === id) {
        return {
          ...s,
          professorId: undefined,
          professorNome: academySettings.mestreResponsavel || 'Mestre Responsável'
        };
      }
      return s;
    }));

    setClasses(prev => prev.map(c => {
      if (c.professorId === id) {
        return {
          ...c,
          professorId: 'inst-1',
          professorNome: academySettings.mestreResponsavel || 'Mestre Responsável'
        };
      }
      return c;
    }));

    return { success: true };
  };

  const updateInstructorGraduationSystem = (instructorId: string, system: GraduationSystemType) => {
    setInstructors(prev => prev.map(i => i.id === instructorId ? { ...i, sistemaGraduacao: system } : i));
    // Cascade to their students
    setStudents(prev => prev.map(s => {
      if (s.professorId === instructorId) {
        return {
          ...s,
          sistemaGraduacao: system,
          presencasMetaGrau: system === 'apenas_faixas' ? (academySettings.aulasPorFaixaDireta || 160) : 40
        };
      }
      return s;
    }));
  };

  // Academy Settings Update
  const updateAcademySettings = (newSettings: Partial<AcademySettings>) => {
    setAcademySettings(prev => {
      const updated = { ...prev, ...newSettings };

      if (newSettings.mestreResponsavel) {
        const newMestre = newSettings.mestreResponsavel;
        const oldMestre = prev.mestreResponsavel;

        setInstructors(prevInst => prevInst.map(inst => {
          if (inst.id === 'inst-1' || inst.nome === oldMestre) {
            return {
              ...inst,
              nome: newMestre,
              faixa: newSettings.faixaMestre || inst.faixa,
              graus: newSettings.grausMestre !== undefined ? newSettings.grausMestre : inst.graus,
              registroCBJJ: newSettings.registroCBJJMestre || inst.registroCBJJ,
              chavePix: newSettings.chavePix || inst.chavePix,
              banco: newSettings.banco || inst.banco
            };
          }
          return inst;
        }));

        setAllUsers(prevUsers => prevUsers.map(u => {
          if (u.role === 'admin' || u.id === 'user-admin' || u.nome === oldMestre) {
            return {
              ...u,
              nome: newMestre,
              faixa: newSettings.faixaMestre || u.faixa,
              graus: newSettings.grausMestre !== undefined ? newSettings.grausMestre : u.graus
            };
          }
          return u;
        }));

        setCurrentUser(curr => {
          if (curr.role === 'admin' || curr.id === 'user-admin' || curr.nome === oldMestre) {
            return {
              ...curr,
              nome: newMestre,
              faixa: newSettings.faixaMestre || curr.faixa,
              graus: newSettings.grausMestre !== undefined ? newSettings.grausMestre : curr.graus
            };
          }
          return curr;
        });

        // Cascade to students assigned to this master
        setStudents(prevSt => prevSt.map(st => {
          if (st.professorId === 'inst-1' || st.professorNome === oldMestre) {
            return { ...st, professorNome: newMestre };
          }
          return st;
        }));

        // Cascade to classes taught by this master
        setClasses(prevCl => prevCl.map(cl => {
          if (cl.professorId === 'inst-1' || cl.professorNome === oldMestre) {
            return { ...cl, professorNome: newMestre };
          }
          return cl;
        }));

        // Cascade to lesson plans
        setLessonPlans(prevLp => prevLp.map(lp => {
          if (lp.professor === oldMestre) {
            return { ...lp, professor: newMestre };
          }
          return lp;
        }));

        // Cascade to events
        setEvents(prevEvt => prevEvt.map(ev => {
          if (ev.organizador === oldMestre || ev.organizador?.includes(oldMestre)) {
            return { ...ev, organizador: ev.organizador.replace(oldMestre, newMestre) };
          }
          return ev;
        }));
      }

      return updated;
    });
  };

  // Belt-specific graduation rules & IBJJF compliance helpers
  const getBeltGraduationRule = (faixa: BeltColor): BeltGraduationRule => {
    return (academySettings.regrasGraduacao && academySettings.regrasGraduacao[faixa])
      || DEFAULT_IBJJF_BELT_RULES[faixa]
      || DEFAULT_IBJJF_BELT_RULES.branca;
  };

  const updateBeltGraduationRule = (faixa: BeltColor, ruleUpdate: Partial<BeltGraduationRule>) => {
    setAcademySettings(prev => {
      const currentRules = prev.regrasGraduacao || DEFAULT_IBJJF_BELT_RULES;
      const currentRule = currentRules[faixa] || DEFAULT_IBJJF_BELT_RULES[faixa] || DEFAULT_IBJJF_BELT_RULES.branca;
      const updatedRules = {
        ...currentRules,
        [faixa]: {
          ...currentRule,
          ...ruleUpdate
        }
      };
      return {
        ...prev,
        regrasGraduacao: updatedRules
      };
    });
  };

  const resetBeltGraduationRulesToIBJJF = () => {
    setAcademySettings(prev => ({
      ...prev,
      regrasGraduacao: { ...DEFAULT_IBJJF_BELT_RULES }
    }));
  };

  const getStudentGraduationStatus = (student: Student): StudentGraduationStatus => {
    const rule = getBeltGraduationRule(student.faixa);
    const system = student.sistemaGraduacao || academySettings.sistemaGraduacaoPadrao || 'graus_e_faixas';
    
    // Determine target classes based on system & current stripes
    let metaAulas: number;
    let proximaAcao: 'grau' | 'faixa' = 'grau';
    let proximaMetaDescricao: string;

    const isInfantil = rule.categoria === 'infantil' || student.plano === 'infantil';
    const beltOrder: Record<BeltColor, BeltColor> = isInfantil ? {
      branca: 'cinza',
      cinza: 'amarela',
      amarela: 'laranja',
      laranja: 'verde',
      verde: 'azul',
      azul: 'roxa',
      roxa: 'marrom',
      marrom: 'preta',
      preta: 'preta'
    } : {
      branca: 'azul',
      cinza: 'azul',
      amarela: 'azul',
      laranja: 'azul',
      verde: 'azul',
      azul: 'roxa',
      roxa: 'marrom',
      marrom: 'preta',
      preta: 'preta'
    };

    const proximaFaixa = beltOrder[student.faixa] || 'azul';

    if (system === 'apenas_faixas') {
      metaAulas = rule.aulasPorFaixaDireta;
      proximaAcao = 'faixa';
      proximaMetaDescricao = `Exame para Faixa ${proximaFaixa.toUpperCase()}`;
    } else {
      if (student.graus < 4) {
        metaAulas = (student.graus + 1) * rule.aulasPorGrau;
        proximaAcao = 'grau';
        proximaMetaDescricao = `${student.graus + 1}º Grau da ${rule.nome}`;
      } else {
        metaAulas = 4 * rule.aulasPorGrau;
        proximaAcao = 'faixa';
        proximaMetaDescricao = `Exame para Faixa ${proximaFaixa.toUpperCase()}`;
      }
    }

    const aulasRestantes = Math.max(0, metaAulas - student.presencasNaFaixa);
    const progressoAulasPct = metaAulas > 0 ? Math.min(100, Math.round((student.presencasNaFaixa / metaAulas) * 100)) : 100;

    // Calculate time elapsed in the belt (in months)
    const refDateStr = student.dataUltimaGraduacao || student.dataInicio || '2024-01-01';
    const refDate = new Date(refDateStr + 'T00:00:00');
    const now = new Date();
    const mesesNaFaixa = Math.max(0, 
      (now.getFullYear() - refDate.getFullYear()) * 12 + (now.getMonth() - refDate.getMonth())
    );

    const tempoMinimoMesesIBJJF = rule.tempoMinimoMesesIBJJF;
    const tempoMinimoCumprido = mesesNaFaixa >= tempoMinimoMesesIBJJF;
    const aptoPorAulas = student.presencasNaFaixa >= metaAulas;
    const aptoTotalIBJJF = aptoPorAulas && (tempoMinimoMesesIBJJF === 0 || tempoMinimoCumprido);

    return {
      rule,
      metaAulas,
      aulasRestantes,
      progressoAulasPct,
      mesesNaFaixa,
      tempoMinimoMesesIBJJF,
      tempoMinimoCumprido,
      aptoPorAulas,
      aptoTotalIBJJF,
      proximaFaixa,
      proximaAcao,
      proximaMetaDescricao
    };
  };

  // Graduation
  const graduateStudent = async (
    studentId: string, 
    novaFaixa: BeltColor, 
    novosGraus: number, 
    professorAvaliador: string, 
    observacao: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (currentUser.role !== 'admin') {
      return { success: false, error: 'Apenas administradores possuem autorização para registrar ou alterar graduações de alunos.' };
    }

    const student = students.find(s => s.id === studentId);
    if (!student) return { success: false, error: 'Aluno não encontrado.' };

    const todayStr = new Date().toISOString().split('T')[0];

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }

    const newGradRecord: GraduationHistory = {
      id: 'grad-' + Date.now(),
      studentId: student.id,
      studentNome: student.nome,
      faixaAnterior: student.faixa,
      grausAnteriores: student.graus,
      novaFaixa,
      novosGraus,
      data: todayStr,
      professorAvaliador,
      totalAulasAtingidas: student.presencasNaFaixa,
      motivoObservacao: observacao || 'Evolução técnica consistente, disciplina nos tatames e cumprimento da carga horária requerida.'
    };

    // Update student belt, stripes and reset presencasNaFaixa if belt changed
    const beltChanged = student.faixa !== novaFaixa;
    const nextRule = getBeltGraduationRule(novaFaixa);
    const system = student.sistemaGraduacao || academySettings.sistemaGraduacaoPadrao || 'graus_e_faixas';
    const newTarget = system === 'apenas_faixas' 
      ? nextRule.aulasPorFaixaDireta 
      : ((novosGraus < 4 ? novosGraus + 1 : 4) * nextRule.aulasPorGrau);

    const updatedStudent: Student = {
      ...student,
      faixa: novaFaixa,
      graus: novosGraus,
      dataUltimaGraduacao: todayStr,
      presencasNaFaixa: beltChanged ? 0 : student.presencasNaFaixa,
      presencasMetaGrau: newTarget
    };

    if (supabaseConfig.url && supabaseConfig.anonKey) {
      const client = getSupabaseClient(supabaseConfig);
      if (client) {
        const resGrad = await saveGraduationToSupabase(client, newGradRecord);
        if (!resGrad.success) {
          console.error('Erro ao salvar graduação no Supabase:', resGrad.error);
          return { success: false, error: resGrad.error };
        }
        await saveStudentToSupabase(client, updatedStudent);
      }
    }

    setGraduations(prev => [newGradRecord, ...prev]);
    setStudents(prev => prev.map(s => s.id === studentId ? updatedStudent : s));

    // Add notification
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      tipo: 'graduacao',
      titulo: `Graduação Confirmada: ${student.nome}`,
      mensagem: `Parabéns ao atleta ${student.nome}! Promovido com honras para a ${novaFaixa.toUpperCase()} (${novosGraus}º Grau) por ${professorAvaliador}. Oss!`,
      destinatario: student.nome,
      telefoneDestinatario: student.telefone,
      dataHora: todayStr + ' ' + new Date().toLocaleTimeString().slice(0, 5),
      statusEnvio: 'enviado',
      canal: 'whatsapp'
    };
    setNotifications(prev => [newNotif, ...prev]);
    return { success: true };
  };

  // Sync plan techniques to students who already have attendance
  const syncPlanWithExistingAttendance = (plan: LessonPlan) => {
    const techsTaught = extractTechniquesFromPlan(plan, techniques);
    if (techsTaught.length === 0) return;

    const attendancesForPlan = attendance.filter(a => 
      a.data === plan.data && (
        a.turmaTitulo === plan.turma ||
        (plan.turma && a.turmaTitulo.toLowerCase().includes(plan.turma.toLowerCase())) ||
        (plan.turma && plan.turma.toLowerCase().includes(a.turmaTitulo.toLowerCase())) ||
        (plan.turmaId && a.turmaId === plan.turmaId)
      )
    );

    if (attendancesForPlan.length === 0) return;
    const presentStudentIds = new Set(attendancesForPlan.map(a => a.studentId));

    setStudents(prevStudents => prevStudents.map(s => {
      if (!presentStudentIds.has(s.id)) return s;

      const existingLearned = s.tecnicasAprendidas || [];
      const newItems: LearnedTechnique[] = [];

      techsTaught.forEach(t => {
        const alreadyHas = existingLearned.some(el => 
          (el.techniqueId && el.techniqueId === t.techniqueId) ||
          (el.titulo.toLowerCase() === t.titulo.toLowerCase() && el.dataAprendida === plan.data)
        );

        if (!alreadyHas) {
          newItems.push({
            id: 'lrn-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
            techniqueId: t.techniqueId,
            titulo: t.titulo,
            categoria: t.categoria,
            dataAprendida: plan.data,
            aulaTitulo: plan.temaPrincipal || plan.turma,
            turmaNome: plan.turma,
            professorNome: plan.professor
          });
        }
      });

      if (newItems.length === 0) return s;
      return {
        ...s,
        tecnicasAprendidas: [...newItems, ...existingLearned]
      };
    }));
  };

  // Lesson Plans
  const addLessonPlan = async (plan: Omit<LessonPlan, 'id'>): Promise<{ success: boolean; error?: string }> => {
    const newPlan: LessonPlan = {
      ...plan,
      id: 'aula-' + Date.now()
    };

    if (supabaseConfig.url && supabaseConfig.anonKey) {
      const client = getSupabaseClient(supabaseConfig);
      if (client) {
        const res = await saveLessonPlanToSupabase(client, newPlan);
        if (!res.success) {
          console.error('Erro ao salvar plano de aula no Supabase:', res.error);
          return { success: false, error: res.error };
        }
      }
    }

    setLessonPlans(prev => [newPlan, ...prev]);
    syncPlanWithExistingAttendance(newPlan);
    return { success: true };
  };

  const updateLessonPlan = async (id: string, updated: Partial<LessonPlan>): Promise<{ success: boolean; error?: string }> => {
    const existing = lessonPlans.find(p => p.id === id);
    if (!existing) return { success: false, error: 'Plano de aula não encontrado.' };
    const fullUpdatedPlan: LessonPlan = { ...existing, ...updated };

    if (supabaseConfig.url && supabaseConfig.anonKey) {
      const client = getSupabaseClient(supabaseConfig);
      if (client) {
        const res = await saveLessonPlanToSupabase(client, fullUpdatedPlan);
        if (!res.success) {
          console.error('Erro ao atualizar plano de aula no Supabase:', res.error);
          return { success: false, error: res.error };
        }
      }
    }

    setLessonPlans(prev => prev.map(p => p.id === id ? fullUpdatedPlan : p));
    syncPlanWithExistingAttendance(fullUpdatedPlan);
    return { success: true };
  };

  const toggleLessonPlanDone = (id: string) => {
    let fullUpdatedPlan: LessonPlan | undefined;
    setLessonPlans(prev => prev.map(p => {
      if (p.id === id) {
        fullUpdatedPlan = { ...p, concluida: !p.concluida };
        return fullUpdatedPlan;
      }
      return p;
    }));

    if (fullUpdatedPlan) {
      syncPlanWithExistingAttendance(fullUpdatedPlan);
      if (supabaseConfig.url && supabaseConfig.anonKey) {
        const client = getSupabaseClient(supabaseConfig);
        if (client) {
          saveLessonPlanToSupabase(client, fullUpdatedPlan);
        }
      }
    }
  };

  // Direct learned techniques management
  const addLearnedTechnique = (studentId: string, item: Omit<LearnedTechnique, 'id'>) => {
    const newItem: LearnedTechnique = {
      ...item,
      id: 'lrn-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6)
    };
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const existing = s.tecnicasAprendidas || [];
        return {
          ...s,
          tecnicasAprendidas: [newItem, ...existing]
        };
      }
      return s;
    }));
  };

  const removeLearnedTechnique = (studentId: string, learnedId: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          tecnicasAprendidas: (s.tecnicasAprendidas || []).filter(t => t.id !== learnedId)
        };
      }
      return s;
    }));
  };

  // Techniques
  const addTechnique = async (technique: Omit<Technique, 'id'>): Promise<{ success: boolean; error?: string }> => {
    const newTec: Technique = {
      ...technique,
      id: 'tec-' + Date.now()
    };

    if (supabaseConfig.url && supabaseConfig.anonKey) {
      const client = getSupabaseClient(supabaseConfig);
      if (client) {
        const res = await saveTechniqueToSupabase(client, newTec);
        if (!res.success) {
          console.error('Erro ao salvar técnica no Supabase:', res.error);
          return { success: false, error: res.error };
        }
      }
    }

    setTechniques(prev => [newTec, ...prev]);
    return { success: true };
  };

  const importTechniques = (techniquesList: Omit<Technique, 'id'>[]): number => {
    if (!techniquesList.length) return 0;
    const now = Date.now();
    const newCreated: Technique[] = techniquesList.map((t, idx) => ({
      ...t,
      id: `tec-${now}-${idx}`
    }));
    setTechniques(prev => [...newCreated, ...prev]);
    return newCreated.length;
  };

  const updateTechnique = async (id: string, updated: Partial<Technique>): Promise<{ success: boolean; error?: string }> => {
    const existing = techniques.find(t => t.id === id);
    if (!existing) return { success: false, error: 'Técnica não encontrada.' };
    const merged: Technique = { ...existing, ...updated };

    if (supabaseConfig.url && supabaseConfig.anonKey) {
      const client = getSupabaseClient(supabaseConfig);
      if (client) {
        const res = await saveTechniqueToSupabase(client, merged);
        if (!res.success) {
          console.error('Erro ao atualizar técnica no Supabase:', res.error);
          return { success: false, error: res.error };
        }
      }
    }

    setTechniques(prev => prev.map(t => t.id === id ? merged : t));
    return { success: true };
  };

  const deleteTechnique = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (supabaseConfig.url && supabaseConfig.anonKey) {
      const client = getSupabaseClient(supabaseConfig);
      if (client) {
        const res = await deleteTechniqueFromSupabase(client, id);
        if (!res.success) {
          console.error('Erro ao excluir técnica no Supabase:', res.error);
          return { success: false, error: res.error };
        }
      }
    }

    setTechniques(prev => prev.filter(t => t.id !== id));
    return { success: true };
  };

  // Payments
  const markPaymentPaid = async (paymentId: string, metodo: 'PIX' | 'Dinheiro' | 'Cartão de Crédito' | 'Boleto' | 'Isento Social' = 'PIX') => {
    const todayStr = new Date().toISOString().split('T')[0];
    const payment = payments.find(p => p.id === paymentId);
    if (payment) {
      const updatedPayment: PaymentRecord = {
        ...payment,
        status: 'em_dia',
        dataPagamento: todayStr,
        metodo
      };
      if (supabaseConfig.enabled) {
        await savePaymentToSupabase(supabaseConfig, updatedPayment);
      }
      setPayments(prev => prev.map(p => p.id === paymentId ? updatedPayment : p));
      setStudents(prev => prev.map(s => s.id === payment.studentId ? { ...s, statusPagamento: 'em_dia' } : s));
    }
  };

  const addPaymentRecord = async (payment: Omit<PaymentRecord, 'id'>) => {
    const newPay: PaymentRecord = {
      ...payment,
      id: `pay-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    };
    if (supabaseConfig.enabled) {
      await savePaymentToSupabase(supabaseConfig, newPay);
    }
    setPayments(prev => [newPay, ...prev]);
  };

  const refreshPaymentsFromSupabase = async () => {
    if (!supabaseConfig.enabled) {
      throw new Error('Ative a integração com Supabase em Configurações > Banco de Dados para carregar os pagamentos.');
    }
    const loadedPayments = await fetchPaymentsFromSupabase(supabaseConfig);
    setPayments(loadedPayments);
    return loadedPayments;
  };

  // Notifications
  const sendNotification = (item: Omit<NotificationItem, 'id' | 'dataHora' | 'statusEnvio'>) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString().slice(0, 5);
    const newNotif: NotificationItem = {
      ...item,
      id: 'notif-' + Date.now(),
      dataHora: `${todayStr} ${timeStr}`,
      statusEnvio: 'enviado'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const resendNotification = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, statusEnvio: 'enviado' } : n));
  };

  // Products
  const addProduct = (product: Omit<AcademyProduct, 'id'>) => {
    const newP: AcademyProduct = {
      ...product,
      id: 'prod-' + Date.now()
    };
    setProducts(prev => [newP, ...prev]);
  };

  const updateProduct = (id: string, updated: Partial<AcademyProduct>) => {
    setProducts(prev => prev.map(product => product.id === id ? { ...product, ...updated } : product));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const updateProductStock = (id: string, delta: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, estoque: Math.max(0, p.estoque + delta) } : p));
  };

  // Avaliação Histórica de Desenvolvimento dos Alunos
  const getStudentEvaluations = (studentId: string): StudentEvaluation[] => {
    return evaluations
      .filter(e => e.studentId === studentId)
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  };

  const addStudentEvaluation = async (
    evalData: Omit<StudentEvaluation, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<StudentEvaluation> => {
    // 1. Verificação de Autorização
    if (currentUser.role === 'aluno') {
      throw new Error('Acesso negado: Alunos não possuem autorização para registrar avaliações técnicas.');
    }

    const targetStudent = students.find(s => s.id === evalData.studentId);
    if (!targetStudent) {
      throw new Error('Aluno não encontrado para vinculação da avaliação.');
    }

    if (currentUser.role === 'professor' && !currentUser.isMasterAdmin) {
      const isMyStudent = targetStudent.professorId === currentUser.professorId ||
        (targetStudent.professorNome && targetStudent.professorNome.toLowerCase() === currentUser.nome.toLowerCase()) ||
        hasPermission('canManageStudents');
      if (!isMyStudent) {
        throw new Error('Acesso negado: Você só pode avaliar alunos sob sua responsabilidade técnica.');
      }
    }

    // 2. Validação rigorosa de notas: 0 a 10 em passos de 0,5
    const dimensions: (keyof DevelopmentScores)[] = ['guarda', 'passagem', 'quedas', 'finalizacoes', 'defesa', 'disciplina'];
    for (const dim of dimensions) {
      const val = evalData.scores[dim];
      if (typeof val !== 'number' || isNaN(val) || val < 0 || val > 10) {
        throw new Error(`Nota inválida para a dimensão "${dim}": deve estar entre 0.0 e 10.0.`);
      }
      if (Math.round(val * 2) !== val * 2) {
        throw new Error(`Nota para a dimensão "${dim}" (${val}) deve respeitar o incremento de 0,5.`);
      }
    }

    if (!evalData.data || !/^\d{4}-\d{2}-\d{2}$/.test(evalData.data)) {
      throw new Error('Data da avaliação inválida (formato esperado: AAAA-MM-DD).');
    }

    const nowIso = new Date().toISOString();
    const newEval: StudentEvaluation = {
      ...evalData,
      id: `eval-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    setEvaluations(prev => [newEval, ...prev]);

    // Sincronização em segundo plano se Supabase estiver ativo
    if (supabaseConfig.enabled && supabaseConfig.autoSync && supabaseConfig.url && supabaseConfig.anonKey) {
      const client = getSupabaseClient(supabaseConfig);
      if (client) {
        client.from('avaliacoes_desenvolvimento').insert({
          id: newEval.id,
          student_id: newEval.studentId,
          data: newEval.data,
          avaliador_id: newEval.avaliadorId || null,
          avaliador_nome: newEval.avaliadorNome || null,
          scores: newEval.scores,
          observacoes: newEval.observacoes || null,
          foco_desenvolvimento: newEval.focoDesenvolvimento || null,
          created_at: newEval.createdAt,
          updated_at: newEval.updatedAt
        }).then(({ error }) => {
          if (error) console.error('Erro ao sincronizar avaliação com Supabase:', error);
        });
      }
    }

    return newEval;
  };

  const updateStudentEvaluation = async (
    id: string,
    evalData: Partial<Omit<StudentEvaluation, 'id' | 'studentId' | 'createdAt'>>
  ): Promise<void> => {
    if (currentUser.role === 'aluno') {
      throw new Error('Acesso negado: Alunos não possuem autorização para editar avaliações.');
    }

    const currentEval = evaluations.find(e => e.id === id);
    if (!currentEval) {
      throw new Error('Avaliação não encontrada.');
    }

    const targetStudent = students.find(s => s.id === currentEval.studentId);
    if (currentUser.role === 'professor' && !currentUser.isMasterAdmin) {
      const isMyStudent = (targetStudent && (
        targetStudent.professorId === currentUser.professorId ||
        (targetStudent.professorNome && targetStudent.professorNome.toLowerCase() === currentUser.nome.toLowerCase())
      )) || hasPermission('canManageStudents');
      if (!isMyStudent) {
        throw new Error('Acesso negado: Você só pode editar avaliações de alunos sob sua responsabilidade técnica.');
      }
    }

    if (evalData.scores) {
      const dimensions: (keyof DevelopmentScores)[] = ['guarda', 'passagem', 'quedas', 'finalizacoes', 'defesa', 'disciplina'];
      for (const dim of dimensions) {
        const val = evalData.scores[dim];
        if (val !== undefined) {
          if (typeof val !== 'number' || isNaN(val) || val < 0 || val > 10) {
            throw new Error(`Nota inválida para a dimensão "${dim}": deve estar entre 0.0 e 10.0.`);
          }
          if (Math.round(val * 2) !== val * 2) {
            throw new Error(`Nota para a dimensão "${dim}" (${val}) deve respeitar o incremento de 0,5.`);
          }
        }
      }
    }

    const nowIso = new Date().toISOString();
    let updatedObj: StudentEvaluation | null = null;
    setEvaluations(prev => prev.map(e => {
      if (e.id === id) {
        updatedObj = {
          ...e,
          ...evalData,
          scores: evalData.scores ? { ...e.scores, ...evalData.scores } : e.scores,
          updatedAt: nowIso
        };
        return updatedObj;
      }
      return e;
    }));

    if (supabaseConfig.enabled && supabaseConfig.autoSync && supabaseConfig.url && supabaseConfig.anonKey && updatedObj) {
      const client = getSupabaseClient(supabaseConfig);
      if (client) {
        const u = updatedObj as StudentEvaluation;
        client.from('avaliacoes_desenvolvimento').update({
          data: u.data,
          avaliador_id: u.avaliadorId || null,
          avaliador_nome: u.avaliadorNome || null,
          scores: u.scores,
          observacoes: u.observacoes || null,
          foco_desenvolvimento: u.focoDesenvolvimento || null,
          updated_at: u.updatedAt
        }).eq('id', id).then(({ error }) => {
          if (error) console.error('Erro ao atualizar avaliação no Supabase:', error);
        });
      }
    }
  };

  const deleteStudentEvaluation = async (id: string): Promise<void> => {
    if (currentUser.role === 'aluno') {
      throw new Error('Acesso negado: Alunos não possuem autorização para excluir avaliações.');
    }

    const currentEval = evaluations.find(e => e.id === id);
    if (!currentEval) return;

    const targetStudent = students.find(s => s.id === currentEval.studentId);
    if (currentUser.role === 'professor' && !currentUser.isMasterAdmin) {
      const isMyStudent = (targetStudent && (
        targetStudent.professorId === currentUser.professorId ||
        (targetStudent.professorNome && targetStudent.professorNome.toLowerCase() === currentUser.nome.toLowerCase())
      )) || hasPermission('canManageStudents');
      if (!isMyStudent) {
        throw new Error('Acesso negado: Você só pode excluir avaliações de alunos sob sua responsabilidade técnica.');
      }
    }

    setEvaluations(prev => prev.filter(e => e.id !== id));

    if (supabaseConfig.enabled && supabaseConfig.autoSync && supabaseConfig.url && supabaseConfig.anonKey) {
      const client = getSupabaseClient(supabaseConfig);
      if (client) {
        client.from('avaliacoes_desenvolvimento').delete().eq('id', id).then(({ error }) => {
          if (error) console.error('Erro ao excluir avaliação no Supabase:', error);
        });
      }
    }
  };

  const resetDataToDefault = () => {
    setStudents(INITIAL_STUDENTS);
    setInstructors(INITIAL_INSTRUCTORS);
    setClasses(INITIAL_CLASSES);
    setAttendance(INITIAL_ATTENDANCE);
    setLessonPlans(INITIAL_LESSON_PLANS);
    setTechniques(INITIAL_TECHNIQUES);
    setGraduations(INITIAL_GRADUATIONS);
    setPayments(INITIAL_PAYMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setProducts(INITIAL_PRODUCTS);
    setEvents(INITIAL_EVENTS);
    setPurchases(INITIAL_PURCHASES);
    setEvaluations([]);
    setAcademySettings(DEFAULT_ACADEMY_SETTINGS);
  };

  return (
    <BjjContext.Provider value={{
      currentUser,
      isAuthenticated,
      authError,
      allUsers,
      pendingUsers,
      loadPendingUsers,
      approveUser,
      rejectUser,
      registerUser,
      loginWithEmailAndPassword,
      changeCurrentUserPassword,
      requestPasswordReset,
      updateUser,
      updateUserPermissions,
      updateUserRole,
      addUser,
      deleteUser,
      hasPermission,
      logout,
      academySettings,
      updateAcademySettings,
      supabaseConfig,
      updateSupabaseConfig,
      syncDataWithSupabase,
      pullDataFromSupabaseContext,
      getBeltGraduationRule,
      updateBeltGraduationRule,
      resetBeltGraduationRulesToIBJJF,
      getStudentGraduationStatus,
      students,
      instructors,
      classes,
      attendance,
      lessonPlans,
      techniques,
      graduations,
      payments,
      notifications,
      products,
      events,
      purchases,
      addAttendance,
      removeAttendance,
      checkInStudentToday,
      addStudent,
      importStudents,
      updateStudent,
      deleteStudent,
      updateStudentGraduationSystem,
      addClassSchedule,
      updateClassSchedule,
      importClasses,
      deleteClassSchedule,
      addInstructor,
      importInstructors,
      updateInstructor,
      deleteInstructor,
      updateInstructorGraduationSystem,
      importAttendance,
      importPayments,
      graduateStudent,
      addLessonPlan,
      updateLessonPlan,
      toggleLessonPlanDone,
      addTechnique,
      importTechniques,
      updateTechnique,
      deleteTechnique,
      addLearnedTechnique,
      removeLearnedTechnique,
      markPaymentPaid,
      addPaymentRecord,
      refreshPaymentsFromSupabase,
      sendNotification,
      resendNotification,
      addProduct,
      updateProduct,
      deleteProduct,
      updateProductStock,
      addEvent,
      updateEvent,
      deleteEvent,
      toggleEnrollEvent,
      addPurchase,
      evaluations,
      addStudentEvaluation,
      updateStudentEvaluation,
      deleteStudentEvaluation,
      getStudentEvaluations,
      resetDataToDefault,
      theme,
      setTheme
    }}>
      {children}
    </BjjContext.Provider>
  );
};

export const useBjj = () => {
  const context = useContext(BjjContext);
  if (!context) {
    throw new Error('useBjj must be used within a BjjProvider');
  }
  return context;
};
