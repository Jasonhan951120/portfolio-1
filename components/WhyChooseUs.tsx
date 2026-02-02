import React from 'react';
import { ShieldCheck, CreditCard, Clock, Star, Zap } from 'lucide-react';

const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-page" id="about">
      
      {/* Liquid Background */}
      <div className="absolute inset-0 opacity-20 noise-bg pointer-events-none"></div>
      {/* Large subtle gradient blob */}
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-smile-mid/10 rounded-full blur-[150px] pointer-events-none translate-y-1/2 -translate-x-1/4"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
            
            <div className="lg:w-1/2 reveal">
                <div className="inline-flex items-center gap-2 border border-smile-mid/30 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-6 text-smile-mid bg-smile-mid/5">
                    <Zap size={14} className="fill-current" />
                    The SmileCraft Difference
                </div>
                <h2 className="font-heading text-4xl md:text-6xl font-bold mb-8 leading-tight text-white">
                    Dentistry <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-smile-light to-smile-mid">Reimagined</span>
                </h2>
                <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-lg">
                    We've stripped away the cold clinical feel and replaced it with a hospitality-first approach. 
                    Experience dental care that feels like a retreat.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                        "Top 1% of Dental Specialists",
                        "Hospital-Grade Sterilization",
                        "Private Treatment Suites",
                        "Concierge Patient Support"
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 group">
                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-smile-mid shrink-0 group-hover:bg-smile-mid group-hover:text-black transition-colors">
                                <ShieldCheck size={16} />
                            </div>
                            <span className="font-medium text-slate-300 group-hover:text-white transition-colors">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="lg:w-1/2 grid grid-cols-2 gap-5 reveal delay-200">
                {/* Card 1 */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2rem] flex flex-col items-center text-center hover:bg-white/10 hover:border-smile-mid/30 transition-all duration-300 group">
                    <Clock className="text-smile-mid mb-6 group-hover:scale-110 transition-transform" size={40} />
                    <h3 className="font-bold text-xl mb-2 text-white">Efficiency</h3>
                    <p className="text-sm text-slate-400">Same-day appointments for urgent care needs</p>
                </div>
                
                {/* Card 2 - Elevated */}
                <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2rem] flex flex-col items-center text-center shadow-2xl shadow-black/50 transform translate-y-8 hover:translate-y-6 transition-all duration-300 group">
                    <CreditCard className="text-white mb-6 group-hover:scale-110 transition-transform" size={40} />
                    <h3 className="font-bold text-xl mb-2 text-white">Flexibility</h3>
                    <p className="text-sm text-slate-400">0% financing options available for all patients</p>
                </div>

                {/* Card 3 */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2rem] flex flex-col items-center text-center hover:bg-white/10 hover:border-smile-mid/30 transition-all duration-300 group">
                    <ShieldCheck className="text-smile-mid mb-6 group-hover:scale-110 transition-transform" size={40} />
                    <h3 className="font-bold text-xl mb-2 text-white">Warranty</h3>
                    <p className="text-sm text-slate-400">Lifetime guarantee on implants and veneers</p>
                </div>

                {/* Card 4 - Elevated */}
                <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2rem] flex flex-col items-center text-center shadow-2xl shadow-black/50 transform translate-y-8 hover:translate-y-6 transition-all duration-300 group">
                    <Star className="text-smile-accent mb-6 fill-smile-accent group-hover:scale-110 transition-transform" size={40} />
                    <h3 className="font-bold text-xl mb-2 text-white">Excellence</h3>
                    <p className="text-sm text-slate-400">Consistently rated 5-stars by local families</p>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;