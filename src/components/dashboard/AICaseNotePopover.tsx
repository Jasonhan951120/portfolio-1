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
 * AICaseNotePopover - A premium, structured "AI Insight Card" for clinical notes.
 * Enforces Zero-Friction positioning and Apple-standard information hierarchy.
 */
export const AICaseNotePopover: React.FC<AICaseNotePopoverProps> = ({ lead, isVisible, anchorRect }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (isVisible && anchorRect && cardRef.current) {
      const cardWidth = 320;
      const cardHeight = cardRef.current.offsetHeight || 340;
      const padding = 24;
      const gap = 12;

      // Primary: Position above the trigger button
      let top = anchorRect.top - cardHeight - gap;
      let left = anchorRect.left - (cardWidth / 2) + (anchorRect.width / 2);

      // Collision Detection: Top Viewport Edge (Flip to Bottom)
      if (top < padding) {
        top = anchorRect.bottom + gap;
      }

      // Collision Detection: Right Viewport Edge
      if (left + cardWidth + padding > window.innerWidth) {
        left = window.innerWidth - cardWidth - padding;
      }

      // Collision Detection: Left Viewport Edge
      if (left < padding) {
        left = padding;
      }

      // Collision Detection: Bottom Viewport Edge
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
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          style={anchorRect ? {
            position: 'fixed',
            top: position.top,
            left: position.left,
            zIndex: 1000,
          } : {
            position: 'absolute',
            bottom: '100%',
            right: 0,
            marginBottom: '12px',
          }}
          className="w-80 p-6 bg-slate-900/85 backdrop-blur-xl border border-slate-700/50 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.4)] pointer-events-none overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <div className="p-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">
              AI CLINICAL INTEL
            </span>
          </div>

          {/* Structured Data: Chunks */}
          <div className="space-y-6">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <BarChart3 className="w-4 h-4" />
                <span className="text-[10px] uppercase font-black tracking-widest leading-none">Market Valuation</span>
              </div>
              <span className="text-3xl font-bold text-emerald-400 tracking-tight">£{value.toLocaleString()}</span>
            </div>

            <div className="pt-6 border-t border-white/[0.05]">
              <div className="flex items-center gap-2 text-slate-400 mb-3">
                <Search className="w-4 h-4" />
                <span className="text-[10px] uppercase font-black tracking-widest leading-none">Reasoning</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)] shrink-0" />
                  <span className="text-[12px] text-slate-200 font-medium leading-relaxed">
                    Recursive engagement on <span className="text-white">implant clinical modules</span>.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-700 shrink-0" />
                  <span className="text-[12px] text-slate-400 font-medium leading-relaxed">
                    High-intent velocity benchmarked at <span className="text-slate-300">92nd percentile</span>.
                  </span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Governance Footer */}
          <div className="mt-6 pt-4 border-t border-white/[0.05] flex items-center justify-between">
             <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-slate-600" />
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Clinical Luxury</span>
             </div>
             <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 animate-pulse" />
                <span className="text-[8px] font-black text-emerald-500/20 uppercase">Secure</span>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
