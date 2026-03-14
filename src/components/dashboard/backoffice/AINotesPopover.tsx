import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ClipboardList, ChevronRight, Stethoscope } from 'lucide-react';

interface AINotesPopoverProps {
    isOpen: boolean;
    onClose: () => void;
    anchorRect: DOMRect | null;
    insight: string;
    treatmentPlan: string[];
}

export function AINotesPopover({ isOpen, onClose, anchorRect, insight, treatmentPlan }: AINotesPopoverProps) {
    if (!anchorRect) return null;

    // Position the popover next to the card
    const style: React.CSSProperties = {
        position: 'fixed',
        top: anchorRect.top,
        left: anchorRect.right + 12, // 12px gap
        zIndex: 300,
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Invisible Backdrop for closing */}
                    <div 
                        className="fixed inset-0 z-[290] pointer-events-auto" 
                        onClick={onClose} 
                    />

                    <motion.div
                        initial={{ opacity: 0, x: -10, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -10, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        style={style}
                        className="w-[280px] bg-white rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.03),_0_24px_64px_rgba(0,0,0,0.04)] border-[0.5px] border-slate-200/60 overflow-hidden pointer-events-auto"
                    >
                        {/* AI Insight Section */}
                        <div className="p-5 space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                                </div>
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">AI Insight</span>
                            </div>
                            
                            <p className="text-sm font-bold text-slate-800 leading-snug">
                                "{insight}"
                            </p>
                        </div>

                        <hr className="border-slate-50 mx-5" />

                        {/* Treatment Plan Section */}
                        <div className="p-5 space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                                    <ClipboardList className="w-3.5 h-3.5 text-slate-400" />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Proposed Plan</span>
                            </div>

                            <ul className="space-y-2">
                                {treatmentPlan.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2 group/item">
                                        <div className="mt-1.5 w-1 h-1 rounded-full bg-slate-300 shrink-0 group-hover/item:bg-[#87A96B] transition-colors" />
                                        <span className="text-xs text-slate-500 font-medium group-hover/item:text-slate-700 transition-colors">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className="w-full py-3 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center gap-2 transition-all group/btn">
                                <span className="text-[10px] font-black text-slate-400 group-hover/btn:text-slate-600 uppercase tracking-widest">Full History</span>
                                <ChevronRight className="w-3 h-3 text-slate-300 group-hover/btn:text-slate-400" />
                            </button>
                        </div>

                        {/* Bottom Anchor */}
                        <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-50 flex items-center gap-2">
                            <Stethoscope className="w-3 h-3 text-slate-300" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Clinical Luxury Governance</span>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
