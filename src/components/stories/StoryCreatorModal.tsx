import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, Image as ImageIcon, Type, Sparkles, HelpCircle } from 'lucide-react';
import { playSound } from '../../utils/audio';

interface StoryCreatorModalProps {
  onClose: () => void;
}

export const StoryCreatorModal: React.FC<StoryCreatorModalProps> = ({ onClose }) => {
  const { addStory, role, t } = useApp();
  const [tab, setTab] = useState<'photo' | 'text' | 'poll'>('text');
  const [textContent, setTextContent] = useState('');
  const [pollQuestion, setPollQuestion] = useState('');
  const [selectedBg, setSelectedBg] = useState('#7C3AED'); // Violet default

  const colorOptions = [
    { name: 'Purple', hex: '#7C3AED' },
    { name: 'Blue', hex: '#2563EB' },
    { name: 'Emerald', hex: '#059669' },
    { name: 'Amber', hex: '#D97706' },
    { name: 'Rose', hex: '#E11D48' },
    { name: 'Dark', hex: '#0F172A' }
  ];

  const handleShare = () => {
    const storyContent =
      textContent.trim() ||
      (tab === 'photo'
        ? '📸 Photo update: Peer study session in progress at C1 Lounge!'
        : tab === 'poll'
        ? '📊 Cohort Question'
        : '🌟 Reminder: You can always reach out if you need help with midterms!');

    const pollData =
      tab === 'poll' && pollQuestion.trim()
        ? {
            question: pollQuestion.trim(),
            yesCount: 3,
            noCount: 0
          }
        : undefined;

    addStory({
      authorId: role === 'mentor' ? 'aizhan' : 'me',
      authorName: role === 'mentor' ? 'Aizhan Beibarys' : 'Birzhan',
      authorInitials: role === 'mentor' ? 'AB' : 'BZ',
      authorAvatarBg:
        role === 'mentor' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700',
      type: tab,
      content: storyContent,
      backgroundColor: selectedBg,
      poll: pollData
    });

    playSound('success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-[430px] h-full sm:h-auto sm:max-h-[90vh] sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium text-sm"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Cancel</span>
          </button>
          <h2 className="text-base font-bold text-slate-900">{t.stories.newStory}</h2>
          <div className="w-14" />
        </div>

        <div className="p-5 flex-1 flex flex-col overflow-y-auto">
          {/* Segmented Control: Photo / Text / Poll */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
            <button
              onClick={() => setTab('text')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                tab === 'text' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>{t.stories.text}</span>
            </button>
            <button
              onClick={() => setTab('poll')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                tab === 'poll' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t.stories.poll}</span>
            </button>
            <button
              onClick={() => setTab('photo')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                tab === 'photo' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{t.stories.photo}</span>
            </button>
          </div>

          {/* Story Preview Container */}
          <div
            className="w-full flex-1 min-h-[260px] rounded-3xl flex flex-col items-center justify-center p-6 text-center transition-all border border-slate-200/60 relative overflow-hidden shadow-inner"
            style={{
              backgroundColor: tab === 'photo' ? '#FAF5FF' : selectedBg,
              color: tab === 'photo' ? '#475569' : '#ffffff'
            }}
          >
            {tab === 'photo' ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-purple-200/50 flex items-center justify-center text-purple-700">
                  <ImageIcon className="w-7 h-7" />
                </div>
                <span className="text-xs font-semibold text-slate-700">{t.stories.tapToUpload}</span>
                <input
                  type="text"
                  placeholder={t.stories.captionPlaceholder}
                  value={textContent}
                  onChange={e => setTextContent(e.target.value)}
                  className="mt-2 w-full max-w-xs bg-white border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : tab === 'poll' ? (
              <div className="w-full flex flex-col items-center justify-center gap-3">
                <Sparkles className="w-6 h-6 text-white/80 animate-pulse" />
                <input
                  type="text"
                  value={pollQuestion}
                  onChange={e => setPollQuestion(e.target.value)}
                  placeholder={t.stories.pollQuestionPlaceholder}
                  className="w-full bg-white/20 text-white placeholder-white/60 text-center text-sm font-bold p-3 rounded-2xl border border-white/30 focus:outline-none focus:bg-white/30"
                />
                <div className="w-full flex gap-2 max-w-xs">
                  <div className="flex-1 bg-white/10 p-2 rounded-xl text-xs text-white border border-white/20">
                    {t.stories.pollYes}
                  </div>
                  <div className="flex-1 bg-white/10 p-2 rounded-xl text-xs text-white border border-white/20">
                    {t.stories.pollNo}
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center justify-center">
                <Sparkles className="w-6 h-6 text-white/70 mb-2 animate-pulse" />
                <textarea
                  value={textContent}
                  onChange={e => setTextContent(e.target.value)}
                  placeholder={t.stories.typeStoryPlaceholder}
                  rows={4}
                  className="w-full bg-transparent text-white text-center text-lg font-medium placeholder-white/60 resize-none focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Background color picker for text / poll stories */}
          {tab !== 'photo' && (
            <div className="mt-3 flex items-center justify-center gap-2.5">
              {colorOptions.map(c => (
                <button
                  key={c.hex}
                  onClick={() => setSelectedBg(c.hex)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    selectedBg === c.hex ? 'scale-125 ring-2 ring-offset-2 ring-slate-400' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          )}

          {/* Share CTA Button */}
          <div className="mt-5">
            <button
              onClick={handleShare}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-[0.99] transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{t.stories.shareBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
