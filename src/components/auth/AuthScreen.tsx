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
  AlertCircle,
  Check,
  UserCheck,
  Heart,
  Calendar,
  MessageSquare,
  Flame,
  Star,
  CheckCheck,
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';
import { playSound } from '../../utils/audio';

type AuthStep =
  | 'role_selection'
  | 'email_input'
  | 'otp_verify'
  | 'onboarding_mentee'
  | 'onboarding_mentor'
  | 'welcome_celebration';

export const AuthScreen: React.FC = () => {
  const {
    sendEmailOtp,
    verifyEmailOtp,
    loginWithSSO,
    loginWithTelegram,
    switchUser,
    availableUsers,
    mentors,
    selectAsMyMentor,
    currentUser,
    t,
    triggerConfetti,
    triggerHaptic
  } = useApp();

  const [step, setStep] = useState<AuthStep>('role_selection');
  const [selectedRole, setSelectedRole] = useState<UserRole>('mentee');
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Mentee Onboarding State
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [major, setMajor] = useState('Software Engineering');
  const [cohort, setCohort] = useState('SE-2601');
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([
    'Высшая математика (Calculus)',
    'Адаптация в общежитии',
    'Хакатоны и олимпиады'
  ]);
  const [matchedMentorId, setMatchedMentorId] = useState<string>('m-1');

  // Foolproof rules check for Freshers
  const [ruleNoHomework, setRuleNoHomework] = useState(false);
  const [ruleRespectTime, setRuleRespectTime] = useState(false);
  const [ruleCampusOnly, setRuleCampusOnly] = useState(false);
  const allRulesAccepted = ruleNoHomework && ruleRespectTime && ruleCampusOnly;

  // Mentor Onboarding State
  // Mentors: strictly 2nd year (majority) or 3rd year (senior/tutor). 1st & 4th years excluded!
  const [mentorName, setMentorName] = useState('');
  const [mentorYear, setMentorYear] = useState<'2nd year' | '3rd year'>('2nd year');
  const [mentorGpa, setMentorGpa] = useState('3.92');
  const [mentorSpecialty, setMentorSpecialty] = useState<'soft' | 'hard'>('soft');
  const [mentorBio, setMentorBio] = useState('Помогу адаптироваться в AITU, сдать первые лабы и найти команду на хакатоны.');
  const [meetingFormat, setMeetingFormat] = useState<'both' | 'offline' | 'online'>('both');

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const majorsList = [
    { code: 'SE', name: 'Software Engineering' },
    { code: 'CS', name: 'Computer Science' },
    { code: 'CY', name: 'Cybersecurity' },
    { code: 'BDA', name: 'Big Data Analysis' },
    { code: 'MT', name: 'Media Technologies' },
    { code: 'ITM', name: 'IT Management' }
  ];

  const popularCohorts = ['SE-2601', 'SE-2602', 'CS-2601', 'CY-2601', 'ITM-2601', 'BDA-2601'];

  const needsList = [
    'Высшая математика (Calculus)',
    'Программирование (Java/C++)',
    'Адаптация в общежитии и кампусе',
    'Хакатоны и олимпиады',
    'Студенческие клубы (GDG, Debate)',
    'Тайм-менеджмент и сессия'
  ];

  const toggleNeed = (need: string) => {
    setSelectedNeeds(prev =>
      prev.includes(need) ? prev.filter(n => n !== need) : [...prev, need]
    );
    playSound('pop');
  };

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

  // Handle Send OTP with Foolproof Validations
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Пожалуйста, укажите адрес корпоративной почты или 6-значный ID');
      return;
    }

    let targetEmail = email.trim().toLowerCase();

    // FOOLPROOF: If student typed just their 6-digit ID like 264977, auto-complete
    if (/^\d{6}$/.test(targetEmail)) {
      targetEmail = `${targetEmail}@astanait.edu.kz`;
      setEmail(targetEmail);
    }

    if (!targetEmail.includes('@')) {
      setErrorMessage('Пожалуйста, укажите полный адрес корпоративной почты @astanait.edu.kz');
      return;
    }

    if (!targetEmail.endsWith('@astanait.edu.kz') && !targetEmail.endsWith('@aitu.edu.kz') && !targetEmail.includes('demo')) {
      setErrorMessage('Регистрация открыта только по корпоративным адресам @astanait.edu.kz');
      return;
    }

    // FOOLPROOF BILATERAL COHORT VALIDATION:
    const idMatch = targetEmail.match(/^(\d{2})\d{4}@/);
    if (idMatch) {
      const yearPrefix = idMatch[1]; // '26' = 1st, '25' = 2nd, '24' = 3rd, '23' = 4th

      // 1. First-years (26xxxx) CANNOT be mentors
      if (yearPrefix === '26' && selectedRole === 'mentor') {
        playSound('beep');
        setErrorMessage('🛑 Студенты 1-го курса (набор 2026 года, 26xxxx) не могут быть менторами! Менторами могут быть только студенты 2-го (25xxxx) и 3-го (24xxxx) курсов. Выберите «Я студент 1-го курса».');
        return;
      }

      // 2. 2nd-years (25xxxx) and 3rd-years (24xxxx) CANNOT be mentees
      if ((yearPrefix === '25' || yearPrefix === '24') && selectedRole === 'mentee') {
        playSound('beep');
        setErrorMessage(`🛑 Студенты ${yearPrefix === '25' ? '2-го' : '3-го'} курса (${yearPrefix}xxxx) уже не являются первокурсниками! Программа подопечных рассчитана на набор 2026 года (26xxxx). Выберите «Я ментор (2–3 курс)»!`);
        return;
      }

      // 3. In AITU bachelor's is 3 years: 23xxxx and older are graduates/alumni
      const yearNum = parseInt(yearPrefix, 10);
      if (yearNum <= 23) {
        playSound('beep');
        setErrorMessage('🛑 В AITU трехгодичный бакалавриат (4-го курса нет). Выпускники набора 23xxxx и старше уже окончили университет.');
        return;
      }
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await sendEmailOtp(targetEmail, selectedRole);
      playSound('pop');
      triggerHaptic('medium');

      if (res.previewUrl) {
        setPreviewUrl(res.previewUrl);
      }

      setCountdown(60);
      setCanResend(false);
      setStep('otp_verify');
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    } catch (err: any) {
      setErrorMessage(err.message || 'Не удалось отправить код подтверждения');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP Digit Input & Auto-focus navigation
  const handleOtpChange = (index: number, value: string) => {
    const digit = value.slice(-1);
    if (value && !/^\d+$/.test(digit)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    if (digit && index === 5 && newDigits.every(d => d !== '')) {
      handleVerifyOtp(newDigits.join(''));
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
      handleVerifyOtp(pasted);
    } else {
      otpInputRefs.current[pasted.length]?.focus();
    }
  };

  // Submit OTP code for verification
  const handleVerifyOtp = async (codeStr: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      await verifyEmailOtp({
        email: email.trim().toLowerCase(),
        code: codeStr
      });
      playSound('success');
      triggerHaptic('success');

      // Next: Onboarding Profile Wizard
      if (selectedRole === 'mentee') {
        setStudentId(email.match(/^(\d+)/)?.[1] || '264977');
        setStep('onboarding_mentee');
      } else {
        setStep('onboarding_mentor');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Неверный или просроченный код');
      playSound('beep');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinishMenteeOnboarding = () => {
    if (!allRulesAccepted) {
      setErrorMessage('Пожалуйста, подтвердите согласие со всеми пунктами Кодекса студента');
      playSound('beep');
      return;
    }
    if (matchedMentorId) {
      selectAsMyMentor(matchedMentorId);
    }
    playSound('success');
    triggerConfetti();
    setStep('welcome_celebration');
  };

  const handleFinishMentorOnboarding = () => {
    if (!mentorName.trim()) {
      setErrorMessage('Пожалуйста, укажите ФИО ментора');
      playSound('beep');
      return;
    }

    const gpaNum = parseFloat(mentorGpa);
    if (isNaN(gpaNum) || gpaNum < 2.5 || gpaNum > 4.0) {
      setErrorMessage('Укажите корректный GPA от 2.5 до 4.0 (например, 3.85)');
      playSound('beep');
      return;
    }

    if (mentorBio.trim().length < 15) {
      setErrorMessage('Опишите подробнее, чем поможете подопечным (минимум 15 символов)');
      playSound('beep');
      return;
    }

    setErrorMessage(null);
    playSound('success');
    triggerConfetti();
    setStep('welcome_celebration');
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await sendEmailOtp(email.trim().toLowerCase(), selectedRole);
      if (res.previewUrl) {
        setPreviewUrl(res.previewUrl);
      }
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
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white min-h-[640px] rounded-3xl overflow-hidden relative select-none">
      {/* Background Ambient Glow */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top University Brand Header */}
      <div className="z-10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center font-black text-sm shadow-md shadow-blue-500/20 text-white">
            SM
          </div>
          <div>
            <h2 className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
              <span>AITU Mentorship</span>
            </h2>
            <p className="text-[10px] text-blue-300 font-medium">Студенческое наставничество</p>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5 text-blue-300 text-[10px] font-bold">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Peer Network</span>
        </div>
      </div>

      {/* Main Flow Canvas */}
      <div className="z-10 my-auto py-3 flex flex-col gap-4">
        {/* STEP 1: ROLE SELECTION CARDS */}
        {step === 'role_selection' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white leading-tight">
                Добро пожаловать в <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AITU</span>
              </h1>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Выберите ваш статус в университете для настройки персонального кабинета:
              </p>
            </div>

            {/* Role 1: Mentee (Student) */}
            <button
              onClick={() => {
                setSelectedRole('mentee');
                setStep('email_input');
                playSound('pop');
              }}
              className="p-4 bg-slate-900/90 hover:bg-slate-800/90 border border-blue-500/30 hover:border-blue-500 rounded-3xl text-left transition-all group cursor-pointer shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-start gap-3.5 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-white group-hover:text-blue-300 transition-colors">
                      Я студент 1-го курса
                    </h3>
                    <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-snug">
                    Найди личного ментора, получай помощь с лабами, ходи на лекции по высшмату и вливайся в студенческую жизнь.
                  </p>
                  <div className="flex items-center gap-2 mt-2.5">
                    <span className="bg-blue-500/15 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-blue-500/25">
                      Найти ментора
                    </span>
                    <span className="bg-blue-500/15 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-blue-500/25">
                      Лекции старшекурсников
                    </span>
                  </div>
                </div>
              </div>
            </button>

            {/* Role 2: Mentor (2nd & 3rd year students only) */}
            <button
              onClick={() => {
                setSelectedRole('mentor');
                setStep('email_input');
                playSound('pop');
              }}
              className="p-4 bg-slate-900/90 hover:bg-slate-800/90 border border-purple-500/30 hover:border-purple-500 rounded-3xl text-left transition-all group cursor-pointer shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-start gap-3.5 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-purple-500/30 group-hover:scale-105 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-white group-hover:text-purple-300 transition-colors">
                      Я ментор (2–3 курс)
                    </h3>
                    <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-snug">
                    Курируй подопечных студентов, проводи 1-on-1 созвоны в коворкинге C1, публикуй Stories и читай лекции.
                  </p>
                  <div className="flex items-center gap-2 mt-2.5">
                    <span className="bg-purple-500/15 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-purple-500/25">
                      2 курс (Основной состав)
                    </span>
                    <span className="bg-purple-500/15 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-purple-500/25">
                      3 курс (Тьюторы)
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* STEP 2: CORPORATE EMAIL INPUT */}
        {step === 'email_input' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <button
              onClick={() => {
                setStep('role_selection');
                setErrorMessage(null);
              }}
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-bold -ml-1 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Выбрать другую роль</span>
            </button>

            <div>
              <h2 className="text-xl font-black tracking-tight text-white">
                {selectedRole === 'mentee' ? 'Вход для студента 1-го курса' : 'Вход для ментора AITU (2–3 курс)'}
              </h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Введите студенческую почту <strong className="text-blue-300">@astanait.edu.kz</strong> для получения кода безопасности
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>Студенческая почта</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="264977@astanait.edu.kz"
                    required
                    className="w-full bg-slate-900/90 border border-slate-700 text-white text-xs rounded-xl px-3.5 py-3 focus:outline-none focus:border-blue-500 font-mono transition-colors placeholder:text-slate-500 shadow-inner"
                  />
                  {email.endsWith('@astanait.edu.kz') && (
                    <div className="absolute right-3 top-3 text-emerald-400 flex items-center gap-1 text-[10px] font-bold">
                      <Check className="w-3.5 h-3.5" />
                      <span>AITU ID</span>
                    </div>
                  )}
                </div>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5 animate-shake">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Отправить код на почту</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center gap-2 my-1">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Или быстрый вход</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => loginWithSSO(email || '264977@astanait.edu.kz')}
                className="p-3 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Microsoft 365</span>
              </button>

              <button
                onClick={loginWithTelegram}
                className="p-3 bg-[#2481CC]/80 hover:bg-[#2481CC] active:scale-[0.98] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <Bot className="w-4 h-4 text-sky-200" />
                <span>Telegram ID</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: OTP VERIFICATION */}
        {step === 'otp_verify' && (
          <div className="flex flex-col gap-4 animate-scale-in">
            <button
              onClick={() => {
                setStep('email_input');
                setErrorMessage(null);
              }}
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-bold -ml-1 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Изменить адрес почты</span>
            </button>

            <div>
              <h2 className="text-xl font-black tracking-tight text-white">Введите код подтверждения</h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                6-значный защитный код отправлен на почту <strong className="text-white font-mono">{email}</strong>
              </p>
            </div>

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
                      ? 'bg-blue-600/25 border-blue-400 text-white shadow-md shadow-blue-500/20 ring-2 ring-blue-400/50'
                      : 'bg-slate-900 border-slate-700 text-slate-400 focus:border-blue-500 focus:bg-slate-800 focus:ring-1 focus:ring-blue-500'
                  }`}
                />
              ))}
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              onClick={() => handleVerifyOtp(otpDigits.join(''))}
              disabled={isLoading || otpDigits.some(d => !d)}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Подтвердить код</span>
                </>
              )}
            </button>

            {previewUrl && (
              <div className="text-center mt-1">
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold inline-flex items-center gap-1 underline"
                >
                  <Mail className="w-3 h-3" />
                  <span>Просмотреть входящее письмо (Webmail Preview) ↗</span>
                </a>
              </div>
            )}

            <div className="text-center mt-1">
              {canResend ? (
                <button
                  onClick={handleResendCode}
                  className="text-xs text-blue-400 hover:text-blue-300 font-bold underline cursor-pointer"
                >
                  Запросить новый код на почту
                </button>
              ) : (
                <span className="text-[11px] text-slate-400 font-mono">
                  Повторная отправка через: <strong className="text-slate-200">{countdown} сек</strong>
                </span>
              )}
            </div>
          </div>
        )}

        {/* STEP 4A: ONBOARDING FOR MENTEE (WITH MAXIMUM FOOLPROOF & ETIQUETTE RULES) */}
        {step === 'onboarding_mentee' && (
          <div className="flex flex-col gap-3 animate-slide-up max-h-[580px] overflow-y-auto pr-1">
            <div>
              <div className="flex items-center gap-2 text-xs text-blue-400 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Шаг 2 из 3 · Настройка профиля</span>
              </div>
              <h2 className="text-lg font-black text-white mt-0.5">Анкета первокурсника AITU</h2>
            </div>

            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Имя и Фамилия</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    placeholder="Алишер Нургалиев"
                    required
                    className="w-full mt-1 bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500 font-sans"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Студенческий ID</label>
                  <input
                    type="text"
                    value={studentId}
                    readOnly
                    className="w-full mt-1 bg-slate-950 border border-slate-800 text-emerald-400 text-xs font-mono font-bold rounded-xl px-3 py-2.5 cursor-not-allowed"
                    title="ID привязан к вашей корпоративной почте"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Специальность</label>
                  <select
                    value={major}
                    onChange={e => setMajor(e.target.value)}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-2.5 py-2.5 focus:outline-none focus:border-blue-500 font-sans"
                  >
                    {majorsList.map(m => (
                      <option key={m.code} value={m.name}>{m.code} · {m.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Группа</label>
                  <input
                    type="text"
                    value={cohort}
                    onChange={e => setCohort(e.target.value.toUpperCase())}
                    placeholder="SE-2601"
                    className="w-full mt-1 bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500 font-mono uppercase font-bold"
                  />
                </div>
              </div>

              {/* Quick Cohort Selector Helper (Защита от опечаток) */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9px] text-slate-500 uppercase font-bold">Быстрый выбор:</span>
                {popularCohorts.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCohort(c)}
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                      cohort === c ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Match Senior Mentor */}
              <div className="pt-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1 flex items-center justify-between">
                  <span>Выбери личного ментора</span>
                  <span className="text-blue-400 font-normal">2–3 курс AITU</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {mentors.slice(0, 2).map(m => (
                    <div
                      key={m.id}
                      onClick={() => {
                        setMatchedMentorId(m.id);
                        playSound('pop');
                      }}
                      className={`p-2.5 rounded-2xl border cursor-pointer transition-all ${
                        matchedMentorId === m.id
                          ? 'bg-blue-600/20 border-blue-400 ring-2 ring-blue-500/40'
                          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-xl ${m.avatarColor} text-xs font-bold flex items-center justify-center flex-shrink-0`}>
                          {m.initials}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{m.name}</h4>
                          <span className="text-[9px] text-blue-300 block truncate">{m.major} · {m.year}</span>
                        </div>
                      </div>
                      <div className="mt-1.5 flex items-center justify-between text-[9px] text-slate-400">
                        <span>⭐ {m.rating}</span>
                        <span>{m.assignedMentees}/{m.maxMentees} мест</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FOOLPROOF PROTECTION: MANDATORY MENTORSHIP CODE OF CONDUCT */}
              <div className="p-3.5 bg-rose-950/30 border border-rose-500/40 rounded-2xl flex flex-col gap-2 shadow-inner">
                <div className="flex items-center gap-2 text-rose-300 text-xs font-black uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Кодекс студента (Обязательно подтвердить)</span>
                </div>
                <p className="text-[10px] text-slate-300 leading-snug">
                  Для защиты времени менторов подтвердите понимание правил:
                </p>

                <div className="space-y-2 mt-1">
                  <label className="flex items-start gap-2.5 text-left cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={ruleNoHomework}
                      onChange={e => setRuleNoHomework(e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4 accent-blue-600 cursor-pointer"
                    />
                    <span className="text-[11px] text-slate-200 leading-snug group-hover:text-white">
                      <strong>Ментор НЕ делает за меня лабы и дз.</strong> Ментор объясняет темы, логику и архитектуру, но код пишу я сам.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 text-left cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={ruleRespectTime}
                      onChange={e => setRuleRespectTime(e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4 accent-blue-600 cursor-pointer"
                    />
                    <span className="text-[11px] text-slate-200 leading-snug group-hover:text-white">
                      <strong>Уважаю время наставника:</strong> не спамлю ночью в нерабочие часы и предупреждаю об отмене 1-on-1 встреч минимум за 6 часов.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 text-left cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={ruleCampusOnly}
                      onChange={e => setRuleCampusOnly(e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4 accent-blue-600 cursor-pointer"
                    />
                    <span className="text-[11px] text-slate-200 leading-snug group-hover:text-white">
                      <strong>Формат встреч:</strong> только коворкинг C1 университета или онлайн через официальный Microsoft Teams.
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={handleFinishMenteeOnboarding}
              disabled={!studentName.trim() || !allRulesAccepted}
              className="w-full mt-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <span>{allRulesAccepted ? 'Завершить регистрацию' : 'Подтвердите 3 пункта кодекса выше'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 4B: ONBOARDING FOR MENTOR (MAX 3RD YEAR, MOSTLY 2ND YEAR) */}
        {step === 'onboarding_mentor' && (
          <div className="flex flex-col gap-3.5 animate-slide-up">
            <div>
              <div className="flex items-center gap-2 text-xs text-purple-400 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Шаг 2 из 3 · Профиль Ментора</span>
              </div>
              <h2 className="text-lg font-black text-white mt-1">Настройка кабинета наставника</h2>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">ФИО Ментора</label>
                <input
                  type="text"
                  value={mentorName}
                  onChange={e => setMentorName(e.target.value)}
                  placeholder="Алуа Серік"
                  required
                  className="w-full mt-1 bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Курс (2–3)</label>
                  <select
                    value={mentorYear}
                    onChange={e => setMentorYear(e.target.value as any)}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-2 py-2.5 focus:outline-none focus:border-purple-500 font-sans font-bold"
                  >
                    <option value="2nd year">2 курс (Основной состав)</option>
                    <option value="3rd year">3 курс (Старший тьютор)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">GPA (Мин 3.2)</label>
                  <input
                    type="text"
                    value={mentorGpa}
                    onChange={e => setMentorGpa(e.target.value)}
                    placeholder="3.92"
                    className="w-full mt-1 bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Трек</label>
                  <select
                    value={mentorSpecialty}
                    onChange={e => setMentorSpecialty(e.target.value as any)}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-2 py-2.5 focus:outline-none focus:border-purple-500 font-sans"
                  >
                    <option value="soft">Soft Mentor</option>
                    <option value="hard">Hard Tutor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Чем поможешь подопечным</label>
                <textarea
                  value={mentorBio}
                  onChange={e => setMentorBio(e.target.value)}
                  rows={2}
                  className="w-full mt-1 bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500 font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Формат проведения 1-on-1 встреч
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setMeetingFormat('both')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      meetingFormat === 'both' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    Оба формата
                  </button>
                  <button
                    type="button"
                    onClick={() => setMeetingFormat('offline')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      meetingFormat === 'offline' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    Коворкинг C1
                  </button>
                  <button
                    type="button"
                    onClick={() => setMeetingFormat('online')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      meetingFormat === 'online' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    MS Teams
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleFinishMentorOnboarding}
              disabled={!mentorName.trim()}
              className="w-full mt-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              <span>Завершить регистрацию ментора</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 5: CELEBRATION & WELCOME */}
        {step === 'welcome_celebration' && (
          <div className="flex flex-col items-center text-center gap-4 animate-scale-in py-4">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-blue-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/30">
              <CheckCheck className="w-10 h-10" />
            </div>

            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                Регистрация успешно завершена!
              </span>
              <h2 className="text-2xl font-black text-white mt-1">Добро пожаловать в семью AITU!</h2>
              <p className="text-xs text-slate-300 mt-2 max-w-xs mx-auto leading-relaxed">
                Твой аккаунт верифицирован. Твой личный ментор и чат группы уже ждут тебя на платформе.
              </p>
            </div>

            {/* Starter Gift Pill */}
            <div className="p-3 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-500/40 rounded-2xl flex items-center gap-3 w-full max-w-xs">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center flex-shrink-0">
                +100
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-amber-300 block">Стартовые AITU Coins</span>
                <span className="text-[10px] text-slate-300">Начислены за верификацию почты</span>
              </div>
            </div>

            <button
              onClick={() => {
                playSound('success');
                window.location.reload();
              }}
              className="w-full max-w-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 px-6 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <span>Перейти в приложение</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Verified AITU Accounts Direct Switcher */}
      <div className="z-10 border-t border-slate-800 pt-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Быстрый вход для тестирования:</span>
          </span>
          <span className="text-[9px] text-slate-500">1-Tap Switch</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {availableUsers.map(u => (
            <button
              key={u.id}
              onClick={() => handleQuickAccountSelect(u)}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <div className={`w-7 h-7 rounded-lg ${u.avatarColor} text-[10px] font-bold flex items-center justify-center flex-shrink-0 shadow-xs`}>
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
