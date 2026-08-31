import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Heart,
  LayoutGrid,
  Lock,
  LogOut,
  ChevronRight,
  Sparkles,
  Smartphone,
  Globe,
  Sun,
  Moon,
  Calendar,
  Clock
} from 'lucide-react';
import { Language } from '../../i18n/translations';

export const MenteeProfileView: React.FC = () => {
  const {
    currentUser,
    openAuthModal,
    myMentor,
    setSelectedMentorDetail,
    setRole,
    triggerConfetti,
    language,
    setLanguage,
    themeMode,
    setThemeMode,
    oneOnOneBookings,
    t
  } = useApp();

  const [showPwaModal, setShowPwaModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleInstallPin = () => {
    setShowPwaModal(true);
    triggerConfetti();
  };

  const langNames: Record<Language, string> = {
    kz: 'Қазақ тілі (KZ)',
    ru: 'Русский язык (RU)',
    en: 'English (EN)'
  };

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Title */}
      <div className="pt-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{t.profile.title}</h1>
        <button
          onClick={openAuthModal}
          className="text-xs text-blue-600 font-bold bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors"
        >
          Сменить аккаунт
        </button>
      </div>

      {/* Main Profile Info Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl ${currentUser.avatarColor} font-bold text-lg flex items-center justify-center shadow-xs`}>
            {currentUser.initials}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-slate-900 truncate">
              {currentUser.name}
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5 truncate">
              {currentUser.email}
            </p>
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              <span className="bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                {currentUser.role}
              </span>
              <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                ID: {currentUser.studentId}
              </span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                GPA {currentUser.gpa}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 1-on-1 Bookings section if any booked */}
      {oneOnOneBookings.length > 0 && (
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span>Upcoming 1-on-1 Sessions</span>
            </h3>
            <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {oneOnOneBookings.length}
            </span>
          </div>

          {oneOnOneBookings.map(b => (
            <div key={b.id} className="bg-purple-50/50 p-3 rounded-2xl border border-purple-100 flex flex-col gap-1 text-xs">
              <div className="flex items-center justify-between font-bold text-purple-950">
                <span>{b.topic}</span>
                <span className="text-emerald-700 bg-emerald-100 text-[10px] px-2 py-0.5 rounded-full">Confirmed</span>
              </div>
              <p className="text-[11px] text-slate-600">With {b.mentorName} · {b.location}</p>
              <p className="text-[10px] font-mono text-purple-700 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{b.dateStr} · {b.timeSlot}</span>
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Settings / Links List */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden divide-y divide-slate-100">
        {/* Language Picker */}
        <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{t.profile.language}</p>
              <p className="text-[11px] text-blue-600 font-medium">{langNames[language]}</p>
            </div>
          </div>

          <select
            value={language}
            onChange={e => setLanguage(e.target.value as Language)}
            className="bg-slate-100 text-xs font-bold rounded-xl px-2.5 py-1.5 border border-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="kz">Қазақша</option>
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </div>

        {/* Theme Picker */}
        <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              {themeMode === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{t.profile.theme}</p>
              <p className="text-[11px] text-slate-500">{themeMode === 'light' ? t.profile.light : t.profile.dark}</p>
            </div>
          </div>

          <button
            onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
            className="bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded-xl px-3 py-1.5 border border-slate-200"
          >
            Toggle
          </button>
        </div>

        {/* Microsoft SSO */}
        <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{t.profile.verifiedMicrosoft}</p>
              <p className="text-[11px] text-emerald-600 font-mono">254977@astanait.edu.kz</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Soft Mentor link */}
        <div
          onClick={() => {
            if (myMentor) setSelectedMentorDetail(myMentor);
          }}
          className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{t.profile.softMentor}</p>
              <p className="text-[11px] text-slate-500">{myMentor?.name || 'Amina Sergazina'}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Install / Pin app */}
        <div
          onClick={handleInstallPin}
          className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <LayoutGrid className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{t.profile.installPin}</p>
              <p className="text-[11px] text-slate-500">PWA Add to Home Screen</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Privacy & data */}
        <div
          onClick={() => setShowPrivacyModal(true)}
          className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
              <Lock className="w-4 h-4 text-slate-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{t.profile.privacyData}</p>
              <p className="text-[11px] text-slate-500">Voluntary sharing policy</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Sign Out Button */}
      <button
        onClick={() => {
          if (confirm('Switch to Soft Mentor role demo?')) {
            setRole('mentor');
          }
        }}
        className="w-full bg-white hover:bg-rose-50 border border-rose-100 text-rose-600 font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-soft transition-colors mt-1"
      >
        <LogOut className="w-4 h-4" />
        <span>{t.profile.signOut}</span>
      </button>

      {/* Footer Info */}
      <div className="text-center pt-2">
        <p className="text-[10px] font-mono text-slate-400">
          AITU Mentorship Platform · v1.0.0 · Astana IT University
        </p>
      </div>

      {/* PWA Info Modal */}
      {showPwaModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Pin to Home Screen</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              On iOS: Tap <span className="font-bold">Share</span> and select <span className="font-bold">Add to Home Screen</span>.
              <br />
              On Android: Tap the three dots menu and select <span className="font-bold">Install app</span>.
            </p>
            <button
              onClick={() => setShowPwaModal(false)}
              className="mt-5 w-full bg-slate-900 text-white font-semibold py-2.5 rounded-xl text-xs"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-2">{t.profile.privacyData}</h3>
            <p className="text-xs text-slate-600 leading-relaxed space-y-2">
              Your daily check-ins are strictly private. Mentors only receive aggregated trends or items you explicitly choose to share during 1-on-1 sessions.
            </p>
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="mt-5 w-full bg-slate-900 text-white font-semibold py-2.5 rounded-xl text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
