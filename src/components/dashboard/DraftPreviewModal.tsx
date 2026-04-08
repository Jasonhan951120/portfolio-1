import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageCircle, Mail, X, Loader2, Stethoscope } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { type ConsultationRequest } from '../../lib/supabase';
import { FollowUpEmail } from './FollowUpEmail';

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
  const { 
    clinicLogo, 
    clinicSignatureImage, 
    activeTreatments, 
    templates, 
    clinicName,
    liveReviews,
    googleProfile,
    googlePlaceId,
    reputationMode 
  } = useDashboardStore();
  
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
          
          {/* [MODAL CONTAINER]: "Private Sales Room" Authority - Final Textural Polish */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-[70vw] max-w-[1100px] h-[80vh] max-h-[850px] bg-[#F9FAFB] rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5),0_0_80px_rgba(0,0,0,0.2)] flex flex-col lg:flex-row overflow-hidden border border-white/10 !z-[9999]"
            style={{ 
              zIndex: 9999,
              boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.1), 0 50px 100px -20px rgba(0,0,0,0.5), 0 0 80px rgba(0,0,0,0.2)'
            }}
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
              
              <div className="absolute bottom-16 left-8 right-8 z-20">
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

            {/* Right: AI Brain Interface - Strict Vertical Hierarchy Fix */}
            <div className="flex-1 pt-6 px-6 lg:pt-10 lg:px-10 flex flex-col bg-[#F9FAFB] h-full overflow-hidden">
              {/* Top Section: Header */}
              <div className="flex justify-between items-start mb-6 shrink-0">
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
                <button onClick={onClose} className="p-1.5 hover:bg-slate-200/50 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Middle Section: Scrollable Drafting Area & Settings */}
              <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-6 min-h-0">
                {/* Drafting Box Container (z-10) */}
                <div className="flex-1 relative flex flex-col min-h-0 overflow-hidden z-10">
                  {isLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4">
                      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" strokeWidth={1} />
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
                        Synthesizing Narrative...
                      </p>
                    </div>
                  ) : (
                    <div className="flex-1 bg-white border border-slate-200/60 rounded-3xl p-6 flex flex-col shadow-sm min-h-0 max-h-[calc(100vh-250px)] overflow-hidden">
                      <div className="mb-3 pb-3 border-b border-slate-100 shrink-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subject:</span>
                        <span className="ml-2 text-xs font-medium text-slate-800">Your personalized {lead.service || 'treatment'} journey</span>
                      </div>
                      
                      {type === 'FOLLOWUP' ? (
                        <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
                          {/* Rich Preview */}
                          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 rounded-2xl bg-slate-50/50 p-4 border border-slate-100">
                            <FollowUpEmail 
                              leadName={lead.name}
                              clinicName={clinicName}
                              clinicLogo={clinicLogo}
                              treatmentName={lead.service || lead.treatment_name || 'Treatment'}
                              reviews={liveReviews}
                              rating={googleProfile?.rating}
                              googlePlaceId={googlePlaceId}
                              personalizedNote={content}
                              reputationMode={reputationMode}
                            />
                          </div>
                          
                          {/* Live Editor */}
                          <div className="w-full lg:w-1/3 flex flex-col border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-4">
                            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Personalize Note</label>
                            <textarea
                              value={content}
                              onChange={(e) => onContentChange(e.target.value)}
                              className="flex-1 w-full bg-transparent text-xs text-slate-700 font-medium leading-relaxed resize-none focus:outline-none custom-scrollbar overflow-y-auto"
                              placeholder="Personalize the clinical message..."
                            />
                          </div>
                        </div>
                      ) : (
                        <textarea
                          value={content}
                          onChange={(e) => onContentChange(e.target.value)}
                          className="flex-1 w-full bg-transparent text-xs text-slate-700 font-medium leading-relaxed resize-none focus:outline-none custom-scrollbar overflow-y-auto pb-4"
                          placeholder="AI Brain synthesizing..."
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Settings Panel */}
                <div className="w-full lg:w-56 flex flex-col gap-5 shrink-0 z-10 overflow-y-auto pb-4">
                  <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Settings</h4>
                    <button className="w-full flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-indigo-600 transition-all group shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_2px_rgba(0,0,0,0.06)] active:shadow-inner">
                      <span className="text-[10px] font-semibold text-slate-600">AI Re-draft</span>
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400 group-hover:text-indigo-600" />
                    </button>
                  </div>
                  <div className="p-5 bg-indigo-50/30 rounded-3xl border border-indigo-100/50 shadow-sm">
                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-1.5">Context</h4>
                    <p className="text-[10px] font-medium text-indigo-900/60 leading-relaxed capitalize">
                      {lead.status} stage: Empathy-driven conversion logic active.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Fixed Action Buttons (z-20) */}
              <div className="mt-auto shrink-0 z-20 py-4 lg:py-6 bg-white/50 backdrop-blur-sm border-t border-slate-200/40 relative">
                <div className="absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-[#F9FAFB] to-transparent pointer-events-none" />
                <div className="flex flex-col sm:flex-row gap-3 relative z-30">
                  {type === 'DRAFT' ? (
                    <button onClick={onSave} className="w-full py-3.5 bg-slate-950 text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-[0_4px_12px_rgba(0,0,0,0.2),0_1px_1px_rgba(255,255,255,0.1)_inset] hover:bg-slate-900 transition-all active:scale-95">
                      Sync Strategy
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={onSendWhatsApp} 
                        className="flex-[0.8] py-3.5 bg-[#25D366] text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-[0_4px_12px_rgba(37,211,102,0.2),0_1px_1px_rgba(255,255,255,0.2)_inset] hover:bg-[#128C7E] transition-all flex items-center justify-center gap-2 active:scale-95"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Dispatch
                      </button>
                      <button 
                        onClick={onSendEmail} 
                        className="flex-1 py-3.5 bg-slate-950 text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-[0_4px_12px_rgba(0,0,0,0.2),0_1px_1px_rgba(255,255,255,0.1)_inset] hover:bg-slate-900 transition-all flex items-center justify-center gap-2 active:scale-95"
                      >
                        <Mail className="w-3.5 h-3.5" /> Professional Email
                      </button>
                    </>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 opacity-20 relative z-30">
                   <Stethoscope className="w-3.5 h-3.5" />
                   <span className="text-[8px] font-black uppercase tracking-[0.3em]">Precision Engine V2</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
