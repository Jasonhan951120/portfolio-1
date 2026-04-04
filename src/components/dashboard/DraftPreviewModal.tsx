import React from 'react';
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
  
  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden" onClick={(e) => { e.stopPropagation(); onClose(); }}>
      {/* Backdrop: Full Focus Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-[15px] w-full h-full"
      />
      
      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl flex flex-col lg:flex-row overflow-hidden border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Chameleon Visual UI */}
        <div className="w-full lg:w-2/5 relative h-48 lg:h-auto bg-slate-900 overflow-hidden">
          {contextualImage ? (
            <img 
              src={contextualImage} 
              alt="Contextual Visual" 
              className="absolute inset-0 w-full h-full object-cover transition-all duration-[2s] hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1c2c] via-[#4a192c] to-[#121212] animate-gradient-slow opacity-100" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:bg-gradient-to-r" />
          
          <div className="absolute bottom-8 left-8 right-8">
            <div className="flex items-center gap-3 mb-3">
              {type === 'PROPOSAL' && <Target className="w-6 h-6 text-indigo-400" />}
              {type === 'FOLLOWUP' && <HeartPulse className="w-6 h-6 text-emerald-400" />}
              {type === 'POSTCARE' && <Heart className="w-6 h-6 text-rose-400" />}
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/90">
                {type === 'PROPOSAL' && 'Authority Strategy'}
                {type === 'FOLLOWUP' && 'Empathy Loop'}
                {type === 'POSTCARE' && 'Delight Protocol'}
              </span>
            </div>
            <h3 className="text-2xl font-display font-medium text-white tracking-tight leading-none italic">
               {type === 'PROPOSAL' && 'Restoring Your Confidence'}
               {type === 'FOLLOWUP' && 'A Supportive Path'}
               {type === 'POSTCARE' && 'Celebrating Your Transformation'}
            </h3>
          </div>
        </div>

        {/* Right: AI Brain Interface */}
        <div className="flex-1 p-8 lg:p-12 flex flex-col bg-white">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800">
                {type === 'DRAFT' ? 'Clinical Insights' : 'AI Strategic Dispatch'}
              </h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="flex-1 min-h-[300px] mb-8 relative">
            {isLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" strokeWidth={1} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
                  Applying Psychological Triggers...
                </p>
              </div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => onContentChange(e.target.value)}
                className="w-full h-full min-h-[300px] bg-[#FBFBFB] border border-slate-100 rounded-3xl p-8 text-sm text-slate-700 font-medium leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all custom-scrollbar"
                placeholder="AI Brain synthesizing..."
              />
            )}
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
    </div>
  );
};
