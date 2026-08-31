import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HardLecture, SubjectCategory } from '../../types';
import {
  Plus,
  QrCode,
  Users,
  Calendar,
  MapPin,
  CheckCircle2,
  X,
  Sparkles,
  BookOpen,
  Search,
  Download,
  Flashlight,
  RefreshCw,
  Award,
  Check
} from 'lucide-react';
import { playSound } from '../../utils/audio';

export const HardMentorLecturesView: React.FC = () => {
  const { hardLectures, createHardLecture, checkInStudent, t, triggerConfetti } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [selectedLectureForScan, setSelectedLectureForScan] = useState<HardLecture | null>(null);
  const [studentInputId, setStudentInputId] = useState('');
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [rosterSearch, setRosterSearch] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState<SubjectCategory>('Calculus');
  const [dateText, setDateText] = useState('Tuesday · 17:00 – 19:00');
  const [location, setLocation] = useState('Auditorium C1.3.250 (Offline)');
  const [totalSeats, setTotalSeats] = useState(100);
  const [points, setPoints] = useState(50);
  const [description, setDescription] = useState('');

  const handleCreateLecture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createHardLecture({
      title: title.trim(),
      subject,
      lecturerId: 'ayan',
      lecturerName: 'Ayan Serikbay',
      lecturerInitials: 'AS',
      lecturerAvatarBg: 'bg-blue-100 text-blue-800 border-blue-200',
      lecturerGpa: 'GPA 3.96',
      lecturerRole: 'Lead Peer Tutor · Math Dept',
      dateText: dateText.trim(),
      location: location.trim(),
      description: description.trim() || 'Intensive problem solving and exam crash course.',
      totalSeats: Number(totalSeats),
      attendancePoints: Number(points)
    });

    setTitle('');
    setDescription('');
    setShowCreateModal(false);
  };

  const handleManualCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentInputId.trim() || !selectedLectureForScan) return;
    checkInStudent(selectedLectureForScan.id, studentInputId.trim());
    setStudentInputId('');
  };

  const handleExportCsv = (lec: HardLecture) => {
    const csvRows = [
      ['Student ID', 'Student Name', 'Email', 'Lecture', 'Location', 'Attendance Points', 'Checked In At'],
      ...lec.registeredStudents.map(s => [
        s.studentId,
        s.studentName,
        s.studentEmail,
        lec.title,
        lec.location,
        lec.attendancePoints.toString(),
        s.checkedInAt || 'Not Checked In'
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AITU_Attendance_${lec.id}_Deans_Office.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    playSound('success');
    triggerConfetti();
  };

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{t.lecturerDesk.title}</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {t.lecturerDesk.subtitle}
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center shadow-md shadow-blue-600/20 transition-all"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-soft text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase">{t.lecturerDesk.metricsLectures}</p>
          <p className="text-lg font-extrabold text-slate-900 mt-0.5">{hardLectures.length}</p>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-soft text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase">{t.lecturerDesk.metricsCapacity}</p>
          <p className="text-lg font-extrabold text-blue-600 mt-0.5">100 / lec</p>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-soft text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase">{t.lecturerDesk.metricsTotalBooked}</p>
          <p className="text-lg font-extrabold text-emerald-600 mt-0.5">
            {hardLectures.reduce((acc, l) => acc + l.bookedSeats, 0)}
          </p>
        </div>
      </div>

      {/* Lectures List for Lecturer */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xs font-bold text-slate-800 tracking-tight">{t.lecturerDesk.scheduledSessions}</h2>

        {hardLectures.map(lec => {
          return (
            <div
              key={lec.id}
              className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft flex flex-col gap-3.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {lec.subject}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{lec.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lec.dateText} · {lec.location}</span>
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedLectureForScan(lec);
                    setShowScannerModal(true);
                  }}
                  className="bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all flex-shrink-0"
                >
                  <QrCode className="w-4 h-4 text-blue-400" />
                  <span>{t.lecturerDesk.qrScanBtn}</span>
                </button>
              </div>

              {/* Registered Roster Count & Export CSV button */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between text-xs gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="font-semibold text-slate-800">
                    {lec.bookedSeats} / {lec.totalSeats} {t.lecturerDesk.registeredRoster}
                  </span>
                </div>

                <button
                  onClick={() => handleExportCsv(lec)}
                  className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-[11px] font-bold px-3 py-1 rounded-xl flex items-center gap-1 shadow-2xs transition-all"
                >
                  <Download className="w-3 h-3 text-emerald-600" />
                  <span>CSV Export</span>
                </button>
              </div>

              {/* Expandable Live Registered Student list */}
              {lec.registeredStudents.length > 0 && (
                <div className="flex flex-col gap-1.5 pt-1">
                  <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                    <span>Recent Check-ins:</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {lec.registeredStudents.filter(s => s.checkedInAt).length} marked
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 max-h-32 overflow-y-auto no-scrollbar">
                    {lec.registeredStudents.map((s, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="font-bold text-slate-800">{s.studentName}</span>
                          <span className="text-[10px] font-mono text-slate-400">({s.studentId})</span>
                        </div>
                        {s.checkedInAt ? (
                          <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>{s.checkedInAt}</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => checkInStudent(lec.id, s.studentId)}
                            className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-lg hover:bg-blue-700"
                          >
                            Mark Checked In
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create Lecture Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">{t.lecturerDesk.createLectureBtn}</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLecture} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value as SubjectCategory)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Calculus">Calculus</option>
                  <option value="Linear Algebra">Linear Algebra</option>
                  <option value="OOP & Java">OOP & Java</option>
                  <option value="Discrete Math">Discrete Math</option>
                  <option value="Algorithms & DSA">Algorithms & DSA</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Lecture Topic</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Calculus 1: Midterm Review"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Date & Time</label>
                  <input
                    type="text"
                    required
                    value={dateText}
                    onChange={e => setDateText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Seats (100)</label>
                  <input
                    type="number"
                    required
                    value={totalSeats}
                    onChange={e => setTotalSeats(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5"
                />
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-xl shadow-md shadow-blue-600/20"
                >
                  Publish (100 Seats)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Scanner Modal for Lecturer */}
      {showScannerModal && selectedLectureForScan && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl animate-slide-up flex flex-col max-h-[92vh]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{t.lecturerDesk.scannerTitle}</h3>
                <p className="text-[11px] text-slate-500 truncate">{selectedLectureForScan.title}</p>
              </div>
              <button
                onClick={() => setShowScannerModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Camera Scanner Graphic Simulation with scanning laser */}
            <div className="h-48 bg-slate-950 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden text-white border-2 border-blue-500/50 shadow-inner">
              {/* Flashlight toggle */}
              <button
                onClick={() => setIsFlashOn(!isFlashOn)}
                className={`absolute top-3 right-3 p-2 rounded-full ${
                  isFlashOn ? 'bg-amber-400 text-amber-950' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                title="Toggle Flash"
              >
                <Flashlight className="w-3.5 h-3.5" />
              </button>

              <div className="w-32 h-32 border-2 border-dashed border-blue-400 rounded-2xl flex items-center justify-center relative">
                {/* Animated scanning laser */}
                <div className="absolute left-0 right-0 h-0.5 bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)] animate-pulse" />
                <QrCode className="w-16 h-16 text-blue-400" />
              </div>
              <p className="text-[10px] text-blue-200 mt-2 font-mono">{t.lecturerDesk.cameraInstruction}</p>
            </div>

            {/* Manual Check-in by Student ID */}
            <form onSubmit={handleManualCheckIn} className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder={t.lecturerDesk.manualCheckInPlaceholder}
                value={studentInputId}
                onChange={e => setStudentInputId(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl active:scale-95 transition-transform"
              >
                {t.lecturerDesk.checkInBtn}
              </button>
            </form>

            {/* Quick Check-in One Click for Birzhan */}
            <button
              onClick={() => {
                checkInStudent(selectedLectureForScan.id, '254977');
              }}
              className="mt-2.5 w-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold py-2.5 rounded-xl hover:bg-emerald-100 transition-colors"
            >
              {t.lecturerDesk.quickCheckInBirzhan}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
