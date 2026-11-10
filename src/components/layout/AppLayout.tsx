import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  ClipboardCheck, 
  ClipboardList, 
  Award, 
  Activity, 
  DollarSign, 
  Bell, 
  BookOpen, 
  Users, 
  UserRound, 
  Package, 
  CalendarDays, 
  ScrollText, 
  Settings, 
  Menu, 
  X, 
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Trophy,
  LogIn,
  LogOut,
  RefreshCw,
  Key,
  UserCheck,
  Building2,
  Clock,
  Layers,
  FilePlus2,
  Calendar,
  Database
} from 'lucide-react';
import { useBjj } from '../../context/BjjContext';
import { BeltBadge } from '../ui/BeltBadge';
import { LoginModal } from '../auth/LoginModal';
import { ChangePasswordModal } from '../auth/ChangePasswordModal';
import { MikalkenasLogo } from '../ui/MikalkenasLogo';
import { ThemeSelector } from '../ui/ThemeSelector';

interface NavSubItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
  highlight?: boolean;
}

interface NavSection {
  id: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavSubItem[];
}

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const { 
    students, 
    payments, 
    notifications, 
    currentUser, 
    academySettings, 
    logout, 
    pendingUsers, 
    loadPendingUsers 
  } = useBjj();

  useEffect(() => {
    if (currentUser.role === 'admin') {
      loadPendingUsers('pendente');
    }
  }, [currentUser.role]);

  // Collapsible state for submenus
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    visao_geral: true,
    cadastros: true,
    tatame: true,
    equipe: true,
    financeiro: true,
    eventos: true,
    sistema: false
  });

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Metrics for badges
  const studentsEligibleForPromotion = students.filter(s => s.presencasNaFaixa >= s.presencasMetaGrau).length;
  const overduePayments = payments.filter(p => p.status === 'atrasado').length;
  const pendingNotifs = notifications.filter(n => n.statusEnvio === 'agendado').length;
  const pendingApprovalsCount = (pendingUsers || []).filter(u => u.status === 'pendente' || !u.status).length;

  // Role-based grouped navigation sections
  const getNavSections = (): NavSection[] => {
    if (currentUser.role === 'aluno') {
      return [
        {
          id: 'meu_portal',
          category: 'Meu Espaço',
          icon: UserRound,
          items: [
            {
              title: "Meu Portal (Área do Aluno)",
              url: "/area-aluno",
              icon: UserRound,
              highlight: true
            }
          ]
        },
        {
          id: 'treino_conhecimento',
          category: 'Treino & Tatame',
          icon: ClipboardCheck,
          items: [
            {
              title: "Minha Presença",
              url: "/presenca",
              icon: ClipboardCheck
            },
            {
              title: "Biblioteca de Técnicas",
              url: "/biblioteca",
              icon: BookOpen
            }
          ]
        },
        {
          id: 'loja',
          category: 'Loja da Academia',
          icon: Package,
          items: [
            {
              title: "Kimonos & Equipamentos",
              url: "/produtos",
              icon: Package
            }
          ]
        },
        {
          id: 'comunicacao',
          category: 'Eventos & Avisos',
          icon: Trophy,
          items: [
            {
              title: "Painel de Eventos",
              url: "/eventos",
              icon: Trophy
            },
            {
              title: "Mural de Avisos",
              url: "/notificacoes",
              icon: Bell
            }
          ]
        }
      ];
    }

    if (currentUser.role === 'professor') {
      return [
        {
          id: 'visao_geral',
          category: 'Visão Geral',
          icon: BarChart3,
          items: [
            {
              title: "Dashboard do Tatame",
              url: "/",
              icon: BarChart3
            }
          ]
        },
        {
          id: 'cadastros',
          category: 'Central de Cadastros',
          icon: FilePlus2,
          items: [
            {
              title: "Cadastros & Formulários",
              url: "/cadastros",
              icon: FilePlus2,
              highlight: true
            }
          ]
        },
        {
          id: 'tatame',
          category: 'Tatame & Aulas',
          icon: ClipboardCheck,
          items: [
            {
              title: "Presença do Dia",
              url: "/presenca",
              icon: ClipboardCheck
            },
            {
              title: "Planejamento de Aulas",
              url: "/planejamento",
              icon: ClipboardList
            },
            {
              title: "Biblioteca de Técnicas",
              url: "/biblioteca",
              icon: BookOpen
            },
            {
              title: "Relatório de Aulas",
              url: "/relatorio-aulas",
              icon: ScrollText
            }
          ]
        },
        {
          id: 'equipe',
          category: 'Alunos & Graduação',
          icon: Users,
          items: [
            {
              title: "Meus Alunos Vinculados",
              url: "/equipe",
              icon: Users
            },
            {
              title: "Sistema de Graduação",
              url: "/graduacao",
              icon: Award,
              badgeCount: studentsEligibleForPromotion > 0 ? studentsEligibleForPromotion : undefined
            },
            {
              title: "Desempenho & Métricas",
              url: "/metricas",
              icon: Activity
            }
          ]
        },
        {
          id: 'financeiro',
          category: 'Financeiro & Vendas',
          icon: DollarSign,
          items: [
            {
              title: "Minhas Mensalidades (PIX)",
              url: "/financeiro",
              icon: DollarSign,
              badgeCount: overduePayments > 0 ? overduePayments : undefined
            },
            {
              title: "Vendas & Estoque",
              url: "/produtos",
              icon: Package
            }
          ]
        },
        {
          id: 'eventos',
          category: 'Eventos & Relatórios',
          icon: Trophy,
          items: [
            {
              title: "Painel de Eventos",
              url: "/eventos",
              icon: Trophy
            },
            {
              title: "Relatórios dos Alunos",
              url: "/relatorios",
              icon: BarChart3
            }
          ]
        },
        {
          id: 'comunicacao',
          category: 'Comunicação',
          icon: Bell,
          items: [
            {
              title: "Mural de Avisos",
              url: "/notificacoes",
              icon: Bell
            }
          ]
        }
      ];
    }

    // Admin: Full access with organized sections
    return [
      {
        id: 'visao_geral',
        category: 'Visão Geral',
        icon: BarChart3,
        items: [
          {
            title: "Dashboard Geral",
            url: "/",
            icon: BarChart3
          }
        ]
      },
      {
        id: 'cadastros',
        category: 'Central de Cadastros',
        icon: FilePlus2,
        items: [
          {
            title: "Aprovações de Cadastros",
            url: "/aprovacoes",
            icon: UserCheck,
            badgeCount: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
            highlight: pendingApprovalsCount > 0
          },
          {
            title: "Todos os Cadastros",
            url: "/cadastros",
            icon: FilePlus2,
            highlight: false
          }
        ]
      },
      {
        id: 'tatame',
        category: 'Tatame & Aulas',
        icon: ClipboardCheck,
        items: [
          {
            title: "Presença do Dia",
            url: "/presenca",
            icon: ClipboardCheck
          },
          {
            title: "Planejamento de Aulas",
            url: "/planejamento",
            icon: ClipboardList
          },
          {
            title: "Biblioteca de Técnicas",
            url: "/biblioteca",
            icon: BookOpen
          },
          {
            title: "Relatório de Aulas",
            url: "/relatorio-aulas",
            icon: ScrollText
          }
        ]
      },
      {
        id: 'equipe',
        category: 'Equipe & Graduação',
        icon: Users,
        items: [
          {
            title: "Alunos & Matrículas",
            url: "/equipe",
            icon: Users
          },
          {
            title: "Professores & Mestre",
            url: "/professores",
            icon: UserRound
          },
          {
            title: "Sistema de Graduação",
            url: "/graduacao",
            icon: Award,
            badgeCount: studentsEligibleForPromotion > 0 ? studentsEligibleForPromotion : undefined,
            highlight: studentsEligibleForPromotion > 0
          },
          {
            title: "Desempenho & Métricas",
            url: "/metricas",
            icon: Activity
          }
        ]
      },
      {
        id: 'financeiro',
        category: 'Financeiro & Loja',
        icon: DollarSign,
        items: [
          {
            title: "Financeiro & Mensalidades",
            url: "/financeiro",
            icon: DollarSign,
            badgeCount: overduePayments > 0 ? overduePayments : undefined
          },
          {
            title: "Loja & Produtos",
            url: "/produtos",
            icon: Package
          }
        ]
      },
      {
        id: 'eventos',
        category: 'Eventos & Relatórios',
        icon: Trophy,
        items: [
          {
            title: "Painel de Eventos",
            url: "/eventos",
            icon: Trophy
          },
          {
            title: "Relatórios Gerais",
            url: "/relatorios",
            icon: BarChart3
          },
          {
            title: "Relatório Anual",
            url: "/relatorio-anual",
            icon: CalendarDays
          }
        ]
      },
      {
        id: 'sistema',
        category: 'Sistema & Configurações',
        icon: Settings,
        items: [
          {
            title: "Configurações da Academia",
            url: "/configuracoes",
            icon: Settings
          },
          {
            title: "Banco de Dados & Supabase",
            url: "/configuracoes?tab=supabase",
            icon: Database
          },
          {
            title: "Notificações & Lembretes",
            url: "/notificacoes",
            icon: Bell,
            badgeCount: pendingNotifs > 0 ? pendingNotifs : undefined
          }
        ]
      }
    ];
  };

  const navSections = getNavSections();

  const isActive = (url: string) => {
    if (url === '/') return location.pathname === '/' || location.pathname === '/Dashboard' || location.pathname === '/dashboard';
    if (url.includes('?')) {
      const currentFull = `${location.pathname}${location.search}`.toLowerCase();
      return currentFull === url.toLowerCase();
    }
    const cleanPath = location.pathname.toLowerCase();
    const cleanUrl = url.toLowerCase();
    return (cleanPath === cleanUrl || cleanPath === cleanUrl.replace('/', '')) && (!location.search || url !== '/configuracoes');
  };

  // Auto-expand section if currently active route is inside it
  useEffect(() => {
    navSections.forEach(section => {
      const hasActive = section.items.some(item => isActive(item.url));
      if (hasActive) {
        setOpenSections(prev => ({ ...prev, [section.id]: true }));
      }
    });
  }, [location.pathname]);

  return (
    <div className="relative isolate min-h-screen bg-theme-app text-theme-main font-sans transition-colors duration-200">
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden" aria-hidden="true">
        <MikalkenasLogo
          variant="circle"
          size="2xl"
          showWordmark={false}
          className="ternatio-page-watermark-logo text-theme-main opacity-[0.055]"
        />
      </div>

      <div className="relative z-10 flex min-h-screen w-full">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Desktop & Mobile Drawer */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-theme-sidebar text-theme-main flex flex-col border-r border-theme transition-transform duration-200 ease-in-out no-print
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-4 border-b border-theme flex items-center justify-between">
          <Link to={currentUser.role === 'aluno' ? '/area-aluno' : '/'} className="flex items-center gap-2 min-w-0 group hover:opacity-95 transition-opacity">
            <MikalkenasLogo 
              size="md" 
              variant="metallic" 
              showWordmark={true} 
              showTagline={true} 
            />
          </Link>

          <button 
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-theme-muted hover:text-theme-main p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Banner / Switcher in Sidebar */}
        <div className="px-4 py-2.5 bg-theme-subtle border-b border-theme flex items-center justify-between text-xs">
          <div className="min-w-0 pr-2">
            <span className="text-[10px] text-theme-muted block font-bold uppercase tracking-wider">
              {currentUser.role === 'admin' ? '👑 Administrador' :
               currentUser.role === 'professor' ? '🥋 Professor' :
               '🥇 Praticante / Aluno'}
            </span>
            <p className="font-extrabold text-theme-main truncate text-xs">{currentUser.nome}</p>
          </div>

          <button
            onClick={() => setLoginModalOpen(true)}
            className="bg-theme-card hover:bg-theme-card-hover text-theme-accent font-bold text-[11px] px-2.5 py-1.5 rounded-lg border border-theme flex items-center gap-1 shrink-0 transition-colors shadow-xs"
            title="Trocar perfil de acesso (Admin / Professor / Aluno)"
          >
            <RefreshCw className="w-3 h-3" /> Trocar
          </button>
        </div>

        {/* Nav Links with Menus & Submenus */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
          {navSections.map((section) => {
            const isOpen = openSections[section.id] ?? true;
            const hasActiveChild = section.items.some(i => isActive(i.url));

            return (
              <div key={section.id} className="space-y-1">
                {/* Section Header / Accordion trigger */}
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                    hasActiveChild 
                      ? 'text-blue-600 dark:text-blue-400 font-black' 
                      : 'text-theme-muted hover:text-theme-main font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <section.icon className="w-3.5 h-3.5 opacity-80" />
                    <span>{section.category}</span>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 opacity-70" />
                  )}
                </button>

                {/* Submenu Items */}
                {isOpen && (
                  <div className="space-y-0.5 pl-2">
                    {section.items.map((item) => {
                      const active = isActive(item.url);
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.title}
                          to={item.url}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                            active 
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold' 
                              : 'text-theme-main hover:bg-theme-card-hover hover:text-blue-600'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-theme-muted group-hover:text-blue-600 transition-colors'}`} />
                            <span className="truncate">{item.title}</span>
                          </div>

                          {item.badgeCount !== undefined && (
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold shadow-xs shrink-0 ${
                              item.highlight 
                                ? 'bg-amber-400 text-amber-950 animate-bounce' 
                                : 'bg-red-500 text-white'
                            }`}>
                              {item.badgeCount}
                            </span>
                          )}

                          {item.highlight && !item.badgeCount && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 shadow-xs" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Active User Footer */}
        <div className="p-3.5 border-t border-theme bg-theme-subtle">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-theme-card border border-theme flex items-center justify-center font-bold text-xs text-theme-main shrink-0 shadow-xs">
                {currentUser.nome.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-theme-main truncate">{currentUser.nome}</p>
                <p className="text-[10px] text-theme-muted truncate">{currentUser.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setChangePasswordModalOpen(true)}
                className="text-theme-muted hover:text-amber-500 p-1.5 rounded-lg hover:bg-theme-card-hover transition-colors cursor-pointer"
                title="Alterar minha senha"
              >
                <Key className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLoginModalOpen(true)}
                className="text-theme-muted hover:text-theme-main p-1.5 rounded-lg hover:bg-theme-card-hover transition-colors cursor-pointer"
                title="Alternar login / perfil"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={logout}
                className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                title="Encerrar sessão (Sair)"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-72 min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-theme-header backdrop-blur-md border-b border-theme px-4 md:px-8 py-2.5 flex items-center justify-between no-print transition-colors duration-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg text-theme-muted hover:text-theme-main hover:bg-white/5 transition-colors"
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Quick Breadcrumb / Academy Label */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-extrabold text-theme-main hidden sm:inline">
                {academySettings.nomeAcademia}
              </span>
              <span className="text-theme-muted/50 hidden sm:inline">•</span>
              <span className="text-theme-muted font-medium text-[11px]">
                Mestre {academySettings.mestreResponsavel}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Selector (3 Official BJJ Themes) */}
            <ThemeSelector variant="compact" />

            {/* Quick Link to Cadastros Hub */}
            <Link
              to="/cadastros"
              className="hidden sm:flex items-center gap-1.5 bg-theme-card hover:opacity-90 text-theme-main border border-theme px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs"
            >
              <FilePlus2 className="w-3.5 h-3.5 text-blue-500" />
              <span>Novo Cadastro</span>
            </Link>

            {/* User profile capsule in topbar */}
            <div 
              onClick={() => setLoginModalOpen(true)}
              className="cursor-pointer flex items-center gap-2 bg-theme-card hover:opacity-90 border border-theme px-3 py-1.5 rounded-xl transition-all shadow-2xs"
              title="Clique para alternar o nível de usuário (Admin / Professor / Aluno)"
            >
              <div className="w-6 h-6 rounded-lg bg-theme-accent text-white font-bold text-[10px] flex items-center justify-center">
                {currentUser.role === 'admin' ? 'A' : currentUser.role === 'professor' ? 'P' : 'AL'}
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-theme-main block leading-tight">{currentUser.nome.split(' ')[0]}</span>
                <span className="text-[10px] text-theme-muted block uppercase leading-tight font-semibold">{currentUser.role}</span>
              </div>
            </div>

            {/* Change password button in topbar */}
            <button
              onClick={() => setChangePasswordModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-theme-muted hover:text-theme-main bg-theme-card hover:opacity-90 border border-theme px-2.5 py-1.5 rounded-xl transition-all shadow-2xs cursor-pointer"
              title="Alterar minha senha"
            >
              <Key className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden lg:inline">Alterar Senha</span>
            </button>

            {/* Logout button in topbar */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-xl transition-all shadow-2xs"
              title="Sair do sistema com segurança"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </header>

        {/* Main Routed Page Body */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
      </div>

      {/* Login / Role Switching Modal */}
      <LoginModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={changePasswordModalOpen || currentUser.mustChangePassword === true}
        onClose={() => setChangePasswordModalOpen(false)}
        forced={currentUser.mustChangePassword === true}
      />
    </div>
  );
};
