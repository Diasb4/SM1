import React, { useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Bell, Award, BookOpen, Heart, MessageSquare, Check, Sparkles } from 'lucide-react';
import { NotificationItem, MenteeView } from '../../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationsAsRead, setMenteeView, role } = useApp();

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const getIcon = useCallback((type: NotificationItem['type']) => {
    switch (type) {
      case 'points':
        return <Award className="w-4 h-4 text-amber-500" />;
      case 'lecture':
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'mentor':
        return <Heart className="w-4 h-4 text-purple-500" />;
      case 'event':
      default:
        return <Sparkles className="w-4 h-4 text-emerald-500" />;
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="notification-drawer-title"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-start justify-center p-4 pt-16 sm:pt-20"
    >
      <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-4 px-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
              <p className="text-[10px] text-slate-400 font-mono">AITU Mentorship Updates</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markNotificationsAsRead}
              className="text-[11px] text-blue-600 font-semibold hover:underline"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="p-3 flex-1 overflow-y-auto flex flex-col gap-2">
          {notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => {
                if (notif.actionView && role === 'mentee') {
                  setMenteeView(notif.actionView as any);
                  onClose();
                }
              }}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                notif.read ? 'bg-slate-50/70 border-slate-100 opacity-75' : 'bg-blue-50/40 border-blue-100 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white shadow-2xs border border-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{notif.title}</h4>
                    <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">{notif.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{notif.body}</p>
                </div>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-400">
              No notifications yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

