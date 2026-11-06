import React, { useState } from 'react';
import { ShieldCheck, Mail, Key, LogIn, X, Loader2, AlertCircle } from 'lucide-react';
import { useBjj } from '../../context/BjjContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, loginWithEmailAndPassword, academySettings } = useBjj();
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!emailInput.trim()) {
      setErrorMsg('Informe o e-mail cadastrado.');
      return;
    }
    if (!passwordInput) {
      setErrorMsg('Informe a senha.');
      return;
    }

    setLoading(true);
    try {
      const result = await loginWithEmailAndPassword(emailInput.trim(), passwordInput);
      if (result.success) {
        setEmailInput('');
        setPasswordInput('');
        onClose();
      } else {
        setErrorMsg(result.message);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Falha na autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-950 text-white p-6 relative">
          <button 
            type="button"
            onClick={onClose} 
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg font-black text-white text-xl">
              BJJ
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">{academySettings.nomeAcademia || 'Mikalkenas Jiu Jitsu'}</h2>
              <p className="text-xs text-slate-400">
                Alternar conta / Autenticação
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Usuário Conectado Atualmente</p>
            <p className="font-bold text-slate-900 text-sm">{currentUser.nome}</p>
            <p className="text-slate-500">{currentUser.email} • Perfil: <span className="font-semibold capitalize">{currentUser.role}</span></p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} method="post" autoComplete="on" className="space-y-4">
            <div>
              <label 
                htmlFor="modal-email" 
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                E-mail
              </label>
              <div className="relative">
                <input
                  id="modal-email"
                  name="username"
                  type="email"
                  autoComplete="username"
                  placeholder="seu.email@exemplo.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-xl px-3.5 py-2.5 pl-9 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                  disabled={loading}
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label 
                htmlFor="modal-password" 
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  id="modal-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-xl px-3.5 py-2.5 pl-9 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                  disabled={loading}
                />
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Verificando...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Confirmar Entrada</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-400 border-t border-slate-100">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Validação direta com o banco de dados Supabase.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
