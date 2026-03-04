import React, { useState, useEffect } from 'react';

interface DonutSegment {
    label: string;
    count: number;
    color: string;
    hex: string;
}

export function DonutChart({ segments, total, totalValue }: { segments: DonutSegment[]; total: number; totalValue: number }) {
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setAnimated(true), 200);
        return () => clearTimeout(timer);
    }, []);

    const size = 180;
    const strokeWidth = 28;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const cx = size / 2;
    const cy = size / 2;

    // Build dash segments
    let cumulativePercent = 0;
    const segmentElements = segments.map((seg, i) => {
        const percent = total > 0 ? seg.count / total : 0;
        const dashArray = circumference * percent;
        const dashOffset = circumference * (1 - cumulativePercent);
        cumulativePercent += percent;

        return (
            <circle
                key={seg.label}
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={seg.hex}
                strokeWidth={strokeWidth}
                strokeDasharray={`${animated ? dashArray : 0} ${circumference}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="butt"
                transform={`rotate(-90 ${cx} ${cy})`}
                style={{ transition: `stroke-dasharray 0.8s ease ${i * 0.15}s` }}
            />
        );
    });

    return (
        <div className="flex flex-col items-center">
            <div className="relative">
                <svg width={size} height={size}>
                    {/* Background ring */}
                    <circle
                        cx={cx} cy={cy} r={radius}
                        fill="none"
                        stroke="rgba(0,0,0,0.05)"
                        strokeWidth={strokeWidth}
                    />
                    {segmentElements}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-bold text-gray-900 tracking-tighter leading-none">{total}</span>
                    <span className="text-[9px] mt-1 text-gray-400 font-bold uppercase tracking-widest">Leads</span>
                    <div className="w-6 h-px bg-gray-100 my-2" />
                    <span className="text-sm font-bold text-gray-900 leading-none">£{(totalValue / 1000).toFixed(1)}k</span>
                    <span className="text-[8px] mt-0.5 text-gray-400 font-bold uppercase tracking-widest">Value</span>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-6 w-full space-y-3">
                {segments.map((seg) => {
                    const pct = total > 0 ? Math.round((seg.count / total) * 100) : 0;
                    return (
                        <div key={seg.label} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: seg.hex }} />
                                <span className="text-[11px] text-gray-500 font-medium">{seg.label}</span>
                            </div>
                            <span className="text-[11px] font-bold text-gray-900/80">
                                {seg.count} <span className="text-gray-400">({pct}%)</span>
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
