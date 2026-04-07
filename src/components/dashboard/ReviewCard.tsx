import React from 'react';
import { Star, Sparkles } from 'lucide-react';

interface ReviewCardProps {
  rev: {
    author: string;
    raw: string;
    ai: string;
    date: string;
  };
  isDark: boolean;
  cardBg: string;
  borderColor: string;
  textColor: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ rev, isDark, cardBg, borderColor, textColor }) => {
  return (
    <div className={`p-8 ${cardBg} border ${borderColor} rounded-[3rem] shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-500`}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase tracking-tighter">
            {rev.author?.substring(0,2)?.toUpperCase() || '--'}
          </div>
          <span className={`text-[13px] font-black ${textColor} uppercase tracking-tight`}>{rev.author}</span>
        </div>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">{rev.date}</span>
      </div>
      
      {/* Laboratory Comparison Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 relative">
        {/* AI Magic Transition Icon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden lg:flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white border border-emerald-100 shadow-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-emerald-500" />
          </div>
        </div>

        {/* Left: Original Review Card (CONTRAST FIX: #374151) */}
        <div className={`p-8 ${isDark ? 'bg-white/5' : 'bg-[#F9FAFB]'} rounded-l-[2.5rem] border-r border-slate-100 relative`}>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">ORIGINAL REVIEW</p>
          <p className={`text-[15px] ${isDark ? 'text-slate-300' : 'text-[#374151]'} font-medium italic leading-[1.7]`}>
            "{rev.raw}"
          </p>
        </div>

        {/* Right: AI Formalised Card (VISIBILITY FIX: h-auto) */}
        <div className={`p-8 ${isDark ? 'bg-white/10' : 'bg-white'} rounded-r-[2.5rem] relative ${isDark ? '' : 'shadow-[0_0_40px_rgba(42,245,152,0.12)]'} z-10`}>
          <div className="flex items-center justify-between mb-4">
            <div className="px-4 py-1.5 bg-gradient-to-r from-[#4285F4]/10 to-[#34A853]/10 border border-[#34A853]/20 rounded-full flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[9px] font-black text-emerald-700 uppercase tracking-[0.15em]">AI Formalised</span>
            </div>
          </div>
          <p className={`text-[15px] ${textColor} font-bold h-auto leading-[1.7]`}>
            {rev.ai}
          </p>
        </div>
      </div>
    </div>
  );
};
