import React, { useState, useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const RealResults: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const onMouseDown = () => setIsDragging(true);
  const onMouseUp = () => setIsDragging(false);
  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };
  const onTouchStart = () => setIsDragging(true);
  const onTouchEnd = () => setIsDragging(false);
  const onTouchMove = (e: React.TouchEvent) => {
    if (isDragging) handleMove(e.touches[0].clientX);
  };

  const gridItems = [
    {
        label: "Week 1-4",
        phase: "Initial Assessment",
        img: "https://cdn.pixabay.com/photo/2017/02/16/16/06/woman-2071954_1280.jpg"
    },
    {
        label: "Week 12",
        phase: "Visible Alignment",
        img: "https://cdn.pixabay.com/photo/2016/11/29/05/11/adult-1867471_1280.jpg"
    },
    {
        label: "Week 24",
        phase: "Bite Correction",
        img: "https://cdn.pixabay.com/photo/2018/01/15/07/51/woman-3083377_1280.jpg"
    },
    {
        label: "Week 48",
        phase: "Use of Retainer",
        img: "https://cdn.pixabay.com/photo/2016/11/29/13/10/woman-1869761_1280.jpg"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-blue-50/50">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                Real Results, Real People
            </h2>
            <p className="text-slate-600 font-medium text-base md:text-lg">
                Documented clinical improvements in smile alignment over 12 months.
            </p>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-20">
            {gridItems.map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-transform hover:-translate-y-1 duration-300">
                    <div className="h-32 md:h-48 overflow-hidden bg-slate-100">
                        <img 
                            src={item.img} 
                            alt={item.label} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-4 md:p-5">
                        <span className="block font-extrabold text-smile-dark text-xs md:text-sm mb-1">{item.label}</span>
                        <span className="block text-slate-500 text-[10px] md:text-xs font-medium">{item.phase}</span>
                    </div>
                </div>
            ))}
        </div>

        {/* Timeline + Slider Section */}
        <div className="bg-white rounded-[24px] p-6 md:p-12 shadow-xl border border-slate-100 grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            
            {/* Left: Text Timeline */}
            <div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-smile-dark mb-4">
                    Clinically Proven Timeline
                </h2>
                <p className="text-slate-600 mb-8 md:mb-10 leading-relaxed text-sm md:text-base">
                    Follow your smile's journey with a customized timeline that shows steady, measurable progress week by week.
                </p>

                <div className="relative pl-5 border-l-2 border-slate-200 space-y-8 md:space-y-10">
                    <div className="relative pl-6">
                        <div className="absolute -left-[29px] top-0 w-4 h-4 bg-smile-dark border-[4px] border-blue-100 rounded-full"></div>
                        <span className="block font-bold text-smile-dark text-base md:text-lg mb-1">Month 1-3: Alignment Starts</span>
                        <span className="block text-slate-500 text-sm leading-relaxed">
                            Aligners begin to shift teeth. You may feel slight pressure as space is created.
                        </span>
                    </div>
                    <div className="relative pl-6">
                        <div className="absolute -left-[29px] top-0 w-4 h-4 bg-smile-dark border-[4px] border-blue-100 rounded-full"></div>
                        <span className="block font-bold text-smile-dark text-base md:text-lg mb-1">Month 4-8: Major Movements</span>
                        <span className="block text-slate-500 text-sm leading-relaxed">
                            Noticeable changes in spacing and crowding. Bite alignment improves significantly.
                        </span>
                    </div>
                    <div className="relative pl-6">
                        <div className="absolute -left-[29px] top-0 w-4 h-4 bg-smile-dark border-[4px] border-blue-100 rounded-full"></div>
                        <span className="block font-bold text-smile-dark text-base md:text-lg mb-1">Month 9-12: Refinement</span>
                        <span className="block text-slate-500 text-sm leading-relaxed">
                            Final detailing to perfect your smile line. Preparation for lifelong retention.
                        </span>
                    </div>
                </div>
            </div>

            {/* Right: Before/After Slider */}
            <div 
                ref={containerRef}
                className="relative w-full h-[250px] md:h-[400px] rounded-[20px] overflow-hidden cursor-ew-resize select-none shadow-inner group ring-1 ring-black/5"
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                onMouseMove={onMouseMove}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                onTouchMove={onTouchMove}
            >
                {/* Background (Before) */}
                <img 
                    src="https://cdn.pixabay.com/photo/2021/04/18/13/35/woman-6188414_1280.jpg" 
                    className="absolute inset-0 w-full h-full object-cover" 
                    alt="Before" 
                />
                <span className="absolute top-5 right-5 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full font-bold text-xs text-slate-900 z-10 shadow-sm">
                    Before (Crooked)
                </span>

                {/* Foreground (After) - Clipped */}
                <div 
                    className="absolute inset-0 w-full h-full overflow-hidden border-r-2 border-white"
                    style={{ width: `${sliderPosition}%` }}
                >
                    <img 
                        src="https://cdn.pixabay.com/photo/2017/06/20/22/14/man-2425121_1280.jpg" 
                        className="absolute inset-0 w-full h-full object-cover" 
                        style={{ width: containerRef.current ? containerRef.current.offsetWidth : '100%' }} // Keep image width consistent
                        alt="After" 
                    />
                    {/* CSS Hack to ensure image stays full width inside clipped div */}
                    <style>{`
                        .after-img-fixed {
                            width: ${containerRef.current?.offsetWidth}px;
                            max-width: none;
                        }
                    `}</style>
                    <span className="absolute top-5 left-5 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full font-bold text-xs text-slate-900 z-10 shadow-sm">
                        After (Invisalign)
                    </span>
                </div>

                {/* Handle */}
                <div 
                    className="absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-smile-dark rounded-full flex items-center justify-center text-white shadow-[0_0_0_4px_rgba(255,255,255,0.3)] z-20 pointer-events-none transform -translate-x-1/2"
                    style={{ left: `${sliderPosition}%` }}
                >
                   <div className="flex gap-0.5">
                        <ChevronLeft size={16} strokeWidth={3} />
                        <ChevronRight size={16} strokeWidth={3} />
                   </div>
                </div>
            </div>

        </div>

      </div>
    </section>
  );
};

export default RealResults;