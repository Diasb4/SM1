import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Pencil,
  ShieldCheck,
  Heart,
  Star,
  LogOut,
  ChevronRight,
  Sparkles,
  Globe,
  Sun,
  Moon
} from 'lucide-react';
import { Language } from '../../i18n/translations';

export const MentorProfileView: React.FC = () => {
  const { currentUser, openAuthModal, logout, setRole, language, setLanguage, themeMode, setThemeMode, t } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [tagline, setTagline] = useState('Your campus navigator. Debate nerd, terrible at chess.');

  const langNames: Record<Language, string> = {
    kz: 'Қазақ тілі (KZ)',
    ru: 'Русский язык (RU)',
    en: 'English (EN)'
  };

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Title */}
      <div className="pt-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{t.profile.title}</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">How mentees see you</p>
        </div>
        <button
          onClick={openAuthModal}
          className="text-xs text-purple-600 font-bold bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200 hover:bg-purple-100 transition-colors"
        >
          Сменить аккаунт
        </button>
      </div>

      {/* Main Mentor Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl ${currentUser.avatarColor} font-bold text-lg flex items-center justify-center shadow-xs`}>
            {currentUser.initials}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-slate-900 truncate">{currentUser.name}</h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5 truncate">
              {currentUser.email}
            </p>
            <div className="flex items-center gap-1.5 flex-wrap mt-2">
              <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                {currentUser.role}
              </span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                AITU Certified Mentor
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit My Mentor Profile Button */}
      <button
        onClick={() => setIsEditing(!isEditing)}
        className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-soft transition-all"
      >
        <Pencil className="w-3.5 h-3.5 text-slate-500" />
        <span>{isEditing ? 'Close editor' : 'Edit my mentor profile'}</span>
      </button>

      {/* Inline Editor */}
      {isEditing && (
        <div className="bg-white rounded-3xl p-4 border border-blue-200 shadow-soft animate-fade-in flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-800">Your profile tagline</label>
          <input
            type="text"
            value={tagline}
            onChange={e => setTagline(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setIsEditing(false)}
            className="mt-1 bg-slate-900 text-white font-semibold py-2 rounded-xl text-xs"
          >
            Save changes
          </button>
        </div>
      )}

      {/* Navigation Rows */}
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

        {/* Microsoft Identity */}
        <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{t.profile.verifiedMicrosoft}</p>
              <p className="text-[11px] text-emerald-600 font-mono">a.beibarys@astanaitu.edu.kz</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Well-being pool */}
        <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Well-being pool</p>
              <p className="text-[11px] text-slate-500">21/24 mentees enrolled</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Mentee reviews */}
        <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Star className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Mentee reviews</p>
              <p className="text-[11px] text-slate-500">4.9 · 16 reviews</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Sign Out Button */}
      <button
        onClick={logout}
        className="w-full bg-white hover:bg-rose-50 border border-rose-100 text-rose-600 font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-soft transition-colors mt-1 cursor-pointer"
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
    </div>
  );
};
