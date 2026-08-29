import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Heart,
  LayoutGrid,
  Lock,
  LogOut,
  ChevronRight,
  Sparkles,
  Smartphone
} from 'lucide-react';

export const MenteeProfileView: React.FC = () => {
  const { myMentor, setSelectedMentorDetail, setRole, triggerConfetti } = useApp();
  const [showPwaModal, setShowPwaModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleInstallPin = () => {
    setShowPwaModal(true);
    triggerConfetti();
  };

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Title */}
      <div className="pt-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Profile</h1>
      </div>

      {/* Main Profile Info Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-sky-100 text-sky-700 font-bold text-lg flex items-center justify-center border-2 border-sky-200 shadow-xs">
            BZ
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-slate-900 truncate">
              Birzhan Zhanbolatuly
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Software Engineering · 2nd year
            </p>
            <div className="mt-2">
              <span className="bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                Mentee
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings / Links List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden divide-y divide-slate-100">
        {/* Microsoft SSO */}
        <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Verified via Microsoft</p>
              <p className="text-[11px] text-emerald-600 font-mono">254977@astanait.edu.kz</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Soft Mentor link */}
        <div
          onClick={() => {
            if (myMentor) setSelectedMentorDetail(myMentor);
          }}
          className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Soft mentor</p>
              <p className="text-[11px] text-slate-500">{myMentor?.name || 'Amina Sergazina'}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Install / Pin app */}
        <div
          onClick={handleInstallPin}
          className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <LayoutGrid className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Install / pin app</p>
              <p className="text-[11px] text-slate-500">PWA Add to Home Screen</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Privacy & data */}
        <div
          onClick={() => setShowPrivacyModal(true)}
          className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
              <Lock className="w-4 h-4 text-slate-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Privacy & data</p>
              <p className="text-[11px] text-slate-500">Voluntary sharing policy</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Sign Out Button */}
      <button
        onClick={() => {
          if (confirm('Do you want to switch to Mentor role demo?')) {
            setRole('mentor');
          }
        }}
        className="w-full bg-white hover:bg-rose-50 border border-rose-100 text-rose-600 font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-soft transition-colors mt-1"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign out</span>
      </button>

      {/* Footer Info */}
      <div className="text-center pt-2">
        <p className="text-[10px] font-mono text-slate-400">
          AITU Mentorship · v1.0 · dev.aitusa.mentorship
        </p>
      </div>

      {/* PWA Info Modal */}
      {showPwaModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Pin to Home Screen</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              On iOS: Tap <span className="font-bold">Share</span> and select <span className="font-bold">Add to Home Screen</span>.
              <br />
              On Android: Tap the three dots menu and select <span className="font-bold">Install app</span>.
            </p>
            <button
              onClick={() => setShowPwaModal(false)}
              className="mt-5 w-full bg-slate-900 text-white font-semibold py-2.5 rounded-xl text-xs"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-2">Privacy & Data</h3>
            <p className="text-xs text-slate-600 leading-relaxed space-y-2">
              Your daily check-ins are strictly private. Mentors only receive aggregated trends or items you explicitly choose to share during 1-on-1 sessions.
            </p>
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="mt-5 w-full bg-slate-900 text-white font-semibold py-2.5 rounded-xl text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
