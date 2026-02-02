import React, { useState, useEffect } from 'react';
import { Timer, ArrowRight } from 'lucide-react';

const Offer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 35, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 bg-page" id="offer">
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-r from-teal-900/40 to-slate-900/40 backdrop-blur-md border border-white/10 rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden shadow-glass">
          
          {/* Background effects */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-smile-mid rounded-full filter blur-[120px] opacity-20 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500 rounded-full filter blur-[120px] opacity-10 -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
          <div className="absolute inset-0 noise-bg opacity-10 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
            
            <div className="lg:w-1/2">
                <div className="inline-flex items-center gap-2 bg-smile-accent/10 border border-smile-accent/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 text-smile-accent shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                    New Patient Special
                </div>
                <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    Full Consultation <br/>
                    + <span className="text-transparent bg-clip-text bg-gradient-to-r from-smile-mid to-smile-light">Whitening Kit</span>
                </h2>
                <div className="flex items-baseline gap-4 mb-6">
                    <span className="text-5xl font-bold text-white shadow-glow">$99</span>
                    <span className="text-xl text-slate-500 line-through decoration-slate-500 decoration-2">was $299</span>
                </div>
                <p className="text-slate-300 max-w-md text-lg leading-relaxed">
                    Includes comprehensive 3D scan, doctor examination, and a professional take-home whitening system.
                </p>
            </div>

            <div className="lg:w-1/2 flex flex-col items-center lg:items-end w-full">
                <div className="bg-black/30 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] w-full max-w-md shadow-2xl">
                    <div className="flex items-center gap-2 mb-6 text-smile-mid font-bold uppercase tracking-widest text-xs">
                        <Timer size={14} />
                        <span>Offer Expires In</span>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'Days', val: timeLeft.days },
                            { label: 'Hrs', val: timeLeft.hours },
                            { label: 'Mins', val: timeLeft.minutes },
                            { label: 'Secs', val: timeLeft.seconds }
                        ].map((item, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold font-heading mb-1 text-white">{item.val}</div>
                                <div className="text-[10px] uppercase tracking-wider text-slate-500">{item.label}</div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full bg-white text-page hover:bg-smile-mid hover:text-black text-lg px-8 py-4 rounded-xl font-bold transition-all flex justify-between items-center group shadow-glow">
                        Claim Offer
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-center text-xs text-slate-500 mt-4">Limited to first 50 patients this month.</p>
                </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Offer;