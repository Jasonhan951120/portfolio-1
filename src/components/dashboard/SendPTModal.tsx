import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Send, CheckCircle, RefreshCw, Shield, MessageCircle } from 'lucide-react';
import { supabase, ConsultationRequest } from '../../lib/supabase';

interface TreatmentTemplate {
  id: string;
  name: string;
  price: number;
  description?: string;
  afterImg?: string;
  bookingUrl?: string;
  messageTemplates?: string[];
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

  const QUICK_TEMPLATES = {
    standard: "Dear {PatientName}, it was a true pleasure welcoming you to {ClinicName} today. Thank you for trusting us with your care. Based on our conversation, I have crafted this bespoke {TreatmentName} plan specifically for you. Our primary focus is ensuring you feel supported and truly cared for at every step. We use modern, proven techniques tailored to your needs. Please review the details below and click 'Accept & Book' to secure your next appointment. We've reserved priority slots for you!",
    postScan: "Dear {PatientName}, following your high-precision scan at {ClinicName} today, I have finalized your bespoke {TreatmentName} proposal. This plan is designed to deliver optimal clinical outcomes while ensuring your journey is as comfortable as possible. We prioritize precision and your unique dental health needs. Please review your transformation plan below and secure your slot by clicking 'Accept & Book'.",
    aesthetic: "Dear {PatientName}, it was wonderful discussing your aesthetic goals at {ClinicName}. I've designed your {TreatmentName} transformation with a focus on natural beauty and long-term vitality. Our bespoke approach ensures your new smile perfectly complements your unique features for a radiant, confident result. Take a look at the proposed plan below and click 'Accept & Book' to begin your transformation journey.",
    priority: "Dear {PatientName}, thank you for visiting {ClinicName}. I have prioritized your {TreatmentName} plan to ensure we can begin your care as soon as possible. We have reserved a limited, priority surgery slot specifically for you to ensure a seamless experience. Please review the details and click 'Accept & Book' to confirm your appointment and lock in your priority status."
  };

  const getProcessingNames = () => {
    const template = templates.find(t => t.id === selectedTemplateId);
    return {
      patientName: lead?.name?.split(' ')[0] || "Patient",
      treatmentName: template?.name || lead?.service || "Treatment"
    };
  };

  const applyTemplate = (templateText: string) => {
    const { patientName, treatmentName } = getProcessingNames();
    
    let processedText = templateText
      .replace(/{PatientName}/g, lead?.name || "Patient")
      .replace(/{ClinicName}/g, clinicName)
      .replace(/{TreatmentName}/g, treatmentName);
      
    setPersonalizedNote(processedText);
  };

  const handleTemplateChange = (id: string) => {
    setSelectedTemplateId(id);
    const template = templates.find(t => t.id === id);
    if (template) {
      setOverridePrice(String(template.price));
      applyTemplate(QUICK_TEMPLATES.standard);
    }
  };

