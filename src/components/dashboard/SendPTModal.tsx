import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Send, CheckCircle, RefreshCw, Shield } from 'lucide-react';
import { ConsultationRequest } from '../../lib/supabase';

interface TreatmentTemplate {
  id: string;
  name: string;
  price: number;
  description?: string;
  beforeImg?: string;
  afterImg?: string;
  bookingUrl?: string;
}

interface SendPTModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: ConsultationRequest | null;
  currency?: string;
  clinicName?: string;
  onUpdateLead?: (id: string, updates: Partial<ConsultationRequest>) => void;
  templates?: TreatmentTemplate[];
}

export const SendPTModal: React.FC<SendPTModalProps> = ({
  isOpen,
  onClose,
  lead,
  currency = '£',
  clinicName = "Hanlan OC Dental Clinic",
  onUpdateLead,
  templates = []
}) => {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [overridePrice, setOverridePrice] = useState<string>('');
  const [personalizedNote, setPersonalizedNote] = useState<string>('');

  React.useEffect(() => {
    if (isOpen && lead) {
       setOverridePrice(String(lead.potential_value || ''));
       setPersonalizedNote(lead.pt_personalized_note || '');
       setSelectedTemplateId(lead.treatment_name ? (templates.find(t => t.name === lead.treatment_name)?.id || '') : '');
    }
  }, [isOpen, lead, templates]);

  const handleTemplateChange = (id: string) => {
    setSelectedTemplateId(id);
    const template = templates.find(t => t.id === id);
    if (template) {
      setOverridePrice(String(template.price));
      // If we have a master description, pre-fill it as a starting point for personalization
      if (template.description) {
        setPersonalizedNote(template.description);
      }
    }
  };

  const handleSend = () => {
    setIsSending(true);

    if (onUpdateLead && lead) {
      const template = templates.find(t => t.id === selectedTemplateId);
      onUpdateLead(lead.id, {
        potential_value: Number(overridePrice) || lead.potential_value,
        pt_price_override: Number(overridePrice) || lead.potential_value,
        pt_personalized_note: personalizedNote,
        // We link the lead to the master template name if changed
        treatment_name: template?.name || lead.treatment_name,
        // We also store the specific visuals if the template has them
        pt_before_image: template?.beforeImg,
        pt_after_image: template?.afterImg,
        pt_booking_url: template?.bookingUrl
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
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900 rounded-xl">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Professional PT Proposal</h3>
                <p className="text-xs text-slate-500 font-medium">Personalize and send treatment plan</p>
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
          <div className="px-8 py-10 space-y-8">
            <div className="space-y-6">
              {/* Template Selector (Smart Link) */}
              {templates && templates.length > 0 && (
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Linked Treatment Template</label>
                  <div className="relative group">
                    <select 
                      value={selectedTemplateId}
                      onChange={(e) => handleTemplateChange(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select a treatment template...</option>
                      {templates.map(t => (
                        <option key={t.id} value={t.id}>{t.name} ({currency}{t.price.toLocaleString()})</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-slate-600 transition-colors">
                      <RefreshCw className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6">
                <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Final Proposal Price</label>
                   <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{currency}</span>
                      <input 
                         type="number" 
                         value={overridePrice}
                         onChange={(e) => setOverridePrice(e.target.value)}
                         className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-10 pr-4 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                         placeholder="e.g. 5000"
                      />
                   </div>
                </div>
              </div>

              <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Personalized Message</label>
                 <textarea 
                    value={personalizedNote}
                    onChange={(e) => setPersonalizedNote(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm resize-none h-32"
                    placeholder="e.g. Great seeing you today! Here is your Smiles transformation plan..."
                 />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-8 py-8 bg-slate-50/80 border-t border-slate-100 flex flex-col gap-4">
            <button
              onClick={handleSend}
              disabled={isSending || isSent}
              className={`w-full py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl
                ${isSent 
                  ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/10'
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
                    <span>Processing Proposal...</span>
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
                    <span>Send Proposal to {lead.email || 'Email'}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2 text-slate-400">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Secure PT Link</span>
              </div>
              <button
                disabled={isSending || isSent}
                onClick={onClose}
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
