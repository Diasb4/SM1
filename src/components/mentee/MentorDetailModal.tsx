import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  Check,
  Globe,
  Heart,
  Star,
  Award,
  GraduationCap,
  Users,
  MessageSquare,
  Calendar,
  Sparkles
} from 'lucide-react';

export const MentorDetailModal: React.FC = () => {
  const {
    selectedMentorDetail,
    setSelectedMentorDetail,
    selectAsMyMentor,
    setMenteeView,
    openOneOnOneModal,
    t
  } = useApp();

  if (!selectedMentorDetail) return null;

  const mentor = selectedMentorDetail;

  const handleSelectMentor = () => {
    selectAsMyMentor(mentor.id);
  };

  const handleOpenChat = () => {
    setSelectedMentorDetail(null);
    setMenteeView('chat');
  };

  const handleBookOneOnOne = () => {
    openOneOnOneModal(mentor);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-[430px] h-full sm:h-[92vh] sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl animate-slide-up">
        {/* Cover & Top Bar */}
        <div
          className={`h-40 bg-gradient-to-b ${mentor.coverGradient} p-4 flex flex-col justify-between relative flex-shrink-0`}
        >
          <div className="flex items-center justify-between z-10">
            <button
              onClick={() => setSelectedMentorDetail(null)}
              className="w-9 h-9 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-slate-700 hover:bg-white transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="bg-white/80 backdrop-blur-sm text-[10px] font-semibold text-slate-700 px-3 py-1 rounded-full border border-white/60">
              {mentor.coverTag}
            </span>
          </div>

          {/* Avatar & Select Button Row */}
          <div className="absolute -bottom-8 left-4 right-4 flex items-end justify-between">
            <div
              className={`w-18 h-18 rounded-full border-4 border-white flex items-center justify-center text-xl font-bold shadow-md ${mentor.avatarColor}`}
              style={{ width: '4.5rem', height: '4.5rem' }}
            >
              {mentor.initials}
            </div>

            {mentor.isYourMentor ? (
              <button
                disabled
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
                <span>{t.mentorCatalog.yourMentor}</span>
              </button>
            ) : (
              <button
                onClick={handleSelectMentor}
                className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all"
              >
                <span>{t.mentorCatalog.selectAsMentor}</span>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="pt-10 px-5 pb-6 flex-1 overflow-y-auto flex flex-col gap-5">
          {/* Header Info */}
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-slate-900">{mentor.name}</h1>
              <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{mentor.rating || 4.9} ({mentor.reviewCount || 16})</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{mentor.tagline}</p>

            <div className="flex items-center gap-1.5 flex-wrap mt-3">
              <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-slate-500" />
                <span>{mentor.year === '2nd year' ? '2 курс (Основной состав)' : '3 курс (Тьютор)'}</span>
              </span>

              {mentor.gpa && (
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg">
                  GPA {mentor.gpa}
                </span>
              )}

              <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                {mentor.track === 'hard' ? 'Hard Academic Tutor' : 'Soft Mentor'}
              </span>

              <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
                <Users className="w-3 h-3 text-blue-600" />
                <span>{mentor.cohort} · {mentor.assignedMentees}/{mentor.maxMentees}</span>
              </span>
            </div>
          </div>

          {/* How I Help Section */}
          {mentor.howIHelp && (
            <div className="bg-purple-50/80 border border-purple-100 rounded-2xl p-3.5 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-950">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Чем помогу первокурсникам:</span>
              </div>
              <p className="text-xs text-purple-900 leading-relaxed font-medium">
                {mentor.howIHelp}
              </p>
              <div className="text-[10px] text-purple-700 font-mono mt-1">
                Формат: {mentor.preferredFormat === 'offline' ? 'Офлайн в C1 коворкинге' : mentor.preferredFormat === 'online' ? 'Онлайн в Microsoft Teams' : 'Коворкинг C1 + MS Teams'}
              </div>
            </div>
          )}

          {/* Mentorship Code & Boundaries */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex flex-col gap-1 text-[11px] text-slate-600 leading-snug">
            <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              🛡️ Регламент наставничества:
            </span>
            <span>• Ментор <strong>не решает лабораторные</strong> за тебя, а помогает разобраться в сложных концепциях.</span>
            <span>• Тихие часы: не писать в личные сообщения после 22:00.</span>
            <span>• Встречи проводятся только в коворкинге C1 кампуса или в Teams.</span>
          </div>

          {/* 1-on-1 Advisory Booking Highlight Card */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-purple-950">Запись на 1-on-1 встречу</h4>
                <p className="text-[10px] text-purple-700">20 минут личной консультации</p>
              </div>
            </div>
            <button
              onClick={handleBookOneOnOne}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              Записаться
            </button>
          </div>

          {/* About */}
          <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-3.5">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">{t.mentorCatalog.about}</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">{mentor.about}</p>
          </div>

          {/* Languages */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.mentorCatalog.languages}</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {mentor.languages.map(lang => (
                <span
                  key={lang}
                  className="bg-white border border-slate-200 text-slate-700 text-xs font-medium px-3 py-1 rounded-xl shadow-xs"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Hobbies & Interests */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
              <Heart className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.mentorCatalog.hobbies}</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {mentor.hobbies.map(hobby => (
                <span
                  key={hobby}
                  className="bg-white border border-slate-200 text-slate-700 text-xs font-medium px-3 py-1 rounded-xl shadow-xs"
                >
                  {hobby}
                </span>
              ))}
            </div>
          </div>

          {/* On campus */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
              <Star className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.mentorCatalog.onCampus}</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {mentor.onCampus.map(item => (
                <span
                  key={item}
                  className="bg-white border border-slate-200 text-slate-700 text-xs font-medium px-3 py-1 rounded-xl shadow-xs"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
              <Award className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.mentorCatalog.achievements}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {mentor.achievements.map(ach => (
                <div
                  key={ach}
                  className="flex items-center gap-2 text-xs text-slate-700 bg-white border border-slate-100 p-2.5 rounded-xl shadow-xs"
                >
                  <Star className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <span>{ach}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Message CTA */}
          <div className="pt-2">
            <button
              onClick={handleOpenChat}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t.home.message} in cohort chat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
