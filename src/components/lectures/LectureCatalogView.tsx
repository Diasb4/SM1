import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { HardLecture, SubjectCategory } from '../../types';
import {
  GraduationCap,
  Calendar,
  MapPin,
  Users,
  Award,
  QrCode,
  Check,
  Search,
  Sparkles,
  BookOpen,
  Download,
  Layers,
  FileText
} from 'lucide-react';
import { playSound } from '../../utils/audio';

export const LectureCatalogView: React.FC = () => {
  const {
    hardLectures,
    bookLecture,
    cancelLectureBooking,
    openTicketModal,
    openAuditoriumModal,
    attendancePoints,
    attendanceRate,
    t
  } = useApp();

  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const subjects = useMemo(() => ['All', 'Calculus', 'OOP & Java', 'Discrete Math', 'Algorithms & DSA'], []);

  const filteredLectures = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return hardLectures.filter(lec => {
      const matchesSubject = selectedSubject === 'All' || lec.subject === selectedSubject;
      if (!matchesSubject) return false;

      if (!q) return true;
      return (
        lec.title.toLowerCase().includes(q) ||
        lec.lecturerName.toLowerCase().includes(q) ||
        lec.location.toLowerCase().includes(q)
      );
    });
  }, [hardLectures, selectedSubject, searchQuery]);

  const handleDownloadMaterials = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    playSound('success');
    alert(`Downloaded PDF study materials for "${title}"!`);
  };

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Top Header */}
      <div className="pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{t.lectures.title}</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {t.lectures.subtitle}
            </p>
          </div>

          {/* Student Attendance Points Pill */}
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200/80 rounded-2xl px-3 py-1.5 flex items-center gap-2 shadow-xs">
            <div className="w-7 h-7 rounded-xl bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center shadow-xs">
              ⚡
            </div>
            <div>
              <p className="text-[10px] text-amber-800 font-bold uppercase tracking-wider">{t.lectures.attendancePill}</p>
              <p className="text-xs font-extrabold text-amber-950">{attendancePoints} {t.lectures.points} · {attendanceRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Callout Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50/70 border border-blue-100 rounded-3xl p-4 flex items-start gap-3 shadow-xs">
        <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
          <BookOpen className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-blue-950">{t.lectures.bannerTitle}</h3>
          <p className="text-[11px] text-blue-800/90 leading-relaxed mt-0.5">
            {t.lectures.bannerDesc}
          </p>
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {subjects.map(subj => (
          <button
            key={subj}
            onClick={() => setSelectedSubject(subj)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedSubject === subj
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {subj === 'All' ? t.lectures.allSubjects : subj}
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
          placeholder={t.lectures.searchPlaceholder}
          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors placeholder:text-slate-400"
        />
      </div>

      {/* Lectures List */}
      <div className="flex flex-col gap-4">
        {filteredLectures.map(lecture => {
          const percentFull = Math.min(100, Math.round((lecture.bookedSeats / lecture.totalSeats) * 100));
          const seatsLeft = lecture.totalSeats - lecture.bookedSeats;
          const isFull = seatsLeft <= 0;

          return (
            <div
              key={lecture.id}
              className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft hover:shadow-card transition-all flex flex-col gap-3.5 relative overflow-hidden"
            >
              {/* Top Subject Tag & Points Badge */}
              <div className="flex items-center justify-between">
                <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  {lecture.subject}
                </span>

                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  <Award className="w-3 h-3 text-emerald-600" />
                  <span>+{lecture.attendancePoints} {t.lectures.points}</span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">{lecture.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                  {lecture.description}
                </p>
              </div>

              {/* Lecturer Info Row */}
              <div className="flex items-center gap-3 bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${lecture.lecturerAvatarBg}`}
                >
                  {lecture.lecturerInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{lecture.lecturerName}</h4>
                    <span className="bg-amber-100 text-amber-900 text-[9px] font-extrabold px-1.5 py-0.2 rounded">
                      {lecture.lecturerGpa}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">{lecture.lecturerRole}</p>
                </div>
              </div>

              {/* Date & Location Details */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium">
                <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <Calendar className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span className="truncate">{lecture.dateText}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                  <span className="truncate">{lecture.location}</span>
                </div>
              </div>

              {/* Seat Capacity Progress Bar & Auditorium Visualizer Shortcut */}
              <div className="flex flex-col gap-1.5 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between text-[11px] font-medium">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.lectures.capacity}</span>
                  </span>
                  <span className="font-bold text-slate-800">
                    {lecture.bookedSeats} / {lecture.totalSeats} ({seatsLeft} {t.lectures.seatsLeft})
                  </span>
                </div>

                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      percentFull > 85
                        ? 'bg-rose-500'
                        : percentFull > 60
                        ? 'bg-amber-500'
                        : 'bg-blue-600'
                    }`}
                    style={{ width: `${percentFull}%` }}
                  />
                </div>

                <button
                  onClick={() => openAuditoriumModal(lecture)}
                  className="mt-1 text-[10px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 self-start"
                >
                  <Layers className="w-3 h-3" />
                  <span>{t.lectures.auditoriumPicker}</span>
                </button>
              </div>

              {/* Download Materials Shortcut */}
              <div className="flex items-center justify-between bg-blue-50/40 p-2 rounded-xl border border-blue-100/60 text-xs">
                <div className="flex items-center gap-1.5 text-blue-950 font-medium">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-[11px] truncate">{t.lectures.downloadMaterials}</span>
                </div>
                <button
                  onClick={e => handleDownloadMaterials(e, lecture.title)}
                  className="bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-2xs"
                >
                  <Download className="w-3 h-3" />
                  <span>PDF</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                {lecture.isBookedByMe ? (
                  <>
                    <button
                      onClick={() => openTicketModal(lecture)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold py-3 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>{lecture.isCheckedIn ? t.lectures.checkedIn : t.lectures.viewTicket}</span>
                    </button>

                    <button
                      onClick={() => cancelLectureBooking(lecture.id)}
                      className="px-3 py-3 text-slate-500 hover:text-rose-600 text-xs font-semibold rounded-xl hover:bg-rose-50 transition-colors"
                    >
                      {t.lectures.cancel}
                    </button>
                  </>
                ) : (
                  <button
                    disabled={isFull}
                    onClick={() => openAuditoriumModal(lecture)}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all"
                  >
                    <span>{isFull ? t.lectures.soldOut : t.lectures.reserveSeat}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
