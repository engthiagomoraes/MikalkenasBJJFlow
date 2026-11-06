import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BjjProvider, useBjj } from './context/BjjContext';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { Dashboard } from './pages/Dashboard';
import { AreaAluno } from './pages/AreaAluno';
import { Presenca } from './pages/Presenca';
import { Planejamento } from './pages/Planejamento';
import { Biblioteca } from './pages/Biblioteca';
import { Graduacao } from './pages/Graduacao';
import { Equipe } from './pages/Equipe';
import { Professores } from './pages/Professores';
import { Financeiro } from './pages/Financeiro';
import { Produtos } from './pages/Produtos';
import { Eventos } from './pages/Eventos';
import { Cadastros } from './pages/Cadastros';
import { Metricas } from './pages/Metricas';
import { Notificacoes } from './pages/Notificacoes';
import { Relatorios } from './pages/Relatorios';
import { RelatorioAulas } from './pages/RelatorioAulas';
import { RelatorioAnual } from './pages/RelatorioAnual';
import { Configuracoes } from './pages/Configuracoes';
import { Aprovacoes } from './pages/Aprovacoes';
import { Login } from './pages/Login';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center font-black text-2xl mb-4">
            BJJ
          </div>
          <h1 className="text-xl font-bold mb-2">Mikalkenas Jiu Jitsu • Recuperação de Sistema</h1>
          <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
            Ocorreu uma instabilidade momentânea na renderização dos componentes.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-red-900/40"
            >
              Recarregar Sistema
            </button>
            <button
              onClick={() => {
                try {
                  localStorage.clear();
                } catch {}
                window.location.href = '/';
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              Redefinir Dados Locais
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

interface ProtectedRouteProps {
  allowedRoles: ('admin' | 'professor' | 'aluno')[];
  fallbackPath: string;
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, fallbackPath, children }) => {
  const { currentUser } = useBjj();
  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to={fallbackPath} replace />;
  }
  return children;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, currentUser } = useBjj();

  if (!isAuthenticated) {
    return <Login />;
  }

  // Redirecionamento inicial conforme o perfil
  const defaultPath = currentUser.role === 'aluno' ? '/area-aluno' : '/';

  return (
    <AppLayout>
      <Routes>
        {/* Rota inicial contextual por perfil */}
        <Route 
          path="/" 
          element={
            currentUser.role === 'aluno' 
              ? <Navigate to="/area-aluno" replace /> 
              : <Dashboard />
          } 
        />

        {/* Área exclusiva do Aluno */}
        <Route path="/area-aluno" element={<AreaAluno />} />

        {/* Rotas acessíveis a todos os perfis autenticados */}
        <Route path="/presenca" element={<Presenca />} />
        <Route path="/biblioteca" element={<Biblioteca />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/notificacoes" element={<Notificacoes />} />

        {/* Rotas restritas: Professores e Administradores */}
        <Route 
          path="/planejamento" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'professor']} fallbackPath="/area-aluno">
              <Planejamento />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/graduacao" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'professor']} fallbackPath="/area-aluno">
              <Graduacao />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/equipe" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'professor']} fallbackPath="/area-aluno">
              <Equipe />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cadastros" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'professor']} fallbackPath="/area-aluno">
              <Cadastros />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/metricas" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'professor']} fallbackPath="/area-aluno">
              <Metricas />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/financeiro" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'professor']} fallbackPath="/area-aluno">
              <Financeiro />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/relatorios" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'professor']} fallbackPath="/area-aluno">
              <Relatorios />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/relatorio-aulas" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'professor']} fallbackPath="/area-aluno">
              <RelatorioAulas />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/relatorio-anual" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'professor']} fallbackPath="/area-aluno">
              <RelatorioAnual />
            </ProtectedRoute>
          } 
        />

        {/* Rotas estritamente exclusivas do Administrador */}
        <Route 
          path="/professores" 
          element={
            <ProtectedRoute allowedRoles={['admin']} fallbackPath="/">
              <Professores />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/aprovacoes" 
          element={
            <ProtectedRoute allowedRoles={['admin']} fallbackPath="/">
              <Aprovacoes />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/configuracoes" 
          element={
            <ProtectedRoute allowedRoles={['admin']} fallbackPath="/">
              <Configuracoes />
            </ProtectedRoute>
          } 
        />

        <Route path="/login" element={<Navigate to={defaultPath} replace />} />
        <Route path="*" element={<Navigate to={defaultPath} replace />} />
      </Routes>
    </AppLayout>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <BjjProvider>
          <AppRoutes />
        </BjjProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
