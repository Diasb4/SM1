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
  Search
} from 'lucide-react';

export const HardMentorLecturesView: React.FC = () => {
  const { hardLectures, createHardLecture, checkInStudent } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [selectedLectureForScan, setSelectedLectureForScan] = useState<HardLecture | null>(null);
  const [studentInputId, setStudentInputId] = useState('');

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

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Lecturer Desk</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Ayan Serikbay · Lead Math Peer Tutor
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
          <p className="text-[10px] text-slate-400 font-bold uppercase">Lectures</p>
          <p className="text-lg font-extrabold text-slate-900 mt-0.5">{hardLectures.length}</p>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-soft text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase">Capacity</p>
          <p className="text-lg font-extrabold text-blue-600 mt-0.5">100 / lec</p>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-soft text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase">Total Booked</p>
          <p className="text-lg font-extrabold text-emerald-600 mt-0.5">
            {hardLectures.reduce((acc, l) => acc + l.bookedSeats, 0)}
          </p>
        </div>
      </div>

      {/* Lectures List for Lecturer */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xs font-bold text-slate-800 tracking-tight">Your Scheduled Sessions</h2>

        {hardLectures.map(lec => {
          return (
            <div
              key={lec.id}
              className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {lec.subject}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{lec.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{lec.dateText} · {lec.location}</span>
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedLectureForScan(lec);
                    setShowScannerModal(true);
                  }}
                  className="bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-semibold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <QrCode className="w-4 h-4 text-blue-400" />
                  <span>QR Scan</span>
                </button>
              </div>

              {/* Registered Roster Count */}
              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-slate-800">
                    {lec.bookedSeats} / {lec.totalSeats} registered students
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  +{lec.attendancePoints} pts
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Lecture Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Schedule Hard Lecture</h3>
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
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Auditorium Check-In Scanner</h3>
                <p className="text-[11px] text-slate-500">{selectedLectureForScan.title}</p>
              </div>
              <button
                onClick={() => setShowScannerModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Camera Scanner Graphic Simulation */}
            <div className="h-44 bg-slate-950 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden text-white border-2 border-blue-500/50">
              <div className="w-32 h-32 border-2 border-dashed border-blue-400 rounded-xl flex items-center justify-center animate-pulse">
                <QrCode className="w-16 h-16 text-blue-400" />
              </div>
              <p className="text-[10px] text-blue-200 mt-2 font-mono">Point camera at Student Pass</p>
            </div>

            {/* Manual Check-in by Student ID */}
            <form onSubmit={handleManualCheckIn} className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder="Or type ID: 254977"
                value={studentInputId}
                onChange={e => setStudentInputId(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white text-xs font-bold px-3 py-2 rounded-xl"
              >
                Check In
              </button>
            </form>

            {/* Quick Check-in One Click for Birzhan */}
            <button
              onClick={() => {
                checkInStudent(selectedLectureForScan.id, '254977');
              }}
              className="mt-2 w-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold py-2 rounded-xl"
            >
              ✓ Quick Check-in Student Birzhan (254977)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
