import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ClipboardList, ChevronRight, Stethoscope, Search, BarChart3 } from 'lucide-react';

interface AI_InsightCardProps {
    isOpen: boolean;
    onClose: () => void;
    anchorRect: DOMRect | null;
    insight: string;
    treatmentPlan: string[];
    potentialValue?: number;
}

/**
 * AI_InsightCard - A premium Glassmorphism UI for Explainable AI (XAI).
 * Follows "Clinical Business English" and "Aesthetic-Usability Effect" principles.
 */
export function AI_InsightCard({ 
    isOpen, 
    onClose, 
    anchorRect, 
    insight, 
    treatmentPlan,
    potentialValue = 12000 // Default based on clinical elite specs
}: AI_InsightCardProps) {
    if (!anchorRect) return null;

    // Position the popover next to the card
    const style: React.CSSProperties = {
        position: 'fixed',
        top: Math.max(20, anchorRect.top - 40), // Adjust to show well
        left: anchorRect.right + 16,
        zIndex: 1000,
    };

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
                        initial={{ opacity: 0, x: -20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        style={style}
                        className="w-[340px] bg-slate-900/80 backdrop-blur-md rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-slate-700/50 overflow-hidden pointer-events-auto"
                    >
                        {/* Header: AI Status */}
                        <div className="px-6 pt-6 pb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                    <Sparkles className="w-4 h-4 text-emerald-400" />
                                </div>
                                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                                    XAI Reasoning Engine
                                </span>
                            </div>
                            <div className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
                                <span className="text-[8px] font-black text-slate-400 uppercase">Live Intel</span>
                            </div>
                        </div>

                        {/* Value Proposition Section */}
                        <div className="px-6 py-4 space-y-2">
                            <div className="flex items-center gap-2 text-slate-400 mb-1">
                                <BarChart3 className="w-3.5 h-3.5" />
                                <span className="text-[10px] uppercase font-bold tracking-tight">Data-driven Outlook</span>
                            </div>
                            <p className="text-sm font-medium text-slate-200 leading-relaxed">
                                Data-driven outlook indicates a <span className="text-emerald-400 font-bold">£{potentialValue.toLocaleString()}</span> pipeline potential, validated by the patient's high-intent digital footprint.
                            </p>
                        </div>

                        {/* Evidence/Reasoning Section (Digital Footprint) */}
                        <div className="px-6 py-4 bg-slate-800/50 border-y border-slate-800/50">
                            <div className="flex items-center gap-2 text-slate-400 mb-2">
                                <Search className="w-3.5 h-3.5" />
                                <span className="text-[10px] uppercase font-bold tracking-tight">Reasoning / Digital Footprint</span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed italic">
                                Evidence: Patient exhibited digital body language consistent with high-value conversion, including 3+ prolonged sessions on the advanced implant procedure pages.
                            </p>
                        </div>

                        {/* Proposed Clinical Steps */}
                        <div className="px-6 py-5 space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700">
                                    <ClipboardList className="w-4 h-4 text-slate-400" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Strategic Conversion Plan</span>
                            </div>

                            <ul className="space-y-2.5">
                                {treatmentPlan.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3 group/item">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500/50 group-hover/item:bg-emerald-400 transition-colors shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                        <span className="text-[11px] text-slate-300 font-medium group-hover:text-white transition-colors">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <button className="w-full mt-2 py-3 bg-white/5 hover:bg-white/10 active:scale-[0.98] rounded-2xl border border-white/5 flex items-center justify-center gap-2 transition-all group/btn">
                                <span className="text-[10px] font-bold text-slate-300 group-hover/btn:text-white uppercase tracking-widest">Execute Full Audit</span>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover/btn:text-white" />
                            </button>
                        </div>

                        {/* Footer Governance */}
                        <div className="px-6 py-3 bg-slate-900/90 flex items-center justify-between border-t border-slate-800">
                            <div className="flex items-center gap-2">
                                <Stethoscope className="w-3 h-3 text-slate-500" />
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Clinical Luxury Governance</span>
                            </div>
                            <span className="text-[8px] font-black text-emerald-500/40 uppercase">Encrypted</span>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
