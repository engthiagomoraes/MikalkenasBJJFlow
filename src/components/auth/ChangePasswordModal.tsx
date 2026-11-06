import React, { useState } from 'react';
import { Key, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, X, ShieldCheck } from 'lucide-react';
import { useBjj } from '../../context/BjjContext';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, changeCurrentUserPassword } = useBjj();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleReset = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!currentPassword) {
      setErrorMsg('Informe sua senha atual.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('A nova senha deve possuir no mínimo 6 caracteres.');
      return;
    }

    if (newPassword === currentPassword) {
      setErrorMsg('A nova senha deve ser diferente da senha atual.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('A confirmação da nova senha não confere.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await changeCurrentUserPassword(currentPassword, newPassword);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          handleClose();
        }, 2200);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Falha ao atualizar a senha. Verifique sua conexão e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-theme-card border border-theme text-theme-main rounded-3xl max-w-md w-full shadow-2xl overflow-hidden my-8 animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="bg-theme-subtle p-5 border-b border-theme flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shadow-xs">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-theme-main">Alterar Minha Senha</h2>
              <p className="text-xs text-theme-muted">
                {currentUser.nome} • {currentUser.email}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-theme-muted hover:text-theme-main rounded-xl hover:bg-theme-app transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{errorMsg}</span>
            </div>
          )}

          {successMsg ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-theme-main">Senha Alterada com Sucesso!</h3>
                <p className="text-xs text-emerald-400 font-semibold">{successMsg}</p>
                <p className="text-[11px] text-theme-muted">Suas credenciais foram atualizadas no Supabase.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Senha Atual */}
              <div>
                <label 
                  htmlFor="change-current-pw" 
                  className="block text-xs font-semibold text-theme-muted mb-1.5"
                >
                  Senha Atual
                </label>
                <div className="relative">
                  <input
                    id="change-current-pw"
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Sua senha atual"
                    className="w-full bg-theme-app border border-theme focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-theme-main rounded-xl px-3.5 py-2.5 pl-10 pr-10 text-xs transition-all outline-none"
                    required
                    disabled={isLoading}
                  />
                  <Lock className="w-4 h-4 text-theme-muted absolute left-3.5 top-3 pointer-events-none" />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3.5 top-3 text-theme-muted hover:text-theme-main transition-colors cursor-pointer"
                    aria-label={showCurrent ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Nova Senha */}
              <div>
                <label 
                  htmlFor="change-new-pw" 
                  className="block text-xs font-semibold text-theme-muted mb-1.5"
                >
                  Nova Senha (mínimo 6 caracteres)
                </label>
                <div className="relative">
                  <input
                    id="change-new-pw"
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo de 6 dígitos"
                    className="w-full bg-theme-app border border-theme focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-theme-main rounded-xl px-3.5 py-2.5 pl-10 pr-10 text-xs transition-all outline-none"
                    required
                    disabled={isLoading}
                  />
                  <Key className="w-4 h-4 text-theme-muted absolute left-3.5 top-3 pointer-events-none" />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3.5 top-3 text-theme-muted hover:text-theme-main transition-colors cursor-pointer"
                    aria-label={showNew ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirmação da Nova Senha */}
              <div>
                <label 
                  htmlFor="change-confirm-pw" 
                  className="block text-xs font-semibold text-theme-muted mb-1.5"
                >
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <input
                    id="change-confirm-pw"
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a nova senha"
                    className="w-full bg-theme-app border border-theme focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-theme-main rounded-xl px-3.5 py-2.5 pl-10 pr-10 text-xs transition-all outline-none"
                    required
                    disabled={isLoading}
                  />
                  <Key className="w-4 h-4 text-theme-muted absolute left-3.5 top-3 pointer-events-none" />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-3 text-theme-muted hover:text-theme-main transition-colors cursor-pointer"
                    aria-label={showConfirm ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="px-4 py-2.5 text-xs font-semibold text-theme-muted hover:text-theme-main rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-theme-accent hover:opacity-90 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Atualizando Senha...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Salvar Nova Senha</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
