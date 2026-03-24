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
  clinicName = "Hanlan OC",
  onUpdateLead,
  templates = []
}) => {
  const { clinicType } = useDashboardStore();
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [overridePrice, setOverridePrice] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailTemplate, setEmailTemplate] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen && lead) {
       setOverridePrice(String(lead.potential_value || ''));
       
       const matchedTemplate = lead.treatment_name ? templates.find(t => t.name === lead.treatment_name) : null;
       setSelectedTemplateId(matchedTemplate?.id || '');

       const firstName = lead.name?.split(' ')[0] || "Patient";
       const treatmentName = matchedTemplate?.name || lead.service || "Treatment";

       // Initial Setup: Professional by default for luxury
       setEmailSubject(`Bespoke ${treatmentName} Clinical Proposal - ${clinicName}`);
       
       let initialNote = lead.pt_personalized_note || matchedTemplate?.emailContents || INDUSTRY_TEMPLATES[clinicType].professional;
       initialNote = initialNote
           .replace(/{PatientName}/g, firstName)
           .replace(/{ClinicName}/g, clinicName)
           .replace(/{TreatmentName}/g, treatmentName);
       
       setEmailTemplate(initialNote);
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

  const applyDualTemplate = (tone: 'friendly' | 'professional') => {
    const { patientName, treatmentName } = getProcessingNames();
    const ptLink = "{pt_link}"; // The backend will inject the real shortlink

    if (tone === 'friendly') {
        setEmailSubject(`Your Transformation Journey: Bespoke ${treatmentName} Proposal`);
        setEmailTemplate(`Hi ${patientName},\n\nIt was a true pleasure meeting you at the clinic today. I am so excited to help you start your ${treatmentName} journey. I've prepared a bespoke plan just for you to ensure you get the absolute best results.\n\nYou can securely review your clinical proposal and visual mapping right here: ${ptLink}\n\nI can't wait to see your results!\n\nWarmly,\n${clinicName}`);
    } else {
        setEmailSubject(`Clinical Proposal & Digital Protocol: ${treatmentName} - ${patientName}`);
        setEmailTemplate(`Dear ${patientName},\n\nThank you for choosing our clinic for your ${treatmentName} consultation. Based on our comprehensive clinical evaluation, I have finalized your bespoke protocol and digital proposal.\n\nThis plan is meticulously designed to deliver optimal outcomes while prioritizing your unique requirements. Please access your dedicated patient portal to review the secure details and proceed: ${ptLink}\n\nSincerely,\n${clinicName}`);
    }
  };

  const handleTemplateChange = (id: string) => {
    setSelectedTemplateId(id);
    const template = templates.find(t => t.id === id);
    if (template) {
      setOverridePrice(String(template.price));
      const { patientName, treatmentName } = getProcessingNames();
      setEmailSubject(`Your Bespoke ${treatmentName} Proposal - ${clinicName}`);
      
      const rawBody = template.emailContents || INDUSTRY_TEMPLATES[clinicType].professional;
      const processedBody = rawBody
        .replace(/{PatientName}/g, patientName)
        .replace(/{ClinicName}/g, clinicName)
        .replace(/{TreatmentName}/g, treatmentName);
      
      setEmailTemplate(processedBody);
    }
  };

  const handleWhatsAppSend = () => {
    if (!lead || !lead.phone) return;
    const { patientName, treatmentName } = getProcessingNames();
    const ptLink = `${window.location.origin}/pt/${lead.id.substring(0, 8)}`;
    const message = `Dear ${patientName}, your bespoke ${treatmentName} plan from ${clinicName} is ready. View your secure proposal here: ${ptLink}`;
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
        pt_personalized_note: emailTemplate,
        treatment_name: finalTreatmentName,
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

        const { error, data } = await supabase.functions.invoke('send-pt-v2', {
          body: {
            lead_id: lead?.id,
            name: lead?.name,
            email: lead?.email,
            subject: emailSubject,
            service: finalTreatmentName,
            origin: window.location.origin,
            clinic_name: clinicName,
            personalized_note: emailTemplate
          }
        });

        if (error || (data && data.error)) {
          setErrorMsg("Failed to dispatch clinical email. Please verify SMTP settings.");
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
      setErrorMsg("Terminal Connection Error. Retrying...");
      setIsSending(false);
    }
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
              <div className="p-3 bg-slate-900 rounded-2xl shadow-lg">
                <Send className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Clinical Dispatch Terminal</h3>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">Secure Patient Proposal V2</p>
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
              {templates && templates.length > 0 && (
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Target Clinical Protocol</label>
                  <select 
                    value={selectedTemplateId}
                    onChange={(e) => handleTemplateChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select Clinical Mapping...</option>
                    {templates.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({currency}{t.price.toLocaleString()})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex flex-col gap-6">
                 {/* Tone Engine [NO EMOJIS] */}
                 <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Atmospheric Selection</label>
                    <div className="flex gap-2">
                        <button onClick={() => applyDualTemplate('friendly')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-full px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm">Friendly</button>
                        <button onClick={() => applyDualTemplate('professional')} className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-slate-900/10">Professional</button>
                    </div>
                 </div>

                 {/* [OPTION 2] EMAIL SUBJECT Input */}
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">EMAIL SUBJECT</label>
                    <input 
                       type="text" 
                       value={emailSubject} 
                       onChange={(e) => setEmailSubject(e.target.value)} 
                       placeholder="Enter clinical subject line..."
                       className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-inner font-inter"
                    />
                 </div>

                 {/* [OPTION 2] EMAIL TEMPLATE Renamed Note Area */}
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">EMAIL TEMPLATE</label>
                    <textarea 
                       value={emailTemplate}
                       onChange={(e) => setEmailTemplate(e.target.value)}
                       placeholder="Compose bespoke patient copy..."
                       className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all h-64 resize-none shadow-inner font-inter leading-relaxed"
                    />
                 </div>
              </div>
             </div>
          </div>

          <div className="px-10 py-10 bg-slate-50 border-t border-slate-100">
             <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleWhatsAppSend}
                  disabled={!lead.phone || isSending}
                  className="py-5 bg-[#25D366] hover:bg-[#128C7E] disabled:opacity-50 text-white rounded-3xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/10 flex items-center justify-center gap-3"
                >
                  <MessageCircle className="w-4 h-4" /> Secure WhatsApp
                </button>
                <button
                  onClick={() => handleSend(true)}
                  disabled={isSending}
                  className="py-5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-3xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 relative overflow-hidden"
                >
                  {isSending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />} Dispatch Email
                  {isSent && <motion.div initial={{ x: -100 }} animate={{ x: 0 }} className="absolute inset-0 bg-emerald-500 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-white" /></motion.div>}
                </button>
             </div>
             
             <div className="flex items-center justify-center gap-2 mt-8 opacity-40">
                <Shield className="w-3 h-3" />
                <span className="text-[8px] font-black uppercase tracking-[0.4em]">AES-256 Clinical Encryption</span>
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
