import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Heart, Send, CheckCircle2, Sparkles, Flame, ThumbsUp, Lightbulb, GraduationCap } from 'lucide-react';
import { playSound } from '../../utils/audio';

export const StoryViewerModal: React.FC = () => {
  const {
    stories,
    activeStoryIndex,
    closeStoryModal,
    likeStory,
    openStoryModal,
    voteStoryPoll,
    reactToStory,
    sendMessage,
    t
  } = useApp();

  const [replyText, setReplyText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; emoji: string; x: number }[]>([]);
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
    const totalMs = 6000;
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

  // Keyboard navigation: Escape to close, ArrowLeft for prev, ArrowRight for next
  useEffect(() => {
    if (activeStoryIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeStoryModal();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStoryIndex, stories.length]);

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

    // Send reply into chat
    sendMessage(`[Reply to Story "${currentStory.content.substring(0, 30)}..."]: ${replyText.trim()}`);
    playSound('pop');
    setReplyText('');
    alert(`Sent reply to ${currentStory.authorName} in cohort chat!`);
  };

  const handleHeartClick = () => {
    setIsLiked(!isLiked);
    likeStory(currentStory.id);
    handleEmojiReaction('❤️');
  };

  const handleEmojiReaction = (emoji: string) => {
    reactToStory(currentStory.id, emoji);
    const newId = Date.now() + Math.random();
    const xPos = 40 + Math.random() * 40;
    setFloatingEmojis(prev => [...prev, { id: newId, emoji, x: xPos }]);

    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== newId));
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 max-w-[430px] mx-auto select-none overflow-hidden">
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
            <p className="text-[11px] text-white/70">{currentStory.timestamp} · {currentStory.viewCount} views</p>
          </div>
        </div>

        <button
          onClick={closeStoryModal}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Story Content & Tap navigation zones */}
      <div
        className="relative flex-1 my-4 flex flex-col items-center justify-center px-6 rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
        style={{
          background: currentStory.backgroundColor
            ? `linear-gradient(180deg, ${currentStory.backgroundColor} 0%, #090d16 100%)`
            : 'linear-gradient(180deg, #1e1b4b 0%, #090d16 100%)'
        }}
      >
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
        <div className="text-center z-20 max-w-xs animate-fade-in flex flex-col items-center gap-4">
          <div className="text-3xl">✨</div>
          <p className="text-white text-lg font-semibold leading-relaxed tracking-wide">
            {currentStory.content}
          </p>

          {/* Interactive Poll Component */}
          {currentStory.poll && (
            <div className="w-full bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex flex-col gap-2.5 mt-2">
              <p className="text-xs font-bold text-white leading-snug">{currentStory.poll.question}</p>
              <div className="flex gap-2">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    voteStoryPoll(currentStory.id, 'yes');
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    currentStory.poll.userVoted === 'yes'
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {t.stories.pollYes} ({currentStory.poll.yesCount})
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    voteStoryPoll(currentStory.id, 'no');
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    currentStory.poll.userVoted === 'no'
                      ? 'bg-rose-500 text-white shadow-lg'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {t.stories.pollNo} ({currentStory.poll.noCount})
                </button>
              </div>
              {currentStory.poll.userVoted && (
                <p className="text-[10px] text-emerald-300 text-center font-medium">{t.stories.voted}</p>
              )}
            </div>
          )}
        </div>

        {/* Floating Animated Emojis */}
        {floatingEmojis.map(item => (
          <span
            key={item.id}
            className="absolute bottom-6 text-3xl pointer-events-none animate-bounce"
            style={{
              left: `${item.x}%`,
              animationDuration: '0.9s',
              transition: 'all 0.9s ease-out'
            }}
          >
            {item.emoji}
          </span>
        ))}
      </div>

      {/* Floating Reaction Quick Bar */}
      <div className="flex items-center justify-center gap-3 py-1">
        {['🔥', '👏', '❤️', '💡', '🎓'].map(emoji => (
          <button
            key={emoji}
            onClick={() => handleEmojiReaction(emoji)}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 active:scale-125 text-base flex items-center justify-center transition-all"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Footer: Reply & Like */}
      <div className="flex items-center gap-2 pt-2">
        <form onSubmit={handleSendReply} className="flex-1 relative">
          <input
            type="text"
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder={`${t.stories.replyPlaceholder} ${currentStory.authorName}...`}
            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 text-xs rounded-full py-2.5 pl-4 pr-10 focus:outline-none focus:border-blue-500 focus:bg-white/15"
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
          className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
            isLiked
              ? 'bg-rose-500/20 border-rose-500/50 text-rose-500 scale-110'
              : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
        </button>
      </div>
    </div>
  );
};
