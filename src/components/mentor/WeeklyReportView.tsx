import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, Send, CheckCircle2, FileText, Sparkles, Check } from 'lucide-react';

export const WeeklyReportView: React.FC = () => {
  const { reports, submitReport, setMentorView } = useApp();
  const [reportType, setReportType] = useState<'Psychologist' | 'Assignments from DSEW' | 'Needs attention (questions)'>('Assignments from DSEW');
  const [highlights, setHighlights] = useState('');
  const [concerns, setConcerns] = useState('');
  const [selectedAssignments, setSelectedAssignments] = useState<string[]>(['Exam-stress workshop']);
  const [submittedBanner, setSubmittedBanner] = useState(false);

  const reportTypes = [
    'Psychologist',
    'Assignments from DSEW',
    'Needs attention (questions)'
  ] as const;

  const assignmentsList = [
    'Exam-stress workshop',
    'Extra study space',
    'Reallocate a mentee',
    'DSEW 1-on-1 referral'
  ];

  const toggleAssignment = (item: string) => {
    setSelectedAssignments(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!highlights.trim() && !concerns.trim()) {
      alert('Please fill in highlights or concerns before submitting.');
      return;
    }

    submitReport({
      period: '21 May–3 Jun',
      title: `${reportType} Report`,
      reportType,
      highlights: highlights.trim() || 'All mentees progressing smoothly.',
      concerns: concerns.trim() || 'No critical risks identified.',
      selectedAssignments
    });

    setHighlights('');
    setConcerns('');
    setSubmittedBanner(true);
    setTimeout(() => setSubmittedBanner(false), 4000);
  };

  return (
    <div className="flex flex-col gap-5 pb-6">
      {/* Top Header */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => setMentorView('community')}
          className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Weekly report</h1>
          <p className="text-xs text-amber-600 font-semibold mt-0.5">
            Due in 2 days · period 21 May–3 Jun
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed font-normal bg-slate-50 p-3 rounded-2xl border border-slate-100">
        A qualitative pulse on your pool. Written by you — your judgement, not a metric.
      </p>

      {submittedBanner && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-2xl flex items-center gap-2.5 text-xs font-semibold animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Report successfully submitted to DSEW & logged in archive!</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Type of report */}
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-2">Type of report</label>
          <div className="flex flex-wrap gap-2">
            {reportTypes.map(t => (
              <button
                type="button"
                key={t}
                onClick={() => setReportType(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  reportType === t
                    ? 'bg-blue-50 text-blue-600 border-2 border-blue-500 shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1.5">
            Highlights this period
          </label>
          <textarea
            value={highlights}
            onChange={e => setHighlights(e.target.value)}
            rows={3}
            placeholder="Wins, new friendships, who came out of their shell..."
            className="w-full bg-slate-50/70 border border-slate-200 text-slate-800 text-xs rounded-2xl p-3 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-colors placeholder:text-slate-400"
          />
        </div>

        {/* Concerns or risks */}
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1.5">Concerns or risks</label>
          <textarea
            value={concerns}
            onChange={e => setConcerns(e.target.value)}
            rows={3}
            placeholder="Anyone struggling? Disengaging? Your honest read."
            className="w-full bg-slate-50/70 border border-slate-200 text-slate-800 text-xs rounded-2xl p-3 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-colors placeholder:text-slate-400"
          />
        </div>

        {/* Choose assignment */}
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-2">Choose assignment</label>
          <div className="flex flex-wrap gap-2">
            {assignmentsList.map(item => {
              const isSelected = selectedAssignments.includes(item);
              return (
                <button
                  type="button"
                  key={item}
                  onClick={() => toggleAssignment(item)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  <span>{item}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit to DSEW Button */}
        <button
          type="submit"
          className="mt-2 w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 text-xs transition-all"
        >
          <Send className="w-4 h-4" />
          <span>Submit to DSEW</span>
        </button>
      </form>

      {/* Past Reports List */}
      <div className="mt-2 flex flex-col gap-2.5">
        <h2 className="text-xs font-bold text-slate-800 tracking-tight">Past reports</h2>

        <div className="flex flex-col gap-2.5">
          {reports.map(rep => (
            <div
              key={rep.id}
              className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-soft flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{rep.period}</h3>
                  <p className="text-[11px] text-slate-500">{rep.title}</p>
                </div>
              </div>

              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {rep.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
