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
  Bot
} from 'lucide-react';
import { MenteeView, MentorView, HardMentorView } from '../../types';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const {
    role,
    setRole,
    menteeView,
    setMenteeView,
    mentorView,
    setMentorView,
    hardMentorView,
    setHardMentorView,
    isTelegramMode,
    setIsTelegramMode
  } = useApp();

  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-2 sm:p-6 font-sans">
      {/* Top Demo Control Toolbar */}
      <header className="w-full max-w-4xl mb-4 bg-slate-900/90 border border-slate-800 backdrop-blur-md rounded-2xl p-3 px-4 flex flex-wrap items-center justify-between gap-3 shadow-xl z-40">
        {/* Brand & Telegram Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
            AM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white tracking-tight">AITU Mentorship</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30 font-mono flex items-center gap-1">
                <Bot className="w-3 h-3 text-sky-400" />
                <span>TMA Ready</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Soft Mentors & Hard Academic Lectures (100 spots)</p>
          </div>
        </div>

        {/* Center: 3-Role Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 flex-wrap gap-1">
          <button
            onClick={() => setRole('mentee')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              role === 'mentee'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>👨‍🎓 Mentee</span>
          </button>
          <button
            onClick={() => setRole('mentor')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              role === 'mentor'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>👩‍🏫 Soft Mentor</span>
          </button>
          <button
            onClick={() => setRole('hard_mentor')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              role === 'hard_mentor'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>📐 Hard Mentor (Ayan)</span>
          </button>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Mockup Screen Jump */}
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
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3 py-1.5 border border-slate-700 focus:outline-none cursor-pointer"
          >
            {role === 'mentee' ? (
              <>
                <option value="home">📱 1. Home (Mentee)</option>
                <option value="lectures">📐 2. Hard Lectures (Calculus 100 spots)</option>
                <option value="mentors">🔍 3. Choose Soft Mentor</option>
                <option value="chat">💬 4. Group Chat</option>
                <option value="events">📅 5. Events</option>
                <option value="profile">👤 6. Profile & SSO</option>
                <option value="skeleton">⏳ 7. Skeleton Loader</option>
                <option value="offline_error">⚠️ 8. 503 Offline Error</option>
              </>
            ) : role === 'hard_mentor' ? (
              <>
                <option value="my_lectures">📐 1. Lecturer Desk & Roster</option>
                <option value="scanner">📷 2. QR Attendance Scanner</option>
              </>
            ) : (
              <>
                <option value="community">👥 1. Community & Signals</option>
                <option value="stories">✨ 2. Stories Manager</option>
                <option value="weekly_report">📝 3. Weekly DSEW Report</option>
                <option value="events">📅 4. Events Manager</option>
                <option value="profile">👤 5. Mentor Profile</option>
              </>
            )}
          </select>

          {/* Telegram Mode Toggle */}
          <button
            onClick={() => setIsTelegramMode(!isTelegramMode)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              isTelegramMode
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Toggle Telegram Mini App Container"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>TMA</span>
          </button>

          {/* Phone Frame Toggle */}
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
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
          className={`w-full bg-slate-50 text-slate-900 flex flex-col relative overflow-hidden transition-all duration-300 ${
            isPhoneFrame
              ? 'rounded-[44px] shadow-[0_25px_70px_rgba(0,0,0,0.6)] border-[8px] border-slate-800 min-h-[780px]'
              : 'rounded-3xl shadow-2xl border border-slate-800 min-h-[85vh]'
          }`}
        >
          {/* Telegram WebApp Header Bar (when in TMA mode) */}
          {isTelegramMode && (
            <div className="bg-[#242F3D] text-white px-4 py-2 flex items-center justify-between text-xs font-medium select-none shadow-xs">
              <div className="flex items-center gap-2">
                <button className="text-white/70 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold">AITU Mentorship</span>
                  <span className="text-[10px] text-white/50 font-mono">@aitumentor_bot</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <MoreVertical className="w-4 h-4 cursor-pointer hover:text-white" />
              </div>
            </div>
          )}

          {/* iOS Status Bar */}
          {!isTelegramMode && (
            <div className="pt-3 px-6 pb-2 flex items-center justify-between text-slate-900 select-none">
              <span className="text-xs font-bold font-mono">9:41</span>
              {isPhoneFrame && (
                <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto -mt-1 shadow-inner flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-slate-800/80 mr-6" />
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-950/70 ring-1 ring-blue-900/40" />
                </div>
              )}
              <div className="flex items-center gap-1.5 text-slate-800">
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4" />
              </div>
            </div>
          )}

          {/* Main App Content Area */}
          <main className="flex-1 px-4 py-2 overflow-y-auto no-scrollbar flex flex-col">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
