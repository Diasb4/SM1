import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Smartphone,
  Monitor,
  Sparkles,
  Layers,
  Wifi,
  Battery,
  AlertTriangle,
  Send,
  MoreVertical,
  X,
  Bot,
  Globe,
  Sun,
  Moon,
  Bell
} from 'lucide-react';
import { MenteeView, MentorView, HardMentorView } from '../../types';
import { Language } from '../../i18n/translations';
import { AuthModal } from '../auth/AuthModal';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const {
    role,
    setRole,
    currentUser,
    openAuthModal,
    menteeView,
    setMenteeView,
    mentorView,
    setMentorView,
    hardMentorView,
    setHardMentorView,
    isTelegramMode,
    setIsTelegramMode,
    language,
    setLanguage,
    t,
    themeMode,
    setThemeMode,
    notificationCount,
    openNotifications
  } = useApp();

  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  const langList: { code: Language; label: string }[] = [
    { code: 'kz', label: 'ҚАЗ' },
    { code: 'ru', label: 'РУС' },
    { code: 'en', label: 'ENG' }
  ];

  return (
    <div className={`min-h-screen ${themeMode === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'} flex flex-col items-center justify-start p-2 sm:p-6 font-sans transition-colors duration-200`}>
      {/* Top Demo Control Toolbar */}
      <header className={`w-full max-w-4xl mb-4 ${themeMode === 'dark' ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white/95 border-slate-200 text-slate-900 shadow-sm'} border backdrop-blur-md rounded-2xl p-3 px-4 flex flex-wrap items-center justify-between gap-3 z-40 transition-colors`}>
        {/* Brand & Telegram Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
            AM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-bold text-sm tracking-tight ${themeMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t.appName}</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30 font-mono flex items-center gap-1">
                <Bot className="w-3 h-3 text-sky-500 dark:text-sky-400" />
                <span>TMA Ready</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.tagline}</p>
          </div>
        </div>

        {/* Center: 3-Role Switcher */}
        <div className={`flex items-center ${themeMode === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'} p-1 rounded-xl border flex-wrap gap-1`}>
          <button
            onClick={() => setRole('mentee')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              role === 'mentee'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>{t.roles.mentee}</span>
          </button>
          <button
            onClick={() => setRole('mentor')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              role === 'mentor'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>{t.roles.mentor}</span>
          </button>
          <button
            onClick={() => setRole('hard_mentor')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              role === 'hard_mentor'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>{t.roles.hardMentor}</span>
          </button>
        </div>

        {/* Right Tools: Language, Notification, Theme & View Jumper */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Language Switcher Pills */}
          <div className={`flex items-center ${themeMode === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'} p-0.5 rounded-xl border`}>
            {langList.map(item => (
              <button
                key={item.code}
                onClick={() => setLanguage(item.code)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  language === item.code
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* User Account & Role Badge Button */}
          <button
            onClick={openAuthModal}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl ${themeMode === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'} border text-xs font-bold transition-all shadow-xs cursor-pointer`}
            title="AITU SSO & Profile Settings"
          >
            <div className={`w-5 h-5 rounded-md ${currentUser.avatarColor} flex items-center justify-center text-[9px] font-bold text-white`}>
              {currentUser.initials}
            </div>
            <span className="max-w-[80px] sm:max-w-[120px] truncate">{currentUser.name.split(' ')[0]}</span>
            <span className="text-[9px] bg-blue-600/80 text-white px-1 rounded font-mono uppercase">
              {currentUser.role}
            </span>
          </button>

          {/* Theme Mode Toggle */}
          <button
            onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
            className={`p-1.5 rounded-xl ${themeMode === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'} transition-colors border`}
            title={`Switch to ${themeMode === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {themeMode === 'light' ? <Moon className="w-4 h-4 text-purple-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Notification Button */}
          <button
            onClick={openNotifications}
            className={`relative p-1.5 rounded-xl ${themeMode === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'} transition-colors border`}
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-pulse">
                {notificationCount}
              </span>
            )}
          </button>

          {/* Screen Jump */}
          <select
            value={
              role === 'mentee' ? menteeView : role === 'hard_mentor' ? hardMentorView : mentorView
            }
            onChange={e => {
              const val = e.target.value;
              if (role === 'mentee') {
                setMenteeView(val as MenteeView);
              } else if (role === 'hard_mentor') {
                setHardMentorView(val as HardMentorView);
              } else {
                setMentorView(val as MentorView);
              }
            }}
            aria-label="Jump directly to screen"
            className={`${themeMode === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'} text-xs font-semibold rounded-xl px-2.5 py-1.5 border focus:outline-none cursor-pointer`}
          >
            {role === 'mentee' ? (
              <>
                <option value="home">📱 1. {t.nav.home}</option>
                <option value="lectures">📐 2. {t.nav.lectures} (100 spots)</option>
                <option value="mentors">🔍 3. {t.nav.mentors}</option>
                <option value="chat">💬 4. {t.nav.chat}</option>
                <option value="events">📅 5. {t.nav.events}</option>
                <option value="profile">👤 6. {t.nav.profile}</option>
                <option value="skeleton">⏳ 7. Skeleton Loader</option>
                <option value="offline_error">⚠️ 8. 503 Offline Error</option>
              </>
            ) : role === 'hard_mentor' ? (
              <>
                <option value="my_lectures">📐 1. {t.lecturerDesk.title}</option>
                <option value="scanner">📷 2. {t.lecturerDesk.scannerTitle}</option>
              </>
            ) : (
              <>
                <option value="community">👥 1. {t.nav.community}</option>
                <option value="stories">✨ 2. {t.nav.stories}</option>
                <option value="analytics">📊 3. Кабинет ментора</option>
                <option value="events">📅 4. {t.nav.events}</option>
                <option value="profile">👤 5. {t.nav.profile}</option>
              </>
            )}
          </select>

          {/* Telegram Mode Toggle */}
          <button
            onClick={() => setIsTelegramMode(!isTelegramMode)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              isTelegramMode
                ? 'bg-sky-500/20 text-sky-600 dark:text-sky-300 border-sky-500/40'
                : themeMode === 'dark' ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
            title="Toggle Telegram Mini App Container"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>TMA</span>
          </button>

          {/* Phone Frame Toggle */}
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className={`p-1.5 rounded-xl ${themeMode === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'} transition-colors border`}
            title={isPhoneFrame ? 'Switch to Expanded View' : 'Switch to Phone Frame'}
          >
            {isPhoneFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Container / Mobile Mockup */}
      <div
        className={`w-full transition-all duration-300 flex justify-center ${
          isPhoneFrame ? 'max-w-[420px]' : 'max-w-2xl'
        }`}
      >
        <div
          className={`w-full ${
            themeMode === 'dark' ? 'dark bg-[#0E1621] text-slate-100 border-slate-800 shadow-[0_25px_70px_rgba(0,0,0,0.6)]' : 'bg-slate-50 text-slate-900 border-slate-300 shadow-xl'
          } flex flex-col relative overflow-hidden transition-all duration-300 ${
            isPhoneFrame
              ? 'rounded-[44px] border-[8px] min-h-[780px]'
              : 'rounded-3xl border min-h-[85vh]'
          }`}
        >
          {/* Telegram WebApp Header Bar (when in TMA mode) */}
          {isTelegramMode && (
            <div className="bg-[#242F3D] text-white px-4 py-2.5 flex items-center justify-between text-xs font-medium select-none shadow-xs">
              <div className="flex items-center gap-2">
                <button className="text-white/70 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold">{t.appName}</span>
                  <span className="text-[10px] text-white/50 font-mono">{t.botUsername}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <button
                  onClick={() => setLanguage(language === 'kz' ? 'ru' : language === 'ru' ? 'en' : 'kz')}
                  className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-white hover:bg-white/20"
                >
                  {language.toUpperCase()}
                </button>
                <MoreVertical className="w-4 h-4 cursor-pointer hover:text-white" />
              </div>
            </div>
          )}

          {/* iOS Status Bar */}
          {!isTelegramMode && (
            <div className={`pt-3 px-6 pb-2 flex items-center justify-between ${themeMode === 'dark' ? 'text-white' : 'text-slate-900'} select-none`}>
              <span className="text-xs font-bold font-mono">9:41</span>
              {isPhoneFrame && (
                <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto -mt-1 shadow-inner flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-slate-800/80 mr-6" />
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-950/70 ring-1 ring-blue-900/40" />
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4" />
              </div>
            </div>
          )}

          {/* Main App Content Area */}
          <main className="flex-1 px-4 py-2 overflow-y-auto no-scrollbar flex flex-col">
            {children}
          </main>

          {/* Global Authentication Modal */}
          <AuthModal />
        </div>
      </div>
    </div>
  );
};
