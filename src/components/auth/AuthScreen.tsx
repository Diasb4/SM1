import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { AuthUser, UserRole } from '../../types';
import {
  ShieldCheck,
  Mail,
  Bot,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  GraduationCap,
  Users,
  ChevronLeft,
  KeyRound,
  BookOpen,
  Award,
  AlertCircle
} from 'lucide-react';
import { playSound } from '../../utils/audio';

type AuthStep = 'email_input' | 'otp_verify' | 'profile_setup';

export const AuthScreen: React.FC = () => {
  const {
    sendEmailOtp,
    verifyEmailOtp,
    loginWithSSO,
    loginWithTelegram,
    switchUser,
    availableUsers,
    updateUserProfile,
    currentUser,
    t,
    triggerConfetti,
    triggerHaptic
  } = useApp();

  const [step, setStep] = useState<AuthStep>('email_input');
  const [email, setEmail] = useState('254977@astanait.edu.kz');
  const [selectedRole, setSelectedRole] = useState<UserRole>('mentee');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Profile setup for new accounts
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [major, setMajor] = useState('Software Engineering');
  const [cohort, setCohort] = useState('SE-2401');

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: any = null;
    if (step === 'otp_verify' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, countdown]);

  // Handle Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Пожалуйста, введите валидную почту');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await sendEmailOtp(email.trim(), selectedRole);
      playSound('pop');
      triggerHaptic('medium');
      if (res.devCode) {
        setDevCode(res.devCode);
      }
      setCountdown(60);
      setCanResend(false);
      setStep('otp_verify');
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch (err: any) {
      setErrorMessage(err.message || 'Ошибка отправки кода подтверждения');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP Digit Input & Auto-focus navigation
  const handleOtpChange = (index: number, value: string) => {
    const digit = value.slice(-1); // Only last char
    if (value && !/^\d+$/.test(digit)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    // Auto-advance
    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all 6 filled
    if (digit && index === 5 && newDigits.every(d => d !== '')) {
      submitVerification(newDigits.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim().replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setOtpDigits(newDigits);

    if (pasted.length === 6) {
      submitVerification(pasted);
    } else {
      otpInputRefs.current[pasted.length]?.focus();
    }
  };

  const handleAutofillDevCode = () => {
    if (!devCode) return;
    const digits = devCode.split('').slice(0, 6);
    setOtpDigits(digits);
    submitVerification(devCode);
  };

  // Submit OTP code for verification
  const submitVerification = async (codeStr: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      await verifyEmailOtp({
        email: email.trim(),
        code: codeStr,
        name: fullName || undefined,
        major: major || undefined,
        cohort: cohort || undefined,
        studentId: studentId || undefined
      });
      playSound('success');
      triggerConfetti();
      triggerHaptic('success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Неверный код подтверждения');
      playSound('beep');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await sendEmailOtp(email.trim(), selectedRole);
      if (res.devCode) setDevCode(res.devCode);
      setCountdown(60);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
      playSound('pop');
    } catch (err: any) {
      setErrorMessage(err.message || 'Ошибка отправки кода');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAccountSelect = (user: AuthUser) => {
    switchUser(user);
    playSound('success');
    triggerConfetti();
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white min-h-[620px] rounded-3xl overflow-hidden relative select-none">
      {/* Background Glow effects */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-extrabold text-sm shadow-md shadow-blue-500/30">
            SM
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight">AITU Mentorship</h2>
            <p className="text-[10px] text-blue-300 font-mono">Student Affairs & DSEW</p>
          </div>
        </div>

        <span className="bg-white/10 backdrop-blur-md text-[10px] font-bold text-emerald-300 px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>SSO Verified</span>
        </span>
      </div>

      {/* Main Content Card based on active step */}
      <div className="z-10 my-auto py-4 flex flex-col gap-4">
        {/* STEP 1: EMAIL INPUT & ROLE SELECTION */}
        {step === 'email_input' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div>
              <h1 className="text-2xl font-black tracking-tight leading-tight">
                Авторизация <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">AITU</span>
              </h1>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Введите корпоративную почту для отправки 6-значного кода доступа
              </p>
            </div>

            {/* Role Pills */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-300">Ваша роль в университете</label>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-800/80 p-1 rounded-2xl border border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setSelectedRole('mentee')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedRole === 'mentee'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Студент
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('mentor')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedRole === 'mentor'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Ментор
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('hard_mentor')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedRole === 'hard_mentor'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Тьютор
                </button>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSendOtp} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>Корпоративная почта (@astanait.edu.kz)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="254977@astanait.edu.kz"
                  required
                  className="w-full bg-slate-800/90 border border-slate-700 text-white text-xs rounded-xl px-3.5 py-3 focus:outline-none focus:border-blue-500 font-mono transition-colors placeholder:text-slate-500"
                />
              </div>

              {errorMessage && (
                <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Получить 6-значный код</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* 1-Click Fast SSO / Telegram Actions */}
            <div className="flex items-center gap-2 my-1">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">или в один клик</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => loginWithSSO(email)}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Microsoft SSO</span>
              </button>

              <button
                onClick={loginWithTelegram}
                className="p-2.5 bg-[#2481CC]/80 hover:bg-[#2481CC] active:scale-[0.98] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5 text-sky-200" />
                <span>Telegram ID</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: 6-DIGIT OTP VERIFICATION */}
        {step === 'otp_verify' && (
          <div className="flex flex-col gap-4 animate-scale-in">
            <button
              onClick={() => {
                setStep('email_input');
                setErrorMessage(null);
              }}
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-bold -ml-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Назад к вводу почты</span>
            </button>

            <div>
              <h2 className="text-xl font-black tracking-tight">Подтверждение почты</h2>
              <p className="text-xs text-slate-300 mt-1">
                Мы отправили код на <strong className="text-white font-mono">{email}</strong>
              </p>
            </div>

            {/* Dev Helper Banner for Instant Testing */}
            {devCode && (
              <div
                onClick={handleAutofillDevCode}
                className="p-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 rounded-2xl flex items-center justify-between cursor-pointer hover:border-emerald-400 transition-all shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="text-[10px] text-emerald-300 font-bold block uppercase tracking-wider">Тестовый код доступа:</span>
                    <span className="text-base font-black font-mono tracking-widest text-emerald-200">{devCode}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-500 text-slate-950 px-2 py-1 rounded-lg">
                  Вставить в 1 клик ⚡
                </span>
              </div>
            )}

            {/* 6 Digit Cells */}
            <div className="flex items-center justify-center gap-2 my-2">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => (otpInputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(idx, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(idx, e)}
                  onPaste={idx === 0 ? handleOtpPaste : undefined}
                  className={`w-11 h-13 rounded-2xl text-center text-xl font-mono font-black border transition-all ${
                    digit
                      ? 'bg-blue-600/20 border-blue-400 text-white shadow-md shadow-blue-500/20 ring-1 ring-blue-400'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 focus:border-blue-500 focus:bg-slate-800'
                  }`}
                />
              ))}
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              onClick={() => submitVerification(otpDigits.join(''))}
              disabled={isLoading || otpDigits.some(d => !d)}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 active:scale-[0.98] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Подтвердить и войти</span>
                </>
              )}
            </button>

            {/* Resend Timer */}
            <div className="text-center mt-1">
              {canResend ? (
                <button
                  onClick={handleResendCode}
                  className="text-xs text-blue-400 hover:text-blue-300 font-bold underline cursor-pointer"
                >
                  Отправить код повторно
                </button>
              ) : (
                <span className="text-[11px] text-slate-400 font-mono">
                  Повторный запрос через: <strong className="text-slate-200">{countdown} сек</strong>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom: Quick Account Switcher for Demo / Testing */}
      <div className="z-10 border-t border-slate-800/80 pt-3 flex flex-col gap-2">
        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
          <Users className="w-3 h-3 text-purple-400" />
          <span>Быстрый вход под тестовыми аккаунтами:</span>
        </span>

        <div className="grid grid-cols-2 gap-1.5">
          {availableUsers.map(u => (
            <button
              key={u.id}
              onClick={() => handleQuickAccountSelect(u)}
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left flex items-center gap-2 transition-all cursor-pointer"
            >
              <div className={`w-6 h-6 rounded-lg ${u.avatarColor} text-[10px] font-bold flex items-center justify-center flex-shrink-0`}>
                {u.initials}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold text-white block truncate">{u.name.split(' ')[0]}</span>
                <span className="text-[9px] text-indigo-300 font-mono block uppercase">{u.role}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

