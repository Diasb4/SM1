import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AuthUser } from '../../types';
import {
  X,
  ShieldCheck,
  Bot,
  Mail,
  UserCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Users
} from 'lucide-react';
import { playSound } from '../../utils/audio';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    currentUser,
    availableUsers,
    switchUser,
    loginWithSSO,
    loginWithTelegram,
    t
  } = useApp();

  const [emailInput, setEmailInput] = useState('254977@astanait.edu.kz');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSSOSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      setAuthError('Пожалуйста, введите валидную почту AITU (@astanait.edu.kz)');
      return;
    }

    setIsLoading(true);
    setAuthError(null);
    try {
      await loginWithSSO(emailInput.trim());
      playSound('success');
      closeAuthModal();
    } catch (err: any) {
      setAuthError(err?.message || 'Ошибка входа через Microsoft SSO');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTelegramLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithTelegram();
      playSound('success');
      closeAuthModal();
    } catch {
      setAuthError('Ошибка входа через Telegram');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAccount = (user: AuthUser) => {
    switchUser(user);
    playSound('success');
    closeAuthModal();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-5 text-white relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-white/20 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-300" />
              <span>AITU ID Security</span>
            </span>
          </div>

          <h2 className="text-lg font-bold">Аутентификация AITU</h2>
          <p className="text-xs text-blue-100 mt-0.5">Вход через единый аккаунт Microsoft 365 или Telegram</p>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-4">
          {/* Current Logged In Banner */}
          {currentUser && (
            <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl ${currentUser.avatarColor} flex items-center justify-center font-bold text-xs shadow-xs`}>
                  {currentUser.initials}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900">{currentUser.name}</h4>
                    <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-mono font-bold uppercase">
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono truncate max-w-[180px]">{currentUser.email}</p>
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            </div>
          )}

          {/* Microsoft 365 SSO Form */}
          <form onSubmit={handleSSOSubmit} className="flex flex-col gap-2.5">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span>Вход по корпоративной почте</span>
            </label>

            <div className="relative">
              <input
                type="email"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                placeholder="254977@astanait.edu.kz"
                required
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:bg-white focus:border-blue-500 font-mono transition-colors"
              />
            </div>

            {authError && (
              <p className="text-[11px] text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-2 font-medium">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Войти через Microsoft 365 SSO</span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-2 my-0.5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">или в один клик</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Telegram Login Button */}
          <button
            onClick={handleTelegramLogin}
            disabled={isLoading}
            className="w-full bg-[#2481CC] hover:bg-[#1E74B8] active:scale-[0.98] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Bot className="w-4 h-4 text-sky-200" />
            <span>Войти через Telegram WebApp ID</span>
          </button>

          {/* Quick Account Switcher (Demo / Testing Roles) */}
          <div className="flex flex-col gap-2 pt-1 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <span>Быстрое переключение ролей:</span>
            </span>

            <div className="grid grid-cols-1 gap-1.5">
              {availableUsers.map(u => (
                <div
                  key={u.id}
                  onClick={() => handleSelectAccount(u)}
                  className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    currentUser?.id === u.id
                      ? 'bg-purple-50/70 border-purple-300 shadow-xs'
                      : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg ${u.avatarColor} flex items-center justify-center text-[11px] font-bold`}>
                      {u.initials}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{u.name}</h5>
                      <p className="text-[10px] text-slate-500">{u.cohort} · <span className="font-mono text-[9px] font-bold text-indigo-600 uppercase">{u.role}</span></p>
                    </div>
                  </div>
                  {currentUser?.id === u.id ? (
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

