import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, MoreHorizontal, Send, Sparkles } from 'lucide-react';

export const ChatView: React.FC = () => {
  const { chatMessages, sendMessage, setMenteeView, role, setMentorView } = useApp();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  const handleBack = () => {
    if (role === 'mentee') {
      setMenteeView('home');
    } else {
      setMentorView('community');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] sm:h-[650px] bg-slate-50/50 rounded-2xl overflow-hidden border border-slate-100 shadow-soft">
      {/* Top Chat Header */}
      <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200">
            RK
          </div>

          <div>
            <h2 className="text-xs font-bold text-slate-900">Group of Ruslan Kadirov</h2>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>24 members · 4 online</span>
            </div>
          </div>
        </div>

        <button className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {/* Date Divider */}
        <div className="flex justify-center my-1">
          <span className="bg-white border border-slate-200 text-slate-400 text-[10px] font-medium px-3 py-0.5 rounded-full shadow-xs">
            Today
          </span>
        </div>

        {chatMessages.map(msg => {
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 max-w-[85%] ${
                msg.isMe ? 'self-end flex-row-reverse' : 'self-start'
              }`}
            >
              {!msg.isMe && (
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${msg.senderAvatarBg}`}
                >
                  {msg.senderInitials}
                </div>
              )}

              <div className="flex flex-col">
                {!msg.isMe && (
                  <span className="text-[10px] text-slate-400 font-medium ml-1 mb-0.5">
                    {msg.senderName}
                  </span>
                )}
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.isMe
                      ? 'bg-blue-600 text-white rounded-br-xs shadow-sm shadow-blue-600/10'
                      : 'bg-white border border-slate-100 text-slate-800 rounded-bl-xs shadow-soft'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <div
                    className={`text-[9px] mt-1 text-right ${
                      msg.isMe ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Bar */}
      <div className="bg-white p-3 border-t border-slate-100">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Message..."
            className="flex-1 bg-slate-100 border border-transparent text-slate-800 placeholder-slate-400 text-xs rounded-full px-4 py-2.5 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-9 h-9 rounded-full bg-blue-600 disabled:bg-slate-300 text-white flex items-center justify-center shadow-md shadow-blue-600/20 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
