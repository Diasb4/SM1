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
  Building
} from 'lucide-react';
import { playSound } from '../../utils/audio';

interface OneOnOneBookingModalProps {
  mentor: Mentor;
  onClose: () => void;
}

export const OneOnOneBookingModal: React.FC<OneOnOneBookingModalProps> = ({ mentor, onClose }) => {
  const { t, triggerHaptic, triggerConfetti, bookOneOnOneSession, currentUser } = useApp();

  const [topic, setTopic] = useState<string>(t.oneOnOne?.topicElective || 'Выбор элективов и трека');
  const [selectedSlot, setSelectedSlot] = useState<string>('Tomorrow · 16:30 – 16:50');
  const [meetingFormat, setMeetingFormat] = useState<MeetingFormat>('offline');
  const [location, setLocation] = useState<string>(t.oneOnOne?.locCoworking || 'C1 Coworking (1st floor)');
  const [notes, setNotes] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const topics = useMemo(() => [
    t.oneOnOne?.topicElective || 'Выбор элективов и трека',
    t.oneOnOne?.topicStress || 'Стресс перед сессией и дедлайны',
    t.oneOnOne?.topicCareer || 'Карьера, стажировки и хакатоны',
    t.oneOnOne?.topicCampusLife || 'Жизнь в кампусе и клубы'
  ], [t]);

  const slots = useMemo(() => [
    'Tomorrow · 16:30 – 16:50',
    'Tomorrow · 17:00 – 17:20',
    'Thursday · 15:30 – 15:50',
    'Friday · 18:00 – 18:20'
  ], []);

  const offlineLocations = useMemo(() => [
    { label: 'C1 Coworking (1st floor)', icon: Building },
    { label: 'AkiTime Coffee (Campus)', icon: Coffee },
    { label: 'Library Silent Area (C1.2)', icon: MapPin },
    { label: 'Central Courtyard', icon: MapPin }
  ], []);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
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
    }, 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-white/20 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs">
              1-on-1 Mentorship
            </span>
          </div>

          <h2 className="text-base font-bold leading-tight">{t.oneOnOne?.title || 'Запись на 1-на-1 встречу'}</h2>
          <p className="text-xs text-purple-100 mt-1">С ментором {mentor.name} ({mentor.major})</p>
        </div>

        {isSuccess ? (
          <div className="p-8 flex flex-col items-center justify-center text-center gap-3 animate-fade-in my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Встреча подтверждена!</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-[240px]">
              {meetingFormat === 'online_teams'
                ? 'Ссылка на Microsoft Teams добавлена во вкладку События.'
                : `Ждем вас в ${location} в назначенное время.`}
            </p>
          </div>
        ) : (
          <form onSubmit={handleBooking} className="p-5 flex-1 overflow-y-auto flex flex-col gap-4">
            {/* Format Switcher */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-800">Формат встречи</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMeetingFormat('offline')}
                  className={`p-2.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    meetingFormat === 'offline'
                      ? 'bg-purple-50 text-purple-700 border-purple-300 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  <Coffee className="w-4 h-4 text-purple-600" />
                  <span>Офлайн в кампусе</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMeetingFormat('online_teams')}
                  className={`p-2.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    meetingFormat === 'online_teams'
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-300 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  <Video className="w-4 h-4 text-indigo-600" />
                  <span>Microsoft Teams</span>
                </button>
              </div>
            </div>

            {/* Topics */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-800">Тема консультации</label>
              <div className="grid grid-cols-1 gap-1.5">
                {topics.map(top => (
                  <button
                    key={top}
                    type="button"
                    onClick={() => setTopic(top)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                      topic === top
                        ? 'bg-purple-600 text-white font-bold border-purple-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {top}
                  </button>
                ))}
              </div>
            </div>

            {/* Slots */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-purple-600" />
                <span>Доступные слоты (20 мин)</span>
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {slots.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                      selectedSlot === slot
                        ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
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
                <label className="text-xs font-bold text-slate-800">Локация в кампусе</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {offlineLocations.map(loc => (
                    <button
                      key={loc.label}
                      type="button"
                      onClick={() => setLocation(loc.label)}
                      className={`p-2 rounded-xl border text-[11px] font-medium flex items-center gap-1.5 transition-all truncate ${
                        location === loc.label
                          ? 'bg-purple-50 text-purple-700 font-bold border-purple-300'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      <loc.icon className="w-3.5 h-3.5 flex-shrink-0 text-purple-600" />
                      <span className="truncate">{loc.label.split('(')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-800">Вопрос или комментарий (опционально)</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Напишите кратко, о чем хотите спросить ментора..."
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-3 focus:outline-none focus:bg-white focus:border-purple-500 transition-colors placeholder:text-slate-400 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition-all cursor-pointer active:scale-[0.98] mt-1"
            >
              <Sparkles className="w-4 h-4" />
              <span>Забронировать встречу</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
