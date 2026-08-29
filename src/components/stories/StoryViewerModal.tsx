import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Heart, Send } from 'lucide-react';

export const StoryViewerModal: React.FC = () => {
  const { stories, activeStoryIndex, closeStoryModal, likeStory, openStoryModal } = useApp();
  const [replyText, setReplyText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<any>(null);

  const currentStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null;

  useEffect(() => {
    if (activeStoryIndex === null) {
      setProgress(0);
      return;
    }

    setProgress(0);
    setIsLiked(false);

    if (timerRef.current) clearInterval(timerRef.current);

    const stepMs = 50;
    const totalMs = 5000;
    timerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timerRef.current);
          handleNext();
          return 100;
        }
        return prev + (stepMs / totalMs) * 100;
      });
    }, stepMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeStoryIndex]);

  if (activeStoryIndex === null || !currentStory) return null;

  const handleNext = () => {
    if (activeStoryIndex < stories.length - 1) {
      openStoryModal(activeStoryIndex + 1);
    } else {
      closeStoryModal();
    }
  };

  const handlePrev = () => {
    if (activeStoryIndex > 1) {
      openStoryModal(activeStoryIndex - 1);
    } else {
      setProgress(0);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setReplyText('');
    // Quick acknowledgment
    alert(`Replied to ${currentStory.authorName}: "${replyText}"`);
  };

  const handleHeartClick = () => {
    setIsLiked(!isLiked);
    likeStory(currentStory.id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 max-w-[430px] mx-auto select-none">
      {/* Progress Bars */}
      <div className="flex gap-1.5 pt-2">
        {stories.slice(1).map((s, idx) => {
          const actualIndex = idx + 1;
          let barFill = '0%';
          if (actualIndex < activeStoryIndex) barFill = '100%';
          else if (actualIndex === activeStoryIndex) barFill = `${progress}%`;

          return (
            <div key={s.id} className="h-1 flex-1 bg-white/25 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-75 ease-linear"
                style={{ width: barFill }}
              />
            </div>
          );
        })}
      </div>

      {/* Header with Author info & Close */}
      <div className="flex items-center justify-between mt-3 text-white">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${currentStory.authorAvatarBg}`}
          >
            {currentStory.authorInitials}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm">{currentStory.authorName}</span>
              {currentStory.isOfficial && (
                <span className="bg-blue-600 text-[10px] px-1.5 py-0.5 rounded-full font-medium">AITU</span>
              )}
            </div>
            <p className="text-[11px] text-white/70">{currentStory.timestamp}</p>
          </div>
        </div>

        <button
          onClick={closeStoryModal}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Story Content & Tap navigation zones */}
      <div className="relative flex-1 my-4 flex items-center justify-center px-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/5 overflow-hidden">
        {/* Left Tap Zone */}
        <div
          onClick={handlePrev}
          className="absolute left-0 top-0 bottom-0 w-1/3 z-10 cursor-pointer"
        />
        {/* Right Tap Zone */}
        <div
          onClick={handleNext}
          className="absolute right-0 top-0 bottom-0 w-2/3 z-10 cursor-pointer"
        />

        {/* Content Body */}
        <div className="text-center p-6 z-0 max-w-xs animate-fade-in">
          <div className="text-2xl mb-4">✨</div>
          <p className="text-white text-lg font-medium leading-relaxed tracking-wide">
            {currentStory.content}
          </p>
          {currentStory.authorId === 'elective' && (
            <div className="mt-6 bg-purple-600/30 border border-purple-500/40 rounded-xl p-3 text-xs text-purple-200">
              💬 Tap reply below to ask your soft mentor for advice on elective choices!
            </div>
          )}
        </div>
      </div>

      {/* Footer: Reply & Like */}
      <div className="flex items-center gap-2 pb-2">
        <form onSubmit={handleSendReply} className="flex-1 relative">
          <input
            type="text"
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder={`Reply to ${currentStory.authorName}...`}
            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm rounded-full py-2.5 pl-4 pr-10 focus:outline-none focus:border-blue-500 focus:bg-white/15"
          />
          {replyText.trim() && (
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300 p-1"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </form>

        <button
          onClick={handleHeartClick}
          className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all ${
            isLiked
              ? 'bg-rose-500/20 border-rose-500/50 text-rose-500 scale-110'
              : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500' : ''}`} />
        </button>
      </div>
    </div>
  );
};
