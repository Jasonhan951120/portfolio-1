import React from 'react';
import { Star, Sparkles, ShieldCheck } from 'lucide-react';

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
    <div className={`w-full p-10 ${cardBg} border ${borderColor} rounded-[3rem] shadow-sm relative overflow-visible group hover:shadow-md transition-all duration-500 mb-12`}>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-black text-slate-400 uppercase tracking-tighter shadow-inner">
            {rev.author?.substring(0,2)?.toUpperCase() || '--'}
          </div>
          <div>
            <span className={`text-[14px] font-black ${textColor} uppercase tracking-tight block`}>{rev.author}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{rev.date}</span>
          </div>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          ))}
        </div>
      </div>
      
      {/* Laboratory Comparison Layout: Side-by-Side Professional Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative items-stretch">
        {/* AI Magic Transition Icon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden lg:flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-white border border-emerald-100 shadow-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-emerald-500" />
          </div>
        </div>

        {/* Left: ORIGINAL REVIEW Card */}
        <div className={`p-10 ${isDark ? 'bg-white/5' : 'bg-[#F9FAFB]'} rounded-[2.5rem] border border-slate-100 relative flex flex-col h-full`}>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[10px] font-black text-[#88b399] uppercase tracking-[0.2em]">ORIGINAL REVIEW</span>
          </div>
          <p className={`text-[15px] text-[#374151] font-medium italic leading-[1.8] flex-1`} style={{ whiteSpace: 'pre-wrap' }}>
            "{rev.raw}"
          </p>
        </div>

        {/* Right: AI FORMALISED Card - THE STAR OF THE SHOW */}
        <div className={`p-10 ${isDark ? 'bg-white/10' : 'bg-white'} rounded-[2.5rem] border ${borderColor} relative shadow-[0_0_50px_rgba(42,245,152,0.15)] z-10 flex flex-col h-full`}>
          <div className="flex items-center justify-between mb-6">
            <div className="px-5 py-2 bg-emerald-50 border border-emerald-100 rounded-full flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[9px] font-black text-emerald-700 uppercase tracking-[0.15em]">Clinical/Professional Tone Applied</span>
            </div>
          </div>
          <p className={`text-[17px] text-[#111827] font-serif italic font-bold h-auto leading-[1.8] flex-1`} style={{ whiteSpace: 'pre-wrap' }}>
            {rev.ai.startsWith('AI formalised:') ? rev.ai : `AI formalised: ${rev.ai}`}
          </p>
          
          <div className="mt-8 pt-6 border-t border-emerald-50 flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-500" />
             </div>
             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Formalised by Hanlan Clinical AI</span>
          </div>
        </div>
      </div>
    </div>
  );
};
