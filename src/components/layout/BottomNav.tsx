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
  Layers
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
    setHardMentorView
  } = useApp();

  if (role === 'mentee') {
    const menteeTabs: { id: MenteeView; label: string; icon: React.FC<{ className?: string }> }[] = [
      { id: 'home', label: 'Home', icon: Home },
      { id: 'mentors', label: 'Soft Mentors', icon: Users },
      { id: 'lectures', label: 'Hard Lectures', icon: BookOpen },
      { id: 'events', label: 'Events', icon: Calendar },
      { id: 'chat', label: 'Chat', icon: MessageSquare },
      { id: 'profile', label: 'Profile', icon: User }
    ];

    return (
      <div className="sticky bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 px-2 py-2 flex items-center justify-around z-30">
        {menteeTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = menteeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setMenteeView(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
                isActive ? 'text-blue-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className="text-[9px] leading-tight text-center">{tab.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (role === 'hard_mentor') {
    return (
      <div className="sticky bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 px-3 py-2 flex items-center justify-around z-30">
        <button
          onClick={() => setHardMentorView('my_lectures')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            hardMentorView === 'my_lectures' ? 'text-blue-600 font-bold scale-105' : 'text-slate-400'
          }`}
        >
          <BookOpen className="w-5 h-5 stroke-[2]" />
          <span className="text-[10px]">Lectures</span>
        </button>

        <button
          onClick={() => setHardMentorView('scanner')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            hardMentorView === 'scanner' ? 'text-blue-600 font-bold scale-105' : 'text-slate-400'
          }`}
        >
          <QrCode className="w-5 h-5 stroke-[2]" />
          <span className="text-[10px]">QR Check-in</span>
        </button>
      </div>
    );
  }

  // Soft Mentor role tabs
  const mentorTabs: { id: MentorView; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'community', label: 'Cohort', icon: Users },
    { id: 'stories', label: 'Stories', icon: Sparkles },
    { id: 'weekly_report', label: 'Reports', icon: FileText },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 px-3 py-2 flex items-center justify-around z-30">
      {mentorTabs.map(tab => {
        const Icon = tab.icon;
        const isActive = mentorView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setMentorView(tab.id)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              isActive ? 'text-purple-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-600 font-medium'
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
