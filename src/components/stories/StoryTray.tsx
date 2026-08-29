import React from 'react';
import { useApp } from '../../context/AppContext';
import { Plus } from 'lucide-react';

interface StoryTrayProps {
  onAddStoryClick?: () => void;
}

export const StoryTray: React.FC<StoryTrayProps> = ({ onAddStoryClick }) => {
  const { stories, openStoryModal, role } = useApp();

  return (
    <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2 px-1">
      {/* You / Add Story */}
      <div
        onClick={() => {
          if (role === 'mentor' && onAddStoryClick) {
            onAddStoryClick();
          } else {
            openStoryModal(0);
          }
        }}
        className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0 group"
      >
        <div className="w-14 h-14 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 group-hover:border-blue-500 group-hover:bg-blue-50 transition-all text-slate-600 group-hover:text-blue-600">
          <Plus className="w-5 h-5" />
        </div>
        <span className="text-[11px] font-medium text-slate-600 group-hover:text-slate-900">You</span>
      </div>

      {/* Stories list */}
      {stories.slice(1).map((story, idx) => {
        const actualIndex = idx + 1;
        return (
          <div
            key={story.id}
            onClick={() => openStoryModal(actualIndex)}
            className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0 group"
          >
            <div
              className={`w-14 h-14 rounded-full p-0.5 transition-all transform group-hover:scale-105 ${
                story.hasUnseen
                  ? 'bg-gradient-to-tr from-purple-500 via-pink-500 to-blue-500 animate-ring-pulse'
                  : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-full h-full rounded-full border-2 border-white flex items-center justify-center text-xs font-bold ${story.authorAvatarBg}`}
              >
                {story.authorInitials}
              </div>
            </div>
            <span className="text-[11px] font-medium text-slate-700 max-w-[56px] truncate text-center">
              {story.authorName}
            </span>
          </div>
        );
      })}
    </div>
  );
};
