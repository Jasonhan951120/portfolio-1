import React from 'react';
import { Play } from 'lucide-react';

const CinematicIntro: React.FC = () => {
  return (
    <section className="relative h-[60vh] min-h-[500px] bg-slate-900 overflow-hidden flex items-center justify-center">
       {/* Background Video/Image Parallax Placeholder */}
       <div className="absolute inset-0 opacity-40">
           <img 
             src="https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=2000"
             className="w-full h-full object-cover"
             alt="Cinematic Dental Background"
           />
       </div>
       <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50"></div>
       <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-transparent to-transparent"></div>
       
       <div className="relative z-10 text-center max-w-4xl px-6">
           <span className="text-smile-mid font-bold tracking-[0.3em] uppercase text-sm mb-6 block animate-fade-up">The Process</span>
           <h2 className="font-heading text-5xl md:text-7xl font-bold text-white mb-8 leading-tight animate-fade-up delay-100">
               Precision in <br/> Every Detail
           </h2>
           <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed animate-fade-up delay-200">
               Experience the intersection of art and science. Our digital workflow ensures millimeter-perfect accuracy for implants and aligners, giving you a smile that feels as good as it looks.
           </p>
           <button className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full transition-all group animate-fade-up delay-300 hover:scale-105">
               <div className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center">
                   <Play size={16} className="ml-1 fill-current" />
               </div>
               <span className="font-bold tracking-wide">Watch the Film</span>
           </button>
       </div>
    </section>
  );
};

export default CinematicIntro;