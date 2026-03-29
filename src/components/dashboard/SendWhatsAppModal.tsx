import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, MessageCircle, AlertCircle, Shield } from 'lucide-react';
import { type ConsultationRequest } from '../../lib/supabase';
import { useDashboardStore } from '../../store/useDashboardStore';

interface SendWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: ConsultationRequest | null;
}

export const SendWhatsAppModal: React.FC<SendWhatsAppModalProps> = ({
  isOpen,
  onClose,
  lead,
}) => {
  const { clinicName } = useDashboardStore();
  const activeClinicName = clinicName || "Our Clinic";
  
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [tone, setTone] = useState<'professional' | 'friendly'>('professional');

  useEffect(() => {
    if (isOpen && lead) {
      const patientName = lead.name?.split(' ')[0] || "Patient";
      const ptLink = `${window.location.origin}/pt/${(lead as any).slug || lead.id.substring(0, 8)}`;
      
      let initialMessage = '';

      if (tone === 'professional') {
        initialMessage = `✨ *${activeClinicName}*

Hi ${patientName},

Your bespoke Digital Smile Protocol & Treatment Proposal is now ready for review.

Following your consultation, we have finalized your personalized implant plan. You can access your secure patient portal to view the full details here:

🔗 View My Full Proposal: ${ptLink}`;
      } else {
        initialMessage = `✨ *${activeClinicName}*

Hey ${patientName}! 👋

Great news! Your personalized Smile Design Protocol is finished and looking incredible.

We've crafted this plan just for you. Please check out all the exciting details on your private portal here:

🔗 See Your Personal Plan: ${ptLink}`;
      }

      setMessage(initialMessage);
      setErrorMsg(null);
    }
  }, [isOpen, lead, activeClinicName, tone]);

  const handleSend = () => {
    if (!lead || !lead.phone) {
      setErrorMsg("Patient phone number is missing.");
      return;
    }

    const cleanPhone = lead.phone.replace(/[^\d]/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  if (!isOpen || !lead) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl border border-slate-200 overflow-hidden">
          
          {/* Executive Header */}
          <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#25D366] rounded-2xl shadow-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Send Bespoke Proposal via WhatsApp</h3>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">Premium Patient Communication</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors transition-transform hover:rotate-90">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {errorMsg && (
            <div className="px-10 py-4 bg-red-50 border-b border-red-100 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-[11px] font-bold text-red-600 uppercase tracking-widest">{errorMsg}</p>
            </div>
          )}

          {/* Terminal Controls */}
          <div className="px-10 py-10 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">ATMOSPHERIC SELECTION</label>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button
                    onClick={() => setTone('professional')}
                    className={`py-3 px-4 rounded-2xl flex items-center justify-center gap-2 border transition-all ${
                      tone === 'professional'
                        ? 'bg-[#25D366]/10 border-[#25D366] text-[#128C7E] shadow-[0_0_15px_rgba(37,211,102,0.15)]'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span className="text-[11px] font-black uppercase tracking-widest">PROFESSIONAL</span>
                  </button>
                  <button
                    onClick={() => setTone('friendly')}
                    className={`py-3 px-4 rounded-2xl flex items-center justify-center gap-2 border transition-all ${
                      tone === 'friendly'
                        ? 'bg-[#25D366]/10 border-[#25D366] text-[#128C7E] shadow-[0_0_15px_rgba(37,211,102,0.15)]'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-[11px] font-black uppercase tracking-widest">FRIENDLY</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">WHATSAPP MESSAGE</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Review the bespoke message..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#25D366]/20 transition-all h-64 resize-none shadow-inner font-inter leading-relaxed"
                />
              </div>
            </div>
          </div>

          <div className="px-10 py-10 bg-slate-50 border-t border-slate-100">
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={handleSend}
                disabled={!lead.phone}
                className="py-5 bg-[#25D366] hover:bg-[#128C7E] disabled:opacity-50 text-white rounded-3xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-[#25D366]/20 flex items-center justify-center gap-3"
              >
                <Send className="w-4 h-4" /> Send via WhatsApp
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-2 mt-8 opacity-40">
              <Shield className="w-3 h-3" />
              <span className="text-[8px] font-black uppercase tracking-[0.4em]">WhatsApp API Secure Gateway</span>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
