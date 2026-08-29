import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WifiOff, RefreshCw, Zap } from 'lucide-react';

export const OfflineErrorView: React.FC = () => {
  const { setIsSimulatingOffline, setMenteeView, triggerConfetti } = useApp();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      setIsSimulatingOffline(false);
      setMenteeView('home');
      triggerConfetti();
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-6 min-h-[560px] my-auto">
      {/* Coral Icon Badge */}
      <div className="w-18 h-18 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-5 shadow-xs" style={{ width: '4.5rem', height: '4.5rem' }}>
        <WifiOff className="w-8 h-8 stroke-[1.8]" />
      </div>

      {/* Headline & Description */}
      <h2 className="text-lg font-bold text-slate-900">Can't reach the server</h2>
      <p className="text-xs text-slate-500 max-w-xs mt-2.5 leading-relaxed">
        We lost the connection to AITU Mentorship. Check your network — your cached pools are still available offline.
      </p>

      {/* Retry Action */}
      <button
        onClick={handleRetry}
        disabled={isRetrying}
        className="mt-6 w-full max-w-xs bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-lg shadow-blue-600/20 transition-all disabled:opacity-75"
      >
        {isRetrying ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Reconnecting...</span>
          </>
        ) : (
          <>
            <Zap className="w-4 h-4" />
            <span>Retry connection</span>
          </>
        )}
      </button>

      {/* Code Status */}
      <p className="mt-4 text-[10px] font-mono text-slate-400">
        503 &nbsp; service_unavailable
      </p>
    </div>
  );
};
