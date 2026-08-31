import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  QrCode,
  CheckCircle2,
  Calendar,
  MapPin,
  Sparkles,
  Award,
  Download,
  Share2,
  Clock,
  Check
} from 'lucide-react';
import { playSound } from '../../utils/audio';

export const AttendanceTicketModal: React.FC = () => {
  const {
    selectedTicketLecture,
    closeTicketModal,
    checkInStudent,
    triggerConfetti,
    triggerHaptic,
    t
  } = useApp();

  const [isScanningSim, setIsScanningSim] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    if (!selectedTicketLecture) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeTicketModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTicketLecture, closeTicketModal]);

  if (!selectedTicketLecture) return null;

  const lecture = selectedTicketLecture;
  const isCheckedIn = lecture.isCheckedIn;

  const handleSimulateScan = () => {
    setIsScanningSim(true);
    playSound('beep');
    setTimeout(() => {
      checkInStudent(lecture.id, '254977');
      setIsScanningSim(false);
    }, 800);
  };

  const handleSaveToDevice = () => {
    setDownloadSuccess(true);
    playSound('success');
    triggerHaptic('success');
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ticket-modal-title"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl animate-slide-up flex flex-col relative max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-5 text-white relative">
          <button
            onClick={closeTicketModal}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs">
              {t.ticket.passTitle}
            </span>
          </div>

          <h2 className="text-base font-bold leading-tight">{lecture.title}</h2>
          <p className="text-xs text-blue-100 mt-1">Lecturer: {lecture.lecturerName} ({lecture.lecturerGpa})</p>
        </div>

        {/* Ticket Details */}
        <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-4">
          {/* Countdown timer pill */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-2.5 px-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-amber-900 font-bold">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>{t.ticket.startsIn}</span>
            </div>
            <span className="bg-amber-400 text-amber-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full font-mono">
              1h : 18m
            </span>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs">
            <div>
              <p className="text-[10px] text-slate-400 font-medium">{t.ticket.student}</p>
              <p className="font-bold text-slate-900 truncate">Birzhan Zh.</p>
              <p className="text-[10px] font-mono text-slate-500">ID: 254977</p>
            </div>

            <div>
              <p className="text-[10px] text-slate-400 font-medium">{t.ticket.reward}</p>
              <p className="font-bold text-emerald-600 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                <span>+{lecture.attendancePoints} {t.lectures.points}</span>
              </p>
              <p className="text-[10px] text-slate-500">{t.ticket.autoCredited}</p>
            </div>

            <div>
              <p className="text-[10px] text-slate-400 font-medium">{t.ticket.dateTime}</p>
              <p className="font-bold text-slate-800 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-blue-600" />
                <span className="truncate">{lecture.dateText}</span>
              </p>
            </div>

            <div>
              <p className="text-[10px] text-slate-400 font-medium">{t.ticket.auditorium}</p>
              <p className="font-bold text-slate-800 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-500" />
                <span className="truncate">{lecture.location.split('(')[0]}</span>
              </p>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-white rounded-3xl border-2 border-dashed border-slate-200 relative">
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
              <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* QR Finder Corners */}
                <rect x="5" y="5" width="26" height="26" rx="4" stroke="#0F172A" strokeWidth="4" />
                <rect x="11" y="11" width="14" height="14" rx="2" fill="#2563EB" />

                <rect x="69" y="5" width="26" height="26" rx="4" stroke="#0F172A" strokeWidth="4" />
                <rect x="75" y="11" width="14" height="14" rx="2" fill="#2563EB" />

                <rect x="5" y="69" width="26" height="26" rx="4" stroke="#0F172A" strokeWidth="4" />
                <rect x="11" y="75" width="14" height="14" rx="2" fill="#2563EB" />

                {/* Matrix dots */}
                <rect x="38" y="8" width="6" height="6" rx="1" fill="#0F172A" />
                <rect x="48" y="8" width="6" height="6" rx="1" fill="#0F172A" />
                <rect x="58" y="18" width="6" height="6" rx="1" fill="#2563EB" />
                <rect x="38" y="28" width="6" height="6" rx="1" fill="#0F172A" />

                <rect x="8" y="38" width="6" height="6" rx="1" fill="#0F172A" />
                <rect x="18" y="48" width="6" height="6" rx="1" fill="#2563EB" />
                <rect x="28" y="58" width="6" height="6" rx="1" fill="#0F172A" />

                {/* Center AITU badge */}
                <rect x="40" y="40" width="20" height="20" rx="6" fill="#2563EB" />
                <path d="M46 54L50 44L54 54H46Z" fill="white" />

                <rect x="68" y="38" width="6" height="6" rx="1" fill="#0F172A" />
                <rect x="78" y="48" width="6" height="6" rx="1" fill="#2563EB" />
                <rect x="88" y="58" width="6" height="6" rx="1" fill="#0F172A" />

                <rect x="38" y="68" width="6" height="6" rx="1" fill="#0F172A" />
                <rect x="48" y="78" width="6" height="6" rx="1" fill="#2563EB" />
                <rect x="58" y="88" width="6" height="6" rx="1" fill="#0F172A" />
                <rect x="78" y="78" width="6" height="6" rx="1" fill="#0F172A" />
                <rect x="88" y="88" width="6" height="6" rx="1" fill="#2563EB" />
              </svg>
            </div>

            {/* Barcode line representation */}
            <div className="w-full flex items-center justify-center gap-0.5 mt-3 px-6 h-5">
              {Array.from({ length: 42 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-full ${
                    i % 3 === 0 ? 'w-1 bg-slate-900' : i % 2 === 0 ? 'w-0.5 bg-slate-700' : 'w-1.5 bg-slate-800'
                  }`}
                />
              ))}
            </div>

            <p className="text-[10px] text-slate-500 font-mono mt-1">
              PASS-{lecture.id.toUpperCase()}-254977
            </p>
          </div>

          {/* Action Row */}
          <div className="flex gap-2">
            <button
              onClick={handleSaveToDevice}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              {downloadSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Download className="w-4 h-4" />}
              <span>{downloadSuccess ? 'Saved Pass!' : t.ticket.downloadPass}</span>
            </button>
            <button
              onClick={() => {
                playSound('pop');
                alert('Attendance pass link copied to clipboard!');
              }}
              className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Status / Scan simulation action */}
          {isCheckedIn ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold animate-fade-in shadow-2xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{t.ticket.checkedInSuccess}</span>
            </div>
          ) : (
            <button
              onClick={handleSimulateScan}
              disabled={isScanningSim}
              className="w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isScanningSim ? 'Scanning QR code...' : t.ticket.simScan}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
