import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Send, CheckCircle, RefreshCw, Shield, MessageCircle, AlertCircle } from 'lucide-react';
import { supabase, ConsultationRequest } from '../../lib/supabase';
import { useDashboardStore } from '../../store/useDashboardStore';

const INDUSTRY_TEMPLATES = {
    Dental: {
        friendly: "Dear {PatientName}, it was a true pleasure meeting you today to discuss your smile transformation. I've prepared a bespoke plan to bring back your confident smile. We use the most advanced, gentle techniques to ensure your journey is as comfortable as it is transformative.",
        professional: "Dear {PatientName}, thank you for visiting us today. Based on our clinical assessment, I have finalized your bespoke dental treatment proposal. This plan is designed to deliver optimal long-term outcomes while prioritizing your unique dental health needs."
    },
    Aesthetic: {
        friendly: "Dear {PatientName}, we are excited to help you achieve your skin goals at {ClinicName}! I've designed a specialized plan tailored just for you to enhance your natural beauty. We can't wait to see your radiant results.",
        professional: "Dear {PatientName}, thank you for your consultation today. I have prepared a comprehensive aesthetic treatment plan tailored specifically to your unique skin profile and desired outcomes. Please review the clinical details below."
    },
    Wellness: {
        friendly: "Dear {PatientName}, it was wonderful connecting with you today. I've designed a specialized wellness plan to support your holistic journey. We are dedicated to helping you find balance, rejuvenation, and optimal vitality.",
        professional: "Dear {PatientName}, following our consultation, I have developed a bespoke wellness protocol. This comprehensive plan is meticulously designed to optimize your health outcomes and overall well-being. Please find the proposed intervention below."
    }
};

interface MessageTemplate {
  title: string;
  body: string;
}

interface TreatmentTemplate {
  id: string;
  name: string;
  price: number;
  emailContents?: string;
  beforeImg?: string;
  afterImg?: string;
  bookingUrl?: string;
  messageTemplates?: MessageTemplate[];
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
  const { clinicType } = useDashboardStore();
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [overridePrice, setOverridePrice] = useState<string>('');
  const [personalizedNote, setPersonalizedNote] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen && lead) {
       setOverridePrice(String(lead.potential_value || ''));
       
       const matchedTemplate = lead.treatment_name ? templates.find(t => t.name === lead.treatment_name) : null;
       setSelectedTemplateId(matchedTemplate?.id || '');

       const firstName = lead.name?.split(' ')[0] || "Patient";
       const treatmentName = matchedTemplate?.name || lead.service || "Treatment";

       // Auto-populate with default matching template if empty
       let noteToSet = lead.pt_personalized_note || matchedTemplate?.emailContents || INDUSTRY_TEMPLATES[clinicType].friendly;
       
       // ALWAYS replace placeholders dynamically BEFORE doctor sees it
       if (noteToSet.includes('{PatientName}') || noteToSet.includes('{ClinicName}') || noteToSet.includes('{TreatmentName}')) {
           noteToSet = noteToSet
               .replace(/{PatientName}/g, firstName)
               .replace(/{ClinicName}/g, clinicName)
               .replace(/{TreatmentName}/g, treatmentName);
       }
       
       setPersonalizedNote(noteToSet);
       setErrorMsg(null);
    }
  }, [isOpen, lead, templates, clinicName, clinicType]);

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
      .replace(/{PatientName}/g, patientName)
      .replace(/{ClinicName}/g, clinicName)
      .replace(/{TreatmentName}/g, treatmentName);
      
    setPersonalizedNote(processedText);
  };

  const handleTemplateChange = (id: string) => {
    setSelectedTemplateId(id);
    const template = templates.find(t => t.id === id);
    if (template) {
      setOverridePrice(String(template.price));
      
      // Auto-populate Email Contents if available
      const textToProcess = template.emailContents || INDUSTRY_TEMPLATES[clinicType].friendly;
      const { patientName, treatmentName } = getProcessingNames();
      
      const processedText = textToProcess
        .replace(/{PatientName}/g, patientName)
        .replace(/{ClinicName}/g, clinicName)
        .replace(/{TreatmentName}/g, treatmentName);
        
      setPersonalizedNote(processedText);
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
        setErrorMsg(null);
        if (!lead?.email) {
          setErrorMsg("Patient email address is missing.");
          setIsSending(false);
          return;
        }

        // Call the real Supabase Edge Function for sending emails
        const { error, data } = await supabase.functions.invoke('send-pt-v2', {
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

        if (error || (data && data.error)) {
          console.error("Failed to send email via edge function:", error || data.error);
          setErrorMsg("Email failed to send. Please check your API configuration.");
          setIsSending(false);
          return;
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
      setErrorMsg("Email failed to send. Please check your API configuration.");
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

          {/* Error Banner */}
          {errorMsg && (
            <div className="px-10 py-4 bg-red-50 border-b border-red-100 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-[13px] font-bold text-red-600">{errorMsg}</p>
            </div>
          )}

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
                          onClick={() => applyTemplate(INDUSTRY_TEMPLATES[clinicType].friendly)}
                          className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-full px-3 py-1.5 text-[10px] font-bold transition-all active:scale-95 shadow-sm"
                       >
                          Friendly
                       </button>
                       <button 
                          onClick={() => applyTemplate(INDUSTRY_TEMPLATES[clinicType].professional)}
                          className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-full px-3 py-1.5 text-[10px] font-bold transition-all active:scale-95 shadow-sm"
                       >
                          Professional
                       </button>
                       
                       {/* Dynamic Treatment Templates */}
                       {templates.find(t => t.id === selectedTemplateId)?.messageTemplates?.map((tmpl, i) => {
                          return (
                             <button 
                                key={i}
                                onClick={() => applyTemplate(tmpl.body)}
                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full px-4 py-2 text-[10px] font-black transition-all active:scale-95 shadow-sm flex items-center gap-1.5"
                             >
                                <CheckCircle className="w-3.5 h-3.5" /> {tmpl.title}
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
