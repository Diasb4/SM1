import React from 'react';
import { useApp } from '../../context/AppContext';
import { StoryTray } from '../stories/StoryTray';
import {
  Bell,
  MessageSquare,
  ChevronRight,
  Sparkles,
  Clock,
  BookOpen,
  Calendar,
  Award,
  Compass,
  Calculator,
  Building
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    myMentor,
    setSelectedMentorDetail,
    setMenteeView,
    events,
    notificationCount,
    openNotifications,
    t,
    hardLectures,
    openTicketModal,
    openOneOnOneModal
  } = useApp();

  const activeEvents = events.filter(e => !e.isCompleted);
  const primaryEvent = activeEvents[0];

  const featuredLecture = hardLectures[0];

  return (
    <div className="flex flex-col gap-5 pb-6">
      {/* Top Greeting Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
              {t.home.greeting} <span className="inline-block animate-bounce">👋</span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">{t.home.date}</p>
        </div>

        <button
          onClick={openNotifications}
          className="relative w-10 h-10 rounded-full bg-slate-100/80 hover:bg-slate-200/80 flex items-center justify-center text-slate-600 transition-colors shadow-xs"
        >
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white animate-pulse" />
          )}
        </button>
      </div>

      {/* Stories Tray */}
      <div>
        <StoryTray />
      </div>

      {/* AITU Guide 2.0 (@guideaitu2) Knowledge Hub Card */}
      <div
        onClick={() => setMenteeView('guide')}
        className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-4 text-white shadow-lg cursor-pointer hover:shadow-xl transition-all border border-indigo-500/30 flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform flex-shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-white">AITU Guide 2.0</h3>
              <span className="bg-blue-500/30 text-blue-300 text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-blue-400/30">
                Freshman Hub
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 flex items-center gap-2">
              <span className="flex items-center gap-1"><Calculator className="w-3 h-3 text-blue-400" /> GPA Calc</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Building className="w-3 h-3 text-indigo-400" /> Campus Map</span>
              <span>·</span>
              <span>Clubs</span>
            </p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 group-hover:text-white group-hover:bg-white/20 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* Featured Hard Lecture Banner (100 Seats & +50 Pts) */}
      {featuredLecture && (
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-4 text-white shadow-lg shadow-blue-600/15 flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="bg-white/20 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs">
              ⚡ +{featuredLecture.attendancePoints} {t.lectures.points}
            </span>
            <span className="text-[10px] text-blue-100 font-medium">
              {featuredLecture.totalSeats - featuredLecture.bookedSeats} {t.lectures.seatsLeft}
            </span>
          </div>

          <div>
            <h3 className="text-sm font-bold leading-snug">{featuredLecture.title}</h3>
            <p className="text-xs text-blue-100 mt-1 flex items-center gap-1.5">
              <span>{featuredLecture.lecturerName}</span>
              <span>·</span>
              <span>{featuredLecture.location}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            {featuredLecture.isBookedByMe ? (
              <button
                onClick={() => openTicketModal(featuredLecture)}
                className="w-full bg-white text-blue-900 hover:bg-blue-50 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <span>{featuredLecture.isCheckedIn ? t.lectures.checkedIn : t.lectures.viewTicket}</span>
              </button>
            ) : (
              <button
                onClick={() => setMenteeView('lectures')}
                className="w-full bg-white text-blue-900 hover:bg-blue-50 active:scale-[0.98] font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>{t.lectures.reserveSeat}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Your Soft Mentor Section */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-800 tracking-tight">{t.home.yourSoftMentor}</h2>
          <button
            onClick={() => {
              if (myMentor) setSelectedMentorDetail(myMentor);
            }}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
          >
            <span>{t.home.seeProfile}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {myMentor ? (
          <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${myMentor.avatarColor}`}
              >
                {myMentor.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-slate-900 text-sm truncate">{myMentor.name}</h3>
                  <span className="bg-purple-50 text-purple-700 text-[9px] font-bold px-2 py-0.5 rounded-full">
                    {myMentor.cohort}
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 font-normal">
                  {myMentor.quote || myMentor.tagline}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-50">
              <button
                onClick={() => setMenteeView('chat')}
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{t.home.message}</span>
              </button>

              <button
                onClick={() => openOneOnOneModal(myMentor)}
                className="bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Calendar className="w-3.5 h-3.5 text-purple-200" />
                <span>1-on-1 Chat</span>
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => setMenteeView('mentors')}
            className="bg-purple-50/70 border border-purple-100 rounded-3xl p-4 flex items-center justify-between cursor-pointer hover:bg-purple-100/60 transition-colors shadow-soft"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-xs font-bold text-purple-900">{t.home.chooseMentor}</p>
                <p className="text-[11px] text-purple-700">{t.home.pickHumanTag}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-purple-600" />
          </div>
        )}
      </div>

      {/* Dashboard of events Section */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-800 tracking-tight">{t.home.dashboardEvents}</h2>
          <button
            onClick={() => setMenteeView('events')}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
          >
            <span>{t.home.more}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {primaryEvent ? (
          <div
            onClick={() => setMenteeView('events')}
            className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft cursor-pointer hover:border-slate-200 transition-all flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-cyan-100 text-cyan-800 font-bold text-xs flex items-center justify-center">
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
            <div className="bg-slate-50 rounded-2xl px-3 py-2 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>{primaryEvent.deadlineWarning || t.home.activeAssignment}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400 font-mono text-[10px]">
                <Clock className="w-3 h-3" />
                <span>23:59</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-4 border border-slate-100 text-center text-xs text-slate-400">
            {t.home.noEventsToday}
          </div>
        )}
      </div>
    </div>
  );
};
