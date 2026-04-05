import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageCircle, Mail, X, Loader2, Stethoscope } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { type ConsultationRequest } from '../../lib/supabase';

interface DraftPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: ConsultationRequest;
  type: string; // 'DRAFT' | 'PROPOSAL' | 'FOLLOWUP' | 'POSTCARE'
  content: string;
  onContentChange: (content: string) => void;
  isLoading: boolean;
  onSave?: () => void;
  onSendWhatsApp: () => void;
  onSendEmail: () => void;
}

export const DraftPreviewModal: React.FC<DraftPreviewModalProps> = ({
  isOpen,
  onClose,
  lead,
  type,
  content,
  onContentChange,
  isLoading,
  onSave,
  onSendWhatsApp,
  onSendEmail
}) => {
  const { clinicLogo, clinicSignatureImage, activeTreatments, templates } = useDashboardStore();
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // [THE "ABSOLUTE FRONT" LAYER FIX]: Background Scroll Lock
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!mounted || typeof document === 'undefined') return null;

  // Chameleon UI Image Logic
  const getContextualImage = () => {
    const matchedTemplate = (activeTreatments?.length > 0 ? activeTreatments : templates)?.find(t => 
      t.name?.toLowerCase() === (lead.service || lead.treatment_name || '').toLowerCase()
    );

    if (type === 'PROPOSAL') {
      return matchedTemplate?.afterImg || clinicLogo || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=2070';
    }
    if (type === 'FOLLOWUP') {
      return clinicSignatureImage || null;
    }
    return clinicLogo;
  };

  const contextualImage = getContextualImage();

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 !z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden" 
          onClick={(e) => { e.stopPropagation(); onClose(); }}
        >
          {/* [BLACKOUT BACKDROP]: Absolute "Fog of War" Isolation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 w-screen h-screen !z-[9998]"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.8)', 
              backdropFilter: 'blur(20px)',
              zIndex: 9998 
            }}
          />
          
          {/* [MODAL CONTAINER]: "Private Sales Room" Authority - Now Re-compacted */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-[70vw] max-w-[1100px] h-[80vh] max-h-[850px] bg-white rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5),0_0_80px_rgba(0,0,0,0.2)] flex flex-col lg:flex-row overflow-hidden border border-white/10 !z-[9999]"
            style={{ zIndex: 9999 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: Chameleon Visual UI - Signature Lounge Visual / Abstract Fallback */}
            <div className="w-full lg:w-[30%] relative h-48 lg:h-auto bg-[#121212] overflow-hidden">
              {contextualImage ? (
                <>
                  <motion.img 
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.9 }}
                    src={contextualImage} 
                    alt="Clinical Context" 
                    className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] contrast-[1.1]"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#121212] to-[#1A1A1A]">
                  {/* Microscopic Medical Grid Pattern */}
                  <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-5">
                    <span className="text-[200px] font-serif font-bold text-white tracking-tighter leading-none select-none">H</span>
                  </div>
                </div>
              )}
              {/* Refined "Text Pop" Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/40 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-10 left-8 right-8 z-20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/80 drop-shadow-md">
                    Clinical Precision
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-medium text-white tracking-tight leading-[1.2] drop-shadow-2xl">
                   {lead.name} <br/>
                   <span className="text-emerald-400/90 italic font-display text-xl">{lead.service || lead.treatment_name || 'Veneers'}</span>
                </h3>
              </div>
            </div>

            {/* Right: AI Brain Interface - Tightened for Compactness */}
            <div className="flex-1 p-6 lg:p-10 flex flex-col bg-white overflow-y-auto">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600/60">AI STRATEGIC DISPATCH</span>
                  </div>
                  <h2 className="text-xl font-display font-semibold text-slate-900 tracking-tight">
                    {lead.service || 'Case'} Context: {lead.name}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Clinical narrative optimization protocol in progress.</p>
                </div>
                <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="flex-1 flex flex-col lg:flex-row gap-6 mb-8 min-h-0">
                <div className="flex-1 relative flex flex-col min-h-[300px]">
                  {isLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4">
                      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" strokeWidth={1} />
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
                        Synthesizing Narrative...
                      </p>
                    </div>
                  ) : (
                    <div className="flex-1 bg-[#FBFBFB] border border-slate-100 rounded-3xl p-6 flex flex-col">
                      <div className="mb-3 pb-3 border-b border-slate-200/50">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subject:</span>
                        <span className="ml-2 text-xs font-medium text-slate-800">Your personalized {lead.service || 'treatment'} journey</span>
                      </div>
                      <textarea
                        value={content}
                        onChange={(e) => onContentChange(e.target.value)}
                        className="flex-1 w-full bg-transparent text-xs text-slate-700 font-medium leading-relaxed resize-none focus:outline-none custom-scrollbar"
                        placeholder="AI Brain synthesizing..."
                      />
                    </div>
                  )}
                </div>

                <div className="w-full lg:w-56 flex flex-col gap-5">
                  <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Settings</h4>
                    <button className="w-full flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-600 transition-all group">
                      <span className="text-[10px] font-semibold text-slate-600">AI Re-draft</span>
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400 group-hover:text-indigo-600" />
                    </button>
                  </div>
                  <div className="p-5 bg-indigo-50/50 rounded-3xl border border-indigo-100/50">
                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-1.5">Context</h4>
                    <p className="text-[10px] font-medium text-indigo-900/60 leading-relaxed capitalize">
                      {lead.status} stage: Empathy-driven conversion logic active.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {type === 'DRAFT' ? (
                  <button onClick={onSave} className="w-full py-3.5 bg-slate-950 text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-slate-900 transition-all active:scale-95">
                    Sync Strategy
                  </button>
                ) : (
                  <>
                    <button onClick={onSendWhatsApp} className="flex-1 py-3.5 bg-[#25D366] text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-[#128C7E] transition-all flex items-center justify-center gap-2 active:scale-95">
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Dispatch
                    </button>
                    <button onClick={onSendEmail} className="flex-1 py-3.5 bg-slate-950 text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-slate-900 transition-all flex items-center justify-center gap-2 active:scale-95">
                      <Mail className="w-3.5 h-3.5" /> Professional Email
                    </button>
                  </>
                )}
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 opacity-20">
                 <Stethoscope className="w-3.5 h-3.5" />
                 <span className="text-[8px] font-black uppercase tracking-[0.3em]">Precision Engine V2</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
