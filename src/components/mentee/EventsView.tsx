import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Calendar,
  MapPin,
  Clock,
  Video,
  ExternalLink,
  Users,
  CheckCircle2,
  XCircle,
  Coffee
} from 'lucide-react';
import { playSound } from '../../utils/audio';

export const EventsView: React.FC = () => {
  const {
    events,
    toggleEventRegistration,
    setMenteeView,
    oneOnOneBookings,
    updateBookingStatus,
    t
  } = useApp();

  const [activeTab, setActiveTab] = useState<'meetings' | 'cohort_events'>('meetings');

  const activeEvents = events.filter(e => !e.isCompleted);
  const completedEvents = events.filter(e => e.isCompleted);

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Top Header */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => setMenteeView('home')}
          className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">{t.nav.events}</h1>
          <p className="text-xs text-slate-500 font-medium">
            {oneOnOneBookings.length} встреч 1-на-1 · {activeEvents.length} событий потока
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
        <button
          onClick={() => setActiveTab('meetings')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'meetings'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-purple-600" />
          <span>1-on-1 Встречи ({oneOnOneBookings.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('cohort_events')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'cohort_events'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span>События потока ({activeEvents.length})</span>
        </button>
      </div>

      {/* Tab 1: 1-on-1 Mentorship Meetings */}
      {activeTab === 'meetings' && (
        <div className="flex flex-col gap-3">
          {oneOnOneBookings.map(booking => {
            const isTeams = booking.format === 'online_teams' || booking.teamsLink;

            return (
              <div
                key={booking.id}
                className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shadow-xs">
                      {booking.mentorName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs font-bold text-slate-900">{booking.topic}</h3>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          booking.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : booking.status === 'completed'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-rose-50 text-rose-600'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">Ментор: <strong className="text-slate-700">{booking.mentorName}</strong></p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 ${
                    isTeams ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {isTeams ? <Video className="w-3 h-3 text-indigo-600" /> : <Coffee className="w-3 h-3 text-amber-600" />}
                    <span>{isTeams ? 'MS Teams' : 'Офлайн'}</span>
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{booking.dateStr} · {booking.timeSlot}</span>
                  </span>
                  <span className="flex items-center gap-1.5 font-medium text-slate-700 truncate max-w-[140px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{booking.location}</span>
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  {booking.teamsLink ? (
                    <a
                      href={booking.teamsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Войти в Microsoft Teams</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        playSound('success');
                        alert(`Встреча в ${booking.location}. Ментор уведомлен(а)!`);
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Посмотреть локацию</span>
                    </button>
                  )}

                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'completed')}
                      className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1 border border-emerald-200 transition-colors"
                      title="Mark Completed"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Завершено</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {oneOnOneBookings.length === 0 && (
            <div className="text-center py-10 bg-white rounded-3xl border border-slate-100 p-6 flex flex-col items-center gap-2">
              <Users className="w-8 h-8 text-purple-400" />
              <h4 className="text-xs font-bold text-slate-800">Нет запланированных 1-on-1 встреч</h4>
              <p className="text-[11px] text-slate-500 max-w-xs">
                Выберите ментора из каталога и забронируйте удобный слот офлайн или в Microsoft Teams.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Cohort Events */}
      {activeTab === 'cohort_events' && (
        <div className="flex flex-col gap-3">
          {activeEvents.map(event => (
            <div
              key={event.id}
              onClick={() => toggleEventRegistration(event.id)}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft cursor-pointer hover:border-slate-200 transition-all flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                    event.isRegistered
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 group-hover:border-slate-400 bg-white'
                  }`}
                >
                  {event.isRegistered && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-900">{event.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                      {event.category}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{event.timeText}</span>
                    </span>
                  </div>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </div>
          ))}

          {completedEvents.length > 0 && (
            <div className="mt-2 flex flex-col gap-2">
              <h4 className="text-xs font-bold text-slate-500">Завершенные</h4>
              {completedEvents.map(event => (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl p-3 px-4 border border-slate-100 shadow-2xs flex items-center justify-between opacity-70"
                >
                  <span className="text-xs font-bold text-slate-700 line-through">{event.title}</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Done</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
