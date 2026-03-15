import React, { useState, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BarChart3, Search, Stethoscope } from 'lucide-react';
import { ConsultationRequest } from '../../lib/supabase';

interface AICaseNotePopoverProps {
  lead: ConsultationRequest;
  isVisible: boolean;
  anchorRect?: DOMRect | null;
}

/**
 * AICaseNotePopover - Portal-based Clinical Insight Popover.
 * Decoupled from local DOM tree to eliminate clipping by overflow:hidden parents.
 */
export const AICaseNotePopover: React.FC<AICaseNotePopoverProps> = ({ lead, isVisible, anchorRect }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: -9999, left: -9999 });

  useLayoutEffect(() => {
    if (isVisible && anchorRect && cardRef.current) {
      const cardWidth = 320;
      const cardHeight = cardRef.current.offsetHeight || 380;
      const padding = 24;
      const offset = 12;

      // Primary Positioning: Above the anchor
      let top = anchorRect.top - cardHeight - offset;
      let left = anchorRect.left - (cardWidth / 2) + (anchorRect.width / 2);

      // Collision Detection: Top Viewport Edge (Flip to Bottom)
      if (top < padding) {
        top = anchorRect.bottom + offset;
      }

      // Collision Detection: Right Viewport Edge
      if (left + cardWidth + padding > window.innerWidth) {
        left = window.innerWidth - cardWidth - padding;
      }

      // Collision Detection: Left Viewport Edge
      if (left < padding) {
        left = padding;
      }

      // Final safety check for bottom edge
      if (top + cardHeight + padding > window.innerHeight) {
        top = window.innerHeight - cardHeight - padding;
      }

      setCoords({ top, left });
    }
  }, [isVisible, anchorRect]);

  if (!isVisible || !anchorRect) return null;

  const value = lead.potential_value || 1000;

  const popoverContent = (
    <AnimatePresence>
      <motion.div
        key="clinical-portal-card"
        ref={cardRef}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        style={{
          position: 'fixed',
          top: coords.top,
          left: coords.left,
          width: '320px',
          zIndex: 9999,
        }}
        className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-none p-6"
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="p-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500">
            AI CLINICAL INTEL
          </span>
        </div>

        {/* Structured Data Chunks */}
        <div className="space-y-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <BarChart3 className="w-4 h-4" />
              <span className="text-[10px] uppercase font-bold tracking-widest">Procedural Value</span>
            </div>
            <span className="text-3xl font-bold text-emerald-400 tracking-tight">£{value.toLocaleString()}</span>
          </div>

          <div className="pt-6 border-t border-white/[0.05]">
            <div className="flex items-center gap-2 text-slate-400 mb-4">
              <Search className="w-4 h-4" />
              <span className="text-[10px] uppercase font-bold tracking-widest leading-none">Evidence</span>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)] shrink-0" />
                <span className="text-[12px] text-slate-200 font-medium leading-relaxed">
                  Deep engagement detected on restorative clinical pathways.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-700 shrink-0" />
                <span className="text-[12px] text-slate-400 font-medium leading-relaxed">
                  Behavioral velocity benchmarks at the <span className="text-slate-100 font-bold">95th percentile</span>.
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/[0.05] flex items-center justify-between opacity-60">
           <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-slate-500" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Governance</span>
           </div>
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
        </div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(popoverContent, document.body);
};
