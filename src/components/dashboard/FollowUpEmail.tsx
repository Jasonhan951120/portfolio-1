import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, MapPin, Globe } from 'lucide-react';

interface Review {
  author: string;
  raw: string;
  ai?: string;
  date: string;
  rating: number;
}

interface FollowUpEmailProps {
  leadName: string;
  clinicName: string;
  clinicLogo?: string;
  treatmentName: string;
  reviews: Review[];
  rating?: number;
  reviewCount?: number;
  googlePlaceId?: string;
  personalizedNote?: string;
  reputationMode?: 'Booster' | 'Steady' | 'Saver';
}

export const FollowUpEmail: React.FC<FollowUpEmailProps> = ({
  leadName,
  clinicName,
  clinicLogo,
  treatmentName,
  reviews = [],
  rating = 4.9,
  googlePlaceId,
  personalizedNote,
  reputationMode = 'Steady'
}) => {
  const [currentReviewIdx, setCurrentReviewIdx] = useState(0);

  // Fallback reviews if none are provided
  const displayReviews = reviews.length > 0 ? reviews : [
    {
      author: "Verified Patient",
      raw: "Just recently moved to this office and am very happy I did! Everyone is extremely friendly and they take the time to listen to your questions - you don't feel rushed. Highly recommend!",
      ai: "Just recently moved to this office and am very happy I did! Everyone is extremely friendly and they take the time to listen to your questions - you don't feel rushed. Highly recommend!",
      date: "RECENTLY",
      rating: 5.0
    },
    {
      author: "SARAH JENKINS",
      raw: "Just finished my veneer treatment and I couldn't be happier. The transition was so smooth and the results are unbelievable.",
      ai: "Just finished my transformation at Hanlan Clinical and the results are truly world-class. The precision and care shown by the team surpassed all expectations. My confidence has been completely restored.",
      date: "2 DAYS AGO",
      rating: 5.0
    },
    {
        author: "ALEX MONROE",
        raw: "Five stars across the board for Hanlan. The wait was minimal and the service was world-class.",
        ai: "The clinical standard at Hanlan is unparalleled. Every detail of my protocol was executed with surgical precision. Highly recommended for those seeking VVIP care.",
        date: "1 WEEK AGO",
        rating: 5.0
    }
  ];

  // Logic for Dynamic Review Selection based on Reputation Mode
  let selectedReviews: Review[] = [];
  if (reputationMode === 'Booster') {
      selectedReviews = displayReviews.slice(0, 3);
  } else if (reputationMode === 'Saver') {
      // Find the best review
      const best = [...displayReviews].sort((a, b) => b.rating - a.rating)[0];
      selectedReviews = [best];
  } else {
      // Steady - use the first (most recent)
      selectedReviews = [displayReviews[0]];
  }

  const currentReview = displayReviews[currentReviewIdx];

  const nextReview = () => {
    setCurrentReviewIdx((prev) => (prev + 1) % displayReviews.length);
  };

  const prevReview = () => {
    setCurrentReviewIdx((prev) => (prev - 1 + displayReviews.length) % displayReviews.length);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-2xl rounded-[40px] overflow-hidden border border-slate-100 flex flex-col font-sans">
      {/* RICH NAVY HEADER */}
      <div className="bg-[#111827] px-10 py-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-20" />
        <div className="relative z-10">
          {clinicLogo ? (
            <img src={clinicLogo} alt={clinicName} className="w-16 h-16 mx-auto mb-6 rounded-2xl object-cover border border-white/10 shadow-2xl" />
          ) : (
            <div className="w-16 h-16 bg-white/10 rounded-2xl mx-auto mb-6 flex items-center justify-center border border-white/20 shadow-2xl">
              <span className="text-white font-serif italic text-3xl">{clinicName?.charAt(0) || 'H'}</span>
            </div>
          )}
          <h2 className="text-white font-serif italic text-3xl tracking-tight mb-2">{clinicName || 'Hanlan Clinical'}</h2>
          <div className="flex items-center justify-center gap-2">
            <div className="h-[1px] w-8 bg-[#c5a059]" />
            <span className="text-[10px] font-black text-[#c5a059] uppercase tracking-[0.4em]">Clinical Excellence</span>
            <div className="h-[1px] w-8 bg-[#c5a059]" />
          </div>
        </div>
      </div>

      {/* CONTENT BODY */}
      <div className="px-12 py-12 bg-white flex flex-col items-center">
        <div className="w-full max-w-lg">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 text-center">Protocol Follow-up</p>
          <h1 className="text-4xl font-serif font-bold text-[#111827] text-center leading-tight mb-8">
            Dear {leadName?.split(' ')[0] || 'Patient'}, <br />
            <span className="text-slate-400 italic font-medium">Your {treatmentName || 'Treatment'} Journey.</span>
          </h1>

          <div className="space-y-6 text-[#374151] leading-relaxed text-sm font-medium mb-10 text-center">
            {personalizedNote ? (
              <p className="whitespace-pre-wrap">{personalizedNote}</p>
            ) : (
              <>
                <p>
                  At {clinicName || 'Hanlan Medical Group'}, we believe that exceptional clinical results are built on a foundation of precision and consistent care.
                </p>
                <p>
                  Is there anything further we can clarify regarding your clinical protocol, comfort options, or financing? We seek to ensure absolute confidence in your upcoming procedure.
                </p>
              </>
            )}
          </div>

          {/* DYNAMIC SOCIAL PROOF SECTION: Injected based on Reputation Mode */}
          <div className="w-full mb-10">
            {reputationMode === 'Booster' ? (
              /* BOOSTER MODE: Triple Testimonial Prestige Stack */
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                     <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-[#c5a059] fill-[#c5a059]" />)}
                     </div>
                     <span className="text-[10px] font-black text-[#111827] uppercase tracking-widest">Clinic Performance: 5.0</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span className="text-[8px] font-black text-emerald-700 uppercase tracking-widest">Verified Results</span>
                  </div>
                </div>
                
                {selectedReviews.map((rev, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-[#F9FAFB] rounded-3xl p-6 border border-black/[0.03] shadow-sm hover:shadow-md transition-shadow"
                  >
                    <p className="text-[15px] font-serif italic font-bold text-[#111827] leading-relaxed mb-4">
                      "{rev.ai || rev.raw}"
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{rev.author}</span>
                      <span className="text-[8px] font-black text-[#c5a059] uppercase tracking-[0.2em]">Verified Patient</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              /* STEADY/SAVER MODE: Singular High-Impact Card */
              <div className="bg-[#F9FAFB] rounded-[32px] p-8 border border-black/5 relative overflow-hidden group/card shadow-sm">
                <div className="absolute top-0 right-0 p-6 flex items-center gap-1 opacity-20">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-[8px] font-black uppercase tracking-widest">Verified</span>
                </div>

                <div className="flex flex-col items-center mb-8">
                  <div className="flex gap-1.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-[#c5a059] fill-[#c5a059]" />
                    ))}
                  </div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    PATIENT ANALYSIS: <span className="text-[#111827]">5.0 / 5.0</span>
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-[19px] font-serif italic font-bold text-[#111827] leading-relaxed px-4 whitespace-pre-wrap mb-8">
                    "{selectedReviews[0]?.ai || selectedReviews[0]?.raw}"
                  </p>
                  
                  <div className="flex flex-col items-center">
                    <p className="text-[10px] font-black text-[#111827] tracking-widest uppercase mb-1">
                      {selectedReviews[0]?.author}
                    </p>
                    <p className="text-[8px] font-black text-[#88b399] tracking-[0.3em] uppercase">
                      VERIFIED CLINICAL EXPERIENCE
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* View More Logic (Common for all modes) */}
            <div className="mt-8 flex justify-center">
               <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (googlePlaceId) {
                    window.open(`https://search.google.com/local/reviews?placeid=${googlePlaceId}`, '_blank');
                  }
                }}
                className="group flex items-center gap-4 px-8 py-4 bg-[#111827] rounded-full text-[10px] font-black text-white uppercase tracking-[.25em] hover:bg-[#374151] hover:scale-105 transition-all shadow-xl shadow-navy-900/20"
               >
                  See More Patient Experiences
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
          </div>

          <div className="flex flex-col items-center py-8 border-t border-slate-100 w-full">
            <button className="w-full py-5 bg-[#111827] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-slate-800 transition-all mb-4">
              Speak with My Specialist
            </button>
            <p className="text-[10px] text-slate-400 font-medium italic">Available 24/7 for Harley Street Clinical Support</p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-[#F9FAFB] px-12 py-10 border-t border-slate-100">
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-3 h-3 text-[#c5a059]" />
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Location</span>
            </div>
            <p className="text-[10px] font-bold text-slate-900 leading-normal">
              Harley Street Medical District<br />London, United Kingdom
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 mb-3">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Connect</span>
              <Globe className="w-3 h-3 text-[#c5a059]" />
            </div>
            <p className="text-[10px] font-bold text-slate-900">
              www.hanlanoc.com<br />
              clinical.concierge@hanlanoc.com
            </p>
          </div>
        </div>
        <div className="text-center pt-8 border-t border-slate-200/50">
          <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.5em]">Hanlan Medical Group © 2026</p>
        </div>
      </div>
    </div>
  );
};
