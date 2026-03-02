import React, { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function BeforeAfter({ clinic }: { clinic: any }) {
  const [sliderPos, setSliderPos] = useState(50);
  const navigate = useNavigate();

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    const pos = ((x - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(Math.max(pos, 0), 100));
  };

  return (
    <section className="py-32 bg-surface">
      <div className="container mx-auto px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-[1px] bg-black/10" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-muted">Transformations</span>
            <div className="w-12 h-[1px] bg-black/10" />
          </div>
          <h2 className="text-6xl md:text-[100px] font-display font-bold mb-10 text-black tracking-tighter leading-none uppercase">
            Real <span className="text-primary inline-block">Results.</span>
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto font-medium">See the transformation with our Invisalign treatments</p>
        </div>

        <div
          className="relative max-w-5xl mx-auto aspect-[16/9] rounded-[40px] overflow-hidden cursor-ew-resize select-none shadow-2xl border border-black/5"
          onMouseMove={handleMove}
          onTouchMove={handleMove}
        >
          {/* After Image */}
          <img
            src="https://res.cloudinary.com/dvmxeaefb/image/upload/v1771955242/hf_20260224_172047_a80ad622-524c-4d58-9101-b911d449f28e_vxxyql.jpg"
            alt="After Treatment"
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />

          {/* Before Image */}
          <div
            className="absolute inset-0 w-full h-full overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src="https://res.cloudinary.com/dvmxeaefb/image/upload/v1771955242/hf_20260224_174123_4a9f96af-c35e-45a2-bddf-de155104026a_ta0qso.jpg"
              alt="Before Treatment"
              className="absolute inset-0 w-[100vw] max-w-none h-full object-cover"
              style={{ width: `calc(100% * (100 / ${sliderPos}))` }}
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Divider */}
          <div
            className="absolute inset-y-0 w-[2px] bg-white/50 z-20"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20">
              <div className="flex gap-1.5">
                <div className="w-1 h-4 bg-white rounded-full" />
                <div className="w-1 h-4 bg-white rounded-full" />
              </div>
            </div>
          </div>

          {/* Labels */}
          <div className="absolute bottom-10 left-10 bg-black/80 backdrop-blur-md px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest z-30 text-white">Before</div>
          <div className="absolute bottom-10 right-10 bg-black/80 backdrop-blur-md px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest z-30 text-white">After</div>
        </div>

        <div className="mt-20 text-center">
          <button onClick={() => navigate('/results')} className="btn-yellow mx-auto">
            View All Transformations
          </button>
        </div>
      </div>
    </section>
  );
}
