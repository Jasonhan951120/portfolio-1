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
    <section ref={sectionRef} className="py-16 md:py-24 bg-smile-mid text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-smile-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <h2 className="text-xl md:text-3xl font-heading text-white/90 mb-12 md:mb-16 font-medium text-center md:text-left">
          Trusted by our community
        </h2>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {/* Stat 1: Patients Visited */}
          <div className="flex flex-col border-l-2 border-white/20 pl-6 md:pl-8 group hover:border-smile-accent transition-colors duration-300">
            <h3 className="text-base md:text-lg font-medium text-blue-100 mb-2 flex items-center">
              Total Patients Served
            </h3>
            <div className="text-5xl md:text-6xl font-heading font-bold mb-4 text-white tracking-tight">
              <Counter end={15000} suffix="+" />
            </div>
            <p className="text-blue-50 text-sm leading-relaxed mb-6 pr-4 opacity-90">
              Over 15,000 successful smiles delivered with our patient-first approach.
            </p>
            <a href="#reviews" className="text-smile-accent font-bold text-sm hover:text-white transition-colors flex items-center gap-2 group-hover:translate-x-1 duration-300">
              Read Patient Stories <ArrowRight size={16} />
            </a>
          </div>

          {/* Stat 2: Happy Patients */}
          <div className="flex flex-col border-l-2 border-white/20 pl-6 md:pl-8 group hover:border-smile-accent transition-colors duration-300">
            <h3 className="text-base md:text-lg font-medium text-blue-100 mb-2 flex items-center">
              Satisfaction Rate
            </h3>
            <div className="text-5xl md:text-6xl font-heading font-bold mb-4 text-white tracking-tight">
              <Counter end={99} suffix="%" />
            </div>
            <p className="text-blue-50 text-sm leading-relaxed mb-6 pr-4 opacity-90">
              Prioritizing pain-free procedures and listening to your unique needs.
            </p>
            <a href="#reviews" className="text-smile-accent font-bold text-sm hover:text-white transition-colors flex items-center gap-2 group-hover:translate-x-1 duration-300">
              See Our Reviews <ArrowRight size={16} />
            </a>
          </div>

          {/* Stat 3: Doctor History */}
          <div className="flex flex-col border-l-2 border-white/20 pl-6 md:pl-8 group hover:border-smile-accent transition-colors duration-300">
            <h3 className="text-base md:text-lg font-medium text-blue-100 mb-2 flex items-center">
              Clinical Excellence
            </h3>
            <div className="text-5xl md:text-6xl font-heading font-bold mb-4 text-white tracking-tight">
              <Counter end={25} suffix="+" />
            </div>
            <p className="text-blue-50 text-sm leading-relaxed mb-6 pr-4 opacity-90">
              Years of combined history in advanced restorative dentistry.
            </p>
            <a href="#doctors" className="text-smile-accent font-bold text-sm hover:text-white transition-colors flex items-center gap-2 group-hover:translate-x-1 duration-300">
              Meet The Team <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;