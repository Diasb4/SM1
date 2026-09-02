import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  Users,
  Calendar,
  Star,
  TrendingUp,
  CheckCircle2,
  Clock,
  Sparkles,
  MessageSquare,
  Plus,
  Video,
  MapPin,
  FileSpreadsheet,
  BookOpen,
  Award
} from 'lucide-react';
import { playSound } from '../../utils/audio';

export const MentorAnalyticsView: React.FC = () => {
  const { setMentorView, currentUser, oneOnOneBookings, mentors, t, triggerConfetti, triggerHaptic } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'mentees_list' | 'session_notes'>('overview');
  const [noteMenteeName, setNoteMenteeName] = useState('');
  const [noteTopic, setNoteTopic] = useState('');
  const [noteSummary, setNoteSummary] = useState('');
  const [savedNotes, setSavedNotes] = useState([
    {
      id: 'n-1',
      menteeName: 'Алишер Нургалиев (SE-2401)',
      topic: 'Подготовка к мидтерму по Calculus 1 & выбор клуба',
      summary: 'Разобрали пределы и производные. Посоветовал вступить в GDG AITU и записаться на субботнюю лекцию Аяна.',
      date: 'Сегодня, 14:30'
    },
    {
      id: 'n-2',
      menteeName: 'Диана Сагитова (CS-2402)',
      topic: 'Адаптация в общежитии и тайм-менеджмент',
      summary: 'Поделился гайдом по LMS/Platonus, помог составить график подготовки к дедлайнам по Java.',
      date: 'Вчера, 16:00'
    }
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const menteesList = [
    { id: 'm1', name: 'Алишер Нургалиев', group: 'SE-2401', major: 'Software Engineering', gpa: '3.82', status: 'Активен', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30', lastMeeting: 'Сегодня' },
    { id: 'm2', name: 'Диана Сагитова', group: 'CS-2402', major: 'Computer Science', gpa: '3.90', status: 'Отлично', statusColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30', lastMeeting: 'Вчера' },
    { id: 'm3', name: 'Биржан Жанболатұлы', group: 'SE-2401', major: 'Software Engineering', gpa: '3.75', status: 'Консультация', statusColor: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30', lastMeeting: '3 дня назад' },
    { id: 'm4', name: 'Камила Мусина', group: 'CY-2401', major: 'Cybersecurity', gpa: '3.95', status: 'Отлично', statusColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30', lastMeeting: '5 дней назад' },
    { id: 'm5', name: 'Ернар Асылбеков', group: 'ITM-2401', major: 'IT Management', gpa: '3.60', status: 'Активен', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30', lastMeeting: '1 неделя назад' }
  ];

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteMenteeName || !noteTopic || !noteSummary) return;

    const newNote = {
      id: `n-${Date.now()}`,
      menteeName: noteMenteeName,
      topic: noteTopic,
      summary: noteSummary,
      date: 'Только что'
    };

    setSavedNotes([newNote, ...savedNotes]);
    setNoteMenteeName('');
    setNoteTopic('');
    setNoteSummary('');

    playSound('success');
    triggerConfetti();
    triggerHaptic('success');
    setToastMessage('Заметка о встрече с подопечным успешно сохранена');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExportRoster = () => {
    playSound('pop');
    triggerConfetti();
    setToastMessage('Список подопечных успешно экспортирован в CSV/Excel');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="flex-1 flex flex-col gap-4 pb-8 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => setMentorView('community')}
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1 text-xs font-bold transition-all cursor-pointer shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Назад</span>
        </button>

        <h1 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>Кабинет Ментора</span>
        </h1>

        <button
          onClick={handleExportRoster}
          className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200 dark:border-purple-500/40 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Экспорт</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-slide-down">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* KPI Stats Grid - Stitched cleanly so numbers and text never collide */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3 bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Подопечные</span>
            <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="mt-2 flex flex-col">
            <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">{menteesList.length}</span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-1">активных студентов</span>
          </div>
        </div>

        <div className="p-3 bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">1-on-1 Сессии</span>
            <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="mt-2 flex flex-col">
            <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">18</span>
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold mt-1">в этом месяце</span>
          </div>
        </div>

        <div className="p-3 bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Рейтинг</span>
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          </div>
          <div className="mt-2 flex flex-col">
            <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">4.96</span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mt-1">24 отзыва</span>
          </div>
        </div>

        <div className="p-3 bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Адаптация</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-2 flex flex-col">
            <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">96%</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">высокая когорта</span>
          </div>
        </div>
      </div>

      {/* Tabs Selector - Clean segmented pill controls with truncate protection */}
      <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 gap-1 shadow-2xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 px-1 rounded-xl text-[11px] font-bold transition-all truncate text-center ${
            activeTab === 'overview'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Обзор
        </button>
        <button
          onClick={() => setActiveTab('mentees_list')}
          className={`flex-1 py-2 px-1 rounded-xl text-[11px] font-bold transition-all truncate text-center ${
            activeTab === 'mentees_list'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Студенты ({menteesList.length})
        </button>
        <button
          onClick={() => setActiveTab('session_notes')}
          className={`flex-1 py-2 px-1 rounded-xl text-[11px] font-bold transition-all truncate text-center ${
            activeTab === 'session_notes'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Заметки
        </button>
      </div>

      {/* TAB 1: OVERVIEW & UPCOMING SESSIONS */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-4 animate-fade-in">
          {/* Upcoming 1-on-1 Sessions */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Ближайшие 1-on-1 встречи</span>
              </h3>
              <span className="text-[10px] text-purple-700 dark:text-purple-300 font-bold bg-purple-50 dark:bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-500/20">
                2 записи
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="p-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-2xs">
                    АН
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">Алишер Нургалиев</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                      <span className="truncate">C1 (Блок 3) · Пт, 16:00</span>
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-500/30 flex-shrink-0">
                  Подтверждено
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-purple-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-2xs">
                    ДС
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">Диана Сагитова</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                      <Video className="w-3 h-3 text-blue-600 flex-shrink-0" />
                      <span className="truncate">MS Teams · Сб, 14:00</span>
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 text-[10px] font-bold border border-blue-200 dark:border-blue-500/30 flex-shrink-0">
                  Онлайн
                </span>
              </div>
            </div>
          </div>

          {/* Quick Mentee Adaptation Radar */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Адаптация когорты SE-2401</span>
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-300">Успеваемость и лабы (OOP & Math)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">92%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-300">Посещаемость кураторских часов</span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold">98%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '98%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-300">Участие в клубах и хакатонах</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">85%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MENTEES LIST */}
      {activeTab === 'mentees_list' && (
        <div className="flex flex-col gap-2 animate-fade-in">
          {menteesList.map(mentee => (
            <div
              key={mentee.id}
              className="p-3 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-2.5 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-2xs">
                  {mentee.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{mentee.name}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">{mentee.group}</span>
                    <span>·</span>
                    <span>GPA: {mentee.gpa}</span>
                  </div>
                </div>
              </div>

              <div className="text-right flex flex-col items-end gap-0.5 flex-shrink-0">
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold border ${mentee.statusColor}`}>
                  {mentee.status}
                </span>
                <span className="text-[9px] text-slate-400 dark:text-slate-500">Встреча: {mentee.lastMeeting}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: LOG SESSION NOTES */}
      {activeTab === 'session_notes' && (
        <div className="flex flex-col gap-4 animate-fade-in">
          {/* Form */}
          <form onSubmit={handleSaveNote} className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 flex flex-col gap-3 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Plus className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Добавить заметку о встрече</span>
            </h3>

            <div>
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Подопечный</label>
              <input
                type="text"
                value={noteMenteeName}
                onChange={e => setNoteMenteeName(e.target.value)}
                placeholder="Имя студента (например: Алишер Нургалиев)"
                required
                className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500 font-sans shadow-inner placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Тема беседы</label>
              <input
                type="text"
                value={noteTopic}
                onChange={e => setNoteTopic(e.target.value)}
                placeholder="Например: Выбор элективов / Подготовка к дедлайнам"
                required
                className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500 font-sans shadow-inner placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Итоги и рекомендации</label>
              <textarea
                value={noteSummary}
                onChange={e => setNoteSummary(e.target.value)}
                rows={3}
                placeholder="Краткие тезисы беседы и договоренности на следующую неделю..."
                required
                className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500 font-sans shadow-inner placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Сохранить заметку</span>
            </button>
          </form>

          {/* Past Notes List */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">История заметок</h4>
            {savedNotes.map(note => (
              <div key={note.id} className="p-3.5 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col gap-1.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-700 dark:text-purple-300">{note.menteeName}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{note.date}</span>
                </div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white">{note.topic}</h5>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">{note.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
