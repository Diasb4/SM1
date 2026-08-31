import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  BookOpen,
  Calculator,
  MapPin,
  Users,
  Globe,
  Phone,
  GraduationCap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Award,
  ShieldCheck,
  Building,
  Wifi,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  HeartHandshake
} from 'lucide-react';
import { playSound } from '../../utils/audio';

type GuideTab = 'academic' | 'campus' | 'clubs' | 'digital' | 'contacts';

export const AituGuideView: React.FC = () => {
  const { t, triggerConfetti } = useApp();
  const [activeTab, setActiveTab] = useState<GuideTab>('academic');
  const [searchQuery, setSearchQuery] = useState('');

  // GPA Calculator State
  const [r1, setR1] = useState<number>(85);
  const [r2, setR2] = useState<number>(88);
  const [finalScore, setFinalScore] = useState<number>(90);

  // Expanded FAQ items
  const [expandedFaq, setExpandedFaq] = useState<string | null>('gpa_formula');
  const [selectedFloor, setSelectedFloor] = useState<number>(2);

  // Calculation Logic: (R1 * 0.3) + (R2 * 0.3) + (Final * 0.4)
  const totalCalculated = useMemo(() => {
    return Math.round((r1 * 0.3 + r2 * 0.3 + finalScore * 0.4) * 10) / 10;
  }, [r1, r2, finalScore]);

  const currentGrade = useMemo(() => {
    const score = totalCalculated;
    if (score >= 95) return { letter: 'A', gpa: '4.0', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', desc: 'Excellent' };
    if (score >= 90) return { letter: 'A-', gpa: '3.67', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', desc: 'Excellent' };
    if (score >= 85) return { letter: 'B+', gpa: '3.33', color: 'text-blue-600 bg-blue-50 border-blue-200', desc: 'Good' };
    if (score >= 80) return { letter: 'B', gpa: '3.00', color: 'text-blue-600 bg-blue-50 border-blue-200', desc: 'Good' };
    if (score >= 75) return { letter: 'B-', gpa: '2.67', color: 'text-blue-600 bg-blue-50 border-blue-200', desc: 'Good (Grant threshold)' };
    if (score >= 70) return { letter: 'C+', gpa: '2.33', color: 'text-amber-600 bg-amber-50 border-amber-200', desc: 'Satisfactory' };
    if (score >= 65) return { letter: 'C', gpa: '2.00', color: 'text-amber-600 bg-amber-50 border-amber-200', desc: 'Satisfactory' };
    if (score >= 60) return { letter: 'C-', gpa: '1.67', color: 'text-amber-600 bg-amber-50 border-amber-200', desc: 'Satisfactory' };
    if (score >= 55) return { letter: 'D+', gpa: '1.33', color: 'text-orange-600 bg-orange-50 border-orange-200', desc: 'Passing' };
    if (score >= 50) return { letter: 'D', gpa: '1.00', color: 'text-orange-600 bg-orange-50 border-orange-200', desc: 'Passing' };
    if (score >= 25) return { letter: 'FX', gpa: '0.00', color: 'text-rose-600 bg-rose-50 border-rose-200', desc: 'Retake Exam session allowed' };
    return { letter: 'F', gpa: '0.00', color: 'text-rose-700 bg-rose-100 border-rose-300', desc: 'Mandatory Paid Retake Course' };
  }, [totalCalculated]);

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="flex flex-col gap-4 pb-6 animate-fade-in">
      {/* Title Header */}
      <div className="pt-2">
        <div className="flex items-center gap-2">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            @guideaitu2
          </span>
          <span className="text-[11px] font-bold text-slate-500">AITU Freshmen Knowledge Base</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">{t.guide.title}</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          {t.guide.subtitle}
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setActiveTab('academic')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'academic' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>{t.guide.tabAcademic}</span>
        </button>

        <button
          onClick={() => setActiveTab('campus')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'campus' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>{t.guide.tabCampus}</span>
        </button>

        <button
          onClick={() => setActiveTab('clubs')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'clubs' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>{t.guide.tabClubs}</span>
        </button>

        <button
          onClick={() => setActiveTab('digital')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'digital' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Laptop className="w-3.5 h-3.5" />
          <span>{t.guide.tabDigital}</span>
        </button>

        <button
          onClick={() => setActiveTab('contacts')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'contacts' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>{t.guide.tabContacts}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={t.guide.searchPlaceholder}
          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors placeholder:text-slate-400"
        />
      </div>

      {/* TAB 1: ACADEMIC & GPA */}
      {activeTab === 'academic' && (
        <div className="flex flex-col gap-4">
          {/* Interactive GPA Calculator Card */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-3xl shadow-xl flex flex-col gap-4 border border-indigo-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-400/30">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">{t.guide.gpaCalcTitle}</h3>
                  <p className="text-[10px] text-slate-400">{t.guide.gpaCalcSubtitle}</p>
                </div>
              </div>
              <span className="bg-blue-500/20 border border-blue-400/40 text-blue-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                AITU Formula
              </span>
            </div>

            {/* Score Sliders & Inputs */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-white/10 p-2.5 rounded-2xl border border-white/10 flex flex-col gap-1">
                <label className="text-[10px] text-slate-300 font-bold">R1 (30%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={r1}
                  onChange={e => setR1(Math.min(100, Math.max(0, Number(e.target.value))))}
                  className="bg-white/20 text-white font-bold text-center text-sm py-1 rounded-xl focus:outline-none border border-white/20"
                />
              </div>

              <div className="bg-white/10 p-2.5 rounded-2xl border border-white/10 flex flex-col gap-1">
                <label className="text-[10px] text-slate-300 font-bold">R2 (30%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={r2}
                  onChange={e => setR2(Math.min(100, Math.max(0, Number(e.target.value))))}
                  className="bg-white/20 text-white font-bold text-center text-sm py-1 rounded-xl focus:outline-none border border-white/20"
                />
              </div>

              <div className="bg-white/10 p-2.5 rounded-2xl border border-white/10 flex flex-col gap-1">
                <label className="text-[10px] text-amber-300 font-bold">Final (40%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={finalScore}
                  onChange={e => setFinalScore(Math.min(100, Math.max(0, Number(e.target.value))))}
                  className="bg-amber-400/20 text-amber-200 font-bold text-center text-sm py-1 rounded-xl focus:outline-none border border-amber-400/30"
                />
              </div>
            </div>

            {/* Live Calculation Output Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-medium">{t.guide.totalScore}</span>
                <p className="text-2xl font-black text-white">{totalCalculated} <span className="text-xs text-slate-400 font-normal">/ 100</span></p>
              </div>

              <div className="flex items-center gap-2">
                <div className={`px-3 py-1.5 rounded-xl border text-center font-bold ${currentGrade.color}`}>
                  <span className="text-sm">{currentGrade.letter}</span>
                  <p className="text-[9px] font-mono">{currentGrade.gpa} GPA</p>
                </div>
              </div>
            </div>

            {/* Status alert message */}
            <div className="text-[11px] flex items-center gap-1.5 text-slate-300">
              {totalCalculated >= 90 ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.guide.excellentPass}</span>
                </span>
              ) : totalCalculated >= 50 ? (
                <span className="text-blue-300 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t.guide.goodPass}</span>
                </span>
              ) : (
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{t.guide.retakeWarning}</span>
                </span>
              )}
            </div>
          </div>

          {/* Academic Policy Accordions */}
          <div className="flex flex-col gap-2.5">
            {/* FAQ 1: Grading Scale */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
              <button
                onClick={() => toggleFaq('scale')}
                className="w-full p-3.5 text-left flex items-center justify-between font-bold text-xs text-slate-900"
              >
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>AITU Official Grading Scale & GPA Scale</span>
                </div>
                {expandedFaq === 'scale' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {expandedFaq === 'scale' && (
                <div className="p-3.5 pt-0 text-xs text-slate-600 border-t border-slate-50 overflow-x-auto">
                  <table className="w-full text-left text-[11px] border-collapse mt-2">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-bold">
                        <th className="pb-1">Letter</th>
                        <th className="pb-1">Score %</th>
                        <th className="pb-1">GPA</th>
                        <th className="pb-1">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      <tr><td className="py-1 font-bold text-emerald-600">A</td><td>95–100%</td><td>4.0</td><td>Excellent</td></tr>
                      <tr><td className="py-1 font-bold text-emerald-600">A-</td><td>90–94%</td><td>3.67</td><td>Excellent</td></tr>
                      <tr><td className="py-1 font-bold text-blue-600">B+</td><td>85–89%</td><td>3.33</td><td>Good</td></tr>
                      <tr><td className="py-1 font-bold text-blue-600">B</td><td>80–84%</td><td>3.00</td><td>Good</td></tr>
                      <tr><td className="py-1 font-bold text-blue-600">B-</td><td>75–79%</td><td>2.67</td><td>Grant Safety Threshold</td></tr>
                      <tr><td className="py-1 font-bold text-amber-600">C+</td><td>70–74%</td><td>2.33</td><td>Satisfactory</td></tr>
                      <tr><td className="py-1 font-bold text-amber-600">C</td><td>65–69%</td><td>2.00</td><td>Satisfactory</td></tr>
                      <tr><td className="py-1 font-bold text-orange-600">D</td><td>50–54%</td><td>1.00</td><td>Minimum Pass</td></tr>
                      <tr><td className="py-1 font-bold text-rose-600">FX</td><td>25–49%</td><td>0.00</td><td>Retake Exam Session</td></tr>
                      <tr><td className="py-1 font-bold text-rose-700">F</td><td>0–24%</td><td>0.00</td><td>Summer Retake Course</td></tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* FAQ 2: Scholarship & Grant rules */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
              <button
                onClick={() => toggleFaq('grant')}
                className="w-full p-3.5 text-left flex items-center justify-between font-bold text-xs text-slate-900"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>State Grants, Stipend Retention & Dean's List</span>
                </div>
                {expandedFaq === 'grant' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {expandedFaq === 'grant' && (
                <div className="p-3.5 pt-0 text-xs text-slate-600 border-t border-slate-50 space-y-2 leading-relaxed">
                  <p>
                    • <strong>Стипендия сақтау (Stipend Retention):</strong> Чтобы сохранить государственную стипендию, все дисциплины сессии должны быть сданы на оценки <span className="font-bold text-slate-900">A, A-, B+, B, B- (от 75 баллов)</span>. Оценка C+ и ниже приводит к потере стипендии на следующий триместр/семестр.
                  </p>
                  <p>
                    • <strong>Dean's Honor List:</strong> Студенты с семестровым GPA выше <span className="font-bold text-emerald-700">3.75</span> награждаются сертификатом деканата и получают преимущества при распределении зарубежной академической мобильности (Erasmus+).
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 3: Retakes & Summer semester */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
              <button
                onClick={() => toggleFaq('retakes')}
                className="w-full p-3.5 text-left flex items-center justify-between font-bold text-xs text-slate-900"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Retake Policies & Summer Semester (Летник)</span>
                </div>
                {expandedFaq === 'retakes' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {expandedFaq === 'retakes' && (
                <div className="p-3.5 pt-0 text-xs text-slate-600 border-t border-slate-50 space-y-2 leading-relaxed">
                  <p>
                    • <strong>FX (25–49 баллов):</strong> Позволяет выйти на повторную сдачу экзамена (пересдачу) в период экзаменационной сессии.
                  </p>
                  <p>
                    • <strong>F (0–24 балла):</strong> Обязательное повторное изучение дисциплины в Летнем семестре (Summer School) с оплатой за каждый академический кредит (ECTS).
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CAMPUS & EXPO MAP */}
      {activeTab === 'campus' && (
        <div className="flex flex-col gap-3.5">
          {/* Floor selector pills */}
          <div className="flex gap-2">
            {[1, 2, 3].map(floor => (
              <button
                key={floor}
                onClick={() => setSelectedFloor(floor)}
                className={`flex-1 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  selectedFloor === floor
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Floor {floor} (C1.{floor})
              </button>
            ))}
          </div>

          {/* Floor Map & Directory Card */}
          <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>
                  {selectedFloor === 1 ? t.guide.floor1Title : selectedFloor === 2 ? t.guide.floor2Title : t.guide.floor3Title}
                </span>
              </h3>
              <span className="text-[10px] font-bold text-slate-400 font-mono">EXPO Block C1</span>
            </div>

            {selectedFloor === 1 && (
              <div className="flex flex-col gap-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5">
                  <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">C1.1.100</span>
                  <div>
                    <h4 className="font-bold text-slate-900">Main Entrance & Turnstiles</h4>
                    <p className="text-[11px] text-slate-500">Security desk, student ID cards pass, Lost & Found hub.</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5">
                  <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg">C1.1.103</span>
                  <div>
                    <h4 className="font-bold text-slate-900">Medical Office (Медпункт)</h4>
                    <p className="text-[11px] text-slate-500">First aid, medical certificates validation (Форма 075/у), emergency care.</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5">
                  <span className="font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">C1.1.Food</span>
                  <div>
                    <h4 className="font-bold text-slate-900">AITU Canteen & Food Court</h4>
                    <p className="text-[11px] text-slate-500">Hot lunches, bakery, coffee bar, student lounge area.</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5">
                  <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">C1.1.Sport</span>
                  <div>
                    <h4 className="font-bold text-slate-900">Sports Zone & Table Tennis</h4>
                    <p className="text-[11px] text-slate-500">Recreation area, workout space, chess tables.</p>
                  </div>
                </div>
              </div>
            )}

            {selectedFloor === 2 && (
              <div className="flex flex-col gap-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5">
                  <span className="font-mono font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-lg">C1.2.204</span>
                  <div>
                    <h4 className="font-bold text-slate-900">Student Department (Студенческий отдел)</h4>
                    <p className="text-[11px] text-slate-500">Enrollment documents, transcripts, official student letters, military records.</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5">
                  <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">C1.2.Lib</span>
                  <div>
                    <h4 className="font-bold text-slate-900">AITU Library & Silent Study Hall</h4>
                    <p className="text-[11px] text-slate-500">Textbooks pickup, IEEE Xplore digital access, private reading booths.</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5">
                  <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg">C1.2.218</span>
                  <div>
                    <h4 className="font-bold text-slate-900">Psychological Support Office</h4>
                    <p className="text-[11px] text-slate-500">Free confidential 1-on-1 sessions for stress, adaptation and wellbeing.</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5">
                  <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">C1.2.140</span>
                  <div>
                    <h4 className="font-bold text-slate-900">Auditorium C1.2.140 (80 Seats)</h4>
                    <p className="text-[11px] text-slate-500">OOP & Java, Web Development peer mentoring lectures.</p>
                  </div>
                </div>
              </div>
            )}

            {selectedFloor === 3 && (
              <div className="flex flex-col gap-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5">
                  <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">C1.3.250</span>
                  <div>
                    <h4 className="font-bold text-slate-900">Main Auditorium (100 Seats)</h4>
                    <p className="text-[11px] text-slate-500">Calculus 1, Linear Algebra, exam review sessions with Ayan Serikbay.</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5">
                  <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">C1.3.Mac</span>
                  <div>
                    <h4 className="font-bold text-slate-900">Apple Mac Lab & iOS Development</h4>
                    <p className="text-[11px] text-slate-500">iMac workstations for Swift, Mobile app development and UI design.</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5">
                  <span className="font-mono font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-lg">C1.3.Hub</span>
                  <div>
                    <h4 className="font-bold text-slate-900">AITU Innovation Hub & Coworking</h4>
                    <p className="text-[11px] text-slate-500">Decentrathon hub, startup accelerator teams, hackathon workspace.</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5">
                  <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">C1.3.Council</span>
                  <div>
                    <h4 className="font-bold text-slate-900">AITUSA Student Government Office</h4>
                    <p className="text-[11px] text-slate-500">Student council headquarters, event management, club coordination.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Surrounding Hotspots */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex flex-col gap-2 text-xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Campus Surrounding & Student Spots</span>
            </h4>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              • <strong>Mega Silk Way (5 min walk):</strong> Food courts, cinema, student stationery, supermarket.
              <br />
              • <strong>AkiTime Coffee:</strong> Popular offline coffee and study spot across Mangilik El.
              <br />
              • <strong>Triathlon Park:</strong> Morning runs with sports mentors and outdoor workouts.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: STUDENT CLUBS */}
      {activeTab === 'clubs' && (
        <div className="flex flex-col gap-3">
          <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-600" />
                <span>30+ Active AITU Student Clubs</span>
              </h3>
              <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Join anytime
              </span>
            </div>

            {/* Club 1: GDSC */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>GDSC AITU (Google Developer Student Club)</span>
                </h4>
                <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">Tech</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Workshops on Flutter, Cloud, AI/ML, Solution Challenge and Google dev tech.
              </p>
            </div>

            {/* Club 2: Decentrathon */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Decentrathon & Web3 Hub</span>
                </h4>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">Blockchain</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Solidity, smart contracts, Web3 hackathons, largest blockchain hackathon in Central Asia.
              </p>
            </div>

            {/* Club 3: Nomad Debate */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Nomad Debate Club</span>
                </h4>
                <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">Soft Skills</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Public speaking, critical thinking tournaments in British & American parliamentary formats.
              </p>
            </div>

            {/* Club 4: Sports */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>AITU Sports League (Football & Basketball)</span>
                </h4>
                <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg">Athletics</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Weekly inter-course football tournaments, Astana Student League representation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DIGITAL LMS */}
      {activeTab === 'digital' && (
        <div className="flex flex-col gap-3">
          <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Laptop className="w-4 h-4 text-blue-600" />
              <span>Digital University Systems</span>
            </h3>

            {/* Moodle */}
            <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 flex flex-col gap-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-950">Moodle LMS</span>
                <span className="text-[10px] font-mono text-blue-700">moodle.astanait.edu.kz</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Primary portal for course syllabus, lecture materials, assignment submissions, and quiz assessments.
              </p>
            </div>

            {/* Digital University */}
            <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100 flex flex-col gap-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-950">Digital University (DU)</span>
                <span className="text-[10px] font-mono text-indigo-700">du.astanait.edu.kz</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Official electronic transcript, personal curriculum trajectory, schedule, and grade reports.
              </p>
            </div>

            {/* Wi-Fi Eduroam */}
            <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex flex-col gap-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950">Campus Wi-Fi (Eduroam & AITU-Student)</span>
                <span className="text-[10px] font-mono text-emerald-700">SSID: AITU-Student</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Connect using your student Microsoft 365 credentials: <code className="text-[10px] bg-white px-1 rounded">254977@astanait.edu.kz</code>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CONTACTS */}
      {activeTab === 'contacts' && (
        <div className="flex flex-col gap-3">
          <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>Key University Contacts & Support</span>
            </h3>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">Student Department</p>
                  <p className="text-[11px] text-slate-500">Transcripts, certificates & military</p>
                </div>
                <span className="font-mono text-[11px] text-blue-600 font-semibold">student.dept@astanait.edu.kz</span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">Admissions & General Office</p>
                  <p className="text-[11px] text-slate-500">Hotline & Foundation</p>
                </div>
                <span className="font-mono text-[11px] text-blue-600 font-semibold">+7 (7172) 645-710</span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">IT Helpdesk</p>
                  <p className="text-[11px] text-slate-500">Wi-Fi, Microsoft SSO & Moodle</p>
                </div>
                <span className="font-mono text-[11px] text-blue-600 font-semibold">helpdesk@astanait.edu.kz</span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">DSEW Wellbeing & Psychologist</p>
                  <p className="text-[11px] text-slate-500">Confidential appointments</p>
                </div>
                <span className="font-mono text-[11px] text-purple-600 font-semibold">dsew@astanait.edu.kz</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

