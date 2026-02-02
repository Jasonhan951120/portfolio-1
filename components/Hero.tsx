import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [
    "https://res.cloudinary.com/dvmxeaefb/image/upload/v1770052188/hf_20260131_134357_f36ac175-f6e4-41e2-b5b6-4e51e0294bfe_jowx70.png",
    "https://res.cloudinary.com/dvmxeaefb/image/upload/v1770052199/hf_20260131_142702_fc42130c-5540-487a-b206-dc41b87a4f12_ndodup.png",
    "https://res.cloudinary.com/dvmxeaefb/image/upload/v1770052188/hf_20260131_134357_f36ac175-f6e4-41e2-b5b6-4e51e0294bfe_jowx70.png"
  ];

  const logos = [
    { name: "stamps", css: "font-serif italic" },
    { name: "VENUER", css: "font-sans tracking-[0.2em] font-light" },
    { name: "manter.", css: "font-serif font-bold opacity-70" },
    { name: "Adverus", css: "font-sans font-medium" },
    { name: "spaced", css: "font-serif lowercase text-xl" }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex flex-col pt-28 md:pt-32 overflow-hidden bg-[#002B4E]">
      
      {/* Background Gradient - Navy to Medical Blue */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#002B4E] via-[#004B8D] to-[#0284C7] opacity-100 z-0"></div>
      
      {/* Noise Texture */}
      <div className="absolute inset-0 noise-bg opacity-10 mix-blend-overlay z-0 pointer-events-none"></div>

      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-smile-mid rounded-full blur-[100px] md:blur-[150px] opacity-30 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10 flex-grow flex flex-col md:flex-row items-center gap-10 md:gap-12 lg:gap-24">
        
        {/* Left Content */}
        <div className="w-full md:w-1/2 text-left mb-6 md:mb-0">
            <div className="flex items-center gap-2 mb-4 md:mb-6">
                 <div className="w-6 h-6 text-smile-mid bg-white rounded-full flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                 </div>
                 <span className="text-white/90 font-medium tracking-wide text-xs md:text-sm">SmileCraft Dental</span>
            </div>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-7xl font-bold leading-tight md:leading-[1.1] mb-6 text-white tracking-tight drop-shadow-lg">
                Rediscover your <br/>
                smile with precision <br/>
                <span className="text-smile-light">implant dentistry</span>
            </h1>

            <p className="text-blue-100 text-base md:text-lg leading-relaxed mb-8 max-w-lg font-light opacity-90">
                Cutting-edge technology. Personalized treatment. A lifetime of confidence. <br className="hidden md:block" />
                Start your journey today with SmileCraft—where function meets aesthetics.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
                <a href="#booking" className="px-8 py-4 rounded-full bg-white text-smile-dark font-bold text-lg hover:bg-smile-light transition-all shadow-lg flex items-center gap-2 border border-white/20 w-full sm:w-auto justify-center">
                    Book a Consultation
                </a>
            </div>
            
            <p className="text-xs md:text-sm text-blue-200 font-medium flex items-center gap-2">
                <CheckCircle2 size={16} /> Insurance Accepted • Flexible Payment Plans
            </p>
        </div>

        {/* Right Image Slider */}
        <div className="w-full md:w-1/2 relative h-[350px] md:h-[600px] flex items-center justify-center group">
            {/* Abstract Shape Background */}
            <div className="absolute inset-0 bg-white/10 rounded-[2rem] md:rounded-[3rem] rotate-3 opacity-20 blur-sm scale-95"></div>
            
            <div className="relative w-full h-full rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/20 shadow-2xl bg-smile-dark">
                 {heroImages.map((img, index) => (
                    <img 
                       key={index}
                       src={img} 
                       alt={`Specialist ${index + 1}`} 
                       className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                    />
                 ))}
                 
                 {/* Navigation Arrows */}
                 <button 
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-colors opacity-0 group-hover:opacity-100 border border-white/10 z-20 pointer-events-none group-hover:pointer-events-auto"
                 >
                    <ChevronLeft size={20} />
                 </button>
                 <button 
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-colors opacity-0 group-hover:opacity-100 border border-white/10 z-20 pointer-events-none group-hover:pointer-events-auto"
                 >
                    <ChevronRight size={20} />
                 </button>

                 {/* Indicators */}
                 <div className="absolute bottom-6 left-6 flex gap-2 z-20">
                    {heroImages.map((_, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-white w-8' : 'bg-white/40 w-2 hover:bg-white/60'}`}
                        />
                    ))}
                 </div>

                 {/* Floating Badge */}
                 <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 bg-white/95 backdrop-blur-md border border-white/50 p-4 rounded-2xl shadow-xl max-w-[180px] md:max-w-[200px] z-20 hidden sm:block">
                    <div className="flex text-smile-gold mb-1">
                        {[1,2,3,4,5].map(i => <span key={i}>★</span>)}
                    </div>
                    <p className="text-slate-800 text-xs font-medium leading-snug">"The best dental experience I've ever had. Highly recommended!"</p>
                 </div>
            </div>
        </div>

      </div>

      {/* Trusted By Logos */}
      <div className="w-full border-t border-white/10 bg-black/10 backdrop-blur-sm py-6 md:py-8 mt-auto relative z-10">
         <div className="container mx-auto px-6">
            <p className="text-center text-blue-200 text-xs md:text-sm font-bold mb-4 md:mb-6 uppercase tracking-widest">Trusted by Top Professionals</p>
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 md:gap-20 opacity-70">
                {logos.map((logo, idx) => (
                    <span key={idx} className={`text-xl md:text-2xl text-white hover:text-smile-light transition-colors cursor-default ${logo.css}`}>
                        {logo.name}
                    </span>
                ))}
            </div>
         </div>
      </div>
    </section>
  );
};

export default Hero;