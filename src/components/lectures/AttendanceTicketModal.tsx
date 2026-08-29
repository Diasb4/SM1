import React, { useState } from 'react';
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
  Share2
} from 'lucide-react';

export const AttendanceTicketModal: React.FC = () => {
  const {
    selectedTicketLecture,
    closeTicketModal,
    checkInStudent,
    triggerConfetti,
    triggerHaptic
  } = useApp();

  const [isScanningSim, setIsScanningSim] = useState(false);

  if (!selectedTicketLecture) return null;

  const lecture = selectedTicketLecture;
  const isCheckedIn = lecture.isCheckedIn;

  const handleSimulateScan = () => {
    setIsScanningSim(true);
    setTimeout(() => {
      checkInStudent(lecture.id, '254977');
      setIsScanningSim(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl animate-slide-up flex flex-col relative">
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
              AITU Attendance Pass
            </span>
          </div>

          <h2 className="text-base font-bold leading-tight">{lecture.title}</h2>
          <p className="text-xs text-blue-100 mt-1">Lecturer: {lecture.lecturerName}</p>
        </div>

        {/* Ticket Details & Tear Line */}
        <div className="p-5 flex flex-col gap-4">
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs">
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Student</p>
              <p className="font-bold text-slate-900 truncate">Birzhan Zh.</p>
              <p className="text-[10px] font-mono text-slate-500">ID: 254977</p>
            </div>

            <div>
              <p className="text-[10px] text-slate-400 font-medium">Points Reward</p>
              <p className="font-bold text-emerald-600 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                <span>+{lecture.attendancePoints} pts</span>
              </p>
              <p className="text-[10px] text-slate-500">Auto-credited</p>
            </div>

            <div>
              <p className="text-[10px] text-slate-400 font-medium">Time & Date</p>
              <p className="font-bold text-slate-800 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-blue-600" />
                <span className="truncate">{lecture.dateText}</span>
              </p>
            </div>

            <div>
              <p className="text-[10px] text-slate-400 font-medium">Auditorium</p>
              <p className="font-bold text-slate-800 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-500" />
                <span className="truncate">{lecture.location.split('(')[0]}</span>
              </p>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center p-5 bg-gradient-to-b from-slate-50 to-white rounded-3xl border-2 border-dashed border-slate-200 relative">
            {/* Visual SVG QR matrix */}
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
              <svg className="w-40 h-40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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

            <p className="text-[11px] text-slate-500 font-mono mt-3">
              PASS-{lecture.id.toUpperCase()}-254977
            </p>
          </div>

          {/* Status / Scan simulation action */}
          {isCheckedIn ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Checked in! +{lecture.attendancePoints} Points Credited</span>
            </div>
          ) : (
            <button
              onClick={handleSimulateScan}
              disabled={isScanningSim}
              className="w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isScanningSim ? 'Scanning QR code...' : 'Simulate Lecturer Scan & Claim +50 Pts'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
