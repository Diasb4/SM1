import React from 'react';
import { useApp } from '../../context/AppContext';
import { ClipboardCheck, MessageSquare } from 'lucide-react';

export const TasksEmptyView: React.FC = () => {
  const { setMenteeView } = useApp();

  return (
    <div className="flex flex-col gap-4 pb-6 min-h-[500px]">
      {/* Title */}
      <div className="pt-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tasks</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">0 active</p>
      </div>

      {/* Empty State Center Card */}
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-white rounded-3xl border border-slate-100 shadow-soft my-auto">
        <div className="w-16 h-16 rounded-full bg-slate-100/90 border border-slate-200/60 flex items-center justify-center text-slate-500 mb-4 shadow-2xs">
          <ClipboardCheck className="w-8 h-8 text-slate-600 stroke-[1.5]" />
        </div>

        <h2 className="text-base font-bold text-slate-900">You're all caught up</h2>
        <p className="text-xs text-slate-500 max-w-xs mt-2 leading-relaxed">
          No active tasks right now. Your mentor will assign new work before the next session.
        </p>

        <button
          onClick={() => setMenteeView('chat')}
          className="mt-6 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold py-2.5 px-5 rounded-2xl flex items-center gap-2 shadow-xs transition-all"
        >
          <MessageSquare className="w-4 h-4 text-slate-600" />
          <span>Message your mentor</span>
        </button>
      </div>
    </div>
  );
};
