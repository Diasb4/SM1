import React from 'react';
import { useApp } from '../../context/AppContext';
import { StoryTray } from '../stories/StoryTray';
import { DailyCheckIn } from './DailyCheckIn';
import { Bell, MessageSquare, ChevronRight, Sparkles, Clock, AlertCircle } from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    myMentor,
    setSelectedMentorDetail,
    setMenteeView,
    events,
    notificationCount,
    clearNotifications
  } = useApp();

  const activeEvents = events.filter(e => !e.isCompleted);
  const primaryEvent = activeEvents[0];

  return (
    <div className="flex flex-col gap-5 pb-6">
      {/* Top Greeting Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
            Hi, Birzhan <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">Tuesday · 3 June</p>
        </div>

        <button
          onClick={clearNotifications}
          className="relative w-10 h-10 rounded-full bg-slate-100/80 hover:bg-slate-200/80 flex items-center justify-center text-slate-600 transition-colors"
        >
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
          )}
        </button>
      </div>

      {/* Stories Tray */}
      <div>
        <StoryTray />
      </div>

      {/* Daily Check-in Card */}
      <div>
        <DailyCheckIn />
      </div>

      {/* Your Soft Mentor Section */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-800 tracking-tight">Your soft mentor</h2>
          <button
            onClick={() => {
              if (myMentor) setSelectedMentorDetail(myMentor);
            }}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
          >
            <span>See profile</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {myMentor ? (
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft">
            <div className="flex items-start gap-3 mb-3">
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${myMentor.avatarColor}`}
              >
                {myMentor.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-slate-900 text-sm truncate">{myMentor.name}</h3>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 font-normal">
                  {myMentor.quote || myMentor.tagline}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setMenteeView('chat')}
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message</span>
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => setMenteeView('mentors')}
            className="bg-purple-50/70 border border-purple-100 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-purple-100/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-xs font-bold text-purple-900">Choose your Soft Mentor</p>
                <p className="text-[11px] text-purple-700">Pick the human, not the metric</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-purple-600" />
          </div>
        )}
      </div>

      {/* Dashboard of events Section */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-800 tracking-tight">Dashboard of events</h2>
          <button
            onClick={() => setMenteeView('events')}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
          >
            <span>More</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {primaryEvent ? (
          <div
            onClick={() => setMenteeView('events')}
            className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft cursor-pointer hover:border-slate-200 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-cyan-100 text-cyan-800 font-bold text-xs flex items-center justify-center">
                  {primaryEvent.mentorInitials}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{primaryEvent.title}</h3>
                  <p className="text-[11px] text-slate-500">{primaryEvent.mentorName}</p>
                </div>
              </div>
              {primaryEvent.timeDue && (
                <span className="text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded-full">
                  {primaryEvent.timeDue}
                </span>
              )}
            </div>

            {/* Bottom Alert bar */}
            <div className="bg-slate-50 rounded-xl px-3 py-2 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>{primaryEvent.deadlineWarning || 'Active assignment'}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400 font-mono text-[10px]">
                <Clock className="w-3 h-3" />
                <span>23:59</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-4 border border-slate-100 text-center text-xs text-slate-400">
            No upcoming events today.
          </div>
        )}
      </div>
    </div>
  );
};
