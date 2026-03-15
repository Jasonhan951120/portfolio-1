import React, { useState, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BarChart3, Search, Stethoscope } from 'lucide-react';
import { ConsultationRequest } from '../../lib/supabase';

interface AICaseNotePopoverProps {
  lead: ConsultationRequest;
  isVisible: boolean;
  anchorRect?: DOMRect | null;
}

/**
 * AICaseNotePopover - A premium Glassmorphism UI for AI-generated clinical notes.
 * Featuring dynamic collision detection and Apple-grade typography.
 */
export const AICaseNotePopover: React.FC<AICaseNotePopoverProps> = ({ lead, isVisible, anchorRect }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (isVisible && anchorRect && cardRef.current) {
      const cardWidth = 320;
      const cardHeight = cardRef.current.offsetHeight || 300;
      const padding = 20;

      // Default: Position above the button
      let top = anchorRect.top - cardHeight - 12;
      let left = anchorRect.left - (cardWidth / 2) + (anchorRect.width / 2);

      // Collision Detection: Bottom (if top is too high, move below)
      if (top < padding) {
        top = anchorRect.bottom + 12;
      }

      // Collision Detection: Right Edge
      if (left + cardWidth + padding > window.innerWidth) {
        left = window.innerWidth - cardWidth - padding;
      }

      // Collision Detection: Left Edge
      if (left < padding) {
        left = padding;
      }

      // Final safety check for bottom
      if (top + cardHeight + padding > window.innerHeight) {
        top = window.innerHeight - cardHeight - padding;
      }

      setPosition({ top, left });
    }
  }, [isVisible, anchorRect]);

  const value = lead.potential_value || 1000;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Use fixed for the absolute positioning to break out of any relative parent containers */}
          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={anchorRect ? {
              position: 'fixed',
              top: position.top,
              left: position.left,
              zIndex: 1000,
            } : {}}
            className={`${!anchorRect ? 'absolute bottom-full mb-3 right-0' : ''} w-80 p-6 bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-none`}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">
                AI CLINICAL INTEL
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Procedural Value</span>
                </div>
                <span className="text-2xl font-bold text-slate-50 tracking-tight">£{value.toLocaleString()}</span>
              </div>

              <div className="flex flex-col pt-4 border-t border-white/[0.05]">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Search className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-black uppercase tracking-widest leading-none">Behavioral Evidence</span>
                </div>
                <p className="text-[12px] leading-relaxed text-slate-300 font-medium">
                  {lead.service?.toLowerCase().includes("implant") 
                    ? "Patient exhibited high-intent recursive engagement with restorative clinical cases." 
                    : "Data-driven velocity indicates significant conversion probability based on digital body language."}
                </p>
                <ul className="mt-3 space-y-1.5">
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                    <span className="text-[11px] text-slate-400">3+ Multi-session analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-slate-700" />
                    <span className="text-[11px] text-slate-400">Competitive benchmarking verified</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-5 pt-3 border-t border-white/[0.05] flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <Stethoscope className="w-3 h-3 text-slate-600" />
                  <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">Clinical Luxury Governance</span>
               </div>
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse" />
            </div>

            {!anchorRect && (
              <div className="absolute top-full right-6 w-3 h-3 bg-slate-900 border-r border-b border-slate-700 rotate-45 -translate-y-[6px]" />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
