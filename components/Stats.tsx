import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

const Stats: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const Counter = ({ end, suffix = "", duration = 2000 }: { end: number, suffix?: string, duration?: number }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isVisible) return;

      let startTime: number | null = null;
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // Easing function for smooth deceleration
        const easeOutQuart = (x: number): number => 1 - Math.pow(1 - x, 4);
        
        setCount(Math.floor(easeOutQuart(progress) * end));
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      
      window.requestAnimationFrame(step);
    }, [isVisible, end, duration]);

    return <span>{count.toLocaleString()}{suffix}</span>;
  };

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-[#0F172A] text-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <h2 className="text-xl md:text-3xl font-heading text-slate-400 mb-10 md:mb-16 font-light">
          Trusted by our community
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 md:gap-16">
            {/* Stat 1: Patients Visited */}
            <div className="flex flex-col border-l border-slate-700 pl-6 md:pl-8 transition-colors hover:border-slate-500 duration-500 group">
                <h3 className="text-base md:text-lg font-medium text-slate-300 mb-4 md:mb-8 h-8 md:h-12 flex items-center">
                    Total Patients Served
                </h3>
                <div className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-8 text-white tracking-tight group-hover:text-smile-mid transition-colors">
                    <Counter end={15000} suffix="+" />
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-4 md:mb-8 pr-4">
                    Our innovative, patient-first approach has led to over 15,000 successful smiles, allowing us to refine our techniques for maximum comfort.
                </p>
                <a href="#reviews" className="text-white border-b border-white pb-0.5 self-start text-sm hover:text-smile-mid hover:border-smile-mid transition-colors flex items-center gap-2">
                    Read Patient Stories <ArrowRight size={14} />
                </a>
            </div>

            {/* Stat 2: Happy Patients */}
            <div className="flex flex-col border-l border-slate-700 pl-6 md:pl-8 transition-colors hover:border-slate-500 duration-500 group">
                <h3 className="text-base md:text-lg font-medium text-slate-300 mb-4 md:mb-8 h-8 md:h-12 flex items-center">
                    Satisfaction Rate
                </h3>
                <div className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-8 text-white tracking-tight group-hover:text-smile-mid transition-colors">
                    <Counter end={99} suffix="%" />
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-4 md:mb-8 pr-4">
                    We maintain a 99% satisfaction rate by prioritizing pain-free procedures and listening to your unique needs before we even start.
                </p>
                <a href="#reviews" className="text-white border-b border-white pb-0.5 self-start text-sm hover:text-smile-mid hover:border-smile-mid transition-colors flex items-center gap-2">
                    See Our Reviews <ArrowRight size={14} />
                </a>
            </div>

            {/* Stat 3: Doctor History */}
            <div className="flex flex-col border-l border-slate-700 pl-6 md:pl-8 transition-colors hover:border-slate-500 duration-500 group">
                <h3 className="text-base md:text-lg font-medium text-slate-300 mb-4 md:mb-8 h-8 md:h-12 flex items-center">
                    Clinical Excellence
                </h3>
                <div className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-8 text-white tracking-tight group-hover:text-smile-mid transition-colors">
                    <Counter end={25} suffix="+" />
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-4 md:mb-8 pr-4">
                    With over 25 years of combined history in advanced restorative dentistry, our team brings university-level expertise to your neighborhood.
                </p>
                <a href="#doctors" className="text-white border-b border-white pb-0.5 self-start text-sm hover:text-smile-mid hover:border-smile-mid transition-colors flex items-center gap-2">
                    Meet The Team <ArrowRight size={14} />
                </a>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;