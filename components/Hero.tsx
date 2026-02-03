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
    <section className="relative min-h-[90vh] flex flex-col pt-28 md:pt-32 overflow-hidden bg-page">

      {/* Background Decor - Soft UI Gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-smile-light/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-smile-mid/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 z-0 pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10 flex-grow flex flex-col md:flex-row items-center gap-10 md:gap-12 lg:gap-24">

        {/* Left Content */}
        <div className="w-full md:w-1/2 text-left mb-6 md:mb-0">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <div className="w-8 h-8 text-white bg-smile-mid rounded-lg shadow-soft flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
            </div>
            <span className="text-smile-muted font-semibold tracking-wide text-sm uppercase">SmileCraft Dental</span>
          </div>

          <h1 className="font-heading text-4xl md:text-5xl lg:text-7xl font-bold leading-tight md:leading-[1.1] mb-6 text-darkText tracking-tight">
            Rediscover your <br />
            smile with <span className="text-smile-mid relative inline-block">
              precision
              {/* Underline decoration */}
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-smile-accent opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
            </span> <br />
            implant dentistry
          </h1>

          <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-8 max-w-lg font-normal">
            Cutting-edge technology, personalized treatment, and a lifetime of confidence.
            Start your journey today—where function meets aesthetics.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4 mb-8">
            <a href="#booking" className="px-8 py-4 rounded-xl bg-smile-accent text-darkText font-bold text-lg hover:bg-smile-gold hover:-translate-y-1 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 w-full sm:w-auto justify-center">
              Book a Consultation <ArrowRight size={20} />
            </a>
            <a href="#services" className="px-8 py-4 rounded-xl bg-white text-smile-mid font-semibold text-lg hover:bg-smile-light/20 border border-smile-light transition-all shadow-soft flex items-center gap-2 w-full sm:w-auto justify-center">
              View Services
            </a>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-500 font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={18} className="text-smile-mid" /> Insurance Accepted</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={18} className="text-smile-mid" /> 0% Financing</span>
          </div>
        </div>

        {/* Right Image Slider (Soft Card Style) */}
        <div className="w-full md:w-1/2 relative h-[400px] md:h-[600px] flex items-center justify-center p-4">

          <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl bg-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
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
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md text-smile-dark shadow-soft hover:bg-white flex items-center justify-center transition-all z-20"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md text-smile-dark shadow-soft hover:bg-white flex items-center justify-center transition-all z-20"
            >
              <ChevronRight size={24} />
            </button>

            {/* Floating Social Proof Card */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-8 bg-white/90 backdrop-blur-xl border border-white/50 p-4 rounded-2xl shadow-card w-[260px] z-20">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex text-smile-accent text-xs">
                    {[1, 2, 3, 4, 5].map(i => <span key={i}>★</span>)}
                  </div>
                  <span className="text-xs font-bold text-slate-700">500+ Reviews</span>
                </div>
              </div>
              <p className="text-slate-600 text-xs italic">"Changed my life! The best dental implants in the city."</p>
            </div>
          </div>
        </div>

      </div>

      {/* Trusted By Logos (Light) */}
      <div className="w-full border-t border-smile-light/30 bg-white/50 backdrop-blur-sm py-8 mt-auto relative z-10">
        <div className="container mx-auto px-6">
          <p className="text-center text-smile-muted/60 text-xs font-bold mb-6 uppercase tracking-[0.2em]">Trusted by Top Professionals</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {logos.map((logo, idx) => (
              <span key={idx} className={`text-xl md:text-2xl text-slate-400 hover:text-smile-mid transition-colors cursor-default ${logo.css}`}>
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