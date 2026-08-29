import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StoryCreatorModal } from '../stories/StoryCreatorModal';
import { Plus, Eye, Clock, MoreHorizontal, Sparkles } from 'lucide-react';

export const MentorStoriesView: React.FC = () => {
  const { stories, openStoryModal } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const activeStories = stories.slice(1);

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Title */}
      <div className="pt-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Stories</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Keep the cohort alive · 24h ephemeral
        </p>
      </div>

      {/* Post a Story CTA Card */}
      <div
        onClick={() => setShowCreateModal(true)}
        className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft cursor-pointer hover:border-blue-200 hover:shadow-card transition-all flex items-center gap-3.5 group"
      >
        <div className="w-12 h-12 rounded-full border-2 border-dashed border-blue-400 bg-blue-50/50 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
          <Plus className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            Post a story
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Photo, campus update or a quick note</p>
        </div>
      </div>

      {/* Live Now Section */}
      <div className="flex flex-col gap-2.5">
        <h2 className="text-xs font-bold text-slate-800 tracking-tight">Live now</h2>

        <div className="flex flex-col gap-3">
          {activeStories.map((story, idx) => (
            <div
              key={story.id}
              onClick={() => openStoryModal(idx + 1)}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft cursor-pointer hover:border-slate-200 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xs font-bold p-2 text-center shadow-xs"
                  style={{ backgroundColor: story.backgroundColor || '#4338CA' }}
                >
                  <span className="line-clamp-2 text-[10px]">
                    {story.content.substring(0, 20)}...
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-900">{story.authorName}</h3>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-slate-400" />
                      <span>{story.viewCount} views</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{story.hoursLeft}h left</span>
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={e => {
                  e.stopPropagation();
                }}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Create Story Modal */}
      {showCreateModal && <StoryCreatorModal onClose={() => setShowCreateModal(false)} />}
    </div>
  );
};
