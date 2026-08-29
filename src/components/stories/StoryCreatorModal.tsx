import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, Image as ImageIcon, Type, Sparkles } from 'lucide-react';

interface StoryCreatorModalProps {
  onClose: () => void;
}

export const StoryCreatorModal: React.FC<StoryCreatorModalProps> = ({ onClose }) => {
  const { addStory, role } = useApp();
  const [tab, setTab] = useState<'photo' | 'text'>('photo');
  const [textContent, setTextContent] = useState('');
  const [selectedBg, setSelectedBg] = useState('#7C3AED'); // Violet default

  const colorOptions = [
    { name: 'Purple', hex: '#7C3AED' },
    { name: 'Blue', hex: '#2563EB' },
    { name: 'Emerald', hex: '#059669' },
    { name: 'Amber', hex: '#D97706' },
    { name: 'Rose', hex: '#E11D48' }
  ];

  const handleShare = () => {
    const storyContent =
      textContent.trim() ||
      (tab === 'photo'
        ? '📸 Photo update: Peer study session in progress at C1 Lounge!'
        : '🌟 Reminder: You can always reach out if you need help with midterms!');

    addStory({
      authorId: role === 'mentor' ? 'aizhan' : 'me',
      authorName: role === 'mentor' ? 'Aizhan Beibarys' : 'Birzhan',
      authorInitials: role === 'mentor' ? 'AB' : 'BZ',
      authorAvatarBg:
        role === 'mentor' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700',
      type: tab,
      content: storyContent,
      backgroundColor: selectedBg
    });

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
          <h2 className="text-base font-bold text-slate-900">New story</h2>
          <div className="w-14" />
        </div>

        <div className="p-5 flex-1 flex flex-col overflow-y-auto">
          {/* Segmented Control: Photo / Text */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-5">
            <button
              onClick={() => setTab('photo')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                tab === 'photo' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Photo</span>
            </button>
            <button
              onClick={() => setTab('text')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                tab === 'text' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Type className="w-4 h-4" />
              <span>Text</span>
            </button>
          </div>

          {/* Story Preview Container */}
          <div
            className="w-full flex-1 min-h-[300px] rounded-2xl flex flex-col items-center justify-center p-6 text-center transition-all border border-slate-200/60 relative overflow-hidden"
            style={{
              backgroundColor: tab === 'text' ? selectedBg : '#FAF5FF',
              color: tab === 'text' ? '#ffffff' : '#475569'
            }}
          >
            {tab === 'photo' ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-purple-200/50 flex items-center justify-center text-purple-700">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-100 shadow-sm">
                  <span className="text-xs font-semibold text-slate-700">tap to upload photo</span>
                </div>
                <input
                  type="text"
                  placeholder="Add a caption..."
                  value={textContent}
                  onChange={e => setTextContent(e.target.value)}
                  className="mt-3 w-full max-w-xs bg-white/90 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <div className="w-full flex flex-col items-center justify-center">
                <Sparkles className="w-6 h-6 text-white/70 mb-2 animate-pulse" />
                <textarea
                  value={textContent}
                  onChange={e => setTextContent(e.target.value)}
                  placeholder="Type your story update for your mentees..."
                  rows={4}
                  className="w-full bg-transparent text-white text-center text-lg font-medium placeholder-white/60 resize-none focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Background color picker for text stories */}
          {tab === 'text' && (
            <div className="mt-4 flex items-center justify-center gap-3">
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
          <div className="mt-6">
            <button
              onClick={handleShare}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-[0.99] transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Share to 21 mentees</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
