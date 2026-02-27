import React, { useState, useRef, useEffect } from "react";
import { MoveHorizontal } from "lucide-react";

interface BeforeAfterSliderProps {
    beforeImage: string;
    afterImage: string;
    beforeLabel?: string;
    afterLabel?: string;
}

export default function BeforeAfterSlider({
    beforeImage,
    afterImage,
    beforeLabel = "Before",
    afterLabel = "After"
}: BeforeAfterSliderProps) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        setSliderPosition((x / rect.width) * 100);
    };

    const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
    const handleTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-[4/3] rounded-[30px] overflow-hidden cursor-ew-resize select-none border border-black/5 shadow-2xl"
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
        >
            {/* After Image (Background) */}
            <img
                src={afterImage}
                alt="After treatment"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Before Image (Clip) */}
            <div
                className="absolute inset-0 w-full h-full"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img
                    src={beforeImage}
                    alt="Before treatment"
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>

            {/* Slider Line / Handle */}
            <div
                className="absolute inset-y-0 z-10 w-[2px] bg-white pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center">
                    <MoveHorizontal className="w-5 h-5 text-black" />
                </div>
            </div>

            {/* Labels */}
            <div className="absolute bottom-6 left-6 z-20 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest">
                {beforeLabel}
            </div>
            <div className="absolute bottom-6 right-6 z-20 px-4 py-2 bg-accent/80 backdrop-blur-md rounded-full text-black text-[10px] font-black uppercase tracking-widest">
                {afterLabel}
            </div>
        </div>
    );
}
