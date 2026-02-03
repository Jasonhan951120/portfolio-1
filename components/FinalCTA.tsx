import React from 'react';
import { CalendarCheck } from 'lucide-react';

const FinalCTA: React.FC = () => {
  return (
    <section className="py-32 relative overflow-hidden bg-page border-t border-white/5">
       {/* Liquid Gradient Background */}
       <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-0"></div>
       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-smile-mid/10 rounded-full blur-[150px] pointer-events-none"></div>
       <div className="absolute inset-0 noise-bg opacity-10 pointer-events-none"></div>

       <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="font-heading text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight drop-shadow-lg">
            Ready to Smile?
          </h2>
          <p className="text-slate-300 text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Join over 10,000 patients who have trusted SmileCraft with their confidence. Your journey starts with a conversation.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
             <button className="bg-white text-page hover:bg-smile-mid hover:text-black text-lg px-10 py-5 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(45,212,191,0.6)] flex items-center gap-3 transform hover:scale-105">
                <CalendarCheck size={20} />
                Book Consultation
             </button>
             <div className="text-white font-medium backdrop-blur-sm bg-white/5 px-6 py-4 rounded-full border border-white/10">
                <span className="opacity-60 block text-sm sm:inline sm:mr-3">Questions? Call us:</span>
                <a href="tel:+15551234567" className="text-xl font-bold hover:text-smile-mid transition-colors">(555) 123-4567</a>
             </div>
          </div>
       </div>
    </section>
  );
};

export default FinalCTA;