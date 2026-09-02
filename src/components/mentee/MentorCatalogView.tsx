import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Mentor } from '../../types';
import { Search, Sparkles, UserCheck, Users, Calendar, Star } from 'lucide-react';

export const MentorCatalogView: React.FC = () => {
  const { mentors, setSelectedMentorDetail, openOneOnOneModal, t } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('for_you');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = useMemo(() => [
    { id: 'for_you', label: t.mentorCatalog.forYou },
    { id: 'my_major', label: t.mentorCatalog.myMajor },
    { id: 'creative', label: t.mentorCatalog.creative },
    { id: 'sport', label: t.mentorCatalog.sport },
    { id: 'star', label: t.mentorCatalog.star }
  ], [t]);

  const filteredMentors = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return mentors.filter(mentor => {
      const matchesCategory =
        activeCategory === 'for_you' ||
        mentor.category === activeCategory ||
        (activeCategory === 'star' && (mentor.rating || 0) >= 4.9);
      if (!matchesCategory) return false;

      if (!q) return true;
      return (
        mentor.name.toLowerCase().includes(q) ||
        mentor.major.toLowerCase().includes(q) ||
        mentor.tags.some(tag => tag.toLowerCase().includes(q))
      );
    });
  }, [mentors, activeCategory, searchQuery]);

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Title Header */}
      <div className="pt-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{t.mentorCatalog.title}</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          {t.mentorCatalog.subtitle}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={t.mentorCatalog.searchPlaceholder}
          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors placeholder:text-slate-400"
        />
      </div>

      {/* Mentor Cards List */}
      <div className="flex flex-col gap-4">
        {filteredMentors.map(mentor => {
          return (
            <div
              key={mentor.id}
              onClick={() => setSelectedMentorDetail(mentor)}
              className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-soft cursor-pointer hover:shadow-card hover:border-slate-200 transition-all duration-200 flex flex-col"
            >
              {/* Pastel Cover Area */}
              <div
                className={`h-24 bg-gradient-to-r ${mentor.coverGradient} p-3 flex flex-col justify-between relative`}
              >
                <div className="flex justify-end items-center gap-1.5">
                  <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold text-amber-900 px-2 py-0.5 rounded-full border border-white/60 flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{mentor.rating || 4.9}</span>
                  </span>
                  <span className="bg-white/80 backdrop-blur-sm text-[10px] font-semibold text-slate-700 px-2.5 py-0.5 rounded-full border border-white/60">
                    {mentor.coverTag}
                  </span>
                </div>

                {/* Avatar Badge */}
                <div className="absolute -bottom-5 left-4">
                  <div
                    className={`w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-sm font-bold shadow-sm ${mentor.avatarColor}`}
                  >
                    {mentor.initials}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="pt-7 px-4 pb-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-slate-900 text-base">{mentor.name}</h3>
                  {mentor.isYourMentor ? (
                    <span className="bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <UserCheck className="w-3 h-3" />
                      <span>{t.mentorCatalog.yourMentor}</span>
                    </span>
                  ) : mentor.spotsLeft === 0 ? (
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {t.mentorCatalog.full}
                    </span>
                  ) : (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {mentor.spotsLeft} {t.mentorCatalog.spots}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {mentor.tagline}
                </p>

                {/* Tags */}
                <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-3 border-t border-slate-100">
                  {mentor.tags.map(tag => (
                    <span
                      key={tag}
                      className="bg-slate-50 border border-slate-200/80 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* How I Help Teaser */}
                {mentor.howIHelp && (
                  <div className="mt-2.5 p-2 bg-purple-50/60 border border-purple-100 rounded-xl text-[11px] text-purple-900 leading-snug flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-1 font-medium">{mentor.howIHelp}</span>
                  </div>
                )}

                {/* 1-on-1 Shortcut Button & Badges */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="bg-slate-100 text-slate-700 font-bold text-[10px] px-2 py-0.5 rounded-md">
                      {mentor.year === '2nd year' ? '2 курс' : '3 курс'}
                    </span>
                    {mentor.gpa && (
                      <span className="bg-emerald-50 text-emerald-700 font-mono font-bold text-[10px] px-2 py-0.5 rounded-md border border-emerald-200">
                        GPA {mentor.gpa}
                      </span>
                    )}
                    <span className="bg-indigo-50 text-indigo-700 font-bold text-[10px] px-2 py-0.5 rounded-md border border-indigo-200">
                      {mentor.track === 'hard' ? 'Hard Tutor' : 'Soft Mentor'}
                    </span>
                  </div>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      openOneOnOneModal(mentor);
                    }}
                    className="text-[11px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors flex-shrink-0 cursor-pointer shadow-2xs"
                  >
                    <Calendar className="w-3 h-3 text-purple-600" />
                    <span>Запись 1-on-1</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredMentors.length === 0 && (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6">
            <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700">No mentors found</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Try clearing filters or search keywords</p>
          </div>
        )}
      </div>
    </div>
  );
};
