import React, { useState, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ClipboardList, ChevronRight, Stethoscope, Search, BarChart3, Target } from 'lucide-react';

interface AI_InsightCardProps {
    isOpen: boolean;
    onClose: () => void;
    anchorRect: DOMRect | null;
    insight: string;
    treatmentPlan: string[];
    potentialValue?: number;
}

/**
 * AI_InsightCard - A high-end, Apple-inspired "Explainable AI" dashboard component.
 * Features advanced collision detection (Zero-Clipped Positioning) and 
 * structured information architecture (Cognitive Load Chunking).
 */
// Elite AI Insight Card - Premium Glassmorphism Logic
export function AI_InsightCard({ 
    isOpen, 
    onClose, 
    anchorRect, 
    insight, 
    treatmentPlan,
    potentialValue = 12000
}: AI_InsightCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

    useLayoutEffect(() => {
        if (isOpen && anchorRect && cardRef.current) {
            const cardWidth = 340;
            const cardHeight = cardRef.current.offsetHeight || 480;
            const padding = 24;
            const gap = 16;

            // Strategy: Favor Right-of-Anchor positioning
            let left = anchorRect.right + gap;
            let top = anchorRect.top - (cardHeight / 4); // Slightly offset upwards for better alignment

            // Collision Detection: Right Viewport Edge (Flip to Left)
            if (left + cardWidth + padding > window.innerWidth) {
                left = anchorRect.left - cardWidth - gap;
            }

            // Collision Detection: Bottom Viewport Edge
            if (top + cardHeight + padding > window.innerHeight) {
                top = window.innerHeight - cardHeight - padding;
            }

            // Collision Detection: Top Viewport Edge
            if (top < padding) {
                top = padding;
            }

            // Safety: Ensure we never overlap the anchor if it's squeezed
            if (left < padding) {
                left = padding;
                // If it still overlaps the anchor card, move it below/above
                if (anchorRect.left < left + cardWidth && anchorRect.right > left) {
                    top = anchorRect.bottom + gap;
                    // Double check bottom after move
                    if (top + cardHeight + padding > window.innerHeight) {
                        top = anchorRect.top - cardHeight - gap;
                    }
                }
            }

            setPosition({ top, left });
        }
    }, [isOpen, anchorRect]);

    if (!anchorRect) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Zero-Friction Backdrop */}
                    <div 
                        className="fixed inset-0 z-[990] bg-black/5" 
                        onMouseEnter={onClose} 
                    />

                    <motion.div
                        ref={cardRef}
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                        style={{
                            position: 'fixed' as any,
                            top: position.top,
                            left: position.left,
                            zIndex: 1000,
                        }}
                        className="w-[340px] bg-slate-900/80 backdrop-blur-lg rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-slate-700/50 overflow-hidden pointer-events-auto"
                    >
                        {/* Elite Header */}
                        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-sm">
                                    <Sparkles className="w-5 h-5 text-emerald-400" />
                                </div>
                                <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest leading-none">
                                    AI INSIGHTS
                                </span>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/50">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Active Pulse</span>
                            </div>
                        </div>

                        {/* HIGH Prominence Key Value (Apple Chunking) */}
                        <div className="px-8 py-6 space-y-1">
                            <div className="flex items-center gap-2 text-slate-500 mb-1">
                                <BarChart3 className="w-4 h-4" />
                                <span className="text-[10px] uppercase font-black tracking-widest leading-none">Potential Revenue</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <h2 className="text-3xl font-bold text-emerald-400 tracking-tight">£{potentialValue.toLocaleString()}</h2>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Value Forecast</span>
                            </div>
                        </div>

                        {/* Information Hierarchy: Evidence Chunks */}
                        <div className="px-8 py-6 bg-white/[0.04] border-y border-white/[0.06]">
                            <div className="flex items-center gap-2 text-slate-400 mb-4">
                                <Search className="w-4 h-4" />
                                <span className="text-[10px] uppercase font-black tracking-widest leading-none">Evidence Matrix</span>
                            </div>
                            <ul className="space-y-4">
                                <li className="group/chunk">
                                    <div className="flex gap-3 mb-1">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)] shrink-0" />
                                        <span className="text-[13px] text-slate-100 font-bold leading-none">Digital Footprint</span>
                                    </div>
                                    <p className="ml-4.5 text-[12px] text-slate-400 font-medium leading-relaxed">
                                        3+ prolonged sessions on <span className="text-slate-200">Restorative Implant</span> pages detected in the last 48 hours.
                                    </p>
                                </li>
                                <li className="group/chunk">
                                    <div className="flex gap-3 mb-1">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0 group-hover/chunk:bg-blue-400 transition-colors" />
                                        <span className="text-[13px] text-slate-100 font-bold leading-none">Intent Velocity</span>
                                    </div>
                                    <p className="ml-4.5 text-[12px] text-slate-400 font-medium leading-relaxed">
                                        Behavioral velocity benchmarked against <span className="text-slate-200">Top 5% Conversion</span> cohorts.
                                    </p>
                                </li>
                            </ul>
                        </div>

                        {/* Strategic Conversion Plan */}
                        <div className="px-8 py-6 space-y-6 flex flex-col items-center">
                            <div className="w-full flex items-center gap-2">
                                <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/50">
                                    <Target className="w-4 h-4 text-slate-400" />
                                </div>
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Protocol Strategy</span>
                            </div>

                            <div className="w-full grid grid-cols-1 gap-2.5">
                                {treatmentPlan.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-2xl border border-white/[0.03] group/item hover:bg-slate-800/50 transition-all">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover/item:bg-emerald-400 transition-colors" />
                                        <span className="text-[12px] text-slate-300 font-medium group-hover/item:text-slate-100 transition-colors">
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] rounded-3xl flex items-center justify-center gap-3 transition-all group/btn shadow-lg shadow-emerald-500/10 mt-2">
                                <span className="text-[11px] font-black text-white uppercase tracking-[0.2em] leading-none">Execute Clinical Audit</span>
                                <ChevronRight className="w-4 h-4 text-white group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* Governance Footer */}
                        <div className="px-8 py-4 bg-black/40 flex items-center justify-between border-t border-white/[0.05]">
                            <div className="flex items-center gap-2">
                                <Stethoscope className="w-4 h-4 text-slate-600" />
                                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Clinical Luxury Governance</span>
                            </div>
                            <span className="text-[8px] font-black text-emerald-500/30 uppercase tracking-[0.2em]">Verified Secure</span>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
