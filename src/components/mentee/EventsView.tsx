import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, ChevronRight, Check, Calendar, MapPin, Clock } from 'lucide-react';

export const EventsView: React.FC = () => {
  const { events, toggleEventRegistration, setMenteeView } = useApp();

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
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Events</h1>
          <p className="text-xs text-slate-500 font-medium">
            {activeEvents.length} active · {completedEvents.length} done · from Ruslan
          </p>
        </div>
      </div>

      {/* Active Events */}
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
      </div>

      {/* Completed Events Section */}
      {completedEvents.length > 0 && (
        <div className="mt-4 flex flex-col gap-2.5">
          <h2 className="text-xs font-bold text-slate-700 tracking-tight">Completed</h2>

          <div className="flex flex-col gap-3">
            {completedEvents.map(event => (
              <div
                key={event.id}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft flex items-center justify-between gap-3 opacity-80"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-800 line-through decoration-slate-300">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-slate-100 text-slate-500 text-[10px] font-medium px-2 py-0.5 rounded-md">
                        {event.category}
                      </span>
                      <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                        Done
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