  const handleWhatsAppSend = () => {
    if (!lead || !lead.phone) return;
    
    const { patientName, treatmentName } = getProcessingNames();
    const ptLink = `${window.location.origin}/pt/${lead.id.substring(0, 8)}`;
    
    const message = `Dear ${patientName}, it was a pleasure meeting you today. Dr. Hanlan has finalized your bespoke ${treatmentName} plan. View your transformation and book your slot here: ${ptLink}`;
    
    const whatsappUrl = `https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    handleSend(false);
  };

  const handleSend = async (showSuccess = true) => {
    setIsSending(true);

    let finalTreatmentName = lead?.service || "Treatment";

    if (onUpdateLead && lead) {
      const template = templates.find(t => t.id === selectedTemplateId);
      finalTreatmentName = template?.name || lead.treatment_name || lead.service || "Treatment";
      onUpdateLead(lead.id, {
        potential_value: Number(overridePrice) || lead.potential_value,
        pt_price_override: Number(overridePrice) || lead.potential_value,
        pt_personalized_note: personalizedNote,
        treatment_name: finalTreatmentName,
        pt_before_image: template?.beforeImg,
        pt_after_image: template?.afterImg,
        pt_booking_url: template?.bookingUrl,
        status: "Proposal Sent"
      });
    }

    try {
      if (showSuccess) {
        // Call the real Supabase Edge Function for sending emails
        const { error } = await supabase.functions.invoke('send-pt-link', {
          body: {
            lead_id: lead?.id,
            name: lead?.name,
            email: lead?.email,
            service: finalTreatmentName,
            origin: window.location.origin,
            clinic_name: clinicName,
            personalized_note: personalizedNote
          }
        });

        if (error) {
          console.error("Failed to send email via edge function:", error);
          throw error;
        }

        setIsSending(false);
        setIsSent(true);
        setTimeout(() => {
          onClose();
          setTimeout(() => setIsSent(false), 500);
        }, 2000);
      } else {
        setIsSending(false);
      }
    } catch (err) {
      console.error("Error during email dispatch:", err);
      setIsSending(false);
    }
  };

  if (!isOpen || !lead) return null;

  const names = getProcessingNames();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl border border-slate-200 overflow-hidden"
        >
          {/* Header */}
          <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-900 rounded-2xl shadow-lg shadow-slate-200">
                <Send className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  {names.patientName}'s {names.treatmentName} Proposal
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Secure Proposal Terminal</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Settings Body */}
          <div className="px-10 py-10 space-y-8 max-h-[60vh] overflow-y-auto">
             <div className="space-y-6">
              {templates && templates.length > 0 && (
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Target Treatment Plan</label>
                  <div className="relative group">
                    <select 
                      value={selectedTemplateId}
                      onChange={(e) => handleTemplateChange(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select from Clinic Settings...</option>
                      {templates.map(t => (
                        <option key={t.id} value={t.id}>{t.name} ({currency}{t.price.toLocaleString()})</option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <RefreshCw className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              )}

              <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Investment Value</label>
                 <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">{currency}</span>
                    <input 
                       type="number" 
                       value={overridePrice}
                       onChange={(e) => setOverridePrice(e.target.value)}
                       className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 pl-12 pr-5 text-lg font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    />
                 </div>
              </div>

              <div>                 <div className="flex flex-col gap-3 mb-3">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Doctor's Personalized note</label>
                    <div className="flex flex-wrap gap-2 text-wrap">
                       {/* Default Quick Templates */}
                       <button 
                          onClick={() => applyTemplate(QUICK_TEMPLATES.standard)}
                          className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-full px-3 py-1.5 text-[10px] font-bold transition-all active:scale-95 shadow-sm"
                       >
                          Standard
                       </button>
                       
                       {/* Dynamic Treatment Templates */}
                       {templates.find(t => t.id === selectedTemplateId)?.messageTemplates?.map((tmpl, i) => {
                          const label = tmpl.length > 20 ? tmpl.substring(0, 20) + "..." : tmpl;
                          return (
                             <button 
                                key={i}
                                onClick={() => applyTemplate(tmpl)}
                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1.5 text-[10px] font-black transition-all active:scale-95 shadow-sm flex items-center gap-1.5"
                             >
                                <CheckCircle className="w-3 h-3" /> {label}
                             </button>
                          );
                       })}
                    </div>
                 </div>

                 <textarea 
                    value={personalizedNote}
                    onChange={(e) => setPersonalizedNote(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all h-44 resize-none shadow-inner"
                    placeholder="Refined your veneers plan based on today's scan..."
                 />
              </div>
             </div>
          </div>

          {/* Delivery Actions */}
          <div className="px-10 py-10 bg-slate-50 border-t border-slate-100 space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleWhatsAppSend}
                  disabled={!lead.phone || isSending}
                  className="py-5 bg-[#25D366] hover:bg-[#128C7E] disabled:opacity-50 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </button>
                <button
                  onClick={() => handleSend(true)}
                  disabled={isSending}
                  className="py-5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3 active:scale-95"
                >
                  {isSending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />} Email
                </button>
             </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Secure End-to-End Delivery</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
