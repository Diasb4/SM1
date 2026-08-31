import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Users,
  Calendar,
  MessageSquare,
  User,
  Sparkles,
  FileText,
  BookOpen,
  QrCode,
  Compass
} from 'lucide-react';
import { MenteeView, MentorView, HardMentorView } from '../../types';

export const BottomNav: React.FC = () => {
  const {
    role,
    menteeView,
    setMenteeView,
    mentorView,
    setMentorView,
    hardMentorView,
    setHardMentorView,
    t,
    themeMode
  } = useApp();

  const isDark = themeMode === 'dark';

  if (role === 'mentee') {
    const menteeTabs: { id: MenteeView; label: string; icon: React.FC<{ className?: string }> }[] = [
      { id: 'home', label: t.nav.home, icon: Home },
      { id: 'lectures', label: t.nav.lectures, icon: BookOpen },
      { id: 'guide', label: 'Guide 2.0', icon: Compass },
      { id: 'mentors', label: t.nav.mentors, icon: Users },
      { id: 'chat', label: t.nav.chat, icon: MessageSquare },
      { id: 'profile', label: t.nav.profile, icon: User }
    ];

    return (
      <div className={`sticky bottom-0 left-0 right-0 ${isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-100'} backdrop-blur-md border-t px-2 py-2 flex items-center justify-around z-30 transition-colors`}>
        {menteeTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = menteeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setMenteeView(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-1.5 rounded-xl transition-all ${
                isActive
                  ? 'text-blue-600 font-bold scale-105'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200 font-medium'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className="text-[9px] leading-tight text-center whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (role === 'hard_mentor') {
    return (
      <div className={`sticky bottom-0 left-0 right-0 ${isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-100'} backdrop-blur-md border-t px-3 py-2 flex items-center justify-around z-30 transition-colors`}>
        <button
          onClick={() => setHardMentorView('my_lectures')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            hardMentorView === 'my_lectures' ? 'text-blue-600 font-bold scale-105' : 'text-slate-400'
          }`}
        >
          <BookOpen className="w-5 h-5 stroke-[2]" />
          <span className="text-[10px] font-semibold">{t.lecturerDesk.title}</span>
        </button>

        <button
          onClick={() => setHardMentorView('scanner')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            hardMentorView === 'scanner' ? 'text-blue-600 font-bold scale-105' : 'text-slate-400'
          }`}
        >
          <QrCode className="w-5 h-5 stroke-[2]" />
          <span className="text-[10px] font-semibold">{t.nav.scanner}</span>
        </button>
      </div>
    );
  }

  // Soft Mentor role tabs
  const mentorTabs: { id: MentorView; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'community', label: t.nav.community, icon: Users },
    { id: 'stories', label: t.nav.stories, icon: Sparkles },
    { id: 'weekly_report', label: t.nav.reports, icon: FileText },
    { id: 'events', label: t.nav.events, icon: Calendar },
    { id: 'profile', label: t.nav.profile, icon: User }
  ];

  return (
    <div className={`sticky bottom-0 left-0 right-0 ${isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-100'} backdrop-blur-md border-t px-3 py-2 flex items-center justify-around z-30 transition-colors`}>
      {mentorTabs.map(tab => {
        const Icon = tab.icon;
        const isActive = mentorView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setMentorView(tab.id)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              isActive
                ? 'text-purple-600 font-bold scale-105'
                : isDark
                ? 'text-slate-400 hover:text-slate-200 font-medium'
                : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px]">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
