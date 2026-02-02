import React from 'react';
import { ArrowRight } from 'lucide-react';

const Facilities: React.FC = () => {
  const facilities = [
    {
      title: "Executive Treatment Suites",
      desc: "Ergonomic comfort with ceiling-mounted entertainment systems for a relaxing experience.",
      image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800",
      active: true
    },
    {
      title: "3D Imaging Center",
      desc: "Low-radiation CT scanning for precise implant planning and diagnostics.",
      image: "https://res.cloudinary.com/dvmxeaefb/image/upload/v1770053278/hf_20260131_132823_93666d77-fbd9-48e5-b8f5-6d57daf7365b_uhjhbh.png",
      active: false
    },
    {
      title: "Patient Recovery Lounge",
      desc: "A calming pre-treatment space designed to reduce anxiety and promote wellness.",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
      active: false
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-surface overflow-hidden relative" id="facilities">
      {/* Background Blobs for Atmosphere */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-teal-500/5 rounded-full blur-[80px] pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-center">
          
          {/* Left Content */}
          <div className="lg:w-5/12 relative text-center lg:text-left">
            
            <h2 className="font-heading text-4xl md:text-6xl font-bold text-slate-900 leading-[1.1] mb-6 md:mb-8">
              Take A Tour <br/>
              Of Our <span className="text-smile-mid">Facilities</span>
            </h2>
            
            <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-8 md:mb-10 max-w-lg mx-auto lg:mx-0">
              Reserve a suite for focused treatment or private consultation, and elevate your dental experience with our dedicated amenities designed for your comfort and safety.
            </p>

            <a href="#booking" className="inline-flex items-center gap-3 text-lg font-bold text-slate-900 group">
              <span>Book a Visit</span>
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-smile-mid transition-colors duration-300">
                 <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </a>
          </div>

          {/* Right Content - Gallery */}
          <div className="lg:w-7/12 w-full mt-4 md:mt-0">
            <div 
                className="flex gap-4 md:gap-6 overflow-x-auto pb-12 pt-4 px-4 -mx-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden" 
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {facilities.map((item, idx) => (
                <div 
                  key={idx}
                  className={`relative shrink-0 snap-center rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 group select-none ${
                      idx === 0 
                        ? 'w-[280px] h-[400px] md:w-[400px] md:h-[500px]' // Featured Card
                        : 'w-[240px] h-[350px] md:w-[320px] md:h-[420px] mt-auto opacity-90 hover:opacity-100' // Secondary Cards
                  }`}
                >
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  
                  {/* Glassmorphic Overlay Box */}
                  <div className="absolute bottom-6 left-6 right-6 bg-slate-900/40 backdrop-blur-md border border-white/10 p-5 md:p-6 rounded-2xl text-white shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="font-heading font-bold text-lg md:text-xl mb-2">{item.title}</h3>
                    <p className="text-xs text-white/90 leading-relaxed font-light line-clamp-2 group-hover:line-clamp-none transition-all">
                        {item.desc}
                    </p>
                    
                    {/* Status Dot */}
                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]"></div>
                  </div>

                  {/* Top Gradient for contrast if needed */}
                  <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/20 to-transparent pointer-events-none"></div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Facilities;