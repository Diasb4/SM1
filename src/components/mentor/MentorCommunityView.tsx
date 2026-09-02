import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MENTEE_AVATARS_LIST } from '../../data/mockData';
import {
  Heart,
  MessageSquare,
  Sparkles,
  Send,
  UserCheck,
  ChevronRight,
  Calendar,
  Clock,
  Plus,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Users
} from 'lucide-react';
import { playSound } from '../../utils/audio';

export const MentorCommunityView: React.FC = () => {
  const { menteeSignals, setMentorView, setMenteeView, currentUser, setRole, triggerConfetti, triggerHaptic } = useApp();
  const [selectedMentee, setSelectedMentee] = useState<any | null>(null);
  const [noteText, setNoteText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    playSound('pop');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSendPrivateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim() || !selectedMentee) return;
    playSound('success');
    triggerConfetti();
    triggerHaptic('success');
    showToast(`Личное сообщение отправлено студенту ${selectedMentee.name}!`);
    setNoteText('');
    setSelectedMentee(null);
  };

  return (
    <div className="flex flex-col gap-4 pb-8 select-none animate-fade-in">
      {/* Top Mentor Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider">AITU Soft Mentor</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-0.5">
            Моя группа <span className="text-purple-600 dark:text-purple-400">SE-2401</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            21 студент · 100% первокурсников на связи
          </p>
        </div>

        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-purple-600/25 border border-purple-400/30 flex-shrink-0">
          {currentUser.initials || 'AB'}
        </div>
      </div>

      {/* Quick Action Bento Grid */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => {
            setMentorView('stories');
            playSound('pop');
          }}
          className="p-3 bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800/90 border border-slate-200 dark:border-purple-500/30 rounded-2xl flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer group shadow-xs"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200">Stories & Опросы</span>
        </button>

        <button
          onClick={() => {
            setMentorView('analytics');
            playSound('pop');
          }}
          className="p-3 bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800/90 border border-slate-200 dark:border-blue-500/30 rounded-2xl flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer group shadow-xs"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200">Кабинет & Заметки</span>
        </button>

        <button
          onClick={() => {
            setRole('mentee');
            setMenteeView('chat');
            playSound('pop');
          }}
          className="p-3 bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800/90 border border-slate-200 dark:border-emerald-500/30 rounded-2xl flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer group shadow-xs"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MessageSquare className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200">Чат когорты</span>
        </button>
      </div>

      {/* Peer Mentorship Value Banner */}
      <div className="bg-purple-50 dark:bg-gradient-to-r dark:from-purple-950/60 dark:to-indigo-950/60 border border-purple-200 dark:border-purple-500/30 rounded-3xl p-3.5 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-600/15 dark:bg-purple-600/30 flex items-center justify-center flex-shrink-0 text-purple-700 dark:text-purple-300">
            <Heart className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-purple-950 dark:text-white">Пул подопечных первокурсников</h4>
            <p className="text-[11px] text-purple-900/80 dark:text-slate-300 leading-relaxed mt-0.5 font-normal">
              Здесь собраны добровольные сигналы и запросы на помощь от твоих студентов. Проводи регулярные 1-on-1 созвоны в коворкинге C1.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Signals & Requests from Freshers */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Активность и запросы студентов</span>
          </h2>
          <span className="text-[10px] text-purple-700 dark:text-purple-300 font-bold bg-purple-50 dark:bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-500/20">
            {menteeSignals.length} сигнала
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {menteeSignals.map(sig => (
            <div
              key={sig.id}
              className="bg-white dark:bg-slate-900/90 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs flex items-center justify-between gap-3 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shadow-xs flex-shrink-0 ${sig.avatarColor}`}
                >
                  {sig.initials}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">{sig.menteeName}</h3>
                    {sig.type === 'talk_request' && (
                      <span className="bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                        Запрос 1-on-1
                      </span>
                    )}
                    {sig.type === 'rsvp' && (
                      <span className="bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                        Идет на воркшоп
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">{sig.actionText}</p>
                </div>
              </div>

              {sig.type === 'talk_request' ? (
                <button
                  onClick={() => {
                    setSelectedMentee({ name: sig.menteeName, initials: sig.initials });
                    playSound('pop');
                  }}
                  className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md shadow-purple-600/20 transition-all cursor-pointer flex-shrink-0"
                >
                  Ответить
                </button>
              ) : (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono flex-shrink-0">{sig.timeAgo}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Your 21 Mentees Roster Grid */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Все подопечные (21)</h2>
          </div>
          <button
            onClick={() => showToast('Открыт групповой тред объявления')}
            className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors cursor-pointer"
          >
            Написать всем
          </button>
        </div>

        {/* Avatars Grid */}
        <div className="grid grid-cols-7 gap-2">
          {MENTEE_AVATARS_LIST.map((m, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedMentee(m);
                playSound('pop');
              }}
              className="flex flex-col items-center gap-1 group cursor-pointer"
              title={m.name}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-bold transition-transform group-hover:scale-110 shadow-xs ${m.bg}`}
              >
                {m.initials}
              </div>
            </button>
          ))}
          {/* +3 overflow indicator */}
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-[10px] flex items-center justify-center border border-slate-200 dark:border-slate-700">
            +3
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-slate-900 border border-purple-500/40 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl z-50 animate-slide-down flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mentee Dialog Modal */}
      {selectedMentee && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 max-w-sm w-full shadow-2xl text-slate-900 dark:text-white animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-md flex-shrink-0">
                {selectedMentee.initials}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">{selectedMentee.name}</h3>
                <p className="text-[11px] text-blue-600 dark:text-blue-300 font-mono truncate">Студент 1-го курса · SE-2401</p>
              </div>
            </div>

            <form onSubmit={handleSendPrivateNote}>
              <textarea
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder={`Написать личное сообщение или пригласить на 1-on-1 студента ${selectedMentee.name}...`}
                rows={3}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs rounded-xl p-3 focus:outline-none focus:border-purple-500 font-sans shadow-inner placeholder:text-slate-400"
              />
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setSelectedMentee(null)}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={!noteText.trim()}
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl disabled:opacity-50 shadow-md shadow-purple-600/25 transition-all cursor-pointer"
                >
                  Отправить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
