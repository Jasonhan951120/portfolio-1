import React, { useState, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronRight, Stethoscope, Search, BarChart3, Target } from 'lucide-react';

interface AI_InsightCardProps {
    isOpen: boolean;
    onClose: () => void;
    anchorRect: DOMRect | null;
    insight: string;
    treatmentPlan: string[];
    potentialValue?: number;
}

/**
 * AI_InsightCard - Portal-based Premium Glassmorphism UI.
 * Renders via React Portal to prevent Clipping by parent overflow:hidden containers.
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
    const [coords, setCoords] = useState<{ top: number; left: number }>({ top: -9999, left: -9999 });

    useLayoutEffect(() => {
        if (isOpen && anchorRect && cardRef.current) {
            const cardWidth = 320;
            const cardHeight = cardRef.current.offsetHeight || 440;
            const padding = 24;
            const offset = 12;

            // Default: Position to the right of the anchor
            let left = anchorRect.right + offset;
            let top = anchorRect.top - (cardHeight / 2) + (anchorRect.height / 2);

            // Flip Logic (Horizontal)
            if (left + cardWidth + padding > window.innerWidth) {
                left = anchorRect.left - cardWidth - offset;
            }

            // Flip Logic (Vertical)
            if (top + cardHeight + padding > window.innerHeight) {
                top = window.innerHeight - cardHeight - padding;
            }

            if (top < padding) {
                top = padding;
            }

            // Safety check for left edge
            if (left < padding) {
                left = padding;
                // If it still covers the anchor, try putting it above or below
                if (anchorRect.left < left + cardWidth && anchorRect.right > left) {
                    top = anchorRect.bottom + offset;
                    if (top + cardHeight + padding > window.innerHeight) {
                        top = anchorRect.top - cardHeight - offset;
                    }
                }
            }

            setCoords({ top, left });
        }
    }, [isOpen, anchorRect]);

    if (!isOpen || !anchorRect) return null;

    const cardContent = (
        <AnimatePresence>
            <div key="portal-overlay" className="fixed inset-0 z-[9998] pointer-events-none" />
            <motion.div
                key="portal-card"
                ref={cardRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                style={{
                    position: 'fixed',
                    top: coords.top,
                    left: coords.left,
                    width: '320px',
                    zIndex: 9999,
                }}
                className="bg-slate-900/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-700/50 overflow-hidden pointer-events-auto p-6"
            >
                {/* Header */}
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none">
                        AI CLINICAL INTEL
                    </span>
                </div>

                {/* Main Value Chunk */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <BarChart3 className="w-4 h-4" />
                        <span className="text-[10px] uppercase font-bold tracking-widest">Procedural Value</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-3xl font-bold text-emerald-400 tracking-tight">£{potentialValue.toLocaleString()}</h2>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Forecast</span>
                    </div>
                </div>

                {/* Evidence Chunks */}
                <div className="space-y-6 pt-6 border-t border-white/[0.05]">
                    <div className="flex items-center gap-2 text-slate-400 mb-3">
                        <Search className="w-4 h-4" />
                        <span className="text-[10px] uppercase font-bold tracking-widest">Reasoning Matrix</span>
                    </div>
                    <ul className="space-y-4">
                        <li className="flex gap-3">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                            <p className="text-[13px] text-white leading-relaxed font-medium">
                                Elevated dwell time detected on <span className="text-emerald-400">complex restorative</span> landing modules.
                            </p>
                        </li>
                        <li className="flex gap-3">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-700 shrink-0" />
                            <p className="text-[13px] text-slate-300 leading-relaxed">
                                Behavioral velocity correlates with <span className="text-slate-100 font-bold">94% conversion</span> cohort patterns.
                            </p>
                        </li>
                    </ul>
                </div>

                {/* Strategy Protocol */}
                <div className="mt-8 pt-6 border-t border-white/[0.05]">
                    <div className="flex items-center gap-2 mb-4">
                        <Target className="w-4 h-4 text-slate-500" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocol Plan</span>
                    </div>
                    <div className="space-y-2">
                        {treatmentPlan.map((step, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-2xl border border-white/[0.03] text-[12px] text-slate-200 font-medium group hover:bg-white/[0.05] transition-colors">
                                <div className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-emerald-400" />
                                {step}
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <button className="w-full mt-6 py-4 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] rounded-3xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20">
                    <span className="text-[11px] font-black text-white uppercase tracking-widest">Clinical Audit</span>
                    <ChevronRight className="w-4 h-4 text-white" />
                </button>

                {/* Footer Governance */}
                <div className="mt-6 pt-4 border-t border-white/[0.05] flex items-center justify-between opacity-50">
                    <div className="flex items-center gap-2">
                        <Stethoscope className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Clinical Security</span>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                </div>
            </motion.div>
        </AnimatePresence>
    );

    return createPortal(cardContent, document.body);
}
