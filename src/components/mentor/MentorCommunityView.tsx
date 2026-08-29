import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MENTEE_AVATARS_LIST } from '../../data/mockData';
import { Heart, MessageSquare, Sparkles, Send, UserCheck, ChevronRight } from 'lucide-react';

export const MentorCommunityView: React.FC = () => {
  const { menteeSignals, setMentorView } = useApp();
  const [selectedMentee, setSelectedMentee] = useState<any | null>(null);
  const [noteText, setNoteText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSendPrivateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim() || !selectedMentee) return;
    showToast(`Private note sent to ${selectedMentee.name}!`);
    setNoteText('');
    setSelectedMentee(null);
  };

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Community</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Navigators · SE-1 · 21/24
          </p>
        </div>

        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center border border-purple-200">
          AB
        </div>
      </div>

      {/* Voluntary Disclosure Callout Banner */}
      <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3.5">
        <div className="flex items-start gap-2.5">
          <Heart className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-blue-900 leading-relaxed font-normal">
            What your mentees <span className="font-semibold">chose to share</span> with you.
            Nothing here is tracked or scored — these are voluntary signals and your own notes.
          </p>
        </div>
      </div>

      {/* Recent Signals Section */}
      <div className="flex flex-col gap-2.5">
        <h2 className="text-xs font-bold text-slate-800 tracking-tight">Recent signals</h2>

        <div className="flex flex-col gap-2.5">
          {menteeSignals.map(sig => (
            <div
              key={sig.id}
              className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-soft flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${sig.avatarColor}`}
                >
                  {sig.initials}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-slate-900">{sig.menteeName}</h3>
                    {sig.type === 'talk_request' && (
                      <span className="bg-blue-50 text-blue-600 text-[9px] font-bold px-1.5 py-0.5 rounded">
                        Asked to talk
                      </span>
                    )}
                    {sig.type === 'rsvp' && (
                      <span className="bg-emerald-50 text-emerald-600 text-[9px] font-bold px-1.5 py-0.5 rounded">
                        RSVP'd mixer
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{sig.actionText}</p>
                </div>
              </div>

              {sig.type === 'talk_request' ? (
                <button
                  onClick={() => {
                    setSelectedMentee({ name: sig.menteeName, initials: sig.initials });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs"
                >
                  Reply
                </button>
              ) : (
                <span className="text-[10px] text-slate-400 font-medium">{sig.timeAgo}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Your 21 Mentees Section */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-slate-800 tracking-tight">Your 21 mentees</h2>
          <button
            onClick={() => showToast('Opened cohort announcement thread')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Message all
          </button>
        </div>

        {/* Avatars Grid */}
        <div className="grid grid-cols-7 gap-2">
          {MENTEE_AVATARS_LIST.map((m, i) => (
            <button
              key={i}
              onClick={() => setSelectedMentee(m)}
              className="flex flex-col items-center gap-1 group"
              title={m.name}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold transition-transform group-hover:scale-110 shadow-2xs ${m.bg}`}
              >
                {m.initials}
              </div>
            </button>
          ))}
          {/* +3 overflow indicator */}
          <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 font-bold text-[10px] flex items-center justify-center">
            +3
          </div>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg z-50 animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Mentee Dialog */}
      {selectedMentee && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                {selectedMentee.initials}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedMentee.name}</h3>
                <p className="text-[11px] text-slate-500">Mentee · SE 2nd year</p>
              </div>
            </div>

            <form onSubmit={handleSendPrivateNote}>
              <textarea
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder={`Write private message or 1-on-1 invite to ${selectedMentee.name}...`}
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setSelectedMentee(null)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!noteText.trim()}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl disabled:bg-slate-300"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
