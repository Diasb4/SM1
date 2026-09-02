import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Mentor, MeetingFormat } from '../../types';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  Coffee,
  Video,
  Building,
  ShieldAlert,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import { playSound } from '../../utils/audio';

interface OneOnOneBookingModalProps {
  mentor: Mentor;
  onClose: () => void;
}

export const OneOnOneBookingModal: React.FC<OneOnOneBookingModalProps> = ({ mentor, onClose }) => {
  const { t, triggerHaptic, triggerConfetti, bookOneOnOneSession, currentUser, oneOnOneBookings } = useApp();

  const [topic, setTopic] = useState<string>(t.oneOnOne?.topicElective || 'Выбор элективов и трека');
  const [selectedSlot, setSelectedSlot] = useState<string>('Tomorrow · 16:30 – 16:50');
  const [meetingFormat, setMeetingFormat] = useState<MeetingFormat>('offline');
  const [location, setLocation] = useState<string>(t.oneOnOne?.locCoworking || 'C1 Coworking (1st floor)');
  const [notes, setNotes] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // FOOLPROOF: Check if mentee already has an active confirmed booking with this mentor
  const hasActiveBooking = useMemo(() => {
    return oneOnOneBookings.some(
      b => b.mentorId === mentor.id && b.status === 'confirmed'
    );
  }, [oneOnOneBookings, mentor.id]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const topics = useMemo(() => [
    'Разбор темы / лабы (Calculus / OOP)',
    'Выбор элективов и специализации',
    'Стресс перед дедлайнами и сессией',
    'Хакатоны, олимпиады и стажировки',
    'Жизнь в кампусе, общага и клубы'
  ], []);

  const slots = useMemo(() => [
    'Завтра · 16:30 – 16:50 (Коворкинг C1)',
    'Завтра · 17:00 – 17:20 (Коворкинг C1)',
    'Четверг · 15:30 – 15:50 (Коворкинг C1)',
    'Пятница · 18:00 – 18:20 (MS Teams)'
  ], []);

  const offlineLocations = useMemo(() => [
    { label: 'C1 Coworking (1st floor)', icon: Building },
    { label: 'AkiTime Coffee (Campus)', icon: Coffee },
    { label: 'Library Silent Area (C1.2)', icon: MapPin }
  ], []);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (hasActiveBooking) {
      playSound('beep');
      setErrorMessage('У вас уже есть активная запланированная встреча с этим ментором. Проведите текущую встречу перед созданием новой.');
      return;
    }

    // FOOLPROOF: Freshers must formulate their specific question (min 10 characters)
    if (notes.trim().length < 10) {
      playSound('beep');
      setErrorMessage('Пожалуйста, опишите конкретный вопрос к ментору подробнее (минимум 10 символов). Ментор должен понимать, к чему готовиться.');
      return;
    }

    setErrorMessage(null);

    bookOneOnOneSession({
      mentorId: mentor.id,
      mentorName: mentor.name,
      studentId: currentUser.studentId,
      studentName: currentUser.name,
      dateStr: selectedSlot.split('·')[0].trim(),
      timeSlot: selectedSlot.split('·')[1]?.trim() || '16:30',
      topic,
      format: meetingFormat,
      location: meetingFormat === 'online_teams' ? 'Microsoft Teams Meeting' : location,
      notes: notes.trim(),
      status: 'confirmed'
    });

    playSound('success');
    triggerHaptic('success');
    triggerConfetti();
    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 2200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 select-none"
    >
      <div className="bg-slate-900 border border-slate-800 text-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-white/20 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs">
              1-on-1 Mentorship Session
            </span>
          </div>

          <h2 className="text-base font-black leading-tight">Запись на 1-на-1 встречу</h2>
          <p className="text-xs text-purple-100 mt-1">
            С ментором <strong className="text-white">{mentor.name}</strong> ({mentor.major} · {mentor.year})
          </p>
        </div>

        {isSuccess ? (
          <div className="p-8 flex flex-col items-center justify-center text-center gap-3 animate-fade-in my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-base font-bold text-white">Встреча подтверждена!</h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-[260px]">
              {meetingFormat === 'online_teams'
                ? 'Ссылка на созвон в Microsoft Teams добавлена во вкладку События.'
                : `Ждем тебя в ${location} в назначенное время. Не опаздывай!`}
            </p>
          </div>
        ) : (
          <form onSubmit={handleBooking} className="p-5 flex-1 overflow-y-auto flex flex-col gap-3.5">
            {/* Active Booking Limit Warning */}
            {hasActiveBooking && (
              <div className="p-3 bg-amber-500/15 border border-amber-500/30 rounded-2xl flex items-start gap-2 text-amber-300 text-xs">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">
                  У тебя уже есть подтвержденная встреча с {mentor.name}. Дождись ее проведения или отмени в календаре.
                </span>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-2xl flex items-start gap-2 text-rose-300 text-xs animate-shake">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMessage}</span>
              </div>
            )}

            {/* Format Switcher */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Формат встречи</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMeetingFormat('offline')}
                  className={`p-2.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    meetingFormat === 'offline'
                      ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border-slate-800'
                  }`}
                >
                  <Coffee className="w-4 h-4 text-purple-300" />
                  <span>Коворкинг C1</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMeetingFormat('online_teams')}
                  className={`p-2.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    meetingFormat === 'online_teams'
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border-slate-800'
                  }`}
                >
                  <Video className="w-4 h-4 text-indigo-300" />
                  <span>Microsoft Teams</span>
                </button>
              </div>
            </div>

            {/* Topics */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Направление консультации</label>
              <div className="grid grid-cols-1 gap-1.5">
                {topics.map(top => (
                  <button
                    key={top}
                    type="button"
                    onClick={() => setTopic(top)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                      topic === top
                        ? 'bg-blue-600 text-white font-bold border-blue-400 shadow-xs'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                  >
                    {top}
                  </button>
                ))}
              </div>
            </div>

            {/* Slots */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>Слоты ментора (20 минут)</span>
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {slots.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                      selectedSlot === slot
                        ? 'bg-purple-600 text-white font-bold border-purple-400 shadow-xs'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Location (if offline) */}
            {meetingFormat === 'offline' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">Локация в кампусе</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {offlineLocations.map(loc => (
                    <button
                      key={loc.label}
                      type="button"
                      onClick={() => setLocation(loc.label)}
                      className={`p-2 rounded-xl border text-[11px] font-medium flex items-center gap-1.5 transition-all truncate cursor-pointer ${
                        location === loc.label
                          ? 'bg-purple-600/30 text-purple-300 font-bold border-purple-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      <loc.icon className="w-3.5 h-3.5 flex-shrink-0 text-purple-400" />
                      <span className="truncate">{loc.label.split('(')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mandatory Notes / Question Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Суть твоего вопроса (Обязательно)</span>
                <span className={`text-[10px] ${notes.trim().length >= 10 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {notes.trim().length}/10 мин. символов
                </span>
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Конкретно напиши, в чем сложность: например, не получается решить задачу №4 по интегралам или вопрос по адаптации..."
                rows={2}
                required
                className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-slate-500 resize-none shadow-inner font-sans"
              />
            </div>

            {/* Mentorship Etiquette Notice */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-start gap-2.5 text-[10px] text-slate-400">
              <ShieldAlert className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
              <div className="leading-snug">
                <strong className="text-slate-200">Правило наставничества:</strong> Ментор не делает за тебя лабы. Не опаздывай — бронь сгорает через 7 минут после начала.
              </div>
            </div>

            <button
              type="submit"
              disabled={hasActiveBooking || notes.trim().length < 10}
              className="w-full mt-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              <span>{hasActiveBooking ? 'У вас уже есть запись' : 'Забронировать встречу'}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
