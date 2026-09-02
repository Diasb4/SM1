import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  MoreHorizontal,
  Send,
  Sparkles,
  Search,
  Smile,
  Reply,
  X,
  Users,
  MessageSquare,
  GraduationCap,
  Paperclip,
  CheckCheck,
  Flame,
  ThumbsUp,
  Heart,
  Lightbulb,
  AlertCircle
} from 'lucide-react';
import { playSound } from '../../utils/audio';

export const ChatView: React.FC = () => {
  const {
    chatRooms,
    activeChatRoomId,
    setActiveChatRoomId,
    chatMessages,
    sendMessage,
    reactToChatMessage,
    sendTypingSignal,
    typingUsers,
    currentUser,
    setMenteeView,
    role,
    setMentorView,
    t
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{ id: string; senderName: string; text: string } | null>(null);
  const [activeReactionMenuId, setActiveReactionMenuId] = useState<string | null>(null);
  const [lastSentTime, setLastSentTime] = useState<number>(0);
  const [floodWarning, setFloodWarning] = useState<string | null>(null);

  // Quiet hours: 22:00 - 08:00
  const currentHour = new Date().getHours();
  const isQuietHours = currentHour >= 22 || currentHour < 8;

  // Detect cheeky "do my homework for me" requests
  const hasHomeworkSolicitation = useMemo(() => {
    return /(реши|сделай|напиши)\s*(за меня|лабу|дз|задачу|тест)|(скинь|дай)\s*(ответы|решение|код)|реши лабу/i.test(inputText);
  }, [inputText]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeRoom = chatRooms.find(r => r.id === activeChatRoomId) || chatRooms[0];

  const currentRoomMessages = useMemo(() => {
    return chatMessages.filter(msg => (msg.roomId || 'room-cohort') === activeChatRoomId);
  }, [chatMessages, activeChatRoomId]);

  const filteredMessages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return currentRoomMessages;
    return currentRoomMessages.filter(msg =>
      msg.text.toLowerCase().includes(q) ||
      msg.senderName.toLowerCase().includes(q)
    );
  }, [currentRoomMessages, searchQuery]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentRoomMessages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    sendTypingSignal();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // FOOLPROOF: Anti-flood protection
    const now = Date.now();
    if (now - lastSentTime < 2000) {
      playSound('beep');
      setFloodWarning('Не спамьте так быстро. Подождите 2 секунды перед следующим сообщением.');
      setTimeout(() => setFloodWarning(null), 2500);
      return;
    }

    setLastSentTime(now);
    sendMessage(inputText, replyingTo || undefined);
    setInputText('');
    setReplyingTo(null);
  };

  const handleBack = () => {
    if (role === 'mentee') {
      setMenteeView('home');
    } else {
      setMentorView('community');
    }
  };

  const handleReaction = (msgId: string, emoji: string) => {
    reactToChatMessage(msgId, emoji);
    setActiveReactionMenuId(null);
  };

  const isAnyoneTyping = Object.entries(typingUsers).some(([_, typing]) => typing);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] sm:h-[650px] bg-slate-50/50 rounded-3xl overflow-hidden border border-slate-100 shadow-soft">
      {/* Top Chat Header */}
      <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className={`w-10 h-10 rounded-2xl ${activeRoom.avatarBg} font-bold text-xs flex items-center justify-center shadow-xs`}>
            {activeRoom.initials}
          </div>

          <div>
            <h2 className="text-xs font-bold text-slate-900">{activeRoom.name}</h2>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{activeRoom.subtitle}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsSearching(!isSearching)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isSearching ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-100 text-slate-400'
            }`}
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Channel Switcher Tabs */}
      <div className="bg-white px-3 py-1.5 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {chatRooms.map(room => {
          const isActive = room.id === activeChatRoomId;
          return (
            <button
              key={room.id}
              onClick={() => {
                setActiveChatRoomId(room.id);
                playSound('click');
              }}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {room.type === 'cohort' && <Users className="w-3 h-3" />}
              {room.type === 'direct' && <MessageSquare className="w-3 h-3" />}
              {room.type === 'lecture' && <GraduationCap className="w-3 h-3" />}
              <span>{room.name.split('(')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Search Bar when active */}
      {isSearching && (
        <div className="bg-slate-100 p-2 px-3 border-b border-slate-200 animate-fade-in flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder={t.chat.searchMessages}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-800 focus:outline-none placeholder:text-slate-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')}>
              <X className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}
        </div>
      )}

      {/* Message History List */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {filteredMessages.map(msg => {
          const isMe = msg.senderId === currentUser.id || msg.isMe;

          return (
            <div
              key={msg.id}
              className={`flex flex-col group relative ${isMe ? 'items-end' : 'items-start'}`}
            >
              {!isMe && (
                <span className="text-[10px] font-bold text-slate-500 mb-1 ml-1">
                  {msg.senderName}
                </span>
              )}

              <div className="flex items-end gap-1.5 max-w-[85%]">
                {!isMe && (
                  <div className={`w-7 h-7 rounded-xl ${msg.senderAvatarBg} text-[10px] font-bold flex items-center justify-center flex-shrink-0 mb-1 shadow-2xs`}>
                    {msg.senderInitials}
                  </div>
                )}

                <div
                  className={`p-3 rounded-2xl relative transition-all ${
                    isMe
                      ? 'bg-blue-600 text-white rounded-br-xs shadow-md shadow-blue-600/10'
                      : 'bg-white text-slate-800 border border-slate-100 rounded-bl-xs shadow-soft'
                  }`}
                >
                  {/* Reply Quote Banner */}
                  {msg.replyTo && (
                    <div
                      className={`mb-2 p-1.5 px-2.5 rounded-lg text-[10px] border-l-2 ${
                        isMe
                          ? 'bg-blue-700/50 border-white/60 text-blue-100'
                          : 'bg-slate-100 border-blue-500 text-slate-600'
                      }`}
                    >
                      <span className="font-bold block">{msg.replyTo.senderName}</span>
                      <span className="truncate block opacity-80">{msg.replyTo.text}</span>
                    </div>
                  )}

                  <p className="text-xs leading-relaxed select-text">{msg.text}</p>

                  <div
                    className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                      isMe ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    <span>{msg.time}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-blue-200" />}
                  </div>

                  {/* Reaction bubbles on message */}
                  {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {Object.entries(msg.reactions).map(([emoji, count]) => (
                        count > 0 && (
                          <button
                            key={emoji}
                            onClick={() => handleReaction(msg.id, emoji)}
                            className="bg-slate-100/90 text-slate-800 border border-slate-200/80 rounded-full px-1.5 py-0.2 text-[10px] flex items-center gap-1 shadow-2xs hover:scale-105 transition-transform"
                          >
                            <span>{emoji}</span>
                            <span className="font-bold text-[9px]">{count}</span>
                          </button>
                        )
                      ))}
                    </div>
                  )}
                </div>

                {/* Message Hover Actions (Reply, React) */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 self-center">
                  <button
                    onClick={() => setReplyingTo({ id: msg.id, senderName: msg.senderName, text: msg.text })}
                    className="p-1 rounded-full hover:bg-slate-200/70 text-slate-400 hover:text-slate-700"
                    title="Reply"
                  >
                    <Reply className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setActiveReactionMenuId(activeReactionMenuId === msg.id ? null : msg.id)}
                    className="p-1 rounded-full hover:bg-slate-200/70 text-slate-400 hover:text-slate-700"
                    title="React"
                  >
                    <Smile className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Reaction Quick Picker Popup */}
              {activeReactionMenuId === msg.id && (
                <div className="bg-white rounded-full shadow-lg border border-slate-200 p-1 flex items-center gap-1 z-30 my-1 animate-scale-in">
                  {['❤️', '👍', '🔥', '👏', '💡'].map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(msg.id, emoji)}
                      className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-sm transition-transform hover:scale-125"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Live Typing Indicator */}
        {isAnyoneTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-2 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
            <span>Кто-то печатает...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Reply-to Bar */}
      {replyingTo && (
        <div className="bg-slate-100/90 px-4 py-2 border-t border-slate-200 flex items-center justify-between animate-slide-down">
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <Reply className="w-3.5 h-3.5 text-blue-600" />
            <span>Ответ для <strong className="font-bold">{replyingTo.senderName}</strong>: {replyingTo.text.substring(0, 35)}...</span>
          </div>
          <button onClick={() => setReplyingTo(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Flood Warning */}
      {floodWarning && (
        <div className="bg-rose-50 border-t border-rose-200 px-4 py-2 text-rose-700 text-xs font-bold flex items-center gap-2 animate-shake">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{floodWarning}</span>
        </div>
      )}

      {/* Cheeky Homework Solicitation Detector */}
      {hasHomeworkSolicitation && (
        <div className="bg-amber-50 border-t border-amber-200 px-4 py-2.5 text-amber-900 text-xs flex items-start gap-2 animate-fade-in">
          <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <span className="leading-snug text-[11px]">
            <strong>Правило менторства:</strong> Ментор не пишет код и не решает лабы за тебя. Опиши, в чем конкретно концептуальная сложность или покажи свой код, чтобы ментор помог разобраться!
          </span>
        </div>
      )}

      {/* Quiet Hours Banner */}
      {isQuietHours && (
        <div className="bg-slate-900 text-slate-300 px-4 py-1.5 text-[10px] flex items-center justify-between border-t border-slate-800">
          <span className="flex items-center gap-1.5 font-medium">
            <span>🌙</span>
            <span>Тихие часы (22:00 – 08:00) · Ментор отдыхает. Наставник ответит в рабочее время с 09:00.</span>
          </span>
        </div>
      )}

      {/* Input Message Form */}
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder={t.chat.messagePlaceholder || 'Напишите сообщение...'}
          className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors placeholder:text-slate-400"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white flex items-center justify-center shadow-md shadow-blue-600/20 transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
