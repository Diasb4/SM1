import React from 'react';

export const SkeletonView: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 pb-6 animate-pulse">
      {/* Title */}
      <div className="pt-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pools</h1>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          Mentor cohorts · max 24 each
        </p>
      </div>

      {/* Big Header Skeleton Bar */}
      <div className="h-10 bg-slate-200/80 rounded-2xl w-full shimmer-mask" />

      {/* Small Filter Pills Skeleton */}
      <div className="flex gap-2">
        <div className="h-8 bg-slate-200/70 rounded-full w-20 shimmer-mask" />
        <div className="h-8 bg-slate-200/70 rounded-full w-24 shimmer-mask" />
        <div className="h-8 bg-slate-200/70 rounded-full w-20 shimmer-mask" />
      </div>

      {/* Cards Skeletons */}
      <div className="flex flex-col gap-3 mt-1">
        {[1, 2, 3].map(item => (
          <div
            key={item}
            className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-200 shimmer-mask flex-shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-3.5 bg-slate-200 rounded-md w-3/4 shimmer-mask" />
                <div className="h-2.5 bg-slate-200/70 rounded-md w-1/2 shimmer-mask" />
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-50">
              <div className="h-2 bg-slate-200/60 rounded w-full shimmer-mask" />
              <div className="h-2 bg-slate-200/60 rounded w-4/5 shimmer-mask" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
