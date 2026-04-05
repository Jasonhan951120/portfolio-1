import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { Sparkles, MessageCircle, Mail, X, Loader2, Target, Heart, HeartPulse, Stethoscope } from 'lucide-react';
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
  }, []);

  // Background Scroll Lock - Critical Fix
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!isOpen || !mounted || typeof document === 'undefined') return null;

  // Chameleon UI Image Logic
  const getContextualImage = () => {
    const matchedTemplate = (activeTreatments?.length > 0 ? activeTreatments : templates)?.find(t => 
      t.name?.toLowerCase() === (lead.service || lead.treatment_name || '').toLowerCase()
    );

    if (type === 'PROPOSAL') {
      return matchedTemplate?.afterImg || clinicLogo || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=2070';
    }
    if (type === 'FOLLOWUP') {
      return clinicSignatureImage || null; // Use null to trigger gradient if no custom photo
    }
    return clinicLogo;
  };

  const contextualImage = getContextualImage();

  return createPortal(
    <div 
      className="fixed inset-0 !z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden" 
      onClick={(e) => { e.stopPropagation(); onClose(); }}
    >
      {/* Backdrop: Absolute "Fog of War" Isolation Fix */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 w-screen h-screen !z-[9998]"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(15px)' }}
      />
      
      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-5xl bg-white rounded-[40px] shadow-2xl flex flex-col lg:flex-row overflow-hidden border border-white/20 !z-[9999]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Chameleon Visual UI - Premium Ceramic Studio Detail */}
        <div className="w-full lg:w-[35%] relative h-48 lg:h-auto bg-slate-900 overflow-hidden">
          {contextualImage ? (
            <img 
              src={contextualImage} 
              alt="Contextual Visual" 
              className="absolute inset-0 w-full h-full object-cover transition-all duration-[2s] hover:scale-110 opacity-80"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1c2c] via-[#4a192c] to-[#121212] animate-gradient-slow opacity-100" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          <div className="absolute bottom-10 left-10 right-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/70">
                {type === 'FOLLOWUP' ? "Michael's Veneers Case: /london.clinic/Veneers/Ross" : "Clinical Precision Loop"}
              </span>
            </div>
            <h3 className="text-3xl font-display font-medium text-white tracking-tight leading-[1.1] italic max-w-[200px]">
               {type === 'PROPOSAL' && 'Restoring Your Confidence'}
               {type === 'FOLLOWUP' && 'A Supportive Path'}
               {type === 'POSTCARE' && 'Celebrating Your Transformation'}
            </h3>
          </div>
        </div>

        {/* Right: AI Brain Interface */}
        <div className="flex-1 p-8 lg:p-14 flex flex-col bg-white">
          <div className="flex justify-between items-start mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600/60">AI STRATEGIC DISPATCH</span>
              </div>
              <h2 className="text-2xl font-display font-semibold text-slate-900 tracking-tight">
                Veneers Follow-up for Michael Ross
              </h2>
              <p className="text-sm text-slate-500 mt-1">Preparing the next step for Michael's smile transformation.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row gap-8 mb-10">
            <div className="flex-1 min-h-[350px] relative flex flex-col">
              {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" strokeWidth={1} />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
                    Synthesizing Narrative...
                  </p>
                </div>
              ) : (
                <div className="flex-1 bg-[#FBFBFB] border border-slate-100 rounded-3xl p-8 flex flex-col">
                  <div className="mb-4 pb-4 border-b border-slate-200/50">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Subject:</span>
                    <span className="ml-2 text-sm font-medium text-slate-800">Your personalized veneers journey</span>
                  </div>
                  <textarea
                    value={content}
                    onChange={(e) => onContentChange(e.target.value)}
                    className="flex-1 w-full bg-transparent text-sm text-slate-700 font-medium leading-relaxed resize-none focus:outline-none custom-scrollbar"
                    placeholder="AI Brain synthesizing..."
                  />
                </div>
              )}
            </div>

            {/* Drafting Settings Section */}
            <div className="w-full lg:w-64 flex flex-col gap-6">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Drafting Settings</h4>
                <button 
                  className="w-full flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-600 hover:shadow-sm transition-all group"
                  title="Regenerate with AI"
                >
                  <span className="text-xs font-semibold text-slate-600">AI Re-draft</span>
                  <Sparkles className="w-4 h-4 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                </button>
              </div>

              <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100/50">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">Stage Context</h4>
                <p className="text-[11px] font-medium text-indigo-900/60 leading-relaxed">
                  Michael is currently in the "Consultation" stage. This follow-up is optimized for high-conversion empathy.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {type === 'DRAFT' ? (
              <button
                onClick={onSave}
                className="w-full py-5 bg-slate-950 text-white rounded-full font-black text-[11px] uppercase tracking-widest shadow-xl hover:bg-slate-900 transition-all active:scale-95"
              >
                Sync with Clinical Strategy
              </button>
            ) : (
              <>
                <button
                  onClick={onSendWhatsApp}
                  className="flex-1 py-5 bg-[#25D366] text-white rounded-full font-black text-[11px] uppercase tracking-widest shadow-xl hover:bg-[#128C7E] transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp Dispatch
                </button>
                <button
                  onClick={onSendEmail}
                  className="flex-1 py-5 bg-slate-950 text-white rounded-full font-black text-[11px] uppercase tracking-widest shadow-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Mail className="w-4 h-4" /> Professional Email
                </button>
              </>
            )}
          </div>

          <div className="mt-8 flex items-center justify-center gap-3 opacity-20">
             <Stethoscope className="w-4 h-4" />
             <span className="text-[9px] font-black uppercase tracking-[0.4em]">Hanlan Intelligence Suite • High-End Precision</span>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};
