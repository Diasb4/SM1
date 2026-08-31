import React, { useState, useMemo, useEffect } from 'react';
import { HardLecture, AuditoriumTier } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Check, Users, Sparkles, MapPin } from 'lucide-react';
import { playSound } from '../../utils/audio';

interface AuditoriumSeatPickerModalProps {
  lecture: HardLecture;
  onClose: () => void;
  onConfirmTier: (tier: AuditoriumTier) => void;
}

export const AuditoriumSeatPickerModal: React.FC<AuditoriumSeatPickerModalProps> = ({
  lecture,
  onClose,
  onConfirmTier
}) => {
  const { t, triggerConfetti } = useApp();
  const [selectedTier, setSelectedTier] = useState<AuditoriumTier>('front');

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // 100-Seat Distribution across 3 tiers (Memoized)
  const tierConfig = useMemo(() => [
    {
      id: 'front' as AuditoriumTier,
      name: t.lectures.rowFront,
      rows: 'Rows 1–4 · 30 Seats',
      capacity: 30,
      booked: Math.min(30, Math.round(lecture.bookedSeats * 0.4)),
      desc: 'Closest to the blackboard, optimal for asking live questions.',
      color: 'border-blue-500 bg-blue-50/50'
    },
    {
      id: 'middle' as AuditoriumTier,
      name: t.lectures.rowMiddle,
      rows: 'Rows 5–10 · 40 Seats',
      capacity: 40,
      booked: Math.min(40, Math.round(lecture.bookedSeats * 0.4)),
      desc: 'Central hall perspective, best acoustics and projector sightline.',
      color: 'border-indigo-500 bg-indigo-50/50'
    },
    {
      id: 'back' as AuditoriumTier,
      name: t.lectures.rowBack,
      rows: 'Rows 11–15 · 30 Seats',
      capacity: 30,
      booked: Math.min(30, Math.max(0, lecture.bookedSeats - 60)),
      desc: 'Elevated tier, ideal for laptop note-taking & peer discussion.',
      color: 'border-purple-500 bg-purple-50/50'
    }
  ], [lecture.bookedSeats, t]);

  const handleSelect = () => {
    playSound('success');
    triggerConfetti();
    onConfirmTier(selectedTier);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auditorium-picker-title"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <span className="bg-white/20 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            100-Seat Auditorium Visualizer
          </span>
          <h2 className="text-base font-bold leading-tight mt-1.5">{lecture.title}</h2>
          <p className="text-xs text-blue-100 mt-0.5">{lecture.location}</p>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-4">
          {/* Blackboard / Stage podium graphic */}
          <div className="bg-slate-900 text-white rounded-2xl p-3 text-center border-2 border-slate-700 shadow-inner flex flex-col items-center justify-center">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
              🎓 Blackboard & Lecturer Podium
            </span>
            <div className="w-32 h-1 bg-emerald-400 rounded-full mt-1.5 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-bold text-slate-800">{t.lectures.selectTier}</label>

            {tierConfig.map(tier => {
              const isSelected = selectedTier === tier.id;
              const available = tier.capacity - tier.booked;
              const isFull = available <= 0;

              return (
                <div
                  key={tier.id}
                  onClick={() => !isFull && setSelectedTier(tier.id)}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-1.5 ${
                    isSelected
                      ? `${tier.color} shadow-sm`
                      : 'border-slate-100 bg-slate-50 hover:bg-slate-100/80'
                  } ${isFull ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <span className="font-bold text-xs text-slate-900">{tier.name}</span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isFull ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isFull ? 'Full' : `${available} ${t.lectures.tierSeatsAvailable}`}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 ml-6">{tier.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleSelect}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Confirm Seating & Claim Ticket</span>
          </button>
        </div>
      </div>
    </div>
  );
};
