import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Send, CheckCircle, RefreshCw, Link as LinkIcon, FileText, Shield } from 'lucide-react';
import { ConsultationRequest } from '../../lib/supabase';

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: ConsultationRequest | null;
  currency?: string;
  clinicName?: string;
  onUpdateLead?: (id: string, updates: Partial<ConsultationRequest>) => void;
}

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({
  isOpen,
  onClose,
  lead,
  currency = '£',
  clinicName = "Hanlan OC Dental Clinic",
  onUpdateLead
}) => {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  const [overridePrice, setOverridePrice] = useState<string>('');
  const [personalizedNote, setPersonalizedNote] = useState<string>('');

  React.useEffect(() => {
    if (isOpen && lead) {
       setOverridePrice(String(lead.potential_value || ''));
       setPersonalizedNote(lead.pt_personalized_note || '');
    }
  }, [isOpen, lead]);

  const patientName = String(lead?.name || 'Valued Patient');
  const treatmentType = String(lead?.service || 'Dental Treatment');
  const totalValue = lead?.potential_value ? lead.potential_value.toLocaleString() : 'TBD';
  const uniqueId = typeof lead?.id === 'string' ? lead.id.slice(0, 8) : 'px-token';

  const handleSend = () => {
    setIsSending(true);

    if (onUpdateLead && lead) {
      onUpdateLead(lead.id, {
        potential_value: Number(overridePrice) || lead.potential_value,
        pt_price_override: Number(overridePrice) || lead.potential_value,
        pt_personalized_note: personalizedNote
      });
    }

    // Simulate high-end processing delay
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      // Auto-close after success message
      setTimeout(() => {
        onClose();
        // Reset state for next open
        setTimeout(() => setIsSent(false), 500);
      }, 2000);
    }, 1500);
  };

  if (!isOpen || !lead) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900 rounded-xl">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Professional PT Proposal</h3>
                <p className="text-xs text-slate-500 font-medium">Verify and send personalized treatment plan</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-200/50 rounded-full transition-colors text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Override Settings */}
          <div className="px-8 pt-8 pb-4">
            <h4 className="text-sm font-bold text-slate-900 mb-4">Patient-Specific Overrides</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Final Treatment Price</label>
                 <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{currency}</span>
                    <input 
                       type="number" 
                       value={overridePrice}
                       onChange={(e) => setOverridePrice(e.target.value)}
                       className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-8 pr-4 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                       placeholder="e.g. 5000"
                    />
                 </div>
              </div>
              <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Personalized Note</label>
                 <textarea 
                    value={personalizedNote}
                    onChange={(e) => setPersonalizedNote(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm resize-none h-24"
                    placeholder="e.g. Great seeing you today, James!"
                 />
              </div>
            </div>
          </div>

          {/* Email Preview Area */}
          <div className="px-8 pb-8">
            <div className="bg-slate-50 rounded-2xl border border-slate-200/60 p-6 space-y-4">
              {/* Subject Line */}
              <div className="flex gap-3 pb-4 border-b border-slate-200/60">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest w-16 px-1">Subject</span>
                <span className="text-sm font-semibold text-slate-900">
                  Personalized Treatment Plan for {patientName} | {clinicName}
                </span>
              </div>

              {/* Email Body */}
              <div className="pt-2 text-slate-700 text-sm leading-relaxed space-y-4 font-medium">
                <p>Dear {patientName},</p>
                
                <p>
                  It was a pleasure seeing you at <span className="text-slate-900 font-bold">{clinicName}</span> today. 
                  Dr. Ross has finalized your bespoke treatment plan for <span className="text-slate-900 font-bold">{treatmentType}</span>.
                </p>

                <p>
                  We believe this plan will provide the best long-term outcome for your dental health. 
                  You can review your detailed plan and investment breakdown <span className="text-emerald-600 font-bold">({currency}{totalValue})</span> at the secure link below:
                </p>

                <div className="py-2">
                  <div className="flex items-center gap-2 text-slate-400 bg-white border border-slate-200 rounded-lg p-3 select-none">
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span className="text-xs font-mono truncate">
                      https://{clinicName.toLowerCase().replace(/\s+/g, '-')}.dental-portal.com/view/{uniqueId}
                    </span>
                  </div>
                </div>

                <p>
                  We have reserved a priority slot for you. Should you have any questions, simply reply to this email.
                </p>

                <div className="pt-4 border-t border-slate-200/60 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                    JR
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">Dr. Ross</span>
                    <span className="text-[10px] text-slate-400">Lead Clinician, {clinicName}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-8 py-6 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-500">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest">End-to-End Encrypted</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                disabled={isSending || isSent}
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={handleSend}
                disabled={isSending || isSent}
                className={`relative min-w-[180px] px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2
                  ${isSent 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10'
                  }
                  disabled:opacity-70 disabled:cursor-not-allowed
                `}
              >
                <AnimatePresence mode="wait">
                  {isSending ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating Secure Link...</span>
                    </motion.div>
                  ) : isSent ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Sent Successfully</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send to {lead.email || 'Patient'}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
