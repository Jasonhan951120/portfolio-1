import React from 'react';
import { motion } from 'framer-motion';

export function SkeletonLeadCard() {
  return (
    <div className="relative w-full max-w-[460px] min-h-[500px] rounded-[56px] border border-white/5 bg-white/[0.03] overflow-hidden p-10 flex flex-col justify-between">
      {/* Shimmer Sweep Animation */}
      <motion.div
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent z-10 skew-x-12"
      />

      <div className="space-y-8 relative z-0">
        {/* Header Skeleton */}
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="h-4 w-32 bg-white/10 rounded-full animate-pulse" />
            <div className="h-10 w-48 bg-white/5 rounded-2xl animate-pulse" />
          </div>
          <div className="h-8 w-24 bg-[#10b981]/10 rounded-full animate-pulse" />
        </div>

        {/* Content Skeleton */}
        <div className="space-y-4">
          <div className="h-4 w-full bg-white/5 rounded-full animate-pulse" />
          <div className="h-4 w-5/6 bg-white/5 rounded-full animate-pulse" />
          <div className="h-4 w-4/6 bg-white/5 rounded-full animate-pulse" />
        </div>

        {/* Tags Skeleton */}
        <div className="flex gap-2 pt-4">
          <div className="h-6 w-20 bg-white/10 rounded-full animate-pulse" />
          <div className="h-6 w-24 bg-white/10 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Footer CTA Skeleton */}
      <div className="space-y-6">
        <div className="h-[72px] w-full bg-white/5 rounded-3xl animate-pulse" />
        <div className="h-10 w-32 mx-auto bg-white/5 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
