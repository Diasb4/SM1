import React from 'react';
import { useApp } from '../../context/AppContext';
import { MoodType } from '../../types';
import { Heart, Check } from 'lucide-react';

export const DailyCheckIn: React.FC = () => {
  const { todayCheckIn, setMood } = useApp();

  const moods: { type: MoodType; label: string; color: string; ringColor: string; emoji: string }[] = [
    { type: 'terrible', label: 'Rough', color: 'bg-rose-200 hover:bg-rose-300', ringColor: 'ring-rose-400', emoji: '🌧️' },
    { type: 'bad', label: 'Tired', color: 'bg-orange-200 hover:bg-orange-300', ringColor: 'ring-orange-400', emoji: '☁️' },
    { type: 'neutral', label: 'Okay', color: 'bg-amber-200 hover:bg-amber-300', ringColor: 'ring-amber-400', emoji: '⛅' },
    { type: 'good', label: 'Good', color: 'bg-lime-200 hover:bg-lime-300', ringColor: 'ring-lime-400', emoji: '🌤️' },
    { type: 'amazing', label: 'Great', color: 'bg-emerald-200 hover:bg-emerald-300', ringColor: 'ring-emerald-400', emoji: '☀️' }
  ];

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5 text-slate-800 font-semibold text-xs tracking-tight">
          <Heart className="w-3.5 h-3.5 text-rose-500" />
          <span>Daily check-in</span>
        </div>
        <span className="text-amber-500 text-xs">❝ ❞</span>
      </div>

      <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
        How are you today? Just for you — nobody sees this unless you share it.
      </p>

      {/* Mood Selectors */}
      <div className="flex items-center justify-between px-2 pt-1">
        {moods.map(m => {
          const isSelected = todayCheckIn.mood === m.type;
          return (
            <button
              key={m.type}
              onClick={() => setMood(m.type)}
              className="flex flex-col items-center gap-1 group transition-transform active:scale-90"
              title={m.label}
            >
              <div
                className={`w-7 h-7 rounded-full transition-all duration-200 flex items-center justify-center ${m.color} ${
                  isSelected ? `ring-4 ${m.ringColor} scale-110 shadow-sm` : 'opacity-80 hover:opacity-100'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-slate-800 stroke-[2.5]" />}
              </div>
            </button>
          );
        })}
      </div>

      {todayCheckIn.mood && (
        <div className="mt-2.5 pt-2 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-500 animate-fade-in">
          <span>Logged today at {todayCheckIn.timestamp || '12:00'}</span>
          <span className="text-emerald-600 font-medium flex items-center gap-1">
            <Check className="w-3 h-3" /> Saved privately
          </span>
        </div>
      )}
    </div>
  );
};
