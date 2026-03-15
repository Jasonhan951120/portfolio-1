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
 * AI_InsightCard - A premium, Apple-inspired Glassmorphism UI for Explainable AI (XAI).
 * Features structured data visualization and dynamic collision detection.
 */
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
            const cardHeight = cardRef.current.offsetHeight || 450;
            const padding = 20;

            let top = anchorRect.top - 20; // Default: aligned with anchor top
            let left = anchorRect.right + 16; // Default: right of anchor

            // Collision Detection: Right Edge
            if (left + cardWidth + padding > window.innerWidth) {
                left = anchorRect.left - cardWidth - 16;
            }

            // Collision Detection: Bottom Edge
            if (top + cardHeight + padding > window.innerHeight) {
                top = window.innerHeight - cardHeight - padding;
            }

            // Collision Detection: Top Edge
            if (top < padding) {
                top = padding;
            }

            // If we still collision on the left after flipping
            if (left < padding) {
                left = padding;
                // If it's overlapping the anchor, move it below
                if (anchorRect.left < left + cardWidth && anchorRect.right > left) {
                    top = anchorRect.bottom + 16;
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
                    {/* Invisible Backdrop for closing */}
                    <div 
                        className="fixed inset-0 z-[990] pointer-events-auto" 
                        onClick={onClose} 
                    />

                    <motion.div
                        ref={cardRef}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                        style={{
                            position: 'fixed',
                            top: position.top,
                            left: position.left,
                            zIndex: 1000,
                        }}
                        className="w-[340px] bg-slate-900/85 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-slate-700/40 overflow-hidden pointer-events-auto"
                    >
                        {/* Header: Identity */}
                        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                    <Sparkles className="w-5 h-5 text-emerald-400" />
                                </div>
                                <span className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.2em]">
                                    AI INSIGHTS
                                </span>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/50">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Verified Intel</span>
                            </div>
                        </div>

                        {/* Structured Metric: Potential Value (Apple text standard) */}
                        <div className="px-8 py-6 space-y-1">
                            <div className="flex items-center gap-2 text-slate-500 mb-1">
                                <BarChart3 className="w-4 h-4" />
                                <span className="text-[10px] uppercase font-black tracking-widest">Market Valuation</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-slate-50 tracking-tight">£{potentialValue.toLocaleString()}</span>
                                <span className="text-sm font-bold text-emerald-400/80">Potential</span>
                            </div>
                        </div>

                        {/* Information Architecture: Digital Footprint (Bullets) */}
                        <div className="px-8 py-6 bg-white/[0.03] border-y border-white/[0.05]">
                            <div className="flex items-center gap-2 text-slate-400 mb-4">
                                <Search className="w-4 h-4" />
                                <span className="text-[10px] uppercase font-black tracking-widest leading-none">Digital Footprint Analysis</span>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex gap-3">
                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)] shrink-0" />
                                    <span className="text-[13px] text-slate-300 font-medium leading-snug">
                                        3+ prolonged sessions on <span className="text-white">advanced implant procedures</span>.
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0" />
                                    <span className="text-[13px] text-slate-400 font-medium leading-snug">
                                        Active engagement with <span className="text-slate-300">Smile Makeover</span> portfolio.
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0" />
                                    <span className="text-[13px] text-slate-400 font-medium leading-snug">
                                        Referral source: <span className="text-slate-300">High-intent clinical search</span>.
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Strategic Plan Section */}
                        <div className="px-8 py-8 space-y-5">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/50">
                                    <Target className="w-4 h-4 text-slate-400" />
                                </div>
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Strategic Conversion Plan</span>
                            </div>

                            <ul className="space-y-3">
                                {treatmentPlan.map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3">
                                        <div className="w-1 h-1 rounded-full bg-slate-700" />
                                        <span className="text-[13px] text-slate-200 font-medium">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <button className="w-full mt-4 py-4 bg-white/5 hover:bg-white/10 active:scale-[0.98] rounded-[1.5rem] border border-white/10 flex items-center justify-center gap-3 transition-all group/btn">
                                <span className="text-[11px] font-black text-slate-200 group-hover/btn:text-white uppercase tracking-[0.15em]">Execute Full Audit</span>
                                <ChevronRight className="w-4 h-4 text-slate-500 group-hover/btn:text-white" />
                            </button>
                        </div>

                        {/* Footer Governance */}
                        <div className="px-8 py-4 bg-black/20 flex items-center justify-between border-t border-white/[0.05]">
                            <div className="flex items-center gap-2">
                                <Stethoscope className="w-3.5 h-3.5 text-slate-600" />
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">Clinical Luxury Governance</span>
                            </div>
                            <span className="text-[9px] font-black text-emerald-500/30 uppercase">AES-256 Encrypted</span>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
