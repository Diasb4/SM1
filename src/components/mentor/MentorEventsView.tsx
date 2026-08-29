import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Plus, Users, Clock, MapPin, Check, X } from 'lucide-react';

export const MentorEventsView: React.FC = () => {
  const { events, toggleEventRegistration, addEvent } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newCategory, setNewCategory] = useState('Social');
  const [newDesc, setNewDesc] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addEvent({
      title: newTitle.trim(),
      description: newDesc.trim() || 'Join us for fun and mentoring discussions.',
      category: newCategory,
      mentorName: 'Aizhan Beibarys',
      mentorInitials: 'AB',
      timeText: newTime.trim() || 'This Friday · 18:00',
      totalSpots: 24
    });

    setNewTitle('');
    setNewTime('');
    setNewDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Events</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Offline socialisation events
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center shadow-md shadow-blue-600/20 transition-all"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Events List */}
      <div className="flex flex-col gap-3">
        {events.map(ev => {
          return (
            <div
              key={ev.id}
              className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft flex flex-col gap-3.5 hover:shadow-card transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 truncate">{ev.title}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{ev.timeText}</p>
                </div>
              </div>

              {/* Bottom Row: Attendees avatars + Spots & RSVP button */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    <div className="w-5 h-5 rounded-full bg-sky-200 ring-2 ring-white" />
                    <div className="w-5 h-5 rounded-full bg-purple-200 ring-2 ring-white" />
                    <div className="w-5 h-5 rounded-full bg-pink-200 ring-2 ring-white" />
                    <div className="w-5 h-5 rounded-full bg-emerald-200 ring-2 ring-white" />
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {ev.attendeesCount} going · {ev.totalSpots - ev.attendeesCount} spots
                  </span>
                </div>

                <button
                  onClick={() => toggleEventRegistration(ev.id)}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-all ${
                    ev.isRegistered
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                  }`}
                >
                  {ev.isRegistered ? 'I will go ✓' : 'Subscribe'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Create new event</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Event title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Board-games & pizza night"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Date & Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fri · 19:00 · C1 Lounge"
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Social">Social</option>
                  <option value="Sport">Sport</option>
                  <option value="Academic">Academic</option>
                  <option value="Wellbeing">Wellbeing</option>
                </select>
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-xl shadow-md shadow-blue-600/20"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
