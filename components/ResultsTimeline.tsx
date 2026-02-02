import React, { useState, useRef } from 'react';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

const ResultsTimeline: React.FC = () => {
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

  // Note: In a real production app, these would be clinical photos of the same patient.
  // Using high-quality dental stock photos for demonstration.
  const images = [
    {
       label: "Month 1",
       sub: "Initial Assessment",
       desc: "Baseline alignment mapped.",
       img: "https://res.cloudinary.com/dvmxeaefb/image/upload/v1770053553/hf_20260131_125141_20d81bf8-70d3-4541-9a67-73432f92940b_av1ouh.jpg", 
    },
    {
       label: "Month 4",
       sub: "Early Movement",
       desc: "Crowding begins to resolve.",
       img: "https://res.cloudinary.com/dvmxeaefb/image/upload/v1770053550/hf_20260131_125212_168b16d5-2183-4ded-883a-44e268fdd06e_akq2p9.png", 
    },
    {
       label: "Month 8",
       sub: "Visible Alignment",
       desc: "Arch shape improves.",
       img: "https://res.cloudinary.com/dvmxeaefb/image/upload/v1770053549/hf_20260131_125250_66e90187-80c4-4ef8-a4f6-605776904beb_wqmhhj.jpg", 
    },
    {
       label: "Month 12",
       sub: "Final Refinement",
       desc: "Perfect symmetry.",
       img: "https://res.cloudinary.com/dvmxeaefb/image/upload/v1770053549/hf_20260131_125327_a4db8b20-d58e-4891-b428-7d7b4594f2f8_qmpjvt.png", 
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-surface border-t border-slate-100">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 text-smile-mid">
            <Sparkles size={14} className="fill-current" />
            Clinical Success Stories
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-slate-900 mb-6">
            Invisalign Timeline
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Witness the transformation. Our accelerated clear aligner protocols deliver documented clinical improvements in smile alignment & aesthetics in as little as 12 months.
          </p>
        </div>

        {/* Top Grid - Progression */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8 mb-12 md:mb-24">
            {images.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-2 md:gap-4 group">
                    <div className="aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden bg-white shadow-lg border border-slate-100 relative">
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 md:px-3 rounded-full text-[10px] md:text-xs font-bold text-slate-900 z-10 shadow-sm border border-slate-100">
                            {item.label}
                        </div>
                        <img 
                            src={item.img} 
                            alt={item.label} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="text-center md:text-left px-1">
                        <h3 className="font-bold text-slate-900 text-xs md:text-lg leading-tight md:leading-normal">{item.sub}</h3>
                        <p className="text-[10px] md:text-sm text-slate-500 mt-1 leading-tight">{item.desc}</p>
                    </div>
                    {/* Connecting Line for Desktop */}
                    {idx < 3 && (
                        <div className="hidden md:block absolute top-[20%] right-[-15px] w-8 h-0.5 bg-slate-200 z-0 translate-x-1/2" style={{ left: 'auto', right: '-16px' }}></div>
                    )}
                </div>
            ))}
        </div>

        {/* Comparison Section */}
        <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-2xl border border-slate-100 flex flex-col lg:flex-row gap-8 md:gap-12 items-center relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-smile-light/30 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

            {/* Timeline Text */}
            <div className="lg:w-1/2 relative z-10 order-2 lg:order-1">
                <h3 className="font-heading text-2xl md:text-3xl font-bold text-slate-900 mb-8">
                    Your Journey to Perfection
                </h3>
                <p className="text-slate-600 mb-10 leading-relaxed text-sm md:text-lg">
                    Follow your smile's journey with a clinically proven timeline that shows steady, measurable improvements month by month using our SmartTrack® material.
                </p>

                <div className="space-y-10 md:space-y-12 relative before:absolute before:left-[11px] before:top-3 before:bottom-3 before:w-[2px] before:bg-gradient-to-b before:from-smile-mid before:to-slate-200">
                    {/* Step 1 */}
                    <div className="relative pl-10 md:pl-12 group">
                        <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-smile-mid border-[4px] border-white shadow-md ring-1 ring-slate-100 z-10 group-hover:scale-110 transition-transform"></div>
                        <h4 className="font-bold text-slate-900 mb-2 text-base md:text-lg">Month 1-3: Alignment Initiation</h4>
                        <p className="text-sm md:text-base text-slate-500 leading-relaxed">
                            Gentle pressure initiates movement. Complex rotations are addressed early.
                        </p>
                    </div>
                    {/* Step 2 */}
                    <div className="relative pl-10 md:pl-12 group">
                        <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-white border-[4px] border-smile-mid shadow-md z-10 group-hover:scale-110 transition-transform"></div>
                        <h4 className="font-bold text-slate-900 mb-2 text-base md:text-lg">Month 4-8: Expansion & Spacing</h4>
                        <p className="text-sm md:text-base text-slate-500 leading-relaxed">
                            Visible gaps begin to close. The dental arch starts to widen, creating a broader smile.
                        </p>
                    </div>
                    {/* Step 3 */}
                    <div className="relative pl-10 md:pl-12 group">
                        <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-slate-900 border-[4px] border-white shadow-md ring-1 ring-slate-100 z-10 group-hover:scale-110 transition-transform"></div>
                        <h4 className="font-bold text-slate-900 mb-2 text-base md:text-lg">Month 9-12: Aesthetic Refinement</h4>
                        <p className="text-sm md:text-base text-slate-500 leading-relaxed">
                            Fine-tuning the bite relationship. Teeth appear perfectly straight and radiant.
                        </p>
                    </div>
                </div>
            </div>

            {/* Slider Component */}
            <div className="lg:w-1/2 w-full relative z-10 order-1 lg:order-2">
                <div 
                    ref={containerRef}
                    className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden cursor-ew-resize select-none shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] group ring-1 ring-slate-100"
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseUp}
                    onMouseMove={onMouseMove}
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                    onTouchMove={onTouchMove}
                >
                    {/* Background (After) */}
                    <img 
                        src="https://res.cloudinary.com/dvmxeaefb/image/upload/v1770055113/hf_20260202_175606_8e01662f-ff9d-4fc8-a041-7e877febe186_pm1dsg.png" 
                        className="absolute inset-0 w-full h-full object-cover" 
                        alt="After Invisalign" 
                    />
                    <div className="absolute top-6 right-6 bg-smile-mid text-white px-5 py-2 rounded-full text-xs font-bold shadow-lg z-10 uppercase tracking-wider">After</div>

                    {/* Foreground (Before) - Clipped */}
                    <div 
                        className="absolute inset-0 w-full h-full overflow-hidden"
                        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
                    >
                         <img 
                            src="https://res.cloudinary.com/dvmxeaefb/image/upload/v1770055117/hf_20260202_175123_ecd60f2e-86ad-4167-8b60-01dd0485bc54_qnqnrt.png" 
                            className="absolute inset-0 w-full h-full object-cover filter grayscale-[20%] contrast-110" 
                            alt="Before Invisalign" 
                        />
                        <div className="absolute top-6 left-6 bg-slate-900 text-white px-5 py-2 rounded-full text-xs font-bold shadow-lg z-10 uppercase tracking-wider">Before</div>
                    </div>

                    {/* Divider Handle */}
                    <div 
                        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                        style={{ left: `${sliderPosition}%` }}
                    >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-slate-50 text-smile-mid transition-transform hover:scale-110">
                             <div className="flex gap-0.5">
                                <ChevronLeft size={20} className="stroke-[3]" />
                                <ChevronRight size={20} className="stroke-[3]" />
                             </div>
                        </div>
                    </div>
                    
                    <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold">Drag to compare</span>
                    </div>

                </div>
            </div>

        </div>
      </div>
    </section>
  );
};

export default ResultsTimeline;